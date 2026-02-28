import { useState, useEffect, useRef } from 'react';
import { MessageSquare, Send, CheckCircle, Mic, MicOff } from 'lucide-react';
import { toast } from 'sonner';

const TextInterview = ({ questions, onComplete, interviewId }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  const [startTime] = useState(Date.now());
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);

  // Setup speech recognition
  useEffect(() => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      console.log('Speech recognition not supported');
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
      toast.success('Listening... Speak your answer');
    };

    recognition.onresult = (event) => {
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript + ' ';
        } else {
          interimTranscript += transcript;
        }
      }

      if (finalTranscript) {
        setCurrentAnswer(prev => prev + finalTranscript);
      }
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
      if (event.error === 'no-speech') {
        toast.error('No speech detected. Please try again.');
      } else if (event.error === 'not-allowed') {
        toast.error('Microphone access denied. Please enable it in browser settings.');
      }
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const toggleVoiceInput = () => {
    if (!recognitionRef.current) {
      toast.error('Speech recognition not supported in this browser. Please use Chrome.');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
      toast.info('Stopped listening');
    } else {
      recognitionRef.current.start();
    }
  };

  const handleSubmitAnswer = () => {
    if (!currentAnswer.trim()) {
      toast.error('Please provide an answer before continuing');
      return;
    }

    // Stop voice recording if active
    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }

    const newAnswer = {
      question: typeof questions[currentQuestion] === 'string' 
        ? questions[currentQuestion] 
        : questions[currentQuestion].question,
      answer: currentAnswer,
      timeSpent: Math.floor((Date.now() - startTime) / 1000),
      timestamp: new Date().toISOString()
    };

    const updatedAnswers = [...answers, newAnswer];
    setAnswers(updatedAnswers);
    setCurrentAnswer('');

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      toast.success('Answer recorded! Moving to next question...');
    } else {
      // Interview complete
      setIsComplete(true);
      toast.success('Interview completed! Generating feedback...');
      
      // Create transcript format for feedback
      const transcript = updatedAnswers.map(a => ({
        role: 'user',
        content: a.answer,
        timestamp: a.timestamp
      }));

      setTimeout(() => {
        onComplete({
          transcript,
          duration: Math.floor((Date.now() - startTime) / 1000),
          questionsAnswered: questions.length
        });
      }, 1000);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      handleSubmitAnswer();
    }
  };

  if (isComplete) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Interview Complete!</h2>
          <p className="text-gray-600 mb-4">
            You answered all {questions.length} questions successfully.
          </p>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-sm text-gray-500 mt-4">Generating your feedback...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Header */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Text Interview</h2>
            <p className="text-gray-600">Answer each question thoughtfully</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-primary">
              {currentQuestion + 1}/{questions.length}
            </div>
            <div className="text-sm text-gray-500">Questions</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-primary h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Current Question */}
      <div className="bg-gradient-to-r from-primary to-primary-600 text-white rounded-lg shadow-lg p-8 mb-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
            <MessageSquare className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold mb-2">Question {currentQuestion + 1}</h3>
            <p className="text-xl leading-relaxed">
              {typeof questions[currentQuestion] === 'string'
                ? questions[currentQuestion]
                : questions[currentQuestion]?.question}
            </p>
          </div>
        </div>
      </div>

      {/* Answer Input */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-semibold text-gray-700">
            Your Answer
          </label>
          <button
            onClick={toggleVoiceInput}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
              isListening
                ? 'bg-red-500 text-white animate-pulse'
                : 'bg-blue-500 text-white hover:bg-blue-600'
            }`}
            title={isListening ? 'Stop voice input' : 'Start voice input'}
          >
            {isListening ? (
              <>
                <MicOff className="w-5 h-5" />
                <span>Stop Recording</span>
              </>
            ) : (
              <>
                <Mic className="w-5 h-5" />
                <span>Voice Input</span>
              </>
            )}
          </button>
        </div>
        <textarea
          value={currentAnswer}
          onChange={(e) => setCurrentAnswer(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your answer here or click 'Voice Input' to speak... (Press Ctrl+Enter to submit)"
          className="w-full h-48 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
          autoFocus
        />
        {isListening && (
          <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-red-700 font-medium">
                Recording... Speak clearly into your microphone
              </span>
            </div>
          </div>
        )}
        <div className="flex items-center justify-between mt-4">
          <p className="text-sm text-gray-500">
            {currentAnswer.length} characters • Press Ctrl+Enter to submit
          </p>
          <button
            onClick={handleSubmitAnswer}
            disabled={!currentAnswer.trim()}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-primary-600 text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5" />
            <span>{currentQuestion < questions.length - 1 ? 'Next Question' : 'Complete Interview'}</span>
          </button>
        </div>
      </div>

      {/* Previous Answers */}
      {answers.length > 0 && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Previous Answers</h3>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {answers.map((answer, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-lg border-l-4 border-green-500">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="font-semibold text-sm text-gray-700">
                    Question {index + 1}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-2">{answer.question}</p>
                <p className="text-gray-800">{answer.answer}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TextInterview;
