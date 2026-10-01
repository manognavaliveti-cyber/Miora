import React from 'react';
import { X, Heart, Info } from 'lucide-react';

interface ActionButtonsProps {
  onPass: () => void;
  onLike: () => void;
  onInfo: () => void;
  disabled?: boolean;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({
  onPass,
  onLike,
  onInfo,
  disabled = false
}) => {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '24px',
        marginTop: '18px',
        width: '100%',
        maxWidth: '360px',
        boxSizing: 'border-box'
      }}
      role="group"
      aria-label="Profile actions"
    >
      {/* PASS BUTTON */}
      <button
        type="button"
        onClick={onPass}
        disabled={disabled}
        style={{
          width: '58px',
          height: '58px',
          borderRadius: '50%',
          background: '#FFFFFF',
          border: '2px solid #FCE7F3',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#E11D48',
          cursor: disabled ? 'not-allowed' : 'pointer',
          boxShadow: '0 6px 18px rgba(225, 29, 72, 0.1)',
          transition: 'all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
          outline: 'none',
          opacity: disabled ? 0.6 : 1
        }}
        onMouseEnter={(e) => {
          if (!disabled) {
            e.currentTarget.style.transform = 'scale(1.12) rotate(-8deg)';
            e.currentTarget.style.background = '#FFF0F3';
            e.currentTarget.style.boxShadow = '0 8px 24px rgba(225, 29, 72, 0.2)';
          }
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1) rotate(0deg)';
          e.currentTarget.style.background = '#FFFFFF';
          e.currentTarget.style.boxShadow = '0 6px 18px rgba(225, 29, 72, 0.1)';
        }}
        aria-label="Pass profile"
        title="Pass (swipe left)"
      >
        <X size={26} strokeWidth={2.5} />
      </button>

      {/* LIKE BUTTON (CENTER / PRIMARY) */}
      <button
        type="button"
        onClick={onLike}
        disabled={disabled}
        style={{
          width: '70px',
          height: '70px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #881337 0%, #BE123C 100%)',
          border: '3px solid #FBCFE8',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#FFFFFF',
          cursor: disabled ? 'not-allowed' : 'pointer',
          boxShadow: '0 10px 28px rgba(190, 18, 60, 0.35)',
          transition: 'all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
          outline: 'none',
          opacity: disabled ? 0.6 : 1
        }}
        onMouseEnter={(e) => {
          if (!disabled) {
            e.currentTarget.style.transform = 'scale(1.14) rotate(8deg)';
            e.currentTarget.style.boxShadow = '0 14px 36px rgba(190, 18, 60, 0.45)';
          }
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1) rotate(0deg)';
          e.currentTarget.style.boxShadow = '0 10px 28px rgba(190, 18, 60, 0.35)';
        }}
        aria-label="Like profile"
        title="Like (swipe right)"
      >
        <Heart size={32} fill="#FFFFFF" color="#FFFFFF" />
      </button>

      {/* DETAILS / INFO BUTTON */}
      <button
        type="button"
        onClick={onInfo}
        disabled={disabled}
        style={{
          width: '58px',
          height: '58px',
          borderRadius: '50%',
          background: '#FFFFFF',
          border: '2px solid #E5E7EB',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#4B5563',
          cursor: disabled ? 'not-allowed' : 'pointer',
          boxShadow: '0 6px 18px rgba(0, 0, 0, 0.06)',
          transition: 'all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
          outline: 'none',
          opacity: disabled ? 0.6 : 1
        }}
        onMouseEnter={(e) => {
          if (!disabled) {
            e.currentTarget.style.transform = 'scale(1.12)';
            e.currentTarget.style.background = '#F9FAFB';
            e.currentTarget.style.borderColor = '#9CA3AF';
          }
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.background = '#FFFFFF';
          e.currentTarget.style.borderColor = '#E5E7EB';
        }}
        aria-label="View profile details"
        title="View profile details"
      >
        <Info size={24} strokeWidth={2.2} />
      </button>
    </div>
  );
};

