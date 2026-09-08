import React from 'react';
import { Message } from '../../types';

interface ChatBubbleProps {
  message: Message;
  isMe: boolean;
  avatarUrl?: string;
  senderName?: string;
}

export const ChatBubble: React.FC<ChatBubbleProps> = ({ message, isMe, avatarUrl }) => {
  const msgType = message.type || 'text';

  // 0. PHOTO / IMAGE MESSAGE BUBBLE (Instagram & Snapchat Style)
  if (msgType === 'image' || message.metadata?.imageUrl) {
    const imgUrl = message.metadata?.imageUrl || message.text;
    const caption = message.metadata?.caption || (message.text !== imgUrl && message.text !== 'Shared a photo 📸' ? message.text : null);

    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-end',
          gap: '8px',
          justifyContent: isMe ? 'flex-end' : 'flex-start',
          marginBottom: '16px',
          animation: 'fadeIn 0.25s ease-out forwards'
        }}
      >
        {!isMe && avatarUrl && (
          <img
            src={avatarUrl}
            alt="Avatar"
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              objectFit: 'cover',
              border: '1.5px solid #FFFFFF',
              boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
              flexShrink: 0
            }}
          />
        )}

        <div
          style={{
            maxWidth: '78%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: isMe ? 'flex-end' : 'flex-start',
            gap: '4px'
          }}
        >
          {/* Photo Container */}
          <div
            style={{
              position: 'relative',
              borderRadius: isMe ? '24px 24px 6px 24px' : '24px 24px 24px 6px',
              overflow: 'hidden',
              background: '#FFFFFF',
              boxShadow: isMe ? '0 8px 24px rgba(244, 63, 94, 0.25)' : '0 6px 20px rgba(0,0,0,0.08)',
              border: isMe ? '2px solid rgba(244, 63, 94, 0.2)' : '1px solid var(--border-subtle)',
              maxWidth: '300px'
            }}
          >
            <img
              src={imgUrl}
              alt="Shared photo"
              style={{
                width: '100%',
                maxHeight: '340px',
                objectFit: 'cover',
                display: 'block'
              }}
            />
            {caption && (
              <div
                style={{
                  padding: '10px 14px',
                  background: isMe ? 'linear-gradient(135deg, #FB7185 0%, #F43F5E 100%)' : '#FFFFFF',
                  color: isMe ? '#FFFFFF' : 'var(--text-primary)',
                  fontSize: '0.9rem',
                  fontWeight: 500,
                  fontFamily: 'var(--font-primary)'
                }}
              >
                {caption}
              </div>
            )}
          </div>

          <span
            style={{
              fontSize: '0.72rem',
              color: '#9CA3AF',
              padding: '0 4px',
              fontWeight: 500
            }}
          >
            {message.timestamp}
          </span>
        </div>

        {isMe && avatarUrl && (
          <img
            src={avatarUrl}
            alt="Avatar"
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              objectFit: 'cover',
              border: '1.5px solid #FFFFFF',
              boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
              flexShrink: 0
            }}
          />
        )}
      </div>
    );
  }

  // 1. GIFT WRAPPED MESSAGE BUBBLE
  if (msgType === 'gift') {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-end',
          gap: '8px',
          justifyContent: isMe ? 'flex-end' : 'flex-start',
          marginBottom: '16px',
          animation: 'fadeIn 0.25s ease-out forwards'
        }}
      >
        {!isMe && avatarUrl && (
          <img
            src={avatarUrl}
            alt="Avatar"
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              objectFit: 'cover',
              border: '1.5px solid #FFFFFF',
              boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
              flexShrink: 0
            }}
          />
        )}

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: isMe ? 'flex-end' : 'flex-start',
            gap: '4px'
          }}
        >
          {/* Gift Wrapped Capsule */}
          <div
            style={{
              position: 'relative',
              width: '180px',
              height: '64px',
              borderRadius: '32px',
              background: 'linear-gradient(180deg, #FDC7D2 0%, #FBB3C3 100%)',
              boxShadow: '0 6px 18px rgba(225, 29, 72, 0.18)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
              cursor: 'pointer'
            }}
          >
            {/* Horizontal Red Ribbon */}
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: 0,
                right: 0,
                height: '8px',
                background: '#DC2626',
                transform: 'translateY(-50%)',
                boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
              }}
            />

            {/* Vertical Red Ribbon */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                bottom: 0,
                left: '50%',
                width: '8px',
                background: '#DC2626',
                transform: 'translateX(-50%)',
                boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
              }}
            />

            {/* Central 3D Ribbon Bow */}
            <div
              style={{
                position: 'relative',
                zIndex: 3,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.25))'
              }}
            >
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                {/* Left Bow Loop */}
                <ellipse
                  cx="16"
                  cy="20"
                  rx="10"
                  ry="6"
                  transform="rotate(-25 16 20)"
                  fill="#EF4444"
                  stroke="#B91C1C"
                  strokeWidth="1.5"
                />
                {/* Right Bow Loop */}
                <ellipse
                  cx="32"
                  cy="20"
                  rx="10"
                  ry="6"
                  transform="rotate(25 32 20)"
                  fill="#EF4444"
                  stroke="#B91C1C"
                  strokeWidth="1.5"
                />
                {/* Ribbon Tails */}
                <path
                  d="M20 26 C16 34 12 38 10 42"
                  stroke="#DC2626"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />
                <path
                  d="M28 26 C32 34 36 38 38 42"
                  stroke="#DC2626"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />
                {/* Center Knot */}
                <circle cx="24" cy="24" r="5.5" fill="#B91C1C" stroke="#7F1D1D" strokeWidth="1" />
              </svg>
            </div>
          </div>

          <span
            style={{
              fontSize: '0.72rem',
              color: '#9CA3AF',
              padding: '0 4px',
              fontWeight: 500
            }}
          >
            {message.timestamp}
          </span>
        </div>

        {isMe && avatarUrl && (
          <img
            src={avatarUrl}
            alt="Avatar"
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              objectFit: 'cover',
              border: '1.5px solid #FFFFFF',
              boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
              flexShrink: 0
            }}
          />
        )}
      </div>
    );
  }

  // 2. HEART-CROWNED MESSAGE BUBBLE
  if (msgType === 'heart-crowned') {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-end',
          gap: '8px',
          justifyContent: isMe ? 'flex-end' : 'flex-start',
          marginBottom: '16px',
          animation: 'fadeIn 0.25s ease-out forwards'
        }}
      >
        {!isMe && avatarUrl && (
          <img
            src={avatarUrl}
            alt="Avatar"
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              objectFit: 'cover',
              border: '1.5px solid #FFFFFF',
              boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
              flexShrink: 0
            }}
          />
        )}

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: isMe ? 'flex-end' : 'flex-start',
            gap: '4px'
          }}
        >
          {/* Bubble with Floating Popping Hearts on Top */}
          <div style={{ position: 'relative', paddingTop: '10px' }}>
            {/* Top Crown of Floating Hollow & Solid Red Hearts */}
            <div
              style={{
                position: 'absolute',
                top: '-4px',
                left: '8px',
                right: '8px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                pointerEvents: 'none',
                zIndex: 3
              }}
            >
              {/* Left Hollow Heart */}
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ transform: 'rotate(-12deg)' }}>
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>

              {/* Mid-Left Filled Heart */}
              <svg width="20" height="20" viewBox="0 0 24 24" fill="#EF4444" style={{ transform: 'rotate(8deg) translateY(-2px)' }}>
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>

              {/* Center Filled Heart */}
              <svg width="18" height="18" viewBox="0 0 24 24" fill="#EF4444" style={{ transform: 'rotate(-6deg)' }}>
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>

              {/* Right Hollow Heart */}
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ transform: 'rotate(15deg)' }}>
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            </div>

            {/* Main Coral Pill Capsule */}
            <div
              style={{
                padding: '14px 28px',
                borderRadius: '26px',
                background: 'linear-gradient(135deg, #FB7185 0%, #F43F5E 100%)',
                color: '#FFFFFF',
                fontSize: '0.98rem',
                fontWeight: 700,
                textAlign: 'center',
                boxShadow: '0 8px 22px rgba(244, 63, 94, 0.32)',
                position: 'relative',
                zIndex: 2,
                minWidth: '130px'
              }}
            >
              {message.text}
            </div>

            {/* Side Hearts Popping Out */}
            <div
              style={{
                position: 'absolute',
                top: '60%',
                left: '-8px',
                transform: 'translateY(-50%)',
                zIndex: 4
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="#E11D48">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            </div>
            <div
              style={{
                position: 'absolute',
                bottom: '-2px',
                right: '-6px',
                zIndex: 4
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="#E11D48">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            </div>
          </div>

          <span
            style={{
              fontSize: '0.72rem',
              color: '#9CA3AF',
              padding: '0 4px',
              fontWeight: 500
            }}
          >
            {message.timestamp}
          </span>
        </div>

        {isMe && avatarUrl && (
          <img
            src={avatarUrl}
            alt="Avatar"
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              objectFit: 'cover',
              border: '1.5px solid #FFFFFF',
              boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
              flexShrink: 0
            }}
          />
        )}
      </div>
    );
  }

  // 3. REGULAR OUTGOING BUBBLE (Right / Coral Pink)
  if (isMe) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-end',
          gap: '8px',
          justifyContent: 'flex-end',
          marginBottom: '16px',
          animation: 'fadeIn 0.25s ease-out forwards'
        }}
      >
        <div
          style={{
            maxWidth: '78%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
            gap: '4px'
          }}
        >
          {/* Coral-Pink Rounded Outgoing Bubble */}
          <div
            style={{
              padding: '14px 20px',
              borderRadius: '24px 24px 6px 24px',
              background: 'linear-gradient(135deg, #FB7185 0%, #F43F5E 100%)',
              color: '#FFFFFF',
              fontSize: '0.96rem',
              fontWeight: 600,
              lineHeight: 1.45,
              boxShadow: '0 6px 18px rgba(244, 63, 94, 0.28)',
              whiteSpace: 'pre-line',
              fontFamily: 'var(--font-sans)'
            }}
          >
            {message.text}
          </div>

          <span
            style={{
              fontSize: '0.72rem',
              color: '#9CA3AF',
              padding: '0 4px',
              fontWeight: 500
            }}
          >
            {message.timestamp}
          </span>
        </div>

        {avatarUrl && (
          <img
            src={avatarUrl}
            alt="Avatar"
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              objectFit: 'cover',
              border: '1.5px solid #FFFFFF',
              boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
              flexShrink: 0
            }}
          />
        )}
      </div>
    );
  }

  // 4. REGULAR INCOMING BUBBLE (Left / Clean White)
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-end',
        gap: '8px',
        justifyContent: 'flex-start',
        marginBottom: '16px',
        animation: 'fadeIn 0.25s ease-out forwards'
      }}
    >
      {avatarUrl && (
        <img
          src={avatarUrl}
          alt="Avatar"
          style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            objectFit: 'cover',
            border: '1.5px solid #FFFFFF',
            boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
            flexShrink: 0
          }}
        />
      )}

      <div
        style={{
          maxWidth: '78%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          gap: '4px'
        }}
      >
        {/* White Rounded Incoming Bubble */}
        <div
          style={{
            padding: '14px 20px',
            borderRadius: '24px 24px 24px 6px',
            background: '#FFFFFF',
            color: '#27272A',
            fontSize: '0.96rem',
            fontWeight: 500,
            lineHeight: 1.45,
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.03)',
            whiteSpace: 'pre-line',
            fontFamily: 'var(--font-sans)'
          }}
        >
          {message.text}
        </div>

        <span
          style={{
            fontSize: '0.72rem',
            color: '#9CA3AF',
            padding: '0 4px',
            fontWeight: 500
          }}
        >
          {message.timestamp}
        </span>
      </div>
    </div>
  );
};
