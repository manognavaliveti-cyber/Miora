import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { MIORA_PRICING, PowerUpPackage } from '../../config/pricing';
import {
  X,
  Flame,
  Zap,
  Sparkles,
  Rocket,
  Clock,
  Coins,
  Crown,
  Star,
  CheckCircle2
} from 'lucide-react';
import { Button } from '../common/Button';

export const BoostModal: React.FC = () => {
  const {
    isBoostModalOpen,
    closeBoostModal,
    currentUser,
    activateBoost,
    activateSpotlight,
    buyPowerUp,
    spendCoins,
    openUpgradeModal,
    isLoading
  } = useApp();

  const [activeTab, setActiveTab] = useState<'boost' | 'spotlight' | 'superlikes'>('boost');
  const [isActivating, setIsActivating] = useState<boolean>(false);

  if (!isBoostModalOpen) return null;

  const isBoostActive = currentUser.boostActiveUntil && new Date(currentUser.boostActiveUntil).getTime() > Date.now();
  const isSpotlightActive = currentUser.spotlightActiveUntil && new Date(currentUser.spotlightActiveUntil).getTime() > Date.now();

  const handleActivateBoost = async () => {
    setIsActivating(true);
    try {
      if (currentUser.boostsCount > 0) {
        await activateBoost();
      } else {
        const cost = MIORA_PRICING.powerUps.boost.singleCoins;
        if (currentUser.coinBalance >= cost) {
          const ok = spendCoins(cost, '30-Min Profile Boost activation');
          if (ok) await activateBoost();
        } else {
          // Open recharge or buy
          await buyPowerUp(MIORA_PRICING.powerUps.boost.packages[0]);
        }
      }
    } finally {
      setIsActivating(false);
    }
  };

  const handleActivateSpotlight = async () => {
    setIsActivating(true);
    try {
      if (currentUser.spotlightsCount > 0) {
        await activateSpotlight();
      } else {
        const cost = MIORA_PRICING.powerUps.spotlight.singleCoins;
        if (currentUser.coinBalance >= cost) {
          const ok = spendCoins(cost, '24h Profile Spotlight activation');
          if (ok) await activateSpotlight();
        } else {
          await buyPowerUp(MIORA_PRICING.powerUps.spotlight.packages[0]);
        }
      }
    } finally {
      setIsActivating(false);
    }
  };

  const handleBuyPackage = async (pkg: PowerUpPackage) => {
    setIsActivating(true);
    try {
      await buyPowerUp(pkg);
    } finally {
      setIsActivating(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'rgba(15, 23, 42, 0.75)',
        backdropFilter: 'blur(12px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        animation: 'fadeIn 0.25s ease-out forwards',
        boxSizing: 'border-box'
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) closeBoostModal();
      }}
    >
      <div
        style={{
          background: '#FFFFFF',
          width: '100%',
          maxWidth: '520px',
          maxHeight: '90vh',
          borderRadius: '28px',
          boxShadow: '0 25px 60px -15px rgba(249, 115, 22, 0.35)',
          overflowY: 'auto',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          boxSizing: 'border-box'
        }}
      >
        {/* Header Ribbon */}
        <div
          style={{
            background:
              activeTab === 'boost'
                ? 'linear-gradient(135deg, #C2410C 0%, #EA580C 50%, #F97316 100%)'
                : activeTab === 'spotlight'
                ? 'linear-gradient(135deg, #4C0519 0%, #881337 50%, #D4AF37 100%)'
                : 'linear-gradient(135deg, #854D0E 0%, #CA8A04 50%, #EAB308 100%)',
            padding: '28px 20px 20px 20px',
            color: '#FFFFFF',
            position: 'relative',
            textAlign: 'center',
            transition: 'background 0.3s ease'
          }}
        >
          <button
            onClick={closeBoostModal}
            aria-label="Close"
            style={{
              position: 'absolute',
              top: '16px',
              right: '16px',
              background: 'rgba(255, 255, 255, 0.2)',
              border: 'none',
              borderRadius: '50%',
              width: '34px',
              height: '34px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              cursor: 'pointer'
            }}
          >
            <X size={18} />
          </button>

          {/* Animated Icon Avatar */}
          <div
            style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.95)',
              margin: '0 auto 12px auto',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 20px rgba(255, 255, 255, 0.5)'
            }}
          >
            {activeTab === 'boost' && <Rocket size={32} color="#EA580C" />}
            {activeTab === 'spotlight' && <Sparkles size={32} color="#D4AF37" />}
            {activeTab === 'superlikes' && <Star size={32} color="#EAB308" fill="#EAB308" />}
          </div>

          <h2
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '1.65rem',
              fontWeight: 900,
              margin: '0 0 4px 0',
              color: '#FFFFFF'
            }}
          >
            {activeTab === 'boost' && 'Ignite Profile Boost 🚀'}
            {activeTab === 'spotlight' && 'Featured Profile Spotlight 🌟'}
            {activeTab === 'superlikes' && 'Refill Super Likes ⭐'}
          </h2>

          <p style={{ fontSize: '0.85rem', color: 'rgba(255, 255, 255, 0.9)', margin: 0 }}>
            {activeTab === 'boost' && 'Skip the queue and be the top profile for 30 minutes (10x views)'}
            {activeTab === 'spotlight' && 'Get pinned on the main Discover header for 24 full hours'}
            {activeTab === 'superlikes' && 'Get 3x more mutual matches with priority notifications'}
          </p>
        </div>

        {/* Tab Selector */}
        <div
          style={{
            display: 'flex',
            padding: '12px 20px 0 20px',
            gap: '8px',
            borderBottom: '1px solid var(--border-subtle)'
          }}
        >
          <button
            onClick={() => setActiveTab('boost')}
            style={{
              flex: 1,
              padding: '10px 4px',
              border: 'none',
              borderBottom: activeTab === 'boost' ? '3px solid #EA580C' : '3px solid transparent',
              background: 'transparent',
              fontSize: '0.82rem',
              fontWeight: 800,
              color: activeTab === 'boost' ? '#EA580C' : 'var(--text-secondary)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            <Rocket size={15} /> 30m Boost
          </button>

          <button
            onClick={() => setActiveTab('spotlight')}
            style={{
              flex: 1,
              padding: '10px 4px',
              border: 'none',
              borderBottom: activeTab === 'spotlight' ? '3px solid var(--berry-primary)' : '3px solid transparent',
              background: 'transparent',
              fontSize: '0.82rem',
              fontWeight: 800,
              color: activeTab === 'spotlight' ? 'var(--berry-primary)' : 'var(--text-secondary)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            <Sparkles size={15} /> 24h Spotlight
          </button>

          <button
            onClick={() => setActiveTab('superlikes')}
            style={{
              flex: 1,
              padding: '10px 4px',
              border: 'none',
              borderBottom: activeTab === 'superlikes' ? '3px solid #CA8A04' : '3px solid transparent',
              background: 'transparent',
              fontSize: '0.82rem',
              fontWeight: 800,
              color: activeTab === 'superlikes' ? '#CA8A04' : 'var(--text-secondary)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            <Star size={15} /> Super Likes
          </button>
        </div>

        {/* Tab Contents */}
        <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {/* TAB 1: 30-MIN BOOST */}
          {activeTab === 'boost' && (
            <>
              {/* Inventory & Status Card */}
              <div
                style={{
                  background: isBoostActive ? '#FFF7ED' : '#F8FAFC',
                  border: isBoostActive ? '1.5px solid #FDBA74' : '1px solid var(--border-subtle)',
                  borderRadius: '18px',
                  padding: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
                    Your Boost Tokens:
                  </div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--text-primary)' }}>
                    {currentUser.boostsCount} Available
                  </div>
                </div>

                {isBoostActive ? (
                  <div
                    style={{
                      background: 'linear-gradient(135deg, #EA580C, #F97316)',
                      color: '#FFFFFF',
                      padding: '6px 14px',
                      borderRadius: 'var(--radius-pill)',
                      fontSize: '0.78rem',
                      fontWeight: 800,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      animation: 'pulse 1.5s infinite'
                    }}
                  >
                    <Clock size={14} /> Boost Active
                  </div>
                ) : (
                  <Button
                    variant="primary"
                    size="sm"
                    loading={isActivating}
                    onClick={handleActivateBoost}
                    style={{
                      background: 'linear-gradient(135deg, #EA580C 0%, #F97316 100%)',
                      border: 'none',
                      boxShadow: '0 4px 14px rgba(234, 88, 12, 0.35)'
                    }}
                  >
                    <Rocket size={15} />
                    {currentUser.boostsCount > 0 ? 'Activate Now' : 'Buy & Boost (50 🪙)'}
                  </Button>
                )}
              </div>

              {/* Package bundles */}
              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
                  Boost Bundles:
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginTop: '8px' }}>
                  {MIORA_PRICING.powerUps.boost.packages.map((pkg) => (
                    <div
                      key={pkg.id}
                      onClick={() => handleBuyPackage(pkg)}
                      style={{
                        border: '1.5px solid var(--border-subtle)',
                        borderRadius: '16px',
                        padding: '12px 8px',
                        textAlign: 'center',
                        cursor: 'pointer',
                        background: '#FFFFFF',
                        transition: 'all var(--transition-fast)',
                        position: 'relative'
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#EA580C')}
                      onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--border-subtle)')}
                    >
                      {pkg.popular && (
                        <div
                          style={{
                            position: 'absolute',
                            top: '-8px',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            background: '#EA580C',
                            color: '#FFFFFF',
                            fontSize: '0.62rem',
                            fontWeight: 900,
                            padding: '1px 6px',
                            borderRadius: 'var(--radius-pill)'
                          }}
                        >
                          POPULAR
                        </div>
                      )}
                      <div style={{ fontSize: '0.95rem', fontWeight: 900, color: 'var(--text-primary)' }}>
                        {pkg.count} Boost{pkg.count > 1 ? 's' : ''}
                      </div>
                      <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', margin: '4px 0' }}>
                        ₹{pkg.priceInr} / {pkg.coinPrice} 🪙
                      </div>
                      <div style={{ fontSize: '0.68rem', color: '#EA580C', fontWeight: 700 }}>
                        {pkg.tagline}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* TAB 2: 24-HR SPOTLIGHT */}
          {activeTab === 'spotlight' && (
            <>
              <div
                style={{
                  background: isSpotlightActive ? '#FFF1F2' : '#F8FAFC',
                  border: isSpotlightActive ? '1.5px solid var(--border-gold)' : '1px solid var(--border-subtle)',
                  borderRadius: '18px',
                  padding: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
                    Your Spotlight Tokens:
                  </div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--text-primary)' }}>
                    {currentUser.spotlightsCount} Available
                  </div>
                </div>

                {isSpotlightActive ? (
                  <div
                    style={{
                      background: 'var(--primary-gradient)',
                      color: '#FFFFFF',
                      padding: '6px 14px',
                      borderRadius: 'var(--radius-pill)',
                      fontSize: '0.78rem',
                      fontWeight: 800,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <Sparkles size={14} /> Spotlight Active
                  </div>
                ) : (
                  <Button
                    variant="primary"
                    size="sm"
                    loading={isActivating}
                    onClick={handleActivateSpotlight}
                  >
                    <Sparkles size={15} />
                    {currentUser.spotlightsCount > 0 ? 'Activate 24h' : 'Get Spotlight (100 🪙)'}
                  </Button>
                )}
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
                  Spotlight Bundles:
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', marginTop: '8px' }}>
                  {MIORA_PRICING.powerUps.spotlight.packages.map((pkg) => (
                    <div
                      key={pkg.id}
                      onClick={() => handleBuyPackage(pkg)}
                      style={{
                        border: '1.5px solid var(--border-subtle)',
                        borderRadius: '16px',
                        padding: '14px 10px',
                        textAlign: 'center',
                        cursor: 'pointer',
                        background: '#FFFFFF',
                        transition: 'all var(--transition-fast)'
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--berry-primary)')}
                      onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--border-subtle)')}
                    >
                      <div style={{ fontSize: '1rem', fontWeight: 900, color: 'var(--text-primary)' }}>
                        {pkg.name}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: '4px 0' }}>
                        ₹{pkg.priceInr} or {pkg.coinPrice} Coins
                      </div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--berry-primary)', fontWeight: 700 }}>
                        {pkg.tagline}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* TAB 3: SUPER LIKES */}
          {activeTab === 'superlikes' && (
            <>
              <div
                style={{
                  background: '#FEFCE8',
                  border: '1.5px solid #FEF08A',
                  borderRadius: '18px',
                  padding: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
                    Super Likes Remaining:
                  </div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--text-primary)' }}>
                    {currentUser.superLikesRemaining} Available
                  </div>
                </div>

                <div
                  style={{
                    fontSize: '0.78rem',
                    color: '#854D0E',
                    fontWeight: 700,
                    textAlign: 'right'
                  }}
                >
                  {currentUser.isPremium ? '5 Free / Day included' : '1 Free / Week'}
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
                  Super Like Bundles:
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginTop: '8px' }}>
                  {MIORA_PRICING.powerUps.superLikes.packages.map((pkg) => (
                    <div
                      key={pkg.id}
                      onClick={() => handleBuyPackage(pkg)}
                      style={{
                        border: '1.5px solid var(--border-subtle)',
                        borderRadius: '16px',
                        padding: '12px 8px',
                        textAlign: 'center',
                        cursor: 'pointer',
                        background: '#FFFFFF',
                        transition: 'all var(--transition-fast)'
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#EAB308')}
                      onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--border-subtle)')}
                    >
                      <div style={{ fontSize: '0.95rem', fontWeight: 900, color: 'var(--text-primary)' }}>
                        {pkg.count} ⭐
                      </div>
                      <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', margin: '4px 0' }}>
                        ₹{pkg.priceInr} / {pkg.coinPrice} 🪙
                      </div>
                      <div style={{ fontSize: '0.68rem', color: '#CA8A04', fontWeight: 700 }}>
                        {pkg.tagline}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Upgrade Banner Link */}
          {!currentUser.isPremium && (
            <div
              onClick={() => {
                closeBoostModal();
                openUpgradeModal();
              }}
              style={{
                background: 'linear-gradient(135deg, #FFF1F2 0%, #FFFDFD 100%)',
                border: '1px dashed var(--border-gold)',
                borderRadius: '16px',
                padding: '12px 14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Crown size={18} color="var(--gold-deep)" />
                <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--berry-primary)' }}>
                  Get Free Boosts & Daily Super Likes with VIP
                </span>
              </div>
              <span style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--gold-deep)' }}>
                View Plans →
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
