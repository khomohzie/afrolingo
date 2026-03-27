import api from "@/lib/api";
import type { ApiResponse, Language, User } from "@/types";
 
export interface Phrase {
  _id: string;
  text: string;
  translation: string;
  language: string;
  audioUrl?: string;
  order?: number;                // for backward compatibility
  orderIndex?: number;           // from the new API
  romanization?: string;
  toneNotes?: string;
  category?: string;
  difficulty?: string;
  isActive?: boolean;
  userProgress?: {
    completed?: boolean;
    // other fields if needed
  } | null;
}
 
export interface UserStats {
  xp: number;
  level: number;
  xpToNextLevel: number;
  streak: number;
  lastPracticeDate: string | null;
  selectedLanguage: string;
  totalCompleted: number;
  totalAttempts: number;
  avgScore: number;
}
 
export async function getLanguages() {
  const { data } = await api.get<ApiResponse<Language[]>>("/lessons/languages");
  return data;
}
 
export async function selectLanguage(language: string) {
  const { data } = await api.patch<ApiResponse<User>>("/users/language", { language });
  return data;
}
 
export async function getPhrases(language: string, signal?: AbortSignal) {
  const { data } = await api.get<ApiResponse<LessonProgressResponse>>(
    `/lessons/${language}`,
    { signal }  
  );
  return data;
}
 
export async function getUserStats() {
  const { data } = await api.get<ApiResponse<UserStats>>("/progress/stats");
  return data;
}
 
export interface PhraseModule {
  category: string;
  totalPhrases: number;
  completedPhrases: number;
  isUnlocked: boolean;
  phrases: Phrase[];
}
 
export interface LessonProgressResponse {
  language: string;
  modules: PhraseModule[];
}
 
export async function completePhrase(phraseId: string) {
  const { data } = await api.post<ApiResponse<any>>(`/lessons/phrase/${phraseId}/complete`);
  return data;
}