export type Language = 'en' | 'hi' | 'mr' | 'ta' | 'bn' | 'es' | 'de' | 'fr' | 'ja' | 'ru' | 'ar';

export interface AnalysisReport {
  id: string;
  type: 'url' | 'email' | 'ela' | 'video' | 'neural' | 'apk' | 'mule';
  status: 'verified' | 'suspicious' | 'flagged';
  title: string;
  timestamp: string;
  score: number; // Integrity Score (0-100) or Threat Index
  details: string;
  findings: string[];
  recommendations: string[];
  metadata?: any; // To store advanced forensics metrics (Traceroutes, coordinates, offsets)
  // Money Mule extra fields
  features?: any[];
  targetValue?: number;
  targetValueProbability?: number;
  recommAction?: string;
}

export interface Case {
  id: string;
  title: string;
  description: string;
  status: 'open' | 'closed';
  timestamp: string;
  notes: string;
  reports: AnalysisReport[];
}

export interface DharmaMessage {
  id: string;
  sender: 'user' | 'dharma';
  text: string;
  timestamp: string;
}
