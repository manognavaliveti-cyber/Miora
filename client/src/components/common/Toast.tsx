import React from 'react';
import { useApp } from '../../context/AppContext';
import { Sparkles, X } from 'lucide-react';

export const Toast: React.FC = () => {
  const { toastMessage, showToast } = useApp();

  if (!toastMessage) return null;

  return (
    <>
      <style>{`
        @keyframes toastSlideDownFade {
          0% {
            opacity: 0;
            transform: translate(-50%, -24px) scale(0.92);
          }
          100% {
            opacity: 1;
            transform: translate(-50%, 0) scale(1);
          }
        }
      `}</style>
      <div
        style={{
          position: 'fixed',
          top: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 999999,
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '12px 24px',
          borderRadius: '9999px',
          background: 'rgba(255, 255, 255, 0.92)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1.5px solid rgba(244, 63, 94, 0.25)',
          boxShadow: '0 16px 40px rgba(0, 0, 0, 0.12), 0 4px 16px rgba(244, 63, 94, 0.16)',
          color: '#1F161A',
          fontSize: '0.88rem',
          fontWeight: 700,
          animation: 'toastSlideDownFade 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards',
          maxWidth: 'min(90vw, 460px)',
          width: 'max-content',
          boxSizing: 'border-box',
          pointerEvents: 'auto',
          lineHeight: 1.35
        }}
      >
        <div
          style={{
            width: '28px',
            height: '28px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #F43F5E 0%, #BE123C 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            boxShadow: '0 4px 12px rgba(244, 63, 94, 0.3)'
          }}
        >
          <Sparkles size={15} color="#FFFFFF" fill="#FFFFFF" />
        </div>
        <span style={{ flex: 1, letterSpacing: '0.01em', color: '#1F161A' }}>{toastMessage}</span>
      </div>
    </>
  );
};
