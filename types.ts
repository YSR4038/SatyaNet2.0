
export interface GroundingChunk {
  web?: {
    uri: string;
    title: string;
  };
}

export interface AnalysisReport {
  id: string;
  hash: string;
  timestamp: string;
  title: string;
  source?: string;
  satyaScore: number;
  verdict: 'True' | 'Misleading' | 'False' | 'Inconclusive';
  summary: string;
  reasoning: string[];
  forensicDetails: {
    languageManipulation?: number;
    sourceReliability?: number;
    biasLevel?: number;
    metadataStatus?: 'Clean' | 'Modified' | 'Unknown';
    exifData?: Record<string, string>;
    tamperingDetected?: boolean;
    aiGeneratedProbability?: number;
  };
  groundingLinks?: GroundingChunk[];
  dharmaTip: string;
  type: 'Text' | 'Image' | 'Phishing' | 'Correlation';
  caseId?: string;
  analystNotes?: string;
}

export interface Case {
  id: string;
  name: string;
  status: 'Open' | 'Verified' | 'Archived';
  createdAt: string;
  reportIds: string[];
  description: string;
}

export interface ForensicMetadata {
  filename: string;
  size: string;
  type: string;
  lastModified: string;
  hash: string;
}
