import React, { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'glass' | 'gold';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  fullWidth?: boolean;
  loading?: boolean;
  children: ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  loading = false,
  className = '',
  children,
  disabled,
  style,
  ...props
}) => {
  const getStyles = (): React.CSSProperties => {
    const base: React.CSSProperties = {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      fontFamily: 'var(--font-primary)',
      fontWeight: 700,
      cursor: disabled || loading ? 'not-allowed' : 'pointer',
      borderRadius: 'var(--radius-pill)',
      border: 'none',
      outline: 'none',
      transition: 'all var(--transition-fast)',
      userSelect: 'none',
      width: fullWidth ? '100%' : 'auto',
      letterSpacing: '-0.01em',
      opacity: disabled || loading ? 0.6 : 1
    };

    const sizeStyles: Record<string, React.CSSProperties> = {
      sm: { padding: '8px 18px', fontSize: '0.84rem' },
      md: { padding: '12px 24px', fontSize: '0.94rem' },
      lg: { padding: '16px 32px', fontSize: '1.05rem', letterSpacing: '-0.02em' },
      icon: { width: '48px', height: '48px', padding: 0, borderRadius: '50%' }
    };

    const variantStyles: Record<string, React.CSSProperties> = {
      primary: {
        background: 'linear-gradient(135deg, #7D1730 0%, #A91E45 100%)',
        color: '#FFFFFF',
        boxShadow: '0 4px 16px rgba(125, 23, 48, 0.35)',
        border: 'none'
      },
      secondary: {
        background: '#FBEDEF',
        color: '#7D1730',
        border: '1px solid #F4C5CF'
      },
      outline: {
        background: 'transparent',
        color: '#7D1730',
        border: '1.5px solid #7D1730'
      },
      ghost: {
        background: 'transparent',
        color: 'var(--text-secondary)'
      },
      glass: {
        background: 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(12px)',
        color: 'var(--text-primary)',
        boxShadow: 'var(--shadow-sm)',
        border: '1px solid var(--border-subtle)'
      },
      gold: {
        background: 'var(--gold-gradient)',
        color: '#1C1217',
        boxShadow: 'var(--shadow-gold-glow)',
        fontWeight: 800
      }
    };

    return { ...base, ...sizeStyles[size], ...variantStyles[variant] };
  };

  return (
    <button
      style={{ ...getStyles(), ...style }}
      className={`btn-luxury ${className}`}
      onMouseDown={(e) => {
        if (!disabled && !loading) e.currentTarget.style.transform = 'scale(0.97)';
      }}
      onMouseUp={(e) => {
        if (!disabled && !loading) e.currentTarget.style.transform = 'scale(1)';
      }}
      onMouseLeave={(e) => {
        if (!disabled && !loading) e.currentTarget.style.transform = 'scale(1)';
      }}
      onTouchStart={(e) => {
        if (!disabled && !loading) e.currentTarget.style.transform = 'scale(0.97)';
      }}
      onTouchEnd={(e) => {
        if (!disabled && !loading) e.currentTarget.style.transform = 'scale(1)';
      }}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span className="spinner-loader" />
      ) : (
        children
      )}
    </button>
  );
};
