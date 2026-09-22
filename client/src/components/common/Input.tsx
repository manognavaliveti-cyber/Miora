import React, { InputHTMLAttributes, ReactNode } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  icon?: ReactNode;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  icon,
  className = '',
  ...props
}) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: '100%' }}>
      {label && (
        <label
          style={{
            fontSize: '0.82rem',
            fontWeight: 600,
            color: 'var(--text-secondary)',
            fontFamily: 'var(--font-primary)',
            letterSpacing: '0.01em'
          }}
        >
          {label}
        </label>
      )}

      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
        {icon && (
          <div
            style={{
              position: 'absolute',
              left: '16px',
              display: 'flex',
              alignItems: 'center',
              color: 'var(--text-muted)',
              pointerEvents: 'none'
            }}
          >
            {icon}
          </div>
        )}

        <input
          style={{
            width: '100%',
            padding: icon ? '13px 16px 13px 44px' : '13px 18px',
            borderRadius: 'var(--radius-md)',
            border: error ? '1.5px solid #EF4444' : '1.5px solid var(--border-subtle)',
            background: 'var(--surface-cream)',
            fontFamily: 'var(--font-primary)',
            fontSize: '0.94rem',
            color: 'var(--text-primary)',
            outline: 'none',
            boxShadow: 'var(--shadow-xs)',
            transition: 'all var(--transition-fast)'
          }}
          onFocus={(e) => {
            e.target.style.borderColor = 'var(--berry-primary)';
            e.target.style.background = '#FFFFFF';
            e.target.style.boxShadow = '0 0 0 3px rgba(136, 19, 55, 0.08)';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = error ? '#EF4444' : 'var(--border-subtle)';
            e.target.style.background = 'var(--surface-cream)';
            e.target.style.boxShadow = 'var(--shadow-xs)';
          }}
          className={className}
          {...props}
        />
      </div>

      {error && (
        <span style={{ fontSize: '0.76rem', color: '#E11D48', fontWeight: 600 }}>
          {error}
        </span>
      )}
      {!error && helperText && (
        <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
          {helperText}
        </span>
      )}
    </div>
  );
};
