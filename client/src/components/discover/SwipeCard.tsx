import React, { useState, useRef } from 'react';
import { Profile } from '../../types';
import { Info, Sparkles, MapPin, Heart, X, Star, CheckCircle2, ShieldCheck } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface SwipeCardProps {
  profile: Profile;
  onSwipe: (direction: 'left' | 'right' | 'up') => void;
  onOpenDetails: () => void;
  isTopCard?: boolean;
}

export const SwipeCard: React.FC<SwipeCardProps> = ({
  profile,
  onSwipe,
  onOpenDetails,
  isTopCard = false
}) => {
  const { verifyProfileWithCoins, unlockedVerificationIds } = useApp();
  const [photoIndex, setPhotoIndex] = useState(0);
  const isVerifiedUnlocked = unlockedVerificationIds.includes(profile.id);
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

  const rotation = isTopCard ? dragOffset.x * 0.07 : 0;
  const currentPhoto =
    profile.photos[photoIndex] ||
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&q=80';

  // Stamp opacities
  const likeOpacity = Math.min(Math.max(dragOffset.x / 80, 0), 1);
  const passOpacity = Math.min(Math.max(-dragOffset.x / 80, 0), 1);
  const superLikeOpacity = Math.min(Math.max(-dragOffset.y / 80, 0), 1);

  return (
    <div
      style={{
        position: 'absolute',
        width: '100%',
        height: '100%',
        borderRadius: 'var(--radius-xl)',
        overflow: 'hidden',
        boxShadow: isTopCard
          ? '0 24px 54px rgba(76, 5, 25, 0.18)'
          : '0 12px 32px rgba(76, 5, 25, 0.08)',
        background: '#1A0E14',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        transform: isTopCard
          ? `translate3d(${dragOffset.x}px, ${dragOffset.y}px, 0) rotate(${rotation}deg)`
          : 'scale(0.96) translateY(14px)',
        transition: isDragging ? 'none' : 'transform 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
        cursor: isTopCard ? 'grab' : 'default',
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
              top: '36px',
              left: '24px',
              border: '3.5px solid #10B981',
              color: '#10B981',
              borderRadius: '16px',
              padding: '6px 18px',
              fontSize: '1.4rem',
              fontWeight: 900,
              fontFamily: 'var(--font-display)',
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
              top: '36px',
              right: '24px',
              border: '3.5px solid #F43F5E',
              color: '#F43F5E',
              borderRadius: '16px',
              padding: '6px 18px',
              fontSize: '1.4rem',
              fontWeight: 900,
              fontFamily: 'var(--font-display)',
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

          {/* SUPER LIKE Stamp */}
          <div
            style={{
              position: 'absolute',
              bottom: '180px',
              left: '50%',
              transform: 'translateX(-50%)',
              border: '3.5px solid var(--gold-champagne)',
              color: 'var(--gold-champagne)',
              borderRadius: '16px',
              padding: '6px 18px',
              fontSize: '1.3rem',
              fontWeight: 900,
              fontFamily: 'var(--font-display)',
              opacity: superLikeOpacity,
              pointerEvents: 'none',
              zIndex: 10,
              background: 'rgba(212, 175, 55, 0.18)',
              backdropFilter: 'blur(6px)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Star size={22} fill="var(--gold-champagne)" /> SUPER LIKE
          </div>
        </>
      )}

      {/* Top Photo Navigation Indicators */}
      {totalPhotos > 1 && (
        <div
          style={{
            position: 'absolute',
            top: '12px',
            left: '12px',
            right: '12px',
            display: 'flex',
            gap: '6px',
            zIndex: 5
          }}
        >
          {profile.photos.map((_, idx) => (
            <div
              key={idx}
              style={{
                flex: 1,
                height: '4px',
                borderRadius: '2px',
                background: idx === photoIndex ? '#FFFFFF' : 'rgba(255, 255, 255, 0.35)',
                transition: 'background var(--transition-fast)'
              }}
            />
          ))}
        </div>
      )}

      {/* Tap Zones for Cycling Photos */}
      <div
        onClick={handlePrevPhoto}
        style={{
          position: 'absolute',
          top: '30px',
          left: 0,
          width: '35%',
          height: '60%',
          zIndex: 4
        }}
      />
      <div
        onClick={handleNextPhoto}
        style={{
          position: 'absolute',
          top: '30px',
          right: 0,
          width: '35%',
          height: '60%',
          zIndex: 4
        }}
      />

      {/* Bottom Gradient Scrim & Profile Presentation */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          padding: 'clamp(28px, 6vw, 48px) clamp(16px, 4vw, 24px) clamp(14px, 3vw, 22px) clamp(16px, 4vw, 24px)',
          background: 'linear-gradient(to top, rgba(24, 10, 16, 0.96) 0%, rgba(24, 10, 16, 0.75) 55%, rgba(0, 0, 0, 0) 100%)',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          zIndex: 5
        }}
      >
        {/* Top Badges Row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <div className="vibe-badge">
              <Sparkles size={13} color="var(--gold-champagne)" fill="var(--gold-champagne)" />
              <span style={{ fontSize: '0.78rem' }}>{profile.compatibility}% Vibe Match</span>
            </div>

            {/* 60-Coin Verification Status Check */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                verifyProfileWithCoins(profile.id, profile.name);
              }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                padding: '5px 11px',
                borderRadius: 'var(--radius-pill)',
                background: isVerifiedUnlocked
                  ? 'rgba(16, 185, 129, 0.28)'
                  : 'rgba(254, 240, 138, 0.25)',
                border: isVerifiedUnlocked
                  ? '1px solid #10B981'
                  : '1px solid rgba(253, 224, 71, 0.7)',
                color: isVerifiedUnlocked ? '#10B981' : '#FDE047',
                fontSize: '0.74rem',
                fontWeight: 800,
                backdropFilter: 'blur(10px)',
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
              }}
              title={isVerifiedUnlocked ? 'Verified Authentic Profile' : 'Click to verify authenticity for 60 coins'}
            >
              <ShieldCheck size={13} color={isVerifiedUnlocked ? '#10B981' : '#FDE047'} />
              <span>{isVerifiedUnlocked ? '🛡️ 100% Verified' : 'Check Verified (60 🪙)'}</span>
            </button>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onOpenDetails();
            }}
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.22)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.35)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
              transition: 'transform var(--transition-fast)'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.08)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            aria-label="View Profile Details"
          >
            <Info size={18} />
          </button>
        </div>

        {/* Name, Age, Verification */}
        <div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', flexWrap: 'wrap' }}>
            <h2
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: 'clamp(1.5rem, 4.5vw, 2rem)',
                fontWeight: 800,
                color: '#FFFFFF',
                letterSpacing: '-0.02em',
                lineHeight: 1.1
              }}
            >
              {profile.name}
            </h2>
            <span
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(1.2rem, 3.8vw, 1.6rem)',
                fontWeight: 600,
                color: 'rgba(255, 255, 255, 0.9)'
              }}
            >
              {profile.age}
            </span>
            <CheckCircle2 size={18} color="var(--gold-champagne)" fill="rgba(212, 175, 55, 0.2)" />
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              color: 'rgba(255, 255, 255, 0.85)',
              fontSize: '0.84rem',
              marginTop: '2px',
              flexWrap: 'wrap'
            }}
          >
            <MapPin size={13} color="var(--rose-petal)" />
            <span>{profile.location}</span>
            <span style={{ opacity: 0.5 }}>•</span>
            <span style={{ opacity: 0.9 }}>{profile.distanceKm} km away</span>
          </div>
        </div>

        {/* Bio Snippet */}
        <p
          style={{
            color: 'rgba(255, 255, 255, 0.9)',
            fontSize: '0.9rem',
            lineHeight: 1.4,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}
        >
          {profile.bio}
        </p>

        {/* Interests Pills */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '2px', width: '100%' }}>
          {profile.interests.slice(0, 3).map((item) => (
            <span
              key={item}
              style={{
                padding: '4px 12px',
                borderRadius: 'var(--radius-pill)',
                background: 'rgba(255, 255, 255, 0.16)',
                backdropFilter: 'blur(6px)',
                color: '#FFFFFF',
                fontSize: '0.78rem',
                fontWeight: 600,
                border: '1px solid rgba(255, 255, 255, 0.2)'
              }}
            >
              {item}
            </span>
          ))}
          {profile.interests.length > 3 && (
            <span
              style={{
                padding: '4px 8px',
                borderRadius: 'var(--radius-pill)',
                background: 'rgba(255, 255, 255, 0.12)',
                color: 'rgba(255, 255, 255, 0.85)',
                fontSize: '0.78rem',
                fontWeight: 600
              }}
            >
              +{profile.interests.length - 3}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
