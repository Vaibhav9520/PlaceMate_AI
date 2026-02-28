import mongoose from 'mongoose';

const codingQuestionSchema = new mongoose.Schema({
  topic: {
    type: String,
    required: true,
    index: true
  },
  title: {
    type: String,
    required: true
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    required: true
  },
  description: {
    type: String,
    required: true
  },
  examples: [{
    input: String,
    output: String,
    explanation: String
  }],
  constraints: [String],
  testCases: [{
    input: String,
    expectedOutput: String,
    hidden: Boolean
  }],
  questionNumber: {
    type: Number,
    required: true
  }
}, {
  timestamps: true
});

// Compound index for topic and questionNumber
codingQuestionSchema.index({ topic: 1, questionNumber: 1 }, { unique: true });

const CodingQuestion = mongoose.model('CodingQuestion', codingQuestionSchema);

export default CodingQuestion;
