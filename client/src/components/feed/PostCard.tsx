import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { FeedPost } from '../../types';
import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  MoreHorizontal,
  MapPin,
  CheckCircle2,
  Trash2,
  Edit3,
  Flag,
  UserX,
  UserPlus,
  UserCheck,
  Send,
  Sparkles,
  Copy
} from 'lucide-react';

interface PostCardProps {
  post: FeedPost;
}

export const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const {
    currentUser,
    likeFeedPost,
    toggleSavePost,
    openCommentSheet,
    openSharePostModal,
    openEditPostModal,
    deleteFeedPost,
    openReportModal,
    blockProfile,
    toggleFollowUser,
    followingIds,
    savedPostIds,
    addFeedComment,
    deleteFeedComment,
    profiles,
    openProfileDetail,
    showToast
  } = useApp();

  const [menuOpen, setMenuOpen] = useState(false);
  const [quickComment, setQuickComment] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [isHeartPopping, setIsHeartPopping] = useState(false);

  const authorId = post.authorId || post.userId || 'user_unknown';
  const isMine = authorId === currentUser.id || authorId === 'user_me';
  const isLiked = post.isLikedByMe || post.hasLiked;
  const isSaved = savedPostIds.includes(post.id) || post.isSavedByMe || post.saved;
  const isFollowing = followingIds.includes(authorId);

  const authorName = post.authorName || post.userName || 'Alex Rivera';
  const authorPhoto =
    post.authorPhoto ||
    post.userPhoto ||
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80';

  const handleLikeClick = async () => {
    setIsHeartPopping(true);
    setTimeout(() => setIsHeartPopping(false), 500);
    await likeFeedPost(post.id);
  };

  const handleDoubleTap = async () => {
    if (!isLiked) {
      handleLikeClick();
    }
  };

  const handleQuickCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickComment.trim()) return;
    setIsSubmittingComment(true);
    await addFeedComment(post.id, quickComment.trim());
    setQuickComment('');
    setIsSubmittingComment(false);
  };

  const handleAuthorClick = () => {
    if (isMine) return;
    const matchedProfile = profiles.find((p) => p.id === authorId || p.name === authorName);
    if (matchedProfile) {
      openProfileDetail(matchedProfile);
    }
  };

  const handleCopyLink = () => {
    const url = `${window.location.origin}/#post-${post.id}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
      showToast('Post link copied to clipboard! 📋✨');
    }
    setMenuOpen(false);
  };

  return (
    <article
      style={{
        background: '#FFFFFF',
        borderRadius: '24px',
        border: '1.5px solid var(--border-gold, #FCE7F3)',
        boxShadow: '0 8px 30px rgba(76, 5, 25, 0.05)',
        overflow: 'hidden',
        marginBottom: '24px',
        transition: 'all 0.25s ease'
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px 20px',
          borderBottom: '1px solid rgba(238, 56, 101, 0.06)'
        }}
      >
        <div
          onClick={handleAuthorClick}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            cursor: isMine ? 'default' : 'pointer'
          }}
        >
          <div
            style={{
              position: 'relative',
              width: '46px',
              height: '46px',
              borderRadius: '50%',
              padding: '2px',
              background: 'var(--primary-gradient, linear-gradient(135deg, #EE3865 0%, #D4AF37 100%))'
            }}
          >
            <img
              src={authorPhoto}
              alt={authorName}
              style={{
                width: '100%',
                height: '100%',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '2px solid #FFFFFF'
              }}
            />
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span
                style={{
                  fontFamily: 'var(--font-serif, inherit)',
                  fontWeight: 800,
                  fontSize: '1rem',
                  color: 'var(--text-primary, #2A0818)'
                }}
              >
                {authorName}
              </span>
              {post.authorAge && (
                <span style={{ fontSize: '0.82rem', color: 'var(--text-muted, #705A65)', fontWeight: 600 }}>
                  · {post.authorAge}
                </span>
              )}
              <CheckCircle2 size={15} color="#EE3865" />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
              {post.location && (
                <span
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '3px',
                    fontSize: '0.75rem',
                    color: 'var(--text-secondary, #705A65)'
                  }}
                >
                  <MapPin size={11} color="#EE3865" />
                  {post.location}
                </span>
              )}
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted, #9D8A94)' }}>
                • {post.timestamp || 'Recently'}
              </span>
            </div>
          </div>
        </div>

        {/* Right Actions: Follow Button & 3-Dot Menu */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', position: 'relative' }}>
          {!isMine && (
            <button
              onClick={() => toggleFollowUser(authorId)}
              style={{
                padding: '6px 14px',
                borderRadius: '999px',
                border: isFollowing ? '1px solid #E5E7EB' : 'none',
                background: isFollowing ? '#F3F4F6' : 'var(--primary-gradient, linear-gradient(135deg, #EE3865, #EC4899))',
                color: isFollowing ? '#4B5563' : '#FFFFFF',
                fontSize: '0.78rem',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              {isFollowing ? (
                <>
                  <UserCheck size={13} />
                  <span>Following</span>
                </>
              ) : (
                <>
                  <UserPlus size={13} />
                  <span>Follow</span>
                </>
              )}
            </button>
          )}

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              border: 'none',
              background: 'rgba(238, 56, 101, 0.05)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: 'var(--text-secondary, #705A65)'
            }}
          >
            <MoreHorizontal size={18} />
          </button>

          {/* 3-Dot Dropdown Menu */}
          {menuOpen && (
            <>
              <div
                onClick={() => setMenuOpen(false)}
                style={{ position: 'fixed', inset: 0, zIndex: 30 }}
              />
              <div
                style={{
                  position: 'absolute',
                  top: '42px',
                  right: 0,
                  zIndex: 35,
                  background: '#FFFFFF',
                  borderRadius: '18px',
                  boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
                  border: '1.5px solid var(--border-gold, #FCE7F3)',
                  padding: '8px',
                  minWidth: '180px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px'
                }}
              >
                <button
                  onClick={handleCopyLink}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '10px 14px',
                    borderRadius: '12px',
                    border: 'none',
                    background: 'transparent',
                    fontSize: '0.86rem',
                    fontWeight: 600,
                    color: '#374151',
                    cursor: 'pointer',
                    textAlign: 'left'
                  }}
                >
                  <Copy size={15} />
                  <span>Copy Link</span>
                </button>

                {isMine ? (
                  <>
                    <button
                      onClick={() => {
                        setMenuOpen(false);
                        openEditPostModal(post);
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        padding: '10px 14px',
                        borderRadius: '12px',
                        border: 'none',
                        background: 'transparent',
                        fontSize: '0.86rem',
                        fontWeight: 600,
                        color: '#374151',
                        cursor: 'pointer',
                        textAlign: 'left'
                      }}
                    >
                      <Edit3 size={15} color="#EE3865" />
                      <span>Edit Caption</span>
                    </button>
                    <button
                      onClick={() => {
                        setMenuOpen(false);
                        deleteFeedPost(post.id);
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        padding: '10px 14px',
                        borderRadius: '12px',
                        border: 'none',
                        background: 'transparent',
                        fontSize: '0.86rem',
                        fontWeight: 600,
                        color: '#EF4444',
                        cursor: 'pointer',
                        textAlign: 'left'
                      }}
                    >
                      <Trash2 size={15} />
                      <span>Delete Post</span>
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        setMenuOpen(false);
                        openSharePostModal(post);
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        padding: '10px 14px',
                        borderRadius: '12px',
                        border: 'none',
                        background: 'transparent',
                        fontSize: '0.86rem',
                        fontWeight: 600,
                        color: '#374151',
                        cursor: 'pointer',
                        textAlign: 'left'
                      }}
                    >
                      <Share2 size={15} color="#EE3865" />
                      <span>Send in Chat</span>
                    </button>
                    <button
                      onClick={() => {
                        setMenuOpen(false);
                        openReportModal({
                          id: authorId,
                          name: authorName,
                          photos: [authorPhoto],
                          age: 24,
                          location: post.location || 'Bangalore',
                          distanceKm: 4,
                          bio: post.content,
                          interests: post.tags || [],
                          compatibility: 85,
                          online: true,
                          gender: 'woman'
                        });
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        padding: '10px 14px',
                        borderRadius: '12px',
                        border: 'none',
                        background: 'transparent',
                        fontSize: '0.86rem',
                        fontWeight: 600,
                        color: '#F59E0B',
                        cursor: 'pointer',
                        textAlign: 'left'
                      }}
                    >
                      <Flag size={15} />
                      <span>Report Post</span>
                    </button>
                    <button
                      onClick={() => {
                        setMenuOpen(false);
                        blockProfile(authorId);
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        padding: '10px 14px',
                        borderRadius: '12px',
                        border: 'none',
                        background: 'transparent',
                        fontSize: '0.86rem',
                        fontWeight: 600,
                        color: '#EF4444',
                        cursor: 'pointer',
                        textAlign: 'left'
                      }}
                    >
                      <UserX size={15} />
                      <span>Block Author</span>
                    </button>
                  </>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Post Text Body */}
      {post.content && (
        <div style={{ padding: '16px 20px 12px' }}>
          <p
            style={{
              fontSize: '0.96rem',
              lineHeight: 1.6,
              color: 'var(--text-primary, #2A0818)',
              fontWeight: 500,
              margin: 0,
              whiteSpace: 'pre-wrap'
            }}
          >
            {post.content}
          </p>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '10px' }}>
              {post.tags.map((tag, idx) => (
                <span
                  key={idx}
                  style={{
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    color: '#EE3865',
                    background: 'rgba(238, 56, 101, 0.08)',
                    padding: '3px 9px',
                    borderRadius: '999px'
                  }}
                >
                  #{tag.replace(/^#/, '')}
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Media View (Image) */}
      {post.imageUrl && (
        <div
          onDoubleClick={handleDoubleTap}
          style={{
            position: 'relative',
            width: '100%',
            maxHeight: '520px',
            background: '#000000',
            overflow: 'hidden',
            cursor: 'pointer'
          }}
        >
          <img
            src={post.imageUrl}
            alt="Post content"
            style={{
              width: '100%',
              height: 'auto',
              maxHeight: '520px',
              objectFit: 'cover',
              display: 'block'
            }}
          />

          {/* Heart Pop Animation on double tap */}
          {isHeartPopping && (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'rgba(0,0,0,0.2)',
                animation: 'heartBurst 0.5s ease-out forwards',
                pointerEvents: 'none'
              }}
            >
              <Heart size={80} fill="#EE3865" color="#EE3865" />
            </div>
          )}
        </div>
      )}

      {/* Action Bar (Like, Comment, Share, Save) */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 20px',
          borderTop: '1px solid rgba(238, 56, 101, 0.05)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {/* Like */}
          <button
            onClick={handleLikeClick}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: isLiked ? 'rgba(238, 56, 101, 0.1)' : 'transparent',
              border: 'none',
              borderRadius: '999px',
              padding: '6px 12px',
              color: isLiked ? '#EE3865' : '#4B5563',
              fontSize: '0.88rem',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            <Heart size={20} fill={isLiked ? '#EE3865' : 'none'} color={isLiked ? '#EE3865' : 'currentColor'} />
            <span>{post.likesCount || 0}</span>
          </button>

          {/* Comment */}
          <button
            onClick={() => openCommentSheet(post)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: 'transparent',
              border: 'none',
              borderRadius: '999px',
              padding: '6px 12px',
              color: '#4B5563',
              fontSize: '0.88rem',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            <MessageCircle size={20} />
            <span>{post.comments?.length || post.commentsCount || 0}</span>
          </button>

          {/* Share */}
          <button
            onClick={() => openSharePostModal(post)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: 'transparent',
              border: 'none',
              borderRadius: '999px',
              padding: '6px 12px',
              color: '#4B5563',
              fontSize: '0.88rem',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            <Share2 size={19} />
            <span>{post.sharesCount || 0}</span>
          </button>
        </div>

        {/* Save / Bookmark */}
        <button
          onClick={() => toggleSavePost(post.id)}
          style={{
            background: isSaved ? 'rgba(212, 175, 55, 0.12)' : 'transparent',
            border: 'none',
            borderRadius: '50%',
            width: '38px',
            height: '38px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: isSaved ? '#D4AF37' : '#6B7280',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
        >
          <Bookmark size={20} fill={isSaved ? '#D4AF37' : 'none'} color={isSaved ? '#D4AF37' : 'currentColor'} />
        </button>
      </div>

      {/* Comments Preview Section */}
      {post.comments && post.comments.length > 0 && (
        <div
          style={{
            padding: '0 20px 12px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}
        >
          {post.comments.length > 2 && (
            <button
              onClick={() => openCommentSheet(post)}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#EE3865',
                fontSize: '0.82rem',
                fontWeight: 700,
                textAlign: 'left',
                padding: 0,
                cursor: 'pointer'
              }}
            >
              View all {post.comments.length} comments
            </button>
          )}

          {post.comments.slice(-2).map((comment) => {
            const commentAuthorName = comment.authorName || comment.userName || 'User';
            const isMyComment = comment.userId === currentUser.id || comment.userId === 'user_me';
            return (
              <div
                key={comment.id}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  gap: '8px',
                  background: '#F9FAFB',
                  padding: '8px 12px',
                  borderRadius: '12px',
                  fontSize: '0.84rem'
                }}
              >
                <div style={{ display: 'flex', gap: '8px' }}>
                  <span style={{ fontWeight: 800, color: '#1F2937' }}>{commentAuthorName}:</span>
                  <span style={{ color: '#4B5563' }}>{comment.text}</span>
                </div>
                {(isMyComment || isMine) && (
                  <button
                    onClick={() => deleteFeedComment(post.id, comment.id)}
                    style={{
                      border: 'none',
                      background: 'transparent',
                      color: '#9CA3AF',
                      cursor: 'pointer',
                      padding: '2px'
                    }}
                    title="Delete comment"
                  >
                    <Trash2 size={13} />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Quick Comment Input */}
      <form
        onSubmit={handleQuickCommentSubmit}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '10px 18px 16px',
          borderTop: '1px solid rgba(0,0,0,0.03)'
        }}
      >
        <img
          src={currentUser.photos[0]}
          alt={currentUser.name}
          style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover' }}
        />
        <input
          type="text"
          placeholder="Add a sweet comment..."
          value={quickComment}
          onChange={(e) => setQuickComment(e.target.value)}
          style={{
            flex: 1,
            padding: '8px 14px',
            borderRadius: '999px',
            border: '1px solid #E5E7EB',
            fontSize: '0.84rem',
            outline: 'none',
            background: '#F9FAFB'
          }}
        />
        <button
          type="submit"
          disabled={!quickComment.trim() || isSubmittingComment}
          style={{
            background: quickComment.trim() ? '#EE3865' : '#E5E7EB',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: '50%',
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: quickComment.trim() ? 'pointer' : 'default',
            transition: 'all 0.2s ease'
          }}
        >
          <Send size={14} />
        </button>
      </form>
    </article>
  );
};
