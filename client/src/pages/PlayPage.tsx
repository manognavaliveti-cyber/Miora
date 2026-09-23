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
import { getGamePriceCoins, MIORA_PRICING } from '../config/pricing';
import { PartnerSelectModal } from '../components/games/PartnerSelectModal';
import { GamePlayModal } from '../components/games/GamePlayModal';

const CARD_PARTICLES = [
  { emoji: '💗', left: '10%', size: '0.95rem', dur: '7s', delay: '0s' },
  { emoji: '✨', left: '28%', size: '0.8rem', dur: '8.5s', delay: '1.6s' },
  { emoji: '💕', left: '50%', size: '1.05rem', dur: '6.5s', delay: '3.1s' },
  { emoji: '✨', left: '68%', size: '0.75rem', dur: '7.5s', delay: '0.8s' },
  { emoji: '💖', left: '86%', size: '0.95rem', dur: '8s', delay: '2.4s' }
];

const PLAY_PAGE_CSS = `
  /* Compact grid: 2 cards per row on phones, 3 on tablets/desktop. */
  .miora-games-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; width: 100%; }
  @media (min-width: 640px) {
    .miora-games-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 16px; max-width: 780px; margin: 0 auto; }
  }
  .miora-game-card {
    background: var(--surface-white); border-radius: 22px; border: 1.5px solid var(--border-subtle);
    display: flex; flex-direction: column; position: relative; overflow: hidden; box-shadow: var(--shadow-md);
    transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.25s ease, box-shadow 0.25s ease;
  }
  .miora-game-card:hover { transform: translateY(-4px); border-color: rgba(244, 63, 94, 0.35); box-shadow: 0 14px 30px rgba(225, 29, 72, 0.16); }
  .miora-game-body { display: flex; flex-direction: column; flex: 1; padding: 10px 12px 12px 12px; }
  .miora-game-head { display: flex; align-items: center; gap: 8px; min-height: 34px; }
  .miora-game-title {
    margin: 0; font-size: 0.84rem; font-weight: 800; color: var(--text-primary); letter-spacing: -0.01em; line-height: 1.2;
    display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
  }
  .miora-game-chips { display: flex; align-items: center; gap: 6px; margin: 8px 0 10px 0; }
  .miora-chip-price {
    display: inline-flex; align-items: center; gap: 3px; padding: 3px 9px; border-radius: 9999px;
    background: linear-gradient(135deg, #FFF7D6 0%, #FFE9A8 100%); border: 1px solid rgba(217, 119, 6, 0.35);
    color: #8A5A00; font-size: 0.74rem; font-weight: 800; white-space: nowrap;
  }
  .miora-chip-time {
    display: inline-flex; align-items: center; gap: 3px; padding: 3px 9px; border-radius: 9999px;
    background: #FFF1F4; border: 1px solid var(--border-subtle); color: var(--text-secondary);
    font-size: 0.7rem; font-weight: 700; white-space: nowrap;
  }
  .miora-play-btn {
    margin-top: auto; width: 100%; display: flex; align-items: center; justify-content: center; gap: 6px;
    background: var(--primary-gradient); color: #FFFFFF; border: none; padding: 9px 12px; border-radius: 9999px;
    font-weight: 800; font-size: 0.84rem; cursor: pointer; box-shadow: 0 6px 16px rgba(238, 56, 101, 0.3);
    transition: transform 0.2s ease, box-shadow 0.2s ease;
  }
  .miora-play-btn:hover { transform: scale(1.03); box-shadow: 0 8px 20px rgba(238, 56, 101, 0.45); }
  .miora-play-btn:active { transform: scale(0.96); }

  /* Every card uses the same frame so the grid lines up perfectly. */
  .miora-game-media { position: relative; width: 100%; aspect-ratio: 4 / 5; }
  .miora-game-clip { position: absolute; inset: 0; overflow: hidden; }
  /* Soft blurred copy of the artwork fills the frame (same Ken Burns drift as before). */
  .miora-game-bg {
    position: absolute; left: -8%; top: -8%; width: 116%; height: 116%; object-fit: cover;
    filter: blur(22px) saturate(1.15) brightness(0.92); transform-origin: 50% 50%; will-change: transform;
    animation: mioraKenBurns 14s ease-in-out infinite alternate;
  }
  /* The complete, uncropped artwork sits centred in the frame and gently zooms inside its margin. */
  .miora-game-art {
    position: absolute; inset: 10px; z-index: 1;
    display: flex; align-items: center; justify-content: center;
  }
  .miora-game-art img {
    display: block; width: auto; height: auto; max-width: 100%; max-height: 100%;
    border-radius: 14px; transform-origin: 50% 50%; will-change: transform;
    box-shadow: 0 10px 22px rgba(20, 6, 11, 0.36), 0 0 0 2px rgba(255, 255, 255, 0.85);
    animation: mioraArtZoom 14s ease-in-out infinite alternate;
  }
  .miora-game-glow { position: absolute; inset: -20%; z-index: 2; mix-blend-mode: soft-light; animation: mioraGlowDrift 9s ease-in-out infinite alternate; pointer-events: none; }
  .miora-game-shine {
    position: absolute; top: 0; bottom: 0; left: -70%; width: 45%; z-index: 2;
    background: linear-gradient(100deg, transparent, rgba(255,255,255,0.3), transparent);
    transform: skewX(-18deg); animation: mioraShine 6s ease-in-out infinite; pointer-events: none;
  }
  .miora-particle {
    position: absolute; bottom: -8%; opacity: 0; pointer-events: none; z-index: 2;
    filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3)); animation: mioraFloatUp 7s linear infinite;
  }
  .miora-game-badge {
    position: relative; flex-shrink: 0; width: 32px; height: 32px;
    border-radius: 11px; display: flex; align-items: center; justify-content: center;
    background: linear-gradient(135deg, #FFFFFF 0%, #FFF0F3 100%); border: 1.5px solid #FFFFFF;
    box-shadow: 0 5px 12px rgba(76, 5, 25, 0.22); animation: mioraBadgeBob 3.2s ease-in-out infinite;
  }
  .miora-game-badge::before {
    content: ''; position: absolute; inset: -3px; border-radius: 14px;
    border: 1.5px solid rgba(244, 63, 94, 0.35); animation: mioraBadgePulse 2.6s ease-out infinite; pointer-events: none;
  }
  .miora-game-emoji { display: block; font-size: 1.05rem; line-height: 1; animation: mioraEmojiWiggle 4.2s ease-in-out infinite; }

  @keyframes mioraKenBurns { 0% { transform: scale(1.04) translate(0, 0); } 100% { transform: scale(1.2) translate(-3%, -2.5%); } }
  @keyframes mioraArtZoom { 0% { transform: scale(0.99) translateY(0); } 100% { transform: scale(1.04) translateY(-0.8%); } }
  @keyframes mioraGlowDrift { 0% { transform: translate(-6%, -4%); opacity: 0.7; } 100% { transform: translate(8%, 6%); opacity: 1; } }
  @keyframes mioraShine { 0%, 60% { left: -70%; } 100% { left: 140%; } }
  @keyframes mioraFloatUp {
    0% { transform: translateY(0) scale(0.8); opacity: 0; }
    15% { opacity: 0.95; }
    100% { transform: translateY(-190px) translateX(10px) scale(1.15); opacity: 0; }
  }
  @keyframes mioraBadgeBob { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-2px); } }
  @keyframes mioraBadgePulse { 0% { transform: scale(1); opacity: 0.7; } 70%, 100% { transform: scale(1.28); opacity: 0; } }
  @keyframes mioraEmojiWiggle {
    0%, 84%, 100% { transform: rotate(0) scale(1); }
    89% { transform: rotate(-10deg) scale(1.12); }
    94% { transform: rotate(8deg) scale(1.08); }
  }
  @media (prefers-reduced-motion: reduce) {
    .miora-game-bg, .miora-game-art img, .miora-game-glow, .miora-game-shine, .miora-particle,
    .miora-game-badge, .miora-game-badge::before, .miora-game-emoji { animation: none !important; }
  }
`;

export const PlayPage: React.FC = () => {
  const { coupleGames, matches, currentUser, walletBalance, openWalletPackModal } = useApp();
  const [selectedGame, setSelectedGame] = useState<CoupleGame | null>(null);
  const [isPartnerSelectOpen, setIsPartnerSelectOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const handleStartGame = (game: CoupleGame) => {
    const price = getGamePriceCoins(game);
    if ((walletBalance || 0) < price) {
      // Not enough wallet balance: open the add-money popup (same as chat) before choosing a partner.
      openWalletPackModal(`You need ₹${price} in your wallet to play ${game.title}.`, price);
      return;
    }
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
      <style>{PLAY_PAGE_CSS}</style>
      {/* ==========================================
          HERO BANNER: LOVEGAMES ARCADE ATMOSPHERE
          ========================================== */}
      <div
        style={{
          position: 'relative',
          borderRadius: 'clamp(20px, 3vw, 32px)',
          background: 'linear-gradient(135deg, #2A0815 0%, #4C0519 40%, #701A31 80%, #9F1239 100%)',
          padding: 'clamp(20px, 3.5vw, 36px)',
          marginBottom: '24px',
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
          {/* Top Right Corner Pill: 250 Coins per Game */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', width: '100%' }}>
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
              <Sparkles size={15} color="#FDE047" />
              <span>₹ Wallet Enabled</span>
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
                Play. Laugh. Get Closer. ❤️
              </h1>
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
                  padding: 'clamp(10px, 2vw, 12px) clamp(16px, 3vw, 24px)',
                  borderRadius: 'var(--radius-pill)',
                  fontWeight: 800,
                  fontSize: 'clamp(0.82rem, 2vw, 0.92rem)',
                  cursor: 'pointer',
                  boxShadow: '0 8px 24px rgba(212, 175, 55, 0.4)',
                  transition: 'all var(--transition-fast)',
                  whiteSpace: 'nowrap'
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
                <Shuffle size={16} />
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
      <div className="miora-games-grid">
        {coupleGames
          .filter((game) => activeCategory === 'all' || game.category === activeCategory)
          .map((game, index) => {
          const price = getGamePriceCoins(game);
          return (
            <div key={game.id} className="miora-game-card">
              {/* Media: the COMPLETE artwork (never cropped) over a softly animated blurred backdrop. */}
              <div className="miora-game-media">
                <div
                  className="miora-game-clip"
                  style={{ background: `linear-gradient(135deg, ${game.accentColor}88 0%, ${game.accentColor}33 100%)` }}
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
                      style={{
                        animationDelay: `${-(index % 4) * 3}s`,
                        animationDirection: index % 2 ? 'alternate-reverse' : 'alternate'
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
                        style={{
                          animationDelay: `${-(index % 4) * 3}s`,
                          animationDirection: index % 2 ? 'alternate-reverse' : 'alternate'
                        }}
                      />
                    )}
                  </div>

                  {/* Soft colour glow that drifts across the photo */}
                  <div
                    className="miora-game-glow"
                    style={{ background: `radial-gradient(circle at 30% 35%, ${game.accentColor}66 0%, transparent 60%)`, animationDelay: `${-(index % 3) * 2}s` }}
                  />

                  {/* Light sweep */}
                  <div className="miora-game-shine" style={{ animationDelay: `${(index % 4) * 1.1}s` }} />

                  {/* Floating hearts & sparkles */}
                  {CARD_PARTICLES.map((pt, i) => (
                    <span
                      key={i}
                      className="miora-particle"
                      style={{ left: pt.left, fontSize: pt.size, animationDuration: pt.dur, animationDelay: `${parseFloat(pt.delay) + (index % 3) * 0.7}s` }}
                    >
                      {pt.emoji}
                    </span>
                  ))}
                </div>
              </div>

              <div className="miora-game-body">
                <div className="miora-game-head">
                  <div className="miora-game-badge">
                    <span className="miora-game-emoji">{game.icon}</span>
                  </div>
                  <h3 className="miora-game-title">{game.title}</h3>
                </div>

                {/* Price + time chips (kept off the artwork so the whole image stays visible) */}
                <div className="miora-game-chips">
                  <span className="miora-chip-price">
                    <Sparkles size={11} color="#B7791F" />₹{price}
                  </span>
                  <span className="miora-chip-time">⏱️ {game.estimatedTimeMin}m</span>
                </div>

                <button className="miora-play-btn" onClick={() => handleStartGame(game)}>
                  <Play size={14} fill="#FFFFFF" />
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
