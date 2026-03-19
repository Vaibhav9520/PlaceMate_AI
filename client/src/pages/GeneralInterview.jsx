import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import DashboardLayout from '../components/DashboardLayout';
import { Card } from '../components/ui/Card';
import Button from '../components/ui/Button';
import { toast } from 'sonner';
import { interviewAPI } from '../services/api';
import { 
  Code, 
  Clock, 
  Target, 
  Settings, 
  CheckCircle,
  ArrowRight,
  Zap,
  Brain,
  Trophy,
  Video,
  FileText,
  X,
  Mic,
  MessageSquare,
  Users,
  Award
} from 'lucide-react';

const GeneralInterview = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedLevel, setSelectedLevel] = useState('');
  const [selectedTechStack, setSelectedTechStack] = useState([]);
  const [interviewConfig, setInterviewConfig] = useState({
    interviewType: 'mixed',
    targetRole: '',
    numberOfQuestions: 10,
    duration: 20
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [showInterviewModeSelection, setShowInterviewModeSelection] = useState(false);

  // Entry levels configuration
  const entryLevels = [
    {
      id: 'entry',
      title: 'Entry Level',
      subtitle: 'For beginners and fresh graduates',
      experience: '0-1 years',
      color: 'bg-green-50 border-green-200 hover:border-green-300',
      selectedColor: 'bg-green-100 border-green-400',
      icon: '🌱'
    },
    {
      id: 'intermediate',
      title: 'Intermediate',
      subtitle: 'For 1-3 years experience',
      experience: '1-3 years',
      color: 'bg-blue-50 border-blue-200 hover:border-blue-300',
      selectedColor: 'bg-blue-100 border-blue-400',
      icon: '⚡'
    },
    {
      id: 'advanced',
      title: 'Advanced',
      subtitle: 'For senior positions',
      experience: '3+ years',
      color: 'bg-purple-50 border-purple-200 hover:border-purple-300',
      selectedColor: 'bg-purple-100 border-purple-400',
      icon: '🚀'
    }
  ];

  // Job roles configuration
  const jobRoles = [
    {
      id: 'software-engineer',
      title: 'Software Engineer',
      description: 'Full-stack development and system design',
      icon: '💻',
      color: 'bg-blue-50 border-blue-200 hover:border-blue-300',
      selectedColor: 'bg-blue-100 border-blue-400'
    },
    {
      id: 'frontend-developer',
      title: 'Frontend Developer',
      description: 'UI/UX implementation and client-side development',
      icon: '🎨',
      color: 'bg-purple-50 border-purple-200 hover:border-purple-300',
      selectedColor: 'bg-purple-100 border-purple-400'
    },
    {
      id: 'backend-developer',
      title: 'Backend Developer',
      description: 'Server-side logic and database management',
      icon: '⚙️',
      color: 'bg-green-50 border-green-200 hover:border-green-300',
      selectedColor: 'bg-green-100 border-green-400'
    },
    {
      id: 'fullstack-developer',
      title: 'Full Stack Developer',
      description: 'End-to-end application development',
      icon: '🚀',
      color: 'bg-indigo-50 border-indigo-200 hover:border-indigo-300',
      selectedColor: 'bg-indigo-100 border-indigo-400'
    },
    {
      id: 'devops-engineer',
      title: 'DevOps Engineer',
      description: 'Infrastructure and deployment automation',
      icon: '🔧',
      color: 'bg-orange-50 border-orange-200 hover:border-orange-300',
      selectedColor: 'bg-orange-100 border-orange-400'
    },
    {
      id: 'data-scientist',
      title: 'Data Scientist',
      description: 'Data analysis and machine learning',
      icon: '📊',
      color: 'bg-teal-50 border-teal-200 hover:border-teal-300',
      selectedColor: 'bg-teal-100 border-teal-400'
    },
    {
      id: 'mobile-developer',
      title: 'Mobile Developer',
      description: 'iOS and Android app development',
      icon: '📱',
      color: 'bg-pink-50 border-pink-200 hover:border-pink-300',
      selectedColor: 'bg-pink-100 border-pink-400'
    },
    {
      id: 'qa-engineer',
      title: 'QA Engineer',
      description: 'Quality assurance and testing',
      icon: '🧪',
      color: 'bg-yellow-50 border-yellow-200 hover:border-yellow-300',
      selectedColor: 'bg-yellow-100 border-yellow-400'
    },
    {
      id: 'product-manager',
      title: 'Product Manager',
      description: 'Product strategy and roadmap planning',
      icon: '📋',
      color: 'bg-red-50 border-red-200 hover:border-red-300',
      selectedColor: 'bg-red-100 border-red-400'
    },
    {
      id: 'ui-ux-designer',
      title: 'UI/UX Designer',
      description: 'User interface and experience design',
      icon: '🎯',
      color: 'bg-violet-50 border-violet-200 hover:border-violet-300',
      selectedColor: 'bg-violet-100 border-violet-400'
    },
    {
      id: 'system-architect',
      title: 'System Architect',
      description: 'System design and architecture planning',
      icon: '🏗️',
      color: 'bg-gray-50 border-gray-200 hover:border-gray-300',
      selectedColor: 'bg-gray-100 border-gray-400'
    },
    {
      id: 'database-administrator',
      title: 'Database Administrator',
      description: 'Database management and optimization',
      icon: '🗄️',
      color: 'bg-emerald-50 border-emerald-200 hover:border-emerald-300',
      selectedColor: 'bg-emerald-100 border-emerald-400'
    }
  ];

  // Tech stack options
  const techStackOptions = [
    // Frontend
    { name: 'React', category: 'Frontend', color: 'bg-blue-100 text-blue-800' },
    { name: 'Angular', category: 'Frontend', color: 'bg-red-100 text-red-800' },
    { name: 'Vue.js', category: 'Frontend', color: 'bg-green-100 text-green-800' },
    { name: 'Next.js', category: 'Frontend', color: 'bg-gray-100 text-gray-800' },
    
    // Backend
    { name: 'TypeScript', category: 'Language', color: 'bg-blue-100 text-blue-800' },
    { name: 'JavaScript', category: 'Language', color: 'bg-yellow-100 text-yellow-800' },
    { name: 'Node.js', category: 'Backend', color: 'bg-green-100 text-green-800' },
    { name: 'Express.js', category: 'Backend', color: 'bg-gray-100 text-gray-800' },
    
    // Languages
    { name: 'Python', category: 'Language', color: 'bg-blue-100 text-blue-800' },
    { name: 'Django', category: 'Backend', color: 'bg-green-100 text-green-800' },
    { name: 'Flask', category: 'Backend', color: 'bg-gray-100 text-gray-800' },
    { name: 'Java', category: 'Language', color: 'bg-orange-100 text-orange-800' },
    
    // Databases
    { name: 'Spring Boot', category: 'Backend', color: 'bg-green-100 text-green-800' },
    { name: '.NET', category: 'Backend', color: 'bg-purple-100 text-purple-800' },
    { name: 'MongoDB', category: 'Database', color: 'bg-green-100 text-green-800' },
    { name: 'PostgreSQL', category: 'Database', color: 'bg-blue-100 text-blue-800' },
    
    // Tools & Others
    { name: 'MySQL', category: 'Database', color: 'bg-blue-100 text-blue-800' },
    { name: 'Redis', category: 'Database', color: 'bg-red-100 text-red-800' },
    { name: 'Docker', category: 'DevOps', color: 'bg-blue-100 text-blue-800' },
    { name: 'Kubernetes', category: 'DevOps', color: 'bg-blue-100 text-blue-800' },
    
    // Cloud
    { name: 'AWS', category: 'Cloud', color: 'bg-orange-100 text-orange-800' },
    { name: 'Azure', category: 'Cloud', color: 'bg-blue-100 text-blue-800' },
    { name: 'Google Cloud', category: 'Cloud', color: 'bg-blue-100 text-blue-800' },
    { name: 'React Native', category: 'Mobile', color: 'bg-blue-100 text-blue-800' }
  ];

  const handleTechStackToggle = (tech) => {
    setSelectedTechStack(prev => {
      if (prev.includes(tech)) {
        return prev.filter(t => t !== tech);
      } else {
        return [...prev, tech];
      }
    });
  };

  const startInterview = async () => {
    if (!selectedLevel) {
      toast.error('Please select your experience level');
      return;
    }

    if (!interviewConfig.targetRole) {
      toast.error('Please select your target job role');
      return;
    }

    if (selectedTechStack.length === 0) {
      toast.error('Please select at least one technology');
      return;
    }

    // Show interview mode selection instead of directly starting
    setShowInterviewModeSelection(true);
  };

  const startInterviewWithMode = async (mode) => {
    setShowInterviewModeSelection(false);
    
    if (mode === 'face-to-face') {
      // Redirect to Face-to-Face interview page
      navigate('/face-to-face-interview');
      return;
    }
    
    setIsGenerating(true);

    try {
      const interviewData = {
        interviewType: interviewConfig.interviewType,
        difficultyLevel: selectedLevel,
        targetRole: interviewConfig.targetRole,
        techStack: selectedTechStack,
        numberOfQuestions: interviewConfig.numberOfQuestions,
        mode: mode // 'role-based'
      };

      console.log('🚀 Starting interview with config:', interviewData);

      // Call the real API to generate role-based questions
      const response = await interviewAPI.generateRoleBased(interviewData);

      if (response.data.success) {
        const interview = response.data.interview;
        
        // Store interview data for the session
        localStorage.setItem('currentInterview', JSON.stringify(interview));
        
        toast.success('Role-Based Interview started!');
        navigate('/interview-session');
      } else {
        throw new Error(response.data.message || 'Failed to generate interview');
      }

    } catch (error) {
      console.error('❌ Error starting interview:', error);
      toast.error('Failed to start interview. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            AI Interview Practice
          </h1>
          <p className="text-gray-600 text-lg">
            Customize your interview experience based on your skills and experience level
          </p>
        </div>

        {/* Features Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Brain className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Role-Based Questions</h3>
            <p className="text-sm text-gray-600">Curated questions specific to your target job role</p>
          </div>
          
          <div className="text-center p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Zap className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Instant Feedback</h3>
            <p className="text-sm text-gray-600">Get detailed analysis and improvement suggestions</p>
          </div>
          
          <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trophy className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Track Progress</h3>
            <p className="text-sm text-gray-600">Monitor your improvement over time</p>
          </div>
        </div>

        {/* Entry Level Selection */}
        <Card className="p-8 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
            <Target className="w-6 h-6 text-blue-600" />
            Entry Level
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {entryLevels.map((level) => (
              <div
                key={level.id}
                onClick={() => setSelectedLevel(level.id)}
                className={`
                  relative p-6 rounded-xl border-2 cursor-pointer transition-all duration-200
                  ${selectedLevel === level.id ? level.selectedColor : level.color}
                `}
              >
                <div className="text-center">
                  <div className="text-3xl mb-3">{level.icon}</div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {level.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">
                    {level.subtitle}
                  </p>
                  <p className="text-xs text-gray-500">
                    {level.experience}
                  </p>
                </div>
                
                {selectedLevel === level.id && (
                  <div className="absolute top-3 right-3">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>

        {/* Job Role Selection */}
        <Card className="p-8 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
            <Target className="w-6 h-6 text-blue-600" />
            Target Job Role
          </h2>
          
          <p className="text-gray-600 mb-6">
            Select the job role you're preparing for. This will tailor the interview questions to your target position.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {jobRoles.map((role) => (
              <div
                key={role.id}
                onClick={() => setInterviewConfig(prev => ({ ...prev, targetRole: role.id }))}
                className={`
                  relative p-4 rounded-xl border-2 cursor-pointer transition-all duration-200
                  ${interviewConfig.targetRole === role.id ? role.selectedColor : role.color}
                `}
              >
                <div className="text-center">
                  <div className="text-2xl mb-2">{role.icon}</div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-1">
                    {role.title}
                  </h3>
                  <p className="text-xs text-gray-600">
                    {role.description}
                  </p>
                </div>
                
                {interviewConfig.targetRole === role.id && (
                  <div className="absolute top-2 right-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                )}
              </div>
            ))}
          </div>
          
          {interviewConfig.targetRole && (
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">Selected Role:</h4>
              <div className="flex items-center gap-2">
                <span className="text-2xl">
                  {jobRoles.find(role => role.id === interviewConfig.targetRole)?.icon}
                </span>
                <span className="font-medium text-blue-800">
                  {jobRoles.find(role => role.id === interviewConfig.targetRole)?.title}
                </span>
              </div>
              <p className="text-sm text-blue-700 mt-1">
                {jobRoles.find(role => role.id === interviewConfig.targetRole)?.description}
              </p>
            </div>
          )}
        </Card>

        {/* Tech Stack Selection */}
        <Card className="p-8 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
            <Code className="w-6 h-6 text-blue-600" />
            Tech Stack (Optional)
          </h2>
          
          <p className="text-gray-600 mb-6">
            Select the technologies you want to be interviewed on. You can choose multiple options.
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {techStackOptions.map((tech) => (
              <button
                key={tech.name}
                onClick={() => handleTechStackToggle(tech.name)}
                className={`
                  px-4 py-3 rounded-lg border-2 text-sm font-medium transition-all duration-200
                  ${selectedTechStack.includes(tech.name)
                    ? 'border-blue-400 bg-blue-50 text-blue-700 shadow-md'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                  }
                `}
              >
                <div className="flex flex-col items-center gap-1">
                  <span>{tech.name}</span>
                  <span className={`text-xs px-2 py-1 rounded-full ${tech.color}`}>
                    {tech.category}
                  </span>
                </div>
              </button>
            ))}
          </div>
          
          {selectedTechStack.length > 0 && (
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">Selected Technologies:</h4>
              <div className="flex flex-wrap gap-2">
                {selectedTechStack.map((tech) => (
                  <span
                    key={tech}
                    className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}
        </Card>

        {/* Interview Configuration */}
        <Card className="p-8 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
            <Settings className="w-6 h-6 text-blue-600" />
            Interview Configuration
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Interview Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Interview Type
              </label>
              <select
                value={interviewConfig.interviewType}
                onChange={(e) => setInterviewConfig(prev => ({ ...prev, interviewType: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="mixed">Mixed (Technical + HR)</option>
                <option value="technical">Technical Only</option>
                <option value="behavioral">HR/Behavioral Only</option>
              </select>
            </div>

            {/* Number of Questions */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Number of Questions
              </label>
              <select
                value={interviewConfig.numberOfQuestions}
                onChange={(e) => setInterviewConfig(prev => ({ 
                  ...prev, 
                  numberOfQuestions: parseInt(e.target.value),
                  duration: parseInt(e.target.value) * 2
                }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="5">5 Questions</option>
                <option value="10">10 Questions</option>
                <option value="15">15 Questions</option>
                <option value="20">20 Questions</option>
              </select>
            </div>

            {/* Estimated Duration */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Estimated Duration
              </label>
              <div className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 flex items-center gap-2">
                <Clock className="w-5 h-5 text-gray-500" />
                <span className="text-gray-700">{interviewConfig.duration} minutes</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Start Interview Button */}
        <div className="text-center">
          <Button
            onClick={startInterview}
            disabled={isGenerating || !selectedLevel || !interviewConfig.targetRole}
            className="px-12 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
          >
            {isGenerating ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                Generating Interview...
              </>
            ) : (
              <>
                Choose Interview Mode
                <ArrowRight className="w-5 h-5 ml-2" />
              </>
            )}
          </Button>
          
          {/* Validation Messages */}
          {!selectedLevel && (
            <p className="text-red-600 text-sm mt-3 bg-red-50 p-3 rounded-lg">
              Please select your experience level to continue
            </p>
          )}
          
          {selectedLevel && !interviewConfig.targetRole && (
            <p className="text-red-600 text-sm mt-3 bg-red-50 p-3 rounded-lg">
              Please select your target job role to continue
            </p>
          )}
          
          {selectedLevel && interviewConfig.targetRole && selectedTechStack.length === 0 && (
            <p className="text-orange-600 text-sm mt-3 bg-orange-50 p-3 rounded-lg">
              Please select at least one technology for a focused interview
            </p>
          )}
          
          <div className="mt-6 text-center">
            <p className="text-gray-500 text-sm">
              The interview will consist of {interviewConfig.numberOfQuestions} questions
              {interviewConfig.targetRole && ` for ${jobRoles.find(role => role.id === interviewConfig.targetRole)?.title}`}
              {selectedTechStack.length > 0 && ` focusing on ${selectedTechStack.slice(0, 3).join(', ')}`}
              {selectedTechStack.length > 3 && ` and ${selectedTechStack.length - 3} more technologies`}
            </p>
            <p className="text-gray-500 text-sm mt-1">
              Choose between Face-to-Face AI or Role-Based interview modes
            </p>
          </div>
        </div>

        {/* Interview Mode Selection Modal */}
        {showInterviewModeSelection && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              {/* Modal Header */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Choose Interview Mode</h2>
                    <p className="text-gray-600 mt-1">Select how you'd like to conduct your interview</p>
                  </div>
                  <button
                    onClick={() => setShowInterviewModeSelection(false)}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <X className="w-6 h-6 text-gray-500" />
                  </button>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-6">
                {/* Interview Summary */}
                <div className="mb-8 p-4 bg-blue-50 rounded-xl">
                  <h3 className="font-semibold text-blue-900 mb-2">Your Interview Configuration</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-blue-700 font-medium">Level:</span>
                      <p className="text-blue-800">{entryLevels.find(level => level.id === selectedLevel)?.title}</p>
                    </div>
                    <div>
                      <span className="text-blue-700 font-medium">Role:</span>
                      <p className="text-blue-800">{jobRoles.find(role => role.id === interviewConfig.targetRole)?.title}</p>
                    </div>
                    <div>
                      <span className="text-blue-700 font-medium">Questions:</span>
                      <p className="text-blue-800">{interviewConfig.numberOfQuestions}</p>
                    </div>
                    <div>
                      <span className="text-blue-700 font-medium">Type:</span>
                      <p className="text-blue-800">{interviewConfig.interviewType}</p>
                    </div>
                  </div>
                  {selectedTechStack.length > 0 && (
                    <div className="mt-3">
                      <span className="text-blue-700 font-medium text-sm">Technologies:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {selectedTechStack.slice(0, 6).map((tech) => (
                          <span key={tech} className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                            {tech}
                          </span>
                        ))}
                        {selectedTechStack.length > 6 && (
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                            +{selectedTechStack.length - 6} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Interview Mode Options */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Face-to-Face AI Interview */}
                  <div className="group">
                    <div className="border-2 border-gray-200 rounded-xl p-6 hover:border-blue-400 hover:shadow-lg transition-all duration-200 cursor-pointer h-full"
                         onClick={() => startInterviewWithMode('face-to-face')}>
                      
                      {/* Header */}
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                          <Video className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">Face-to-Face AI Interview</h3>
                          <p className="text-sm text-gray-600">Interactive voice conversation</p>
                        </div>
                      </div>

                      {/* Features */}
                      <div className="space-y-3 mb-6">
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <Mic className="w-4 h-4 text-green-600" />
                          <span>Real-time voice interaction</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <MessageSquare className="w-4 h-4 text-blue-600" />
                          <span>Natural conversation flow</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <Brain className="w-4 h-4 text-purple-600" />
                          <span>AI adapts to your responses</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <Clock className="w-4 h-4 text-orange-600" />
                          <span>~{interviewConfig.numberOfQuestions * 2} minutes (Voice + AI processing)</span>
                        </div>
                      </div>

                      {/* Best For */}
                      <div className="bg-blue-50 rounded-lg p-3 mb-4">
                        <h4 className="text-sm font-medium text-blue-900 mb-1">Best for:</h4>
                        <p className="text-xs text-blue-700">Practicing communication skills, building confidence, and experiencing realistic interview scenarios</p>
                      </div>

                      {/* Action Button */}
                      <button 
                        className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center justify-center gap-2"
                        disabled={isGenerating}
                      >
                        {isGenerating ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        ) : (
                          <>
                            <Video className="w-4 h-4" />
                            Start Face-to-Face Interview
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Role-Based General Interview */}
                  <div className="group">
                    <div className="border-2 border-gray-200 rounded-xl p-6 hover:border-green-400 hover:shadow-lg transition-all duration-200 cursor-pointer h-full"
                         onClick={() => startInterviewWithMode('role-based')}>
                      
                      {/* Header */}
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-teal-600 rounded-xl flex items-center justify-center">
                          <FileText className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">Role-Based General Interview</h3>
                          <p className="text-sm text-gray-600">Structured question-answer format</p>
                        </div>
                      </div>

                      {/* Features */}
                      <div className="space-y-3 mb-6">
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <Target className="w-4 h-4 text-green-600" />
                          <span>Role-specific questions</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <FileText className="w-4 h-4 text-blue-600" />
                          <span>Text-based responses</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <Award className="w-4 h-4 text-purple-600" />
                          <span>Detailed scoring & feedback</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <Users className="w-4 h-4 text-indigo-600" />
                          <span>Industry-standard questions</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <Clock className="w-4 h-4 text-orange-600" />
                          <span>~{interviewConfig.numberOfQuestions * 3} minutes (Self-paced)</span>
                        </div>
                      </div>

                      {/* Best For */}
                      <div className="bg-green-50 rounded-lg p-3 mb-4">
                        <h4 className="text-sm font-medium text-green-900 mb-1">Best for:</h4>
                        <p className="text-xs text-green-700">Focused preparation, technical assessment, and comprehensive skill evaluation for your target role</p>
                      </div>

                      {/* Action Button */}
                      <button 
                        className="w-full py-3 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-lg font-medium hover:from-green-700 hover:to-teal-700 transition-all duration-200 flex items-center justify-center gap-2"
                        disabled={isGenerating}
                      >
                        {isGenerating ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        ) : (
                          <>
                            <FileText className="w-4 h-4" />
                            Start Role-Based Interview
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Additional Information */}
                <div className="mt-8 space-y-6">
                  {/* Comparison Table */}
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h4 className="font-semibold text-gray-900 mb-4 text-center">📊 Mode Comparison</h4>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-gray-200">
                            <th className="text-left py-2 font-medium text-gray-700">Feature</th>
                            <th className="text-center py-2 font-medium text-blue-700">Face-to-Face AI</th>
                            <th className="text-center py-2 font-medium text-green-700">Role-Based General</th>
                          </tr>
                        </thead>
                        <tbody className="space-y-2">
                          <tr className="border-b border-gray-100">
                            <td className="py-2 text-gray-700">Interaction Type</td>
                            <td className="text-center py-2">🎤 Voice</td>
                            <td className="text-center py-2">⌨️ Text</td>
                          </tr>
                          <tr className="border-b border-gray-100">
                            <td className="py-2 text-gray-700">Response Time</td>
                            <td className="text-center py-2">⚡ Real-time</td>
                            <td className="text-center py-2">🤔 Take your time</td>
                          </tr>
                          <tr className="border-b border-gray-100">
                            <td className="py-2 text-gray-700">Feedback Detail</td>
                            <td className="text-center py-2">📝 Communication focused</td>
                            <td className="text-center py-2">📊 Comprehensive analysis</td>
                          </tr>
                          <tr className="border-b border-gray-100">
                            <td className="py-2 text-gray-700">Best for Beginners</td>
                            <td className="text-center py-2">✅ Yes</td>
                            <td className="text-center py-2">✅ Yes</td>
                          </tr>
                          <tr>
                            <td className="py-2 text-gray-700">Preparation Level</td>
                            <td className="text-center py-2">🎯 Practice speaking</td>
                            <td className="text-center py-2">📚 Deep knowledge test</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Pro Tips */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-blue-50 rounded-lg p-4">
                      <h5 className="font-medium text-blue-900 mb-2">🎤 Face-to-Face Tips</h5>
                      <ul className="text-sm text-blue-700 space-y-1">
                        <li>• Speak clearly and at a moderate pace</li>
                        <li>• Practice in a quiet environment</li>
                        <li>• Think out loud to show your process</li>
                        <li>• Don't worry about perfect answers</li>
                      </ul>
                    </div>
                    <div className="bg-green-50 rounded-lg p-4">
                      <h5 className="font-medium text-green-900 mb-2">📝 Role-Based Tips</h5>
                      <ul className="text-sm text-green-700 space-y-1">
                        <li>• Take time to structure your answers</li>
                        <li>• Use specific examples and metrics</li>
                        <li>• Review your responses before submitting</li>
                        <li>• Focus on technical accuracy</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default GeneralInterview;