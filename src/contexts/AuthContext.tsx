import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import { loginWithGoogleToken, logout as apiLogout } from '../api/auth';
import { apiRequest } from '../api/client';
import type { User } from '../types';

interface AuthState {
  user: User | null;
  loading: boolean;
  loginError: string | null;
}

interface AuthContextValue extends AuthState {
  login: () => void;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({ user: null, loading: true, loginError: null });

  useEffect(() => {
    const token = localStorage.getItem('rhovy_jwt');
    if (!token) {
      setState(s => ({ ...s, loading: false }));
      return;
    }
    apiRequest<{ uid: string; email: string; name: string | null; role: string; totalPoints: number }>('/api/me')
      .then(data => setState({ user: { ...data }, loading: false, loginError: null }))
      .catch(() => {
        localStorage.removeItem('rhovy_jwt');
        setState({ user: null, loading: false, loginError: null });
      });
  }, []);

  const handleGoogleSuccess = useCallback(async (googleAccessToken: string) => {
    setState(s => ({ ...s, loginError: null }));
    try {
      const data = await loginWithGoogleToken(googleAccessToken);
      setState({
        user: { uid: data.uid, email: data.email, name: data.name, role: data.role, totalPoints: data.totalPoints },
        loading: false,
        loginError: null,
      });
    } catch (err) {
      setState(s => ({
        ...s,
        loading: false,
        loginError: err instanceof Error ? err.message : 'Login failed. Please try again.',
      }));
    }
  }, []);

  const login = useGoogleLogin({
    onSuccess: tokenResponse => handleGoogleSuccess(tokenResponse.access_token),
    onError: err => console.error('Google OAuth error:', err),
  });

  const logout = useCallback(() => {
    apiLogout();
    setState({ user: null, loading: false, loginError: null });
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      const data = await apiRequest<{ uid: string; email: string; role: string; totalPoints: number }>('/api/me');
      setState(prev => ({
        ...prev,
        user: prev.user ? { ...prev.user, totalPoints: data.totalPoints, role: data.role } : null,
      }));
    } catch {
      // silently ignore
    }
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
