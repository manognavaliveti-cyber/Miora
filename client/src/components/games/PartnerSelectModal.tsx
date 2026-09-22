import React from 'react';
import { useApp } from '../../context/AppContext';
import { X, Sparkles, Heart, Gamepad2 } from 'lucide-react';
import { CoupleGame, Profile } from '../../types';

interface PartnerSelectModalProps {
  game: CoupleGame | null;
  isOpen: boolean;
  onClose: () => void;
}

export const PartnerSelectModal: React.FC<PartnerSelectModalProps> = ({ game, isOpen, onClose }) => {
  const { matches, startGameWithPartner } = useApp();

  if (!isOpen || !game) return null;

  const handleSelect = (profile: Profile) => {
    startGameWithPartner(game, profile);
    onClose();
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(31, 22, 26, 0.75)',
        backdropFilter: 'blur(16px)',
        padding: '16px',
        animation: 'fadeIn 0.25s ease-out'
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '480px',
          maxHeight: '90vh',
          overflowY: 'auto',
          background: 'linear-gradient(180deg, #FFFFFF 0%, #FFF5F7 100%)',
          borderRadius: '28px',
          boxShadow: '0 24px 60px rgba(76, 5, 25, 0.35)',
          border: '1.5px solid var(--border-gold)',
          padding: 'clamp(20px, 4vw, 28px) clamp(16px, 3.5vw, 24px)',
          position: 'relative'
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            background: 'rgba(238, 56, 101, 0.08)',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: 'var(--text-secondary)'
          }}
        >
          <X size={18} />
        </button>

        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '20px',
              background: 'var(--primary-gradient)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 12px auto',
              fontSize: '2rem',
              boxShadow: 'var(--shadow-berry-glow)'
            }}
          >
            {game.icon}
          </div>
          <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            Play {game.title}
          </h3>
          <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
            Choose a match or connection to start this couple game together!
          </p>
        </div>

        {/* Matches List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '280px', overflowY: 'auto' }}>
          {matches.map((match) => {
            const photo =
              match.profile.photos[0] ||
              'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&q=80';
            return (
              <div
                key={match.id}
                onClick={() => handleSelect(match.profile)}
                style={{
                  background: 'var(--surface-white)',
                  border: '1.5px solid var(--border-subtle)',
                  borderRadius: '20px',
                  padding: '12px 18px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  transition: 'all var(--transition-fast)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--berry-primary)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border-subtle)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <img
                    src={photo}
                    alt={match.profile.name}
                    style={{
                      width: '46px',
                      height: '46px',
                      borderRadius: '50%',
                      objectFit: 'cover',
                      border: '2px solid var(--gold-champagne)'
                    }}
                  />
                  <div>
                    <div style={{ fontSize: '0.98rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                      {match.profile.name}, {match.profile.age}
                    </div>
                    <span style={{ fontSize: '0.76rem', color: 'var(--gold-deep)', fontWeight: 700 }}>
                      {match.profile.compatibility}% Vibe Match
                    </span>
                  </div>
                </div>

                <span
                  style={{
                    background: 'var(--primary-gradient)',
                    color: '#FFFFFF',
                    fontSize: '0.78rem',
                    fontWeight: 800,
                    padding: '6px 14px',
                    borderRadius: 'var(--radius-pill)',
                    boxShadow: 'var(--shadow-berry-glow)'
                  }}
                >
                  Play
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
