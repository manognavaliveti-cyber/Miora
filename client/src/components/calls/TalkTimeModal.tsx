import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Clock, Coins, CreditCard, Sparkles, X, ShieldCheck, Zap } from 'lucide-react';
import { MIORA_PRICING } from '../../config/pricing';

export const TalkTimeModal: React.FC = () => {
  const {
    isTalkTimeModalOpen,
    closeTalkTimeModal,
    currentUser,
    extendTalkTimeWithCoins,
    extendTalkTimeWithInr
  } = useApp();

  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  if (!isTalkTimeModalOpen) return null;

  const handlePayInr = async () => {
    setIsProcessing(true);
    await extendTalkTimeWithInr(MIORA_PRICING.talkTime.inrPer20Minutes, 20);
    setIsProcessing(false);
  };

  const handlePayCoins = () => {
    extendTalkTimeWithCoins();
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(31, 22, 26, 0.75)',
        backdropFilter: 'blur(16px)',
        padding: '16px',
        animation: 'fadeIn 0.25s ease-out'
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '460px',
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
        {/* Ambient Top Glow */}
        <div
          style={{
            position: 'absolute',
            top: '-60px',
            right: '-60px',
            width: '160px',
            height: '160px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(238, 56, 101, 0.25) 0%, transparent 70%)',
            pointerEvents: 'none'
          }}
        />

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
        <div style={{ textAlign: 'center', marginBottom: '22px' }}>
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
            <Clock size={28} color="#FFFFFF" />
          </div>
          <h3
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '1.55rem',
              fontWeight: 800,
              color: 'var(--text-primary)',
              marginBottom: '6px'
            }}
          >
            Extend Talk Time
          </h3>
          <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
            Keep your romantic conversation flowing seamlessly without interruptions.
          </p>
        </div>

        {/* Current Talk Time Status */}
        <div
          style={{
            background: 'var(--surface-white)',
            borderRadius: '20px',
            padding: '12px 18px',
            border: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '20px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Zap size={18} color="var(--berry-primary)" />
            <span style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-primary)' }}>
              Current Talk Time
            </span>
          </div>
          <span style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--berry-primary)' }}>
            {Math.floor(currentUser.talkTimeSecondsRemaining / 60)}:
            {String(currentUser.talkTimeSecondsRemaining % 60).padStart(2, '0')} remaining
          </span>
        </div>

        {/* Option 1: Direct ₹14 for 20 mins (Recommended) */}
        <div
          style={{
            background: 'linear-gradient(135deg, rgba(238, 56, 101, 0.08) 0%, rgba(251, 113, 133, 0.04) 100%)',
            border: '2px solid var(--berry-primary)',
            borderRadius: '24px',
            padding: '18px 20px',
            marginBottom: '14px',
            position: 'relative'
          }}
        >
          <span
            style={{
              position: 'absolute',
              top: '-10px',
              right: '20px',
              background: 'var(--primary-gradient)',
              color: '#FFFFFF',
              fontSize: '0.66rem',
              fontWeight: 800,
              letterSpacing: '0.08em',
              padding: '2px 10px',
              borderRadius: 'var(--radius-pill)',
              boxShadow: '0 2px 8px rgba(238, 56, 101, 0.3)'
            }}
          >
            BEST VALUE
          </span>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--text-primary)' }}>
                  ₹{MIORA_PRICING.talkTime.inrPer20Minutes}
                </span>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>/ 20 Minutes</span>
              </div>
              <span style={{ fontSize: '0.78rem', color: 'var(--berry-primary)', fontWeight: 700 }}>
                Instant High-Quality Audio & Video
              </span>
            </div>

            <button
              onClick={handlePayInr}
              disabled={isProcessing}
              style={{
                background: 'var(--primary-gradient)',
                color: '#FFFFFF',
                border: 'none',
                padding: '10px 22px',
                borderRadius: 'var(--radius-pill)',
                fontWeight: 800,
                fontSize: '0.88rem',
                cursor: isProcessing ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: 'var(--shadow-berry-glow)',
                transition: 'transform var(--transition-fast)'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.04)')}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            >
              <CreditCard size={16} />
              <span>{isProcessing ? 'Processing...' : 'Pay ₹14'}</span>
            </button>
          </div>
        </div>

        {/* Option 2: Exchange Coins (50 Coins -> +10 Mins) */}
        <div
          style={{
            background: 'var(--surface-white)',
            border: '1.5px solid var(--border-subtle)',
            borderRadius: '24px',
            padding: '18px 20px',
            marginBottom: '18px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Coins size={20} color="var(--gold-deep)" />
                <span style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  50 Coins
                </span>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>→ +10 Minutes</span>
              </div>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', display: 'block', marginTop: '3px' }}>
                Your Balance: 💰 {currentUser.coinBalance} Coins
              </span>
            </div>

            <button
              onClick={handlePayCoins}
              style={{
                background: currentUser.coinBalance >= 50 ? 'var(--gold-gradient-subtle)' : '#E5E7EB',
                color: currentUser.coinBalance >= 50 ? 'var(--gold-deep)' : '#9CA3AF',
                border: '1.5px solid ' + (currentUser.coinBalance >= 50 ? 'var(--border-gold)' : '#E5E7EB'),
                padding: '10px 20px',
                borderRadius: 'var(--radius-pill)',
                fontWeight: 800,
                fontSize: '0.86rem',
                cursor: currentUser.coinBalance >= 50 ? 'pointer' : 'not-allowed',
                transition: 'transform var(--transition-fast)'
              }}
              onMouseEnter={(e) => {
                if (currentUser.coinBalance >= 50) e.currentTarget.style.transform = 'scale(1.04)';
              }}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            >
              Use Coins
            </button>
          </div>
        </div>

        {/* Trust & Safety notice */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '0.75rem' }}>
          <ShieldCheck size={14} color="var(--gold-deep)" />
          <span>Secure Encrypted Connection • Centralized MIORA Monetization</span>
        </div>
      </div>
    </div>
  );
};
