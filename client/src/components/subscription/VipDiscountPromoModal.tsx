import React from 'react';
import { useApp } from '../../context/AppContext';
import { X, Heart, Crown } from 'lucide-react';

interface VipDiscountPromoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VipDiscountPromoModal: React.FC<VipDiscountPromoModalProps> = ({ isOpen, onClose }) => {
  const { subscribeToPlan } = useApp();

  if (!isOpen) return null;

  const handleGetVip = async () => {
    onClose();
    await subscribeToPlan('vip', 'inr');
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(15, 23, 42, 0.7)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        zIndex: 99999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        boxSizing: 'border-box',
        animation: 'fadeIn 0.2s ease-out forwards'
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '360px',
          background: 'linear-gradient(180deg, #FFFBF0 0%, #FFFFFF 35%, #FFF8E8 100%)',
          borderRadius: '32px',
          boxShadow: '0 25px 60px rgba(60, 40, 8, 0.4), 0 0 1px rgba(0,0,0,0.1)',
          overflow: 'hidden',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '24px 20px 22px 20px',
          boxSizing: 'border-box',
          fontFamily: "'Manrope', -apple-system, BlinkMacSystemFont, sans-serif"
        }}
      >
        {/* Top-Right Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            background: 'rgba(235, 220, 180, 0.5)',
            border: 'none',
            color: '#6B4D0D',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            zIndex: 10,
            transition: 'all 0.2s ease',
            outline: 'none'
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(235, 220, 180, 0.8)')}
          onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(235, 220, 180, 0.5)')}
          aria-label="Close"
        >
          <X size={17} strokeWidth={2.5} />
        </button>

        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginTop: '2px', marginBottom: '6px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              fontSize: '1.45rem',
              fontWeight: 800,
              color: '#3B2A07'
            }}
          >
            <span style={{ fontFamily: 'var(--font-serif)', letterSpacing: '0.25em', color: '#4A3609' }}>M I</span>
            <Heart size={14} fill="#B8860B" color="#B8860B" style={{ marginTop: '2px' }} />
            <span style={{ fontFamily: 'var(--font-serif)', letterSpacing: '0.25em', color: '#4A3609' }}>R A</span>
          </div>
          <p
            style={{
              fontSize: '0.62rem',
              fontWeight: 800,
              color: '#9E7A1B',
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              margin: '2px 0 0 0'
            }}
          >
            THE ROYAL EXPERIENCE
          </p>
        </div>

        {/* Artwork */}
        <div
          style={{
            width: '100%',
            maxWidth: '260px',
            height: '190px',
            borderRadius: '20px',
            overflow: 'hidden',
            margin: '4px 0 10px 0',
            position: 'relative',
            background: 'linear-gradient(135deg, #FDE9B8 0%, #F5C563 50%, #D89B2A 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Crown size={72} color="#7A4E00" strokeWidth={1.4} fill="rgba(255,255,255,0.25)" />
        </div>

        {/* Headline & Price Section */}
        <div style={{ textAlign: 'center', width: '100%' }}>
          <h2
            style={{
              fontSize: '2.5rem',
              fontWeight: 900,
              color: '#7A5200',
              margin: 0,
              lineHeight: 1.0,
              letterSpacing: '-0.03em'
            }}
          >
            VIP
          </h2>
          <h3
            style={{
              fontSize: '1.4rem',
              fontWeight: 800,
              color: '#6B4700',
              margin: '3px 0 8px 0',
              letterSpacing: '-0.02em'
            }}
          >
            MIORA VIP Royalty
          </h3>

          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: '10px', margin: '4px 0 2px 0' }}>
            <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#8C7A58', textDecoration: 'line-through' }}>₹999</span>
            <span style={{ fontSize: '2.6rem', fontWeight: 900, color: '#7A5200', letterSpacing: '-0.03em', lineHeight: 1 }}>₹789</span>
            <span style={{ fontSize: '0.95rem', fontWeight: 700, color: '#9E8555' }}>/month</span>
          </div>
          <div style={{ fontSize: '0.74rem', fontWeight: 900, color: '#A16207', marginTop: '2px' }}>SAVE ₹210</div>

          <p
            style={{
              fontSize: '0.78rem',
              fontWeight: 600,
              color: '#8C7233',
              margin: '2px 0 16px 0'
            }}
          >
            Priority matching, free boosts &amp; a golden crown frame 👑
          </p>
        </div>

        {/* Action Buttons */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            width: '100%'
          }}
        >
          <button
            onClick={onClose}
            style={{
              flex: 1,
              padding: '12px',
              borderRadius: '9999px',
              background: '#FFFFFF',
              border: '1.5px solid #EAD8AF',
              color: '#4A3609',
              fontSize: '0.92rem',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.15s ease',
              outline: 'none',
              textAlign: 'center',
              boxShadow: '0 2px 6px rgba(0,0,0,0.02)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#FFF9EC';
              e.currentTarget.style.borderColor = '#B8860B';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#FFFFFF';
              e.currentTarget.style.borderColor = '#EAD8AF';
            }}
          >
            Not Now
          </button>

          <button
            onClick={handleGetVip}
            style={{
              flex: 1.15,
              padding: '12px',
              borderRadius: '9999px',
              background: 'linear-gradient(135deg, #D89B2A 0%, #9C6E00 100%)',
              color: '#FFFFFF',
              border: 'none',
              fontSize: '0.92rem',
              fontWeight: 800,
              cursor: 'pointer',
              boxShadow: '0 6px 18px rgba(184, 134, 11, 0.4)',
              transition: 'all 0.15s ease',
              outline: 'none',
              textAlign: 'center'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-1px)';
              e.currentTarget.style.boxShadow = '0 8px 22px rgba(184, 134, 11, 0.5)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 6px 18px rgba(184, 134, 11, 0.4)';
            }}
          >
            Get VIP
          </button>
        </div>
      </div>
    </div>
  );
};
