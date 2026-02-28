import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env vars
dotenv.config({ path: path.join(__dirname, 'server/.env') });

console.log('🧪 Testing API Integrations...\n');

// Test Gemini API
async function testGemini() {
  console.log('1️⃣ Testing Gemini API...');
  console.log(`   API Key: ${process.env.GOOGLE_GENERATIVE_AI_API_KEY ? '✓ Found' : '✗ Missing'}`);
  
  if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
    console.log('   ❌ GOOGLE_GENERATIVE_AI_API_KEY not found in server/.env\n');
    return false;
  }

  try {
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });
    
    const prompt = 'Say "Hello, Gemini is working!" in exactly those words.';
    const result = await model.generateContent(prompt);
    const response = result.response.text();
    
    console.log(`   Response: ${response.substring(0, 100)}...`);
    console.log('   ✅ Gemini API is working!\n');
    return true;
  } catch (error) {
    console.log(`   ❌ Gemini API Error: ${error.message}`);
    console.log('   Check your API key at: https://makersuite.google.com/app/apikey\n');
    return false;
  }
}

// Test VAPI Token
async function testVAPI() {
  console.log('2️⃣ Testing VAPI Token...');
  console.log(`   Server Token: ${process.env.VAPI_WEB_TOKEN ? '✓ Found' : '✗ Missing'}`);
  
  if (!process.env.VAPI_WEB_TOKEN) {
    console.log('   ❌ VAPI_WEB_TOKEN not found in server/.env\n');
    return false;
  }

  // Check client .env
  const clientEnvPath = path.join(__dirname, 'client/.env');
  try {
    const fs = await import('fs');
    const clientEnv = fs.readFileSync(clientEnvPath, 'utf8');
    const hasVapiToken = clientEnv.includes('VITE_VAPI_WEB_TOKEN');
    
    console.log(`   Client Token: ${hasVapiToken ? '✓ Found' : '✗ Missing'}`);
    
    if (!hasVapiToken) {
      console.log('   ❌ VITE_VAPI_WEB_TOKEN not found in client/.env\n');
      return false;
    }
  } catch (error) {
    console.log('   ⚠️  Could not read client/.env\n');
  }

  console.log('   ✅ VAPI tokens configured!\n');
  console.log('   Note: VAPI requires actual voice call to fully test');
  console.log('   Test in browser: Start a voice interview\n');
  return true;
}

// Run tests
async function runTests() {
  console.log('========================================');
  console.log('API INTEGRATION TEST');
  console.log('========================================\n');

  const geminiOk = await testGemini();
  const vapiOk = await testVAPI();

  console.log('========================================');
  console.log('TEST RESULTS');
  console.log('========================================\n');

  console.log(`Gemini API: ${geminiOk ? '✅ Working' : '❌ Failed'}`);
  console.log(`VAPI Token: ${vapiOk ? '✅ Configured' : '❌ Missing'}\n`);

  if (geminiOk && vapiOk) {
    console.log('🎉 All APIs are configured correctly!\n');
    console.log('Next steps:');
    console.log('1. Generate coding questions: generate-questions.bat');
    console.log('2. Start server: restart-server-now.bat');
    console.log('3. Test voice interview in browser\n');
  } else {
    console.log('⚠️  Some APIs need configuration:\n');
    
    if (!geminiOk) {
      console.log('Gemini API:');
      console.log('1. Get API key: https://makersuite.google.com/app/apikey');
      console.log('2. Add to server/.env: GOOGLE_GENERATIVE_AI_API_KEY=your_key\n');
    }
    
    if (!vapiOk) {
      console.log('VAPI Token:');
      console.log('1. Get token: https://vapi.ai');
      console.log('2. Add to server/.env: VAPI_WEB_TOKEN=your_token');
      console.log('3. Add to client/.env: VITE_VAPI_WEB_TOKEN=your_token\n');
    }
  }

  process.exit(geminiOk && vapiOk ? 0 : 1);
}

runTests();
