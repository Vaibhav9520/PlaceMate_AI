import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const API_KEY = process.env.GOOGLE_GENERATIVE_AI_API_KEY;

async function testGemini() {
  console.log('🧪 Testing Gemini API');
  console.log('API Key:', API_KEY ? API_KEY.substring(0, 20) + '...' : 'NOT FOUND');
  console.log('');
  
  if (!API_KEY) {
    console.log('❌ No API key found in .env file');
    return;
  }
  
  const genAI = new GoogleGenerativeAI(API_KEY);
  
  const models = [
    'gemini-1.5-flash',
    'gemini-1.5-pro',
    'gemini-pro',
    'gemini-1.0-pro'
  ];
  
  for (const modelName of models) {
    try {
      console.log(`Testing ${modelName}...`);
      const model = genAI.getGenerativeModel({ 
        model: modelName,
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 100,
        }
      });
      
      const result = await model.generateContent('Say hello');
      const response = result.response;
      const text = response.text();
      
      console.log(`✅ ${modelName} WORKS!`);
      console.log(`Response: ${text}`);
      console.log('');
      return modelName;
    } catch (error) {
      console.log(`❌ ${modelName} failed`);
      console.log(`Error: ${error.message}`);
      if (error.response) {
        console.log(`Status: ${error.response.status}`);
        console.log(`Details:`, error.response.data);
      }
      console.log('');
    }
  }
  
  console.log('❌ All models failed');
  console.log('');
  console.log('Possible reasons:');
  console.log('1. API key has expired or is invalid');
  console.log('2. API quota exceeded');
  console.log('3. Billing not enabled on Google Cloud project');
  console.log('4. API key restrictions preventing access');
  
  return null;
}

testGemini()
  .then(workingModel => {
    if (workingModel) {
      console.log(`✅ SUCCESS! Use this model: ${workingModel}`);
    } else {
      console.log('❌ No working models. Please check your API key.');
    }
    process.exit(0);
  })
  .catch(err => {
    console.error('Fatal error:', err);
    process.exit(1);
  });
