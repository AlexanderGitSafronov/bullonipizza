"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { useAddresses } from "./addresses";

export interface AuthUser {
  id: string;
  email: string;
  name?: string | null;
  phone?: string | null;
  role: "USER" | "ADMIN";
}

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  refresh: () => Promise<void>;
  logout: () => Promise<void>;
  setUser: (u: AuthUser | null) => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUserState] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Wrap the raw setter so user-dependent stores (addresses) stay in sync
  // whenever the auth state changes — including the `setUser` call after
  // login/register where we don't go through /api/auth/me again.
  const setUser = useCallback((u: AuthUser | null) => {
    setUserState(u);
    if (u) {
      void useAddresses.getState().refresh();
    } else {
      useAddresses.getState().reset();
    }
  }, []);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/me", { cache: "no-store" });
      if (!res.ok) {
        setUser(null);
        return;
      }
      const data = await res.json();
      setUser(data.user ?? null);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, [setUser]);

  const logout = useCallback(async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {
      /* network failure — local state still cleared */
    }
    setUser(null);
  }, [setUser]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return (
    <AuthContext.Provider value={{ user, loading, refresh, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
