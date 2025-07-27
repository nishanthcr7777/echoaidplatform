import { useState, useEffect, useRef } from 'react';
import { PhoneIcon, PlayIcon, PauseIcon, MapPinIcon, ClockIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

type Call = {
  id: number;
  victimName: string;
  language: string;
  location: string;
  duration: number;
  reason: string;
  conversation: { speaker: 'ai' | 'victim'; text: string }[];
};

const fakeCalls: Call[] = [
  {
    id: 1, victimName: 'Priya Sharma', language: 'Hindi', location: 'Mumbai', duration: 122, reason: 'Medical Emergency',
    conversation: [
      { speaker: 'ai', text: 'नमस्ते, आपातकालीन सेवाओं में आपका स्वागत है। मैं आपकी क्या मदद कर सकती हूँ?' },
      { speaker: 'victim', text: 'मेरे सीने में बहुत तेज दर्द हो रहा है!' },
      { speaker: 'ai', text: 'शांत रहें, हम मदद भेज रहे हैं। क्या आप अपनी लोकेशन बता सकती हैं?' },
    ],
  },
  {
    id: 2, victimName: 'Arjun Reddy', language: 'Telugu', location: 'Hyderabad', duration: 305, reason: 'Safety Concern',
    conversation: [
      { speaker: 'ai', text: 'నమస్కారం, అత్యవసర సేవలకు స్వాగతం. నేను మీకు ఎలా సహాయపడగలను?' },
      { speaker: 'victim', text: 'మా ఇంట్లో దొంగలు పడ్డారు!' },
      { speaker: 'ai', text: 'ధైర్యంగా ఉండండి, మేము పోలీసులను పంపిస్తున్నాము.' },
    ],
  },
  {
    id: 3, victimName: 'Ananya Banerjee', language: 'Bengali', location: 'Kolkata', duration: 488, reason: 'Medical Emergency',
    conversation: [
      { speaker: 'ai', text: 'নমস্কার, জরুরি পরিষেবাতে আপনাকে স্বাগত। আমি আপনাকে কিভাবে সাহায্য করতে পারি?' },
      { speaker: 'victim', text: 'আমার বাচ্চা খুব অসুস্থ, তার নিঃশ্বাস নিতে কষ্ট হচ্ছে।' },
      { speaker: 'ai', text: 'চিন্তা করবেন না, অ্যাম্বুলেন্স আসছে।' },
    ],
  },
  {
    id: 4, victimName: 'Suresh Patel', language: 'Gujarati', location: 'Ahmedabad', duration: 60, reason: 'Fire Emergency',
    conversation: [
        { speaker: 'ai', text: 'નમસ્તે, કટોકટી સેવાઓમાં આપનું સ્વાગત છે. હું તમને કેવી રીતે મદદ કરી શકું?' },
        { speaker: 'victim', text: 'અમારા વિસ્તારમાં આગ લાગી છે!' },
        { speaker: 'ai', text: 'તમે સુરક્ષિત જગ્યાએ રહો, ફાયર બ્રિગેડ મોકલવામાં આવી રહી છે.' },
    ],
  },
  {
    id: 5, victimName: 'Meera Krishnan', language: 'Tamil', location: 'Chennai', duration: 123, reason: 'Medical Emergency',
    conversation: [
        { speaker: 'ai', text: 'வணக்கம், அவசர சேவைகளுக்கு வரவேற்கிறோம். நான் உங்களுக்கு எப்படி உதவ முடியும்?' },
        { speaker: 'victim', text: 'என் பாட்டி மாடியிலிருந்து விழுந்துவிட்டார்கள்!' },
        { speaker: 'ai', text: 'கவலைப்படாதீர்கள், மருத்துவக் குழுவை அனுப்புகிறோம்.' },
    ],
  },
  {
    id: 6, victimName: 'Rohan Joshi', language: 'Marathi', location: 'Pune', duration: 150, reason: 'Natural Disaster',
    conversation: [
        { speaker: 'ai', text: 'नमस्कार, आपत्कालीन सेवांमध्ये आपले स्वागत आहे. मी तुमची कशी मदत करू शकते?' },
        { speaker: 'victim', text: 'इथे पूर आला आहे, आम्ही अडकलो आहोत!' },
        { speaker: 'ai', text: 'शांत रहा, बचाव पथक तुमच्यापर्यंत पोहोचत आहे.' },
    ],
  },
  {
    id: 7, victimName: 'Jaspreet Kaur', language: 'Punjabi', location: 'Delhi', duration: 180, reason: 'Fire Emergency',
    conversation: [
        { speaker: 'ai', text: 'ਸਤ ਸ੍ਰੀ ਅਕਾਲ, ਐਮਰਜੈਂਸੀ ਸੇਵਾਵਾਂ ਵਿੱਚ ਤੁਹਾਡਾ ਸਵਾਗਤ ਹੈ। ਮੈਂ ਤੁਹਾਡੀ ਕੀ ਮਦਦ ਕਰ ਸਕਦੀ ਹਾਂ?' },
        { speaker: 'victim', text: 'ਮੇਰੇ ਘਰ ਨੂੰ ਅੱਗ ਲੱਗ ਗਈ ਹੈ!' },
        { speaker: 'ai', text: 'ਸ਼ਾਂਤ ਰਹੋ, ਅਸੀਂ ਫਾਇਰ ਬ੍ਰਿਗੇਡ ਭੇਜ ਰਹੇ ਹਾਂ।' },
    ],
  },
  {
    id: 8, victimName: 'Shankar Gowda', language: 'Kannada', location: 'Bangalore', duration: 200, reason: 'Medical Emergency',
    conversation: [
        { speaker: 'ai', text: 'ನಮಸ್ಕಾರ, ತುರ್ತು ಸೇವೆಗಳಿಗೆ ಸ್ವಾಗತ. ನಾನು ನಿಮಗೆ ಹೇಗೆ ಸಹಾಯ ಮಾಡಲಿ?' },
        { speaker: 'victim', text: 'ನನ್ನ ಮಗುವಿಗೆ ಉಸಿರಾಟದ ತೊಂದರೆಯಾಗಿದೆ.' },
        { speaker: 'ai', text: 'ಗಾಬರಿಯಾಗಬೇಡಿ, ಆಂಬ್ಯುಲೆನ್ಸ್ ಬರುತ್ತಿದೆ.' },
    ],
  },
  {
    id: 9, victimName: 'Aarav Singh', language: 'Hindi', location: 'Jaipur', duration: 130, reason: 'Food Shortage',
    conversation: [
        { speaker: 'ai', text: 'नमस्ते, आपातकालीन सेवाओं में आपका स्वागत है।' },
        { speaker: 'victim', text: 'हमारे पास तीन दिन से खाने को कुछ नहीं है।' },
        { speaker: 'ai', text: 'हम तुरंत मदद भेज रहे हैं। कृपया अपना पता बताएं।' },
    ],
  },
  {
    id: 10, victimName: 'Kavita Rao', language: 'Hindi', location: 'Lucknow', duration: 245, reason: 'Shelter Needed',
    conversation: [
        { speaker: 'ai', text: 'नमस्ते, आप आपातकालीन सेवाओं से संपर्क में हैं।' },
        { speaker: 'victim', text: 'बाढ़ में हमारा घर बह गया, हमें रहने की जगह चाहिए।' },
        { speaker: 'ai', text: 'हम आपको निकटतम आश्रय स्थल की जानकारी दे रहे हैं।' },
    ],
  },
  {
    id: 11, victimName: 'John Doe', language: 'English', location: 'Goa', duration: 95, reason: 'Medical Emergency',
    conversation: [
        { speaker: 'ai', text: 'Emergency services, how can I help?' },
        { speaker: 'victim', text: 'My friend is unconscious and not breathing!' },
        { speaker: 'ai', text: 'An ambulance is on its way. Please stay on the line.' },
    ],
  },
  {
    id: 12, victimName: 'Jane Smith', language: 'English', location: 'Kerala', duration: 180, reason: 'Safety Concern',
    conversation: [
        { speaker: 'ai', text: 'This is EchoAid emergency response.' },
        { speaker: 'victim', text: 'There is a strange car that has been parked outside my house for hours.' },
        { speaker: 'ai', text: 'We are dispatching a patrol car to your location immediately.' },
    ],
  },
  {
    id: 13, victimName: 'Ravi Kumar', language: 'Hindi', location: 'Noida', duration: 155, reason: 'Road Accident',
    conversation: [
        { speaker: 'ai', text: 'नमस्ते, आपातकालीन सेवाओं में आपका स्वागत है।' },
        { speaker: 'victim', text: 'यहाँ एक एक्सीडेंट हो गया है, एक आदमी बुरी तरह से घायल है!' },
        { speaker: 'ai', text: 'कृपया शांत रहें, हम एम्बुलेंस भेज रहे हैं। क्या आप सही जगह बता सकते हैं?' },
    ],
  },
  {
    id: 14, victimName: 'Sunita Devi', language: 'Hindi', location: 'Gurgaon', duration: 320, reason: 'Domestic Violence',
    conversation: [
        { speaker: 'ai', text: 'आपातकालीन सेवाएं, आप सुरक्षित हैं?' },
        { speaker: 'victim', text: 'मेरे पति मुझे मार रहे हैं, कृपया पुलिस भेजिए!' },
        { speaker: 'ai', text: 'हम तुरंत पुलिस भेज रहे हैं। क्या आप किसी सुरक्षित कमरे में जा सकती हैं?' },
    ],
  },
  {
    id: 15, victimName: 'Sarah Williams', language: 'English', location: 'Mumbai', duration: 410, reason: 'Lost Child',
    conversation: [
        { speaker: 'ai', text: 'Emergency services, how can I help?' },
        { speaker: 'victim', text: 'I can\'t find my son! We were at the Gateway of India and he was just here.' },
        { speaker: 'ai', text: 'Okay, stay calm. A police unit is on its way. What is your son\'s name and what is he wearing?' },
    ],
  },
  {
    id: 16, victimName: 'David Chen', language: 'English', location: 'Bangalore', duration: 250, reason: 'Gas Leak',
    conversation: [
        { speaker: 'ai', text: 'EchoAid emergency response.' },
        { speaker: 'victim', text: 'I smell a strong gas leak in my apartment building! I think it\'s coming from the floor below.' },
        { speaker: 'ai', text: 'Please evacuate the building immediately if it is safe to do so. We are dispatching the fire department to your location.' },
    ],
  },
];

const languageToCode: Record<string, string> = {
  'Hindi': 'hi-IN', 'Telugu': 'te-IN', 'Bengali': 'bn-IN', 'Gujarati': 'gu-IN',
  'Tamil': 'ta-IN', 'Marathi': 'mr-IN', 'Punjabi': 'pa-IN', 'Kannada': 'kn-IN', 'English': 'en-US',
};

const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

export default function OngoingCalls() {
  const [activeCallId, setActiveCallId] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;
      const loadVoices = () => {
        const availableVoices = synthRef.current?.getVoices() || [];
        setVoices(availableVoices);
      };
      
      synthRef.current.onvoiceschanged = loadVoices;
      loadVoices();

      return () => {
        if (synthRef.current) {
          synthRef.current.onvoiceschanged = null;
          synthRef.current.cancel();
        }
      };
    }
  }, []);

  const playConversation = (call: Call) => {
    if (synthRef.current && (voices.length > 0 || synthRef.current.getVoices().length > 0)) {
      synthRef.current.cancel();
      setActiveCallId(call.id);
      setIsPlaying(true);
      let currentIndex = 0;

      const availableVoices = voices.length > 0 ? voices : synthRef.current.getVoices();
      const langCode = languageToCode[call.language] || 'en-US';
      const voiceForLang = availableVoices.find(voice => voice.lang === langCode);

      const speakNext = () => {
        if (currentIndex < call.conversation.length) {
          const turn = call.conversation[currentIndex];
          utteranceRef.current = new SpeechSynthesisUtterance(turn.text);
          utteranceRef.current.lang = langCode;
          if (voiceForLang) {
            utteranceRef.current.voice = voiceForLang;
          }
          utteranceRef.current.onend = () => {
            currentIndex++;
            speakNext();
          };
          synthRef.current?.speak(utteranceRef.current);
        } else {
          setIsPlaying(false);
          setActiveCallId(null);
        }
      };
      speakNext();
    } else {
      alert("Speech synthesis is not supported or voices are not loaded yet. Please try again in a moment.");
    }
  };

  const stopConversation = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
    }
    setIsPlaying(false);
    setActiveCallId(null);
  };

  const handleTogglePlay = (call: Call) => {
    if (activeCallId === call.id && isPlaying) {
      stopConversation();
    } else {
      playConversation(call);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-2">Ongoing Calls</h2>
      <p className="text-gray-400 mb-6">Listen in on live emergency calls.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {fakeCalls.map((call) => (
          <div key={call.id} className="bg-gray-800 rounded-lg p-4 border border-gray-700 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="font-semibold text-white">{call.victimName}</p>
                  <p className="text-sm text-gray-400">{call.language}</p>
                </div>
                <PhoneIcon className={`w-6 h-6 ${activeCallId === call.id && isPlaying ? 'text-green-400 animate-pulse' : 'text-green-500'}`} />
              </div>
              <div className="space-y-2 text-sm mb-4">
                <div className="flex items-center gap-2 text-gray-300">
                  <ExclamationTriangleIcon className="w-4 h-4 text-yellow-400" />
                  <span>{call.reason}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-300">
                  <MapPinIcon className="w-4 h-4 text-blue-400" />
                  <span>{call.location}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-300">
                  <ClockIcon className="w-4 h-4 text-gray-400" />
                  <span>{formatDuration(call.duration)}</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => handleTogglePlay(call)}
              className="w-full mt-auto flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {activeCallId === call.id && isPlaying ? (
                <>
                  <PauseIcon className="w-5 h-5" />
                  <span>Listening...</span>
                </>
              ) : (
                <>
                  <PlayIcon className="w-5 h-5" />
                  <span>Listen In</span>
                </>
              )}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
