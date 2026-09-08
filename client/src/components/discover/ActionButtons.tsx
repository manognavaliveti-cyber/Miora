import React from 'react';
import { X, Heart, Star, RotateCcw } from 'lucide-react';

interface ActionButtonsProps {
  onPass: () => void;
  onLike: () => void;
  onSuperLike: () => void;
  onRewind?: () => void;
  disabled?: boolean;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({
  onPass,
  onLike,
  onSuperLike,
  onRewind,
  disabled = false
}) => {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        boxSizing: 'border-box'
      }}
    >
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 'clamp(12px, 2.5vw, 18px)',
          padding: '8px 20px',
          background: 'rgba(255, 255, 255, 0.92)',
          backdropFilter: 'blur(16px)',
          borderRadius: 'var(--radius-pill)',
          border: '1.5px solid var(--border-gold)',
          boxShadow: '0 10px 30px rgba(76, 5, 25, 0.08)',
          boxSizing: 'border-box'
        }}
      >
      {/* Rewind Button */}
      {onRewind && (
        <button
          onClick={onRewind}
          disabled={disabled}
          aria-label="Rewind"
          style={{
            width: 'clamp(40px, 11vw, 46px)',
            height: 'clamp(40px, 11vw, 46px)',
            borderRadius: '50%',
            background: 'var(--surface-white)',
            border: '1.5px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--gold-antique)',
            boxShadow: 'var(--shadow-sm)',
            cursor: disabled ? 'not-allowed' : 'pointer',
            transition: 'all var(--transition-fast)',
            opacity: disabled ? 0.5 : 1,
            flexShrink: 0
          }}
          onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.92)')}
          onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
        >
          <RotateCcw size={17} />
        </button>
      )}

      {/* Pass (Nope) Button */}
      <button
        onClick={onPass}
        disabled={disabled}
        aria-label="Pass Profile"
        style={{
          width: 'clamp(52px, 14vw, 62px)',
          height: 'clamp(52px, 14vw, 62px)',
          borderRadius: '50%',
          background: 'var(--surface-white)',
          border: '1.5px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#64748B',
          boxShadow: 'var(--shadow-md)',
          cursor: disabled ? 'not-allowed' : 'pointer',
          transition: 'all var(--transition-spring)',
          opacity: disabled ? 0.5 : 1,
          flexShrink: 0
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = '#F43F5E';
          e.currentTarget.style.borderColor = '#FDA4AF';
          e.currentTarget.style.transform = 'scale(1.08)';
          e.currentTarget.style.boxShadow = '0 10px 24px rgba(244, 63, 94, 0.18)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = '#64748B';
          e.currentTarget.style.borderColor = 'var(--border-subtle)';
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.boxShadow = 'var(--shadow-md)';
        }}
        onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.92)')}
        onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1.08)')}
      >
        <X size={24} strokeWidth={2.5} />
      </button>

      {/* Super Like Button */}
      <button
        onClick={onSuperLike}
        disabled={disabled}
        aria-label="Super Like Profile"
        style={{
          width: 'clamp(44px, 12vw, 52px)',
          height: 'clamp(44px, 12vw, 52px)',
          borderRadius: '50%',
          background: 'var(--surface-white)',
          border: '1.5px solid var(--border-gold)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--gold-champagne)',
          boxShadow: 'var(--shadow-gold-glow)',
          cursor: disabled ? 'not-allowed' : 'pointer',
          transition: 'all var(--transition-spring)',
          opacity: disabled ? 0.5 : 1,
          flexShrink: 0
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.12)';
          e.currentTarget.style.background = 'var(--gold-gradient-subtle)';
          e.currentTarget.style.boxShadow = '0 10px 28px rgba(212, 175, 55, 0.4)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.background = 'var(--surface-white)';
          e.currentTarget.style.boxShadow = 'var(--shadow-gold-glow)';
        }}
        onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.92)')}
        onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1.12)')}
      >
        <Star size={20} fill="var(--gold-champagne)" />
      </button>

      {/* Like Button */}
      <button
        onClick={onLike}
        disabled={disabled}
        aria-label="Like Profile"
        style={{
          width: 'clamp(60px, 16vw, 70px)',
          height: 'clamp(60px, 16vw, 70px)',
          borderRadius: '50%',
          background: 'var(--primary-gradient)',
          border: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#FFFFFF',
          boxShadow: 'var(--shadow-berry-glow)',
          cursor: disabled ? 'not-allowed' : 'pointer',
          transition: 'all var(--transition-spring)',
          opacity: disabled ? 0.5 : 1,
          flexShrink: 0
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.1)';
          e.currentTarget.style.boxShadow = '0 14px 38px rgba(136, 19, 55, 0.45)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.boxShadow = 'var(--shadow-berry-glow)';
        }}
        onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.92)')}
        onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1.1)')}
      >
        <Heart size={28} fill="#FFFFFF" />
      </button>
    </div>
  </div>
  );
};
