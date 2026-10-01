import React from 'react';
import { useApp } from '../context/AppContext';
import { Heart, Crown, ChevronRight, Zap, ArrowRight, Compass } from 'lucide-react';

export const MatchesPage: React.FC = () => {
  const {
    whoLikedMeProfiles,
    canSeeLikerNames,
    openWhoLikedMeModal,
    openUpgradeFor,
    openBoostModal,
    setCurrentView,
    openProfileDetail
  } = useApp();

  const likersCount = whoLikedMeProfiles.length;

  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        width: '100%',
        boxSizing: 'border-box',
        padding: '16px 16px 40px 16px',
        background: '#FAF8F6',
        minHeight: '100vh',
        fontFamily: "system-ui, -apple-system, sans-serif",
        animation: 'fadeIn 0.25s ease-out forwards'
      }}
    >
      {/* 1. YOUR CONNECTIONS HEADING (Clean header without notification bell icon or subtitle) */}
      <div
        style={{
          paddingBottom: '4px'
        }}
      >
        <h1
          style={{
            fontFamily: "'Cormorant Garamond', 'Playfair Display', Georgia, serif",
            fontSize: 'clamp(1.75rem, 6vw, 2.2rem)',
            fontWeight: 800,
            color: '#1F171A',
            letterSpacing: '-0.02em',
            margin: 0,
            lineHeight: 1.15,
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <span>Your Connections</span>
          <span style={{ color: '#881337', fontSize: '1.4rem' }}>♥</span>
        </h1>
      </div>

      {/* 2. BOOST YOUR PROFILE CARD AT THE TOP (Immediately under Your Connections) */}
      <div
        style={{
          background: 'linear-gradient(135deg, #FFF0F3 0%, #FCE7F3 100%)',
          border: '1px solid #FBCFE8',
          borderRadius: '20px',
          padding: '18px 20px',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 4px 14px rgba(157, 23, 77, 0.05)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', flex: 1 }}>
            {/* Lightning bolt badge */}
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                background: '#FBCFE8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}
            >
              <Zap size={22} color="#9D174D" fill="#9D174D" />
            </div>

            {/* Title & Copy */}
            <div>
              <h2
                style={{
                  fontFamily: "'Cormorant Garamond', 'Playfair Display', Georgia, serif",
                  fontSize: '1.35rem',
                  fontWeight: 800,
                  color: '#1F171A',
                  margin: 0
                }}
              >
                Boost Your Profile
              </h2>
              <p
                style={{
                  fontSize: '0.82rem',
                  color: '#6E6266',
                  margin: '4px 0 0 0',
                  lineHeight: '1.4',
                  maxWidth: '240px'
                }}
              >
                Get 10x more visibility and connect with matches instantly.
              </p>
            </div>
          </div>

          {/* Crown flourish art */}
          <div style={{ position: 'relative', paddingRight: '4px', flexShrink: 0 }}>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                opacity: 0.85
              }}
            >
              <Crown size={22} color="#9D174D" strokeWidth={1.8} />
              <svg width="34" height="12" viewBox="0 0 34 12" fill="none" style={{ marginTop: '2px' }}>
                <path d="M2 6 C10 12 24 0 32 6" stroke="#F472B6" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </div>
          </div>
        </div>

        {/* Burgundy Pill Button */}
        <button
          onClick={openBoostModal}
          style={{
            width: '100%',
            height: '44px',
            borderRadius: '9999px',
            background: 'linear-gradient(135deg, #881337 0%, #9D174D 100%)',
            color: '#FFFFFF',
            fontFamily: "system-ui, -apple-system, sans-serif",
            fontSize: '0.88rem',
            fontWeight: 700,
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            marginTop: '16px',
            boxShadow: '0 4px 14px rgba(136, 19, 55, 0.25)',
            transition: 'transform 0.15s ease'
          }}
          onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.98)')}
          onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
        >
          <span>Boost Your Profile</span>
          <ArrowRight size={16} />
        </button>
      </div>

      {/* 3. LIKES SECTION & VIEW WHO LIKED YOU */}
      <div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
            marginBottom: '14px',
            flexWrap: 'wrap'
          }}
        >
          {/* Clean Likes Heading without subtitle */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Heart size={20} color="#9D174D" strokeWidth={2} />
            <h2
              style={{
                fontFamily: "'Cormorant Garamond', 'Playfair Display', Georgia, serif",
                fontSize: '1.5rem',
                fontWeight: 800,
                color: '#1F171A',
                margin: 0
              }}
            >
              ♡ Likes
            </h2>
          </div>

          {/* Paid "View Who Liked You" Premium Banner */}
          <div
            onClick={() => (canSeeLikerNames ? openWhoLikedMeModal() : openUpgradeFor({ reason: 'likes' }))}
            style={{
              background: '#FFF0F3',
              border: '1px solid #FCE7F3',
              borderRadius: '16px',
              padding: '8px 14px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(157, 23, 77, 0.04)',
              flexShrink: 0
            }}
          >
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: '#FBCFE8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}
            >
              <Crown size={16} color="#9D174D" fill="#9D174D" />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div
                style={{
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  color: '#9D174D',
                  lineHeight: '1.2',
                  whiteSpace: 'nowrap'
                }}
              >
                View Who Liked You
              </div>
              <div
                style={{
                  fontSize: '0.65rem',
                  color: '#831843',
                  lineHeight: '1.2',
                  whiteSpace: 'nowrap',
                  marginTop: '2px'
                }}
              >
                Unlock to see who liked your profile
              </div>
            </div>

            <ChevronRight size={16} color="#9D174D" style={{ flexShrink: 0, marginLeft: '2px' }} />
          </div>
        </div>

        {/* 4. LIKED PROFILES LIST OR CUTE BOY + GIRL NO-LIKES EMPTY STATE */}
        {likersCount > 0 ? (
          <>
            <div
              style={{
                background: '#FFFFFF',
                border: '1px solid #F3EBE6',
                borderRadius: '18px',
                overflow: 'hidden',
                boxShadow: '0 2px 10px rgba(0, 0, 0, 0.02)'
              }}
            >
              {whoLikedMeProfiles.map((liker, idx) => {
                const photo =
                  liker.profile?.photos?.[0] ||
                  (liker as any).photos?.[0] ||
                  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80';
                return (
                  <div
                    key={liker.id || idx}
                    onClick={() => {
                      if (canSeeLikerNames && liker.profile) {
                        openProfileDetail(liker.profile);
                      } else {
                        openUpgradeFor({ reason: 'likes' });
                      }
                    }}
                    style={{
                      padding: '14px 16px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '14px',
                      borderBottom: idx < whoLikedMeProfiles.length - 1 ? '1px solid #F9FAFB' : 'none',
                      cursor: 'pointer',
                      transition: 'background 0.15s ease'
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = '#FFF0F3')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                  >
                    <div
                      style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '50%',
                        overflow: 'hidden',
                        flexShrink: 0,
                        filter: canSeeLikerNames ? 'none' : 'blur(8px)',
                        border: '1.5px solid #FCE7F3'
                      }}
                    >
                      <img
                        src={photo}
                        alt="Liker preview"
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </div>

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {canSeeLikerNames ? (
                          <span style={{ fontWeight: 700, fontSize: '0.94rem', color: '#1F171A' }}>
                            {liker.profile?.name || 'Someone'}
                          </span>
                        ) : (
                          <div
                            style={{
                              width: '80px',
                              height: '10px',
                              background: '#D1D5DB',
                              borderRadius: '4px',
                              filter: 'blur(3px)'
                            }}
                          />
                        )}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '6px' }}>
                        {!canSeeLikerNames && (
                          <div
                            style={{
                              width: '120px',
                              height: '8px',
                              background: '#E5E7EB',
                              borderRadius: '4px',
                              filter: 'blur(3px)'
                            }}
                          />
                        )}
                        <span style={{ fontSize: '0.76rem', color: '#BE123C', fontWeight: 500 }}>
                          • {liker.likedAt || 'Recently'}
                        </span>
                      </div>
                    </div>

                    <ChevronRight size={16} color="#D1D5DB" />
                  </div>
                );
              })}
            </div>

            {/* Centered Pill Button */}
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '12px' }}>
              <button
                onClick={() => (canSeeLikerNames ? openWhoLikedMeModal() : openUpgradeFor({ reason: 'likes' }))}
                style={{
                  background: '#FFF0F3',
                  border: '1px solid #FCE7F3',
                  borderRadius: '9999px',
                  padding: '6px 16px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  color: '#9D174D',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                <Heart size={12} color="#9D174D" />
                <span>{likersCount} people liked your profile</span>
                <Heart size={12} color="#9D174D" />
              </button>
            </div>
          </>
        ) : (
          /* ELEGANT VECTOR LOVE LETTER DATING ILLUSTRATION EMPTY STATE */
          <div
            style={{
              background: '#FFFFFF',
              border: '1px solid #F3EBE6',
              borderRadius: '24px',
              padding: '32px 24px',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '16px',
              boxShadow: '0 2px 12px rgba(0, 0, 0, 0.02)'
            }}
          >
            {/* Elegant Vector Love Letter / Dating Envelope Illustration */}
            <div
              style={{
                width: '100%',
                maxWidth: '240px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <svg width="220" height="150" viewBox="0 0 220 150" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Soft translucent pink background cloud */}
                <path
                  d="M38 75C28 65 33 42 52 38C66 24 104 20 128 28C146 20 168 28 173 46C182 54 178 76 164 80C173 94 159 112 136 108C118 116 86 112 72 104C58 112 39 98 38 75Z"
                  fill="rgba(252, 231, 243, 0.7)"
                />
                
                {/* Leafy branches / floral sprig on left */}
                <g stroke="#9D174D" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none">
                  <path d="M48 105C43 82 34 68 24 54" />
                  <path d="M40 88C33 85 28 88 30 94C33 98 38 94 40 88Z" fill="#FCE7F3" />
                  <path d="M34 74C26 70 23 74 26 80C30 84 34 78 34 74Z" fill="#FCE7F3" />
                  <path d="M28 60C20 54 18 60 20 66C24 70 28 64 28 60Z" fill="#FCE7F3" />
                </g>
                
                {/* Envelope Body */}
                <g stroke="#881337" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  {/* Envelope Base */}
                  <rect x="65" y="55" width="90" height="58" rx="6" fill="#FFFFFF" />
                  {/* Envelope Inner V Flap */}
                  <path d="M65 55L110 88L155 55" fill="#FFF0F3" />
                  {/* Envelope Top Open Contour */}
                  <path d="M65 55L110 28L155 55" fill="none" />
                  {/* Center Heart Seal */}
                  <path
                    d="M110 76C110 76 103 70 100 66C97 62 101 57 106 60C110 63 110 65 110 65C110 65 110 63 114 60C119 57 123 62 120 66C117 70 110 76 110 76Z"
                    fill="#BE123C"
                    stroke="#BE123C"
                  />
                </g>
                
                {/* Floating Hearts & Soft Sparks */}
                <g fill="#9D174D" opacity="0.85">
                  <path d="M165 38C165 38 161 34 159 31C157 28 160 25 163 27C165 29 165 30 165 30C165 30 165 29 167 27C170 25 173 28 171 31C169 34 165 38 165 38Z" />
                  <path d="M176 68C176 68 173 65 171 62C169 59 172 57 174 58C176 60 176 61 176 61C176 61 176 60 178 58C180 57 183 59 181 62C179 65 176 68 176 68Z" />
                  <path d="M46 38C46 38 43 35 41 32C39 29 42 27 44 28C46 30 46 31 46 31C46 31 46 30 48 28C50 27 53 29 51 32C49 35 46 38 46 38Z" />
                </g>
              </svg>
            </div>

            <div>
              <h3
                style={{
                  fontFamily: "'Cormorant Garamond', 'Playfair Display', Georgia, serif",
                  fontSize: '1.5rem',
                  fontWeight: 800,
                  color: '#1F171A',
                  margin: 0
                }}
              >
                No More Likes
              </h3>
              <p
                style={{
                  fontSize: '0.84rem',
                  color: '#6E6266',
                  margin: '6px 0 0 0',
                  lineHeight: 1.45,
                  maxWidth: '280px'
                }}
              >
                When someone likes you, they'll appear here.
              </p>
            </div>

            <button
              onClick={() => setCurrentView('discover')}
              style={{
                background: 'linear-gradient(135deg, #881337 0%, #9D174D 100%)',
                color: '#FFFFFF',
                padding: '11px 24px',
                borderRadius: '9999px',
                border: 'none',
                fontFamily: "system-ui, -apple-system, sans-serif",
                fontSize: '0.88rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 4px 14px rgba(136, 19, 55, 0.25)',
                marginTop: '4px'
              }}
            >
              <Compass size={16} />
              <span>Explore Profiles on Discover</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};


