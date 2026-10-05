import React, { useState, useRef } from 'react';
import { Profile } from '../../types';
import { MapPin } from 'lucide-react';
import { VerifiedBadge } from '../common/VerifiedBadge';
import { useApp } from '../../context/AppContext';
import { calculateCompatibilityScore } from '../../utils/profileUtils';

interface SwipeCardProps {
  profile: Profile;
  onSwipe: (direction: 'left' | 'right' | 'up') => void;
  onOpenDetails: () => void;
  isTopCard?: boolean;
  stackIndex?: number;
  /** Set by the page when a swipe is triggered (drag or dock button) so the card can fly off-screen. */
  exitDirection?: 'left' | 'right' | 'up' | null;
}

// One shared inner padding so progress bars, location, name, role and badge all sit on the same left edge.
const CARD_PAD = 18;

// Vibe-match ring geometry
const RING_SIZE = 38;
const RING_STROKE = 3;
const RING_RADIUS = (RING_SIZE - RING_STROKE) / 2;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

export const SwipeCard: React.FC<SwipeCardProps> = ({
  profile,
  onSwipe,
  onOpenDetails,
  isTopCard = false,
  stackIndex = 0,
  exitDirection = null
}) => {
  const [photoIndex, setPhotoIndex] = useState(0);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const startPos = useRef({ x: 0, y: 0 });

  const totalPhotos = profile.photos.length || 1;

  const handleNextPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPhotoIndex((prev) => (prev + 1) % totalPhotos);
  };

  const handlePrevPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPhotoIndex((prev) => (prev - 1 + totalPhotos) % totalPhotos);
  };

  // Drag Handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    if (!isTopCard) return;
    setIsDragging(true);
    startPos.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || !isTopCard) return;
    const dx = e.touches[0].clientX - startPos.current.x;
    const dy = e.touches[0].clientY - startPos.current.y;
    setDragOffset({ x: dx, y: dy });
  };

  const handleTouchEnd = () => {
    if (!isDragging || !isTopCard) return;
    setIsDragging(false);

    if (dragOffset.x > 110) {
      onSwipe('right');
    } else if (dragOffset.x < -110) {
      onSwipe('left');
    } else if (dragOffset.y < -120) {
      onSwipe('up');
    }
    setDragOffset({ x: 0, y: 0 });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!isTopCard) return;
    setIsDragging(true);
    startPos.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !isTopCard) return;
    const dx = e.clientX - startPos.current.x;
    const dy = e.clientY - startPos.current.y;
    setDragOffset({ x: dx, y: dy });
  };

  const handleMouseUp = () => {
    if (!isDragging || !isTopCard) return;
    setIsDragging(false);

    if (dragOffset.x > 110) {
      onSwipe('right');
    } else if (dragOffset.x < -110) {
      onSwipe('left');
    } else if (dragOffset.y < -120) {
      onSwipe('up');
    }
    setDragOffset({ x: 0, y: 0 });
  };

  const rotation = isTopCard ? dragOffset.x * 0.06 : 0;
  const currentPhoto =
    profile.photos[photoIndex] ||
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&q=80';

  // No stamp overlays — feedback is handled by the center popup in DiscoverPage
  const isExiting = isTopCard && !!exitDirection;

  // City only (e.g. "Hyderabad, India" -> "Hyderabad")
  const city = (profile.location || '').split(',')[0].trim();
  const { currentUser } = useApp();
  const comp = calculateCompatibilityScore(currentUser, profile);
  const matchPercent = comp.score;
  const ringOffset = RING_CIRCUMFERENCE * (1 - matchPercent / 100);
  const gradId = `vibeGrad-${profile.id}`;

  // Stack transforms matching reference deck peeking effect
  let cardTransform = `translate3d(${dragOffset.x}px, ${dragOffset.y}px, 0) rotate(${rotation}deg)`;
  let zIndexVal = 10;
  let brightnessVal = 'none';
  let opacityVal = 1;

  if (isExiting) {
    if (exitDirection === 'right') cardTransform = 'translate3d(150%, -30px, 0) rotate(22deg)';
    else if (exitDirection === 'left') cardTransform = 'translate3d(-150%, -30px, 0) rotate(-22deg)';
    else cardTransform = 'translate3d(0, -130%, 0) scale(0.92)';
    opacityVal = 0;
  }

  if (stackIndex === 1) {
    cardTransform = 'scale(0.96) translateY(8px) translateX(10px) rotate(2deg)';
    zIndexVal = 5;
    brightnessVal = 'brightness(0.94)';
  } else if (stackIndex >= 2) {
    cardTransform = 'scale(0.91) translateY(18px) translateX(-10px) rotate(-2deg)';
    zIndexVal = 2;
    brightnessVal = 'brightness(0.88)';
  }

  return (
    <div
      style={{
        position: 'absolute',
        width: '100%',
        height: '100%',
        borderRadius: '32px',
        background: '#FFFFFF',
        transform: cardTransform,
        zIndex: zIndexVal,
        filter: brightnessVal,
        opacity: opacityVal,
        transition: isDragging
          ? 'none'
          : isExiting
          ? 'transform 0.32s cubic-bezier(0.4, 0, 0.6, 1), opacity 0.32s ease'
          : 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), filter 0.4s ease',
        cursor: isTopCard ? (isDragging ? 'grabbing' : 'grab') : 'default',
        userSelect: 'none',
        touchAction: 'none'
      }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Inner Card Frame */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          borderRadius: '32px',
          overflow: 'hidden',
          boxShadow: isTopCard
            ? '0 20px 56px rgba(0, 0, 0, 0.22), 0 6px 16px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255,255,255,0.08)'
            : '0 8px 20px rgba(0, 0, 0, 0.1)',
          border: '1px solid rgba(255, 255, 255, 0.06)'
        }}
      >
        {/* Profile Image Background */}
        <img
          src={currentPhoto}
          alt={profile.name}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            pointerEvents: 'none'
          }}
        />

        {/* No drag stamps — clean card surface */}

        {/* Soft top scrim so the location text blends into the photo without a box */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '130px',
            background: 'linear-gradient(to bottom, rgba(8, 3, 6, 0.55) 0%, rgba(8, 3, 6, 0) 100%)',
            pointerEvents: 'none',
            zIndex: 3
          }}
        />

        {/* Top Photo Progress Bars */}
        <div
          style={{
            position: 'absolute',
            top: '12px',
            left: `${CARD_PAD}px`,
            right: `${CARD_PAD}px`,
            display: 'flex',
            gap: '6px',
            zIndex: 5,
            pointerEvents: 'none'
          }}
        >
          {Array.from({ length: totalPhotos }).map((_, idx) => (
            <div
              key={idx}
              style={{
                flex: 1,
                height: '3px',
                borderRadius: '2px',
                background: idx === photoIndex ? '#FFFFFF' : 'rgba(255, 255, 255, 0.42)',
                boxShadow: idx === photoIndex ? '0 0 6px rgba(255, 255, 255, 0.55)' : 'none',
                transition: 'background 0.25s ease, box-shadow 0.25s ease'
              }}
            />
          ))}
        </div>

        {/* Location: city only, blended straight onto the photo, aligned with the bars and name */}
        {city && (
          <div
            style={{
              position: 'absolute',
              top: '26px',
              left: `${CARD_PAD}px`,
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              color: '#FFFFFF',
              fontSize: '0.86rem',
              fontWeight: 700,
              letterSpacing: '0.01em',
              lineHeight: 1,
              textShadow: '0 1px 8px rgba(0, 0, 0, 0.55)',
              zIndex: 5,
              pointerEvents: 'none'
            }}
          >
            <MapPin
              size={15}
              strokeWidth={2.4}
              color="#FFD6E4"
              style={{ marginLeft: '-1px', filter: 'drop-shadow(0 1px 4px rgba(0, 0, 0, 0.5))' }}
            />
            <span>{city}</span>
          </div>
        )}

        {/* Tap Zones for Cycling Photos */}
        <div
          onClick={handlePrevPhoto}
          style={{
            position: 'absolute',
            top: '56px',
            left: 0,
            width: '35%',
            height: '55%',
            zIndex: 4
          }}
        />
        <div
          onClick={handleNextPhoto}
          style={{
            position: 'absolute',
            top: '56px',
            right: 0,
            width: '35%',
            height: '55%',
            zIndex: 4
          }}
        />

        {/* Bottom Scrim & Profile Info */}
        <div
          onClick={onOpenDetails}
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            padding: `30px ${CARD_PAD}px 16px ${CARD_PAD}px`,
            background: 'linear-gradient(to top, rgba(10, 4, 8, 0.96) 0%, rgba(10, 4, 8, 0.72) 50%, rgba(0, 0, 0, 0) 100%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            zIndex: 5,
            cursor: 'pointer'
          }}
        >
          {/* Name, Age & Verified Badge */}
          <h2
            style={{
              fontSize: '1.6rem',
              fontWeight: 900,
              color: '#FFFFFF',
              letterSpacing: '-0.03em',
              margin: 0,
              lineHeight: 1.1,
              display: 'flex',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '7px',
              textShadow: '0 2px 12px rgba(0,0,0,0.4)'
            }}
          >
            <span>{profile.name}, {profile.age}</span>
            {(profile.verified || profile.isVerified) && <VerifiedBadge size={22} />}
          </h2>

          {/* Profession (if available) */}
          {profile.occupation && (
            <div
              style={{
                fontSize: '0.9rem',
                color: 'rgba(255, 255, 255, 0.8)',
                fontWeight: 500,
                margin: '4px 0 0 0',
                lineHeight: 1.2,
                letterSpacing: '0.01em'
              }}
            >
              {profile.occupation}
            </div>
          )}

          {/* Divider line */}
          <div
            style={{
              width: '100%',
              height: '1px',
              background: 'rgba(255,255,255,0.12)',
              margin: '12px 0 10px 0'
            }}
          />

          {/* Bottom Bar Row: Vibe Match Pill */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%'
            }}
          >
            {/* Left: Vibe Match ring or Incomplete status */}
            {comp.isIncomplete ? (
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 14px',
                  borderRadius: '9999px',
                  background: 'rgba(0, 0, 0, 0.45)',
                  backdropFilter: 'blur(16px)',
                  WebkitBackdropFilter: 'blur(16px)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  color: 'rgba(255, 255, 255, 0.9)',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  letterSpacing: '0.02em',
                  boxShadow: '0 4px 14px rgba(0, 0, 0, 0.16)'
                }}
              >
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#F59E0B' }} />
                <span>Profile incomplete</span>
              </div>
            ) : (
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '4px 14px 4px 4px',
                  borderRadius: '9999px',
                  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.22) 0%, rgba(255, 214, 232, 0.12) 55%, rgba(226, 214, 255, 0.14) 100%)',
                  backdropFilter: 'blur(16px)',
                  WebkitBackdropFilter: 'blur(16px)',
                  border: '1px solid rgba(255, 255, 255, 0.4)',
                  boxShadow: '0 4px 14px rgba(0, 0, 0, 0.16)'
                }}
              >
                {/* Percentage inside a pastel progress circle */}
                <div
                  style={{
                    position: 'relative',
                    width: `${RING_SIZE}px`,
                    height: `${RING_SIZE}px`,
                    flexShrink: 0
                  }}
                >
                  <svg
                    width={RING_SIZE}
                    height={RING_SIZE}
                    viewBox={`0 0 ${RING_SIZE} ${RING_SIZE}`}
                    style={{ position: 'absolute', inset: 0, transform: 'rotate(-90deg)' }}
                    aria-hidden="true"
                  >
                    <defs>
                      <linearGradient id={gradId} x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#FFB6D2" />
                        <stop offset="55%" stopColor="#E7B8FF" />
                        <stop offset="100%" stopColor="#FFD2B8" />
                      </linearGradient>
                    </defs>
                    <circle
                      cx={RING_SIZE / 2}
                      cy={RING_SIZE / 2}
                      r={RING_RADIUS}
                      fill="none"
                      stroke="rgba(255, 255, 255, 0.35)"
                      strokeWidth={RING_STROKE}
                    />
                    <circle
                      className="vibe-ring-progress"
                      cx={RING_SIZE / 2}
                      cy={RING_SIZE / 2}
                      r={RING_RADIUS}
                      fill="none"
                      stroke={`url(#${gradId})`}
                      strokeWidth={RING_STROKE}
                      strokeLinecap="round"
                      strokeDasharray={RING_CIRCUMFERENCE}
                      strokeDashoffset={ringOffset}
                      style={
                        {
                          '--ring-c': RING_CIRCUMFERENCE,
                          '--ring-o': ringOffset
                        } as React.CSSProperties
                      }
                    />
                  </svg>
                  <div
                    style={{
                      position: 'absolute',
                      inset: `${RING_STROKE + 1}px`,
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #FFE6F0 0%, #F3E4FF 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#9D174D',
                      fontSize: matchPercent >= 100 ? '0.54rem' : '0.62rem',
                      fontWeight: 800,
                      letterSpacing: '-0.02em',
                      lineHeight: 1,
                      boxShadow: 'inset 0 1px 2px rgba(255, 255, 255, 0.9)'
                    }}
                  >
                    {matchPercent}%
                  </div>
                </div>

                <span
                  style={{
                    fontSize: '0.72rem',
                    fontWeight: 800,
                    letterSpacing: '0.08em',
                    color: '#FFF1F7',
                    textTransform: 'uppercase',
                    textShadow: '0 1px 4px rgba(0, 0, 0, 0.3)',
                    lineHeight: 1
                  }}
                >
                  Vibe Match
                </span>
              </div>
            )}


          </div>
        </div>
      </div>
    </div>
  );
};
