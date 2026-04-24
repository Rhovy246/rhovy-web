import type { Transaction } from '../../types';

function formatDate(dateString: string) {
  const date = new Date(dateString);
  return isNaN(date.getTime())
    ? '—'
    : date.toLocaleString('en-US', {
        month: 'short', day: 'numeric', year: 'numeric',
        hour: '2-digit', minute: '2-digit', hour12: true,
        timeZone: 'America/New_York',
      });
}

function formatCurrency(amount: number, currency: string) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount);
}

export default function TransactionItem({ transaction }: { transaction: Transaction }) {
  const isEarned = transaction.delta > 0;

  return (
    <div className="flex items-start justify-between gap-4 p-4 bg-white rounded-xl border border-gray-100 hover:border-purple-100 transition-colors">
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-gray-900 text-sm truncate">{transaction.business}</p>
        {transaction.amount !== undefined && transaction.currency && (
          <p className="text-xs text-gray-500 mt-0.5">
            Order total: {formatCurrency(transaction.amount, transaction.currency)}
          </p>
        )}
        <p className="text-xs text-gray-400 mt-0.5">{formatDate(transaction.date)}</p>
      </div>
      <span
        className={`text-sm font-bold shrink-0 ${isEarned ? 'text-green-600' : 'text-red-500'}`}
      >
        {isEarned ? '+' : ''}{transaction.delta.toLocaleString()} RHO
      </span>
    </div>
  );
}
