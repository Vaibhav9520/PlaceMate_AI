import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { interviewAPI } from '../services/api';
import { toast } from 'sonner';
import { DIFFICULTY_LEVELS, JOB_ROLES, TECH_STACK } from '../constants';
import { ArrowLeft, Briefcase, Target, Code } from 'lucide-react';

const Interview = () => {
  const [formData, setFormData] = useState({
    role: '',
    level: 'intermediate',
    type: 'quick',
    techstack: [],
    questions: []
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleTechStackToggle = (tech) => {
    setFormData(prev => ({
      ...prev,
      techstack: prev.techstack.includes(tech)
        ? prev.techstack.filter(t => t !== tech)
        : [...prev.techstack, tech]
    }));
  };

  const generateQuestions = () => {
    const questionCount = 10;
    const questions = [];
    
    // Generate questions based on role and level
    const baseQuestions = [
      `Tell me about yourself and your experience as a ${formData.role || 'developer'}.`,
      `What are your key strengths that make you suitable for this ${formData.role || 'position'}?`,
      `Describe a challenging project you worked on and how you overcame obstacles.`,
      `How do you stay updated with the latest technologies and industry trends?`,
      `What is your approach to problem-solving in software development?`,
      `Tell me about a time when you had to work under tight deadlines.`,
      `How do you handle code reviews and feedback from team members?`,
      `What are your career goals for the next 2-3 years?`,
      `Describe your experience with team collaboration and communication.`,
      `Why are you interested in this role and what can you bring to the team?`
    ];

    // Add tech-specific questions
    if (formData.techstack.length > 0) {
      formData.techstack.forEach(tech => {
        questions.push(`What is your experience with ${tech}?`);
      });
    }

    // Combine and limit to questionCount
    const allQuestions = [...baseQuestions, ...questions];
    return allQuestions.slice(0, questionCount);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.role) {
      toast.error('Please enter a job role');
      return;
    }

    setLoading(true);

    try {
      const questions = generateQuestions();
      const response = await interviewAPI.create({
        ...formData,
        questions
      });
      
      if (response.data.success) {
        toast.success('Interview created successfully!');
        navigate(`/interview/${response.data.interview.id}`);
      }
    } catch (error) {
      console.error('Error creating interview:', error);
      toast.error('Failed to create interview');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Dashboard</span>
        </button>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Start Quick Interview</h1>
            <p className="text-gray-600">Configure your interview settings and begin practicing</p>
            
            {/* Feature badges */}
            <div className="flex justify-center gap-4 mt-4">
              <div className="flex items-center gap-2 px-4 py-2 bg-green-50 rounded-lg">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-700">Instant Start</span>
                <span className="text-xs text-gray-500">No setup required</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-lg">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-sm text-gray-700">AI Interviewer</span>
                <span className="text-xs text-gray-500">Real-time conversation</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-orange-50 rounded-lg">
                <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                <span className="text-sm text-gray-700">Quick Feedback</span>
                <span className="text-xs text-gray-500">Instant results</span>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Job Role */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                <Briefcase className="w-5 h-5 text-primary" />
                Job Role
              </label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                required
              >
                <option value="">Select a role</option>
                {JOB_ROLES.map(role => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>
            </div>

            {/* Difficulty Level */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                <Target className="w-5 h-5 text-primary" />
                Difficulty Level
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {DIFFICULTY_LEVELS.map(level => (
                  <button
                    key={level.value}
                    type="button"
                    onClick={() => setFormData({ ...formData, level: level.value })}
                    className={`p-4 border-2 rounded-lg text-left transition-all ${
                      formData.level === level.value
                        ? 'border-primary bg-primary/5'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="font-semibold text-gray-900 mb-1">{level.label}</div>
                    <div className="text-sm text-gray-600">{level.description}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Tech Stack */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                <Code className="w-5 h-5 text-primary" />
                Tech Stack (Optional)
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 max-h-64 overflow-y-auto p-2 border border-gray-200 rounded-lg">
                {TECH_STACK.map(tech => (
                  <button
                    key={tech.value}
                    type="button"
                    onClick={() => handleTechStackToggle(tech.value)}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-all ${
                      formData.techstack.includes(tech.value)
                        ? 'bg-primary text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {tech.label}
                  </button>
                ))}
              </div>
              {formData.techstack.length > 0 && (
                <p className="text-sm text-gray-600 mt-2">
                  Selected: {formData.techstack.length} technologies
                </p>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-gradient-to-r from-primary to-primary-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Creating Interview...
                  </span>
                ) : (
                  'Start Interview'
                )}
              </button>
            </div>
          </form>

          {/* Info Box */}
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> The interview will consist of 10 questions based on your selected role, 
              level, and tech stack. You'll have a voice conversation with an AI interviewer.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Interview;
