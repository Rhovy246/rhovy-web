import { getProductImage } from '../constants';
import type { Redemption } from '../api/redemptions';

export default function SimpleRewardCard({ redemption }: { redemption: Redemption }) {
  const statusColor = redemption.status === 'pending'
    ? 'text-amber-600 bg-amber-50'
    : 'text-green-600 bg-green-50';

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-4 flex gap-4 items-center">
      <img
        src={getProductImage(redemption.item_name)}
        alt={redemption.item_name}
        className="w-14 h-14 rounded-xl object-cover shrink-0"
      />
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-gray-900 text-sm leading-snug">{redemption.item_name}</p>
        {redemption.redemption_code && (
          <p className="text-xs text-gray-500 mt-0.5 font-mono">
            Code: <span className="font-semibold text-gray-700">{redemption.redemption_code}</span>
          </p>
        )}
        <span className={`inline-block mt-1.5 text-xs font-semibold px-2 py-0.5 rounded-full ${statusColor}`}>
          {redemption.status === 'pending' ? 'Ready to use' : 'Used'}
        </span>
      </div>
      <span className="text-sm font-bold text-red-400 shrink-0">−{redemption.points.toLocaleString()} RHO</span>
    </div>
  );
}
