
import React from 'react';
import { Language } from '../App';

interface SidebarProps {
  activeTab: 'dashboard' | 'tools' | 'dharma' | 'investigations';
  setActiveTab: (tab: 'dashboard' | 'tools' | 'dharma' | 'investigations') => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  isPro: boolean;
  onUpgradeClick: () => void;
  onDowngrade: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, language, setLanguage, isPro, onUpgradeClick, onDowngrade }) => {
  const translations = {
    en: { 
      lab: 'Analysis Lab', 
      tools: 'Forensic Tools', 
      bot: 'Dharma Bot', 
      cases: 'Investigations', 
      navigator: 'Navigator', 
      pro: 'Pro Investigator',
      upgrade: 'Upgrade to PRO',
      manage: 'Account Managed',
      revert: 'Revert to Free',
      proStatus: 'Satya Pro Active',
      freeStatus: 'Free Investigator',
      proDesc: 'Enterprise forensic ledger & 4K deepfake analysis enabled.',
      freeDesc: 'Basic text & image analysis. Upgrade for blockchain anchoring.'
    },
    hi: { 
      lab: 'विश्लेषण लैब', 
      tools: 'फोरेंसिक उपकरण', 
      bot: 'धर्म बॉट', 
      cases: 'जांच कार्य', 
      navigator: 'नेविगेटर', 
      pro: 'प्रो अन्वेषक',
      upgrade: 'प्रो में अपग्रेड करें',
      manage: 'खाता प्रबंधित',
      revert: 'निःशुल्क पर लौटें',
      proStatus: 'सत्य प्रो सक्रिय',
      freeStatus: 'निःशुल्क अन्वेषक',
      proDesc: 'एंटरप्राइज फोरेंसिक लेजर और 4K डीपफेक विश्लेषण सक्षम।',
      freeDesc: 'बुनियादी टेक्स्ट और इमेज विश्लेषण। ब्लॉकचेन एंकरिंग के लिए अपग्रेड करें।'
    },
    mr: { 
      lab: 'विश्लेषण लॅब', 
      tools: 'फॉरेन्सिक साधने', 
      bot: 'धर्म बॉट', 
      cases: 'तपास', 
      navigator: 'नेव्हिगेटर', 
      pro: 'प्रो अन्वेषक',
      upgrade: 'प्रो मध्ये अपग्रेड करा',
      manage: 'खाते व्यवस्थापित',
      revert: 'विनामूल्य वर परत जा',
      proStatus: 'सत्य प्रो सक्रिय',
      freeStatus: 'विनामूल्य अन्वेषक',
      proDesc: 'एंटरप्राइझ फॉरेन्सिक लेजर आणि 4K डीपफेक विश्लेषण सक्षम.',
      freeDesc: 'मूलभूत मजकूर आणि प्रतिमा विश्लेषण. ब्लॉकचेन अँकरिंगसाठी अपग्रेड करा.'
    },
    ta: { 
      lab: 'பகுப்பாய்வு ஆய்வகம்', 
      tools: 'தடயவியல் கருவிகள்', 
      bot: 'தர்ம பாட்', 
      cases: 'விசாரணைகள்', 
      navigator: 'நேவிகேட்டர்', 
      pro: 'புரோ ஆய்வாளர்',
      upgrade: 'புரோவுக்கு மேம்படுத்தவும்',
      manage: 'கணக்கு நிர்வகிக்கப்பட்டது',
      revert: 'இலவசத்திற்குத் திரும்பு',
      proStatus: 'சத்யா புரோ செயலில் உள்ளது',
      freeStatus: 'இலவச ஆய்வாளர்',
      proDesc: 'எண்டர்பிரைஸ் தடயவியல் லெட்ஜர் & 4K டீப்ஃபேக் பகுப்பாய்வு இயக்கப்பட்டது.',
      freeDesc: 'அடிப்படை உரை மற்றும் பட பகுப்பாய்வு. பிளாக்செயின் ஆங்கரிங்கிற்கு மேம்படுத்தவும்.'
    },
    bn: { 
      lab: 'বিশ্লেষণ ল্যাব', 
      tools: 'ফরেনসিক সরঞ্জাম', 
      bot: 'ধর্ম বট', 
      cases: 'তদন্ত', 
      navigator: 'নেভিগেটর', 
      pro: 'প্রো তদন্তকারী',
      upgrade: 'প্রো-তে আপগ্রেড করুন',
      manage: 'অ্যাকাউন্ট পরিচালিত',
      revert: 'বিনামূল্যে ফিরে যান',
      proStatus: 'সত্য প্রো সক্রিয়',
      freeStatus: 'বিনামূল্যে তদন্তকারী',
      proDesc: 'এন্টারপ্রাইজ ফরেনসিক লেজার এবং 4K ডিপফেক বিশ্লেষণ সক্ষম।',
      freeDesc: 'মৌলিক পাঠ্য এবং চিত্র বিশ্লেষণ। ব্লকচেইন অ্যাঙ্করিংয়ের জন্য আপগ্রেড করুন।'
    }
  };

  const t = translations[language];

  const menuItems = [
    { id: 'dashboard', label: t.lab, icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
    ) },
    { id: 'investigations', label: t.cases, icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
    ) },
    { id: 'tools', label: t.tools, icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" /></svg>
    ) },
    { id: 'dharma', label: t.bot, icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
    ) },
  ];

  return (
    <aside className="w-64 border-r border-zinc-800 flex flex-col h-screen bg-[#0a0a0b] sticky top-0">
      <div className="p-8 pb-4">
        <span className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-6 block">{t.navigator}</span>
        <nav className="space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                activeTab === item.id 
                  ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20 shadow-[0_0_20px_rgba(59,130,246,0.05)]' 
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900 border border-transparent'
              }`}
            >
              <span className={`${activeTab === item.id ? 'text-blue-400' : 'text-zinc-500 group-hover:text-zinc-300'}`}>
                {item.icon}
              </span>
              <span className="font-medium flex-1">{item.label}</span>
              {!isPro && item.id === 'investigations' && (
                <span className="px-1 py-0.5 bg-amber-500/20 text-amber-500 text-[8px] font-black rounded uppercase border border-amber-500/30">PRO</span>
              )}
            </button>
          ))}
        </nav>
      </div>

      <div className="mt-auto p-6 space-y-6">
        <div className="p-1 bg-zinc-900/50 rounded-xl border border-zinc-800 grid grid-cols-5 gap-0.5">
          <button 
            onClick={() => setLanguage('en')}
            title="English"
            className={`py-1.5 text-[8px] font-black rounded-lg transition-all ${language === 'en' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}
          >
            EN
          </button>
          <button 
            onClick={() => setLanguage('hi')}
            title="Hindi"
            className={`py-1.5 text-[8px] font-black rounded-lg transition-all ${language === 'hi' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}
          >
            HI
          </button>
          <button 
            onClick={() => setLanguage('mr')}
            title="Marathi"
            className={`py-1.5 text-[8px] font-black rounded-lg transition-all ${language === 'mr' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}
          >
            MR
          </button>
          <button 
            onClick={() => setLanguage('ta')}
            title="Tamil"
            className={`py-1.5 text-[8px] font-black rounded-lg transition-all ${language === 'ta' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}
          >
            TA
          </button>
          <button 
            onClick={() => setLanguage('bn')}
            title="Bengali"
            className={`py-1.5 text-[8px] font-black rounded-lg transition-all ${language === 'bn' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}
          >
            BN
          </button>
        </div>

        <div className={`p-4 rounded-2xl border transition-all ${isPro ? 'bg-gradient-to-br from-zinc-900 to-black border-zinc-800/50' : 'bg-zinc-900/30 border-zinc-800/30'}`}>
          <h4 className={`text-[10px] font-black uppercase tracking-widest mb-2 ${isPro ? 'text-blue-400' : 'text-zinc-500'}`}>
            {isPro ? t.proStatus : t.freeStatus}
          </h4>
          <p className="text-[10px] text-zinc-500 mb-4 leading-relaxed">
            {isPro ? t.proDesc : t.freeDesc}
          </p>
          <button 
            onClick={isPro ? undefined : onUpgradeClick}
            className={`w-full py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all border ${
              isPro 
                ? 'bg-zinc-800 text-zinc-200 border-zinc-700 cursor-default' 
                : 'bg-blue-600 hover:bg-blue-500 text-white border-blue-500 shadow-lg shadow-blue-900/20'
            }`}
          >
            {isPro ? t.manage : t.upgrade}
          </button>
          {isPro && (
            <button 
              onClick={onDowngrade}
              className="w-full mt-2 py-1 text-[8px] font-bold text-zinc-600 hover:text-zinc-400 uppercase tracking-widest transition-colors"
            >
              {t.revert}
            </button>
          )}
        </div>
      </div>
    </aside>
  );
};
