import axios from 'axios';
import chatbotFallback from '../utils/chatbotFallback.js';
import doctorModel from '../models/doctorModel.js';

function buildSystemPrompt(doctors) {
  const doctorList = doctors.map(d => `- ${d.name} (${d.speciality}, $${d.fees})`).join('\n');
  const specialities = [...new Set(doctors.map(d => d.speciality))].join(', ');
  const todayDate = new Date();
  const today = todayDate.toISOString().split('T')[0];

  return `You are Doceasy, a medical appointment booking assistant. Today is ${today}.

Available doctors:
${doctorList}

Available specialities: ${specialities}
Available time slots: 09:00, 10:00, 11:00, 14:00, 15:00, 16:00, 17:00

Your job: collect specialization, preferred doctor (or "any"), date (YYYY-MM-DD), and time (HH:MM).

CRITICAL - Date/Time Parsing Rules:
- Parse ANY date format user provides (4-18-2026, 2026-12-4, April 18, tomorrow, next week, etc.) and convert to YYYY-MM-DD
- Parse ANY time format (2pm, 14:00, 2, afternoon, morning, etc.) and convert to HH:MM (00:00-23:59)
- If "tomorrow" → calculate as ${new Date(todayDate.getTime() + 86400000).toISOString().split('T')[0]}
- Map times: "morning"→09:00, "afternoon"→14:00, "evening"→17:00
- Map time values: "2" or "2pm"→14:00, "9" or "9am"→09:00

Other Rules:
- ONLY use specialities from the list above. If user asks for something not listed, tell them it's not available.
- For doctorName, use EXACT doctor name from list or "any".
- If user says "any" for time, pick 09:00.
- Once you have ALL four fields (specialization, doctor, date, time), output booking immediately.
- Be conversational but brief (1-2 sentences).

When all details are collected, respond with:
[APPOINTMENT_READY]
{"specialization":"exact speciality","doctorName":"exact name or any","slotDate":"YYYY-MM-DD","slotTime":"HH:MM"}
[END_APPOINTMENT]`;
}

// Build chat messages array from history (OpenAI-compatible format for Baseten)
function buildChatMessages(systemPrompt, history, currentMessage) {
  const messages = [{ role: 'system', content: systemPrompt }];

  if (Array.isArray(history)) {
    for (const msg of history) {
      if (msg.type === 'user') {
        messages.push({ role: 'user', content: msg.text });
      } else if (msg.type === 'bot') {
        messages.push({ role: 'assistant', content: msg.text });
      }
    }
  }

  messages.push({ role: 'user', content: currentMessage });
  return messages;
}

// Build Gemini multi-turn contents array
function buildGeminiContents(systemPrompt, history, currentMessage) {
  const contents = [];
  contents.push({ role: 'user', parts: [{ text: systemPrompt }] });
  contents.push({ role: 'model', parts: [{ text: 'Understood. I am Doceasy, ready to help book appointments.' }] });

  if (Array.isArray(history)) {
    for (const msg of history) {
      if (msg.type === 'user') {
        contents.push({ role: 'user', parts: [{ text: msg.text }] });
      } else if (msg.type === 'bot') {
        contents.push({ role: 'model', parts: [{ text: msg.text }] });
      }
    }
  }

  contents.push({ role: 'user', parts: [{ text: currentMessage }] });
  return contents;
}

// Try Gemini API
async function callGemini(systemPrompt, history, currentMessage) {
  const geminiApiKey = process.env.GEMINI_API_KEY;
  if (!geminiApiKey) return null;

  const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent`;
  const contents = buildGeminiContents(systemPrompt, history, currentMessage);

  const response = await axios.post(
    `${geminiUrl}?key=${geminiApiKey}`,
    { contents, generationConfig: { temperature: 0.7, maxOutputTokens: 512 } },
    { headers: { 'Content-Type': 'application/json' }, timeout: 30000 }
  );

  const text = response.data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error('Empty Gemini response');
  return text;
}

// Try Baseten/DeepSeek API
async function callBaseten(systemPrompt, history, currentMessage) {
  const basetenKey = process.env.BASETEN_API_KEY;
  if (!basetenKey) return null;

  const messages = buildChatMessages(systemPrompt, history, currentMessage);

  const response = await fetch('https://inference.baseten.co/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${basetenKey}`,
    },
    body: JSON.stringify({
      model: 'deepseek-ai/DeepSeek-V3.1',
      messages,
      max_tokens: 512,
      temperature: 0.7,
    }),
  });

  if (!response.ok) throw new Error(`Baseten API error: ${response.status}`);
  const data = await response.json();
  const text = data.choices?.[0]?.message?.content;
  if (!text) throw new Error('Empty Baseten response');
  return text;
}

// Parse booking data from bot reply
function parseBookingData(text) {
  let botMessage = text;
  let bookingData = null;

  const match = botMessage.match(/\[APPOINTMENT_READY\]([\s\S]*?)\[END_APPOINTMENT\]/);
  if (match) {
    try {
      bookingData = JSON.parse(match[1].trim());
      botMessage = botMessage.replace(/\[APPOINTMENT_READY\][\s\S]*?\[END_APPOINTMENT\]/, '').trim();
      if (!botMessage) botMessage = 'Great! I have all the details. Let me book that for you.';
    } catch (e) {
      console.error('Error parsing booking JSON:', e.message);
    }
  }

  return { botMessage, bookingData };
}

export const sendMessage = async (req, res) => {
  try {
    const { message, history } = req.body;

    if (!message || message.trim() === '') {
      return res.status(400).json({ success: false, message: 'Message cannot be empty' });
    }

    // Fetch available doctors for the system prompt
    const doctors = await doctorModel.find({ available: true }).select('name speciality fees');
    const systemPrompt = buildSystemPrompt(doctors);

    // Try Gemini first, fall back to Baseten
    let replyText = null;

    try {
      replyText = await callGemini(systemPrompt, history, message);
    } catch (geminiErr) {
      console.error('Gemini failed:', geminiErr.message);
    }

    if (!replyText) {
      try {
        replyText = await callBaseten(systemPrompt, history, message);
      } catch (basetenErr) {
        console.error('Baseten failed:', basetenErr.message);
      }
    }

    if (!replyText) {
      return res.json(chatbotFallback.formatResponse(message));
    }

    const { botMessage, bookingData } = parseBookingData(replyText);
    res.json({ success: true, reply: botMessage, bookingData, timestamp: new Date() });
  } catch (error) {
    console.error('Chatbot error:', error.message);
    const { message } = req.body;
    return res.json(chatbotFallback.formatResponse(message));
  }
};
