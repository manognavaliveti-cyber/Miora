import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { MIORA_PRICING, PowerUpPackage } from '../../config/pricing';
import { X, Zap, Rocket, Crown, ArrowRight, Sparkles } from 'lucide-react';

const UPSELL = [
  { tab: 'pro' as const, label: 'MIORA PRO', regular: 499, offer: 345 },
  { tab: 'vip' as const, label: 'MIORA VIP', regular: 999, offer: 789 }
];

export const BoostModal: React.FC = () => {
  const {
    isBoostModalOpen,
    closeBoostModal,
    currentUser,
    walletBalance,
    activateBoost,
    buyPowerUp,
    openUpgradeFor,
    openWalletPackModal
  } = useApp();

  const packages: PowerUpPackage[] = MIORA_PRICING.powerUps.boost.packages;
  const defaultPkg = packages.find((p) => p.popular) || packages[1] || packages[0];
  const [selectedId, setSelectedId] = useState<string>(defaultPkg?.id || 'boost_2h');
  const [isActivating, setIsActivating] = useState<boolean>(false);

  useEffect(() => {
    if (isBoostModalOpen) {
      const def = packages.find((p) => p.popular) || packages[1] || packages[0];
      setSelectedId(def?.id || 'boost_2h');
    }
  }, [isBoostModalOpen]);

  if (!isBoostModalOpen) return null;

  const selectedPkg = packages.find((p) => p.id === selectedId) || defaultPkg;
  const isBoostActive = !!currentUser.boostActiveUntil && new Date(currentUser.boostActiveUntil).getTime() > Date.now();
  const tokens = currentUser.boostsCount || 0;

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

  // Button text generation matching selected package
  const getButtonText = () => {
    if (isActivating) return 'Processing...';
    if (selectedPkg.durationMinutes) {
      return `Get ${selectedPkg.durationMinutes} Minutes Boost • ₹${selectedPkg.coinPrice}`;
    }
    const hrs = selectedPkg.durationHours || 2;
    return `Get ${hrs} ${hrs === 1 ? 'Hour' : 'Hours'} Boost • ₹${selectedPkg.coinPrice}`;
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'rgba(20, 10, 15, 0.65)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'clamp(10px, 2.5vw, 20px)',
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
          maxWidth: '440px',
          maxHeight: 'min(94dvh, 760px)',
          background: '#FFFFFF',
          color: '#1F171A',
          borderRadius: '32px',
          boxShadow: '0 24px 60px rgba(125, 23, 48, 0.22), 0 0 0 1px rgba(244, 197, 207, 0.5)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          position: 'relative',
          padding: '24px 20px 20px 20px',
          boxSizing: 'border-box',
          animation: 'scaleUp 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      >
        {/* Modal Top Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '20px',
            flexShrink: 0
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '16px',
                background: '#FDF0F3',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#9E2A4B'
              }}
            >
              <Rocket size={22} color="#9E2A4B" />
            </div>
            <div>
              <h2
                style={{
                  fontFamily: "'Cormorant Garamond', 'Playfair Display', Georgia, serif",
                  fontSize: '1.42rem',
                  fontWeight: 800,
                  color: '#1F171A',
                  margin: 0,
                  lineHeight: 1.15
                }}
              >
                Boost Your Profile
              </h2>
              <span
                style={{
                  fontSize: '0.81rem',
                  color: '#BE1846',
                  fontWeight: 600,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  marginTop: '2px'
                }}
              >
                <Zap size={13} fill="#BE1846" color="#BE1846" /> Up to 10× more visibility
              </span>
            </div>
          </div>

          <button
            onClick={closeBoostModal}
            aria-label="Close"
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              border: 'none',
              background: '#F7F4F6',
              color: '#6B7280',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'background 0.2s ease'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = '#E5E7EB')}
            onMouseLeave={(e) => (e.currentTarget.style.background = '#F7F4F6')}
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Main Content Body */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
            paddingRight: '2px'
          }}
        >
          {/* Hero Banner Card */}
          <div
            style={{
              borderRadius: '24px',
              background: 'linear-gradient(135deg, #FFF5F7 0%, #FFEBF0 50%, #FFDFE7 100%)',
              border: '1.5px solid rgba(244, 114, 182, 0.25)',
              padding: '24px 20px',
              position: 'relative',
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              boxShadow: '0 8px 24px rgba(244, 114, 182, 0.08)'
            }}
          >
            {/* Left Content */}
            <div style={{ flex: 1, paddingRight: '12px', zIndex: 2 }}>
              <h3
                style={{
                  fontFamily: "'Cormorant Garamond', 'Playfair Display', Georgia, serif",
                  fontSize: '1.75rem',
                  fontWeight: 800,
                  color: '#1F171A',
                  margin: 0,
                  lineHeight: 1.15
                }}
              >
                Get <span style={{ color: '#BE1846', fontWeight: 900 }}>10×</span> More Profile Views
              </h3>
              <p
                style={{
                  fontSize: '0.84rem',
                  color: '#6B7280',
                  margin: '10px 0 0 0',
                  lineHeight: 1.45,
                  fontWeight: 500
                }}
              >
                Jump to the top of Discover for everyone near you. Get seen first, match faster.
              </p>
            </div>

            {/* Right Card Graphic Illustration (SVG) */}
            <div
              style={{
                width: '105px',
                height: '105px',
                position: 'relative',
                flexShrink: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {/* Soft Pink Background Glow & Sparkles */}
              <div
                style={{
                  position: 'absolute',
                  inset: '-10px',
                  background: 'radial-gradient(circle, rgba(244, 114, 182, 0.35) 0%, transparent 70%)',
                  borderRadius: '50%'
                }}
              />
              <span style={{ position: 'absolute', top: '2px', right: '4px', fontSize: '1rem' }}>💖</span>
              <span style={{ position: 'absolute', bottom: '12px', left: '-2px', fontSize: '0.9rem' }}>💕</span>

              {/* White Profile Card Vector */}
              <div
                style={{
                  width: '68px',
                  height: '84px',
                  background: '#FFFFFF',
                  borderRadius: '12px',
                  boxShadow: '0 10px 24px rgba(158, 42, 75, 0.18)',
                  padding: '8px',
                  boxSizing: 'border-box',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '6px',
                  transform: 'rotate(-6deg)',
                  position: 'relative',
                  border: '1px solid rgba(244, 197, 207, 0.6)'
                }}
              >
                <div
                  style={{
                    width: '34px',
                    height: '34px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #F472B6 0%, #BE1846 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#FFFFFF'
                  }}
                >
                  <div style={{ width: '16px', height: '16px', borderRadius: '50%', background: '#801B38' }} />
                </div>
                <div style={{ width: '80%', height: '4px', background: '#FCE7F1', borderRadius: '9999px' }} />
                <div style={{ width: '50%', height: '4px', background: '#FCE7F1', borderRadius: '9999px' }} />
              </div>

              {/* Upward Growth Pink Arrow */}
              <div
                style={{
                  position: 'absolute',
                  top: '12px',
                  right: '-4px',
                  width: '32px',
                  height: '48px',
                  color: '#F43F5E',
                  transform: 'rotate(12deg)'
                }}
              >
                <svg viewBox="0 0 24 36" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
                  <path d="M4 32 C10 24, 14 16, 20 4 M12 4 L20 4 L20 12" stroke="#F43F5E" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>

              {/* Deep Rose Rocket Emblem Badge */}
              <div
                style={{
                  position: 'absolute',
                  bottom: '2px',
                  right: '2px',
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #BE1846 0%, #801B38 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFFFFF',
                  boxShadow: '0 4px 12px rgba(190, 24, 70, 0.4)',
                  border: '2px solid #FFFFFF'
                }}
              >
                <Rocket size={16} fill="#FFFFFF" color="#FFFFFF" style={{ transform: 'rotate(45deg)' }} />
              </div>
            </div>
          </div>

          {/* Active Boost Alert Pill (If boost is running) */}
          {isBoostActive && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '8px 16px',
                borderRadius: '9999px',
                background: '#FCE7F1',
                border: '1px solid #9E2A4B',
                color: '#9E2A4B',
                fontSize: '0.82rem',
                fontWeight: 800
              }}
            >
              <Zap size={15} fill="#9E2A4B" />
              <span>Boost Active Now! Your profile is currently receiving 10× visibility.</span>
            </div>
          )}

          {/* Package Selection Section: "👑 Choose Package" */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
              <span style={{ fontSize: '1.25rem' }}>👑</span>
              <h4
                style={{
                  fontFamily: "'Cormorant Garamond', 'Playfair Display', Georgia, serif",
                  fontSize: '1.35rem',
                  fontWeight: 800,
                  color: '#1F171A',
                  margin: 0
                }}
              >
                Choose Package
              </h4>
            </div>

            {/* 3 Package Cards Grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '10px'
              }}
            >
              {/* Option 1: Quick (30 Minutes) */}
              <div
                onClick={() => setSelectedId('boost_30m')}
                role="button"
                tabIndex={0}
                style={{
                  borderRadius: '24px',
                  border: selectedId === 'boost_30m' ? '2px solid #9E2A4B' : '1.5px solid #F3E8EE',
                  background: selectedId === 'boost_30m' ? 'linear-gradient(180deg, #FFF9FA 0%, #FFFFFF 100%)' : '#FFFFFF',
                  padding: '16px 8px 14px 8px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  position: 'relative',
                  boxShadow: selectedId === 'boost_30m' ? '0 8px 24px rgba(158, 42, 75, 0.12)' : 'none',
                  transition: 'all 0.2s ease'
                }}
              >
                <span
                  style={{
                    background: '#FCE7F1',
                    color: '#9E2A4B',
                    padding: '3px 12px',
                    borderRadius: '9999px',
                    fontSize: '0.68rem',
                    fontWeight: 800,
                    letterSpacing: '0.04em',
                    whiteSpace: 'nowrap'
                  }}
                >
                  QUICK
                </span>
                <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#1F171A', margin: '12px 0 0 0', lineHeight: 1 }}>
                  30
                </div>
                <div style={{ fontSize: '0.78rem', color: '#6B7280', fontWeight: 500, margin: '2px 0 10px 0' }}>
                  Minutes
                </div>
                <div style={{ width: '40px', height: '1px', background: '#F3E8EE', margin: '0 auto 10px auto' }} />
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#9E2A4B' }}>₹100</div>
                <div style={{ fontSize: '0.72rem', color: '#9CA3AF', fontWeight: 500, marginTop: '2px' }}>₹200/hr</div>
                <div style={{ height: '22px', marginTop: '10px' }} />
              </div>

              {/* Option 2: Most Popular (2 Hours) */}
              <div
                onClick={() => setSelectedId('boost_2h')}
                role="button"
                tabIndex={0}
                style={{
                  borderRadius: '24px',
                  border: selectedId === 'boost_2h' ? '2px solid #9E2A4B' : '1.5px solid #F3E8EE',
                  background: selectedId === 'boost_2h' ? 'linear-gradient(180deg, #FFF9FA 0%, #FFFFFF 100%)' : '#FFFFFF',
                  padding: '16px 6px 14px 6px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  position: 'relative',
                  boxShadow: selectedId === 'boost_2h' ? '0 8px 24px rgba(158, 42, 75, 0.12)' : 'none',
                  transition: 'all 0.2s ease'
                }}
              >
                <span
                  style={{
                    background: '#9E2A4B',
                    color: '#FFFFFF',
                    padding: '4px 10px',
                    borderRadius: '9999px',
                    fontSize: '0.64rem',
                    fontWeight: 800,
                    letterSpacing: '0.03em',
                    whiteSpace: 'nowrap',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '3px'
                  }}
                >
                  ✦ MOST POPULAR ✦
                </span>
                <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#1F171A', margin: '12px 0 0 0', lineHeight: 1 }}>
                  2
                </div>
                <div style={{ fontSize: '0.78rem', color: '#6B7280', fontWeight: 500, margin: '2px 0 10px 0' }}>
                  Hours
                </div>
                <div style={{ width: '40px', height: '1px', background: '#F3E8EE', margin: '0 auto 10px auto' }} />
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#9E2A4B' }}>₹250</div>
                <div style={{ fontSize: '0.72rem', color: '#9CA3AF', fontWeight: 500, marginTop: '2px' }}>₹125/hr</div>
                <div style={{ marginTop: '10px' }}>
                  <span
                    style={{
                      background: '#FCE7F1',
                      color: '#9E2A4B',
                      padding: '3px 10px',
                      borderRadius: '9999px',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      whiteSpace: 'nowrap'
                    }}
                  >
                    Save 38%
                  </span>
                </div>
              </div>

              {/* Option 3: Best Value (24 Hours) */}
              <div
                onClick={() => setSelectedId('boost_24h')}
                role="button"
                tabIndex={0}
                style={{
                  borderRadius: '24px',
                  border: selectedId === 'boost_24h' ? '2px solid #9E2A4B' : '1.5px solid #F3E8EE',
                  background: selectedId === 'boost_24h' ? 'linear-gradient(180deg, #FFF9FA 0%, #FFFFFF 100%)' : '#FFFFFF',
                  padding: '16px 8px 14px 8px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  position: 'relative',
                  boxShadow: selectedId === 'boost_24h' ? '0 8px 24px rgba(158, 42, 75, 0.12)' : 'none',
                  transition: 'all 0.2s ease'
                }}
              >
                <span
                  style={{
                    background: '#FCE7F1',
                    color: '#9E2A4B',
                    padding: '3px 10px',
                    borderRadius: '9999px',
                    fontSize: '0.68rem',
                    fontWeight: 800,
                    letterSpacing: '0.04em',
                    whiteSpace: 'nowrap'
                  }}
                >
                  BEST VALUE
                </span>
                <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#1F171A', margin: '12px 0 0 0', lineHeight: 1 }}>
                  24
                </div>
                <div style={{ fontSize: '0.78rem', color: '#6B7280', fontWeight: 500, margin: '2px 0 10px 0' }}>
                  Hours
                </div>
                <div style={{ width: '40px', height: '1px', background: '#F3E8EE', margin: '0 auto 10px auto' }} />
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#9E2A4B' }}>₹600</div>
                <div style={{ fontSize: '0.72rem', color: '#9CA3AF', fontWeight: 500, marginTop: '2px' }}>₹25/hr</div>
                <div style={{ marginTop: '10px' }}>
                  <span
                    style={{
                      background: '#D1FAE5',
                      color: '#047857',
                      padding: '3px 10px',
                      borderRadius: '9999px',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      whiteSpace: 'nowrap'
                    }}
                  >
                    Save 88%
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* "∞ OR GO UNLIMITED WITH PLANS" Card Box */}
          <div
            style={{
              background: '#FFFDFE',
              borderRadius: '20px',
              border: '1.5px solid #FCE7F1',
              padding: '16px 14px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '1.1rem', color: '#9E2A4B', fontWeight: 800, lineHeight: 1 }}>∞</span>
              <span
                style={{
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  letterSpacing: '0.06em',
                  color: '#9E2A4B',
                  textTransform: 'uppercase'
                }}
              >
                OR GO UNLIMITED WITH PLANS
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              {UPSELL.map((u) => (
                <button
                  key={u.tab}
                  type="button"
                  onClick={() => openPlans(u.tab)}
                  style={{
                    border: '1px solid #FCE7F1',
                    borderRadius: '16px',
                    padding: '12px 10px',
                    background: '#FFFFFF',
                    color: '#1F171A',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    transition: 'all 0.15s ease'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#F472B6')}
                  onMouseLeave={(e) => (e.currentTarget.style.borderColor = '#FCE7F1')}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.8rem', fontWeight: 800, color: '#1F171A' }}>
                    <Crown size={15} color="#9E2A4B" /> {u.label}
                  </span>
                  <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#6B7280' }}>
                    <span style={{ textDecoration: 'line-through', color: '#9CA3AF', marginRight: '4px', fontSize: '0.78rem' }}>₹{u.regular}</span>
                    <span style={{ color: '#BE1846', fontWeight: 800, fontSize: '0.88rem' }}>₹{u.offer}</span>
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Bottom Action Button */}
        <div
          style={{
            flexShrink: 0,
            paddingTop: '14px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}
        >
          {tokens > 0 && !isBoostActive && (
            <button
              type="button"
              onClick={handleActivateToken}
              disabled={isActivating}
              style={{
                width: '100%',
                border: '1.5px solid #9E2A4B',
                borderRadius: '9999px',
                padding: '12px',
                background: '#FCE7F1',
                color: '#9E2A4B',
                fontSize: '0.88rem',
                fontWeight: 800,
                cursor: 'pointer',
                marginBottom: '4px'
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
              height: '54px',
              border: 'none',
              borderRadius: '9999px',
              background: 'linear-gradient(135deg, #A31D45 0%, #801B38 100%)',
              color: '#FFFFFF',
              fontSize: '0.96rem',
              fontWeight: 800,
              cursor: isActivating ? 'wait' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              boxShadow: '0 8px 24px rgba(163, 29, 69, 0.35)',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.015)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          >
            <Zap size={18} fill="#FFFFFF" color="#FFFFFF" />
            <span>{getButtonText()}</span>
            <ArrowRight size={18} strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </div>
  );
};

