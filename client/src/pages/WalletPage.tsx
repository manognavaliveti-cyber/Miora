import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Coins,
  Sparkles,
  CreditCard,
  Plus,
  ArrowUpRight,
  ArrowDownLeft,
  Clock,
  Gift,
  Gamepad2,
  CheckCircle2,
  Filter,
  ShieldCheck,
  Zap,
  Flame,
  Award,
  Crown,
  Rocket,
  Star
} from 'lucide-react';
import { RechargeModal } from '../components/wallet/RechargeModal';
import { MIORA_PRICING } from '../config/pricing';

export const WalletPage: React.FC = () => {
  const {
    currentUser,
    coinTransactions,
    earnCoinsTask,
    openTalkTimeModal,
    setCurrentView,
    navigateToTab,
    openUpgradeModal,
    openBoostModal
  } = useApp();

  const [isRechargeOpen, setIsRechargeOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'earn' | 'transactions'>('overview');
  const [txnFilter, setTxnFilter] = useState<'all' | 'earned' | 'spent'>('all');
  const [claimedTasks, setClaimedTasks] = useState<Record<string, boolean>>({
    task_profile: true
  });

  const handleClaimTask = (taskId: string, coins: number, title: string) => {
    if (claimedTasks[taskId]) return;
    earnCoinsTask(taskId, coins, title);
    setClaimedTasks((prev) => ({ ...prev, [taskId]: true }));
  };

  const filteredTransactions = coinTransactions.filter((txn) => {
    if (txnFilter === 'earned') return txn.amount > 0;
    if (txnFilter === 'spent') return txn.amount < 0;
    return true;
  });

  const totalEarned = coinTransactions
    .filter((t) => t.amount > 0)
    .reduce((acc, t) => acc + t.amount, 0);

  const totalSpent = coinTransactions
    .filter((t) => t.amount < 0)
    .reduce((acc, t) => acc + Math.abs(t.amount), 0);

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
            Virtual Currency & Monetization
          </span>
          <Sparkles size={14} color="var(--gold-deep)" />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px', marginTop: '4px' }}>
          <div>
            <h1
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: 'clamp(1.6rem, 4vw, 2.2rem)',
                fontWeight: 800,
                color: 'var(--text-primary)',
                letterSpacing: '-0.02em',
                lineHeight: 1.15
              }}
            >
              MIORA Wallet <span style={{ color: 'var(--berry-primary)' }}>💰</span>
            </h1>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
              Manage your MIORA Coins, talk time, recharge packs, and virtual gift transactions.
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
              <span>Recharge Coins</span>
            </button>

            <button
              onClick={openTalkTimeModal}
              style={{
                background: 'var(--surface-white)',
                border: '1.5px solid var(--border-gold)',
                color: 'var(--gold-deep)',
                padding: '10px 18px',
                borderRadius: 'var(--radius-pill)',
                fontWeight: 800,
                fontSize: '0.88rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: 'var(--shadow-xs)'
              }}
            >
              <Clock size={16} />
              <span>Add Talk Time</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Balance & Summary Cards Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 260px), 1fr))',
          gap: '16px',
          marginBottom: '28px'
        }}
      >
        {/* Hero Coin Balance Card */}
        <div
          className="card-luxury"
          style={{
            padding: 'clamp(18px, 4vw, 28px)',
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(254, 242, 244, 0.9) 100%)',
            border: '2px solid var(--border-gold)',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <span style={{ fontSize: '0.76rem', fontFamily: 'var(--font-display)', fontWeight: 800, letterSpacing: '0.12em', color: 'var(--gold-deep)', textTransform: 'uppercase' }}>
                Total Coin Balance
              </span>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '6px' }}>
                <span style={{ fontSize: '2.8rem', fontWeight: 900, color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>
                  {currentUser.coinBalance}
                </span>
                <span style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--berry-primary)' }}>
                  Coins
                </span>
              </div>
            </div>

            <div
              style={{
                width: '60px',
                height: '60px',
                borderRadius: '20px',
                background: 'var(--gold-gradient-subtle)',
                border: '1.5px solid var(--border-gold)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--gold-deep)'
              }}
            >
              <Coins size={32} />
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '20px', paddingTop: '16px', borderTop: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.84rem' }}>
              <ArrowDownLeft size={16} color="#10B981" />
              <span style={{ color: 'var(--text-secondary)' }}>Earned: <strong style={{ color: '#10B981' }}>+{totalEarned}</strong></span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.84rem' }}>
              <ArrowUpRight size={16} color="var(--berry-primary)" />
              <span style={{ color: 'var(--text-secondary)' }}>Spent: <strong style={{ color: 'var(--berry-primary)' }}>-{totalSpent}</strong></span>
            </div>
          </div>
        </div>

        {/* Talk Time Available Card */}
        <div
          className="card-luxury"
          style={{
            padding: 'clamp(18px, 4vw, 28px)',
            background: 'var(--surface-white)',
            border: '1.5px solid var(--border-subtle)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <span style={{ fontSize: '0.76rem', fontFamily: 'var(--font-display)', fontWeight: 800, letterSpacing: '0.12em', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Conversation Talk Time
              </span>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginTop: '6px' }}>
                <span style={{ fontSize: '2.4rem', fontWeight: 900, color: 'var(--berry-primary)', fontFamily: 'var(--font-display)' }}>
                  {Math.floor(currentUser.talkTimeSecondsRemaining / 60)}m
                </span>
                <span style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-muted)' }}>
                  {currentUser.talkTimeSecondsRemaining % 60}s
                </span>
              </div>
            </div>

            <div
              style={{
                width: '54px',
                height: '54px',
                borderRadius: '18px',
                background: 'var(--bg-soft-blush)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--berry-primary)'
              }}
            >
              <Clock size={28} />
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '16px', paddingTop: '14px', borderTop: '1px solid var(--border-subtle)' }}>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>Rate: ₹14 / 20 Mins</span>
            <button
              onClick={openTalkTimeModal}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--berry-primary)',
                fontSize: '0.84rem',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <span>Extend Time</span>
              <Zap size={14} />
            </button>
          </div>
        </div>

        {/* Gifts & Rewards Stats Card */}
        <div
          className="card-luxury"
          style={{
            padding: 'clamp(18px, 4vw, 28px)',
            background: 'var(--surface-white)',
            border: '1.5px solid var(--border-subtle)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}
        >
          <div>
            <span style={{ fontSize: '0.76rem', fontFamily: 'var(--font-display)', fontWeight: 800, letterSpacing: '0.12em', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Social Gifts & Game Wins
            </span>
            <div style={{ display: 'flex', gap: '20px', marginTop: '10px' }}>
              <div>
                <div style={{ fontSize: '1.6rem', fontWeight: 900, color: 'var(--text-primary)' }}>
                  48
                </div>
                <span style={{ fontSize: '0.76rem', color: 'var(--text-secondary)' }}>Gifts Received</span>
              </div>
              <div>
                <div style={{ fontSize: '1.6rem', fontWeight: 900, color: 'var(--gold-deep)' }}>
                  {currentUser.gamesWonCount || 6}
                </div>
                <span style={{ fontSize: '0.76rem', color: 'var(--text-secondary)' }}>Games Won</span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px', marginTop: '16px', paddingTop: '14px', borderTop: '1px solid var(--border-subtle)' }}>
            {['❤️ 24', '🌹 12', '💎 3', '👑 1'].map((g, i) => (
              <span
                key={i}
                style={{
                  background: 'var(--bg-soft-blush)',
                  padding: '3px 8px',
                  borderRadius: 'var(--radius-pill)',
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  color: 'var(--text-primary)'
                }}
              >
                {g}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* VIP Membership & Power-Ups Showcase */}
      <div
        style={{
          background: 'linear-gradient(135deg, #4C0519 0%, #881337 50%, #BE123C 100%)',
          borderRadius: '24px',
          padding: '24px',
          color: '#FFFFFF',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '16px',
          boxShadow: '0 15px 35px -5px rgba(136, 19, 55, 0.3)',
          marginBottom: '8px',
          flexWrap: 'wrap'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div
            style={{
              width: '54px',
              height: '54px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #FDE68A 0%, #D4AF37 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 20px rgba(212, 175, 55, 0.5)',
              flexShrink: 0
            }}
          >
            <Crown size={28} color="#4C0519" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.35rem', fontWeight: 900, color: '#FFFFFF', margin: 0 }}>
                {currentUser.isPremium ? 'MIORA VIP Active 👑' : 'MIORA VIP Membership'}
              </h3>
              <span
                style={{
                  background: 'rgba(253, 230, 138, 0.25)',
                  color: '#FDE68A',
                  border: '1px solid rgba(253, 230, 138, 0.5)',
                  fontSize: '0.68rem',
                  fontWeight: 900,
                  padding: '2px 8px',
                  borderRadius: 'var(--radius-pill)'
                }}
              >
                {currentUser.subscriptionTier?.toUpperCase() || 'FREE'}
              </span>
            </div>
            <p style={{ fontSize: '0.84rem', color: 'rgba(255, 255, 255, 0.88)', margin: '4px 0 0 0' }}>
              {currentUser.isPremium
                ? 'Unlimited Swipes, Unblurred Admirers, and 5 Daily Super Likes active'
                : 'Get Unlimited Swipes, reveal secret admirers, and boost your matches'}
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={openBoostModal}
            style={{
              background: 'rgba(255, 255, 255, 0.15)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              color: '#FFFFFF',
              padding: '10px 18px',
              borderRadius: 'var(--radius-pill)',
              fontWeight: 800,
              fontSize: '0.84rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Rocket size={15} /> Power-Ups
          </button>

          <button
            onClick={openUpgradeModal}
            style={{
              background: 'linear-gradient(135deg, #FDE68A 0%, #D4AF37 100%)',
              border: 'none',
              color: '#4C0519',
              padding: '10px 20px',
              borderRadius: 'var(--radius-pill)',
              fontWeight: 900,
              fontSize: '0.84rem',
              cursor: 'pointer',
              boxShadow: '0 4px 15px rgba(212, 175, 55, 0.4)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Crown size={16} /> {currentUser.isPremium ? 'Manage VIP' : 'Upgrade to VIP'}
          </button>
        </div>
      </div>

      {/* Tabs Switcher: Overview / Earn Coins / Transactions */}
      <div
        className="scroll-touch-x"
        style={{
          display: 'flex',
          gap: '8px',
          marginBottom: '20px',
          borderBottom: '1.5px solid var(--border-subtle)',
          paddingBottom: '8px',
          overflowX: 'auto',
          whiteSpace: 'nowrap'
        }}
      >
        {[
          { id: 'overview', label: 'Recharge Packages', icon: <CreditCard size={16} /> },
          { id: 'earn', label: 'Earn Free Coins', icon: <Award size={16} /> },
          { id: 'transactions', label: 'Transaction History', icon: <Clock size={16} /> }
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 16px',
                borderRadius: 'var(--radius-pill)',
                border: 'none',
                background: isActive ? 'var(--primary-gradient)' : 'transparent',
                color: isActive ? '#FFFFFF' : 'var(--text-secondary)',
                fontWeight: 800,
                fontSize: '0.86rem',
                cursor: 'pointer',
                transition: 'all var(--transition-fast)',
                flexShrink: 0
              }}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: Recharge Packages Grid */}
      {activeTab === 'overview' && (
        <div>
          <div style={{ marginBottom: '16px' }}>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.45rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              Select Coin Package
            </h3>
            <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
              Instant crediting via Razorpay TEST Checkout • Cryptographically verified.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 220px), 1fr))', gap: '18px' }}>
            {MIORA_PRICING.rechargePackages.map((pkg) => (
              <div
                key={pkg.id}
                className="card-luxury"
                style={{
                  padding: '24px',
                  borderRadius: '24px',
                  border: pkg.popular ? '2px solid var(--berry-primary)' : '1.5px solid var(--border-subtle)',
                  background: pkg.popular
                    ? 'linear-gradient(135deg, #FFFFFF 0%, #FFF5F7 100%)'
                    : 'var(--surface-white)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  position: 'relative',
                  transition: 'all var(--transition-fast)'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-4px)')}
                onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
              >
                {pkg.popular && (
                  <span
                    style={{
                      position: 'absolute',
                      top: '-10px',
                      right: '18px',
                      background: 'var(--primary-gradient)',
                      color: '#FFFFFF',
                      fontSize: '0.66rem',
                      fontWeight: 900,
                      padding: '3px 10px',
                      borderRadius: 'var(--radius-pill)',
                      boxShadow: '0 2px 8px rgba(238, 56, 101, 0.4)'
                    }}
                  >
                    MOST POPULAR
                  </span>
                )}
                {pkg.bestValue && (
                  <span
                    style={{
                      position: 'absolute',
                      top: '-10px',
                      right: '18px',
                      background: 'var(--gold-gradient)',
                      color: '#1C1217',
                      fontSize: '0.66rem',
                      fontWeight: 900,
                      padding: '3px 10px',
                      borderRadius: 'var(--radius-pill)',
                      boxShadow: '0 2px 8px rgba(212, 175, 55, 0.4)'
                    }}
                  >
                    BEST VALUE
                  </span>
                )}

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '1.4rem' }}>{pkg.icon || '🪙'}</span>
                      <span style={{ fontSize: '1.1rem', fontWeight: 900, color: 'var(--text-primary)' }}>
                        {pkg.name || 'Coin Pack'}
                      </span>
                    </div>
                  </div>

                  <div style={{ fontSize: '2.2rem', fontWeight: 900, color: 'var(--text-primary)', marginTop: '4px' }}>
                    ₹{pkg.priceInr.toLocaleString()}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '10px' }}>
                    <Coins size={20} color="var(--gold-deep)" />
                    <span style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                      {pkg.coins.toLocaleString()} Coins
                    </span>
                  </div>

                  {pkg.bonusCoins > 0 ? (
                    <div
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        background: 'var(--gold-gradient-subtle)',
                        border: '1px solid var(--border-gold)',
                        color: 'var(--gold-deep)',
                        fontWeight: 800,
                        fontSize: '0.78rem',
                        padding: '3px 8px',
                        borderRadius: 'var(--radius-pill)',
                        marginTop: '8px'
                      }}
                    >
                      <Sparkles size={12} />
                      <span>+{pkg.bonusCoins.toLocaleString()} Bonus Free</span>
                    </div>
                  ) : (
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '8px' }}>
                      — Standard Base Pack
                    </div>
                  )}
                </div>

                <button
                  onClick={() => setIsRechargeOpen(true)}
                  style={{
                    marginTop: '20px',
                    width: '100%',
                    background: pkg.popular ? 'var(--primary-gradient)' : 'var(--bg-soft-blush)',
                    color: pkg.popular ? '#FFFFFF' : 'var(--berry-primary)',
                    border: 'none',
                    padding: '11px',
                    borderRadius: 'var(--radius-pill)',
                    fontWeight: 800,
                    fontSize: '0.88rem',
                    cursor: 'pointer',
                    boxShadow: pkg.popular ? 'var(--shadow-berry-glow)' : 'none',
                    transition: 'all var(--transition-fast)'
                  }}
                >
                  Buy Now • ₹{pkg.priceInr.toLocaleString()}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: Earn Free Coins */}
      {activeTab === 'earn' && (
        <div>
          <div style={{ marginBottom: '16px' }}>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.45rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              Complete Tasks & Earn Coins
            </h3>
            <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
              Participate in romantic couple games, daily check-ins, and dating discussion rooms.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {MIORA_PRICING.earnTasks.map((task) => {
              const isClaimed = claimedTasks[task.id];
              return (
                <div
                  key={task.id}
                  className="card-luxury"
                  style={{
                    padding: '20px 24px',
                    borderRadius: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '14px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div
                      style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '16px',
                        background: 'var(--gold-gradient-subtle)',
                        border: '1px solid var(--border-gold)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.6rem'
                      }}
                    >
                      {task.icon}
                    </div>

                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                          {task.title}
                        </h4>
                        <span
                          style={{
                            background: 'var(--gold-gradient-subtle)',
                            color: 'var(--gold-deep)',
                            border: '1px solid var(--border-gold)',
                            fontSize: '0.72rem',
                            fontWeight: 800,
                            padding: '2px 8px',
                            borderRadius: 'var(--radius-pill)'
                          }}
                        >
                          +💰 {task.rewardCoins} Coins
                        </span>
                      </div>
                      <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                        {task.description}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      if (task.id === 'task_play_game') navigateToTab('play');
                      else if (task.id === 'task_join_room') navigateToTab('rooms');
                      else if (task.id === 'task_post_feed') navigateToTab('feed');
                      else handleClaimTask(task.id, task.rewardCoins, task.title);
                    }}
                    disabled={isClaimed}
                    style={{
                      background: isClaimed ? '#E5E7EB' : 'var(--primary-gradient)',
                      color: isClaimed ? '#9CA3AF' : '#FFFFFF',
                      border: 'none',
                      padding: '9px 22px',
                      borderRadius: 'var(--radius-pill)',
                      fontWeight: 800,
                      fontSize: '0.86rem',
                      cursor: isClaimed ? 'default' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      boxShadow: isClaimed ? 'none' : 'var(--shadow-berry-glow)'
                    }}
                  >
                    {isClaimed ? (
                      <>
                        <CheckCircle2 size={16} />
                        <span>Claimed</span>
                      </>
                    ) : (
                      <>
                        <Sparkles size={16} />
                        <span>{task.actionText}</span>
                      </>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: Transactions History */}
      {activeTab === 'transactions' && (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
            <div>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.45rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                Transaction History
              </h3>
              <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                Complete ledger of your recharges, gifts sent/received, talk time, and game rewards.
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
                      {txn.icon || '💰'}
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
                      {isPositive ? `+${txn.amount}` : txn.amount !== 0 ? txn.amount : '₹'} Coins
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Recharge Modal */}
      <RechargeModal isOpen={isRechargeOpen} onClose={() => setIsRechargeOpen(false)} />
    </div>
  );
};
