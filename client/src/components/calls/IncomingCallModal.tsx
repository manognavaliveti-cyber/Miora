import React from 'react';
import { useApp } from '../../context/AppContext';
import { Phone, PhoneOff, Video, Sparkles } from 'lucide-react';

export const IncomingCallModal: React.FC = () => {
  const { incomingCall, acceptIncomingCall, rejectIncomingCall } = useApp();

  if (!incomingCall) return null;

  const partner = incomingCall.partner;
  const isVideo = incomingCall.type === 'video';
  const partnerPhoto =
    partner.photos[0] ||
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80';

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 110,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(15, 9, 12, 0.85)',
        backdropFilter: 'blur(20px)',
        padding: '16px',
        animation: 'fadeIn 0.3s ease-out'
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '400px',
          background: 'linear-gradient(180deg, #2A1520 0%, #150A10 100%)',
          borderRadius: '32px',
          border: '1.5px solid var(--border-gold)',
          padding: '36px 24px',
          textAlign: 'center',
          boxShadow: '0 24px 60px rgba(0,0,0,0.8)',
          position: 'relative'
        }}
      >
        {/* Animated Avatar Rings */}
        <div style={{ position: 'relative', width: '120px', height: '120px', margin: '0 auto 20px auto' }}>
          <div
            style={{
              position: 'absolute',
              inset: '-10px',
              borderRadius: '50%',
              border: '2px solid rgba(244, 63, 94, 0.4)',
              animation: 'pulseGlow 2s infinite ease-out'
            }}
          />
          <img
            src={partnerPhoto}
            alt={partner.name}
            style={{
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              objectFit: 'cover',
              border: '3px solid var(--gold-champagne)',
              boxShadow: '0 8px 24px rgba(238, 56, 101, 0.4)'
            }}
          />
        </div>

        <h3
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '1.75rem',
            fontWeight: 800,
            color: '#FFFFFF',
            marginBottom: '4px'
          }}
        >
          {partner.name}
        </h3>
        <p style={{ color: 'var(--rose-soft)', fontSize: '0.9rem', marginBottom: '28px', fontWeight: 600 }}>
          Incoming {isVideo ? 'Video' : 'Audio'} Call...
        </p>

        {/* Action Buttons: Decline / Accept */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '32px' }}>
          <button
            onClick={rejectIncomingCall}
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #EF4444 0%, #B91C1C 100%)',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              cursor: 'pointer',
              boxShadow: '0 8px 20px rgba(239, 68, 68, 0.4)'
            }}
            title="Decline Call"
          >
            <PhoneOff size={26} />
          </button>

          <button
            onClick={acceptIncomingCall}
            style={{
              width: '68px',
              height: '68px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              cursor: 'pointer',
              boxShadow: '0 8px 24px rgba(16, 185, 129, 0.5)',
              animation: 'bounceGentle 1.5s infinite ease-in-out'
            }}
            title="Accept Call"
          >
            {isVideo ? <Video size={28} /> : <Phone size={28} />}
          </button>
        </div>
      </div>
    </div>
  );
};
