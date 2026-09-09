import React, { useState } from 'react';
import { Message } from '../../types';
import { Play, Pause, Zap, Sparkles, Volume2, Mic } from 'lucide-react';

interface ChatBubbleProps {
  message: Message;
  isMe: boolean;
  avatarUrl?: string;
  senderName?: string;
}

export const ChatBubble: React.FC<ChatBubbleProps> = ({ message, isMe, avatarUrl }) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const msgType = message.type || 'text';
  const isPriority = msgType === 'priority' || message.metadata?.isPriority;

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

  // 3. VOICE MESSAGE BUBBLE (WhatsApp / iMessage Style)
  if (msgType === 'voice' || message.metadata?.audioUrl || message.metadata?.audioDurationSec) {
    const duration = message.metadata?.audioDurationSec || 14;
    const durStr = `0:${String(duration).padStart(2, '0')}`;

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
            maxWidth: '82%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: isMe ? 'flex-end' : 'flex-start',
            gap: '4px'
          }}
        >
          <div
            style={{
              padding: '12px 18px',
              borderRadius: isMe ? '24px 24px 6px 24px' : '24px 24px 24px 6px',
              background: isMe
                ? 'linear-gradient(135deg, #BE123C 0%, #E11D48 50%, #FB7185 100%)'
                : 'linear-gradient(135deg, #FFFFFF 0%, #FFF5F7 100%)',
              color: isMe ? '#FFFFFF' : 'var(--text-primary)',
              boxShadow: isMe ? '0 6px 20px rgba(190, 18, 60, 0.32)' : '0 4px 16px rgba(0,0,0,0.06)',
              border: isMe ? '1.5px solid rgba(255,255,255,0.2)' : '1.5px solid var(--border-subtle)',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              minWidth: '220px'
            }}
          >
            {/* Play / Pause Circular Button */}
            <button
              type="button"
              onClick={() => setIsPlayingAudio(!isPlayingAudio)}
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                background: isMe ? '#FFFFFF' : 'var(--primary-gradient)',
                color: isMe ? 'var(--berry-primary)' : '#FFFFFF',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                flexShrink: 0,
                transition: 'transform 0.15s ease'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.08)')}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            >
              {isPlayingAudio ? <Pause size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" style={{ marginLeft: '2px' }} />}
            </button>

            {/* Sound Wave Bars Simulation */}
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '3px', height: '28px' }}>
              {[40, 75, 55, 90, 30, 85, 60, 100, 45, 70, 95, 35, 65, 80, 50].map((h, i) => (
                <div
                  key={i}
                  style={{
                    flex: 1,
                    height: isPlayingAudio ? `${Math.max(20, (h + (i % 3) * 15) % 100)}%` : `${h}%`,
                    background: isMe ? 'rgba(255, 255, 255, 0.85)' : 'rgba(225, 29, 72, 0.65)',
                    borderRadius: '4px',
                    transition: 'height 0.2s ease'
                  }}
                />
              ))}
            </div>

            {/* Duration Tag */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
              <span style={{ fontSize: '0.78rem', fontWeight: 800, fontFamily: 'monospace' }}>
                {isPlayingAudio ? '▶ 0:08' : durStr}
              </span>
              <span style={{ fontSize: '0.65rem', opacity: 0.8, display: 'flex', alignItems: 'center', gap: '2px' }}>
                <Mic size={10} /> Voice
              </span>
            </div>
          </div>

          <span style={{ fontSize: '0.72rem', color: '#9CA3AF', padding: '0 4px', fontWeight: 500 }}>
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

  // 4. SPECIAL FEATURE / ICEBREAKER CARD BUBBLE
  if (msgType === 'special-feature' || message.metadata?.featureName) {
    const featName = message.metadata?.featureName || 'Romantic Spark';
    const featEmoji = message.metadata?.featureEmoji || '✨';

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
            maxWidth: '85%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: isMe ? 'flex-end' : 'flex-start',
            gap: '4px'
          }}
        >
          <div
            style={{
              padding: '16px 20px',
              borderRadius: '24px',
              background: 'linear-gradient(135deg, #FFF8FA 0%, #FDF2F5 100%)',
              border: '1.5px solid var(--border-gold)',
              boxShadow: '0 8px 24px rgba(212, 175, 55, 0.22)',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span style={{ fontSize: '1.2rem' }}>{featEmoji}</span>
              <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--gold-deep)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                {featName} (Special Chat Feature)
              </span>
            </div>
            <p style={{ fontSize: '0.94rem', fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.45 }}>
              {message.text}
            </p>
          </div>

          <span style={{ fontSize: '0.72rem', color: '#9CA3AF', padding: '0 4px', fontWeight: 500 }}>
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

  // 5. REGULAR OUTGOING BUBBLE (Right / Coral Pink or Gold Priority)
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
          {isPriority && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.72rem', fontWeight: 800, color: 'var(--gold-deep)', background: 'var(--gold-light)', padding: '2px 8px', borderRadius: '12px', border: '1px solid var(--border-gold)' }}>
              <Zap size={11} fill="var(--gold-deep)" />
              <span>Priority Delivery ⚡</span>
            </div>
          )}

          <div
            style={{
              padding: '14px 20px',
              borderRadius: '24px 24px 6px 24px',
              background: isPriority
                ? 'linear-gradient(135deg, #D4AF37 0%, #BE123C 50%, #F43F5E 100%)'
                : 'linear-gradient(135deg, #FB7185 0%, #F43F5E 100%)',
              color: '#FFFFFF',
              fontSize: '0.96rem',
              fontWeight: 600,
              lineHeight: 1.45,
              boxShadow: isPriority ? '0 8px 24px rgba(212, 175, 55, 0.4)' : '0 6px 18px rgba(244, 63, 94, 0.28)',
              border: isPriority ? '1.5px solid #FDF3D6' : 'none',
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

  // 6. REGULAR INCOMING BUBBLE (Left / Clean White)
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
        {isPriority && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.72rem', fontWeight: 800, color: 'var(--gold-deep)', background: 'var(--gold-light)', padding: '2px 8px', borderRadius: '12px', border: '1px solid var(--border-gold)' }}>
            <Zap size={11} fill="var(--gold-deep)" />
            <span>Priority Message ⚡</span>
          </div>
        )}

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
            border: isPriority ? '1.5px solid var(--border-gold)' : '1px solid transparent',
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
