import axios from 'axios';

const HF_TOKEN = process.env.HUGGINGFACE_API_KEY || 'your-huggingface-token-here';

async function testHuggingFace() {
  console.log('Testing Hugging Face API...');
  console.log('Token:', HF_TOKEN.substring(0, 10) + '...');
  
  // Test with different models
  const models = [
    'mistralai/Mistral-7B-Instruct-v0.2',
    'meta-llama/Llama-2-7b-chat-hf',
    'google/flan-t5-large',
    'microsoft/DialoGPT-large'
  ];
  
  for (const model of models) {
    try {
      console.log(`\nTrying model: ${model}`);
      
      const response = await axios.post(
        `https://api-inference.huggingface.co/models/${model}`,
        {
          inputs: "You are a professional interviewer. Say 'Hello! How are you today?' and nothing else.",
          parameters: {
            max_new_tokens: 50,
            temperature: 0.7
          }
        },
        {
          headers: {
            'Authorization': `Bearer ${HF_TOKEN}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      console.log('✅ SUCCESS!');
      console.log('Response:', response.data);
      console.log(`✅ Token works with model: ${model}`);
      return { success: true, model, response: response.data };
      
    } catch (error) {
      if (error.response) {
        console.log(`❌ Failed: ${error.response.status} - ${error.response.data?.error || error.response.statusText}`);
      } else {
        console.log(`❌ Failed: ${error.message}`);
      }
    }
  }
  
  console.log('\n❌ No working models found');
  return { success: false };
}

testHuggingFace().then(result => {
  if (result.success) {
    console.log('\n✅ HUGGING FACE TOKEN IS WORKING!');
    console.log('Ready to integrate into your app!');
  } else {
    console.log('\n❌ Token has issues. Try:');
    console.log('1. Check token permissions at https://huggingface.co/settings/tokens');
    console.log('2. Generate a new token');
    console.log('3. Wait a few minutes for token to activate');
  }
});