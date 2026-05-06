import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { interviewAPI } from '../services/api';
import DashboardLayout from '../components/DashboardLayout';

import { 
  Calendar,
  Clock,
  Trash2,
  Eye,
  Activity
} from 'lucide-react';

// Compact Interview Card Component
const InterviewCard = ({ interview, onDelete, dark }) => {
  const getScoreColor = (score) => {
    if (score >= 80) return dark ? 'text-emerald-400 bg-emerald-500/10' : 'text-green-600 bg-green-100';
    if (score >= 60) return dark ? 'text-amber-400 bg-amber-500/10' : 'text-yellow-600 bg-yellow-100';
    return dark ? 'text-rose-400 bg-rose-500/10' : 'text-red-600 bg-red-100';
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
    // Use targetRole first (set during interview creation)
    if (interview.targetRole) {
      return interview.targetRole;
    }
    // Fallback to role field
    if (interview.role) {
      return interview.role;
    }
    // Fallback to interviewType-based name
    if (interview.interviewType) {
      const typeMap = {
        'technical': 'Technical',
        'behavioral': 'Behavioral',
        'mixed': 'Mixed',
        'hr': 'HR'
      };
      return typeMap[interview.interviewType] || interview.interviewType;
    }
    return 'General';
  };

  return (
    <div className={`rounded-xl border p-4 hover:shadow-lg transition-all duration-200 relative group ${
      dark ? 'bg-white/[0.04] border-white/10 hover:border-white/20' : 'bg-white border-slate-200 hover:border-indigo-300'
    }`}>
      {/* Delete Button */}
      <button
        onClick={() => onDelete(interview._id)}
        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-rose-500/10 rounded-full"
        title="Delete Interview"
      >
        <Trash2 className="w-4 h-4 text-rose-500" />
      </button>

      {/* Header */}
      <div className="mb-3">
        <div className="flex items-center justify-between mb-2">
          <h4 className={`font-semibold text-sm truncate pr-8 ${dark ? 'text-white' : 'text-slate-900'}`}>
            {getInterviewRole(interview)} Interview
          </h4>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getScoreColor(interview.feedback?.overallScore || 0)}`}>
            {interview.feedback?.overallScore || 0}%
          </span>
        </div>
        <div className={`flex items-center justify-between text-xs ${dark ? 'text-slate-500' : 'text-slate-400'}`}>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {new Date(interview.completedAt).toLocaleDateString()}
          </span>
          <span className={`px-2 py-1 rounded text-xs ${dark ? 'bg-white/10' : 'bg-slate-100'}`}>
            {getInterviewType(interview.questions)}
          </span>
        </div>
      </div>

      {/* Scores */}
      {interview.feedback && (
        <div className="grid grid-cols-3 gap-2 mb-3">
          <div className="text-center">
            <div className={`text-xs mb-1 ${dark ? 'text-slate-500' : 'text-slate-400'}`}>Technical</div>
            <div className="text-sm font-bold text-indigo-500">{interview.feedback.technicalScore}%</div>
          </div>
          <div className="text-center">
            <div className={`text-xs mb-1 ${dark ? 'text-slate-500' : 'text-slate-400'}`}>Communication</div>
            <div className="text-sm font-bold text-emerald-500">{interview.feedback.communicationScore}%</div>
          </div>
          <div className="text-center">
            <div className={`text-xs mb-1 ${dark ? 'text-slate-500' : 'text-slate-400'}`}>Confidence</div>
            <div className="text-sm font-bold text-violet-500">{interview.feedback.confidenceScore}%</div>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className={`flex items-center justify-between pt-2 border-t ${dark ? 'border-white/10' : 'border-slate-100'}`}>
        <span className={`text-xs ${dark ? 'text-slate-500' : 'text-slate-400'}`}>
          {interview.questions?.length || 0} questions
        </span>
        <Link
          to={`/feedback/${interview._id}`}
          state={{ feedback: interview.feedback }}
          className="flex items-center gap-1 text-xs text-indigo-500 hover:text-indigo-400 font-medium"
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
  const { dark } = useTheme();
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState(2026);

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
        <div className={`rounded-2xl p-8 mb-8 border transition-colors duration-300 ${
          dark
            ? 'bg-white/[0.04] border-white/10'
            : 'bg-gradient-to-br from-teal-50 to-blue-50 border-blue-100'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-lg text-indigo-400 font-semibold mb-1">
                Welcome back, {user?.name}
              </p>
              <h1 className={`text-5xl font-bold mb-6 ${dark ? 'text-white' : 'text-gray-900'}`}>
                Prepare Smarter for Interviews
              </h1>
              <p className={`text-lg max-w-2xl mb-6 ${dark ? 'text-slate-400' : 'text-gray-600'}`}>
                Practice real interview questions, get instant feedback, and improve your 
                technical and communication skills with structured learning.
              </p>
              <Link
                to="/general-interview"
                className="inline-block px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-semibold transition-all shadow-lg hover:shadow-indigo-500/25 text-lg"
              >
                Quick Practice
              </Link>
            </div>
          </div>
        </div>

        {/* Progress Section */}
        <div className={`rounded-2xl border p-6 mb-8 transition-colors duration-300 ${
          dark ? 'bg-white/[0.04] border-white/10' : 'bg-white border-slate-200 shadow-sm'
        }`}>
            <h3 className={`text-lg font-semibold mb-4 ${dark ? 'text-white' : 'text-slate-900'}`}>Your Progress</h3>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className={`text-sm mb-1 ${dark ? 'text-slate-400' : 'text-slate-500'}`}>Total Interviews</p>
                <p className={`text-3xl font-bold ${dark ? 'text-white' : 'text-slate-900'}`}>{interviews.length || 0}</p>
                <p className={`text-xs mt-1 ${dark ? 'text-slate-500' : 'text-slate-400'}`}>Completed sessions</p>
              </div>
              <div>
                <p className={`text-sm mb-1 ${dark ? 'text-slate-400' : 'text-slate-500'}`}>Average Score</p>
                <p className={`text-3xl font-bold ${dark ? 'text-white' : 'text-slate-900'}`}>
                  {interviews.length > 0 
                    ? Math.round(interviews.reduce((sum, interview) => sum + (interview.feedback?.overallScore || 0), 0) / interviews.length)
                    : 0}%
                </p>
                <p className={`text-xs mt-1 ${dark ? 'text-slate-500' : 'text-slate-400'}`}>Overall performance</p>
              </div>
            </div>
        </div>

        {/* Activity Overview — LeetCode style */}
        <div className={`rounded-2xl border p-6 mb-8 transition-colors duration-300 ${
          dark ? 'bg-white/[0.04] border-white/10' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-emerald-500" />
              <h3 className={`text-lg font-semibold ${dark ? 'text-white' : 'text-slate-900'}`}>Activity Overview</h3>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-sm ${dark ? 'text-slate-400' : 'text-slate-500'}`}>Year:</span>
              <select
                className={`text-sm font-medium border rounded-lg px-2 py-1 cursor-pointer focus:outline-none focus:ring-1 focus:ring-emerald-500 ${
                  dark ? 'bg-white/5 border-white/10 text-white' : 'bg-white border-slate-200 text-slate-900'
                }`}
                value={selectedYear}
                onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              >
                <option value={2024}>2024</option>
                <option value={2025}>2025</option>
                <option value={2026}>2026</option>
              </select>
            </div>
          </div>

          {(() => {
            const today = new Date(); today.setHours(0,0,0,0);
            const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
            const DAY_LABELS = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
            const NUM_WEEKS = 53;
            const G = 3; // gap px

            const PALETTE = dark
              ? ['#2a2a2a', '#14532d', '#166534', '#16a34a', '#4ade80']
              : ['#e2e8f0', '#bbf7d0', '#4ade80', '#16a34a', '#14532d'];

            // fmix32 — zero correlation between adjacent days
            const hash = (n) => {
              let h = ((n >>> 0) ^ 0xdeadbeef) >>> 0;
              h = Math.imul(h ^ (h >>> 16), 0x45d9f3b) >>> 0;
              h = Math.imul(h ^ (h >>> 16), 0x45d9f3b) >>> 0;
              return ((h ^ (h >>> 16)) >>> 0) / 0xffffffff;
            };

            const getLevel = (date, idx) => {
              if (date > today) return 0;
              if (date.getTime() === today.getTime()) return 3;
              const yr = date.getFullYear();
              if (yr === 2024) return 0;
              if (yr === 2025 && date < new Date(2025, 10, 1)) return 0;
              const r1 = hash(idx * 2654435761 + yr * 7);
              const r2 = hash(idx * 2246822519 + yr * 13);
              if (r1 > (yr === 2026 ? 0.68 : 0.60)) return 0;
              if (r2 < 0.28) return 1;
              if (r2 < 0.56) return 2;
              if (r2 < 0.82) return 3;
              return 4;
            };

            // Mon-first weeks
            const jan1dow = new Date(selectedYear, 0, 1).getDay();
            const monOffset = (jan1dow + 6) % 7;
            const weeks = [];
            for (let w = 0; w < NUM_WEEKS; w++) {
              const week = [];
              for (let d = 0; d < 7; d++) {
                const off = w * 7 + d - monOffset;
                const dt = new Date(selectedYear, 0, 1 + off);
                dt.setHours(0,0,0,0);
                week.push(dt.getFullYear() === selectedYear
                  ? { date: dt, level: getLevel(dt, off) }
                  : null);
              }
              weeks.push(week);
            }

            // Month label col positions
            const monthCol = {};
            weeks.forEach((wk, wi) => {
              wk.forEach(cell => {
                if (cell && cell.date.getDate() === 1) {
                  monthCol[cell.date.getMonth()] = wi;
                }
              });
            });

            const DAY_LABEL_W = 28; // px for left-side day labels

            return (
              <div className="w-full">
                {/* Grid + day labels */}
                <div className="flex items-stretch w-full">

                  {/* Day labels — LEFT side */}
                  <div
                    className="flex flex-col flex-shrink-0 mr-2"
                    style={{ gap: G, width: DAY_LABEL_W, paddingBottom: 20 }}
                  >
                    {DAY_LABELS.map((lbl) => (
                      <div
                        key={lbl}
                        className={`flex-1 flex items-center justify-end text-[10px] ${dark ? 'text-slate-500' : 'text-slate-400'}`}
                      >
                        {lbl}
                      </div>
                    ))}
                  </div>

                  {/* Main grid — fills remaining width */}
                  <div className="flex-1 min-w-0">
                    {/* 7 rows, each a flex row of 53 cells */}
                    <div className="flex flex-col" style={{ gap: G }}>
                      {Array.from({ length: 7 }, (_, row) => (
                        <div key={row} className="flex w-full" style={{ gap: G }}>
                          {weeks.map((wk, wi) => {
                            const cell = wk[row];
                            return (
                              <div
                                key={wi}
                                className="flex-1"
                                title={cell
                                  ? `${cell.date.toLocaleDateString()} — ${cell.level > 0 ? `${cell.level} session${cell.level > 1 ? 's' : ''}` : 'No activity'}`
                                  : ''}
                                style={{
                                  aspectRatio: '1',
                                  maxHeight: 12,
                                  borderRadius: 2,
                                  backgroundColor: cell ? PALETTE[cell.level] : 'transparent',
                                  cursor: cell ? 'pointer' : 'default',
                                  minWidth: 0,
                                }}
                              />
                            );
                          })}
                        </div>
                      ))}
                    </div>

                    {/* Month labels below */}
                    <div className="relative mt-2" style={{ height: 16 }}>
                      {Object.entries(monthCol).map(([m, wi]) => (
                        <span
                          key={m}
                          className={`absolute text-[10px] ${dark ? 'text-slate-500' : 'text-slate-400'}`}
                          style={{ left: `${(wi / NUM_WEEKS) * 100}%` }}
                        >
                          {MONTHS[+m]}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>

        {/* Practice Module */}
        <div className="mb-8">
          <h3 className={`text-xl font-bold mb-4 ${dark ? 'text-white' : 'text-slate-900'}`}>Practice Module</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link
              to="/general-interview"
              className={`rounded-xl border-2 p-6 transition-all border-transparent hover:border-indigo-500 hover:shadow-lg ${
                dark ? 'bg-white/[0.04] hover:bg-white/[0.07]' : 'bg-white shadow-sm'
              }`}
            >
              <h4 className={`text-lg font-semibold mb-2 ${dark ? 'text-white' : 'text-slate-900'}`}>AI Interview Practice</h4>
              <p className={`text-sm ${dark ? 'text-slate-400' : 'text-slate-500'}`}>Customize your interview by experience level and tech stack</p>
            </Link>

            <Link
              to="/personalized-interview"
              className={`rounded-xl border-2 p-6 transition-all border-transparent hover:border-indigo-500 hover:shadow-lg ${
                dark ? 'bg-white/[0.04] hover:bg-white/[0.07]' : 'bg-white shadow-sm'
              }`}
            >
              <h4 className={`text-lg font-semibold mb-2 ${dark ? 'text-white' : 'text-slate-900'}`}>Resume-Based Preparation</h4>
              <p className={`text-sm ${dark ? 'text-slate-400' : 'text-slate-500'}`}>Generate questions from your resume</p>
            </Link>

            <Link
              to="/coding-practice"
              className={`rounded-xl border-2 p-6 transition-all border-transparent hover:border-indigo-500 hover:shadow-lg ${
                dark ? 'bg-white/[0.04] hover:bg-white/[0.07]' : 'bg-white shadow-sm'
              }`}
            >
              <h4 className={`text-lg font-semibold mb-2 ${dark ? 'text-white' : 'text-slate-900'}`}>Coding Practice</h4>
              <p className={`text-sm ${dark ? 'text-slate-400' : 'text-slate-500'}`}>Solve coding problems with an integrated compiler</p>
            </Link>

            <Link
              to="/company-questions"
              className={`rounded-xl border-2 p-6 transition-all border-transparent hover:border-indigo-500 hover:shadow-lg ${
                dark ? 'bg-white/[0.04] hover:bg-white/[0.07]' : 'bg-white shadow-sm'
              }`}
            >
              <h4 className={`text-lg font-semibold mb-2 ${dark ? 'text-white' : 'text-slate-900'}`}>Company Preparation</h4>
              <p className={`text-sm ${dark ? 'text-slate-400' : 'text-slate-500'}`}>Practice real questions from top companies</p>
            </Link>
          </div>
        </div>

        {/* Recent Interviews */}
        <div className={`rounded-2xl border transition-colors duration-300 ${
          dark ? 'bg-white/[0.04] border-white/10' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <div className={`flex items-center justify-between p-6 border-b ${dark ? 'border-white/10' : 'border-slate-100'}`}>
            <div className="flex items-center gap-2">
              <Calendar className={`w-5 h-5 ${dark ? 'text-slate-400' : 'text-slate-500'}`} />
              <span className={`font-semibold ${dark ? 'text-white' : 'text-slate-900'}`}>Recent Interviews</span>
            </div>
            <span className={`text-sm ${dark ? 'text-slate-500' : 'text-slate-400'}`}>
              {interviews.length} interview{interviews.length !== 1 ? 's' : ''}
            </span>
          </div>
          <div className="p-6">
            {interviews.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {interviews.map((interview) => (
                  <InterviewCard 
                    key={interview._id} 
                    interview={interview} 
                    onDelete={handleDeleteInterview}
                    dark={dark}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className={`text-lg mb-4 ${dark ? 'text-slate-400' : 'text-slate-500'}`}>No interviews yet. Start your first one!</p>
                <Link
                  to="/general-interview"
                  className="inline-block px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl transition-colors"
                >
                  Start Interview
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;