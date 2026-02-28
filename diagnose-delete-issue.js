import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const API_URL = 'http://localhost:5000';

console.log('🔍 Diagnosing Delete Issue...\n');

// Test 1: Check if server is running
console.log('Test 1: Checking if server is running...');
try {
  const response = await axios.get(`${API_URL}/api/health`);
  console.log('✅ Server is running');
  console.log(`   Response: ${response.data.message}\n`);
} catch (error) {
  console.log('❌ Server is NOT running');
  console.log('   Please start the server with: cd server && npm run dev\n');
  process.exit(1);
}

// Test 2: Check delete endpoint (should return 401, not 404)
console.log('Test 2: Testing DELETE endpoint...');
try {
  await axios.delete(`${API_URL}/api/interviews/test-id-123`);
  console.log('❌ Unexpected success (should require authentication)\n');
} catch (error) {
  if (error.response) {
    if (error.response.status === 401) {
      console.log('✅ DELETE endpoint exists (returns 401 Unauthorized)');
      console.log('   This is CORRECT - route is registered!\n');
    } else if (error.response.status === 404) {
      console.log('❌ DELETE endpoint NOT FOUND (returns 404)');
      console.log('   This means the route is not registered');
      console.log('   SOLUTION: Restart the server completely\n');
    } else {
      console.log(`⚠️  Unexpected status: ${error.response.status}`);
      console.log(`   Message: ${error.response.data.message}\n`);
    }
  } else {
    console.log('❌ Network error:', error.message, '\n');
  }
}

// Test 3: Check other interview endpoints
console.log('Test 3: Testing other interview endpoints...');
try {
  await axios.get(`${API_URL}/api/interviews/user/test-user-id`);
} catch (error) {
  if (error.response) {
    if (error.response.status === 401) {
      console.log('✅ GET /api/interviews/user/:userId works (returns 401)\n');
    } else if (error.response.status === 404) {
      console.log('❌ GET endpoint also returns 404 - routes not loaded!\n');
    }
  }
}

// Test 4: Check database mode
console.log('Test 4: Checking database configuration...');
const envPath = path.join(__dirname, 'server', '.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  const useMongoMatch = envContent.match(/USE_MONGODB=(.+)/);
  if (useMongoMatch) {
    const useMongo = useMongoMatch[1].trim();
    console.log(`   USE_MONGODB=${useMongo}`);
    if (useMongo === 'true') {
      console.log('   📦 MongoDB mode enabled');
      console.log('   Check server logs for MongoDB connection status\n');
    } else {
      console.log('   📦 File-based storage mode\n');
    }
  }
}

// Test 5: Check if interviews exist
console.log('Test 5: Checking for existing interviews...');
const interviewsPath = path.join(__dirname, 'server', 'data', 'interviews.json');
if (fs.existsSync(interviewsPath)) {
  const interviews = JSON.parse(fs.readFileSync(interviewsPath, 'utf8'));
  console.log(`   Found ${interviews.length} interviews in file-based storage`);
  if (interviews.length > 0) {
    console.log(`   First interview ID: ${interviews[0]._id}\n`);
  } else {
    console.log('   No interviews to delete\n');
  }
} else {
  console.log('   No interviews.json file found (might be using MongoDB)\n');
}

console.log('========================================');
console.log('DIAGNOSIS COMPLETE');
console.log('========================================\n');

console.log('RECOMMENDATIONS:');
console.log('1. If DELETE returns 404: Restart server completely');
console.log('   - Run: taskkill /F /IM node.exe');
console.log('   - Wait 5 seconds');
console.log('   - Run: cd server && npm run dev');
console.log('');
console.log('2. If DELETE returns 401: Everything is working!');
console.log('   - Test in browser with a logged-in user');
console.log('   - Delete button should work now');
console.log('');
console.log('3. Check server console for:');
console.log('   - "Server running in development mode on port 5000"');
console.log('   - MongoDB connection status');
console.log('   - Any error messages');
