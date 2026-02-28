// Migration script to transfer data from JSON files to MongoDB
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import User from './models_backup/User.js';
import Interview from './models_backup/Interview.js';
import Feedback from './models_backup/Feedback.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_PATH = path.join(__dirname, 'data');
const USERS_FILE = path.join(DATA_PATH, 'users.json');
const INTERVIEWS_FILE = path.join(DATA_PATH, 'interviews.json');
const FEEDBACK_FILE = path.join(DATA_PATH, 'feedback.json');

const migrateData = async () => {
  try {
    console.log('🚀 Starting migration to MongoDB Atlas...\n');

    // Connect to MongoDB
    console.log('📡 Connecting to MongoDB Atlas...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB Atlas\n');

    // Clear existing data (optional - comment out if you want to keep existing data)
    console.log('🗑️  Clearing existing data...');
    await User.deleteMany({});
    await Interview.deleteMany({});
    await Feedback.deleteMany({});
    console.log('✅ Existing data cleared\n');

    // Migrate Users
    if (fs.existsSync(USERS_FILE)) {
      console.log('👥 Migrating users...');
      const users = JSON.parse(fs.readFileSync(USERS_FILE, 'utf8'));
      const userIdMap = {}; // Map old IDs to new MongoDB IDs

      for (const user of users) {
        const oldId = user._id;
        delete user._id; // Remove old ID
        
        // Create new user in MongoDB
        const newUser = await User.create(user);
        userIdMap[oldId] = newUser._id;
        console.log(`  ✓ Migrated user: ${newUser.email}`);
      }
      console.log(`✅ Migrated ${users.length} users\n`);

      // Migrate Interviews
      if (fs.existsSync(INTERVIEWS_FILE)) {
        console.log('📝 Migrating interviews...');
        const interviews = JSON.parse(fs.readFileSync(INTERVIEWS_FILE, 'utf8'));
        const interviewIdMap = {}; // Map old IDs to new MongoDB IDs

        for (const interview of interviews) {
          const oldId = interview._id;
          delete interview._id;
          
          // Update userId to new MongoDB ID
          if (userIdMap[interview.userId]) {
            interview.userId = userIdMap[interview.userId];
          }

          const newInterview = await Interview.create(interview);
          interviewIdMap[oldId] = newInterview._id;
          console.log(`  ✓ Migrated interview: ${newInterview.role || 'General'}`);
        }
        console.log(`✅ Migrated ${interviews.length} interviews\n`);

        // Migrate Feedback
        if (fs.existsSync(FEEDBACK_FILE)) {
          console.log('💬 Migrating feedback...');
          const feedbacks = JSON.parse(fs.readFileSync(FEEDBACK_FILE, 'utf8'));

          for (const feedback of feedbacks) {
            delete feedback._id;
            
            // Update userId and interviewId to new MongoDB IDs
            if (userIdMap[feedback.userId]) {
              feedback.userId = userIdMap[feedback.userId];
            }
            if (interviewIdMap[feedback.interviewId]) {
              feedback.interviewId = interviewIdMap[feedback.interviewId];
            }

            await Feedback.create(feedback);
            console.log(`  ✓ Migrated feedback`);
          }
          console.log(`✅ Migrated ${feedbacks.length} feedbacks\n`);
        }
      }
    } else {
      console.log('ℹ️  No data files found to migrate\n');
    }

    console.log('🎉 Migration completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`   Users: ${await User.countDocuments()}`);
    console.log(`   Interviews: ${await Interview.countDocuments()}`);
    console.log(`   Feedbacks: ${await Feedback.countDocuments()}`);
    console.log('\n✅ You can now start the server with MongoDB enabled');
    console.log('   Set USE_MONGODB=true in your .env file\n');

  } catch (error) {
    console.error('❌ Migration failed:', error);
  } finally {
    await mongoose.connection.close();
    console.log('👋 Disconnected from MongoDB');
    process.exit(0);
  }
};

// Run migration
migrateData();
