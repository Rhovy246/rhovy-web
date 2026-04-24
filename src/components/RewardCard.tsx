import { getProductImage } from '../constants';

interface RewardCardProps {
  title: string;
  subtitle: string;
  points: number;
  userPoints: number;
  remaining?: number | null;
  onRedeem: () => void;
  isLoading?: boolean;
}

export default function RewardCard({
  title, subtitle, points, userPoints, remaining, onRedeem, isLoading = false,
}: RewardCardProps) {
  const canRedeem = userPoints >= points && (remaining == null || remaining > 0);
  const outOfStock = remaining != null && remaining <= 0;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-4 flex gap-4 items-center hover:border-purple-200 transition-colors">
      <img
        src={getProductImage(title)}
        alt={title}
        className="w-16 h-16 rounded-xl object-cover shrink-0"
      />
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-gray-900 text-sm leading-snug">{title}</p>
        <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>
        <p className="text-xs text-purple-700 font-semibold mt-1">{points.toLocaleString()} RHO</p>
        {remaining != null && (
          <p className="text-xs text-gray-400 mt-0.5">
            {outOfStock ? 'Out of stock' : `${remaining} remaining`}
          </p>
        )}
      </div>
      <button
        onClick={onRedeem}
        disabled={isLoading || !canRedeem}
        className={`shrink-0 px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
          canRedeem && !isLoading
            ? 'bg-[#5B39C5] text-white hover:bg-[#4a2fa8]'
            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
        }`}
      >
        {isLoading ? '...' : outOfStock ? 'Sold Out' : 'Redeem'}
      </button>
    </div>
  );
}
