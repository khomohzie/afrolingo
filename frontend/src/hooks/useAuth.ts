import { useEffect, useState } from "react";
import {
  clearAuth,
  getStoredUser,
  isAuthenticated,
  getUpdatedUser,
} from "@/lib/auth";
import type { User } from "@/types";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [authenticated, setAuthenticated] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const sync = () => {
      setUser(getStoredUser());
      setAuthenticated(isAuthenticated());
      setReady(true);
    };

    sync();
    window.addEventListener("auth-changed", sync);

    return () => window.removeEventListener("auth-changed", sync);
  }, []);

  return {
    user,
    authenticated,
    ready,
    logout: clearAuth,
    getUpdatedUser,
  };
}
