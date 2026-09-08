import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Heart, Send, Sparkles, Trash2 } from 'lucide-react';

export const StatusViewerModal: React.FC = () => {
  const {
    activeStatusViewer,
    closeStatusViewer,
    deleteStatusStory,
    currentUser,
    showToast
  } = useApp();

  const [progress, setProgress] = useState(0);
  const [replyText, setReplyText] = useState('');
  const [isPaused, setIsPaused] = useState(false);

  const authorId = activeStatusViewer?.authorId || activeStatusViewer?.userId;
  const isMine =
    activeStatusViewer?.isMine || authorId === currentUser.id || authorId === 'user_me';
  const authorName =
    activeStatusViewer?.authorName || activeStatusViewer?.userName || 'MIORA User';
  const authorPhoto =
    activeStatusViewer?.authorPhoto ||
    activeStatusViewer?.userPhoto ||
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80';

  useEffect(() => {
    if (!activeStatusViewer) {
      setProgress(0);
      return;
    }

    if (isPaused) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          closeStatusViewer();
          return 100;
        }
        return prev + 2;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [activeStatusViewer, isPaused]);

  if (!activeStatusViewer) return null;

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    showToast(`Reply sent to ${authorName}! 💌`);
    setReplyText('');
    closeStatusViewer();
  };

  const handleQuickReaction = (emoji: string) => {
    showToast(`Sent ${emoji} to ${authorName}! ✨`);
  };

  const handleDelete = async () => {
    await deleteStatusStory(activeStatusViewer.id);
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 110,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(15, 9, 12, 0.94)',
        backdropFilter: 'blur(20px)',
        padding: '16px',
        animation: 'fadeIn 0.2s ease-out'
      }}
    >
      <div
        onMouseDown={() => setIsPaused(true)}
        onMouseUp={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
        style={{
          width: '100%',
          maxWidth: '440px',
          height: 'min(720px, 90vh)',
          borderRadius: '32px',
          background: activeStatusViewer.mediaUrl
            ? `url(${activeStatusViewer.mediaUrl}) center/cover no-repeat`
            : 'radial-gradient(circle at 30% 30%, #4C0519 0%, #1F161A 60%, #0F090C 100%)',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '24px',
          overflow: 'hidden',
          boxShadow: '0 24px 60px rgba(0,0,0,0.8)',
          border: '1.5px solid var(--border-gold, #D4AF37)'
        }}
      >
        {/* Dark Scrim Overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(180deg, rgba(15, 9, 12, 0.7) 0%, rgba(15, 9, 12, 0.2) 40%, rgba(15, 9, 12, 0.85) 100%)',
            pointerEvents: 'none',
            zIndex: 1
          }}
        />

        {/* TOP: Progress Bar & Author */}
        <div style={{ position: 'relative', zIndex: 10 }}>
          {/* 5s Progress Bar */}
          <div
            style={{
              width: '100%',
              height: '4px',
              borderRadius: '2px',
              background: 'rgba(255, 255, 255, 0.25)',
              marginBottom: '14px',
              overflow: 'hidden'
            }}
          >
            <div
              style={{
                width: `${progress}%`,
                height: '100%',
                background: '#FFFFFF',
                borderRadius: '2px',
                transition: 'width 0.1s linear'
              }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <img
                src={authorPhoto}
                alt={authorName}
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '2px solid #D4AF37'
                }}
              />
              <div>
                <span style={{ fontSize: '0.96rem', fontWeight: 800, color: '#FFFFFF', display: 'block' }}>
                  {authorName}
                </span>
                <span style={{ fontSize: '0.74rem', color: 'rgba(255, 255, 255, 0.7)' }}>
                  Active 24h Story
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {isMine && (
                <button
                  onClick={handleDelete}
                  title="Delete Story"
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    background: 'rgba(239, 68, 68, 0.3)',
                    border: 'none',
                    color: '#FCA5A5',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Trash2 size={16} />
                </button>
              )}

              <button
                onClick={closeStatusViewer}
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: 'rgba(0, 0, 0, 0.4)',
                  border: 'none',
                  color: '#FFFFFF',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <X size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* CENTER: Status Thought Text */}
        <div style={{ position: 'relative', zIndex: 10, textAlign: 'center', padding: '20px 10px' }}>
          <p
            style={{
              fontFamily: 'var(--font-serif, serif)',
              fontSize: '1.65rem',
              fontWeight: 800,
              color: '#FFFFFF',
              lineHeight: 1.4,
              textShadow: '0 4px 18px rgba(0,0,0,0.8)'
            }}
          >
            "{activeStatusViewer.text}"
          </p>
        </div>

        {/* BOTTOM: Quick Reactions & Reply Form */}
        <div style={{ position: 'relative', zIndex: 10 }}>
          {!isMine && (
            <>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '14px' }}>
                {['❤️', '😍', '🔥', '☕', '✨'].map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => handleQuickReaction(emoji)}
                    style={{
                      background: 'rgba(255, 255, 255, 0.15)',
                      backdropFilter: 'blur(10px)',
                      border: 'none',
                      borderRadius: '50%',
                      width: '38px',
                      height: '38px',
                      fontSize: '1.2rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    {emoji}
                  </button>
                ))}
              </div>

              <form onSubmit={handleSendReply} style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="text"
                  placeholder={`Reply to ${authorName}...`}
                  value={replyText}
                  onFocus={() => setIsPaused(true)}
                  onBlur={() => setIsPaused(false)}
                  onChange={(e) => setReplyText(e.target.value)}
                  style={{
                    flex: 1,
                    padding: '12px 18px',
                    borderRadius: '999px',
                    border: '1px solid rgba(255, 255, 255, 0.25)',
                    background: 'rgba(0, 0, 0, 0.5)',
                    color: '#FFFFFF',
                    fontSize: '0.9rem',
                    outline: 'none'
                  }}
                />
                <button
                  type="submit"
                  disabled={!replyText.trim()}
                  style={{
                    background: 'var(--primary-gradient, linear-gradient(135deg, #EE3865, #EC4899))',
                    color: '#FFFFFF',
                    border: 'none',
                    padding: '12px 18px',
                    borderRadius: '999px',
                    fontWeight: 800,
                    cursor: replyText.trim() ? 'pointer' : 'default',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <Send size={15} />
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

