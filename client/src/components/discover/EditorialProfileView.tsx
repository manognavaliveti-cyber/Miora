import React, { useState, useRef, useEffect } from 'react';
import { Profile } from '../../types';
import {
  Heart, X, Sparkles, MapPin, Briefcase, GraduationCap,
  Check, MessageCircle, Ruler, Wine, Cigarette, Dumbbell,
  Star, Target, ShieldCheck, ChevronDown, ChevronUp
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
  stackIndex = 0,
  exitDirection = null,
  isModalView = false,
  onClose
}) => {
  const { currentUser, verifyProfileWithCoins, unlockedVerificationIds } = useApp();
  const [photoIndex, setPhotoIndex] = useState(0);
  const [scrollY, setScrollY] = useState(0);
  const [isExpanded, setIsExpanded] = useState<boolean>(isModalView);
  const [fullscreenPhotoUrl, setFullscreenPhotoUrl] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const startPos = useRef({ x: 0, y: 0 });
  const dragLockedRef = useRef<'swipe' | 'scroll' | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const lastToggleTime = useRef(0);
  const [stickyStartOffset, setStickyStartOffset] = useState(380);

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

  useEffect(() => {
    if (isExpanded && viewportRef.current) {
      setStickyStartOffset(viewportRef.current.offsetHeight);
    }
  }, [isExpanded, profile.id]);

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
      lastToggleTime.current = Date.now();
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
      lastToggleTime.current = Date.now();
      setIsExpanded(true);
    }

    setDragOffset({ x: 0, y: 0 });
    dragLockedRef.current = null;
  };

  // Scroll Interpolation Values
  const textShrinkProgress = Math.min(1, Math.max(0, (scrollY - (stickyStartOffset - 150)) / 150));
  const cardProgress = Math.min(1, Math.max(0, scrollY / (stickyStartOffset || 350)));
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

  const isRedTheme = (stackIndex || 0) % 2 !== 0;
  const themeClass = isExpanded ? (isRedTheme ? 'theme-expanded-red' : 'theme-expanded-black') : 'theme-unexpanded';

  return (
    <div
      className={`editorial-profile-root ${themeClass}`}
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden',
        userSelect: 'none'
      }}
    >
      <style>{`
        .editorial-profile-root {
          --editorial-max-w: 520px;
          --bg-color: #FFFFFF;
          --text-primary: #1F161A;
          --text-secondary: #8B1E3F;
          --text-tertiary: #7A5565;
          --card-bg: #FFFFFF;
          --card-border: rgba(244, 63, 94, 0.12);
          --pill-bg: #FFF5F7;
          --pill-text: #5C2E3E;
          --pill-border: rgba(139, 30, 63, 0.12);
          --title-gradient: linear-gradient(135deg, #1A040B 0%, #4D091A 45%, #8B1E3F 100%);
          --header-bg: #FFFFFF;
          background: var(--bg-color);
          transition: background 0.4s ease;
        }

        .editorial-profile-root.theme-expanded-black {
          background: linear-gradient(to bottom, #0C0407 0%, #22050E 50%, #0C0407 100%);
          --text-primary: #FFFFFF;
          --text-secondary: #FFB3C6;
          --text-tertiary: #FF8DA1;
          --card-bg: rgba(25, 10, 15, 0.5);
          --card-border: rgba(225, 29, 72, 0.25);
          --pill-bg: rgba(225, 29, 72, 0.15);
          --pill-text: #FFB3C6;
          --pill-border: rgba(225, 29, 72, 0.3);
          --title-gradient: linear-gradient(135deg, #FFFFFF 0%, #FFB3C6 45%, #E11D48 100%);
          --header-bg: #0C0407;
        }

        .editorial-profile-root.theme-expanded-red {
          background: linear-gradient(to bottom, #5C0E20 0%, #881337 50%, #5C0E20 100%);
          --text-primary: #FFFFFF;
          --text-secondary: #FFD1DB;
          --text-tertiary: #FFB3C6;
          --card-bg: rgba(255, 255, 255, 0.12);
          --card-border: rgba(255, 255, 255, 0.25);
          --pill-bg: rgba(255, 255, 255, 0.15);
          --pill-text: #FFFFFF;
          --pill-border: rgba(255, 255, 255, 0.3);
          --title-gradient: linear-gradient(135deg, #FFFFFF 0%, #FFD1DB 100%);
          --header-bg: #5C0E20;
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
          min-height: 90vh; /* changed to a larger viewport-relative unit to push details down */
          display: flex;
          flex-direction: column;
          justify-content: center; /* Center the card and text vertically */
          align-items: center;
          padding: 20px 16px 40px 16px;
          box-sizing: border-box;
          flex-shrink: 0;
        }

        .expanded-card-frame {
          width: 100%;
          height: clamp(320px, 52vh, 460px); /* Increased size to look premium and large */
          border-radius: 26px;
          position: relative;
          overflow: hidden;
          background: #180D12;
          box-shadow: 0 14px 40px rgba(139, 30, 63, 0.14);
          border: 1px solid rgba(244, 63, 94, 0.14);
          flex-shrink: 0;
          margin-bottom: 24px;
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
          font-size: clamp(3.4rem, 8vh, 4.5rem);
          font-weight: 900;
          line-height: 1.1;
          letter-spacing: 0.01em;
          color: var(--text-primary);
          margin: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          background: var(--title-gradient);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .editorial-meta-sub {
          font-size: clamp(0.95rem, 2.2vh, 1.15rem);
          font-weight: 800;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--text-secondary);
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
          color: var(--text-tertiary);
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

        .editorial-btn-detail {
          width: clamp(54px, 13vw, 64px);
          height: clamp(54px, 13vw, 64px);
          border-radius: 50%;
          background: var(--card-bg);
          border: 1px solid var(--card-border);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-primary);
          cursor: pointer;
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          transition: transform 0.2s ease, background 0.2s ease;
        }
        .editorial-btn-detail:hover {
          transform: scale(1.08);
          background: rgba(255, 255, 255, 0.1);
        }
        .editorial-btn-detail:active {
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
          background: var(--card-bg);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border-bottom: 1px solid var(--card-border);
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
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
          background: var(--card-bg);
          border-radius: 22px;
          border: 1px solid var(--card-border);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          padding: 18px;
          box-sizing: border-box;
        }

        .editorial-section-title {
          font-size: 0.72rem;
          font-weight: 800;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--text-secondary);
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
          color: var(--pill-text);
          background: var(--pill-bg);
          border: 1px solid var(--pill-border);
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
            onClick={() => {
              lastToggleTime.current = Date.now();
              setIsExpanded(true);
            }}
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

            <button
              onClick={(e) => {
                e.stopPropagation();
                lastToggleTime.current = Date.now();
                setIsExpanded(true);
              }}
              className="editorial-btn-detail"
              title="Details"
              aria-label="Details"
            >
              <ChevronUp size={28} strokeWidth={2.5} />
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Scroll Container */}
          <div
            className="editorial-scroll-container"
            ref={scrollContainerRef}
            onScroll={handleScroll}
          >
            {/* PHOTO CARD */}
            <div className="expanded-hero-viewport" ref={viewportRef} style={{ minHeight: '50vh', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', paddingBottom: 0 }}>
              <div 
                className="expanded-card-frame"
                style={{
                  transform: `scale(${1 - cardProgress * 0.15}) translateY(${cardProgress * -60}px)`,
                  opacity: 1 - cardProgress * 1.2,
                  transformOrigin: 'top center',
                  marginBottom: 32
                }}
              >
                <img
                  src={photos[photoIndex]}
                  alt={profile.name}
                  onClick={() => {
                    if (Date.now() - lastToggleTime.current > 400) {
                      setIsExpanded(false);
                    }
                  }}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block',
                    cursor: 'pointer'
                  }}
                />

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
                          transition: 'all 0.2s ease'
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* STICKY IDENTITY HEADER */}
            <div
              className="editorial-identity-block"
              style={{
                position: 'sticky',
                top: 0,
                zIndex: 50,
                background: textShrinkProgress > 0 ? 'var(--header-bg)' : 'transparent',
                backdropFilter: 'none',
                WebkitBackdropFilter: 'none',
                borderBottom: textShrinkProgress > 0.5 ? '1px solid var(--card-border)' : '1px solid transparent',
                paddingTop: `calc(12px + ${Math.max(0, 1 - textShrinkProgress)} * 5vh)`,
                paddingBottom: `calc(12px + ${Math.max(0, 1 - textShrinkProgress)} * 25vh)`,
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center',
                transition: 'background 0.2s, border 0.2s',
                minHeight: 60
              }}
            >
              {/* Left side: Collapse button (visible when scrolled) */}
              <div style={{ 
                position: 'absolute',
                left: 16,
                opacity: Math.min(1, textShrinkProgress * 1.5),
                pointerEvents: textShrinkProgress > 0.1 ? 'auto' : 'none',
                display: 'flex',
                alignItems: 'center',
                transition: 'opacity 0.4s'
              }}>
                <button
                  onClick={() => {
                    if (isModalView && onClose) onClose();
                    else setIsExpanded(false);
                  }}
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: '50%',
                    background: 'var(--pill-bg)',
                    border: '1px solid var(--card-border)',
                    color: 'var(--text-secondary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer'
                  }}
                >
                  <ChevronDown size={20} />
                </button>
              </div>

              {/* Center: Text block smoothly shrinking */}
              <div style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center',
                transform: `scale(${Math.max(0.40, 1 - textShrinkProgress * 0.60)})`,
                transformOrigin: 'center center',
                paddingLeft: `calc(16px + ${textShrinkProgress} * 75px)`,
                paddingRight: `calc(16px + ${textShrinkProgress} * 170px)`,
                width: '100%',
                boxSizing: 'border-box'
              }}>
                <h1 
                  className="editorial-name-title" 
                  style={{ 
                    justifyContent: 'center',
                    margin: 0,
                    whiteSpace: 'nowrap'
                  }}
                >
                  <span style={{ 
                    whiteSpace: 'nowrap', 
                    display: 'block'
                  }}>{profile.name}</span>
                  {(profile.verified || profile.isVerified) && (
                    <VerifiedBadge size={26} />
                  )}
                </h1>

                <div 
                  className="editorial-meta-sub"
                  style={{
                    justifyContent: 'center',
                    marginTop: 4,
                    whiteSpace: 'nowrap'
                  }}
                >
                  {calcAge ? <span>{calcAge} YEARS</span> : null}
                  {calcAge && city ? <span>·</span> : null}
                  {city ? <span>{city}</span> : null}
                </div>

                {/* Extra info fades out on scroll */}
                <div style={{ 
                  opacity: Math.max(0, 1 - textShrinkProgress * 3),
                  maxHeight: textShrinkProgress > 0.33 ? 0 : 50,
                  overflow: 'hidden',
                  transition: 'max-height 0.3s',
                  width: '100%',
                  textAlign: 'center'
                }}>
                  {(profile.occupation || profile.distanceKm !== undefined) && (
                    <div style={{ textAlign: 'center', marginTop: 12 }}>
                      {profile.occupation && (
                        <div className="editorial-occ-sub" style={{
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}>
                          {profile.occupation}
                        </div>
                      )}
                      {profile.distanceKm !== undefined && (
                        <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#A0687A', marginTop: 4 }}>
                          · {profile.distanceKm} KM AWAY ·
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Right side: Action Buttons (visible when scrolled) */}
              <div style={{ 
                position: 'absolute',
                right: 16,
                opacity: Math.min(1, textShrinkProgress * 1.5),
                pointerEvents: textShrinkProgress > 0.1 ? 'auto' : 'none',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                transition: 'opacity 0.4s'
              }}>
                <button
                  onClick={() => onSwipe('left')}
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: '50%',
                    background: 'var(--card-bg)',
                    border: '1.5px solid var(--card-border)',
                    color: '#E11D48',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer'
                  }}
                >
                  <X size={18} strokeWidth={2.5} />
                </button>
                <button
                  onClick={() => onSwipe('right')}
                  style={{
                    width: 38,
                    height: 38,
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
                  <Heart size={18} fill="#FFFFFF" color="#FFFFFF" />
                </button>
              </div>
            </div>

            {/* DETAILS STREAM */}
            <div className="editorial-details-stream" style={{ minHeight: '80vh', paddingBottom: '40px' }}>

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
                    color: 'var(--text-primary)',
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
                        onClick={() => setFullscreenPhotoUrl(photoUrl)}
                        style={{ cursor: 'pointer' }}
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
                      <div style={{ fontSize: '0.84rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                        {(profile.verified || profile.isVerified)
                          ? 'Verified MIORA Profile'
                          : 'Verification Pending'}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)', marginTop: 1 }}>
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

      {/* Lightbox for Fullscreen Photo */}
      {fullscreenPhotoUrl && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.95)',
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'zoom-out'
          }}
          onClick={() => setFullscreenPhotoUrl(null)}
        >
          <img
            src={fullscreenPhotoUrl}
            alt="Fullscreen"
            style={{
              maxWidth: '100%',
              maxHeight: '100%',
              objectFit: 'contain'
            }}
          />
          <button
            onClick={(e) => {
              e.stopPropagation();
              setFullscreenPhotoUrl(null);
            }}
            style={{
              position: 'absolute',
              top: 20,
              right: 20,
              width: 44,
              height: 44,
              borderRadius: '50%',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: '#FFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              zIndex: 101
            }}
          >
            <X size={24} />
          </button>
        </div>
      )}
    </div>
  );
};
