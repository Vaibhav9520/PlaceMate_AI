import { generateDSAQuestions, runCodeWithTests } from '../services/codingService.js';

// @desc    Generate DSA questions
// @route   POST /api/coding/generate-questions
// @access  Private
export const generateQuestions = async (req, res) => {
  try {
    const { topic, count } = req.body;

    if (!topic || !count) {
      return res.status(400).json({ message: 'Topic and count are required' });
    }

    console.log(`🎯 Generating ${count} questions on ${topic}...`);

    const questions = await generateDSAQuestions(topic, count);

    res.json({
      success: true,
      questions,
      count: questions.length
    });
  } catch (error) {
    console.error('Generate questions error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to generate questions',
      error: error.message 
    });
  }
};

// @desc    Run code with test cases
// @route   POST /api/coding/run
// @access  Private
export const runCode = async (req, res) => {
  try {
    const { code, language, questionId, testCases } = req.body;

    if (!code || !language) {
      return res.status(400).json({ message: 'Code and language are required' });
    }

    console.log(`▶️  Running ${language} code...`);

    const result = await runCodeWithTests(code, language, testCases);

    res.json({
      success: true,
      output: result.output,
      testResults: result.testResults,
      executionTime: result.executionTime
    });
  } catch (error) {
    console.error('Run code error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to execute code',
      error: error.message 
    });
  }
};

// @desc    Submit solution
// @route   POST /api/coding/submit
// @access  Private
export const submitSolution = async (req, res) => {
  try {
    const { code, language, questionId } = req.body;
    const userId = req.user._id;

    // Here you can save the submission to database
    // For now, just return success

    res.json({
      success: true,
      message: 'Solution submitted successfully'
    });
  } catch (error) {
    console.error('Submit solution error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to submit solution',
      error: error.message 
    });
  }
};
