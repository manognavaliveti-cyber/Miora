import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  Mic,
  MicOff,
  Hand,
  Gift,
  Send,
  Users,
  Radio,
  Flame,
  Heart,
  Share2,
  LogOut,
  Sparkles,
  Headphones
} from 'lucide-react';
import { VirtualGift } from '../../types';
import { MIORA_PRICING } from '../../config/pricing';

export const LiveRoomModal: React.FC = () => {
  const {
    activeLiveRoom,
    isInsideRoomModal,
    leaveLiveRoom,
    roomComments,
    sendRoomComment,
    sendRoomReaction,
    raiseHandInRoom,
    tipHostInRoom,
    openGiftModal,
    currentUser
  } = useApp();

  const [commentText, setCommentText] = useState('');
  const [hasRaisedHand, setHasRaisedHand] = useState(false);
  const commentsEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    commentsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [roomComments]);

  if (!isInsideRoomModal || !activeLiveRoom) return null;

  const handleSendComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    sendRoomComment(commentText.trim());
    setCommentText('');
  };

  const handleRaiseHand = () => {
    setHasRaisedHand((prev) => !prev);
    raiseHandInRoom();
  };

  const handleTipRose = () => {
    const roseGift = MIORA_PRICING.gifts[0] as VirtualGift;
    tipHostInRoom(roseGift);
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
        background: 'rgba(15, 6, 12, 0.88)',
        backdropFilter: 'blur(20px)',
        padding: '16px',
        animation: 'fadeIn 0.25s ease-out',
        fontFamily: 'var(--font-primary)'
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '680px',
          height: 'min(840px, 92vh)',
          background: 'linear-gradient(180deg, #240E1B 0%, #170712 100%)',
          borderRadius: '36px',
          boxShadow: '0 24px 70px rgba(0,0,0,0.85)',
          border: '1.5px solid var(--border-gold)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          position: 'relative'
        }}
      >
        {/* Top Room Header */}
        <header
          style={{
            padding: '18px 24px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'rgba(36, 14, 27, 0.75)',
            backdropFilter: 'blur(16px)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span
              style={{
                background: 'rgba(238, 56, 101, 0.25)',
                color: '#FFE4E6',
                border: '1px solid rgba(244, 63, 94, 0.4)',
                fontSize: '0.72rem',
                fontWeight: 800,
                padding: '4px 12px',
                borderRadius: 'var(--radius-pill)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                letterSpacing: '0.08em'
              }}
            >
              <span
                className="animate-live-pulse"
                style={{
                  width: '7px',
                  height: '7px',
                  borderRadius: '50%',
                  background: '#F43F5E',
                  display: 'inline-block'
                }}
              />
              LIVE BROADCAST
            </span>

            {/* Equalizer Bars */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '2.5px', height: '14px' }}>
              <span style={{ width: '2.5px', background: '#F43F5E', borderRadius: '2px', animation: 'soundWave 1.1s infinite ease-in-out' }} />
              <span style={{ width: '2.5px', background: '#FB7185', borderRadius: '2px', animation: 'soundWave 0.8s infinite ease-in-out 0.2s' }} />
              <span style={{ width: '2.5px', background: '#FDE047', borderRadius: '2px', animation: 'soundWave 1.3s infinite ease-in-out 0.4s' }} />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.82rem', fontWeight: 700 }}>
              <Users size={15} color="#FDE047" />
              <span>{activeLiveRoom.listenersCount} listening</span>
            </div>
          </div>

          <button
            onClick={leaveLiveRoom}
            style={{
              background: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.35)',
              color: '#F87171',
              padding: '6px 14px',
              borderRadius: 'var(--radius-pill)',
              fontSize: '0.8rem',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all var(--transition-fast)'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(239, 68, 68, 0.25)')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(239, 68, 68, 0.15)')}
          >
            <LogOut size={14} />
            <span>Leave Quietly</span>
          </button>
        </header>

        {/* Room Title & Host Info */}
        <div style={{ padding: '16px 24px 12px 24px', background: 'rgba(0, 0, 0, 0.15)' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#FFFFFF', lineHeight: 1.3, margin: 0 }}>
            {activeLiveRoom.title}
          </h2>
          <p style={{ color: 'rgba(255, 255, 255, 0.75)', fontSize: '0.84rem', marginTop: '4px', lineHeight: 1.5 }}>
            Hosted by <strong style={{ color: '#FDE047' }}>{activeLiveRoom.host.name}</strong> • {activeLiveRoom.description}
          </p>
        </div>

        {/* STAGE AREA: Host & Speakers Circles */}
        <div
          style={{
            padding: '18px 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '24px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            background: 'radial-gradient(ellipse at center, rgba(238, 56, 101, 0.15) 0%, transparent 70%)'
          }}
        >
          {activeLiveRoom.speakers.map((spk) => (
            <div key={spk.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
              <div
                className={spk.isHost ? 'animate-speaking-ripple' : ''}
                style={{
                  position: 'relative',
                  width: '68px',
                  height: '68px',
                  borderRadius: '50%',
                  padding: '2.5px',
                  background: spk.isHost ? 'var(--primary-gradient)' : 'var(--gold-gradient)',
                  boxShadow: '0 4px 20px rgba(238, 56, 101, 0.35)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <img
                  src={spk.photo}
                  alt={spk.name}
                  style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
                />
                {spk.isHost && (
                  <span
                    style={{
                      position: 'absolute',
                      bottom: '-5px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      background: 'var(--berry-primary)',
                      color: '#FFFFFF',
                      fontSize: '0.58rem',
                      fontWeight: 900,
                      padding: '1px 6px',
                      borderRadius: 'var(--radius-pill)',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    HOST 🎙️
                  </span>
                )}
              </div>
              <span style={{ fontSize: '0.8rem', color: '#FFFFFF', fontWeight: 700 }}>
                {spk.name}
              </span>
            </div>
          ))}
        </div>

        {/* LIVE COMMENTS STREAM */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '16px 24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px'
          }}
        >
          {roomComments.map((comment) => (
            <div
              key={comment.id}
              style={{
                background: comment.isGiftNotice
                  ? 'linear-gradient(135deg, rgba(238, 56, 101, 0.22) 0%, rgba(245, 158, 11, 0.22) 100%)'
                  : 'rgba(255, 255, 255, 0.06)',
                border: comment.isGiftNotice ? '1px solid var(--border-gold)' : '1px solid rgba(255, 255, 255, 0.08)',
                padding: '10px 14px',
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '10px'
              }}
            >
              <img
                src={comment.userPhoto}
                alt={comment.userName}
                style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover', marginTop: '2px' }}
              />
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--rose-soft)' }}>
                    {comment.userName}
                  </span>
                  <span style={{ fontSize: '0.68rem', color: 'rgba(255, 255, 255, 0.45)' }}>
                    {comment.timestamp}
                  </span>
                </div>
                <p style={{ fontSize: '0.88rem', color: '#FFFFFF', marginTop: '2px', lineHeight: 1.4 }}>
                  {comment.text}
                </p>
              </div>
            </div>
          ))}
          <div ref={commentsEndRef} />
        </div>

        {/* FLOATING REACTIONS & ACTION BAR */}
        <div
          style={{
            padding: '14px 20px',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            background: 'rgba(36, 14, 27, 0.95)',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px'
          }}
        >
          {/* Reaction Emojis & Controls Row */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
            <div className="scroll-touch-x" style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '2px', maxWidth: '100%' }}>
              {['❤️', '🔥', '👏', '🤣', '💖', '🌹'].map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => sendRoomReaction(emoji)}
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: 'none',
                    borderRadius: '50%',
                    width: '36px',
                    height: '36px',
                    fontSize: '1.15rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    transition: 'transform var(--transition-fast)'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.2)')}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                >
                  {emoji}
                </button>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <button
                onClick={handleRaiseHand}
                style={{
                  background: hasRaisedHand ? '#F43F5E' : 'rgba(255, 255, 255, 0.12)',
                  color: '#FFFFFF',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  padding: '7px 14px',
                  borderRadius: 'var(--radius-pill)',
                  fontSize: '0.78rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  transition: 'all var(--transition-fast)'
                }}
              >
                <Hand size={14} />
                <span>{hasRaisedHand ? 'Raised ✋' : 'Raise Hand'}</span>
              </button>

              <button
                onClick={handleTipRose}
                style={{
                  background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
                  color: '#FFFFFF',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: 'var(--radius-pill)',
                  fontSize: '0.82rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxShadow: '0 2px 10px rgba(245, 158, 11, 0.4)',
                  transition: 'all var(--transition-fast)'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.04)')}
                onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
              >
                <Gift size={15} />
                <span>Tip Host 🌹</span>
              </button>
            </div>
          </div>

          {/* Comment Input */}
          <form onSubmit={handleSendComment} style={{ display: 'flex', gap: '8px' }}>
            <input
              type="text"
              placeholder="Say something to the room..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              style={{
                flex: 1,
                padding: '11px 18px',
                borderRadius: 'var(--radius-pill)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                background: 'rgba(255, 255, 255, 0.08)',
                color: '#FFFFFF',
                fontSize: '0.92rem',
                outline: 'none'
              }}
            />
            <button
              type="submit"
              disabled={!commentText.trim()}
              style={{
                background: 'var(--primary-gradient)',
                color: '#FFFFFF',
                border: 'none',
                padding: '11px 20px',
                borderRadius: 'var(--radius-pill)',
                fontWeight: 800,
                cursor: commentText.trim() ? 'pointer' : 'default',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                opacity: commentText.trim() ? 1 : 0.6
              }}
            >
              <Send size={15} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
