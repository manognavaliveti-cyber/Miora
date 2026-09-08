import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Sparkles,
  Heart,
  MessageCircle,
  Flame,
  ArrowRight,
  User,
  ShieldCheck,
  Crown,
  Eye,
  Lock,
  Star
} from 'lucide-react';
import { Button } from '../components/common/Button';

export const MatchesPage: React.FC = () => {
  const {
    matches,
    openChatWithMatch,
    openProfileDetail,
    setCurrentView,
    whoLikedMeProfiles,
    openWhoLikedMeModal,
    openUpgradeModal,
    currentUser
  } = useApp();

  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        padding: '8px 0 40px 0',
        gap: '24px',
        width: '100%',
        margin: '0 auto',
        animation: 'fadeIn 0.25s ease-out forwards'
      }}
    >
      {/* Header Banner */}
      <div style={{ paddingBottom: '8px', borderBottom: '1px solid var(--border-subtle)' }}>
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
          Your Connections <span style={{ color: 'var(--berry-primary)' }}>♥</span>
        </h1>
      </div>

      {/* WHO LIKED YOU / SECRET ADMIRERS GOLDEN BANNER */}
      <div
        onClick={openWhoLikedMeModal}
        style={{
          background: 'linear-gradient(135deg, #4C0519 0%, #881337 50%, #BE123C 100%)',
          borderRadius: '24px',
          padding: '20px 24px',
          color: '#FFFFFF',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: 'pointer',
          boxShadow: '0 15px 35px -5px rgba(136, 19, 55, 0.35)',
          position: 'relative',
          overflow: 'hidden',
          transition: 'transform var(--transition-fast)'
        }}
        onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-2px)')}
        onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', zIndex: 2 }}>
          {/* Overlapping Blurred Avatars */}
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {whoLikedMeProfiles.slice(0, 3).map((w, idx) => (
              <div
                key={w.id}
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '50%',
                  border: '2px solid #FFFFFF',
                  overflow: 'hidden',
                  marginLeft: idx === 0 ? '0' : '-16px',
                  boxShadow: '0 4px 10px rgba(0,0,0,0.25)',
                  position: 'relative',
                  background: '#0F172A'
                }}
              >
                <img
                  src={w.profile.photos[0] || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&q=80'}
                  alt="Admirer"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    filter: currentUser.isPremium ? 'none' : 'blur(5px) brightness(0.8)'
                  }}
                />
              </div>
            ))}
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '1.15rem', fontWeight: 900, color: '#FFFFFF' }}>
                {whoLikedMeProfiles.length} People Liked You
              </span>
              <span
                style={{
                  background: 'rgba(253, 230, 138, 0.25)',
                  color: '#FDE68A',
                  border: '1px solid rgba(253, 230, 138, 0.5)',
                  fontSize: '0.68rem',
                  fontWeight: 900,
                  padding: '2px 8px',
                  borderRadius: 'var(--radius-pill)'
                }}
              >
                {currentUser.isPremium ? 'UNLOCKED VIP' : 'SECRET'}
              </span>
            </div>
            <p style={{ fontSize: '0.82rem', color: 'rgba(255, 255, 255, 0.85)', margin: '2px 0 0 0' }}>
              {currentUser.isPremium
                ? 'Tap to view profiles and match instantly with one click'
                : 'See who swiped right on your profile before they disappear'}
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', zIndex: 2 }}>
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              if (currentUser.isPremium) {
                openWhoLikedMeModal();
              } else {
                openUpgradeModal();
              }
            }}
            style={{
              background: 'rgba(255, 255, 255, 0.15)',
              border: '1px solid rgba(255, 255, 255, 0.4)',
              color: '#FFFFFF',
              fontWeight: 800,
              fontSize: '0.82rem'
            }}
          >
            {currentUser.isPremium ? (
              <>
                <Eye size={14} /> View All
              </>
            ) : (
              <>
                <Crown size={14} color="#FDE68A" /> Reveal (Gold)
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Recent Match Story Avatars */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles size={16} color="var(--gold-deep)" />
            <h2
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '1.25rem',
                fontWeight: 800,
                color: 'var(--text-primary)',
                letterSpacing: '-0.02em'
              }}
            >
              New Spark Moments
            </h2>
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
          <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
            Tap avatar to start chatting
          </span>
        </div>

        {matches.length > 0 ? (
          <div
            className="scroll-touch-x"
            style={{
              display: 'flex',
              gap: '16px',
              overflowX: 'auto',
              padding: '4px 2px 14px 2px',
              whiteSpace: 'nowrap'
            }}
          >
            {matches.map((match) => {
              const photo =
                match.profile.photos[0] ||
                'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&q=80';
              return (
                <div
                  key={match.id}
                  onClick={() => openChatWithMatch(match)}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '8px',
                    cursor: 'pointer',
                    flexShrink: 0,
                    transition: 'all var(--transition-fast)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-3px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <div
                    style={{
                      width: 'clamp(68px, 17vw, 84px)',
                      height: 'clamp(68px, 17vw, 84px)',
                      borderRadius: '50%',
                      padding: '3px',
                      background: 'linear-gradient(135deg, var(--gold-champagne) 0%, var(--berry-primary) 60%, var(--wine-deep) 100%)',
                      boxShadow: '0 4px 14px rgba(136, 19, 55, 0.2)',
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
                        border: '2.5px solid #FFFFFF'
                      }}
                    />
                    {match.profile.online && (
                      <span
                        style={{
                          position: 'absolute',
                          bottom: '2px',
                          right: '2px',
                          width: '14px',
                          height: '14px',
                          borderRadius: '50%',
                          background: '#059669',
                          border: '2px solid #FFFFFF'
                        }}
                      />
                    )}
                  </div>

                  <div style={{ textAlign: 'center' }}>
                    <span
                      style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: '0.82rem',
                        fontWeight: 800,
                        color: 'var(--text-primary)',
                        display: 'block'
                      }}
                    >
                      {match.profile.name}
                    </span>
                    <span style={{ fontSize: '0.7rem', color: 'var(--gold-deep)', fontWeight: 700 }}>
                      {match.profile.compatibility}% Vibe
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div
            className="card-luxury"
            style={{
              padding: '28px 16px',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <span style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
              No mutual connections yet. Swipe right on profiles to spark a match!
            </span>
          </div>
        )}
      </div>

      {/* All Connections Responsive Grid */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
          <Heart size={18} color="var(--berry-primary)" fill="var(--berry-primary)" />
          <h2
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '1.35rem',
              fontWeight: 800,
              color: 'var(--text-primary)',
              letterSpacing: '-0.02em'
            }}
          >
            All Connections
          </h2>
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
                    padding: 'clamp(16px, 4vw, 24px)',
                    borderRadius: 'clamp(18px, 4vw, 24px)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: '18px',
                    border: '1.5px solid var(--border-subtle)',
                    transition: 'all var(--transition-normal)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.borderColor = 'var(--border-gold)';
                    e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.borderColor = 'var(--border-subtle)';
                    e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ position: 'relative' }}>
                      <img
                        src={photo}
                        alt={match.profile.name}
                        style={{
                          width: '76px',
                          height: '76px',
                          borderRadius: '22px',
                          objectFit: 'cover',
                          border: '2.5px solid rgba(212, 175, 55, 0.35)'
                        }}
                      />
                      {match.profile.online && (
                        <span
                          style={{
                            position: 'absolute',
                            top: '-3px',
                            right: '-3px',
                            width: '15px',
                            height: '15px',
                            borderRadius: '50%',
                            background: '#059669',
                            border: '2.5px solid #FFFFFF'
                          }}
                        />
                      )}
                    </div>

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <h3
                          style={{
                            fontFamily: 'var(--font-serif)',
                            fontSize: '1.25rem',
                            fontWeight: 800,
                            color: 'var(--text-primary)',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                          }}
                        >
                          {match.profile.name}, {match.profile.age}
                        </h3>
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            background: 'rgba(136, 19, 55, 0.08)',
                            border: '1px solid var(--border-gold)',
                            padding: '3px 9px',
                            borderRadius: 'var(--radius-pill)',
                            fontSize: '0.74rem',
                            fontWeight: 800,
                            color: 'var(--berry-primary)',
                            flexShrink: 0
                          }}
                        >
                          <Heart size={11} fill="var(--berry-primary)" />
                          {match.profile.compatibility}%
                        </span>
                      </div>

                      <p
                        style={{
                          fontSize: '0.86rem',
                          color: 'var(--text-secondary)',
                          marginTop: '4px',
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

                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button
                      onClick={() => openProfileDetail(match.profile)}
                      style={{
                        flex: 1,
                        padding: '10px 14px',
                        borderRadius: 'var(--radius-pill)',
                        border: '1.5px solid var(--border-subtle)',
                        background: 'transparent',
                        color: 'var(--text-secondary)',
                        fontFamily: 'var(--font-display)',
                        fontSize: '0.84rem',
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
                        padding: '10px 14px',
                        borderRadius: 'var(--radius-pill)',
                        border: 'none',
                        background: 'var(--primary-gradient)',
                        color: '#FFFFFF',
                        fontFamily: 'var(--font-display)',
                        fontSize: '0.84rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        boxShadow: 'var(--shadow-berry-glow)',
                        transition: 'all var(--transition-fast)'
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-1px)')}
                      onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
                    >
                      <MessageCircle size={15} />
                      <span>Start Chat</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '48px 20px' }}>
            <Button onClick={() => setCurrentView('discover')} variant="primary" size="lg">
              Start Exploring on Discover
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

