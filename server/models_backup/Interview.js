import mongoose from 'mongoose';

const interviewSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  role: {
    type: String,
    default: ''
  },
  level: {
    type: String,
    default: ''
  },
  type: {
    type: String,
    enum: ['quick', 'personalized'],
    default: 'quick'
  },
  techstack: {
    type: [String],
    default: []
  },
  questions: {
    type: mongoose.Schema.Types.Mixed,
    default: []
  },
  finalized: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

const Interview = mongoose.model('Interview', interviewSchema);

export default Interview;
