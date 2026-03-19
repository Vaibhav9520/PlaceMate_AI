import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { userAPI } from '../services/api';
import { toast } from 'sonner';
import { ArrowLeft, User, Mail, Phone, GraduationCap, Building, Calendar, FileText, Edit2, Save, X } from 'lucide-react';
import { calculateProfileCompletion, getInitials } from '../utils/helpers';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    contactNumber: '',
    collegeName: '',
    degree: '',
    branch: '',
    yearOfStudy: ''
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
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const profileCompletion = calculateProfileCompletion(user);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Dashboard</span>
        </button>

        {/* Profile Header Card */}
        <div className="bg-gradient-to-r from-primary to-primary-600 text-white rounded-lg shadow-lg p-8 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center text-4xl font-bold">
                {getInitials(user?.name)}
              </div>
              <div>
                <h1 className="text-3xl font-bold mb-2">{user?.name || 'User'}</h1>
                <p className="text-white/90">{user?.email}</p>
                <div className="mt-3">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm">Profile Completion</span>
                    <span className="text-sm font-bold">{profileCompletion}%</span>
                  </div>
                  <div className="w-64 bg-white/20 rounded-full h-2">
                    <div
                      className="bg-white h-2 rounded-full transition-all"
                      style={{ width: `${profileCompletion}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 px-4 py-2 bg-white text-primary rounded-lg hover:bg-white/90 transition-all"
              >
                <Edit2 className="w-4 h-4" />
                Edit Profile
              </button>
            )}
          </div>
        </div>

        {/* Profile Form */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Personal Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <User className="w-4 h-4" />
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    disabled={!isEditing}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-50 disabled:text-gray-600"
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <Mail className="w-4 h-4" />
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    disabled
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <Phone className="w-4 h-4" />
                    Contact Number
                  </label>
                  <input
                    type="tel"
                    value={formData.contactNumber}
                    onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
                    disabled={!isEditing}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-50 disabled:text-gray-600"
                  />
                </div>
              </div>
            </div>

            {/* Education Information */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Education</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <Building className="w-4 h-4" />
                    College/University
                  </label>
                  <input
                    type="text"
                    value={formData.collegeName}
                    onChange={(e) => setFormData({ ...formData, collegeName: e.target.value })}
                    disabled={!isEditing}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-50 disabled:text-gray-600"
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <GraduationCap className="w-4 h-4" />
                    Degree
                  </label>
                  <input
                    type="text"
                    value={formData.degree}
                    onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                    disabled={!isEditing}
                    placeholder="e.g., B.Tech, M.Tech, BCA"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-50 disabled:text-gray-600"
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <FileText className="w-4 h-4" />
                    Branch/Specialization
                  </label>
                  <input
                    type="text"
                    value={formData.branch}
                    onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                    disabled={!isEditing}
                    placeholder="e.g., Computer Science"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-50 disabled:text-gray-600"
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <Calendar className="w-4 h-4" />
                    Year of Study
                  </label>
                  <select
                    value={formData.yearOfStudy}
                    onChange={(e) => setFormData({ ...formData, yearOfStudy: e.target.value })}
                    disabled={!isEditing}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-50 disabled:text-gray-600"
                  >
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

            {/* CV Section */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Resume/CV</h2>
              <div className="p-4 border-2 border-dashed border-gray-300 rounded-lg">
                {user?.cvURL ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <FileText className="w-8 h-8 text-primary" />
                        <div>
                          <p className="font-medium text-gray-900">CV Uploaded</p>
                          <p className="text-sm text-gray-600">Your CV has been uploaded and analyzed</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => navigate('/cv-upload')}
                        className="px-4 py-2 text-primary border border-primary rounded-lg hover:bg-primary/5"
                      >
                        Update CV
                      </button>
                    </div>
                    {user?.skills && user.skills.length > 0 && (
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-2">Extracted Skills:</p>
                        <div className="flex flex-wrap gap-2">
                          {user.skills.slice(0, 8).map((skill, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                            >
                              {skill}
                            </span>
                          ))}
                          {user.skills.length > 8 && (
                            <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">
                              +{user.skills.length - 8} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600 mb-4">No CV uploaded yet</p>
                    <button
                      type="button"
                      onClick={() => navigate('/cv-upload')}
                      className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-600"
                    >
                      Upload CV
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            {isEditing && (
              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-primary to-primary-600 text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50"
                >
                  <Save className="w-5 h-5" />
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    setFormData({
                      name: user?.name || '',
                      email: user?.email || '',
                      contactNumber: user?.contactNumber || '',
                      collegeName: user?.collegeName || '',
                      degree: user?.degree || '',
                      branch: user?.branch || '',
                      yearOfStudy: user?.yearOfStudy || ''
                    });
                  }}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            )}
          </form>
        </div>

        {/* Stats Card */}
        <div className="mt-6 bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Interview Statistics</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-600 mb-1">Total Interviews</p>
              <p className="text-3xl font-bold text-blue-900">{user?.totalInterviews || 0}</p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-green-600 mb-1">Average Score</p>
              <p className="text-3xl font-bold text-green-900">{user?.averageScore || 0}%</p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <p className="text-sm text-purple-600 mb-1">Skills Identified</p>
              <p className="text-3xl font-bold text-purple-900">{user?.skills?.length || 0}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
