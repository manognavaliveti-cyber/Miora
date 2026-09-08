import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Gamepad2,
  Sparkles,
  Heart,
  Flame,
  Award,
  Clock,
  Play,
  Zap,
  Lock,
  Coins,
  Trophy,
  Users,
  Compass,
  Shuffle,
  Star,
  CheckCircle2
} from 'lucide-react';
import { CoupleGame } from '../types';
import { PartnerSelectModal } from '../components/games/PartnerSelectModal';
import { GamePlayModal } from '../components/games/GamePlayModal';

export const PlayPage: React.FC = () => {
  const { coupleGames, matches, currentUser } = useApp();
  const [selectedGame, setSelectedGame] = useState<CoupleGame | null>(null);
  const [isPartnerSelectOpen, setIsPartnerSelectOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const handleStartGame = (game: CoupleGame) => {
    setSelectedGame(game);
    setIsPartnerSelectOpen(true);
  };

  const handleRandomPlay = () => {
    if (coupleGames.length > 0) {
      const randomGame = coupleGames[Math.floor(Math.random() * coupleGames.length)];
      handleStartGame(randomGame);
    }
  };

  const categories = [
    { id: 'all', label: '🔥 All Lovegames' },
    { id: 'truth', label: '💘 Truth or Dare' },
    { id: 'quiz', label: '🧩 Couple Quiz' },
    { id: 'would_you_rather', label: '💫 Would You Rather' },
    { id: 'first_date', label: '✨ First Date Icebreakers' },
    { id: 'spicy', label: '🥂 Spicy Chemistry' }
  ];

  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        padding: '8px 0 48px 0',
        width: '100%',
        margin: '0 auto',
        animation: 'fadeIn 0.25s ease-out forwards',
        fontFamily: 'var(--font-primary)'
      }}
    >
      {/* ==========================================
          HERO BANNER: LOVEGAMES ARCADE ATMOSPHERE
          ========================================== */}
      <div
        style={{
          position: 'relative',
          borderRadius: '32px',
          background: 'linear-gradient(135deg, #2A0815 0%, #4C0519 40%, #701A31 80%, #9F1239 100%)',
          padding: 'clamp(24px, 4vw, 36px)',
          marginBottom: '32px',
          overflow: 'hidden',
          boxShadow: '0 20px 50px rgba(76, 5, 25, 0.35)',
          border: '1.5px solid rgba(244, 63, 94, 0.3)'
        }}
      >
        {/* Ambient Glowing Orbs Background */}
        <div
          style={{
            position: 'absolute',
            top: '-60px',
            right: '-40px',
            width: '280px',
            height: '280px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(244, 63, 94, 0.45) 0%, transparent 70%)',
            filter: 'blur(40px)',
            pointerEvents: 'none'
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '-40px',
            left: '20%',
            width: '220px',
            height: '220px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(212, 175, 55, 0.3) 0%, transparent 70%)',
            filter: 'blur(35px)',
            pointerEvents: 'none'
          }}
        />

        <div style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Top Badge Strip */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: 'rgba(255, 255, 255, 0.12)',
                  border: '1px solid rgba(255, 255, 255, 0.25)',
                  backdropFilter: 'blur(12px)',
                  padding: '5px 14px',
                  borderRadius: 'var(--radius-pill)',
                  fontSize: '0.74rem',
                  fontWeight: 800,
                  color: '#FFE4E6',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase'
                }}
              >
                <Flame size={14} color="#F43F5E" fill="#F43F5E" />
                LOVEGAMES ARENA • 2-PLAYER CHEMISTRY
              </span>
            </div>

            {/* Live Stats Pill */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: 'rgba(0, 0, 0, 0.35)',
                border: '1px solid rgba(212, 175, 55, 0.35)',
                padding: '5px 14px',
                borderRadius: 'var(--radius-pill)',
                fontSize: '0.78rem',
                color: '#FDE047',
                fontWeight: 700
              }}
            >
              <Coins size={15} color="#FDE047" />
              <span>Earn +25 Coins per Win</span>
            </div>
          </div>

          {/* Main Title & Action Row */}
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px' }}>
            <div style={{ maxWidth: '640px' }}>
              <h1
                style={{
                  fontSize: 'clamp(2rem, 3.5vw, 2.8rem)',
                  fontWeight: 800,
                  color: '#FFFFFF',
                  letterSpacing: '-0.03em',
                  lineHeight: 1.15,
                  margin: 0
                }}
              >
                Play with Your Matches <span style={{ color: '#FB7185' }}>&</span> Ignite the Spark 🔥
              </h1>
              <p style={{ fontSize: '0.96rem', color: '#FECDD3', marginTop: '10px', lineHeight: 1.6, opacity: 0.9 }}>
                Multiplayer interactive mini-games tailored for two. Answer real-time quiz questions, test mutual compatibility, uncover secret romantic quirks, and unlock exclusive rewards.
              </p>
            </div>

            {/* Quick Action Button */}
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <button
                onClick={handleRandomPlay}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: 'linear-gradient(135deg, #FDE047 0%, #D4AF37 50%, #B45309 100%)',
                  color: '#1F161A',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: 'var(--radius-pill)',
                  fontWeight: 800,
                  fontSize: '0.92rem',
                  cursor: 'pointer',
                  boxShadow: '0 8px 24px rgba(212, 175, 55, 0.4)',
                  transition: 'all var(--transition-fast)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.05)';
                  e.currentTarget.style.boxShadow = '0 12px 30px rgba(212, 175, 55, 0.55)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(212, 175, 55, 0.4)';
                }}
              >
                <Shuffle size={17} />
                <span>Spin Date Game 🎲</span>
              </button>
            </div>
          </div>

          {/* Gamified Player Progress Bar */}
          <div
            style={{
              marginTop: '8px',
              padding: '14px 18px',
              borderRadius: '20px',
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '12px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #F43F5E 0%, #BE123C 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFFFFF'
                }}
              >
                <Trophy size={20} />
              </div>
              <div>
                <div style={{ fontSize: '0.86rem', fontWeight: 800, color: '#FFFFFF' }}>
                  Chemistry Level 4 • <span style={{ color: '#FDE047' }}>Vibe Spark ✨</span>
                </div>
                <div style={{ fontSize: '0.74rem', color: '#FECDD3' }}>
                  {currentUser.gamesWonCount || 6} games completed • 92% mutual match accuracy
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '120px', height: '8px', background: 'rgba(255, 255, 255, 0.2)', borderRadius: '9999px', overflow: 'hidden' }}>
                <div style={{ width: '75%', height: '100%', background: 'linear-gradient(90deg, #F43F5E, #FDE047)', borderRadius: '9999px' }} />
              </div>
              <span style={{ fontSize: '0.76rem', fontWeight: 800, color: '#FFFFFF' }}>75/100 XP</span>
            </div>
          </div>
        </div>
      </div>

      {/* ==========================================
          CATEGORY FILTER TABS
          ========================================== */}
      <div
        className="scroll-touch-x"
        style={{
          display: 'flex',
          gap: '8px',
          overflowX: 'auto',
          padding: '4px 2px 20px 2px',
          whiteSpace: 'nowrap'
        }}
      >
        {categories.map((cat) => {
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              style={{
                padding: '8px 16px',
                borderRadius: 'var(--radius-pill)',
                border: isActive ? '1.5px solid transparent' : '1px solid var(--border-subtle)',
                background: isActive ? 'var(--primary-gradient)' : 'var(--surface-white)',
                color: isActive ? '#FFFFFF' : 'var(--text-secondary)',
                fontWeight: isActive ? 700 : 600,
                fontSize: '0.84rem',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                boxShadow: isActive ? '0 4px 14px rgba(238, 56, 101, 0.3)' : 'var(--shadow-xs)',
                transition: 'all var(--transition-fast)',
                flexShrink: 0
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.borderColor = 'var(--border-light)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.borderColor = 'var(--border-subtle)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }
              }}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* ==========================================
          GAMES CATALOG GRID (VIBEY LOVEGAMES CARDS)
          ========================================== */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 260px), 1fr))',
          gap: '24px'
        }}
      >
        {coupleGames.map((game, index) => {
          return (
            <div
              key={game.id}
              style={{
                background: 'var(--surface-white)',
                borderRadius: '28px',
                border: '1.5px solid var(--border-subtle)',
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                position: 'relative',
                overflow: 'hidden',
                boxShadow: 'var(--shadow-md)',
                transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-6px)';
                e.currentTarget.style.borderColor = 'rgba(244, 63, 94, 0.35)';
                e.currentTarget.style.boxShadow = '0 16px 36px rgba(225, 29, 72, 0.16)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = 'var(--border-subtle)';
                e.currentTarget.style.boxShadow = 'var(--shadow-md)';
              }}
            >
              {/* Background Subtle Gradient Glow Accent */}
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  width: '140px',
                  height: '140px',
                  background: 'radial-gradient(circle, rgba(244, 63, 94, 0.08) 0%, transparent 70%)',
                  borderRadius: '50%',
                  pointerEvents: 'none'
                }}
              />

              <div>
                {/* Header: Icon, Tags & Reward */}
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px', marginBottom: '16px' }}>
                  {/* 3D-Style Game Icon Badge with Neon Ring */}
                  <div
                    style={{
                      width: '60px',
                      height: '60px',
                      borderRadius: '20px',
                      background: 'linear-gradient(135deg, rgba(254, 226, 232, 0.9) 0%, rgba(254, 205, 211, 0.6) 100%)',
                      border: '1.5px solid rgba(244, 63, 94, 0.2)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '2.1rem',
                      boxShadow: '0 6px 18px rgba(244, 63, 94, 0.12)'
                    }}
                  >
                    {game.icon}
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px' }}>
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.15) 0%, rgba(244, 63, 94, 0.08) 100%)',
                        border: '1px solid var(--border-gold)',
                        color: 'var(--gold-deep)',
                        fontSize: '0.72rem',
                        fontWeight: 800,
                        padding: '3px 10px',
                        borderRadius: 'var(--radius-pill)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.04em'
                      }}
                    >
                      <Coins size={12} color="var(--gold-deep)" />
                      +15 Coins
                    </span>

                    <span
                      style={{
                        fontSize: '0.72rem',
                        fontWeight: 600,
                        color: 'var(--text-muted)'
                      }}
                    >
                      ⏱️ {game.estimatedTimeMin} mins • {game.questionsCount} rounds
                    </span>
                  </div>
                </div>

                {/* Game Title & Concise Vibe */}
                <h3
                  style={{
                    fontSize: '1.25rem',
                    fontWeight: 800,
                    color: 'var(--text-primary)',
                    letterSpacing: '-0.02em',
                    lineHeight: 1.25,
                    marginBottom: '6px'
                  }}
                >
                  {game.title}
                </h3>
                <div
                  style={{
                    fontSize: '0.86rem',
                    fontWeight: 600,
                    color: 'var(--berry-primary)',
                    marginBottom: '16px',
                    lineHeight: 1.4
                  }}
                >
                  ✨ {game.tagline || game.description}
                </div>
              </div>

              {/* Bottom Interactive Area: Active Playing Indicator & Launch Button */}
              <div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 12px',
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--bg-warm-ivory)',
                    border: '1px solid var(--border-subtle)',
                    marginBottom: '14px',
                    fontSize: '0.78rem',
                    color: 'var(--text-secondary)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#10B981', display: 'inline-block' }} />
                    <span><strong>1,240+</strong> playing today</span>
                  </div>
                  <span style={{ fontWeight: 700, color: 'var(--berry-primary)' }}>2 Players 👫</span>
                </div>

                <button
                  onClick={() => handleStartGame(game)}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    background: 'var(--primary-gradient)',
                    color: '#FFFFFF',
                    border: 'none',
                    padding: '13px 20px',
                    borderRadius: 'var(--radius-pill)',
                    fontWeight: 700,
                    fontSize: '0.94rem',
                    cursor: 'pointer',
                    boxShadow: 'var(--shadow-berry-glow)',
                    transition: 'all var(--transition-fast)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.02)';
                    e.currentTarget.style.boxShadow = '0 8px 24px rgba(238, 56, 101, 0.45)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.boxShadow = 'var(--shadow-berry-glow)';
                  }}
                >
                  <Play size={16} fill="#FFFFFF" />
                  <span>Invite Match to Play</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* ==========================================
          MODALS
          ========================================== */}
      {isPartnerSelectOpen && selectedGame && (
        <PartnerSelectModal
          game={selectedGame}
          isOpen={isPartnerSelectOpen}
          onClose={() => setIsPartnerSelectOpen(false)}
        />
      )}

      <GamePlayModal />
    </div>
  );
};
