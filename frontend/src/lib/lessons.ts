import api from "@/lib/api";
import type { ApiResponse, Language, User } from "@/types";

export async function getLanguages() {
  const { data } = await api.get<ApiResponse<Language[]>>("/lessons/languages");
  return data;
}

export async function selectLanguage(language: string) {
  const { data } = await api.patch<ApiResponse<User>>("/users/language", { language });
  return data;
}