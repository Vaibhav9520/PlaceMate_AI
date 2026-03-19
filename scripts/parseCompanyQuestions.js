const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

// Time period mapping
const TIME_PERIODS = {
  'thirty-days': 'Last 30 Days',
  'three-months': 'Last 3 Months', 
  'six-months': 'Last 6 Months',
  'more-than-six-months': 'More than 6 Months',
  'all': 'All Questions'
};

async function parseCSV(filePath) {
  return new Promise((resolve, reject) => {
    const results = [];
    if (!fs.existsSync(filePath)) {
      resolve([]);
      return;
    }
    
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', () => resolve(results))
      .on('error', reject);
  });
}

function formatCompanyName(folderName) {
  return folderName
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function extractTags(title) {
  // Enhanced tag extraction based on common patterns
  const tags = [];
  const titleLower = title.toLowerCase();
  
  // Data structures
  if (titleLower.includes('array') || titleLower.includes('sum') || titleLower.includes('subarray')) {
    tags.push('Array');
  }
  if (titleLower.includes('string') || titleLower.includes('substring') || titleLower.includes('palindrome')) {
    tags.push('String');
  }
  if (titleLower.includes('tree') || titleLower.includes('binary') || titleLower.includes('bst')) {
    tags.push('Tree');
  }
  if (titleLower.includes('linked') || titleLower.includes('list')) {
    tags.push('Linked List');
  }
  if (titleLower.includes('graph') || titleLower.includes('island') || titleLower.includes('dfs') || titleLower.includes('bfs')) {
    tags.push('Graph');
  }
  if (titleLower.includes('hash') || titleLower.includes('map') || titleLower.includes('set')) {
    tags.push('Hash Table');
  }
  if (titleLower.includes('stack') || titleLower.includes('queue') || titleLower.includes('parenthes')) {
    tags.push('Stack');
  }
  if (titleLower.includes('heap') || titleLower.includes('priority')) {
    tags.push('Heap');
  }
  
  // Algorithms
  if (titleLower.includes('dynamic') || titleLower.includes('dp') || titleLower.includes('memo')) {
    tags.push('Dynamic Programming');
  }
  if (titleLower.includes('sort') || titleLower.includes('merge')) {
    tags.push('Sorting');
  }
  if (titleLower.includes('search') || titleLower.includes('binary') || titleLower.includes('find')) {
    tags.push('Binary Search');
  }
  if (titleLower.includes('backtrack') || titleLower.includes('permut') || titleLower.includes('combin')) {
    tags.push('Backtracking');
  }
  if (titleLower.includes('greedy') || titleLower.includes('interval')) {
    tags.push('Greedy');
  }
  if (titleLower.includes('two pointer') || titleLower.includes('sliding window')) {
    tags.push('Two Pointers');
  }
  if (titleLower.includes('trie') || titleLower.includes('prefix')) {
    tags.push('Trie');
  }
  if (titleLower.includes('union') || titleLower.includes('find')) {
    tags.push('Union Find');
  }
  
  // Math & Bit manipulation
  if (titleLower.includes('math') || titleLower.includes('number') || titleLower.includes('digit')) {
    tags.push('Math');
  }
  if (titleLower.includes('bit') || titleLower.includes('xor') || titleLower.includes('binary')) {
    tags.push('Bit Manipulation');
  }
  
  return tags.length > 0 ? tags : ['Algorithm'];
}

async function getAllCompanies() {
  const companiesPath = path.join(__dirname, '..', 'leetcode-companywise-interview-questions-master');
  const items = fs.readdirSync(companiesPath, { withFileTypes: true });
  
  return items
    .filter(item => item.isDirectory())
    .map(item => item.name)
    .sort(); // Sort alphabetically
}

async function generateCompanyQuestions() {
  const allCompanies = await getAllCompanies();
  console.log(`Found ${allCompanies.length} companies to process...`);
  
  const companyQuestions = {};
  let processedCount = 0;
  let skippedCount = 0;
  
  for (const company of allCompanies) {
    const companyPath = path.join(__dirname, '..', 'leetcode-companywise-interview-questions-master', company);
    
    if (!fs.existsSync(companyPath)) {
      console.log(`Skipping ${company} - folder not found`);
      skippedCount++;
      continue;
    }
    
    const companyName = formatCompanyName(company);
    companyQuestions[companyName] = {};
    
    let hasQuestions = false;
    
    for (const [fileName, displayName] of Object.entries(TIME_PERIODS)) {
      const csvPath = path.join(companyPath, `${fileName}.csv`);
      const questions = await parseCSV(csvPath);
      
      if (questions.length > 0) {
        hasQuestions = true;
        companyQuestions[companyName][displayName] = questions
          .slice(0, 25) // Increase limit to 25 questions per category
          .map(q => ({
            name: q.Title,
            difficulty: q.Difficulty,
            link: q.URL,
            tags: extractTags(q.Title),
            frequency: q['Frequency %'] || 'N/A',
            acceptance: q['Acceptance %'] || 'N/A'
          }));
      } else {
        companyQuestions[companyName][displayName] = [];
      }
    }
    
    if (hasQuestions) {
      processedCount++;
      console.log(`✓ Processed ${companyName}: ${Object.values(companyQuestions[companyName]).flat().length} total questions`);
    } else {
      delete companyQuestions[companyName];
      skippedCount++;
      console.log(`✗ Skipped ${companyName}: No questions found`);
    }
  }
  
  // Generate the JavaScript file
  const jsContent = `// Auto-generated company questions from LeetCode data
// Generated from ${processedCount} companies with interview questions
export const COMPANY_QUESTIONS = ${JSON.stringify(companyQuestions, null, 2)};

export const COMPANIES = Object.keys(COMPANY_QUESTIONS);
export const QUESTION_TYPES = ["Last 30 Days", "Last 3 Months", "Last 6 Months", "More than 6 Months", "All Questions"];

// Statistics
export const STATS = {
  totalCompanies: ${processedCount},
  totalQuestions: ${Object.values(companyQuestions).reduce((total, company) => 
    total + Object.values(company).flat().length, 0)},
  lastUpdated: "${new Date().toISOString().split('T')[0]}"
};
`;

  const outputPath = path.join(__dirname, '..', 'client', 'src', 'data', 'companyQuestions.js');
  fs.writeFileSync(outputPath, jsContent);
  
  console.log(`\n🎉 SUCCESS!`);
  console.log(`📊 Processed: ${processedCount} companies`);
  console.log(`❌ Skipped: ${skippedCount} companies (no questions)`);
  console.log(`📝 Total questions: ${Object.values(companyQuestions).reduce((total, company) => 
    total + Object.values(company).flat().length, 0)}`);
  console.log(`💾 Output written to: ${outputPath}`);
}

// Run the script
generateCompanyQuestions().catch(console.error);