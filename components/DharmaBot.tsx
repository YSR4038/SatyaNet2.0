
import React, { useState, useRef, useEffect } from 'react';
import { dharmaChat } from '../services/geminiService';
import { Language } from '../App';

interface DharmaBotProps {
  language: Language;
}

export const DharmaBot: React.FC<DharmaBotProps> = ({ language }) => {
  const getInitialMessage = (lang: Language) => {
    switch(lang) {
      case 'hi': return "नमस्ते, सत्य के खोजी। मैं धर्म बॉट हूँ। मैं आज आपकी खोजी यात्रा में कैसे सहायता कर सकता हूँ?";
      case 'mr': return "नमस्कार, सत्याचा शोध घेणाऱ्या. मी धर्म बॉट आहे. आज मी तुमच्या तपासात कशी मदत करू शकतो?";
      case 'ta': return "வணக்கம், உண்மையைத் தேடுபவரே. நான் தர்ம பாட். உங்கள் விசாரணைப் பயணத்திற்கு இன்று நான் எவ்வாறு உதவ முடியும்?";
      case 'bn': return "নমস্কার, সত্যের সন্ধানী। আমি ধর্ম বট। আজ আমি আপনার তদন্তে কীভাবে সাহায্য করতে পারি?";
      default: return "Greetings, seeker of truth. I am Dharma Bot. How can I assist your investigative journey today?";
    }
  };

  const [messages, setMessages] = useState<{ role: 'user' | 'bot', text: string }[]>([
    { role: 'bot', text: getInitialMessage(language) }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMessages([{ role: 'bot', text: getInitialMessage(language) }]);
  }, [language]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const getNoWordsText = (lang: Language) => {
    switch(lang) {
      case 'hi': return "मेरे पास इस समय शब्द नहीं हैं।";
      case 'mr': return "माझ्याकडे सध्या शब्द नाहीत.";
      case 'ta': return "என்னிடம் தற்போது வார்த்தைகள் இல்லை.";
      case 'bn': return "আমার কাছে এই মুহূর্তে কোনো শব্দ নেই।";
      default: return "I cannot find the words at this moment.";
    }
  };

  const getErrorText = (lang: Language) => {
    switch(lang) {
      case 'hi': return "नेटवर्क में गड़बड़ी मेरी प्रतिक्रिया को रोकती है।";
      case 'mr': return "नेटवर्कमधील व्यत्यय माझ्या प्रतिसादास प्रतिबंध करतो.";
      case 'ta': return "நெட்வொர்க்கில் உள்ள இடையூறு எனது பதிலைத் தடுக்கிறது.";
      case 'bn': return "নেটওয়ার্কের সমস্যা আমার প্রতিক্রিয়া জানাতে বাধা দিচ্ছে।";
      default: return "A disturbance in the network prevents my response.";
    }
  };

  const getTitle = (lang: Language) => {
    switch(lang) {
      case 'hi': return 'धर्म बॉट';
      case 'mr': return 'धर्म बॉट';
      case 'ta': return 'தர்ம பாட்';
      case 'bn': return 'ধর্ম বট';
      default: return 'Dharma Bot';
    }
  };

  const getSubtitle = (lang: Language) => {
    switch(lang) {
      case 'hi': return 'प्राचीन ज्ञान डिजिटल फोरेंसिक से मिलता है। नैतिकता, सत्यापन या सुरक्षा के बारे में पूछें।';
      case 'mr': return 'प्राचीन ज्ञान डिजिटल फॉरेन्सिकला भेटते. नैतिकता, पडताळणी किंवा सुरक्षिततेबद्दल विचारा.';
      case 'ta': return 'பண்டைய ஞானம் டிஜிட்டல் தடயவியலைச் சந்திக்கிறது. நெறிமுறைகள், சரிபார்ப்பு அல்லது பாதுகாப்பு பற்றி கேளுங்கள்.';
      case 'bn': return 'প্রাচীন জ্ঞান ডিজিটাল ফরেনসিকের সাথে মিলিত হয়। নীতিশাস্ত্র, যাচাইকরণ বা নিরাপত্তা সম্পর্কে জিজ্ঞাসা করুন।';
      default: return 'Ancient wisdom meets digital forensics. Ask about ethics, verification, or safety.';
    }
  };

  const getPlaceholder = (lang: Language) => {
    switch(lang) {
      case 'hi': return 'डिजिटल नैतिकता के बारे में एक प्रश्न पूछें...';
      case 'mr': return 'डिजिटल नैतिकतेबद्दल प्रश्न विचारा...';
      case 'ta': return 'டிஜிட்டல் நெறிமுறைகள் பற்றி ஒரு கேள்வியைக் கேளுங்கள்...';
      case 'bn': return 'ডিজিটাল নীতিশাস্ত্র সম্পর্কে একটি প্রশ্ন জিজ্ঞাসা করুন...';
      default: return 'Ask a question about digital ethics...';
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);

    try {
      const response = await dharmaChat(userMsg, language);
      setMessages(prev => [...prev, { role: 'bot', text: response || getNoWordsText(language) }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'bot', text: getErrorText(language) }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto pb-10">
      <div className="mb-8">
        <h2 className="text-3xl font-heading font-bold text-white mb-2">{getTitle(language)}</h2>
        <p className="text-zinc-500">{getSubtitle(language)}</p>
      </div>

      <div className="flex-1 bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden flex flex-col shadow-2xl">
        <div ref={scrollRef} className="flex-1 p-6 overflow-y-auto space-y-6">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] p-5 rounded-2xl ${
                msg.role === 'user' 
                  ? 'bg-blue-600 text-white rounded-br-none' 
                  : 'bg-zinc-800 text-zinc-200 rounded-bl-none border border-zinc-700'
              }`}>
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-zinc-800 p-5 rounded-2xl rounded-bl-none border border-zinc-700 flex gap-2">
                <div className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce"></div>
                <div className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce delay-100"></div>
                <div className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce delay-200"></div>
              </div>
            </div>
          )}
        </div>

        <div className="p-4 bg-zinc-950 border-t border-zinc-800">
          <div className="flex gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder={getPlaceholder(language)}
              className="flex-1 bg-zinc-900 border border-zinc-800 rounded-2xl px-6 py-4 text-zinc-300 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
            />
            <button
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className="p-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl transition-all shadow-lg shadow-emerald-900/20 disabled:opacity-50"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
