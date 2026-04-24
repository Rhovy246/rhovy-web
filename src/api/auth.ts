import { apiRequest, setToken, clearToken } from './client';

export interface AuthUser {
  uid: string;
  email: string;
  name: string | null;
  role: string;
  totalPoints: number;
  token: string;
}

export async function loginWithGoogleToken(googleAccessToken: string): Promise<AuthUser> {
  const data = await apiRequest<AuthUser>('/auth/google', {
    method: 'POST',
    body: JSON.stringify({ token: googleAccessToken }),
  });
  setToken(data.token);
  return data;
}

export function logout() {
  clearToken();
}
