import { useState, useEffect, useCallback } from 'react';
import { fetchProducts, redeemProduct, fetchRedemptions } from '../api/redemptions';
import type { Product, Redemption } from '../api/redemptions';

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts()
      .then(p => setProducts(p.map(prod => ({ ...prod, remaining: prod.quantity_available }))))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const decrementRemaining = useCallback((upc: string) => {
    setProducts(prev =>
      prev.map(p => p.upc === upc && p.remaining != null ? { ...p, remaining: p.remaining - 1 } : p)
    );
  }, []);

  return { products, loading, decrementRemaining };
}

export function useRedeem() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const redeem = useCallback(async (product: Product): Promise<{ success: boolean; code?: string }> => {
    setLoading(true);
    setError(null);
    try {
      const res = await redeemProduct(product.points_cost, product.name, product.upc);
      return { success: true, code: res.redemptionCode };
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Redemption failed';
      setError(msg);
      return { success: false };
    } finally {
      setLoading(false);
    }
  }, []);

  return { redeem, loading, error };
}

export function useMyRedemptions() {
  const [redemptions, setRedemptions] = useState<Redemption[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchRedemptions();
      setRedemptions(data);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  return { redemptions, loading, refresh };
}
