import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { vapi } from "../lib/vapi.sdk";
import { simpleInterviewer, simpleGenerator, createCustomInterviewer } from "../constants/vapi-config";
import { feedbackAPI } from "../services/api";
import { toast } from "sonner";
import { Mic, MicOff, Phone, PhoneOff } from "lucide-react";

// Call status enum
const CallStatus = {
  INACTIVE: "INACTIVE",
  CONNECTING: "CONNECTING",
  ACTIVE: "ACTIVE",
  FINISHED: "FINISHED",
};

const Agent = ({
  userName = "User",
  userId,
  interviewId,
  feedbackId,
  type = "interview",
  questions = [],
  role = "Developer",
  level = "intermediate",
}) => {
  const navigate = useNavigate();

  // State management
  const [callStatus, setCallStatus] = useState(CallStatus.INACTIVE);
  const [messages, setMessages] = useState([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [lastMessage, setLastMessage] = useState("");
  const [callDuration, setCallDuration] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);

  // VAPI Event Listeners Setup
  useEffect(() => {
    let durationInterval;

    const onCallStart = () => {
      console.log("✅ Call started successfully");
      setCallStatus(CallStatus.ACTIVE);
      toast.success("Interview started! The AI interviewer will speak shortly.");
      
      // Start duration timer
      durationInterval = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    };

    const onCallEnd = () => {
      console.log("📞 Call ended");
      setCallStatus(CallStatus.FINISHED);
      
      if (durationInterval) {
        clearInterval(durationInterval);
      }
    };

    const onMessage = (message) => {
      console.log("💬 Message received:", message);

      if (message.type === "transcript" && message.transcriptType === "final") {
        const newMessage = { 
          role: message.role, 
          content: message.transcript,
          timestamp: new Date().toISOString()
        };
        setMessages((prev) => [...prev, newMessage]);
        
        // Track question progress
        if (message.role === 'assistant' && message.transcript.includes('?')) {
          setCurrentQuestion(prev => Math.min(prev + 1, questions.length));
        }
      }
    };

    const onSpeechStart = () => {
      console.log("🎤 Speech started");
      setIsSpeaking(true);
    };

    const onSpeechEnd = () => {
      console.log("🔇 Speech ended");
      setIsSpeaking(false);
    };

    const onError = (error) => {
      console.error("❌ VAPI Error:", error);
      
      if (error && typeof error === 'object' && 'error' in error) {
        const errorObj = error;
        if (errorObj.error?.type === 'ejected' || errorObj.errorMsg?.includes('Meeting has ended')) {
          setCallStatus(CallStatus.FINISHED);
        } else {
          setCallStatus(CallStatus.INACTIVE);
          toast.error("An error occurred during the interview");
        }
      } else {
        setCallStatus(CallStatus.INACTIVE);
        toast.error("An error occurred during the interview");
      }
    };

    // Register event listeners
    vapi.on("call-start", onCallStart);
    vapi.on("call-end", onCallEnd);
    vapi.on("message", onMessage);
    vapi.on("speech-start", onSpeechStart);
    vapi.on("speech-end", onSpeechEnd);
    vapi.on("error", onError);

    // Cleanup on unmount
    return () => {
      vapi.off("call-start", onCallStart);
      vapi.off("call-end", onCallEnd);
      vapi.off("message", onMessage);
      vapi.off("speech-start", onSpeechStart);
      vapi.off("speech-end", onSpeechEnd);
      vapi.off("error", onError);
      
      if (durationInterval) {
        clearInterval(durationInterval);
      }
    };
  }, [questions.length]);

  // Handle messages and feedback generation
  useEffect(() => {
    if (messages.length > 0) {
      setLastMessage(messages[messages.length - 1].content);
    }

    const handleGenerateFeedback = async (messages) => {
      console.log("Generating feedback...");
      toast.loading("Generating your feedback...");

      try {
        // Extract answers from transcript
        const answers = messages
          .filter(entry => entry.role === 'user')
          .map(entry => entry.content);

        const respon