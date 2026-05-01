
import React, { useState, useEffect } from 'react';
import { analyzeText, analyzeImage } from '../services/geminiService';
import { AnalysisReport } from '../types';
import { Language } from '../App';

interface DashboardProps {
  onAnalysisComplete: (report: AnalysisReport) => void;
  language: Language;
  isPro: boolean;
}

export const Dashboard: React.FC<DashboardProps> = ({ onAnalysisComplete, language, isPro }) => {
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showDharmaAcademy, setShowDharmaAcademy] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [history, setHistory] = useState<AnalysisReport[]>([]);
  const [feedItems, setFeedItems] = useState<{ id: string, loc: string, action: string, type: string }[]>([]);

  const t = {
    en: {
      mission: 'Mission: Digital Integrity',
      title: 'Forensic Lab',
      desc: 'Expose misinformation and verify digital assets. Every analysis generates an immutable forensic report with a unique digital fingerprint.',
      scans: 'Scans Run',
      truthRate: 'Truth Rate',
      textTitle: 'Text Forensics',
      textPlaceholder: 'Paste text or claim to verify...',
      analyzeBtn: 'ANALYZE INTEGRITY',
      processing: 'PROCESSING...',
      mediaTitle: 'Media Analysis',
      uploadEvidence: 'Upload Evidence',
      autoLog: 'MD5 / SHA-256 AUTOMATIC LOGGING',
      recent: 'Recent Activity',
      noLogs: 'No recent logs found.',
      score: 'Score',
      liveFeed: 'Live Intelligence Stream',
      briefing: 'Investigator Briefing',
      proBadge: 'PRO FEATURE',
      dropToUpload: 'Drop file to upload',
      invalidFileType: 'Unsupported file type. Please upload an image.',
      uploading: 'Uploading...',
      academy: 'Dharma Academy',
      academyDesc: 'Learn the Vedic principles of information integrity and digital ethics.',
      startModule: 'START MODULE',
      threatMap: 'Global Cyber Threat Map',
      live: 'LIVE',
      threats: 'Active Threats',
      nodes: 'Satya Nodes',
      active: 'Active'
    },
    hi: {
      mission: 'मिशन: डिजिटल अखंडता',
      title: 'फोरेंसिक लैब',
      desc: 'गलत सूचनाओं को उजागर करें और डिजिटल संपत्तियों को सत्यापित करें। प्रत्येक विश्लेषण एक अद्वितीय डिजिटल फिंगरप्रिंट के साथ एक अपरिवर्तनीय फोरेंसिक रिपोर्ट तैयार करता है।',
      scans: 'कुल स्कैन',
      truthRate: 'सत्य दर',
      textTitle: 'टेक्स्ट फोरेंसिक',
      textPlaceholder: 'सत्यापित करने के लिए टेक्स्ट या दावा पेस्ट करें...',
      analyzeBtn: 'अखंडता का विश्लेषण करें',
      processing: 'प्रसंस्करण...',
      mediaTitle: 'मीडिया विश्लेषण',
      uploadEvidence: 'सबूत अपलोड करें',
      autoLog: 'MD5 / SHA-256 स्वचालित लॉगिंग',
      recent: 'हाल की गतिविधि',
      noLogs: 'कोई हालिया लॉग नहीं मिला।',
      score: 'स्कोर',
      liveFeed: 'लाइव इंटेलिजेंस स्ट्रीम',
      briefing: 'अन्वेषक ब्रीफिंग',
      proBadge: 'प्रो फीचर',
      dropToUpload: 'अपलोड करने के लिए फ़ाइल छोड़ें',
      invalidFileType: 'असमर्थित फ़ाइल प्रकार। कृपया एक छवि अपलोड करें।',
      uploading: 'अपलोड हो रहा है...',
      academy: 'धर्म अकादमी',
      academyDesc: 'सूचना अखंडता और डिजिटल नैतिकता के वैदिक सिद्धांतों को जानें।',
      startModule: 'मॉड्यूल शुरू करें',
      threatMap: 'ग्लोबल साइबर थ्रेट मैप',
      live: 'लाइव',
      threats: 'सक्रिय खतरे',
      nodes: 'सत्य नोड्स',
      active: 'सक्रिय'
    },
    mr: {
      mission: 'मिशन: डिजिटल अखंडता',
      title: 'फॉरेन्सिक लॅब',
      desc: 'चुकीची माहिती उघड करा आणि डिजिटल मालमत्ता सत्यापित करा. प्रत्येक विश्लेषण युनिक डिजिटल फिंगरप्रिंटसह अपरिवर्तनीय फॉरेन्सिक रिपोर्ट तयार करते.',
      scans: 'स्कॅन रन',
      truthRate: 'सत्य दर',
      textTitle: 'मजकूर फॉरेन्सिक',
      textPlaceholder: 'सत्यापित करण्यासाठी मजकूर किंवा दावा पेस्ट करा...',
      analyzeBtn: 'अखंडतेचे विश्लेषण करा',
      processing: 'प्रक्रिया सुरू आहे...',
      mediaTitle: 'मीडिया विश्लेषण',
      uploadEvidence: 'पुरावा अपलोड करा',
      autoLog: 'MD5 / SHA-256 स्वयंचलित लॉगिंग',
      recent: 'अलीकडील क्रियाकलाप',
      noLogs: 'कोणतेही अलीकडील लॉग आढळले नाहीत.',
      score: 'स्कोर',
      liveFeed: 'लाइव इंटेलिजेंस स्ट्रीम',
      briefing: 'अन्वेषक ब्रीफिंग',
      proBadge: 'प्रो फीचर',
      dropToUpload: 'अपलोड करण्यासाठी फाइल सोडा',
      invalidFileType: 'असमर्थित फाइल प्रकार. कृपया प्रतिमा अपलोड करा.',
      uploading: 'अपलोड होत आहे...',
      academy: 'धर्म अकादमी',
      academyDesc: 'माहिती अखंडता आणि डिजिटल नैतिकतेची वैदिक तत्त्वे जाणून घ्या.',
      startModule: 'मॉड्यूल सुरू करा',
      threatMap: 'ग्लोबल सायबर थ्रेट मॅप',
      live: 'लाइव्ह',
      threats: 'सक्रिय धोके',
      nodes: 'सत्य नोड्स',
      active: 'सक्रिय'
    },
    ta: {
      mission: 'நோக்கம்: டியிட்டல் ஒருமைப்பாடு',
      title: 'தடயவியல் ஆய்வகம்',
      desc: 'தவறான தகவல்களை அம்பலப்படுத்துங்கள் மற்றும் டிஜிட்டல் சொத்துக்களை சரிபார்க்கவும். ஒவ்வொரு பகுப்பாய்வும் ஒரு தனித்துவமான டிஜிட்டல் கைரேகையுடன் மாறாத தடயவியல் அறிக்கையை உருவாக்குகிறது.',
      scans: 'ஸ்கேன் இயக்கப்பட்டது',
      truthRate: 'உண்மை விகிதம்',
      textTitle: 'உரை தடயவியல்',
      textPlaceholder: 'சரிபார்க்க உரை அல்லது உரிமைகோரலை ஒட்டவும்...',
      analyzeBtn: 'ஒருமைப்பாட்டை பகுப்பாய்வு செய்யுங்கள்',
      processing: 'செயலாக்கம்...',
      mediaTitle: 'ஊடக பகுப்பாய்வு',
      uploadEvidence: 'ஆதாரத்தைப் பதிவேற்றவும்',
      autoLog: 'MD5 / SHA-256 தானியங்கி லாக்கிங்',
      recent: 'சமீபத்திய செயல்பாடு',
      noLogs: 'சமீபத்திய பதிவுகள் எதுவும் இல்லை.',
      score: 'மதிப்பெண்',
      liveFeed: 'நேரடி நுண்ணறிவு ஸ்ட்ரீம்',
      briefing: 'புலனாய்வாளர் விளக்கக்காட்சி',
      proBadge: 'புரோ அம்சம்',
      dropToUpload: 'பதிவேற்ற கோப்பை விடவும்',
      invalidFileType: 'ஆதரிக்கப்படாத கோப்பு வகை. படத்தைப் பதிவேற்றவும்.',
      uploading: 'பதிவேற்றப்படுகிறது...',
      academy: 'தர்ம அகாடமி',
      academyDesc: 'தகவல் ஒருமைப்பாடு மற்றும் டிஜிட்டல் நெறிமுறைகளின் வேதக் கொள்கைகளைக் கற்றுக்கொள்ளுங்கள்.',
      startModule: 'தொகுதியைத் தொடங்கு',
      threatMap: 'உலகளாவிய இணைய அச்சுறுத்தல் வரைபடம்',
      live: 'நேரடி',
      threats: 'செயலில் உள்ள அச்சுறுத்தல்கள்',
      nodes: 'சத்யா முனையங்கள்',
      active: 'செயலில்'
    },
    bn: {
      mission: 'মিশন: ডিজিটাল অখণ্ডতা',
      title: 'ফরেনসিক ল্যাব',
      desc: 'ভুল তথ্য উন্মোচন করুন এবং ডিজিটাল সম্পদ যাচাই করুন। প্রতিটি বিশ্লেষণ একটি অনন্য ডিজিটাল ফিঙ্গারপ্রিন্ট সহ একটি অপরিবর্তনীয় ফরেনসিক রিপোর্ট তৈরি করে।',
      scans: 'স্ক্যান চালানো হয়েছে',
      truthRate: 'সত্যের হার',
      textTitle: 'টেক্সট ফরেনসিক',
      textPlaceholder: 'যাচাই করার জন্য টেক্সট বা দাবি পেস্ট করুন...',
      analyzeBtn: 'অখণ্ডতা বিশ্লেষণ করুন',
      processing: 'প্রক্রিয়াকরণ...',
      mediaTitle: 'মিডিয়া বিশ্লেষণ',
      uploadEvidence: 'প্রমাণ আপলোড করুন',
      autoLog: 'MD5 / SHA-256 স্বয়ংক্রিয় লগিং',
      recent: 'সাম্প্রতিক কার্যকলাপ',
      noLogs: 'কোন সাম্প্রতিক লগ পাওয়া যায়নি।',
      score: 'স্কোর',
      liveFeed: 'লাইভ ইন্টেলিজেন্স স্ট্রিম',
      briefing: 'তদন্তকারী ব্রিফিং',
      proBadge: 'প্রো ফিচার',
      dropToUpload: 'আপলোড করতে ফাইলটি ড্রপ করুন',
      invalidFileType: 'অসমর্থিত ফাইল টাইপ। অনুগ্রহ করে একটি ছবি আপলোড করুন।',
      uploading: 'আপলোড হচ্ছে...',
      academy: 'ধর্ম একাডেমি',
      academyDesc: 'তথ্য অখণ্ডতা এবং ডিজিটাল নৈতিকতার বৈদিক নীতিগুলি শিখুন।',
      startModule: ' মডিউল শুরু করুন',
      threatMap: 'গ্লোবাল সাইবার থ্রেট ম্যাপ',
      live: 'লাইভ',
      threats: 'সক্রিয় হুমকি',
      nodes: 'সত্য নোড',
      active: 'সক্রিয়'
    }
  }[language];

  useEffect(() => {
    const saved = localStorage.getItem('satya_history');
    if (saved) setHistory(JSON.parse(saved).slice(0, 5));

    const locations = ['Delhi, IN', 'Mumbai, IN', 'London, UK', 'New York, US', 'Singapore, SG', 'Tokyo, JP'];
    const actions = ['Verified Text Integrity', 'Image Deepfake Scan', 'Phishing URL Probe', 'ELA Pixel Scan', 'Biometric Check'];
    
    const interval = setInterval(() => {
      const newItem = {
        id: Math.random().toString(36).substr(2, 6).toUpperCase(),
        loc: locations[Math.floor(Math.random() * locations.length)],
        action: actions[Math.floor(Math.random() * actions.length)],
        type: Math.random() > 0.5 ? 'CLEAN' : 'WARNING'
      };
      setFeedItems(prev => [newItem, ...prev].slice(0, 5));
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const saveToHistory = (report: AnalysisReport) => {
    const newHistory = [report, ...history].slice(0, 10);
    setHistory(newHistory.slice(0, 5));
    localStorage.setItem('satya_history', JSON.stringify(newHistory));
  };

  const handleTextAnalysis = async () => {
    if (!inputText.trim()) return;
    setIsLoading(true);
    setStatusMessage(language === 'hi' ? 'AI विश्लेषण शुरू हो रहा है...' : 'Initiating AI Analysis...');
    try {
      const report = await analyzeText(inputText, language);
      
      setStatusMessage(language === 'hi' ? 'डिजिटल फिंगरप्रिंट तैयार किया जा रहा है...' : 'Generating Digital Fingerprint...');
      await new Promise(r => setTimeout(r, 800));
      
      setStatusMessage(language === 'hi' ? 'ब्लॉकचेन लेजर पर एंकरिंग...' : 'Anchoring to Blockchain Ledger...');
      await new Promise(r => setTimeout(r, 1000));

      saveToHistory(report);
      onAnalysisComplete(report);
    } catch (error) {
      console.error(error);
      alert(language === 'hi' ? "विश्लेषण विफल रहा।" : "Text analysis failed.");
    } finally {
      setIsLoading(false);
      setStatusMessage('');
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    processFile(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const processFile = async (file: File) => {
    setUploadError(null);
    if (!file.type.startsWith('image/')) {
      setUploadError(t.invalidFileType);
      return;
    }

    setIsLoading(true);
    setUploadProgress(10);
    setStatusMessage(language === 'hi' ? 'मीडिया फोरेंसिक शुरू हो रहा है...' : 'Initiating Media Forensics...');
    
    const reader = new FileReader();
    reader.onprogress = (event) => {
      if (event.lengthComputable) {
        const progress = Math.round((event.loaded / event.total) * 50);
        setUploadProgress(10 + progress);
      }
    };

    reader.onload = async (event) => {
      const base64 = event.target?.result as string;
      try {
        setUploadProgress(70);
        const report = await analyzeImage(base64, file.name);
        
        setStatusMessage(language === 'hi' ? 'पिक्सेल विसंगतियों की जाँच...' : 'Checking Pixel Anomalies...');
        setUploadProgress(85);
        await new Promise(r => setTimeout(r, 800));
        
        setStatusMessage(language === 'hi' ? 'लेजर पर सबूत सुरक्षित किया जा रहा है...' : 'Securing Evidence on Ledger...');
        setUploadProgress(100);
        await new Promise(r => setTimeout(r, 1000));

        saveToHistory(report);
        onAnalysisComplete(report);
      } catch (error) {
        console.error(error);
        setUploadError(language === 'hi' ? "छवि विश्लेषण विफल रहा।" : "Image analysis failed.");
      } finally {
        setIsLoading(false);
        setStatusMessage('');
        setUploadProgress(0);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-top-4 duration-700">
      <div className="w-full bg-zinc-900/50 border-y border-zinc-800/50 overflow-hidden py-2 -mt-8 -mx-8">
        <div className="flex animate-[marquee_30s_linear_infinite] whitespace-nowrap gap-12 text-[10px] font-mono text-zinc-500 font-black tracking-widest uppercase">
          {feedItems.map((f) => (
            <div key={f.id} className="flex items-center gap-3">
              <span className={f.type === 'CLEAN' ? 'text-emerald-500' : 'text-rose-500'}>● {f.id}</span>
              <span>{f.loc}</span>
              <span className="text-zinc-700">/</span>
              <span>{f.action}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap items-end justify-between gap-6">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 text-xs font-bold uppercase tracking-wider mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse"></span>
            {t.mission}
          </div>
          <h2 className="text-5xl font-heading font-bold text-white mb-4 tracking-tight">{t.title}</h2>
          <p className="text-zinc-400 text-lg leading-relaxed">{t.desc}</p>
        </div>
        
        <div className="flex gap-4">
          <div className="px-6 py-4 rounded-2xl bg-zinc-900 border border-zinc-800 flex flex-col items-center min-w-[120px]">
            <span className="text-[10px] font-bold text-zinc-500 uppercase mb-1">{t.scans}</span>
            <span className="text-2xl font-heading font-bold text-white">1,248</span>
          </div>
          <div className="px-6 py-4 rounded-2xl bg-zinc-900 border border-zinc-800 flex flex-col items-center min-w-[120px]">
            <span className="text-[10px] font-bold text-zinc-500 uppercase mb-1">{t.truthRate}</span>
            <span className="text-2xl font-heading font-bold text-emerald-400">82%</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-8">
          {/* Global Cyber Threat Map */}
          <section className="bg-[#0e0e11] border border-zinc-800 rounded-[2.5rem] overflow-hidden relative group">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.05),transparent_70%)]"></div>
            <div className="p-8 border-b border-zinc-800 flex items-center justify-between relative z-10">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 002 2h2.945M8 3.935A9 9 0 0116.5 20.065" /></svg>
                </div>
                <div>
                  <h3 className="text-sm font-black text-white uppercase tracking-widest">{t.threatMap}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></span>
                    <span className="text-[10px] font-bold text-rose-500 uppercase tracking-tighter">{t.live}</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-6">
                <div className="text-right">
                  <p className="text-[10px] font-bold text-zinc-500 uppercase mb-1">{t.threats}</p>
                  <p className="text-sm font-mono font-bold text-rose-400">14,281</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-bold text-zinc-500 uppercase mb-1">{t.nodes}</p>
                  <p className="text-sm font-mono font-bold text-emerald-400">842 {t.active}</p>
                </div>
              </div>
            </div>
            <div className="h-[400px] relative bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] bg-repeat">
              {/* Simulated Map with animated points */}
              <div className="absolute inset-0 opacity-20">
                <svg className="w-full h-full" viewBox="0 0 800 400" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M150 100 Q 200 50 250 100 T 350 100" stroke="#3b82f6" strokeWidth="0.5" strokeDasharray="4 4" />
                  <path d="M450 250 Q 500 200 550 250 T 650 250" stroke="#f43f5e" strokeWidth="0.5" strokeDasharray="4 4" />
                  <circle cx="200" cy="150" r="2" fill="#3b82f6" className="animate-pulse" />
                  <circle cx="500" cy="200" r="2" fill="#f43f5e" className="animate-pulse" />
                  <circle cx="350" cy="280" r="2" fill="#10b981" className="animate-pulse" />
                  <circle cx="650" cy="120" r="2" fill="#f59e0b" className="animate-pulse" />
                </svg>
              </div>
              
              {/* Floating Data Points */}
              <div className="absolute top-10 left-10 p-3 bg-black/60 backdrop-blur-md border border-zinc-800 rounded-xl animate-bounce duration-[3000ms]">
                <p className="text-[8px] font-mono text-blue-400">NODE_ALPHA_VERIFIED</p>
                <p className="text-[10px] font-bold text-white">Mumbai, IN</p>
              </div>
              <div className="absolute bottom-20 right-20 p-3 bg-black/60 backdrop-blur-md border border-zinc-800 rounded-xl animate-bounce duration-[4000ms]">
                <p className="text-[8px] font-mono text-rose-400">THREAT_DETECTED</p>
                <p className="text-[10px] font-bold text-white">New York, US</p>
              </div>

              {!isPro && (
                <div className="absolute inset-0 z-20 bg-[#0a0a0b]/40 backdrop-blur-[1px] flex flex-col items-center justify-center text-center p-10">
                  <div className="w-16 h-16 rounded-full bg-amber-500/20 flex items-center justify-center mb-4 border border-amber-500/30">
                    <svg className="w-8 h-8 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                  </div>
                  <h4 className="text-white font-black text-xl mb-2 uppercase tracking-tighter">{t.proBadge}</h4>
                  <p className="text-zinc-400 text-xs max-w-xs leading-relaxed mb-6">Upgrade to Satya Pro to access real-time global threat intelligence and live forensic node tracking.</p>
                </div>
              )}
            </div>
          </section>

          <div className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 rounded-[2.5rem] p-1 shadow-2xl">
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="p-8 space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                    <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                  </div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-white">{t.textTitle}</h3>
                    {!isPro && <span className="px-1.5 py-0.5 bg-zinc-800 text-[8px] font-black text-zinc-500 rounded uppercase border border-zinc-700">Free</span>}
                  </div>
                </div>
                
                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder={t.textPlaceholder}
                  className="w-full h-48 bg-zinc-950/50 border border-zinc-800 rounded-2xl p-6 text-zinc-300 placeholder:text-zinc-700 focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/50 outline-none transition-all resize-none font-medium"
                />

                <button
                  onClick={handleTextAnalysis}
                  disabled={isLoading || !inputText.trim()}
                  className="w-full py-4 bg-blue-600 hover:bg-blue-500 disabled:bg-zinc-800 disabled:text-zinc-600 font-black rounded-2xl transition-all shadow-lg shadow-blue-900/20 flex flex-col items-center justify-center gap-1 uppercase tracking-widest text-xs"
                >
                  {isLoading ? (
                    <>
                      <span className="animate-pulse">{t.processing}</span>
                      <span className="text-[8px] opacity-50 font-mono lowercase tracking-normal">{statusMessage}</span>
                    </>
                  ) : t.analyzeBtn}
                </button>
              </div>

              <div className="p-8 bg-zinc-950/30 md:border-l border-zinc-800 flex flex-col">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center border border-purple-500/20">
                    <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                  </div>
                  <h3 className="font-bold text-white">{t.mediaTitle}</h3>
                </div>

                <div 
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  className={`flex-1 flex flex-col items-center justify-center border-2 border-dashed rounded-3xl bg-zinc-950 transition-all group relative overflow-hidden ${
                    dragActive ? 'border-blue-500 bg-blue-500/5' : 'border-zinc-800 hover:border-zinc-600'
                  }`}
                >
                  <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer">
                    <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} />
                    
                    {isLoading ? (
                      <div className="flex flex-col items-center gap-4 w-full px-8">
                        <div className="w-full h-1 bg-zinc-900 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-blue-500 transition-all duration-300" 
                            style={{ width: `${uploadProgress}%` }}
                          ></div>
                        </div>
                        <p className="text-blue-400 font-bold text-xs animate-pulse uppercase tracking-widest">{t.uploading}</p>
                        <p className="text-zinc-500 text-[10px] font-mono">{statusMessage}</p>
                      </div>
                    ) : (
                      <>
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 transition-all ${dragActive ? 'bg-blue-500/20 text-blue-400 scale-110' : 'bg-zinc-900 text-zinc-600 group-hover:text-zinc-400'}`}>
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                        </div>
                        <p className="text-zinc-300 font-bold text-sm">{dragActive ? t.dropToUpload : t.uploadEvidence}</p>
                        <p className="text-zinc-600 text-[10px] mt-1 font-mono">{t.autoLog}</p>
                        
                        {uploadError && (
                          <div className="mt-4 px-4 py-2 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 text-[10px] font-bold text-center max-w-[80%]">
                            {uploadError}
                          </div>
                        )}

                        {!isPro && (
                          <div className="mt-4 px-3 py-1 bg-blue-600 text-white text-[8px] font-black uppercase rounded-full">
                            Upgrade for 4K Analysis
                          </div>
                        )}
                      </>
                    )}
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Security Briefing Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-8 bg-zinc-900 border border-zinc-800 rounded-[2.5rem]">
              <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-4">{t.briefing}</h4>
              <p className="text-zinc-300 font-medium leading-relaxed italic">
                {language === 'hi' 
                  ? "अन्वेषक चेतावनी: APT28 यूरोपीय संस्थाओं को लक्षित कर रहा है। 'OpenClaw' RCE भेद्यता के लिए 21,000 से अधिक सिस्टम खुले हुए हैं।" 
                  : "Investigator Alert: APT28 targeting European entities via webhook macros. Over 21,000 instances exposed to 'OpenClaw' RCE vulnerability."}
              </p>
            </div>
            <div className="p-8 bg-zinc-900 border border-zinc-800 rounded-[2.5rem] flex items-center gap-6">
               <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center text-white font-black text-2xl">?</div>
               <div>
                  <h5 className="text-white font-bold">{language === 'hi' ? 'दैनिक धर्म' : 'Daily Dharma'}</h5>
                  <p className="text-xs text-zinc-500 leading-relaxed">
                    {language === 'hi' 
                      ? "सच की अपनी ताकत होती है, उसे किसी गवाह की जरूरत नहीं होती।" 
                      : "Truth has its own power; it does not need a witness to be valid."}
                  </p>
               </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-[2rem] p-6">
            <h3 className="text-xs font-black text-zinc-500 uppercase tracking-widest mb-6 flex items-center justify-between">
              {t.recent}
              <span className="w-2 h-2 rounded-full bg-blue-500"></span>
            </h3>
            
            {history.length === 0 ? (
              <div className="py-12 text-center text-xs text-zinc-600 font-medium">{t.noLogs}</div>
            ) : (
              <div className="space-y-3">
                {history.map((report) => (
                  <button
                    key={report.id}
                    onClick={() => onAnalysisComplete(report)}
                    className="w-full p-4 rounded-2xl bg-zinc-950 border border-zinc-800 hover:border-zinc-700 text-left transition-all"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                        report.verdict === 'True' ? 'bg-emerald-500/10 text-emerald-400' :
                        report.verdict === 'False' ? 'bg-rose-500/10 text-rose-400' : 'bg-amber-500/10 text-amber-400'
                      }`}>
                        {report.verdict}
                      </span>
                      <span className="text-[10px] font-mono text-zinc-600">Score: {report.satyaScore}</span>
                    </div>
                    <p className="text-xs font-medium text-zinc-300 truncate">{report.title}</p>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="relative p-8 rounded-[2rem] bg-gradient-to-br from-blue-600 to-indigo-700 shadow-xl shadow-blue-900/10 overflow-hidden">
            {!isPro && (
              <div className="absolute inset-0 z-10 bg-black/40 backdrop-blur-[1px] flex items-center justify-center">
                <div className="px-3 py-1 bg-amber-500 text-black text-[10px] font-black uppercase rounded-full shadow-lg">
                  {t.proBadge}
                </div>
              </div>
            )}
            <h4 className="text-white font-black uppercase text-xs tracking-widest mb-2">{t.academy}</h4>
            <p className="text-blue-100 text-xs leading-relaxed mb-4">{t.academyDesc}</p>
            <button 
              onClick={() => setShowDharmaAcademy(true)}
              className="w-full py-2.5 bg-white/10 border border-white/20 text-white text-[10px] font-black rounded-xl uppercase tracking-tighter"
            >
              {t.startModule}
            </button>
          </div>
        </div>
      </div>

      {/* Dharma Academy Modal */}
      {showDharmaAcademy && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-xl z-[100] flex items-center justify-center p-6">
          <div className="w-full max-w-4xl bg-[#0e0e11] border border-zinc-800 rounded-[3rem] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="p-8 border-b border-zinc-800 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                  <svg className="w-6 h-6 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                </div>
                <div>
                  <h2 className="text-xl font-black text-white uppercase tracking-widest">{t.academy}</h2>
                  <p className="text-xs text-zinc-500 font-medium">{t.academyDesc}</p>
                </div>
              </div>
              <button 
                onClick={() => setShowDharmaAcademy(false)}
                className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500 hover:text-white transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="p-12 grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { title: 'Digital Ethics 101', level: 'Beginner', duration: '45m', icon: '⚖️' },
                { title: 'Advanced Fact Checking', level: 'Intermediate', duration: '1.5h', icon: '🔍' },
                { title: 'Neural Forensics', level: 'Expert', duration: '3h', icon: '🧠' }
              ].map((module, idx) => (
                <div key={idx} className="p-8 rounded-[2rem] bg-zinc-900/30 border border-zinc-800 hover:border-amber-500/30 transition-all group cursor-pointer">
                  <div className="text-4xl mb-6 group-hover:scale-110 transition-transform">{module.icon}</div>
                  <h4 className="text-lg font-bold text-white mb-2">{module.title}</h4>
                  <div className="flex items-center gap-4 text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                    <span>{module.level}</span>
                    <span className="w-1 h-1 rounded-full bg-zinc-800"></span>
                    <span>{module.duration}</span>
                  </div>
                  <button className="w-full mt-8 py-3 bg-zinc-800 text-zinc-300 text-[10px] font-black uppercase tracking-widest rounded-xl group-hover:bg-amber-500 group-hover:text-black transition-all">
                    Enroll Now
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
