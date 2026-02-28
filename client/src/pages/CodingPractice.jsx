import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Code, Play, CheckCircle, XCircle, Loader, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';

const CodingPractice = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState('topic'); // topic, loading, practice
  const [topic, setTopic] = useState('');
  const [questionCount, setQuestionCount] = useState(3);
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('python');
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [testResults, setTestResults] = useState([]);

  const dsaTopics = [
    'Arrays', 'Strings', 'Linked Lists', 'Stacks', 'Queues',
    'Trees', 'Graphs', 'Sorting', 'Searching', 'Dynamic Programming',
    'Recursion', 'Backtracking', 'Greedy', 'Hash Tables', 'Heaps'
  ];

  const languages = [
    { id: 'python', name: 'Python', version: '3.10.0', icon: '🐍' },
    { id: 'javascript', name: 'JavaScript', version: 'Node.js 18', icon: '📜' },
    { id: 'typescript', name: 'TypeScript', version: '5.0.3', icon: '📘' },
    { id: 'java', name: 'Java', version: '15.0.2', icon: '☕' },
    { id: 'cpp', name: 'C++', version: '10.2.0', icon: '⚡' },
    { id: 'c', name: 'C', version: '10.2.0', icon: '🔧' },
    { id: 'csharp', name: 'C#', version: '10.0', icon: '#️⃣' },
    { id: 'go', name: 'Go', version: '1.16.2', icon: '🐹' },
    { id: 'rust', name: 'Rust', version: '1.68.2', icon: '🦀' },
    { id: 'php', name: 'PHP', version: '8.2.3', icon: '🐘' },
    { id: 'swift', name: 'Swift', version: '5.3.3', icon: '🦅' },
    { id: 'kotlin', name: 'Kotlin', version: '1.8.20', icon: '🎯' },
    { id: 'ruby', name: 'Ruby', version: '3.0.1', icon: '💎' },
  ];

  const codeTemplates = {
    python: '# Write your solution here\ndef solution():\n    pass\n\n# Test your code\nif __name__ == "__main__":\n    solution()',
    javascript: '// Write your solution here\nfunction solution() {\n    \n}\n\n// Test your code\nsolution();',
    typescript: '// Write your solution here\nfunction solution(): void {\n    \n}\n\n// Test your code\nsolution();',
    java: 'public class Solution {\n    public static void main(String[] args) {\n        // Write your solution here\n    }\n}',
    cpp: '#include <iostream>\n#include <vector>\n#include <string>\nusing namespace std;\n\nint main() {\n    // Write your solution here\n    return 0;\n}',
    c: '#include <stdio.h>\n#include <stdlib.h>\n\nint main() {\n    // Write your solution here\n    return 0;\n}',
    csharp: 'using System;\n\nclass Solution {\n    static void Main(string[] args) {\n        // Write your solution here\n    }\n}',
    go: 'package main\n\nimport "fmt"\n\nfunc main() {\n    // Write your solution here\n}',
    rust: 'fn main() {\n    // Write your solution here\n}',
    php: '<?php\n// Write your solution here\n\n?>',
    swift: 'import Foundation\n\n// Write your solution here',
    kotlin: 'fun main() {\n    // Write your solution here\n}',
    ruby: '# Write your solution here\ndef solution\n    \nend\n\n# Test your code\nsolution'
  };

  useEffect(() => {
    setCode(codeTemplates[language]);
  }, [language]);

  const generateQuestions = async () => {
    if (!topic) {
      toast.error('Please select a topic');
      return;
    }

    setStep('loading');
    try {
      const response = await axios.post('http://localhost:5000/api/coding/generate-questions', {
        topic,
        count: questionCount
      });

      if (response.data.success) {
        setQuestions(response.data.questions);
        setStep('practice');
        setCurrentQuestion(0);
        toast.success(`Generated ${response.data.questions.length} questions!`);
      }
    } catch (error) {
      console.error('Error generating questions:', error);
      toast.error('Failed to generate questions');
      setStep('topic');
    }
  };

  const runCode = async () => {
    setIsRunning(true);
    setOutput('');
    setTestResults([]);

    try {
      const response = await axios.post('http://localhost:5000/api/coding/run', {
        code,
        language,
        questionId: questions[currentQuestion].id,
        testCases: questions[currentQuestion].testCases
      });

      if (response.data.success) {
        setOutput(response.data.output);
        setTestResults(response.data.testResults);
        
        const passed = response.data.testResults.filter(t => t.passed).length;
        const total = response.data.testResults.length;
        
        if (passed === total) {
          toast.success(`All test cases passed! (${passed}/${total})`);
        } else {
          toast.warning(`${passed}/${total} test cases passed`);
        }
      }
    } catch (error) {
      console.error('Error running code:', error);
      setOutput(error.response?.data?.error || 'Error executing code');
      toast.error('Failed to run code');
    } finally {
      setIsRunning(false);
    }
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setCode(codeTemplates[language]);
      setOutput('');
      setTestResults([]);
    }
  };

  const previousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setCode(codeTemplates[language]);
      setOutput('');
      setTestResults([]);
    }
  };

  if (step === 'topic') {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 text-gray-600 hover:text-primary mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Dashboard
          </button>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Code className="w-8 h-8 text-primary" />
                DSA Coding Practice
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select DSA Topic
                </label>
                <select
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="">Choose a topic...</option>
                  {dsaTopics.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Number of Questions
                </label>
                <select
                  value={questionCount}
                  onChange={(e) => setQuestionCount(Number(e.target.value))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value={1}>1 Question</option>
                  <option value={3}>3 Questions</option>
                  <option value={5}>5 Questions</option>
                  <option value={10}>10 Questions</option>
                </select>
              </div>

              <button
                onClick={generateQuestions}
                className="w-full py-4 bg-primary text-white rounded-lg font-semibold hover:bg-primary-600 transition-all"
              >
                Generate Questions
              </button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (step === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
          <p className="text-lg text-gray-600">Generating {questionCount} questions on {topic}...</p>
        </div>
      </div>
    );
  }

  const question = questions[currentQuestion];

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <div className="bg-gray-800 shadow-lg border-b border-gray-700">
        <div className="w-full px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => {
                  setStep('topic');
                  setQuestions([]);
                }}
                className="text-gray-300 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-lg font-bold text-white">{topic} Practice</h1>
                <p className="text-sm text-gray-400">
                  Question {currentQuestion + 1} of {questions.length}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
              >
                {languages.map((lang) => (
                  <option key={lang.id} value={lang.id}>
                    {lang.icon} {lang.name}
                  </option>
                ))}
              </select>
              <button
                onClick={runCode}
                disabled={isRunning}
                className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors font-medium"
              >
                {isRunning ? (
                  <Loader className="w-5 h-5 animate-spin" />
                ) : (
                  <Play className="w-5 h-5" />
                )}
                Run Code
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - Fullscreen */}
      <div className="w-full h-[calc(100vh-73px)] flex">
        {/* Left: Problem Description */}
        <div className="w-1/2 bg-gray-800 overflow-hidden flex flex-col border-r border-gray-700">
          <div className="p-6 border-b border-gray-700">
            <h2 className="text-2xl font-bold text-white mb-3">{question.title}</h2>
            <div className="flex items-center gap-2">
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                question.difficulty === 'Easy' ? 'bg-green-500/20 text-green-400' :
                question.difficulty === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                'bg-red-500/20 text-red-400'
              }`}>
                {question.difficulty}
              </span>
              <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs font-medium">
                {topic}
              </span>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-6">
            <div className="prose prose-invert max-w-none">
              <p className="text-gray-300 mb-4 leading-relaxed">{question.description}</p>
              
              <h3 className="text-lg font-semibold text-white mb-3">Examples:</h3>
              {question.examples?.map((example, idx) => (
                <div key={idx} className="bg-gray-900 p-4 rounded-lg mb-3 border border-gray-700">
                  <p className="font-mono text-sm text-gray-300">
                    <strong className="text-green-400">Input:</strong> {example.input}
                  </p>
                  <p className="font-mono text-sm text-gray-300 mt-2">
                    <strong className="text-blue-400">Output:</strong> {example.output}
                  </p>
                  {example.explanation && (
                    <p className="text-sm text-gray-400 mt-2">
                      <strong>Explanation:</strong> {example.explanation}
                    </p>
                  )}
                </div>
              ))}

              {question.constraints && (
                <>
                  <h3 className="text-lg font-semibold text-white mb-3 mt-6">Constraints:</h3>
                  <ul className="list-disc list-inside text-gray-300 space-y-1">
                    {question.constraints.map((constraint, idx) => (
                      <li key={idx}>{constraint}</li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          </div>

          {/* Navigation */}
          <div className="p-4 border-t border-gray-700 flex justify-between bg-gray-800">
            <button
              onClick={previousQuestion}
              disabled={currentQuestion === 0}
              className="px-4 py-2 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>
            <button
              onClick={nextQuestion}
              disabled={currentQuestion === questions.length - 1}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next Question
            </button>
          </div>
        </div>

        {/* Right: Code Editor & Output */}
        <div className="w-1/2 flex flex-col bg-gray-900">
          {/* Code Editor */}
          <div className="flex-1 flex flex-col">
            <div className="px-4 py-2 bg-gray-800 border-b border-gray-700">
              <p className="text-sm font-medium text-gray-300">Code Editor</p>
            </div>
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="flex-1 p-4 bg-gray-900 text-gray-100 font-mono text-sm resize-none focus:outline-none"
              style={{
                caretColor: '#10b981',
                lineHeight: '1.6',
                tabSize: 4
              }}
              spellCheck={false}
              placeholder="Write your code here..."
            />
          </div>

          {/* Output & Test Results */}
          <div className="h-64 flex flex-col border-t border-gray-700">
            <div className="px-4 py-2 bg-gray-800 border-b border-gray-700">
              <p className="text-sm font-medium text-gray-300">Output & Test Results</p>
            </div>
            <div className="flex-1 overflow-y-auto p-4 bg-gray-900">
              {testResults.length > 0 && (
                <div className="space-y-2 mb-4">
                  {testResults.map((result, idx) => (
                    <div
                      key={idx}
                      className={`flex items-center gap-2 p-3 rounded-lg ${
                        result.passed ? 'bg-green-500/10 border border-green-500/30' : 'bg-red-500/10 border border-red-500/30'
                      }`}
                    >
                      {result.passed ? (
                        <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                      )}
                      <span className={`text-sm font-medium ${result.passed ? 'text-green-400' : 'text-red-400'}`}>
                        Test Case {idx + 1}: {result.passed ? 'Passed' : 'Failed'}
                      </span>
                    </div>
                  ))}
                </div>
              )}
              {output && (
                <pre className="text-sm font-mono text-gray-300 whitespace-pre-wrap">
                  {output}
                </pre>
              )}
              {!output && testResults.length === 0 && (
                <p className="text-gray-500 text-sm">Run your code to see output and test results...</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodingPractice;
