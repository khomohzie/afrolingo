import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api",
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("accessToken");
    if (token) {
      (config.headers as Record<string, string>).Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (typeof window !== "undefined" && error?.response?.status === 401) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("authUser");
      window.dispatchEvent(new Event("auth-changed"));
    }
    return Promise.reject(error);
  }
);

export function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function getErrorMessage(error: unknown): string {
  const response = (error as any)?.response;
  const status = response?.status;
  const message = response?.data?.message;

  if (typeof message === "string" && message.trim()) {
    const n = message.toLowerCase();
    if (n.includes("email already") || n.includes("duplicate"))
      return "This email has already been used to register.";
    if (n.includes("invalid credentials") || n.includes("incorrect"))
      return "Incorrect email or password.";
    if (n.includes("too many"))
      return "Too many attempts. Please wait and try again.";
    if (n.includes("user not found"))
      return "No account found with this email.";
    if (n.includes("blocked") || n.includes("suspended"))
      return "This account is currently restricted.";
    return message;
  }

  if (status === 400) return "Please check your details and try again.";
  if (status === 401) return "Incorrect email or password.";
  if (status === 403) return "Access is currently restricted.";
  if (status === 409) return "This email has already been used to register.";
  if (status === 422) return "The details provided are invalid.";
  if (status === 429) return "Too many attempts. Please wait and try again.";
  if (status >= 500) return "Server error. Please try again in a moment.";
  if ((error as any)?.request) return "Unable to reach the server. Check your connection.";
  return "Something went wrong. Please try again.";
}

export default api;