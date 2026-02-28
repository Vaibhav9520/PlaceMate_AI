import fetch from 'node-fetch';

const API_KEY = process.env.GOOGLE_GENERATIVE_AI_API_KEY || 'your-google-api-key-here';

async function testGeminiAPI() {
  console.log('========================================');
  console.log('Testing Gemini API (Direct REST API)');
  console.log('========================================');
  console.log('API Key:', API_KEY.substring(0, 20) + '...\n');
  
  // Test with v1 API (stable version)
  const url = `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${API_KEY}`;
  
  const requestBody = {
    contents: [{
      parts: [{
        text: 'Say "Hello! Gemini API is working!" and nothing else.'
      }]
    }]
  };
  
  try {
    console.log('Sending request to Gemini API...');
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    });
    
    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ SUCCESS! API is working!\n');
      console.log('Response:', data.candidates[0].content.parts[0].text);
      console.log('\n========================================');
      console.log('✅ Your Gemini API key is WORKING FINE!');
      console.log('========================================');
      return true;
    } else {
      console.log('❌ API Error:\n');
      console.log('Status:', response.status);
      console.log('Error:', JSON.stringify(data, null, 2));
      
      if (data.error) {
        console.log('\n========================================');
        console.log('❌ API Key Issue:');
        console.log('Message:', data.error.message);
        console.log('Status:', data.error.status);
        
        if (data.error.message.includes('API key not valid')) {
          console.log('\n🔑 Your API key is INVALID or EXPIRED');
          console.log('Get new key: https://makersuite.google.com/app/apikey');
        } else if (data.error.message.includes('quota')) {
          console.log('\n📊 API quota exceeded');
        } else if (data.error.message.includes('disabled')) {
          console.log('\n🚫 API is disabled for this key');
          console.log('Enable it: https://console.cloud.google.com/apis/library/generativelanguage.googleapis.com');
        }
        console.log('========================================');
      }
      return false;
    }
  } catch (error) {
    console.log('❌ Network Error:\n');
    console.log('Error:', error.message);
    console.log('\n🌐 Check your internet connection');
    return false;
  }
}

testGeminiAPI();