import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { ActionButtons } from '../components/discover/ActionButtons';
import { SwipeCard } from '../components/discover/SwipeCard';
import { Button } from '../components/common/Button';
import { Sparkles, SlidersHorizontal, RotateCcw, Heart, X } from 'lucide-react';
import { calculateCompatibilityScore } from '../utils/profileUtils';

export const DiscoverPage: React.FC = () => {
  const {
    profiles,
    handleLike,
    handlePass,
    openProfileDetail,
    isLoading,
    setCurrentView,
    refreshData,
    advancedFilters,
    openFilterModal,
    currentUser,
    openUpgradeModal,
    showToast
  } = useApp();

  const [animateDeck, setAnimateDeck] = useState(false);
  const [exitDirection, setExitDirection] = useState<'left' | 'right' | 'up' | null>(null);
  const [showHeartAnim, setShowHeartAnim] = useState(false);
  const [showCrossAnim, setShowCrossAnim] = useState(false);
  const [shownHighMatchFor, setShownHighMatchFor] = useState<string | null>(null);
  const [isHighMatchPopupOpen, setIsHighMatchPopupOpen] = useState(false);
  const exitTimer = useRef<number | null>(null);

  // Daily Swipe Limit Tracking (30 Swipes / Day)
  const getDailySwipeCount = (): number => {
    const today = new Date().toISOString().split('T')[0];
    const key = `miora_daily_swipes_${currentUser?.id || 'me'}_${today}`;
    const raw = localStorage.getItem(key);
    return raw ? parseInt(raw, 10) : 0;
  };

  const incrementDailySwipeCount = (): number => {
    const today = new Date().toISOString().split('T')[0];
    const key = `miora_daily_swipes_${currentUser?.id || 'me'}_${today}`;
    const nextCount = getDailySwipeCount() + 1;
    localStorage.setItem(key, nextCount.toString());
    return nextCount;
  };

  // Clear any pending swipe timer on unmount
  useEffect(() => {
    return () => {
      if (exitTimer.current) window.clearTimeout(exitTimer.current);
    };
  }, []);

  // Trigger stacked-card entrance animation when Home mounts
  useEffect(() => {
    setAnimateDeck(false);
    const timer = setTimeout(() => {
      setAnimateDeck(true);
    }, 40);
    return () => clearTimeout(timer);
  }, []);

  // Filter profiles according to the Discovery Filters the user has applied
  const filteredProfiles = profiles.filter((p) => {
    if (advancedFilters.verifiedOnly && !p.verified) return false;
    if ((p.distanceKm ?? 0) > (advancedFilters.maxDistanceKm || 50)) return false;
    if (p.age < (advancedFilters.minAge ?? 18) || p.age > (advancedFilters.maxAge ?? 99)) return false;
    if (p.compatibility < (advancedFilters.minCompatibility || 0)) return false;
    if (advancedFilters.relationshipIntent && p.relationshipIntent !== advancedFilters.relationshipIntent) return false;
    if (advancedFilters.drinking && p.lifestyle?.drinking !== advancedFilters.drinking) return false;
    if (advancedFilters.smoking && p.lifestyle?.smoking !== advancedFilters.smoking) return false;
    if (advancedFilters.workout && p.lifestyle?.workout !== advancedFilters.workout) return false;
    if (advancedFilters.zodiac && !p.lifestyle?.zodiac?.startsWith(advancedFilters.zodiac)) return false;
    if (advancedFilters.education && p.education !== advancedFilters.education) return false;
    return true;
  });

  const topProfile = filteredProfiles[0] || null;
  const topProfileComp = topProfile ? calculateCompatibilityScore(currentUser, topProfile) : null;

  // Trigger High Vibe Match Popup if calculated match > 90%
  useEffect(() => {
    if (
      topProfile &&
      topProfileComp &&
      !topProfileComp.isIncomplete &&
      topProfileComp.score > 90 &&
      shownHighMatchFor !== topProfile.id
    ) {
      setShownHighMatchFor(topProfile.id);
      setIsHighMatchPopupOpen(true);
    }
  }, [topProfile?.id, topProfileComp?.score]);

  const hasCustomFilters =
    advancedFilters.verifiedOnly ||
    (advancedFilters.maxDistanceKm ?? 50) < 50 ||
    (advancedFilters.minCompatibility ?? 70) > 70 ||
    (advancedFilters.maxAge ?? 35) < 35 ||
    (advancedFilters.minAge ?? 18) > 18 ||
    !!advancedFilters.relationshipIntent ||
    !!advancedFilters.drinking ||
    !!advancedFilters.smoking ||
    !!advancedFilters.workout ||
    !!advancedFilters.zodiac ||
    !!advancedFilters.education;

  // Single swipe entry point for both card drag and dock buttons
  const requestSwipe = (direction: 'left' | 'right' | 'up') => {
    if (!topProfile || exitDirection) return;

    // REQUIREMENT: Plans popup MUST appear ONLY after 30 swipes in a day for free users
    if (!currentUser?.isPremium) {
      const swipesToday = getDailySwipeCount();
      if (swipesToday >= 30) {
        showToast('Daily limit of 30 swipes reached! Upgrade to MIORA PRO for unlimited swipes ✨');
        openUpgradeModal();
        return;
      }
    }

    incrementDailySwipeCount();
    const id = topProfile.id;
    setExitDirection(direction);

    if (direction === 'right' || direction === 'up') {
      setShowHeartAnim(true);
      setTimeout(() => setShowHeartAnim(false), 850);
    } else if (direction === 'left') {
      setShowCrossAnim(true);
      setTimeout(() => setShowCrossAnim(false), 850);
    }

    exitTimer.current = window.setTimeout(() => {
      if (direction === 'right') handleLike(id, false);
      else if (direction === 'left') handlePass(id);
      else handleLike(id, true);
      setExitDirection(null);
      exitTimer.current = null;
    }, 300);
  };

  if (isLoading) {
    return (
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '18px',
          minHeight: '65vh'
        }}
      >
        <div
          style={{
            width: '68px',
            height: '68px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #8B1E3F 0%, #681028 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 10px 30px rgba(139, 30, 63, 0.35)',
            animation: 'heartBeat 1.4s infinite ease-in-out'
          }}
        >
          <Heart size={34} fill="#FFFFFF" color="#FFFFFF" />
        </div>
        <div style={{ textAlign: 'center' }}>
          <h3 style={{ fontSize: '1.25rem', color: '#E11D48', fontWeight: 800 }}>
            Curating Aesthetic Connections
          </h3>
          <p style={{ fontSize: '0.88rem', color: 'rgba(255, 255, 255, 0.65)', marginTop: '4px' }}>
            Finding exceptional matches aligned with your lifestyle...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        maxWidth: '440px',
        margin: '0 auto',
        padding: '4px 10px 24px 10px',
        boxSizing: 'border-box',
        position: 'relative'
      }}
    >
      <style>{`
        @keyframes floatUpHeart {
          0% { opacity: 0; transform: translate(-50%, -40%) scale(0.4); }
          40% { opacity: 1; transform: translate(-50%, -80%) scale(1.25); }
          70% { opacity: 0.9; transform: translate(-50%, -120%) scale(1.1); }
          100% { opacity: 0; transform: translate(-50%, -170%) scale(0.9); }
        }
        @keyframes floatUpCross {
          0% { opacity: 0; transform: translate(-50%, -40%) scale(0.4); }
          40% { opacity: 1; transform: translate(-50%, -80%) scale(1.25); }
          70% { opacity: 0.9; transform: translate(-50%, -120%) scale(1.1); }
          100% { opacity: 0; transform: translate(-50%, -170%) scale(0.9); }
        }
        .floating-like-heart {
          animation: floatUpHeart 850ms cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .floating-pass-cross {
          animation: floatUpCross 850ms cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>

      {/* Floating Heart Feedback Animation (Right Swipe) */}
      {showHeartAnim && (
        <div
          className="floating-like-heart"
          style={{
            position: 'absolute',
            top: '40%',
            right: '25%',
            zIndex: 99,
            pointerEvents: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(16, 185, 129, 0.95) 0%, rgba(5, 150, 105, 0.85) 100%)',
            boxShadow: '0 12px 40px rgba(16, 185, 129, 0.65)'
          }}
        >
          <Heart size={42} fill="#FFFFFF" color="#FFFFFF" />
        </div>
      )}

      {/* Floating Cross Feedback Animation (Left Swipe) */}
      {showCrossAnim && (
        <div
          className="floating-pass-cross"
          style={{
            position: 'absolute',
            top: '40%',
            left: '25%',
            zIndex: 99,
            pointerEvents: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(244, 63, 94, 0.95) 0%, rgba(225, 29, 72, 0.85) 100%)',
            boxShadow: '0 12px 40px rgba(244, 63, 94, 0.65)'
          }}
        >
          <X size={44} strokeWidth={3} color="#FFFFFF" />
        </div>
      )}

      {/* HIGH VIBE MATCH POPUP (>90%) */}
      {isHighMatchPopupOpen && topProfile && topProfileComp && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 10001,
            background: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            animation: 'fadeIn 0.25s ease-out'
          }}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '360px',
              background: '#FFFFFF',
              border: '1.5px solid rgba(244, 63, 94, 0.25)',
              borderRadius: '28px',
              padding: '28px 24px',
              textAlign: 'center',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.18), 0 0 30px rgba(244, 63, 94, 0.15)',
              position: 'relative'
            }}
          >
            <button
              onClick={() => setIsHighMatchPopupOpen(false)}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                background: 'rgba(244, 63, 94, 0.08)',
                border: 'none',
                color: '#8F7B85',
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              <X size={16} />
            </button>

            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #F43F5E 0%, #BE123C 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px auto',
                boxShadow: '0 8px 24px rgba(244, 63, 94, 0.35)',
                animation: 'heartBeat 1.4s infinite ease-in-out'
              }}
            >
              <Sparkles size={32} color="#FFFFFF" />
            </div>

            <span
              style={{
                fontSize: '0.75rem',
                fontWeight: 800,
                letterSpacing: '0.12em',
                color: '#BE123C',
                textTransform: 'uppercase'
              }}
            >
              ✨ High Vibe Match!
            </span>

            <h3 style={{ fontSize: '1.75rem', fontWeight: 900, color: '#1F161A', margin: '6px 0 4px 0' }}>
              {topProfileComp.score}% Vibe Match
            </h3>

            <p style={{ fontSize: '0.9rem', color: '#5C4751', lineHeight: 1.4, margin: '8px 0 20px 0' }}>
              You & <strong style={{ color: '#F43F5E' }}>{topProfile.name}</strong> are seriously on the same wavelength.
            </p>

            <button
              onClick={() => {
                setIsHighMatchPopupOpen(false);
                openProfileDetail(topProfile);
              }}
              style={{
                width: '100%',
                background: 'linear-gradient(135deg, #F43F5E 0%, #E11D48 100%)',
                color: '#FFFFFF',
                border: 'none',
                padding: '12px 20px',
                borderRadius: '9999px',
                fontWeight: 800,
                fontSize: '0.92rem',
                cursor: 'pointer',
                boxShadow: '0 6px 20px rgba(244, 63, 94, 0.4)'
              }}
            >
              Explore Profile ✨
            </button>
          </div>
        </div>
      )}

      {topProfile ? (
        <div
          className={animateDeck ? 'card-deck-animated' : ''}
          style={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            boxSizing: 'border-box'
          }}
        >
          {/* Main Profile Card Deck */}
          <div
            style={{
              position: 'relative',
              width: '100%',
              height: 'clamp(360px, calc(100dvh - 230px), 560px)',
              borderRadius: '28px',
              boxSizing: 'border-box'
            }}
          >
            {filteredProfiles[2] && (
              <SwipeCard
                key={filteredProfiles[2].id}
                profile={filteredProfiles[2]}
                onSwipe={() => {}}
                onOpenDetails={() => openProfileDetail(filteredProfiles[2])}
                isTopCard={false}
                stackIndex={2}
              />
            )}
            {filteredProfiles[1] && (
              <SwipeCard
                key={filteredProfiles[1].id}
                profile={filteredProfiles[1]}
                onSwipe={() => {}}
                onOpenDetails={() => openProfileDetail(filteredProfiles[1])}
                isTopCard={false}
                stackIndex={1}
              />
            )}
            {topProfile && (
              <SwipeCard
                key={topProfile.id}
                profile={topProfile}
                onSwipe={requestSwipe}
                onOpenDetails={() => openProfileDetail(topProfile)}
                isTopCard={true}
                stackIndex={0}
                exitDirection={exitDirection}
              />
            )}
          </div>

          {/* Action dock: always UNDER the deck, never on a card */}
          <ActionButtons
            onPass={() => requestSwipe('left')}
            onLike={() => requestSwipe('right')}
            onInfo={() => openProfileDetail(topProfile)}
            disabled={!!exitDirection}
          />
        </div>
      ) : (
        /* All Caught Up Minimal View */
        <div
          className="card-neumorphic"
          style={{
            width: '100%',
            maxWidth: '440px',
            margin: '40px auto',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            padding: '48px 28px',
            gap: '18px'
          }}
        >
          <div
            style={{
              width: '76px',
              height: '76px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #8B1E3F 0%, #681028 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              boxShadow: '0 8px 24px rgba(139, 30, 63, 0.3)'
            }}
          >
            <Sparkles size={36} color="#FFFFFF" />
          </div>

          <div>
            <h2 style={{ fontSize: '1.65rem', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
              {hasCustomFilters ? 'No Matches For These Filters' : 'All Caught Up'}
            </h2>
            <p style={{ fontSize: '0.88rem', color: 'rgba(255, 255, 255, 0.7)', marginTop: '6px', lineHeight: 1.5 }}>
              {hasCustomFilters
                ? 'Nobody nearby fits this combination yet. Loosen a filter or two and try again.'
                : "You've viewed all profiles nearby. Adjust your preferences or refresh your stack!"}
            </p>
          </div>

          <div style={{ display: 'flex', gap: '12px', width: '100%', maxWidth: '340px', marginTop: '4px' }}>
            {hasCustomFilters ? (
              <Button onClick={openFilterModal} variant="primary" size="md" fullWidth>
                <SlidersHorizontal size={15} />
                <span>Edit Filters</span>
              </Button>
            ) : (
              <Button onClick={() => setCurrentView('dating-preferences')} variant="primary" size="md" fullWidth>
                <SlidersHorizontal size={15} />
                <span>Preferences</span>
              </Button>
            )}
            <Button onClick={() => refreshData()} variant="outline" size="md" fullWidth>
              <RotateCcw size={15} />
              <span>Reset Stack</span>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

