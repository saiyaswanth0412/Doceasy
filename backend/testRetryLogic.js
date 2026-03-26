import axios from 'axios';

// Test the retry logic directly
async function testRetryLogic() {
  const geminiApiKey = process.env.GEMINI_API_KEY;
  const message = 'derma';
  const model = 'gemini-2.5-flash';
  const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;

  const systemPrompt = `You are Appointy, a helpful medical appointment booking assistant. Your role is to help users book medical appointments and provide information about doctors and specialties.`;

  let response;
  let lastError;
  
  console.log('Starting retry test...\n');
  
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      console.log(`[Attempt ${attempt}] Sending request to Gemini API...`);
      
      response = await axios.post(
        `${geminiUrl}?key=${geminiApiKey}`,
        {
          contents: [
            {
              parts: [
                {
                  text: `${systemPrompt}\n\nUser: ${message}`
                }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.8,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024
          }
        },
        {
          headers: {
            'Content-Type': 'application/json'
          },
          timeout: 30000
        }
      );
      
      console.log(`✅ [Attempt ${attempt}] SUCCESS - Gemini API responded`);
      console.log('Response:', response.data.candidates[0].content.parts[0].text);
      break; // Success, exit loop
    } catch (error) {
      lastError = error;
      const errorStatus = error.response?.status || 'unknown';
      const errorMsg = error.message;
      
      console.log(`❌ [Attempt ${attempt}] ERROR - Status: ${errorStatus}, Message: ${errorMsg.substring(0, 80)}`);
      
      if (error.response?.status === 429 && attempt < 3) {
        const waitTime = (attempt * 1500);
        console.log(`   Rate limited (429). Waiting ${waitTime}ms before retry...\n`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
      } else if (attempt === 3) {
        console.error(`\n❌ Failed after 3 attempts. Last status: ${errorStatus}`);
        throw error;
      } else {
        console.log(`   Not a 429 error, throwing immediately`);
        throw error;
      }
    }
  }
  
  console.log('\n✅ Test completed successfully');
}

testRetryLogic().catch(error => {
  console.error('\n❌ Test failed:', error.response?.status || error.message);
  if (error.response?.data) {
    console.error('Error details:', JSON.stringify(error.response.data, null, 2));
  }
});
