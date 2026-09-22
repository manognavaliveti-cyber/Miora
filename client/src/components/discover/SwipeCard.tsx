import React, { useState, useRef } from 'react';
import { Profile } from '../../types';
import { Heart, X, MapPin } from 'lucide-react';

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

  // Stamp opacities
  const isExiting = isTopCard && !!exitDirection;
  const likeOpacity = isExiting
    ? (exitDirection === 'right' ? 1 : 0)
    : Math.min(Math.max(dragOffset.x / 80, 0), 1);
  const passOpacity = isExiting
    ? (exitDirection === 'left' ? 1 : 0)
    : Math.min(Math.max(-dragOffset.x / 80, 0), 1);

  // City only (e.g. "Hyderabad, India" -> "Hyderabad")
  const city = (profile.location || '').split(',')[0].trim();
  const matchPercent = Math.max(0, Math.min(100, Math.round(profile.compatibility || 0)));
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
        background: '#1A0E14',
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
            ? '0 22px 50px rgba(92, 29, 44, 0.30)'
            : '0 8px 24px rgba(92, 29, 44, 0.12)',
          border: '1.5px solid rgba(255, 255, 255, 0.35)'
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

        {/* Swipe Overlay Stamps */}
        {isTopCard && (
          <>
            {/* LIKE Stamp */}
            <div
              style={{
                position: 'absolute',
                top: '40px',
                left: '24px',
                border: '3.5px solid #10B981',
                color: '#10B981',
                borderRadius: '16px',
                padding: '6px 18px',
                fontSize: '1.4rem',
                fontWeight: 900,
                transform: 'rotate(-14deg)',
                opacity: likeOpacity,
                pointerEvents: 'none',
                zIndex: 10,
                background: 'rgba(16, 185, 129, 0.12)',
                backdropFilter: 'blur(6px)',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Heart size={22} fill="#10B981" /> LIKE
            </div>

            {/* PASS Stamp */}
            <div
              style={{
                position: 'absolute',
                top: '40px',
                right: '24px',
                border: '3.5px solid #F43F5E',
                color: '#F43F5E',
                borderRadius: '16px',
                padding: '6px 18px',
                fontSize: '1.4rem',
                fontWeight: 900,
                transform: 'rotate(14deg)',
                opacity: passOpacity,
                pointerEvents: 'none',
                zIndex: 10,
                background: 'rgba(244, 63, 94, 0.12)',
                backdropFilter: 'blur(6px)',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <X size={22} strokeWidth={3} /> PASS
            </div>
          </>
        )}

        {/* Soft top scrim so the location text blends into the photo without a box */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '110px',
            background: 'linear-gradient(to bottom, rgba(16, 6, 12, 0.42) 0%, rgba(16, 6, 12, 0) 100%)',
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
            padding: `40px ${CARD_PAD}px ${CARD_PAD}px ${CARD_PAD}px`,
            background: 'linear-gradient(to top, rgba(16, 6, 12, 0.9) 0%, rgba(16, 6, 12, 0.5) 58%, rgba(0, 0, 0, 0) 100%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            zIndex: 5,
            cursor: 'pointer'
          }}
        >
          {/* Name, Age */}
          <h2
            style={{
              fontSize: '1.7rem',
              fontWeight: 900,
              color: '#FFFFFF',
              letterSpacing: '-0.02em',
              margin: 0,
              lineHeight: 1.15
            }}
          >
            {profile.name}, {profile.age}
          </h2>

          {/* Profession */}
          {profile.occupation && (
            <div
              style={{
                fontSize: '0.85rem',
                color: 'rgba(255, 255, 255, 0.88)',
                fontWeight: 500,
                margin: '3px 0 0 0',
                lineHeight: 1.2
              }}
            >
              {profile.occupation}
            </div>
          )}

          {/* Vibe Match: pastel ring + glass pill */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '9px',
              marginTop: '12px',
              padding: '4px 15px 4px 4px',
              borderRadius: '9999px',
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.26) 0%, rgba(255, 214, 232, 0.14) 55%, rgba(226, 214, 255, 0.16) 100%)',
              backdropFilter: 'blur(18px) saturate(160%)',
              WebkitBackdropFilter: 'blur(18px) saturate(160%)',
              border: '1px solid rgba(255, 255, 255, 0.45)',
              boxShadow: '0 6px 18px rgba(0, 0, 0, 0.18), inset 0 1px 0 rgba(255, 255, 255, 0.5)'
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
                fontSize: '0.7rem',
                fontWeight: 800,
                letterSpacing: '0.09em',
                color: '#FFF1F7',
                textTransform: 'uppercase',
                textShadow: '0 1px 4px rgba(0, 0, 0, 0.3)',
                lineHeight: 1
              }}
            >
              Vibe Match
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
