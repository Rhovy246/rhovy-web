import { getProductImage } from '../constants';
import type { Redemption } from '../api/redemptions';

/**
 * Direction A "Quiet" — a row in the My Rewards list.
 * - Hairline bottom border (parent provides border-top)
 * - Redemption code is the focal piece of metadata (monospaced)
 * - Status: teal "● Ready" or muted "○ Used"
 *
 * NOTE: Props unchanged from original — only markup and classes are different.
 */
export default function SimpleRewardCard({ redemption }: { redemption: Redemption }) {
  const isReady = redemption.status === 'pending';

  return (
    <div className="flex gap-4 items-center py-5 border-b border-[#ececef]">
      <div className="w-14 h-14 shrink-0 flex items-center justify-center">
        <img
          src={getProductImage(redemption.item_name)}
          alt={redemption.item_name}
          className="w-full h-full object-contain"
        />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-[#171419] leading-snug">
          {redemption.item_name}
        </p>
        {redemption.redemption_code && (
          <p className="label-mono text-[#8b858f] mt-1">
            Code ·{' '}
            <span className="text-[#171419] font-semibold">
              {redemption.redemption_code}
            </span>
          </p>
        )}
      </div>
      <div className={`label-mono ${isReady ? 'text-[#06B4CC]' : 'text-[#8b858f]'}`}>
        {isReady ? '● Ready' : '○ Used'}
      </div>
    </div>
  );
}
