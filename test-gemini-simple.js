import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = process.env.GOOGLE_GENERATIVE_AI_API_KEY || 'your-google-api-key-here';

async function testGemini() {
  console.log('🧪 Testing Gemini API with key:', API_KEY.substring(0, 20) + '...\n');
  
  const genAI = new GoogleGenerativeAI(API_KEY);
  
  const models = [
    'gemini-2.5-flash',
    'gemini-2.0-flash',
    'gemini-2.5-pro',
    'gemini-1.5-flash'
  ];
  
  for (const modelName of models) {
    try {
      console.log(`Testing ${modelName}...`);
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent('Say hello in one word');
      const response = result.response;
      const text = response.text();
      
      console.log(`✅ ${modelName} WORKS!`);
      console.log(`Response: ${text}\n`);
      return true;
    } catch (error) {
      console.log(`❌ ${modelName} failed: ${error.message.substring(0, 50)}...\n`);
    }
  }
  
  console.log('❌ All models failed');
  return false;
}

testGemini().catch(console.error);
