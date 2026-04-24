import { useState } from 'react';
import { Link } from 'react-router-dom';
import { apiRequest } from '../api/client';
import imgLogo from '../assets/images/rhovy_circle_logo_new.png';

type Status = 'idle' | 'submitting' | 'success' | 'error';

export default function ReceiptSubmit() {
  const [merchant, setMerchant] = useState('');
  const [orderNumber, setOrderNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [orderUrl, setOrderUrl] = useState('');
  const [notes, setNotes] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!merchant.trim() || !amount.trim()) {
      setErrorMsg('Merchant name and order total are required.');
      return;
    }
    const parsed = parseFloat(amount);
    if (isNaN(parsed) || parsed <= 0) {
      setErrorMsg('Please enter a valid order total.');
      return;
    }
    setStatus('submitting');
    setErrorMsg('');
    try {
      await apiRequest('/api/submit-receipt', {
        method: 'POST',
        body: JSON.stringify({
          merchant: merchant.trim(),
          orderNumber: orderNumber.trim() || null,
          amount: parsed,
          orderUrl: orderUrl.trim() || null,
          notes: notes.trim() || null,
        }),
      });
      setStatus('success');
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Submission failed. Please try again.');
      setStatus('error');
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f7fc]">
      <header className="bg-white border-b border-gray-100">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <Link to="/" className="text-gray-400 hover:text-gray-600 text-sm">← Back</Link>
          <div className="flex items-center gap-2">
            <img src={imgLogo} alt="Rhovy" className="w-7 h-7" />
            <span className="font-bold text-gray-900">Submit a Receipt</span>
          </div>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-8">
        {status === 'success' ? (
          <div className="bg-white rounded-2xl border border-green-100 p-8 text-center">
            <div className="text-4xl mb-3">✓</div>
            <h2 className="text-lg font-bold text-gray-900">Receipt submitted!</h2>
            <p className="text-sm text-gray-500 mt-2">
              We'll review your purchase and add RHO to your account within 24–48 hours.
            </p>
            <Link
              to="/"
              className="inline-block mt-6 bg-[#5B39C5] text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#4a2fa8] transition-colors"
            >
              Back to dashboard
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <p className="text-sm text-gray-500 mb-6">
              Didn't have the Chrome extension installed when you made a purchase? Submit your receipt here and we'll add your RHO manually.
            </p>

            {errorMsg && (
              <div className="mb-4 bg-red-50 border border-red-100 text-red-600 rounded-xl px-4 py-3 text-sm">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  Merchant / Store name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={merchant}
                  onChange={e => setMerchant(e.target.value)}
                  placeholder="e.g. Gymshark, Alo Yoga, DarcSport"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-purple-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  Order total (USD) <span className="text-red-400">*</span>
                </label>
                <input
                  type="number"
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                  placeholder="e.g. 89.99"
                  min="0.01"
                  step="0.01"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-purple-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Order number (optional)</label>
                <input
                  type="text"
                  value={orderNumber}
                  onChange={e => setOrderNumber(e.target.value)}
                  placeholder="e.g. #12345678"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-purple-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Order confirmation URL (optional)</label>
                <input
                  type="url"
                  value={orderUrl}
                  onChange={e => setOrderUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-purple-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Notes (optional)</label>
                <textarea
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder="Any additional context..."
                  rows={3}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-purple-400 resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={status === 'submitting'}
                className="w-full bg-[#5B39C5] text-white py-3 rounded-xl font-semibold text-sm hover:bg-[#4a2fa8] transition-colors disabled:opacity-60"
              >
                {status === 'submitting' ? 'Submitting...' : 'Submit Receipt'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
