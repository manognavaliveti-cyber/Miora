import React, { useState, useRef, useEffect } from 'react';
import { Profile } from '../../types';
import {
  Heart, X, Sparkles, MapPin, Briefcase, GraduationCap,
  Check, MessageCircle, Ruler, Wine, Cigarette, Dumbbell,
  Star, Target, ChevronDown, ChevronLeft, ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { VerifiedBadge } from '../common/VerifiedBadge';
import { calculateCompatibilityScore, calculateAgeFromDob } from '../../utils/profileUtils';
import { useApp } from '../../context/AppContext';

interface EditorialProfileViewProps {
  profile: Profile;
  onSwipe: (direction: 'left' | 'right' | 'up') => void;
  onOpenDetails?: () => void;
  onMessage?: () => void;
  isTopCard?: boolean;
  stackIndex?: number;
  exitDirection?: 'left' | 'right' | 'up' | null;
  isModalView?: boolean;
  onClose?: () => void;
}

export const EditorialProfileView: React.FC<EditorialProfileViewProps> = ({
  profile,
  onSwipe,
  onMessage,
  isTopCard = true,
  exitDirection = null,
  isModalView = false,
  onClose
}) => {
  const { currentUser, verifyProfileWithCoins, unlockedVerificationIds } = useApp();
  const [photoIndex, setPhotoIndex] = useState(0);
  const [scrollY, setScrollY] = useState(0);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const startPos = useRef({ x: 0, y: 0 });
  const dragLockedRef = useRef<'swipe' | 'scroll' | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const photos = profile.photos && profile.photos.length > 0
    ? profile.photos
    : ['https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80'];
  const totalPhotos = photos.length;

  const comp = calculateCompatibilityScore(currentUser, profile);
  const myInterests = currentUser?.interests || [];
  const sharedInterests = (profile.interests || []).filter((i) => myInterests.includes(i));
  const otherInterests = (profile.interests || []).filter((i) => !myInterests.includes(i));
  const isUnlocked = unlockedVerificationIds?.includes(profile.id);

  const calcAge = calculateAgeFromDob(
    (profile as any).dob || (profile as any).dateOfBirth
  ) || (profile.age > 0 ? profile.age : null);

  const city = (profile.location || '').split(',')[0].trim();

  // Reset scroll and photo index when profile changes
  useEffect(() => {
    setPhotoIndex(0);
    setScrollY(0);
    setDragOffset({ x: 0, y: 0 });
    setIsDragging(false);
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0;
    }
  }, [profile.id]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setScrollY(e.currentTarget.scrollTop);
  };

  const handleNextPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPhotoIndex((prev) => (prev + 1) % totalPhotos);
  };

  const handlePrevPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPhotoIndex((prev) => (prev - 1 + totalPhotos) % totalPhotos);
  };

  // 2D Diagonal Card Drag Handlers
  const handleCardTouchStart = (e: React.TouchEvent) => {
    if (!isTopCard || isModalView) return;
    setIsDragging(true);
    dragLockedRef.current = null;
    startPos.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };

  const handleCardTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || !isTopCard || isModalView) return;
    const dx = e.touches[0].clientX - startPos.current.x;
    const dy = e.touches[0].clientY - startPos.current.y;

    if (!dragLockedRef.current) {
      if (Math.abs(dx) > 8 || Math.abs(dy) > 14) {
        if (Math.abs(dx) > Math.abs(dy) * 0.7) {
          dragLockedRef.current = 'swipe';
        } else if (dy > 15 && scrollY === 0) {
          // downward drag when at top
          dragLockedRef.current = 'swipe';
        } else {
          dragLockedRef.current = 'scroll';
          setIsDragging(false);
          return;
        }
      }
    }

    if (dragLockedRef.current === 'swipe') {
      setDragOffset({ x: dx, y: dy * 0.75 });
    }
  };

  const handleCardTouchEnd = () => {
    if (!isDragging || !isTopCard || isModalView) return;
    setIsDragging(false);

    if (dragOffset.x > 95) {
      onSwipe('right');
    } else if (dragOffset.x < -95) {
      onSwipe('left');
    } else if (dragOffset.y < -110) {
      onSwipe('up');
    }
    setDragOffset({ x: 0, y: 0 });
    dragLockedRef.current = null;
  };

  const handleCardMouseDown = (e: React.MouseEvent) => {
    if (!isTopCard || isModalView) return;
    if ((e.target as HTMLElement).closest('button')) return;
    setIsDragging(true);
    dragLockedRef.current = null;
    startPos.current = { x: e.clientX, y: e.clientY };
  };

  const handleCardMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !isTopCard || isModalView) return;
    const dx = e.clientX - startPos.current.x;
    const dy = e.clientY - startPos.current.y;

    if (!dragLockedRef.current) {
      if (Math.abs(dx) > 6 || Math.abs(dy) > 10) {
        dragLockedRef.current = 'swipe';
      }
    }

    if (dragLockedRef.current === 'swipe') {
      setDragOffset({ x: dx, y: dy * 0.75 });
    }
  };

  const handleCardMouseUp = () => {
    if (!isDragging || !isTopCard || isModalView) return;
    setIsDragging(false);

    if (dragOffset.x > 95) {
      onSwipe('right');
    } else if (dragOffset.x < -95) {
      onSwipe('left');
    } else if (dragOffset.y < -110) {
      onSwipe('up');
    }
    setDragOffset({ x: 0, y: 0 });
    dragLockedRef.current = null;
  };

  // Scroll Interpolation Values - smooth gradual transition
  const scrollProgress = Math.min(1, Math.max(0, scrollY / 180));
  const isExiting = isTopCard && !!exitDirection;
  const rotation = isTopCard ? dragOffset.x * 0.08 : 0;

  // Diagonal exit animation matching natural swipe physics
  let cardTransform = `translate3d(${dragOffset.x}px, ${dragOffset.y}px, 0) rotate(${rotation}deg)`;
  let opacityVal = 1;

  if (isExiting) {
    if (exitDirection === 'right') {
      cardTransform = 'translate3d(160%, -40px, 0) rotate(22deg)';
    } else if (exitDirection === 'left') {
      cardTransform = 'translate3d(-160%, -40px, 0) rotate(-22deg)';
    } else {
      cardTransform = 'translate3d(0, -140%, 0) scale(0.92)';
    }
    opacityVal = 0;
  }

  return (
    <div
      className="editorial-profile-root"
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden',
        background: '#FFFFFF',
        userSelect: 'none'
      }}
    >
      <style>{`
        .editorial-profile-root {
          --editorial-max-w: 560px;
        }

        .editorial-scroll-container {
          flex: 1;
          width: 100%;
          height: 100%;
          overflow-y: auto;
          overflow-x: hidden;
          -webkit-overflow-scrolling: touch;
          scroll-behavior: smooth;
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .editorial-scroll-container::-webkit-scrollbar {
          width: 5px;
        }
        .editorial-scroll-container::-webkit-scrollbar-thumb {
          background: rgba(190, 18, 60, 0.22);
          border-radius: 9999px;
        }

        /* ─── Hero Section: STRICTLY fits within initial viewport with smooth scaling ─── */
        .editorial-hero-viewport {
          width: 100%;
          max-width: var(--editorial-max-w);
          min-height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: space-evenly;
          align-items: center;
          padding: 8px 16px 12px 16px;
          box-sizing: border-box;
          flex-shrink: 0;
        }

        /* ─── Straight, clean profile card with locked portrait aspect ratio ─── */
        .editorial-card-frame {
          height: clamp(170px, calc(100vh - 290px), 340px);
          aspect-ratio: 3 / 4;
          width: auto;
          max-width: 90vw;
          border-radius: 24px;
          position: relative;
          overflow: hidden;
          background: #180D12;
          box-shadow: 0 14px 40px rgba(139, 30, 63, 0.14), 0 4px 14px rgba(0, 0, 0, 0.06);
          border: 1px solid rgba(244, 63, 94, 0.14);
          cursor: grab;
          touch-action: pan-y;
          flex-shrink: 0;
          margin: 0 auto;
          transition: transform 0.15s ease-out;
        }
        .editorial-card-frame:active {
          cursor: grabbing;
        }

        /* ─── Large Name & Typography Block with Smooth Gradual Scale Transition ─── */
        .editorial-identity-block {
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          margin-top: 2px;
          margin-bottom: 1px;
          will-change: transform, opacity;
          transform-origin: center center;
          transition: transform 0.12s cubic-bezier(0.2, 0, 0, 1), opacity 0.12s linear;
        }

        .editorial-name-title {
          font-family: var(--font-primary);
          font-size: clamp(1.25rem, 2.7vh, 1.85rem);
          font-weight: 900;
          line-height: 1.1;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          color: #1F161A;
          margin: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          background: linear-gradient(135deg, #24050E 0%, #4D091A 45%, #8B1E3F 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .editorial-meta-sub {
          font-size: clamp(0.7rem, 1.5vh, 0.82rem);
          font-weight: 800;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #8B1E3F;
          margin-top: 2px;
          line-height: 1.2;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
        }

        .editorial-occ-sub {
          font-size: clamp(0.64rem, 1.3vh, 0.74rem);
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #7A5565;
          margin-top: 1px;
          line-height: 1.2;
        }

        /* ─── Primary Action Buttons Dock with Smooth Gradual Scale Transition ─── */
        .editorial-actions-dock {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: clamp(10px, 2.8vw, 18px);
          width: 100%;
          margin-top: 2px;
          margin-bottom: 2px;
          will-change: transform, opacity;
          transform-origin: center center;
          transition: transform 0.12s cubic-bezier(0.2, 0, 0, 1), opacity 0.12s linear;
        }

        .editorial-btn-pass {
          width: clamp(44px, 10vw, 52px);
          height: clamp(44px, 10vw, 52px);
          border-radius: 50%;
          background: #FFFFFF;
          border: 1.5px solid rgba(225, 29, 72, 0.22);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #E11D48;
          cursor: pointer;
          box-shadow: 0 4px 16px rgba(225, 29, 72, 0.12);
          transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), background 0.2s ease, box-shadow 0.2s ease;
        }
        .editorial-btn-pass:hover {
          transform: scale(1.08);
          background: #FFF1F4;
          box-shadow: 0 6px 22px rgba(225, 29, 72, 0.22);
        }
        .editorial-btn-pass:active {
          transform: scale(0.94);
        }

        .editorial-btn-like {
          width: clamp(54px, 12.5vw, 64px);
          height: clamp(54px, 12.5vw, 64px);
          border-radius: 50%;
          background: linear-gradient(135deg, #881337 0%, #E11D48 100%);
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #FFFFFF;
          cursor: pointer;
          box-shadow: 0 8px 26px rgba(190, 18, 60, 0.38);
          transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.2s ease;
        }
        .editorial-btn-like:hover {
          transform: scale(1.08);
          box-shadow: 0 12px 32px rgba(190, 18, 60, 0.52);
        }
        .editorial-btn-like:active {
          transform: scale(0.94);
        }

        .editorial-btn-super {
          width: clamp(44px, 10vw, 52px);
          height: clamp(44px, 10vw, 52px);
          border-radius: 50%;
          background: #FFFFFF;
          border: 1.5px solid rgba(212, 175, 55, 0.35);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #B89230;
          cursor: pointer;
          box-shadow: 0 4px 16px rgba(212, 175, 55, 0.16);
          transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), background 0.2s ease;
        }
        .editorial-btn-super:hover {
          transform: scale(1.08);
          background: #FFFDF5;
        }
        .editorial-btn-super:active {
          transform: scale(0.94);
        }

        .editorial-btn-msg {
          width: clamp(44px, 10vw, 52px);
          height: clamp(44px, 10vw, 52px);
          border-radius: 50%;
          background: #FFFFFF;
          border: 1.5px solid rgba(139, 30, 63, 0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #8B1E3F;
          cursor: pointer;
          box-shadow: 0 4px 16px rgba(139, 30, 63, 0.1);
          transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), background 0.2s ease;
        }
        .editorial-btn-msg:hover {
          transform: scale(1.08);
          background: #FFF5F7;
        }
        .editorial-btn-msg:active {
          transform: scale(0.94);
        }

        /* ─── Sticky Transformed Header Bar ─── */
        .editorial-sticky-header {
          position: sticky;
          top: 0;
          left: 0;
          right: 0;
          width: 100%;
          max-width: var(--editorial-max-w);
          z-index: 40;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border-bottom: 1px solid rgba(244, 63, 94, 0.12);
          box-shadow: 0 4px 16px rgba(139, 30, 63, 0.05);
          padding: 8px 16px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          box-sizing: border-box;
          transition: opacity 0.15s ease, transform 0.15s ease;
          margin: 0 auto;
        }

        /* ─── Editorial Details Stream Below Hero ─── */
        .editorial-details-stream {
          width: 100%;
          max-width: var(--editorial-max-w);
          display: flex;
          flex-direction: column;
          gap: 16px;
          padding: 20px 16px 60px 16px;
          box-sizing: border-box;
        }

        .editorial-section-card {
          background: #FFFFFF;
          border-radius: 22px;
          border: 1px solid rgba(244, 63, 94, 0.12);
          box-shadow: 0 8px 24px rgba(139, 30, 63, 0.05);
          padding: 18px;
          box-sizing: border-box;
        }

        .editorial-section-title {
          font-size: 0.72rem;
          font-weight: 800;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #8B1E3F;
          margin-bottom: 10px;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .editorial-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 13px;
          border-radius: 9999px;
          font-size: 0.76rem;
          font-weight: 600;
          color: #5C2E3E;
          background: #FFF5F7;
          border: 1px solid rgba(139, 30, 63, 0.12);
          transition: all 0.18s ease;
        }

        .editorial-pill-mutual {
          background: linear-gradient(135deg, #881337 0%, #C52E59 100%);
          color: #FFFFFF;
          border: 1.5px solid transparent;
          font-weight: 700;
          box-shadow: 0 3px 12px rgba(139, 30, 63, 0.22);
        }

        .editorial-photo-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 10px;
          width: 100%;
        }

        .editorial-photo-item {
          width: 100%;
          height: 200px;
          border-radius: 16px;
          object-fit: cover;
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.08);
          border: 1px solid rgba(244, 63, 94, 0.1);
          background: #FAF5F7;
        }
      `}</style>

      {/* ─── Sticky Transformed Header (appears smoothly as user scrolls down) ─── */}
      <div
        className="editorial-sticky-header"
        style={{
          opacity: scrollProgress,
          transform: `translateY(${Math.max(-12, (1 - scrollProgress) * -12)}px)`,
          pointerEvents: scrollProgress > 0.35 ? 'auto' : 'none'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <img
            src={photos[0]}
            alt={profile.name}
            style={{
              width: 34,
              height: 34,
              borderRadius: '50%',
              objectFit: 'cover',
              border: '1.5px solid #E11D48'
            }}
          />
          <div>
            <div style={{
              fontSize: '0.92rem',
              fontWeight: 800,
              color: '#1F161A',
              letterSpacing: '-0.01em',
              display: 'flex',
              alignItems: 'center',
              gap: 5
            }}>
              <span>{profile.name}</span>
              {calcAge ? <span style={{ color: '#8B1E3F' }}>, {calcAge}</span> : null}
              {(profile.verified || profile.isVerified) && <VerifiedBadge size={15} />}
            </div>
            {city && (
              <div style={{ fontSize: '0.7rem', color: '#7A5565', fontWeight: 600, textTransform: 'uppercase' }}>
                {city} {profile.occupation ? `· ${profile.occupation}` : ''}
              </div>
            )}
          </div>
        </div>

        {/* Quick actions inside sticky top bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {isModalView && onClose && (
            <button
              onClick={onClose}
              style={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                background: '#FFF5F7',
                border: '1px solid rgba(139, 30, 63, 0.15)',
                color: '#8B1E3F',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              <X size={15} />
            </button>
          )}

          <button
            onClick={() => onSwipe('left')}
            style={{
              width: 34,
              height: 34,
              borderRadius: '50%',
              background: '#FFFFFF',
              border: '1.5px solid rgba(225, 29, 72, 0.25)',
              color: '#E11D48',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            <X size={16} strokeWidth={2.5} />
          </button>

          <button
            onClick={() => onSwipe('right')}
            style={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #881337 0%, #E11D48 100%)',
              border: 'none',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '0 3px 12px rgba(190, 18, 60, 0.35)'
            }}
          >
            <Heart size={16} fill="#FFFFFF" color="#FFFFFF" />
          </button>
        </div>
      </div>

      {/* ─── Scroll Container ─── */}
      <div
        className="editorial-scroll-container"
        ref={scrollContainerRef}
        onScroll={handleScroll}
      >
        {/* ─── 1. INITIAL VIEWPORT (CARD + NAME + BASICS + ACTIONS) ─── */}
        <div className="editorial-hero-viewport">
          {/* Straight Profile Card with 2D Diagonal Drag Transform */}
          <div
            className="editorial-card-frame"
            style={{
              transform: cardTransform,
              opacity: opacityVal,
              transition: isDragging
                ? 'none'
                : isExiting
                ? 'transform 0.35s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.35s ease'
                : 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.25s ease'
            }}
            onTouchStart={handleCardTouchStart}
            onTouchMove={handleCardTouchMove}
            onTouchEnd={handleCardTouchEnd}
            onMouseDown={handleCardMouseDown}
            onMouseMove={handleCardMouseMove}
            onMouseUp={handleCardMouseUp}
            onMouseLeave={handleCardMouseUp}
          >
            <img
              src={photos[photoIndex]}
              alt={profile.name}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                pointerEvents: 'none',
                display: 'block'
              }}
            />

            {/* Top gradient scrim for photo dots */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: 50,
              background: 'linear-gradient(to bottom, rgba(0, 0, 0, 0.45) 0%, transparent 100%)',
              pointerEvents: 'none'
            }} />

            {/* Photo Progress Indicators */}
            {totalPhotos > 1 && (
              <div style={{
                position: 'absolute',
                top: 10,
                left: 12,
                right: 12,
                display: 'flex',
                gap: 4,
                zIndex: 6,
                pointerEvents: 'none'
              }}>
                {photos.map((_, idx) => (
                  <div
                    key={idx}
                    style={{
                      flex: 1,
                      height: 3,
                      borderRadius: 2,
                      background: idx === photoIndex ? '#FFFFFF' : 'rgba(255, 255, 255, 0.4)',
                      boxShadow: idx === photoIndex ? '0 0 6px rgba(255, 255, 255, 0.6)' : 'none',
                      transition: 'all 0.2s ease'
                    }}
                  />
                ))}
              </div>
            )}

            {/* Tap Zones for Cycling Photos */}
            {totalPhotos > 1 && (
              <>
                <div
                  onClick={handlePrevPhoto}
                  style={{
                    position: 'absolute',
                    top: 25,
                    left: 0,
                    width: '38%',
                    bottom: 25,
                    zIndex: 4,
                    cursor: 'pointer'
                  }}
                  title="Previous photo"
                />
                <div
                  onClick={handleNextPhoto}
                  style={{
                    position: 'absolute',
                    top: 25,
                    right: 0,
                    width: '38%',
                    bottom: 25,
                    zIndex: 4,
                    cursor: 'pointer'
                  }}
                  title="Next photo"
                />
              </>
            )}

            {/* Top right: Vibe Match badge */}
            <div style={{
              position: 'absolute',
              top: 16,
              right: 10,
              zIndex: 7,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
              padding: '3px 9px',
              borderRadius: 9999,
              background: 'rgba(0, 0, 0, 0.45)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              color: '#FFFFFF',
              fontSize: '0.7rem',
              fontWeight: 800,
              letterSpacing: '0.04em'
            }}>
              <Sparkles size={11} color="#FFD6E8" fill="#FFD6E8" />
              <span>{comp.isIncomplete ? 'Incomplete' : `${comp.score}% Vibe`}</span>
            </div>

            {/* Close button if in Modal View */}
            {isModalView && onClose && (
              <button
                onClick={onClose}
                style={{
                  position: 'absolute',
                  top: 12,
                  left: 10,
                  zIndex: 8,
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  background: 'rgba(0, 0, 0, 0.45)',
                  backdropFilter: 'blur(12px)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
              >
                <X size={16} />
              </button>
            )}

            {/* Bottom Scrim with online status */}
            {profile.online && (
              <div style={{
                position: 'absolute',
                bottom: 10,
                left: 12,
                zIndex: 6,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 5,
                padding: '3px 8px',
                borderRadius: 9999,
                background: 'rgba(0, 0, 0, 0.45)',
                backdropFilter: 'blur(8px)',
                color: '#6EE7B7',
                fontSize: '0.68rem',
                fontWeight: 700
              }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#34D399' }} />
                <span>Online</span>
              </div>
            )}
          </div>

          {/* ─── Name as Large Typography Element with gradual scale reduction ─── */}
          <div
            className="editorial-identity-block"
            style={{
              opacity: Math.max(0, 1 - scrollProgress * 1.25),
              transform: `scale(${Math.max(0.85, 1 - scrollProgress * 0.15)}) translateY(-${scrollProgress * 10}px)`
            }}
          >
            {/* Person's Name */}
            <h1 className="editorial-name-title">
              <span>{profile.name}</span>
              {(profile.verified || profile.isVerified) && (
                <VerifiedBadge size={20} />
              )}
            </h1>

            {/* Age & City */}
            <div className="editorial-meta-sub">
              {calcAge ? <span>{calcAge}</span> : null}
              {calcAge && city ? <span>·</span> : null}
              {city ? <span>{city}</span> : null}
              {profile.distanceKm !== undefined && (
                <span style={{ color: '#A0687A', fontWeight: 600 }}>· {profile.distanceKm} KM</span>
              )}
            </div>

            {/* Occupation / Profession */}
            {profile.occupation && (
              <div className="editorial-occ-sub">
                {profile.occupation}
              </div>
            )}
          </div>

          {/* ─── Primary Action Buttons with gradual scale reduction ─── */}
          <div
            className="editorial-actions-dock"
            style={{
              opacity: Math.max(0, 1 - scrollProgress * 1.25),
              transform: `scale(${Math.max(0.82, 1 - scrollProgress * 0.18)}) translateY(-${scrollProgress * 8}px)`
            }}
          >
            {/* Pass */}
            <button
              onClick={() => onSwipe('left')}
              className="editorial-btn-pass"
              title="Pass"
              aria-label="Pass"
            >
              <X size={20} strokeWidth={2.5} />
            </button>

            {/* Like */}
            <button
              onClick={() => onSwipe('right')}
              className="editorial-btn-like"
              title="Like"
              aria-label="Like"
            >
              <Heart size={26} fill="#FFFFFF" color="#FFFFFF" />
            </button>

            {/* Superlike */}
            <button
              onClick={() => onSwipe('up')}
              className="editorial-btn-super"
              title="Super Like"
              aria-label="Super Like"
            >
              <Sparkles size={18} fill="#B89230" color="#B89230" />
            </button>

            {/* Direct Message (if real user) */}
            {profile.isRealUser && onMessage && (
              <button
                onClick={onMessage}
                className="editorial-btn-msg"
                title="Send message"
                aria-label="Send message"
              >
                <MessageCircle size={18} />
              </button>
            )}
          </div>
        </div>

        {/* ─── 2. PROGRESSIVE PROFILE DETAILS STREAM ─── */}
        <div className="editorial-details-stream">
          {/* About / Bio Section */}
          {profile.bio && (
            <div className="editorial-section-card">
              <div className="editorial-section-title">
                <Sparkles size={13} />
                <span>About {profile.name}</span>
              </div>
              <p style={{
                margin: 0,
                fontSize: '0.9rem',
                color: '#2A171F',
                lineHeight: 1.65,
                fontFamily: 'var(--font-primary)'
              }}>
                {profile.bio}
              </p>
            </div>
          )}

          {/* Shared Interests */}
          {sharedInterests.length > 0 && (
            <div className="editorial-section-card">
              <div className="editorial-section-title">
                <Check size={13} strokeWidth={3} />
                <span>You Both Love ({sharedInterests.length})</span>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
                {sharedInterests.map((interest) => (
                  <span key={interest} className="editorial-pill editorial-pill-mutual">
                    <span>{interest}</span>
                    <Check size={10} strokeWidth={3} />
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* All Interests */}
          {otherInterests.length > 0 && (
            <div className="editorial-section-card">
              <div className="editorial-section-title">
                <Star size={13} />
                <span>Interests & Passions</span>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
                {otherInterests.map((interest) => (
                  <span key={interest} className="editorial-pill">
                    <span>{interest}</span>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Lifestyle & Basics */}
          {(profile.lifestyle || profile.height || profile.education || profile.relationshipIntent) && (
            <div className="editorial-section-card">
              <div className="editorial-section-title">
                <Target size={13} />
                <span>Lifestyle & Essentials</span>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
                {profile.height && (
                  <span className="editorial-pill">
                    <Ruler size={12} color="#8B1E3F" />
                    <span>{profile.height}</span>
                  </span>
                )}
                {profile.lifestyle?.zodiac && (
                  <span className="editorial-pill">
                    <Star size={12} color="#8B1E3F" />
                    <span>{profile.lifestyle.zodiac}</span>
                  </span>
                )}
                {profile.relationshipIntent && (
                  <span className="editorial-pill">
                    <Target size={12} color="#8B1E3F" />
                    <span>Looking for: {profile.relationshipIntent}</span>
                  </span>
                )}
                {profile.education && (
                  <span className="editorial-pill">
                    <GraduationCap size={12} color="#8B1E3F" />
                    <span>{profile.education}</span>
                  </span>
                )}
                {profile.lifestyle?.workout && (
                  <span className="editorial-pill">
                    <Dumbbell size={12} color="#8B1E3F" />
                    <span>Workout: {profile.lifestyle.workout}</span>
                  </span>
                )}
                {profile.lifestyle?.drinking && (
                  <span className="editorial-pill">
                    <Wine size={12} color="#8B1E3F" />
                    <span>Drinks: {profile.lifestyle.drinking}</span>
                  </span>
                )}
                {profile.lifestyle?.smoking && (
                  <span className="editorial-pill">
                    <Cigarette size={12} color="#8B1E3F" />
                    <span>Smoking: {profile.lifestyle.smoking}</span>
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Additional Photos Gallery */}
          {photos.length > 1 && (
            <div className="editorial-section-card">
              <div className="editorial-section-title">
                <Sparkles size={13} />
                <span>Photo Gallery</span>
              </div>
              <div className="editorial-photo-grid">
                {photos.slice(1).map((photoUrl, idx) => (
                  <img
                    key={idx}
                    src={photoUrl}
                    alt={`${profile.name} gallery ${idx + 1}`}
                    className="editorial-photo-item"
                    loading="lazy"
                  />
                ))}
              </div>
            </div>
          )}

          {/* Verification & Trust */}
          <div className="editorial-section-card">
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 12
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{
                  width: 38,
                  height: 38,
                  borderRadius: '50%',
                  background: (profile.verified || profile.isVerified)
                    ? 'rgba(16, 185, 129, 0.12)'
                    : 'rgba(245, 158, 11, 0.12)',
                  color: (profile.verified || profile.isVerified) ? '#10B981' : '#F59E0B',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <div style={{ fontSize: '0.84rem', fontWeight: 800, color: '#1F161A' }}>
                    {(profile.verified || profile.isVerified)
                      ? 'Verified MIORA Profile'
                      : 'Verification Pending'}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#7A5565', marginTop: 1 }}>
                    {(profile.verified || profile.isVerified)
                      ? 'Identity & live selfie authenticated'
                      : 'Not yet authenticated'}
                  </div>
                </div>
              </div>

              {!profile.verified && !profile.isVerified && !isUnlocked && (
                <button
                  onClick={() => verifyProfileWithCoins(profile.id, profile.name)}
                  style={{
                    padding: '6px 13px',
                    borderRadius: 9999,
                    background: 'linear-gradient(135deg, #881337 0%, #E11D48 100%)',
                    color: '#FFFFFF',
                    border: 'none',
                    fontSize: '0.72rem',
                    fontWeight: 750,
                    cursor: 'pointer'
                  }}
                >
                  Verify Status (₹60)
                </button>
              )}
            </div>
          </div>

          {/* Bottom Actions Row at end of scroll */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 16,
            padding: '16px 0 24px 0'
          }}>
            <button
              onClick={() => onSwipe('left')}
              className="editorial-btn-pass"
              title="Pass"
            >
              <X size={20} strokeWidth={2.5} />
            </button>

            <button
              onClick={() => onSwipe('right')}
              className="editorial-btn-like"
              title="Like"
            >
              <Heart size={26} fill="#FFFFFF" color="#FFFFFF" />
            </button>

            <button
              onClick={() => onSwipe('up')}
              className="editorial-btn-super"
              title="Super Like"
            >
              <Sparkles size={18} fill="#B89230" color="#B89230" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
