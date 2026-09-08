import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  PhoneOff,
  SwitchCamera,
  Coins,
  Clock,
  Gift,
  Sparkles,
  Shield,
  Plus
} from 'lucide-react';
import { TalkTimeModal } from './TalkTimeModal';

export const CallModal: React.FC = () => {
  const {
    activeCall,
    endCall,
    toggleMute,
    toggleCamera,
    switchCamera,
    openTalkTimeModal,
    openGiftModal,
    currentUser
  } = useApp();

  if (!activeCall) return null;

  const partner = activeCall.partner;
  const isVideo = activeCall.type === 'video';
  const minutes = Math.floor(activeCall.durationSeconds / 60);
  const seconds = activeCall.durationSeconds % 60;
  const timeStr = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const remainingMins = Math.floor(activeCall.remainingTalkTimeSeconds / 60);
  const remainingSecs = activeCall.remainingTalkTimeSeconds % 60;
  const remainingTimeStr = `${String(remainingMins).padStart(2, '0')}:${String(remainingSecs).padStart(2, '0')}`;

  const partnerPhoto =
    partner.photos[0] ||
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80';
  const userPhoto =
    currentUser.photos[0] ||
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80';

  return (
    <>
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 90,
          background: '#0F090C',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'space-between',
          overflow: 'hidden',
          animation: 'fadeIn 0.3s ease-out'
        }}
      >
        {/* Background Atmosphere for Video/Audio */}
        {isVideo ? (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              zIndex: 1,
              overflow: 'hidden'
            }}
          >
            <img
              src={partnerPhoto}
              alt={partner.name}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                filter: activeCall.isCameraOff ? 'brightness(0.3) blur(20px)' : 'brightness(0.85)',
                transition: 'all 0.5s ease'
              }}
            />
            {/* Gradient Overlays */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background:
                  'linear-gradient(180deg, rgba(15, 9, 12, 0.75) 0%, rgba(15, 9, 12, 0.1) 40%, rgba(15, 9, 12, 0.85) 100%)'
              }}
            />
          </div>
        ) : (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              zIndex: 1,
              background: 'radial-gradient(circle at 50% 30%, #4C0519 0%, #1F161A 60%, #0F090C 100%)',
              overflow: 'hidden'
            }}
          >
            {/* Animated Pulse Waves */}
            <div
              style={{
                position: 'absolute',
                top: '40%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '340px',
                height: '340px',
                borderRadius: '50%',
                border: '1.5px solid rgba(244, 63, 94, 0.25)',
                animation: 'pulseGlow 2.8s infinite ease-out'
              }}
            />
            <div
              style={{
                position: 'absolute',
                top: '40%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '460px',
                height: '460px',
                borderRadius: '50%',
                border: '1px solid rgba(251, 113, 133, 0.15)',
                animation: 'pulseGlow 2.8s infinite ease-out 0.8s'
              }}
            />
          </div>
        )}

        {/* TOP STATUS BAR: Partner Name, Duration, Coins & Talk-Time */}
        <header
          style={{
            position: 'relative',
            zIndex: 10,
            width: '100%',
            maxWidth: '1200px',
            padding: '24px 20px 10px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px'
          }}
        >
          {/* Partner Info & Live Indicator */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                border: '2px solid var(--gold-champagne)',
                overflow: 'hidden',
                boxShadow: '0 4px 16px rgba(0,0,0,0.5)'
              }}
            >
              <img src={partnerPhoto} alt={partner.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.01em' }}>
                  {partner.name}, {partner.age}
                </h2>
                <span
                  style={{
                    background: 'rgba(238, 56, 101, 0.25)',
                    color: '#FF6B8B',
                    border: '1px solid rgba(238, 56, 101, 0.4)',
                    fontSize: '0.65rem',
                    fontWeight: 800,
                    padding: '2px 8px',
                    borderRadius: 'var(--radius-pill)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <span
                    style={{
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      background: '#FF6B8B',
                      boxShadow: '0 0 8px #FF6B8B'
                    }}
                  />
                  {activeCall.status === 'connected' ? 'LIVE' : 'CONNECTING...'}
                </span>
              </div>
              <span style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.7)', display: 'block', marginTop: '2px' }}>
                {activeCall.status === 'connected' ? `Call Duration: ${timeStr}` : 'Calling with encrypted romance audio...'}
              </span>
            </div>
          </div>

          {/* User's Coin Balance & Talk-Time Monetization Bar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {/* Coin Balance Badge */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.12)',
                backdropFilter: 'blur(16px)',
                border: '1px solid rgba(245, 158, 11, 0.4)',
                padding: '6px 14px',
                borderRadius: 'var(--radius-pill)',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                color: '#FEF3C7',
                fontSize: '0.86rem',
                fontWeight: 800
              }}
            >
              <Coins size={16} color="var(--gold-deep)" />
              <span>{currentUser.coinBalance} Coins</span>
            </div>

            {/* Talk Time Countdown & Add Button */}
            <div
              style={{
                background: activeCall.isWarningLowTime
                  ? 'rgba(225, 29, 72, 0.35)'
                  : 'rgba(255, 255, 255, 0.12)',
                backdropFilter: 'blur(16px)',
                border: activeCall.isWarningLowTime
                  ? '1.5px solid #F43F5E'
                  : '1px solid rgba(255, 255, 255, 0.2)',
                padding: '4px 6px 4px 14px',
                borderRadius: 'var(--radius-pill)',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                color: '#FFFFFF'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.84rem' }}>
                <Clock size={15} color={activeCall.isWarningLowTime ? '#F43F5E' : 'var(--rose-soft)'} />
                <span style={{ fontWeight: 700 }}>
                  Talk Time: <strong style={{ color: activeCall.isWarningLowTime ? '#FDA4AF' : '#FFFFFF' }}>{remainingTimeStr}</strong>
                </span>
              </div>

              <button
                onClick={openTalkTimeModal}
                style={{
                  background: 'var(--primary-gradient)',
                  color: '#FFFFFF',
                  border: 'none',
                  padding: '6px 14px',
                  borderRadius: 'var(--radius-pill)',
                  fontSize: '0.78rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  boxShadow: '0 2px 10px rgba(238, 56, 101, 0.4)'
                }}
              >
                <Plus size={13} />
                <span>Add Time</span>
              </button>
            </div>
          </div>
        </header>

        {/* CENTER CONTENT */}
        <main
          style={{
            position: 'relative',
            zIndex: 10,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            padding: '20px',
            width: '100%'
          }}
        >
          {/* Audio Call Center Stage */}
          {!isVideo && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div
                style={{
                  position: 'relative',
                  width: '150px',
                  height: '150px',
                  borderRadius: '50%',
                  padding: '6px',
                  background: 'linear-gradient(135deg, var(--rose-primary), var(--gold-champagne))',
                  boxShadow: '0 0 50px rgba(244, 63, 94, 0.4)',
                  marginBottom: '24px'
                }}
              >
                <img
                  src={partnerPhoto}
                  alt={partner.name}
                  style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
                />
              </div>

              <h2
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: '2rem',
                  fontWeight: 800,
                  color: '#FFFFFF',
                  marginBottom: '8px'
                }}
              >
                {partner.name}
              </h2>
              <p style={{ color: 'rgba(255, 255, 255, 0.75)', fontSize: '0.95rem' }}>
                {activeCall.status === 'connected' ? 'High Definition Audio Connected' : 'Connecting to partner...'}
              </p>

              {/* Romantic Soundwave animation simulation */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '24px', height: '32px' }}>
                {[18, 28, 14, 36, 22, 30, 16, 34, 20, 26, 15].map((h, i) => (
                  <div
                    key={i}
                    style={{
                      width: '4px',
                      height: `${h}px`,
                      borderRadius: '4px',
                      background: 'var(--primary-gradient)',
                      opacity: activeCall.isMuted ? 0.3 : 0.9,
                      animation: activeCall.isMuted ? 'none' : `pulseSound 1.2s infinite ease-in-out ${i * 0.1}s`
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Video Call User PiP (Picture in Picture) */}
          {isVideo && (
            <div
              style={{
                position: 'absolute',
                top: '20px',
                right: '24px',
                width: '120px',
                height: '170px',
                borderRadius: '20px',
                overflow: 'hidden',
                boxShadow: '0 12px 32px rgba(0,0,0,0.6)',
                border: '2px solid rgba(255, 255, 255, 0.3)',
                background: '#1F161A',
                zIndex: 20
              }}
            >
              <img
                src={userPhoto}
                alt={currentUser.name}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  filter: activeCall.isCameraOff ? 'grayscale(1) brightness(0.4)' : 'none'
                }}
              />
              <span
                style={{
                  position: 'absolute',
                  bottom: '8px',
                  left: '8px',
                  background: 'rgba(0,0,0,0.6)',
                  color: '#FFFFFF',
                  fontSize: '0.65rem',
                  fontWeight: 700,
                  padding: '2px 6px',
                  borderRadius: '6px'
                }}
              >
                You
              </span>
            </div>
          )}
        </main>

        {/* BOTTOM ACTION BAR CONTROLS */}
        <footer
          style={{
            position: 'relative',
            zIndex: 10,
            width: '100%',
            maxWidth: '600px',
            padding: '16px 16px 36px 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 'clamp(8px, 2.5vw, 18px)',
            flexWrap: 'wrap'
          }}
        >
          {/* Mute Mic */}
          <button
            onClick={toggleMute}
            style={{
              width: 'clamp(46px, 12vw, 54px)',
              height: 'clamp(46px, 12vw, 54px)',
              borderRadius: '50%',
              background: activeCall.isMuted ? '#E11D48' : 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(16px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              cursor: 'pointer',
              flexShrink: 0,
              transition: 'transform var(--transition-fast)'
            }}
            title={activeCall.isMuted ? 'Unmute' : 'Mute'}
          >
            {activeCall.isMuted ? <MicOff size={20} /> : <Mic size={20} />}
          </button>

          {/* Video Toggle (Only for Video Calls) */}
          {isVideo && (
            <button
              onClick={toggleCamera}
              style={{
                width: 'clamp(46px, 12vw, 54px)',
                height: 'clamp(46px, 12vw, 54px)',
                borderRadius: '50%',
                background: activeCall.isCameraOff ? '#E11D48' : 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(16px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFFFFF',
                cursor: 'pointer',
                flexShrink: 0
              }}
              title={activeCall.isCameraOff ? 'Turn Camera On' : 'Turn Camera Off'}
            >
              {activeCall.isCameraOff ? <VideoOff size={20} /> : <Video size={20} />}
            </button>
          )}

          {/* Flip Camera */}
          {isVideo && (
            <button
              onClick={switchCamera}
              style={{
                width: 'clamp(46px, 12vw, 54px)',
                height: 'clamp(46px, 12vw, 54px)',
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(16px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFFFFF',
                cursor: 'pointer',
                flexShrink: 0
              }}
              title="Flip Camera"
            >
              <SwitchCamera size={20} />
            </button>
          )}

          {/* Send Virtual Gift during call */}
          <button
            onClick={() => openGiftModal(partner)}
            style={{
              width: 'clamp(46px, 12vw, 54px)',
              height: 'clamp(46px, 12vw, 54px)',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              cursor: 'pointer',
              flexShrink: 0,
              boxShadow: '0 4px 16px rgba(245, 158, 11, 0.4)'
            }}
            title="Send Gift"
          >
            <Gift size={20} />
          </button>

          {/* End Call Button */}
          <button
            onClick={endCall}
            style={{
              width: 'clamp(56px, 15vw, 68px)',
              height: 'clamp(56px, 15vw, 68px)',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #EF4444 0%, #B91C1C 100%)',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              cursor: 'pointer',
              flexShrink: 0,
              boxShadow: '0 8px 24px rgba(239, 68, 68, 0.5)',
              transform: 'scale(1)',
              transition: 'transform var(--transition-fast)'
            }}
            title="End Call"
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.08)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          >
            <PhoneOff size={24} />
          </button>
        </footer>
      </div>

      {/* Talk Time Top-up Sheet */}
      <TalkTimeModal />
    </>
  );
};
