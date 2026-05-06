import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
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
  X,
  Mic,
  MessageSquare,
  Users,
  Award,
  Sparkles,
  Video,
  FileText
} from 'lucide-react';

const GeneralInterview = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { dark } = useTheme();
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
      selectedColor: 'bg-green-100 border-green-400'
    },
    {
      id: 'intermediate',
      title: 'Intermediate',
      subtitle: 'For 1-3 years experience',
      experience: '1-3 years',
      color: 'bg-blue-50 border-blue-200 hover:border-blue-300',
      selectedColor: 'bg-blue-100 border-blue-400'
    },
    {
      id: 'advanced',
      title: 'Advanced',
      subtitle: 'For senior positions',
      experience: '3+ years',
      color: 'bg-purple-50 border-purple-200 hover:border-purple-300',
      selectedColor: 'bg-purple-100 border-purple-400'
    }
  ];

  // Job roles configuration
  const jobRoles = [
    {
      id: 'software-engineer',
      title: 'Software Engineer',
      description: 'Full-stack development and system design',
      color: 'bg-blue-50 border-blue-200 hover:border-blue-300',
      selectedColor: 'bg-blue-100 border-blue-400'
    },
    {
      id: 'frontend-developer',
      title: 'Frontend Developer',
      description: 'UI/UX implementation and client-side development',
      color: 'bg-purple-50 border-purple-200 hover:border-purple-300',
      selectedColor: 'bg-purple-100 border-purple-400'
    },
    {
      id: 'backend-developer',
      title: 'Backend Developer',
      description: 'Server-side logic and database management',
      color: 'bg-green-50 border-green-200 hover:border-green-300',
      selectedColor: 'bg-green-100 border-green-400'
    },
    {
      id: 'fullstack-developer',
      title: 'Full Stack Developer',
      description: 'End-to-end application development',
      color: 'bg-indigo-50 border-indigo-200 hover:border-indigo-300',
      selectedColor: 'bg-indigo-100 border-indigo-400'
    },
    {
      id: 'devops-engineer',
      title: 'DevOps Engineer',
      description: 'Infrastructure and deployment automation',
      color: 'bg-orange-50 border-orange-200 hover:border-orange-300',
      selectedColor: 'bg-orange-100 border-orange-400'
    },
    {
      id: 'data-scientist',
      title: 'Data Scientist',
      description: 'Data analysis and machine learning',
      color: 'bg-teal-50 border-teal-200 hover:border-teal-300',
      selectedColor: 'bg-teal-100 border-teal-400'
    },
    {
      id: 'mobile-developer',
      title: 'Mobile Developer',
      description: 'iOS and Android app development',
      color: 'bg-pink-50 border-pink-200 hover:border-pink-300',
      selectedColor: 'bg-pink-100 border-pink-400'
    },
    {
      id: 'qa-engineer',
      title: 'QA Engineer',
      description: 'Quality assurance and testing',
      color: 'bg-yellow-50 border-yellow-200 hover:border-yellow-300',
      selectedColor: 'bg-yellow-100 border-yellow-400'
    },
    {
      id: 'product-manager',
      title: 'Product Manager',
      description: 'Product strategy and roadmap planning',
      color: 'bg-red-50 border-red-200 hover:border-red-300',
      selectedColor: 'bg-red-100 border-red-400'
    },
    {
      id: 'ui-ux-designer',
      title: 'UI/UX Designer',
      description: 'User interface and experience design',
      color: 'bg-violet-50 border-violet-200 hover:border-violet-300',
      selectedColor: 'bg-violet-100 border-violet-400'
    },
    {
      id: 'system-architect',
      title: 'System Architect',
      description: 'System design and architecture planning',
      color: 'bg-gray-50 border-gray-200 hover:border-gray-300',
      selectedColor: 'bg-gray-100 border-gray-400'
    },
    {
      id: 'database-administrator',
      title: 'Database Administrator',
      description: 'Database management and optimization',
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
          <h1 className={`text-3xl font-bold mb-2 ${dark ? 'text-white' : 'text-slate-900'}`}>
            AI Interview Practice
          </h1>
          <p className={`text-lg ${dark ? 'text-slate-400' : 'text-slate-500'}`}>
            Customize your interview experience based on your skills and experience level
          </p>
        </div>

        {/* Features Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {[
            { title: 'Role-Based Questions', desc: 'Curated questions specific to your target job role', color: 'indigo' },
            { title: 'Instant Feedback', desc: 'Get detailed analysis and improvement suggestions', color: 'emerald' },
            { title: 'Track Progress', desc: 'Monitor your improvement over time', color: 'violet' },
          ].map(({ title, desc, color }) => (
            <div key={title} className={`p-5 rounded-xl border ${
              dark ? `bg-${color}-500/10 border-${color}-500/20` : `bg-${color}-50 border-${color}-100`
            }`}>
              <h3 className={`font-semibold mb-1 ${dark ? 'text-white' : 'text-slate-900'}`}>{title}</h3>
              <p className={`text-sm ${dark ? 'text-slate-400' : 'text-slate-500'}`}>{desc}</p>
            </div>
          ))}
        </div>

        {/* Entry Level */}
        <div className={`rounded-2xl border p-6 mb-6 ${dark ? 'bg-[#0D1117] border-white/10' : 'bg-white border-slate-200 shadow-sm'}`}>
          <h2 className={`text-lg font-bold mb-5 flex items-center gap-2 ${dark ? 'text-white' : 'text-slate-900'}`}>
            <Target className="w-5 h-5 text-indigo-500" />
            Experience Level
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {entryLevels.map((level) => (
              <div key={level.id} onClick={() => setSelectedLevel(level.id)}
                className={`relative p-5 rounded-xl border-2 cursor-pointer transition-all duration-200 text-center ${
                  selectedLevel === level.id
                    ? dark ? 'border-indigo-500 bg-indigo-500/10' : 'border-indigo-500 bg-indigo-50'
                    : dark ? 'border-white/10 hover:border-white/20 bg-white/[0.02]' : 'border-slate-200 hover:border-indigo-300 bg-white'
                }`}>
                <h3 className={`font-semibold mb-1 ${dark ? 'text-white' : 'text-slate-900'}`}>{level.title}</h3>
                <p className={`text-sm mb-1 ${dark ? 'text-slate-400' : 'text-slate-500'}`}>{level.subtitle}</p>
                <p className={`text-xs ${dark ? 'text-slate-500' : 'text-slate-400'}`}>{level.experience}</p>
                {selectedLevel === level.id && (
                  <div className="absolute top-3 right-3"><CheckCircle className="w-5 h-5 text-indigo-500" /></div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Job Role */}
        <div className={`rounded-2xl border p-6 mb-6 ${dark ? 'bg-[#0D1117] border-white/10' : 'bg-white border-slate-200 shadow-sm'}`}>
          <h2 className={`text-lg font-bold mb-2 flex items-center gap-2 ${dark ? 'text-white' : 'text-slate-900'}`}>
            <Target className="w-5 h-5 text-indigo-500" />
            Target Job Role
          </h2>
          <p className={`text-sm mb-5 ${dark ? 'text-slate-400' : 'text-slate-500'}`}>
            Select the role you're preparing for — questions will be tailored to it.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {jobRoles.map((role) => (
              <div key={role.id}
                onClick={() => setInterviewConfig(prev => ({ ...prev, targetRole: role.id }))}
                className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 text-center ${
                  interviewConfig.targetRole === role.id
                    ? dark ? 'border-indigo-500 bg-indigo-500/10' : 'border-indigo-500 bg-indigo-50'
                    : dark ? 'border-white/10 hover:border-white/20 bg-white/[0.02]' : 'border-slate-200 hover:border-indigo-300 bg-white'
                }`}>
                <h3 className={`text-sm font-semibold mb-1 ${dark ? 'text-white' : 'text-slate-900'}`}>{role.title}</h3>
                <p className={`text-xs ${dark ? 'text-slate-500' : 'text-slate-400'}`}>{role.description}</p>
                {interviewConfig.targetRole === role.id && (
                  <div className="absolute top-2 right-2"><CheckCircle className="w-4 h-4 text-indigo-500" /></div>
                )}
              </div>
            ))}
          </div>
          {interviewConfig.targetRole && (
            <div className={`mt-4 p-3 rounded-lg border text-sm ${dark ? 'bg-indigo-500/10 border-indigo-500/20 text-indigo-300' : 'bg-indigo-50 border-indigo-100 text-indigo-700'}`}>
              Selected: <span className="font-semibold">{jobRoles.find(r => r.id === interviewConfig.targetRole)?.title}</span>
            </div>
          )}
        </div>

        {/* Tech Stack */}
        <div className={`rounded-2xl border p-6 mb-6 ${dark ? 'bg-[#0D1117] border-white/10' : 'bg-white border-slate-200 shadow-sm'}`}>
          <h2 className={`text-lg font-bold mb-2 flex items-center gap-2 ${dark ? 'text-white' : 'text-slate-900'}`}>
            <Code className="w-5 h-5 text-indigo-500" />
            Tech Stack <span className={`text-sm font-normal ${dark ? 'text-slate-500' : 'text-slate-400'}`}>(optional)</span>
          </h2>
          <p className={`text-sm mb-5 ${dark ? 'text-slate-400' : 'text-slate-500'}`}>
            Pick the technologies you want to be interviewed on.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
            {techStackOptions.map((tech) => (
              <button key={tech.name} onClick={() => handleTechStackToggle(tech.name)}
                className={`px-3 py-2.5 rounded-lg border-2 text-sm font-medium transition-all duration-200 ${
                  selectedTechStack.includes(tech.name)
                    ? dark ? 'border-indigo-500 bg-indigo-500/15 text-indigo-300' : 'border-indigo-400 bg-indigo-50 text-indigo-700'
                    : dark ? 'border-white/10 bg-white/[0.02] text-slate-300 hover:border-white/20' : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                }`}>
                <div className="flex flex-col items-center gap-1">
                  <span>{tech.name}</span>
                  <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                    dark ? 'bg-white/10 text-slate-400' : 'bg-slate-100 text-slate-500'
                  }`}>{tech.category}</span>
                </div>
              </button>
            ))}
          </div>
          {selectedTechStack.length > 0 && (
            <div className={`mt-4 p-3 rounded-lg border ${dark ? 'bg-indigo-500/10 border-indigo-500/20' : 'bg-indigo-50 border-indigo-100'}`}>
              <div className="flex flex-wrap gap-2">
                {selectedTechStack.map(tech => (
                  <span key={tech} className={`px-2.5 py-1 rounded-full text-xs font-medium ${dark ? 'bg-indigo-500/20 text-indigo-300' : 'bg-indigo-100 text-indigo-700'}`}>{tech}</span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Config */}
        <div className={`rounded-2xl border p-6 mb-8 ${dark ? 'bg-[#0D1117] border-white/10' : 'bg-white border-slate-200 shadow-sm'}`}>
          <h2 className={`text-lg font-bold mb-5 flex items-center gap-2 ${dark ? 'text-white' : 'text-slate-900'}`}>
            <Settings className="w-5 h-5 text-indigo-500" />
            Interview Configuration
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div>
              <label className={`block text-xs font-semibold uppercase tracking-wide mb-2 ${dark ? 'text-slate-400' : 'text-slate-500'}`}>Interview Type</label>
              <select value={interviewConfig.interviewType}
                onChange={(e) => setInterviewConfig(prev => ({ ...prev, interviewType: e.target.value }))}
                className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  dark ? 'bg-white/5 border-white/10 text-white' : 'bg-white border-slate-200 text-slate-900'
                }`}>
                <option value="mixed">Mixed (Technical + HR)</option>
                <option value="technical">Technical Only</option>
                <option value="behavioral">HR/Behavioral Only</option>
              </select>
            </div>
            <div>
              <label className={`block text-xs font-semibold uppercase tracking-wide mb-2 ${dark ? 'text-slate-400' : 'text-slate-500'}`}>Number of Questions</label>
              <select value={interviewConfig.numberOfQuestions}
                onChange={(e) => setInterviewConfig(prev => ({ ...prev, numberOfQuestions: parseInt(e.target.value), duration: parseInt(e.target.value) * 2 }))}
                className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  dark ? 'bg-white/5 border-white/10 text-white' : 'bg-white border-slate-200 text-slate-900'
                }`}>
                <option value="5">5 Questions</option>
                <option value="10">10 Questions</option>
                <option value="15">15 Questions</option>
                <option value="20">20 Questions</option>
              </select>
            </div>
            <div>
              <label className={`block text-xs font-semibold uppercase tracking-wide mb-2 ${dark ? 'text-slate-400' : 'text-slate-500'}`}>Estimated Duration</label>
              <div className={`w-full px-4 py-2.5 rounded-xl border flex items-center gap-2 text-sm ${
                dark ? 'bg-white/5 border-white/10 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-600'
              }`}>
                <Clock className="w-4 h-4 text-indigo-500" />
                {interviewConfig.duration} minutes
              </div>
            </div>
          </div>
        </div>

        {/* Start Button */}
        <div className="text-center">
          <button onClick={startInterview}
            disabled={isGenerating || !selectedLevel || !interviewConfig.targetRole}
            className="px-10 py-3.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl shadow-lg hover:shadow-indigo-500/25 transition-all duration-200 inline-flex items-center gap-2">
            {isGenerating ? (
              <><div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />Generating...</>
            ) : (
              <>Choose Interview Mode<ArrowRight className="w-5 h-5" /></>
            )}
          </button>

          {!selectedLevel && (
            <p className={`text-sm mt-3 px-4 py-2 rounded-lg inline-block ${dark ? 'bg-red-500/10 text-red-400' : 'bg-red-50 text-red-600'}`}>
              Please select your experience level
            </p>
          )}
          {selectedLevel && !interviewConfig.targetRole && (
            <p className={`text-sm mt-3 px-4 py-2 rounded-lg inline-block ${dark ? 'bg-red-500/10 text-red-400' : 'bg-red-50 text-red-600'}`}>
              Please select your target job role
            </p>
          )}

          <p className={`text-sm mt-4 ${dark ? 'text-slate-500' : 'text-slate-400'}`}>
            {interviewConfig.numberOfQuestions} questions
            {interviewConfig.targetRole && ` · ${jobRoles.find(r => r.id === interviewConfig.targetRole)?.title}`}
            {selectedTechStack.length > 0 && ` · ${selectedTechStack.slice(0, 3).join(', ')}${selectedTechStack.length > 3 ? ` +${selectedTechStack.length - 3}` : ''}`}
          </p>
        </div>

        {/* Interview Mode Selection Modal */}
        {showInterviewModeSelection && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className={`rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto border ${
              dark ? 'bg-[#0D1117] border-white/10' : 'bg-white border-slate-200'
            }`}>
              {/* Header */}
              <div className={`p-6 border-b flex items-center justify-between ${dark ? 'border-white/10' : 'border-slate-100'}`}>
                <div>
                  <h2 className={`text-xl font-bold ${dark ? 'text-white' : 'text-slate-900'}`}>Choose Interview Mode</h2>
                  <p className={`text-sm mt-0.5 ${dark ? 'text-slate-400' : 'text-slate-500'}`}>Select how you'd like to conduct your interview</p>
                </div>
                <button onClick={() => setShowInterviewModeSelection(false)}
                  className={`p-2 rounded-lg transition-colors ${dark ? 'hover:bg-white/10 text-slate-400' : 'hover:bg-slate-100 text-slate-500'}`}>
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6">
                {/* Config Summary */}
                <div className={`mb-6 p-4 rounded-xl border ${dark ? 'bg-indigo-500/10 border-indigo-500/20' : 'bg-indigo-50 border-indigo-100'}`}>
                  <h3 className={`text-sm font-semibold mb-3 ${dark ? 'text-indigo-300' : 'text-indigo-700'}`}>Your Interview Configuration</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                    {[
                      { label: 'Level', value: entryLevels.find(l => l.id === selectedLevel)?.title },
                      { label: 'Role', value: jobRoles.find(r => r.id === interviewConfig.targetRole)?.title },
                      { label: 'Questions', value: interviewConfig.numberOfQuestions },
                      { label: 'Type', value: interviewConfig.interviewType },
                    ].map(({ label, value }) => (
                      <div key={label}>
                        <p className={`text-xs font-medium mb-0.5 ${dark ? 'text-slate-500' : 'text-slate-400'}`}>{label}</p>
                        <p className={`font-semibold ${dark ? 'text-white' : 'text-slate-900'}`}>{value}</p>
                      </div>
                    ))}
                  </div>
                  {selectedTechStack.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {selectedTechStack.slice(0, 6).map(tech => (
                        <span key={tech} className={`px-2 py-0.5 rounded text-xs font-medium ${dark ? 'bg-indigo-500/20 text-indigo-300' : 'bg-indigo-100 text-indigo-700'}`}>{tech}</span>
                      ))}
                      {selectedTechStack.length > 6 && (
                        <span className={`px-2 py-0.5 rounded text-xs ${dark ? 'text-slate-400' : 'text-slate-500'}`}>+{selectedTechStack.length - 6} more</span>
                      )}
                    </div>
                  )}
                </div>

                {/* Mode Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Face-to-Face */}
                  <div
                    onClick={() => startInterviewWithMode('face-to-face')}
                    className={`rounded-xl border-2 p-5 cursor-pointer transition-all duration-200 ${
                      dark
                        ? 'bg-white/[0.03] border-white/10 hover:border-indigo-500/60 hover:bg-indigo-500/5'
                        : 'bg-white border-slate-200 hover:border-indigo-400 hover:shadow-md'
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${dark ? 'bg-indigo-500/20' : 'bg-indigo-100'}`}>
                        <Video className="w-5 h-5 text-indigo-500" />
                      </div>
                      <div>
                        <h3 className={`font-semibold ${dark ? 'text-white' : 'text-slate-900'}`}>Face-to-Face AI</h3>
                        <p className={`text-xs ${dark ? 'text-slate-400' : 'text-slate-500'}`}>Interactive voice conversation</p>
                      </div>
                    </div>
                    <div className="space-y-2 mb-4">
                      {[
                        { icon: Mic, text: 'Real-time voice interaction' },
                        { icon: MessageSquare, text: 'Natural conversation flow' },
                        { icon: Sparkles, text: 'AI adapts to your responses' },
                        { icon: Clock, text: `~${interviewConfig.numberOfQuestions * 2} min (Voice + AI)` },
                      ].map(({ icon: Icon, text }) => (
                        <div key={text} className={`flex items-center gap-2 text-sm ${dark ? 'text-slate-300' : 'text-slate-600'}`}>
                          <Icon className="w-4 h-4 text-indigo-500 flex-shrink-0" />
                          <span>{text}</span>
                        </div>
                      ))}
                    </div>
                    <button disabled={isGenerating}
                      className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2">
                      {isGenerating ? <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" /> : <><Video className="w-4 h-4" />Start Face-to-Face</>}
                    </button>
                  </div>

                  {/* Role-Based */}
                  <div
                    onClick={() => startInterviewWithMode('role-based')}
                    className={`rounded-xl border-2 p-5 cursor-pointer transition-all duration-200 ${
                      dark
                        ? 'bg-white/[0.03] border-white/10 hover:border-emerald-500/60 hover:bg-emerald-500/5'
                        : 'bg-white border-slate-200 hover:border-emerald-400 hover:shadow-md'
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${dark ? 'bg-emerald-500/20' : 'bg-emerald-100'}`}>
                        <FileText className="w-5 h-5 text-emerald-500" />
                      </div>
                      <div>
                        <h3 className={`font-semibold ${dark ? 'text-white' : 'text-slate-900'}`}>Role-Based General</h3>
                        <p className={`text-xs ${dark ? 'text-slate-400' : 'text-slate-500'}`}>Structured question-answer format</p>
                      </div>
                    </div>
                    <div className="space-y-2 mb-4">
                      {[
                        { icon: Target, text: 'Role-specific questions' },
                        { icon: FileText, text: 'Text-based responses' },
                        { icon: Award, text: 'Detailed scoring & feedback' },
                        { icon: Clock, text: `~${interviewConfig.numberOfQuestions * 3} min (Self-paced)` },
                      ].map(({ icon: Icon, text }) => (
                        <div key={text} className={`flex items-center gap-2 text-sm ${dark ? 'text-slate-300' : 'text-slate-600'}`}>
                          <Icon className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                          <span>{text}</span>
                        </div>
                      ))}
                    </div>
                    <button disabled={isGenerating}
                      className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2">
                      {isGenerating ? <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" /> : <><FileText className="w-4 h-4" />Start Role-Based</>}
                    </button>
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
