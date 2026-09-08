import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { SwipeCard } from '../components/discover/SwipeCard';
import { ActionButtons } from '../components/discover/ActionButtons';
import { SpotlightCarousel } from '../components/discover/SpotlightCarousel';
import { Button } from '../components/common/Button';
import {
  Sparkles,
  SlidersHorizontal,
  RotateCcw,
  Heart,
  Flame,
  Check,
  MapPin,
  Briefcase,
  GraduationCap,
  Info,
  ShieldCheck,
  Compass,
  Filter,
  CheckCircle2,
  MessageCircle,
  User,
  ArrowRight,
  Crown,
  Rocket,
  Eye,
  Star,
  Zap
} from 'lucide-react';

export const DiscoverPage: React.FC = () => {
  const {
    profiles,
    matches,
    handleLike,
    handlePass,
    openProfileDetail,
    openChatWithMatch,
    isLoading,
    setCurrentView,
    refreshData,
    currentUser,
    updateUserPreferences,
    spotlightProfiles,
    whoLikedMeProfiles,
    advancedFilters,
    openUpgradeModal,
    openBoostModal,
    openWhoLikedMeModal,
    openFilterModal,
    isBoostActive,
    boostTimeRemainingFormatted
  } = useApp();

  const [selectedGender, setSelectedGender] = useState<string>(currentUser.preferences.interestedIn || 'all');
  const [maxDist, setMaxDist] = useState<number>(currentUser.preferences.maxDistanceKm || 50);

  const handleSwipe = async (direction: 'left' | 'right' | 'up', profileId: string) => {
    if (direction === 'left') {
      await handlePass(profileId);
    } else if (direction === 'right') {
      await handleLike(profileId, false);
    } else if (direction === 'up') {
      await handleLike(profileId, true);
    }
  };

  const handleQuickFilterChange = (gender: string) => {
    setSelectedGender(gender);
    updateUserPreferences({ interestedIn: gender as any });
  };

  // Filter profiles by Advanced Criteria
  const filteredProfiles = profiles.filter((p) => {
    if (advancedFilters.verifiedOnly && !p.verified) return false;
    if (p.age < advancedFilters.minAge || p.age > advancedFilters.maxAge) return false;
    if (p.distanceKm > advancedFilters.maxDistanceKm) return false;
    if (p.compatibility < advancedFilters.minCompatibility) return false;
    if (advancedFilters.relationshipIntent && p.relationshipIntent && p.relationshipIntent !== advancedFilters.relationshipIntent) return false;
    if (advancedFilters.zodiac && p.lifestyle?.zodiac && !p.lifestyle.zodiac.includes(advancedFilters.zodiac)) return false;
    if (advancedFilters.drinking && p.lifestyle?.drinking && p.lifestyle.drinking !== advancedFilters.drinking) return false;
    if (advancedFilters.workout && p.lifestyle?.workout && p.lifestyle.workout !== advancedFilters.workout) return false;
    return true;
  });

  const topProfile = filteredProfiles[0] || profiles[0];
  const nextProfile = filteredProfiles[1] || profiles[1];

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
            background: 'var(--primary-gradient)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 'var(--shadow-berry-glow)',
            animation: 'heartBeat 1.4s infinite ease-in-out'
          }}
        >
          <Heart size={34} fill="#FFFFFF" color="#FFFFFF" />
        </div>
        <div style={{ textAlign: 'center' }}>
          <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', color: 'var(--primary-wine)', fontWeight: 700 }}>
            Curating Bespoke Connections
          </h3>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Finding exceptional matches aligned with your lifestyle and passions...
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
        justifyContent: 'flex-start',
        padding: '0 0 16px 0',
        width: '100%',
        margin: '0 auto',
        boxSizing: 'border-box'
      }}
    >
      {/* Editorial Header Banner */}
      <div
        className="desktop-only"
        style={{
          marginBottom: '12px',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingBottom: '8px',
          borderBottom: '1px solid var(--border-subtle)',
          width: '100%'
        }}
      >
        <div style={{ flex: 1 }}>
          <h1
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(1.85rem, 3.4vw, 2.4rem)',
              fontWeight: 900,
              color: 'var(--text-primary)',
              letterSpacing: '-0.03em',
              lineHeight: 1.15,
              margin: 0
            }}
          >
            Find Someone Who Matches Your Vibe <span style={{ color: 'var(--berry-primary)' }}>♥</span>
          </h1>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            onClick={() => refreshData()}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '7px 14px',
              borderRadius: 'var(--radius-pill)',
              background: 'var(--surface-white)',
              border: '1.5px solid var(--border-subtle)',
              color: 'var(--text-secondary)',
              fontFamily: 'var(--font-display)',
              fontWeight: 700,
              fontSize: '0.82rem',
              cursor: 'pointer',
              boxShadow: 'var(--shadow-xs)',
              transition: 'all var(--transition-fast)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--berry-primary)';
              e.currentTarget.style.color = 'var(--berry-primary)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--border-subtle)';
              e.currentTarget.style.color = 'var(--text-secondary)';
            }}
          >
            <RotateCcw size={13} />
            <span>Reset Stack</span>
          </button>

          <button
            onClick={() => setCurrentView('dating-preferences')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '7px 16px',
              borderRadius: 'var(--radius-pill)',
              background: 'var(--surface-white)',
              border: '1.5px solid var(--border-gold)',
              color: 'var(--berry-primary)',
              fontFamily: 'var(--font-display)',
              fontWeight: 700,
              fontSize: '0.82rem',
              cursor: 'pointer',
              boxShadow: 'var(--shadow-xs)',
              transition: 'all var(--transition-fast)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--berry-primary)';
              e.currentTarget.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--border-gold)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <SlidersHorizontal size={14} color="var(--gold-deep)" />
            <span>Refine Preferences</span>
          </button>
        </div>
      </div>

      {/* Monetization & Discovery Control Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '8px',
          marginBottom: '14px',
          flexWrap: 'wrap'
        }}
      >
        {/* Left: Swipes Limit Badge */}
        <div
          onClick={() => {
            if (!currentUser.isPremium) openUpgradeModal();
          }}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 14px',
            borderRadius: 'var(--radius-pill)',
            background: currentUser.isPremium
              ? 'linear-gradient(135deg, #FEFCE8 0%, #FFFDFD 100%)'
              : (currentUser.dailySwipesRemaining ?? 20) <= 5
              ? '#FFF1F2'
              : '#F8FAFC',
            border: currentUser.isPremium
              ? '1.5px solid var(--border-gold)'
              : (currentUser.dailySwipesRemaining ?? 20) <= 5
              ? '1.5px solid #FDA4AF'
              : '1px solid var(--border-subtle)',
            cursor: currentUser.isPremium ? 'default' : 'pointer',
            boxShadow: 'var(--shadow-xs)'
          }}
        >
          {currentUser.isPremium ? (
            <>
              <Crown size={15} color="var(--gold-deep)" />
              <span style={{ fontSize: '0.78rem', fontWeight: 900, color: 'var(--berry-primary)' }}>
                Unlimited VIP Swipes
              </span>
            </>
          ) : (
            <>
              <Flame size={15} color="#E11D48" />
              <span style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                {currentUser.dailySwipesRemaining ?? 20} Free Swipes Left
              </span>
              <span style={{ fontSize: '0.72rem', fontWeight: 900, color: 'var(--berry-primary)' }}>
                • Upgrade
              </span>
            </>
          )}
        </div>

        {/* Right: Quick Action Buttons (Boost, Who Liked You, Filters) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {/* Active Boost / Boost Button */}
          <button
            onClick={openBoostModal}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              padding: '6px 12px',
              borderRadius: 'var(--radius-pill)',
              background: isBoostActive
                ? 'linear-gradient(135deg, #EA580C, #F97316)'
                : '#FFFFFF',
              color: isBoostActive ? '#FFFFFF' : '#EA580C',
              border: isBoostActive ? 'none' : '1.5px solid #FDBA74',
              fontSize: '0.78rem',
              fontWeight: 800,
              cursor: 'pointer',
              boxShadow: isBoostActive ? '0 0 12px rgba(234, 88, 12, 0.4)' : 'var(--shadow-xs)',
              animation: isBoostActive ? 'pulse 1.8s infinite' : 'none'
            }}
          >
            <Rocket size={14} />
            <span>{isBoostActive ? `Boost (${boostTimeRemainingFormatted})` : 'Boost Profile'}</span>
          </button>

          {/* Secret Admirers */}
          <button
            onClick={openWhoLikedMeModal}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              padding: '6px 12px',
              borderRadius: 'var(--radius-pill)',
              background: '#FFFFFF',
              color: 'var(--berry-primary)',
              border: '1.5px solid var(--border-gold)',
              fontSize: '0.78rem',
              fontWeight: 800,
              cursor: 'pointer',
              boxShadow: 'var(--shadow-xs)'
            }}
          >
            <Eye size={14} color="var(--gold-deep)" />
            <span>Admirers ({whoLikedMeProfiles.length})</span>
          </button>

          {/* Advanced Filters */}
          <button
            onClick={openFilterModal}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              padding: '6px 12px',
              borderRadius: 'var(--radius-pill)',
              background: '#FFFFFF',
              color: 'var(--text-primary)',
              border: '1.5px solid var(--border-subtle)',
              fontSize: '0.78rem',
              fontWeight: 800,
              cursor: 'pointer',
              boxShadow: 'var(--shadow-xs)'
            }}
          >
            <SlidersHorizontal size={14} />
            <span>Filters</span>
          </button>
        </div>
      </div>

      {/* Spotlight & VIP Carousel */}
      <SpotlightCarousel spotlightProfiles={spotlightProfiles} />

      {/* Top Spark Moments Matches Carousel */}
      {matches.length > 0 && (
        <div style={{ marginBottom: '14px', paddingBottom: '10px', borderBottom: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Sparkles size={14} color="var(--gold-deep)" />
              <span style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Your Spark Matches
              </span>
              <span
                style={{
                  background: 'rgba(136, 19, 55, 0.08)',
                  color: 'var(--berry-primary)',
                  border: '1px solid var(--border-gold)',
                  fontSize: '0.68rem',
                  fontWeight: 800,
                  padding: '1px 6px',
                  borderRadius: 'var(--radius-pill)'
                }}
              >
                {matches.length}
              </span>
            </div>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Tap avatar to chat</span>
          </div>

          <div
            className="scroll-touch-x"
            style={{
              display: 'flex',
              gap: '14px',
              overflowX: 'auto',
              padding: '2px 2px 8px 2px',
              whiteSpace: 'nowrap'
            }}
          >
            {matches.map((match) => {
              const photo = match.profile.photos[0] || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&q=80';
              return (
                <div
                  key={match.id}
                  onClick={() => openChatWithMatch(match)}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '5px',
                    cursor: 'pointer',
                    flexShrink: 0,
                    transition: 'transform var(--transition-fast)'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-2px)')}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
                >
                  <div
                    style={{
                      width: '58px',
                      height: '58px',
                      borderRadius: '50%',
                      padding: '2.5px',
                      background: 'linear-gradient(135deg, var(--gold-champagne) 0%, var(--berry-primary) 60%, var(--wine-deep) 100%)',
                      boxShadow: '0 3px 10px rgba(136, 19, 55, 0.18)',
                      position: 'relative'
                    }}
                  >
                    <img
                      src={photo}
                      alt={match.profile.name}
                      style={{
                        width: '100%',
                        height: '100%',
                        borderRadius: '50%',
                        objectFit: 'cover',
                        border: '2px solid #FFFFFF'
                      }}
                    />
                    {match.profile.online && (
                      <span
                        style={{
                          position: 'absolute',
                          bottom: '1px',
                          right: '1px',
                          width: '12px',
                          height: '12px',
                          borderRadius: '50%',
                          background: '#059669',
                          border: '2px solid #FFFFFF'
                        }}
                      />
                    )}
                  </div>
                  <span style={{ fontSize: '0.74rem', fontWeight: 800, color: 'var(--text-primary)', maxWidth: '60px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {match.profile.name}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {topProfile ? (
        <div className="desktop-discover-layout">
          {/* COLUMN 1 (Left): Matches Quick List & Discovery Radar */}
          <div
            className="desktop-only"
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '14px'
            }}
          >
            {/* Matches Quick Panel */}
            <div
              className="card-luxury"
              style={{
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Heart size={16} color="var(--berry-primary)" fill="var(--berry-primary)" />
                  <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                    Recent Matches
                  </h3>
                </div>
                <span
                  style={{
                    background: 'rgba(136, 19, 55, 0.08)',
                    color: 'var(--berry-primary)',
                    border: '1px solid var(--border-gold)',
                    fontSize: '0.72rem',
                    fontWeight: 800,
                    padding: '2px 8px',
                    borderRadius: 'var(--radius-pill)'
                  }}
                >
                  {matches.length}
                </span>
              </div>

              {matches.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '180px', overflowY: 'auto' }}>
                  {matches.slice(0, 4).map((match) => (
                    <div
                      key={match.id}
                      onClick={() => openChatWithMatch(match)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '6px 8px',
                        borderRadius: 'var(--radius-md)',
                        background: 'var(--surface-white)',
                        border: '1px solid var(--border-subtle)',
                        cursor: 'pointer',
                        transition: 'all var(--transition-fast)'
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--berry-primary)')}
                      onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--border-subtle)')}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <img
                          src={match.profile.photos[0] || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&q=80'}
                          alt={match.profile.name}
                          style={{ width: '30px', height: '30px', borderRadius: '50%', objectFit: 'cover' }}
                        />
                        <div>
                          <div style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-primary)' }}>{match.profile.name}</div>
                          <div style={{ fontSize: '0.66rem', color: 'var(--gold-deep)', fontWeight: 700 }}>{match.profile.compatibility}% Match</div>
                        </div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openChatWithMatch(match);
                        }}
                        style={{
                          background: 'var(--primary-gradient)',
                          color: '#FFFFFF',
                          border: 'none',
                          borderRadius: 'var(--radius-pill)',
                          padding: '3px 8px',
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '3px'
                        }}
                      >
                        <MessageCircle size={10} />
                        <span>Chat</span>
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: 0 }}>
                  Swipe right to spark your first match!
                </p>
              )}
            </div>
            {/* Quick Preference Card */}
            <div
              className="card-luxury"
              style={{
                padding: '18px 16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Filter size={15} color="var(--berry-primary)" />
                  <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                    Discovery Radar
                  </h3>
                </div>
                <span className="tagline-text" style={{ fontSize: '0.62rem' }}>Active Filter</span>
              </div>

              {/* Interested In */}
              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: '0.68rem',
                    fontFamily: 'var(--font-display)',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    color: 'var(--text-muted)',
                    marginBottom: '6px'
                  }}
                >
                  Interested In
                </label>
                <div style={{ display: 'flex', gap: '5px' }}>
                  {[
                    { id: 'women', label: 'Women' },
                    { id: 'men', label: 'Men' },
                    { id: 'all', label: 'Everyone' }
                  ].map((option) => (
                    <button
                      key={option.id}
                      onClick={() => handleQuickFilterChange(option.id)}
                      style={{
                        flex: 1,
                        padding: '6px 4px',
                        borderRadius: 'var(--radius-pill)',
                        border: selectedGender === option.id ? '1.5px solid transparent' : '1px solid var(--border-subtle)',
                        background: selectedGender === option.id ? 'var(--primary-gradient)' : 'var(--bg-soft-blush)',
                        color: selectedGender === option.id ? '#FFFFFF' : 'var(--text-secondary)',
                        fontFamily: 'var(--font-display)',
                        fontSize: '0.74rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        transition: 'all var(--transition-fast)'
                      }}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Max Distance Slider */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <label
                    style={{
                      fontSize: '0.68rem',
                      fontFamily: 'var(--font-display)',
                      fontWeight: 800,
                      textTransform: 'uppercase',
                      letterSpacing: '0.08em',
                      color: 'var(--text-muted)'
                    }}
                  >
                    Max Distance
                  </label>
                  <span style={{ fontSize: '0.76rem', fontWeight: 700, color: 'var(--berry-primary)' }}>
                    {maxDist} km
                  </span>
                </div>
                <input
                  type="range"
                  min={5}
                  max={100}
                  value={maxDist}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setMaxDist(val);
                    updateUserPreferences({ maxDistanceKm: val });
                  }}
                  style={{
                    width: '100%',
                    accentColor: 'var(--berry-primary)',
                    cursor: 'pointer'
                  }}
                />
              </div>

              {/* Verified Only Indicator */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '8px 10px',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--gold-gradient-subtle)',
                  border: '1px solid var(--border-gold)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <ShieldCheck size={15} color="var(--gold-deep)" />
                  <span style={{ fontSize: '0.76rem', fontWeight: 700, color: 'var(--gold-deep)' }}>
                    Verified Profiles Only
                  </span>
                </div>
                <span
                  style={{
                    width: '16px',
                    height: '16px',
                    borderRadius: '50%',
                    background: 'var(--gold-champagne)',
                    color: '#1C1217',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.65rem',
                    fontWeight: 900
                  }}
                >
                  ✓
                </span>
              </div>
            </div>

            {/* Daily Chemistry & Spark Card */}
            <div
              className="card-luxury"
              style={{
                padding: '16px',
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(252, 231, 236, 0.65) 100%)',
                border: '1.5px solid var(--border-subtle)',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Heart size={15} color="var(--berry-primary)" fill="var(--berry-primary)" />
                <span style={{ fontSize: '0.72rem', fontFamily: 'var(--font-display)', fontWeight: 800, color: 'var(--berry-primary)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                  MIORA Chemistry & Spark
                </span>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.45, margin: 0 }}>
                High resonance detected with {topProfile.name} on creative vibes & aesthetic taste.
              </p>
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.9)',
                  padding: '8px 10px',
                  borderRadius: '10px',
                  border: '1px solid var(--border-gold)',
                  fontSize: '0.76rem',
                  color: 'var(--text-primary)',
                  fontWeight: 600
                }}
              >
                💡 <span style={{ color: 'var(--berry-primary)', fontWeight: 700 }}>Icebreaker:</span> Ask about her favorite cozy coffee spot!
              </div>
            </div>
          </div>

          {/* COLUMN 2 (Center): Hero Profile Discovery Swipe Card & Big Controls */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              width: '100%',
              maxWidth: '430px',
              margin: '0 auto'
            }}
          >
            <div
              style={{
                position: 'relative',
                width: '100%',
                height: 'clamp(440px, 50vh, 500px)',
                borderRadius: 'var(--radius-xl)'
              }}
            >
              {/* Peek Card (Next in Stack) */}
              {nextProfile && (
                <SwipeCard
                  key={nextProfile.id}
                  profile={nextProfile}
                  onSwipe={() => {}}
                  onOpenDetails={() => {}}
                  isTopCard={false}
                />
              )}

              {/* Active Interactive Card */}
              <SwipeCard
                key={topProfile.id}
                profile={topProfile}
                onSwipe={(dir) => handleSwipe(dir, topProfile.id)}
                onOpenDetails={() => openProfileDetail(topProfile)}
                isTopCard={true}
              />
            </div>

            {/* Action Buttons (Pass, Super Like, Like, Rewind, Boost) */}
            <div style={{ width: '100%', marginTop: '10px' }}>
              <ActionButtons
                onPass={() => handlePass(topProfile.id)}
                onSuperLike={() => handleLike(topProfile.id, true)}
                onLike={() => handleLike(topProfile.id, false)}
                onRewind={() => refreshData()}
                onBoost={openBoostModal}
                isBoostActive={isBoostActive}
                superLikesCount={currentUser.superLikesRemaining}
              />
            </div>
          </div>

          {/* COLUMN 3 (Right): Vibe Chemistry Scorecard & Deep Compatibility Insights */}
          <div className="desktop-only" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {/* Vibe Match Scorecard */}
            <div
              className="card-luxury"
              style={{
                padding: '18px 16px',
                border: '1.5px solid var(--border-gold)',
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(254, 242, 244, 0.9) 100%)',
                boxShadow: 'var(--shadow-sm)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                <div
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, rgba(136, 19, 55, 0.12) 0%, rgba(212, 175, 55, 0.18) 100%)',
                    border: '1px solid var(--border-gold)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--berry-primary)',
                    flexShrink: 0
                  }}
                >
                  <Flame size={20} fill="var(--berry-primary)" />
                </div>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                    <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.15rem', fontWeight: 800, color: 'var(--berry-primary)' }}>
                      {topProfile.compatibility}% Vibe Match
                    </h3>
                    <span className="pill-gold" style={{ fontSize: '0.62rem', padding: '2px 6px' }}>
                      RESONANCE
                    </span>
                  </div>
                  <span style={{ fontSize: '0.74rem', color: 'var(--text-secondary)' }}>
                    Strong aesthetic & lifestyle harmony
                  </span>
                </div>
              </div>

              {/* Shared Mutual Tags Grid */}
              <div>
                <span
                  style={{
                    display: 'block',
                    fontSize: '0.68rem',
                    fontFamily: 'var(--font-display)',
                    fontWeight: 800,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    color: 'var(--text-muted)',
                    marginBottom: '6px'
                  }}
                >
                  Mutual Passions & Vibes
                </span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                  {topProfile.interests.map((interest) => (
                    <div
                      key={interest}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '5px',
                        padding: '5px 10px',
                        borderRadius: 'var(--radius-pill)',
                        background: 'rgba(255, 255, 255, 0.95)',
                        border: '1px solid var(--border-subtle)',
                        boxShadow: '0 2px 4px rgba(136, 19, 55, 0.03)',
                        fontSize: '0.76rem',
                        fontWeight: 700,
                        color: 'var(--text-primary)'
                      }}
                    >
                      <span>{interest}</span>
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: '13px',
                          height: '13px',
                          borderRadius: '50%',
                          background: 'linear-gradient(135deg, var(--gold-champagne), var(--berry-primary))',
                          color: '#FFFFFF'
                        }}
                      >
                        <Check size={8} strokeWidth={3} />
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Profile Bio & Details Showcase Card */}
            <div className="card-luxury" style={{ padding: '18px 16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {/* Badges Row */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '6px' }}>
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    color: 'var(--gold-deep)',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    background: 'rgba(212, 175, 55, 0.12)',
                    padding: '2px 8px',
                    borderRadius: 'var(--radius-pill)',
                    border: '1px solid var(--border-gold)'
                  }}
                >
                  <ShieldCheck size={13} color="var(--gold-deep)" />
                  Verified
                </span>

                {topProfile.online && (
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px',
                      background: 'rgba(16, 185, 129, 0.1)',
                      color: '#059669',
                      border: '1px solid rgba(16, 185, 129, 0.25)',
                      padding: '2px 8px',
                      borderRadius: 'var(--radius-pill)',
                      fontSize: '0.72rem',
                      fontWeight: 700
                    }}
                  >
                    <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#10B981', display: 'inline-block' }} />
                    Active Now
                  </span>
                )}
              </div>

              {/* Name & Location */}
              <div>
                <h2
                  style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: '1.35rem',
                    fontWeight: 800,
                    color: 'var(--text-primary)',
                    lineHeight: 1.15,
                    margin: 0
                  }}
                >
                  {topProfile.name}, {topProfile.age}
                </h2>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    color: 'var(--text-secondary)',
                    fontSize: '0.78rem',
                    marginTop: '2px'
                  }}
                >
                  <MapPin size={13} color="var(--berry-primary)" />
                  <span>{topProfile.location}</span>
                  <span style={{ color: 'var(--text-muted)' }}>•</span>
                  <span>{topProfile.distanceKm} km away</span>
                </div>
              </div>

              {/* Bio */}
              <div style={{ paddingTop: '8px', borderTop: '1px solid var(--border-subtle)' }}>
                <h4
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '0.68rem',
                    fontWeight: 800,
                    color: 'var(--text-muted)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    marginBottom: '2px'
                  }}
                >
                  About {topProfile.name}
                </h4>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.45, margin: 0 }}>
                  {topProfile.bio}
                </p>
              </div>

              {/* Lifestyle / Career attributes */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                {topProfile.occupation && (
                  <div
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      padding: '4px 10px',
                      borderRadius: 'var(--radius-pill)',
                      background: 'var(--bg-soft-blush)',
                      border: '1px solid var(--border-subtle)',
                      fontSize: '0.74rem',
                      fontWeight: 600,
                      color: 'var(--text-primary)'
                    }}
                  >
                    <Briefcase size={12} color="var(--berry-primary)" />
                    <span>{topProfile.occupation}</span>
                  </div>
                )}
                {topProfile.education && (
                  <div
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      padding: '4px 10px',
                      borderRadius: 'var(--radius-pill)',
                      background: 'var(--bg-soft-blush)',
                      border: '1px solid var(--border-subtle)',
                      fontSize: '0.74rem',
                      fontWeight: 600,
                      color: 'var(--text-primary)'
                    }}
                  >
                    <GraduationCap size={13} color="var(--berry-primary)" />
                    <span>{topProfile.education}</span>
                  </div>
                )}
                {topProfile.lifestyle?.zodiac && (
                  <span
                    style={{
                      padding: '4px 10px',
                      borderRadius: 'var(--radius-pill)',
                      background: 'var(--gold-gradient-subtle)',
                      border: '1px solid var(--border-gold)',
                      fontSize: '0.74rem',
                      fontWeight: 700,
                      color: 'var(--gold-deep)'
                    }}
                  >
                    ✨ {topProfile.lifestyle.zodiac}
                  </span>
                )}
                {topProfile.lifestyle?.workout && (
                  <span
                    style={{
                      padding: '4px 10px',
                      borderRadius: 'var(--radius-pill)',
                      background: 'var(--bg-soft-blush)',
                      border: '1px solid var(--border-subtle)',
                      fontSize: '0.74rem',
                      fontWeight: 600,
                      color: 'var(--text-primary)'
                    }}
                  >
                    🏋️ {topProfile.lifestyle.workout}
                  </span>
                )}
              </div>

              {/* View Full Profile Action Button */}
              <button
                onClick={() => openProfileDetail(topProfile)}
                style={{
                  width: '100%',
                  marginTop: '2px',
                  padding: '8px 14px',
                  borderRadius: 'var(--radius-pill)',
                  background: 'var(--surface-white)',
                  border: '1.5px solid var(--border-gold)',
                  color: 'var(--berry-primary)',
                  fontFamily: 'var(--font-display)',
                  fontWeight: 700,
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  boxShadow: 'var(--shadow-xs)',
                  transition: 'all var(--transition-fast)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--berry-primary)';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border-gold)';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-xs)';
                }}
              >
                <Info size={14} />
                <span>View Full Profile</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Empty State */
        <div
          className="card-luxury"
          style={{
            width: '100%',
            maxWidth: '620px',
            margin: '40px auto',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            padding: '52px 36px',
            gap: '20px',
            border: '1.5px solid var(--border-gold)',
            animation: 'popIn 0.3s ease-out forwards'
          }}
        >
          <div
            style={{
              width: '88px',
              height: '88px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, rgba(136, 19, 55, 0.1) 0%, rgba(212, 175, 55, 0.15) 100%)',
              border: '1px solid var(--border-gold)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--berry-primary)',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            <Sparkles size={40} color="var(--gold-deep)" />
          </div>

          <div>
            <span className="tagline-text" style={{ fontSize: '0.74rem', letterSpacing: '0.16em' }}>
              All Caught Up
            </span>
            <h2
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '1.9rem',
                fontWeight: 800,
                color: 'var(--text-primary)',
                marginTop: '4px'
              }}
            >
              No New Profiles Nearby
            </h2>
            <p
              style={{
                fontSize: '0.94rem',
                color: 'var(--text-secondary)',
                marginTop: '8px',
                lineHeight: 1.6,
                maxWidth: '440px'
              }}
            >
              Your next great connection might be right around the corner. Expand your distance preferences or reset your stack to explore more exceptional members.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '14px', width: '100%', maxWidth: '380px', marginTop: '8px' }}>
            <Button
              onClick={() => setCurrentView('dating-preferences')}
              variant="primary"
              size="md"
              fullWidth
            >
              <SlidersHorizontal size={15} />
              <span>Preferences</span>
            </Button>

            <Button
              onClick={() => refreshData()}
              variant="outline"
              size="md"
              fullWidth
            >
              <RotateCcw size={15} />
              <span>Reset Stack</span>
            </Button>
          </div>
        </div>
      )}

      {/* ====================================================
          INTEGRATED MATCHES & CONNECTIONS SECTION ON DISCOVER
          ==================================================== */}
      <div style={{ marginTop: '36px', width: '100%', paddingBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Heart size={20} color="var(--berry-primary)" fill="var(--berry-primary)" />
            <h2
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '1.45rem',
                fontWeight: 900,
                color: 'var(--text-primary)',
                letterSpacing: '-0.02em',
                margin: 0
              }}
            >
              Your Matches & Connections
            </h2>
            <span
              style={{
                background: 'rgba(136, 19, 55, 0.08)',
                color: 'var(--berry-primary)',
                border: '1px solid var(--border-gold)',
                fontSize: '0.74rem',
                fontWeight: 800,
                padding: '2px 8px',
                borderRadius: 'var(--radius-pill)'
              }}
            >
              {matches.length}
            </span>
          </div>

          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            Mutual sparks • 1-tap to chat
          </span>
        </div>

        {matches.length > 0 ? (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 280px), 1fr))',
              gap: '16px'
            }}
          >
            {matches.map((match) => {
              const photo =
                match.profile.photos[0] ||
                'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&q=80';
              return (
                <div
                  key={match.id}
                  className="card-luxury"
                  style={{
                    padding: 'clamp(16px, 4vw, 20px)',
                    borderRadius: '20px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: '16px',
                    border: '1.5px solid var(--border-subtle)',
                    transition: 'all var(--transition-normal)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-3px)';
                    e.currentTarget.style.borderColor = 'var(--border-gold)';
                    e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.borderColor = 'var(--border-subtle)';
                    e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div style={{ position: 'relative' }}>
                      <img
                        src={photo}
                        alt={match.profile.name}
                        style={{
                          width: '68px',
                          height: '68px',
                          borderRadius: '18px',
                          objectFit: 'cover',
                          border: '2px solid rgba(212, 175, 55, 0.35)'
                        }}
                      />
                      {match.profile.online && (
                        <span
                          style={{
                            position: 'absolute',
                            top: '-2px',
                            right: '-2px',
                            width: '13px',
                            height: '13px',
                            borderRadius: '50%',
                            background: '#059669',
                            border: '2px solid #FFFFFF'
                          }}
                        />
                      )}
                    </div>

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <h3
                          style={{
                            fontFamily: 'var(--font-serif)',
                            fontSize: '1.15rem',
                            fontWeight: 800,
                            color: 'var(--text-primary)',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            margin: 0
                          }}
                        >
                          {match.profile.name}, {match.profile.age}
                        </h3>
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '3px',
                            background: 'rgba(136, 19, 55, 0.08)',
                            border: '1px solid var(--border-gold)',
                            padding: '2px 7px',
                            borderRadius: 'var(--radius-pill)',
                            fontSize: '0.72rem',
                            fontWeight: 800,
                            color: 'var(--berry-primary)',
                            flexShrink: 0
                          }}
                        >
                          <Heart size={10} fill="var(--berry-primary)" />
                          {match.profile.compatibility}%
                        </span>
                      </div>

                      <p
                        style={{
                          fontSize: '0.8rem',
                          color: 'var(--text-secondary)',
                          marginTop: '3px',
                          marginBottom: 0,
                          display: '-webkit-box',
                          WebkitLineClamp: 1,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden'
                        }}
                      >
                        {match.lastMessage || `${match.profile.location} • ${match.profile.interests.slice(0, 2).join(', ')}`}
                      </p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                      onClick={() => openProfileDetail(match.profile)}
                      style={{
                        flex: 1,
                        padding: '8px 12px',
                        borderRadius: 'var(--radius-pill)',
                        border: '1.5px solid var(--border-subtle)',
                        background: 'transparent',
                        color: 'var(--text-secondary)',
                        fontFamily: 'var(--font-display)',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        transition: 'all var(--transition-fast)'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = 'var(--berry-primary)';
                        e.currentTarget.style.color = 'var(--berry-primary)';
                        e.currentTarget.style.background = 'var(--bg-soft-blush)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = 'var(--border-subtle)';
                        e.currentTarget.style.color = 'var(--text-secondary)';
                        e.currentTarget.style.background = 'transparent';
                      }}
                    >
                      View Profile
                    </button>

                    <button
                      onClick={() => openChatWithMatch(match)}
                      style={{
                        flex: 1.1,
                        padding: '8px 12px',
                        borderRadius: 'var(--radius-pill)',
                        border: 'none',
                        background: 'var(--primary-gradient)',
                        color: '#FFFFFF',
                        fontFamily: 'var(--font-display)',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '5px',
                        boxShadow: 'var(--shadow-berry-glow)',
                        transition: 'all var(--transition-fast)'
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-1px)')}
                      onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
                    >
                      <MessageCircle size={14} />
                      <span>Chat</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div
            className="card-luxury"
            style={{
              padding: '24px 16px',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <span style={{ fontSize: '0.86rem', color: 'var(--text-secondary)' }}>
              No mutual connections yet. Swipe right on profiles to spark a match!
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

