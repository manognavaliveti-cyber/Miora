import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { apiService } from '../../services/api';
import { Profile, FeedPost } from '../../types';
import {
  X,
  Search,
  User,
  Image,
  Tag,
  MapPin,
  CheckCircle2,
  UserPlus,
  UserCheck,
  Sparkles,
  Heart
} from 'lucide-react';

export const SearchModal: React.FC = () => {
  const {
    isSearchModalOpen,
    closeSearchModal,
    profiles,
    feedPosts,
    openProfileDetail,
    toggleFollowUser,
    followingIds,
    likeFeedPost,
    openCommentSheet
  } = useApp();

  const [query, setQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'people' | 'posts'>('all');
  const [searchResults, setSearchResults] = useState<{ profiles: Profile[]; posts: FeedPost[] }>({
    profiles: [],
    posts: []
  });

  useEffect(() => {
    if (!isSearchModalOpen) return;

    if (!query.trim()) {
      setSearchResults({
        profiles: profiles.slice(0, 5),
        posts: feedPosts.slice(0, 4)
      });
      return;
    }

    const q = query.toLowerCase().trim();
    const matchedProfiles = profiles.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.location.toLowerCase().includes(q) ||
        p.bio.toLowerCase().includes(q) ||
        (p.interests && p.interests.some((i) => i.toLowerCase().includes(q)))
    );

    const matchedPosts = feedPosts.filter(
      (p) =>
        p.content.toLowerCase().includes(q) ||
        (p.authorName && p.authorName.toLowerCase().includes(q)) ||
        (p.tags && p.tags.some((t) => t.toLowerCase().includes(q)))
    );

    setSearchResults({ profiles: matchedProfiles, posts: matchedPosts });
  }, [query, isSearchModalOpen, profiles, feedPosts]);

  if (!isSearchModalOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        background: 'rgba(31, 22, 26, 0.8)',
        backdropFilter: 'blur(16px)',
        padding: '24px 16px',
        animation: 'fadeIn 0.2s ease-out'
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '600px',
          maxHeight: '88vh',
          background: '#FFFFFF',
          borderRadius: '32px',
          boxShadow: '0 24px 70px rgba(0,0,0,0.3)',
          border: '1.5px solid var(--border-gold, #FCE7F3)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          animation: 'scaleIn 0.25s ease-out'
        }}
      >
        {/* Search Bar Header */}
        <div style={{ padding: '20px 24px 14px', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
            <div
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                background: '#F9FAFB',
                borderRadius: '999px',
                padding: '10px 18px',
                border: '1.5px solid #E5E7EB'
              }}
            >
              <Search size={18} color="#EE3865" />
              <input
                type="text"
                autoFocus
                placeholder="Search people, tags, interests, locations..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                style={{
                  flex: 1,
                  border: 'none',
                  background: 'transparent',
                  fontSize: '0.94rem',
                  outline: 'none',
                  color: '#1F2937'
                }}
              />
              {query && (
                <button
                  onClick={() => setQuery('')}
                  style={{
                    border: 'none',
                    background: 'transparent',
                    cursor: 'pointer',
                    color: '#9CA3AF',
                    padding: 0
                  }}
                >
                  <X size={16} />
                </button>
              )}
            </div>

            <button
              onClick={closeSearchModal}
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                border: 'none',
                background: 'rgba(238, 56, 101, 0.08)',
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

          {/* Filter Pills */}
          <div style={{ display: 'flex', gap: '8px' }}>
            {(['all', 'people', 'posts'] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                style={{
                  padding: '6px 16px',
                  borderRadius: '999px',
                  border: activeFilter === filter ? 'none' : '1px solid #E5E7EB',
                  background: activeFilter === filter ? 'var(--primary-gradient, #EE3865)' : '#FFFFFF',
                  color: activeFilter === filter ? '#FFFFFF' : '#4B5563',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  textTransform: 'capitalize'
                }}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* Search Results Content */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '16px 24px 24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px'
          }}
        >
          {/* People Section */}
          {(activeFilter === 'all' || activeFilter === 'people') && searchResults.profiles.length > 0 && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
                <User size={15} color="#EE3865" />
                <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#6B7280', textTransform: 'uppercase' }}>
                  People ({searchResults.profiles.length})
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {searchResults.profiles.map((p) => {
                  const isFollowing = followingIds.includes(p.id);
                  return (
                    <div
                      key={p.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '10px 14px',
                        background: '#FFFFFF',
                        borderRadius: '16px',
                        border: '1px solid #F3F4F6',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
                      }}
                    >
                      <div
                        onClick={() => {
                          closeSearchModal();
                          openProfileDetail(p);
                        }}
                        style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', flex: 1 }}
                      >
                        <img
                          src={p.photos[0]}
                          alt={p.name}
                          style={{ width: '44px', height: '44px', borderRadius: '50%', objectFit: 'cover' }}
                        />
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <span style={{ fontWeight: 800, fontSize: '0.94rem', color: '#1F2937' }}>
                              {p.name}
                            </span>
                            <span style={{ fontSize: '0.8rem', color: '#6B7280' }}>· {p.age}</span>
                            <CheckCircle2 size={13} color="#EE3865" />
                          </div>
                          <span style={{ fontSize: '0.78rem', color: '#9CA3AF' }}>{p.location}</span>
                        </div>
                      </div>

                      <button
                        onClick={() => toggleFollowUser(p.id)}
                        style={{
                          padding: '6px 14px',
                          borderRadius: '999px',
                          border: isFollowing ? '1px solid #E5E7EB' : 'none',
                          background: isFollowing ? '#F3F4F6' : 'var(--primary-gradient, #EE3865)',
                          color: isFollowing ? '#4B5563' : '#FFFFFF',
                          fontSize: '0.78rem',
                          fontWeight: 700,
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          cursor: 'pointer'
                        }}
                      >
                        {isFollowing ? (
                          <>
                            <UserCheck size={12} />
                            <span>Following</span>
                          </>
                        ) : (
                          <>
                            <UserPlus size={12} />
                            <span>Follow</span>
                          </>
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Posts Section */}
          {(activeFilter === 'all' || activeFilter === 'posts') && searchResults.posts.length > 0 && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
                <Image size={15} color="#EE3865" />
                <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#6B7280', textTransform: 'uppercase' }}>
                  Posts ({searchResults.posts.length})
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {searchResults.posts.map((post) => (
                  <div
                    key={post.id}
                    style={{
                      display: 'flex',
                      gap: '12px',
                      padding: '12px',
                      background: '#FFFFFF',
                      borderRadius: '16px',
                      border: '1px solid #F3F4F6'
                    }}
                  >
                    {post.imageUrl && (
                      <img
                        src={post.imageUrl}
                        alt="Post media"
                        style={{ width: '64px', height: '64px', borderRadius: '12px', objectFit: 'cover' }}
                      />
                    )}
                    <div style={{ flex: 1 }}>
                      <span style={{ fontWeight: 800, fontSize: '0.86rem', color: '#1F2937' }}>
                        {post.authorName || post.userName || 'User'}
                      </span>
                      <p style={{ margin: '3px 0 6px', fontSize: '0.84rem', color: '#4B5563', lineHeight: 1.4 }}>
                        {post.content}
                      </p>
                      <div style={{ display: 'flex', gap: '12px', fontSize: '0.76rem', color: '#9CA3AF' }}>
                        <span>❤️ {post.likesCount || 0}</span>
                        <span>💬 {post.comments?.length || post.commentsCount || 0}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {searchResults.profiles.length === 0 && searchResults.posts.length === 0 && (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: '#9CA3AF' }}>
              <Sparkles size={36} color="#EE3865" style={{ opacity: 0.6, marginBottom: '8px' }} />
              <p style={{ fontWeight: 700, margin: 0, color: '#4B5563' }}>No results found</p>
              <p style={{ fontSize: '0.84rem', margin: '4px 0 0' }}>Try searching for a different name, city, or interest.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
