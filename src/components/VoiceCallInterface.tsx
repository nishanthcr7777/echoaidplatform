import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { useAction } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";
import { PhoneIcon } from "@heroicons/react/24/outline";

type ConversationTurn = {
  speaker: 'victim' | 'ai';
  message: string;
  timestamp: number;
};

type CallState = 'idle' | 'incoming' | 'connected' | 'processing' | 'ended';

const callScripts = [
  {
    victimStatement: "I'm having chest pains and difficulty breathing in Mumbai. Please send help immediately!",
    aiQuestion: "Okay, please stay calm. I'm dispatching a medical team to you. Can you tell me if you have any pre-existing medical conditions?",
    victimAnswer: "Yes, I have a history of heart problems.",
    finalAiResponse: "Thank you for that information. The ambulance is on its way to your location in Mumbai. Please try to stay as still as possible. Help will be there shortly."
  },
  {
    victimStatement: "Someone is trying to break into my house in Delhi! I'm hiding with my children.",
    aiQuestion: "I understand this is a frightening situation. We are dispatching police to your location right now. Can you tell me where you are in the house?",
    victimAnswer: "We're in the upstairs bedroom closet.",
    finalAiResponse: "Okay, stay hidden and quiet. The police will be there in Delhi very soon. Do not hang up."
  },
  {
    victimStatement: "Our house in Chennai was destroyed in the flood. We have nowhere to sleep tonight.",
    aiQuestion: "I'm so sorry to hear that. We are setting up emergency shelters. Can you tell me your location and how many people are with you?",
    victimAnswer: "We're near the old bridge. There are four of us.",
    finalAiResponse: "Okay, we have a rescue team heading to your location in Chennai. We will take you to a safe shelter. Help is on the way."
  }
];

export default function VoiceCallInterface() {
  const [isMounted, setIsMounted] = useState(false);
  const [callState, setCallState] = useState<CallState>('idle');
  const [callDuration, setCallDuration] = useState(0);
  const [currentSpeaker, setCurrentSpeaker] = useState<'victim' | 'ai' | null>(null);
  const [conversation, setConversation] = useState<ConversationTurn[]>([]);
  const [callerId, setCallerId] = useState('');

  const synthRef = useRef<SpeechSynthesis | null>(null);
  const callStateRef = useRef<CallState>('idle');
  useEffect(() => {
    callStateRef.current = callState;
  }, [callState]);
  const callTimerRef = useRef<NodeJS.Timeout | null>(null);
  const callTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const createRequest = useAction(api.ai.getFinalResponseAndCreateRequest);

  useEffect(() => {
    setIsMounted(true);
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        synthRef.current = window.speechSynthesis;
    }
    scheduleNextCall();
    return () => {
      if (callTimerRef.current) clearInterval(callTimerRef.current);
      if (callTimeoutRef.current) clearTimeout(callTimeoutRef.current);
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, []);

  const scheduleNextCall = () => {
    const randomDelay = Math.random() * 20000 + 10000; // 10-30 seconds
    if (callTimeoutRef.current) clearTimeout(callTimeoutRef.current);
    callTimeoutRef.current = setTimeout(simulateIncomingCall, randomDelay);
  };

  const simulateIncomingCall = () => {
    if (callStateRef.current !== 'idle') return;
    setConversation([]);
    const randomCallerId = `+91-9${Math.floor(100 + Math.random() * 900)}-${Math.floor(1000 + Math.random() * 9000)}`;
    setCallerId(randomCallerId);
    setCallState('incoming');
    toast.info(`📞 Incoming Call from ${randomCallerId}`, {
      duration: 7000,
      action: { label: "Answer", onClick: answerCall },
    });
    setTimeout(() => {
      if (callStateRef.current === 'incoming') answerCall();
    }, 7000);
  };

  const getVoices = () => {
    return new Promise<SpeechSynthesisVoice[]>((resolve) => {
      if (!synthRef.current) {
        return resolve([]);
      }
      let voices = synthRef.current.getVoices();
      if (voices.length) {
        resolve(voices);
        return;
      }
      synthRef.current.onvoiceschanged = () => {
        voices = synthRef.current!.getVoices();
        resolve(voices);
      };
    });
  };

  const speak = async (message: string, speaker: 'ai' | 'victim') => {
    if (!synthRef.current || !message) return;
    
    synthRef.current.cancel();
    setCurrentSpeaker(speaker);
    const utterance = new SpeechSynthesisUtterance(message);
    
    const voices = await getVoices();
    let aiVoice = voices.find(v => v.lang === 'en-US' && v.name.includes('Google'));
    if (!aiVoice) aiVoice = voices.find(v => v.lang === 'en-US');
    
    let victimVoice = voices.find(v => v.lang === 'en-GB' && v.name.includes('Female'));
    if (!victimVoice) victimVoice = voices.find(v => v.lang === 'en-GB');

    if (speaker === 'ai') {
      utterance.voice = aiVoice || null;
      utterance.pitch = 1;
      utterance.rate = 1;
    } else {
      utterance.voice = victimVoice || null;
      utterance.pitch = 1.2;
      utterance.rate = 1.1;
    }
    
    return new Promise<void>((resolve, reject) => {
      utterance.onend = () => {
        setCurrentSpeaker(null);
        resolve();
      };
      utterance.onerror = (e) => {
        console.error("Speech synthesis error", e);
        setCurrentSpeaker(null);
        reject(e);
      };
      synthRef.current!.speak(utterance);
    });
  };

  const addConversationTurn = (speaker: 'ai' | 'victim', message: string) => {
    setConversation(prev => [...prev, { speaker, message, timestamp: Date.now() }]);
  };

  const answerCall = async () => {
    if (callStateRef.current !== 'incoming') return;
    setCallState('connected');
    setCallDuration(0);
    if (callTimerRef.current) clearInterval(callTimerRef.current);
    callTimerRef.current = setInterval(() => setCallDuration(prev => prev + 1), 1000);

    const script = callScripts[Math.floor(Math.random() * callScripts.length)];
    const fullConversation: ConversationTurn[] = [];

    const greeting = "EchoAid Emergency Response. How can I help you?";
    addConversationTurn('ai', greeting);
    fullConversation.push({ speaker: 'ai', message: greeting, timestamp: Date.now() });
    await speak(greeting, 'ai');

    addConversationTurn('victim', script.victimStatement);
    fullConversation.push({ speaker: 'victim', message: script.victimStatement, timestamp: Date.now() });
    await speak(script.victimStatement, 'victim');

    setCallState('processing');

    addConversationTurn('ai', script.aiQuestion);
    fullConversation.push({ speaker: 'ai', message: script.aiQuestion, timestamp: Date.now() });
    await speak(script.aiQuestion, 'ai');

    addConversationTurn('victim', script.victimAnswer);
    fullConversation.push({ speaker: 'victim', message: script.victimAnswer, timestamp: Date.now() });
    await speak(script.victimAnswer, 'victim');

    addConversationTurn('ai', script.finalAiResponse);
    fullConversation.push({ speaker: 'ai', message: script.finalAiResponse, timestamp: Date.now() });
    await speak(script.finalAiResponse, 'ai');

    try {
        await createRequest({
            callerId,
            conversation: fullConversation,
        });
        toast.success("✅ Request created and help dispatched!");
    } catch (error) {
        console.error("Failed to create request:", error);
        toast.error("Failed to create request.");
    }

    endCall();
  };

  const endCall = () => {
    setCallState('ended');
    if (callTimerRef.current) clearInterval(callTimerRef.current);
    if (synthRef.current) {
      synthRef.current.cancel();
    }
    setTimeout(() => {
      setCallState('idle');
      scheduleNextCall();
    }, 3000);
  };

  const formatTime = (seconds: number) => `${Math.floor(seconds / 60).toString().padStart(2, '0')}:${(seconds % 60).toString().padStart(2, '0')}`;

  if (!isMounted || callState === 'idle') {
    return null;
  }

  return createPortal(
    <div className="fixed bottom-6 right-6 bg-gray-800 rounded-lg border border-gray-700 p-6 w-96 shadow-2xl z-[5000]">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-white">{callState === 'incoming' ? 'Incoming Call' : 'Live Call'}</h3>
          <p className="text-sm text-blue-400">{callerId}</p>
        </div>
        <div className="flex items-center gap-3">
          {(callState === 'connected' || callState === 'processing') && <div className="text-sm text-green-400 font-mono">{formatTime(callDuration)}</div>}
          <div className={`w-3 h-3 rounded-full ${callState === 'connected' || callState === 'processing' ? 'bg-green-500 animate-pulse' : 'bg-gray-500'}`}></div>
        </div>
      </div>

      {callState === 'incoming' && (
        <div className="text-center">
          <div className="animate-bounce mb-4"><PhoneIcon className="w-12 h-12 text-green-400 mx-auto" /></div>
          <button onClick={answerCall} className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700">Answer</button>
        </div>
      )}

      {(callState === 'connected' || callState === 'processing' || callState === 'ended') && (
        <div className="space-y-4">
          <div className="bg-gray-700 rounded-lg p-4 max-h-60 overflow-y-auto">
            <div className="space-y-3">
              {conversation.map((msg, index) => (
                <div key={index} className={`flex ${msg.speaker === 'ai' ? 'justify-start' : 'justify-end'}`}>
                  <div className={`max-w-xs px-3 py-2 rounded-lg text-sm ${msg.speaker === 'ai' ? 'bg-blue-600 text-white' : 'bg-red-600 text-white'}`}>
                    <div className="font-medium text-xs mb-1">{msg.speaker === 'ai' ? '🤖 AI Operator' : '😰 Victim'}</div>
                    <div>{msg.message}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {callState === 'processing' && (
            <div className="flex items-center justify-center gap-2 text-blue-400">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-400"></div>
              <span className="text-sm">Processing...</span>
            </div>
          )}

          <div className="text-center text-sm text-gray-400">
            {currentSpeaker ? `🎙️ ${currentSpeaker === 'victim' ? 'Victim speaking...' : 'AI responding...'}` : 'Call in progress...'}
          </div>

          <div className="flex items-center justify-center gap-4">
            <button onClick={endCall} className="p-4 bg-red-600 hover:bg-red-700 rounded-full" title="End call">
              <PhoneIcon className="w-6 h-6 text-white transform rotate-135" />
            </button>
          </div>
        </div>
      )}
    </div>,
    document.body
  );
}
