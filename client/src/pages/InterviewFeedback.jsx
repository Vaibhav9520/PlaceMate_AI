import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import Button from '../components/ui/Button';
import { 
  ArrowLeft, 
  Star, 
  Target, 
  Award, 
  TrendingUp,
  CheckCircle,
  AlertCircle,
  Lightbulb
} from 'lucide-react';
import { toast } from 'sonner';

const InterviewFeedback = () => {
  const { interviewId } = useParams();
  const navigate = useNavigate();
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFeedback();
  }, [interviewId]);

  const loadFeedback = async () => {
    try {
      console.log('🔍 Loading feedback for interview ID:', interviewId);
      
      // First try to load from localStorage (most recent interview)
      const lastResults = localStorage.getItem('lastInterviewResults');
      if (lastResults) {
        const results = JSON.parse(lastResults);
        console.log('📋 Found interview results in localStorage:', results);
        
        if (results.feedback && (results._id === interviewId || results.id === interviewId || !interviewId)) {
          console.log('✅ Using feedback from localStorage');
          setFeedback(results.feedback);
          setLoading(false);
          return;
        }
      }

      // If not found in localStorage, try to fetch from server
      try {
        console.log('🌐 Attempting to fetch feedback from server...');
        const response = await fetch(`${import.meta.env.VITE_API_URL}/interviews/recent`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const data = await response.json();
          console.log('📊 Server response:', data);
          
          if (data.success && data.interviews && data.interviews.length > 0) {
            // Find the interview by ID or use the most recent one
            const targetInterview = interviewId 
              ? data.interviews.find(i => i._id === interviewId)
              : data.interviews[0];
            
            if (targetInterview && targetInterview.feedback) {
              console.log('✅ Using feedback from server');
              setFeedback(targetInterview.feedback);
              setLoading(false);
              return;
            }
          }
        }
      } catch (serverError) {
        console.error('❌ Server fetch failed:', serverError);
      }

      // If no feedback found anywhere
      console.log('❌ No feedback found');
      toast.error('No feedback available for this interview');
      navigate('/dashboard');
      
    } catch (error) {
      console.error('❌ Error loading feedback:', error);
      toast.error('Failed to load interview feedback');
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBg = (score) => {
    if (score >= 80) return 'bg-green-100';
    if (score >= 60) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#6366F1]"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (!feedback) {
    return (
      <DashboardLayout>
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Feedback Not Available</h1>
            <p className="text-gray-600 mb-6">The feedback for this interview could not be loaded.</p>
            <Button onClick={() => navigate('/dashboard')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
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
          
          <div className="text-sm text-gray-500">
            Interview completed on {new Date(feedback.createdAt).toLocaleDateString()}
          </div>
        </div>

        {/* Overall Score */}
        <Card className="mb-8">
          <CardContent className="p-8">
            <div className="text-center">
              <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full ${getScoreBg(feedback.overallScore)} mb-4`}>
                <span className={`text-3xl font-bold ${getScoreColor(feedback.overallScore)}`}>
                  {feedback.overallScore}%
                </span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Interview Performance</h1>
              <p className="text-gray-600 max-w-2xl mx-auto">
                {feedback.detailedAnalysis}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Score Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-blue-500" />
                  <span className="font-medium text-gray-700">Technical Skills</span>
                </div>
                <span className={`text-2xl font-bold ${getScoreColor(feedback.technicalScore)}`}>
                  {feedback.technicalScore}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${feedback.technicalScore}%` }}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-green-500" />
                  <span className="font-medium text-gray-700">Communication</span>
                </div>
                <span className={`text-2xl font-bold ${getScoreColor(feedback.communicationScore)}`}>
                  {feedback.communicationScore}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${feedback.communicationScore}%` }}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-purple-500" />
                  <span className="font-medium text-gray-700">Confidence</span>
                </div>
                <span className={`text-2xl font-bold ${getScoreColor(feedback.confidenceScore)}`}>
                  {feedback.confidenceScore}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-purple-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${feedback.confidenceScore}%` }}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Strengths */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-700">
                <CheckCircle className="w-5 h-5" />
                Key Strengths
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {feedback.strengths?.map((strength, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-green-800">{strength}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Areas for Improvement */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-orange-700">
                <AlertCircle className="w-5 h-5" />
                Areas for Improvement
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {feedback.weaknesses?.map((weakness, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-orange-50 rounded-lg">
                    <AlertCircle className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-orange-800">{weakness}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Improvement Suggestions */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-700">
              <Lightbulb className="w-5 h-5" />
              Improvement Suggestions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {feedback.improvementSuggestions?.map((suggestion, index) => (
                <div key={index} className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-blue-800">{suggestion}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Question-by-Question Feedback */}
        {feedback.questionFeedback && feedback.questionFeedback.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Question-by-Question Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {feedback.questionFeedback.map((qFeedback, index) => (
                  <div key={index} className="border-l-4 border-gray-300 pl-6 py-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 mb-2">
                          Question {index + 1}: {qFeedback.question}
                        </h4>
                        <div className="flex items-center gap-4 mb-2">
                          <span className={`px-2 py-1 rounded text-sm font-medium ${getScoreBg(qFeedback.score)} ${getScoreColor(qFeedback.score)}`}>
                            Score: {qFeedback.score}%
                          </span>
                          <span className="text-sm text-gray-600">
                            Keywords matched: {qFeedback.matchedKeywords?.length || 0}/{qFeedback.totalKeywords || 0}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg mb-3">
                      <p className="text-sm text-gray-700 font-medium mb-1">Your Answer:</p>
                      <p className="text-sm text-gray-800">{qFeedback.answer}</p>
                    </div>
                    
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <p className="text-sm text-blue-800">{qFeedback.feedback}</p>
                    </div>
                    
                    {qFeedback.matchedKeywords && qFeedback.matchedKeywords.length > 0 && (
                      <div className="mt-3">
                        <p className="text-sm text-gray-600 mb-2">Matched Keywords:</p>
                        <div className="flex flex-wrap gap-2">
                          {qFeedback.matchedKeywords.map((keyword, kIndex) => (
                            <span key={kIndex} className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">
                              {keyword}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="flex justify-center gap-4 mt-8">
          <Button onClick={() => navigate('/personalized-interview')} variant="outline">
            Take Another Interview
          </Button>
          <Button onClick={() => navigate('/dashboard')}>
            Back to Dashboard
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default InterviewFeedback;