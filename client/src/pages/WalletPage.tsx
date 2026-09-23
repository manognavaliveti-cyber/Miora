import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Sparkles,
  CreditCard,
  Plus,
  ArrowUpRight,
  ArrowDownLeft,
  Clock,
  CheckCircle2,
  ShieldCheck,
  Crown
} from 'lucide-react';
import { RechargeModal } from '../components/wallet/RechargeModal';

export const WalletPage: React.FC = () => {
  const {
    currentUser,
    coinTransactions,
    openTalkTimeModal,
    openUpgradeModal
  } = useApp();

  const [isRechargeOpen, setIsRechargeOpen] = useState(false);
  const [txnFilter, setTxnFilter] = useState<'all' | 'earned' | 'spent'>('all');

  const filteredTransactions = coinTransactions.filter((txn) => {
    if (txnFilter === 'earned') return txn.amount > 0;
    if (txnFilter === 'spent') return txn.amount < 0;
    return true;
  });

  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        padding: '8px 0 40px 0',
        width: '100%',
        margin: '0 auto',
        animation: 'fadeIn 0.25s ease-out forwards'
      }}
    >
      {/* Header Banner */}
      <div style={{ marginBottom: '24px', paddingBottom: '16px', borderBottom: '1px solid var(--border-subtle)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span
            style={{
              fontSize: '0.72rem',
              fontFamily: 'var(--font-display)',
              fontWeight: 800,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: 'var(--gold-deep)'
            }}
          >
            Real-Money Wallet & Chat Monetization
          </span>
          <Sparkles size={14} color="var(--gold-deep)" />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px', marginTop: '4px' }}>
          <div>
            <h1
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: 'clamp(1.4rem, 3.5vw, 2.2rem)',
                fontWeight: 800,
                color: 'var(--text-primary)',
                letterSpacing: '-0.02em',
                lineHeight: 1.15
              }}
            >
              MIORA Wallet <span style={{ color: 'var(--berry-primary)' }}>💳</span>
            </h1>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
              Manage your ₹ Real-Money Wallet balance for in-app chat & calling sessions.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button
              onClick={() => setIsRechargeOpen(true)}
              style={{
                background: 'var(--primary-gradient)',
                color: '#FFFFFF',
                border: 'none',
                padding: '10px 20px',
                borderRadius: 'var(--radius-pill)',
                fontWeight: 800,
                fontSize: '0.88rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: 'var(--shadow-berry-glow)',
                transition: 'transform var(--transition-fast)'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.04)')}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            >
              <Plus size={16} />
              <span>Add Money (₹)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Balance & Summary Cards Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 260px), 1fr))',
          gap: '14px',
          marginBottom: '24px'
        }}
      >
        {/* Hero Wallet Balance Card */}
        <div
          className="card-luxury"
          style={{
            padding: 'clamp(18px, 4vw, 24px)',
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(254, 242, 244, 0.9) 100%)',
            border: '2px solid var(--border-gold)',
            position: 'relative',
            overflow: 'hidden',
            borderRadius: '24px'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <span style={{ fontSize: '0.76rem', fontFamily: 'var(--font-display)', fontWeight: 800, letterSpacing: '0.12em', color: 'var(--gold-deep)', textTransform: 'uppercase' }}>
                Wallet Balance
              </span>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginTop: '6px' }}>
                <span style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--berry-primary)', fontFamily: 'var(--font-display)' }}>
                  ₹{(currentUser.walletBalance || 0).toFixed(2)}
                </span>
              </div>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                In-app balance for MIORA chat & call sessions.
              </p>
            </div>

            <div
              style={{
                width: '54px',
                height: '54px',
                borderRadius: '18px',
                background: 'var(--gold-gradient-subtle)',
                border: '1.5px solid var(--border-gold)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <CreditCard size={26} color="var(--gold-deep)" />
            </div>
          </div>

          <button
            onClick={() => setIsRechargeOpen(true)}
            style={{
              marginTop: '16px',
              width: '100%',
              background: 'var(--primary-gradient)',
              color: '#FFFFFF',
              border: 'none',
              padding: '11px',
              borderRadius: 'var(--radius-pill)',
              fontWeight: 800,
              fontSize: '0.88rem',
              cursor: 'pointer',
              boxShadow: 'var(--shadow-berry-glow)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            <Plus size={16} />
            <span>Pay ₹79 with Razorpay</span>
          </button>
        </div>

        {/* Promotional Offer Banner Card */}
        <div
          className="card-luxury"
          style={{
            padding: 'clamp(18px, 4vw, 24px)',
            background: 'linear-gradient(135deg, #FFF5F7 0%, #FFFFFF 100%)',
            border: '2px solid var(--berry-primary)',
            position: 'relative',
            borderRadius: '24px'
          }}
        >
          <span
            className="wallet-promo-badge"
            style={{
              position: 'absolute',
              top: '-10px',
              right: '18px',
              background: 'var(--primary-gradient)',
              color: '#FFFFFF',
              fontSize: '0.64rem',
              fontWeight: 900,
              padding: '3px 10px',
              borderRadius: 'var(--radius-pill)',
              boxShadow: '0 2px 8px rgba(238, 56, 101, 0.4)'
            }}
          >
            PROMOTIONAL OFFER
          </span>

          <div style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--berry-primary)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            Special Wallet Topup
          </div>

          <h3 style={{ fontSize: '1.3rem', fontWeight: 900, color: 'var(--text-primary)', margin: '4px 0' }}>
            ₹150 Wallet Credit
          </h3>

          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', margin: '4px 0' }}>
            <span style={{ fontSize: '1.1rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>
              ₹150
            </span>
            <span style={{ fontSize: '2.2rem', fontWeight: 900, color: 'var(--berry-primary)' }}>
              ₹79
            </span>
          </div>

          <button
            onClick={() => setIsRechargeOpen(true)}
            style={{
              marginTop: '12px',
              width: '100%',
              background: 'var(--primary-gradient)',
              color: '#FFFFFF',
              border: 'none',
              padding: '11px',
              borderRadius: 'var(--radius-pill)',
              fontWeight: 800,
              fontSize: '0.88rem',
              cursor: 'pointer',
              boxShadow: 'var(--shadow-berry-glow)'
            }}
          >
            Pay ₹79 with Razorpay
          </button>
        </div>

        {/* MIORA Premium Special Offer Card */}
        <div
          className="card-luxury"
          style={{
            padding: 'clamp(18px, 4vw, 24px)',
            background: 'linear-gradient(135deg, #FFFDF5 0%, #FFFFFF 100%)',
            border: '2px solid var(--border-gold)',
            position: 'relative',
            borderRadius: '24px'
          }}
        >
          <span
            style={{
              position: 'absolute',
              top: '-10px',
              right: '18px',
              background: 'var(--gold-gradient)',
              color: '#1C1217',
              fontSize: '0.64rem',
              fontWeight: 900,
              padding: '3px 10px',
              borderRadius: 'var(--radius-pill)',
              boxShadow: '0 2px 8px rgba(212, 175, 55, 0.4)'
            }}
          >
            20% OFF LIMITED OFFER
          </span>

          <div style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--gold-deep)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            MIORA Premium
          </div>

          <h3 style={{ fontSize: '1.3rem', fontWeight: 900, color: 'var(--text-primary)', margin: '4px 0' }}>
            {currentUser.isPremium ? 'VIP Active 👑' : 'Unlock All Features'}
          </h3>

          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', margin: '4px 0' }}>
            <span style={{ fontSize: '1.1rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>
              ₹499
            </span>
            <span style={{ fontSize: '2.2rem', fontWeight: 900, color: 'var(--gold-deep)' }}>
              ₹379
            </span>
          </div>

          <button
            onClick={openUpgradeModal}
            style={{
              marginTop: '12px',
              width: '100%',
              background: 'var(--gold-gradient)',
              color: '#1C1217',
              border: 'none',
              padding: '11px',
              borderRadius: 'var(--radius-pill)',
              fontWeight: 800,
              fontSize: '0.88rem',
              cursor: 'pointer'
            }}
          >
            {currentUser.isPremium ? 'Manage VIP' : 'Get Premium'}
          </button>
        </div>
      </div>

      {/* Communication & Session Pricing Table */}
      <div
        className="card-luxury"
        style={{
          marginBottom: '32px',
          padding: 'clamp(20px, 3.5vw, 28px)',
          background: 'linear-gradient(135deg, #FFFFFF 0%, #FFF8FA 100%)',
          borderRadius: '24px',
          border: '1.5px solid var(--border-gold)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
          <Sparkles size={20} color="var(--gold-deep)" />
          <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
            MIORA Session & Feature Rates
          </h4>
        </div>

        <div className="wallet-pricing-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 220px), 1fr))', gap: '16px' }}>
          {/* Text Chat Pricing */}
          <div style={{ padding: '16px', background: 'var(--surface-white)', borderRadius: '18px', border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--berry-primary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '10px' }}>
              💬 Text Chat Billing
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.92rem', color: 'var(--text-primary)', fontWeight: 700 }}>
              <span>Text Messaging</span>
              <span style={{ color: 'var(--berry-primary)' }}>₹3 / minute</span>
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '6px' }}>
              Timed sessions deducted automatically from backend ₹ wallet.
            </p>
          </div>

          {/* Audio Call Pricing */}
          <div style={{ padding: '16px', background: 'var(--surface-white)', borderRadius: '18px', border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--berry-primary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '10px' }}>
              🎙️ Audio Calling
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.92rem', color: 'var(--text-primary)', fontWeight: 700 }}>
              <span>Per Minute</span>
              <span style={{ color: 'var(--berry-primary)' }}>₹8 / min</span>
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '6px' }}>
              PRO includes up to 20 Audio calls per day limit.
            </p>
          </div>

          {/* Video Call Pricing */}
          <div style={{ padding: '16px', background: 'var(--surface-white)', borderRadius: '18px', border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--berry-primary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '10px' }}>
              📹 Video Calling
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.92rem', color: 'var(--text-primary)', fontWeight: 700 }}>
              <span>Per Minute</span>
              <span style={{ color: 'var(--berry-primary)' }}>₹12 / min</span>
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '6px' }}>
              PRO includes up to 10 Video calls per day limit.
            </p>
          </div>
        </div>
      </div>

      {/* Transactions History */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.45rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              Wallet Transaction Ledger
            </h3>
            <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
              Complete record of topups, chat sessions, call deductions, and subscriptions.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '6px' }}>
            {(['all', 'earned', 'spent'] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setTxnFilter(filter)}
                style={{
                  padding: '6px 14px',
                  borderRadius: 'var(--radius-pill)',
                  border: 'none',
                  background: txnFilter === filter ? 'var(--primary-gradient)' : 'var(--surface-white)',
                  color: txnFilter === filter ? '#FFFFFF' : 'var(--text-secondary)',
                  fontWeight: 700,
                  fontSize: '0.8rem',
                  textTransform: 'capitalize',
                  cursor: 'pointer',
                  boxShadow: txnFilter === filter ? 'var(--shadow-xs)' : 'none'
                }}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {filteredTransactions.map((txn) => {
            const isPositive = txn.amount > 0;
            return (
              <div
                key={txn.id}
                className="card-luxury"
                style={{
                  padding: '16px 20px',
                  borderRadius: '18px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div
                    style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '14px',
                      background: isPositive ? 'rgba(16, 185, 129, 0.1)' : 'var(--bg-soft-blush)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.3rem'
                    }}
                  >
                    {txn.icon || '💳'}
                  </div>

                  <div>
                    <div style={{ fontSize: '0.94rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                      {txn.description}
                    </div>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      {txn.timestamp} {txn.relatedUser && `• with ${txn.relatedUser}`}
                    </span>
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <span
                    style={{
                      fontSize: '1.15rem',
                      fontWeight: 900,
                      color: isPositive ? '#10B981' : 'var(--berry-primary)'
                    }}
                  >
                    {isPositive ? `+₹${txn.amount}` : `₹${txn.amount}`}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recharge Modal */}
      <RechargeModal isOpen={isRechargeOpen} onClose={() => setIsRechargeOpen(false)} />
    </div>
  );
};
