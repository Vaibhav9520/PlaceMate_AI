import { GoogleGenerativeAI } from '@google/generative-ai';
import axios from 'axios';
import { db } from '../config/database.js';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY);

// Get questions from MongoDB
export const generateDSAQuestions = async (topic, count) => {
  try {
    console.log(`📚 Fetching ${count} questions for ${topic} from database...`);

    // Try to get from MongoDB first
    const USE_MONGODB = process.env.USE_MONGODB === 'true';
    
    if (USE_MONGODB) {
      try {
        // Load CodingQuestion model
        const CodingQuestion = await import('../models_backup/CodingQuestion.js').then(m => m.default);
        
        // Get random questions from the topic
        const questions = await CodingQuestion.aggregate([
          { $match: { topic: topic } },
          { $sample: { size: Math.min(count, 10) } }, // Get random questions up to count or 10
          { $project: { _id: 0, __v: 0, createdAt: 0, updatedAt: 0 } }
        ]);

        if (questions && questions.length > 0) {
          // Add unique IDs
          questions.forEach((q, idx) => {
            q.id = `${topic.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}-${idx}`;
          });

          console.log(`✅ Retrieved ${questions.length} questions from MongoDB`);
          
          // If we need more questions than available, repeat some
          if (questions.length < count) {
            console.log(`⚠️  Only ${questions.length} questions available, repeating to reach ${count}...`);
            const repeated = [];
            for (let i = 0; i < count; i++) {
              const q = { ...questions[i % questions.length] };
              q.id = `${topic.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}-${i}`;
              if (i >= questions.length) {
                q.title = q.title + ` (Variation ${Math.floor(i / questions.length) + 1})`;
              }
              repeated.push(q);
            }
            return repeated;
          }

          return questions.slice(0, count);
        }
      } catch (mongoError) {
        console.log('⚠️  MongoDB fetch failed, trying file-based storage...');
      }
    }

    // Fallback to file-based storage
    console.log('📁 Trying file-based question storage...');
    const fs = await import('fs');
    const path = await import('path');
    const { fileURLToPath } = await import('url');
    
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const questionsPath = path.join(__dirname, '../data/coding-questions.json');

    if (fs.existsSync(questionsPath)) {
      const questionsData = JSON.parse(fs.readFileSync(questionsPath, 'utf8'));
      const topicQuestions = questionsData[topic];

      if (topicQuestions && topicQuestions.length > 0) {
        // Shuffle and select random questions
        const shuffled = topicQuestions.sort(() => 0.5 - Math.random());
        let selected = shuffled.slice(0, Math.min(count, topicQuestions.length));

        // Add unique IDs
        selected.forEach((q, idx) => {
          q.id = `${topic.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}-${idx}`;
        });

        // If we need more, repeat
        if (selected.length < count) {
          const repeated = [];
          for (let i = 0; i < count; i++) {
            const q = { ...selected[i % selected.length] };
            q.id = `${topic.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}-${i}`;
            if (i >= selected.length) {
              q.title = q.title + ` (Variation ${Math.floor(i / selected.length) + 1})`;
            }
            repeated.push(q);
          }
          selected = repeated;
        }

        console.log(`✅ Retrieved ${selected.length} questions from file storage`);
        return selected;
      }
    }

    // Final fallback: Generate with AI
    console.log('🤖 No pre-generated questions found, generating with AI...');
    return await generateWithAI(topic, count);

  } catch (error) {
    console.error('❌ Error fetching questions:', error.message);
    console.log('🔄 Falling back to template questions...');
    return generateFallbackQuestions(topic, count);
  }
};

// Generate questions with AI (fallback)
const generateWithAI = async (topic, count) => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });

    const prompt = `Generate EXACTLY ${count} different Data Structures and Algorithms coding problems on the topic: ${topic}.

CRITICAL REQUIREMENTS:
- Generate EXACTLY ${count} problems (not ${count-1}, not ${count+1}, but EXACTLY ${count})
- Each problem must be unique and different
- Problems should vary in difficulty (mix of Easy, Medium, Hard)
- Make them practical and interview-appropriate

For each of the ${count} problems, provide:
1. A unique, clear title
2. Difficulty level (Easy, Medium, or Hard)
3. Detailed problem description (2-3 sentences)
4. 2 example test cases with input, output, and explanation
5. 2-3 constraints
6. 3 sample test cases (visible to user, hidden: false)
7. 2 hidden test cases (for validation, hidden: true)

Return ONLY a valid JSON array with EXACTLY ${count} objects. No markdown, no code blocks, just pure JSON:

[
  {
    "id": "${topic.toLowerCase().replace(/\s+/g, '-')}-1",
    "title": "Problem Title 1",
    "difficulty": "Easy",
    "description": "Clear problem description...",
    "examples": [
      {
        "input": "example input",
        "output": "example output",
        "explanation": "why this output"
      }
    ],
    "constraints": ["constraint 1", "constraint 2"],
    "testCases": [
      {"input": "test input", "expectedOutput": "expected output", "hidden": false},
      {"input": "test input", "expectedOutput": "expected output", "hidden": false},
      {"input": "test input", "expectedOutput": "expected output", "hidden": false},
      {"input": "test input", "expectedOutput": "expected output", "hidden": true},
      {"input": "test input", "expectedOutput": "expected output", "hidden": true}
    ]
  }
]

Remember: Generate EXACTLY ${count} problems in the array!`;

    console.log(`🤖 Asking Gemini to generate ${count} questions on ${topic}...`);
    
    const result = await model.generateContent(prompt);
    const response = result.response.text();
    
    console.log(`📝 Received response from Gemini (${response.length} characters)`);
    
    // Try to extract JSON from response (handle markdown code blocks)
    let jsonText = response;
    
    // Remove markdown code blocks if present
    if (response.includes('```json')) {
      const jsonMatch = response.match(/```json\s*([\s\S]*?)\s*```/);
      if (jsonMatch) {
        jsonText = jsonMatch[1];
      }
    } else if (response.includes('```')) {
      const jsonMatch = response.match(/```\s*([\s\S]*?)\s*```/);
      if (jsonMatch) {
        jsonText = jsonMatch[1];
      }
    }
    
    // Extract JSON array
    const arrayMatch = jsonText.match(/\[[\s\S]*\]/);
    if (!arrayMatch) {
      console.log('⚠️  Could not parse AI response, using fallback questions');
      console.log('Response preview:', response.substring(0, 200));
      return generateFallbackQuestions(topic, count);
    }

    let questions = JSON.parse(arrayMatch[0]);
    
    console.log(`📊 Parsed ${questions.length} questions from AI response`);
    
    // Ensure we have exactly the requested count
    if (questions.length < count) {
      console.log(`⚠️  AI generated only ${questions.length} questions, requested ${count}. Generating ${count - questions.length} more...`);
      const additionalQuestions = generateFallbackQuestions(topic, count - questions.length);
      questions = [...questions, ...additionalQuestions];
    } else if (questions.length > count) {
      console.log(`⚠️  AI generated ${questions.length} questions, requested ${count}. Trimming to ${count}.`);
      questions = questions.slice(0, count);
    }
    
    // Add unique IDs and ensure all fields are present
    questions.forEach((q, idx) => {
      if (!q.id) {
        q.id = `${topic.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}-${idx}`;
      }
      // Ensure examples array exists
      if (!q.examples || q.examples.length === 0) {
        q.examples = [{ input: 'See test cases', output: 'See test cases', explanation: 'Check the test cases below' }];
      }
      // Ensure constraints array exists
      if (!q.constraints || q.constraints.length === 0) {
        q.constraints = ['Standard constraints apply'];
      }
      // Ensure testCases array exists
      if (!q.testCases || q.testCases.length === 0) {
        q.testCases = [
          { input: 'sample input', expectedOutput: 'sample output', hidden: false }
        ];
      }
    });

    console.log(`✅ Successfully generated ${questions.length} questions on ${topic}`);
    return questions;

  } catch (error) {
    console.error('❌ Error generating DSA questions:', error.message);
    console.log(`🔄 Falling back to template questions for ${topic}`);
    
    // Fallback: Return sample questions if AI fails
    return generateFallbackQuestions(topic, count);
  }
};

// Fallback questions if AI fails - generates exactly the requested count
const generateFallbackQuestions = (topic, count) => {
  console.log(`📚 Generating ${count} fallback questions for ${topic}...`);
  
  const questionTemplates = {
    'Arrays': [
      {
        title: 'Two Sum',
        difficulty: 'Easy',
        description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.',
        examples: [{ input: 'nums = [2,7,11,15], target = 9', output: '[0,1]', explanation: 'nums[0] + nums[1] == 9' }],
        constraints: ['2 <= nums.length <= 10^4', 'Only one valid answer exists'],
        testCases: [
          { input: '[2,7,11,15]\n9', expectedOutput: '[0,1]', hidden: false },
          { input: '[3,2,4]\n6', expectedOutput: '[1,2]', hidden: false },
          { input: '[3,3]\n6', expectedOutput: '[0,1]', hidden: true }
        ]
      },
      {
        title: 'Best Time to Buy and Sell Stock',
        difficulty: 'Easy',
        description: 'You are given an array prices where prices[i] is the price of a given stock on the ith day. Return the maximum profit you can achieve.',
        examples: [{ input: 'prices = [7,1,5,3,6,4]', output: '5', explanation: 'Buy at 1, sell at 6' }],
        constraints: ['1 <= prices.length <= 10^5'],
        testCases: [
          { input: '[7,1,5,3,6,4]', expectedOutput: '5', hidden: false },
          { input: '[7,6,4,3,1]', expectedOutput: '0', hidden: false },
          { input: '[2,4,1]', expectedOutput: '2', hidden: true }
        ]
      },
      {
        title: 'Maximum Subarray',
        difficulty: 'Medium',
        description: 'Given an integer array nums, find the contiguous subarray which has the largest sum and return its sum.',
        examples: [{ input: 'nums = [-2,1,-3,4,-1,2,1,-5,4]', output: '6', explanation: '[4,-1,2,1] has sum 6' }],
        constraints: ['1 <= nums.length <= 10^5'],
        testCases: [
          { input: '[-2,1,-3,4,-1,2,1,-5,4]', expectedOutput: '6', hidden: false },
          { input: '[1]', expectedOutput: '1', hidden: false },
          { input: '[5,4,-1,7,8]', expectedOutput: '23', hidden: true }
        ]
      },
      {
        title: 'Contains Duplicate',
        difficulty: 'Easy',
        description: 'Given an integer array nums, return true if any value appears at least twice in the array, and return false if every element is distinct.',
        examples: [{ input: 'nums = [1,2,3,1]', output: 'true', explanation: '1 appears twice' }],
        constraints: ['1 <= nums.length <= 10^5'],
        testCases: [
          { input: '[1,2,3,1]', expectedOutput: 'true', hidden: false },
          { input: '[1,2,3,4]', expectedOutput: 'false', hidden: false },
          { input: '[1,1,1,3,3,4,3,2,4,2]', expectedOutput: 'true', hidden: true }
        ]
      },
      {
        title: 'Product of Array Except Self',
        difficulty: 'Medium',
        description: 'Given an integer array nums, return an array answer such that answer[i] is equal to the product of all the elements of nums except nums[i].',
        examples: [{ input: 'nums = [1,2,3,4]', output: '[24,12,8,6]', explanation: 'Product except self' }],
        constraints: ['2 <= nums.length <= 10^5'],
        testCases: [
          { input: '[1,2,3,4]', expectedOutput: '[24,12,8,6]', hidden: false },
          { input: '[-1,1,0,-3,3]', expectedOutput: '[0,0,9,0,0]', hidden: false },
          { input: '[2,3,4,5]', expectedOutput: '[60,40,30,24]', hidden: true }
        ]
      }
    ],
    'Strings': [
      {
        title: 'Valid Palindrome',
        difficulty: 'Easy',
        description: 'A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward.',
        examples: [{ input: 's = "A man, a plan, a canal: Panama"', output: 'true', explanation: 'Reads same forwards and backwards' }],
        constraints: ['1 <= s.length <= 2 * 10^5'],
        testCases: [
          { input: 'A man, a plan, a canal: Panama', expectedOutput: 'true', hidden: false },
          { input: 'race a car', expectedOutput: 'false', hidden: false },
          { input: ' ', expectedOutput: 'true', hidden: true }
        ]
      },
      {
        title: 'Valid Anagram',
        difficulty: 'Easy',
        description: 'Given two strings s and t, return true if t is an anagram of s, and false otherwise.',
        examples: [{ input: 's = "anagram", t = "nagaram"', output: 'true', explanation: 'Same letters rearranged' }],
        constraints: ['1 <= s.length, t.length <= 5 * 10^4'],
        testCases: [
          { input: 'anagram\nnagaram', expectedOutput: 'true', hidden: false },
          { input: 'rat\ncar', expectedOutput: 'false', hidden: false },
          { input: 'listen\nsilent', expectedOutput: 'true', hidden: true }
        ]
      },
      {
        title: 'Longest Substring Without Repeating Characters',
        difficulty: 'Medium',
        description: 'Given a string s, find the length of the longest substring without repeating characters.',
        examples: [{ input: 's = "abcabcbb"', output: '3', explanation: '"abc" is the longest' }],
        constraints: ['0 <= s.length <= 5 * 10^4'],
        testCases: [
          { input: 'abcabcbb', expectedOutput: '3', hidden: false },
          { input: 'bbbbb', expectedOutput: '1', hidden: false },
          { input: 'pwwkew', expectedOutput: '3', hidden: true }
        ]
      },
      {
        title: 'Group Anagrams',
        difficulty: 'Medium',
        description: 'Given an array of strings strs, group the anagrams together. You can return the answer in any order.',
        examples: [{ input: 'strs = ["eat","tea","tan","ate","nat","bat"]', output: '[["bat"],["nat","tan"],["ate","eat","tea"]]', explanation: 'Grouped by anagrams' }],
        constraints: ['1 <= strs.length <= 10^4'],
        testCases: [
          { input: '["eat","tea","tan","ate","nat","bat"]', expectedOutput: '[["bat"],["nat","tan"],["ate","eat","tea"]]', hidden: false },
          { input: '[""]', expectedOutput: '[[""]]', hidden: false },
          { input: '["a"]', expectedOutput: '[["a"]]', hidden: true }
        ]
      },
      {
        title: 'Longest Palindromic Substring',
        difficulty: 'Medium',
        description: 'Given a string s, return the longest palindromic substring in s.',
        examples: [{ input: 's = "babad"', output: '"bab"', explanation: '"aba" is also valid' }],
        constraints: ['1 <= s.length <= 1000'],
        testCases: [
          { input: 'babad', expectedOutput: 'bab', hidden: false },
          { input: 'cbbd', expectedOutput: 'bb', hidden: false },
          { input: 'racecar', expectedOutput: 'racecar', hidden: true }
        ]
      }
    ]
  };

  // Get templates for the topic, or use Arrays as default
  const templates = questionTemplates[topic] || questionTemplates['Arrays'];
  
  // Generate questions by repeating and modifying templates if needed
  const questions = [];
  for (let i = 0; i < count; i++) {
    const template = templates[i % templates.length];
    const questionNumber = Math.floor(i / templates.length) + 1;
    const suffix = questionNumber > 1 ? ` (Variation ${questionNumber})` : '';
    
    questions.push({
      id: `${topic.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}-${i}`,
      title: template.title + suffix,
      difficulty: template.difficulty,
      description: template.description,
      examples: template.examples,
      constraints: template.constraints,
      testCases: template.testCases
    });
  }

  console.log(`✅ Generated ${questions.length} fallback questions`);
  return questions;
};

// Run code with test cases using Judge0 API
export const runCodeWithTests = async (code, language, testCases = []) => {
  try {
    // Language ID mapping for Judge0
    const languageIds = {
      python: 71,       // Python 3
      javascript: 63,   // JavaScript (Node.js)
      typescript: 74,   // TypeScript
      java: 62,         // Java
      cpp: 54,          // C++ (GCC 9.2.0)
      c: 50,            // C (GCC 9.2.0)
      csharp: 51,       // C# (Mono 6.6.0.161)
      go: 60,           // Go (1.13.5)
      rust: 73,         // Rust (1.40.0)
      php: 68,          // PHP (7.4.1)
      swift: 83,        // Swift (5.2.3)
      kotlin: 78,       // Kotlin (1.3.70)
      ruby: 72          // Ruby (2.7.0)
    };

    const languageId = languageIds[language];
    if (!languageId) {
      throw new Error(`Unsupported language: ${language}`);
    }

    // If no test cases, just run the code
    if (!testCases || testCases.length === 0) {
      const result = await runSingleExecution(code, languageId, '');
      return {
        output: result.stdout || result.stderr || 'No output',
        testResults: [],
        executionTime: result.time
      };
    }

    // Run code against all test cases
    const testResults = [];
    let combinedOutput = '';

    for (let i = 0; i < testCases.length; i++) {
      const testCase = testCases[i];
      
      try {
        const result = await runSingleExecution(code, languageId, testCase.input);
        const output = (result.stdout || '').trim();
        const expected = (testCase.expectedOutput || '').trim();
        
        // Flexible comparison - normalize output
        const normalizedOutput = normalizeOutput(output);
        const normalizedExpected = normalizeOutput(expected);
        const passed = normalizedOutput === normalizedExpected;

        testResults.push({
          testCase: i + 1,
          input: testCase.input,
          expectedOutput: expected,
          actualOutput: output,
          passed,
          hidden: testCase.hidden || false,
          error: result.stderr || null
        });

        if (!testCase.hidden) {
          combinedOutput += `Test Case ${i + 1}: ${passed ? '✓ Passed' : '✗ Failed'}\n`;
          combinedOutput += `Input: ${testCase.input}\n`;
          combinedOutput += `Expected: ${expected}\n`;
          combinedOutput += `Got: ${output}\n`;
          if (result.stderr) {
            combinedOutput += `Error: ${result.stderr}\n`;
          }
          combinedOutput += '\n';
        }

      } catch (error) {
        testResults.push({
          testCase: i + 1,
          passed: false,
          error: error.message,
          hidden: testCase.hidden || false
        });
        
        if (!testCase.hidden) {
          combinedOutput += `Test Case ${i + 1}: ✗ Failed\n`;
          combinedOutput += `Error: ${error.message}\n\n`;
        }
      }
    }

    return {
      output: combinedOutput || 'Code executed successfully',
      testResults,
      executionTime: '0.1s'
    };

  } catch (error) {
    console.error('Error running code:', error);
    throw error;
  }
};

// Run single code execution
const runSingleExecution = async (code, languageId, stdin) => {
  // Check if Judge0 API is configured
  const hasJudge0 = process.env.RAPIDAPI_KEY && process.env.RAPIDAPI_KEY !== 'demo-key';
  
  if (hasJudge0) {
    try {
      // Using Judge0 CE (free tier)
      const response = await axios.post(
        'https://judge0-ce.p.rapidapi.com/submissions',
        {
          source_code: Buffer.from(code).toString('base64'),
          language_id: languageId,
          stdin: Buffer.from(stdin).toString('base64')
        },
        {
          headers: {
            'content-type': 'application/json',
            'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
            'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com'
          },
          params: {
            base64_encoded: 'true',
            fields: '*'
          }
        }
      );

      const token = response.data.token;

      // Poll for result
      let result;
      let attempts = 0;
      const maxAttempts = 10;

      while (attempts < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, 1000));

        const resultResponse = await axios.get(
          `https://judge0-ce.p.rapidapi.com/submissions/${token}`,
          {
            headers: {
              'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
              'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com'
            },
            params: {
              base64_encoded: 'true',
              fields: '*'
            }
          }
        );

        result = resultResponse.data;

        if (result.status.id > 2) {
          break;
        }

        attempts++;
      }

      // Decode output
      return {
        stdout: result.stdout ? Buffer.from(result.stdout, 'base64').toString() : '',
        stderr: result.stderr ? Buffer.from(result.stderr, 'base64').toString() : '',
        compile_output: result.compile_output ? Buffer.from(result.compile_output, 'base64').toString() : '',
        time: result.time,
        memory: result.memory,
        status: result.status
      };

    } catch (error) {
      console.error('Judge0 API error:', error.response?.data || error.message);
    }
  }
  
  // Fallback: Try local execution for supported languages
  try {
    const { execSync } = await import('child_process');
    const fs = await import('fs');
    const path = await import('path');
    const os = await import('os');
    
    const tempDir = os.tmpdir();
    const timestamp = Date.now();
    const randomId = Math.floor(Math.random() * 10000);
    
    // Map language IDs to execution commands
    const languageMap = {
      71: { ext: 'py', cmd: 'python', name: 'Python' },      // Python
      63: { ext: 'js', cmd: 'node', name: 'JavaScript' },    // JavaScript
      62: { ext: 'java', cmd: 'javac', name: 'Java' },       // Java
      54: { ext: 'cpp', cmd: 'g++', name: 'C++' },           // C++
      50: { ext: 'c', cmd: 'gcc', name: 'C' }                // C
    };
    
    const lang = languageMap[languageId];
    if (!lang) {
      return {
        stdout: '',
        stderr: 'Language not supported in local execution mode',
        time: '0.0s'
      };
    }
    
    let output = '';
    let error = '';
    
    try {
      // Execute based on language
      if (lang.ext === 'py') {
        const fileName = `temp_${timestamp}_${randomId}.py`;
        const filePath = path.join(tempDir, fileName);
        fs.writeFileSync(filePath, code);
        
        try {
          output = execSync(`python "${filePath}"`, { 
            input: stdin,
            encoding: 'utf8',
            timeout: 5000,
            maxBuffer: 1024 * 1024
          });
        } catch (execError) {
          error = execError.stderr || execError.message;
          output = execError.stdout || '';
        }
        
        try { fs.unlinkSync(filePath); } catch (e) {}
        
      } else if (lang.ext === 'js') {
        const fileName = `temp_${timestamp}_${randomId}.js`;
        const filePath = path.join(tempDir, fileName);
        fs.writeFileSync(filePath, code);
        
        try {
          output = execSync(`node "${filePath}"`, { 
            input: stdin,
            encoding: 'utf8',
            timeout: 5000,
            maxBuffer: 1024 * 1024
          });
        } catch (execError) {
          error = execError.stderr || execError.message;
          output = execError.stdout || '';
        }
        
        try { fs.unlinkSync(filePath); } catch (e) {}
        
      } else if (lang.ext === 'java') {
        // Java requires the file name to match the public class name
        const fileName = `Solution.java`;
        const filePath = path.join(tempDir, fileName);
        const classPath = path.join(tempDir, 'Solution.class');
        
        fs.writeFileSync(filePath, code);
        
        try {
          // Compile Java
          execSync(`javac "${filePath}"`, { 
            encoding: 'utf8', 
            timeout: 10000,
            cwd: tempDir
          });
          
          // Run Java
          output = execSync(`java -cp "${tempDir}" Solution`, { 
            input: stdin,
            encoding: 'utf8',
            timeout: 5000,
            maxBuffer: 1024 * 1024,
            cwd: tempDir
          });
        } catch (execError) {
          error = execError.stderr || execError.message;
          output = execError.stdout || '';
        }
        
        // Clean up
        try { fs.unlinkSync(filePath); } catch (e) {}
        try { fs.unlinkSync(classPath); } catch (e) {}
        
      } else if (lang.ext === 'cpp') {
        const fileName = `temp_${timestamp}_${randomId}.cpp`;
        const filePath = path.join(tempDir, fileName);
        const exePath = path.join(tempDir, `temp_${timestamp}_${randomId}.exe`);
        
        fs.writeFileSync(filePath, code);
        
        try {
          // Compile C++
          execSync(`g++ "${filePath}" -o "${exePath}"`, { 
            encoding: 'utf8', 
            timeout: 10000
          });
          
          // Run executable
          output = execSync(`"${exePath}"`, { 
            input: stdin,
            encoding: 'utf8',
            timeout: 5000,
            maxBuffer: 1024 * 1024
          });
        } catch (execError) {
          error = execError.stderr || execError.message;
          output = execError.stdout || '';
        }
        
        // Clean up
        try { fs.unlinkSync(filePath); } catch (e) {}
        try { fs.unlinkSync(exePath); } catch (e) {}
        
      } else if (lang.ext === 'c') {
        const fileName = `temp_${timestamp}_${randomId}.c`;
        const filePath = path.join(tempDir, fileName);
        const exePath = path.join(tempDir, `temp_${timestamp}_${randomId}.exe`);
        
        fs.writeFileSync(filePath, code);
        
        try {
          // Compile C
          execSync(`gcc "${filePath}" -o "${exePath}"`, { 
            encoding: 'utf8', 
            timeout: 10000
          });
          
          // Run executable
          output = execSync(`"${exePath}"`, { 
            input: stdin,
            encoding: 'utf8',
            timeout: 5000,
            maxBuffer: 1024 * 1024
          });
        } catch (execError) {
          error = execError.stderr || execError.message;
          output = execError.stdout || '';
        }
        
        // Clean up
        try { fs.unlinkSync(filePath); } catch (e) {}
        try { fs.unlinkSync(exePath); } catch (e) {}
      }
      
    } catch (execError) {
      error = execError.stderr || execError.message || execError.toString();
      output = execError.stdout || '';
    }
    
    return {
      stdout: output,
      stderr: error,
      time: '0.1s'
    };
    
  } catch (fallbackError) {
    console.error('Local execution error:', fallbackError.message);
    
    // Final fallback: Return empty output
    return {
      stdout: '',
      stderr: 'Code execution not available. Please configure Judge0 API or ensure local runtime is installed.',
      time: '0.0s'
    };
  }
};


// Helper function to normalize output for comparison
function normalizeOutput(output) {
  if (!output) return '';
  
  // Remove extra whitespace, normalize line endings
  let normalized = output.trim().replace(/\r\n/g, '\n');
  
  // Try to parse as JSON for array/object comparison
  try {
    const parsed = JSON.parse(normalized);
    // If it's an array or object, stringify it consistently
    if (Array.isArray(parsed) || typeof parsed === 'object') {
      return JSON.stringify(parsed);
    }
  } catch (e) {
    // Not JSON, continue with string comparison
  }
  
  // Remove extra spaces between elements for array-like strings
  normalized = normalized.replace(/\s*,\s*/g, ',');
  normalized = normalized.replace(/\s*\[\s*/g, '[');
  normalized = normalized.replace(/\s*\]\s*/g, ']');
  normalized = normalized.replace(/\s+/g, ' ');
  
  return normalized.toLowerCase();
}
