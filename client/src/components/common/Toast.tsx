import React from 'react';
import { useApp } from '../../context/AppContext';
import { Heart } from 'lucide-react';

export const Toast: React.FC = () => {
  const { toastMessage } = useApp();

  if (!toastMessage) return null;

  return (
    <div
      style={{
        position: 'absolute',
        top: '24px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 100,
        background: 'rgba(30, 27, 30, 0.92)',
        backdropFilter: 'blur(12px)',
        color: '#FFFFFF',
        padding: '10px 20px',
        borderRadius: 'var(--radius-pill)',
        fontSize: '0.85rem',
        fontWeight: 600,
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
        animation: 'popIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
        whiteSpace: 'nowrap'
      }}
    >
      <Heart size={16} fill="var(--primary-pink)" color="var(--primary-pink)" />
      <span>{toastMessage}</span>
    </div>
  );
};
