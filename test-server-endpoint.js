import axios from 'axios';

async function testServerEndpoint() {
  console.log('Testing server AI endpoint...');
  
  try {
    const response = await axios.post('http://localhost:5000/api/interviews/ai-response', {
      prompt: 'You are an interviewer. Say "Hello! How are you today?" and nothing else.',
      conversationHistory: []
    });
    
    console.log('✅ Server endpoint working!');
    console.log('Response:', response.data);
    
  } catch (error) {
    console.log('❌ Server endpoint error:');
    if (error.code === 'ECONNREFUSED') {
      console.log('🔌 Server is not running. Start with: cd server && npm run dev');
    } else if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Data:', error.response.data);
    } else {
      console.log('Error:', error.message);
    }
  }
}

testServerEndpoint();