import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ActionButtons } from '../components/discover/ActionButtons';
import { SwipeCard } from '../components/discover/SwipeCard';
import { Button } from '../components/common/Button';
import {
  Sparkles,
  SlidersHorizontal,
  RotateCcw,
  Heart,
  Flame,
  MapPin,
  Briefcase,
  ChevronRight,
  MoreHorizontal,
  BarChart2,
  ArrowRight
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
    advancedFilters,
    openBoostModal,
    openFilterModal,
    isBoostActive
  } = useApp();

  const [selectedGender, setSelectedGender] = useState<string>(currentUser.preferences.interestedIn || 'women');
  const [maxDist, setMaxDist] = useState<number>(currentUser.preferences.maxDistanceKm || 35);
  const [verifiedOnly, setVerifiedOnly] = useState<boolean>(advancedFilters.verifiedOnly || false);

  const handleQuickFilterChange = (gender: string) => {
    setSelectedGender(gender);
    updateUserPreferences({ interestedIn: gender as any });
  };

  const handleDistanceChange = (val: number) => {
    setMaxDist(val);
    updateUserPreferences({ maxDistanceKm: val });
  };

  // Filter profiles
  const filteredProfiles = profiles.filter((p) => {
    if (verifiedOnly && !p.verified) return false;
    if (p.distanceKm > maxDist) return false;
    return true;
  });

  const topProfile = filteredProfiles[0] || profiles[0];
  const moreProfiles = profiles.slice(1, 6);

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
        gap: '20px',
        width: '100%',
        margin: '0 auto',
        padding: '8px 0 24px 0',
        boxSizing: 'border-box'
      }}
    >
      {topProfile ? (
        <>
          {/* Main 3-Column Grid Layout */}
          <div className="desktop-discover-grid">
            
            {/* ====================================================
                LEFT COLUMN: Discover Filter, Recent Matches, Spark
                ==================================================== */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              
              {/* 1. DISCOVER FILTER CARD */}
              <div
                className="card-neumorphic"
                style={{
                  padding: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px'
                }}
              >
                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#3A121A', margin: 0, letterSpacing: '-0.02em' }}>
                      Discover
                    </h2>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px', color: '#7C4351', fontSize: '0.78rem', fontWeight: 600 }}>
                      <MapPin size={13} color="#8B1E3F" />
                      <span>{currentUser.location || 'Chennai, India'}</span>
                    </div>
                  </div>

                  <button
                    onClick={openFilterModal}
                    style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '50%',
                      background: '#7A1C30',
                      border: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#FFFFFF',
                      boxShadow: '0 4px 12px rgba(122, 28, 48, 0.3)',
                      cursor: 'pointer',
                      transition: 'transform 0.2s ease'
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.06)')}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                  >
                    <SlidersHorizontal size={18} />
                  </button>
                </div>

                {/* Looking for */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 800, color: '#5C2834', marginBottom: '8px' }}>
                    Looking for
                  </label>
                  <div style={{ display: 'flex', gap: '6px' }}>
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
                          padding: '7px 4px',
                          borderRadius: '999px',
                          border: 'none',
                          background: selectedGender === option.id ? '#8B1E3F' : '#FCE4E8',
                          color: selectedGender === option.id ? '#FFFFFF' : '#6B3845',
                          fontSize: '0.78rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          boxShadow: selectedGender === option.id ? '0 4px 10px rgba(139, 30, 63, 0.25)' : 'none',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Max distance slider */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <span style={{ fontSize: '0.74rem', fontWeight: 800, color: '#5C2834' }}>Max distance</span>
                    <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#D81B60' }}>{maxDist} km</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="100"
                    value={maxDist}
                    onChange={(e) => handleDistanceChange(Number(e.target.value))}
                    className="custom-range-slider"
                  />
                </div>

                {/* Verified Profiles Only Switch */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '4px' }}>
                  <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#5C2834' }}>
                    Verified profiles only
                  </span>
                  <label className="custom-switch">
                    <input
                      type="checkbox"
                      checked={verifiedOnly}
                      onChange={(e) => setVerifiedOnly(e.target.checked)}
                    />
                    <span className="custom-switch-slider" />
                  </label>
                </div>
              </div>

              {/* 2. RECENT MATCHES CARD */}
              <div className="card-neumorphic" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#3A121A', margin: 0 }}>
                    Recent Matches
                  </h3>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    <span style={{ width: '22px', height: '22px', borderRadius: '50%', background: '#F8BBD0', color: '#8B1E3F', fontSize: '0.72rem', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      2
                    </span>
                    <span style={{ width: '22px', height: '22px', borderRadius: '50%', background: '#F8BBD0', color: '#8B1E3F', fontSize: '0.72rem', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      2
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {[
                    {
                      id: matches[0]?.id || 'm-priya',
                      name: matches[0]?.profile?.name || 'Priya',
                      match: `${matches[0]?.profile?.compatibility || 87}% Match`,
                      photo: matches[0]?.profile?.photos?.[0] || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
                      data: matches[0]
                    },
                    {
                      id: matches[1]?.id || 'm-ananya',
                      name: matches[1]?.profile?.name || 'Ananya',
                      match: `${matches[1]?.profile?.compatibility || 82}% Match`,
                      photo: matches[1]?.profile?.photos?.[0] || 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
                      data: matches[1]
                    }
                  ].map((item) => (
                    <div
                      key={item.id}
                      onClick={() => item.data ? openChatWithMatch(item.data) : openProfileDetail(topProfile)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '10px 12px',
                        borderRadius: '16px',
                        background: '#FFF0F3',
                        border: '1px solid rgba(255, 255, 255, 0.8)',
                        cursor: 'pointer',
                        transition: 'transform 0.15s ease'
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-1px)')}
                      onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <img src={item.photo} alt={item.name} style={{ width: '42px', height: '42px', borderRadius: '50%', objectFit: 'cover' }} />
                        <div>
                          <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#3A121A' }}>{item.name}</div>
                          <div style={{ fontSize: '0.74rem', fontWeight: 700, color: '#D81B60' }}>{item.match}</div>
                        </div>
                      </div>
                      <ChevronRight size={18} color="#8B1E3F" />
                    </div>
                  ))}
                </div>
              </div>

              {/* 3. SPARK CARD */}
              <div className="card-neumorphic" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '1.2rem' }}>💡</span>
                  <div>
                    <h3 style={{ fontSize: '0.98rem', fontWeight: 800, color: '#3A121A', margin: 0 }}>Spark</h3>
                    <div style={{ fontSize: '0.72rem', color: '#7C4351', fontWeight: 600 }}>High chance of a great conversation!</div>
                  </div>
                </div>
                <div style={{ background: '#FFFFFF', padding: '12px 14px', borderRadius: '16px', fontSize: '0.78rem', color: '#8B1E3F', fontWeight: 700, boxShadow: '0 2px 8px rgba(186, 73, 98, 0.06)' }}>
                  “Ask about her favorite cozy coffee spot! ☕”
                </div>
              </div>
            </div>

            {/* ====================================================
                CENTER COLUMN: Main Swipable Card + Action Dock
                ==================================================== */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
              
              {/* Profile Card Stack with Dragging & Swiping */}
              <div
                style={{
                  position: 'relative',
                  width: '100%',
                  height: '560px',
                  borderRadius: '28px',
                  boxSizing: 'border-box'
                }}
              >
                {filteredProfiles[1] && (
                  <SwipeCard
                    key={filteredProfiles[1].id}
                    profile={filteredProfiles[1]}
                    onSwipe={() => {}}
                    onOpenDetails={() => openProfileDetail(filteredProfiles[1])}
                    isTopCard={false}
                  />
                )}
                {topProfile && (
                  <SwipeCard
                    key={topProfile.id}
                    profile={topProfile}
                    onSwipe={(direction) => {
                      if (direction === 'right') handleLike(topProfile.id, false);
                      else if (direction === 'left') handlePass(topProfile.id);
                      else if (direction === 'up') handleLike(topProfile.id, true);
                    }}
                    onOpenDetails={() => openProfileDetail(topProfile)}
                    isTopCard={true}
                  />
                )}
              </div>

              {/* Action Buttons Dock */}
              <ActionButtons
                onPass={() => handlePass(topProfile.id)}
                onSuperLike={() => handleLike(topProfile.id, true)}
                onLike={() => handleLike(topProfile.id, false)}
                onRewind={() => refreshData()}
                onBoost={openBoostModal}
                isBoostActive={isBoostActive}
              />
            </div>

            {/* ====================================================
                RIGHT COLUMN: Vibe Match, About, Similar Interests
                ==================================================== */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              
              {/* 1. VIBE MATCH CARD */}
              <div
                className="vibe-match-card"
                style={{
                  padding: '22px 20px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div
                      style={{
                        width: '38px',
                        height: '38px',
                        borderRadius: '50%',
                        background: 'rgba(255, 255, 255, 0.18)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <Flame size={22} fill="#FFFFFF" color="#FFFFFF" />
                    </div>
                    <div>
                      <div style={{ fontSize: '1.45rem', fontWeight: 900, lineHeight: 1 }}>
                        87%
                      </div>
                      <div style={{ fontSize: '0.76rem', fontWeight: 800, letterSpacing: '0.04em' }}>
                        Vibe Match
                      </div>
                    </div>
                  </div>

                  <BarChart2 size={22} color="rgba(255, 255, 255, 0.75)" />
                </div>

                <p style={{ fontSize: '0.78rem', color: 'rgba(255, 255, 255, 0.85)', margin: 0 }}>
                  Strong aesthetic & lifestyle harmony
                </p>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '2px' }}>
                  {['Music', 'Travel', 'Movies', 'Coffee', 'Design'].map((vibe) => (
                    <span
                      key={vibe}
                      style={{
                        padding: '4px 12px',
                        borderRadius: '999px',
                        background: 'rgba(255, 255, 255, 0.18)',
                        border: '1px solid rgba(255, 255, 255, 0.25)',
                        color: '#FFFFFF',
                        fontSize: '0.74rem',
                        fontWeight: 700
                      }}
                    >
                      {vibe}
                    </span>
                  ))}
                </div>
              </div>

              {/* 2. ABOUT CARD */}
              <div className="card-neumorphic" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#3A121A', margin: 0 }}>About</h3>
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      padding: '3px 10px',
                      borderRadius: '999px',
                      background: 'rgba(16, 185, 129, 0.12)',
                      color: '#059669',
                      fontSize: '0.7rem',
                      fontWeight: 800
                    }}
                  >
                    <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#10B981' }} />
                    Active Now
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.82rem', color: '#5C2834', fontWeight: 700 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Briefcase size={15} color="#8B1E3F" />
                    <span>{topProfile.occupation || 'UI/UX Designer'}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <MapPin size={15} color="#8B1E3F" />
                    <span>{topProfile.education || 'NIFT Chennai'}</span>
                  </div>
                </div>

                <p style={{ fontSize: '0.78rem', color: '#6B3845', lineHeight: 1.45, margin: 0 }}>
                  Love music, coffee, travel and discovering cozy aesthetic places. Currently designing delightful apps 💥
                </p>
              </div>

              {/* 3. SIMILAR INTERESTS CARD */}
              <div className="card-neumorphic" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#3A121A', margin: 0 }}>Similar Interests</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                  {[
                    {
                      title: 'Travel',
                      img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=400&q=80'
                    },
                    {
                      title: 'Coffee',
                      img: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=400&q=80'
                    },
                    {
                      title: 'Design',
                      img: 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&w=400&q=80'
                    }
                  ].map((item) => (
                    <div key={item.title} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                      <img
                        src={item.img}
                        alt={item.title}
                        style={{ width: '100%', height: '70px', borderRadius: '14px', objectFit: 'cover', boxShadow: '0 4px 10px rgba(186, 73, 98, 0.1)' }}
                      />
                      <span style={{ fontSize: '0.74rem', fontWeight: 700, color: '#5C2834' }}>{item.title}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ====================================================
              BOTTOM HORIZONTAL BAR: "More People for You"
              ==================================================== */}
          <div
            className="card-neumorphic"
            style={{
              width: '100%',
              padding: '16px 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '16px',
              marginTop: '4px',
              boxSizing: 'border-box'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#3A121A', margin: 0 }}>
                More People for You
              </h3>
              <div
                style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  background: '#F8BBD0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#8B1E3F'
                }}
              >
                <ArrowRight size={13} />
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '18px', overflowX: 'auto', flex: 1, padding: '2px 0' }}>
              {[
                { id: 'm1', name: 'Ananya', age: 24, photo: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80' },
                { id: 'm2', name: 'Sneha', age: 23, photo: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=80' },
                { id: 'm3', name: 'Ravya', age: 25, photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80' },
                { id: 'm4', name: 'Riya', age: 22, photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80' }
              ].map((p) => (
                <div
                  key={p.id}
                  onClick={() => openProfileDetail(topProfile)}
                  style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', flexShrink: 0 }}
                >
                  <img src={p.photo} alt={p.name} style={{ width: '44px', height: '44px', borderRadius: '50%', objectFit: 'cover' }} />
                  <div>
                    <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#3A121A' }}>{p.name}</div>
                    <div style={{ fontSize: '0.72rem', color: '#7C4351', fontWeight: 600 }}>{p.age}</div>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => refreshData()}
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: '#F8BBD0',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#8B1E3F',
                cursor: 'pointer',
                flexShrink: 0
              }}
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </>
      ) : (
        <div
          className="card-neumorphic"
          style={{
            width: '100%',
            maxWidth: '580px',
            margin: '40px auto',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            padding: '48px 32px',
            gap: '18px'
          }}
        >
          <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: '#8B1E3F', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFFFFF' }}>
            <Sparkles size={36} color="#FFFFFF" />
          </div>

          <div>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#3A121A', margin: 0 }}>All Caught Up</h2>
            <p style={{ fontSize: '0.9rem', color: '#6B3845', marginTop: '6px', lineHeight: 1.5 }}>
              No new profiles nearby matching your filters. Expand your search distance or reset your stack!
            </p>
          </div>

          <div style={{ display: 'flex', gap: '12px', width: '100%', maxWidth: '360px' }}>
            <Button onClick={() => setCurrentView('dating-preferences')} variant="primary" size="md" fullWidth>
              <SlidersHorizontal size={15} />
              <span>Preferences</span>
            </Button>
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

