import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Send, Copy, Share2, Check, Sparkles, MessageCircle } from 'lucide-react';

export const SharePostModal: React.FC = () => {
  const {
    isSharePostModalOpen,
    closeSharePostModal,
    shareTargetPost,
    matches,
    sharePostToMatch,
    showToast
  } = useApp();

  const [copied, setCopied] = useState(false);
  const [sentMatchIds, setSentMatchIds] = useState<string[]>([]);

  if (!isSharePostModalOpen || !shareTargetPost) return null;

  const handleCopyLink = () => {
    const link = `${window.location.origin}/#post-${shareTargetPost.id}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(link);
      setCopied(true);
      showToast('Link copied to clipboard! 📋✨');
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Post by ${shareTargetPost.authorName || shareTargetPost.userName || 'MIORA User'}`,
          text: shareTargetPost.content,
          url: `${window.location.origin}/#post-${shareTargetPost.id}`
        });
      } catch (err) {
        // User cancelled share
      }
    } else {
      handleCopyLink();
    }
  };

  const handleSendToMatch = async (matchId: string) => {
    await sharePostToMatch(shareTargetPost, matchId);
    setSentMatchIds((prev) => [...prev, matchId]);
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
        animation: 'fadeIn 0.2s ease-out'
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '480px',
          background: 'linear-gradient(180deg, #FFFFFF 0%, #FFF5F7 100%)',
          borderRadius: '32px',
          boxShadow: '0 24px 60px rgba(76, 5, 25, 0.35)',
          border: '1.5px solid var(--border-gold, #FCE7F3)',
          padding: '24px',
          position: 'relative',
          animation: 'scaleIn 0.25s ease-out'
        }}
      >
        <button
          onClick={closeSharePostModal}
          style={{
            position: 'absolute',
            top: '18px',
            right: '18px',
            width: '34px',
            height: '34px',
            borderRadius: '50%',
            background: 'rgba(238, 56, 101, 0.08)',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: 'var(--text-secondary, #705A65)'
          }}
        >
          <X size={17} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
          <Share2 size={22} color="#EE3865" />
          <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: '#1F2937' }}>
            Share Post
          </h3>
        </div>

        {/* Post Preview Mini Card */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            background: '#FFFFFF',
            borderRadius: '16px',
            padding: '12px',
            border: '1px solid #F3F4F6',
            marginBottom: '20px'
          }}
        >
          {shareTargetPost.imageUrl ? (
            <img
              src={shareTargetPost.imageUrl}
              alt="Post preview"
              style={{ width: '48px', height: '48px', borderRadius: '10px', objectFit: 'cover' }}
            />
          ) : (
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '10px',
                background: 'rgba(238,56,101,0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#EE3865'
              }}
            >
              <MessageCircle size={22} />
            </div>
          )}
          <div style={{ flex: 1, overflow: 'hidden' }}>
            <span style={{ fontWeight: 800, fontSize: '0.86rem', color: '#1F2937', display: 'block' }}>
              {shareTargetPost.authorName || shareTargetPost.userName || 'MIORA Post'}
            </span>
            <p
              style={{
                margin: '2px 0 0',
                fontSize: '0.8rem',
                color: '#6B7280',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}
            >
              {shareTargetPost.content || 'Shared photo'}
            </p>
          </div>
        </div>

        {/* Quick Send to Matches */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, color: '#6B7280', marginBottom: '8px' }}>
            SEND VIA DIRECT MESSAGE
          </label>

          {matches.length === 0 ? (
            <p style={{ fontSize: '0.84rem', color: '#9CA3AF', margin: '8px 0' }}>
              You don't have any matches yet to DM.
            </p>
          ) : (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                maxHeight: '190px',
                overflowY: 'auto',
                paddingRight: '4px'
              }}
            >
              {matches.map((m) => {
                const isSent = sentMatchIds.includes(m.id);
                return (
                  <div
                    key={m.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      background: '#FFFFFF',
                      padding: '8px 12px',
                      borderRadius: '14px',
                      border: '1px solid #E5E7EB'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <img
                        src={m.profile.photos[0]}
                        alt={m.profile.name}
                        style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }}
                      />
                      <span style={{ fontWeight: 700, fontSize: '0.9rem', color: '#1F2937' }}>
                        {m.profile.name}
                      </span>
                    </div>

                    <button
                      onClick={() => handleSendToMatch(m.id)}
                      disabled={isSent}
                      style={{
                        padding: '6px 14px',
                        borderRadius: '999px',
                        border: 'none',
                        background: isSent ? '#D1FAE5' : 'var(--primary-gradient, linear-gradient(135deg, #EE3865, #EC4899))',
                        color: isSent ? '#065F46' : '#FFFFFF',
                        fontSize: '0.78rem',
                        fontWeight: 800,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        cursor: isSent ? 'default' : 'pointer'
                      }}
                    >
                      {isSent ? (
                        <>
                          <Check size={13} />
                          <span>Sent</span>
                        </>
                      ) : (
                        <>
                          <Send size={12} />
                          <span>Send</span>
                        </>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Action Buttons: Copy Link & Native Share */}
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={handleCopyLink}
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              padding: '12px',
              borderRadius: '999px',
              border: '1.5px solid #E5E7EB',
              background: '#FFFFFF',
              color: '#374151',
              fontWeight: 800,
              fontSize: '0.88rem',
              cursor: 'pointer'
            }}
          >
            {copied ? <Check size={16} color="#10B981" /> : <Copy size={16} />}
            <span>{copied ? 'Copied!' : 'Copy Link'}</span>
          </button>

          <button
            onClick={handleNativeShare}
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              padding: '12px',
              borderRadius: '999px',
              border: 'none',
              background: 'var(--primary-gradient, linear-gradient(135deg, #EE3865, #D4AF37))',
              color: '#FFFFFF',
              fontWeight: 800,
              fontSize: '0.88rem',
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(238, 56, 101, 0.3)'
            }}
          >
            <Sparkles size={16} />
            <span>More Options</span>
          </button>
        </div>
      </div>
    </div>
  );
};
