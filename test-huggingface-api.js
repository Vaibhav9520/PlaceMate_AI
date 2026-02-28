import fetch from 'node-fetch';

const HF_TOKEN = process.env.HUGGINGFACE_API_KEY || 'your-huggingface-token-here';

async function testHuggingFaceAPI() {
  console.log('========================================');
  console.log('Testing Hugging Face API');
  console.log('========================================');
  console.log('Token:', HF_TOKEN.substring(0, 10) + '...\n');
  
  // Test with a good conversational model
  const models = [
    'mistralai/Mistral-7B-Instruct-v0.2',
    'meta-llama/Llama-2-7b-chat-hf',
    'microsoft/DialoGPT-large',
    'facebook/blenderbot-400M-distill'
  ];
  
  for (const model of models) {
    console.log(`\nTesting model: ${model}`);
    
    const url = `https://router.huggingface.co/models/${model}`;
    
    const requestBody = {
      inputs: 'You are an interviewer. Say "Hello! How are you today?" and nothing else.',
      parameters: {
        max_new_tokens: 50,
        temperature: 0.7
      }
    };
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${HF_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });
      
      const data = await response.json();
      
      if (response.ok) {
        console.log('✅ SUCCESS!');
        console.log('Response:', JSON.stringify(data, null, 2));
        console.log('\n========================================');
        console.log('✅ YOUR HUGGING FACE TOKEN IS WORKING!');
        console.log(`✅ Best model: ${model}`);
        console.log('========================================');
        return { working: true, model };
      } else {
        console.log('❌ Failed:', data.error || 'Unknown error');
      }
    } catch (error) {
      console.log('❌ Error:', error.message);
    }
  }
  
  console.log('\n❌ No working models found');
  return { working: false };
}

testHuggingFaceAPI();