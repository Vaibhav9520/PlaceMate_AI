import { useState, useEffect } from 'react';
import { ArrowLeft, ExternalLink, Building2, Calendar, Code2, Tag, TrendingUp, Clock } from 'lucide-react';
import { COMPANIES, QUESTION_TYPES, STATS, loadCompanyData } from '../data/companyQuestions';
import DashboardLayout from '../components/DashboardLayout';

const CompanyQuestions = () => {
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [selectedType, setSelectedType] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [companiesPerPage] = useState(20);
  const [questionsPerPage] = useState(15);
  const [companyData, setCompanyData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);


  useEffect(() => {
    if (selectedCompany && !companyData) {
      loadCompanyQuestions();
    }
  }, [selectedCompany]);

  const loadCompanyQuestions = async () => {
    if (!selectedCompany) return;
    
    console.log(`Loading data for company: ${selectedCompany}`);
    setLoading(true);
    setError(null);
    
    try {
      const data = await loadCompanyData(selectedCompany);
      console.log(`Successfully loaded data for ${selectedCompany}:`, Object.keys(data));
      setCompanyData(data);
    } catch (err) {
      console.error('Error loading company data:', err);
      setError(`Failed to load questions for ${selectedCompany}. Please try again.`);
    } finally {
      setLoading(false);
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

  const openLeetCodeQuestion = (link) => {
    window.open(link, '_blank');
  };

  // Clear search when selecting a company
  const handleCompanySelect = (company) => {
    setSelectedCompany(company);
    setSearchTerm(''); // Clear search term when selecting company
    setCurrentPage(1);
  };

  // Clear search when selecting a question type
  const handleTypeSelect = (type) => {
    setSelectedType(type);
    setSearchTerm(''); // Clear search term when selecting question type
    setCurrentPage(1);
  };

  const filteredCompanies = COMPANIES.filter(company =>
    company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination for companies
  const indexOfLastCompany = currentPage * companiesPerPage;
  const indexOfFirstCompany = indexOfLastCompany - companiesPerPage;
  const currentCompanies = filteredCompanies.slice(indexOfFirstCompany, indexOfLastCompany);
  const totalPages = Math.ceil(filteredCompanies.length / companiesPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Company Selection View
  if (!selectedCompany) {
    return (
      <DashboardLayout>
        <div className="p-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-3">
              Company-Specific Questions
            </h1>
            <p className="text-lg text-gray-600 mb-2">
              Practice real interview questions from {STATS.totalCompanies}+ companies
            </p>
            <p className="text-sm text-gray-500 mb-6">
              {STATS.totalQuestions.toLocaleString()} questions • Last updated: {STATS.lastUpdated}
            </p>
            
            {/* Search Bar with Clear Button */}
            <div className="max-w-md mx-auto mb-6">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search companies..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {searchTerm && (
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setCurrentPage(1);
                    }}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 text-lg"
                    title="Clear search"
                  >
                    ✕
                  </button>
                )}
              </div>
              {searchTerm && (
                <p className="text-sm text-gray-500 mt-1">
                  Found {filteredCompanies.length} companies matching "{searchTerm}"
                </p>
              )}
            </div>

            {/* Results Info */}
            <div className="text-sm text-gray-600 mb-4">
              Showing {indexOfFirstCompany + 1}-{Math.min(indexOfLastCompany, filteredCompanies.length)} of {filteredCompanies.length} companies
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {currentCompanies.map((company) => {
              return (
                <div
                  key={company}
                  onClick={() => handleCompanySelect(company)}
                  className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer border-2 border-transparent hover:border-blue-500 p-6 group"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Building2 className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Click to View</p>
                      <p className="text-lg font-bold text-gray-900">Questions</p>
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {company}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Recent interview questions and patterns
                  </p>
                  
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>Click to explore</span>
                    <ExternalLink className="w-4 h-4" />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center mt-8 space-x-2">
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-2 rounded-md bg-white border border-gray-300 text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              
              {[...Array(Math.min(5, totalPages))].map((_, index) => {
                const pageNumber = currentPage <= 3 ? index + 1 : currentPage - 2 + index;
                if (pageNumber > totalPages) return null;
                
                return (
                  <button
                    key={pageNumber}
                    onClick={() => paginate(pageNumber)}
                    className={`px-3 py-2 rounded-md ${
                      currentPage === pageNumber
                        ? 'bg-blue-600 text-white'
                        : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {pageNumber}
                  </button>
                );
              })}
              
              {totalPages > 5 && currentPage < totalPages - 2 && (
                <>
                  <span className="px-2">...</span>
                  <button
                    onClick={() => paginate(totalPages)}
                    className="px-3 py-2 rounded-md bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                  >
                    {totalPages}
                  </button>
                </>
              )}
              
              <button
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-2 rounded-md bg-white border border-gray-300 text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          )}

          {filteredCompanies.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No companies found matching "{searchTerm}"</p>
            </div>
          )}

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg p-6 text-center">
              <h3 className="text-3xl font-bold">{STATS.totalCompanies}</h3>
              <p className="text-blue-100">Companies</p>
            </div>
            <div className="bg-gradient-to-r from-green-500 to-teal-600 text-white rounded-lg p-6 text-center">
              <h3 className="text-3xl font-bold">{STATS.totalQuestions.toLocaleString()}</h3>
              <p className="text-green-100">Questions</p>
            </div>
            <div className="bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-lg p-6 text-center">
              <h3 className="text-3xl font-bold">5</h3>
              <p className="text-orange-100">Time Periods</p>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="font-medium text-blue-800 mb-2">📚 How to Use:</h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Select a company to see their recent interview questions</li>
              <li>• Choose question category (Last 30 Days, Last 3 Months, etc.)</li>
              <li>• Click on any question to open it directly on LeetCode</li>
              <li>• Questions include difficulty level, frequency, and acceptance rate</li>
            </ul>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Question Type Selection View
  if (selectedCompany && !selectedType) {
    if (loading) {
      return (
        <DashboardLayout>
          <div className="p-8">
            <div className="text-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading {selectedCompany} questions...</p>
            </div>
          </div>
        </DashboardLayout>
      );
    }

    if (error) {
      return (
        <DashboardLayout>
          <div className="p-8">
            <div className="text-center py-20">
              <div className="text-red-600 mb-4">
                <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-gray-600 mb-4">{error}</p>
              <button
                onClick={loadCompanyQuestions}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Try Again
              </button>
            </div>
          </div>
        </DashboardLayout>
      );
    }

    return (
      <DashboardLayout>
        <div className="p-8">

          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {selectedCompany} Interview Questions
            </h1>
            <p className="text-gray-600">
              Choose the time period for interview questions
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {QUESTION_TYPES.map((type) => {
              const questions = companyData?.[type] || [];
              const difficultyCount = questions.reduce((acc, q) => {
                acc[q.difficulty] = (acc[q.difficulty] || 0) + 1;
                return acc;
              }, {});

              const getTypeIcon = (type) => {
                if (type.includes('30')) return <Clock className="w-6 h-6 text-white" />;
                if (type.includes('3')) return <Calendar className="w-6 h-6 text-white" />;
                if (type.includes('6') && !type.includes('More')) return <TrendingUp className="w-6 h-6 text-white" />;
                if (type.includes('More')) return <Building2 className="w-6 h-6 text-white" />;
                return <Code2 className="w-6 h-6 text-white" />;
              };

              const getTypeColor = (type) => {
                if (type.includes('30')) return 'from-green-500 to-teal-600';
                if (type.includes('3')) return 'from-blue-500 to-indigo-600';
                if (type.includes('6') && !type.includes('More')) return 'from-purple-500 to-pink-600';
                if (type.includes('More')) return 'from-gray-500 to-gray-600';
                return 'from-orange-500 to-red-600';
              };

              return (
                <div
                  key={type}
                  onClick={() => handleTypeSelect(type)}
                  className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer border-2 border-transparent hover:border-green-500 p-6 group"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 bg-gradient-to-br ${getTypeColor(type)} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform`}>
                      {getTypeIcon(type)}
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Questions</p>
                      <p className="text-2xl font-bold text-gray-900">{questions.length}</p>
                    </div>
                  </div>
                  
                  <h3 className="text-sm font-bold text-gray-900 mb-2 group-hover:text-green-600 transition-colors">
                    {type}
                  </h3>
                  <p className="text-gray-600 text-xs mb-4">
                    {type === 'All Questions' ? 'Complete set' : `From ${type.toLowerCase()}`}
                  </p>
                  
                  <div className="space-y-1">
                    {Object.entries(difficultyCount).slice(0, 3).map(([difficulty, count]) => (
                      <div key={difficulty} className="flex justify-between items-center">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(difficulty)}`}>
                          {difficulty}
                        </span>
                        <span className="text-xs font-medium text-gray-700">{count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Questions List View
  const questions = companyData?.[selectedType] || [];
  
  // Fix: Only filter if there's actually a search term
  const filteredQuestions = searchTerm.trim() 
    ? questions.filter(q => q.name.toLowerCase().includes(searchTerm.toLowerCase()))
    : questions;

  console.log('Questions for', selectedCompany, selectedType, ':', questions.length);
  console.log('Filtered questions:', filteredQuestions.length);
  console.log('Search term:', searchTerm);
  console.log('First few questions:', questions.slice(0, 3));

  // Pagination for questions
  const indexOfLastQuestion = currentPage * questionsPerPage;
  const indexOfFirstQuestion = indexOfLastQuestion - questionsPerPage;
  const currentQuestions = filteredQuestions.slice(indexOfFirstQuestion, indexOfLastQuestion);
  const totalQuestionPages = Math.ceil(filteredQuestions.length / questionsPerPage);

  return (
    <DashboardLayout>
      <div className="p-8">
        <button
          onClick={() => {
            setSelectedType(null);
            setSearchTerm(''); // Clear search when going back to question types
          }}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Question Types</span>
        </button>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {selectedCompany} - {selectedType}
          </h1>
          <p className="text-gray-600 mb-4">
            {questions.length} questions • Showing {indexOfFirstQuestion + 1}-{Math.min(indexOfLastQuestion, filteredQuestions.length)} of {filteredQuestions.length}
          </p>
          
          {/* Search Bar with Clear Button */}
          <div className="max-w-md mx-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="Search questions..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-4 py-2 pr-8 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {searchTerm && (
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setCurrentPage(1);
                  }}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 text-lg"
                  title="Clear search"
                >
                  ✕
                </button>
              )}
            </div>
            {searchTerm && (
              <p className="text-sm text-gray-500 mt-1">
                Searching in {selectedType} questions
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {currentQuestions.map((question, index) => (
            <div
              key={index}
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
                    {question.tags.map((tag, tagIndex) => (
                      <span
                        key={tagIndex}
                        className="flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-xs"
                      >
                        <Tag className="w-3 h-3" />
                        {tag}
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span>Frequency: <strong className="text-green-600">{question.frequency}</strong></span>
                    <span>Acceptance: <strong className="text-blue-600">{question.acceptance}</strong></span>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 ml-4">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      openLeetCodeQuestion(question.link);
                    }}
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

        {/* Pagination for Questions */}
        {totalQuestionPages > 1 && (
          <div className="flex justify-center items-center mt-8 space-x-2">
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-2 rounded-md bg-white border border-gray-300 text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            
            {[...Array(Math.min(5, totalQuestionPages))].map((_, index) => {
              const pageNumber = currentPage <= 3 ? index + 1 : currentPage - 2 + index;
              if (pageNumber > totalQuestionPages) return null;
              
              return (
                <button
                  key={pageNumber}
                  onClick={() => paginate(pageNumber)}
                  className={`px-3 py-2 rounded-md ${
                    currentPage === pageNumber
                      ? 'bg-blue-600 text-white'
                      : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {pageNumber}
                </button>
              );
            })}
            
            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalQuestionPages}
              className="px-3 py-2 rounded-md bg-white border border-gray-300 text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        )}

        {filteredQuestions.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              {searchTerm ? `No questions found matching "${searchTerm}"` : `No questions available for ${selectedType}`}
            </p>
            <p className="text-gray-400 text-sm mt-2">
              Total questions in this category: {questions.length}
            </p>
            {questions.length > 0 && searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Clear Search
              </button>
            )}
          </div>
        )}

        <div className="mt-8 bg-green-50 border border-green-200 rounded-lg p-6">
          <h3 className="font-medium text-green-800 mb-2">💡 Pro Tips:</h3>
          <ul className="text-sm text-green-700 space-y-1">
            <li>• Start with Easy problems and gradually move to Medium/Hard</li>
            <li>• Focus on high-frequency questions (higher percentage = more common)</li>
            <li>• Practice explaining your solution approach out loud</li>
            <li>• Time yourself to simulate real interview conditions</li>
            <li>• Review the tags to understand problem patterns</li>
          </ul>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CompanyQuestions;