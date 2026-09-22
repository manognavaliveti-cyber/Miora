import React, { useEffect } from 'react';
import { useApp } from '../../context/AppContext';

export const GiftAnimationOverlay: React.FC = () => {
  const { activeGiftAnimation, clearGiftAnimation } = useApp();

  useEffect(() => {
    if (!activeGiftAnimation) return;

    const timer = setTimeout(() => {
      clearGiftAnimation();
    }, 3000);

    return () => clearTimeout(timer);
  }, [activeGiftAnimation]);

  if (!activeGiftAnimation) return null;

  const { gift, senderName, recipientName } = activeGiftAnimation;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 120,
        pointerEvents: 'none',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(15, 9, 12, 0.4)',
        backdropFilter: 'blur(4px)',
        animation: 'fadeIn 0.3s ease-out'
      }}
    >
      {/* Floating Particles */}
      {[...Array(16)].map((_, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            top: `${20 + Math.sin(i) * 35}%`,
            left: `${20 + Math.cos(i) * 35}%`,
            fontSize: `${1.6 + (i % 4) * 0.4}rem`,
            animation: `floatUpSlow ${2 + (i % 3) * 0.5}s ease-out forwards`,
            opacity: 0.9
          }}
        >
          {gift.emoji}
        </div>
      ))}

      {/* Center Giant Gift Burst */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          animation: 'bounceIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
        }}
      >
        <div
          style={{
            width: '130px',
            height: '130px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, rgba(238, 56, 101, 0.9) 0%, rgba(245, 158, 11, 0.9) 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '4.5rem',
            boxShadow: '0 0 60px rgba(238, 56, 101, 0.7)',
            marginBottom: '18px',
            border: '3px solid #FFFFFF'
          }}
        >
          {gift.emoji}
        </div>

        <div
          style={{
            background: 'rgba(255, 255, 255, 0.96)',
            padding: '12px 28px',
            borderRadius: 'var(--radius-pill)',
            boxShadow: '0 12px 36px rgba(0,0,0,0.3)',
            textAlign: 'center',
            border: '2px solid var(--border-gold)'
          }}
        >
          <div style={{ fontSize: '1.2rem', fontWeight: 900, color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>
            {gift.name} Sent!
          </div>
          <div style={{ fontSize: '0.86rem', color: 'var(--berry-primary)', fontWeight: 700, marginTop: '2px' }}>
            {senderName} ➔ {recipientName} 💖
          </div>
        </div>
      </div>
    </div>
  );
};
