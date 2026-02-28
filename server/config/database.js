// Unified database interface that works with both MongoDB and file-based storage
import { simpleDB } from './simpleDB.js';

const USE_MONGODB = process.env.USE_MONGODB === 'true';

console.log(`📦 Database mode: ${USE_MONGODB ? 'MongoDB Atlas' : 'File-based (simpleDB)'}`);

// Helper to load models only when MongoDB is enabled
const loadModel = async (modelName) => {
  if (!USE_MONGODB) {
    throw new Error('MongoDB is disabled. Set USE_MONGODB=true in .env to use MongoDB.');
  }
  try {
    const module = await import(`../models_backup/${modelName}.js`);
    return module.default;
  } catch (error) {
    console.error(`Failed to load model ${modelName}:`, error.message);
    throw error;
  }
};

// Database abstraction layer - uses simpleDB by default
export const db = {
  users: {
    find: async (query = {}) => {
      if (USE_MONGODB) {
        const User = await loadModel('User');
        return await User.find(query).select('-password');
      }
      // simpleDB implementation
      if (query.email) {
        const user = simpleDB.users.findOne({ email: query.email });
        return user ? [user] : [];
      }
      return simpleDB.users.find();
    },
    
    findOne: async (query) => {
      if (USE_MONGODB) {
        const User = await loadModel('User');
        if (typeof query === 'string') {
          return await User.findById(query).select('-password');
        }
        return await User.findOne(query).select('-password');
      }
      return simpleDB.users.findOne(query);
    },
    
    findById: async (id) => {
      if (USE_MONGODB) {
        const User = await loadModel('User');
        return await User.findById(id).select('-password');
      }
      return simpleDB.users.findOne(id);
    },
    
    create: async (data) => {
      if (USE_MONGODB) {
        const User = await loadModel('User');
        return await User.create(data);
      }
      return simpleDB.users.create(data);
    },
    
    update: async (id, data) => {
      if (USE_MONGODB) {
        const User = await loadModel('User');
        return await User.findByIdAndUpdate(id, data, { new: true }).select('-password');
      }
      return simpleDB.users.update(id, data);
    }
  },
  
  interviews: {
    find: async (query = {}) => {
      if (USE_MONGODB) {
        const Interview = await loadModel('Interview');
        return await Interview.find(query).sort({ createdAt: -1 });
      }
      return simpleDB.interviews.find(query);
    },
    
    findOne: async (query) => {
      if (USE_MONGODB) {
        const Interview = await loadModel('Interview');
        if (typeof query === 'string') {
          return await Interview.findById(query);
        }
        return await Interview.findOne(query);
      }
      return simpleDB.interviews.findOne(query);
    },
    
    findById: async (id) => {
      if (USE_MONGODB) {
        const Interview = await loadModel('Interview');
        return await Interview.findById(id);
      }
      return simpleDB.interviews.findById(id);
    },
    
    create: async (data) => {
      if (USE_MONGODB) {
        const Interview = await loadModel('Interview');
        return await Interview.create(data);
      }
      return simpleDB.interviews.create(data);
    },
    
    update: async (id, data) => {
      if (USE_MONGODB) {
        const Interview = await loadModel('Interview');
        return await Interview.findByIdAndUpdate(id, data, { new: true });
      }
      return simpleDB.interviews.update(id, data);
    },
    
    delete: async (id) => {
      if (USE_MONGODB) {
        const Interview = await loadModel('Interview');
        return await Interview.findByIdAndDelete(id);
      }
      return simpleDB.interviews.delete(id);
    }
  },
  
  feedback: {
    find: async (query = {}) => {
      if (USE_MONGODB) {
        const Feedback = await loadModel('Feedback');
        return await Feedback.find(query).sort({ createdAt: -1 });
      }
      return simpleDB.feedback.find(query);
    },
    
    findOne: async (query) => {
      if (USE_MONGODB) {
        const Feedback = await loadModel('Feedback');
        if (typeof query === 'string') {
          return await Feedback.findById(query);
        }
        return await Feedback.findOne(query);
      }
      return simpleDB.feedback.findOne(query);
    },
    
    findById: async (id) => {
      if (USE_MONGODB) {
        const Feedback = await loadModel('Feedback');
        return await Feedback.findById(id);
      }
      return simpleDB.feedback.findOne(id);
    },
    
    create: async (data) => {
      if (USE_MONGODB) {
        const Feedback = await loadModel('Feedback');
        return await Feedback.create(data);
      }
      return simpleDB.feedback.create(data);
    }
  },
  
  codingQuestions: {
    find: async (query = {}) => {
      if (USE_MONGODB) {
        const CodingQuestion = await loadModel('CodingQuestion');
        return await CodingQuestion.find(query);
      }
      return [];
    },
    
    findByTopic: async (topic, limit = 10) => {
      if (USE_MONGODB) {
        const CodingQuestion = await loadModel('CodingQuestion');
        return await CodingQuestion.aggregate([
          { $match: { topic: topic } },
          { $sample: { size: limit } }
        ]);
      }
      return [];
    },
    
    count: async (query = {}) => {
      if (USE_MONGODB) {
        const CodingQuestion = await loadModel('CodingQuestion');
        return await CodingQuestion.countDocuments(query);
      }
      return 0;
    }
  }
};

export const isMongoDBConnected = () => USE_MONGODB;
