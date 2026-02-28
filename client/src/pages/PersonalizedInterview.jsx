import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { interviewAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { toast } from "sonner";
import { ArrowLeft, FileText, AlertCircle } from "lucide-react";
import { DIFFICULTY_LEVELS, JOB_ROLES } from "../constants";

const PersonalizedInterview = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    role: "",
    level: "intermediate",
    interviewType: "mixed",
    techstack: [],
    questionCount: 10,
  });

  const [loading, setLoading] = useState(false);

  // Check if CV is uploaded on component mount
  useEffect(() => {
    if (!user?.cvURL) {
      toast.error("Please upload your CV first to start a personalized interview");
      setTimeout(() => {
        navigate("/cv-upload");
      }, 2000);
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user?.cvURL) {
      toast.error("Please upload your CV first");
      navigate("/cv-upload");
      return;
    }

    if (!formData.role) {
      toast.error("Please select a job role");
      return;
    }

    setLoading(true);

    try {
      const response = await interviewAPI.createPersonalized(formData);

      if (response.data.success) {
        toast.success("Personalized interview created successfully!");
        navigate(`/interview/${response.data.interview.id}`);
      }
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message ||
          "Failed to create personalized interview"
      );
    } finally {
      setLoading(false);
    }
  };

  // Show loading or redirect message if no CV
  if (!user?.cvURL) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md text-center">
          <AlertCircle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">CV Required</h2>
          <p className="text-gray-600 mb-6">
            You need to upload your CV first to start a personalized interview.
          </p>
          <button
            onClick={() => navigate("/cv-upload")}
            className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-600 transition-all"
          >
            Upload CV Now
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Dashboard</span>
        </button>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <div className="inline-block px-4 py-1 bg-teal-100 text-teal-700 rounded-full text-sm font-medium mb-4">
              Personalized Experience
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-3">
              AI-Powered Personalized Interview
            </h1>
            <p className="text-gray-600">
              Interview questions tailored to your CV, skills, and experience level
            </p>
          </div>

          <div className="grid grid-cols-4 gap-4 mb-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-white font-bold">✓</span>
              </div>
              <p className="text-sm font-medium text-gray-900">CV-Based</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-white font-bold">✓</span>
              </div>
              <p className="text-sm font-medium text-gray-900">Role-Specific</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-white font-bold">✓</span>
              </div>
              <p className="text-sm font-medium text-gray-900">Smart Questions</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-teal-500 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-white font-bold">✓</span>
              </div>
              <p className="text-sm font-medium text-gray-900">Detailed Feedback</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Your Profile Summary</h3>
              
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">Personal Details</h4>
                  <p className="text-gray-900">{user?.name || 'Not provided'}</p>
                  {user?.email && <p className="text-sm text-gray-600">{user.email}</p>}
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">Skills</h4>
                  {user?.skills && user.skills.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {user.skills.map((skill, index) => (
                        <span key={index} className="px-2 py-1 bg-white text-gray-700 rounded text-xs border">
                          {skill}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-600">Git</p>
                  )}
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <div className="flex items-center gap-2 mb-2">
                    {user?.cvURL ? (
                      <>
                        <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs">✓</span>
                        </div>
                        <span className="text-sm font-medium text-green-700">CV Status: ✓ Uploaded</span>
                      </>
                    ) : (
                      <>
                        <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                        <span className="text-sm font-medium text-red-700">CV Status: ✗ Not Uploaded</span>
                      </>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-4 h-4 bg-purple-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">Total Interviews: {user?.totalInterviews || 0}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">Skills Extracted: {user?.skills?.length || 0}</span>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4">Interview Configuration</h3>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="flex items-center gap-2 font-semibold text-sm text-gray-700 mb-2">
                    Interview Type
                  </label>
                  <select
                    value={formData.interviewType}
                    onChange={(e) => setFormData({ ...formData, interviewType: e.target.value })}
                    className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="mixed">Mixed (Technical + HR)</option>
                    <option value="technical">Technical Only</option>
                    <option value="hr">HR/Behavioral Only</option>
                  </select>
                  <p className="text-xs text-gray-500 mt-1">
                    {formData.interviewType === 'mixed' && 'Combination of technical and behavioral questions'}
                    {formData.interviewType === 'technical' && 'Focus on technical skills and problem-solving'}
                    {formData.interviewType === 'hr' && 'Focus on behavioral and situational questions'}
                  </p>
                </div>

                <div>
                  <label className="flex items-center gap-2 font-semibold text-sm text-gray-700 mb-2">
                    Target Job Role
                  </label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                  >
                    <option value="">Select a role</option>
                    {JOB_ROLES.map((role) => (
                      <option key={role} value={role}>{role}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="flex items-center gap-2 font-semibold text-sm text-gray-700 mb-2">
                    Difficulty Level
                  </label>
                  <select
                    value={formData.level}
                    onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                    className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    {DIFFICULTY_LEVELS.map((level) => (
                      <option key={level.value} value={level.value}>
                        {level.label} - {level.description}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-sm text-gray-700 mb-2 block">Number of Questions</label>
                  <select
                    value={formData.questionCount}
                    onChange={(e) => setFormData({ ...formData, questionCount: parseInt(e.target.value) })}
                    className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value={5}>5 Questions (~10 minutes)</option>
                    <option value={10}>10 Questions (~20 minutes)</option>
                    <option value={15}>15 Questions (~30 minutes)</option>
                    <option value={20}>20 Questions (~40 minutes)</option>
                  </select>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="text-sm font-semibold text-blue-900 mb-2">Your Skills (from CV)</h4>
                  <div className="flex flex-wrap gap-2">
                    {user?.skills && user.skills.length > 0 ? (
                      user.skills.map((skill, index) => (
                        <span key={index} className="px-3 py-1 bg-white text-blue-700 rounded-full text-xs border border-blue-200">
                          {skill}
                        </span>
                      ))
                    ) : (
                      <span className="text-sm text-blue-600">No skills extracted yet</span>
                    )}
                  </div>
                  <p className="text-xs text-blue-600 mt-2">
                    Questions will be tailored to these skills
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-primary to-primary-600 text-white py-4 rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Creating Interview..." : "Start CV-Based Interview"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalizedInterview;
