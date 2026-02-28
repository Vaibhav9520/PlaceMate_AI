import axios from 'axios';

async function testQuestionDatabase() {
  console.log('🧪 Testing Question Database...\n');

  const topics = [
    'Arrays', 'Strings', 'Linked Lists', 'Stacks', 'Queues',
    'Trees', 'Graphs', 'Sorting', 'Searching', 'Dynamic Programming',
    'Recursion', 'Backtracking', 'Greedy', 'Hash Tables', 'Heaps'
  ];

  const counts = [1, 3, 5, 10];

  // Test a few topics with different counts
  const testCases = [
    { topic: 'Arrays', count: 5 },
    { topic: 'Strings', count: 3 },
    { topic: 'Trees', count: 10 },
    { topic: 'Dynamic Programming', count: 1 }
  ];

  for (const testCase of testCases) {
    try {
      console.log(`📝 Testing: ${testCase.topic} with ${testCase.count} questions...`);
      
      const response = await axios.post('http://localhost:5000/api/coding/generate-questions', {
        topic: testCase.topic,
        count: testCase.count
      });

      if (response.data.success) {
        const questions = response.data.questions;
        console.log(`✅ Success! Received ${questions.length} questions`);
        console.log(`   First question: "${questions[0].title}" (${questions[0].difficulty})`);
        console.log(`   Last question: "${questions[questions.length - 1].title}" (${questions[questions.length - 1].difficulty})`);
      } else {
        console.log(`❌ Failed: ${response.data.message}`);
      }
    } catch (error) {
      console.log(`❌ Error: ${error.response?.data?.message || error.message}`);
    }
    console.log('');
  }

  console.log('✅ All tests completed!');
}

testQuestionDatabase();
