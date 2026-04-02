// Unified database interface that works with MongoDB
import mongoose from 'mongoose';

const USE_MONGODB = process.env.USE_MONGODB === 'true';

console.log(`📦 Database mode: ${USE_MONGODB ? 'MongoDB Atlas' : 'File-based (simpleDB) - DEPRECATED'}`);

if (!USE_MONGODB) {
  console.error('❌ File-based database is deprecated. Please set USE_MONGODB=true in .env');
  // Don't exit here, let server.js handle it
}

// Helper to load models
const loadModel = async (modelName) => {
  try {
    const module = await import(`../models_backup/${modelName}.js`);
    return module.default;
  } catch (error) {
    console.error(`Failed to load model ${modelName}:`, error.message);
    throw error;
  }
};

// Database abstraction layer - MongoDB only
export const db = {
  users: {
    find: async (query = {}) => {
      const User = await loadModel('User');
      return await User.find(query).select('-password');
    },
    
    findOne: async (query) => {
      const User = await loadModel('User');
      if (typeof query === 'string') {
        const user = await User.findById(query).select('-password');
        return user ? user.toObject() : null;
      }
      // For login, we need to include password field
      if (query.email && query.includePassword) {
        delete query.includePassword;
        const user = await User.findOne(query).select('+password');
        return user; // Return mongoose document for password comparison
      }
      const user = await User.findOne(query).select('-password');
      return user ? user.toObject() : null;
    },
    
    findById: async (id) => {
      const User = await loadModel('User');
      const user = await User.findById(id).select('-password');
      return user ? user.toObject() : null;
    },
    
    create: async (data) => {
      const User = await loadModel('User');
      return await User.create(data);
    },
    
    update: async (id, data) => {
      const User = await loadModel('User');
      return await User.findByIdAndUpdate(id, data, { new: true }).select('-password');
    }
  },
  
  interviews: {
    find: async (query = {}) => {
      const Interview = await loadModel('Interview');
      return await Interview.find(query).sort({ createdAt: -1 });
    },
    
    findOne: async (query) => {
      const Interview = await loadModel('Interview');
      if (typeof query === 'string') {
        return await Interview.findById(query);
      }
      return await Interview.findOne(query);
    },
    
    findById: async (id) => {
      const Interview = await loadModel('Interview');
      return await Interview.findById(id);
    },
    
    create: async (data) => {
      const Interview = await loadModel('Interview');
      return await Interview.create(data);
    },
    
    update: async (id, data) => {
      const Interview = await loadModel('Interview');
      return await Interview.findByIdAndUpdate(id, data, { new: true });
    },
    
    delete: async (id) => {
      const Interview = await loadModel('Interview');
      return await Interview.findByIdAndDelete(id);
    }
  },
  
  feedback: {
    find: async (query = {}) => {
      const Feedback = await loadModel('Feedback');
      return await Feedback.find(query).sort({ createdAt: -1 });
    },
    
    findOne: async (query) => {
      const Feedback = await loadModel('Feedback');
      if (typeof query === 'string') {
        return await Feedback.findById(query);
      }
      return await Feedback.findOne(query);
    },
    
    findById: async (id) => {
      const Feedback = await loadModel('Feedback');
      return await Feedback.findById(id);
    },
    
    create: async (data) => {
      const Feedback = await loadModel('Feedback');
      return await Feedback.create(data);
    },
    
    delete: async (query) => {
      const Feedback = await loadModel('Feedback');
      if (typeof query === 'string') {
        return await Feedback.findByIdAndDelete(query);
      }
      return await Feedback.findOneAndDelete(query);
    }
  },
  
  // Interview questions from MongoDB collection
  interviewQuestions: {
    getAll: async () => {
      const questionsCollection = mongoose.connection.db.collection('interviewquestions');
      const result = await questionsCollection.findOne({ _id: 'interview-questions-data' });
      return result ? result.data : null;
    },
    
    getByRole: async (role) => {
      const questionsData = await db.interviewQuestions.getAll();
      return questionsData?.jobRoles?.[role] || null;
    },
    
    getRoleQuestions: async (role, type = 'mixed', difficulty = 'medium', count = 5) => {
      const roleData = await db.interviewQuestions.getByRole(role);
      if (!roleData) return [];
      
      let questions = [];
      
      if (type === 'technical' || type === 'mixed') {
        const techQuestions = roleData.technical || [];
        const filteredTech = difficulty === 'all' 
          ? techQuestions 
          : techQuestions.filter(q => q.difficulty === difficulty);
        questions.push(...filteredTech);
      }
      
      if (type === 'hr' || type === 'mixed') {
        const hrQuestions = roleData.hr || [];
        const filteredHr = difficulty === 'all' 
          ? hrQuestions 
          : hrQuestions.filter(q => q.difficulty === difficulty);
        questions.push(...filteredHr);
      }
      
      // Shuffle and return requested count
      const shuffled = questions.sort(() => 0.5 - Math.random());
      return shuffled.slice(0, count);
    }
  },
  
  codingQuestions: {
    find: async (query = {}) => {
      const CodingQuestion = await loadModel('CodingQuestion');
      return await CodingQuestion.find(query);
    },
    
    findByTopic: async (topic, limit = 10) => {
      const CodingQuestion = await loadModel('CodingQuestion');
      return await CodingQuestion.aggregate([
        { $match: { topic: topic } },
        { $sample: { size: limit } }
      ]);
    },
    
    count: async (query = {}) => {
      const CodingQuestion = await loadModel('CodingQuestion');
      return await CodingQuestion.countDocuments(query);
    }
  }
};

export const isMongoDBConnected = () => USE_MONGODB;
