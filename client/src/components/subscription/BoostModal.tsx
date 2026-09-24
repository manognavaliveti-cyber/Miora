import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { MIORA_PRICING, PowerUpPackage } from '../../config/pricing';
import { X, Zap, Clock, Crown, Rocket, ArrowRight } from 'lucide-react';

const FALLBACK_PHOTOS = [
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80'
];

const UPSELL = [
  { tab: 'pro' as const, label: 'PRO Membership', regular: 499, offer: 379, icon: <Zap size={14} />, badge: 'Save 24%' },
  { tab: 'vip' as const, label: 'VIP Unlimited', regular: 999, offer: 789, icon: <Crown size={14} />, badge: 'Save 21%' }
];

export const BoostModal: React.FC = () => {
  const {
    isBoostModalOpen,
    closeBoostModal,
    currentUser,
    profiles,
    walletBalance,
    activateBoost,
    buyPowerUp,
    openUpgradeFor,
    openWalletPackModal
  } = useApp();

  const packages: PowerUpPackage[] = MIORA_PRICING.powerUps.boost.packages;
  const defaultPkg = packages.find((p) => p.popular) || packages[0];
  const [selectedId, setSelectedId] = useState<string>(defaultPkg?.id || '');
  const [isActivating, setIsActivating] = useState<boolean>(false);

  useEffect(() => {
    if (isBoostModalOpen) {
      const def = packages.find((p) => p.popular) || packages[0];
      setSelectedId(def?.id || '');
    }
  }, [isBoostModalOpen]);

  if (!isBoostModalOpen) return null;

  const selectedPkg = packages.find((p) => p.id === selectedId) || defaultPkg;
  const isBoostActive = !!currentUser.boostActiveUntil && new Date(currentUser.boostActiveUntil).getTime() > Date.now();
  const tokens = currentUser.boostsCount || 0;

  const photos = [
    ...(currentUser.photos && currentUser.photos[0] ? [currentUser.photos[0]] : []),
    ...profiles.slice(0, 4).map((p) => p.photos[0]).filter(Boolean)
  ];
  const heroPhotos = [0, 1, 2, 3].map((i) => photos[i] || FALLBACK_PHOTOS[i]);

  const durationHours = (p: PowerUpPackage) =>
    p.durationHours || (p.durationMinutes ? p.durationMinutes / 60 : 0);

  const unitBoostPerHour = (() => {
    const first = packages[0];
    const h = durationHours(first);
    return h > 0 ? first.coinPrice / h : 0;
  })();

  const cardLabel = (p: PowerUpPackage, i: number) => {
    if (p.popular) return 'Most Popular';
    if (p.bestValue) return 'Best Value';
    return i === 0 ? 'Quick' : 'Standard';
  };

  const cardBig = (p: PowerUpPackage) => {
    if (p.durationMinutes) return { n: `${p.durationMinutes}`, unit: 'Minutes' };
    return { n: `${p.durationHours}`, unit: 'Hours' };
  };

  const cardSub = (p: PowerUpPackage) => {
    const h = durationHours(p);
    return h > 0 ? `₹${(p.coinPrice / h).toFixed(0)}/hr` : '';
  };

  const cardDiscount = (p: PowerUpPackage) => {
    const h = durationHours(p);
    if (h > 0 && unitBoostPerHour > 0) {
      const d = Math.round((1 - p.coinPrice / h / unitBoostPerHour) * 100);
      return d > 0 ? d : 0;
    }
    return 0;
  };

  const handleBuy = async () => {
    const price = selectedPkg.coinPrice;
    if ((walletBalance || 0) < price) {
      closeBoostModal();
      openWalletPackModal(`You need ₹${price} in your wallet to buy ${selectedPkg.name}.`, price);
      return;
    }
    setIsActivating(true);
    try {
      await buyPowerUp(selectedPkg);
    } finally {
      setIsActivating(false);
    }
  };

  const handleActivateToken = async () => {
    setIsActivating(true);
    try {
      await activateBoost();
    } finally {
      setIsActivating(false);
    }
  };

  const openPlans = (tab: 'pro' | 'vip') => {
    closeBoostModal();
    openUpgradeFor({ tab, reason: 'boost' });
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'rgba(38, 10, 20, 0.72)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'clamp(8px, 2vw, 16px)',
        boxSizing: 'border-box',
        animation: 'fadeIn 0.2s ease-out'
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) closeBoostModal();
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '480px',
          maxHeight: 'min(94dvh, 780px)',
          background: 'linear-gradient(180deg, #FFFFFF 0%, #FFF8FA 60%, #FFF2F6 100%)',
          color: '#261D20',
          borderRadius: '28px',
          boxShadow: '0 24px 60px rgba(125, 23, 48, 0.28), 0 0 0 1px rgba(244, 197, 207, 0.6)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          position: 'relative',
          animation: 'scaleUp 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px 18px 14px 18px',
            borderBottom: '1px solid rgba(244, 197, 207, 0.45)',
            background: '#FFFFFF',
            flexShrink: 0
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #A82046 0%, #8B1E3F 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFFFFF'
              }}
            >
              <Rocket size={18} />
            </div>
            <div>
              <h2 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 900, color: '#261D20', lineHeight: 1.2 }}>
                Boost Your Profile
              </h2>
              <span style={{ fontSize: '0.74rem', color: '#7D1730', fontWeight: 600 }}>
                ⚡ Up to 10× more visibility
              </span>
            </div>
          </div>
          <button
            onClick={closeBoostModal}
            aria-label="Close"
            style={{
              width: '34px',
              height: '34px',
              borderRadius: '50%',
              border: '1px solid #F4C5CF',
              background: '#FFFFFF',
              color: '#5C4751',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            <X size={17} />
          </button>
        </div>

        {/* Scrollable Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: '16px' }}>

          {/* Hero card */}
          <div
            style={{
              borderRadius: '22px',
              background: 'linear-gradient(145deg, #FFF0F4 0%, #FBEDEF 60%, #FCE4E8 100%)',
              border: '1.5px solid #F4C5CF',
              padding: '18px 16px',
              textAlign: 'center'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' }}>
              <div style={{ position: 'relative', display: 'inline-flex' }}>
                <div
                  style={{
                    width: '64px', height: '64px', borderRadius: '50%',
                    overflow: 'hidden', border: '3px solid #8B1E3F',
                    boxShadow: '0 6px 18px rgba(139, 30, 63, 0.25)'
                  }}
                >
                  <img src={heroPhotos[0]} alt="User" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div
                  style={{
                    position: 'absolute', bottom: '-4px', right: '-4px',
                    width: '26px', height: '26px', borderRadius: '50%',
                    background: 'linear-gradient(135deg, #8B1E3F 0%, #D4AF37 100%)',
                    color: '#FFFFFF', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', border: '2px solid #FFFFFF'
                  }}
                >
                  <Rocket size={13} />
                </div>
              </div>
            </div>

            <h3 style={{ margin: '0 0 6px 0', fontSize: '1.3rem', fontWeight: 900, color: '#261D20' }}>
              Get 10× More Profile Views
            </h3>
            <p style={{ margin: 0, fontSize: '0.84rem', color: '#5C4751', lineHeight: 1.45, fontWeight: 500 }}>
              Jump to the top of Discover for everyone near you. Get seen first, match faster.
            </p>

            {isBoostActive && (
              <div
                style={{
                  marginTop: '10px',
                  display: 'inline-flex', alignItems: 'center', gap: '6px',
                  padding: '5px 14px', borderRadius: '9999px',
                  background: 'rgba(139, 30, 63, 0.1)', border: '1px solid #8B1E3F',
                  color: '#8B1E3F', fontSize: '0.78rem', fontWeight: 800
                }}
              >
                <Clock size={13} /> Boost Active Now
              </div>
            )}
          </div>

          {/* Package cards */}
          <div>
            <div style={{ fontSize: '0.78rem', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#8B1E3F', marginBottom: '8px' }}>
              Choose Package
            </div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: `repeat(${packages.length}, minmax(0, 1fr))`,
                gap: '10px'
              }}
            >
              {packages.map((p, i) => {
                const isSel = p.id === selectedId;
                const big = cardBig(p);
                const sub = cardSub(p);
                const disc = cardDiscount(p);

                return (
                  <div
                    key={p.id}
                    onClick={() => setSelectedId(p.id)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setSelectedId(p.id); } }}
                    style={{
                      borderRadius: '20px',
                      overflow: 'hidden',
                      border: isSel ? '2px solid #8B1E3F' : '1.5px solid #F4C5CF',
                      background: isSel ? 'linear-gradient(180deg, #FFF4F6 0%, #FFFFFF 100%)' : '#FFFFFF',
                      boxShadow: isSel ? '0 8px 24px rgba(139, 30, 63, 0.16)' : '0 2px 6px rgba(0,0,0,0.03)',
                      display: 'flex', flexDirection: 'column', cursor: 'pointer',
                      transition: 'all 0.2s ease', outline: 'none', userSelect: 'none'
                    }}
                  >
                    <div
                      style={{
                        padding: '5px 4px', textAlign: 'center',
                        fontSize: '0.68rem', fontWeight: 800,
                        background: isSel ? 'linear-gradient(135deg, #8B1E3F 0%, #681028 100%)' : 'rgba(244, 197, 207, 0.35)',
                        color: isSel ? '#FFFFFF' : '#7D1730',
                        letterSpacing: '0.02em', textTransform: 'uppercase'
                      }}
                    >
                      {cardLabel(p, i)}
                    </div>

                    <div style={{ padding: '14px 8px 12px 8px', textAlign: 'center', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
                      <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#261D20', lineHeight: 1 }}>{big.n}</div>
                      <div style={{ fontSize: '0.76rem', color: '#5C4751', fontWeight: 700, marginBottom: '6px' }}>{big.unit}</div>
                      <div style={{ fontSize: '1.05rem', fontWeight: 900, color: isSel ? '#8B1E3F' : '#261D20' }}>₹{p.coinPrice}</div>
                      <div style={{ fontSize: '0.68rem', color: '#8F7B85', minHeight: '14px', fontWeight: 600 }}>{sub}</div>
                      <div style={{ minHeight: '22px', marginTop: '6px' }}>
                        {disc > 0 && (
                          <span style={{ padding: '2px 8px', borderRadius: '9999px', fontSize: '0.68rem', fontWeight: 800, background: '#ECFDF5', color: '#059669', border: '1px solid #A7F3D0' }}>
                            Save {disc}%
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Plans upsell */}
          <div
            style={{
              background: '#FFFFFF', borderRadius: '20px',
              border: '1.5px solid #FCE7F3', padding: '12px 14px',
              display: 'flex', flexDirection: 'column', gap: '8px'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.72rem', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#9A7B2C' }}>
                Or Go Unlimited With Plans
              </span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              {UPSELL.map((u) => (
                <button
                  key={u.tab}
                  type="button"
                  onClick={() => openPlans(u.tab)}
                  style={{
                    border: '1px solid #F4C5CF', borderRadius: '14px', padding: '10px 8px',
                    background: 'linear-gradient(135deg, #FFFDFE 0%, #FFF8FA 100%)',
                    color: '#261D20', cursor: 'pointer', display: 'flex',
                    flexDirection: 'column', alignItems: 'center', gap: '2px', transition: 'all 0.15s ease'
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.76rem', fontWeight: 800, color: '#8B1E3F' }}>
                    {u.icon} {u.label}
                  </span>
                  <span style={{ fontSize: '0.74rem', fontWeight: 700, color: '#5C4751' }}>
                    <span style={{ textDecoration: 'line-through', opacity: 0.55, marginRight: '4px' }}>₹{u.regular}</span>
                    <span style={{ color: '#059669', fontWeight: 800 }}>₹{u.offer}</span>
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            flexShrink: 0,
            padding: '12px 18px calc(14px + env(safe-area-inset-bottom, 0px)) 18px',
            background: '#FFFFFF',
            borderTop: '1px solid rgba(244, 197, 207, 0.45)',
            display: 'flex', flexDirection: 'column', gap: '8px'
          }}
        >
          {tokens > 0 && !isBoostActive && (
            <button
              type="button"
              onClick={handleActivateToken}
              disabled={isActivating}
              style={{
                width: '100%', border: '1.5px solid #8B1E3F', borderRadius: '9999px',
                padding: '11px', background: '#FBEDEF', color: '#8B1E3F',
                fontSize: '0.88rem', fontWeight: 800, cursor: 'pointer'
              }}
            >
              Activate Free Token ({tokens} Available)
            </button>
          )}

          <button
            type="button"
            onClick={handleBuy}
            disabled={isActivating}
            style={{
              width: '100%', border: 'none', borderRadius: '9999px',
              padding: '14px 20px',
              background: 'linear-gradient(135deg, #A82046 0%, #8B1E3F 50%, #681028 100%)',
              color: '#FFFFFF', fontSize: '0.96rem', fontWeight: 900,
              cursor: isActivating ? 'wait' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              boxShadow: '0 8px 24px rgba(139, 30, 63, 0.35)',
              transition: 'all 0.2s ease'
            }}
          >
            <Zap size={17} fill="#FFFFFF" />
            <span>{isActivating ? 'Processing...' : `Get ${selectedPkg?.name} · ₹${selectedPkg?.coinPrice}`}</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
