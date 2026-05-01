
import React, { useState, useEffect } from 'react';
import { Dashboard } from './components/Dashboard';
import { AnalysisResult } from './components/AnalysisResult';
import { DharmaBot } from './components/DharmaBot';
import { ForensicTools } from './components/ForensicTools';
import { Sidebar } from './components/Sidebar';
import { CaseManagement } from './components/CaseManagement';
import { AnalysisReport } from './types';
import { PaymentModal } from './components/PaymentModal';
import { LiveThreatTicker } from './components/LiveThreatTicker';
import { Toaster } from 'sonner';

export type Language = 'en' | 'hi' | 'mr' | 'ta' | 'bn';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'tools' | 'dharma' | 'report' | 'investigations'>('dashboard');
  const [currentReport, setCurrentReport] = useState<AnalysisReport | null>(null);
  const [language, setLanguage] = useState<Language>('en');
  const [backendStatus, setBackendStatus] = useState<'online' | 'offline'>('online');
  const [isPro, setIsPro] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  useEffect(() => {
    const savedPro = localStorage.getItem('satya_pro');
    if (savedPro === 'true') setIsPro(true);
  }, []);

  const handleUpgrade = (plan: string) => {
    console.log(`Upgrading to ${plan}`);
    setIsPro(true);
    localStorage.setItem('satya_pro', 'true');
    setShowPaymentModal(false);
  };

  const handleDowngrade = () => {
    setIsPro(false);
    localStorage.setItem('satya_pro', 'false');
  };

  const handleReportGenerated = (report: AnalysisReport) => {
    setCurrentReport(report);
    setActiveTab('report');
  };

  return (
    <div className="flex min-h-screen bg-[#0a0a0b] selection:bg-blue-500/30">
      <Toaster position="top-right" theme="dark" />
      <Sidebar 
        activeTab={activeTab === 'report' ? 'dashboard' : activeTab as any} 
        setActiveTab={setActiveTab} 
        language={language} 
        setLanguage={setLanguage} 
        isPro={isPro}
        onUpgradeClick={() => setShowPaymentModal(true)}
        onDowngrade={handleDowngrade}
      />
      
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <LiveThreatTicker language={language} />
        <header className="h-16 border-b border-zinc-800 flex items-center justify-between px-8 bg-[#0a0a0b]/80 backdrop-blur-md z-10 sticky top-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg satya-gradient flex items-center justify-center shadow-lg shadow-blue-500/20">
              <span className="font-heading font-bold text-white text-lg">S</span>
            </div>
            <h1 className="font-heading text-xl font-bold tracking-tight text-white">
              Satya Net <span className="text-zinc-500 font-normal text-sm ml-2">v3.0.0-PRO</span>
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <div className={`flex items-center gap-2 px-3 py-1 bg-zinc-900 border border-zinc-800 rounded-full`}>
              <div className={`w-2 h-2 rounded-full ${backendStatus === 'online' ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`}></div>
              <span className={`text-[10px] font-bold uppercase tracking-widest ${backendStatus === 'online' ? 'text-emerald-400' : 'text-rose-400'}`}>
                {backendStatus === 'online' 
                  ? {
                      en: 'Blockchain Ledger Linked',
                      hi: 'ब्लॉकचेन लेजर लिंक किया गया',
                      mr: 'ब्लॉकचेन लेजर लिंक केले',
                      ta: 'பிளாக்செயின் லெட்ஜர் இணைக்கப்பட்டது',
                      bn: 'ব্লকচেইন লেজার সংযুক্ত'
                    }[language]
                  : {
                      en: 'Ledger Offline',
                      hi: 'लेजर ऑफलाइन',
                      mr: 'लेजर ऑफलाइन',
                      ta: 'லெட்ஜர் ஆஃப்லைன்',
                      bn: 'লেজার অফলাইন'
                    }[language]}
              </span>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8 max-w-7xl mx-auto w-full">
          {activeTab === 'dashboard' && (
            <Dashboard onAnalysisComplete={handleReportGenerated} language={language} isPro={isPro} />
          )}
          {activeTab === 'tools' && (
            <ForensicTools language={language} isPro={isPro} />
          )}
          {activeTab === 'dharma' && (
            <DharmaBot language={language} />
          )}
          {activeTab === 'investigations' && (
            <CaseManagement language={language} isPro={isPro} />
          )}
          {activeTab === 'report' && currentReport && (
            <AnalysisResult report={currentReport} onBack={() => setActiveTab('dashboard')} language={language} />
          )}
        </div>

        <PaymentModal 
          isOpen={showPaymentModal} 
          onClose={() => setShowPaymentModal(false)} 
          onUpgrade={handleUpgrade}
          language={language}
        />
      </main>
    </div>
  );
};

export default App;
