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
import imgLogo from '../assets/images/rhovy_circle_logo_new.png';

type Tab = 'transactions' | 'redeem' | 'my-rewards' | 'admin';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const { points, refresh: refreshPoints } = usePoints();
  const { transactions, loading: txLoading } = useTransactions();
  const { products, loading: productsLoading, decrementRemaining } = useProducts();
  const { redeem, loading: redeemLoading } = useRedeem();
  const { redemptions, loading: redemptionsLoading, refresh: refreshRedemptions } = useMyRedemptions();

  const [tab, setTab] = useState<Tab>('transactions');
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
      setSuccessMsg(`Redeemed ${product.name}! Check your email for confirmation.`);
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
    { id: 'transactions', label: 'Transactions' },
    { id: 'redeem', label: 'Redeem' },
    { id: 'my-rewards', label: 'My Rewards' },
    ...(isAdmin ? [{ id: 'admin' as Tab, label: 'Admin' }] : []),
  ];

  return (
    <div className="min-h-screen bg-[#f8f7fc]">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src={imgLogo} alt="Rhovy" className="w-8 h-8" />
            <span className="font-bold text-gray-900 text-lg">Rhovy</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-xs text-gray-400">{user?.email}</p>
              <p className="text-sm font-bold text-[#5B39C5]">{(points ?? 0).toLocaleString()} RHO</p>
            </div>
            <Link
              to="/submit-receipt"
              className="text-xs bg-[#ede9fb] text-[#5B39C5] font-semibold px-3 py-1.5 rounded-lg hover:bg-purple-200 transition-colors"
            >
              Submit Receipt
            </Link>
            <button
              onClick={logout}
              className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
            >
              Sign out
            </button>
          </div>
        </div>
        {/* Points bar (mobile) */}
        <div className="sm:hidden bg-[#5B39C5] text-white text-center py-1.5 text-sm font-bold">
          {(points ?? 0).toLocaleString()} RHO
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Points card */}
        <div className="bg-gradient-to-br from-[#5B39C5] to-[#7c5cf7] rounded-2xl p-6 text-white mb-6">
          <p className="text-sm opacity-70">Your balance</p>
          <p className="text-4xl font-bold mt-1">{(points ?? 0).toLocaleString()}</p>
          <p className="text-sm opacity-70 mt-0.5">RHO points</p>
          {user?.name && <p className="text-xs opacity-50 mt-3">Hi, {user.name.split(' ')[0]}</p>}
        </div>

        {/* Success toast */}
        {successMsg && (
          <div className="mb-4 bg-green-50 border border-green-200 text-green-700 rounded-xl px-4 py-3 text-sm">
            {successMsg}
          </div>
        )}

        {/* Tabs */}
        <div className="flex bg-gray-100 rounded-xl p-1 mb-5 gap-1">
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-colors ${
                tab === t.id
                  ? 'bg-white text-[#5B39C5] shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Tab panels */}
        {tab === 'transactions' && (
          <div className="flex flex-col gap-3">
            {txLoading ? (
              <p className="text-center text-gray-400 text-sm py-8">Loading...</p>
            ) : transactions.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-400 text-sm">No transactions yet.</p>
                <p className="text-gray-300 text-xs mt-1">Shop with a partner brand to earn RHO.</p>
              </div>
            ) : (
              transactions.map(t => <TransactionItem key={t.id} transaction={t} />)
            )}
          </div>
        )}

        {tab === 'redeem' && (
          <div className="flex flex-col gap-3">
            {productsLoading ? (
              <p className="text-center text-gray-400 text-sm py-8">Loading rewards...</p>
            ) : products.length === 0 ? (
              <p className="text-center text-gray-400 text-sm py-8">No rewards available right now.</p>
            ) : (
              products.map(product => (
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
              ))
            )}
          </div>
        )}

        {tab === 'my-rewards' && (
          <div className="flex flex-col gap-3">
            {redemptionsLoading ? (
              <p className="text-center text-gray-400 text-sm py-8">Loading...</p>
            ) : redemptions.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-400 text-sm">No rewards redeemed yet.</p>
              </div>
            ) : (
              redemptions.map(r => <SimpleRewardCard key={r.id} redemption={r} />)
            )}
          </div>
        )}

        {tab === 'admin' && isAdmin && (
          <div className="flex flex-col gap-5">
            {adminMsg && (
              <div className="bg-blue-50 border border-blue-100 text-blue-700 rounded-xl px-4 py-3 text-sm">
                {adminMsg}
              </div>
            )}
            {['add', 'remove'].map(action => (
              <div key={action} className="bg-white rounded-2xl border border-gray-100 p-5">
                <h3 className="font-semibold text-gray-900 mb-3 capitalize">{action} RHO</h3>
                <input
                  type="email"
                  placeholder="User email"
                  value={action === 'add' ? addEmail : removeEmail}
                  onChange={e => action === 'add' ? setAddEmail(e.target.value) : setRemoveEmail(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mb-2 focus:outline-none focus:border-purple-400"
                />
                <input
                  type="number"
                  placeholder="Amount (RHO)"
                  value={action === 'add' ? addAmount : removeAmount}
                  onChange={e => action === 'add' ? setAddAmount(e.target.value) : setRemoveAmount(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mb-3 focus:outline-none focus:border-purple-400"
                />
                <button
                  onClick={() => handleAdminAdjust(action as 'add' | 'remove')}
                  disabled={adminLoading}
                  className={`w-full py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                    action === 'add'
                      ? 'bg-[#5B39C5] text-white hover:bg-[#4a2fa8]'
                      : 'bg-red-50 text-red-600 hover:bg-red-100'
                  }`}
                >
                  {adminLoading ? 'Processing...' : `${action === 'add' ? 'Add' : 'Remove'} Points`}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
