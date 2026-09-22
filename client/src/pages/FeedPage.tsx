import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Sparkles,
  Plus,
  Radio,
  Flame,
  Users,
  Smile,
  Compass,
  TrendingUp
} from 'lucide-react';
import { PostCard } from '../components/feed/PostCard';

export const FeedPage: React.FC = () => {
  const {
    feedPosts,
    statusStories,
    statusNotes,
    myStatusNote,
    followingIds,
    openStatusViewer,
    openCreatePostModal,
    openCreateStatusModal,
    openStatusNoteModal,
    currentUser,
    liveRooms,
    joinLiveRoom,
    showToast
  } = useApp();

  const [activeFilter, setActiveFilter] = useState<'for-you' | 'following' | 'trending'>('for-you');

  // Filter posts
  const displayedPosts = feedPosts.filter((post) => {
    if (activeFilter === 'following') {
      const authorId = post.authorId || post.userId;
      return followingIds.includes(authorId || '') || authorId === currentUser.id;
    }
    return true;
  });

  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        padding: '8px 0 40px 0',
        width: '100%',
        margin: '0 auto',
        animation: 'fadeIn 0.25s ease-out forwards'
      }}
    >
      {/* 1. 24-HOUR STATUS NOTES & STORIES CAROUSEL AT TOP */}
      <div
        style={{
          background: '#FFFFFF',
          borderRadius: '24px',
          padding: '16px',
          border: '1.5px solid var(--border-gold, #FCE7F3)',
          boxShadow: '0 4px 20px rgba(76, 5, 25, 0.04)',
          marginBottom: '20px'
        }}
      >
        {/* Status Thought Bubbles Row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
          <Sparkles size={16} color="#EE3865" />
          <h3 style={{ margin: 0, fontSize: '0.92rem', fontWeight: 800, color: '#1F2937', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            24h Status & Moments
          </h3>
        </div>

        <div
          className="scroll-touch-x"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            overflowX: 'auto',
            padding: '4px 2px 8px',
            whiteSpace: 'nowrap'
          }}
        >
          {/* My Status Note / Add Story */}
          <div
            onClick={openStatusNoteModal}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer',
              flexShrink: 0,
              position: 'relative'
            }}
          >
            <div style={{ position: 'relative' }}>
              <img
                src={currentUser.photos[0]}
                alt={currentUser.name}
                style={{
                  width: '62px',
                  height: '62px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '2.5px solid #EE3865'
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  top: '-10px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  background: '#FFFFFF',
                  borderRadius: '12px',
                  padding: '2px 8px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
                  border: '1px solid #FCE7F3',
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  color: '#1F2937',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '3px',
                  maxWidth: '80px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}
              >
                <span>{myStatusNote?.emoji || '✨'}</span>
                <span>{myStatusNote ? 'Note' : '+ Note'}</span>
              </div>
            </div>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#1F2937' }}>Your Note</span>
          </div>

          {/* Add Story Button */}
          <div
            onClick={openCreateStatusModal}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer',
              flexShrink: 0
            }}
          >
            <div
              style={{
                width: '62px',
                height: '62px',
                borderRadius: '50%',
                border: '2px dashed #D4AF37',
                background: 'rgba(212, 175, 55, 0.08)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#D4AF37'
              }}
            >
              <Plus size={24} />
            </div>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#6B7280' }}>Add Story</span>
          </div>

          {/* User Stories List */}
          {statusStories.map((story) => {
            const isViewed = story.isViewed || story.viewed;
            const authorName = story.authorName || story.userName || 'User';
            const authorPhoto =
              story.authorPhoto ||
              story.userPhoto ||
              'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&q=80';

            return (
              <div
                key={story.id}
                onClick={() => openStatusViewer(story)}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '6px',
                  cursor: 'pointer',
                  flexShrink: 0
                }}
              >
                <div
                  style={{
                    width: '62px',
                    height: '62px',
                    borderRadius: '50%',
                    padding: '2.5px',
                    background: isViewed
                      ? '#D1D5DB'
                      : 'linear-gradient(135deg, #EE3865 0%, #D4AF37 100%)',
                    boxShadow: isViewed ? 'none' : '0 4px 12px rgba(238, 56, 101, 0.25)'
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
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#1F2937' }}>
                  {authorName}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. FILTER TABS & QUICK POST (For You / Following / Trending / New Post) */}
      <div
        className="feed-filter-bar"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '20px',
          gap: '10px',
          width: '100%',
          boxSizing: 'border-box'
        }}
      >
        <div
          className="scroll-touch-x"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            overflowX: 'auto',
            padding: '2px 2px 6px 2px',
            flex: 1,
            minWidth: 0,
            WebkitOverflowScrolling: 'touch'
          }}
        >
          <button
            onClick={() => setActiveFilter('for-you')}
            style={{
              flexShrink: 0,
              padding: '8px 16px',
              borderRadius: 'var(--radius-pill, 999px)',
              border: activeFilter === 'for-you' ? 'none' : '1px solid #E5E7EB',
              background: activeFilter === 'for-you' ? 'var(--primary-gradient, #EE3865)' : '#FFFFFF',
              color: activeFilter === 'for-you' ? '#FFFFFF' : '#4B5563',
              fontSize: '0.84rem',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: activeFilter === 'for-you' ? '0 4px 12px rgba(238, 56, 101, 0.25)' : '0 2px 6px rgba(0,0,0,0.03)',
              whiteSpace: 'nowrap',
              transition: 'all 0.2s ease'
            }}
          >
            <Sparkles size={14} />
            <span>For You</span>
          </button>

          <button
            onClick={() => setActiveFilter('following')}
            style={{
              flexShrink: 0,
              padding: '8px 16px',
              borderRadius: 'var(--radius-pill, 999px)',
              border: activeFilter === 'following' ? 'none' : '1px solid #E5E7EB',
              background: activeFilter === 'following' ? 'var(--primary-gradient, #EE3865)' : '#FFFFFF',
              color: activeFilter === 'following' ? '#FFFFFF' : '#4B5563',
              fontSize: '0.84rem',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: activeFilter === 'following' ? '0 4px 12px rgba(238, 56, 101, 0.25)' : '0 2px 6px rgba(0,0,0,0.03)',
              whiteSpace: 'nowrap',
              transition: 'all 0.2s ease'
            }}
          >
            <Users size={14} />
            <span>Following</span>
          </button>

          <button
            onClick={() => setActiveFilter('trending')}
            style={{
              flexShrink: 0,
              padding: '8px 16px',
              borderRadius: 'var(--radius-pill, 999px)',
              border: activeFilter === 'trending' ? 'none' : '1px solid #E5E7EB',
              background: activeFilter === 'trending' ? 'var(--primary-gradient, #EE3865)' : '#FFFFFF',
              color: activeFilter === 'trending' ? '#FFFFFF' : '#4B5563',
              fontSize: '0.84rem',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: activeFilter === 'trending' ? '0 4px 12px rgba(238, 56, 101, 0.25)' : '0 2px 6px rgba(0,0,0,0.03)',
              whiteSpace: 'nowrap',
              transition: 'all 0.2s ease'
            }}
          >
            <Flame size={14} />
            <span>Trending</span>
          </button>
        </div>

        {/* Quick Post Button */}
        <button
          onClick={openCreatePostModal}
          style={{
            flexShrink: 0,
            background: 'var(--primary-gradient, linear-gradient(135deg, #EE3865 0%, #EC4899 100%))',
            color: '#FFFFFF',
            border: 'none',
            padding: '8px 16px',
            borderRadius: 'var(--radius-pill, 999px)',
            fontWeight: 800,
            fontSize: '0.84rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            boxShadow: '0 4px 14px rgba(238, 56, 101, 0.3)',
            whiteSpace: 'nowrap',
            transition: 'transform 0.15s ease'
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-1px)')}
          onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
        >
          <Plus size={16} />
          <span>New Post</span>
        </button>
      </div>

      {/* 3. FEED MAIN SPLIT LAYOUT (Feed Stream + Sidebar) */}
      <div className="feed-split-grid">
        {/* Left / Center: Post Cards Stream */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {displayedPosts.length === 0 ? (
            <div
              style={{
                background: '#FFFFFF',
                borderRadius: '24px',
                padding: '48px 24px',
                textAlign: 'center',
                border: '1.5px solid var(--border-gold, #FCE7F3)'
              }}
            >
              <Sparkles size={40} color="#EE3865" style={{ opacity: 0.6, marginBottom: '12px' }} />
              <h3 style={{ margin: '0 0 6px', fontSize: '1.2rem', fontWeight: 800, color: '#1F2937' }}>
                No posts to show
              </h3>
              <p style={{ margin: '0 0 16px', fontSize: '0.88rem', color: '#6B7280' }}>
                {activeFilter === 'following'
                  ? 'Follow more people from the Discover or For You feed to see their posts here!'
                  : 'Be the first to share an aesthetic moment or dating thought!'}
              </p>
              <button
                onClick={openCreatePostModal}
                style={{
                  background: 'var(--primary-gradient, #EE3865)',
                  color: '#FFFFFF',
                  border: 'none',
                  padding: '10px 22px',
                  borderRadius: '999px',
                  fontWeight: 800,
                  cursor: 'pointer'
                }}
              >
                Create First Post
              </button>
            </div>
          ) : (
            displayedPosts.map((post) => <PostCard key={post.id} post={post} />)
          )}
        </div>

        {/* Right Sidebar (Desktop only) */}
        <aside className="desktop-only" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Trending Dating Topics */}
          <div
            style={{
              background: '#FFFFFF',
              padding: '24px',
              borderRadius: '24px',
              border: '1.5px solid var(--border-gold, #FCE7F3)',
              boxShadow: '0 4px 20px rgba(76, 5, 25, 0.04)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
              <Flame size={18} color="#EE3865" />
              <h3 style={{ fontFamily: 'var(--font-serif, inherit)', fontSize: '1.15rem', fontWeight: 800, margin: 0 }}>
                Trending Topics
              </h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                { tag: 'FirstDateIdeas', posts: '1.4k posts' },
                { tag: 'MusicCompatibility', posts: '980 posts' },
                { tag: 'CoffeeVibes', posts: '2.1k posts' },
                { tag: 'SlowDating', posts: '760 posts' }
              ].map((item) => (
                <div
                  key={item.tag}
                  onClick={() => showToast(`Filtering by #${item.tag}`)}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '8px 12px',
                    borderRadius: '14px',
                    background: 'rgba(238, 56, 101, 0.06)',
                    cursor: 'pointer'
                  }}
                >
                  <span style={{ fontSize: '0.86rem', fontWeight: 800, color: '#EE3865' }}>
                    #{item.tag}
                  </span>
                  <span style={{ fontSize: '0.74rem', color: '#6B7280' }}>{item.posts}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Live Audio Stages */}
          <div
            style={{
              background: '#FFFFFF',
              padding: '24px',
              borderRadius: '24px',
              border: '1.5px solid var(--border-gold, #FCE7F3)',
              boxShadow: '0 4px 20px rgba(76, 5, 25, 0.04)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
              <Radio size={18} color="#EE3865" />
              <h3 style={{ fontFamily: 'var(--font-serif, inherit)', fontSize: '1.15rem', fontWeight: 800, margin: 0 }}>
                Live Audio Stages
              </h3>
            </div>

            {liveRooms.slice(0, 2).map((room) => (
              <div
                key={room.id}
                onClick={() => joinLiveRoom(room)}
                style={{
                  padding: '12px',
                  borderRadius: '16px',
                  border: '1px solid #F3F4F6',
                  marginBottom: '10px',
                  cursor: 'pointer',
                  background: '#F9FAFB'
                }}
              >
                <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#1F2937', marginBottom: '4px' }}>
                  {room.title}
                </div>
                <div style={{ fontSize: '0.76rem', color: '#6B7280' }}>
                  Hosted by {room.host.name} • {room.listenersCount} listening
                </div>
              </div>
            ))}
          </div>
        </aside>
      </div>

    </div>
  );
};

