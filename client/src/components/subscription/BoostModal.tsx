import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { MIORA_PRICING, PowerUpPackage } from '../../config/pricing';
import { X, Zap, Star, Sparkles, Clock, Crown, Rocket, Check, ArrowRight } from 'lucide-react';

type BoostTab = 'boost' | 'spotlight' | 'superlikes';

const FALLBACK_PHOTOS = [
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80'
];

const TAB_META: Record<
  BoostTab,
  {
    title: string;
    sub: string;
    icon: React.ReactNode;
    tagline: string;
    badge: string;
    accentGradient: string;
  }
> = {
  boost: {
    title: 'Boost Your Profile',
    sub: 'Get up to 10x more visibility! Jump straight to the top of Discover for everyone near you.',
    icon: <Rocket size={20} />,
    tagline: '10x Profile Views',
    badge: '⚡ Instant Visibility',
    accentGradient: 'linear-gradient(135deg, #A82046 0%, #8B1E3F 50%, #681028 100%)'
  },
  spotlight: {
    title: 'Profile Spotlight',
    sub: 'Get featured prominently on the Discover header with a glowing gold ring for 24 hours.',
    icon: <Sparkles size={20} />,
    tagline: 'Featured in Spotlight',
    badge: '✨ Header Placement',
    accentGradient: 'linear-gradient(135deg, #B8912B 0%, #D4AF37 50%, #9A7B2C 100%)'
  },
  superlikes: {
    title: 'Super Likes',
    sub: 'Send a standout Super Like with priority alerts to get 3x higher match rates.',
    icon: <Star size={20} />,
    tagline: '3x More Matches',
    badge: '👑 Priority Matches',
    accentGradient: 'linear-gradient(135deg, #C52E59 0%, #8E1538 50%, #570C20 100%)'
  }
};

// Miora subscription prices (28 days): PRO ₹499 -> ₹345, VIP ₹999 -> ₹789
const UPSELL = [
  { tab: 'pro' as const, label: 'MIORA PRO', regular: 499, offer: 345, icon: <Zap size={15} /> },
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
  const [selected, setSelected] = useState<Record<BoostTab, string>>({
    boost: 'boost_2h',
    spotlight: 'spotlight_3',
    superlikes: 'superlike_5'
  });
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
  const meta = TAB_META[activeTab];

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
    if (p.popular) return 'Most Popular';
    if (p.bestValue) return 'Best Value';
    return activeTab === 'boost' && i === 0 ? 'Quick' : 'Standard';
  };

  const cardBig = (p: PowerUpPackage) => {
    if (activeTab === 'boost') {
      if (p.durationMinutes) return { n: `${p.durationMinutes}`, unit: 'Minutes' };
      return { n: `${p.durationHours}`, unit: 'Hours' };
    }
    return {
      n: `${p.count}`,
      unit: activeTab === 'spotlight' ? (p.count > 1 ? 'Spotlights' : 'Spotlight') : p.count > 1 ? 'Super Likes' : 'Super Like'
    };
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
          maxHeight: 'min(94dvh, 820px)',
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
        {/* Top Header Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px 18px 10px 18px',
            borderBottom: '1px solid rgba(244, 197, 207, 0.45)',
            background: '#FFFFFF',
            flexShrink: 0
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #FBEDEF 0%, #FFF0F4 100%)',
                border: '1px solid #F4C5CF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#8B1E3F'
              }}
            >
              {meta.icon}
            </div>
            <div>
              <h2
                style={{
                  margin: 0,
                  fontSize: '1.05rem',
                  fontWeight: 900,
                  color: '#261D20',
                  fontFamily: 'var(--font-serif, inherit)',
                  lineHeight: 1.2
                }}
              >
                Profile Power-Ups
              </h2>
              <span style={{ fontSize: '0.74rem', color: '#7D1730', fontWeight: 600 }}>
                {meta.badge}
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
              cursor: 'pointer',
              transition: 'all 0.15s ease',
              boxShadow: '0 2px 6px rgba(0,0,0,0.04)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#FBEDEF';
              e.currentTarget.style.color = '#8B1E3F';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#FFFFFF';
              e.currentTarget.style.color = '#5C4751';
            }}
          >
            <X size={17} />
          </button>
        </div>

        {/* Tab Switcher */}
        <div style={{ padding: '12px 18px 6px 18px', flexShrink: 0, background: '#FFFFFF' }}>
          <div
            style={{
              display: 'flex',
              gap: '6px',
              padding: '4px',
              borderRadius: '9999px',
              background: '#F8E9ED',
              border: '1px solid rgba(244, 197, 207, 0.6)'
            }}
          >
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
                    padding: '9px 6px',
                    fontSize: '0.8rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    background: active
                      ? 'linear-gradient(135deg, #8B1E3F 0%, #681028 100%)'
                      : 'transparent',
                    color: active ? '#FFFFFF' : '#6B4A55',
                    boxShadow: active ? '0 4px 12px rgba(139, 30, 63, 0.3)' : 'none',
                    transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                    fontFamily: 'var(--font-sans, inherit)'
                  }}
                >
                  {t.icon}
                  <span>{t.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Scrollable Body */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '12px 18px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}
        >
          {/* Hero Showcase Card */}
          <div
            style={{
              position: 'relative',
              borderRadius: '22px',
              background: 'linear-gradient(145deg, #FFF0F4 0%, #FBEDEF 60%, #FCE4E8 100%)',
              border: '1.5px solid #F4C5CF',
              padding: '18px 16px',
              textAlign: 'center',
              boxShadow: '0 4px 16px rgba(125, 23, 48, 0.05)'
            }}
          >
            {/* Centered Avatar / Power-Up Icon */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '12px'
              }}
            >
              <div style={{ position: 'relative', display: 'inline-flex' }}>
                <div
                  style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    overflow: 'hidden',
                    border: '3px solid #8B1E3F',
                    boxShadow: '0 6px 18px rgba(139, 30, 63, 0.25)'
                  }}
                >
                  <img
                    src={heroPhotos[0]}
                    alt="User"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
                <div
                  style={{
                    position: 'absolute',
                    bottom: '-4px',
                    right: '-4px',
                    width: '26px',
                    height: '26px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #8B1E3F 0%, #D4AF37 100%)',
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '2px solid #FFFFFF',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.2)'
                  }}
                >
                  {activeTab === 'boost' ? <Rocket size={13} /> : activeTab === 'spotlight' ? <Sparkles size={13} /> : <Star size={13} />}
                </div>
              </div>
            </div>

            <h3
              style={{
                margin: '0 0 4px 0',
                fontSize: '1.35rem',
                fontWeight: 900,
                color: '#261D20',
                fontFamily: 'var(--font-serif, inherit)',
                letterSpacing: '-0.01em'
              }}
            >
              {meta.title}
            </h3>
            <p
              style={{
                margin: 0,
                fontSize: '0.84rem',
                color: '#5C4751',
                lineHeight: 1.45,
                fontWeight: 500,
                maxWidth: '380px',
                marginLeft: 'auto',
                marginRight: 'auto'
              }}
            >
              {meta.sub}
            </p>

            {isActive && (
              <div
                style={{
                  marginTop: '10px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '5px 14px',
                  borderRadius: '9999px',
                  background: 'rgba(139, 30, 63, 0.1)',
                  border: '1px solid #8B1E3F',
                  color: '#8B1E3F',
                  fontSize: '0.78rem',
                  fontWeight: 800
                }}
              >
                <Clock size={13} /> Active Now
              </div>
            )}
          </div>

          {/* Package Selection Cards */}
          <div>
            <div
              style={{
                fontSize: '0.78rem',
                fontWeight: 800,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: '#8B1E3F',
                marginBottom: '8px'
              }}
            >
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
                const isSel = p.id === selectedPkg.id;
                const big = cardBig(p);
                const sub = cardSub(p);
                const disc = cardDiscount(p);
                const badgeText = cardLabel(p, i);

                return (
                  <div
                    key={p.id}
                    onClick={() => setSelected((s) => ({ ...s, [activeTab]: p.id }))}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setSelected((s) => ({ ...s, [activeTab]: p.id }));
                      }
                    }}
                    style={{
                      borderRadius: '20px',
                      overflow: 'hidden',
                      border: isSel ? '2px solid #8B1E3F' : '1.5px solid #F4C5CF',
                      background: isSel
                        ? 'linear-gradient(180deg, #FFF4F6 0%, #FFFFFF 100%)'
                        : '#FFFFFF',
                      boxShadow: isSel
                        ? '0 8px 24px rgba(139, 30, 63, 0.16)'
                        : '0 2px 6px rgba(0, 0, 0, 0.03)',
                      display: 'flex',
                      flexDirection: 'column',
                      cursor: 'pointer',
                      transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                      position: 'relative',
                      outline: 'none',
                      userSelect: 'none'
                    }}
                  >
                    {/* Badge */}
                    <div
                      style={{
                        padding: '5px 4px',
                        textAlign: 'center',
                        fontSize: '0.68rem',
                        fontWeight: 800,
                        background: isSel
                          ? 'linear-gradient(135deg, #8B1E3F 0%, #681028 100%)'
                          : 'rgba(244, 197, 207, 0.35)',
                        color: isSel ? '#FFFFFF' : '#7D1730',
                        letterSpacing: '0.02em',
                        textTransform: 'uppercase'
                      }}
                    >
                      {badgeText}
                    </div>

                    {/* Card Content */}
                    <div
                      style={{
                        padding: '14px 8px 12px 8px',
                        textAlign: 'center',
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '2px'
                      }}
                    >
                      <div
                        style={{
                          fontSize: '1.75rem',
                          fontWeight: 900,
                          color: '#261D20',
                          lineHeight: 1,
                          fontFamily: 'var(--font-serif, inherit)'
                        }}
                      >
                        {big.n}
                      </div>
                      <div
                        style={{
                          fontSize: '0.76rem',
                          color: '#5C4751',
                          fontWeight: 700,
                          marginBottom: '6px'
                        }}
                      >
                        {big.unit}
                      </div>

                      <div
                        style={{
                          fontSize: '1.05rem',
                          fontWeight: 900,
                          color: isSel ? '#8B1E3F' : '#261D20',
                          lineHeight: 1.2
                        }}
                      >
                        ₹{p.coinPrice}
                      </div>

                      <div
                        style={{
                          fontSize: '0.68rem',
                          color: '#8F7B85',
                          minHeight: '14px',
                          fontWeight: 600
                        }}
                      >
                        {sub}
                      </div>

                      <div style={{ minHeight: '22px', marginTop: '6px' }}>
                        {disc > 0 && (
                          <span
                            style={{
                              padding: '2px 8px',
                              borderRadius: '9999px',
                              fontSize: '0.68rem',
                              fontWeight: 800,
                              background: '#ECFDF5',
                              color: '#059669',
                              border: '1px solid #A7F3D0'
                            }}
                          >
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

          {/* Membership Upsell Promo Card */}
          <div
            style={{
              background: '#FFFFFF',
              borderRadius: '20px',
              border: '1.5px solid #FCE7F3',
              padding: '12px 14px',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span
                style={{
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: '#9A7B2C'
                }}
              >
                Or Get Unlimited With Plans
              </span>
              <span
                style={{
                  fontSize: '0.68rem',
                  fontWeight: 800,
                  padding: '2px 8px',
                  borderRadius: '9999px',
                  background: 'rgba(212, 175, 55, 0.14)',
                  color: '#9A7B2C'
                }}
              >
                Best Long-Term
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              {UPSELL.map((u) => (
                <button
                  key={u.tab}
                  type="button"
                  onClick={() => openPlans(u.tab)}
                  style={{
                    border: '1px solid #F4C5CF',
                    borderRadius: '14px',
                    padding: '10px 8px',
                    background: 'linear-gradient(135deg, #FFFDFE 0%, #FFF8FA 100%)',
                    color: '#261D20',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '2px',
                    transition: 'all 0.15s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#8B1E3F';
                    e.currentTarget.style.background = '#FBEDEF';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#F4C5CF';
                    e.currentTarget.style.background = 'linear-gradient(135deg, #FFFDFE 0%, #FFF8FA 100%)';
                  }}
                >
                  <span
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontSize: '0.76rem',
                      fontWeight: 800,
                      color: '#8B1E3F'
                    }}
                  >
                    {u.icon} {u.label}
                  </span>
                  <span style={{ fontSize: '0.74rem', fontWeight: 700, color: '#5C4751' }}>
                    <span style={{ textDecoration: 'line-through', opacity: 0.55, marginRight: '4px' }}>
                      ₹{u.regular}
                    </span>
                    <span style={{ color: '#059669', fontWeight: 800 }}>₹{u.offer}</span>
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div
          style={{
            flexShrink: 0,
            padding: '12px 18px calc(14px + env(safe-area-inset-bottom, 0px)) 18px',
            background: '#FFFFFF',
            borderTop: '1px solid rgba(244, 197, 207, 0.45)',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}
        >
          {tokens > 0 && !isActive && (activeTab === 'boost' || activeTab === 'spotlight') && (
            <button
              type="button"
              onClick={handleActivateToken}
              disabled={isActivating}
              style={{
                width: '100%',
                border: '1.5px solid #8B1E3F',
                borderRadius: '9999px',
                padding: '11px',
                background: '#FBEDEF',
                color: '#8B1E3F',
                fontSize: '0.88rem',
                fontWeight: 800,
                cursor: 'pointer',
                transition: 'all 0.15s ease'
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
              width: '100%',
              border: 'none',
              borderRadius: '9999px',
              padding: '14px 20px',
              background: 'linear-gradient(135deg, #A82046 0%, #8B1E3F 50%, #681028 100%)',
              color: '#FFFFFF',
              fontSize: '0.96rem',
              fontWeight: 900,
              cursor: isActivating ? 'wait' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: '0 8px 24px rgba(139, 30, 63, 0.35)',
              transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
            }}
            onMouseEnter={(e) => {
              if (!isActivating) {
                e.currentTarget.style.transform = 'translateY(-1px)';
                e.currentTarget.style.boxShadow = '0 10px 28px rgba(139, 30, 63, 0.45)';
              }
            }}
            onMouseLeave={(e) => {
              if (!isActivating) {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(139, 30, 63, 0.35)';
              }
            }}
          >
            <Zap size={17} fill="#FFFFFF" />
            <span>
              {isActivating
                ? 'Processing...'
                : `Get ${selectedPkg.name} · ₹${selectedPkg.coinPrice}`}
            </span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
