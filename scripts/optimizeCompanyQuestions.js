const fs = require('fs');
const path = require('path');

// Read the large generated file
const inputPath = path.join(__dirname, '..', 'client', 'src', 'data', 'companyQuestions.js');
const content = fs.readFileSync(inputPath, 'utf8');

// Extract the COMPANY_QUESTIONS object
const match = content.match(/export const COMPANY_QUESTIONS = ({[\s\S]*?});/);
if (!match) {
  console.error('Could not find COMPANY_QUESTIONS in the file');
  process.exit(1);
}

const companyQuestionsData = JSON.parse(match[1]);
const companies = Object.keys(companyQuestionsData);

console.log(`Processing ${companies.length} companies...`);

// Create chunks of companies (50 companies per chunk)
const chunkSize = 50;
const chunks = [];
for (let i = 0; i < companies.length; i += chunkSize) {
  chunks.push(companies.slice(i, i + chunkSize));
}

// Create data directory
const dataDir = path.join(__dirname, '..', 'client', 'src', 'data', 'companies');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Generate chunk files
chunks.forEach((chunk, index) => {
  const chunkData = {};
  chunk.forEach(company => {
    chunkData[company] = companyQuestionsData[company];
  });
  
  const chunkContent = `export const CHUNK_${index} = ${JSON.stringify(chunkData, null, 2)};`;
  const chunkPath = path.join(dataDir, `chunk${index}.js`);
  fs.writeFileSync(chunkPath, chunkContent);
  console.log(`Created chunk ${index} with ${chunk.length} companies`);
});

// Create index file with company list and metadata
const indexContent = `// Optimized company questions index
export const COMPANIES = ${JSON.stringify(companies, null, 2)};

export const QUESTION_TYPES = ["Last 30 Days", "Last 3 Months", "Last 6 Months", "More than 6 Months", "All Questions"];

export const STATS = {
  totalCompanies: ${companies.length},
  totalQuestions: ${Object.values(companyQuestionsData).reduce((total, company) => 
    total + Object.values(company).flat().length, 0)},
  lastUpdated: "${new Date().toISOString().split('T')[0]}",
  totalChunks: ${chunks.length}
};

// Dynamic import function to load company data
export async function loadCompanyData(companyName) {
  const companyIndex = COMPANIES.indexOf(companyName);
  if (companyIndex === -1) {
    throw new Error(\`Company "\${companyName}" not found\`);
  }
  
  const chunkIndex = Math.floor(companyIndex / 50);
  
  try {
    const chunk = await import(\`./companies/chunk\${chunkIndex}.js\`);
    const chunkData = chunk[\`CHUNK_\${chunkIndex}\`];
    
    if (!chunkData[companyName]) {
      throw new Error(\`Company "\${companyName}" not found in chunk \${chunkIndex}\`);
    }
    
    return chunkData[companyName];
  } catch (error) {
    console.error(\`Error loading data for \${companyName}:\`, error);
    throw error;
  }
}

// Get all companies in a chunk
export async function loadChunk(chunkIndex) {
  try {
    const chunk = await import(\`./companies/chunk\${chunkIndex}.js\`);
    return chunk[\`CHUNK_\${chunkIndex}\`];
  } catch (error) {
    console.error(\`Error loading chunk \${chunkIndex}:\`, error);
    throw error;
  }
}
`;

const indexPath = path.join(__dirname, '..', 'client', 'src', 'data', 'companyQuestions.js');
fs.writeFileSync(indexPath, indexContent);

console.log(`\n✅ Optimization complete!`);
console.log(`📁 Created ${chunks.length} chunk files`);
console.log(`📊 Total companies: ${companies.length}`);
console.log(`💾 New index file: ${indexPath}`);
console.log(`🗂️ Chunk files in: ${dataDir}`);