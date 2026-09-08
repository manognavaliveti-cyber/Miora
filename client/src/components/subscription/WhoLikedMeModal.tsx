import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  Heart,
  Crown,
  Sparkles,
  Lock,
  Star,
  Eye,
  MessageCircle,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { Button } from '../common/Button';

export const WhoLikedMeModal: React.FC = () => {
  const {
    isWhoLikedMeModalOpen,
    closeWhoLikedMeModal,
    whoLikedMeProfiles,
    currentUser,
    openUpgradeModal,
    unlockWhoLikedMeProfiles,
    handleLike,
    openProfileDetail
  } = useApp();

  if (!isWhoLikedMeModalOpen) return null;

  const isPremium = currentUser.isPremium;

  const handleInstantMatch = async (profileId: string) => {
    await handleLike(profileId, false);
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'rgba(15, 23, 42, 0.78)',
        backdropFilter: 'blur(12px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        animation: 'fadeIn 0.25s ease-out forwards',
        boxSizing: 'border-box'
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) closeWhoLikedMeModal();
      }}
    >
      <div
        style={{
          background: '#FFFFFF',
          width: '100%',
          maxWidth: '620px',
          maxHeight: '90vh',
          borderRadius: '28px',
          boxShadow: '0 25px 60px -15px rgba(136, 19, 55, 0.35)',
          overflowY: 'auto',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          boxSizing: 'border-box'
        }}
      >
        {/* Header Ribbon */}
        <div
          style={{
            background: 'linear-gradient(135deg, #4C0519 0%, #881337 50%, #BE123C 100%)',
            padding: '28px 24px 20px 24px',
            color: '#FFFFFF',
            position: 'relative',
            textAlign: 'center'
          }}
        >
          <button
            onClick={closeWhoLikedMeModal}
            aria-label="Close"
            style={{
              position: 'absolute',
              top: '16px',
              right: '16px',
              background: 'rgba(255, 255, 255, 0.2)',
              border: 'none',
              borderRadius: '50%',
              width: '34px',
              height: '34px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              cursor: 'pointer'
            }}
          >
            <X size={18} />
          </button>

          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #FDA4AF 0%, #E11D48 100%)',
              margin: '0 auto 10px auto',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 20px rgba(225, 29, 72, 0.5)',
              border: '2px solid #FFFFFF'
            }}
          >
            <Heart size={28} fill="#FFFFFF" color="#FFFFFF" />
          </div>

          <h2
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '1.75rem',
              fontWeight: 900,
              margin: '0 0 4px 0',
              color: '#FFFFFF'
            }}
          >
            Secret Admirers ({whoLikedMeProfiles.length})
          </h2>

          <p style={{ fontSize: '0.86rem', color: 'rgba(255, 255, 255, 0.88)', margin: 0 }}>
            {isPremium
              ? 'These incredible people liked you! Match with them directly with one tap.'
              : 'People who swiped right on your profile. Upgrade to Gold to reveal all.'}
          </p>
        </div>

        {/* Free Plan Upgrade & Coin Unlock Teaser */}
        {!isPremium && (
          <div
            style={{
              margin: '16px 20px 0 20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}
          >
            {/* VIP / Gold banner */}
            <div
              style={{
                background: 'linear-gradient(135deg, #FFF1F2 0%, #FEFCE8 100%)',
                border: '1.5px solid var(--border-gold)',
                borderRadius: '20px',
                padding: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '12px',
                flexWrap: 'wrap'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '50%',
                    background: 'var(--primary-gradient)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#FFFFFF',
                    flexShrink: 0
                  }}
                >
                  <Crown size={20} />
                </div>
                <div>
                  <div style={{ fontSize: '0.92rem', fontWeight: 900, color: 'var(--berry-primary)' }}>
                    Unlock All {whoLikedMeProfiles.length} Secret Admirers
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                    Get Gold (₹499/mo + 500 Coins) for unlimited unblurred admirers.
                  </div>
                </div>
              </div>

              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  closeWhoLikedMeModal();
                  openUpgradeModal();
                }}
                style={{
                  boxShadow: 'var(--shadow-berry-glow)',
                  fontWeight: 800,
                  fontSize: '0.82rem'
                }}
              >
                <Sparkles size={14} /> Get Gold Plan
              </Button>
            </div>

            {/* Instant Coin Unlock Cards */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.95)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '18px',
                padding: '12px 14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '10px',
                flexWrap: 'wrap'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Zap size={16} color="var(--gold-deep)" />
                <span style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  Or Unlock with Coins:
                </span>
              </div>

              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <button
                  onClick={() => unlockWhoLikedMeProfiles(10, 100)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: 'var(--radius-pill)',
                    border: '1.5px solid var(--border-gold)',
                    background: '#FFFDF0',
                    color: 'var(--gold-deep)',
                    fontSize: '0.76rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    boxShadow: '0 2px 6px rgba(202, 138, 4, 0.15)',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <Eye size={12} /> Unlock 10 (100 🪙)
                </button>

                <button
                  onClick={() => unlockWhoLikedMeProfiles(50, 350)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: 'var(--radius-pill)',
                    border: '1.5px solid var(--berry-primary)',
                    background: 'var(--primary-gradient)',
                    color: '#FFFFFF',
                    fontSize: '0.76rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    boxShadow: 'var(--shadow-berry-glow)',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <Star size={12} fill="#FFFFFF" /> Unlock 50 (350 🪙 • Save 30%)
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Profiles Grid */}
        <div
          style={{
            padding: '20px',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
            gap: '14px'
          }}
        >
          {whoLikedMeProfiles.map((item) => {
            const profile = item.profile;
            const photo = profile.photos[0] || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&q=80';

            return (
              <div
                key={item.id}
                style={{
                  borderRadius: '20px',
                  overflow: 'hidden',
                  background: '#0F172A',
                  position: 'relative',
                  aspectRatio: '3/4',
                  boxShadow: 'var(--shadow-md)',
                  border: item.isSuperLike ? '2px solid #EAB308' : '1px solid var(--border-subtle)',
                  cursor: isPremium ? 'pointer' : 'default'
                }}
                onClick={() => {
                  if (isPremium) openProfileDetail(profile);
                }}
              >
                {/* Image */}
                <img
                  src={photo}
                  alt={profile.name}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    filter: isPremium ? 'none' : 'blur(16px) brightness(0.75)',
                    transform: isPremium ? 'scale(1)' : 'scale(1.15)',
                    transition: 'all 0.3s ease'
                  }}
                />

                {/* Dark Gradient Overlay */}
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.85) 100%)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    padding: '12px'
                  }}
                >
                  {/* Top Badges */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    {item.isSuperLike ? (
                      <span
                        style={{
                          background: 'linear-gradient(135deg, #CA8A04, #EAB308)',
                          color: '#FFFFFF',
                          fontSize: '0.65rem',
                          fontWeight: 900,
                          padding: '2px 8px',
                          borderRadius: 'var(--radius-pill)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '3px',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
                        }}
                      >
                        <Star size={10} fill="#FFFFFF" /> SUPER LIKE
                      </span>
                    ) : (
                      <span
                        style={{
                          background: 'rgba(225, 29, 72, 0.85)',
                          color: '#FFFFFF',
                          fontSize: '0.65rem',
                          fontWeight: 800,
                          padding: '2px 8px',
                          borderRadius: 'var(--radius-pill)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '3px'
                        }}
                      >
                        <Heart size={10} fill="#FFFFFF" /> LIKED YOU
                      </span>
                    )}

                    <span
                      style={{
                        background: 'rgba(255, 255, 255, 0.25)',
                        backdropFilter: 'blur(4px)',
                        color: '#FFFFFF',
                        fontSize: '0.68rem',
                        fontWeight: 800,
                        padding: '2px 6px',
                        borderRadius: 'var(--radius-pill)'
                      }}
                    >
                      {item.matchScore}%
                    </span>
                  </div>

                  {/* Lock Overlay for Free Users */}
                  {!isPremium ? (
                    <div
                      style={{
                        textAlign: 'center',
                        color: '#FFFFFF',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      <div
                        style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: '50%',
                          background: 'rgba(255, 255, 255, 0.2)',
                          backdropFilter: 'blur(8px)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        <Lock size={18} color="#FFFFFF" />
                      </div>
                      <div style={{ fontSize: '0.82rem', fontWeight: 800 }}>
                        Secret Admirer
                      </div>
                      <div style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.7)' }}>
                        {item.likedAt}
                      </div>
                    </div>
                  ) : (
                    /* Unlocked View for VIP */
                    <div style={{ color: '#FFFFFF' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <span style={{ fontSize: '0.98rem', fontWeight: 900 }}>
                          {profile.name}, {profile.age}
                        </span>
                        {profile.verified && <ShieldCheck size={14} color="#38BDF8" />}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.8)', marginTop: '2px' }}>
                        {profile.occupation || profile.location}
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleInstantMatch(profile.id);
                        }}
                        style={{
                          marginTop: '8px',
                          width: '100%',
                          background: 'var(--primary-gradient)',
                          border: 'none',
                          color: '#FFFFFF',
                          padding: '6px',
                          borderRadius: 'var(--radius-pill)',
                          fontSize: '0.75rem',
                          fontWeight: 900,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '4px',
                          boxShadow: '0 4px 12px rgba(136, 19, 55, 0.4)'
                        }}
                      >
                        <Heart size={12} fill="#FFFFFF" /> Match Back
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
