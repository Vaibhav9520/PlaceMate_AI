import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env vars
dotenv.config({ path: path.join(__dirname, '../.env') });

// Import model
const codingQuestionSchema = new mongoose.Schema({
  topic: { type: String, required: true, index: true },
  title: { type: String, required: true },
  difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], required: true },
  description: { type: String, required: true },
  examples: [{ input: String, output: String, explanation: String }],
  constraints: [String],
  testCases: [{ input: String, expectedOutput: String, hidden: Boolean }],
  questionNumber: { type: Number, required: true }
}, { timestamps: true });

codingQuestionSchema.index({ topic: 1, questionNumber: 1 }, { unique: true });

const CodingQuestion = mongoose.model('CodingQuestion', codingQuestionSchema);

const seedDatabase = async () => {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Read the generated questions
    const questionsPath = path.join(__dirname, '../data/coding-questions.json');
    
    if (!fs.existsSync(questionsPath)) {
      console.log('❌ coding-questions.json not found!');
      console.log('Please run: node server/scripts/generate-coding-questions.js first');
      process.exit(1);
    }

    const questionsData = JSON.parse(fs.readFileSync(questionsPath, 'utf8'));
    
    console.log('📊 Questions loaded from file');
    console.log(`Topics: ${Object.keys(questionsData).length}`);
    console.log(`Total questions: ${Object.values(questionsData).flat().length}\n`);

    // Clear existing questions
    console.log('🗑️  Clearing existing questions...');
    await CodingQuestion.deleteMany({});
    console.log('✅ Existing questions cleared\n');

    // Insert all questions
    let totalInserted = 0;
    
    for (const [topic, questions] of Object.entries(questionsData)) {
      console.log(`📝 Inserting ${questions.length} questions for ${topic}...`);
      
      try {
        await CodingQuestion.insertMany(questions);
        totalInserted += questions.length;
        console.log(`✅ ${topic}: ${questions.length} questions inserted`);
      } catch (error) {
        console.error(`❌ Error inserting ${topic}:`, error.message);
      }
    }

    console.log(`\n✅ Database seeding complete!`);
    console.log(`Total questions inserted: ${totalInserted}`);

    // Verify the data
    console.log('\n🔍 Verifying data...');
    const count = await CodingQuestion.countDocuments();
    const topics = await CodingQuestion.distinct('topic');
    
    console.log(`Total questions in DB: ${count}`);
    console.log(`Topics in DB: ${topics.length}`);
    console.log(`Topics: ${topics.join(', ')}`);

    mongoose.connection.close();
    console.log('\n🎉 Seeding complete!');
    process.exit(0);

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    mongoose.connection.close();
    process.exit(1);
  }
};

seedDatabase();
