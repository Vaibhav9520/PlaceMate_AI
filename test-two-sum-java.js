import axios from 'axios';

async function testTwoSumJava() {
  console.log('🧪 Testing Two Sum Java Solution...\n');

  const javaCode = `public class Solution {
    public static void main(String[] args) {
        // Test case 1: nums = [2,7,11,15], target = 9
        int[] nums1 = {2, 7, 11, 15};
        int target1 = 9;
        int[] result1 = twoSum(nums1, target1);
        System.out.println("[" + result1[0] + "," + result1[1] + "]");
        
        // Test case 2: nums = [3,2,4], target = 6
        int[] nums2 = {3, 2, 4};
        int target2 = 6;
        int[] result2 = twoSum(nums2, target2);
        System.out.println("[" + result2[0] + "," + result2[1] + "]");
        
        // Test case 3: nums = [3,3], target = 6
        int[] nums3 = {3, 3};
        int target3 = 6;
        int[] result3 = twoSum(nums3, target3);
        System.out.println("[" + result3[0] + "," + result3[1] + "]");
    }
    
    public static int[] twoSum(int[] nums, int target) {
        java.util.HashMap<Integer, Integer> map = new java.util.HashMap<>();
        
        for (int i = 0; i < nums.length; i++) {
            int complement = target - nums[i];
            
            if (map.containsKey(complement)) {
                return new int[] { map.get(complement), i };
            }
            
            map.put(nums[i], i);
        }
        
        return new int[] { -1, -1 };
    }
}`;

  const testCases = [
    {
      input: "[2,7,11,15]\\n9",
      expectedOutput: "[0,1]",
      hidden: false
    },
    {
      input: "[3,2,4]\\n6",
      expectedOutput: "[1,2]",
      hidden: false
    },
    {
      input: "[3,3]\\n6",
      expectedOutput: "[0,1]",
      hidden: true
    }
  ];

  console.log('☕ Running Java Two Sum Solution...\n');
  try {
    const response = await axios.post('http://localhost:5000/api/coding/run', {
      code: javaCode,
      language: 'java',
      testCases: testCases
    });

    if (response.data.success) {
      console.log('✅ Java execution successful!\n');
      console.log('📊 Test Results:');
      console.log('================');
      
      response.data.testResults.forEach((result, idx) => {
        console.log(`\nTest Case ${idx + 1}:`);
        console.log(`  Status: ${result.passed ? '✅ PASSED' : '❌ FAILED'}`);
        console.log(`  Expected: ${result.expectedOutput}`);
        console.log(`  Got: ${result.actualOutput}`);
        if (result.error) {
          console.log(`  Error: ${result.error}`);
        }
      });
      
      const passedCount = response.data.testResults.filter(r => r.passed).length;
      const totalCount = response.data.testResults.length;
      
      console.log(`\n📈 Summary: ${passedCount}/${totalCount} test cases passed`);
      
      if (passedCount === totalCount) {
        console.log('🎉 All test cases passed!');
      }
    }
  } catch (error) {
    console.log('❌ Execution failed:', error.response?.data?.message || error.message);
  }
}

testTwoSumJava();
