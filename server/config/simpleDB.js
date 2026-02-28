// Simple file-based database for development without MongoDB
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DB_PATH = path.join(__dirname, '../data');
const USERS_FILE = path.join(DB_PATH, 'users.json');
const INTERVIEWS_FILE = path.join(DB_PATH, 'interviews.json');
const FEEDBACK_FILE = path.join(DB_PATH, 'feedback.json');

// Create data directory if it doesn't exist
if (!fs.existsSync(DB_PATH)) {
  fs.mkdirSync(DB_PATH, { recursive: true });
}

// Initialize files if they don't exist
const initFile = (filePath) => {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify([], null, 2));
  }
};

initFile(USERS_FILE);
initFile(INTERVIEWS_FILE);
initFile(FEEDBACK_FILE);

// Simple database operations
export const simpleDB = {
  users: {
    find: (query = {}) => {
      const users = JSON.parse(fs.readFileSync(USERS_FILE, 'utf8'));
      if (Object.keys(query).length === 0) {
        return users;
      }
      // Handle query filtering
      return users.filter(user => {
        for (let key in query) {
          if (user[key] !== query[key]) return false;
        }
        return true;
      });
    },
    findOne: (query) => {
      const users = JSON.parse(fs.readFileSync(USERS_FILE, 'utf8'));
      if (typeof query === 'string') {
        // If query is a string, treat it as ID
        return users.find(user => user._id === query);
      }
      return users.find(user => {
        if (query.email) return user.email === query.email;
        if (query._id) return user._id === query._id;
        return false;
      });
    },
    findById: (id) => {
      const users = JSON.parse(fs.readFileSync(USERS_FILE, 'utf8'));
      return users.find(user => user._id === id);
    },
    create: (data) => {
      const users = JSON.parse(fs.readFileSync(USERS_FILE, 'utf8'));
      const newUser = {
        _id: Date.now().toString(),
        ...data,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      users.push(newUser);
      fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
      return newUser;
    },
    update: (id, data) => {
      const users = JSON.parse(fs.readFileSync(USERS_FILE, 'utf8'));
      const index = users.findIndex(u => u._id === id);
      if (index !== -1) {
        users[index] = { ...users[index], ...data, updatedAt: new Date().toISOString() };
        fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
        return users[index];
      }
      return null;
    }
  },
  interviews: {
    find: (query = {}) => {
      const interviews = JSON.parse(fs.readFileSync(INTERVIEWS_FILE, 'utf8'));
      if (query.userId) {
        return interviews.filter(i => i.userId === query.userId);
      }
      return interviews;
    },
    findOne: (id) => {
      const interviews = JSON.parse(fs.readFileSync(INTERVIEWS_FILE, 'utf8'));
      if (typeof id === 'string') {
        return interviews.find(i => i._id === id);
      }
      return interviews.find(i => i._id === id._id);
    },
    findById: (id) => {
      const interviews = JSON.parse(fs.readFileSync(INTERVIEWS_FILE, 'utf8'));
      return interviews.find(i => i._id === id);
    },
    create: (data) => {
      const interviews = JSON.parse(fs.readFileSync(INTERVIEWS_FILE, 'utf8'));
      const newInterview = {
        _id: Date.now().toString(),
        ...data,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      interviews.push(newInterview);
      fs.writeFileSync(INTERVIEWS_FILE, JSON.stringify(interviews, null, 2));
      return newInterview;
    },
    update: (id, data) => {
      const interviews = JSON.parse(fs.readFileSync(INTERVIEWS_FILE, 'utf8'));
      const index = interviews.findIndex(i => i._id === id);
      if (index !== -1) {
        interviews[index] = { ...interviews[index], ...data, updatedAt: new Date().toISOString() };
        fs.writeFileSync(INTERVIEWS_FILE, JSON.stringify(interviews, null, 2));
        return interviews[index];
      }
      return null;
    },
    delete: (id) => {
      const interviews = JSON.parse(fs.readFileSync(INTERVIEWS_FILE, 'utf8'));
      const filteredInterviews = interviews.filter(i => i._id !== id);
      fs.writeFileSync(INTERVIEWS_FILE, JSON.stringify(filteredInterviews, null, 2));
      return true;
    }
  },
  feedback: {
    find: (query = {}) => {
      const feedbacks = JSON.parse(fs.readFileSync(FEEDBACK_FILE, 'utf8'));
      if (query.userId) {
        return feedbacks.filter(f => f.userId === query.userId);
      }
      if (query.interviewId) {
        return feedbacks.filter(f => f.interviewId === query.interviewId);
      }
      return feedbacks;
    },
    findOne: (id) => {
      const feedbacks = JSON.parse(fs.readFileSync(FEEDBACK_FILE, 'utf8'));
      if (typeof id === 'string') {
        return feedbacks.find(f => f._id === id);
      }
      return feedbacks.find(f => f._id === id._id);
    },
    create: (data) => {
      const feedbacks = JSON.parse(fs.readFileSync(FEEDBACK_FILE, 'utf8'));
      const newFeedback = {
        _id: Date.now().toString(),
        ...data,
        createdAt: new Date().toISOString()
      };
      feedbacks.push(newFeedback);
      fs.writeFileSync(FEEDBACK_FILE, JSON.stringify(feedbacks, null, 2));
      return newFeedback;
    }
  }
};

export const connectSimpleDB = () => {
  console.log('Simple File Database Connected');
  console.log(`Data stored in: ${DB_PATH}`);
  return Promise.resolve();
};
