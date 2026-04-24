export interface User {
  uid: string;
  email: string;
  name: string | null;
  role: string;
  totalPoints: number;
}

export interface Transaction {
  id: string;
  delta: number;
  source: string;
  location: string;
  orderNumber?: string;
  order_url?: string;
  date: string;
  business: string;
  amount?: number;
  currency?: string;
  productName?: string;
  points: number;
}
