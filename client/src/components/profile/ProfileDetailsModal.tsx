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
  Coins,
  MessageCircle as MessageCircleIcon
} from 'lucide-react';

import { VerifiedBadge } from '../common/VerifiedBadge';

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
    startDirectMessage,
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
          height: '100%',
          maxHeight: '100%',
          background: 'var(--bg-warm-ivory)',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          overflowY: 'auto',
          WebkitOverflowScrolling: 'touch'
        }}
        className="profile-modal-responsive"
      >
        <style>{`
          .profile-modal-info {
            overflow-y: visible !important;
            flex: 1;
            display: flex;
            flex-direction: column;
            background: var(--bg-warm-ivory);
          }
          @media (min-width: 1024px) {
            .profile-modal-responsive {
              height: 640px !important;
              max-height: 640px !important;
              border-radius: 32px !important;
              display: grid !important;
              grid-template-columns: 1.05fr 1fr !important;
              box-shadow: var(--shadow-float) !important;
              border: 1px solid var(--border-subtle) !important;
              overflow: hidden !important;
            }
            .profile-modal-gallery {
              height: 100% !important;
            }
            .profile-modal-info {
              overflow-y: auto !important;
            }
          }
        `}</style>

        {/* LEFT / TOP: Photo Gallery */}
        <div
          className="profile-modal-gallery"
          style={{
            position: 'relative',
            width: '100%',
            height: 'clamp(320px, 48vh, 460px)',
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
          className="profile-modal-info"
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            background: 'var(--bg-warm-ivory)',
            paddingBottom: '96px'
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
                      letterSpacing: '-0.02em',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <span>{activeProfile.name}, {activeProfile.age}</span>
                    {(activeProfile.verified || activeProfile.isVerified) && <VerifiedBadge size={22} />}
                  </h2>
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
                      ? (activeProfile.verified
                          ? '100% Verified Profile • Government ID & Live Selfie Authenticated'
                          : 'Unverified Account • Verification check completed')
                      : 'Account Verification Status (Locked)'}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                    {unlockedVerificationIds.includes(activeProfile.id)
                      ? (activeProfile.verified
                          ? 'Trust Score: 99% • Official Verified Match'
                          : 'Trust Score: 50% • Caution advised')
                      : 'Pay ₹60 from Wallet to verify if this account is authentic'}
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
                  <ShieldCheck size={14} />
                  <span>Check Status (₹60)</span>
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

            {/* Mutual Interests & Chemistry Highlights */}
            {(() => {
              const myInterests = currentUser.interests || [];
              const shared = activeProfile.interests.filter((i) => myInterests.includes(i));
              return (
                <div className="card-white" style={{ padding: '18px 20px', borderRadius: 'var(--radius-md)' }}>
                  {shared.length > 0 && (
                    <div style={{ marginBottom: '14px', background: '#FBEDEF', border: '1px solid #F4C5CF', padding: '10px 14px', borderRadius: '14px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', fontWeight: 800, color: '#7D1730', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                        <Sparkles size={14} color="#A91E45" fill="#A91E45" /> You both share ({shared.length})
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '6px' }}>
                        {shared.map((item) => (
                          <span key={item} style={{ background: '#A91E45', color: '#FFFFFF', padding: '4px 10px', borderRadius: '9999px', fontSize: '0.78rem', fontWeight: 800 }}>
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px' }}>
                    <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '0.88rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                      Interests & Passions
                    </h4>
                  </div>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {activeProfile.interests.map((interest) => {
                      const isMutual = myInterests.includes(interest);
                      return (
                        <div
                          key={interest}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '6px 14px',
                            borderRadius: '9999px',
                            background: isMutual ? '#FBEDEF' : '#FFFFFF',
                            border: isMutual ? '1.5px solid #A91E45' : '1px solid #E2E8F0',
                            color: isMutual ? '#7D1730' : '#334155',
                            fontSize: '0.82rem',
                            fontWeight: 700
                          }}
                        >
                          <span>{interest}</span>
                          {isMutual && <Check size={12} color="#A91E45" strokeWidth={3} />}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })()}

            {/* Lifestyle */}
            {activeProfile.lifestyle && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {activeProfile.height && <span className="pill pill-default" style={{ fontSize: '0.8rem' }}>📏 {activeProfile.height}</span>}
                {activeProfile.lifestyle.zodiac && <span className="pill pill-default" style={{ fontSize: '0.8rem' }}>✨ {activeProfile.lifestyle.zodiac}</span>}
                {activeProfile.lifestyle.workout && <span className="pill pill-default" style={{ fontSize: '0.8rem' }}>🏋️ {activeProfile.lifestyle.workout}</span>}
                {activeProfile.lifestyle.drinking && <span className="pill pill-default" style={{ fontSize: '0.8rem' }}>🍸 {activeProfile.lifestyle.drinking}</span>}
              </div>
            )}

            {/* Real, genuinely registered people can be messaged directly —
                no swipe/match gate needed, like messaging a friend. */}
            {activeProfile.isRealUser && (
              <button
                onClick={() => {
                  closeProfileDetail();
                  startDirectMessage(activeProfile);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  width: '100%',
                  padding: '14px 20px',
                  borderRadius: 'var(--radius-pill)',
                  background: 'var(--primary-gradient)',
                  color: '#FFFFFF',
                  fontWeight: 800,
                  fontSize: '0.95rem',
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: 'var(--shadow-berry-glow)'
                }}
              >
                <MessageCircleIcon size={18} />
                <span>Message {activeProfile.name}</span>
              </button>
            )}

          </div>




        </div>
      </div>
    </div>
  );
};
