import React from 'react';
import { useApp } from '../context/AppContext';
import { ShieldCheck, Sparkles, Heart } from 'lucide-react';
import { MioraLogo } from '../components/common/MioraLogo';

export const WelcomePage: React.FC = () => {
  const { setCurrentView, directGuestLogin } = useApp();

  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100%',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'linear-gradient(145deg, #E06D85 0%, #D85A74 40%, #CF4D67 100%)',
        overflow: 'hidden'
      }}
    >
      {/* Background Graphic Asset (Liquid Splash Heart) */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: 'url(/images/where_hearts_connect.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center 40%',
          opacity: 0.95,
          zIndex: 0
        }}
      />

      {/* Atmospheric Soft Gradient Overlays for High Text Contrast */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(circle at 30% 30%, rgba(219, 84, 114, 0.45) 0%, rgba(190, 24, 60, 0.65) 60%, rgba(136, 19, 55, 0.85) 100%)',
          zIndex: 1
        }}
      />

      {/* Mobile & Desktop Main Content Layout */}
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          width: '100%',
          maxWidth: '1280px',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: 'clamp(28px, 5vw, 60px) clamp(24px, 6vw, 70px)',
          boxSizing: 'border-box'
        }}
      >
        {/* Top Section: Brand & Headline */}
        <div style={{ maxWidth: '640px', paddingTop: 'clamp(10px, 3vh, 36px)' }}>
          {/* Official Brand Logo */}
          <div style={{ marginBottom: '20px', display: 'inline-flex' }}>
            <MioraLogo size={48} showTagline={true} showWordmark={true} vertical={false} colorScheme="light" />
          </div>

          {/* Main Title: Where hearts connect */}
          <h1
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(3.2rem, 6.8vw, 5.2rem)',
              fontWeight: 800,
              color: '#FFFFFF',
              lineHeight: 1.06,
              letterSpacing: '-0.025em',
              textShadow: '0 4px 20px rgba(76, 5, 25, 0.35)',
              margin: 0
            }}
          >
            Where<br />
            hearts<br />
            connect
          </h1>

          {/* Subtitle / Tagline: Meet. Match. Belong. ♡ with smooth underline */}
          <div style={{ marginTop: 'clamp(18px, 3vh, 26px)' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                color: '#FFFFFF',
                fontSize: 'clamp(1.15rem, 2.2vw, 1.55rem)',
                fontFamily: 'var(--font-serif)',
                fontWeight: 600,
                textShadow: '0 2px 10px rgba(76, 5, 25, 0.25)'
              }}
            >
              <span>Meet. Match. Belong.</span>
              <svg
                width="24"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#FFFFFF"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ filter: 'drop-shadow(0 2px 4px rgba(76,5,25,0.3))' }}
              >
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            </div>

            {/* Organic curved underline */}
            <div style={{ width: '190px', height: '10px', marginTop: '3px' }}>
              <svg width="100%" height="100%" viewBox="0 0 190 10" fill="none">
                <path
                  d="M3 4C50 9 140 9 187 4"
                  stroke="#FFFFFF"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  opacity="0.9"
                />
              </svg>
            </div>
          </div>

          {/* Supporting Copy */}
          <p
            style={{
              fontSize: 'clamp(1rem, 1.5vw, 1.2rem)',
              color: 'rgba(255, 255, 255, 0.95)',
              lineHeight: 1.55,
              marginTop: 'clamp(20px, 3vh, 28px)',
              maxWidth: '460px',
              fontWeight: 400,
              textShadow: '0 2px 8px rgba(76, 5, 25, 0.25)'
            }}
          >
            Discover meaningful connections and find someone who truly matches your vibe.
          </p>

          {/* Social Proof Stack: 3 overlapping circular avatar photos + 10K+ badge */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0px',
              marginTop: 'clamp(24px, 4vh, 34px)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center' }}>
              {[
                'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
                'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
                'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80'
              ].map((avatarUrl, idx) => (
                <img
                  key={idx}
                  src={avatarUrl}
                  alt={`Member ${idx + 1}`}
                  style={{
                    width: 'clamp(44px, 4.5vw, 54px)',
                    height: 'clamp(44px, 4.5vw, 54px)',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    border: '2.5px solid #FFFFFF',
                    marginLeft: idx === 0 ? '0' : '-12px',
                    boxShadow: '0 4px 14px rgba(76, 5, 25, 0.28)',
                    zIndex: 3 - idx
                  }}
                />
              ))}

              {/* 10K+ Rose Badge */}
              <div
                style={{
                  width: 'clamp(44px, 4.5vw, 54px)',
                  height: 'clamp(44px, 4.5vw, 54px)',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #BE123C 0%, #881337 100%)',
                  border: '2.5px solid #FFFFFF',
                  marginLeft: '-12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFFFFF',
                  fontSize: 'clamp(0.82rem, 1vw, 0.95rem)',
                  fontWeight: 800,
                  boxShadow: '0 4px 14px rgba(76, 5, 25, 0.35)',
                  zIndex: 4,
                  letterSpacing: '0.02em'
                }}
              >
                10K+
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section: Action CTAs & Safety Note */}
        <div
          style={{
            maxWidth: '480px',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
            marginTop: 'clamp(32px, 5vh, 48px)',
            paddingBottom: 'clamp(10px, 2vh, 20px)'
          }}
        >
          {/* Primary CTA: Solid White Pill "Get started" */}
          <button
            onClick={() => setCurrentView('signup')}
            style={{
              width: '100%',
              padding: 'clamp(15px, 2vh, 18px) 32px',
              borderRadius: '9999px',
              background: '#FFFFFF',
              color: '#BE123C',
              fontSize: 'clamp(1rem, 1.4vw, 1.15rem)',
              fontWeight: 800,
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 10px 30px rgba(76, 5, 25, 0.35)',
              transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
              letterSpacing: '0.01em',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px) scale(1.01)';
              e.currentTarget.style.boxShadow = '0 14px 38px rgba(76, 5, 25, 0.45)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0) scale(1)';
              e.currentTarget.style.boxShadow = '0 10px 30px rgba(76, 5, 25, 0.35)';
            }}
          >
            <span>Get started</span>
          </button>

          {/* Secondary CTA: Translucent Outline Pill "I already have an account" */}
          <button
            onClick={() => setCurrentView('login')}
            style={{
              width: '100%',
              padding: 'clamp(14px, 1.8vh, 17px) 32px',
              borderRadius: '9999px',
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              color: '#FFFFFF',
              fontSize: 'clamp(0.96rem, 1.3vw, 1.08rem)',
              fontWeight: 700,
              border: '2px solid rgba(255, 255, 255, 0.85)',
              cursor: 'pointer',
              transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
              letterSpacing: '0.01em',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.22)';
              e.currentTarget.style.borderColor = '#FFFFFF';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.85)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <span>I already have an account</span>
          </button>

          {/* Tertiary CTA: Direct Guest 1-Click Access */}
          <button
            onClick={directGuestLogin}
            style={{
              width: '100%',
              padding: '12px 24px',
              borderRadius: '9999px',
              background: 'rgba(255, 255, 255, 0.18)',
              backdropFilter: 'blur(12px)',
              color: '#FFFFFF',
              fontSize: '0.92rem',
              fontWeight: 800,
              border: '1.5px dashed rgba(255, 255, 255, 0.7)',
              cursor: 'pointer',
              transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.18)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <Sparkles size={16} color="#FDE047" />
            <span>Direct Quick Access • Explore App</span>
          </button>

          {/* Safety Micro Badge */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              color: 'rgba(255, 255, 255, 0.85)',
              fontSize: '0.8rem',
              marginTop: '4px'
            }}
          >
            <ShieldCheck size={16} color="#FFFFFF" />
            <span>100% Verified Community • Sincere Connections</span>
          </div>
        </div>
      </div>
    </div>
  );
};
