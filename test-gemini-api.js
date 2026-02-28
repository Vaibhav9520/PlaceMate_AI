import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = process.env.GOOGLE_GENERATIVE_AI_API_KEY || 'your-google-api-key-here';

async function testGeminiAPI() {
  console.log('Testing Gemini API...');
  console.log('API Key:', API_KEY.substring(0, 20) + '...');
  
  try {
    const genAI = new GoogleGenerativeAI(API_KEY);
    
    // First, let's list available models
    console.log('Checking available models...');
    
    const models = ['gemini-1.5-flash', 'gemini-1.5-pro', 'gemini-pro', 'gemini-1.0-pro'];
    
    for (const modelName of models) {
      try {
        console.log(`\nTrying model: ${modelName}`);
        const model = genAI.getGenerativeModel({ model: modelName });
        
        const prompt = 'Say "Hello! This model works!" and nothing else.';
        
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        
        console.log(`✅ SUCCESS with ${modelName}!`);
        console.log('Response:', text);
        console.log(`✅ API key is working with model: ${modelName}`);
        return; // Exit on first success
        
      } catch (error) {
        console.log(`❌ ${modelName} failed:`, error.message.split(':')[0]);
      }
    }
    
    console.log('❌ No working models found');
    
  } catch (error) {
    console.log('❌ GENERAL ERROR!');
    console.log('Error message:', error.message);
  }
}

testGeminiAPI();