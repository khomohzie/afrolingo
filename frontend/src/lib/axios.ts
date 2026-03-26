import axios from "axios";
import { toast } from "sonner";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

// Add token automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const message = error.response.data?.message || "Something went wrong";

      toast.error(message);
    } else {
      toast.error("Network error. Check your connection.");
    }

    return Promise.reject(error);
  }
);

export default api;
