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
  ...props
}) => {
  const getStyles = (): React.CSSProperties => {
    const base: React.CSSProperties = {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      fontFamily: 'var(--font-primary)',
      fontWeight: 600,
      cursor: 'pointer',
      borderRadius: 'var(--radius-pill)',
      border: 'none',
      outline: 'none',
      transition: 'all var(--transition-fast)',
      userSelect: 'none',
      width: fullWidth ? '100%' : 'auto',
      letterSpacing: '-0.01em'
    };

    const sizeStyles: Record<string, React.CSSProperties> = {
      sm: { padding: '8px 18px', fontSize: '0.84rem' },
      md: { padding: '12px 24px', fontSize: '0.94rem' },
      lg: { padding: '16px 32px', fontSize: '1.05rem', letterSpacing: '-0.02em' },
      icon: { width: '48px', height: '48px', padding: 0, borderRadius: '50%' }
    };

    const variantStyles: Record<string, React.CSSProperties> = {
      primary: {
        background: 'var(--primary-gradient)',
        color: '#FFFFFF',
        boxShadow: 'var(--shadow-berry-glow)'
      },
      secondary: {
        background: 'var(--bg-soft-blush)',
        color: 'var(--berry-primary)',
        border: '1px solid var(--border-subtle)'
      },
      outline: {
        background: 'transparent',
        color: 'var(--berry-primary)',
        border: '1.5px solid var(--berry-primary)'
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
      style={getStyles()}
      className={`btn-luxury ${className}`}
      onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.97)')}
      onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
      onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
      onTouchStart={(e) => (e.currentTarget.style.transform = 'scale(0.97)')}
      onTouchEnd={(e) => (e.currentTarget.style.transform = 'scale(1)')}
      {...props}
    >
      {children}
    </button>
  );
};
