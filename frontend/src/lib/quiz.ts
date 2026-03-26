import api from "@/lib/api";
import type {
  ApiResponse,
  SubmitQuizPayload,
  SubmitQuizResult,
} from "@/types";

export async function submitQuiz(payload: SubmitQuizPayload) {
  const { data } = await api.post<ApiResponse<SubmitQuizResult>>(
    "/quiz/submit",
    payload
  );

  return data;
}