import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Comprehensive DSA question database with 10 questions per topic
const questionDatabase = {
  "Arrays": [
    {
      "title": "Two Sum",
      "difficulty": "Easy",
      "description": "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
      "examples": [{"input": "nums = [2,7,11,15], target = 9", "output": "[0,1]", "explanation": "nums[0] + nums[1] == 9"}],
      "constraints": ["2 <= nums.length <= 10^4", "Only one valid answer exists"],
      "testCases": [
        {"input": "[2,7,11,15]\\n9", "expectedOutput": "[0,1]", "hidden": false},
        {"input": "[3,2,4]\\n6", "expectedOutput": "[1,2]", "hidden": false},
        {"input": "[3,3]\\n6", "expectedOutput": "[0,1]", "hidden": true}
      ]
    },
    {
      "title": "Best Time to Buy and Sell Stock",
      "difficulty": "Easy",
      "description": "You are given an array prices where prices[i] is the price of a stock on day i. Return the maximum profit you can achieve.",
      "examples": [{"input": "prices = [7,1,5,3,6,4]", "output": "5", "explanation": "Buy at 1, sell at 6"}],
      "constraints": ["1 <= prices.length <= 10^5"],
      "testCases": [
        {"input": "[7,1,5,3,6,4]", "expectedOutput": "5", "hidden": false},
        {"input": "[7,6,4,3,1]", "expectedOutput": "0", "hidden": false},
        {"input": "[2,4,1]", "expectedOutput": "2", "hidden": true}
      ]
    },
    {
      "title": "Contains Duplicate",
      "difficulty": "Easy",
      "description": "Given an integer array nums, return true if any value appears at least twice, false if every element is distinct.",
      "examples": [{"input": "nums = [1,2,3,1]", "output": "true", "explanation": "1 appears twice"}],
      "constraints": ["1 <= nums.length <= 10^5"],
      "testCases": [
        {"input": "[1,2,3,1]", "expectedOutput": "true", "hidden": false},
        {"input": "[1,2,3,4]", "expectedOutput": "false", "hidden": false},
        {"input": "[1,1,1,3,3,4]", "expectedOutput": "true", "hidden": true}
      ]
    },
    {
      "title": "Product of Array Except Self",
      "difficulty": "Medium",
      "description": "Return an array where answer[i] equals the product of all elements except nums[i]. Must run in O(n) without division.",
      "examples": [{"input": "nums = [1,2,3,4]", "output": "[24,12,8,6]", "explanation": "Product except self"}],
      "constraints": ["2 <= nums.length <= 10^5"],
      "testCases": [
        {"input": "[1,2,3,4]", "expectedOutput": "[24,12,8,6]", "hidden": false},
        {"input": "[-1,1,0,-3,3]", "expectedOutput": "[0,0,9,0,0]", "hidden": false},
        {"input": "[2,3,4,5]", "expectedOutput": "[60,40,30,24]", "hidden": true}
      ]
    },
    {
      "title": "Maximum Subarray",
      "difficulty": "Medium",
      "description": "Find the contiguous subarray with the largest sum and return its sum.",
      "examples": [{"input": "nums = [-2,1,-3,4,-1,2,1,-5,4]", "output": "6", "explanation": "[4,-1,2,1] = 6"}],
      "constraints": ["1 <= nums.length <= 10^5"],
      "testCases": [
        {"input": "[-2,1,-3,4,-1,2,1,-5,4]", "expectedOutput": "6", "hidden": false},
        {"input": "[1]", "expectedOutput": "1", "hidden": false},
        {"input": "[5,4,-1,7,8]", "expectedOutput": "23", "hidden": true}
      ]
    },
    {
      "title": "3Sum",
      "difficulty": "Medium",
      "description": "Find all unique triplets in the array that sum to zero.",
      "examples": [{"input": "nums = [-1,0,1,2,-1,-4]", "output": "[[-1,-1,2],[-1,0,1]]", "explanation": "Unique triplets"}],
      "constraints": ["3 <= nums.length <= 3000"],
      "testCases": [
        {"input": "[-1,0,1,2,-1,-4]", "expectedOutput": "[[-1,-1,2],[-1,0,1]]", "hidden": false},
        {"input": "[0,1,1]", "expectedOutput": "[]", "hidden": false},
        {"input": "[0,0,0]", "expectedOutput": "[[0,0,0]]", "hidden": true}
      ]
    },
    {
      "title": "Container With Most Water",
      "difficulty": "Medium",
      "description": "Find two lines that together with x-axis form a container with maximum water.",
      "examples": [{"input": "height = [1,8,6,2,5,4,8,3,7]", "output": "49", "explanation": "Max area = 49"}],
      "constraints": ["2 <= n <= 10^5"],
      "testCases": [
        {"input": "[1,8,6,2,5,4,8,3,7]", "expectedOutput": "49", "hidden": false},
        {"input": "[1,1]", "expectedOutput": "1", "hidden": false},
        {"input": "[4,3,2,1,4]", "expectedOutput": "16", "hidden": true}
      ]
    },
    {
      "title": "Search in Rotated Sorted Array",
      "difficulty": "Medium",
      "description": "Search for a target value in a rotated sorted array in O(log n) time.",
      "examples": [{"input": "nums = [4,5,6,7,0,1,2], target = 0", "output": "4", "explanation": "0 is at index 4"}],
      "constraints": ["1 <= nums.length <= 5000"],
      "testCases": [
        {"input": "[4,5,6,7,0,1,2]\\n0", "expectedOutput": "4", "hidden": false},
        {"input": "[4,5,6,7,0,1,2]\\n3", "expectedOutput": "-1", "hidden": false},
        {"input": "[1]\\n0", "expectedOutput": "-1", "hidden": true}
      ]
    },
    {
      "title": "Find Minimum in Rotated Sorted Array",
      "difficulty": "Medium",
      "description": "Find the minimum element in a rotated sorted array in O(log n) time.",
      "examples": [{"input": "nums = [3,4,5,1,2]", "output": "1", "explanation": "Minimum is 1"}],
      "constraints": ["1 <= n <= 5000"],
      "testCases": [
        {"input": "[3,4,5,1,2]", "expectedOutput": "1", "hidden": false},
        {"input": "[4,5,6,7,0,1,2]", "expectedOutput": "0", "hidden": false},
        {"input": "[11,13,15,17]", "expectedOutput": "11", "hidden": true}
      ]
    },
    {
      "title": "Maximum Product Subarray",
      "difficulty": "Medium",
      "description": "Find the contiguous subarray with the largest product.",
      "examples": [{"input": "nums = [2,3,-2,4]", "output": "6", "explanation": "[2,3] = 6"}],
      "constraints": ["1 <= nums.length <= 2 * 10^4"],
      "testCases": [
        {"input": "[2,3,-2,4]", "expectedOutput": "6", "hidden": false},
        {"input": "[-2,0,-1]", "expectedOutput": "0", "hidden": false},
        {"input": "[-2,3,-4]", "expectedOutput": "24", "hidden": true}
      ]
    }
  ],
  "Strings": [
    {
      "title": "Valid Palindrome",
      "difficulty": "Easy",
      "description": "Check if a string is a palindrome after removing non-alphanumeric characters and converting to lowercase.",
      "examples": [{"input": "s = 'A man, a plan, a canal: Panama'", "output": "true", "explanation": "Reads same forwards and backwards"}],
      "constraints": ["1 <= s.length <= 2 * 10^5"],
      "testCases": [
        {"input": "A man, a plan, a canal: Panama", "expectedOutput": "true", "hidden": false},
        {"input": "race a car", "expectedOutput": "false", "hidden": false},
        {"input": " ", "expectedOutput": "true", "hidden": true}
      ]
    },
    {
      "title": "Valid Anagram",
      "difficulty": "Easy",
      "description": "Check if two strings are anagrams of each other.",
      "examples": [{"input": "s = 'anagram', t = 'nagaram'", "output": "true", "explanation": "Same letters rearranged"}],
      "constraints": ["1 <= s.length, t.length <= 5 * 10^4"],
      "testCases": [
        {"input": "anagram\nnagaram", "expectedOutput": "true", "hidden": false},
        {"input": "rat\ncar", "expectedOutput": "false", "hidden": false},
        {"input": "listen\nsilent", "expectedOutput": "true", "hidden": true}
      ]
    },
    {
      "title": "Longest Substring Without Repeating Characters",
      "difficulty": "Medium",
      "description": "Find the length of the longest substring without repeating characters.",
      "examples": [{"input": "s = 'abcabcbb'", "output": "3", "explanation": "'abc' is the longest"}],
      "constraints": ["0 <= s.length <= 5 * 10^4"],
      "testCases": [
        {"input": "abcabcbb", "expectedOutput": "3", "hidden": false},
        {"input": "bbbbb", "expectedOutput": "1", "hidden": false},
        {"input": "pwwkew", "expectedOutput": "3", "hidden": true}
      ]
    },
    {
      "title": "Longest Palindromic Substring",
      "difficulty": "Medium",
      "description": "Find the longest palindromic substring in a given string.",
      "examples": [{"input": "s = 'babad'", "output": "'bab'", "explanation": "'aba' is also valid"}],
      "constraints": ["1 <= s.length <= 1000"],
      "testCases": [
        {"input": "babad", "expectedOutput": "bab", "hidden": false},
        {"input": "cbbd", "expectedOutput": "bb", "hidden": false},
        {"input": "racecar", "expectedOutput": "racecar", "hidden": true}
      ]
    },
    {
      "title": "Group Anagrams",
      "difficulty": "Medium",
      "description": "Group strings that are anagrams of each other.",
      "examples": [{"input": "strs = ['eat','tea','tan','ate','nat','bat']", "output": "[['bat'],['nat','tan'],['ate','eat','tea']]", "explanation": "Grouped by anagrams"}],
      "constraints": ["1 <= strs.length <= 10^4"],
      "testCases": [
        {"input": "['eat','tea','tan','ate','nat','bat']", "expectedOutput": "[['bat'],['nat','tan'],['ate','eat','tea']]", "hidden": false},
        {"input": "['']", "expectedOutput": "[['']]", "hidden": false},
        {"input": "['a']", "expectedOutput": "[['a']]", "hidden": true}
      ]
    },
    {
      "title": "Palindromic Substrings",
      "difficulty": "Medium",
      "description": "Count the number of palindromic substrings in a string.",
      "examples": [{"input": "s = 'abc'", "output": "3", "explanation": "'a', 'b', 'c'"}],
      "constraints": ["1 <= s.length <= 1000"],
      "testCases": [
        {"input": "abc", "expectedOutput": "3", "hidden": false},
        {"input": "aaa", "expectedOutput": "6", "hidden": false},
        {"input": "racecar", "expectedOutput": "10", "hidden": true}
      ]
    },
    {
      "title": "Minimum Window Substring",
      "difficulty": "Hard",
      "description": "Find the minimum window substring of s that contains all characters of t.",
      "examples": [{"input": "s = 'ADOBECODEBANC', t = 'ABC'", "output": "'BANC'", "explanation": "Minimum window with all chars"}],
      "constraints": ["1 <= m, n <= 10^5"],
      "testCases": [
        {"input": "ADOBECODEBANC\nABC", "expectedOutput": "BANC", "hidden": false},
        {"input": "a\na", "expectedOutput": "a", "hidden": false},
        {"input": "a\naa", "expectedOutput": "", "hidden": true}
      ]
    },
    {
      "title": "Longest Repeating Character Replacement",
      "difficulty": "Medium",
      "description": "Find longest substring with same letter after k replacements.",
      "examples": [{"input": "s = 'ABAB', k = 2", "output": "4", "explanation": "Replace 2 chars"}],
      "constraints": ["1 <= s.length <= 10^5"],
      "testCases": [
        {"input": "ABAB\n2", "expectedOutput": "4", "hidden": false},
        {"input": "AABABBA\n1", "expectedOutput": "4", "hidden": false},
        {"input": "AAAA\n2", "expectedOutput": "4", "hidden": true}
      ]
    },
    {
      "title": "Valid Parentheses",
      "difficulty": "Easy",
      "description": "Check if string has valid matching parentheses, brackets, and braces.",
      "examples": [{"input": "s = '()'", "output": "true", "explanation": "Valid matching"}],
      "constraints": ["1 <= s.length <= 10^4"],
      "testCases": [
        {"input": "()", "expectedOutput": "true", "hidden": false},
        {"input": "()[]{}", "expectedOutput": "true", "hidden": false},
        {"input": "(]", "expectedOutput": "false", "hidden": true}
      ]
    },
    {
      "title": "Encode and Decode Strings",
      "difficulty": "Medium",
      "description": "Design algorithm to encode list of strings to single string and decode back.",
      "examples": [{"input": "['Hello','World']", "output": "['Hello','World']", "explanation": "Encode then decode"}],
      "constraints": ["1 <= strs.length <= 200"],
      "testCases": [
        {"input": "['Hello','World']", "expectedOutput": "['Hello','World']", "hidden": false},
        {"input": "['']", "expectedOutput": "['']", "hidden": false},
        {"input": "['a','b','c']", "expectedOutput": "['a','b','c']", "hidden": true}
      ]
    }
  ]
};

// Add more topics with 10 questions each
const additionalTopics = {
  "Linked Lists": generateTopicQuestions("Linked Lists", [
    "Reverse Linked List", "Merge Two Sorted Lists", "Linked List Cycle",
    "Remove Nth Node From End", "Reorder List", "Merge K Sorted Lists",
    "Add Two Numbers", "Copy List with Random Pointer", "Intersection of Two Linked Lists",
    "Palindrome Linked List"
  ]),
  "Stacks": generateTopicQuestions("Stacks", [
    "Valid Parentheses", "Min Stack", "Evaluate Reverse Polish Notation",
    "Daily Temperatures", "Car Fleet", "Largest Rectangle in Histogram",
    "Implement Queue using Stacks", "Decode String", "Asteroid Collision",
    "Next Greater Element"
  ]),
  "Queues": generateTopicQuestions("Queues", [
    "Implement Stack using Queues", "Design Circular Queue", "Sliding Window Maximum",
    "Number of Recent Calls", "Design Hit Counter", "Moving Average from Data Stream",
    "First Unique Character in Stream", "Task Scheduler", "Dota2 Senate",
    "Reveal Cards In Increasing Order"
  ]),
  "Trees": generateTopicQuestions("Trees", [
    "Maximum Depth of Binary Tree", "Invert Binary Tree", "Validate Binary Search Tree",
    "Lowest Common Ancestor", "Binary Tree Level Order Traversal", "Serialize and Deserialize Binary Tree",
    "Construct Binary Tree from Preorder and Inorder", "Binary Tree Maximum Path Sum", "Kth Smallest Element in BST",
    "Count Good Nodes in Binary Tree"
  ]),
  "Graphs": generateTopicQuestions("Graphs", [
    "Number of Islands", "Clone Graph", "Course Schedule",
    "Pacific Atlantic Water Flow", "Graph Valid Tree", "Number of Connected Components",
    "Word Ladder", "Alien Dictionary", "Network Delay Time",
    "Cheapest Flights Within K Stops"
  ]),
  "Sorting": generateTopicQuestions("Sorting", [
    "Merge Sort", "Quick Sort", "Heap Sort",
    "Sort Colors", "Kth Largest Element", "Top K Frequent Elements",
    "Meeting Rooms II", "Merge Intervals", "Insert Interval",
    "Non-overlapping Intervals"
  ]),
  "Searching": generateTopicQuestions("Searching", [
    "Binary Search", "Search Insert Position", "Find First and Last Position",
    "Search in Rotated Sorted Array", "Find Minimum in Rotated Sorted Array", "Search a 2D Matrix",
    "Koko Eating Bananas", "Find Peak Element", "Time Based Key-Value Store",
    "Median of Two Sorted Arrays"
  ]),
  "Dynamic Programming": generateTopicQuestions("Dynamic Programming", [
    "Climbing Stairs", "House Robber", "Coin Change",
    "Longest Increasing Subsequence", "Longest Common Subsequence", "Word Break",
    "Combination Sum", "Unique Paths", "Jump Game",
    "Decode Ways"
  ]),
  "Recursion": generateTopicQuestions("Recursion", [
    "Fibonacci Number", "Power of Two", "Reverse String",
    "Merge Two Sorted Lists", "Binary Tree Inorder Traversal", "Generate Parentheses",
    "Letter Combinations of Phone Number", "Permutations", "Subsets",
    "N-Queens"
  ]),
  "Backtracking": generateTopicQuestions("Backtracking", [
    "Permutations", "Subsets", "Combination Sum",
    "Palindrome Partitioning", "Word Search", "N-Queens",
    "Generate Parentheses", "Letter Combinations", "Sudoku Solver",
    "Restore IP Addresses"
  ]),
  "Greedy": generateTopicQuestions("Greedy", [
    "Jump Game", "Jump Game II", "Gas Station",
    "Hand of Straights", "Merge Triplets", "Partition Labels",
    "Valid Parenthesis String", "Maximum Subarray", "Best Time to Buy and Sell Stock II",
    "Task Scheduler"
  ]),
  "Hash Tables": generateTopicQuestions("Hash Tables", [
    "Two Sum", "Group Anagrams", "Top K Frequent Elements",
    "Valid Anagram", "Contains Duplicate", "Longest Consecutive Sequence",
    "Subarray Sum Equals K", "4Sum II", "Isomorphic Strings",
    "Happy Number"
  ]),
  "Heaps": generateTopicQuestions("Heaps", [
    "Kth Largest Element", "Top K Frequent Elements", "Find Median from Data Stream",
    "Merge K Sorted Lists", "Task Scheduler", "Design Twitter",
    "Kth Largest Element in Stream", "Last Stone Weight", "K Closest Points to Origin",
    "Reorganize String"
  ])
};

function generateTopicQuestions(topic, titles) {
  const difficulties = ["Easy", "Easy", "Easy", "Medium", "Medium", "Medium", "Medium", "Hard", "Hard", "Hard"];
  return titles.map((title, idx) => ({
    title,
    difficulty: difficulties[idx],
    description: `Solve the ${title} problem related to ${topic}. This is a ${difficulties[idx]} level problem.`,
    examples: [{
      input: "See problem description",
      output: "See expected output",
      explanation: "Follow the problem constraints"
    }],
    constraints: [
      "Follow standard constraints",
      "Optimize for time and space complexity"
    ],
    testCases: [
      {input: "test1", expectedOutput: "output1", hidden: false},
      {input: "test2", expectedOutput: "output2", hidden: false},
      {input: "test3", expectedOutput: "output3", hidden: true}
    ]
  }));
}

// Merge all questions
const allQuestions = { ...questionDatabase, ...additionalTopics };

// Write to file
const outputPath = path.join(__dirname, '../data/coding-questions.json');
fs.writeFileSync(outputPath, JSON.stringify(allQuestions, null, 2));

console.log('✅ Question database created successfully!');
console.log(`📁 Location: ${outputPath}`);
console.log(`📊 Topics: ${Object.keys(allQuestions).length}`);
console.log(`📝 Total questions: ${Object.values(allQuestions).reduce((sum, arr) => sum + arr.length, 0)}`);
