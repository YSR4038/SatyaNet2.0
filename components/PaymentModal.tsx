import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Language } from '../App';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpgrade: (plan: string) => void;
  language: Language;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose, onUpgrade, language }) => {
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const t = {
    en: {
      title: 'Satya Pro',
      subtitle: 'Advanced forensic intelligence platform.',
      trial: '7-Day Alpha Trial',
      trialDesc: 'Full access to all modules. Zero commitment.',
      monthly: 'Monthly Access',
      halfYearly: 'Guardian Plan',
      yearly: 'Sentinel Annual',
      select: 'Select Plan',
      checkout: 'Secure Terminal',
      payNow: 'Confirm Acquisition',
      cardHolder: 'Identity Name',
      cardNumber: 'Quantum Signature (Card)',
      expiry: 'EXP',
      cvv: 'CVV',
      upi: 'UPI Alias',
      processing: 'Authenticating Transaction...',
      features: [
        '4K Deepfake Neural Analysis',
        'Blockchain Ledger Immutability',
        'Priority Computational Queue',
        'Direct Dharma Expert Access',
        'Bulk Forensic Processing'
      ]
    },
    hi: {
      title: 'सत्य प्रो',
      subtitle: 'उन्नत फोरेंसिक इंटेलिजेंस प्लेटफॉर्म।',
      trial: '7-दिवसीय अल्फा परीक्षण',
      trialDesc: 'सभी मॉड्यूल तक पूर्ण पहुंच। शून्य प्रतिबद्धता।',
      monthly: 'मासिक पहुंच',
      halfYearly: 'अभिभावक योजना',
      yearly: 'सेंटिनल वार्षिक',
      select: 'योजना चुनें',
      checkout: 'सुरक्षित टर्मिनल',
      payNow: 'अधिग्रहण की पुष्टि करें',
      cardHolder: 'पहचान का नाम',
      cardNumber: 'क्वांटम सिग्नेचर (कार्ड)',
      expiry: 'समाप्ति',
      cvv: 'CVV',
      upi: 'UPI उपनाम',
      processing: 'लेनदेन प्रमाणित हो रहा है...',
      features: [
        '4K डीपफेक न्यूरल विश्लेषण',
        'ब्लॉकचेन लेजर अपरिवर्तनीयता',
        'प्राथमिकता गणना कतार',
        'प्रत्यक्ष धर्म विशेषज्ञ पहुंच',
        'थोक फोरेंसिक प्रसंस्करण'
      ]
    },
    mr: {
      title: 'सत्य प्रो',
      subtitle: 'प्रगत फॉरेन्सिक इंटेलिजेंस प्लॅटफॉर्म.',
      trial: '७-दिवसीय अल्फा चाचणी',
      trialDesc: 'सर्व मॉड्यूल्समध्ये पूर्ण प्रवेश. शून्य वचनबद्धता.',
      monthly: 'मासिक प्रवेश',
      halfYearly: 'पालक योजना',
      yearly: 'सेंटिनल वार्षिक',
      select: 'योजना निवडा',
      checkout: 'सुरक्षित टर्मिनल',
      payNow: 'प्राप्तीची पुष्टी करा',
      cardHolder: 'ओळख नाव',
      cardNumber: 'क्वांटम सिग्नेचर (कार्ड)',
      expiry: 'EXP',
      cvv: 'CVV',
      upi: 'UPI टोपणनाव',
      processing: 'व्यवहार प्रमाणित होत आहे...',
      features: [
        '4K डीपफेक न्यूरल विश्लेषण',
        'ब्लॉकचेन लेजर अपरिवर्तनीयता',
        'प्राधान्य गणना रांग',
        'थेट धर्म तज्ञ प्रवेश',
        'मोठ्या प्रमाणात फॉरेन्सिक प्रक्रिया'
      ]
    },
    ta: {
      title: 'சத்யா புரோ',
      subtitle: 'மேம்பட்ட தடயவியல் நுண்ணறிவு தளம்.',
      trial: '7-நாள் ஆல்பா சோதனை',
      trialDesc: 'அனைத்து தொகுதிகளுக்கும் முழு அணுகல். பூஜ்ஜிய அர்ப்பணிப்பு.',
      monthly: 'மாதாந்திர அணுகல்',
      halfYearly: 'கார்டியன் திட்டம்',
      yearly: 'செண்டினல் ஆண்டு',
      select: 'திட்டத்தைத் தேர்ந்தெடுக்கவும்',
      checkout: 'பாதுகாப்பான முனையம்',
      payNow: 'கையகப்படுத்துதலை உறுதிப்படுத்தவும்',
      cardHolder: 'அடையாளப் பெயர்',
      cardNumber: 'குவாண்டம் கையொப்பம் (அட்டை)',
      expiry: 'காலாவதி',
      cvv: 'CVV',
      upi: 'UPI மாற்றுப்பெயர்',
      processing: 'பரிவர்த்தனை அங்கீகரிக்கப்படுகிறது...',
      features: [
        '4K டீப்ஃபேக் நியூரல் பகுப்பாய்வு',
        'பிளாக்செயின் லெட்ஜர் மாற்றமின்மை',
        'முன்னுரிமை கணக்கீட்டு வரிசை',
        'நேரடி தர்ம நிபுணர் அணுகல்',
        'மொத்த தடயவியல் செயலாக்கம்'
      ]
    },
    bn: {
      title: 'সত্য প্রো',
      subtitle: 'উন্নত ফরেনসিক ইন্টেলিজেন্স প্ল্যাটফর্ম।',
      trial: '৭-দিনের আলফা ট্রায়াল',
      trialDesc: 'সব মডিউলে পূর্ণ অ্যাক্সেস। কোনো প্রতিশ্রুতি নেই।',
      monthly: 'মাসিক অ্যাক্সেস',
      halfYearly: 'গার্ডিয়ান প্ল্যান',
      yearly: 'সেন্টিনেল বার্ষিক',
      select: 'প্ল্যান নির্বাচন করুন',
      checkout: 'সুরক্ষিত টার্মিনাল',
      payNow: 'অধিগ্রহণ নিশ্চিত করুন',
      cardHolder: 'পরিচয় নাম',
      cardNumber: 'কোয়ান্টাম সিগনেচার (কার্ড)',
      expiry: 'মেয়াদ',
      cvv: 'CVV',
      upi: 'UPI ডাকনাম',
      processing: 'লেনদেন যাচাই করা হচ্ছে...',
      features: [
        '4K ডিপফেক নিউরাল বিশ্লেষণ',
        'ব্লকচেইন লেজার অপরিবর্তনীয়তা',
        'অগ্রাধিকার গণনা সারি',
        'সরাসরি ধর্ম বিশেষজ্ঞ অ্যাক্সেস',
        'বাল্ক ফরেনসিক প্রক্রিয়াকরণ'
      ]
    }
  }[language];

  const plans = [
    { id: 'trial', name: t.trial, price: '₹0', period: '7 days', desc: t.trialDesc, color: 'from-blue-500/20 to-indigo-500/20', border: 'border-blue-500/30' },
    { id: 'monthly', name: t.monthly, price: '₹5,000', period: '/ mo', desc: 'Full-tier investigative access', color: 'from-zinc-800/50 to-zinc-900/50', border: 'border-zinc-800' },
    { id: 'halfYearly', name: t.halfYearly, price: '₹28,000', period: '/ 6m', desc: 'Preferred forensic partner', color: 'from-zinc-800/50 to-zinc-900/50', border: 'border-zinc-800' },
    { id: 'yearly', name: t.yearly, price: '₹50,000', period: '/ yr', desc: 'Elite institutional status', color: 'from-emerald-500/20 to-teal-500/20', border: 'border-emerald-500/30', recommended: true },
  ];

  const handlePayment = async () => {
    setIsProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 2500));
    onUpgrade(selectedPlan.id);
    setIsProcessing(false);
    setSelectedPlan(null);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 bg-black/40 backdrop-blur-md">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 cursor-pointer"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.98, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: 10 }}
            className="relative w-full h-full sm:h-auto max-w-5xl bg-zinc-900 border-x sm:border border-zinc-800 shadow-2xl overflow-hidden sm:rounded-[2rem] flex flex-col md:flex-row"
          >
            {/* Sidebar with Features - Hidden on very small screens, visible on md+ */}
            <div className="hidden lg:flex w-full lg:w-80 bg-zinc-950 p-8 flex-col border-r border-zinc-800 shrink-0">
              <div className="mb-10">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20 mb-4">
                  <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                </div>
                <h2 className="text-2xl font-heading font-black text-white italic">SATYA<span className="text-blue-500">PRO</span></h2>
                <p className="text-zinc-500 text-xs mt-1 uppercase tracking-widest font-bold">{t.subtitle}</p>
              </div>

              <div className="space-y-6">
                {t.features.map((f, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="mt-1 shrink-0 w-4 h-4 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                      <svg className="w-2 h-2 text-emerald-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                    </div>
                    <span className="text-[11px] font-medium text-zinc-400 leading-tight">{f}</span>
                  </div>
                ))}
              </div>

              <div className="mt-auto pt-10">
                <div className="p-4 rounded-2xl bg-zinc-900/50 border border-zinc-800">
                  <p className="text-[10px] text-zinc-500 leading-normal italic">"Authentication is the bedrock of civilization in the age of synthesis." - Forensic Manual</p>
                </div>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-h-0 bg-zinc-900">
              {/* Header for Mobile/Plan Selection */}
              <div className="p-6 sm:p-8 flex items-center justify-between border-b border-zinc-800 shrink-0">
                <div>
                  <h3 className="text-lg font-bold text-white uppercase tracking-wider">{selectedPlan ? t.checkout : t.select}</h3>
                  <p className="text-xs text-zinc-500 font-mono">ID: {Math.random().toString(36).substring(7).toUpperCase()}-PT</p>
                </div>
                <button onClick={onClose} className="p-2 text-zinc-500 hover:text-white transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 sm:p-8 custom-scrollbar">
                <AnimatePresence mode="wait">
                  {!selectedPlan ? (
                    <motion.div
                      key="plans-grid"
                      initial={{ opacity: 0, scale: 0.99 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.99 }}
                      className="grid grid-cols-1 md:grid-cols-2 gap-4"
                    >
                      {plans.map((plan) => (
                        <button
                          key={plan.id}
                          onClick={() => setSelectedPlan(plan)}
                          className={`group relative p-6 rounded-3xl border text-left transition-all hover:border-zinc-500 hover:bg-zinc-950 flex flex-col justify-between min-h-[160px] overflow-hidden ${plan.border} bg-zinc-900/50`}
                        >
                          <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${plan.color} blur-3xl opacity-20 group-hover:opacity-40 transition-opacity`} />
                          
                          <div className="relative z-10">
                            <div className="flex justify-between items-start mb-4">
                              <div className="space-y-1">
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 group-hover:text-zinc-300">{plan.name}</span>
                                {plan.recommended && (
                                  <div className="px-2 py-0.5 bg-emerald-500 text-black text-[8px] font-black uppercase rounded-full w-fit">RECOMMENDED</div>
                                )}
                              </div>
                              <div className="text-right">
                                <p className="text-2xl font-heading font-black text-white">{plan.price}</p>
                                <p className="text-[10px] text-zinc-500 font-bold">{plan.period}</p>
                              </div>
                            </div>
                            <p className="text-[11px] text-zinc-400 font-medium leading-relaxed max-w-[80%]">{plan.desc}</p>
                          </div>

                          <div className="relative z-10 pt-4 flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-zinc-500 group-hover:text-white transition-colors">
                            {t.select}
                            <svg className="w-3 h-3 translate-x-0 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                          </div>
                        </button>
                      ))}
                    </motion.div>
                  ) : (
                    <motion.div
                      key="checkout-form"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="max-w-2xl mx-auto space-y-8"
                    >
                      <div className="flex items-center justify-between">
                        <button 
                          onClick={() => setSelectedPlan(null)}
                          className="flex items-center gap-2 text-[10px] font-black text-zinc-500 hover:text-white uppercase tracking-widest transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                          Change Protocol
                        </button>
                        <div className="px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-2xl flex items-center gap-3">
                           <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                           <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">{selectedPlan.name} • {selectedPlan.price}</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest ml-1">{t.cardHolder}</label>
                          <input type="text" className="w-full bg-zinc-950 border border-zinc-800 focus:border-blue-500/50 rounded-2xl p-4 text-white text-sm outline-none transition-all" placeholder="SATYA INVESTIGATOR" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest ml-1">{t.cardNumber}</label>
                          <input type="text" className="w-full bg-zinc-950 border border-zinc-800 focus:border-blue-500/50 rounded-2xl p-4 text-white text-sm outline-none transition-all font-mono" placeholder="0000 0000 0000 0000" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest ml-1">{t.expiry}</label>
                            <input type="text" className="w-full bg-zinc-950 border border-zinc-800 focus:border-blue-500/50 rounded-2xl p-4 text-white text-sm outline-none transition-all font-mono" placeholder="MM/YY" />
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest ml-1">{t.cvv}</label>
                            <input type="password" maxLength={3} className="w-full bg-zinc-950 border border-zinc-800 focus:border-blue-500/50 rounded-2xl p-4 text-white text-sm outline-none transition-all font-mono" placeholder="***" />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest ml-1">{t.upi}</label>
                          <input type="text" className="w-full bg-zinc-950 border border-zinc-800 focus:border-blue-500/50 rounded-2xl p-4 text-white text-sm outline-none transition-all" placeholder="user@satya" />
                        </div>
                      </div>

                      <button
                        onClick={handlePayment}
                        disabled={isProcessing}
                        className="w-full group py-5 bg-white text-black font-black rounded-2xl transition-all hover:bg-zinc-200 disabled:opacity-50 overflow-hidden relative"
                      >
                        <div className="absolute inset-0 bg-blue-500 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                        <span className="relative z-10 flex items-center justify-center gap-3 text-xs uppercase tracking-[0.2em] group-hover:text-white transition-colors">
                          {isProcessing ? (
                            <>
                              <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              {t.processing}
                            </>
                          ) : (
                            <>
                              {t.payNow}
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                            </>
                          )}
                        </span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Footer */}
              <div className="p-6 border-t border-zinc-800 bg-zinc-950/50 shrink-0">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                  <div className="flex items-center gap-4 text-[9px] font-bold text-zinc-600 uppercase tracking-widest">
                    <span className="flex items-center gap-1"><svg className="w-3 h-3 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg> 256-BIT SSL</span>
                    <span>PCI DSS COMPLIANT</span>
                  </div>
                  <button onClick={onClose} className="text-[10px] font-black text-zinc-500 hover:text-white uppercase tracking-[0.2em] transition-colors">{language === 'hi' ? 'शायद बाद में' : 'LATENCY MODE (LATER)'}</button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
