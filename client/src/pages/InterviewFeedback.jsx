import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import DashboardLayout from '../components/DashboardLayout';
import Button from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { ArrowLeft, CheckCircle, TrendingUp, MessageSquare, Brain, Target, Star, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { feedbackAPI } from '../services/api';

const InterviewFeedback = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadFeedback();
  }, [id]);

  const loadFeedback = async () => {
    try {
      console.log('🔍 Loading feedback for interview:', id);

      // Priority 1: feedback passed via navigation state (from dashboard "View Details")
      if (location.state?.feedback) {
        console.log('✅ Using feedback from navigation state');
        setFeedback(location.state.feedback);
        setLoading(false);
        return;
      }

      // Priority 2: "local" - feedback stored directly in localStorage
      if (id === 'local') {
        const directFeedback = localStorage.getItem('directFeedback');
        if (directFeedback) {
          setFeedback(JSON.parse(directFeedback));
          setLoading(false);
          return;
        }
      }

      // Priority 3: Check lastInterviewResults in localStorage (just completed)
      const localResults = localStorage.getItem('lastInterviewResults');
      if (localResults) {
        const results = JSON.parse(localResults);
        const resultId = results._id?.toString();
        if ((resultId === id || id === 'local') && results.feedback) {
          console.log('✅ Found feedback in localStorage');
          setFeedback(results.feedback);
          setLoading(false);
          return;
        }
      }

      // Priority 4: Fetch from API using MongoDB interviewId
      if (id && id !== 'undefined' && id !== 'local') {
        const response = await feedbackAPI.getByInterview(id);
        if (response.data.success) {
          setFeedback(response.data.feedback);
          console.log('✅ Feedback loaded from API');
          setLoading(false);
          return;
        }
      }

      throw new Error('Feedback not found');
    } catch (error) {
      console.error('❌ Error loading feedback:', error);
      setError('Failed to load interview feedback');
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getScoreIcon = (score) => {
    if (score >= 80) return <CheckCircle className="w-5 h-5" />;
    if (score >= 60) return <TrendingUp className="w-5 h-5" />;
    return <AlertCircle className="w-5 h-5" />;
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#6366F1] mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your interview feedback...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error || !feedback) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Feedback Not Available</h2>
            <p className="text-gray-600 mb-4">{error || 'Unable to load interview feedback'}</p>
            <Button onClick={() => navigate('/dashboard')}>
              Back to Dashboard
            </Button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Dashboard</span>
          </button>
          
          <div className="text-right">
            <h1 className="text-2xl font-bold text-gray-900">Interview Feedback</h1>
            <p className="text-gray-600">Detailed analysis of your performance</p>
          </div>
        </div>

        {/* Overall Score Card */}
        <Card className="p-8 mb-8 bg-gradient-to-r from-blue-50 to-purple-50">
          <div className="text-center">
            <div className="w-32 h-32 mx-auto mb-6 relative">
              <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
                <circle
                  cx="60"
                  cy="60"
                  r="50"
                  stroke="#e5e7eb"
                  strokeWidth="8"
                  fill="none"
                />
                <circle
                  cx="60"
                  cy="60"
                  r="50"
                  stroke="#6366f1"
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray={`${(feedback.overallScore / 100) * 314} 314`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900">{feedback.overallScore}%</div>
                  <div className="text-sm text-gray-600">Overall</div>
                </div>
              </div>
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {feedback.overallScore >= 80 ? 'Excellent Performance!' : 
               feedback.overallScore >= 60 ? 'Good Performance!' : 
               'Room for Improvement'}
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {feedback.detailedAnalysis}
            </p>
          </div>
        </Card>

        {/* Score Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Communication</h3>
                  <p className="text-sm text-gray-600">Clarity & Expression</p>
                </div>
              </div>
              <div className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 ${getScoreColor(feedback.communicationScore)}`}>
                {getScoreIcon(feedback.communicationScore)}
                {feedback.communicationScore}%
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${feedback.communicationScore}%` }}
              />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <Brain className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Technical</h3>
                  <p className="text-sm text-gray-600">Knowledge & Skills</p>
                </div>
              </div>
              <div className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 ${getScoreColor(feedback.technicalScore)}`}>
                {getScoreIcon(feedback.technicalScore)}
                {feedback.technicalScore}%
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${feedback.technicalScore}%` }}
              />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <Target className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Confidence</h3>
                  <p className="text-sm text-gray-600">Delivery & Presence</p>
                </div>
              </div>
              <div className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 ${getScoreColor(feedback.confidenceScore)}`}>
                {getScoreIcon(feedback.confidenceScore)}
                {feedback.confidenceScore}%
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${feedback.confidenceScore}%` }}
              />
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Strengths */}
          <Card className="p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-500" />
              Your Strengths
            </h3>
            <div className="space-y-3">
              {feedback.strengths && feedback.strengths.length > 0 ? (
                feedback.strengths.map((strength, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <p className="text-green-800">{strength}</p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 italic">No specific strengths identified</p>
              )}
            </div>
          </Card>

          {/* Areas for Improvement */}
          <Card className="p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-500" />
              Areas for Improvement
            </h3>
            <div className="space-y-3">
              {feedback.weaknesses && feedback.weaknesses.length > 0 ? (
                feedback.weaknesses.map((weakness, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                    <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <p className="text-blue-800">{weakness}</p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 italic">No specific areas for improvement identified</p>
              )}
            </div>
          </Card>
        </div>

        {/* Improvement Suggestions */}
        {feedback.improvementSuggestions && feedback.improvementSuggestions.length > 0 && (
          <Card className="p-6 mt-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Target className="w-5 h-5 text-purple-500" />
              Improvement Suggestions
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {feedback.improvementSuggestions.map((suggestion, index) => (
                <div key={index} className="flex items-start gap-3 p-4 bg-purple-50 rounded-lg">
                  <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-purple-600 text-sm font-medium">{index + 1}</span>
                  </div>
                  <p className="text-purple-800">{suggestion}</p>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Question-by-Question Analysis */}
        {feedback.questionFeedback && feedback.questionFeedback.length > 0 && (
          <Card className="p-6 mt-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Question-by-Question Analysis</h3>
            <div className="space-y-6">
              {feedback.questionFeedback.map((qf, index) => (
                <div key={index} className="border-l-4 border-blue-200 pl-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900">Question {index + 1}</h4>
                    <div className={`px-2 py-1 rounded text-sm font-medium ${getScoreColor(qf.score)}`}>
                      {qf.score}%
                    </div>
                  </div>
                  <p className="text-gray-700 mb-2">{qf.question}</p>
                  <p className="text-sm text-gray-600 mb-2">{qf.feedback}</p>
                  {qf.matchedKeywords && qf.matchedKeywords.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      <span className="text-xs text-gray-500">Keywords matched:</span>
                      {qf.matchedKeywords.map((keyword, kidx) => (
                        <span key={kidx} className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">
                          {keyword}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <Button
            onClick={() => navigate('/general-interview')}
            className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white"
          >
            Take Another Interview
          </Button>
          
          <Button
            onClick={() => navigate('/dashboard')}
            variant="outline"
            className="px-8 py-3"
          >
            Back to Dashboard
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default InterviewFeedback;