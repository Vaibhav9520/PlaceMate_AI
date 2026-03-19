import { useState, useRef } from 'react';
import { Upload, FileText, X, Download, Sparkles, Target, TrendingUp, Award, Zap, Brain, Shield, Eye, CheckCircle, AlertTriangle } from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';
import Button from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { userAPI } from '../services/api';
import { toast } from 'sonner';

const UpdateCV = () => {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = async (file) => {
    // Validate file type
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Please upload a PDF or Word document');
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB');
      return;
    }

    setUploadedFile(file);
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('cv', file);

      const response = await userAPI.uploadCV(formData);
      
      if (response.data.success) {
        toast.success('Resume uploaded and analyzed successfully!');
        
        // Create analysis result from API response
        const analysis = response.data.analysis;
        setAnalysisResult({
          score: calculateScore(analysis),
          strengths: generateStrengths(analysis),
          improvements: generateImprovements(analysis),
          keywords: analysis.skills || [],
          missingKeywords: generateMissingKeywords(analysis.skills || []),
          cvURL: response.data.cvURL
        });
      } else {
        toast.error('Failed to analyze resume');
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload resume. Please try again.');
      setUploadedFile(null);
    } finally {
      setIsUploading(false);
    }
  };

  const calculateScore = (analysis) => {
    let score = 60; // Base score
    
    if (analysis.skills && analysis.skills.length > 0) score += 15;
    if (analysis.experience && analysis.experience !== 'Experience details from CV') score += 10;
    if (analysis.education && analysis.education !== 'Education details from CV') score += 10;
    if (analysis.projects && analysis.projects !== 'Projects from CV') score += 5;
    
    return Math.min(score, 100);
  };

  const generateStrengths = (analysis) => {
    const strengths = [];
    
    if (analysis.skills && analysis.skills.length > 0) {
      strengths.push(`Strong technical skills: ${analysis.skills.slice(0, 3).join(', ')}`);
    }
    if (analysis.experience) {
      strengths.push('Relevant work experience documented');
    }
    if (analysis.education) {
      strengths.push('Educational background included');
    }
    if (analysis.projects) {
      strengths.push('Project experience highlighted');
    }
    
    return strengths.length > 0 ? strengths : ['Resume structure is clear and readable'];
  };

  const generateImprovements = (analysis) => {
    const improvements = [];
    
    if (!analysis.skills || analysis.skills.length < 5) {
      improvements.push('Add more technical skills relevant to your field');
    }
    if (analysis.experience === 'Experience details from CV') {
      improvements.push('Provide more detailed work experience descriptions');
    }
    if (analysis.projects === 'Projects from CV') {
      improvements.push('Include specific project details and achievements');
    }
    
    improvements.push('Add quantifiable achievements and metrics');
    improvements.push('Include relevant keywords for ATS optimization');
    
    return improvements;
  };

  const generateMissingKeywords = (currentSkills) => {
    const commonKeywords = ['TypeScript', 'Kubernetes', 'CI/CD', 'Microservices', 'AWS', 'Docker', 'React', 'Node.js'];
    return commonKeywords.filter(keyword => 
      !currentSkills.some(skill => 
        skill.toLowerCase().includes(keyword.toLowerCase())
      )
    ).slice(0, 4);
  };

  const removeFile = () => {
    setUploadedFile(null);
    setAnalysisResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const downloadOptimizedCV = () => {
    if (analysisResult?.cvURL) {
      // Create download link for the uploaded CV
      const link = document.createElement('a');
      link.href = `${import.meta.env.VITE_API_URL}${analysisResult.cvURL}`;
      link.download = uploadedFile?.name || 'resume.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      toast.error('No resume available for download');
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Enhanced Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900">AI Resume Analyzer</h1>
              <div className="flex items-center gap-2 mt-2">
                <Brain className="w-5 h-5 text-blue-600" />
                <span className="text-blue-600 font-medium">Powered by Advanced AI</span>
              </div>
            </div>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Get instant AI-powered insights, optimization suggestions, and ATS compatibility analysis for your resume
          </p>
        </div>
        {/* Features Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Brain className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">AI Analysis</h3>
            <p className="text-sm text-gray-600">Advanced AI scans and analyzes your resume content</p>
          </div>
          
          <div className="text-center p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-100">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Shield className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">ATS Optimization</h3>
            <p className="text-sm text-gray-600">Ensure your resume passes applicant tracking systems</p>
          </div>
          
          <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl border border-purple-100">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Target className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Keyword Matching</h3>
            <p className="text-sm text-gray-600">Identify missing keywords for your target role</p>
          </div>
          
          <div className="text-center p-6 bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl border border-orange-100">
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-6 h-6 text-orange-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Score & Insights</h3>
            <p className="text-sm text-gray-600">Get detailed scoring and improvement recommendations</p>
          </div>
        </div>

        {/* Enhanced Upload Section */}
        <Card className="p-8 mb-8 border-2 border-gray-100 shadow-lg">
          <div className="flex items-center gap-3 mb-6">
            <Upload className="w-6 h-6 text-blue-600" />
            <h2 className="text-2xl font-semibold text-gray-900">Upload Your Resume</h2>
          </div>
          
          {!uploadedFile ? (
            <div
              className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 ${
                dragActive 
                  ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-indigo-50 scale-105' 
                  : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Upload className="w-10 h-10 text-blue-600" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-3">
                Drop your resume here, or click to browse
              </h3>
              <p className="text-gray-600 mb-6 text-lg">
                Supports PDF, DOC, and DOCX files up to 5MB
              </p>
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  <Upload className="w-5 h-5 mr-2" />
                  Choose File
                </Button>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Shield className="w-4 h-4" />
                  <span>Your data is secure and private</span>
                </div>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept=".pdf,.doc,.docx"
                name="cv"
                onChange={handleFileInput}
              />
            </div>
          ) : (
            <div className="border-2 border-blue-200 bg-blue-50 rounded-2xl p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <FileText className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-lg">{uploadedFile.name}</p>
                    <p className="text-gray-600">
                      {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB • Uploaded successfully
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={removeFile}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
              
              {isUploading && (
                <div className="mt-6 p-4 bg-white rounded-xl border border-blue-200">
                  <div className="flex items-center gap-3">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                    <div>
                      <p className="font-medium text-blue-900">Analyzing your resume...</p>
                      <p className="text-sm text-blue-700">This may take a few seconds</p>
                    </div>
                  </div>
                  <div className="mt-3 bg-blue-100 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full animate-pulse" style={{width: '60%'}}></div>
                  </div>
                </div>
              )}
            </div>
          )}
        </Card>
        {/* Enhanced Analysis Results */}
        {analysisResult && (
          <>
            {/* Score and Quick Actions Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
              {/* Enhanced Score Card */}
              <Card className="p-8 text-center bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-100">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <Award className="w-6 h-6 text-green-600" />
                  <h3 className="text-xl font-semibold text-gray-900">Resume Score</h3>
                </div>
                <div className="relative w-32 h-32 mx-auto mb-6">
                  <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
                    <circle
                      cx="60"
                      cy="60"
                      r="50"
                      stroke="#E5E7EB"
                      strokeWidth="8"
                      fill="none"
                    />
                    <circle
                      cx="60"
                      cy="60"
                      r="50"
                      stroke={analysisResult.score >= 80 ? "#10B981" : analysisResult.score >= 60 ? "#F59E0B" : "#EF4444"}
                      strokeWidth="8"
                      fill="none"
                      strokeDasharray={`${(analysisResult.score / 100) * 314} 314`}
                      strokeLinecap="round"
                      className="transition-all duration-1000"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-4xl font-bold text-gray-900">{analysisResult.score}</span>
                    <span className="text-sm text-gray-600">/ 100</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className={`text-lg font-semibold ${
                    analysisResult.score >= 80 ? 'text-green-600' : 
                    analysisResult.score >= 60 ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {analysisResult.score >= 80 ? '🎉 Excellent Resume!' : 
                     analysisResult.score >= 60 ? '👍 Good Resume' : '⚠️ Needs Improvement'}
                  </p>
                  <p className="text-gray-600 text-sm">
                    {analysisResult.score >= 80 ? 'Your resume is well-optimized and ready for applications!' : 
                     analysisResult.score >= 60 ? 'Your resume is good but has room for improvement.' : 'Consider implementing the suggested improvements.'}
                  </p>
                </div>
              </Card>

              {/* Enhanced Quick Actions */}
              <Card className="p-8 lg:col-span-2">
                <div className="flex items-center gap-2 mb-6">
                  <Zap className="w-6 h-6 text-blue-600" />
                  <h3 className="text-xl font-semibold text-gray-900">Quick Actions</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Button
                    onClick={downloadOptimizedCV}
                    className="p-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    <Download className="w-5 h-5 mr-2" />
                    <div className="text-left">
                      <div className="font-semibold">Download Resume</div>
                      <div className="text-sm opacity-90">Get your analyzed resume</div>
                    </div>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="p-4 border-2 border-blue-200 hover:bg-blue-50 rounded-xl"
                  >
                    <Eye className="w-5 h-5 mr-2 text-blue-600" />
                    <div className="text-left">
                      <div className="font-semibold text-gray-900">View Analysis</div>
                      <div className="text-sm text-gray-600">Detailed breakdown</div>
                    </div>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="p-4 border-2 border-purple-200 hover:bg-purple-50 rounded-xl"
                    onClick={() => {
                      setUploadedFile(null);
                      setAnalysisResult(null);
                      if (fileInputRef.current) {
                        fileInputRef.current.value = '';
                      }
                    }}
                  >
                    <Upload className="w-5 h-5 mr-2 text-purple-600" />
                    <div className="text-left">
                      <div className="font-semibold text-gray-900">Upload New</div>
                      <div className="text-sm text-gray-600">Try another version</div>
                    </div>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="p-4 border-2 border-orange-200 hover:bg-orange-50 rounded-xl"
                  >
                    <Target className="w-5 h-5 mr-2 text-orange-600" />
                    <div className="text-left">
                      <div className="font-semibold text-gray-900">Start Interview</div>
                      <div className="text-sm text-gray-600">Practice with this resume</div>
                    </div>
                  </Button>
                </div>
              </Card>
            </div>

            {/* Detailed Analysis Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Strengths */}
              <Card className="p-8">
                <div className="flex items-center gap-2 mb-6">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                  <h3 className="text-xl font-semibold text-gray-900">Strengths</h3>
                </div>
                <div className="space-y-4">
                  {analysisResult.strengths.map((strength, index) => (
                    <div key={index} className="flex items-start gap-3 p-4 bg-green-50 rounded-xl border border-green-100">
                      <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <p className="text-gray-700">{strength}</p>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Areas for Improvement */}
              <Card className="p-8">
                <div className="flex items-center gap-2 mb-6">
                  <AlertTriangle className="w-6 h-6 text-orange-600" />
                  <h3 className="text-xl font-semibold text-gray-900">Areas for Improvement</h3>
                </div>
                <div className="space-y-4">
                  {analysisResult.improvements.map((improvement, index) => (
                    <div key={index} className="flex items-start gap-3 p-4 bg-orange-50 rounded-xl border border-orange-100">
                      <AlertTriangle className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
                      <p className="text-gray-700">{improvement}</p>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Keywords Analysis */}
            <Card className="p-8 mb-8">
              <div className="flex items-center gap-2 mb-6">
                <Target className="w-6 h-6 text-purple-600" />
                <h3 className="text-xl font-semibold text-gray-900">Keywords Analysis</h3>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Found Keywords */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    Found Keywords ({analysisResult.keywords.length})
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {analysisResult.keywords.map((keyword, index) => (
                      <span
                        key={index}
                        className="px-3 py-2 bg-green-100 text-green-800 rounded-lg text-sm font-medium border border-green-200"
                      >
                        {keyword}
                      </span>
                    ))}
                    {analysisResult.keywords.length === 0 && (
                      <p className="text-gray-500 italic">No keywords detected</p>
                    )}
                  </div>
                </div>

                {/* Missing Keywords */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-orange-600" />
                    Suggested Keywords ({analysisResult.missingKeywords.length})
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {analysisResult.missingKeywords.map((keyword, index) => (
                      <span
                        key={index}
                        className="px-3 py-2 bg-orange-100 text-orange-800 rounded-lg text-sm font-medium border border-orange-200"
                      >
                        {keyword}
                      </span>
                    ))}
                    {analysisResult.missingKeywords.length === 0 && (
                      <p className="text-gray-500 italic">No additional keywords suggested</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
                <div className="flex items-start gap-3">
                  <Brain className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <h5 className="font-semibold text-blue-900 mb-1">AI Recommendation</h5>
                    <p className="text-blue-800 text-sm">
                      Consider adding the suggested keywords naturally throughout your resume to improve ATS compatibility and match job requirements better.
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Next Steps */}
            <Card className="p-8 bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-100">
              <div className="flex items-center gap-2 mb-6">
                <TrendingUp className="w-6 h-6 text-blue-600" />
                <h3 className="text-xl font-semibold text-gray-900">Next Steps</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-6 bg-white rounded-xl shadow-sm">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Target className="w-6 h-6 text-blue-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">Practice Interview</h4>
                  <p className="text-sm text-gray-600 mb-4">Test your resume with our AI interview simulator</p>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="border-blue-200 text-blue-600 hover:bg-blue-50"
                  >
                    Start Practice
                  </Button>
                </div>
                
                <div className="text-center p-6 bg-white rounded-xl shadow-sm">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Download className="w-6 h-6 text-green-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">Download Report</h4>
                  <p className="text-sm text-gray-600 mb-4">Get a detailed PDF analysis report</p>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="border-green-200 text-green-600 hover:bg-green-50"
                  >
                    Get Report
                  </Button>
                </div>
                
                <div className="text-center p-6 bg-white rounded-xl shadow-sm">
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Sparkles className="w-6 h-6 text-purple-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">Optimize More</h4>
                  <p className="text-sm text-gray-600 mb-4">Upload an updated version for re-analysis</p>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="border-purple-200 text-purple-600 hover:bg-purple-50"
                    onClick={() => {
                      setUploadedFile(null);
                      setAnalysisResult(null);
                      if (fileInputRef.current) {
                        fileInputRef.current.value = '';
                      }
                    }}
                  >
                    Upload New
                  </Button>
                </div>
              </div>
            </Card>
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default UpdateCV;