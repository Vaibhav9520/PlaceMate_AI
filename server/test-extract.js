// Quick test: node test-extract.js <path-to-pdf>
import pdfParse from 'pdf-parse/lib/pdf-parse.js';
import fs from 'fs';

const SKILL_KEYWORDS = [
  ['Java', 'java'],
  ['JavaScript', 'javascript', 'js'],
  ['TypeScript', 'typescript', 'ts'],
  ['Python', 'python'],
  ['C++', 'c++', 'cpp'],
  ['C#', 'c#', 'csharp'],
  ['HTML', 'html'],
  ['CSS', 'css'],
  ['Tailwind CSS', 'tailwind css', 'tailwindcss', 'tailwind'],
  ['Bootstrap', 'bootstrap'],
  ['React.js', 'react.js', 'reactjs', 'react js', 'react'],
  ['Angular', 'angular'],
  ['Vue.js', 'vue.js', 'vuejs', 'vue'],
  ['Next.js', 'next.js', 'nextjs'],
  ['Node.js', 'node.js', 'nodejs', 'node js'],
  ['Express.js', 'express.js', 'expressjs', 'express js', 'express'],
  ['REST APIs', 'rest apis', 'rest api', 'restful'],
  ['MySQL', 'mysql'],
  ['MongoDB', 'mongodb'],
  ['PostgreSQL', 'postgresql', 'postgres'],
  ['Redis', 'redis'],
  ['SQL', 'sql'],
  ['Git', 'git'],
  ['GitHub', 'github'],
  ['Postman', 'postman'],
  ['VS Code', 'vs code', 'vscode'],
  ['Vercel', 'vercel'],
  ['Netlify', 'netlify'],
  ['Render', 'render'],
  ['Docker', 'docker'],
  ['AWS', 'aws'],
  ['Data Structures & Algorithms', 'data structures & algorithms', 'data structures and algorithms', 'dsa'],
  ['OOPs', 'oops', 'oop', 'object oriented', 'object-oriented'],
  ['DBMS', 'dbms', 'database management'],
  ['Responsive Web Design', 'responsive web design', 'responsive design'],
  ['Problem Solving', 'problem solving'],
  ['System Design', 'system design'],
  ['Agile', 'agile'],
  ['Scrum', 'scrum'],
];

const extractSkillsFromText = (text) => {
  const normalized = text.toLowerCase().replace(/\s+/g, ' ');
  const found = new Set();
  for (const entry of SKILL_KEYWORDS) {
    const [displayName, ...variants] = entry;
    for (const variant of variants) {
      const escaped = variant.replace(/[-[\]/{}()*+?.\\^$|]/g, '\\$&');
      const regex = new RegExp('(?:^|[^a-z0-9])' + escaped + '(?:[^a-z0-9]|$)');
      if (regex.test(normalized)) {
        found.add(displayName);
        break;
      }
    }
  }
  return Array.from(found);
};

const filePath = process.argv[2];
if (!filePath) {
  console.log('Usage: node test-extract.js <path-to-pdf>');
  process.exit(1);
}

const buf = fs.readFileSync(filePath);
const data = await pdfParse(buf);
console.log('\n--- Extracted Text (first 500 chars) ---');
console.log(data.text.slice(0, 500));
console.log('\n--- Skills Found ---');
const skills = extractSkillsFromText(data.text);
console.log(skills);
console.log(`\nTotal: ${skills.length} skills`);
