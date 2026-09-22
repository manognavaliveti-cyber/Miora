import React, { useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import confetti from 'canvas-confetti';

export const MutualMatchModal: React.FC = () => {
  const {
    isMatchModalOpen,
    currentUser,
    latestMatchedProfile,
    startChatFromMatch,
    keepDiscovering
  } = useApp();

  useEffect(() => {
    if (isMatchModalOpen) {
      try {
        confetti({
          particleCount: 90,
          spread: 80,
          origin: { y: 0.45 },
          colors: ['#EE3865', '#F472B6', '#FB7185', '#FCE7EC', '#FFFFFF']
        });
      } catch (e) {
        console.warn('Confetti error', e);
      }
    }
  }, [isMatchModalOpen]);

  if (!isMatchModalOpen || !latestMatchedProfile) return null;

  const userPhoto =
    currentUser.photos[0] ||
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80';
  const matchPhoto =
    latestMatchedProfile.photos[0] ||
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80';

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 100,
        background: 'rgba(255, 230, 236, 0.94)',
        backdropFilter: 'blur(20px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        animation: 'fadeIn 0.3s ease-out forwards',
        overflowY: 'auto'
      }}
    >
      {/* Central Romantic Hot-Air Match Canvas */}
      <div
        style={{
          width: '100%',
          maxWidth: '430px',
          minHeight: '680px',
          maxHeight: '94vh',
          background: 'linear-gradient(180deg, #FDE2E8 0%, #FDD2DE 45%, #FCC7D5 70%, #FBC4D2 100%)',
          borderRadius: '36px',
          boxShadow: '0 20px 60px rgba(190, 24, 60, 0.22), 0 0 0 1px rgba(255, 255, 255, 0.6)',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '36px 24px 28px 24px',
          overflow: 'hidden',
          boxSizing: 'border-box',
          animation: 'popIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards'
        }}
      >
        {/* Floating Clouds Background Elements */}
        {/* Top-Right Cloud */}
        <div
          style={{
            position: 'absolute',
            top: '35px',
            right: '-15px',
            width: '90px',
            height: '32px',
            background: 'rgba(255, 255, 255, 0.85)',
            borderRadius: '20px',
            filter: 'blur(1px)',
            opacity: 0.9
          }}
        />

        {/* Top-Left Cloud */}
        <div
          style={{
            position: 'absolute',
            top: '75px',
            left: '10px',
            width: '75px',
            height: '26px',
            background: 'rgba(255, 255, 255, 0.8)',
            borderRadius: '20px',
            filter: 'blur(1px)',
            opacity: 0.85
          }}
        />

        {/* Mid-Left Cloud */}
        <div
          style={{
            position: 'absolute',
            top: '230px',
            left: '-10px',
            width: '85px',
            height: '30px',
            background: 'rgba(255, 255, 255, 0.8)',
            borderRadius: '20px',
            opacity: 0.8
          }}
        />

        {/* Mid-Right Cloud */}
        <div
          style={{
            position: 'absolute',
            top: '210px',
            right: '12px',
            width: '65px',
            height: '24px',
            background: 'rgba(255, 255, 255, 0.8)',
            borderRadius: '20px',
            opacity: 0.8
          }}
        />

        {/* Top-Left Mini Hot-Air Balloon */}
        <div
          style={{
            position: 'absolute',
            top: '24px',
            left: '20px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            opacity: 0.9,
            animation: 'float 5s ease-in-out infinite alternate'
          }}
        >
          <div
            style={{
              width: '42px',
              height: '42px',
              background: 'linear-gradient(135deg, #F43F5E 0%, #E11D48 100%)',
              borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 10px rgba(225, 29, 72, 0.25)'
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="#FFFFFF">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          </div>
          {/* Ropes */}
          <div style={{ width: '18px', height: '8px', display: 'flex', justifyContent: 'space-between', padding: '0 2px' }}>
            <div style={{ width: '1px', height: '100%', background: '#9CA3AF' }} />
            <div style={{ width: '1px', height: '100%', background: '#9CA3AF' }} />
          </div>
          {/* Basket */}
          <div
            style={{
              width: '18px',
              height: '11px',
              background: '#E08544',
              borderRadius: '2px 2px 4px 4px',
              boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.2)'
            }}
          />
        </div>

        {/* Header Title: Congratulation / It's a match! */}
        <div style={{ textAlign: 'center', zIndex: 5, marginTop: '4px' }}>
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.65rem',
              fontWeight: 800,
              color: '#18181B',
              letterSpacing: '-0.02em',
              margin: 0,
              lineHeight: 1.15
            }}
          >
            Congratulation
          </h2>
          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.85rem',
              fontWeight: 900,
              color: '#18181B',
              letterSpacing: '-0.02em',
              marginTop: '4px',
              lineHeight: 1.15
            }}
          >
            It’s a match!
          </h1>
        </div>

        {/* Center: Heart Hot-Air Balloons of the 2 Users + Dashed Loop Arc */}
        <div
          style={{
            position: 'relative',
            width: '100%',
            height: '260px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '8px 0'
          }}
        >
          {/* Whimsical Dashed Trajectory Arc connecting the two balloons */}
          <svg
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              top: 0,
              left: 0,
              pointerEvents: 'none',
              zIndex: 2
            }}
            viewBox="0 0 380 260"
            fill="none"
          >
            <path
              d="M 145 145 C 160 80, 200 60, 205 95 C 210 130, 185 135, 195 90 C 205 50, 235 55, 260 80"
              stroke="#374151"
              strokeWidth="1.8"
              strokeDasharray="4 4"
              strokeLinecap="round"
            />
          </svg>

          {/* Left Hot-Air Balloon (Girl/Match Avatar) */}
          <div
            style={{
              position: 'absolute',
              left: '42px',
              top: '85px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              zIndex: 3,
              animation: 'float 4.5s ease-in-out infinite alternate'
            }}
          >
            {/* Heart Frame with Photo */}
            <div
              style={{
                width: '124px',
                height: '124px',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                filter: 'drop-shadow(0 8px 18px rgba(225, 29, 72, 0.28))'
              }}
            >
              <svg width="124" height="124" viewBox="0 0 100 100" style={{ position: 'absolute', top: 0, left: 0 }}>
                <defs>
                  <clipPath id="matchHeartLeftClip">
                    <path d="M50,85 C22,60 5,42 5,26 C5,12 16,3 30,3 C38,3 46,7 50,14 C54,7 62,3 70,3 C84,3 95,12 95,26 C95,42 78,60 50,85 Z" />
                  </clipPath>
                </defs>
                {/* Pink Heart Outline Background */}
                <path
                  d="M50,88 C20,62 3,43 3,26 C3,10 15,1 30,1 C39,1 47,5 50,13 C53,5 61,1 70,1 C85,1 97,10 97,26 C97,43 80,62 50,88 Z"
                  fill="#EE4266"
                />
              </svg>

              {/* Photo Clamped in Heart */}
              <div
                style={{
                  width: '100px',
                  height: '100px',
                  clipPath: 'polygon(50% 100%, 0 40%, 0 15%, 25% 0, 50% 20%, 75% 0, 100% 15%, 100% 40%)',
                  WebkitClipPath: 'path("M 50,85 C 22,60 5,42 5,26 C 5,12 16,3 30,3 C 38,3 46,7 50,14 C 54,7 62,3 70,3 C 84,3 95,12 95,26 C 95,42 78,60 50,85 Z")',
                  position: 'relative',
                  overflow: 'hidden',
                  zIndex: 2,
                  marginTop: '-4px'
                }}
              >
                <img
                  src={matchPhoto}
                  alt={latestMatchedProfile.name}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transform: 'scale(1.15)'
                  }}
                />
              </div>
            </div>

            {/* Balloon Ropes */}
            <div
              style={{
                width: '36px',
                height: '14px',
                display: 'flex',
                justifyContent: 'space-between',
                padding: '0 4px',
                marginTop: '-6px'
              }}
            >
              <div style={{ width: '1.5px', height: '100%', background: '#9CA3AF' }} />
              <div style={{ width: '1.5px', height: '100%', background: '#9CA3AF' }} />
            </div>

            {/* Wicker Basket */}
            <div
              style={{
                width: '44px',
                height: '24px',
                background: 'linear-gradient(180deg, #E6914D 0%, #CE7736 100%)',
                borderRadius: '4px 4px 10px 10px',
                boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
                border: '1px solid #B86224'
              }}
            />
          </div>

          {/* Right Hot-Air Balloon (Boy/User Avatar) */}
          <div
            style={{
              position: 'absolute',
              right: '42px',
              top: '10px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              zIndex: 4,
              animation: 'float 5.2s ease-in-out infinite alternate 0.6s'
            }}
          >
            {/* Heart Frame with Photo */}
            <div
              style={{
                width: '124px',
                height: '124px',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                filter: 'drop-shadow(0 8px 18px rgba(225, 29, 72, 0.28))'
              }}
            >
              <svg width="124" height="124" viewBox="0 0 100 100" style={{ position: 'absolute', top: 0, left: 0 }}>
                <path
                  d="M50,88 C20,62 3,43 3,26 C3,10 15,1 30,1 C39,1 47,5 50,13 C53,5 61,1 70,1 C85,1 97,10 97,26 C97,43 80,62 50,88 Z"
                  fill="#EE4266"
                />
              </svg>

              {/* Photo Clamped in Heart */}
              <div
                style={{
                  width: '100px',
                  height: '100px',
                  clipPath: 'polygon(50% 100%, 0 40%, 0 15%, 25% 0, 50% 20%, 75% 0, 100% 15%, 100% 40%)',
                  WebkitClipPath: 'path("M 50,85 C 22,60 5,42 5,26 C 5,12 16,3 30,3 C 38,3 46,7 50,14 C 54,7 62,3 70,3 C 84,3 95,12 95,26 C 95,42 78,60 50,85 Z")',
                  position: 'relative',
                  overflow: 'hidden',
                  zIndex: 2,
                  marginTop: '-4px'
                }}
              >
                <img
                  src={userPhoto}
                  alt={currentUser.name}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transform: 'scale(1.15)'
                  }}
                />
              </div>
            </div>

            {/* Balloon Ropes */}
            <div
              style={{
                width: '36px',
                height: '14px',
                display: 'flex',
                justifyContent: 'space-between',
                padding: '0 4px',
                marginTop: '-6px'
              }}
            >
              <div style={{ width: '1.5px', height: '100%', background: '#9CA3AF' }} />
              <div style={{ width: '1.5px', height: '100%', background: '#9CA3AF' }} />
            </div>

            {/* Wicker Basket */}
            <div
              style={{
                width: '44px',
                height: '24px',
                background: 'linear-gradient(180deg, #E6914D 0%, #CE7736 100%)',
                borderRadius: '4px 4px 10px 10px',
                boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
                border: '1px solid #B86224'
              }}
            />
          </div>
        </div>

        {/* Subtitle: Get Ready for Your / Date chat! */}
        <div style={{ textAlign: 'center', zIndex: 5 }}>
          <h3
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.25rem',
              fontWeight: 800,
              color: '#18181B',
              letterSpacing: '-0.01em',
              margin: 0,
              lineHeight: 1.25
            }}
          >
            Get Ready for Your<br />
            Date chat!
          </h3>
        </div>

        {/* Bottom Cloud Landscape & Floating Mini Balloon */}
        <div
          style={{
            position: 'relative',
            width: '100%',
            marginTop: '16px'
          }}
        >
          {/* Bottom-Right Mini Hot-Air Balloon */}
          <div
            style={{
              position: 'absolute',
              bottom: '100px',
              right: '28px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              zIndex: 3,
              animation: 'float 4s ease-in-out infinite alternate 1s'
            }}
          >
            <div
              style={{
                width: '36px',
                height: '36px',
                background: 'linear-gradient(135deg, #F43F5E 0%, #E11D48 100%)',
                borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 8px rgba(225, 29, 72, 0.2)'
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="#FFFFFF">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            </div>
            <div style={{ width: '14px', height: '6px', display: 'flex', justifyContent: 'space-between', padding: '0 2px' }}>
              <div style={{ width: '1px', height: '100%', background: '#9CA3AF' }} />
              <div style={{ width: '1px', height: '100%', background: '#9CA3AF' }} />
            </div>
            <div
              style={{
                width: '14px',
                height: '9px',
                background: '#E08544',
                borderRadius: '2px 2px 3px 3px'
              }}
            />
          </div>

          {/* Fluffy Soft White Bottom Clouds */}
          <div
            style={{
              position: 'absolute',
              bottom: '80px',
              left: '-24px',
              right: '-24px',
              height: '90px',
              background: 'radial-gradient(ellipse at center, rgba(255,255,255,0.98) 0%, rgba(255,255,255,0.94) 70%, transparent 100%)',
              filter: 'blur(3px)',
              pointerEvents: 'none',
              zIndex: 1
            }}
          />
        </div>

        {/* Action Buttons: Say "HI..." and Keep swipping */}
        <div
          style={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '14px',
            zIndex: 10,
            marginTop: '10px'
          }}
        >
          {/* Primary CTA: Say "HI..." Pill Button */}
          <button
            onClick={startChatFromMatch}
            style={{
              width: '100%',
              padding: '16px 28px',
              borderRadius: '9999px',
              background: '#EE3865',
              color: '#FFFFFF',
              fontSize: '1.1rem',
              fontWeight: 800,
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 10px 24px rgba(238, 56, 101, 0.42)',
              transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
              letterSpacing: '0.01em'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px) scale(1.01)';
              e.currentTarget.style.boxShadow = '0 14px 30px rgba(238, 56, 101, 0.52)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0) scale(1)';
              e.currentTarget.style.boxShadow = '0 10px 24px rgba(238, 56, 101, 0.42)';
            }}
          >
            Say “HI...”
          </button>

          {/* Secondary Link: Keep swipping */}
          <button
            onClick={keepDiscovering}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#71717A',
              fontSize: '0.96rem',
              fontWeight: 600,
              cursor: 'pointer',
              padding: '6px 16px',
              transition: 'color 0.2s ease'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#18181B')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#71717A')}
          >
            Keep swipping
          </button>

          {/* iOS-Style Bottom Home Indicator Bar */}
          <div
            style={{
              width: '120px',
              height: '4px',
              background: '#18181B',
              borderRadius: '9999px',
              marginTop: '4px',
              opacity: 0.85
            }}
          />
        </div>
      </div>
    </div>
  );
};
