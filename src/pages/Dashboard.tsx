import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { usePoints } from '../hooks/usePoints';
import { useTransactions } from '../hooks/useTransactions';
import { useProducts, useRedeem, useMyRedemptions } from '../hooks/useRedemptions';
import { adminAdjustPoints } from '../api/points';
import TransactionItem from '../components/features/TransactionItem';
import RewardCard from '../components/RewardCard';
import SimpleRewardCard from '../components/SimpleRewardCard';
import imgLogo from '../assets/images/rhovy.png';

type Tab = 'transactions' | 'redeem' | 'my-rewards' | 'admin';


export default function Dashboard() {
  const { user, logout } = useAuth();
  const { points, refresh: refreshPoints } = usePoints();
  const { transactions, loading: txLoading } = useTransactions();
  const { products, loading: productsLoading, decrementRemaining } = useProducts();
  const { redeem, loading: redeemLoading } = useRedeem();
  const { redemptions, loading: redemptionsLoading, refresh: refreshRedemptions } = useMyRedemptions();

  const [tab, setTab] = useState<Tab>('transactions');
  const [filter, setFilter] = useState<string>('all');
  const [successMsg, setSuccessMsg] = useState('');

  // Admin state
  const [addEmail, setAddEmail] = useState('');
  const [addAmount, setAddAmount] = useState('');
  const [removeEmail, setRemoveEmail] = useState('');
  const [removeAmount, setRemoveAmount] = useState('');
  const [adminLoading, setAdminLoading] = useState(false);
  const [adminMsg, setAdminMsg] = useState('');

  const isAdmin = user?.role === 'admin';

  const handleRedeem = async (product: typeof products[0]) => {
    if ((points ?? 0) < product.points_cost) return;
    const result = await redeem(product);
    if (result.success) {
      decrementRemaining(product.upc);
      refreshPoints();
      refreshRedemptions();
      setSuccessMsg(`Redeemed ${product.name} — check your email for confirmation.`);
      setTimeout(() => setSuccessMsg(''), 5000);
    }
  };

  const handleAdminAdjust = async (action: 'add' | 'remove') => {
    const email = action === 'add' ? addEmail : removeEmail;
    const amount = action === 'add' ? addAmount : removeAmount;
    if (!email || !amount) return;
    setAdminLoading(true);
    setAdminMsg('');
    try {
      await adminAdjustPoints(email.trim(), parseInt(amount, 10), action);
      setAdminMsg(`Successfully ${action === 'add' ? 'added' : 'removed'} ${amount} RHO ${action === 'add' ? 'to' : 'from'} ${email}`);
      if (action === 'add') { setAddEmail(''); setAddAmount(''); }
      else { setRemoveEmail(''); setRemoveAmount(''); }
    } catch (err) {
      setAdminMsg(err instanceof Error ? err.message : 'Failed to adjust points');
    } finally {
      setAdminLoading(false);
    }
  };

  const tabs: { id: Tab; label: string }[] = [
    { id: 'transactions', label: 'Activity' },
    { id: 'redeem', label: 'Redeem' },
    { id: 'my-rewards', label: 'My rewards' },
    ...(isAdmin ? [{ id: 'admin' as Tab, label: 'Admin' }] : []),
  ];

  // Build the category filter dynamically from whatever categories the API returns,
  // so we don't hard-code a taxonomy.
  const categoriesPresent = Array.from(new Set(products.map(p => p.category).filter(Boolean)));
  const cats: { id: string; label: string }[] = [
    { id: 'all', label: 'All' },
    ...categoriesPresent.map(c => ({ id: c, label: c.charAt(0).toUpperCase() + c.slice(1) })),
  ];

  const visibleProducts = filter === 'all'
    ? products
    : products.filter(p => p.category === filter);

  const firstName = user?.name?.split(' ')[0] ?? user?.email?.split('@')[0] ?? '';

  return (
    <div className="min-h-screen bg-[#fafafa] text-[#171419]">
      {/* Header — quiet, hairline border */}
      <header className="bg-white border-b border-[#ececef] sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center">
            <img src={imgLogo} alt="Rhovy" className="h-6 w-auto" />
          </div>
          <div className="flex items-center gap-3.5">
            <Link
              to="/submit-receipt"
              className="label-mono text-[#171419] py-1.5 hover:opacity-70 transition-opacity"
            >
              Get RHO →
            </Link>
            <div className="w-px h-4 bg-[#ececef]" />
            <button
              onClick={logout}
              className="label-mono text-[#8b858f] hover:text-[#171419] transition-colors bg-transparent border-0 cursor-pointer p-0"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-5 pt-10 pb-20">
        {/* Hero — points as a big understated number */}
        <div>
          <div className="label-mono text-[#8b858f]">
            Balance{firstName && ` · ${firstName}`}
          </div>
          <div className="flex items-baseline gap-3 mt-1.5">
            <span className="text-[76px] font-normal leading-none tracking-[-0.04em] tabular-nums text-[#171419]">
              {(points ?? 0).toLocaleString()}
            </span>
            <span className="text-lg text-[#5a555f]">RHO</span>
          </div>
        </div>

        {/* Success toast */}
        {successMsg && (
          <div className="mt-6 bg-[#e6f7fa] border border-[#06B4CC]/30 text-[#0a7a8a] rounded-xl px-4 py-3 text-sm">
            {successMsg}
          </div>
        )}

        {/* Tabs — underline style */}
        <div className="flex gap-7 mt-11 border-b border-[#ececef]">
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`bg-transparent border-0 cursor-pointer text-sm font-medium tracking-[-0.01em] py-3 -mb-px transition-colors ${
                tab === t.id
                  ? 'text-[#171419] border-b-[1.5px] border-[#171419]'
                  : 'text-[#8b858f] border-b-[1.5px] border-transparent hover:text-[#5a555f]'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Tab panels */}
        <div className="mt-7">
          {tab === 'transactions' && (
            <>
              {txLoading ? (
                <p className="text-center text-[#8b858f] text-sm py-8">Loading…</p>
              ) : transactions.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-[#8b858f] text-sm">No transactions yet.</p>
                  <p className="text-[#bbb6c0] text-xs mt-1">Shop with a partner brand to earn RHO.</p>
                </div>
              ) : (
                <div className="border-t border-[#ececef]">
                  {transactions.map(t => (
                    <TransactionItem key={t.id} transaction={t} />
                  ))}
                </div>
              )}
            </>
          )}

          {tab === 'redeem' && (
            <>
              {productsLoading ? (
                <p className="text-center text-[#8b858f] text-sm py-8">Loading rewards…</p>
              ) : products.length === 0 ? (
                <p className="text-center text-[#8b858f] text-sm py-8">No rewards available right now.</p>
              ) : (
                <>
                  {/* Filter pills */}
                  {cats.length > 1 && (
                    <div className="flex gap-2 mb-6 flex-wrap">
                      {cats.map(c => (
                        <button
                          key={c.id}
                          onClick={() => setFilter(c.id)}
                          className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors ${
                            filter === c.id
                              ? 'bg-[#171419] text-white border border-[#171419]'
                              : 'bg-transparent text-[#5a555f] border border-[#ececef] hover:border-[#8b858f]'
                          }`}
                        >
                          {c.label}
                        </button>
                      ))}
                    </div>
                  )}

                  <div className="border-t border-[#ececef]">
                    {visibleProducts.map(product => (
                      <RewardCard
                        key={product.upc}
                        title={product.name}
                        subtitle={product.brand || 'Powerhouse SoFlo'}
                        points={product.points_cost}
                        userPoints={points ?? 0}
                        remaining={product.remaining}
                        onRedeem={() => handleRedeem(product)}
                        isLoading={redeemLoading}
                      />
                    ))}
                  </div>
                </>
              )}
            </>
          )}

          {tab === 'my-rewards' && (
            <>
              {redemptionsLoading ? (
                <p className="text-center text-[#8b858f] text-sm py-8">Loading…</p>
              ) : redemptions.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-[#8b858f] text-sm">No rewards redeemed yet.</p>
                </div>
              ) : (
                <div className="border-t border-[#ececef]">
                  {redemptions.map(r => (
                    <SimpleRewardCard key={r.id} redemption={r} />
                  ))}
                </div>
              )}
            </>
          )}

          {tab === 'admin' && isAdmin && (
            <div className="flex flex-col gap-5">
              {adminMsg && (
                <div className="bg-[#f4f4f6] border border-[#ececef] text-[#171419] rounded-xl px-4 py-3 text-sm">
                  {adminMsg}
                </div>
              )}
              {(['add', 'remove'] as const).map(action => (
                <div key={action} className="border-t border-b border-[#ececef] py-5">
                  <h3 className="label-mono text-[#8b858f] mb-3">{action} RHO</h3>
                  <input
                    type="email"
                    placeholder="User email"
                    value={action === 'add' ? addEmail : removeEmail}
                    onChange={e =>
                      action === 'add' ? setAddEmail(e.target.value) : setRemoveEmail(e.target.value)
                    }
                    className="w-full bg-transparent border-0 border-b border-[#ececef] py-2 text-[15px] text-[#171419] focus:outline-none focus:border-[#171419] mb-3"
                  />
                  <input
                    type="number"
                    placeholder="Amount (RHO)"
                    value={action === 'add' ? addAmount : removeAmount}
                    onChange={e =>
                      action === 'add' ? setAddAmount(e.target.value) : setRemoveAmount(e.target.value)
                    }
                    className="w-full bg-transparent border-0 border-b border-[#ececef] py-2 text-[15px] text-[#171419] focus:outline-none focus:border-[#171419] mb-4"
                  />
                  <button
                    onClick={() => handleAdminAdjust(action)}
                    disabled={adminLoading}
                    className={`rounded-full px-5 py-2 text-xs font-medium transition-colors ${
                      action === 'add'
                        ? 'bg-[#171419] text-white hover:bg-black'
                        : 'bg-transparent text-red-600 border border-red-200 hover:bg-red-50'
                    }`}
                  >
                    {adminLoading ? 'Processing…' : `${action === 'add' ? 'Add' : 'Remove'} points`}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
