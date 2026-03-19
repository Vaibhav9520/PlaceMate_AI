import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { userAPI, interviewAPI } from '../services/api';
import DashboardLayout from '../components/DashboardLayout';
import Button from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Check, User, Mail, Code, Target, Clock, Settings } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

const PersonalizedInterview = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState(null);
  const [interviewConfig, setInterviewConfig] = useState({
    interviewType: 'mixed',
    targetRole: '',
    difficultyLevel: 'intermediate',
    numberOfQuestions: '10'
  });
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      const response = await userAPI.getProfile();
      if (response.data.success) {
        setUserProfile(response.data.user);
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      toast.error('Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  const handleConfigChange = (field, value) => {
    setInterviewConfig(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const startPersonalizedInterview = async () => {
    if (!userProfile?.cvURL) {
      toast.error('Please upload your CV first to generate personalized questions');
      return;
    }

    if (!interviewConfig.targetRole) {
      toast.error('Please select a target job role');
      return;
    }

    console.log('🚀 Starting interview generation with config:', interviewConfig);
    setIsGenerating(true);
    
    try {
      console.log('📡 Making API request to generate personalized interview...');
      const response = await userAPI.generateInterview(interviewConfig);
      
      console.log('📥 API Response:', response);
      
      if (response.data.success) {
        toast.success('Personalized interview generated successfully!');
        
        // Store interview data in localStorage for the interview session
        localStorage.setItem('currentInterview', JSON.stringify(response.data.interview));
        
        console.log('💾 Interview data stored in localStorage');
        console.log('🎯 Generated questions:', response.data.interview.questions.length);
        
        // Navigate to interview session page
        navigate('/interview-session');
      } else {
        console.log('❌ API returned success: false');
        toast.error('Failed to generate interview');
      }
    } catch (error) {
      console.error('❌ Error generating interview:', error);
      console.error('📊 Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        statusText: error.response?.statusText
      });
      
      const errorMessage = error.response?.data?.message || error.message || 'Failed to generate interview';
      toast.error(errorMessage);
    } finally {
      setIsGenerating(false);
    }
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

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Resume-Based AI Interview
          </h1>
          <p className="text-gray-600 text-lg">
            Interview questions tailored to your CV, skills, and experience level
          </p>
        </div>

        {/* Features Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">CV-Based Questions</h3>
            <p className="text-sm text-gray-600">Questions based on your resume content</p>
          </div>
          
          <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Target className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Role-Specific</h3>
            <p className="text-sm text-gray-600">Tailored to your target position</p>
          </div>
          
          <div className="text-center p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Settings className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Smart Analysis</h3>
            <p className="text-sm text-gray-600">AI analyzes your skills and experience</p>
          </div>
          
          <div className="text-center p-6 bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="w-8 h-8 text-orange-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Detailed Feedback</h3>
            <p className="text-sm text-gray-600">Comprehensive performance analysis</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Profile Summary */}
          <Card className="p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <User className="w-6 h-6 text-blue-600" />
              Your Profile Summary
            </h2>
            
            <div className="space-y-6">
              {/* Personal Details */}
              <div>
                <h3 className="font-medium text-gray-900 mb-3">Personal Details</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <User className="w-5 h-5 text-gray-500" />
                    <span className="text-gray-700 font-medium">{userProfile?.name || 'Name not available'}</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Mail className="w-5 h-5 text-gray-500" />
                    <span className="text-gray-700">{userProfile?.email || 'Email not available'}</span>
                  </div>
                </div>
              </div>

              {/* Skills */}
              <div>
                <h3 className="font-medium text-gray-900 mb-3">Skills from CV</h3>
                {userProfile?.skills && userProfile.skills.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {userProfile.skills.slice(0, 8).map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-2 bg-blue-100 text-blue-800 rounded-lg text-sm font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                    {userProfile.skills.length > 8 && (
                      <span className="px-3 py-2 bg-gray-100 text-gray-600 rounded-lg text-sm">
                        +{userProfile.skills.length - 8} more
                      </span>
                    )}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm bg-gray-50 p-4 rounded-lg">No skills extracted from CV</p>
                )}
              </div>

              {/* Status Indicators */}
              <div className="space-y-3 pt-4 border-t">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm font-medium text-green-800">CV Status</span>
                  </div>
                  <span className="text-sm text-green-700 font-medium">
                    {userProfile?.cvURL ? 'Uploaded ✓' : 'Not Uploaded'}
                  </span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="text-sm font-medium text-blue-800">Total Interviews</span>
                  </div>
                  <span className="text-sm text-blue-700 font-medium">
                    {userProfile?.totalInterviews || 0}
                  </span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                    <span className="text-sm font-medium text-purple-800">Skills Extracted</span>
                  </div>
                  <span className="text-sm text-purple-700 font-medium">
                    {userProfile?.skills?.length || 0}
                  </span>
                </div>
              </div>
            </div>
          </Card>

          {/* Interview Configuration */}
          <Card className="p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <Settings className="w-6 h-6 text-blue-600" />
              Interview Configuration
            </h2>
            
            <div className="space-y-6">
              {/* Interview Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Interview Type
                </label>
                <select
                  value={interviewConfig.interviewType}
                  onChange={(e) => handleConfigChange('interviewType', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="mixed">Mixed (Technical + HR)</option>
                  <option value="technical">Technical Only</option>
                  <option value="behavioral">HR/Behavioral Only</option>
                </select>
                <p className="text-xs text-gray-500 mt-2">
                  {interviewConfig.interviewType === 'mixed' && 'Combination of technical and behavioral questions'}
                  {interviewConfig.interviewType === 'technical' && 'Focus on technical skills and problem-solving'}
                  {interviewConfig.interviewType === 'behavioral' && 'Focus on soft skills and behavioral questions'}
                </p>
              </div>

              {/* Target Job Role */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Target Job Role
                </label>
                <select
                  value={interviewConfig.targetRole}
                  onChange={(e) => handleConfigChange('targetRole', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select a role</option>
                  <option value="software-engineer">Software Engineer</option>
                  <option value="frontend-developer">Frontend Developer</option>
                  <option value="backend-developer">Backend Developer</option>
                  <option value="fullstack-developer">Full Stack Developer</option>
                  <option value="devops-engineer">DevOps Engineer</option>
                  <option value="data-scientist">Data Scientist</option>
                  <option value="ml-engineer">Machine Learning Engineer</option>
                  <option value="mobile-developer">Mobile Developer</option>
                  <option value="qa-engineer">QA Engineer</option>
                  <option value="product-manager">Product Manager</option>
                  <option value="ui-ux-designer">UI/UX Designer</option>
                  <option value="system-architect">System Architect</option>
                  <option value="database-administrator">Database Administrator</option>
                  <option value="cloud-engineer">Cloud Engineer</option>
                  <option value="security-engineer">Security Engineer</option>
                </select>
              </div>

              {/* Difficulty Level */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Experience Level
                </label>
                <select
                  value={interviewConfig.difficultyLevel}
                  onChange={(e) => handleConfigChange('difficultyLevel', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="beginner">Entry Level (0-1 years)</option>
                  <option value="intermediate">Intermediate (1-3 years)</option>
                  <option value="advanced">Advanced (3-5 years)</option>
                  <option value="expert">Expert (5+ years)</option>
                </select>
              </div>

              {/* Number of Questions */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Interview Duration
                </label>
                <select
                  value={interviewConfig.numberOfQuestions}
                  onChange={(e) => handleConfigChange('numberOfQuestions', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="5">5 Questions (~10 minutes)</option>
                  <option value="10">10 Questions (~20 minutes)</option>
                  <option value="15">15 Questions (~30 minutes)</option>
                  <option value="20">20 Questions (~40 minutes)</option>
                </select>
              </div>
            </div>
          </Card>
        </div>

        {/* Skills from CV Section */}
        {userProfile?.skills && userProfile.skills.length > 0 && (
          <Card className="p-6 mt-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Skills (from CV)</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {userProfile.skills.map((skill, index) => (
                <div
                  key={index}
                  className="px-3 py-2 bg-gray-100 text-gray-800 rounded-lg text-sm text-center"
                >
                  {skill}
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Start Interview Button */}
        <div className="text-center mt-10">
          {!userProfile?.cvURL ? (
            <div className="mb-6">
              <div className="p-6 bg-red-50 rounded-xl border border-red-200 mb-4">
                <h3 className="text-lg font-semibold text-red-800 mb-2">CV Required</h3>
                <p className="text-red-600 mb-4">Please upload your CV first to generate personalized questions based on your experience and skills.</p>
                <Button
                  onClick={() => window.location.href = '/cv-upload'}
                  variant="outline"
                  className="bg-white border-red-300 text-red-700 hover:bg-red-50"
                >
                  Upload CV First
                </Button>
              </div>
            </div>
          ) : (
            <Button
              onClick={startPersonalizedInterview}
              disabled={isGenerating || !interviewConfig.targetRole}
              className="px-12 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
            >
              {isGenerating ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                  Generating Personalized Interview...
                </>
              ) : (
                'Start Resume-Based Interview'
              )}
            </Button>
          )}
          
          {!interviewConfig.targetRole && userProfile?.cvURL && (
            <p className="text-red-600 text-sm mt-3 bg-red-50 p-3 rounded-lg">
              Please select a target job role to continue
            </p>
          )}
          
          <div className="mt-6 text-center">
            <p className="text-gray-500 text-sm">
              The interview will consist of {interviewConfig.numberOfQuestions} questions 
              based on your CV and selected role
            </p>
            <p className="text-gray-500 text-sm mt-1">
              Questions will be tailored to your skills: {userProfile?.skills?.slice(0, 3).join(', ')}
              {userProfile?.skills?.length > 3 && ` and ${userProfile.skills.length - 3} more`}
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default PersonalizedInterview;