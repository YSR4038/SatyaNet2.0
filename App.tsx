import React, { useState, useEffect, lazy, Suspense } from 'react';
import { Toaster, toast } from 'sonner';
import { Sidebar } from './components/Sidebar';
import { LiveThreatTicker } from './components/LiveThreatTicker';
import { ErrorBoundary } from './components/ErrorBoundary';
import { getIndexedItem, setIndexedItem } from './services/indexedDB';
import { Language, Case, AnalysisReport } from './types';
import { Loader2 } from 'lucide-react';

// Code-Splitting via React.lazy() (Specification Phase 1)
const Dashboard = lazy(() => import('./components/Dashboard').then(m => ({ default: m.Dashboard })));
const ForensicTools = lazy(() => import('./components/ForensicTools').then(m => ({ default: m.ForensicTools })));
const DharmaBot = lazy(() => import('./components/DharmaBot').then(m => ({ default: m.DharmaBot })));
const ForensicAcademy = lazy(() => import('./components/ForensicAcademy').then(m => ({ default: m.ForensicAcademy })));
const CaseManagement = lazy(() => import('./components/CaseManagement').then(m => ({ default: m.CaseManagement })));
const AnalysisResult = lazy(() => import('./components/AnalysisResult').then(m => ({ default: m.AnalysisResult })));
const PaymentModal = lazy(() => import('./components/PaymentModal').then(m => ({ default: m.PaymentModal })));
const SolutionProposal = lazy(() => import('./components/SolutionProposal').then(m => ({ default: m.SolutionProposal })));

const defaultCases: Case[] = [
  {
    id: "case_delhi_relay_audit",
    title: "Delhi Subnet Relay Audits",
    description: "Inspecting digital relays, suspicious email relay nodes and TLD domains in Delhi Sector.",
    status: "open",
    timestamp: new Date().toISOString(),
    notes: "Commencing Satya auditing regimes. Checking SSL levels, DKIM alignments, spoofing traces, and neural face warp parameters as required.",
    reports: []
  }
];

// Aesthetic full-page skeleton fallback loader for Suspense bundles
const TelemetryLoader: React.FC = () => (
  <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4 p-8 min-h-[350px] animate-pulse select-none bg-black/10">
    <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
    <span className="text-[10px] font-mono font-black text-zinc-500 uppercase tracking-[0.3em]">
      SECURE_DHARMA_NODE_RESOLVING...
    </span>
  </div>
);

export default function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'tools' | 'dharma' | 'investigations' | 'report' | 'academy' | 'proposal'>('dashboard');
  const [language, setLanguage] = useState<Language>('en');
  const [currentReport, setCurrentReport] = useState<AnalysisReport | null>(null);
  const [isPro, setIsPro] = useState<boolean>(false);
  const [showPaymentModal, setShowPaymentModal] = useState<boolean>(false);
  
  // Case heaps indexedDB database synchronizations (Specification Phase 3)
  const [cases, setCases] = useState<Case[]>([]);
  const [activeCaseId, setActiveCaseId] = useState<string | null>(null);

  // Initialize and migrate data from LocalStorage to IndexedDB
  useEffect(() => {
    async function loadIndexedStore() {
      // Graceful retrieval with direct backward-compatible localstorage recovery embedded inside getIndexedItem!
      const storeCases = await getIndexedItem<Case[]>('satya_cases', defaultCases);
      setCases(storeCases);
      if (storeCases.length > 0) {
        setActiveCaseId(storeCases[0].id);
      }
    }
    loadIndexedStore();
  }, []);

  // Sync pro licenses locally via indexDB too
  useEffect(() => {
    async function loadProConfig() {
      const isProActive = await getIndexedItem<boolean>('satya_pro_regime', false);
      setIsPro(isProActive);
    }
    loadProConfig();
  }, []);

  // Synchronize case ledger state changes to transaction-safe IndexedDB automatically (Specification Phase 3)
  useEffect(() => {
    if (cases.length > 0) {
      setIndexedItem('satya_cases', cases);
    }
  }, [cases]);

  const handleUpgradeSuccess = async () => {
    setIsPro(true);
    await setIndexedItem<boolean>('satya_pro_regime', true);
    setShowPaymentModal(false);
    toast.success(language === 'hi' ? 'लाइसेंस अपग्रेड किया गया' : 'Vedic Satya-Net PRO licenses committed successfully.');
  };

  // Callback when a forensic module successfully compiles an Analysis Report
  const handleAnalysisSuccess = (report: AnalysisReport) => {
    setCurrentReport(report);
    setActiveTab('report'); // swap UI tab index to active diagnostics viewport

    // Auto append reports directly to selected case dossiers
    if (activeCaseId) {
      setCases(prev => {
        const updated = prev.map(c => {
          if (c.id === activeCaseId) {
            const exists = c.reports.some(r => r.id === report.id);
            if (!exists) {
              return { ...c, reports: [report, ...c.reports] };
            }
          }
          return c;
        });
        return updated;
      });
      toast.success(language === 'hi' ? 'साक्ष्य सक्रिय केस से जुड़ा' : 'Forensic report linked to active investigative case ledger.');
    }
  };

  return (
    <div className="flex h-screen w-screen bg-[#0a0a0b] text-zinc-100 overflow-hidden font-sans select-none selection:bg-blue-600/30">
      <Toaster position="top-right" theme="dark" />
      
      {/* 1. Master Navigation Command Bar */}
      <Sidebar 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        language={language}
        setLanguage={setLanguage}
        isPro={isPro}
        onUpgradeClick={() => setShowPaymentModal(true)}
      />

      {/* 2. Main content telemetry stream viewport */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden bg-gradient-to-b from-[#0a0a0b] via-[#0d0d0f] to-[#0c0c0e]">
        {/* Continuous network threat audit log streaming ticker */}
        <LiveThreatTicker language={language} />

        {/* Suspense Container paired with dynamic Sandboxed Error Boundaries (Specification Phase 1 & 4) */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <Suspense fallback={<TelemetryLoader />}>
            {activeTab === 'dashboard' && (
              <ErrorBoundary fallbackTitle="Cognitive CommandCenter fault" onReset={() => setActiveTab('dashboard')}>
                <Dashboard 
                  language={language}
                  onNavigateToTools={() => setActiveTab('tools')}
                  recentReports={cases.flatMap(c => c.reports).slice(0, 5)}
                  viewReport={(report) => {
                    setCurrentReport(report);
                    setActiveTab('report');
                  }}
                  isPro={isPro}
                  onUpgradeClick={() => setShowPaymentModal(true)}
                />
              </ErrorBoundary>
            )}

            {activeTab === 'tools' && (
              <ErrorBoundary fallbackTitle="Digital evidence sandbox isolated" onReset={() => setActiveTab('tools')}>
                <ForensicTools 
                  language={language}
                  onAnalysisSuccess={handleAnalysisSuccess}
                  isPro={isPro}
                />
              </ErrorBoundary>
            )}

            {activeTab === 'dharma' && (
              <ErrorBoundary fallbackTitle="Neural dharma interface isolated" onReset={() => setActiveTab('dharma')}>
                <DharmaBot language={language} />
              </ErrorBoundary>
            )}

            {activeTab === 'academy' && (
              <ErrorBoundary fallbackTitle="Forensic academy virtual learning isolated" onReset={() => setActiveTab('academy')}>
                <ForensicAcademy language={language} />
              </ErrorBoundary>
            )}

            {activeTab === 'proposal' && (
              <ErrorBoundary fallbackTitle="Solution proposal interface isolated" onReset={() => setActiveTab('proposal')}>
                <SolutionProposal language={language} />
              </ErrorBoundary>
            )}

            {activeTab === 'investigations' && (
              <ErrorBoundary fallbackTitle="Dossier ledger synchronization crash" onReset={() => setActiveTab('investigations')}>
                <CaseManagement 
                  language={language}
                  cases={cases}
                  setCases={setCases}
                  activeCaseId={activeCaseId}
                  setActiveCaseId={setActiveCaseId}
                  isPro={isPro}
                  onUpgradeClick={() => setShowPaymentModal(true)}
                />
              </ErrorBoundary>
            )}

            {activeTab === 'report' && currentReport && (
              <ErrorBoundary fallbackTitle="Forensic transcript renderer isolation" onReset={() => setActiveTab('tools')}>
                <AnalysisResult 
                  language={language}
                  report={currentReport}
                  onClose={() => setActiveTab('tools')}
                  cases={cases}
                  setCases={setCases}
                  activeCaseId={activeCaseId}
                />
              </ErrorBoundary>
            )}
          </Suspense>
        </div>
      </main>

      {/* Licensing Pro Upgrade billing gateway modal */}
      <Suspense fallback={null}>
        <PaymentModal 
          language={language}
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          onSuccess={handleUpgradeSuccess}
        />
      </Suspense>
    </div>
  );
}
