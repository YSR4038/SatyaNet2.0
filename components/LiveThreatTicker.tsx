import React, { useState, useEffect } from 'react';
import { Language } from '../App';

interface Threat {
  id: string;
  type: string;
  target: string;
  origin: string;
  severity: 'Critical' | 'High' | 'Medium';
}

interface LiveThreatTickerProps {
  language?: Language;
}

export const LiveThreatTicker: React.FC<LiveThreatTickerProps> = ({ language = 'en' }) => {
  const [threats, setThreats] = useState<Threat[]>([]);

  const t = {
    en: {
      feed: 'Live Threat Feed',
      target: 'Target',
      origin: 'Origin',
      vulnerabilities: 'Vulnerabilities: 14,281 Detected Today'
    },
    hi: {
      feed: 'लाइव थ्रेट फीड',
      target: 'लक्ष्य',
      origin: 'उत्पत्ति',
      vulnerabilities: 'कमियां: आज 14,281 पाई गईं'
    },
    mr: {
      feed: 'थेट धोका फीड',
      target: 'लक्ष्य',
      origin: 'मूळ',
      vulnerabilities: 'असुरक्षितता: आज १४,२८१ आढळल्या'
    },
    ta: {
      feed: 'நேரடி அச்சுறுத்தல் ஊட்டம்',
      target: 'இலக்கு',
      origin: 'மூலம்',
      vulnerabilities: 'பாதிப்புகள்: இன்று 14,281 கண்டறியப்பட்டுள்ளன'
    },
    bn: {
      feed: 'লাইভ থ্রেট ফিড',
      target: 'লক্ষ্য',
      origin: 'উৎস',
      vulnerabilities: 'দুর্বলতা: আজ ১৪,২৮১টি শনাক্ত করা হয়েছে'
    }
  }[language];

  useEffect(() => {
    const realThreats = [
      { type: 'APT28 Webhook Malware', target: 'European Entities', origin: 'Russia', severity: 'Critical' },
      { type: 'Wormable XMRig Campaign', target: 'Crypto Infrastructure', origin: 'Unknown', severity: 'High' },
      { type: 'Malicious npm Packages', target: 'CI/CD Pipelines', origin: 'Global', severity: 'Critical' },
      { type: 'OpenClaw RCE Exploit', target: '21K Exposed Instances', origin: 'Unknown', severity: 'High' },
      { type: 'MuddyWater GhostFetch', target: 'MENA Organizations', origin: 'Iran', severity: 'High' },
      { type: 'FortiGate AI Compromise', target: '600+ Devices', origin: 'Unknown', severity: 'Critical' },
      { type: 'Roundcube KEV Flaws', target: 'Email Servers', origin: 'Global', severity: 'High' },
      { type: 'BeyondTrust Web Shells', target: 'Enterprise Systems', origin: 'Unknown', severity: 'Critical' }
    ];
    
    const generateThreat = () => {
      const base = realThreats[Math.floor(Math.random() * realThreats.length)];
      return {
        ...base,
        id: Math.random().toString(36).substr(2, 6).toUpperCase(),
        severity: base.severity as any
      };
    };

    setThreats(Array.from({ length: 8 }, generateThreat));

    const interval = setInterval(() => {
      setThreats(prev => [generateThreat(), ...prev.slice(0, 7)]);
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full bg-zinc-950/80 border-b border-zinc-800/50 backdrop-blur-sm overflow-hidden h-8 flex items-center">
      <div className="flex-shrink-0 px-4 h-full flex items-center bg-rose-500/10 border-r border-rose-500/20">
        <span className="text-[10px] font-black text-rose-500 uppercase tracking-tighter flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></span>
          {t.feed}
        </span>
      </div>
      <div className="flex-1 overflow-hidden relative">
        <div className="flex animate-[marquee_60s_linear_infinite] whitespace-nowrap gap-12 items-center">
          {threats.map((t_item) => (
            <div key={t_item.id} className="flex items-center gap-3 text-[10px] font-mono">
              <span className="text-zinc-600">[{new Date().toLocaleTimeString()}]</span>
              <span className={t_item.severity === 'Critical' ? 'text-rose-500 font-bold' : t_item.severity === 'High' ? 'text-amber-500' : 'text-blue-500'}>
                {t_item.type}
              </span>
              <span className="text-zinc-400">{t.target}: {t_item.target}</span>
              <span className="text-zinc-700">{t.origin}: {t_item.origin}</span>
              <span className="text-zinc-800">/</span>
            </div>
          ))}
        </div>
      </div>
      <div className="flex-shrink-0 px-4 h-full flex items-center bg-zinc-900 border-l border-zinc-800">
        <span className="text-[9px] font-bold text-zinc-500 uppercase">{t.vulnerabilities}</span>
      </div>
    </div>
  );
};
