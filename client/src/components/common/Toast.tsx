import React from 'react';
import { useApp } from '../../context/AppContext';
import { Sparkles } from 'lucide-react';

export const Toast: React.FC = () => {
  const { toastMessage } = useApp();

  if (!toastMessage) return null;

  return (
    <>
      <style>{`
        @keyframes toastSlideDownFade {
          0% {
            opacity: 0;
            transform: translate(-50%, -20px) scale(0.94);
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
          display: 'inline-flex',
          alignItems: 'center',
          gap: '10px',
          padding: '10px 20px',
          borderRadius: '9999px',
          background: 'rgba(255, 255, 255, 0.96)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1.5px solid rgba(244, 63, 94, 0.25)',
          boxShadow: '0 12px 36px rgba(0, 0, 0, 0.12), 0 4px 14px rgba(244, 63, 94, 0.15)',
          color: '#1F161A',
          fontSize: '0.86rem',
          fontWeight: 700,
          animation: 'toastSlideDownFade 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards',
          maxWidth: 'min(90vw, 440px)',
          width: 'max-content',
          boxSizing: 'border-box',
          pointerEvents: 'auto',
          whiteSpace: 'nowrap',
          overflow: 'hidden'
        }}
      >
        <div
          style={{
            width: '26px',
            height: '26px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #F43F5E 0%, #BE123C 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            boxShadow: '0 3px 10px rgba(244, 63, 94, 0.3)'
          }}
        >
          <Sparkles size={14} color="#FFFFFF" fill="#FFFFFF" />
        </div>
        <span
          style={{
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            color: '#1F161A',
            letterSpacing: '0.01em',
            display: 'inline-block'
          }}
        >
          {toastMessage}
        </span>
      </div>
    </>
  );
};
