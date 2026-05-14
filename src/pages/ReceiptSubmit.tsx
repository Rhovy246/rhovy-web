import { useState } from 'react';
import { Link } from 'react-router-dom';
import { apiRequest } from '../api/client';
import imgLogo from '../assets/images/rhovy.png';

type Status = 'idle' | 'submitting' | 'success' | 'error';
type Section = 'upload' | 'email' | '';

export default function ReceiptSubmit() {
  const [section, setSection] = useState<Section>('upload');
  const [merchant, setMerchant] = useState('');
  const [orderNumber, setOrderNumber] = useState('');
  const [amount, setAmount] = useState('');
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
    <div className="min-h-screen bg-[#fafafa]">
      <header className="bg-white border-b border-[#ececef] sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center">
            <img src={imgLogo} alt="Rhovy" className="h-6 w-auto" />
          </div>
          <Link to="/" className="label-mono text-[#8b858f] hover:text-[#171419] transition-colors">
            Dashboard →
          </Link>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-5 pt-10 pb-20">
        {status === 'success' ? (
          <div className="text-center pt-16">
            <div className="w-14 h-14 rounded-full bg-[#e6f7fa] text-[#06B4CC] flex items-center justify-center mx-auto">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 6L9 17l-5-5" />
              </svg>
            </div>
            <h2 className="text-[28px] font-medium text-[#171419] mt-6 tracking-[-0.02em]">
              Receipt received.
            </h2>
            <p className="text-[15px] text-[#5a555f] mt-3 leading-[1.5] max-w-sm mx-auto">
              We'll review and credit your RHO within 24–48 hours. You'll get an email when it lands.
            </p>
            <Link
              to="/"
              className="inline-block mt-8 bg-[#171419] text-white px-7 py-3 rounded-full text-sm font-medium hover:bg-black transition-colors"
            >
              Back to dashboard
            </Link>
          </div>
        ) : (
          <>
            <Link
              to="/"
              className="label-mono text-[#8b858f] flex items-center gap-1.5 mb-7 hover:text-[#171419] transition-colors w-fit"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5M11 6l-6 6 6 6" />
              </svg>
              Dashboard
            </Link>
            <div className="label-mono text-[#5B39C5] mb-3">Get RHO</div>
            <h1 className="text-[32px] font-medium text-[#171419] tracking-[-0.025em] m-0 leading-[1.15]">
              Forgot the extension?{' '}
              <span className="text-[#8b858f]">Submit your purchase here.</span>
            </h1>

            {errorMsg && (
              <div className="mt-6 bg-red-50 border border-red-100 text-red-600 rounded-xl px-4 py-3 text-sm">
                {errorMsg}
              </div>
            )}

            {/* Two collapsible options */}
            <div className="mt-9 flex flex-col">
              {([
                {
                  id: 'upload' as const,
                  title: 'Upload a receipt',
                  sub: 'Order details + screenshot. Reviewed within 48 hours.',
                },
                {
                  id: 'email' as const,
                  title: 'Forward your confirmation email',
                  sub: 'hello@rhovy.com — we read the receipt automatically.',
                },
              ]).map(opt => {
                const open = section === opt.id;
                return (
                  <div key={opt.id} className="border-t border-[#ececef]">
                    <button
                      onClick={() => setSection(open ? '' : opt.id)}
                      className="w-full bg-transparent border-0 flex items-center gap-4 py-5 cursor-pointer text-left"
                    >
                      <div className="flex-1">
                        <div className="text-[15px] font-medium text-[#171419] tracking-[-0.005em]">
                          {opt.title}
                        </div>
                        <div className="text-[13px] text-[#5a555f] mt-0.5">{opt.sub}</div>
                      </div>
                      <svg
                        width="16" height="16" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
                        className={`text-[#8b858f] transition-transform ${open ? 'rotate-180' : ''}`}
                      >
                        <path d="M6 9l6 6 6-6" />
                      </svg>
                    </button>

                    {open && opt.id === 'upload' && (
                      <form onSubmit={handleSubmit} className="pb-7 flex flex-col gap-4">
                        <Field
                          label="Merchant"
                          required
                          value={merchant}
                          onChange={setMerchant}
                          placeholder="Gymshark, Alo Yoga, DarcSport…"
                        />
                        <Field
                          label="Order total (USD)"
                          required
                          type="number"
                          value={amount}
                          onChange={setAmount}
                          placeholder="89.99"
                        />
                        <Field
                          label="Order number"
                          value={orderNumber}
                          onChange={setOrderNumber}
                          placeholder="#12345678"
                        />
                        <div>
                          <div className="label-mono text-[#8b858f] mb-1.5">Notes (optional)</div>
                          <textarea
                            value={notes}
                            onChange={e => setNotes(e.target.value)}
                            placeholder="Any additional context…"
                            rows={3}
                            className="w-full bg-transparent border-0 border-b border-[#ececef] py-2 text-[15px] text-[#171419] focus:outline-none focus:border-[#171419] resize-none"
                          />
                        </div>
                        <button
                          type="submit"
                          disabled={status === 'submitting'}
                          className="self-start bg-[#171419] text-white border-0 rounded-full px-7 py-3 text-sm font-medium cursor-pointer hover:bg-black transition-colors disabled:opacity-60 mt-2"
                        >
                          {status === 'submitting' ? 'Submitting…' : 'Submit receipt →'}
                        </button>
                      </form>
                    )}

                    {open && opt.id === 'email' && (
                      <div className="pb-7">
                        <div className="bg-white border border-[#ececef] rounded p-5 flex items-center justify-between gap-4">
                          <div>
                            <div className="label-mono text-[#8b858f] mb-1">Forward to</div>
                            <div className="text-lg font-medium text-[#171419] font-mono">
                              hello@rhovy.com
                            </div>
                          </div>
                          <button
                            onClick={() => navigator.clipboard?.writeText('hello@rhovy.com')}
                            className="bg-transparent border border-[#ececef] rounded-full px-3.5 py-2 text-xs font-medium text-[#171419] hover:border-[#8b858f] transition-colors"
                          >
                            Copy
                          </button>
                        </div>
                        <p className="text-xs text-[#8b858f] mt-3 leading-[1.5]">
                          Forward from the email tied to your Rhovy account. We'll credit your RHO within 48 hours.
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
              <div className="border-t border-[#ececef]" />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function Field({
  label, value, onChange, placeholder, required, optional, type = 'text',
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  required?: boolean;
  optional?: boolean;
  type?: string;
}) {
  return (
    <label className="block">
      <div className="label-mono text-[#8b858f] mb-1.5">
        {label}
        {optional && (
          <span className="ml-1.5 normal-case tracking-normal">(optional)</span>
        )}
      </div>
      <input
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        type={type}
        required={required}
        className="w-full bg-transparent border-0 border-b border-[#ececef] py-2 text-[15px] text-[#171419] focus:outline-none focus:border-[#171419]"
      />
    </label>
  );
}
