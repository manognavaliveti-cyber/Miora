import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Send, Trash2, MessageCircle, Sparkles } from 'lucide-react';

export const CommentSheet: React.FC = () => {
  const {
    isCommentSheetOpen,
    closeCommentSheet,
    commentTargetPost,
    currentUser,
    addFeedComment,
    deleteFeedComment
  } = useApp();

  const [commentText, setCommentText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isCommentSheetOpen || !commentTargetPost) return null;

  const quickEmojis = ['💖', '✨', '☕', '😍', '🔥', '👏', '🌸', '💫'];

  const handleEmojiClick = (emoji: string) => {
    setCommentText((prev) => prev + emoji);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    setIsSubmitting(true);
    await addFeedComment(commentTargetPost.id, commentText.trim());
    setCommentText('');
    setIsSubmitting(false);
  };

  const comments = commentTargetPost.comments || [];
  const isPostOwner =
    commentTargetPost.authorId === currentUser.id || commentTargetPost.authorId === 'user_me';

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        background: 'rgba(31, 22, 26, 0.75)',
        backdropFilter: 'blur(12px)',
        animation: 'fadeIn 0.2s ease-out'
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '560px',
          maxHeight: '82vh',
          background: '#FFFFFF',
          borderTopLeftRadius: '32px',
          borderTopRightRadius: '32px',
          boxShadow: '0 -12px 50px rgba(0,0,0,0.25)',
          borderTop: '2px solid var(--border-gold, #FCE7F3)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          animation: 'slideUp 0.25s ease-out'
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '18px 22px',
            borderBottom: '1px solid rgba(0,0,0,0.06)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <MessageCircle size={20} color="#EE3865" />
            <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: '#1F2937' }}>
              Comments ({comments.length})
            </h3>
          </div>
          <button
            onClick={closeCommentSheet}
            style={{
              width: '34px',
              height: '34px',
              borderRadius: '50%',
              border: 'none',
              background: 'rgba(0,0,0,0.05)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#4B5563'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Comments List */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '16px 20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
            minHeight: '220px'
          }}
        >
          {comments.length === 0 ? (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '40px 20px',
                textAlign: 'center',
                color: '#9CA3AF'
              }}
            >
              <Sparkles size={36} color="#EE3865" style={{ opacity: 0.6, marginBottom: '8px' }} />
              <p style={{ fontWeight: 700, margin: 0, color: '#4B5563' }}>No comments yet</p>
              <p style={{ fontSize: '0.84rem', margin: '4px 0 0' }}>Be the first to share your sweet thoughts!</p>
            </div>
          ) : (
            comments.map((c) => {
              const authorName = c.authorName || c.userName || 'User';
              const authorPhoto =
                c.userPhoto ||
                'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80';
              const isMyComment = c.userId === currentUser.id || c.userId === 'user_me';

              return (
                <div
                  key={c.id}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '12px',
                    padding: '8px 0',
                    borderBottom: '1px solid rgba(0,0,0,0.03)'
                  }}
                >
                  <img
                    src={authorPhoto}
                    alt={authorName}
                    style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: '50%',
                      objectFit: 'cover',
                      border: '1px solid #E5E7EB'
                    }}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontWeight: 800, fontSize: '0.88rem', color: '#1F2937' }}>
                          {authorName}
                        </span>
                        <span style={{ fontSize: '0.74rem', color: '#9CA3AF' }}>
                          {c.timestamp || 'Just now'}
                        </span>
                      </div>
                      {(isMyComment || isPostOwner) && (
                        <button
                          onClick={() => deleteFeedComment(commentTargetPost.id, c.id)}
                          style={{
                            border: 'none',
                            background: 'transparent',
                            color: '#9CA3AF',
                            cursor: 'pointer',
                            padding: '4px'
                          }}
                          title="Delete comment"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                    <p style={{ margin: '4px 0 0', fontSize: '0.9rem', color: '#374151', lineHeight: 1.45 }}>
                      {c.text}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Quick Emoji Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 20px',
            background: '#F9FAFB',
            borderTop: '1px solid rgba(0,0,0,0.05)',
            overflowX: 'auto'
          }}
        >
          <span style={{ fontSize: '0.74rem', fontWeight: 700, color: '#9CA3AF', whiteSpace: 'nowrap' }}>
            Quick Reactions:
          </span>
          {quickEmojis.map((emoji) => (
            <button
              key={emoji}
              onClick={() => handleEmojiClick(emoji)}
              style={{
                background: '#FFFFFF',
                border: '1px solid #E5E7EB',
                borderRadius: '50%',
                width: '30px',
                height: '30px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1rem',
                cursor: 'pointer'
              }}
            >
              {emoji}
            </button>
          ))}
        </div>

        {/* Input Form */}
        <form
          onSubmit={handleSubmit}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '14px 20px 24px',
            background: '#FFFFFF',
            borderTop: '1px solid rgba(0,0,0,0.06)'
          }}
        >
          <img
            src={currentUser.photos[0]}
            alt={currentUser.name}
            style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }}
          />
          <input
            type="text"
            placeholder={`Add a comment as ${currentUser.name}...`}
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            style={{
              flex: 1,
              padding: '10px 18px',
              borderRadius: '999px',
              border: '1.5px solid #E5E7EB',
              fontSize: '0.9rem',
              outline: 'none',
              background: '#F9FAFB'
            }}
          />
          <button
            type="submit"
            disabled={!commentText.trim() || isSubmitting}
            style={{
              background: commentText.trim() ? '#EE3865' : '#E5E7EB',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '999px',
              padding: '10px 18px',
              fontWeight: 800,
              fontSize: '0.88rem',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: commentText.trim() ? 'pointer' : 'default',
              boxShadow: commentText.trim() ? '0 4px 14px rgba(238, 56, 101, 0.35)' : 'none'
            }}
          >
            <Send size={15} />
            <span>Post</span>
          </button>
        </form>
      </div>
    </div>
  );
};
