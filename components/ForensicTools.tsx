
import React, { useState, useRef, useEffect } from 'react';
import { liveFrameAnalysis, analyzeELA, analyzeEmailHeader, analyzeURL, analyzeVideo } from '../services/geminiService';
import { Language } from '../App';
import { toast } from 'sonner';
import { 
  Shield, 
  Search, 
  Mail, 
  Image as ImageIcon, 
  Video, 
  Camera, 
  CameraOff, 
  AlertTriangle, 
  CheckCircle2, 
  Fingerprint,
  Globe,
  Zap
} from 'lucide-react';

interface ForensicToolsProps {
  language: Language;
  isPro: boolean;
}

export const ForensicTools: React.FC<ForensicToolsProps> = ({ language, isPro }) => {
  const [url, setUrl] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [urlDragging, setUrlDragging] = useState(false);
  
  // Camera State
  const [cameraActive, setCameraActive] = useState(false);
  const [scanResult, setScanResult] = useState<any>(null);
  const [isScanning, setIsScanning] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // ELA State
  const [elaFile, setElaFile] = useState<string | null>(null);
  const [elaAnalyzing, setElaAnalyzing] = useState(false);
  const [elaResult, setElaResult] = useState<any>(null);

  // Email State
  const [emailHeader, setEmailHeader] = useState('');
  const [emailAnalyzing, setEmailAnalyzing] = useState(false);
  const [emailResult, setEmailResult] = useState<any>(null);

  // Video State
  const [videoFile, setVideoFile] = useState<string | null>(null);
  const [videoAnalyzing, setVideoAnalyzing] = useState(false);
  const [videoResult, setVideoResult] = useState<any>(null);

  const t = {
    en: {
      proBadge: 'PRO FEATURE',
      upgradeMsg: 'Upgrade to Pro to unlock this forensic module.',
      toolbox: 'Forensic Toolbox',
      expert: 'Expert Modules',
      desc: 'Advanced specialized utilities for investigators. Every tool follows standard forensic protocols for data handling and integrity.',
      urlTitle: 'URL Integrity Scan',
      urlDesc: 'Domain reputation & phishing heuristics',
      neuralTitle: 'Neural Artifact Scanner',
      neuralDesc: 'Live biometric & deepfake artifact detection',
      elaTitle: 'Error Level Analysis (ELA)',
      elaDesc: 'Identify image compression inconsistencies',
      emailTitle: 'Email Header Forensics',
      emailDesc: 'Analyze SPF/DKIM/DMARC spoofing',
      btnPhish: 'Initiate Domain Probe',
      btnPhishActive: 'Executing Scan...',
      risk: 'Risk',
      threat: 'Threat Detected',
      clean: 'Clean Report',
      activateCam: 'Activate Camera',
      stopCam: 'Stop Scanner',
      analyzingFrame: 'Analyzing Frame...',
      uploadEla: 'Upload Image for ELA',
      runEla: 'Run Forensic Analysis',
      findings: 'Forensic Findings',
      runEmail: 'Analyze Protocol Security',
      placeholderEmail: 'Paste raw email headers here...',
      deepfakeTitle: 'Deepfake Video Detection',
      deepfakeDesc: 'Scan video for AI neural artifacts & temporal glitches',
      uploadVideo: 'Upload Video for Deepfake Scan',
      runVideo: 'Initiate Deepfake Probe',
      videoAnalyzing: 'Analyzing Neural Layers...',
      confidence: 'Confidence',
      isDeepfake: 'Deepfake Detected',
      integrityVerified: 'Temporal Integrity Verified'
    },
    hi: {
      proBadge: 'प्रो फीचर',
      upgradeMsg: 'इस फोरेंसिक मॉड्यूल को अनलॉक करने के लिए प्रो में अपग्रेड करें।',
      toolbox: 'फोरेंसिक टूलबॉक्स',
      expert: 'विशेषज्ञ मॉड्यूल',
      desc: 'अन्वेषकों के लिए उन्नत विशेष उपयोगिताएँ। प्रत्येक उपकरण डेटा हैंडलिंग और अखंडता के लिए मानक फोरेंसिक प्रोटोकॉल का पालन करता है।',
      urlTitle: 'URL अखंडता स्कैन',
      urlDesc: 'डोमेन प्रतिष्ठा और फ़िशिंग अनुमान',
      neuralTitle: 'न्यूरल आर्टिफैक्ट स्कैनर',
      neuralDesc: 'लाइव बायोमेट्रिक और डीपफेक आर्टिफैक्ट पहचान',
      elaTitle: 'त्रुटि स्तर विश्लेषण (ELA)',
      elaDesc: 'छवि संपीड़न विसंगतियों की पहचान करें',
      emailTitle: 'ईमेल हेडर फोरेंसिक',
      emailDesc: 'SPF/DKIM/DMARC स्पूफिंग का विश्लेषण करें',
      btnPhish: 'डोमेन जांच शुरू करें',
      btnPhishActive: 'स्कैन निष्पादित हो रहा है...',
      risk: 'जोखिम',
      threat: 'खतरे का पता चला',
      clean: 'स्वच्छ रिपोर्ट',
      activateCam: 'कैमरा सक्रिय करें',
      stopCam: 'स्कैनर रोकें',
      analyzingFrame: 'फ़्रेम का विश्लेषण...',
      uploadEla: 'ELA के लिए छवि अपलोड करें',
      runEla: 'फोरेंसिक विश्लेषण चलाएं',
      findings: 'फोरेंसिक निष्कर्ष',
      runEmail: 'प्रोटोकॉल सुरक्षा विश्लेषण',
      placeholderEmail: 'कच्चे ईमेल हेडर यहां पेस्ट करें...',
      deepfakeTitle: 'डीपफेक वीडियो पहचान',
      deepfakeDesc: 'AI न्यूरल आर्टिफैक्ट्स और टेम्पोरल ग्लिच के लिए वीडियो स्कैन करें',
      uploadVideo: 'डीपफेक स्कैन के लिए वीडियो अपलोड करें',
      runVideo: 'डीपफेक जांच शुरू करें',
      videoAnalyzing: 'न्यूरल परतों का विश्लेषण...',
      confidence: 'आत्मविश्वास',
      isDeepfake: 'डीपफेक का पता चला',
      integrityVerified: 'टेम्पोरल अखंडता सत्यापित'
    },
    mr: {
      proBadge: 'प्रो फीचर',
      upgradeMsg: 'हे फॉरेन्सिक मॉड्यूल अनलॉक करण्यासाठी प्रो मध्ये अपग्रेड करा.',
      toolbox: 'फॉरेन्सिक टूलबॉक्स',
      expert: 'तज्ञ मॉड्यूल',
      desc: 'अन्वेषकांसाठी प्रगत विशेष उपयुक्तता. प्रत्येक साधन डेटा हाताळणी आणि अखंडतेसाठी मानक फॉरेन्सिक प्रोटोकॉलचे पालन करते.',
      urlTitle: 'URL अखंडता स्कॅन',
      urlDesc: 'डोमेन प्रतिष्ठा आणि फिशिंग ह्युरीस्टिक्स',
      neuralTitle: 'न्यूरल आर्टिफॅक्ट स्कॅनर',
      neuralDesc: 'लाइव्ह बायोमेट्रिक आणि डीपफेक आर्टिफॅक्ट शोध',
      elaTitle: 'एरर लेव्हल ॲनालिसिस (ELA)',
      elaDesc: 'इमेज कॉम्प्रेशन विसंगती ओळखा',
      emailTitle: 'ईमेल हेडर फॉरेन्सिक',
      emailDesc: 'SPF/DKIM/DMARC स्पूफिंगचे विश्लेषण करा',
      btnPhish: 'डोमेन प्रोब सुरू करा',
      btnPhishActive: 'स्कॅन कार्यान्वित होत आहे...',
      risk: 'जोखिम',
      threat: 'धोका आढळला',
      clean: 'स्वच्छ अहवाल',
      activateCam: 'कॅमेरा सक्रिय करा',
      stopCam: 'स्कॅनर थांबवा',
      analyzingFrame: 'फ्रेमचे विश्लेषण करत आहे...',
      uploadEla: 'ELA साठी प्रतिमा अपलोड करा',
      runEla: 'फॉरेन्सिक विश्लेषण चालवा',
      findings: 'फॉरेन्सिक निष्कर्ष',
      runEmail: 'प्रोटोकॉल सुरक्षा विश्लेषण',
      placeholderEmail: 'रॉ ईमेल हेडर्स येथे पेस्ट करा...',
      deepfakeTitle: 'डीपफेक व्हिडिओ शोध',
      deepfakeDesc: 'AI न्यूरल आर्टिफॅक्ट्स आणि टेम्पोरल ग्लिचसाठी व्हिडिओ स्कॅन करा',
      uploadVideo: 'डीपफेक स्कॅनसाठी व्हिडिओ अपलोड करा',
      runVideo: 'डीपफेक प्रोब सुरू करा',
      videoAnalyzing: 'न्यूरल लेयर्सचे विश्लेषण करत आहे...',
      confidence: 'आत्मविश्वास',
      isDeepfake: 'डीपफेक आढळले',
      integrityVerified: 'टेम्पोरल अखंडता सत्यापित'
    },
    ta: {
      proBadge: 'புரோ அம்சம்',
      upgradeMsg: 'இந்த தடயவியல் தொகுதியைத் திறக்க புரோவுக்கு மேம்படுத்தவும்.',
      toolbox: 'தடயவியல் கருவிப்பெட்டி',
      expert: 'நிபுணர் தொகுதிகள்',
      desc: 'புலனாய்வாளர்களுக்கான மேம்பட்ட சிறப்பு பயன்பாடுகள். ஒவ்வொரு கருவியும் தரவு கையாளுதல் மற்றும் ஒருமைப்பாட்டிற்கான நிலையான தடயவியல் நெறிமுறைகளைப் பின்பற்றுகிறது.',
      urlTitle: 'URL ஒருமைப்பாடு ஸ்கேன்',
      urlDesc: 'டொமைன் நற்பெயர் & ஃபிஷிங் ஹூரிஸ்டிக்ஸ்',
      neuralTitle: 'நியூரல் ஆர்டிஃபாக்ட் ஸ்கேனர்',
      neuralDesc: 'நேரடி பயோமெட்ரிக் & டீப்ஃபேக் ஆர்டிஃபாக்ட் கண்டறிதல்',
      elaTitle: 'பிழை நிலை பகுப்பாய்வு (ELA)',
      elaDesc: 'பட சுருக்க முரண்பாடுகளை அடையாளம் காணவும்',
      emailTitle: 'மின்னஞ்சல் தலைப்பு தடயவியல்',
      emailDesc: 'SPF/DKIM/DMARC ஸ்பூஃபிங்கை பகுப்பாய்வு செய்யுங்கள்',
      btnPhish: 'டொமைன் ஆய்வைத் தொடங்கவும்',
      btnPhishActive: 'ஸ்கேன் செய்யப்படுகிறது...',
      risk: 'ஆபத்து',
      threat: 'அச்சுறுத்தல் கண்டறியப்பட்டது',
      clean: 'சுத்தமான அறிக்கை',
      activateCam: 'கேமராவை இயக்கு',
      stopCam: 'ஸ்கேனரை நிறுத்து',
      analyzingFrame: 'பிரேம் பகுப்பாய்வு செய்யப்படுகிறது...',
      uploadEla: 'ELA க்கான படத்தைப் பதிவேற்றவும்',
      runEla: 'தடயவியல் பகுப்பாய்வை இயக்கவும்',
      findings: 'தடயவியல் கண்டுபிடிப்புகள்',
      runEmail: 'நெறிமுறை பாதுகாப்பு பகுப்பாய்வு',
      placeholderEmail: 'மூல மின்னஞ்சல் தலைப்புகளை இங்கே ஒட்டவும்...',
      deepfakeTitle: 'டீப்ஃபேக் வீடியோ கண்டறிதல்',
      deepfakeDesc: 'AI நரம்பியல் கலைப்பொருட்கள் மற்றும் தற்காலிக குறைபாடுகளுக்கு வீடியோவை ஸ்கேன் செய்யவும்',
      uploadVideo: 'டீப்ஃபேக் ஸ்கேனிற்கு வீடியோவைப் பதிவேற்றவும்',
      runVideo: 'டீப்ஃபேக் ஆய்வைத் தொடங்கவும்',
      videoAnalyzing: 'நரம்பியல் அடுக்குகளை பகுப்பாய்வு செய்கிறது...',
      confidence: 'நம்பிக்கை',
      isDeepfake: 'டீப்ஃபேக் கண்டறியப்பட்டது',
      integrityVerified: 'தற்காலிக ஒருமைப்பாடு சரிபார்க்கப்பட்டது'
    },
    bn: {
      proBadge: 'প্রো ফিচার',
      upgradeMsg: 'এই ফরেনসিক মডিউলটি আনলক করতে প্রো-তে আপগ্রেড করুন।',
      toolbox: 'ফরেনসিক টুলবক্স',
      expert: 'বিশেষজ্ঞ মডিউল',
      desc: 'তদন্তকারীদের জন্য উন্নত বিশেষ ইউটিলিটি। প্রতিটি টুল ডেটা হ্যান্ডলিং এবং অখণ্ডতার জন্য স্ট্যান্ডার্ড ফরেনসিক প্রোটোকল অনুসরণ করে।',
      urlTitle: 'URL অখণ্ডতা স্ক্যান',
      urlDesc: 'ডোমেইন খ্যাতি এবং ফিশিং হিউরিস্টিকস',
      neuralTitle: 'নিউরাল আর্টিফ্যাক্ট স্ক্যানার',
      neuralDesc: 'লাইভ বায়োমেট্রিক এবং ডিপফেক আর্টিফ্যাক্ট সনাক্তকরণ',
      elaTitle: 'ত্রুটি স্তর বিশ্লেষণ (ELA)',
      elaDesc: 'ইমেজ কমপ্রেশন অসঙ্গতি সনাক্ত করুন',
      emailTitle: 'ইমেল হেডার ফরেনসিক',
      emailDesc: 'SPF/DKIM/DMARC স্পুফিং বিশ্লেষণ করুন',
      btnPhish: 'ডোমেইন প্রোব শুরু করুন',
      btnPhishActive: 'স্ক্যান চালানো হচ্ছে...',
      risk: 'ঝুঁকি',
      threat: 'হুমকি সনাক্ত করা হয়েছে',
      clean: 'ক্লিন রিপোর্ট',
      activateCam: 'ক্যামেরা সক্রিয় করুন',
      stopCam: 'স্ক্যানার বন্ধ করুন',
      analyzingFrame: 'ফ্রেম বিশ্লেষণ করা হচ্ছে...',
      uploadEla: 'ELA-এর জন্য ছবি আপলোড করুন',
      runEla: 'ফরেনসিক বিশ্লেষণ চালান',
      findings: 'ফরেনসিক ফলাফল',
      runEmail: 'প্রোটোকল নিরাপত্তা বিশ্লেষণ',
      placeholderEmail: 'এখানে র ইমেল হেডার পেস্ট করুন...',
      deepfakeTitle: 'ডিপফেক ভিডিও সনাক্তকরণ',
      deepfakeDesc: 'AI নিউরাল আর্টিফ্যাক্ট এবং টেম্পোরাল গ্লিচের জন্য ভিডিও স্ক্যান করুন',
      uploadVideo: 'ডিপফেক স্ক্যানের জন্য ভিডিও আপলোড করুন',
      runVideo: 'ডিপফেক প্রোব শুরু করুন',
      videoAnalyzing: 'নিউরাল লেয়ার বিশ্লেষণ করা হচ্ছে...',
      confidence: 'আত্মবিশ্বাস',
      isDeepfake: 'ডিপফেক সনাক্ত করা হয়েছে',
      integrityVerified: 'টেম্পোরাল অখণ্ডতা যাচাইকৃত'
    }
  }[language];

  const handleEmailAnalysis = async () => {
    if (!emailHeader.trim()) return;
    setEmailAnalyzing(true);
    try {
      const res = await analyzeEmailHeader(emailHeader);
      setEmailResult(res);
      toast.success(language === 'hi' ? 'ईमेल विश्लेषण पूरा हुआ' : 'Email analysis complete');
    } catch (err) {
      toast.error(language === 'hi' ? 'ईमेल विश्लेषण विफल रहा' : 'Email analysis failed');
    } finally {
      setEmailAnalyzing(false);
    }
  };

  const handleElaUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => setElaFile(event.target?.result as string);
    reader.readAsDataURL(file);
  };

  const runElaAnalysis = async () => {
    if (!elaFile) return;
    setElaAnalyzing(true);
    try {
      const base64 = elaFile.split(',')[1];
      const res = await analyzeELA(base64);
      setElaResult(res);
      toast.success(language === 'hi' ? 'ELA विश्लेषण पूरा हुआ' : 'ELA analysis complete');
    } catch (err) {
      toast.error(language === 'hi' ? 'ELA विश्लेषण विफल रहा' : 'ELA Analysis failed');
    } finally {
      setElaAnalyzing(false);
    }
  };

  const toggleCamera = async () => {
    if (cameraActive) {
      const stream = videoRef.current?.srcObject as MediaStream;
      stream?.getTracks().forEach(track => track.stop());
      setCameraActive(false);
      setIsScanning(false);
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setCameraActive(true);
          toast.success(language === 'hi' ? 'कैमरा सक्रिय' : 'Camera activated');
        }
      } catch (err) {
        toast.error(language === 'hi' ? 'कैमरा एक्सेस अस्वीकार' : 'Camera access denied');
      }
    }
  };

  const captureAndAnalyze = async () => {
    if (!videoRef.current || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const video = videoRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d')?.drawImage(video, 0, 0);
    
    const base64 = canvas.toDataURL('image/jpeg', 0.8).split(',')[1];
    try {
      const res = await liveFrameAnalysis(base64);
      setScanResult(res);
    } catch (err) {
      console.error(err);
    }
  };

  const checkPhishing = async () => {
    if (!url) return;
    setAnalyzing(true);
    try {
      const res = await analyzeURL(url);
      setResult(res);
      toast.success(language === 'hi' ? 'URL विश्लेषण पूरा हुआ' : 'URL analysis complete');
    } catch (err) {
      toast.error(language === 'hi' ? 'URL विश्लेषण विफल रहा' : 'URL analysis failed');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleUrlDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setUrlDragging(true);
  };

  const handleUrlDragLeave = () => {
    setUrlDragging(false);
  };

  const handleUrlDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setUrlDragging(false);
    const droppedUrl = e.dataTransfer.getData('text/plain');
    if (droppedUrl) {
      setUrl(droppedUrl);
      toast.success(language === 'hi' ? 'URL प्राप्त हुआ' : 'URL received via drop');
    }
  };

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => setVideoFile(event.target?.result as string);
    reader.readAsDataURL(file);
  };

  const runVideoAnalysis = async () => {
    if (!videoFile) return;
    setVideoAnalyzing(true);
    try {
      const res = await analyzeVideo(videoFile, "forensic_video.mp4");
      setVideoResult(res);
      toast.success(language === 'hi' ? 'वीडियो विश्लेषण पूरा हुआ' : 'Video analysis complete');
    } catch (err) {
      toast.error(language === 'hi' ? 'वीडियो विश्लेषण विफल रहा' : 'Video analysis failed');
    } finally {
      setVideoAnalyzing(false);
    }
  };

  useEffect(() => {
    let interval: any;
    if (isScanning && cameraActive) {
      interval = setInterval(() => {
        captureAndAnalyze();
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [isScanning, cameraActive]);

  return (
    <div className="space-y-12 max-w-6xl mx-auto pb-20 animate-in fade-in duration-700">
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full text-amber-500 text-xs font-bold uppercase tracking-wider mb-4">
          {t.expert}
        </div>
        <h2 className="text-4xl font-heading font-bold text-white mb-3">{t.toolbox}</h2>
        <p className="text-zinc-500 text-lg max-w-2xl">{t.desc}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* URL Integrity Scan */}
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-[2.5rem] p-10 space-y-8 flex flex-col shadow-xl">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
              <Globe className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">{t.urlTitle}</h3>
              <p className="text-xs text-zinc-500 font-medium">{t.urlDesc}</p>
            </div>
          </div>
          
          <div 
            className={`relative space-y-4 transition-all duration-300 rounded-3xl ${urlDragging ? 'bg-blue-500/10 ring-2 ring-blue-500/50 p-4 -m-4' : ''}`}
            onDragOver={handleUrlDragOver}
            onDragLeave={handleUrlDragLeave}
            onDrop={handleUrlDrop}
          >
            {urlDragging && (
              <div className="absolute inset-0 z-20 flex items-center justify-center bg-blue-500/20 backdrop-blur-sm rounded-3xl pointer-events-none border-2 border-dashed border-blue-500/50">
                <div className="flex flex-col items-center gap-2">
                  <Globe className="w-8 h-8 text-blue-400 animate-bounce" />
                  <span className="text-xs font-black text-blue-400 uppercase tracking-widest">Drop URL to Scan</span>
                </div>
              </div>
            )}
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onPaste={() => toast.success(language === 'hi' ? 'URL पेस्ट किया गया' : 'URL pasted')}
              placeholder="https://example.com"
              className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl p-5 text-sm text-zinc-300 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
            />
            <button
              onClick={checkPhishing}
              disabled={analyzing || !url.trim()}
              className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-2xl transition-all uppercase tracking-widest text-xs disabled:opacity-50"
            >
              {analyzing ? t.btnPhishActive : t.btnPhish}
            </button>
          </div>

          {result && (
            <div className={`p-6 rounded-3xl bg-zinc-950 border ${result.isSuspicious ? 'border-rose-500/40' : 'border-emerald-500/40'}`}>
              <div className="flex justify-between items-center mb-4">
                <span className={`text-[10px] font-black uppercase tracking-widest ${result.isSuspicious ? 'text-rose-400' : 'text-emerald-400'}`}>
                  {result.isSuspicious ? t.threat : t.clean}
                </span>
                <span className="text-xs font-mono text-zinc-500">Risk: {result.risk}</span>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="p-3 bg-zinc-900 rounded-xl border border-zinc-800">
                  <p className="text-[10px] text-zinc-500 uppercase font-bold mb-1">Domain Age</p>
                  <p className="text-xs text-white font-mono">{result.metrics.domainAge}</p>
                </div>
                <div className="p-3 bg-zinc-900 rounded-xl border border-zinc-800">
                  <p className="text-[10px] text-zinc-500 uppercase font-bold mb-1">SSL Status</p>
                  <p className="text-xs text-white font-mono">{result.metrics.sslStatus}</p>
                </div>
              </div>
              <ul className="space-y-2">
                {result.findings.map((f: string, i: number) => (
                  <li key={i} className="text-[11px] text-zinc-400 flex gap-2">
                    <span className="text-blue-500">→</span> {f}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Email Forensics */}
        <div className="relative bg-zinc-900/50 border border-zinc-800 rounded-[2.5rem] p-10 space-y-8 flex flex-col shadow-xl overflow-hidden">
          {!isPro && (
            <div className="absolute inset-0 z-10 bg-[#0a0a0b]/60 backdrop-blur-[2px] flex flex-col items-center justify-center p-8 text-center">
              <div className="w-12 h-12 rounded-full bg-amber-500/20 flex items-center justify-center mb-4 border border-amber-500/30">
                <svg className="w-6 h-6 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
              </div>
              <p className="text-white font-bold text-sm mb-2">{t.proBadge}</p>
              <p className="text-zinc-400 text-xs max-w-[200px]">{t.upgradeMsg}</p>
            </div>
          )}
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
              <Mail className="w-6 h-6 text-emerald-500" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">{t.emailTitle}</h3>
              <p className="text-xs text-zinc-500 font-medium">{t.emailDesc}</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <textarea
              value={emailHeader}
              onChange={(e) => setEmailHeader(e.target.value)}
              placeholder={t.placeholderEmail}
              className="w-full h-32 bg-zinc-950 border border-zinc-800 rounded-2xl p-5 text-[10px] font-mono text-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 resize-none"
            />
            <button
              onClick={handleEmailAnalysis}
              disabled={emailAnalyzing || !emailHeader.trim()}
              className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-2xl transition-all uppercase tracking-widest text-xs disabled:opacity-50"
            >
              {emailAnalyzing ? 'PARSING PACKETS...' : t.runEmail}
            </button>
          </div>

          {emailResult && (
            <div className={`p-6 rounded-3xl bg-zinc-950 border ${emailResult.spoofingDetected ? 'border-rose-500/40' : 'border-emerald-500/40'}`}>
              <div className="flex justify-between items-center mb-4">
                <span className={`text-[10px] font-black uppercase tracking-widest ${emailResult.spoofingDetected ? 'text-rose-400' : 'text-emerald-400'}`}>
                  {emailResult.verdict}
                </span>
                <span className="text-xs font-mono text-zinc-500">Origin IP: {emailResult.originatingIP}</span>
              </div>
              <ul className="space-y-2">
                {emailResult.findings.map((f: string, i: number) => (
                  <li key={i} className="text-[11px] text-zinc-400 flex gap-2">
                    <span className="text-emerald-500">→</span> {f}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* ELA Forensic Module */}
        <div className="relative bg-zinc-900/50 border border-zinc-800 rounded-[2.5rem] p-10 space-y-8 flex flex-col shadow-xl overflow-hidden">
          {!isPro && (
            <div className="absolute inset-0 z-10 bg-[#0a0a0b]/60 backdrop-blur-[2px] flex flex-col items-center justify-center p-8 text-center">
              <div className="w-12 h-12 rounded-full bg-amber-500/20 flex items-center justify-center mb-4 border border-amber-500/30">
                <svg className="w-6 h-6 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
              </div>
              <p className="text-white font-bold text-sm mb-2">{t.proBadge}</p>
              <p className="text-zinc-400 text-xs max-w-[200px]">{t.upgradeMsg}</p>
            </div>
          )}
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center border border-purple-500/20">
              <ImageIcon className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">{t.elaTitle}</h3>
              <p className="text-xs text-zinc-500 font-medium">{t.elaDesc}</p>
            </div>
          </div>
          
          <div className="space-y-6">
            <label className="flex flex-col items-center justify-center h-48 border-2 border-dashed border-zinc-800 rounded-[2rem] bg-zinc-950 group hover:border-purple-500/40 cursor-pointer transition-all">
              <input type="file" className="hidden" accept="image/*" onChange={handleElaUpload} />
              {elaFile ? (
                <img src={elaFile} className="h-full w-full object-contain rounded-[1.5rem]" alt="ELA Preview" />
              ) : (
                <>
                  <svg className="w-8 h-8 text-zinc-600 mb-2 group-hover:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                  <span className="text-xs font-bold text-zinc-500">{t.uploadEla}</span>
                </>
              )}
            </label>

            {elaFile && (
              <button
                onClick={runElaAnalysis}
                disabled={elaAnalyzing}
                className="w-full py-4 bg-purple-600 hover:bg-purple-500 text-white font-black rounded-2xl transition-all uppercase tracking-widest text-xs"
              >
                {elaAnalyzing ? 'ANALYZING PIXELS...' : t.runEla}
              </button>
            )}

            {elaResult && (
              <div className="p-6 rounded-3xl bg-zinc-950 border border-zinc-800">
                <div className="flex justify-between items-center mb-4">
                  <span className={`text-[10px] font-black uppercase tracking-widest ${elaResult.anomaliesDetected ? 'text-rose-400' : 'text-emerald-400'}`}>
                    {elaResult.anomaliesDetected ? 'ANOMALIES DETECTED' : 'INTEGRITY VERIFIED'}
                  </span>
                  <span className="text-xs font-mono text-zinc-500">Confidence: {elaResult.technicalScore}%</span>
                </div>
                <ul className="space-y-2">
                  {elaResult.findings.map((f: string, i: number) => (
                    <li key={i} className="text-[11px] text-zinc-400 flex gap-2">
                      <span className="text-purple-500">•</span> {f}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Deepfake Video Detection */}
        <div className="relative bg-zinc-900/50 border border-zinc-800 rounded-[2.5rem] p-10 space-y-8 flex flex-col shadow-xl overflow-hidden">
          {!isPro && (
            <div className="absolute inset-0 z-10 bg-[#0a0a0b]/60 backdrop-blur-[2px] flex flex-col items-center justify-center p-8 text-center">
              <div className="w-12 h-12 rounded-full bg-amber-500/20 flex items-center justify-center mb-4 border border-amber-500/30">
                <svg className="w-6 h-6 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
              </div>
              <p className="text-white font-bold text-sm mb-2">{t.proBadge}</p>
              <p className="text-zinc-400 text-xs max-w-[200px]">{t.upgradeMsg}</p>
            </div>
          )}
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 flex items-center justify-center border border-rose-500/20">
              <Video className="w-6 h-6 text-rose-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">{t.deepfakeTitle}</h3>
              <p className="text-xs text-zinc-500 font-medium">{t.deepfakeDesc}</p>
            </div>
          </div>
          
          <div className="space-y-6">
            <label className="flex flex-col items-center justify-center h-48 border-2 border-dashed border-zinc-800 rounded-[2rem] bg-zinc-950 group hover:border-rose-500/40 cursor-pointer transition-all">
              <input type="file" className="hidden" accept="video/*" onChange={handleVideoUpload} />
              {videoFile ? (
                <div className="flex flex-col items-center gap-2">
                  <svg className="w-12 h-12 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                  <span className="text-xs font-bold text-zinc-300">Video Loaded</span>
                </div>
              ) : (
                <>
                  <svg className="w-8 h-8 text-zinc-600 mb-2 group-hover:text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                  <span className="text-xs font-bold text-zinc-500">{t.uploadVideo}</span>
                </>
              )}
            </label>

            {videoFile && (
              <button
                onClick={runVideoAnalysis}
                disabled={videoAnalyzing}
                className="w-full py-4 bg-rose-600 hover:bg-rose-500 text-white font-black rounded-2xl transition-all uppercase tracking-widest text-xs"
              >
                {videoAnalyzing ? t.videoAnalyzing : t.runVideo}
              </button>
            )}

            {videoResult && (
              <div className="p-6 rounded-3xl bg-zinc-950 border border-zinc-800">
                <div className="flex justify-between items-center mb-4">
                  <span className={`text-[10px] font-black uppercase tracking-widest ${videoResult.isDeepfake ? 'text-rose-400' : 'text-emerald-400'}`}>
                    {videoResult.isDeepfake ? t.isDeepfake : t.integrityVerified}
                  </span>
                  <span className="text-xs font-mono text-zinc-500">{t.confidence}: {videoResult.confidence}%</span>
                </div>
                <div className="mb-4">
                  <div className="w-full h-1.5 bg-zinc-900 rounded-full overflow-hidden">
                    <div className={`h-full transition-all duration-1000 ${videoResult.isDeepfake ? 'bg-rose-500' : 'bg-emerald-500'}`} style={{width: `${videoResult.confidence}%`}}></div>
                  </div>
                </div>
                <ul className="space-y-2">
                  {videoResult.findings.map((f: string, i: number) => (
                    <li key={i} className="text-[11px] text-zinc-400 flex gap-2">
                      <span className="text-rose-500">•</span> {f}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Neural Artifact Scanner */}
        <div className="relative bg-zinc-900/50 border border-zinc-800 rounded-[2.5rem] p-10 space-y-8 flex flex-col shadow-xl lg:col-span-2 overflow-hidden">
          {!isPro && (
            <div className="absolute inset-0 z-10 bg-[#0a0a0b]/60 backdrop-blur-[2px] flex flex-col items-center justify-center p-8 text-center">
              <div className="w-16 h-16 rounded-full bg-amber-500/20 flex items-center justify-center mb-4 border border-amber-500/30">
                <svg className="w-8 h-8 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
              </div>
              <p className="text-white font-bold text-lg mb-2">{t.proBadge}</p>
              <p className="text-zinc-400 text-sm max-w-[300px]">{t.upgradeMsg}</p>
            </div>
          )}
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
              <Fingerprint className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">{t.neuralTitle}</h3>
              <p className="text-xs text-zinc-500 font-medium">{t.neuralDesc}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="relative aspect-video bg-black rounded-[2rem] overflow-hidden border border-zinc-800">
              {cameraActive ? (
                <>
                  <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover scale-x-[-1]" />
                  <div className="absolute inset-0 pointer-events-none">
                    <div className="w-full h-full border-[30px] border-transparent relative">
                      <div className="absolute top-0 w-full h-0.5 bg-blue-500/50 animate-[scan_2s_ease-in-out_infinite]"></div>
                      <style>{`
                        @keyframes scan {
                          0% { top: 0; opacity: 0; }
                          50% { opacity: 1; }
                          100% { top: 100%; opacity: 0; }
                        }
                      `}</style>
                    </div>
                  </div>
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center flex-col gap-4 text-zinc-600">
                  <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  <p className="text-xs font-bold uppercase tracking-widest">Scanner Offline</p>
                </div>
              )}
              
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3">
                <button 
                  onClick={toggleCamera}
                  className={`px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${
                    cameraActive ? 'bg-zinc-800 text-white' : 'bg-blue-600 text-white shadow-lg shadow-blue-900/40'
                  }`}
                >
                  {cameraActive ? t.stopCam : t.activateCam}
                </button>
                {cameraActive && (
                  <button 
                    onClick={() => setIsScanning(!isScanning)}
                    className={`px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${
                      isScanning ? 'bg-emerald-600 text-white' : 'bg-zinc-800 text-zinc-400'
                    }`}
                  >
                    {isScanning ? t.analyzingFrame : 'Auto-Scan'}
                  </button>
                )}
              </div>
            </div>

            <div className="space-y-4 flex flex-col justify-center">
              {scanResult ? (
                <div className="p-8 rounded-[2rem] bg-zinc-950 border border-zinc-800 animate-in fade-in slide-in-from-right-4">
                  <div className="flex justify-between items-center mb-6">
                    <div className="space-y-1">
                      <span className={`text-[10px] font-black uppercase tracking-widest ${scanResult.status === 'Clean' ? 'text-emerald-400' : 'text-rose-400'}`}>
                        Live Analysis: {scanResult.status}
                      </span>
                      <h4 className="text-2xl font-heading font-black text-white">Neural Check</h4>
                    </div>
                    <div className="text-right">
                       <p className="text-[10px] text-zinc-600 font-bold uppercase mb-1">AI Match</p>
                       <p className="text-2xl font-heading font-black text-zinc-300">{scanResult.neuralProbability}%</p>
                    </div>
                  </div>
                  <div className="p-5 bg-zinc-900 rounded-2xl border border-zinc-800/50">
                    <p className="text-xs text-zinc-400 italic leading-relaxed font-medium">"{scanResult.observation}"</p>
                  </div>
                  <div className="mt-6 flex gap-4">
                     <div className="flex-1 h-1 bg-zinc-900 rounded-full overflow-hidden">
                        <div className={`h-full transition-all duration-1000 ${scanResult.status === 'Clean' ? 'bg-emerald-500' : 'bg-rose-500'}`} style={{width: `${scanResult.neuralProbability}%`}}></div>
                     </div>
                  </div>
                </div>
              ) : (
                <div className="p-8 rounded-[2rem] border border-zinc-800/50 border-dashed text-center flex flex-col items-center justify-center h-full">
                   <div className="w-16 h-16 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center mb-4">
                      <svg className="w-8 h-8 text-zinc-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                   </div>
                   <p className="text-zinc-600 text-xs font-bold uppercase tracking-tighter">Waiting for scan data...</p>
                </div>
              )}
            </div>
          </div>
          <canvas ref={canvasRef} className="hidden" />
        </div>
      </div>
    </div>
  );
};
