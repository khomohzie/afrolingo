import api from "@/lib/api";
import type { ApiResponse, Language } from "@/types";

export async function getLanguages() {
  const { data } = await api.get<ApiResponse<Language[]>>("/lessons/languages");
  return data;
}