import { apiRequest } from './client';
import type { Transaction } from '../types';

export async function fetchTransactions(): Promise<Transaction[]> {
  const data = await apiRequest<{ ok: boolean; transactions: any[] }>('/api/user-transactions');
  return (data.transactions || []).map((ledger: any) => ({
    id: ledger.id,
    delta: ledger.delta,
    source: ledger.source,
    location: ledger.location,
    orderNumber: ledger.order_number,
    order_url: ledger.order_url,
    date: ledger.created_at,
    business: ledger.business_name || ledger.location || 'Unknown',
    amount: ledger.purchase_amount ? Number(ledger.purchase_amount) : undefined,
    currency: ledger.currency || undefined,
    productName: ledger.product_name || undefined,
    points: Math.abs(ledger.delta),
  }));
}
