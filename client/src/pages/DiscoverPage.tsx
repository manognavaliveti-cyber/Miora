import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { Button } from '../components/common/Button';
import {
  Sparkles, SlidersHorizontal, RotateCcw, Heart, X
} from 'lucide-react';
import { calculateCompatibilityScore } from '../utils/profileUtils';
import { EditorialProfileView } from '../components/discover/EditorialProfileView';
import { VibeMatchModal } from '../components/matches/VibeMatchModal';
import { Profile } from '../types';

export const DiscoverPage: React.FC = () => {
  const {
    profiles, handleLike, handlePass,
    isLoading, setCurrentView, refreshData,
    advancedFilters, openFilterModal,
    currentUser, openUpgradeModal, showToast,
    startDirectMessage
  } = useApp();

  const [exitDirection, setExitDirection] = useState<'left' | 'right' | 'up' | null>(null);
  const [showHeartAnim, setShowHeartAnim] = useState(false);
  const [showCrossAnim, setShowCrossAnim] = useState(false);
  const [shownHighMatchFor, setShownHighMatchFor] = useState<string | null>(null);
  const [upgradeShownThisSession, setUpgradeShownThisSession] = useState(false);
  const [vibeMatchProfile, setVibeMatchProfile] = useState<Profile | null>(null);
  const [vibeMatchScore, setVibeMatchScore] = useState(0);
  const [showVibeMatchModal, setShowVibeMatchModal] = useState(false);
  const exitTimer = useRef<number | null>(null);

  const FREE_DAILY_LIMIT = 30;

  const getSwipeKey = (): string | null => {
    const uid = currentUser?.id && currentUser.id !== 'user_me' ? currentUser.id : null;
    if (!uid) return null;
    return `miora_swipes_${uid}_${new Date().toISOString().split('T')[0]}`;
  };
  const getDailySwipeCount = () => {
    const k = getSwipeKey();
    return k ? parseInt(localStorage.getItem(k) || '0', 10) : 0;
  };
  const incrementDailySwipeCount = () => {
    const k = getSwipeKey();
    if (k) localStorage.setItem(k, (getDailySwipeCount() + 1).toString());
  };

  useEffect(() => {
    return () => {
      if (exitTimer.current) window.clearTimeout(exitTimer.current);
    };
  }, []);

  const filteredProfiles = profiles.filter((p: Profile) => {
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

  // Auto-like on 90%+ vibe match
  useEffect(() => {
    if (
      topProfile && topProfileComp &&
      !topProfileComp.isIncomplete &&
      topProfileComp.score > 90 &&
      shownHighMatchFor !== topProfile.id &&
      !exitDirection
    ) {
      setShownHighMatchFor(topProfile.id);
      const t = setTimeout(() => {
        showToast(`✨ ${topProfileComp.score}% Vibe Match with ${topProfile.name}! Auto-liked!`);
        requestSwipe('right');
      }, 900);
      return () => clearTimeout(t);
    }
  }, [topProfile?.id, topProfileComp?.score]);

  const hasCustomFilters =
    advancedFilters.verifiedOnly ||
    (advancedFilters.maxDistanceKm ?? 50) < 50 ||
    (advancedFilters.minCompatibility ?? 70) > 70 ||
    (advancedFilters.maxAge ?? 35) < 35 ||
    (advancedFilters.minAge ?? 18) > 18 ||
    !!advancedFilters.relationshipIntent ||
    !!advancedFilters.drinking || !!advancedFilters.smoking ||
    !!advancedFilters.workout || !!advancedFilters.zodiac || !!advancedFilters.education;

  const requestSwipe = (direction: 'left' | 'right' | 'up') => {
    if (!topProfile || exitDirection) return;
    if (!currentUser?.isPremium) {
      const count = getDailySwipeCount();
      if (count >= FREE_DAILY_LIMIT) {
        if (!upgradeShownThisSession) {
          setUpgradeShownThisSession(true);
          showToast('Daily limit reached! Upgrade for unlimited swipes ✨');
          openUpgradeModal();
        }
        return;
      }
    }
    incrementDailySwipeCount();
    const id = topProfile.id;

    // Capture vibe score before the profile is swiped away
    const comp = calculateCompatibilityScore(currentUser, topProfile);
    const isHighVibe = !comp.isIncomplete && comp.score >= 90 && (direction === 'right' || direction === 'up');
    if (isHighVibe) {
      setVibeMatchProfile({ ...topProfile });
      setVibeMatchScore(comp.score);
    }

    setExitDirection(direction);
    if (direction === 'right' || direction === 'up') {
      setShowHeartAnim(true);
      setTimeout(() => setShowHeartAnim(false), 720);
    } else {
      setShowCrossAnim(true);
      setTimeout(() => setShowCrossAnim(false), 720);
    }
    exitTimer.current = window.setTimeout(() => {
      if (direction === 'right') handleLike(id, false);
      else if (direction === 'left') handlePass(id);
      else handleLike(id, true);
      setExitDirection(null);
      exitTimer.current = null;

      // Show vibe match modal after the card exits for 90%+ matches
      if (isHighVibe) {
        setTimeout(() => setShowVibeMatchModal(true), 200);
      }
    }, 360);
  };

  if (isLoading) {
    return (
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '20px',
        minHeight: '65vh'
      }}>
        <div style={{
          width: '68px',
          height: '68px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg,#8B1E3F 0%,#681028 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 12px 36px rgba(139,30,63,0.35)',
          animation: 'heartBeat 1.4s infinite ease-in-out'
        }}>
          <Heart size={30} fill="#FFFFFF" color="#FFFFFF" />
        </div>
        <div style={{ textAlign: 'center' }}>
          <h3 style={{ fontSize: '1.1rem', color: '#E11D48', fontWeight: 800, margin: 0 }}>
            Curating Your Matches
          </h3>
          <p style={{ fontSize: '0.82rem', color: '#7A5565', marginTop: '6px' }}>
            Finding people aligned with your vibe…
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <style>{`
        @keyframes whiteFlashBackdrop {
          0% {
            opacity: 0;
          }
          15% {
            opacity: 1;
          }
          70% {
            opacity: 1;
          }
          100% {
            opacity: 0;
          }
        }

        @keyframes swipeIconPop {
          0% {
            opacity: 0;
            transform: scale(0.35) translateY(16px);
          }
          32% {
            opacity: 1;
            transform: scale(1.15) translateY(0px);
          }
          52% {
            transform: scale(0.96);
          }
          72% {
            opacity: 1;
            transform: scale(1.04);
          }
          100% {
            opacity: 0;
            transform: scale(0.88) translateY(-18px);
          }
        }

        .swipe-flash-overlay {
          position: absolute;
          inset: 0;
          z-index: 9999;
          background: #FFFFFF;
          display: flex;
          align-items: center;
          justify-content: center;
          pointer-events: none;
          animation: whiteFlashBackdrop 720ms cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .swipe-icon-wrapper {
          animation: swipeIconPop 720ms cubic-bezier(0.16, 1, 0.3, 1) forwards;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .discover-page-container {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          width: 100%;
          height: 100%;
          height: 100%;
          min-height: 0;
          box-sizing: border-box;
          overflow: hidden;
          position: relative;
        }
      `}</style>

      <div className="discover-page-container">
        {/* Visual feedback popup on pure white screen overlay */}
        {(showHeartAnim || showCrossAnim) && (
          <div className="swipe-flash-overlay">
            {showHeartAnim && (
              <div className="swipe-icon-wrapper">
                <div
                  style={{
                    width: '112px',
                    height: '112px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #FF3366 0%, #E11D48 50%, #BE123C 100%)',
                    boxShadow: '0 16px 48px rgba(225, 29, 72, 0.32), 0 0 0 16px rgba(254, 226, 235, 0.8)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Heart size={56} fill="#FFFFFF" color="#FFFFFF" strokeWidth={0} />
                </div>
              </div>
            )}
            {showCrossAnim && (
              <div className="swipe-icon-wrapper">
                <div
                  style={{
                    width: '112px',
                    height: '112px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #71717A 0%, #3F3F46 100%)',
                    boxShadow: '0 16px 48px rgba(63, 63, 70, 0.28), 0 0 0 16px rgba(244, 244, 245, 0.85)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <X size={54} color="#FFFFFF" strokeWidth={3.5} />
                </div>
              </div>
            )}
          </div>
        )}

        {topProfile ? (
          <EditorialProfileView
            key={topProfile.id}
            profile={topProfile}
            onSwipe={requestSwipe}
            onMessage={() => {
              if (topProfile.isRealUser) startDirectMessage(topProfile);
            }}
            exitDirection={exitDirection}
            isTopCard={true}
          />
        ) : (
          /* ─── All Caught Up / Empty State ─── */
          <div style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            padding: '40px 24px',
            gap: '20px',
            boxSizing: 'border-box'
          }}>
            <div style={{
              width: '84px',
              height: '84px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg,#881337 0%,#BE123C 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 12px 32px rgba(139,30,63,0.32)',
              animation: 'heartBeat 2s infinite ease-in-out'
            }}>
              <Sparkles size={36} color="#FFFFFF" />
            </div>
            <div>
              <h2 style={{ fontSize: '1.6rem', fontWeight: 900, color: '#1F161A', margin: '0 0 8px 0' }}>
                {hasCustomFilters ? 'No Matches Found' : "You're All Caught Up"}
              </h2>
              <p style={{ fontSize: '0.88rem', color: '#7A5565', lineHeight: 1.6, margin: 0, maxWidth: 360 }}>
                {hasCustomFilters
                  ? 'Nobody nearby fits this filter combination. Loosen a filter and try again.'
                  : "You've seen everyone nearby. Refresh your stack or update your preferences."}
              </p>
            </div>
            <div style={{ display: 'flex', gap: '12px', width: '100%', maxWidth: '340px' }}>
              {hasCustomFilters ? (
                <Button onClick={openFilterModal} variant="primary" size="md" fullWidth>
                  <SlidersHorizontal size={14} /><span>Edit Filters</span>
                </Button>
              ) : (
                <Button onClick={() => setCurrentView('dating-preferences')} variant="primary" size="md" fullWidth>
                  <SlidersHorizontal size={14} /><span>Preferences</span>
                </Button>
              )}
              <Button onClick={() => refreshData()} variant="outline" size="md" fullWidth>
                <RotateCcw size={14} /><span>Refresh</span>
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Vibe Match Modal — shown for 90%+ compatibility matches */}
      {vibeMatchProfile && (
        <VibeMatchModal
          isOpen={showVibeMatchModal}
          currentUserPhoto={
            currentUser.photos?.[0] ||
            'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80'
          }
          currentUserName={currentUser.name || 'You'}
          matchedProfile={vibeMatchProfile}
          vibeScore={vibeMatchScore}
          onStartChat={() => {
            setShowVibeMatchModal(false);
            if (vibeMatchProfile.isRealUser) {
              startDirectMessage(vibeMatchProfile);
            }
            setVibeMatchProfile(null);
          }}
          onDismiss={() => {
            setShowVibeMatchModal(false);
            setVibeMatchProfile(null);
          }}
        />
      )}
    </>
  );
};
