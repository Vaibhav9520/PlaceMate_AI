import { useState, useEffect, useRef, useCallback } from 'react';
import Vapi from '@vapi-ai/web';
import { Mic, MicOff, Phone, PhoneOff, Volume2, VolumeX } from 'lucide-react';
import { toast } from 'sonner';

const VoiceInterview = ({ questions, onComplete, interviewId }) => {
  const [vapi, setVapi] = useState(null);
  const [isCallActive, setIsCallActive] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [transcript, setTranscript] = useState([]);
  const [callDuration, setCallDuration] = useState(0);
  const timerRef = useRef(null);

  // Define event handlers with useCallback to prevent re-creation
  const handleCallStart = useCallback(() => {
    console.log('Call started');
    setIsCallActive(true);
    toast.success('Interview started! The AI interviewer will ask you questions.');
    
    // Start timer
    timerRef.current = setInterval(() => {
      setCallDuration(prev => prev + 1);
    }, 1000);
  }, []);

  const handleCallEnd = useCallback(() => {
    console.log('Call ended');
    setIsCallActive(false);
    
    // Stop timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    // Complete interview
    if (onComplete) {
      onComplete({
        transcript,
        duration: callDuration,
        questionsAnswered: currentQuestion
      });
    }
  }, [onComplete, transcript, callDuration, currentQuestion]);

  const handleSpeechStart = useCallback(() => {
    console.log('User started speaking');
  }, []);

  const handleSpeechEnd = useCallback(() => {
    console.log('User stopped speaking');
  }, []);

  const handleMessage = useCallback((message) => {
    console.log('Message received:', message);
    
    // Handle transcript messages
    if (message.type === 'transcript' && message.transcript) {
      const transcriptEntry = {
        role: message.role,
        content: message.transcript,
        timestamp: new Date().toISOString()
      };
      
      setTranscript(prev => [...prev, transcriptEntry]);
      
      console.log(`${message.role === 'assistant' ? 'Interviewer' : 'User'}: ${message.transcript}`);
    }
    
    // Handle conversation updates
    if (message.type === 'conversation-update') {
      console.log('Conversation update:', message);
    }
    
    // Handle function calls (if any)
    if (message.type === 'function-call') {
      console.log('Function call:', message);
    }
    
    // Track question progress based on assistant messages
    if (message.role === 'assistant' && message.transcript && message.transcript.includes('?')) {
      // Interviewer asked a question, potentially move to next
      setTranscript(currentTranscript => {
        const questionNumber = currentTranscript.filter(t => 
          t.role === 'assistant' && t.content.includes('?')
        ).length;
        
        setCurrentQuestion(currentQ => {
          if (questionNumber > currentQ && questionNumber < questions.length) {
            return questionNumber;
          }
          return currentQ;
        });
        
        return currentTranscript;
      });
    }
  }, [questions.length]);

  const handleError = useCallback((error) => {
    console.error('VAPI Error:', error);
    toast.error('An error occurred during the interview');
  }, []);

  useEffect(() => {
    // Check if VAPI token is configured
    const vapiToken = import.meta.env.VITE_VAPI_WEB_TOKEN;
    
    if (!vapiToken) {
      console.error('VAPI token not found in environment variables');
      toast.error('VAPI configuration missing. Please check your .env file.');
      return;
    }

    console.log('Initializing VAPI with token:', vapiToken.substring(0, 10) + '...');

    let vapiInstance = null;

    try {
      // Initialize VAPI
      vapiInstance = new Vapi(vapiToken);
      setVapi(vapiInstance);

      // Setup event listeners
      vapiInstance.on('call-start', handleCallStart);
      vapiInstance.on('call-end', handleCallEnd);
      vapiInstance.on('speech-start', handleSpeechStart);
      vapiInstance.on('speech-end', handleSpeechEnd);
      vapiInstance.on('message', handleMessage);
      vapiInstance.on('error', handleError);

      console.log('VAPI initialized successfully');
    } catch (error) {
      console.error('Error initializing VAPI:', error);
      toast.error('Failed to initialize voice interview system');
    }

    return () => {
      if (vapiInstance) {
        vapiInstance.stop();
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [handleCallStart, handleCallEnd, handleSpeechStart, handleSpeechEnd, handleMessage, handleError]);

  const startInterview = async () => {
    if (!vapi) {
      toast.error('VAPI not initialized');
      return;
    }

    try {
      console.log('Starting VAPI interview...');
      console.log('Questions:', questions);
      
      // Get first question
      const firstQuestion = typeof questions[0] === 'string' 
        ? questions[0] 
        : questions[0]?.question || 'Tell me about yourself';

      // Create questions list for context
      const questionsList = questions.map((q, i) => {
        const qText = typeof q === 'string' ? q : q.question || q;
        return `${i + 1}. ${qText}`;
      }).join('\n');

      console.log('First question:', firstQuestion);

      // VAPI configuration with correct 11labs voice ID
      const config = {
        transcriber: {
          provider: 'deepgram',
          model: 'nova-2',
          language: 'en-US'
        },
        model: {
          provider: 'openai',
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: `You are a professional job interviewer. Conduct the interview by asking these questions one at a time:

${questionsList}

Instructions:
- Start with a warm greeting
- Ask the first question
- Listen to the candidate's complete answer
- Give a brief acknowledgment (1-2 sentences)
- Ask the next question
- Continue until all questions are asked
- Thank them at the end

Be professional, encouraging, and concise.`
            }
          ]
        },
        voice: {
          provider: '11labs',
          voiceId: '21m00Tcm4TlvDq8ikWAM' // Rachel - correct 11labs voice ID
        },
        firstMessage: `Hello! Welcome to your interview. I'm excited to learn more about you today. Let's begin with the first question: ${firstQuestion}`
      };

      console.log('VAPI config:', config);
      
      await vapi.start(config);
      
      console.log('VAPI started successfully');
      toast.success('Connected! The AI interviewer will speak shortly...');
    } catch (error) {
      console.error('VAPI Error:', error);
      console.error('Error details:', error.message);
      
      toast.error('Failed to start voice interview. Please try Text Interview instead.');
    }
  };

  const endInterview = () => {
    if (vapi) {
      vapi.stop();
      toast.info('Interview ended');
    }
  };

  const toggleMute = () => {
    if (vapi) {
      vapi.setMuted(!isMuted);
      setIsMuted(!isMuted);
      toast.info(isMuted ? 'Microphone unmuted' : 'Microphone muted');
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* AI Interviewer Connection UI */}
      {!isCallActive && (
        <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Ready to Connect</h2>
            <p className="text-gray-600">Click Connect to start your AI-powered interview</p>
          </div>

          {/* Feature badges */}
          <div className="flex justify-center gap-4 mb-8">
            <div className="flex items-center gap-2 px-4 py-2 bg-green-50 rounded-lg">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-700">Instant Start</span>
              <span className="text-xs text-gray-500">No setup required</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-lg">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-sm text-gray-700">AI Interviewer</span>
              <span className="text-xs text-gray-500">Real-time conversation</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-orange-50 rounded-lg">
              <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
              <span className="text-sm text-gray-700">Quick Feedback</span>
              <span className="text-xs text-gray-500">Instant results</span>
            </div>
          </div>

          {/* AI Interviewer and User Cards */}
          <div className="flex items-center justify-center gap-8 mb-8">
            {/* AI Interviewer Card */}
            <div className="bg-gradient-to-br from-primary to-primary-600 rounded-2xl p-8 text-white shadow-xl w-64 text-center">
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
                <img src="/ai-avatar.png" alt="AI Interviewer" className="w-20 h-20 rounded-full" />
              </div>
              <h3 className="text-xl font-bold mb-1">AI Interviewer</h3>
              <p className="text-sm text-white/80">Professional & Friendly</p>
            </div>

            {/* User Card */}
            <div className="bg-white border-2 border-gray-200 rounded-2xl p-8 shadow-xl w-64 text-center">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <img src="/user-avatar.png" alt="User" className="w-20 h-20 rounded-full" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-1">Vaibhav Singh</h3>
              <p className="text-sm text-gray-600">Ready to Interview</p>
            </div>
          </div>

          {/* Connect Button */}
          <div className="text-center">
            <button
              onClick={startInterview}
              className="px-12 py-4 bg-gradient-to-r from-primary to-primary-600 text-white rounded-full hover:shadow-xl transition-all transform hover:scale-105 font-semibold text-lg"
            >
              Connect
            </button>
          </div>
        </div>
      )}

      {/* Interview Status - Only show when call is active */}
      {isCallActive && (
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Voice Interview</h2>
            <p className="text-gray-600">Interview in progress...</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-primary">{formatTime(callDuration)}</div>
            <div className="text-sm text-gray-500">
              Question {currentQuestion + 1} of {questions.length}
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
          <div
            className="bg-primary h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
          />
        </div>

        {/* Control Buttons */}
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={toggleMute}
            className={`flex items-center gap-2 px-6 py-3 rounded-full transition-all ${
              isMuted
                ? 'bg-yellow-500 hover:bg-yellow-600'
                : 'bg-blue-500 hover:bg-blue-600'
            } text-white shadow-lg`}
          >
            {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            <span>{isMuted ? 'Unmute' : 'Mute'}</span>
          </button>

          <button
            onClick={endInterview}
            className="flex items-center gap-2 px-6 py-3 bg-red-500 text-white rounded-full hover:bg-red-600 transition-all shadow-lg"
          >
            <PhoneOff className="w-5 h-5" />
            <span>End Interview</span>
          </button>
        </div>
      </div>
      )}

      {/* Current Question */}
      {isCallActive && (
        <div className="bg-gradient-to-r from-primary to-primary-600 text-white rounded-lg shadow-lg p-6 mb-6">
          <h3 className="text-lg font-semibold mb-2">Current Question:</h3>
          <p className="text-xl">
            {typeof questions[currentQuestion] === 'string'
              ? questions[currentQuestion]
              : questions[currentQuestion]?.question}
          </p>
        </div>
      )}

      {/* Transcript */}
      {transcript.length > 0 && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Interview Transcript</h3>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {transcript.map((entry, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg ${
                  entry.role === 'assistant'
                    ? 'bg-blue-50 border-l-4 border-blue-500'
                    : 'bg-green-50 border-l-4 border-green-500'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  {entry.role === 'assistant' ? (
                    <Volume2 className="w-4 h-4 text-blue-600" />
                  ) : (
                    <Mic className="w-4 h-4 text-green-600" />
                  )}
                  <span className="font-semibold text-sm">
                    {entry.role === 'assistant' ? 'Interviewer' : 'You'}
                  </span>
                </div>
                <p className="text-gray-700">{entry.content}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Instructions - Remove when not needed */}
    </div>
  );
};

export default VoiceInterview;
