export interface ApiResponse<T> {
    success: boolean;
    code: number;
    message: string;
    data: T;
    meta?: Record<string, unknown>;
  }
  
  export interface User {
    _id: string;
    name: string;
    email: string;
    selectedLanguage: string | null;
    xp: number;
    streak: number;
    createdAt?: string;
    updatedAt?: string;
    [key: string]: unknown;
  }
  
  export interface LoginPayload {
    email: string;
    password: string;
  }
  
  export interface SignupPayload {
    name: string;
    email: string;
    password: string;
  }
  
  export interface AuthData {
    accessToken?: string;
    refreshToken?: string;
    user?: User;
  }

  export interface Language {
    _id: string;
    code: string;
    name: string;
    nativeName: string;
    description: string;
    flagEmoji: string;
    isActive: boolean;
    totalPhrases: number;
    createdAt?: string;
    updatedAt?: string;
  }
  
  export interface QuizAnswerPayload {
    phraseId: string;
    answer: string;
  }
  
  export interface SubmitQuizPayload {
    answers: QuizAnswerPayload[];
  }
  
  export interface QuizResultItem {
    phraseId: string;
    correct: boolean;
    correctAnswer: string;
  }
  
  export interface SubmitQuizResult {
    correct: number;
    total: number;
    percentage: number;
    xpEarned: number;
    totalXP: number;
    streak: number;
    results: QuizResultItem[];
    passed: boolean;
  }
  
  export interface CacheAudioPayload {
    phraseId: string;
  }
  
  export interface CacheAudioAllPayload {
    language: string;
  }
  
  export interface CacheAudioAllResult {
    success: number;
    failed: number;
  }