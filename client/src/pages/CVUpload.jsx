import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { userAPI } from '../services/api';
import { toast } from 'sonner';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, Upload, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import { formatFileSize, isPDF } from '../utils/helpers';

const CVUpload = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const navigate = useNavigate();
  const { updateUser } = useAuth();

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    validateAndSetFile(selectedFile);
  };

  const validateAndSetFile = (selectedFile) => {
    if (selectedFile) {
      if (isPDF(selectedFile)) {
        if (selectedFile.size > 5 * 1024 * 1024) { // 5MB limit
          toast.error('File size must be less than 5MB');
          return;
        }
        setFile(selectedFile);
        toast.success('File selected successfully');
      } else {
        toast.error('Please select a PDF file');
      }
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      toast.error('Please select a file');
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('cv', file);

    try {
      const response = await userAPI.uploadCV(formData);
      if (response.data.success) {
        toast.success('CV uploaded and analyzed successfully!');
        updateUser({ 
          cvURL: response.data.cvURL, 
          skills: response.data.analysis?.skills || []
        });
        navigate('/profile');
      }
    } catch (error) {
      console.error('Error uploading CV:', error);
      toast.error(error.response?.data?.message || 'Failed to upload CV');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <button
          onClick={() => navigate('/profile')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Profile</span>
        </button>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Upload className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Upload Your CV</h1>
            <p className="text-gray-600">
              Upload your resume to get personalized interview questions
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Drag & Drop Area */}
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className={`relative border-2 border-dashed rounded-lg p-12 text-center transition-all ${
                dragActive
                  ? 'border-primary bg-primary/5'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                disabled={loading}
              />
              
              {!file ? (
                <div>
                  <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-lg font-medium text-gray-700 mb-2">
                    Drop your CV here or click to browse
                  </p>
                  <p className="text-sm text-gray-500">
                    PDF format only, max 5MB
                  </p>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-3">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                  <div className="text-left">
                    <p className="font-medium text-gray-900">{file.name}</p>
                    <p className="text-sm text-gray-600">{formatFileSize(file.size)}</p>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setFile(null);
                    }}
                    className="ml-4 text-red-600 hover:text-red-700"
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>

            {/* Info Box */}
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-blue-800">
                  <p className="font-medium mb-2">What happens after upload?</p>
                  <ul className="space-y-1 list-disc list-inside">
                    <li>Your CV will be securely stored</li>
                    <li>AI will analyze your skills, experience, and education</li>
                    <li>Personalized interview questions will be generated</li>
                    <li>You can update your CV anytime from your profile</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !file}
              className="w-full py-4 bg-gradient-to-r from-primary to-primary-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Uploading and Analyzing...
                </span>
              ) : (
                'Upload CV'
              )}
            </button>
          </form>

          {/* Features */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-4">Why upload your CV?</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <FileText className="w-6 h-6 text-purple-600" />
                </div>
                <h4 className="font-medium text-gray-900 mb-1">Personalized Questions</h4>
                <p className="text-sm text-gray-600">
                  Get questions tailored to your experience
                </p>
              </div>
              <div className="text-center p-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <h4 className="font-medium text-gray-900 mb-1">Skill Analysis</h4>
                <p className="text-sm text-gray-600">
                  AI identifies your key skills automatically
                </p>
              </div>
              <div className="text-center p-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Upload className="w-6 h-6 text-blue-600" />
                </div>
                <h4 className="font-medium text-gray-900 mb-1">Better Preparation</h4>
                <p className="text-sm text-gray-600">
                  Practice with relevant interview scenarios
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CVUpload;
