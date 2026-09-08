import React, { useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { MioraLogo } from '../components/common/MioraLogo';

export const SplashPage: React.FC = () => {
  const { setCurrentView } = useApp();

  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentView('welcome');
    }, 2200);
    return () => clearTimeout(timer);
  }, [setCurrentView]);

  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'radial-gradient(circle at center, #FFF5F8 0%, #FAF0F4 50%, #F5E6EC 100%)',
        position: 'relative',
        overflow: 'hidden',
        padding: '24px'
      }}
    >
      {/* Floating Animated Heart Orbs */}
      <div
        style={{
          width: '240px',
          height: '240px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(218, 107, 130, 0.35) 0%, rgba(136, 19, 55, 0) 70%)',
          position: 'absolute',
          top: '40%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          filter: 'blur(40px)',
          animation: 'pulseGlow 2.5s infinite ease-in-out'
        }}
      />

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '16px',
          zIndex: 2,
          animation: 'popIn 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards'
        }}
      >
        <MioraLogo size={100} showTagline={true} showWordmark={true} vertical={true} />
      </div>

      {/* Subtle Bottom Spinner / Loader */}
      <div
        style={{
          position: 'absolute',
          bottom: '50px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}
      >
        <span
          style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: 'var(--primary-berry)',
            animation: 'float 1s infinite alternate'
          }}
        />
        <span
          style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: 'var(--accent-gold)',
            animation: 'float 1s infinite alternate 0.2s'
          }}
        />
        <span
          style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: 'var(--primary-wine)',
            animation: 'float 1s infinite alternate 0.4s'
          }}
        />
      </div>
    </div>
  );
};
