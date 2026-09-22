import React, { useId } from 'react';

interface MioraLogoProps {
  size?: number;
  showTagline?: boolean;
  showWordmark?: boolean;
  vertical?: boolean;
  colorScheme?: 'dark' | 'light';
  className?: string;
  style?: React.CSSProperties;
}

export const MioraLogo: React.FC<MioraLogoProps> = ({
  size = 72,
  showTagline = true,
  showWordmark = true,
  vertical = true,
  colorScheme = 'dark',
  className = '',
  style
}) => {
  const uniqueId = useId().replace(/:/g, '');
  const leftGradId = `mioraLeft_${uniqueId}`;
  const rightGradId = `mioraRight_${uniqueId}`;
  const foldGradId = `mioraFold_${uniqueId}`;
  const sheenGradId = `mioraSheen_${uniqueId}`;

  const textColor = colorScheme === 'light' ? '#FFFFFF' : '#181926';
  const taglineColor = colorScheme === 'light' ? 'rgba(255, 255, 255, 0.85)' : '#7E6E77';

  // Proportional sizing for emblem and text
  const emblemWidth = size;
  const emblemHeight = (size * 115) / 140;
  const wordmarkFontSize = vertical
    ? `${Math.max(size * 0.38, 22)}px`
    : `${Math.max(size * 0.44, 20)}px`;
  const taglineFontSize = vertical
    ? `${Math.max(size * 0.14, 9.5)}px`
    : `${Math.max(size * 0.15, 9)}px`;

  return (
    <div
      className={className}
      style={{
        display: 'inline-flex',
        flexDirection: vertical ? 'column' : 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: vertical ? '12px' : '14px',
        textAlign: 'center',
        userSelect: 'none',
        ...style
      }}
    >
      {/* ====================================================
          CLEAN, MINIMAL, CUTE M-HEART EMBLEM (EXACT REFERENCE)
          ==================================================== */}
      <svg
        viewBox="0 0 120 110"
        width={emblemWidth}
        height={emblemHeight}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          flexShrink: 0,
          transition: 'transform var(--transition-fast)'
        }}
      >
        <defs>
          {/* Left Wing Subtle Blush Pink Gradient */}
          <linearGradient id={leftGradId} x1="20%" y1="10%" x2="80%" y2="90%">
            <stop offset="0%" stopColor="#FBB6C6" />
            <stop offset="50%" stopColor="#F293A9" />
            <stop offset="100%" stopColor="#E36F8B" />
          </linearGradient>

          {/* Right Wing Dusty Rose Gradient */}
          <linearGradient id={rightGradId} x1="30%" y1="0%" x2="70%" y2="100%">
            <stop offset="0%" stopColor="#F293A9" />
            <stop offset="50%" stopColor="#E36F8B" />
            <stop offset="100%" stopColor="#C94A6B" />
          </linearGradient>

          {/* Center Ribbon Crossing Subtle Depth */}
          <linearGradient id={foldGradId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#E06280" />
            <stop offset="100%" stopColor="#B8395A" />
          </linearGradient>
        </defs>

        {/* Left M-Stroke & Heart Lobe (Curves from bottom inward point up over left crest down to center) */}
        <path
          d="M 57 96 C 47 84 22 58 22 36 C 22 18 38 12 50 20 C 58 26 60 38 60 48 C 58 36 52 24 44 20 C 34 16 28 24 28 36 C 28 54 48 78 57 96 Z"
          fill={`url(#${leftGradId})`}
        />

        {/* Right M-Stroke & Heart Lobe (Curves from bottom inward point up over right crest down to center) */}
        <path
          d="M 63 96 C 73 84 98 58 98 36 C 98 18 82 12 70 20 C 62 26 60 38 60 48 C 62 36 68 24 76 20 C 86 16 92 24 92 36 C 92 54 72 78 63 96 Z"
          fill={`url(#${rightGradId})`}
        />

        {/* Center Organic Ribbon Overlap (Left side swooping softly through center dip) */}
        <path
          d="M 50 20 C 58 26 60 38 60 48 C 59 56 55 64 52 70 C 54 62 57 52 56 42 C 54 32 48 24 44 20 Z"
          fill={`url(#${foldGradId})`}
          opacity="0.85"
        />

        {/* Right side swooping softly through center dip */}
        <path
          d="M 70 20 C 62 26 60 38 60 48 C 61 56 65 64 68 70 C 66 62 63 52 64 42 C 66 32 72 24 76 20 Z"
          fill={`url(#${rightGradId})`}
        />
      </svg>

      {/* Wordmark & Tagline */}
      {(showWordmark || showTagline) && (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: vertical ? 'center' : 'flex-start',
            justifyContent: 'center',
            minWidth: 'max-content',
            whiteSpace: 'nowrap'
          }}
        >
          {showWordmark && (
            <span
              style={{
                fontFamily: 'var(--font-primary)',
                fontSize: wordmarkFontSize,
                fontWeight: 800,
                letterSpacing: '0.28em',
                color: textColor,
                textTransform: 'uppercase',
                lineHeight: 1.1,
                marginLeft: '0.28em', // offsets letter-spacing to center visually
                whiteSpace: 'nowrap',
                display: 'block'
              }}
            >
              MIORA
            </span>
          )}

          {showTagline && (
            <span
              style={{
                fontFamily: 'var(--font-primary)',
                fontSize: taglineFontSize,
                fontWeight: 600,
                letterSpacing: '0.22em',
                color: taglineColor,
                textTransform: 'uppercase',
                marginTop: '4px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                marginLeft: '0.22em',
                whiteSpace: 'nowrap',
                wordBreak: 'keep-all',
                flexShrink: 0
              }}
            >
              MEET.&nbsp;MATCH.&nbsp;BELONG.&nbsp;<span style={{ fontSize: '1.2em', color: '#E11D48', marginLeft: '1px' }}>♡</span>
            </span>
          )}
        </div>
      )}
    </div>
  );
};
