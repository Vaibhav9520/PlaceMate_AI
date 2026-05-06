import { useState, useRef } from 'react';
import { Upload, FileText, X, CheckCircle, RefreshCw } from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';
import Button from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { userAPI } from '../services/api';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

const UpdateCV = () => {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [extractedSkills, setExtractedSkills] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === 'dragenter' || e.type === 'dragover');
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files?.[0]) handleFile(e.dataTransfer.files[0]);
  };

  const handleFileInput = (e) => {
    if (e.target.files?.[0]) handleFile(e.target.files[0]);
  };

  const handleFile = async (file) => {
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Please upload a PDF or Word document');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB');
      return;
    }

    setUploadedFile(file);
    setIsUploading(true);
    setExtractedSkills(null);

    try {
      const formData = new FormData();
      formData.append('cv', file);

      const response = await userAPI.uploadCV(formData);

      if (response.data.success) {
        const skills = response.data.analysis?.skills || [];
        setExtractedSkills(skills);
        toast.success(`CV uploaded! ${skills.length} skills extracted and saved.`);
      } else {
        toast.error('Failed to process CV');
        setUploadedFile(null);
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(error.response?.data?.message || 'Failed to upload CV. Please try again.');
      setUploadedFile(null);
    } finally {
      setIsUploading(false);
    }
  };

  const reset = () => {
    setUploadedFile(null);
    setExtractedSkills(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Upload Your CV</h1>
          <p className="text-gray-500">
            We'll extract your skills automatically and use them to personalize your interview experience — no manual entry needed.
          </p>
        </div>

        {/* Upload Card */}
        <Card className="p-8 mb-6">
          {!uploadedFile ? (
            <div
              className={`border-2 border-dashed rounded-xl p-10 text-center transition-all duration-200 cursor-pointer ${
                dragActive
                  ? 'border-indigo-500 bg-indigo-50'
                  : 'border-gray-300 hover:border-indigo-400 hover:bg-gray-50'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="w-16 h-16 bg-indigo-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Upload className="w-8 h-8 text-indigo-600" />
              </div>
              <p className="text-lg font-semibold text-gray-800 mb-1">
                Drop your CV here, or click to browse
              </p>
              <p className="text-sm text-gray-500">PDF, DOC, DOCX — up to 5MB</p>
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept=".pdf,.doc,.docx"
                onChange={handleFileInput}
              />
            </div>
          ) : (
            <div className="flex items-center justify-between p-4 bg-indigo-50 rounded-xl border border-indigo-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{uploadedFile.name}</p>
                  <p className="text-sm text-gray-500">
                    {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
              {!isUploading && (
                <button onClick={reset} className="text-gray-400 hover:text-red-500 transition-colors">
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          )}

          {/* Uploading state */}
          {isUploading && (
            <div className="mt-5 flex items-center gap-3 p-4 bg-blue-50 rounded-xl border border-blue-200">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600 flex-shrink-0" />
              <div>
                <p className="font-medium text-blue-900">Extracting skills from your CV...</p>
                <p className="text-sm text-blue-600">This takes a few seconds</p>
              </div>
            </div>
          )}
        </Card>

        {/* Extracted Skills */}
        {extractedSkills !== null && (
          <Card className="p-8">
            <div className="flex items-center gap-2 mb-5">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <h2 className="text-xl font-semibold text-gray-900">
                {extractedSkills.length} Skills Extracted & Saved
              </h2>
            </div>

            {extractedSkills.length > 0 ? (
              <>
                <div className="flex flex-wrap gap-2 mb-6">
                  {extractedSkills.map((skill, i) => (
                    <span
                      key={i}
                      className="px-3 py-1.5 bg-indigo-100 text-indigo-800 rounded-lg text-sm font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
                <p className="text-sm text-gray-500 mb-6">
                  These skills are now saved to your profile and will be used to personalize your mock interviews.
                </p>
              </>
            ) : (
              <div className="mb-6 p-4 bg-yellow-50 rounded-xl border border-yellow-200">
                <p className="text-yellow-800 font-medium mb-1">No skills detected</p>
                <p className="text-sm text-yellow-700">
                  Make sure your CV clearly lists your skills. Try adding a dedicated "Skills" section with keywords like React, Python, SQL, etc.
                </p>
              </div>
            )}

            <div className="flex gap-3">
              <Button
                onClick={() => navigate('/personalized-interview')}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-lg font-medium"
              >
                Start Personalized Interview
              </Button>
              <Button
                variant="outline"
                onClick={reset}
                className="flex items-center gap-2 px-6 py-2.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                <RefreshCw className="w-4 h-4" />
                Upload Another
              </Button>
            </div>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default UpdateCV;
