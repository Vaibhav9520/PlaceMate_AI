import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env vars
dotenv.config({ path: path.join(__dirname, '../.env') });

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY);

const topics = [
  'Arrays', 'Strings', 'Linked Lists', 'Stacks', 'Queues',
  'Trees', 'Graphs', 'Sorting', 'Searching', 'Dynamic Programming',
  'Recursion', 'Backtracking', 'Greedy', 'Hash Tables', 'Heaps'
];

const generateQuestionsForTopic = async (topic) => {
  try {
    console.log(`\n🤖 Generating 10 questions for ${topic}...`);
    
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });

    const prompt = `Generate EXACTLY 10 different Data Structures and Algorithms coding problems on the topic: ${topic}.

CRITICAL REQUIREMENTS:
- Generate EXACTLY 10 unique problems
- Mix of difficulties: 4 Easy, 4 Medium, 2 Hard
- Each problem must be different and practical
- Interview-appropriate questions

For each of the 10 problems, provide:
1. A unique, clear title
2. Difficulty level (Easy, Medium, or Hard)
3. Detailed problem description (2-3 sentences)
4. 2 example test cases with input, output, and explanation
5. 2-3 constraints
6. 3 sample test cases (visible to user, hidden: false)
7. 2 hidden test cases (for validation, hidden: true)

Return ONLY a valid JSON array with EXACTLY 10 objects. No markdown, no code blocks, just pure JSON:

[
  {
    "questionNumber": 1,
    "title": "Problem Title",
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

Remember: Generate EXACTLY 10 problems with questionNumber from 1 to 10!`;

    const result = await model.generateContent(prompt);
    const response = result.response.text();
    
    // Try to extract JSON from response
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
      throw new Error('Could not parse AI response');
    }

    let questions = JSON.parse(arrayMatch[0]);
    
    // Ensure we have exactly 10 questions
    if (questions.length !== 10) {
      console.log(`⚠️  AI generated ${questions.length} questions, expected 10`);
      questions = questions.slice(0, 10);
    }
    
    // Add topic and ensure questionNumber
    questions = questions.map((q, idx) => ({
      topic,
      questionNumber: q.questionNumber || (idx + 1),
      title: q.title,
      difficulty: q.difficulty,
      description: q.description,
      examples: q.examples || [],
      constraints: q.constraints || [],
      testCases: q.testCases || []
    }));

    console.log(`✅ Generated ${questions.length} questions for ${topic}`);
    return questions;

  } catch (error) {
    console.error(`❌ Error generating questions for ${topic}:`, error.message);
    return null;
  }
};

const generateAllQuestions = async () => {
  console.log('🚀 Starting question generation for all topics...\n');
  console.log(`Topics to generate: ${topics.join(', ')}\n`);
  
  const allQuestions = {};
  
  for (const topic of topics) {
    const questions = await generateQuestionsForTopic(topic);
    if (questions) {
      allQuestions[topic] = questions;
    }
    
    // Wait 2 seconds between requests to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  
  // Save to JSON file
  const outputPath = path.join(__dirname, '../data/coding-questions.json');
  fs.writeFileSync(outputPath, JSON.stringify(allQuestions, null, 2));
  
  console.log(`\n✅ All questions generated and saved to: ${outputPath}`);
  console.log(`\nTotal topics: ${Object.keys(allQuestions).length}`);
  console.log(`Total questions: ${Object.values(allQuestions).flat().length}`);
  
  return allQuestions;
};

// Run the generation
generateAllQuestions()
  .then(() => {
    console.log('\n🎉 Question generation complete!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Error:', error);
    process.exit(1);
  });
