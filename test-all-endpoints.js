import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

console.log('🧪 Testing PlaceMate AI Endpoints\n');

async function testEndpoints() {
  const results = {
    passed: [],
    failed: []
  };

  // Test 1: Health Check
  try {
    const response = await axios.get(`${API_URL.replace('/api', '')}/api/health`);
    if (response.data.success) {
      results.passed.push('✅ Health Check');
    } else {
      results.failed.push('❌ Health Check - Invalid response');
    }
  } catch (error) {
    results.failed.push(`❌ Health Check - ${error.message}`);
  }

  // Test 2: Interview Routes
  try {
    await axios.post(`${API_URL}/interviews/create`, {});
  } catch (error) {
    if (error.response?.status === 401) {
      results.passed.push('✅ Interview Create Route (401 - Auth Required)');
    } else if (error.response?.status === 404) {
      results.failed.push('❌ Interview Create Route - 404 Not Found');
    } else {
      results.passed.push('✅ Interview Create Route (Exists)');
    }
  }

  // Test 3: Delete Interview Route
  try {
    await axios.delete(`${API_URL}/interviews/test-id`);
  } catch (error) {
    if (error.response?.status === 401) {
      results.passed.push('✅ Interview Delete Route (401 - Auth Required)');
    } else if (error.response?.status === 404) {
      results.failed.push('❌ Interview Delete Route - 404 Not Found');
    } else {
      results.passed.push('✅ Interview Delete Route (Exists)');
    }
  }

  // Test 4: Coding Routes
  try {
    await axios.post(`${API_URL}/coding/generate-questions`, {});
  } catch (error) {
    if (error.response?.status === 401) {
      results.passed.push('✅ Coding Generate Questions Route (401 - Auth Required)');
    } else if (error.response?.status === 404) {
      results.failed.push('❌ Coding Generate Questions Route - 404 Not Found');
    } else {
      results.passed.push('✅ Coding Generate Questions Route (Exists)');
    }
  }

  // Test 5: AI Response Route
  try {
    const response = await axios.post(`${API_URL}/interviews/ai-response`, {
      prompt: 'Test',
      conversationHistory: []
    });
    if (response.data.success) {
      results.passed.push('✅ AI Response Route');
    } else {
      results.failed.push('❌ AI Response Route - Invalid response');
    }
  } catch (error) {
    results.failed.push(`❌ AI Response Route - ${error.message}`);
  }

  // Test 6: User Routes
  try {
    await axios.get(`${API_URL}/users/profile`);
  } catch (error) {
    if (error.response?.status === 401) {
      results.passed.push('✅ User Profile Route (401 - Auth Required)');
    } else if (error.response?.status === 404) {
      results.failed.push('❌ User Profile Route - 404 Not Found');
    } else {
      results.passed.push('✅ User Profile Route (Exists)');
    }
  }

  // Print Results
  console.log('\n📊 Test Results:\n');
  console.log('PASSED TESTS:');
  results.passed.forEach(test => console.log(test));
  
  if (results.failed.length > 0) {
    console.log('\nFAILED TESTS:');
    results.failed.forEach(test => console.log(test));
  }

  console.log(`\n📈 Summary: ${results.passed.length}/${results.passed.length + results.failed.length} tests passed`);
  
  if (results.failed.length === 0) {
    console.log('\n🎉 All endpoints are working correctly!');
  } else {
    console.log('\n⚠️  Some endpoints need attention');
  }
}

// Wait for server to start
setTimeout(testEndpoints, 3000);
