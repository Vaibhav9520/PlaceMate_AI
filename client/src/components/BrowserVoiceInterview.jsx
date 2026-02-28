import { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Volume2, CheckCircle, User, Bot, Clock } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';

const BrowserVoiceInterview = ({ questions, onComplete, interviewId }) => {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [conversationHistory, setConversationHistory] = useState([]);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  const [questionsAsked, setQuestionsAsked] = useState(0);
  const [startTime] = useState(Date.now());
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  
  const recognitionRef = useRef(null);
  const synthRef = useRef(window.speechSynthesis);
  const totalQuestionsRef = useRef(questions.length);
  const conversationEndRef = useRef(null);
  const askedQuestionsRef = useRef(new Set());

  // Auto-scroll to bottom of conversation
  useEffect(() => {
    conversationEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversationHistory]);

  // Timer effect
  useEffect(() => {
    if (conversationHistory.length > 0 && !isComplete) {
      const timer = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [conversationHistory.length, isComplete, startTime]);

  // Format time as MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    // Check speech synthesis support
    if (!window.speechSynthesis) {
      toast.error('Speech synthesis not supported in this browser');
      return;
    }

    // Load voices
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      console.log('Available voices:', voices.length);
      if (voices.length > 0) {
        console.log('First voice:', voices[0].name);
      }
    };

    // Load voices immediately and on voiceschanged event
    loadVoices();
    window.speechSynthesis.addEventListener('voiceschanged', loadVoices);

    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      toast.error('Speech recognition not supported. Please use Chrome.');
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      console.log('User said:', transcript);
      setCurrentAnswer(transcript);
      setIsListening(false);
      handleUserAnswer(transcript);
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
      if (event.error === 'no-speech') {
        toast.error('No speech detected. Click microphone to try again.');
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
      if (synthRef.current) {
        synthRef.current.cancel();
      }
      window.speechSynthesis.removeEventListener('voiceschanged', loadVoices);
    };
  }, []);

  const speak = (text) => {
    return new Promise((resolve) => {
      console.log('🔊 Speaking:', text.substring(0, 50) + '...');
      
      // Cancel any ongoing speech
      if (synthRef.current.speaking) {
        synthRef.current.cancel();
      }

      // Wait a bit for cancel to complete
      setTimeout(() => {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.95;
        utterance.pitch = 1;
        utterance.volume = 1;
        utterance.lang = 'en-US';

        // Load voices if not loaded
        let voices = synthRef.current.getVoices();
        if (voices.length === 0) {
          synthRef.current.addEventListener('voiceschanged', () => {
            voices = synthRef.current.getVoices();
            const femaleVoice = voices.find(voice => 
              voice.name.includes('Female') || 
              voice.name.includes('Samantha') ||
              voice.name.includes('Google US English') ||
              voice.name.includes('Microsoft Zira')
            );
            if (femaleVoice) {
              utterance.voice = femaleVoice;
            }
          });
        } else {
          const femaleVoice = voices.find(voice => 
            voice.name.includes('Female') || 
            voice.name.includes('Samantha') ||
            voice.name.includes('Google US English') ||
            voice.name.includes('Microsoft Zira')
          );
          if (femaleVoice) {
            utterance.voice = femaleVoice;
          }
        }

        utterance.onstart = () => {
          console.log('✅ Speech started');
          setIsSpeaking(true);
        };
        
        utterance.onend = () => {
          console.log('✅ Speech ended');
          setIsSpeaking(false);
          resolve();
        };
        
        utterance.onerror = (event) => {
          console.error('❌ Speech error:', event.error);
          setIsSpeaking(false);
          resolve();
        };

        console.log('🎤 Starting speech synthesis...');
        synthRef.current.speak(utterance);
      }, 100);
    });
  };

  const getAIResponse = async (userMessage) => {
    try {
      setIsProcessing(true);
      
      // Count user responses for current question
      const userMessagesCount = conversationHistory.filter(m => m.role === 'user').length;
      
      // Move to next question after 1-2 responses
      const shouldMoveToNext = userMessagesCount >= 1 && userMessage.length > 30;

      // Get next question index
      const nextQuestionIndex = shouldMoveToNext ? currentQuestionIndex + 1 : currentQuestionIndex;
      
      if (nextQuestionIndex >= questions.length) {
        // All questions done
        return { 
          response: 'Thank you for your time today. That completes our interview. You\'ll receive detailed feedback shortly.',
          shouldEnd: true,
          moveToNext: false
        };
      }

      const nextQuestion = questions[nextQuestionIndex];
      const nextQuestionText = typeof nextQuestion === 'string' ? nextQuestion : nextQuestion?.question;

      let aiResponse;
      
      if (questionsAsked === 0) {
        // First interaction - greet and ask first question
        aiResponse = `Hello! Welcome to your interview. I'm excited to learn more about you today. Let's begin. ${nextQuestionText}`;
      } else if (shouldMoveToNext) {
        // Move to next question with brief acknowledgment
        const acknowledgments = [
          'Thank you for sharing that.',
          'That\'s interesting.',
          'I appreciate your answer.',
          'Great, thank you.',
          'Understood.'
        ];
        const ack = acknowledgments[Math.floor(Math.random() * acknowledgments.length)];
        aiResponse = `${ack} Next question: ${nextQuestionText}`;
      } else {
        // Ask brief follow-up
        const followUps = [
          'Can you elaborate on that?',
          'Could you provide more details?',
          'What specific challenges did you face?',
          'How did you approach that?',
          'Can you give me an example?'
        ];
        aiResponse = followUps[Math.floor(Math.random() * followUps.length)];
      }

      console.log(`📝 AI Response: ${aiResponse.substring(0, 80)}...`);
      
      const shouldEnd = nextQuestionIndex >= questions.length - 1 && shouldMoveToNext;

      return { 
        response: aiResponse, 
        shouldEnd,
        moveToNext: shouldMoveToNext
      };
    } catch (error) {
      console.error('Error getting AI response:', error);
      
      const nextQ = questions[currentQuestionIndex + 1] || questions[currentQuestionIndex];
      const qText = typeof nextQ === 'string' ? nextQ : nextQ?.question;
      return { 
        response: `Thank you. ${qText}`,
        shouldEnd: false,
        moveToNext: true
      };
    } finally {
      setIsProcessing(false);
    }
  };

  const handleUserAnswer = async (answer) => {
    const userMessage = {
      role: 'user',
      content: answer,
      timestamp: new Date().toISOString()
    };
    
    const updatedHistory = [...conversationHistory, userMessage];
    setConversationHistory(updatedHistory);

    const { response: aiResponse, shouldEnd, moveToNext } = await getAIResponse(answer);
    
    const aiMessage = {
      role: 'assistant',
      content: aiResponse,
      timestamp: new Date().toISOString()
    };
    
    const finalHistory = [...updatedHistory, aiMessage];
    setConversationHistory(finalHistory);

    // Speak AI response
    await speak(aiResponse);

    // Update question progress if moving to next
    if (moveToNext) {
      setQuestionsAsked(prev => prev + 1);
      setCurrentQuestionIndex(prev => prev + 1);
      console.log(`✅ Moving to question ${currentQuestionIndex + 2}/${totalQuestionsRef.current}`);
    }

    if (shouldEnd) {
      setIsComplete(true);
      setTimeout(() => {
        onComplete({
          transcript: finalHistory,
          duration: Math.floor((Date.now() - startTime) / 1000),
          questionsAnswered: questionsAsked
        });
      }, 2000);
    } else {
      setCurrentAnswer('');
      // Don't auto-start listening - user must click button
    }
  };

  const startInterview = async () => {
    console.log('🎬 Starting interview...');
    const firstQuestion = typeof questions[0] === 'string' ? questions[0] : questions[0].question;
    const greeting = `Hello! Welcome to your interview. I'm excited to learn more about you today. Let's begin with the first question: ${firstQuestion}`;
    
    console.log('📝 Greeting text:', greeting);
    
    const aiMessage = {
      role: 'assistant',
      content: greeting,
      timestamp: new Date().toISOString()
    };
    
    setConversationHistory([aiMessage]);
    setQuestionsAsked(1);
    setCurrentQuestionIndex(0);
    askedQuestionsRef.current.add(firstQuestion);
    
    console.log('🔊 About to speak greeting...');
    await speak(greeting);
    console.log('✅ Greeting spoken, ready for user response');
    
    toast.success('Interview started! Click microphone to answer...');
  };

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      if (!isSpeaking && !isProcessing) {
        recognitionRef.current?.start();
      }
    }
  };

  if (isComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-12 text-center max-w-2xl">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
            <CheckCircle className="w-16 h-16 text-green-600" />
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Interview Complete!</h2>
          <p className="text-xl text-gray-600 mb-6">
            Excellent work! You've completed the interview.
          </p>
          <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-primary mx-auto mb-4"></div>
          <p className="text-gray-500">Analyzing your responses and generating detailed feedback...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-6xl mx-auto p-4">
        {/* Start Screen */}
        {conversationHistory.length === 0 && (
          <div className="min-h-screen flex items-center justify-center">
            <div className="bg-white rounded-2xl shadow-2xl p-12 text-center max-w-2xl">
              <div className="w-32 h-32 bg-gradient-to-br from-primary to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Bot className="w-20 h-20 text-white" />
              </div>
              <h2 className="text-4xl font-bold text-gray-900 mb-4">AI Interview Ready</h2>
              <p className="text-xl text-gray-600 mb-8">
                I'll have a natural conversation with you, asking questions and follow-ups based on your responses.
              </p>
              
              {/* Test Speech Button */}
              <button
                onClick={async () => {
                  console.log('Testing speech...');
                  await speak('This is a test. Can you hear me?');
                  console.log('Test complete');
                }}
                className="mb-4 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all"
              >
                🔊 Test Audio (Click First!)
              </button>
              
              <button
                onClick={startInterview}
                className="block w-full px-12 py-5 bg-gradient-to-r from-primary to-purple-600 text-white rounded-full hover:shadow-2xl transition-all font-bold text-xl transform hover:scale-105"
              >
                Start Interview
              </button>
              
              <p className="text-sm text-gray-500 mt-4">
                💡 Tip: Click "Test Audio" first to enable browser audio permissions
              </p>
            </div>
          </div>
        )}

        {/* Interview Screen */}
        {conversationHistory.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 py-6">
            {/* Left Panel - Status */}
            <div className="lg:col-span-1 space-y-6">
              {/* Progress Card */}
              <div className="bg-white rounded-xl shadow-lg p-6 sticky top-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Interview Progress</h3>
                <div className="space-y-4">
                  {/* Timer */}
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 mb-4">
                    <div className="flex items-center justify-center gap-2">
                      <Clock className="w-5 h-5 text-primary" />
                      <span className="text-2xl font-bold text-gray-900">{formatTime(elapsedTime)}</span>
                    </div>
                    <p className="text-xs text-center text-gray-600 mt-1">Interview Duration</p>
                  </div>

                  {/* Question Progress */}
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600">Questions</span>
                      <span className="font-bold text-primary">{questionsAsked}/{totalQuestionsRef.current}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-gradient-to-r from-primary to-purple-600 h-3 rounded-full transition-all duration-500"
                        style={{ width: `${(questionsAsked / totalQuestionsRef.current) * 100}%` }}
                      />
                    </div>
                  </div>

                  {/* Current Question */}
                  <div className="bg-blue-50 rounded-lg p-3">
                    <p className="text-xs font-semibold text-gray-600 mb-1">Current Question:</p>
                    <p className="text-sm text-gray-900 line-clamp-3">
                      {questionsAsked < totalQuestionsRef.current 
                        ? (typeof questions[currentQuestionIndex] === 'string' 
                            ? questions[currentQuestionIndex] 
                            : questions[currentQuestionIndex]?.question)
                        : 'Interview Complete'}
                    </p>
                  </div>
                  
                  {/* Status Indicators */}
                  <div className="pt-4 border-t">
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`w-3 h-3 rounded-full ${isSpeaking ? 'bg-blue-500 animate-pulse' : 'bg-gray-300'}`}></div>
                      <span className="text-sm text-gray-600">AI Speaking</span>
                    </div>
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`w-3 h-3 rounded-full ${isListening ? 'bg-red-500 animate-pulse' : 'bg-gray-300'}`}></div>
                      <span className="text-sm text-gray-600">Listening</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${isProcessing ? 'bg-yellow-500 animate-pulse' : 'bg-gray-300'}`}></div>
                      <span className="text-sm text-gray-600">Processing</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Microphone Control */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Your Turn to Speak</h3>
                <button
                  onClick={toggleListening}
                  disabled={isSpeaking || isProcessing}
                  className={`w-full py-6 rounded-xl transition-all font-bold text-lg ${
                    isListening
                      ? 'bg-red-500 hover:bg-red-600 animate-pulse shadow-lg shadow-red-500/50'
                      : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:shadow-xl'
                  } text-white disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  <div className="flex flex-col items-center gap-2">
                    {isListening ? <MicOff className="w-8 h-8" /> : <Mic className="w-8 h-8" />}
                    <span>{isListening ? 'Recording...' : 'Click to Answer'}</span>
                  </div>
                </button>
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <p className="text-center text-sm font-medium text-gray-700">
                    {isSpeaking ? '🎤 AI is speaking, please wait...' :
                     isListening ? '👂 Listening... Speak now!' :
                     isProcessing ? '🤔 AI is thinking...' :
                     '✅ Ready! Click button to answer'}
                  </p>
                </div>
              </div>
            </div>

            {/* Right Panel - Conversation */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-lg p-6 h-[calc(100vh-8rem)] flex flex-col">
                <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Bot className="w-6 h-6 text-primary" />
                  Live Interview
                </h3>
                
                {/* Conversation */}
                <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2">
                  {conversationHistory.map((entry, index) => (
                    <div
                      key={index}
                      className={`flex gap-3 ${entry.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                    >
                      {/* Avatar */}
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                        entry.role === 'assistant'
                          ? 'bg-gradient-to-br from-primary to-purple-600'
                          : 'bg-gradient-to-br from-green-400 to-green-600'
                      }`}>
                        {entry.role === 'assistant' ? (
                          <Bot className="w-6 h-6 text-white" />
                        ) : (
                          <User className="w-6 h-6 text-white" />
                        )}
                      </div>
                      
                      {/* Message */}
                      <div className={`flex-1 ${entry.role === 'user' ? 'text-right' : 'text-left'}`}>
                        <div className={`inline-block max-w-[80%] p-4 rounded-2xl ${
                          entry.role === 'assistant'
                            ? 'bg-gradient-to-br from-blue-50 to-purple-50 text-gray-800'
                            : 'bg-gradient-to-br from-green-500 to-green-600 text-white'
                        }`}>
                          <p className="text-sm font-semibold mb-1 opacity-75">
                            {entry.role === 'assistant' ? 'AI Interviewer' : 'You'}
                          </p>
                          <p className="leading-relaxed">{entry.content}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {/* Current Answer Preview */}
                  {currentAnswer && (
                    <div className="flex gap-3 flex-row-reverse">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
                        <User className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1 text-right">
                        <div className="inline-block max-w-[80%] p-4 rounded-2xl bg-gradient-to-br from-green-500 to-green-600 text-white animate-pulse">
                          <p className="text-sm font-semibold mb-1 opacity-75">You</p>
                          <p className="leading-relaxed">{currentAnswer}</p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div ref={conversationEndRef} />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BrowserVoiceInterview;
