import React from 'react';

interface VerifiedBadgeProps {
  size?: number;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Clean, modern blue verification checkmark badge for verified profiles.
 */
export const VerifiedBadge: React.FC<VerifiedBadgeProps> = ({ size = 18, style, className }) => {
  return (
    <span
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        verticalAlign: 'middle',
        lineHeight: 1,
        marginLeft: '4px',
        flexShrink: 0,
        ...style
      }}
      title="Verified Profile"
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ display: 'block' }}
      >
        <path
          d="M22.5 12.5C22.5 13.9 21.6 15.1 20.4 15.6C20.8 17 20.3 18.5 19.3 19.3C18.5 20.3 17 20.8 15.6 20.4C15.1 21.6 13.9 22.5 12.5 22.5C11.1 22.5 9.9 21.6 9.4 20.4C8 20.8 6.5 20.3 5.7 19.3C4.7 18.5 4.2 17 4.6 15.6C3.4 15.1 2.5 13.9 2.5 12.5C2.5 11.1 3.4 9.9 4.6 9.4C4.2 8 4.7 6.5 5.7 5.7C6.5 4.7 8 4.2 9.4 4.6C9.9 3.4 11.1 2.5 12.5 2.5C13.9 2.5 15.1 3.4 15.6 4.6C17 4.2 18.5 4.7 19.3 5.7C20.3 6.5 20.8 8 20.4 9.4C21.6 9.9 22.5 11.1 22.5 12.5Z"
          fill="#0095F6"
        />
        <path
          d="M10.2 16.2L6.8 12.8L8.2 11.4L10.2 13.4L15.8 7.8L17.2 9.2L10.2 16.2Z"
          fill="#FFFFFF"
        />
      </svg>
    </span>
  );
};
