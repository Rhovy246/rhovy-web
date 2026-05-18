import { apiRequest } from './client';

export interface Product {
  upc: string;
  name: string;
  description: string;
  points_cost: number;
  category: string;
  brand: string;
  quantity_available: number | null;
  image_url: string | null;
  remaining?: number | null;
}

export interface Redemption {
  id: string;
  item_name: string;
  item_upc: string;
  redemption_code: string;
  status: string;
  points: number;
  created_at: string;
  brand?: string | null;
}

export async function fetchProducts(): Promise<Product[]> {
  const data = await apiRequest<{ ok: boolean; products: Product[] }>('/api/products');
  return data.products || [];
}

export async function redeemProduct(
  points: number,
  itemName: string,
  itemUpc: string
): Promise<{ ok: boolean; redemptionCode: string }> {
  return apiRequest('/api/redeem-request', {
    method: 'POST',
    body: JSON.stringify({ points, itemName, itemUpc }),
  });
}

export async function fetchRedemptions(): Promise<Redemption[]> {
  const data = await apiRequest<{ ok: boolean; data: Redemption[] }>('/api/user-redemptions');
  return data.data || [];
}

export async function resendRedemptionEmail(redemptionId: string): Promise<void> {
  await apiRequest('/api/resend-redemption-email', {
    method: 'POST',
    body: JSON.stringify({ redemptionId }),
  });
}
