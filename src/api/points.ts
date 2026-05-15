import { apiRequest } from './client';

export async function fetchPoints(): Promise<number> {
  const data = await apiRequest<{ totalPoints: number }>('/api/me');
  return data.totalPoints;
}

export async function adminAdjustPoints(
  userEmail: string,
  points: number,
  action: 'add' | 'remove'
): Promise<void> {
  await apiRequest('/api/admin/adjust-points', {
    method: 'POST',
    body: JSON.stringify({ userEmail, points, action }),
  });
}
