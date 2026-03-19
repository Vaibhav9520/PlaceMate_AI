import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Code, ExternalLink, ArrowLeft, Search, Filter, Tag } from 'lucide-react';
import { toast } from 'sonner';
import { loadChunk, STATS } from '../data/companyQuestions';
import DashboardLayout from '../components/DashboardLayout';

const CodingPractice = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState('topic'); // topic, questions
  const [selectedTopic, setSelectedTopic] = useState('');
  const [questionCount, setQuestionCount] = useState(10);
  const [selectedTopicDifficulty, setSelectedTopicDifficulty] = useState(''); // New difficulty filter for topic selection
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('');
  const [topicStats, setTopicStats] = useState({});

  // Extract all questions from company data and organize by topics
  const [allQuestions, setAllQuestions] = useState([]);

  useEffect(() => {
    loadAllQuestions();
  }, []);

  const loadAllQuestions = async () => {
    setLoading(true);
    try {
      const allQuestionsData = [];
      
      // Load all chunks (0-13)
      for (let i = 0; i < STATS.totalChunks; i++) {
        try {
          const chunkData = await loadChunk(i);
          
          // Extract questions from each company in the chunk
          Object.keys(chunkData).forEach(company => {
            const companyData = chunkData[company];
            Object.keys(companyData).forEach(category => {
              const categoryQuestions = companyData[category];
              categoryQuestions.forEach(question => {
                allQuestionsData.push({
                  ...question,
                  company,
                  category
                });
              });
            });
          });
        } catch (error) {
          console.error(`Error loading chunk ${i}:`, error);
        }
      }

      setAllQuestions(allQuestionsData);
      calculateTopicStats(allQuestionsData);
      toast.success(`Loaded ${allQuestionsData.length} questions from ${STATS.totalCompanies} companies!`);
    } catch (error) {
      console.error('Error loading questions:', error);
      toast.error('Failed to load questions');
    } finally {
      setLoading(false);
    }
  };

  const calculateTopicStats = (questionsData) => {
    const stats = {};
    
    questionsData.forEach(question => {
      question.tags.forEach(tag => {
        if (!stats[tag]) {
          stats[tag] = {
            total: 0,
            easy: 0,
            medium: 0,
            hard: 0,
            companies: new Set()
          };
        }
        stats[tag].total++;
        stats[tag][question.difficulty.toLowerCase()]++;
        stats[tag].companies.add(question.company);
      });
    });

    // Convert companies Set to count
    Object.keys(stats).forEach(topic => {
      stats[topic].companiesCount = stats[topic].companies.size;
      delete stats[topic].companies;
    });

    setTopicStats(stats);
  };

  const getTopTopics = () => {
    return Object.entries(topicStats)
      .sort(([,a], [,b]) => b.total - a.total)
      .slice(0, 20)
      .map(([topic, stats]) => ({ topic, ...stats }));
  };

  const generateQuestions = () => {
    if (!selectedTopic) {
      toast.error('Please select a topic');
      return;
    }

    setLoading(true);
    
    // Filter questions by selected topic
    let topicQuestions = allQuestions.filter(question => 
      question.tags.some(tag => tag.toLowerCase() === selectedTopic.toLowerCase())
    );

    // Filter by difficulty if selected
    if (selectedTopicDifficulty) {
      topicQuestions = topicQuestions.filter(question => 
        question.difficulty === selectedTopicDifficulty
      );
    }

    // Remove duplicates based on question name and link
    const uniqueQuestions = topicQuestions.reduce((acc, current) => {
      const exists = acc.find(q => q.name === current.name && q.link === current.link);
      if (!exists) {
        acc.push(current);
      }
      return acc;
    }, []);

    // Sort by difficulty and frequency
    const sortedQuestions = uniqueQuestions.sort((a, b) => {
      const difficultyOrder = { 'Easy': 1, 'Medium': 2, 'Hard': 3 };
      const diffA = difficultyOrder[a.difficulty] || 2;
      const diffB = difficultyOrder[b.difficulty] || 2;
      
      if (diffA !== diffB) return diffA - diffB;
      
      // Sort by frequency (higher first)
      const freqA = parseFloat(a.frequency.replace('%', '')) || 0;
      const freqB = parseFloat(b.frequency.replace('%', '')) || 0;
      return freqB - freqA;
    });

    // Take requested number of questions
    const selectedQuestions = sortedQuestions.slice(0, questionCount);
    
    setQuestions(selectedQuestions);
    setStep('questions');
    setLoading(false);
    
    const difficultyText = selectedTopicDifficulty ? ` (${selectedTopicDifficulty})` : '';
    toast.success(`Found ${selectedQuestions.length} ${selectedTopic}${difficultyText} questions!`);
  };

  const openLeetCode = (question) => {
    if (question.link) {
      window.open(question.link, '_blank');
    } else {
      toast.error('No link available for this question');
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Hard':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const filteredQuestions = questions.filter(q => {
    const matchesSearch = searchTerm === '' || 
      q.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.company.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDifficulty = selectedDifficulty === '' || q.difficulty === selectedDifficulty;
    
    return matchesSearch && matchesDifficulty;
  });

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-lg text-gray-600">Loading questions...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (step === 'topic') {
    const topTopics = getTopTopics();

    return (
      <DashboardLayout>
        <div className="p-8">

          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-3">
              <Code className="inline w-10 h-10 mr-3 text-blue-600" />
              Coding Practice by Topics
            </h1>
            <p className="text-lg text-gray-600 mb-2">
              Practice real interview questions organized by programming topics
            </p>
            <p className="text-sm text-gray-500">
              {allQuestions.length.toLocaleString()} questions • {Object.keys(topicStats).length} topics • From {STATS.totalCompanies} companies
            </p>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Select Topic & Question Count</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Programming Topic
                </label>
                <select
                  value={selectedTopic}
                  onChange={(e) => setSelectedTopic(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Choose a topic...</option>
                  {topTopics.map((item) => (
                    <option key={item.topic} value={item.topic}>
                      {item.topic} ({item.total} questions)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Difficulty Level
                </label>
                <select
                  value={selectedTopicDifficulty}
                  onChange={(e) => setSelectedTopicDifficulty(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All Difficulties</option>
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Number of Questions
                </label>
                <select
                  value={questionCount}
                  onChange={(e) => setQuestionCount(Number(e.target.value))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value={5}>5 Questions</option>
                  <option value={10}>10 Questions</option>
                  <option value={15}>15 Questions</option>
                  <option value={20}>20 Questions</option>
                  <option value={25}>25 Questions</option>
                  <option value={50}>50 Questions</option>
                </select>
              </div>

              <button
                onClick={generateQuestions}
                disabled={!selectedTopic}
                className="w-full py-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                Get Practice Questions
              </button>
            </CardContent>
          </Card>



          <div className="mt-12 bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="font-medium text-blue-800 mb-2">🎯 How to Use:</h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Select a programming topic (Array, String, Tree, etc.)</li>
              <li>• Choose difficulty level (Easy, Medium, Hard, or All)</li>
              <li>• Choose how many questions you want to practice</li>
              <li>• Get a curated list of real interview questions</li>
              <li>• Click on any question to solve it online</li>
              <li>• Questions are sorted by difficulty and frequency</li>
            </ul>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Questions List View
  return (
    <DashboardLayout>
      <div className="p-8">

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {selectedTopic} Practice Questions
          </h1>
          <p className="text-gray-600 mb-4">
            {questions.length} questions • Showing {filteredQuestions.length} after filters
          </p>
          
          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 max-w-2xl mx-auto">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search questions or companies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
              >
                <option value="">All Difficulties</option>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {filteredQuestions.map((question, index) => (
            <div
              key={`${question.name}-${question.company}-${index}`}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border-2 border-transparent hover:border-blue-500 p-6"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {question.name}
                    </h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getDifficultyColor(question.difficulty)}`}>
                      {question.difficulty}
                    </span>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-3">
                    {question.tags.slice(0, 5).map((tag, tagIndex) => (
                      <span
                        key={tagIndex}
                        className="flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-xs"
                      >
                        <Tag className="w-3 h-3" />
                        {tag}
                      </span>
                    ))}
                    {question.tags.length > 5 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-500 rounded-md text-xs">
                        +{question.tags.length - 5} more
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span><strong>Company:</strong> {question.company}</span>
                    <span><strong>Frequency:</strong> <span className="text-green-600 font-medium">{question.frequency}</span></span>
                    <span><strong>Acceptance:</strong> <span className="text-blue-600 font-medium">{question.acceptance}</span></span>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 ml-4">
                  <button
                    onClick={() => openLeetCode(question)}
                    className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Solve Problem
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredQuestions.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No questions found matching your filters</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedDifficulty('');
              }}
              className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Clear Filters
            </button>
          </div>
        )}

        <div className="mt-8 bg-green-50 border border-green-200 rounded-lg p-6">
          <h3 className="font-medium text-green-800 mb-2">💡 Practice Tips:</h3>
          <ul className="text-sm text-green-700 space-y-1">
            <li>• Start with Easy problems and gradually move to Medium/Hard</li>
            <li>• Focus on high-frequency questions (higher percentage = more common in interviews)</li>
            <li>• Practice explaining your solution approach out loud</li>
            <li>• Time yourself to simulate real interview conditions</li>
            <li>• Review multiple solutions and optimize your approach</li>
          </ul>
        </div>
      </div>
    </DashboardLayout>
    );
};

export default CodingPractice;