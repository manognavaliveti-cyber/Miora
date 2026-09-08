import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  Heart,
  Star,
  MapPin,
  Briefcase,
  GraduationCap,
  Sparkles,
  ShieldAlert,
  ChevronDown,
  Check,
  Flame,
  MoreVertical,
  CheckCircle2,
  ShieldCheck,
  Coins
} from 'lucide-react';

export const ProfileDetailsModal: React.FC = () => {
  const {
    isProfileDetailOpen,
    activeProfile,
    closeProfileDetail,
    handleLike,
    handlePass,
    openReportModal,
    blockProfile,
    startCall,
    openGiftModal,
    startGameWithPartner,
    coupleGames,
    verifyProfileWithCoins,
    unlockedVerificationIds,
    currentUser
  } = useApp();

  const [activePhotoIdx, setActivePhotoIdx] = useState(0);
  const [showMenu, setShowMenu] = useState(false);

  if (!isProfileDetailOpen || !activeProfile) return null;

  const photos =
    activeProfile.photos.length > 0
      ? activeProfile.photos
      : ['https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&q=80'];

  const handleLikeClick = async () => {
    closeProfileDetail();
    await handleLike(activeProfile.id);
  };

  const handleSuperLikeClick = async () => {
    closeProfileDetail();
    await handleLike(activeProfile.id, true);
  };

  const handlePassClick = async () => {
    closeProfileDetail();
    await handlePass(activeProfile.id);
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 50,
        background: 'rgba(28, 18, 23, 0.65)',
        backdropFilter: 'blur(12px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 0,
        animation: 'fadeIn 0.25s ease-out forwards'
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '980px',
          height: '100vh',
          maxHeight: '100vh',
          background: 'var(--bg-warm-ivory)',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          overflow: 'hidden'
        }}
        className="profile-modal-responsive"
      >
        <style>{`
          @media (min-width: 1024px) {
            .profile-modal-responsive {
              height: 640px !important;
              max-height: 640px !important;
              border-radius: 32px !important;
              display: grid !important;
              grid-template-columns: 1.05fr 1fr !important;
              box-shadow: var(--shadow-float) !important;
              border: 1px solid var(--border-subtle) !important;
            }
            .profile-modal-gallery {
              height: 100% !important;
            }
          }
        `}</style>

        {/* LEFT / TOP: Photo Gallery */}
        <div
          className="profile-modal-gallery"
          style={{
            position: 'relative',
            width: '100%',
            height: 'clamp(280px, 42vh, 420px)',
            background: '#1C1217',
            flexShrink: 0
          }}
        >
          <img
            src={photos[activePhotoIdx]}
            alt={activeProfile.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />

          {/* Close & Menu Controls */}
          <div
            style={{
              position: 'absolute',
              top: '16px',
              left: '16px',
              right: '16px',
              display: 'flex',
              justifyContent: 'space-between',
              zIndex: 10
            }}
          >
            <button
              onClick={closeProfileDetail}
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(10px)',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--text-primary)',
                cursor: 'pointer',
                boxShadow: 'var(--shadow-md)'
              }}
            >
              <X size={20} />
            </button>

            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setShowMenu(!showMenu)}
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: 'rgba(255, 255, 255, 0.9)',
                  backdropFilter: 'blur(10px)',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--text-secondary)',
                  cursor: 'pointer',
                  boxShadow: 'var(--shadow-md)'
                }}
              >
                <MoreVertical size={20} />
              </button>

              {showMenu && (
                <div
                  style={{
                    position: 'absolute',
                    top: '48px',
                    right: 0,
                    background: '#FFFFFF',
                    borderRadius: 'var(--radius-md)',
                    boxShadow: 'var(--shadow-lg)',
                    border: '1px solid var(--border-subtle)',
                    padding: '6px',
                    minWidth: '160px',
                    zIndex: 20
                  }}
                >
                  <button
                    onClick={() => {
                      setShowMenu(false);
                      openReportModal(activeProfile);
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '10px 14px',
                      borderRadius: 'var(--radius-sm)',
                      border: 'none',
                      background: 'transparent',
                      color: '#E11D48',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      width: '100%',
                      textAlign: 'left'
                    }}
                  >
                    <ShieldAlert size={16} />
                    <span>Report User</span>
                  </button>

                  <button
                    onClick={() => {
                      setShowMenu(false);
                      blockProfile(activeProfile.id);
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '10px 14px',
                      borderRadius: 'var(--radius-sm)',
                      border: 'none',
                      background: 'transparent',
                      color: 'var(--text-secondary)',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      width: '100%',
                      textAlign: 'left'
                    }}
                  >
                    <X size={16} />
                    <span>Block User</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Photo Dots */}
          {photos.length > 1 && (
            <div
              style={{
                position: 'absolute',
                bottom: '16px',
                left: '50%',
                transform: 'translateX(-50%)',
                display: 'flex',
                gap: '6px',
                background: 'rgba(0, 0, 0, 0.45)',
                backdropFilter: 'blur(8px)',
                padding: '4px 10px',
                borderRadius: 'var(--radius-pill)'
              }}
            >
              {photos.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActivePhotoIdx(idx)}
                  style={{
                    width: idx === activePhotoIdx ? '16px' : '6px',
                    height: '6px',
                    borderRadius: '3px',
                    border: 'none',
                    background: idx === activePhotoIdx ? '#FFFFFF' : 'rgba(255, 255, 255, 0.5)',
                    cursor: 'pointer',
                    transition: 'all var(--transition-fast)'
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* RIGHT / BOTTOM: Profile Information Pane */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            overflowY: 'auto',
            background: 'var(--bg-warm-ivory)'
          }}
        >
          <div
            style={{
              padding: '28px',
              display: 'flex',
              flexDirection: 'column',
              gap: '20px',
              flex: 1
            }}
          >
            {/* Header: Name, Age, Vibe Score */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <h2
                    style={{
                      fontFamily: 'var(--font-serif)',
                      fontSize: '1.9rem',
                      fontWeight: 800,
                      color: 'var(--text-primary)',
                      letterSpacing: '-0.02em'
                    }}
                  >
                    {activeProfile.name}, {activeProfile.age}
                  </h2>
                  <CheckCircle2 size={20} color="var(--gold-champagne)" fill="rgba(212, 175, 55, 0.2)" />
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    color: 'var(--text-secondary)',
                    fontSize: '0.88rem',
                    marginTop: '4px'
                  }}
                >
                  <MapPin size={15} color="var(--rose-soft)" />
                  <span>{activeProfile.location}</span>
                  <span>•</span>
                  <span>{activeProfile.distanceKm} km away</span>
                </div>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  background: 'var(--bg-soft-blush)',
                  border: '1px solid var(--border-subtle)',
                  padding: '6px 14px',
                  borderRadius: 'var(--radius-pill)',
                  color: 'var(--berry-primary)',
                  fontWeight: 800,
                  fontSize: '0.85rem'
                }}
              >
                <Sparkles size={14} color="var(--gold-champagne)" fill="var(--gold-champagne)" />
                <span>{activeProfile.compatibility}% Match</span>
              </div>
            </div>

            {/* Verification Status Banner (60 Coins to Check / Unlock) */}
            <div
              style={{
                padding: '12px 16px',
                borderRadius: 'var(--radius-md)',
                background: unlockedVerificationIds.includes(activeProfile.id)
                  ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.12) 0%, rgba(5, 150, 105, 0.06) 100%)'
                  : 'linear-gradient(135deg, rgba(254, 240, 138, 0.35) 0%, rgba(254, 205, 211, 0.25) 100%)',
                border: unlockedVerificationIds.includes(activeProfile.id)
                  ? '1.5px solid rgba(16, 185, 129, 0.4)'
                  : '1.5px solid rgba(212, 175, 55, 0.35)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '10px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    background: unlockedVerificationIds.includes(activeProfile.id) ? '#10B981' : 'var(--gold-deep)',
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}
                >
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                    {unlockedVerificationIds.includes(activeProfile.id)
                      ? '100% Verified Profile • Government ID & Live Selfie Authenticated'
                      : 'Account Verification Status'}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                    {unlockedVerificationIds.includes(activeProfile.id)
                      ? 'Trust Score: 99% • Official Verified Match'
                      : 'Check if this account is verified using 60 MIORA Coins'}
                  </div>
                </div>
              </div>

              {!unlockedVerificationIds.includes(activeProfile.id) && (
                <button
                  onClick={() => verifyProfileWithCoins(activeProfile.id, activeProfile.name)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 16px',
                    borderRadius: 'var(--radius-pill)',
                    background: 'var(--primary-gradient)',
                    color: '#FFFFFF',
                    fontWeight: 800,
                    fontSize: '0.82rem',
                    border: 'none',
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(225, 29, 72, 0.25)',
                    transition: 'transform var(--transition-fast)'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.04)')}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                >
                  <Coins size={14} />
                  <span>Check Status (60 🪙)</span>
                </button>
              )}
            </div>

            {/* Profession & Education */}
            {(activeProfile.occupation || activeProfile.education) && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                {activeProfile.occupation && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    <Briefcase size={15} color="var(--berry-primary)" />
                    <span>{activeProfile.occupation}</span>
                  </div>
                )}
                {activeProfile.education && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    <GraduationCap size={15} color="var(--berry-primary)" />
                    <span>{activeProfile.education}</span>
                  </div>
                )}
              </div>
            )}

            {/* Bio */}
            <div className="card-white" style={{ padding: '18px 20px', borderRadius: 'var(--radius-md)' }}>
              <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '0.82rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px' }}>
                About Me
              </h4>
              <p style={{ fontSize: '0.94rem', color: 'var(--text-secondary)', lineHeight: 1.55 }}>
                {activeProfile.bio}
              </p>
            </div>

            {/* Vibe Mutual Chemistry Tags */}
            <div className="card-white" style={{ padding: '18px 20px', borderRadius: 'var(--radius-md)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px' }}>
                <Sparkles size={16} color="var(--gold-champagne)" fill="var(--gold-champagne)" />
                <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '0.88rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  Vibe & Mutual Chemistry
                </h4>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                {activeProfile.interests.map((interest) => (
                  <div
                    key={interest}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '8px 12px',
                      borderRadius: 'var(--radius-sm)',
                      background: 'var(--bg-soft-blush)',
                      border: '1px solid var(--border-subtle)'
                    }}
                  >
                    <span style={{ fontSize: '0.84rem', fontWeight: 600 }}>{interest}</span>
                    <span
                      style={{
                        width: '16px',
                        height: '16px',
                        borderRadius: '50%',
                        background: 'var(--berry-primary)',
                        color: '#FFFFFF',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <Check size={10} strokeWidth={3} />
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Lifestyle */}
            {activeProfile.lifestyle && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {activeProfile.height && <span className="pill pill-default" style={{ fontSize: '0.8rem' }}>📏 {activeProfile.height}</span>}
                {activeProfile.lifestyle.zodiac && <span className="pill pill-default" style={{ fontSize: '0.8rem' }}>✨ {activeProfile.lifestyle.zodiac}</span>}
                {activeProfile.lifestyle.workout && <span className="pill pill-default" style={{ fontSize: '0.8rem' }}>🏋️ {activeProfile.lifestyle.workout}</span>}
                {activeProfile.lifestyle.drinking && <span className="pill pill-default" style={{ fontSize: '0.8rem' }}>🍸 {activeProfile.lifestyle.drinking}</span>}
              </div>
            )}
            {/* Received Gifts Showcase */}
            <div style={{ marginTop: '14px', padding: '14px 18px', borderRadius: '18px', background: 'var(--surface-white)', border: '1px solid var(--border-subtle)' }}>
              <span style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--gold-deep)', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: '8px' }}>
                Received Virtual Gifts 🎁
              </span>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <span className="pill" style={{ background: 'var(--bg-soft-blush)', fontSize: '0.8rem', fontWeight: 800, color: 'var(--berry-primary)' }}>❤️ 24 Hearts</span>
                <span className="pill" style={{ background: 'var(--bg-soft-blush)', fontSize: '0.8rem', fontWeight: 800, color: 'var(--berry-primary)' }}>🌹 12 Roses</span>
                <span className="pill" style={{ background: 'var(--bg-soft-blush)', fontSize: '0.8rem', fontWeight: 800, color: 'var(--berry-primary)' }}>💎 3 Diamonds</span>
                <span className="pill" style={{ background: 'var(--bg-soft-blush)', fontSize: '0.8rem', fontWeight: 800, color: 'var(--berry-primary)' }}>👑 1 Crown</span>
              </div>
            </div>
          </div>

          {/* Social Interactions Bar (Audio, Video, Gift, Play) */}
          <div
            style={{
              padding: '12px 24px',
              background: 'var(--surface-white)',
              borderTop: '1px solid var(--border-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '8px'
            }}
          >
            <button
              onClick={() => {
                closeProfileDetail();
                startCall(activeProfile, 'audio');
              }}
              style={{
                flex: 1,
                padding: '9px 12px',
                borderRadius: 'var(--radius-pill)',
                border: '1.5px solid var(--border-subtle)',
                background: 'var(--bg-soft-blush)',
                color: 'var(--berry-primary)',
                fontWeight: 800,
                fontSize: '0.8rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '4px'
              }}
            >
              <span>📞 Call</span>
            </button>

            <button
              onClick={() => {
                closeProfileDetail();
                startCall(activeProfile, 'video');
              }}
              style={{
                flex: 1,
                padding: '9px 12px',
                borderRadius: 'var(--radius-pill)',
                border: '1.5px solid var(--border-subtle)',
                background: 'var(--bg-soft-blush)',
                color: 'var(--berry-primary)',
                fontWeight: 800,
                fontSize: '0.8rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '4px'
              }}
            >
              <span>📹 Video</span>
            </button>

            <button
              onClick={() => {
                openGiftModal(activeProfile);
              }}
              style={{
                flex: 1,
                padding: '9px 12px',
                borderRadius: 'var(--radius-pill)',
                border: '1.5px solid var(--border-gold)',
                background: 'var(--gold-gradient-subtle)',
                color: 'var(--gold-deep)',
                fontWeight: 800,
                fontSize: '0.8rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '4px'
              }}
            >
              <span>🎁 Gift</span>
            </button>

            <button
              onClick={() => {
                closeProfileDetail();
                startGameWithPartner(coupleGames[0], activeProfile);
              }}
              style={{
                flex: 1,
                padding: '9px 12px',
                borderRadius: 'var(--radius-pill)',
                border: '1.5px solid var(--border-subtle)',
                background: 'var(--bg-soft-blush)',
                color: 'var(--berry-primary)',
                fontWeight: 800,
                fontSize: '0.8rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '4px'
              }}
            >
              <span>🎮 Play</span>
            </button>
          </div>

          {/* Sticky Actions Bar (Pass, Superlike, Like) */}
          <div
            style={{
              padding: '12px 28px',
              background: 'rgba(255, 255, 255, 0.98)',
              borderTop: '1px solid var(--border-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '24px',
              position: 'sticky',
              bottom: 0,
              zIndex: 10
            }}
          >
            <button
              onClick={handlePassClick}
              aria-label="Pass"
              style={{
                width: '52px',
                height: '52px',
                borderRadius: '50%',
                background: '#FFFFFF',
                border: '1.5px solid var(--border-subtle)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#64748B',
                boxShadow: 'var(--shadow-sm)',
                cursor: 'pointer'
              }}
            >
              <X size={24} />
            </button>

            <button
              onClick={handleSuperLikeClick}
              aria-label="Super Like"
              style={{
                width: '46px',
                height: '46px',
                borderRadius: '50%',
                background: '#FFFFFF',
                border: '1.5px solid var(--border-gold)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--gold-champagne)',
                boxShadow: 'var(--shadow-gold-glow)',
                cursor: 'pointer'
              }}
            >
              <Star size={22} fill="var(--gold-champagne)" />
            </button>

            <button
              onClick={handleLikeClick}
              aria-label="Like"
              style={{
                width: '58px',
                height: '58px',
                borderRadius: '50%',
                background: 'var(--primary-gradient)',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFFFFF',
                boxShadow: 'var(--shadow-berry-glow)',
                cursor: 'pointer'
              }}
            >
              <Heart size={26} fill="#FFFFFF" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
