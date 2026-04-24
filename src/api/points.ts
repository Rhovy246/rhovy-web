import { apiRequest } from './client';

export async function fetchPoints(): Promise<number> {
  const data = await apiRequest<{ ok: boolean; points: number }>('/api/user-points');
  return data.points;
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
