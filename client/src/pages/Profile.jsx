import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { userAPI } from '../services/api';
import { toast } from 'sonner';
import {
  User, Mail, Phone, GraduationCap, Building, Calendar,
  FileText, Edit2, Save, X, BookOpen, Award, Layers
} from 'lucide-react';
import { calculateProfileCompletion, getInitials } from '../utils/helpers';
import DashboardLayout from '../components/DashboardLayout';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const { dark } = useTheme();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '', email: '', contactNumber: '',
    collegeName: '', degree: '', branch: '', yearOfStudy: ''
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        contactNumber: user.contactNumber || '',
        collegeName: user.collegeName || '',
        degree: user.degree || '',
        branch: user.branch || '',
        yearOfStudy: user.yearOfStudy || ''
      });
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await userAPI.updateProfile(formData);
      if (response.data.success) {
        updateUser(response.data.user);
        toast.success('Profile updated successfully!');
        setIsEditing(false);
      }
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setFormData({
      name: user?.name || '', email: user?.email || '',
      contactNumber: user?.contactNumber || '', collegeName: user?.collegeName || '',
      degree: user?.degree || '', branch: user?.branch || '', yearOfStudy: user?.yearOfStudy || ''
    });
  };

  const profileCompletion = calculateProfileCompletion(user);

  // Shared input class
  const inputCls = `w-full px-4 py-2.5 rounded-xl border text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
    dark
      ? 'bg-white/5 border-white/10 text-white placeholder-slate-500 disabled:opacity-40 disabled:cursor-not-allowed'
      : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400 disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed'
  }`;

  const labelCls = `flex items-center gap-2 text-xs font-semibold uppercase tracking-wide mb-1.5 ${
    dark ? 'text-slate-400' : 'text-slate-500'
  }`;

  const sectionCls = `rounded-2xl border p-6 transition-colors duration-300 ${
    dark ? 'bg-[#0D1117] border-white/10' : 'bg-white border-slate-200 shadow-sm'
  }`;

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto px-6 py-8">

        {/* ── Profile Hero Card ── */}
        <div className="relative rounded-2xl overflow-hidden mb-6 shadow-xl">
          {/* gradient bg */}
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700" />
          {/* subtle pattern overlay */}
          <div className="absolute inset-0 opacity-10"
            style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

          <div className="relative p-8 flex items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              {/* Avatar */}
              <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center text-3xl font-bold text-white shadow-lg flex-shrink-0">
                {getInitials(user?.name)}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white mb-0.5">{user?.name || 'User'}</h1>
                <p className="text-white/70 text-sm mb-3">{user?.email}</p>
                {/* Progress bar */}
                <div className="flex items-center gap-3">
                  <div className="w-48 bg-white/20 rounded-full h-1.5">
                    <div
                      className="bg-white h-1.5 rounded-full transition-all duration-700"
                      style={{ width: `${profileCompletion}%` }}
                    />
                  </div>
                  <span className="text-white/80 text-xs font-medium">{profileCompletion}% complete</span>
                </div>
              </div>
            </div>

            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 px-4 py-2 bg-white/15 hover:bg-white/25 border border-white/30 text-white rounded-xl transition-all text-sm font-medium backdrop-blur-sm flex-shrink-0"
              >
                <Edit2 className="w-4 h-4" />
                Edit Profile
              </button>
            )}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* ── Personal Information ── */}
          <div className={sectionCls}>
            <h2 className={`text-base font-bold mb-5 flex items-center gap-2 ${dark ? 'text-white' : 'text-slate-900'}`}>
              <User className="w-4 h-4 text-indigo-500" />
              Personal Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}><User className="w-3 h-3" />Full Name</label>
                <input type="text" value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  disabled={!isEditing} placeholder="Your full name" className={inputCls} />
              </div>
              <div>
                <label className={labelCls}><Mail className="w-3 h-3" />Email</label>
                <input type="email" value={formData.email}
                  disabled placeholder="Email address" className={inputCls} />
              </div>
              <div className="md:col-span-2">
                <label className={labelCls}><Phone className="w-3 h-3" />Contact Number</label>
                <input type="tel" value={formData.contactNumber}
                  onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
                  disabled={!isEditing} placeholder="Your phone number" className={inputCls} />
              </div>
            </div>
          </div>

          {/* ── Education ── */}
          <div className={sectionCls}>
            <h2 className={`text-base font-bold mb-5 flex items-center gap-2 ${dark ? 'text-white' : 'text-slate-900'}`}>
              <BookOpen className="w-4 h-4 text-indigo-500" />
              Education
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}><Building className="w-3 h-3" />College / University</label>
                <input type="text" value={formData.collegeName}
                  onChange={(e) => setFormData({ ...formData, collegeName: e.target.value })}
                  disabled={!isEditing} placeholder="e.g., IIT Delhi" className={inputCls} />
              </div>
              <div>
                <label className={labelCls}><GraduationCap className="w-3 h-3" />Degree</label>
                <input type="text" value={formData.degree}
                  onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                  disabled={!isEditing} placeholder="e.g., B.Tech, M.Tech" className={inputCls} />
              </div>
              <div>
                <label className={labelCls}><FileText className="w-3 h-3" />Branch / Specialization</label>
                <input type="text" value={formData.branch}
                  onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                  disabled={!isEditing} placeholder="e.g., Computer Science" className={inputCls} />
              </div>
              <div>
                <label className={labelCls}><Calendar className="w-3 h-3" />Year of Study</label>
                <select value={formData.yearOfStudy}
                  onChange={(e) => setFormData({ ...formData, yearOfStudy: e.target.value })}
                  disabled={!isEditing}
                  className={inputCls}>
                  <option value="">Select Year</option>
                  <option value="1st Year">1st Year</option>
                  <option value="2nd Year">2nd Year</option>
                  <option value="3rd Year">3rd Year</option>
                  <option value="4th Year">4th Year</option>
                  <option value="Graduate">Graduate</option>
                </select>
              </div>
            </div>
          </div>

          {/* ── Resume / CV ── */}
          <div className={sectionCls}>
            <h2 className={`text-base font-bold mb-5 flex items-center gap-2 ${dark ? 'text-white' : 'text-slate-900'}`}>
              <FileText className="w-4 h-4 text-indigo-500" />
              Resume / CV
            </h2>

            {user?.cvURL ? (
              <div className="space-y-4">
                <div className={`flex items-center justify-between p-4 rounded-xl border ${
                  dark ? 'bg-indigo-500/10 border-indigo-500/20' : 'bg-indigo-50 border-indigo-100'
                }`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      dark ? 'bg-indigo-500/20' : 'bg-indigo-100'
                    }`}>
                      <FileText className="w-5 h-5 text-indigo-500" />
                    </div>
                    <div>
                      <p className={`font-medium text-sm ${dark ? 'text-white' : 'text-slate-900'}`}>CV Uploaded</p>
                      <p className={`text-xs ${dark ? 'text-slate-400' : 'text-slate-500'}`}>Analyzed and skills extracted</p>
                    </div>
                  </div>
                  <button type="button" onClick={() => navigate('/cv-upload')}
                    className={`px-4 py-2 text-sm font-medium rounded-xl border transition-colors ${
                      dark
                        ? 'border-indigo-500/40 text-indigo-400 hover:bg-indigo-500/10'
                        : 'border-indigo-300 text-indigo-600 hover:bg-indigo-50'
                    }`}>
                    Update CV
                  </button>
                </div>

                {user?.skills?.length > 0 && (
                  <div>
                    <p className={`text-xs font-semibold uppercase tracking-wide mb-2 ${dark ? 'text-slate-400' : 'text-slate-500'}`}>
                      Extracted Skills ({user.skills.length})
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {user.skills.map((skill, i) => (
                        <span key={i} className={`px-3 py-1 rounded-lg text-xs font-medium ${
                          dark ? 'bg-indigo-500/15 text-indigo-300 border border-indigo-500/20' : 'bg-indigo-50 text-indigo-700 border border-indigo-100'
                        }`}>{skill}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className={`text-center py-8 rounded-xl border-2 border-dashed ${
                dark ? 'border-white/10' : 'border-slate-200'
              }`}>
                <FileText className={`w-10 h-10 mx-auto mb-3 ${dark ? 'text-slate-600' : 'text-slate-300'}`} />
                <p className={`text-sm mb-4 ${dark ? 'text-slate-400' : 'text-slate-500'}`}>No CV uploaded yet</p>
                <button type="button" onClick={() => navigate('/cv-upload')}
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-xl transition-colors">
                  Upload CV
                </button>
              </div>
            )}
          </div>

          {/* ── Save / Cancel ── */}
          {isEditing && (
            <div className="flex gap-3">
              <button type="submit" disabled={loading}
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold rounded-xl transition-all">
                <Save className="w-4 h-4" />
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
              <button type="button" onClick={cancelEdit}
                className={`px-5 py-3 rounded-xl border font-medium transition-colors ${
                  dark ? 'border-white/10 text-slate-300 hover:bg-white/5' : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}>
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
        </form>

        {/* ── Stats ── */}
        <div className={`${sectionCls} mt-5`}>
          <h2 className={`text-base font-bold mb-5 flex items-center gap-2 ${dark ? 'text-white' : 'text-slate-900'}`}>
            <Award className="w-4 h-4 text-indigo-500" />
            Interview Statistics
          </h2>
          <div className="grid grid-cols-3 gap-4">
            <div className={`p-4 rounded-xl border ${dark ? 'bg-indigo-500/10 border-indigo-500/20' : 'bg-indigo-50 border-indigo-100'}`}>
              <p className={`text-xs font-medium mb-1 ${dark ? 'text-indigo-300' : 'text-indigo-600'}`}>Total Interviews</p>
              <p className={`text-3xl font-bold ${dark ? 'text-white' : 'text-indigo-900'}`}>{user?.totalInterviews || 0}</p>
            </div>
            <div className={`p-4 rounded-xl border ${dark ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-emerald-50 border-emerald-100'}`}>
              <p className={`text-xs font-medium mb-1 ${dark ? 'text-emerald-300' : 'text-emerald-600'}`}>Average Score</p>
              <p className={`text-3xl font-bold ${dark ? 'text-white' : 'text-emerald-900'}`}>{user?.averageScore || 0}%</p>
            </div>
            <div className={`p-4 rounded-xl border ${dark ? 'bg-violet-500/10 border-violet-500/20' : 'bg-violet-50 border-violet-100'}`}>
              <p className={`text-xs font-medium mb-1 ${dark ? 'text-violet-300' : 'text-violet-600'}`}>Skills Identified</p>
              <p className={`text-3xl font-bold ${dark ? 'text-white' : 'text-violet-900'}`}>{user?.skills?.length || 0}</p>
            </div>
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
};

export default Profile;
