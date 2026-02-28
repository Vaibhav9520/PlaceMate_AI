import fetch from 'node-fetch';

const API_KEY = process.env.GOOGLE_GENERATIVE_AI_API_KEY || 'your-google-api-key-here';

async function listModels() {
  console.log('Checking available Gemini models...\n');
  
  const url = `https://generativelanguage.googleapis.com/v1/models?key=${API_KEY}`;
  
  try {
    const response = await fetch(url);
    const data = await response.json();
    
    if (response.ok && data.models) {
      console.log('✅ Available models:\n');
      data.models.forEach(model => {
        console.log(`- ${model.name}`);
        console.log(`  Display Name: ${model.displayName}`);
        console.log(`  Supported: ${model.supportedGenerationMethods?.join(', ')}\n`);
      });
      
      // Test with first available model
      const firstModel = data.models.find(m => 
        m.supportedGenerationMethods?.includes('generateContent')
      );
      
      if (firstModel) {
        console.log(`\nTesting with: ${firstModel.name}\n`);
        await testModel(firstModel.name);
      }
    } else {
      console.log('❌ Error:', data.error?.message || 'Unknown error');
    }
  } catch (error) {
    console.log('❌ Error:', error.message);
  }
}

async function testModel(modelName) {
  const url = `https://generativelanguage.googleapis.com/v1/${modelName}:generateContent?key=${API_KEY}`;
  
  const requestBody = {
    contents: [{
      parts: [{
        text: 'Say "API is working!" and nothing else.'
      }]
    }]
  };
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody)
    });
    
    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ SUCCESS!');
      console.log('Response:', data.candidates[0].content.parts[0].text);
      console.log('\n========================================');
      console.log('✅ YOUR API KEY IS WORKING FINE!');
      console.log(`✅ Use model: ${modelName}`);
      console.log('========================================');
    } else {
      console.log('❌ Test failed:', data.error?.message);
    }
  } catch (error) {
    console.log('❌ Error:', error.message);
  }
}

listModels();