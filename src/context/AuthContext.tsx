import { createContext, useCallback, useEffect, useState, type ReactNode } from 'react';
import * as authService from '../services/authService';
import type { LocalUser } from '../types/auth';

interface AuthContextValue {
  user: LocalUser | null;
  loading: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  loginWithGoogle: (name: string, email: string) => void;
  logout: () => void;
  refresh: () => void;
  setRole: (role: 'user' | 'admin') => void;
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<LocalUser | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(() => {
    setUser(authService.getCurrentUser());
  }, []);

  useEffect(() => {
    refresh();
    setLoading(false);
  }, [refresh]);

  const login = useCallback(async (email: string, password: string) => {
    const result = await authService.login(email, password);
    if (result.success) refresh();
    return result;
  }, [refresh]);

  const signup = useCallback(async (name: string, email: string, password: string) => {
    const result = await authService.signup(name, email, password);
    if (result.success) refresh();
    return result;
  }, [refresh]);

  const loginWithGoogle = useCallback((name: string, email: string) => {
    authService.loginWithGoogleProfile(name, email);
    refresh();
  }, [refresh]);

    const logout = useCallback(() => {
    authService.logout();
    setUser(null);
  }, []);

  const setRole = useCallback(
    (role: 'user' | 'admin') => {
      if (!user) return;
      authService.setRole(user.id, role);
      refresh();
    },
    [user, refresh]
  );

  return (
    <AuthContext.Provider
      value={{ user, loading, isAdmin: user?.role === 'admin', login, signup, loginWithGoogle, logout, refresh, setRole }}
    >
      {children}
    </AuthContext.Provider>
  );
}
