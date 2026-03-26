import api from "@/lib/api";
import type {
  ApiResponse,
  AuthData,
  LoginPayload,
  SignupPayload,
  User,
} from "@/types";

const ACCESS_TOKEN_KEY = "accessToken";
const REFRESH_TOKEN_KEY = "refreshToken";
const USER_KEY = "authUser";

export async function loginUser(payload: LoginPayload) {
  const { data } = await api.post<ApiResponse<AuthData>>("/auth/login", payload);
  return data;
}

export async function signupUser(payload: SignupPayload) {
  const { data } = await api.post<ApiResponse<AuthData>>("/auth/signup", payload);
  return data;
}

export function saveAuth(auth?: AuthData | null) {
  if (typeof window === "undefined" || !auth) return;

  if (auth.accessToken) {
    localStorage.setItem(ACCESS_TOKEN_KEY, auth.accessToken);
  }

  if (auth.refreshToken) {
    localStorage.setItem(REFRESH_TOKEN_KEY, auth.refreshToken);
  }

  if (auth.user) {
    localStorage.setItem(USER_KEY, JSON.stringify(auth.user));
  }

  window.dispatchEvent(new Event("auth-changed"));
}

export function clearAuth() {
  if (typeof window === "undefined") return;

  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(USER_KEY);

  window.dispatchEvent(new Event("auth-changed"));
}

export function getStoredUser(): User | null {
  if (typeof window === "undefined") return null;

  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as User;
  } catch {
    return null;
  }
}

export function getAccessToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function isAuthenticated() {
  return Boolean(getAccessToken());
}

export function getPostAuthRoute(user?: User | null) {
  if (!user) return "/login";
  return user.selectedLanguage ? "/learn" : "/onboarding/choose-language";
}