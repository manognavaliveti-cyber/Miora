import React, { useEffect } from 'react';
import { Heart, MessageCircle, X } from 'lucide-react';
import { Profile } from '../../types';

interface VibeMatchModalProps {
  isOpen: boolean;
  currentUserPhoto: string;
  currentUserName: string;
  matchedProfile: Profile;
  vibeScore: number;
  onStartChat: () => void;
  onDismiss: () => void;
}

export const VibeMatchModal: React.FC<VibeMatchModalProps> = ({
  isOpen,
  currentUserPhoto,
  currentUserName,
  matchedProfile,
  vibeScore,
  onStartChat,
  onDismiss
}) => {
  useEffect(() => {
    if (isOpen) {
      // Try to fire confetti
      try {
        import('canvas-confetti').then((mod) => {
          const confetti = mod.default;
          confetti({
            particleCount: 100,
            spread: 90,
            origin: { y: 0.5 },
            colors: ['#EE3865', '#F472B6', '#FB7185', '#FCE7EC', '#FFFFFF', '#FF6B9D']
          });
        });
      } catch (e) {
        // silently ignore
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const matchPhoto =
    matchedProfile.photos?.[0] ||
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80';

  return (
    <>
      <style>{`
        @keyframes vibeMatchFadeIn {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
        @keyframes vibeMatchScaleIn {
          0% { opacity: 0; transform: scale(0.85) translateY(30px); }
          60% { opacity: 1; transform: scale(1.02) translateY(-4px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes vibePhotoLeft {
          0% { opacity: 0; transform: translateX(-40px) scale(0.7) rotate(-10deg); }
          60% { opacity: 1; transform: translateX(4px) scale(1.02) rotate(1deg); }
          100% { opacity: 1; transform: translateX(0) scale(1) rotate(0deg); }
        }
        @keyframes vibePhotoRight {
          0% { opacity: 0; transform: translateX(40px) scale(0.7) rotate(10deg); }
          60% { opacity: 1; transform: translateX(-4px) scale(1.02) rotate(-1deg); }
          100% { opacity: 1; transform: translateX(0) scale(1) rotate(0deg); }
        }
        @keyframes vibeHeartPulse {
          0% { transform: translate(-50%, -50%) scale(0); opacity: 0; }
          40% { transform: translate(-50%, -50%) scale(1.2); opacity: 1; }
          60% { transform: translate(-50%, -50%) scale(0.9); }
          80% { transform: translate(-50%, -50%) scale(1.05); }
          100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
        }
        @keyframes vibeTextSlideUp {
          0% { opacity: 0; transform: translateY(24px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes vibeButtonsSlide {
          0% { opacity: 0; transform: translateY(32px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes floatingHeart {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-6px) scale(1.08); }
        }

        .vibe-match-overlay {
          position: fixed;
          inset: 0;
          z-index: 10001;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 16px;
          animation: vibeMatchFadeIn 0.25s ease-out forwards;
        }

        .vibe-match-card {
          width: 100%;
          max-width: 400px;
          min-height: 520px;
          max-height: 94vh;
          border-radius: 36px;
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 40px 28px 32px;
          box-sizing: border-box;
          overflow: hidden;
          animation: vibeMatchScaleIn 0.45s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        @media (max-width: 480px) {
          .vibe-match-card {
            border-radius: 0;
            max-width: 100%;
            min-height: 100dvh;
            max-height: 100dvh;
            padding: 48px 24px 36px;
          }
        }
      `}</style>

      <div className="vibe-match-overlay" style={{ background: 'rgba(255, 220, 230, 0.97)', backdropFilter: 'blur(20px)' }}>
        <div
          className="vibe-match-card"
          style={{
            background: 'linear-gradient(175deg, #FDE8EE 0%, #FBD0DA 35%, #F9BCC9 70%, #F7B0C0 100%)'
          }}
        >
          {/* Floating background hearts */}
          {['20%', '75%', '15%', '82%', '50%'].map((left, i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                top: `${12 + i * 17}%`,
                left,
                fontSize: `${14 + (i % 3) * 6}px`,
                opacity: 0.12 + (i % 3) * 0.05,
                animation: `floatingHeart ${3 + i * 0.8}s ease-in-out infinite`,
                animationDelay: `${i * 0.4}s`,
                pointerEvents: 'none',
                color: '#E11D48'
              }}
            >
              ♥
            </div>
          ))}

          {/* Close / back button */}
          <button
            onClick={onDismiss}
            style={{
              position: 'absolute',
              top: 18,
              left: 18,
              width: 36,
              height: 36,
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.7)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(225,29,72,0.12)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#881337',
              zIndex: 10
            }}
            aria-label="Close"
          >
            <X size={18} strokeWidth={2.5} />
          </button>

          {/* Photos section */}
          <div
            style={{
              position: 'relative',
              width: '280px',
              height: '200px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '24px'
            }}
          >
            {/* Left photo - matched profile (with cloud/blob shape) */}
            <div
              style={{
                position: 'absolute',
                left: '0',
                top: '20px',
                zIndex: 2,
                animation: 'vibePhotoLeft 0.55s cubic-bezier(0.16, 1, 0.3, 1) forwards',
                animationDelay: '0.15s',
                opacity: 0
              }}
            >
              <div
                style={{
                  width: '130px',
                  height: '130px',
                  borderRadius: '34% 66% 60% 40% / 40% 34% 66% 60%',
                  overflow: 'hidden',
                  border: '4px solid #FFFFFF',
                  boxShadow: '0 12px 32px rgba(190, 18, 60, 0.2), 0 4px 12px rgba(0,0,0,0.08)',
                  background: '#FAE0E6'
                }}
              >
                <img
                  src={matchPhoto}
                  alt={matchedProfile.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />
              </div>
            </div>

            {/* Right photo - current user (with cloud/blob shape) */}
            <div
              style={{
                position: 'absolute',
                right: '0',
                top: '0',
                zIndex: 3,
                animation: 'vibePhotoRight 0.55s cubic-bezier(0.16, 1, 0.3, 1) forwards',
                animationDelay: '0.25s',
                opacity: 0
              }}
            >
              <div
                style={{
                  width: '130px',
                  height: '130px',
                  borderRadius: '60% 40% 34% 66% / 66% 60% 40% 34%',
                  overflow: 'hidden',
                  border: '4px solid #FFFFFF',
                  boxShadow: '0 12px 32px rgba(190, 18, 60, 0.2), 0 4px 12px rgba(0,0,0,0.08)',
                  background: '#FAE0E6'
                }}
              >
                <img
                  src={currentUserPhoto}
                  alt={currentUserName}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />
              </div>
            </div>

            {/* Center heart badge */}
            <div
              style={{
                position: 'absolute',
                left: '50%',
                top: '50%',
                zIndex: 5,
                animation: 'vibeHeartPulse 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
                animationDelay: '0.4s',
                opacity: 0
              }}
            >
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #FF3366 0%, #E11D48 100%)',
                  border: '3px solid #FFFFFF',
                  boxShadow: '0 6px 20px rgba(225, 29, 72, 0.35)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Heart size={22} fill="#FFFFFF" color="#FFFFFF" strokeWidth={0} />
              </div>
            </div>
          </div>

          {/* Title text */}
          <div
            style={{
              textAlign: 'center',
              animation: 'vibeTextSlideUp 0.4s ease-out forwards',
              animationDelay: '0.35s',
              opacity: 0,
              marginBottom: '6px'
            }}
          >
            <h1
              style={{
                fontFamily: 'var(--font-primary)',
                fontSize: '2.4rem',
                fontWeight: 900,
                color: '#1A0A10',
                letterSpacing: '-0.025em',
                margin: 0,
                lineHeight: 1.15
              }}
            >
              It's a match!
            </h1>
            <p
              style={{
                fontSize: '0.95rem',
                fontWeight: 600,
                color: '#7A3050',
                margin: '8px 0 0 0',
                lineHeight: 1.5
              }}
            >
              You and <strong style={{ color: '#BE123C' }}>{matchedProfile.name}</strong> have a{' '}
              <strong style={{ color: '#BE123C' }}>{vibeScore}%</strong> vibe match!
            </p>
            <p
              style={{
                fontSize: '0.82rem',
                fontWeight: 500,
                color: '#8B5A6A',
                margin: '4px 0 0 0'
              }}
            >
              Start a conversation now
            </p>
          </div>

          {/* Action buttons */}
          <div
            style={{
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '12px',
              marginTop: '28px',
              animation: 'vibeButtonsSlide 0.4s ease-out forwards',
              animationDelay: '0.5s',
              opacity: 0
            }}
          >
            {/* Start Chat */}
            <button
              onClick={onStartChat}
              style={{
                width: '100%',
                maxWidth: '300px',
                padding: '15px 28px',
                borderRadius: '9999px',
                background: 'linear-gradient(135deg, #22C55E 0%, #16A34A 100%)',
                color: '#FFFFFF',
                fontSize: '1.05rem',
                fontWeight: 800,
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 8px 24px rgba(34, 197, 94, 0.35)',
                transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                letterSpacing: '0.01em',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)';
                e.currentTarget.style.boxShadow = '0 12px 30px rgba(34, 197, 94, 0.45)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(34, 197, 94, 0.35)';
              }}
            >
              <MessageCircle size={18} />
              Start Chat
            </button>

            {/* Not now */}
            <button
              onClick={onDismiss}
              style={{
                width: '100%',
                maxWidth: '300px',
                padding: '14px 28px',
                borderRadius: '9999px',
                background: '#FFFFFF',
                color: '#3F3F46',
                fontSize: '0.98rem',
                fontWeight: 700,
                border: '2px solid rgba(63, 63, 70, 0.15)',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.06)',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'rgba(63, 63, 70, 0.3)';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(63, 63, 70, 0.15)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              Not now
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
