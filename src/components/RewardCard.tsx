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

/**
 * Direction A "Quiet" reward row.
 * - Hairline bottom border (parent container provides the top border)
 * - Monospaced uppercase meta line
 * - Purple Redeem button (the single splash of brand color per row)
 *
 * NOTE: Props are unchanged from the original — only markup and classes
 * are different.
 */
export default function RewardCard({
  title, subtitle, points, userPoints, remaining, onRedeem, isLoading = false,
}: RewardCardProps) {
  const canRedeem = userPoints >= points && (remaining == null || remaining > 0);
  const outOfStock = remaining != null && remaining <= 0;
  const needMore = userPoints < points;

  return (
    <div className="flex gap-4 items-center py-4 border-b border-[#ececef]">
      <div className="w-14 h-14 rounded bg-[#f4f4f6] overflow-hidden shrink-0">
        <img
          src={getProductImage(title)}
          alt={title}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-[#171419] tracking-[-0.005em] leading-snug">
          {title}
        </p>
        <p className="label-mono text-[#8b858f] mt-1">
          {subtitle}
          {remaining != null && (
            <> · {outOfStock ? 'Out of stock' : `${remaining} left`}</>
          )}
        </p>
      </div>

      <div className="flex items-center gap-3.5 shrink-0">
        <span className="text-sm font-medium text-[#171419] tabular-nums">
          {points.toLocaleString()}
        </span>
        <button
          onClick={onRedeem}
          disabled={isLoading || !canRedeem}
          className={`rounded-full px-[14px] py-1.5 text-xs font-medium transition-colors whitespace-nowrap ${
            canRedeem && !isLoading
              ? 'bg-[#5B39C5] text-white hover:bg-[#4a2fa8] border border-[#5B39C5]'
              : 'bg-transparent text-[#8b858f] border border-[#ececef] cursor-not-allowed'
          }`}
        >
          {isLoading ? '…' : outOfStock ? 'Sold out' : needMore ? 'Need more' : 'Redeem'}
        </button>
      </div>
    </div>
  );
}
