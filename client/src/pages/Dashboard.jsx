import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';

import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { interviewAPI } from '../services/api';
import DashboardLayout from '../components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';

import { 
  TrendingUp,
  Target,
  Code,
  Building2,
  Calendar,
  Clock,
  Trash2,
  Eye,
  Activity
} from 'lucide-react';

// Compact Interview Card Component
const InterviewCard = ({ interview, onDelete }) => {
  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getInterviewType = (questions) => {
    if (!questions || questions.length === 0) return 'General';
    const hasTechnical = questions.some(q => q.type === 'technical');
    const hasBehavioral = questions.some(q => q.type === 'behavioral');
    
    if (hasTechnical && hasBehavioral) return 'Mixed';
    if (hasTechnical) return 'Technical';
    if (hasBehavioral) return 'HR/Behavioral';
    return 'General';
  };

  const getInterviewRole = (interview) => {
    return interview.targetRole || 
           interview.questions?.[0]?.skills?.[0] || 
           'General';
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-all duration-200 relative group">
      {/* Delete Button */}
      <button
        onClick={() => onDelete(interview._id)}
        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-red-100 rounded-full"
        title="Delete Interview"
      >
        <Trash2 className="w-4 h-4 text-red-500 hover:text-red-700" />
      </button>

      {/* Header */}
      <div className="mb-3">
        <div className="flex items-center justify-between mb-2">
          <h4 className="font-semibold text-gray-900 text-sm truncate pr-8">
            {getInterviewRole(interview)} Interview
          </h4>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getScoreColor(interview.feedback?.overallScore || 0)}`}>
            {interview.feedback?.overallScore || 0}%
          </span>
        </div>
        
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {new Date(interview.completedAt).toLocaleDateString()}
          </span>
          <span className="px-2 py-1 bg-gray-100 rounded text-xs">
            {getInterviewType(interview.questions)}
          </span>
        </div>
      </div>

      {/* Scores */}
      {interview.feedback && (
        <div className="grid grid-cols-3 gap-2 mb-3">
          <div className="text-center">
            <div className="text-xs text-gray-600 mb-1">Technical</div>
            <div className="text-sm font-bold text-blue-600">
              {interview.feedback.technicalScore}%
            </div>
          </div>
          <div className="text-center">
            <div className="text-xs text-gray-600 mb-1">Communication</div>
            <div className="text-sm font-bold text-green-600">
              {interview.feedback.communicationScore}%
            </div>
          </div>
          <div className="text-center">
            <div className="text-xs text-gray-600 mb-1">Confidence</div>
            <div className="text-sm font-bold text-purple-600">
              {interview.feedback.confidenceScore}%
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-2 border-t border-gray-100">
        <span className="text-xs text-gray-500">
          {interview.questions?.length || 0} questions
        </span>
        <Link
          to={`/feedback/${interview._id}`}
          className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 font-medium"
        >
          <Eye className="w-3 h-3" />
          View Details
        </Link>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const { user } = useAuth();
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState(2025);

  // Generate consistent activity data based on date seed
  const generateActivityData = (year) => {
    const data = {};
    const startDate = year === 2025 ? new Date(2025, 2, 1) : new Date(year, 0, 1); // March 1 for 2025, Jan 1 for others
    
    for (let i = 0; i < 365; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + i);
      
      const dateKey = currentDate.toISOString().split('T')[0];
      
      // Use date as seed for consistent random generation
      const seed = currentDate.getTime();
      const pseudoRandom = (seed * 9301 + 49297) % 233280 / 233280;
      
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      currentDate.setHours(0, 0, 0, 0);
      
      // Future dates are always 0
      if (currentDate > today) {
        data[dateKey] = 0;
        continue;
      }
      
      let intensity = 0;
      
      if (year === 2025) {
        // Before October 2025: all white/blank (0)
        if (currentDate < new Date(2025, 9, 1)) {
          intensity = 0;
        } else {
          // From October 2025: 70% chance of activity
          if (pseudoRandom < 0.7) {
            intensity = Math.floor(pseudoRandom * 4) + 1;
          }
        }
      } else if (year === 2024) {
        // 2024: moderate activity (30%)
        if (pseudoRandom < 0.3) {
          intensity = Math.floor(pseudoRandom * 3) + 1;
        }
      } else if (year === 2026) {
        // 2026: high activity (80%)
        if (pseudoRandom < 0.8) {
          intensity = Math.floor(pseudoRandom * 4) + 1;
        }
      }
      
      data[dateKey] = intensity;
    }
    
    return data;
  };

  useEffect(() => {
    console.log('🔐 Dashboard: User authentication status:', !!user);
    console.log('👤 Dashboard: User data:', user);
    console.log('🎫 Dashboard: Token exists:', !!localStorage.getItem('token'));
    
    // Always set loading to false to show the dashboard
    setLoading(false);
    
    if (user) {
      loadDashboardData();
    } else {
      console.log('⏳ Dashboard: Waiting for user authentication...');
    }
  }, [user]);

  // Add effect to refresh data when returning from interview
  useEffect(() => {
    const handleFocus = () => {
      console.log('🔄 Dashboard: Window focused, refreshing data...');
      if (user) {
        loadDashboardData();
      }
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [user]);

  // Handle interview deletion
  const handleDeleteInterview = async (interviewId) => {
    // Ensure ID is a string and clean it
    const cleanId = String(interviewId).trim();
    
    if (!window.confirm('Are you sure you want to delete this interview? This action cannot be undone.')) {
      return;
    }

    try {
      console.log('🗑️ Deleting interview:', cleanId);
      
      // Call delete API with cleaned ID
      const response = await interviewAPI.delete(cleanId);
      
      if (response.data.success) {
        toast.success('Interview deleted successfully');
        // Remove from local state using original ID for comparison
        setInterviews(prev => prev.filter(interview => interview._id !== cleanId));
        
        // Reload dashboard data to update stats
        loadDashboardData();
      } else {
        throw new Error(response.data.message || 'Failed to delete interview');
      }
    } catch (error) {
      console.error('❌ Error deleting interview:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to delete interview';
      toast.error(`Delete failed: ${errorMessage}`);
    }
  };

  const loadDashboardData = async () => {
    if (!user) {
      console.log('❌ Dashboard: No user found, skipping API calls');
      setLoading(false);
      return;
    }

    try {
      console.log('📊 Loading dashboard data for user:', user._id);
      
      // Load stats with better error handling
      // Note: Stats loading removed as we're using static data for activity tracker

      // Load interviews with better error handling
      let interviewsData = [];
      try {
        const interviewsRes = await interviewAPI.getRecent();
        if (interviewsRes.data.success) {
          interviewsData = interviewsRes.data.interviews;
        }
      } catch (interviewsError) {
        console.error('📋 Interviews API error:', interviewsError.response?.status, interviewsError.message);
        // Continue with empty interviews
      }

      console.log('� Interviews loaded:', interviewsData.length);

      setInterviews(interviewsData);

    } catch (error) {
      console.error('❌ Error loading dashboard:', error);
      toast.error('Some dashboard data could not be loaded');
      // Set default values on error
      setInterviews([]);
    } finally {
      setLoading(false);
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

  if (!user) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Loading Dashboard...</h2>
            <p className="text-gray-600">Please wait while we load your dashboard.</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-teal-50 to-blue-50 rounded-2xl p-8 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-lg text-[#6366F1] font-semibold mb-1">
                Welcome back, {user?.name || 'Vaibhav Singh'}
              </p>
              <h1 className="text-5xl font-bold text-gray-900 mb-6">
                Prepare Smarter for Interviews
              </h1>
              <p className="text-lg text-gray-600 max-w-2xl mb-6">
                Practice real interview questions, get instant feedback, and improve your 
                technical and communication skills with structured learning.
              </p>
              <Link
                to="/general-interview"
                className="inline-block px-8 py-4 bg-[#6366F1] text-white rounded-lg font-semibold hover:bg-[#5855EB] transition-all shadow-lg text-lg"
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
                <p className="text-3xl font-bold text-gray-900">{interviews.length || 0}</p>
                <p className="text-xs text-gray-500 mt-1">Completed sessions</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Average Score</p>
                <p className="text-3xl font-bold text-gray-900">
                  {interviews.length > 0 
                    ? Math.round(interviews.reduce((sum, interview) => sum + (interview.feedback?.overallScore || 0), 0) / interviews.length)
                    : 0}%
                </p>
                <p className="text-xs text-gray-500 mt-1">Overall performance</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* GitHub-Style Activity Tracker */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-green-600" />
                <h3 className="text-lg font-semibold text-gray-900">Activity Overview</h3>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-sm text-gray-600">Year:</span>
                <select 
                  className="bg-transparent border-none text-sm cursor-pointer font-medium"
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                >
                  <option value={2024}>2024</option>
                  <option value={2025}>2025</option>
                  <option value={2026}>2026</option>
                </select>
              </div>
            </div>
            
            {/* Activity Grid */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Less</span>
                <div className="flex items-center gap-1">
                  <div className="w-2.5 h-2.5 bg-gray-200 rounded-sm border border-gray-300"></div>
                  <div className="w-2.5 h-2.5 bg-green-200 rounded-sm"></div>
                  <div className="w-2.5 h-2.5 bg-green-400 rounded-sm"></div>
                  <div className="w-2.5 h-2.5 bg-green-600 rounded-sm"></div>
                  <div className="w-2.5 h-2.5 bg-green-800 rounded-sm"></div>
                </div>
                <span className="text-gray-500">More</span>
              </div>
              
              {/* GitHub-style contribution graph */}
              <div className="w-full">
                <div className="w-full">
                  {/* Month labels - Full width distribution */}
                  <div className="flex justify-start mb-2 ml-12">
                    <div className="flex w-full justify-between text-xs text-gray-500 pr-4">
                      {(() => {
                        const months = [];
                        const startMonth = selectedYear === 2025 ? 2 : 0; // March for 2025, January for others
                        
                        for (let i = 0; i < 12; i++) {
                          const monthIndex = (startMonth + i) % 12;
                          const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                          months.push(
                            <div key={i} className="flex-1 text-left">
                              {monthNames[monthIndex]}
                            </div>
                          );
                        }
                        return months;
                      })()}
                    </div>
                  </div>
                  
                  {/* Day labels and activity grid */}
                  <div className="flex">
                    {/* Day labels */}
                    <div className="flex flex-col justify-between text-xs text-gray-500 mr-2 w-10" style={{height: '105px'}}>
                      <div className="h-3"></div>
                      <div className="h-3 flex items-center">Mon</div>
                      <div className="h-3"></div>
                      <div className="h-3 flex items-center">Wed</div>
                      <div className="h-3"></div>
                      <div className="h-3 flex items-center">Fri</div>
                      <div className="h-3"></div>
                    </div>
                    
                    {/* Activity squares - Full width grid */}
                    <div className="flex-1">
                      <div className="grid gap-1" style={{
                        gridTemplateColumns: 'repeat(53, minmax(0, 1fr))',
                        gridTemplateRows: 'repeat(7, 13px)'
                      }}>
                        {(() => {
                          const activityData = generateActivityData(selectedYear);
                          
                          return Array.from({ length: 371 }, (_, i) => {
                            const weekIndex = Math.floor(i / 7);
                            const dayIndex = i % 7;
                            
                            // Calculate date for this square
                            const startDate = selectedYear === 2025 ? new Date(2025, 2, 1) : new Date(selectedYear, 0, 1);
                            const currentDate = new Date(startDate);
                            currentDate.setDate(startDate.getDate() + i);
                            
                            const dateKey = currentDate.toISOString().split('T')[0];
                            const intensity = activityData[dateKey] || 0;
                            
                            const colors = [
                              'bg-gray-200 border border-gray-300', // No activity
                              'bg-green-200',
                              'bg-green-400', 
                              'bg-green-600',
                              'bg-green-800'
                            ];
                            
                            const today = new Date();
                            today.setHours(0, 0, 0, 0);
                            currentDate.setHours(0, 0, 0, 0);
                            const isFuture = currentDate > today;
                            
                            return (
                              <div
                                key={i}
                                className={`w-full h-full rounded-sm ${colors[intensity]} hover:ring-1 hover:ring-green-500 cursor-pointer transition-all`}
                                title={isFuture ? `Future date: ${currentDate.toLocaleDateString()}` : `${intensity} activities on ${currentDate.toLocaleDateString()}`}
                                style={{
                                  gridRow: (dayIndex + 1),
                                  gridColumn: (weekIndex + 1)
                                }}
                              />
                            );
                          });
                        })()}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Practice Module */}
        <div className="mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Practice Module</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link
              to="/general-interview"
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-all border-2 border-transparent hover:border-[#6366F1]"
            >
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">AI Interview Practice</h4>
              <p className="text-sm text-gray-600">Customize your interview by experience level and tech stack</p>
            </Link>

            <Link
              to="/personalized-interview"
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-all border-2 border-transparent hover:border-[#6366F1]"
            >
              <div className="w-12 h-12 bg-[#6366F1]/10 rounded-lg flex items-center justify-center mb-4">
                <Target className="w-6 h-6 text-[#6366F1]" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Resume-Based Preparation</h4>
              <p className="text-sm text-gray-600">Generate questions from your resume</p>
            </Link>

            <Link
              to="/coding-practice"
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-all border-2 border-transparent hover:border-[#6366F1]"
            >
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <Code className="w-6 h-6 text-purple-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Coding Practice</h4>
              <p className="text-sm text-gray-600">Solve coding problems with an integrated compiler</p>
            </Link>

            <Link
              to="/company-questions"
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-all border-2 border-transparent hover:border-orange-500"
            >
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                <Building2 className="w-6 h-6 text-orange-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Company Preparation</h4>
              <p className="text-sm text-gray-600">Practice real questions from top companies</p>
            </Link>
          </div>
        </div>

        {/* Recent Interviews */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Recent Interviews
              </div>
              <span className="text-sm text-gray-500">
                {interviews.length} interview{interviews.length !== 1 ? 's' : ''}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {interviews.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {interviews.map((interview) => (
                  <InterviewCard 
                    key={interview._id} 
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
                  to="/general-interview"
                  className="inline-block px-6 py-3 bg-[#6366F1] text-white rounded-md hover:bg-[#5855EB] transition-colors"
                >
                  Start Interview
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;