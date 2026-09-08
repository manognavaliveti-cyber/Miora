import React from 'react';
import { useApp } from '../../context/AppContext';
import { Profile } from '../../types';
import { Sparkles, Plus, Crown, Flame, ShieldCheck } from 'lucide-react';

interface SpotlightCarouselProps {
  spotlightProfiles: Profile[];
}

export const SpotlightCarousel: React.FC<SpotlightCarouselProps> = ({ spotlightProfiles }) => {
  const { openProfileDetail, openBoostModal, currentUser } = useApp();

  return (
    <div style={{ marginBottom: '16px', width: '100%' }}>
      {/* Header Label */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '10px',
          padding: '0 4px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Sparkles size={16} color="var(--gold-deep)" />
          <span
            style={{
              fontSize: '0.86rem',
              fontWeight: 900,
              color: 'var(--text-primary)',
              letterSpacing: '-0.01em'
            }}
          >
            Spotlight & VIP Profiles
          </span>
        </div>

        <button
          onClick={openBoostModal}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--berry-primary)',
            fontSize: '0.78rem',
            fontWeight: 800,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '3px'
          }}
        >
          <Sparkles size={12} color="var(--gold-deep)" /> Spotlight Me
        </button>
      </div>

      {/* Horizontal Carousel */}
      <div
        className="scroll-touch-x"
        style={{
          display: 'flex',
          gap: '12px',
          overflowX: 'auto',
          padding: '4px 2px 8px 2px'
        }}
      >
        {/* Spotlight Me Add Card */}
        <div
          onClick={openBoostModal}
          style={{
            width: '74px',
            flexShrink: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '6px',
            cursor: 'pointer'
          }}
        >
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #FFF1F2 0%, #FEFCE8 100%)',
              border: '2px dashed var(--border-gold)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(212, 175, 55, 0.25)',
              position: 'relative'
            }}
          >
            <div
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                background: 'var(--primary-gradient)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFFFFF'
              }}
            >
              <Plus size={16} strokeWidth={3} />
            </div>

            <div
              style={{
                position: 'absolute',
                bottom: '-3px',
                background: '#CA8A04',
                color: '#FFFFFF',
                fontSize: '0.58rem',
                fontWeight: 900,
                padding: '1px 5px',
                borderRadius: 'var(--radius-pill)'
              }}
            >
              24H
            </div>
          </div>

          <span
            style={{
              fontSize: '0.74rem',
              fontWeight: 800,
              color: 'var(--berry-primary)',
              textAlign: 'center'
            }}
          >
            Spotlight
          </span>
        </div>

        {/* Featured Profiles */}
        {spotlightProfiles.map((prof) => {
          const photo =
            prof.photos[0] ||
            'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80';

          return (
            <div
              key={prof.id}
              onClick={() => openProfileDetail(prof)}
              style={{
                width: '74px',
                flexShrink: 0,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '6px',
                cursor: 'pointer',
                transition: 'transform var(--transition-fast)'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-2px)')}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
            >
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  padding: '2px',
                  background: 'linear-gradient(135deg, #F59E0B 0%, #D4AF37 50%, #E11D48 100%)',
                  boxShadow: '0 4px 14px rgba(245, 158, 11, 0.35)',
                  position: 'relative'
                }}
              >
                <img
                  src={photo}
                  alt={prof.name}
                  style={{
                    width: '100%',
                    height: '100%',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    display: 'block'
                  }}
                />

                {/* Online Indicator */}
                {prof.online && (
                  <div
                    style={{
                      position: 'absolute',
                      bottom: '2px',
                      right: '2px',
                      width: '12px',
                      height: '12px',
                      borderRadius: '50%',
                      background: '#10B981',
                      border: '2px solid #FFFFFF'
                    }}
                  />
                )}

                {/* Badge Crown */}
                <div
                  style={{
                    position: 'absolute',
                    top: '-4px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: 'linear-gradient(135deg, #FDE68A, #D4AF37)',
                    borderRadius: '50%',
                    width: '16px',
                    height: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.2)'
                  }}
                >
                  <Crown size={10} color="#4C0519" />
                </div>
              </div>

              <div style={{ textAlign: 'center', maxWidth: '72px' }}>
                <div
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    color: 'var(--text-primary)',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}
                >
                  {prof.name.split(' ')[0]}
                </div>
                <div style={{ fontSize: '0.66rem', color: '#CA8A04', fontWeight: 800 }}>
                  {prof.compatibility}% Vibe
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
