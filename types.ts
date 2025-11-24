export interface Suggestion {
  id: string;
  text: string;
  impact: 'High' | 'Medium' | 'Low';
  category: 'Content' | 'Formatting' | 'Skills' | 'Grammar';
}

export interface SectionScore {
  name: string;
  score: number; // 0-100
  feedback: string;
}

export interface BanglaContextAdvice {
  topic: string; // e.g., "Academic Projects", "Coaching Experience"
  advice: string;
  isOptimized: boolean;
}

export interface AnalysisResult {
  overallScore: number;
  overallLabel: 'Needs Work' | 'Good' | 'Strong';
  summary: string;
  matchPercentage: number;
  sectionScores: SectionScore[];
  missingKeywords: string[];
  suggestions: Suggestion[];
  banglaContext: BanglaContextAdvice[];
}

export interface ResumeData {
  text: string;
  targetRole: string;
}

export enum AppState {
  IDLE,
  INPUT,
  ANALYZING,
  RESULTS,
  ERROR
}