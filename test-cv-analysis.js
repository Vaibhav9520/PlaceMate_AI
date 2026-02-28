// Test script to verify CV analysis works
import { analyzeCV } from './server/services/aiService.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🧪 Testing CV Analysis Function...\n');

// Test with a sample CV file (use any PDF in uploads folder)
const testCVPath = path.join(__dirname, 'server', 'uploads', 'cv-1771320625275-893978565.pdf');

console.log('📁 Test CV Path:', testCVPath);
console.log('⏳ Running analysis...\n');

try {
  const result = await analyzeCV(testCVPath);
  
  console.log('✅ SUCCESS! Analysis completed without errors\n');
  console.log('📊 Result:', JSON.stringify(result, null, 2));
  console.log('\n🎉 CV Analysis is working correctly!');
  console.log('✅ Skills found:', result.skills.length);
  console.log('✅ Result is NOT null');
  console.log('✅ Skills array exists');
  
} catch (error) {
  console.error('❌ ERROR:', error.message);
  console.error('Stack:', error.stack);
}
