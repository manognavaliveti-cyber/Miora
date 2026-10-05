import React, { useState, useRef, useEffect } from 'react';
import { Profile } from '../../types';
import {
  Heart, X, Sparkles, MapPin, Briefcase, GraduationCap,
  Check, MessageCircle, Ruler, Wine, Cigarette, Dumbbell,
  Star, Target, ShieldCheck, ChevronDown
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
  const [isExpanded, setIsExpanded] = useState<boolean>(isModalView);
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

  // Reset state when profile changes
  useEffect(() => {
    setPhotoIndex(0);
    setScrollY(0);
    setIsExpanded(isModalView);
    setDragOffset({ x: 0, y: 0 });
    setIsDragging(false);
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0;
    }
  }, [profile.id, isModalView]);

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

  // 2D Card Drag & Tap Handlers
  const handleCardTouchStart = (e: React.TouchEvent) => {
    if (!isTopCard || isExpanded) return;
    setIsDragging(true);
    dragLockedRef.current = null;
    startPos.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };

  const handleCardTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || !isTopCard || isExpanded) return;
    const dx = e.touches[0].clientX - startPos.current.x;
    const dy = e.touches[0].clientY - startPos.current.y;

    if (!dragLockedRef.current) {
      if (Math.abs(dx) > 8 || Math.abs(dy) > 14) {
        if (Math.abs(dx) > Math.abs(dy) * 0.7) {
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
    if (!isDragging || !isTopCard || isExpanded) return;
    setIsDragging(false);

    const isTap = Math.abs(dragOffset.x) < 10 && Math.abs(dragOffset.y) < 10;

    if (dragOffset.x > 95) {
      onSwipe('right');
    } else if (dragOffset.x < -95) {
      onSwipe('left');
    } else if (dragOffset.y < -110) {
      onSwipe('up');
    } else if (isTap) {
      // Tap on card photo -> expand to details view 100% reliably!
      setIsExpanded(true);
    }

    setDragOffset({ x: 0, y: 0 });
    dragLockedRef.current = null;
  };

  const handleCardMouseDown = (e: React.MouseEvent) => {
    if (!isTopCard || isExpanded) return;
    if ((e.target as HTMLElement).closest('button')) return;
    setIsDragging(true);
    dragLockedRef.current = null;
    startPos.current = { x: e.clientX, y: e.clientY };
  };

  const handleCardMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !isTopCard || isExpanded) return;
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
    if (!isDragging || !isTopCard || isExpanded) return;
    setIsDragging(false);

    const isTap = Math.abs(dragOffset.x) < 10 && Math.abs(dragOffset.y) < 10;

    if (dragOffset.x > 95) {
      onSwipe('right');
    } else if (dragOffset.x < -95) {
      onSwipe('left');
    } else if (dragOffset.y < -110) {
      onSwipe('up');
    } else if (isTap) {
      setIsExpanded(true);
    }

    setDragOffset({ x: 0, y: 0 });
    dragLockedRef.current = null;
  };

  // Scroll Interpolation Values
  const scrollProgress = Math.min(1, Math.max(0, scrollY / 150));
  const isExiting = isTopCard && !!exitDirection;
  const rotation = isTopCard ? dragOffset.x * 0.08 : 0;

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
          --editorial-max-w: 520px;
        }

        /* ─── UNEXPANDED STACK VIEW ─── */
        .unexpanded-stack-container {
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 16px 16px 20px 16px;
          box-sizing: border-box;
          max-width: var(--editorial-max-w);
          margin: 0 auto;
          gap: 16px;
        }

        .unexpanded-card-frame {
          width: 100%;
          max-width: 440px;
          height: clamp(340px, calc(100vh - 240px), 520px);
          aspect-ratio: 3.25 / 4;
          border-radius: 32px;
          position: relative;
          overflow: hidden;
          background: #180D12;
          box-shadow:
            0 20px 50px rgba(139, 30, 63, 0.18),
            0 6px 20px rgba(0, 0, 0, 0.12),
            8px 8px 0px -2px rgba(244, 114, 182, 0.15),
            14px 14px 0px -4px rgba(139, 30, 63, 0.08);
          border: 1px solid rgba(244, 63, 94, 0.16);
          cursor: pointer;
          touch-action: pan-y;
          flex-shrink: 1;
          transition: transform 0.15s ease-out;
        }
        .unexpanded-card-frame:active {
          cursor: grabbing;
        }

        /* ─── EXPANDED DETAILED SCROLL VIEW ─── */
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

        /* Initial Hero Viewport when Expanded (fits photo card + large Name/City header in initial frame) */
        .expanded-hero-viewport {
          width: 100%;
          max-width: var(--editorial-max-w);
          min-height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          align-items: center;
          padding: 12px 16px 20px 16px;
          box-sizing: border-box;
          flex-shrink: 0;
        }

        .expanded-card-frame {
          width: 100%;
          height: clamp(230px, 44vh, 360px);
          border-radius: 26px;
          position: relative;
          overflow: hidden;
          background: #180D12;
          box-shadow: 0 14px 40px rgba(139, 30, 63, 0.14);
          border: 1px solid rgba(244, 63, 94, 0.14);
          flex-shrink: 0;
          margin-bottom: 16px;
        }

        /* Identity Block below card in expanded initial frame — Large text size that shrinks on scroll */
        .editorial-identity-block {
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          padding: 10px 16px;
          box-sizing: border-box;
          will-change: transform, opacity;
          transform-origin: center center;
          transition: transform 0.12s cubic-bezier(0.2, 0, 0, 1), opacity 0.12s linear;
        }

        .editorial-name-title {
          font-family: var(--font-primary);
          font-size: clamp(2.1rem, 4.8vh, 2.8rem);
          font-weight: 900;
          line-height: 1.1;
          letter-spacing: 0.01em;
          color: #1F161A;
          margin: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          background: linear-gradient(135deg, #1A040B 0%, #4D091A 45%, #8B1E3F 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .editorial-meta-sub {
          font-size: clamp(0.95rem, 2.2vh, 1.15rem);
          font-weight: 800;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #8B1E3F;
          margin-top: 6px;
          line-height: 1.2;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .editorial-occ-sub {
          font-size: clamp(0.88rem, 2vh, 1.02rem);
          font-weight: 700;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: #7A5565;
          margin-top: 4px;
          line-height: 1.2;
        }

        /* Action Buttons Dock */
        .editorial-actions-dock {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: clamp(20px, 6vw, 32px);
          width: 100%;
          margin-top: 10px;
        }

        .editorial-btn-pass {
          width: clamp(54px, 13vw, 64px);
          height: clamp(54px, 13vw, 64px);
          border-radius: 50%;
          background: #FFFFFF;
          border: 2px solid rgba(225, 29, 72, 0.22);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #E11D48;
          cursor: pointer;
          box-shadow: 0 6px 20px rgba(225, 29, 72, 0.15);
          transition: transform 0.2s ease, background 0.2s ease;
        }
        .editorial-btn-pass:hover {
          transform: scale(1.08);
          background: #FFF1F4;
        }
        .editorial-btn-pass:active {
          transform: scale(0.94);
        }

        .editorial-btn-like {
          width: clamp(66px, 16vw, 76px);
          height: clamp(66px, 16vw, 76px);
          border-radius: 50%;
          background: linear-gradient(135deg, #881337 0%, #E11D48 100%);
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #FFFFFF;
          cursor: pointer;
          box-shadow: 0 10px 32px rgba(190, 18, 60, 0.42);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .editorial-btn-like:hover {
          transform: scale(1.08);
          box-shadow: 0 14px 38px rgba(190, 18, 60, 0.55);
        }
        .editorial-btn-like:active {
          transform: scale(0.94);
        }

        .editorial-btn-super {
          width: clamp(52px, 12vw, 60px);
          height: clamp(52px, 12vw, 60px);
          border-radius: 50%;
          background: #FFFFFF;
          border: 2px solid rgba(212, 175, 55, 0.35);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #B89230;
          cursor: pointer;
          box-shadow: 0 6px 20px rgba(212, 175, 55, 0.18);
          transition: transform 0.2s ease;
        }
        .editorial-btn-super:hover {
          transform: scale(1.08);
          background: #FFFDF5;
        }

        /* Sticky top bar when expanded */
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

        /* Details Stream */
        .editorial-details-stream {
          width: 100%;
          max-width: var(--editorial-max-w);
          display: flex;
          flex-direction: column;
          gap: 16px;
          padding: 16px 16px 60px 16px;
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
        }

        .editorial-pill-mutual {
          background: linear-gradient(135deg, #881337 0%, #C52E59 100%);
          color: #FFFFFF;
          font-weight: 700;
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
        }
      `}</style>

      {/* ─── MODE A: UNEXPANDED CARD STACK (Image 1 Style) ─── */}
      {!isExpanded ? (
        <div className="unexpanded-stack-container">
          <div
            className="unexpanded-card-frame"
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
            onClick={() => setIsExpanded(true)}
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

            {/* Top scrim gradient */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: 60,
              background: 'linear-gradient(to bottom, rgba(0, 0, 0, 0.5) 0%, transparent 100%)',
              pointerEvents: 'none'
            }} />

            {/* Top-Left Location Pill */}
            {city && (
              <div style={{
                position: 'absolute',
                top: 14,
                left: 14,
                zIndex: 7,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 5,
                padding: '4px 12px',
                borderRadius: 9999,
                background: 'rgba(0, 0, 0, 0.45)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(255, 255, 255, 0.25)',
                color: '#FFFFFF',
                fontSize: '0.78rem',
                fontWeight: 700
              }}>
                <MapPin size={12} color="#FF6B9D" />
                <span>{city}</span>
              </div>
            )}

            {/* Photo Progress Indicators */}
            {totalPhotos > 1 && (
              <div style={{
                position: 'absolute',
                top: 8,
                left: 14,
                right: 14,
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
                      transition: 'all 0.2s ease'
                    }}
                  />
                ))}
              </div>
            )}

            {/* Photo Cycling Tap Zones (outer edges) */}
            {totalPhotos > 1 && (
              <>
                <div
                  onClick={handlePrevPhoto}
                  style={{
                    position: 'absolute',
                    top: 45,
                    left: 0,
                    width: '28%',
                    bottom: 120,
                    zIndex: 4,
                    cursor: 'pointer'
                  }}
                  title="Previous photo"
                />
                <div
                  onClick={handleNextPhoto}
                  style={{
                    position: 'absolute',
                    top: 45,
                    right: 0,
                    width: '28%',
                    bottom: 120,
                    zIndex: 4,
                    cursor: 'pointer'
                  }}
                  title="Next photo"
                />
              </>
            )}

            {/* Bottom Gradient Scrim & Info Overlay */}
            <div
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                padding: '48px 18px 18px 18px',
                background: 'linear-gradient(to top, rgba(12, 6, 9, 0.92) 0%, rgba(12, 6, 9, 0.6) 65%, transparent 100%)',
                zIndex: 6,
                display: 'flex',
                alignItems: 'flex-end',
                justifyContent: 'space-between'
              }}
            >
              <div>
                {/* Name & Age */}
                <h2 style={{
                  fontSize: '1.75rem',
                  fontWeight: 900,
                  color: '#FFFFFF',
                  margin: 0,
                  lineHeight: 1.15,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8
                }}>
                  <span>{profile.name}{calcAge ? `, ${calcAge}` : ''}</span>
                  {(profile.verified || profile.isVerified) && (
                    <VerifiedBadge size={22} />
                  )}
                </h2>

                {/* Occupation */}
                {profile.occupation && (
                  <p style={{
                    fontSize: '0.88rem',
                    fontWeight: 600,
                    color: 'rgba(255, 255, 255, 0.85)',
                    margin: '4px 0 10px 0'
                  }}>
                    {profile.occupation}
                  </p>
                )}

                {/* Vibe Match Pill */}
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '5px 14px',
                  borderRadius: 9999,
                  background: 'rgba(255, 255, 255, 0.15)',
                  backdropFilter: 'blur(12px)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  color: '#FFFFFF',
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  letterSpacing: '0.04em'
                }}>
                  <div style={{
                    width: 22,
                    height: 22,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #FF3366 0%, #E11D48 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.65rem',
                    fontWeight: 900
                  }}>
                    {comp.score}%
                  </div>
                  <span>VIBE MATCH</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons Dock below unexpanded card */}
          <div className="editorial-actions-dock">
            <button
              onClick={() => onSwipe('left')}
              className="editorial-btn-pass"
              title="Pass"
              aria-label="Pass"
            >
              <X size={26} strokeWidth={2.5} />
            </button>

            <button
              onClick={() => onSwipe('right')}
              className="editorial-btn-like"
              title="Like"
              aria-label="Like"
            >
              <Heart size={32} fill="#FFFFFF" color="#FFFFFF" />
            </button>
          </div>
        </div>
      ) : (
        /* ─── MODE B: EXPANDED DETAILED VIEW (Image 2 Style) ─── */
        <>
          {/* Sticky Header when user scrolls down */}
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

            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              {/* Collapse Button */}
              <button
                onClick={() => {
                  if (isModalView && onClose) onClose();
                  else setIsExpanded(false);
                }}
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
                title="Collapse profile"
              >
                <ChevronDown size={18} />
              </button>

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

          {/* Scroll Container */}
          <div
            className="editorial-scroll-container"
            ref={scrollContainerRef}
            onScroll={handleScroll}
          >
            {/* INITIAL FRAME VIEWPORT: Photo Card + Large Name/City details block fit together initially */}
            <div className="expanded-hero-viewport">
              {/* Photo Card */}
              <div className="expanded-card-frame">
                <img
                  src={photos[photoIndex]}
                  alt={profile.name}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block'
                  }}
                />

                {/* Back / Collapse Button on top-left of card */}
                <button
                  onClick={() => {
                    if (isModalView && onClose) onClose();
                    else setIsExpanded(false);
                  }}
                  style={{
                    position: 'absolute',
                    top: 12,
                    left: 12,
                    zIndex: 8,
                    width: 34,
                    height: 34,
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
                  title="Collapse"
                >
                  <ChevronDown size={20} />
                </button>

                {/* Photo Progress Indicators */}
                {totalPhotos > 1 && (
                  <div style={{
                    position: 'absolute',
                    top: 10,
                    left: 56,
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
                          transition: 'all 0.2s ease'
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Identity & Details Block directly below card in frame — Large initial text that visibly shrinks on scroll */}
              <div
                className="editorial-identity-block"
                style={{
                  opacity: Math.max(0, 1 - scrollProgress * 1.3),
                  transform: `scale(${Math.max(0.65, 1 - scrollProgress * 0.35)}) translateY(-${scrollProgress * 16}px)`
                }}
              >
                <h1 className="editorial-name-title">
                  <span>{profile.name}</span>
                  {(profile.verified || profile.isVerified) && (
                    <VerifiedBadge size={26} />
                  )}
                </h1>

                <div className="editorial-meta-sub">
                  {calcAge ? <span>{calcAge} YEARS</span> : null}
                  {calcAge && city ? <span>·</span> : null}
                  {city ? <span>{city}</span> : null}
                  {profile.distanceKm !== undefined && (
                    <span style={{ color: '#A0687A', fontWeight: 600 }}>· {profile.distanceKm} KM AWAY</span>
                  )}
                </div>

                {profile.occupation && (
                  <div className="editorial-occ-sub">
                    {profile.occupation}
                  </div>
                )}
              </div>
            </div>

            {/* DETAILS STREAM */}
            <div className="editorial-details-stream">
              {/* Bio Section */}
              {profile.bio && (
                <div className="editorial-section-card">
                  <div className="editorial-section-title">
                    <Sparkles size={13} />
                    <span>About {profile.name}</span>
                  </div>
                  <p style={{
                    margin: 0,
                    fontSize: '0.92rem',
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

              {/* Lifestyle & Essentials */}
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

              {/* Photo Gallery */}
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

              {/* Verification Card */}
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

              {/* Action Buttons Row at end of scroll */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 16,
                padding: '20px 0 32px 0'
              }}>
                <button
                  onClick={() => onSwipe('left')}
                  className="editorial-btn-pass"
                  title="Pass"
                >
                  <X size={24} strokeWidth={2.5} />
                </button>

                <button
                  onClick={() => onSwipe('right')}
                  className="editorial-btn-like"
                  title="Like"
                >
                  <Heart size={30} fill="#FFFFFF" color="#FFFFFF" />
                </button>

                <button
                  onClick={() => onSwipe('up')}
                  className="editorial-btn-super"
                  title="Super Like"
                >
                  <Sparkles size={20} fill="#B89230" color="#B89230" />
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
