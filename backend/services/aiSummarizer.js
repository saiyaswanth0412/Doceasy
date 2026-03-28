import fetch from 'node-fetch';

const BASETEN_API_KEY = 'K00OULIq.j6MPwjz7yRv9cszvnwZ0AEF2kIIPPFGo';
const BASETEN_BASE_URL = 'https://inference.baseten.co/v1';
const MODEL = 'deepseek-ai/DeepSeek-V3.1';

export const summarizePatientHealth = async (consultationData) => {
  try {
    const prompt = `
You are a medical assistant. Analyze the following patient consultation data and provide a concise health summary for the doctor.

Patient Information:
- Age: ${consultationData.age}
- Gender: ${consultationData.gender}
- Medical History: ${consultationData.medicalHistory || 'Not provided'}
- Current Medications: ${consultationData.currentMedications || 'None reported'}

Symptoms:
${consultationData.symptoms}

Problem Duration: ${consultationData.duration}

Patient's Problem Summary:
${consultationData.problemSummary}

Please provide:
1. Key Health Concerns (2-3 lines)
2. Risk Factors (if any)
3. Recommended Doctor Actions (3-4 bullet points)
4. Questions for Patient (2-3 key questions)

Keep it concise and actionable for the doctor.`;

    const response = await fetch(`${BASETEN_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${BASETEN_API_KEY}`,
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
        max_tokens: 500,
        temperature: 0.7,
        top_p: 0.95,
      }),
    });

    if (!response.ok) {
      console.error('AI API Error:', response.status, response.statusText);
      throw new Error(`AI API Error: ${response.statusText}`);
    }

    const data = await response.json();
    
    if (data.choices && data.choices[0] && data.choices[0].message) {
      return {
        success: true,
        summary: data.choices[0].message.content,
      };
    } else {
      throw new Error('Unexpected AI response format');
    }
  } catch (error) {
    console.error('Error calling AI Summarizer:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};
