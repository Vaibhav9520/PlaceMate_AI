import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = process.env.GOOGLE_GENERATIVE_AI_API_KEY || 'your-google-api-key-here';

async function testGemini() {
  console.log('Testing Gemini API...\n');
  
  const genAI = new GoogleGenerativeAI(API_KEY);
  
  const models = [
    'gemini-2.0-flash-exp',
    'gemini-1.5-flash',
    'gemini-1.5-pro',
    'gemini-pro'
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
      
      const result = await model.generateContent('Say hello in 3 words');
      const response = result.response;
      const text = response.text();
      
      console.log(`✅ ${modelName} WORKS!`);
      console.log(`Response: ${text}\n`);
      return modelName;
    } catch (error) {
      console.log(`❌ ${modelName} failed: ${error.message}\n`);
    }
  }
  
  console.log('❌ All models failed');
  return null;
}

testGemini()
  .then(workingModel => {
    if (workingModel) {
      console.log(`\n✅ Use this model: ${workingModel}`);
    } else {
      console.log('\n❌ No working models found. API key may have quota issues.');
    }
  })
  .catch(err => console.error('Error:', err));
