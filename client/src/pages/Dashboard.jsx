import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { userAPI, interviewAPI } from '../services/api';
import { toast } from 'sonner';
import InterviewCard from '../components/InterviewCard';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { TrendingUp, Target, Award, User, Code } from 'lucide-react';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [stats, setStats] = useState(null);
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [statsRes, interviewsRes] = await Promise.all([
        userAPI.getStats(),
        interviewAPI.getUserInterviews(user.id, 5)
      ]);

      if (statsRes.data.success) {
        setStats(statsRes.data.stats);
      }

      if (interviewsRes.data.success) {
        setInterviews(interviewsRes.data.interviews);
      }
    } catch (error) {
      console.error('Error loading dashboard:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteInterview = async (interviewId) => {
    try {
      const response = await interviewAPI.delete(interviewId);
      if (response.data.success) {
        // Remove from local state
        setInterviews(interviews.filter(interview => interview.id !== interviewId));
        // Reload stats
        const statsRes = await userAPI.getStats();
        if (statsRes.data.success) {
          setStats(statsRes.data.stats);
        }
      }
    } catch (error) {
      console.error('Error deleting interview:', error);
      throw error;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
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
            <Link to="/interview" className="text-gray-700 hover:text-primary font-medium">
              AI Interview
            </Link>
            <Link to="/cv-upload" className="text-gray-700 hover:text-primary font-medium">
              Upload CV
            </Link>
            <Link to="/system-status" className="text-gray-700 hover:text-primary font-medium">
              Profile
            </Link>
            <button
              onClick={logout}
              className="px-4 py-2 text-gray-700 hover:text-primary font-medium"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8 bg-gradient-to-br from-teal-50 to-blue-50 rounded-2xl p-8">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h2 className="text-lg text-primary font-semibold mb-3">Welcome back, {user?.name}</h2>
              <h1 className="text-5xl font-bold text-gray-900 mb-4">
                Prepare Smarter for Interviews
              </h1>
              <p className="text-lg text-gray-600 max-w-2xl mb-6">
                Practice real interview questions, get instant feedback, and improve your technical 
                and communication skills with AI guidance.
              </p>
              <Link
                to="/interview"
                className="inline-block px-8 py-4 bg-primary text-white rounded-lg font-semibold hover:bg-primary-600 transition-all shadow-lg text-lg"
              >
                Quick Practice
              </Link>
            </div>
            <div className="flex-shrink-0 ml-8">
              <img src="/robot.png" alt="AI Robot" className="w-72 h-72 object-contain" />
            </div>
          </div>
        </div>

        {/* Progress Section */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Progress</h3>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Interviews</p>
                <p className="text-3xl font-bold text-gray-900">{stats?.totalInterviews || 0}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Average Score</p>
                <p className="text-3xl font-bold text-gray-900">{stats?.averageScore || 0}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-primary">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Total Interviews</p>
                <p className="text-3xl font-bold text-gray-900">{stats?.totalInterviews || 0}</p>
                <p className="text-xs text-gray-500 mt-1">Completed sessions</p>
              </div>
              <Target className="w-10 h-10 text-primary opacity-20" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Average Score</p>
                <p className="text-3xl font-bold text-gray-900">{stats?.averageScore || 0}%</p>
                <p className="text-xs text-gray-500 mt-1">Overall performance</p>
              </div>
              <TrendingUp className="w-10 h-10 text-blue-500 opacity-20" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-orange-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Skills</p>
                <p className="text-3xl font-bold text-gray-900">{stats?.skillsCount || 1}</p>
                <p className="text-xs text-gray-500 mt-1">From your CV</p>
              </div>
              <Award className="w-10 h-10 text-orange-500 opacity-20" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Active</p>
                <p className="text-3xl font-bold text-gray-900">CV Status</p>
                <p className="text-xs text-green-600 mt-1">Setup progress</p>
              </div>
              <User className="w-10 h-10 text-green-500 opacity-20" />
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link
              to="/interview"
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-all border-2 border-transparent hover:border-primary"
            >
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Quick Practice</h4>
              <p className="text-sm text-gray-600">Quick practice session without setup</p>
            </Link>

            <Link
              to="/personalized-interview"
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-all border-2 border-transparent hover:border-primary"
            >
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Target className="w-6 h-6 text-primary" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">CV-Based Interview</h4>
              <p className="text-sm text-gray-600">Personalized questions based on your CV</p>
            </Link>

            <Link
              to="/coding-practice"
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-all border-2 border-transparent hover:border-primary"
            >
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <Code className="w-6 h-6 text-purple-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">DSA Coding Practice</h4>
              <p className="text-sm text-gray-600">Solve coding problems with online compiler</p>
            </Link>
          </div>
        </div>

        {/* Recent Interviews */}
        <Card id="recent-interviews">
          <CardHeader>
            <CardTitle>Recent Interviews</CardTitle>
          </CardHeader>
          <CardContent>
            {interviews.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {interviews.map((interview) => (
                  <InterviewCard 
                    key={interview.id} 
                    interview={interview}
                    onDelete={handleDeleteInterview}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <img src="/robot.png" alt="No interviews" className="w-32 h-32 mx-auto mb-4 opacity-50" />
                <p className="text-gray-500 text-lg mb-4">No interviews yet. Start your first one!</p>
                <Link
                  to="/interview"
                  className="inline-block px-6 py-3 bg-primary text-white rounded-md hover:bg-primary-600 transition-colors"
                >
                  Start Interview
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Dashboard;
