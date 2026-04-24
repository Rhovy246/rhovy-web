import { useState, useEffect, useCallback } from 'react';
import { fetchPoints } from '../api/points';

export function usePoints() {
  const [points, setPoints] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const p = await fetchPoints();
      setPoints(p);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  return { points, loading, refresh };
}
