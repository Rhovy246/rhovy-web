const API_BASE = 'https://rhovy-production.up.railway.app';

function getToken(): string | null {
  return localStorage.getItem('rhovy_jwt');
}

export function setToken(token: string) {
  localStorage.setItem('rhovy_jwt', token);
}

export function clearToken() {
  localStorage.removeItem('rhovy_jwt');
}

export async function apiRequest<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();
  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Request failed: ${res.status}`);
  }

  return res.json();
}
