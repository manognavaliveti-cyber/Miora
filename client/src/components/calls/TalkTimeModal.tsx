import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Clock, Coins, Phone, Video, Sparkles, X, ShieldCheck, Zap, Crown } from 'lucide-react';
import { MIORA_PRICING, CallMinutePackage } from '../../config/pricing';

export const TalkTimeModal: React.FC = () => {
  const {
    isTalkTimeModalOpen,
    closeTalkTimeModal,
    currentUser,
    extendTalkTimeWithCoins,
    openUpgradeModal
  } = useApp();

  const [callType, setCallType] = useState<'audio' | 'video'>('audio');
  const packages = callType === 'audio' ? MIORA_PRICING.calls.audio : MIORA_PRICING.calls.video;
  const isVip = currentUser.subscriptionTier === 'vip';

  if (!isTalkTimeModalOpen) return null;

  const handleSelectPackage = (pkg: CallMinutePackage) => {
    extendTalkTimeWithCoins(pkg.minutes, pkg.coins, pkg.type);
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 110,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(31, 22, 26, 0.78)',
        backdropFilter: 'blur(16px)',
        padding: '16px',
        animation: 'fadeIn 0.25s ease-out'
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '500px',
          maxHeight: '90vh',
          overflowY: 'auto',
          background: 'linear-gradient(180deg, #FFFFFF 0%, #FFF5F7 100%)',
          borderRadius: '28px',
          boxShadow: '0 24px 60px rgba(76, 5, 25, 0.35)',
          border: '1.5px solid var(--border-gold)',
          padding: 'clamp(20px, 4vw, 28px) clamp(16px, 3.5vw, 24px)',
          position: 'relative'
        }}
      >
        {/* Close Button */}
        <button
          onClick={closeTalkTimeModal}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            background: 'rgba(238, 56, 101, 0.08)',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: 'var(--text-secondary)'
          }}
        >
          <X size={18} />
        </button>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '20px',
              background: 'var(--primary-gradient)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 12px auto',
              boxShadow: 'var(--shadow-berry-glow)'
            }}
          >
            {callType === 'audio' ? <Phone size={28} color="#FFFFFF" /> : <Video size={28} color="#FFFFFF" />}
          </div>
          <h3
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '1.55rem',
              fontWeight: 800,
              color: 'var(--text-primary)',
              marginBottom: '4px'
            }}
          >
            Call Minutes & Talk Time
          </h3>
          <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
            High-definition encrypted private calling. Top up with your MIORA Coins.
          </p>
        </div>

        {/* Call Type Toggle: Audio vs Video */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '8px',
            background: 'rgba(238, 56, 101, 0.08)',
            padding: '4px',
            borderRadius: 'var(--radius-pill)',
            marginBottom: '16px'
          }}
        >
          <button
            onClick={() => setCallType('audio')}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '10px 16px',
              borderRadius: 'var(--radius-pill)',
              border: 'none',
              background: callType === 'audio' ? 'var(--primary-gradient)' : 'transparent',
              color: callType === 'audio' ? '#FFFFFF' : 'var(--text-secondary)',
              fontWeight: 800,
              fontSize: '0.88rem',
              cursor: 'pointer',
              boxShadow: callType === 'audio' ? '0 2px 8px rgba(238, 56, 101, 0.3)' : 'none',
              transition: 'all var(--transition-fast)'
            }}
          >
            <Phone size={16} />
            <span>🎙️ Audio Call</span>
          </button>

          <button
            onClick={() => setCallType('video')}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '10px 16px',
              borderRadius: 'var(--radius-pill)',
              border: 'none',
              background: callType === 'video' ? 'var(--primary-gradient)' : 'transparent',
              color: callType === 'video' ? '#FFFFFF' : 'var(--text-secondary)',
              fontWeight: 800,
              fontSize: '0.88rem',
              cursor: 'pointer',
              boxShadow: callType === 'video' ? '0 2px 8px rgba(238, 56, 101, 0.3)' : 'none',
              transition: 'all var(--transition-fast)'
            }}
          >
            <Video size={16} />
            <span>📹 Video Call</span>
          </button>
        </div>

        {/* Current Talk Time Status & Wallet Info */}
        <div
          style={{
            background: 'var(--surface-white)',
            borderRadius: '18px',
            padding: '12px 18px',
            border: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '16px'
          }}
        >
          <div>
            <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 800 }}>
              Remaining Talk Time
            </span>
            <div style={{ fontSize: '1.05rem', fontWeight: 900, color: 'var(--berry-primary)' }}>
              {Math.floor(currentUser.talkTimeSecondsRemaining / 60)}m {currentUser.talkTimeSecondsRemaining % 60}s
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 800 }}>
              Coin Balance
            </span>
            <div style={{ fontSize: '1.05rem', fontWeight: 900, color: 'var(--gold-deep)' }}>
              🪙 {currentUser.coinBalance} Coins
            </div>
          </div>
        </div>

        {/* VIP Discount Announcement Banner if VIP */}
        {isVip ? (
          <div
            style={{
              background: 'var(--gold-gradient-subtle)',
              border: '1px solid var(--border-gold)',
              borderRadius: '16px',
              padding: '10px 14px',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '0.8rem',
              color: 'var(--gold-deep)',
              fontWeight: 800
            }}
          >
            <Crown size={16} />
            <span>VIP Perk Active: 20% Discount applied to all call rates! 👑</span>
          </div>
        ) : (
          <div
            onClick={openUpgradeModal}
            style={{
              background: 'rgba(238, 56, 101, 0.05)',
              border: '1px dashed var(--berry-primary)',
              borderRadius: '16px',
              padding: '10px 14px',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: 'var(--berry-primary)', fontWeight: 700 }}>
              <Sparkles size={14} />
              <span>Get 20% OFF all calls with VIP</span>
            </div>
            <span style={{ fontSize: '0.76rem', color: 'var(--gold-deep)', fontWeight: 900 }}>Upgrade →</span>
          </div>
        )}

        {/* Minute Packages List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
          {packages.map((pkg) => {
            const finalCoins = isVip ? Math.round(pkg.coins * 0.8) : pkg.coins;
            const canAfford = currentUser.coinBalance >= finalCoins;

            return (
              <div
                key={pkg.id}
                onClick={() => handleSelectPackage(pkg)}
                style={{
                  background: pkg.popular
                    ? 'linear-gradient(135deg, rgba(238, 56, 101, 0.08) 0%, rgba(251, 113, 133, 0.04) 100%)'
                    : 'var(--surface-white)',
                  border: pkg.popular ? '2px solid var(--berry-primary)' : '1.5px solid var(--border-subtle)',
                  borderRadius: '20px',
                  padding: '14px 18px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  position: 'relative',
                  transition: 'all var(--transition-fast)'
                }}
              >
                {pkg.popular && (
                  <span
                    style={{
                      position: 'absolute',
                      top: '-9px',
                      right: '18px',
                      background: 'var(--primary-gradient)',
                      color: '#FFFFFF',
                      fontSize: '0.62rem',
                      fontWeight: 900,
                      padding: '2px 8px',
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
                      top: '-9px',
                      right: '18px',
                      background: 'var(--gold-gradient)',
                      color: '#1C1217',
                      fontSize: '0.62rem',
                      fontWeight: 900,
                      padding: '2px 8px',
                      borderRadius: 'var(--radius-pill)',
                      boxShadow: '0 2px 8px rgba(212, 175, 55, 0.4)'
                    }}
                  >
                    BEST VALUE
                  </span>
                )}

                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div
                    style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '14px',
                      background: pkg.popular ? 'var(--primary-gradient)' : 'var(--bg-soft-blush)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: pkg.popular ? '#FFFFFF' : 'var(--berry-primary)',
                      fontSize: '1.1rem',
                      fontWeight: 900
                    }}
                  >
                    {pkg.minutes}m
                  </div>

                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                        {pkg.minutes} {pkg.minutes === 1 ? 'Minute' : 'Minutes'}
                      </span>
                      {pkg.savingsPercent && (
                        <span
                          style={{
                            background: 'var(--gold-gradient-subtle)',
                            color: 'var(--gold-deep)',
                            border: '1px solid var(--border-gold)',
                            fontSize: '0.66rem',
                            fontWeight: 800,
                            padding: '2px 6px',
                            borderRadius: 'var(--radius-pill)'
                          }}
                        >
                          Save {pkg.savingsPercent}%
                        </span>
                      )}
                    </div>
                    <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>{pkg.tagline}</span>
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', justifyContent: 'flex-end' }}>
                    <Coins size={16} color="var(--gold-deep)" />
                    <span style={{ fontSize: '1.15rem', fontWeight: 900, color: 'var(--text-primary)' }}>
                      {finalCoins}
                    </span>
                    {isVip && (
                      <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>
                        {pkg.coins}
                      </span>
                    )}
                  </div>
                  <span
                    style={{
                      fontSize: '0.72rem',
                      color: canAfford ? '#10B981' : '#EF4444',
                      fontWeight: 800
                    }}
                  >
                    {canAfford ? 'Instant Top-Up' : 'Need Recharge'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Security Trust Footnote */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '0.75rem' }}>
          <ShieldCheck size={14} color="var(--gold-deep)" />
          <span>Encrypted WebRTC Audio & Video Calling • Instant Coin Deduction</span>
        </div>
      </div>
    </div>
  );
};
