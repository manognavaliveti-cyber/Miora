import React from 'react';
import { useApp } from '../context/AppContext';
import { ArrowRight } from 'lucide-react';

export const WelcomePage: React.FC = () => {
  const { setCurrentView, googleAuth } = useApp();

  return (
    <main
      style={{
        minHeight: '100dvh',
        width: '100%',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: 'var(--font-primary)'
      }}
    >
      {/* Full-bleed heart-splash background photo — swaps image at the desktop breakpoint */}
      <div
        className="welcome-hero-bg"
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 0
        }}
      />

      {/* Pink tint so the background reads as a solid brand color, matching the reference design */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(180deg, rgba(190, 24, 71, 0.55) 0%, rgba(190, 24, 71, 0.35) 40%, rgba(150, 12, 55, 0.65) 100%)',
          zIndex: 1
        }}
      />

      {/* Top-right Log In pill */}
      <button
        type="button"
        onClick={() => setCurrentView('login')}
        style={{
          position: 'absolute',
          top: 'clamp(14px, 3vh, 28px)',
          right: 'clamp(14px, 4vw, 28px)',
          zIndex: 2,
          padding: 'clamp(10px, 1.5vw, 13px) clamp(20px, 3vw, 26px)',
          borderRadius: '999px',
          border: '1.5px solid rgba(255,255,255,0.85)',
          background: 'rgba(255,255,255,0.08)',
          backdropFilter: 'blur(6px)',
          WebkitBackdropFilter: 'blur(6px)',
          color: '#FFFFFF',
          fontSize: 'clamp(0.9rem, 2vw, 1rem)',
          fontWeight: 700,
          cursor: 'pointer'
        }}
      >
        Log In
      </button>

      {/* Heading */}
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          textAlign: 'center',
          marginTop: 'clamp(48px, 10vh, 80px)',
          padding: '0 20px'
        }}
      >
        <h1
          style={{
            margin: 0,
            color: '#FFFFFF',
            fontSize: 'clamp(2.8rem, 8vw, 4.4rem)',
            fontWeight: 900,
            letterSpacing: '0.28em',
            textIndent: '0.28em',
            textShadow: '0 6px 20px rgba(76, 5, 25, 0.35)'
          }}
        >
          MIORA
        </h1>
        <p
          style={{
            margin: '8px 0 0',
            color: 'rgba(255,255,255,0.92)',
            fontSize: 'clamp(0.85rem, 2vw, 1.05rem)',
            fontWeight: 700,
            letterSpacing: '0.32em',
            textIndent: '0.32em'
          }}
        >
          MEET. MATCH. BELONG.
        </p>
      </div>

      {/* Spacer that shows the background splash image through the middle of the screen */}
      <div style={{ flex: 1 }} />

      {/* Bottom CTA block */}
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          width: '100%',
          maxWidth: '480px',
          margin: '0 auto',
          padding: '0 24px clamp(20px, 4vh, 36px)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '12px',
          boxSizing: 'border-box'
        }}
      >
        <button
          type="button"
          onClick={() => setCurrentView('signup')}
          style={{
            width: '100%',
            minHeight: 'clamp(52px, 8vw, 62px)',
            border: 'none',
            borderRadius: '999px',
            background: '#FFFFFF',
            color: '#B3184A',
            fontSize: 'clamp(1rem, 3vw, 1.15rem)',
            fontWeight: 800,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            boxShadow: '0 0 0 5px rgba(255,255,255,0.14), 0 10px 28px rgba(255, 60, 110, 0.5)',
            transition: 'transform 180ms ease'
          }}
          onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; }}
        >
          Sign Up / Register
          <ArrowRight size={20} strokeWidth={2.5} />
        </button>

        <button
          type="button"
          onClick={() => googleAuth('signup')}
          style={{
            width: '100%',
            minHeight: 'clamp(48px, 7.5vw, 58px)',
            border: '1.5px solid rgba(255,255,255,0.55)',
            borderRadius: '999px',
            background: 'rgba(0,0,0,0.18)',
            backdropFilter: 'blur(6px)',
            WebkitBackdropFilter: 'blur(6px)',
            color: '#FFFFFF',
            fontSize: 'clamp(0.95rem, 2.8vw, 1.08rem)',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px'
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
          </svg>
          <span style={{ width: '1px', height: '18px', background: 'rgba(255,255,255,0.45)' }} />
          Continue with Google
        </button>

        {/* Onboarding pagination dots (decorative) */}
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginTop: '6px' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'rgba(255,255,255,0.45)' }} />
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#FFFFFF' }} />
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'rgba(255,255,255,0.45)' }} />
        </div>
      </div>
    </main>
  );
};
