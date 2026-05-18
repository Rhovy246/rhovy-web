import type { Transaction } from '../../types';

function formatDate(dateString: string) {
  const date = new Date(dateString);
  return isNaN(date.getTime())
    ? '—'
    : date.toLocaleString('en-US', {
        month: 'short', day: 'numeric', year: 'numeric',
        hour: 'numeric', minute: '2-digit', hour12: true,
        timeZone: 'America/New_York',
      });
}

function formatCurrency(amount: number, currency: string) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount);
}

export default function TransactionItem({ transaction }: { transaction: Transaction }) {
  const isEarned = transaction.delta > 0;

  return (
    <div className="flex items-start justify-between gap-4 py-[18px] border-b border-[#ececef]">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-[#171419] tracking-[-0.005em] truncate">
          {transaction.business}
        </p>
        <p className="label-mono text-[#8b858f] mt-1">
          {formatDate(transaction.date)}
          {transaction.amount !== undefined && transaction.currency && (
            <> · {formatCurrency(transaction.amount, transaction.currency)}</>
          )}
        </p>
      </div>
      <span
        className={`text-sm font-medium tabular-nums shrink-0 ${
          isEarned ? 'text-[#16a34a]' : 'text-[#dc2626]'
        }`}
      >
        {isEarned ? '+' : ''}{transaction.delta.toLocaleString()}
        <span className="label-mono text-[#8b858f] ml-1.5">RHO</span>
      </span>
    </div>
  );
}
