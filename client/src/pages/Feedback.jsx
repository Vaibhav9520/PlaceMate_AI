import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { feedbackAPI } from '../services/api';
import { toast } from 'sonner';
import { ArrowLeft, TrendingUp, MessageSquare, Brain, Award, Download, CheckCircle, XCircle, Target, Sparkles, BarChart3 } from 'lucide-react';
import { getScoreColor, getScoreBgColor } from '../constants';
import { formatDate, getScoreMessage, downloadJSON } from '../utils/helpers';

const Feedback = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFeedback();
  }, [id]);

  const loadFeedback = async () => {
    try {
      const response = await feedbackAPI.getById(id);
      if (response.data.success) {
        setFeedback(response.data.feedback);
      }
    } catch (error) {
      console.error('Error loading feedback:', error);
      toast.error('Failed to load feedback');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (feedback) {
      downloadJSON(feedback, `feedback-${id}.json`);
      toast.success('Feedback downloaded successfully');
    }
  };

  const getPerformanceLevel = (score) => {
    if (score >= 85) return { label: 'Excellent', color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200' };
    if (score >= 70) return { label: 'Good', color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200' };
    if (score >= 55) return { label: 'Fair', color: 'text-yellow-600', bg: 'bg-yellow-50', border: 'border-yellow-200' };
    return { label: 'Needs Improvement', color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200' };
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Generating feedback...</p>
        </div>
      </div>
    );
  }

  if (!feedback) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Feedback not found</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-600"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const performanceLevel = getPerformanceLevel(feedback.overallScore);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back to Dashboard</span>
          </button>
        </div>

        {/* Hero Score Card */}
        <div className="relative overflow-hidden bg-gradient-to-br from-primary via-purple-600 to-pink-600 rounded-3xl shadow-2xl p-8 md:p-12 mb-8">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full -ml-48 -mb-48"></div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-6 h-6 text-yellow-300" />
              <span className="text-white/90 font-medium">Interview Performance Report</span>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                  Your Interview Score
                </h1>
                <p className="text-white/80 text-lg mb-6">
                  {formatDate(feedback.createdAt)}
                </p>
                <div className={`inline-flex items-center gap-2 px-4 py-2 ${performanceLevel.bg} ${performanceLevel.border} border-2 rounded-full`}>
                  <Target className={`w-5 h-5 ${performanceLevel.color}`} />
                  <span className={`font-bold ${performanceLevel.color}`}>{performanceLevel.label}</span>
                </div>
              </div>
              
              <div className="flex items-center justify-center">
                <div className="relative">
                  <svg className="w-48 h-48 md:w-64 md:h-64 transform -rotate-90">
                    <circle
                      cx="50%"
                      cy="50%"
                      r="45%"
                      stroke="rgba(255,255,255,0.2)"
                      strokeWidth="12"
                      fill="none"
                    />
                    <circle
                      cx="50%"
                      cy="50%"
                      r="45%"
                      stroke="white"
                      strokeWidth="12"
                      fill="none"
                      strokeDasharray={`${2 * Math.PI * 45 * (feedback.overallScore / 100)} ${2 * Math.PI * 45}`}
                      strokeLinecap="round"
                      className="transition-all duration-1000"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className="text-6xl md:text-7xl font-bold text-white">{feedback.overallScore}</div>
                    <div className="text-2xl text-white/90">/ 100</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Score Breakdown Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 border-t-4 border-blue-500 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-100 rounded-xl">
                <MessageSquare className="w-7 h-7 text-blue-600" />
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-blue-600">{feedback.communicationScore}%</div>
              </div>
            </div>
            <h3 className="font-bold text-gray-900 text-lg mb-1">Communication</h3>
            <p className="text-sm text-gray-600">Clarity & Expression</p>
            <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full transition-all duration-1000"
                style={{ width: `${feedback.communicationScore}%` }}
              />
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border-t-4 border-purple-500 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-100 rounded-xl">
                <Brain className="w-7 h-7 text-purple-600" />
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-purple-600">{feedback.technicalScore}%</div>
              </div>
            </div>
            <h3 className="font-bold text-gray-900 text-lg mb-1">Technical Skills</h3>
            <p className="text-sm text-gray-600">Knowledge & Expertise</p>
            <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-purple-500 h-2 rounded-full transition-all duration-1000"
                style={{ width: `${feedback.technicalScore}%` }}
              />
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border-t-4 border-green-500 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-100 rounded-xl">
                <TrendingUp className="w-7 h-7 text-green-600" />
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-green-600">{feedback.confidenceScore}%</div>
              </div>
            </div>
            <h3 className="font-bold text-gray-900 text-lg mb-1">Confidence</h3>
            <p className="text-sm text-gray-600">Presentation & Poise</p>
            <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-500 h-2 rounded-full transition-all duration-1000"
                style={{ width: `${feedback.confidenceScore}%` }}
              />
            </div>
          </div>
        </div>

        {/* Strengths & Weaknesses */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-green-500">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Strengths</h2>
            </div>
            <ul className="space-y-4">
              {feedback.strengths && feedback.strengths.length > 0 ? (
                feedback.strengths.map((strength, index) => (
                  <li key={index} className="flex items-start gap-3 p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
                    <div className="flex-shrink-0 w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold mt-0.5">
                      ✓
                    </div>
                    <span className="text-gray-800 leading-relaxed">{strength}</span>
                  </li>
                ))
              ) : (
                <li className="text-gray-500 italic">No strengths recorded</li>
              )}
            </ul>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-orange-500">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-orange-100 rounded-lg">
                <XCircle className="w-6 h-6 text-orange-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Areas for Improvement</h2>
            </div>
            <ul className="space-y-4">
              {feedback.weaknesses && feedback.weaknesses.length > 0 ? (
                feedback.weaknesses.map((weakness, index) => (
                  <li key={index} className="flex items-start gap-3 p-3 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors">
                    <div className="flex-shrink-0 w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-bold mt-0.5">
                      !
                    </div>
                    <span className="text-gray-800 leading-relaxed">{weakness}</span>
                  </li>
                ))
              ) : (
                <li className="text-gray-500 italic">No weaknesses recorded</li>
              )}
            </ul>
          </div>
        </div>

        {/* Detailed Analysis */}
        {feedback.detailedAnalysis && (
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-purple-100 rounded-lg">
                <BarChart3 className="w-6 h-6 text-purple-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Detailed Analysis</h2>
            </div>
            <div className="prose max-w-none">
              <p className="text-gray-700 leading-relaxed text-lg whitespace-pre-line">{feedback.detailedAnalysis}</p>
            </div>
          </div>
        )}

        {/* Improvement Suggestions */}
        {feedback.improvementSuggestions && feedback.improvementSuggestions.length > 0 && (
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl shadow-lg p-8 mb-8 border border-blue-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-primary rounded-lg">
                <Award className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Action Plan for Improvement</h2>
            </div>
            <div className="grid gap-4">
              {feedback.improvementSuggestions.map((suggestion, index) => (
                <div key={index} className="flex items-start gap-4 p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-primary to-purple-600 text-white rounded-full flex items-center justify-center text-lg font-bold">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-800 leading-relaxed">{suggestion}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Category Breakdown */}
        {feedback.categoryBreakdown && Object.keys(feedback.categoryBreakdown).length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Performance by Category</h2>
            <div className="space-y-6">
              {Object.entries(feedback.categoryBreakdown).map(([category, score]) => (
                <div key={category} className="group">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-semibold text-gray-900 capitalize text-lg">{category}</span>
                    <span className={`text-2xl font-bold ${getScoreColor(score)}`}>{score}%</span>
                  </div>
                  <div className="relative w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                    <div
                      className={`h-4 rounded-full transition-all duration-1000 ${getScoreBgColor(score)}`}
                      style={{ width: `${score}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={handleDownload}
            className="flex items-center justify-center gap-2 px-6 py-4 bg-white border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all font-medium"
          >
            <Download className="w-5 h-5" />
            Download Report
          </button>
          <button
            onClick={() => navigate('/interview')}
            className="flex-1 px-6 py-4 bg-gradient-to-r from-primary via-purple-600 to-pink-600 text-white rounded-xl hover:shadow-xl transition-all font-bold text-lg"
          >
            Start Another Interview
          </button>
        </div>
      </div>
    </div>
  );
};

export default Feedback;
