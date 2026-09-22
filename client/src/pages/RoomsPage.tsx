import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Radio,
  Sparkles,
  Users,
  Mic,
  Plus,
  Flame,
  Heart,
  Volume2,
  Headphones,
  Shuffle,
  Music,
  Zap,
  TrendingUp,
  Tag,
  Award
} from 'lucide-react';
import { LiveRoom } from '../types';
import { LiveRoomModal } from '../components/rooms/LiveRoomModal';
import { CreateRoomModal } from '../components/rooms/CreateRoomModal';

export const RoomsPage: React.FC = () => {
  const { liveRooms, joinLiveRoom } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const filteredRooms = liveRooms.filter((room) =>
    selectedCategory === 'all' ? true : room.category === selectedCategory
  );

  // Identify highest listener room for the featured spotlight
  const spotlightRoom = liveRooms.reduce((prev, curr) =>
    (curr.listenersCount || 0) > (prev?.listenersCount || 0) ? curr : prev
  , liveRooms[0]);

  const totalListeners = liveRooms.reduce((sum, r) => sum + (r.listenersCount || 0), 0);

  const handleQuickTuneIn = () => {
    if (spotlightRoom) {
      joinLiveRoom(spotlightRoom);
    } else if (liveRooms.length > 0) {
      joinLiveRoom(liveRooms[0]);
    }
  };

  const categories = [
    { id: 'all', label: '🔥 All Live Stages' },
    { id: 'advice', label: '💬 First Date Advice' },
    { id: 'relationship', label: '❤️ Relationship Talks' },
    { id: 'crush', label: '💘 Approaching Crush' },
    { id: 'breakup', label: '💔 Breakup Support' },
    { id: 'stories', label: '😂 Wild Dating Stories' }
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
          HERO BROADCAST STAGE: ON AIR AUDIO CLUB
          ========================================== */}
      <div
        style={{
          position: 'relative',
          borderRadius: '32px',
          background: 'linear-gradient(135deg, #1F0713 0%, #380C1E 45%, #590F2C 80%, #7D153B 100%)',
          padding: 'clamp(24px, 4vw, 36px)',
          marginBottom: '32px',
          overflow: 'hidden',
          boxShadow: '0 20px 50px rgba(76, 5, 25, 0.35)',
          border: '1.5px solid rgba(244, 63, 94, 0.3)'
        }}
      >
        {/* Ambient Blurred Lighting Orbs */}
        <div
          style={{
            position: 'absolute',
            top: '-50px',
            right: '-30px',
            width: '280px',
            height: '280px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(244, 63, 94, 0.45) 0%, transparent 70%)',
            filter: 'blur(45px)',
            pointerEvents: 'none'
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '-40px',
            left: '15%',
            width: '240px',
            height: '240px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(212, 175, 55, 0.28) 0%, transparent 70%)',
            filter: 'blur(40px)',
            pointerEvents: 'none'
          }}
        />

        <div style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Top Live Broadcast Header Strip */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: 'rgba(238, 56, 101, 0.25)',
                  color: '#FFE4E6',
                  border: '1px solid rgba(244, 63, 94, 0.4)',
                  backdropFilter: 'blur(12px)',
                  padding: '5px 14px',
                  borderRadius: 'var(--radius-pill)',
                  fontSize: '0.74rem',
                  fontWeight: 800,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase'
                }}
              >
                <span
                  className="animate-live-pulse"
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: '#F43F5E',
                    display: 'inline-block'
                  }}
                />
                LIVE ON AIR • AUDIO STAGES
              </span>

              {/* Animated Equalizer Wave Visualizer */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '3px', height: '16px', padding: '0 4px' }}>
                <span style={{ width: '3px', background: '#F43F5E', borderRadius: '3px', animation: 'soundWave 1.2s infinite ease-in-out' }} />
                <span style={{ width: '3px', background: '#FB7185', borderRadius: '3px', animation: 'soundWave 0.9s infinite ease-in-out 0.2s' }} />
                <span style={{ width: '3px', background: '#FDE047', borderRadius: '3px', animation: 'soundWave 1.4s infinite ease-in-out 0.4s' }} />
                <span style={{ width: '3px', background: '#F43F5E', borderRadius: '3px', animation: 'soundWave 1.1s infinite ease-in-out 0.1s' }} />
                <span style={{ width: '3px', background: '#FB7185', borderRadius: '3px', animation: 'soundWave 1.3s infinite ease-in-out 0.3s' }} />
              </div>
            </div>

            {/* Total Listener Counter Pill */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: 'rgba(0, 0, 0, 0.4)',
                border: '1px solid rgba(212, 175, 55, 0.35)',
                padding: '5px 14px',
                borderRadius: 'var(--radius-pill)',
                fontSize: '0.78rem',
                color: '#FDE047',
                fontWeight: 700
              }}
            >
              <Headphones size={15} color="#FDE047" />
              <span>{totalListeners.toLocaleString()}+ Daters Tuned In</span>
            </div>
          </div>

          {/* Title and Action Buttons Row */}
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
                MIORA Live Lounges <span style={{ color: '#FB7185' }}>&</span> Dating Stages 🎙️
              </h1>
              <p style={{ fontSize: '0.96rem', color: '#FECDD3', marginTop: '10px', lineHeight: 1.6, opacity: 0.9 }}>
                Step into spontaneous live dating rooms. Listen to unfiltered relationship discussions, ask questions on stage, share funny date confessions, and vibe with the community in real time.
              </p>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <button
                onClick={handleQuickTuneIn}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: 'rgba(255, 255, 255, 0.12)',
                  color: '#FFFFFF',
                  border: '1.5px solid rgba(255, 255, 255, 0.25)',
                  padding: '12px 20px',
                  borderRadius: 'var(--radius-pill)',
                  fontWeight: 700,
                  fontSize: '0.92rem',
                  cursor: 'pointer',
                  backdropFilter: 'blur(10px)',
                  transition: 'all var(--transition-fast)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.12)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <Shuffle size={17} color="#FDE047" />
                <span>Quick Tune In</span>
              </button>

              <button
                onClick={() => setIsCreateOpen(true)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: 'linear-gradient(135deg, #F43F5E 0%, #BE123C 100%)',
                  color: '#FFFFFF',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: 'var(--radius-pill)',
                  fontWeight: 800,
                  fontSize: '0.92rem',
                  cursor: 'pointer',
                  boxShadow: '0 8px 24px rgba(244, 63, 94, 0.45)',
                  transition: 'all var(--transition-fast)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.05)';
                  e.currentTarget.style.boxShadow = '0 12px 30px rgba(244, 63, 94, 0.6)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(244, 63, 94, 0.45)';
                }}
              >
                <Mic size={17} />
                <span>Host a Live Stage</span>
              </button>
            </div>
          </div>

          {/* Quick Stage Stats Footer */}
          <div
            style={{
              marginTop: '6px',
              padding: '12px 18px',
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sparkles size={16} color="#FDE047" />
              <span style={{ fontSize: '0.84rem', color: '#FFFFFF', fontWeight: 700 }}>
                {liveRooms.length} Active Audio Lounges Right Now
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '0.78rem', color: '#FECDD3' }}>
              <span>🎙️ Open Mic Q&A</span>
              <span>•</span>
              <span>🌹 Send Host Gifts</span>
              <span>•</span>
              <span>💬 Live Chat Feed</span>
            </div>
          </div>
        </div>
      </div>

      {/* ==========================================
          SPOTLIGHT FEATURED LIVE LOUNGE (HERO CARD)
          ========================================== */}
      {spotlightRoom && (
        <div
          style={{
            position: 'relative',
            borderRadius: '28px',
            background: 'linear-gradient(135deg, #FFF1F5 0%, #FFFFFF 50%, #FFF8FA 100%)',
            border: '2px solid var(--border-gold)',
            padding: '24px 28px',
            marginBottom: '32px',
            boxShadow: '0 12px 36px rgba(225, 29, 72, 0.1)',
            display: 'flex',
            flexDirection: 'column',
            gap: '18px',
            overflow: 'hidden'
          }}
        >
          {/* Spotlight Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: 'linear-gradient(135deg, #FDE047 0%, #D4AF37 100%)',
                  color: '#1F161A',
                  padding: '4px 12px',
                  borderRadius: 'var(--radius-pill)',
                  fontSize: '0.72rem',
                  fontWeight: 900,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase'
                }}
              >
                <Flame size={13} fill="#1F161A" />
                #1 FEATURED STAGE
              </span>

              <span
                style={{
                  fontSize: '0.76rem',
                  fontWeight: 800,
                  color: 'var(--berry-primary)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <Users size={14} />
                {spotlightRoom.listenersCount} daters listening right now
              </span>
            </div>

            {/* Tags Strip */}
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {spotlightRoom.tags?.map((tag, i) => (
                <span
                  key={i}
                  style={{
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    color: 'var(--text-secondary)',
                    background: 'rgba(238, 56, 101, 0.08)',
                    padding: '2px 8px',
                    borderRadius: 'var(--radius-pill)'
                  }}
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          {/* Spotlight Body */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px' }}>
            <div style={{ flex: 1, minWidth: '280px' }}>
              <h2
                style={{
                  fontSize: '1.45rem',
                  fontWeight: 800,
                  color: 'var(--text-primary)',
                  letterSpacing: '-0.02em',
                  lineHeight: 1.3,
                  margin: 0
                }}
              >
                {spotlightRoom.title}
              </h2>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '6px', lineHeight: 1.5 }}>
                {spotlightRoom.description}
              </p>

              {/* Speakers with Speaking Ripple Rings */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {spotlightRoom.speakers.map((spk, idx) => (
                    <div
                      key={spk.id}
                      style={{
                        position: 'relative',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center'
                      }}
                    >
                      <div
                        className={spk.isHost ? 'animate-speaking-ripple' : ''}
                        style={{
                          width: '46px',
                          height: '46px',
                          borderRadius: '50%',
                          padding: '2px',
                          background: spk.isHost ? 'var(--primary-gradient)' : 'var(--gold-gradient)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        <img
                          src={spk.photo}
                          alt={spk.name}
                          style={{
                            width: '100%',
                            height: '100%',
                            borderRadius: '50%',
                            objectFit: 'cover'
                          }}
                        />
                      </div>
                      {spk.isHost && (
                        <span
                          style={{
                            position: 'absolute',
                            bottom: '-6px',
                            background: 'var(--berry-primary)',
                            color: '#FFFFFF',
                            fontSize: '0.56rem',
                            fontWeight: 900,
                            padding: '1px 5px',
                            borderRadius: 'var(--radius-pill)'
                          }}
                        >
                          HOST
                        </span>
                      )}
                    </div>
                  ))}
                </div>

                <div style={{ fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
                  Hosted by <strong style={{ color: 'var(--text-primary)' }}>{spotlightRoom.host.name}</strong>
                  <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                    {spotlightRoom.speakers.length} speakers on stage
                  </div>
                </div>
              </div>
            </div>

            {/* Spotlight Action Button */}
            <button
              onClick={() => joinLiveRoom(spotlightRoom)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: 'var(--primary-gradient)',
                color: '#FFFFFF',
                border: 'none',
                padding: '14px 28px',
                borderRadius: 'var(--radius-pill)',
                fontWeight: 800,
                fontSize: '0.98rem',
                cursor: 'pointer',
                boxShadow: 'var(--shadow-berry-glow)',
                transition: 'all var(--transition-fast)',
                whiteSpace: 'nowrap'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.04)';
                e.currentTarget.style.boxShadow = '0 12px 30px rgba(238, 56, 101, 0.55)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = 'var(--shadow-berry-glow)';
              }}
            >
              <Volume2 size={18} />
              <span>Join Spotlight Stage</span>
            </button>
          </div>
        </div>
      )}

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
          const isActive = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
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
          LIVE ROOMS CATALOG GRID (VIBEY AUDIO CARDS)
          ========================================== */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 260px), 1fr))',
          gap: '16px'
        }}
      >
        {filteredRooms.map((room) => {
          return (
            <div
              key={room.id}
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
              {/* Background Glow Accent */}
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  width: '130px',
                  height: '130px',
                  background: 'radial-gradient(circle, rgba(244, 63, 94, 0.08) 0%, transparent 70%)',
                  borderRadius: '50%',
                  pointerEvents: 'none'
                }}
              />

              <div>
                {/* Header: Live Badge, Equalizer & Listeners */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span
                      style={{
                        background: 'rgba(238, 56, 101, 0.1)',
                        color: 'var(--berry-primary)',
                        border: '1px solid rgba(238, 56, 101, 0.25)',
                        fontSize: '0.72rem',
                        fontWeight: 900,
                        padding: '4px 10px',
                        borderRadius: 'var(--radius-pill)',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      <span
                        className="animate-live-pulse"
                        style={{
                          width: '6px',
                          height: '6px',
                          borderRadius: '50%',
                          background: 'var(--berry-primary)',
                          display: 'inline-block'
                        }}
                      />
                      LIVE STAGE
                    </span>

                    {/* Animated Equalizer Mini Bars */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '2px', height: '12px' }}>
                      <span style={{ width: '2.5px', background: 'var(--berry-primary)', borderRadius: '2px', animation: 'soundWave 1s infinite ease-in-out' }} />
                      <span style={{ width: '2.5px', background: 'var(--berry-primary)', borderRadius: '2px', animation: 'soundWave 0.8s infinite ease-in-out 0.15s' }} />
                      <span style={{ width: '2.5px', background: 'var(--berry-primary)', borderRadius: '2px', animation: 'soundWave 1.2s infinite ease-in-out 0.3s' }} />
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--gold-deep)', fontSize: '0.8rem', fontWeight: 800 }}>
                    <Users size={15} color="var(--gold-deep)" />
                    <span>{room.listenersCount} tuned in</span>
                  </div>
                </div>

                {/* Title & Description */}
                <h3
                  style={{
                    fontSize: '1.28rem',
                    fontWeight: 800,
                    color: 'var(--text-primary)',
                    letterSpacing: '-0.02em',
                    lineHeight: 1.3,
                    marginBottom: '8px'
                  }}
                >
                  {room.title}
                </h3>
                <p
                  style={{
                    fontSize: '0.88rem',
                    color: 'var(--text-secondary)',
                    lineHeight: 1.5,
                    marginBottom: '16px',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}
                >
                  {room.description}
                </p>

                {/* Tags */}
                {room.tags && room.tags.length > 0 && (
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '18px' }}>
                    {room.tags.map((t, idx) => (
                      <span
                        key={idx}
                        style={{
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          color: 'var(--text-muted)',
                          background: 'var(--bg-warm-ivory)',
                          border: '1px solid var(--border-subtle)',
                          padding: '2px 8px',
                          borderRadius: 'var(--radius-pill)'
                        }}
                      >
                        #{t}
                      </span>
                    ))}
                  </div>
                )}

                {/* Speaker Avatar Stack */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '10px 14px',
                    borderRadius: '18px',
                    background: 'var(--bg-warm-ivory)',
                    border: '1px solid var(--border-subtle)',
                    marginBottom: '18px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    {room.speakers.map((spk, idx) => (
                      <div
                        key={spk.id}
                        style={{
                          position: 'relative',
                          marginLeft: idx > 0 ? '-10px' : '0',
                          zIndex: room.speakers.length - idx
                        }}
                      >
                        <img
                          src={spk.photo}
                          alt={spk.name}
                          style={{
                            width: '36px',
                            height: '36px',
                            borderRadius: '50%',
                            objectFit: 'cover',
                            border: '2px solid #FFFFFF',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                          }}
                        />
                      </div>
                    ))}
                  </div>

                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    Host: <strong style={{ color: 'var(--text-primary)' }}>{room.host.name}</strong>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                      {room.speakers.length} on mic • Active discussion
                    </div>
                  </div>
                </div>
              </div>

              {/* Join Button */}
              <button
                onClick={() => joinLiveRoom(room)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  background: 'var(--primary-gradient)',
                  color: '#FFFFFF',
                  border: 'none',
                  padding: '12px 20px',
                  borderRadius: 'var(--radius-pill)',
                  fontWeight: 700,
                  fontSize: '0.92rem',
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
                <Volume2 size={16} />
                <span>Tune In & Listen</span>
              </button>
            </div>
          );
        })}
      </div>

      {/* Live Room Modal */}
      <LiveRoomModal />

      {/* Create Room Modal */}
      <CreateRoomModal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} />
    </div>
  );
};
