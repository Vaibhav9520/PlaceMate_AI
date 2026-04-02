import mongoose from 'mongoose';

const interviewSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  role: { type: String, default: '' },
  targetRole: { type: String, default: '' },
  level: { type: String, default: '' },
  difficultyLevel: { type: String, default: '' },
  interviewType: { type: String, default: 'mixed' },
  type: {
    type: String,
    default: 'quick'
  },
  techstack: { type: [String], default: [] },
  questions: { type: mongoose.Schema.Types.Mixed, default: [] },
  answers: { type: mongoose.Schema.Types.Mixed, default: [] },
  finalized: { type: Boolean, default: false },
  status: { type: String, default: 'completed' },
  completedAt: { type: String, default: '' }
}, {
  timestamps: true
});

const Interview = mongoose.model('Interview', interviewSchema);

export default Interview;
