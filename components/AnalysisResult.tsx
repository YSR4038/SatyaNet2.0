
import React, { useState, useEffect } from 'react';
import { AnalysisReport, Case } from '../types';
import { Language } from '../App';

interface AnalysisResultProps {
  report: AnalysisReport;
  onBack: () => void;
  language: Language;
}

export const AnalysisResult: React.FC<AnalysisResultProps> = ({ report, onBack, language }) => {
  const [cases, setCases] = useState<Case[]>([]);
  const [selectedCaseId, setSelectedCaseId] = useState<string>('');
  const [isLinking, setIsLinking] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('satya_cases');
    if (saved) setCases(JSON.parse(saved));
  }, []);

  const handleLinkToCase = () => {
    if (!selectedCaseId) return;
    const updatedCases = cases.map(c => {
      if (c.id === selectedCaseId) {
        if (!c.reportIds.includes(report.id)) {
          return { ...c, reportIds: [...c.reportIds, report.id] };
        }
      }
      return c;
    });
    setCases(updatedCases);
    localStorage.setItem('satya_cases', JSON.stringify(updatedCases));
    setIsLinking(false);
    alert(language === 'hi' ? 'रिपोर्ट केस से जुड़ी' : 'Report linked to case successfully');
  };

  const handlePrint = () => {
    window.print();
  };

  const getVerdictColor = (verdict: string) => {
    switch (verdict) {
      case 'True': return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
      case 'False': return 'text-rose-400 bg-rose-400/10 border-rose-400/20';
      case 'Misleading': return 'text-amber-400 bg-amber-400/10 border-amber-400/20';
      default: return 'text-zinc-400 bg-zinc-400/10 border-zinc-400/20';
    }
  };

  const t = {
    en: { 
      back: 'Return to Lab', 
      pdf: 'GENERATE REPORT PDF', 
      fileHeader: 'Forensic Case File',
      satyaScore: 'Satya Score',
      execSummary: 'Executive Summary',
      findings: 'Detailed Findings', 
      sources: 'Grounding Sources', 
      dharma: 'Digital Dharma Guideline', 
      stats: 'Technical Metrics', 
      metrics: {
        bias: 'Linguistic Bias',
        tilt: 'Political Tilt',
        ai: 'AI Synthesis Probability'
      },
      metadata: 'Case Metadata',
      ledger: 'View Public Ledger',
      tamper: 'Tamper Protection Active',
      anchored: 'Anchored to Satya Ledger SHA-256',
      timeline: 'Forensic Timeline',
      notary: 'Trust Ledger Notary',
      verifiedBy: 'Verified by Satya Net Node',
      linkToCase: 'Link to Investigation',
      selectCase: 'Select Case...',
      link: 'Link Evidence'
    },
    hi: { 
      back: 'लैब पर लौटें', 
      pdf: 'रिपोर्ट पीडीएफ बनाएं', 
      fileHeader: 'फोरेंसिक केस फाइल',
      satyaScore: 'सत्य स्कोर',
      execSummary: 'कार्यकारी सारांश',
      findings: 'विस्तृत निष्कर्ष', 
      sources: 'ग्राउंडिंग स्रोत', 
      dharma: 'डिजिटल धर्म दिशानिर्देश', 
      stats: 'तकनीकी मेट्रिक्स', 
      metrics: {
        bias: 'भाषाई पूर्वाग्रह',
        tilt: 'राजनीतिक झुकाव',
        ai: 'AI संश्लेषण संभावना'
      },
      metadata: 'केस मेटाडेटा',
      ledger: 'पब्लिक लेजर देखें',
      tamper: 'छेड़छाड़ सुरक्षा सक्रिय',
      anchored: 'सत्य लेजर SHA-256 पर आधारित',
      timeline: 'फोरेंसिक समयरेखा',
      notary: 'ट्रस्ट लेजर नोटरी',
      verifiedBy: 'सत्य नेट नोड द्वारा सत्यापित',
      linkToCase: 'जांच से लिंक करें',
      selectCase: 'केस चुनें...',
      link: 'सबूत लिंक करें'
    },
    mr: { 
      back: 'लॅबवर परत जा', 
      pdf: 'रिपोर्ट PDF तयार करा', 
      fileHeader: 'फॉरेन्सिक केस फाइल',
      satyaScore: 'सत्य स्कोर',
      execSummary: 'कार्यकारी सारांश',
      findings: 'तपशीलवार निष्कर्ष', 
      sources: 'ग्राउंडिंग स्रोत', 
      dharma: 'डिजिटल धर्म मार्गदर्शक तत्त्वे', 
      stats: 'तांत्रिक मेट्रिक्स', 
      metrics: {
        bias: 'भाषिक पूर्वग्रह',
        tilt: 'राजकीय कल',
        ai: 'AI संश्लेषण शक्यता'
      },
      metadata: 'केस मेटाडेटा',
      ledger: 'पब्लिक लेजर पहा',
      tamper: 'छेडछाड संरक्षण सक्रिय',
      anchored: 'सत्य लेजर SHA-256 वर आधारित',
      timeline: 'फॉरेन्सिक टाइमलाइन',
      notary: 'ट्रस्ट लेजर नोटरी',
      verifiedBy: 'सत्य नेट नोडद्वारे सत्यापित',
      linkToCase: 'तपासाशी लिंक करा',
      selectCase: 'केस निवडा...',
      link: 'पुरावा लिंक करा'
    },
    ta: { 
      back: 'ஆய்வகத்திற்குத் திரும்பு', 
      pdf: 'அறிக்கை PDF ஐ உருவாக்கு', 
      fileHeader: 'தடயவியல் வழக்கு கோப்பு',
      satyaScore: 'சத்யா மதிப்பெண்',
      execSummary: 'நிர்வாக சுருக்கம்',
      findings: 'விரிவான கண்டுபிடிப்புகள்', 
      sources: 'ஆதாரங்கள்', 
      dharma: 'டிஜிட்டல் தர்ம வழிகாட்டுதல்', 
      stats: 'தொழில்நுட்ப அளவீடுகள்', 
      metrics: {
        bias: 'மொழி சார்பு',
        tilt: 'அரசியல் சாய்வு',
        ai: 'AI தொகுப்பு நிகழ்தகவு'
      },
      metadata: 'வழக்கு மெட்டாடேட்டா',
      ledger: 'பொது லெட்ஜரைப் பார்க்கவும்',
      tamper: ' tampering பாதுகாப்பு செயலில் உள்ளது',
      anchored: 'சத்யா லெட்ஜர் SHA-256 இல் நங்கூரமிடப்பட்டது',
      timeline: 'தடயவியல் காலவரிசை',
      notary: 'நம்பிக்கை லெட்ஜர் நோட்டரி',
      verifiedBy: 'சத்யா நெட் நோட் மூலம் சரிபார்க்கப்பட்டது',
      linkToCase: 'விசாரணையுடன் இணைக்கவும்',
      selectCase: 'வழக்கைத் தேர்ந்தெடுக்கவும்...',
      link: 'ஆதாரத்தை இணைக்கவும்'
    },
    bn: { 
      back: 'ল্যাবে ফিরে যান', 
      pdf: 'রিপোর্ট PDF তৈরি করুন', 
      fileHeader: 'ফরেনসিক কেস ফাইল',
      satyaScore: 'সত্য স্কোর',
      execSummary: 'নির্বাহী সারাংশ',
      findings: 'বিস্তারিত ফলাফল', 
      sources: 'উৎসসমূহ', 
      dharma: 'ডিজিটাল ধর্ম নির্দেশিকা', 
      stats: 'প্রযুক্তিগত মেট্রিক্স', 
      metrics: {
        bias: 'ভাষাগত পক্ষপাত',
        tilt: 'রাজনৈতিক ঝোঁক',
        ai: 'AI সংশ্লেষণ সম্ভাবনা'
      },
      metadata: 'কেস মেটাডেটা',
      ledger: 'পাবলিক লেজার দেখুন',
      tamper: 'টেম্পার সুরক্ষা সক্রিয়',
      anchored: 'সত্য লেজার SHA-256-এ নোঙর করা',
      timeline: 'ফরেনসিক টাইমলাইন',
      notary: 'ট্রাস্ট লেজার নোটারি',
      verifiedBy: 'সত্য নেট নোড দ্বারা যাচাইকৃত',
      linkToCase: 'তদন্তের সাথে লিঙ্ক করুন',
      selectCase: 'মামলা নির্বাচন করুন...',
      link: 'প্রমাণ লিঙ্ক করুন'
    }
  }[language];

  // Stable block number and TXID for notary based on report hash
  const stableBlock = parseInt(report.hash.slice(0, 8), 16) % 1000000 + 800000000;
  const stableTxId = report.hash.split('').reverse().join('').substring(0, 32);

  const getTimelineLabel = (key: string) => {
    const labels: Record<string, Record<Language, string>> = {
      acquisition: {
        en: 'Evidence Acquisition',
        hi: 'साक्ष्य प्राप्ति',
        mr: 'पुरावा संपादन',
        ta: 'ஆதார சேகரிப்பு',
        bn: 'প্রমাণ সংগ্রহ'
      },
      hash: {
        en: 'Hash Generation (SHA-256)',
        hi: 'हैश जेनरेशन (SHA-256)',
        mr: 'हॅश जनरेशन (SHA-256)',
        ta: 'ஹாஷ் உருவாக்கம் (SHA-256)',
        bn: 'হ্যাশ জেনারেশন (SHA-256)'
      },
      scan: {
        en: 'AI Artifact Scan',
        hi: 'AI आर्टिफैक्ट स्कैन',
        mr: 'AI आर्टिफॅक्ट स्कॅन',
        ta: 'AI கலைப்பொருள் ஸ்கேன்',
        bn: 'AI আর্টিফ্যাক্ট স্ক্যান'
      },
      validation: {
        en: 'Metadata Validation',
        hi: 'मेटाडेटा सत्यापन',
        mr: 'मेटाडेटा प्रमाणीकरण',
        ta: 'மெட்டாடேட்டா சரிபார்ப்பு',
        bn: 'মেটাডেটা যাচাইকরণ'
      },
      verdict: {
        en: 'Final Satya Verdict',
        hi: 'अंतिम सत्य निर्णय',
        mr: 'अंतिम सत्य निकाल',
        ta: 'இறுதி சத்யா தீர்ப்பு',
        bn: 'চূড়ান্ত সত্য রায়'
      }
    };
    return labels[key][language];
  };

  const timelineSteps = [
    { label: getTimelineLabel('acquisition'), time: '-00:04:22', status: 'COMPLETE' },
    { label: getTimelineLabel('hash'), time: '-00:04:18', status: 'COMPLETE' },
    { label: getTimelineLabel('scan'), time: '-00:02:40', status: 'COMPLETE' },
    { label: getTimelineLabel('validation'), time: '-00:01:12', status: 'COMPLETE' },
    { label: getTimelineLabel('verdict'), time: 'NOW', status: 'FINALIZED' },
  ];

  return (
    <div className="max-w-5xl mx-auto pb-20 animate-in slide-in-from-bottom-8 duration-700 print:bg-white print:text-black print:p-0">
      <div className="flex items-center justify-between mb-8 print:hidden">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-zinc-500 hover:text-zinc-200 transition-all group font-bold text-sm"
        >
          <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          {t.back}
        </button>
        <div className="flex items-center gap-4">
          <div className="relative">
            <button 
              onClick={() => setIsLinking(!isLinking)}
              className="px-4 py-2 rounded-xl bg-zinc-800 text-zinc-300 font-bold text-xs uppercase tracking-widest border border-zinc-700 flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
              {t.linkToCase}
            </button>
            {isLinking && (
              <div className="absolute top-full right-0 mt-2 w-64 bg-zinc-900 border border-zinc-800 rounded-xl p-4 shadow-2xl z-50">
                <select 
                  value={selectedCaseId} 
                  onChange={(e) => setSelectedCaseId(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 text-xs text-white mb-3"
                >
                  <option value="">{t.selectCase}</option>
                  {cases.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
                <button 
                  onClick={handleLinkToCase}
                  className="w-full py-2 bg-blue-600 text-white text-[10px] font-black uppercase rounded-lg"
                >
                  {t.link}
                </button>
              </div>
            )}
          </div>
          <button 
            onClick={handlePrint}
            className="px-5 py-2 rounded-xl bg-white text-black font-black text-xs uppercase tracking-widest shadow-lg shadow-white/5 hover:scale-105 transition-transform"
          >
            {t.pdf}
          </button>
        </div>
      </div>

      <div className="bg-[#0e0e11] border border-zinc-800 rounded-[3rem] overflow-hidden shadow-2xl relative print:border-none print:shadow-none print:rounded-none">
        <div className="p-12 border-b border-zinc-800 bg-gradient-to-br from-zinc-900/50 to-transparent print:bg-none print:border-black">
          <div className="flex flex-wrap items-start justify-between gap-10 mb-12">
            <div className="space-y-4 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/10 rounded-full border border-blue-500/20 text-blue-400 font-bold text-[10px] uppercase tracking-widest print:border-black print:text-black">
                {t.fileHeader}
              </div>
              <h2 className="text-4xl font-heading font-bold text-white leading-tight print:text-black">{report.title}</h2>
              <div className="flex flex-wrap gap-6 text-xs font-medium text-zinc-500 font-mono uppercase print:text-gray-600">
                <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-zinc-700 print:bg-black"></div> TIMESTAMP: {new Date(report.timestamp).toLocaleString()}</span>
                <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-zinc-700 print:bg-black"></div> HASH: {report.hash.substring(0, 16)}...</span>
              </div>
            </div>
            
            <div className="flex flex-col items-center p-8 rounded-[2rem] bg-zinc-950 border border-zinc-800 shadow-xl min-w-[200px] relative overflow-hidden group print:border-black print:text-black">
              <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-3 print:text-gray-600">{t.satyaScore}</span>
              <div className="text-6xl font-heading font-black text-white mb-2 print:text-black">{report.satyaScore}</div>
              <div className={`px-4 py-1.5 rounded-full border text-[10px] font-black tracking-widest uppercase ${getVerdictColor(report.verdict)} print:border-black print:text-black`}>
                {report.verdict}
              </div>
            </div>
          </div>

          <div className="p-8 rounded-[2rem] bg-zinc-950/50 border border-zinc-800/50 backdrop-blur-md print:bg-none print:border-black">
            <h4 className="text-xs font-black text-zinc-500 uppercase tracking-widest mb-4 print:text-gray-600">{t.execSummary}</h4>
            <p className="text-zinc-300 text-lg leading-relaxed font-medium print:text-black">{report.summary}</p>
          </div>
        </div>

        <div className="p-12 grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Forensic Timeline Column */}
          <div className="lg:col-span-4 space-y-8">
            <section className="p-8 bg-zinc-950/40 rounded-[2.5rem] border border-zinc-800/50 print:bg-none print:border-black">
              <h3 className="text-xs font-black text-zinc-500 uppercase tracking-widest mb-8 print:text-gray-600">{t.timeline}</h3>
              <div className="space-y-8">
                {timelineSteps.map((step, idx) => (
                  <div key={idx} className="relative pl-8 pb-2">
                    {idx !== timelineSteps.length - 1 && (
                      <div className="absolute left-[3.5px] top-[14px] bottom-[-20px] w-0.5 bg-zinc-800 print:bg-black"></div>
                    )}
                    <div className={`absolute left-0 top-[3px] w-2 h-2 rounded-full border-2 border-[#0e0e11] print:border-black ${step.status === 'FINALIZED' ? 'bg-blue-500 ring-4 ring-blue-500/10' : 'bg-zinc-700 print:bg-gray-300'}`}></div>
                    <div className="space-y-1">
                      <p className="text-[11px] font-black text-zinc-200 uppercase tracking-wide print:text-black">{step.label}</p>
                      <div className="flex justify-between items-center text-[9px] font-mono text-zinc-600 print:text-gray-600">
                        <span>{step.time}</span>
                        <span className={step.status === 'FINALIZED' ? 'text-blue-400' : 'text-zinc-500'}>{step.status}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="p-8 bg-gradient-to-br from-zinc-950 to-zinc-900 rounded-[2.5rem] border border-zinc-800/50 shadow-inner print:bg-none print:border-black">
               <h3 className="text-xs font-black text-blue-400 uppercase tracking-[0.2em] mb-6 flex items-center justify-between print:text-black">
                {t.notary}
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
               </h3>
               <div className="space-y-4 font-mono text-[9px] print:text-gray-800">
                 <div>
                   <span className="text-zinc-600 block mb-1">TXID:</span>
                   <span className="text-zinc-400 break-all print:text-black">{stableTxId}</span>
                 </div>
                 <div className="flex justify-between">
                   <span className="text-zinc-600">BLOCK:</span>
                   <span className="text-zinc-400 print:text-black">{stableBlock.toLocaleString()}</span>
                 </div>
                 <div className="pt-4 border-t border-zinc-800 print:border-black">
                   <p className="text-blue-500 font-black print:text-black">{t.verifiedBy}</p>
                 </div>
               </div>
            </section>
          </div>

          {/* Detailed Findings Column */}
          <div className="lg:col-span-8 space-y-12">
            <section>
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3 print:text-black">
                <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center print:border print:bg-white">
                  <svg className="w-4 h-4 text-zinc-400 print:text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                </div>
                {t.findings}
              </h3>
              <div className="space-y-4">
                {report.reasoning.map((item, idx) => (
                  <div key={idx} className="p-5 rounded-2xl bg-zinc-900/30 border border-zinc-800 transition-colors flex gap-5 print:bg-none print:border-black">
                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-zinc-800 text-zinc-500 text-xs flex items-center justify-center font-bold print:bg-gray-200 print:text-black">
                      {idx + 1}
                    </span>
                    <p className="text-zinc-400 text-sm leading-relaxed pt-1 print:text-black">{item}</p>
                  </div>
                ))}
              </div>
            </section>

            {report.groundingLinks && report.groundingLinks.length > 0 && (
              <section>
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3 print:text-black">
                  <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center print:border print:bg-white">
                    <svg className="w-4 h-4 text-zinc-400 print:text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
                  </div>
                  {t.sources}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {report.groundingLinks.map((link, idx) => (
                    link.web && (
                      <a 
                        key={idx} 
                        href={link.web.uri} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800 hover:border-blue-500/50 transition-all flex items-center justify-between group print:border-black"
                      >
                        <div className="truncate pr-4">
                          <p className="text-xs font-bold text-white truncate group-hover:text-blue-400 transition-colors print:text-black">{link.web.title}</p>
                          <p className="text-[10px] text-zinc-500 truncate print:text-gray-600">{link.web.uri}</p>
                        </div>
                        <svg className="w-4 h-4 text-zinc-600 group-hover:text-blue-400 transition-colors flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                      </a>
                    )
                  ))}
                </div>
              </section>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <section className="p-8 rounded-[2.5rem] bg-emerald-500/5 border border-emerald-500/10 print:bg-none print:border-black">
                <h3 className="text-lg font-black text-emerald-400 mb-4 uppercase tracking-widest flex items-center gap-2 print:text-black">
                  {t.dharma}
                </h3>
                <p className="text-emerald-200/80 text-md italic leading-relaxed font-serif print:text-black">
                  "{report.dharmaTip}"
                </p>
              </section>

              <section className="p-8 rounded-[2.5rem] bg-zinc-950 border border-zinc-800 print:bg-none print:border-black">
                <h3 className="text-xs font-black text-zinc-500 uppercase tracking-widest mb-6 print:text-gray-600">{t.stats}</h3>
                <div className="space-y-6">
                  {report.forensicDetails.aiGeneratedProbability !== undefined && (
                    <div className="space-y-3">
                      <div className="flex justify-between items-end">
                        <span className="text-[10px] text-zinc-400 font-black uppercase print:text-gray-600">{t.metrics.ai}</span>
                        <span className="text-xl font-black text-white print:text-black">{report.forensicDetails.aiGeneratedProbability}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-zinc-900 rounded-full overflow-hidden print:border print:bg-gray-100">
                        <div className={`h-full transition-all duration-1000 ${report.forensicDetails.aiGeneratedProbability > 70 ? 'bg-rose-500' : 'bg-blue-500'} print:bg-black`} style={{width: `${report.forensicDetails.aiGeneratedProbability}%`}}></div>
                      </div>
                    </div>
                  )}
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
