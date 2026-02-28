import axios from 'axios';

async function testCodeExecution() {
  console.log('🧪 Testing Code Execution...\n');

  // Test case 1: Simple Java code that prints output
  const javaCode = `public class Solution {
    public static void main(String[] args) {
        System.out.println("[0,1]");
    }
}`;

  // Test case 2: Simple Python code
  const pythonCode = `print("[0,1]")`;

  // Test case 3: Simple JavaScript code
  const jsCode = `console.log("[0,1]");`;

  const testCases = [
    {
      input: "[2,7,11,15]\\n9",
      expectedOutput: "[0,1]",
      hidden: false
    }
  ];

  // Test Java
  console.log('📝 Testing Java execution...');
  try {
    const response = await axios.post('http://localhost:5000/api/coding/run', {
      code: javaCode,
      language: 'java',
      testCases: testCases
    });

    if (response.data.success) {
      console.log('✅ Java execution successful!');
      console.log('Output:', response.data.output);
      console.log('Test Results:', response.data.testResults);
    }
  } catch (error) {
    console.log('❌ Java execution failed:', error.response?.data?.message || error.message);
  }
  console.log('');

  // Test Python
  console.log('📝 Testing Python execution...');
  try {
    const response = await axios.post('http://localhost:5000/api/coding/run', {
      code: pythonCode,
      language: 'python',
      testCases: testCases
    });

    if (response.data.success) {
      console.log('✅ Python execution successful!');
      console.log('Output:', response.data.output);
      console.log('Test Results:', response.data.testResults);
    }
  } catch (error) {
    console.log('❌ Python execution failed:', error.response?.data?.message || error.message);
  }
  console.log('');

  // Test JavaScript
  console.log('📝 Testing JavaScript execution...');
  try {
    const response = await axios.post('http://localhost:5000/api/coding/run', {
      code: jsCode,
      language: 'javascript',
      testCases: testCases
    });

    if (response.data.success) {
      console.log('✅ JavaScript execution successful!');
      console.log('Output:', response.data.output);
      console.log('Test Results:', response.data.testResults);
    }
  } catch (error) {
    console.log('❌ JavaScript execution failed:', error.response?.data?.message || error.message);
  }

  console.log('\n✅ All tests completed!');
}

testCodeExecution();
