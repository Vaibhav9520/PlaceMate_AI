import axios from 'axios';

async function testJavaAndCpp() {
  console.log('🧪 Testing Java and C++ Execution...\n');

  // Test Java
  const javaCode = `public class Solution {
    public static void main(String[] args) {
        System.out.println("[0,1]");
    }
}`;

  // Test C++
  const cppCode = `#include <iostream>
using namespace std;

int main() {
    cout << "[0,1]" << endl;
    return 0;
}`;

  const testCases = [
    {
      input: "[2,7,11,15]\\n9",
      expectedOutput: "[0,1]",
      hidden: false
    }
  ];

  // Test Java
  console.log('☕ Testing Java execution...');
  try {
    const response = await axios.post('http://localhost:5000/api/coding/run', {
      code: javaCode,
      language: 'java',
      testCases: testCases
    });

    if (response.data.success) {
      const result = response.data.testResults[0];
      console.log('✅ Java execution completed!');
      console.log('   Test Passed:', result.passed);
      console.log('   Expected:', result.expectedOutput);
      console.log('   Got:', result.actualOutput);
      if (result.error) {
        console.log('   Error:', result.error);
      }
    }
  } catch (error) {
    console.log('❌ Java execution failed:', error.response?.data?.message || error.message);
  }
  console.log('');

  // Test C++
  console.log('⚡ Testing C++ execution...');
  try {
    const response = await axios.post('http://localhost:5000/api/coding/run', {
      code: cppCode,
      language: 'cpp',
      testCases: testCases
    });

    if (response.data.success) {
      const result = response.data.testResults[0];
      console.log('✅ C++ execution completed!');
      console.log('   Test Passed:', result.passed);
      console.log('   Expected:', result.expectedOutput);
      console.log('   Got:', result.actualOutput);
      if (result.error) {
        console.log('   Error:', result.error);
      }
    }
  } catch (error) {
    console.log('❌ C++ execution failed:', error.response?.data?.message || error.message);
  }

  console.log('\n✅ All tests completed!');
  console.log('\n📝 Note: If tests failed, ensure Java JDK and g++ (MinGW) are installed and in PATH');
}

testJavaAndCpp();
