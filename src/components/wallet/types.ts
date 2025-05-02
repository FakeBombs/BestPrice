
export interface WalletData {
  balance: number;
  pendingBalance: number;
  transactions: Transaction[];
}

export interface Transaction {
  id: string;
  date: Date;
  amount: number;
  description: string;
  status: 'completed' | 'pending' | 'failed';
  type: 'deposit' | 'withdrawal' | 'ad-payment' | 'ad-earnings';
}

// Helper function to format currency
export const formatCurrency = (amount: number | string): string => {
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  return `$${numAmount.toFixed(2)}`;
};
