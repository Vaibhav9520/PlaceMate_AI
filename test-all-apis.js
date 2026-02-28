import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config({ path: './server/.env' });

console.log('========================================');
console.log('Testing All APIs');
console.log('========================================\n');

// Test 1: Gemini API
console.log('[1/3] Testing Gemini API...');
const geminiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
console.log('API Key:', geminiKey ? geminiKey.substring(0, 10) + '...' : 'NOT FOUND');

if (geminiKey) {
  try {
    const genAI = new GoogleGenerativeAI(geminiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    
    const result = await model.generateContent('Say "Hello, Gemini API is working!"');
    const response = await result.response;
    const text = response.text();
    
    console.log('✅ Gemini API Response:', text.substring(0, 50) + '...');
    console.log('✅ Gemini API is working!\n');
  } catch (error) {
    console.log('❌ Gemini API Error:', error.message);
    console.log('⚠️  Fallback methods will be used\n');
  }
} else {
  console.log('❌ Gemini API Key not found in .env\n');
}

// Test 2: VAPI Token
console.log('[2/3] Testing VAPI Configuration...');
const vapiToken = process.env.VAPI_WEB_TOKEN;
console.log('VAPI Token:', vapiToken ? vapiToken.substring(0, 10) + '...' : 'NOT FOUND');

if (vapiToken) {
  console.log('✅ VAPI Token is configured');
  console.log('Token length:', vapiToken.length);
  console.log('Expected format: UUID (36 characters with dashes)');
  
  if (vapiToken.length === 36 && vapiToken.includes('-')) {
    console.log('✅ VAPI Token format looks correct\n');
  } else {
    console.log('⚠️  VAPI Token format may be incorrect\n');
  }
} else {
  console.log('❌ VAPI Token not found in .env\n');
}

// Test 3: Server Health
console.log('[3/3] Testing Server Connection...');
try {
  const response = await axios.get('http://localhost:5000/api/health');
  console.log('✅ Server is running');
  console.log('Response:', response.data);
} catch (error) {
  if (error.code === 'ECONNREFUSED') {
    console.log('❌ Server is not running');
    console.log('Please start the server: cd server && npm run dev');
  } else {
    console.log('❌ Server error:', error.message);
  }
}

console.log('\n========================================');
console.log('Test Summary');
console.log('========================================');
console.log('Gemini API:', geminiKey ? '✅ Configured' : '❌ Missing');
console.log('VAPI Token:', vapiToken ? '✅ Configured' : '❌ Missing');
console.log('Server:', 'Check output above');
console.log('========================================\n');

console.log('Next Steps:');
console.log('1. Ensure server is running: cd server && npm run dev');
console.log('2. Ensure client is running: cd client && npm run dev');
console.log('3. Test VAPI by starting an interview');
console.log('4. Test Gemini by generating questions or feedback');
