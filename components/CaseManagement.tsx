
import React, { useState, useEffect } from 'react';
import { Case, AnalysisReport } from '../types';
import { Language } from '../App';
import { toast } from 'sonner';
import { 
  Briefcase, 
  Plus, 
  FileText, 
  Clock, 
  StickyNote, 
  ShieldAlert, 
  ChevronRight,
  FolderOpen,
  Save,
  X
} from 'lucide-react';

interface CaseManagementProps {
  language: Language;
  isPro: boolean;
}

export const CaseManagement: React.FC<CaseManagementProps> = ({ language, isPro }) => {
  const [cases, setCases] = useState<Case[]>([]);
  const [activeCase, setActiveCase] = useState<Case | null>(null);
  const [note, setNote] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [newCaseName, setNewCaseName] = useState('');
  const [reports, setReports] = useState<AnalysisReport[]>([]);

  const t = {
    en: {
      title: 'Investigation Management',
      newCase: 'NEW INVESTIGATION',
      activeCases: 'Active Cases',
      caseId: 'CASE ID',
      status: 'STATUS',
      noCases: 'No active investigations found.',
      notes: 'Analyst Notes',
      evidence: 'Evidence Files',
      addNote: 'Add Investigation Note',
      saveNote: 'Save Notes',
      create: 'Create Case',
      cancel: 'Cancel',
      placeholderName: 'Case Title (e.g., Deepfake Campaign X)',
      linkedReports: 'Linked Forensic Reports',
      proBadge: 'PRO FEATURE',
      limitMsg: 'Free users are limited to 1 active investigation.'
    },
    hi: {
      title: 'जांच प्रबंधन',
      newCase: 'नई जांच शुरू करें',
      activeCases: 'सक्रिय मामले',
      caseId: 'केस आईडी',
      status: 'स्थिति',
      noCases: 'कोई सक्रिय जांच नहीं मिली।',
      notes: 'अन्वेषक नोट्स',
      evidence: 'सबूत फाइलें',
      addNote: 'जांच नोट जोड़ें',
      saveNote: 'नोट्स सहेजें',
      create: 'केस बनाएं',
      cancel: 'रद्द करें',
      placeholderName: 'केस का शीर्षक (जैसे, डीपफेक अभियान X)',
      linkedReports: 'लिंक्ड फोरेंसिक रिपोर्ट',
      proBadge: 'प्रो फीचर',
      limitMsg: 'निःशुल्क उपयोगकर्ता केवल 1 सक्रिय जांच तक सीमित हैं।'
    },
    mr: {
      title: 'तपास व्यवस्थापन',
      newCase: 'नवीन तपास',
      activeCases: 'सक्रिय प्रकरणे',
      caseId: 'केस आयडी',
      status: 'स्थिती',
      noCases: 'कोणतेही सक्रिय तपास आढळले नाहीत.',
      notes: 'विश्लेषक नोट्स',
      evidence: 'पुरावा फाइल्स',
      addNote: 'तपास नोट जोडा',
      saveNote: 'नोट्स जतन करा',
      create: 'केस तयार करा',
      cancel: 'रद्द करा',
      placeholderName: 'केस शीर्षक (उदा. डीपफेक मोहीम X)',
      linkedReports: 'लिंक्ड फॉरेन्सिक अहवाल',
      proBadge: 'प्रो फीचर',
      limitMsg: 'विनामूल्य वापरकर्ते केवळ १ सक्रिय तपासापर्यंत मर्यादित आहेत.'
    },
    ta: {
      title: 'புலனாய்வு மேலாண்மை',
      newCase: 'புதிய புலனாய்வு',
      activeCases: 'செயலில் உள்ள வழக்குகள்',
      caseId: 'வழக்கு ஐடி',
      status: 'நிலை',
      noCases: 'செயலில் உள்ள புலனாய்வுகள் எதுவும் இல்லை.',
      notes: 'பகுப்பாய்வாளர் குறிப்புகள்',
      evidence: 'ஆதார கோப்புகள்',
      addNote: 'புலனாய்வு குறிப்பைச் சேர்க்கவும்',
      saveNote: 'குறிப்புகளைச் சேமிக்கவும்',
      create: 'வழக்கை உருவாக்கு',
      cancel: 'ரத்துசெய்',
      placeholderName: 'வழக்கு தலைப்பு (எ.கா., டீப்ஃபேக் பிரச்சாரம் X)',
      linkedReports: 'இணைக்கப்பட்ட தடயவியல் அறிக்கைகள்',
      proBadge: 'புரோ அம்சம்',
      limitMsg: 'இலவச பயனர்கள் 1 செயலில் உள்ள புலனாய்வுக்கு மட்டுமே கட்டுப்படுத்தப்படுகிறார்கள்.'
    },
    bn: {
      title: 'তদন্ত ব্যবস্থাপনা',
      newCase: 'নতুন তদন্ত',
      activeCases: 'সক্রিয় মামলা',
      caseId: 'মামলা আইডি',
      status: 'স্থিতি',
      noCases: 'কোন সক্রিয় তদন্ত পাওয়া যায়নি।',
      notes: 'বিশ্লেষক নোট',
      evidence: 'প্রমাণ ফাইল',
      addNote: 'তদন্ত নোট যোগ করুন',
      saveNote: 'নোট সংরক্ষণ করুন',
      create: 'মামলা তৈরি করুন',
      cancel: 'বাতিল করুন',
      placeholderName: 'মামলার শিরোনাম (যেমন, ডিপফেক ক্যাম্পেইন X)',
      linkedReports: 'লিঙ্কযুক্ত ফরেনসিক রিপোর্ট',
      proBadge: 'প্রো ফিচার',
      limitMsg: 'বিনামূল্যে ব্যবহারকারীরা ১টি সক্রিয় তদন্তের মধ্যে সীমাবদ্ধ।'
    }
  }[language];

  useEffect(() => {
    const fetchCases = async () => {
      try {
        const res = await fetch('/api/cases');
        if (res.ok) {
          const data = await res.json();
          if (data.length > 0) {
            setCases(data);
          } else {
            const savedCases = localStorage.getItem('satya_cases');
            if (savedCases) setCases(JSON.parse(savedCases));
          }
        }
      } catch (err) {
        const savedCases = localStorage.getItem('satya_cases');
        if (savedCases) setCases(JSON.parse(savedCases));
      }
    };

    const savedReports = localStorage.getItem('satya_history');
    if (savedReports) setReports(JSON.parse(savedReports));
    
    fetchCases();
  }, []);

  const handleCreateCase = async () => {
    if (!newCaseName.trim()) return;
    const newCase: Case = {
      id: `CASE-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
      name: newCaseName,
      status: 'Open',
      createdAt: new Date().toISOString(),
      reportIds: [],
      description: ''
    };
    
    try {
      const res = await fetch('/api/cases', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCase)
      });
      if (res.ok) {
        const savedCase = await res.json();
        const updatedCases = [savedCase, ...cases];
        setCases(updatedCases);
        localStorage.setItem('satya_cases', JSON.stringify(updatedCases));
      }
    } catch (err) {
      const updatedCases = [newCase, ...cases];
      setCases(updatedCases);
      localStorage.setItem('satya_cases', JSON.stringify(updatedCases));
    }

    setIsCreating(false);
    setNewCaseName('');
    setActiveCase(newCase);
  };

  const handleSaveNotes = () => {
    if (!activeCase) return;
    const updatedCases = cases.map(c => 
      c.id === activeCase.id ? { ...c, description: note } : c
    );
    setCases(updatedCases);
    localStorage.setItem('satya_cases', JSON.stringify(updatedCases));
    toast.success(language === 'hi' ? 'नोट्स सहेजे गए' : 'Notes saved successfully');
  };

  useEffect(() => {
    if (activeCase) setNote(activeCase.description);
  }, [activeCase]);

  const linkedReports = reports.filter(r => activeCase?.reportIds.includes(r.id));

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-heading font-bold text-white mb-2">{t.title}</h2>
          <p className="text-zinc-500">{language === 'en' ? 'Track evidence across multiple forensic sessions.' : 'विभिन्न फोरेंसिक सत्रों में सबूत ट्रैक करें।'}</p>
        </div>
        <button 
          onClick={() => {
            if (!isPro && cases.length >= 1) {
              toast.error(t.limitMsg);
              return;
            }
            setIsCreating(true);
          }}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-black text-xs uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-blue-900/20 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          {t.newCase}
          {!isPro && cases.length >= 1 && (
            <span className="px-1.5 py-0.5 bg-amber-500 text-black text-[8px] font-black rounded uppercase">PRO</span>
          )}
        </button>
      </div>

      {isCreating && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-[2rem] p-8 animate-in zoom-in-95 duration-200">
          <h3 className="text-xl font-bold text-white mb-6">{t.newCase}</h3>
          <div className="space-y-4">
            <input 
              type="text" 
              value={newCaseName}
              onChange={(e) => setNewCaseName(e.target.value)}
              placeholder={t.placeholderName}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            />
            <div className="flex gap-4">
              <button onClick={handleCreateCase} className="flex-1 py-3 bg-blue-600 text-white font-bold rounded-xl">{t.create}</button>
              <button onClick={() => setIsCreating(false)} className="flex-1 py-3 bg-zinc-800 text-zinc-400 font-bold rounded-xl">{t.cancel}</button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-[2rem] p-6 h-[600px] flex flex-col">
            <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-6">{t.activeCases}</h3>
            <div className="space-y-3 overflow-y-auto pr-2 custom-scrollbar">
              {cases.length === 0 ? (
                <p className="text-zinc-600 text-xs text-center py-10 uppercase font-bold">{t.noCases}</p>
              ) : (
                cases.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setActiveCase(c)}
                    className={`w-full p-5 rounded-2xl border text-left transition-all group ${
                      activeCase?.id === c.id 
                      ? 'bg-blue-500/10 border-blue-500/30 shadow-lg shadow-blue-500/5' 
                      : 'bg-zinc-950 border-zinc-800 hover:border-zinc-700'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-[10px] font-mono text-blue-400">{c.id}</span>
                      <span className="text-[9px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 font-bold uppercase">{c.status}</span>
                    </div>
                    <h4 className="text-sm font-bold text-zinc-200 mb-1 truncate">{c.name}</h4>
                    <p className="text-[10px] text-zinc-500">{new Date(c.createdAt).toLocaleDateString()}</p>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="lg:col-span-8">
          {activeCase ? (
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-[2.5rem] p-10 space-y-10 min-h-[600px]">
              <div className="flex justify-between items-start border-b border-zinc-800 pb-8">
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-zinc-800 rounded-full border border-zinc-700 text-zinc-400 text-[10px] font-bold uppercase tracking-widest">
                    {t.caseId}: {activeCase.id}
                  </div>
                  <h3 className="text-3xl font-heading font-bold text-white">{activeCase.name}</h3>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-zinc-500 font-mono uppercase">Acquired: {new Date(activeCase.createdAt).toLocaleString()}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <section className="space-y-4">
                  <h4 className="text-xs font-black text-zinc-500 uppercase tracking-widest">{t.linkedReports} ({linkedReports.length})</h4>
                  <div className="space-y-3">
                    {linkedReports.length === 0 ? (
                      <div className="p-8 border-2 border-dashed border-zinc-800 rounded-3xl bg-zinc-950/50 text-center">
                        <p className="text-[10px] text-zinc-600 font-bold uppercase">{language === 'en' ? 'Navigate to Lab to generate and link reports' : 'रिपोर्ट जेनरेट और लिंक करने के लिए लैब पर जाएं'}</p>
                      </div>
                    ) : (
                      linkedReports.map(report => (
                        <div key={report.id} className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 flex justify-between items-center">
                          <div className="truncate pr-4">
                            <p className="text-xs font-bold text-zinc-300 truncate">{report.title}</p>
                            <p className="text-[9px] font-mono text-zinc-600">{report.id}</p>
                          </div>
                          <div className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${report.verdict === 'True' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
                            {report.verdict}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </section>

                <section className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="text-xs font-black text-zinc-500 uppercase tracking-widest">{t.notes}</h4>
                    <button onClick={handleSaveNotes} className="text-[10px] font-black text-blue-400 hover:text-blue-300 uppercase tracking-widest">{t.saveNote}</button>
                  </div>
                  <textarea 
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder={t.addNote}
                    className="w-full h-64 bg-zinc-950 border border-zinc-800 rounded-2xl p-5 text-sm text-zinc-300 focus:outline-none focus:ring-2 focus:ring-blue-500/30 resize-none font-medium leading-relaxed"
                  />
                </section>
              </div>
            </div>
          ) : (
            <div className="h-full border-2 border-dashed border-zinc-800 rounded-[2.5rem] flex flex-col items-center justify-center text-zinc-600 p-12 text-center min-h-[600px]">
              <div className="w-16 h-16 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center mb-4">
                <FolderOpen className="w-8 h-8" />
              </div>
              <p className="text-sm font-bold uppercase tracking-widest">{t.noCases}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
