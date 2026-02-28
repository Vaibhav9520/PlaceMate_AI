import mongoose from 'mongoose';

const feedbackSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  interviewId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Interview',
    required: true
  },
  overallScore: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  communicationScore: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  technicalScore: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  confidenceScore: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  strengths: {
    type: [String],
    default: []
  },
  weaknesses: {
    type: [String],
    default: []
  },
  detailedAnalysis: {
    type: String,
    default: ''
  },
  improvementSuggestions: {
    type: [String],
    default: []
  },
  answers: {
    type: mongoose.Schema.Types.Mixed,
    default: []
  },
  categoryBreakdown: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  }
}, {
  timestamps: true
});

const Feedback = mongoose.model('Feedback', feedbackSchema);

export default Feedback;
