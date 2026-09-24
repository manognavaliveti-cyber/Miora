import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { ActionButtons } from '../components/discover/ActionButtons';
import { SwipeCard } from '../components/discover/SwipeCard';
import { Button } from '../components/common/Button';
import { Sparkles, SlidersHorizontal, RotateCcw, Heart } from 'lucide-react';

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
    openFilterModal
  } = useApp();

  const [animateDeck, setAnimateDeck] = useState(false);
  const [exitDirection, setExitDirection] = useState<'left' | 'right' | 'up' | null>(null);
  const exitTimer = useRef<number | null>(null);

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

  // No unfiltered fallback here — if the person's filters are this strict,
  // the empty state below (and its "Edit Filters" shortcut) is the honest result.
  const topProfile = filteredProfiles[0] || null;

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

  // Single swipe entry point for both card drag and the dock buttons:
  // fly the top card off-screen first, then commit the like/pass.
  const requestSwipe = (direction: 'left' | 'right' | 'up') => {
    if (!topProfile || exitDirection) return;
    const id = topProfile.id;
    setExitDirection(direction);
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
          <h3 style={{ fontSize: '1.25rem', color: '#5C1D2C', fontWeight: 800 }}>
            Curating Aesthetic Connections
          </h3>
          <p style={{ fontSize: '0.88rem', color: '#8C5261', marginTop: '4px' }}>
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
        maxWidth: '420px',
        margin: '0 auto',
        padding: '4px 10px 28px 10px',
        boxSizing: 'border-box'
      }}
    >
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
              height: 'clamp(340px, calc(100dvh - 270px), 540px)',
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
            <h2 style={{ fontSize: '1.65rem', fontWeight: 800, color: '#3A121A', margin: 0 }}>
              {hasCustomFilters ? 'No Matches For These Filters' : 'All Caught Up'}
            </h2>
            <p style={{ fontSize: '0.88rem', color: '#6B3845', marginTop: '6px', lineHeight: 1.5 }}>
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
