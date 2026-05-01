
import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisReport, GroundingChunk } from "../types";

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeText = async (text: string, language: 'en' | 'hi' | 'mr' | 'ta' | 'bn' = 'en'): Promise<AnalysisReport> => {
  const ai = getAI();
  const model = "gemini-3.1-pro-preview";

  const langMap: Record<string, string> = {
    hi: 'Hindi',
    mr: 'Marathi',
    ta: 'Tamil',
    bn: 'Bengali',
    en: 'English'
  };

  const response = await ai.models.generateContent({
    model,
    contents: text,
    config: {
      systemInstruction: `You are a world-class digital forensics investigator at Satya Net. 
      Analyze the provided content for truthfulness. If the content is in ${langMap[language]}, analyze it accordingly.
      Provide the final report in ${langMap[language]}.
      Use Google Search to verify claims.
      
      Output Schema:
      - satyaScore: 0-100.
      - verdict: True, Misleading, False, or Inconclusive.
      - reasoning: List of 3-5 points.
      - dharmaTip: An ethical wisdom based guideline.`,
      tools: [{ googleSearch: {} }],
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          satyaScore: { type: Type.NUMBER },
          verdict: { type: Type.STRING },
          summary: { type: Type.STRING },
          reasoning: { type: Type.ARRAY, items: { type: Type.STRING } },
          languageManipulation: { type: Type.NUMBER },
          sourceReliability: { type: Type.NUMBER },
          biasLevel: { type: Type.NUMBER },
          dharmaTip: { type: Type.STRING }
        },
        required: ["satyaScore", "verdict", "summary", "reasoning", "dharmaTip"]
      }
    }
  });

  const data = JSON.parse(response.text || "{}");
  const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks as GroundingChunk[] | undefined;

  const encoder = new TextEncoder();
  const dataToHash = encoder.encode(text + Date.now());
  const hashBuffer = await crypto.subtle.digest('SHA-256', dataToHash);
  const hashHex = Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');

  return {
    id: `SN-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
    hash: hashHex,
    timestamp: new Date().toISOString(),
    title: text.length > 60 ? text.substring(0, 60) + "..." : text,
    satyaScore: data.satyaScore,
    verdict: data.verdict as any,
    summary: data.summary,
    reasoning: data.reasoning,
    forensicDetails: {
      languageManipulation: data.languageManipulation,
      sourceReliability: data.sourceReliability,
      biasLevel: data.biasLevel,
    },
    groundingLinks: groundingChunks,
    dharmaTip: data.dharmaTip,
    type: 'Text'
  };
};

export const analyzeImage = async (base64Image: string, fileName: string): Promise<AnalysisReport> => {
  const ai = getAI();
  const model = "gemini-3-flash-preview";

  const response = await ai.models.generateContent({
    model,
    contents: {
      parts: [
        { inlineData: { data: base64Image.split(',')[1], mimeType: 'image/jpeg' } },
        { text: "Perform a deep media forensic analysis on this image. Check for tampering, AI markers, and inconsistencies." }
      ]
    },
    config: {
      systemInstruction: "Expert image forensic analyst. Detect manipulation and AI generation.",
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          satyaScore: { type: Type.NUMBER },
          verdict: { type: Type.STRING },
          summary: { type: Type.STRING },
          reasoning: { type: Type.ARRAY, items: { type: Type.STRING } },
          tamperingDetected: { type: Type.BOOLEAN },
          aiProbability: { type: Type.NUMBER },
          metadataStatus: { type: Type.STRING },
          dharmaTip: { type: Type.STRING }
        },
        required: ["satyaScore", "verdict", "summary", "reasoning", "dharmaTip"]
      }
    }
  });

  const data = JSON.parse(response.text || "{}");

  return {
    id: `SN-IMG-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
    hash: 'H-IMG-' + Math.random().toString(16).slice(2, 12),
    timestamp: new Date().toISOString(),
    title: `Image Analysis: ${fileName}`,
    satyaScore: data.satyaScore,
    verdict: data.verdict as any,
    summary: data.summary,
    reasoning: data.reasoning,
    forensicDetails: {
      metadataStatus: data.metadataStatus as any,
      tamperingDetected: data.tamperingDetected,
      aiGeneratedProbability: data.aiProbability
    },
    dharmaTip: data.dharmaTip,
    type: 'Image'
  };
};

export const analyzeEmailHeader = async (header: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Analyze this email header for forensics: ${header}`,
    config: {
      systemInstruction: "You are a cyber forensics expert. Identify spoofing, SPF/DKIM failures, and origin anomalies. Provide a clear security verdict.",
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          verdict: { type: Type.STRING },
          riskScore: { type: Type.NUMBER },
          originatingIP: { type: Type.STRING },
          spoofingDetected: { type: Type.BOOLEAN },
          findings: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ["verdict", "riskScore", "spoofingDetected", "findings"]
      }
    }
  });
  return JSON.parse(response.text || "{}");
};

export const analyzeELA = async (base64Image: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: {
      parts: [
        { inlineData: { data: base64Image, mimeType: 'image/jpeg' } },
        { text: "Perform Error Level Analysis (ELA). Identify specific coordinates or regions where compression noise is inconsistent, suggesting photoshopping or splicing. Provide a list of findings." }
      ]
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          anomaliesDetected: { type: Type.BOOLEAN },
          riskLevel: { type: Type.STRING },
          findings: { type: Type.ARRAY, items: { type: Type.STRING } },
          technicalScore: { type: Type.NUMBER }
        },
        required: ["anomaliesDetected", "findings", "riskLevel"]
      }
    }
  });
  return JSON.parse(response.text || "{}");
};

export const liveFrameAnalysis = async (base64Frame: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: {
      parts: [
        { inlineData: { data: base64Frame, mimeType: 'image/jpeg' } },
        { text: "Analyze this camera frame for neural artifacts, deepfake boundary markers, or lighting inconsistencies. Return a status (Clean/Warning/High Risk) and a brief observation." }
      ]
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          status: { type: Type.STRING },
          observation: { type: Type.STRING },
          neuralProbability: { type: Type.NUMBER }
        },
        required: ["status", "observation", "neuralProbability"]
      }
    }
  });
  return JSON.parse(response.text || "{}");
};

export const analyzeURL = async (url: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Perform a forensic security scan on this URL: ${url}. Check for phishing patterns, domain spoofing, and reputation.`,
    config: {
      systemInstruction: "You are a cyber security expert. Analyze URLs for phishing, malware, and social engineering. Use Google Search to check domain reputation if needed.",
      tools: [{ googleSearch: {} }],
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          isSuspicious: { type: Type.BOOLEAN },
          risk: { type: Type.STRING },
          confidence: { type: Type.NUMBER },
          findings: { type: Type.ARRAY, items: { type: Type.STRING } },
          metrics: {
            type: Type.OBJECT,
            properties: {
              domainAge: { type: Type.STRING },
              sslStatus: { type: Type.STRING }
            },
            required: ["domainAge", "sslStatus"]
          }
        },
        required: ["isSuspicious", "risk", "confidence", "findings", "metrics"]
      }
    }
  });
  return JSON.parse(response.text || "{}");
};

export const analyzeVideo = async (base64Video: string, fileName: string): Promise<any> => {
  const ai = getAI();
  const model = "gemini-3-flash-preview";

  const response = await ai.models.generateContent({
    model,
    contents: {
      parts: [
        { inlineData: { data: base64Video.split(',')[1], mimeType: 'video/mp4' } },
        { text: "Perform a deep video forensic analysis on this file. Detect deepfake artifacts, neural inconsistencies, and temporal glitches. Provide a risk score and detailed findings." }
      ]
    },
    config: {
      systemInstruction: "Expert video forensic analyst. Detect deepfakes and AI manipulation.",
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          riskScore: { type: Type.NUMBER },
          verdict: { type: Type.STRING },
          findings: { type: Type.ARRAY, items: { type: Type.STRING } },
          isDeepfake: { type: Type.BOOLEAN },
          confidence: { type: Type.NUMBER }
        },
        required: ["riskScore", "verdict", "findings", "isDeepfake", "confidence"]
      }
    }
  });

  return JSON.parse(response.text || "{}");
};

export const dharmaChat = async (message: string, language: 'en' | 'hi' | 'mr' | 'ta' | 'bn' = 'en') => {
  const ai = getAI();
  
  const langMap: Record<string, string> = {
    hi: 'Hindi',
    mr: 'Marathi',
    ta: 'Tamil',
    bn: 'Bengali',
    en: 'English'
  };

  const chat = ai.chats.create({
    model: 'gemini-3-flash-preview',
    config: {
      systemInstruction: `You are 'Dharma Bot', the ethical anchor of Satya Net. 
      Help users verify truth. Respond in ${langMap[language]}.
      Use Vedic principles of Satya (Truth) and Dharma (Duty) to frame advice.`,
    }
  });

  const response = await chat.sendMessage({ message });
  return response.text;
};
