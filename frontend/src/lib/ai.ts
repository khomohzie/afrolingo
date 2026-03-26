import api from "@/lib/api";
import type {
  ApiResponse,
  CacheAudioPayload,
  CacheAudioAllPayload,
  CacheAudioAllResult,
} from "@/types";

export async function cachePhraseAudio(payload: CacheAudioPayload) {
  const { data } = await api.post<ApiResponse<string>>(
    "/ai/cacheAudio",
    payload
  );

  return data;
}

export async function cacheAllLanguageAudio(payload: CacheAudioAllPayload) {
  const { data } = await api.post<ApiResponse<CacheAudioAllResult>>(
    "/ai/cacheAudioAll",
    payload
  );

  return data;
}