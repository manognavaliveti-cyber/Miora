import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { MIORA_PRICING, PowerUpPackage } from '../../config/pricing';
import { X, Zap, Star, Sparkles, Clock, Crown, Rocket } from 'lucide-react';

type BoostTab = 'boost' | 'spotlight' | 'superlikes';

const FALLBACK_PHOTOS = [
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80'
];

const TAB_COPY: Record<BoostTab, { title: string; sub: string; cta: string }> = {
  boost: {
    title: 'Boost your profile',
    sub: 'Get 10x more views! You will appear first for profiles around you.',
    cta: 'Get now'
  },
  spotlight: {
    title: 'Profile Spotlight',
    sub: 'Get pinned on the Discover header for 24 full hours.',
    cta: 'Get now'
  },
  superlikes: {
    title: 'Super Likes',
    sub: 'Stand out with 3x more mutual matches and priority alerts.',
    cta: 'Get now'
  }
};

// Miora subscription prices (28 days): PRO ₹499 -> ₹379, VIP ₹999 -> ₹789
const UPSELL = [
  { tab: 'pro' as const, label: 'MIORA PRO', regular: 499, offer: 379, icon: <Zap size={15} /> },
  { tab: 'vip' as const, label: 'MIORA VIP', regular: 999, offer: 789, icon: <Crown size={15} /> }
];

export const BoostModal: React.FC = () => {
  const {
    isBoostModalOpen,
    closeBoostModal,
    currentUser,
    profiles,
    walletBalance,
    activateBoost,
    activateSpotlight,
    buyPowerUp,
    openUpgradeFor,
    openWalletPackModal
  } = useApp();

  const [activeTab, setActiveTab] = useState<BoostTab>('boost');
  const [selected, setSelected] = useState<Record<BoostTab, string>>({ boost: 'boost_2h', spotlight: 'spotlight_3', superlikes: 'superlike_5' });
  const [isActivating, setIsActivating] = useState<boolean>(false);

  useEffect(() => {
    if (isBoostModalOpen) setActiveTab('boost');
  }, [isBoostModalOpen]);

  if (!isBoostModalOpen) return null;

  const packagesByTab: Record<BoostTab, PowerUpPackage[]> = {
    boost: MIORA_PRICING.powerUps.boost.packages,
    spotlight: MIORA_PRICING.powerUps.spotlight.packages,
    superlikes: MIORA_PRICING.powerUps.superLikes.packages
  };
  const packages = packagesByTab[activeTab];
  const selectedPkg = packages.find((p) => p.id === selected[activeTab]) || packages.find((p) => p.popular) || packages[0];
  const copy = TAB_COPY[activeTab];

  const isBoostActive = !!currentUser.boostActiveUntil && new Date(currentUser.boostActiveUntil).getTime() > Date.now();
  const isSpotlightActive = !!currentUser.spotlightActiveUntil && new Date(currentUser.spotlightActiveUntil).getTime() > Date.now();
  const tokens = activeTab === 'boost' ? currentUser.boostsCount || 0 : activeTab === 'spotlight' ? currentUser.spotlightsCount || 0 : 0;
  const isActive = activeTab === 'boost' ? isBoostActive : activeTab === 'spotlight' ? isSpotlightActive : false;

  const photos = [
    ...(currentUser.photos && currentUser.photos[0] ? [currentUser.photos[0]] : []),
    ...profiles.slice(0, 4).map((p) => p.photos[0]).filter(Boolean)
  ];
  const heroPhotos = [0, 1, 2, 3].map((i) => photos[i] || FALLBACK_PHOTOS[i]);

  const durationHours = (p: PowerUpPackage) => p.durationHours || (p.durationMinutes ? p.durationMinutes / 60 : 0);
  const unitBoostPerHour = (() => {
    const first = MIORA_PRICING.powerUps.boost.packages[0];
    const h = durationHours(first);
    return h > 0 ? first.coinPrice / h : 0;
  })();

  const cardLabel = (p: PowerUpPackage, i: number) => {
    if (p.popular) return 'Popular';
    if (p.bestValue) return 'Best value';
    return activeTab === 'boost' && i === 0 ? 'Quick' : 'Standard';
  };
  const cardBig = (p: PowerUpPackage) => {
    if (activeTab === 'boost') {
      if (p.durationMinutes) return { n: `${p.durationMinutes}`, unit: 'Minutes' };
      return { n: `${p.durationHours}`, unit: 'Hours' };
    }
    return { n: `${p.count}`, unit: activeTab === 'spotlight' ? (p.count > 1 ? 'Spotlights' : 'Spotlight') : p.count > 1 ? 'Super Likes' : 'Super Like' };
  };
  const cardSub = (p: PowerUpPackage) => {
    if (activeTab === 'boost') {
      const h = durationHours(p);
      return h > 0 ? `₹${(p.coinPrice / h).toFixed(0)}/hr` : '';
    }
    return p.count > 1 ? `₹${(p.coinPrice / p.count).toFixed(0)} each` : '';
  };
  const cardDiscount = (p: PowerUpPackage) => {
    if (activeTab === 'boost') {
      const h = durationHours(p);
      if (h > 0 && unitBoostPerHour > 0) {
        const d = Math.round((1 - p.coinPrice / h / unitBoostPerHour) * 100);
        return d > 0 ? d : 0;
      }
      return 0;
    }
    const single = packages[0];
    if (p.count > 1 && single && single.count === 1) {
      const d = Math.round((1 - p.coinPrice / p.count / single.coinPrice) * 100);
      return d > 0 ? d : 0;
    }
    return 0;
  };

  const handleBuy = async () => {
    const price = selectedPkg.coinPrice;
    if ((walletBalance || 0) < price) {
      // Same add-money pop-up as chat & games
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
      if (activeTab === 'boost') await activateBoost();
      else if (activeTab === 'spotlight') await activateSpotlight();
    } finally {
      setIsActivating(false);
    }
  };

  const openPlans = (tab: 'pro' | 'vip') => {
    closeBoostModal();
    openUpgradeFor({ tab, reason: 'boost' });
  };

  const ORANGE = '#F26B3A';

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'rgba(8, 4, 2, 0.8)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '12px',
        boxSizing: 'border-box',
        animation: 'fadeIn 0.2s ease-out'
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) closeBoostModal();
      }}
    >
      <style>{`
        @keyframes bmSheetIn { from { opacity: 0; transform: translateY(26px) scale(0.98); } to { opacity: 1; transform: translateY(0) scale(1); } }
        @keyframes bmTick { 0%,100% { transform: rotate(-3deg); } 50% { transform: rotate(3deg); } }
        @keyframes bmFloatA { 0%,100% { transform: translateY(0) rotate(var(--r)); } 50% { transform: translateY(-7px) rotate(var(--r)); } }
        @keyframes bmGlow { 0%,100% { box-shadow: 0 0 0 0 rgba(242,107,58,0.45), 0 12px 30px rgba(242,107,58,0.35); } 50% { box-shadow: 0 0 0 8px rgba(242,107,58,0), 0 12px 34px rgba(242,107,58,0.55); } }
        .bm-scroll::-webkit-scrollbar { width: 0; }
        .bm-card { transition: transform .22s cubic-bezier(.34,1.56,.64,1), border-color .2s ease; cursor: pointer; }
        .bm-card:hover { transform: translateY(-3px); }
        .bm-btn { transition: transform .2s ease, filter .2s ease; }
        .bm-btn:hover:not(:disabled) { transform: translateY(-2px); filter: brightness(1.07); }
        .bm-btn:active:not(:disabled) { transform: scale(0.98); }
        @media (prefers-reduced-motion: reduce) { .bm-tick, .bm-float, .bm-cta { animation: none !important; } }
      `}</style>

      <div
        style={{
          width: '100%',
          maxWidth: '440px',
          height: 'min(94dvh, 860px)',
          background: 'linear-gradient(180deg, #2B1409 0%, #170B06 42%, #0F0805 100%)',
          color: '#FFFFFF',
          borderRadius: '26px',
          boxShadow: '0 30px 80px rgba(0,0,0,0.6)',
          border: '1px solid rgba(255,255,255,0.08)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          position: 'relative',
          animation: 'bmSheetIn 0.35s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      >
        {/* Top bar: close + tabs */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '14px 14px 6px 14px', flexShrink: 0 }}>
          <button
            onClick={closeBoostModal}
            aria-label="Close"
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              border: 'none',
              background: 'rgba(255,255,255,0.1)',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              flexShrink: 0
            }}
          >
            <X size={18} />
          </button>

          <div style={{ flex: 1, display: 'flex', gap: '4px', padding: '4px', borderRadius: '9999px', background: 'rgba(255,255,255,0.08)' }}>
            {([
              { id: 'boost', label: 'Boost', icon: <Rocket size={14} /> },
              { id: 'spotlight', label: 'Spotlight', icon: <Sparkles size={14} /> },
              { id: 'superlikes', label: 'Super Likes', icon: <Star size={14} /> }
            ] as { id: BoostTab; label: string; icon: React.ReactNode }[]).map((t) => {
              const active = activeTab === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id)}
                  style={{
                    flex: 1,
                    border: 'none',
                    borderRadius: '9999px',
                    padding: '8px 4px',
                    fontSize: '0.78rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '5px',
                    background: active ? ORANGE : 'transparent',
                    color: active ? '#FFFFFF' : 'rgba(255,255,255,0.65)',
                    transition: 'all .2s ease'
                  }}
                >
                  {t.icon}
                  {t.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="bm-scroll" style={{ flex: 1, overflowY: 'auto', padding: '4px 18px 8px 18px' }}>
          {/* Hero art */}
          <div style={{ position: 'relative', height: '226px', margin: '0 auto', maxWidth: '360px' }}>
            {/* floating profile cards */}
            {[
              { left: '2%', top: '10px', r: '-9deg', d: '0s' },
              { right: '2%', top: '2px', r: '8deg', d: '0.6s' },
              { left: '15%', bottom: '2px', r: '-6deg', d: '1.1s' },
              { right: '14%', bottom: '0px', r: '9deg', d: '0.3s' }
            ].map((pos, i) => (
              <div
                key={i}
                className="bm-float"
                style={
                  {
                    position: 'absolute',
                    width: '72px',
                    height: '84px',
                    borderRadius: '14px',
                    overflow: 'hidden',
                    border: '2.5px solid rgba(255,255,255,0.92)',
                    boxShadow: '0 10px 24px rgba(0,0,0,0.45)',
                    '--r': pos.r,
                    transform: `rotate(${pos.r})`,
                    animation: `bmFloatA 4.2s ease-in-out ${pos.d} infinite`,
                    left: (pos as any).left,
                    right: (pos as any).right,
                    top: (pos as any).top,
                    bottom: (pos as any).bottom,
                    zIndex: 1
                  } as React.CSSProperties
                }
              >
                <img src={heroPhotos[i]} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            ))}

            {/* centre icon: stopwatch (boost), star burst (spotlight / super likes) */}
            <div className="bm-tick" style={{ position: 'absolute', left: '50%', top: '50%', width: '150px', height: '150px', marginLeft: '-75px', marginTop: '-75px', zIndex: 2, animation: 'bmTick 2.4s ease-in-out infinite', transformOrigin: '50% 60%' }}>
              {activeTab === 'boost' ? (
                <svg viewBox="0 0 200 200" width="150" height="150">
                  <defs>
                    <radialGradient id="bmBody" cx="35%" cy="30%" r="80%">
                      <stop offset="0%" stopColor="#FF8A57" />
                      <stop offset="100%" stopColor="#E2411B" />
                    </radialGradient>
                  </defs>
                  <rect x="86" y="6" width="28" height="22" rx="8" fill="#F26B3A" />
                  <rect x="92" y="26" width="16" height="16" fill="#C8341A" />
                  <circle cx="100" cy="116" r="78" fill="url(#bmBody)" />
                  <circle cx="100" cy="116" r="78" fill="none" stroke="#FFB38F" strokeOpacity="0.5" strokeWidth="3" />
                  <rect x="46" y="88" width="108" height="56" rx="12" fill="#4A3C33" />
                  <rect x="46" y="88" width="108" height="56" rx="12" fill="none" stroke="#2B211B" strokeWidth="3" />
                  <text x="100" y="128" textAnchor="middle" fontSize="30" fontWeight="900" fontFamily="Manrope, Arial, sans-serif" fill="#E3D2C3" stroke="#B59F8E" strokeWidth="0.6" letterSpacing="1">
                    BOOST
                  </text>
                  <path d="M104 62 L92 84 H101 L96 100 L110 76 H101 Z" fill="#FFE2C8" />
                </svg>
              ) : (
                <svg viewBox="0 0 200 200" width="150" height="150">
                  <defs>
                    <radialGradient id="bmStar" cx="40%" cy="30%" r="80%">
                      <stop offset="0%" stopColor="#FFE9A8" />
                      <stop offset="100%" stopColor="#F2A93A" />
                    </radialGradient>
                  </defs>
                  <circle cx="100" cy="100" r="82" fill="#F26B3A" fillOpacity="0.18" />
                  <circle cx="100" cy="100" r="62" fill="#F26B3A" fillOpacity="0.25" />
                  <path
                    d="M100 28 L118 78 L172 80 L129 112 L145 164 L100 134 L55 164 L71 112 L28 80 L82 78 Z"
                    fill="url(#bmStar)"
                    stroke="#FFF3CF"
                    strokeWidth="4"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </div>
          </div>

          {/* Title */}
          <div style={{ textAlign: 'center', marginTop: '6px' }}>
            <h2 style={{ margin: 0, fontSize: '2rem', fontWeight: 900, letterSpacing: '-0.02em' }}>{copy.title}</h2>
            <p style={{ margin: '8px auto 0 auto', maxWidth: '340px', fontSize: '0.95rem', lineHeight: 1.45, color: 'rgba(255,255,255,0.85)' }}>{copy.sub}</p>
            {isActive && (
              <div
                style={{
                  marginTop: '10px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '5px 14px',
                  borderRadius: '9999px',
                  background: 'rgba(242,107,58,0.18)',
                  border: `1px solid ${ORANGE}`,
                  color: '#FFB08F',
                  fontSize: '0.78rem',
                  fontWeight: 800
                }}
              >
                <Clock size={13} /> {activeTab === 'boost' ? 'Boost' : 'Spotlight'} is active now
              </div>
            )}
          </div>

          {/* Package cards */}
          <div style={{ display: 'grid', gridTemplateColumns: `repeat(${packages.length}, minmax(0, 1fr))`, gap: '10px', marginTop: '20px' }}>
            {packages.map((p, i) => {
              const isSel = p.id === selectedPkg.id;
              const big = cardBig(p);
              const sub = cardSub(p);
              const disc = cardDiscount(p);
              return (
                <div
                  key={p.id}
                  className="bm-card"
                  onClick={() => setSelected((s) => ({ ...s, [activeTab]: p.id }))}
                  style={{
                    borderRadius: '18px',
                    overflow: 'hidden',
                    border: `2px solid ${isSel ? ORANGE : 'rgba(255,255,255,0.14)'}`,
                    background: isSel ? 'rgba(242,107,58,0.10)' : 'rgba(255,255,255,0.04)',
                    boxShadow: isSel ? '0 0 26px rgba(242,107,58,0.35)' : 'none',
                    display: 'flex',
                    flexDirection: 'column'
                  }}
                >
                  <div
                    style={{
                      padding: '7px 4px',
                      textAlign: 'center',
                      fontSize: '0.72rem',
                      fontWeight: 800,
                      background: isSel ? ORANGE : 'rgba(255,255,255,0.07)',
                      color: isSel ? '#FFFFFF' : 'rgba(255,255,255,0.65)'
                    }}
                  >
                    {cardLabel(p, i)}
                  </div>
                  <div style={{ padding: '14px 6px 12px 6px', textAlign: 'center', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
                    <div style={{ fontSize: '1.9rem', fontWeight: 900, lineHeight: 1 }}>{big.n}</div>
                    <div style={{ fontSize: '0.86rem', color: 'rgba(255,255,255,0.8)', marginBottom: '6px' }}>{big.unit}</div>
                    <div style={{ fontSize: '1.02rem', fontWeight: 900, color: isSel ? '#FF9A72' : '#FFFFFF' }}>₹{p.coinPrice}</div>
                    <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.6)', minHeight: '14px' }}>{sub}</div>
                    <div style={{ minHeight: '24px', marginTop: '6px' }}>
                      {disc > 0 && (
                        <span
                          style={{
                            padding: '3px 9px',
                            borderRadius: '8px',
                            fontSize: '0.72rem',
                            fontWeight: 800,
                            background: isSel ? ORANGE : 'rgba(255,255,255,0.12)',
                            color: '#FFFFFF'
                          }}
                        >
                          -{disc}%
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer: CTA + plan upsell with Miora prices */}
        <div style={{ flexShrink: 0, padding: '10px 18px calc(16px + env(safe-area-inset-bottom, 0px)) 18px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {tokens > 0 && !isActive && (activeTab === 'boost' || activeTab === 'spotlight') && (
            <button
              onClick={handleActivateToken}
              disabled={isActivating}
              className="bm-btn"
              style={{
                width: '100%',
                border: `1.5px solid ${ORANGE}`,
                borderRadius: '9999px',
                padding: '13px',
                background: 'transparent',
                color: '#FFB08F',
                fontSize: '0.95rem',
                fontWeight: 800,
                cursor: 'pointer'
              }}
            >
              Activate now · {tokens} available
            </button>
          )}

          <button
            onClick={handleBuy}
            disabled={isActivating}
            className="bm-btn bm-cta"
            style={{
              width: '100%',
              border: 'none',
              borderRadius: '9999px',
              padding: '16px',
              background: `linear-gradient(135deg, #F26B3A 0%, #FF8A57 100%)`,
              color: '#2A0F04',
              fontSize: '1.02rem',
              fontWeight: 900,
              cursor: isActivating ? 'wait' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              animation: 'bmGlow 2.6s ease-in-out infinite'
            }}
          >
            <Zap size={18} fill="#2A0F04" />
            {isActivating ? 'Please wait…' : `${copy.cta} ${selectedPkg.name} · ₹${selectedPkg.coinPrice}`}
          </button>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            {UPSELL.map((u) => (
              <button
                key={u.tab}
                onClick={() => openPlans(u.tab)}
                className="bm-btn"
                style={{
                  border: '1px solid rgba(255,255,255,0.12)',
                  borderRadius: '9999px',
                  padding: '12px 8px',
                  background: 'rgba(255,255,255,0.09)',
                  color: '#FFFFFF',
                  fontSize: '0.8rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '2px'
                }}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  {u.icon} Upgrade to {u.label.replace('MIORA ', '')}
                </span>
                <span style={{ fontSize: '0.78rem', fontWeight: 700 }}>
                  <span style={{ textDecoration: 'line-through', opacity: 0.55, marginRight: '6px' }}>₹{u.regular}</span>
                  <span style={{ color: '#FFB08F' }}>₹{u.offer}</span>
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
