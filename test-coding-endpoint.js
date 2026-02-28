import axios from 'axios';

const API_URL = 'http://localhost:5000';

console.log('🔍 Testing Coding Practice Endpoints...\n');

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

// Test 2: Check coding endpoints (should return 401, not 404)
console.log('Test 2: Testing coding endpoints...');
try {
  await axios.post(`${API_URL}/api/coding/generate-questions`, {
    topic: 'Arrays',
    count: 3
  });
  console.log('❌ Unexpected success (should require authentication)\n');
} catch (error) {
  if (error.response) {
    if (error.response.status === 401) {
      console.log('✅ Coding endpoint exists (returns 401 Unauthorized)');
      console.log('   This is CORRECT - route is registered!\n');
    } else if (error.response.status === 404) {
      console.log('❌ Coding endpoint NOT FOUND (returns 404)');
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

console.log('========================================');
console.log('DIAGNOSIS COMPLETE');
console.log('========================================\n');

console.log('RECOMMENDATIONS:');
console.log('1. If coding endpoint returns 404: Restart server');
console.log('   - Run: taskkill /F /IM node.exe');
console.log('   - Wait 5 seconds');
console.log('   - Run: cd server && npm run dev');
console.log('');
console.log('2. If coding endpoint returns 401: Everything is working!');
console.log('   - Test in browser with a logged-in user');
console.log('   - Coding practice should work now');
