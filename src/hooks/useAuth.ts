import { useState, useEffect, useCallback } from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import { loginWithGoogleToken, logout as apiLogout } from '../api/auth';
import { apiRequest } from '../api/client';
import type { User } from '../types';

interface AuthState {
  user: User | null;
  loading: boolean;
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({ user: null, loading: true });

  // On mount, if we have a stored JWT try to fetch the current user
  useEffect(() => {
    const token = localStorage.getItem('rhovy_jwt');
    if (!token) {
      setState({ user: null, loading: false });
      return;
    }
    apiRequest<{ uid: string; email: string; role: string; totalPoints: number }>('/api/me')
      .then(data => setState({ user: { ...data, name: null }, loading: false }))
      .catch(() => {
        localStorage.removeItem('rhovy_jwt');
        setState({ user: null, loading: false });
      });
  }, []);

  const [loginError, setLoginError] = useState<string | null>(null);

  const handleGoogleSuccess = useCallback(async (googleAccessToken: string) => {
    setLoginError(null);
    try {
      const data = await loginWithGoogleToken(googleAccessToken);
      setState({
        user: {
          uid: data.uid,
          email: data.email,
          name: data.name,
          role: data.role,
          totalPoints: data.totalPoints,
        },
        loading: false,
      });
    } catch (err) {
      console.error('Login failed:', err);
      setLoginError(err instanceof Error ? err.message : 'Login failed. Please try again.');
      setState(prev => ({ ...prev, loading: false }));
    }
  }, []);

  const login = useGoogleLogin({
    onSuccess: tokenResponse => handleGoogleSuccess(tokenResponse.access_token),
    onError: err => console.error('Google OAuth error:', err),
  });

  const logout = useCallback(() => {
    apiLogout();
    setState({ user: null, loading: false });
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

  return { user: state.user, loading: state.loading, login, logout, refreshUser, loginError };
}
