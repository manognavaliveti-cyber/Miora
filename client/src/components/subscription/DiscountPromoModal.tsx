import React from 'react';
import { useApp } from '../../context/AppContext';
import { X, Heart } from 'lucide-react';

interface DiscountPromoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DiscountPromoModal: React.FC<DiscountPromoModalProps> = ({ isOpen, onClose }) => {
  const { subscribeToPlan } = useApp();

  if (!isOpen) return null;

  const handleGetPremium = async () => {
    onClose();
    await subscribeToPlan('premium_379', 'inr');
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
          background: 'linear-gradient(180deg, #FFF6F8 0%, #FFFFFF 35%, #FFF2F5 100%)',
          borderRadius: '32px',
          boxShadow: '0 25px 60px rgba(60, 8, 22, 0.4), 0 0 1px rgba(0,0,0,0.1)',
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
            background: 'rgba(235, 220, 225, 0.5)',
            border: 'none',
            color: '#6B0D28',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            zIndex: 10,
            transition: 'all 0.2s ease',
            outline: 'none'
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(235, 220, 225, 0.8)')}
          onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(235, 220, 225, 0.5)')}
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
              color: '#3B0716'
            }}
          >
            <span style={{ fontFamily: 'var(--font-serif)', letterSpacing: '0.25em', color: '#4A0C1B' }}>M I</span>
            <Heart size={14} fill="#8B1E3F" color="#8B1E3F" style={{ marginTop: '2px' }} />
            <span style={{ fontFamily: 'var(--font-serif)', letterSpacing: '0.25em', color: '#4A0C1B' }}>R A</span>
          </div>
          <p
            style={{
              fontSize: '0.62rem',
              fontWeight: 800,
              color: '#9E1B42',
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              margin: '2px 0 0 0'
            }}
          >
            MORE LOVE. REAL CONNECTIONS.
          </p>
        </div>

        {/* High-Resolution 3D Artwork */}
        <div
          style={{
            width: '100%',
            maxWidth: '260px',
            height: '190px',
            borderRadius: '20px',
            overflow: 'hidden',
            margin: '4px 0 10px 0',
            position: 'relative'
          }}
        >
          <img
            src="/miora_premium_popup_artwork.jpg"
            alt="MIORA Premium Offer Graphic"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
          />
        </div>

        {/* Headline & Price Section */}
        <div style={{ textAlign: 'center', width: '100%' }}>
          <h2
            style={{
              fontSize: '2.5rem',
              fontWeight: 900,
              color: '#6B0D28',
              margin: 0,
              lineHeight: 1.0,
              letterSpacing: '-0.03em'
            }}
          >
            24% OFF
          </h2>
          <h3
            style={{
              fontSize: '1.4rem',
              fontWeight: 800,
              color: '#5C0D24',
              margin: '3px 0 8px 0',
              letterSpacing: '-0.02em'
            }}
          >
            MIORA Premium
          </h3>

          {/* Price Strike-Through & Discounted Price */}
          <div
            style={{
              display: 'flex',
              alignItems: 'baseline',
              justifyContent: 'center',
              gap: '10px',
              margin: '4px 0 2px 0'
            }}
          >
            <span
              style={{
                fontSize: '1.35rem',
                fontWeight: 700,
                color: '#71717A',
                textDecoration: 'line-through'
              }}
            >
              ₹499
            </span>
            <span
              style={{
                fontSize: '2.6rem',
                fontWeight: 900,
                color: '#6B0D28',
                letterSpacing: '-0.03em',
                lineHeight: 1
              }}
            >
              ₹379
            </span>
          </div>

          <p
            style={{
              fontSize: '0.78rem',
              fontWeight: 600,
              color: '#8C5261',
              margin: '2px 0 16px 0'
            }}
          >
            Limited-time offer
          </p>
        </div>

        {/* Crisp High-Definition Action Buttons */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            width: '100%'
          }}
        >
          {/* Not Now Button */}
          <button
            onClick={onClose}
            style={{
              flex: 1,
              padding: '12px',
              borderRadius: '9999px',
              background: '#FFFFFF',
              border: '1.5px solid #E8C8D0',
              color: '#4A1521',
              fontSize: '0.92rem',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.15s ease',
              outline: 'none',
              textAlign: 'center',
              boxShadow: '0 2px 6px rgba(0,0,0,0.02)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#FFF5F7';
              e.currentTarget.style.borderColor = '#8B1E3F';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#FFFFFF';
              e.currentTarget.style.borderColor = '#E8C8D0';
            }}
          >
            Not Now
          </button>

          {/* Get Premium Button */}
          <button
            onClick={handleGetPremium}
            style={{
              flex: 1.15,
              padding: '12px',
              borderRadius: '9999px',
              background: 'linear-gradient(135deg, #8B1E3F 0%, #681028 100%)',
              color: '#FFFFFF',
              border: 'none',
              fontSize: '0.92rem',
              fontWeight: 800,
              cursor: 'pointer',
              boxShadow: '0 6px 18px rgba(139, 30, 63, 0.35)',
              transition: 'all 0.15s ease',
              outline: 'none',
              textAlign: 'center'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-1px)';
              e.currentTarget.style.boxShadow = '0 8px 22px rgba(139, 30, 63, 0.45)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 6px 18px rgba(139, 30, 63, 0.35)';
            }}
          >
            Get Premium
          </button>
        </div>
      </div>
    </div>
  );
};
