import React from 'react';
import { X, Heart, Star, RotateCcw, Zap } from 'lucide-react';

interface ActionButtonsProps {
  onPass: () => void;
  onLike: () => void;
  onSuperLike: () => void;
  onRewind?: () => void;
  onBoost?: () => void;
  isBoostActive?: boolean;
  superLikesCount?: number;
  disabled?: boolean;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({
  onPass,
  onLike,
  onSuperLike,
  onRewind,
  onBoost,
  isBoostActive = false,
  disabled = false
}) => {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        boxSizing: 'border-box',
        marginTop: '16px'
      }}
    >
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '14px',
          padding: '12px 22px',
          background: 'rgba(253, 232, 236, 0.95)',
          backdropFilter: 'blur(16px)',
          borderRadius: '999px',
          border: '1.5px solid rgba(255, 255, 255, 0.8)',
          boxShadow: '0 12px 30px rgba(186, 73, 98, 0.12), inset 0 1px 2px rgba(255, 255, 255, 0.9)',
          boxSizing: 'border-box'
        }}
      >
        {/* 1. Rewind Button (Soft Blush Circle) */}
        <button
          onClick={onRewind}
          disabled={disabled}
          aria-label="Rewind"
          style={{
            width: '46px',
            height: '46px',
            borderRadius: '50%',
            background: '#FADAE0',
            border: '1.5px solid rgba(255, 255, 255, 0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#8B1E3F',
            boxShadow: '0 4px 10px rgba(186, 73, 98, 0.08)',
            cursor: disabled ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
            opacity: disabled ? 0.5 : 1,
            flexShrink: 0
          }}
          onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.92)')}
          onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.08)')}
          onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
        >
          <RotateCcw size={18} strokeWidth={2.5} />
        </button>

        {/* 2. Pass Button (Slate Dark Gray Circle) */}
        <button
          onClick={onPass}
          disabled={disabled}
          aria-label="Pass Profile"
          style={{
            width: '52px',
            height: '52px',
            borderRadius: '50%',
            background: '#475569',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFFFFF',
            boxShadow: '0 6px 16px rgba(71, 85, 105, 0.3)',
            cursor: disabled ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
            opacity: disabled ? 0.5 : 1,
            flexShrink: 0
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.08)')}
          onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.92)')}
          onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1.08)')}
        >
          <X size={24} strokeWidth={2.8} />
        </button>

        {/* 3. Super Like Button (Soft Gold / Cream Circle) */}
        <button
          onClick={onSuperLike}
          disabled={disabled}
          aria-label="Super Like Profile"
          style={{
            width: '46px',
            height: '46px',
            borderRadius: '50%',
            background: '#FFF3D6',
            border: '1.5px solid rgba(255, 255, 255, 0.9)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#F59E0B',
            boxShadow: '0 4px 12px rgba(245, 158, 11, 0.2)',
            cursor: disabled ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
            opacity: disabled ? 0.5 : 1,
            flexShrink: 0
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.08)')}
          onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.92)')}
          onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1.08)')}
        >
          <Star size={20} fill="#F59E0B" />
        </button>

        {/* 4. Like Button (Large Prominent Burgundy Red Circle) */}
        <button
          onClick={onLike}
          disabled={disabled}
          aria-label="Like Profile"
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #8B1E3F 0%, #681028 100%)',
            border: '2px solid rgba(255, 255, 255, 0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFFFFF',
            boxShadow: '0 10px 24px rgba(139, 30, 63, 0.42)',
            cursor: disabled ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
            opacity: disabled ? 0.5 : 1,
            flexShrink: 0
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.1)';
            e.currentTarget.style.boxShadow = '0 14px 32px rgba(139, 30, 63, 0.55)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = '0 10px 24px rgba(139, 30, 63, 0.42)';
          }}
          onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.92)')}
          onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1.1)')}
        >
          <Heart size={30} fill="#FFFFFF" color="#FFFFFF" />
        </button>

        {/* 5. Boost Button (Salmon Pink / Soft Red Circle) */}
        <button
          onClick={onBoost}
          disabled={disabled}
          aria-label="Boost Profile"
          style={{
            width: '46px',
            height: '46px',
            borderRadius: '50%',
            background: isBoostActive
              ? 'linear-gradient(135deg, #EA580C, #F97316)'
              : 'linear-gradient(135deg, #FF756B, #EF4444)',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFFFFF',
            boxShadow: '0 4px 14px rgba(239, 68, 68, 0.35)',
            cursor: disabled ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
            opacity: disabled ? 0.5 : 1,
            flexShrink: 0
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.08)')}
          onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.92)')}
          onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1.08)')}
        >
          <Zap size={20} fill="#FFFFFF" color="#FFFFFF" />
        </button>
      </div>
    </div>
  );
};

