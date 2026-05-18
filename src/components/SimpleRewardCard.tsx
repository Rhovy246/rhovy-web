import { useState } from 'react';
import { getProductImage } from '../constants';
import type { Redemption } from '../api/redemptions';
import { resendRedemptionEmail, dismissRedemption } from '../api/redemptions';

/**
 * Direction A "Quiet" — a row in the My Rewards list.
 * - Hairline bottom border (parent provides border-top)
 * - Redemption code is the focal piece of metadata (monospaced)
 * - Status: teal "● Ready" or muted "○ Used"
 *
 * NOTE: Props unchanged from original — only markup and classes are different.
 */
export default function SimpleRewardCard({ redemption, onDismiss }: { redemption: Redemption; onDismiss?: (id: string) => void }) {
  const isReady = redemption.status === 'pending';
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [dismissing, setDismissing] = useState(false);

  const handleResend = async () => {
    setSending(true);
    try {
      await resendRedemptionEmail(redemption.id);
      setSent(true);
      setTimeout(() => setSent(false), 3000);
    } finally {
      setSending(false);
    }
  };

  const handleDismiss = async () => {
    setDismissing(true);
    try {
      await dismissRedemption(redemption.id);
      onDismiss?.(redemption.id);
    } finally {
      setDismissing(false);
    }
  };

  return (
    <div className={`flex gap-4 items-center py-5 border-b border-[#ececef] transition-opacity ${!isReady ? 'opacity-50' : ''}`}>
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
        {redemption.brand && (
          <p className="label-mono text-[#8b858f] mt-1">{redemption.brand}</p>
        )}
      </div>
      {isReady ? (
        <button
          onClick={handleResend}
          disabled={sending}
          className="rounded-full px-[14px] py-1.5 text-xs font-medium border transition-colors whitespace-nowrap bg-[#5B39C5] text-white border-[#5B39C5] hover:bg-[#4a2fa8] disabled:opacity-50 cursor-pointer"
        >
          {sending ? '…' : sent ? 'Sent!' : 'Resend email'}
        </button>
      ) : (
        <div className="flex items-center gap-2">
          <div className="rounded-full px-[14px] py-1.5 text-xs font-medium border border-[#ececef] text-[#8b858f] whitespace-nowrap">
            Used
          </div>
          <button
            onClick={handleDismiss}
            disabled={dismissing}
            className="text-[#8b858f] hover:text-[#171419] transition-colors bg-transparent border-0 cursor-pointer p-0.5 disabled:opacity-50"
            aria-label="Remove"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
