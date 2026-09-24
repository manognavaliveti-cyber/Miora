import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Gamepad2,
  Sparkles,
  Play,
  Trophy,
  Shuffle
} from 'lucide-react';
import { CoupleGame } from '../types';
import { getGamePriceCoins } from '../config/pricing';
import { PartnerSelectModal } from '../components/games/PartnerSelectModal';
import { GamePlayModal } from '../components/games/GamePlayModal';

const PLAY_PAGE_CSS = `
  /* Responsive games catalog grid: 2 cols on mobile, 3 on tablet, up to 4 on widescreen */
  .miora-games-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 12px;
    width: 100%;
  }
  @media (min-width: 640px) {
    .miora-games-grid {
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 16px;
      max-width: 860px;
      margin: 0 auto;
    }
  }
  @media (min-width: 1080px) {
    .miora-games-grid {
      grid-template-columns: repeat(4, minmax(0, 1fr));
      gap: 18px;
      max-width: 1120px;
      margin: 0 auto;
    }
  }

  .miora-game-card {
    background: var(--surface-white);
    border-radius: 20px;
    border: 1.5px solid var(--border-subtle);
    display: flex;
    flex-direction: column;
    position: relative;
    overflow: hidden;
    box-shadow: var(--shadow-sm);
    transition: transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
  }
  .miora-game-card:hover {
    transform: translateY(-4px);
    border-color: rgba(244, 63, 94, 0.4);
    box-shadow: 0 12px 28px rgba(225, 29, 72, 0.14);
  }

  .miora-game-media {
    position: relative;
    width: 100%;
    aspect-ratio: 4 / 3.8;
    overflow: hidden;
  }
  .miora-game-clip {
    position: absolute;
    inset: 0;
    overflow: hidden;
  }
  .miora-game-bg {
    position: absolute;
    left: -5%;
    top: -5%;
    width: 110%;
    height: 110%;
    object-fit: cover;
    filter: blur(18px) saturate(1.1) brightness(0.95);
  }
  .miora-game-art {
    position: absolute;
    inset: 8px;
    z-index: 1;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .miora-game-art img {
    display: block;
    width: auto;
    height: auto;
    max-width: 100%;
    max-height: 100%;
    border-radius: 12px;
    box-shadow: 0 6px 16px rgba(20, 6, 11, 0.25), 0 0 0 1.5px rgba(255, 255, 255, 0.85);
  }

  .miora-game-body {
    display: flex;
    flex-direction: column;
    flex: 1;
    padding: 10px 12px 12px 12px;
  }
  .miora-game-head {
    display: flex;
    align-items: center;
    gap: 8px;
    min-height: 32px;
  }
  .miora-game-title {
    margin: 0;
    font-size: 0.86rem;
    font-weight: 800;
    color: var(--text-primary);
    letter-spacing: -0.01em;
    line-height: 1.2;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .miora-game-badge {
    flex-shrink: 0;
    width: 30px;
    height: 30px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #FFFFFF 0%, #FFF0F3 100%);
    border: 1.5px solid var(--border-subtle);
    box-shadow: 0 2px 6px rgba(76, 5, 25, 0.08);
  }
  .miora-game-emoji {
    font-size: 1rem;
    line-height: 1;
  }

  .miora-game-chips {
    display: flex;
    align-items: center;
    gap: 6px;
    margin: 8px 0 10px 0;
  }
  .miora-chip-price {
    display: inline-flex;
    align-items: center;
    gap: 3px;
    padding: 3px 8px;
    border-radius: 9999px;
    background: linear-gradient(135deg, #FFF7D6 0%, #FFE9A8 100%);
    border: 1px solid rgba(217, 119, 6, 0.35);
    color: #8A5A00;
    font-size: 0.74rem;
    font-weight: 800;
    white-space: nowrap;
  }
  .miora-chip-time {
    display: inline-flex;
    align-items: center;
    gap: 3px;
    padding: 3px 8px;
    border-radius: 9999px;
    background: #FFF1F4;
    border: 1px solid var(--border-subtle);
    color: var(--text-secondary);
    font-size: 0.7rem;
    font-weight: 700;
    white-space: nowrap;
  }

  .miora-play-btn {
    margin-top: auto;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    background: var(--primary-gradient);
    color: #FFFFFF;
    border: none;
    padding: 9px 12px;
    border-radius: 9999px;
    font-weight: 800;
    font-size: 0.84rem;
    cursor: pointer;
    box-shadow: 0 4px 14px rgba(238, 56, 101, 0.28);
    transition: transform 0.18s ease, box-shadow 0.18s ease;
  }
  .miora-play-btn:hover {
    transform: scale(1.02);
    box-shadow: 0 6px 18px rgba(238, 56, 101, 0.4);
  }
  .miora-play-btn:active {
    transform: scale(0.97);
  }
`;

export const PlayPage: React.FC = () => {
  const { coupleGames, currentUser, walletBalance, openWalletPackModal } = useApp();
  const [selectedGame, setSelectedGame] = useState<CoupleGame | null>(null);
  const [isPartnerSelectOpen, setIsPartnerSelectOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const handleStartGame = (game: CoupleGame) => {
    const price = getGamePriceCoins(game);
    if ((walletBalance || 0) < price) {
      openWalletPackModal(`You need ₹${price} in your wallet to play ${game.title}.`, price);
      return;
    }
    setSelectedGame(game);
    setIsPartnerSelectOpen(true);
  };

  const handleRandomPlay = () => {
    if (coupleGames.length > 0) {
      const filtered = coupleGames.filter(
        (g) => activeCategory === 'all' || g.category === activeCategory
      );
      const pool = filtered.length > 0 ? filtered : coupleGames;
      const randomGame = pool[Math.floor(Math.random() * pool.length)];
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
        fontFamily: 'var(--font-primary)'
      }}
    >
      <style>{PLAY_PAGE_CSS}</style>

      {/* ==========================================
          HERO BANNER: LOVEGAMES ARCADE
          ========================================== */}
      <div
        style={{
          position: 'relative',
          borderRadius: '24px',
          background: 'linear-gradient(135deg, #2A0815 0%, #4C0519 40%, #701A31 80%, #9F1239 100%)',
          padding: 'clamp(20px, 3.5vw, 32px)',
          marginBottom: '24px',
          overflow: 'hidden',
          boxShadow: '0 12px 32px rgba(76, 5, 25, 0.25)',
          border: '1.5px solid rgba(244, 63, 94, 0.3)'
        }}
      >
        <div style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Top Pill Row */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', width: '100%' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                background: 'rgba(0, 0, 0, 0.35)',
                border: '1px solid rgba(212, 175, 55, 0.35)',
                padding: '4px 12px',
                borderRadius: 'var(--radius-pill)',
                fontSize: '0.78rem',
                color: '#FDE047',
                fontWeight: 700
              }}
            >
              <Sparkles size={14} color="#FDE047" />
              <span>₹ Wallet Enabled</span>
            </div>
          </div>

          {/* Main Title & Action Row */}
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
            <div style={{ maxWidth: '600px' }}>
              <h1
                style={{
                  fontSize: 'clamp(1.75rem, 3.2vw, 2.4rem)',
                  fontWeight: 800,
                  color: '#FFFFFF',
                  letterSpacing: '-0.03em',
                  lineHeight: 1.15,
                  margin: 0
                }}
              >
                Play. Laugh. Get Closer. ❤️
              </h1>
              <p style={{ fontSize: '0.88rem', color: '#FECDD3', margin: '6px 0 0 0', fontWeight: 500 }}>
                Interactive icebreakers and chemistry games designed for two.
              </p>
            </div>

            {/* Quick Action Button */}
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <button
                onClick={handleRandomPlay}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: 'linear-gradient(135deg, #FDE047 0%, #D4AF37 50%, #B45309 100%)',
                  color: '#1F161A',
                  border: 'none',
                  padding: '11px 22px',
                  borderRadius: 'var(--radius-pill)',
                  fontWeight: 800,
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  boxShadow: '0 6px 20px rgba(212, 175, 55, 0.35)',
                  transition: 'transform 0.18s ease, box-shadow 0.18s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.03)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                <Shuffle size={16} />
                <span>Spin Date Game 🎲</span>
              </button>
            </div>
          </div>

          {/* Gamified Player Progress Bar */}
          <div
            style={{
              marginTop: '4px',
              padding: '12px 16px',
              borderRadius: '16px',
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '10px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #F43F5E 0%, #BE123C 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFFFFF'
                }}
              >
                <Trophy size={18} />
              </div>
              <div>
                <div style={{ fontSize: '0.84rem', fontWeight: 800, color: '#FFFFFF' }}>
                  Chemistry Level 4 • <span style={{ color: '#FDE047' }}>Vibe Spark ✨</span>
                </div>
                <div style={{ fontSize: '0.72rem', color: '#FECDD3' }}>
                  {currentUser.gamesWonCount || 6} games completed • 92% mutual match accuracy
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '100px', height: '6px', background: 'rgba(255, 255, 255, 0.2)', borderRadius: '9999px', overflow: 'hidden' }}>
                <div style={{ width: '75%', height: '100%', background: 'linear-gradient(90deg, #F43F5E, #FDE047)', borderRadius: '9999px' }} />
              </div>
              <span style={{ fontSize: '0.74rem', fontWeight: 800, color: '#FFFFFF' }}>75/100 XP</span>
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
          padding: '2px 2px 18px 2px',
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
                fontWeight: isActive ? 800 : 600,
                fontSize: '0.84rem',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                boxShadow: isActive ? '0 4px 14px rgba(238, 56, 101, 0.28)' : 'var(--shadow-xs)',
                transition: 'transform 0.15s ease, border-color 0.15s ease, background 0.15s ease',
                flexShrink: 0
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.borderColor = 'var(--border-light)';
                  e.currentTarget.style.transform = 'translateY(-1px)';
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
          GAMES CATALOG GRID
          ========================================== */}
      <div className="miora-games-grid">
        {coupleGames
          .filter((game) => activeCategory === 'all' || game.category === activeCategory)
          .map((game) => {
            const price = getGamePriceCoins(game);
            return (
              <div key={game.id} className="miora-game-card">
                {/* Media frame: crisp artwork on soft romantic background without continuous animations */}
                <div className="miora-game-media">
                  <div
                    className="miora-game-clip"
                    style={{ background: `linear-gradient(135deg, ${game.accentColor}55 0%, ${game.accentColor}22 100%)` }}
                  >
                    {game.image && (
                      <img
                        className="miora-game-bg"
                        src={game.image}
                        alt=""
                        aria-hidden="true"
                        loading="lazy"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    )}

                    <div className="miora-game-art">
                      {game.image && (
                        <img
                          src={game.image}
                          alt={game.title}
                          loading="lazy"
                          decoding="async"
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).style.display = 'none';
                          }}
                        />
                      )}
                    </div>
                  </div>
                </div>

                <div className="miora-game-body">
                  <div className="miora-game-head">
                    <div className="miora-game-badge">
                      <span className="miora-game-emoji">{game.icon}</span>
                    </div>
                    <h3 className="miora-game-title">{game.title}</h3>
                  </div>

                  {/* Price & Duration Chips */}
                  <div className="miora-game-chips">
                    <span className="miora-chip-price">
                      <Sparkles size={11} color="#B7791F" />₹{price}
                    </span>
                    <span className="miora-chip-time">⏱️ {game.estimatedTimeMin}m</span>
                  </div>

                  {/* Action Play Button */}
                  <button className="miora-play-btn" onClick={() => handleStartGame(game)}>
                    <Play size={13} fill="#FFFFFF" />
                    <span>Play</span>
                  </button>
                </div>
              </div>
            );
          })}
      </div>

      {coupleGames.filter((game) => activeCategory === 'all' || game.category === activeCategory).length === 0 && (
        <div style={{ textAlign: 'center', padding: '48px 16px', color: 'var(--text-muted)' }}>
          <Gamepad2 size={32} style={{ marginBottom: '8px', opacity: 0.5 }} />
          <p style={{ fontSize: '0.9rem', fontWeight: 600 }}>No lovegames in this category yet — try another tab.</p>
        </div>
      )}

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
