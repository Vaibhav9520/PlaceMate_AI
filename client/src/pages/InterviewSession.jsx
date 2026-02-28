import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { interviewAPI, feedbackAPI } from '../services/api';
import BrowserVoiceInterview from '../components/BrowserVoiceInterview';
import TextInterview from '../components/TextInterview';
import { toast } from 'sonner';
import { ArrowLeft, Mic, MessageSquare } from 'lucide-react';

const InterviewSession = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [interview, setInterview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [interviewMode, setInterviewMode] = useState(null); // 'voice' or 'text'

  useEffect(() => {
    loadInterview();
  }, [id]);

  const loadInterview = async () => {
    try {
      const response = await interviewAPI.getById(id);
      if (response.data.success) {
        setInterview(response.data.interview);
      }
    } catch (error) {
      console.error('Error loading interview:', error);
      toast.error('Failed to load interview');
    } finally {
      setLoading(false);
    }
  };

  const handleInterviewComplete = async (data) => {
    try {
      toast.loading('Generating feedback...');
      
      // Extract answers from transcript
      const answers = data.transcript
        .filter(entry => entry.role === 'user')
        .map(entry => entry.content);

      // Generate feedback
      const response = await feedbackAPI.create({
        interviewId: id,
        answers,
        questions: interview.questions
      });

      if (response.data.success) {
        toast.success('Feedback generated successfully!');
        // Navigate to feedback page
        navigate(`/feedback/${response.data.feedback.id}`);
      }
    } catch (error) {
      console.error('Error generating feedback:', error);
      toast.error('Failed to generate feedback');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading interview...</p>
        </div>
      </div>
    );
  }

  if (!interview) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Interview not found</p>
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

  // Mode selection screen
  if (!interviewMode) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors group"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              <span className="font-medium">Back to Dashboard</span>
            </button>
            
            {/* Interview Info Card */}
            <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-100">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium mb-4">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                    Ready to Start
                  </div>
                  <h1 className="text-4xl font-bold text-gray-900 mb-3">
                    {interview.role || 'Interview Session'}
                  </h1>
                  <div className="flex flex-wrap gap-3">
                    <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-lg">
                      <span className="text-sm font-medium text-gray-600">Level:</span>
                      <span className="text-sm font-bold text-blue-700 capitalize">{interview.level}</span>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 bg-purple-50 rounded-lg">
                      <span className="text-sm font-medium text-gray-600">Type:</span>
                      <span className="text-sm font-bold text-purple-700 capitalize">{interview.type}</span>
                    </div>
                    {interview.techstack && interview.techstack.length > 0 && (
                      <div className="flex items-center gap-2 px-4 py-2 bg-green-50 rounded-lg">
                        <span className="text-sm font-medium text-gray-600">Stack:</span>
                        <div className="flex gap-1">
                          {interview.techstack.slice(0, 3).map((tech, index) => (
                            <span key={index} className="text-sm font-bold text-green-700 capitalize">
                              {tech}{index < Math.min(interview.techstack.length - 1, 2) ? ',' : ''}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Mode Selection */}
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              Choose Your Interview Mode
            </h2>
            <p className="text-lg text-gray-600">
              Select the format that works best for you
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Voice Interview Option */}
            <div 
              onClick={() => setInterviewMode('voice')}
              className="group relative bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer overflow-hidden border-2 border-transparent hover:border-primary"
            >
              {/* Recommended Badge */}
              <div className="absolute top-4 right-4 z-10">
                <div className="flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-yellow-400 to-orange-400 text-white rounded-full text-xs font-bold shadow-lg">
                  <span>⭐</span>
                  <span>RECOMMENDED</span>
                </div>
              </div>

              {/* Gradient Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-purple-50/50 to-pink-50/30 opacity-0 group-hover:opacity-100 transition-opacity"></div>

              <div className="relative p-8">
                {/* Icon */}
                <div className="w-20 h-20 bg-gradient-to-br from-primary to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform shadow-lg">
                  <Mic className="w-10 h-10 text-white" />
                </div>

                {/* Title */}
                <h3 className="text-2xl font-bold text-gray-900 mb-3 text-center">
                  Voice Interview
                </h3>
                <p className="text-gray-600 text-center mb-6">
                  Natural conversation with AI using speech recognition
                </p>

                {/* Features */}
                <div className="space-y-3 mb-8">
                  <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-sm">✓</span>
                    </div>
                    <span className="text-sm text-gray-700 font-medium">Real-time speech recognition</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-sm">✓</span>
                    </div>
                    <span className="text-sm text-gray-700 font-medium">Natural conversation flow</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                    <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-sm">✓</span>
                    </div>
                    <span className="text-sm text-gray-700 font-medium">Works in Chrome browser</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
                    <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-sm">✓</span>
                    </div>
                    <span className="text-sm text-gray-700 font-medium">No setup required</span>
                  </div>
                </div>

                {/* Button */}
                <button className="w-full py-4 bg-gradient-to-r from-primary via-purple-600 to-pink-600 text-white rounded-xl font-bold text-lg hover:shadow-xl transition-all group-hover:scale-105">
                  Start Voice Interview
                </button>
              </div>
            </div>

            {/* Text Interview Option */}
            <div 
              onClick={() => setInterviewMode('text')}
              className="group relative bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer overflow-hidden border-2 border-transparent hover:border-blue-500"
            >
              {/* Gradient Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-cyan-50/30 to-teal-50/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>

              <div className="relative p-8">
                {/* Icon */}
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform shadow-lg">
                  <MessageSquare className="w-10 h-10 text-white" />
                </div>

                {/* Title */}
                <h3 className="text-2xl font-bold text-gray-900 mb-3 text-center">
                  Text Interview
                </h3>
                <p className="text-gray-600 text-center mb-6">
                  Type your answers with voice input option
                </p>

                {/* Features */}
                <div className="space-y-3 mb-8">
                  <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-sm">✓</span>
                    </div>
                    <span className="text-sm text-gray-700 font-medium">Type or speak your answers</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-cyan-50 rounded-lg">
                    <div className="w-6 h-6 bg-cyan-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-sm">✓</span>
                    </div>
                    <span className="text-sm text-gray-700 font-medium">Edit before submitting</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-teal-50 rounded-lg">
                    <div className="w-6 h-6 bg-teal-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-sm">✓</span>
                    </div>
                    <span className="text-sm text-gray-700 font-medium">Take your time</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-indigo-50 rounded-lg">
                    <div className="w-6 h-6 bg-indigo-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-sm">✓</span>
                    </div>
                    <span className="text-sm text-gray-700 font-medium">Alternative option</span>
                  </div>
                </div>

                {/* Button */}
                <button className="w-full py-4 bg-gradient-to-r from-blue-500 to-cyan-600 text-white rounded-xl font-bold text-lg hover:shadow-xl transition-all group-hover:scale-105">
                  Start Text Interview
                </button>
              </div>
            </div>
          </div>

          {/* Help Text */}
          <div className="mt-10 text-center">
            <p className="text-sm text-gray-500">
              💡 Tip: Voice interview provides a more realistic experience, while text interview gives you more control
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => setInterviewMode(null)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Change Interview Mode</span>
          </button>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {interview.role || 'Interview Session'}
            </h1>
            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <span className="font-semibold">Mode:</span>
                <span className="px-3 py-1 bg-primary text-white rounded-full capitalize">
                  {interviewMode} Interview
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold">Level:</span>
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full capitalize">
                  {interview.level}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold">Type:</span>
                <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full capitalize">
                  {interview.type}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Interview Component */}
        {interviewMode === 'voice' ? (
          <BrowserVoiceInterview
            questions={interview.questions || []}
            onComplete={handleInterviewComplete}
            interviewId={id}
          />
        ) : (
          <TextInterview
            questions={interview.questions || []}
            onComplete={handleInterviewComplete}
            interviewId={id}
          />
        )}
      </div>
    </div>
  );
};

export default InterviewSession;
