import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { userAPI, interviewAPI } from '../services/api';
import { ArrowLeft, User, Award, TrendingUp, Calendar, CheckCircle, Clock, Target } from 'lucide-react';
import { formatDate, formatRelativeTime, calculateProfileCompletion, getInitials } from '../utils/helpers';
import { getUserAchievements, getScoreColor } from '../constants';

const SystemStatus = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [recentInterviews, setRecentInterviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [statsRes, interviewsRes] = await Promise.all([
        userAPI.getStats(),
        interviewAPI.getUserInterviews(user?._id, 5)
      ]);

      if (statsRes.data.success) {
        setStats(statsRes.data.stats);
      }
      if (interviewsRes.data.success) {
        setRecentInterviews(interviewsRes.data.interviews);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const profileCompletion = calculateProfileCompletion(user);
  const achievements = getUserAchievements(user?.totalInterviews || 0);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <img src="/logo.svg" alt="PlaceMate AI" className="h-8 w-8" />
            <h1 className="text-2xl font-bold text-gray-900">PlaceMate AI</h1>
          </div>
          <div className="flex items-center gap-6">
            <button
              onClick={() => navigate('/interview')}
              className="text-gray-700 hover:text-primary font-medium"
            >
              AI Interview
            </button>
            <button
              onClick={() => navigate('/cv-upload')}
              className="text-gray-700 hover:text-primary font-medium"
            >
              Upload CV
            </button>
            <button
              onClick={() => navigate('/system-status')}
              className="text-primary font-medium"
            >
              Profile
            </button>
            <button
              onClick={() => {
                navigate('/sign-in');
              }}
              className="text-gray-700 hover:text-primary font-medium"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto py-8 px-4">
        {/* Profile Overview */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, {user?.name || 'User'}</h1>
          <p className="text-gray-600 mb-6">Monitor your interview performance and track your preparation progress</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Profile Card */}
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 bg-gradient-to-br from-primary to-primary-600 rounded-full flex items-center justify-center text-3xl font-bold text-white relative">
                {getInitials(user?.name)}
                <div className="absolute bottom-0 right-0 w-6 h-6 bg-green-500 rounded-full border-4 border-white"></div>
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">{user?.name || 'User'}</h2>
                <p className="text-sm text-gray-600">{user?.email}</p>
              </div>
            </div>

            {/* Education */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Education</h3>
              <p className="text-gray-900 font-medium">{user?.degree || 'Not provided'}</p>
              <p className="text-sm text-gray-600">{user?.collegeName || 'Add your college'}</p>
            </div>

            {/* Statistics */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Statistics</h3>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">Interviews</span>
                <span className="text-lg font-bold text-primary">{user?.totalInterviews || 5}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Avg Score</span>
                <span className="text-lg font-bold text-blue-600">{user?.averageScore || 0}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-primary">
            <div className="flex items-center justify-between mb-2">
              <div className="p-3 bg-primary/10 rounded-lg">
                <Calendar className="w-6 h-6 text-primary" />
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-1">{user?.totalInterviews || 5}</p>
            <p className="text-sm text-gray-600">Total Interviews</p>
            <p className="text-xs text-gray-500 mt-1">Completed sessions</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between mb-2">
              <div className="p-3 bg-blue-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-1">{user?.averageScore || 0}%</p>
            <p className="text-sm text-gray-600">Average Score</p>
            <p className="text-xs text-gray-500 mt-1">Overall performance</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-orange-500">
            <div className="flex items-center justify-between mb-2">
              <div className="p-3 bg-orange-100 rounded-lg">
                <CheckCircle className="w-6 h-6 text-orange-600" />
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-1">{user?.skills?.length || 1}</p>
            <p className="text-sm text-gray-600">Skills Tracked</p>
            <p className="text-xs text-gray-500 mt-1">From your CV</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between mb-2">
              <div className="p-3 bg-green-100 rounded-lg">
                <Award className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-1">{profileCompletion}%</p>
            <p className="text-sm text-gray-600">Profile Complete</p>
            <p className="text-xs text-gray-500 mt-1">Setup progress</p>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Your Skills */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Your Skills</h2>
            {user?.skills && user.skills.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {user.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 bg-gray-100 text-gray-800 rounded-lg text-sm font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                <span className="px-4 py-2 bg-gray-100 text-gray-800 rounded-lg text-sm font-medium">
                  Git
                </span>
              </div>
            )}
          </div>

          {/* CV Status */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">CV Status</h2>
            <div className="flex items-center gap-3 mb-4">
              <CheckCircle className="w-6 h-6 text-green-600" />
              <div>
                <p className="font-semibold text-gray-900">CV Uploaded</p>
                <p className="text-sm text-gray-600">Your CV is active and being used for personalized interview questions</p>
              </div>
            </div>
            <button
              onClick={() => navigate('/cv-upload')}
              className="w-full py-3 border-2 border-primary text-primary rounded-lg hover:bg-primary/5 transition-all font-medium"
            >
              Update CV
            </button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <button
              onClick={() => navigate('/interview')}
              className="w-full py-4 bg-primary text-white rounded-lg hover:bg-primary-600 transition-all font-semibold text-lg"
            >
              Start New Interview
            </button>
            <button
              onClick={() => navigate('/interview')}
              className="w-full py-4 border-2 border-primary text-primary rounded-lg hover:bg-primary/5 transition-all font-semibold"
            >
              Quick Practice
            </button>
            <button
              onClick={() => navigate('/dashboard')}
              className="w-full py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-semibold"
            >
              View All Interviews
            </button>
          </div>
        </div>

        {/* Two Column Layout - Personal Info & Achievements */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Personal Information */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Personal Information</h2>
            <div className="space-y-3">
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">Full Name</span>
                <span className="font-medium text-gray-900">{user?.name || 'Not provided'}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">Email</span>
                <span className="font-medium text-gray-900">{user?.email}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">Contact</span>
                <span className="font-medium text-gray-900">{user?.contactNumber || 'Not provided'}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">College</span>
                <span className="font-medium text-gray-900">{user?.collegeName || 'Not provided'}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">Degree</span>
                <span className="font-medium text-gray-900">{user?.degree || 'Not provided'}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">Branch</span>
                <span className="font-medium text-gray-900">{user?.branch || 'Not provided'}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-gray-600">Year of Study</span>
                <span className="font-medium text-gray-900">{user?.yearOfStudy || 'Not provided'}</span>
              </div>
            </div>
            <button
              onClick={() => navigate('/profile')}
              className="mt-4 w-full py-2 border border-primary text-primary rounded-lg hover:bg-primary/5 transition-all"
            >
              Edit Profile
            </button>
          </div>

          {/* Achievements */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Achievements</h2>
              {achievements.length > 0 ? (
                <div className="space-y-3">
                  {achievements.map((achievement) => (
                    <div
                      key={achievement.id}
                      className="flex items-center gap-3 p-3 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg"
                    >
                      <span className="text-3xl">{achievement.icon}</span>
                      <div>
                        <p className="font-semibold text-gray-900">{achievement.name}</p>
                        <p className="text-sm text-gray-600">{achievement.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">Complete your first interview to unlock achievements!</p>
              )}
            </div>
          </div>
        </div>

        {/* Recent Interviews - Removed to match screenshot */}
      </div>
    </div>
  );
};

export default SystemStatus;
