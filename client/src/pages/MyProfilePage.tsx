import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Edit3,
  SlidersHorizontal,
  Settings as SettingsIcon,
  Shield,
  Sparkles,
  MapPin,
  Flame,
  ShieldCheck,
  Calendar,
  Lock,
  Heart,
  Briefcase,
  GraduationCap,
  Plus,
  Image,
  Bookmark,
  Smile,
  Users,
  MessageCircle,
  Share2,
  Coins,
  ArrowRight,
  CreditCard,
  Clock,
  Zap,
  Crown,
  Rocket,
  Star
} from 'lucide-react';
import { PostCard } from '../components/feed/PostCard';

export const MyProfilePage: React.FC = () => {
  const {
    currentUser,
    setCurrentView,
    feedPosts,
    savedPostIds,
    followingIds,
    myStatusNote,
    openFollowersModal,
    openStatusNoteModal,
    openCreatePostModal,
    openUpgradeModal,
    openBoostModal,
    showToast
  } = useApp();

  const [activeProfileTab, setActiveProfileTab] = useState<'posts' | 'saved' | 'about'>('posts');

  const userPhoto =
    currentUser.photos[0] ||
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80';

  // Filter user's own posts and saved posts
  const myPosts = feedPosts.filter((p) => p.authorId === currentUser.id || p.authorId === 'user_me' || p.userId === currentUser.id || p.userId === 'user_me');
  const mySavedPosts = feedPosts.filter((p) => savedPostIds.includes(p.id) || p.isSavedByMe || p.saved);

  const handleShareProfile = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(`${window.location.origin}/#profile-${currentUser.id}`);
      showToast('Profile link copied to clipboard! 📋✨');
    }
  };

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
      {/* Profile Header Card */}
      <div
        style={{
          background: '#FFFFFF',
          borderRadius: '28px',
          border: '1.5px solid var(--border-gold, #FCE7F3)',
          boxShadow: '0 8px 30px rgba(76, 5, 25, 0.05)',
          padding: '24px 20px',
          marginBottom: '20px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '18px', flexWrap: 'wrap' }}>
          {/* Avatar with Status Note Bubble */}
          <div style={{ position: 'relative' }}>
            <img
              src={userPhoto}
              alt={currentUser.name}
              style={{
                width: '84px',
                height: '84px',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '3px solid #EE3865',
                boxShadow: '0 4px 16px rgba(238, 56, 101, 0.25)'
              }}
            />

            {/* 24h Status Note Badge */}
            <div
              onClick={openStatusNoteModal}
              style={{
                position: 'absolute',
                top: '-8px',
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
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                maxWidth: '100px',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}
            >
              <span>{myStatusNote?.emoji || '✨'}</span>
              <span>{myStatusNote ? 'Note' : '+ Note'}</span>
            </div>
          </div>

          {/* User Info & Actions */}
          <div style={{ flex: 1, minWidth: '200px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <h2
                style={{
                  fontFamily: 'var(--font-serif, inherit)',
                  fontSize: '1.45rem',
                  fontWeight: 800,
                  color: '#1F2937',
                  margin: 0
                }}
              >
                {currentUser.name}, {currentUser.age}
              </h2>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  color: '#D4AF37',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  background: 'rgba(212, 175, 55, 0.1)',
                  padding: '2px 8px',
                  borderRadius: '999px',
                  border: '1px solid #D4AF37'
                }}
              >
                <ShieldCheck size={13} color="#D4AF37" />
                Verified
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#6B7280', fontSize: '0.84rem', marginTop: '3px' }}>
              <MapPin size={13} color="#EE3865" />
              <span>{currentUser.location}</span>
            </div>

            {currentUser.bio && (
              <p style={{ fontSize: '0.88rem', color: '#4B5563', margin: '8px 0 0', lineHeight: 1.45 }}>
                {currentUser.bio}
              </p>
            )}
          </div>
        </div>

        {/* Action Buttons: Edit Profile & Share Profile */}
        <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
          <button
            onClick={() => setCurrentView('edit-profile')}
            style={{
              flex: 1,
              background: 'var(--primary-gradient, linear-gradient(135deg, #EE3865, #EC4899))',
              color: '#FFFFFF',
              border: 'none',
              padding: '10px 16px',
              borderRadius: '999px',
              fontWeight: 800,
              fontSize: '0.84rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(238, 56, 101, 0.25)'
            }}
          >
            <Edit3 size={14} />
            <span>Edit Profile</span>
          </button>

          <button
            onClick={handleShareProfile}
            style={{
              flex: 1,
              background: '#FFFFFF',
              color: '#374151',
              border: '1.5px solid #E5E7EB',
              padding: '10px 16px',
              borderRadius: '999px',
              fontWeight: 800,
              fontSize: '0.84rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              cursor: 'pointer'
            }}
          >
            <Share2 size={14} />
            <span>Share Profile</span>
          </button>
        </div>

        {/* Social Metrics Bar */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '8px',
            marginTop: '16px',
            paddingTop: '16px',
            borderTop: '1px solid rgba(0,0,0,0.05)',
            textAlign: 'center'
          }}
        >
          <div
            onClick={() => setActiveProfileTab('posts')}
            style={{ cursor: 'pointer', padding: '6px', borderRadius: '12px' }}
          >
            <span style={{ display: 'block', fontSize: '1.15rem', fontWeight: 800, color: '#1F2937' }}>
              {myPosts.length}
            </span>
            <span style={{ fontSize: '0.72rem', color: '#6B7280', fontWeight: 700 }}>Posts</span>
          </div>

          <div
            onClick={() => openFollowersModal('followers')}
            style={{ cursor: 'pointer', padding: '6px', borderRadius: '12px' }}
          >
            <span style={{ display: 'block', fontSize: '1.15rem', fontWeight: 800, color: '#EE3865' }}>
              2
            </span>
            <span style={{ fontSize: '0.72rem', color: '#6B7280', fontWeight: 700 }}>Followers</span>
          </div>

          <div
            onClick={() => openFollowersModal('following')}
            style={{ cursor: 'pointer', padding: '6px', borderRadius: '12px' }}
          >
            <span style={{ display: 'block', fontSize: '1.15rem', fontWeight: 800, color: '#D4AF37' }}>
              {followingIds.length}
            </span>
            <span style={{ fontSize: '0.72rem', color: '#6B7280', fontWeight: 700 }}>Following</span>
          </div>

          <div
            onClick={openStatusNoteModal}
            style={{ cursor: 'pointer', padding: '6px', borderRadius: '12px' }}
          >
            <span style={{ display: 'block', fontSize: '1.15rem', fontWeight: 800, color: '#8B5CF6' }}>
              {myStatusNote?.emoji || '✨'}
            </span>
            <span style={{ fontSize: '0.72rem', color: '#6B7280', fontWeight: 700 }}>Thought</span>
          </div>
        </div>
      </div>

      {/* VIP Membership & Power-Ups Status Card */}
      <div
        style={{
          background: 'linear-gradient(135deg, #4C0519 0%, #881337 50%, #BE123C 100%)',
          borderRadius: '24px',
          padding: '20px 24px',
          color: '#FFFFFF',
          marginBottom: '20px',
          boxShadow: '0 12px 30px -5px rgba(136, 19, 55, 0.28)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div
            style={{
              width: '52px',
              height: '52px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #FDE68A 0%, #D4AF37 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 16px rgba(212, 175, 55, 0.45)',
              flexShrink: 0
            }}
          >
            <Crown size={26} color="#4C0519" />
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '1.2rem', fontWeight: 900, color: '#FFFFFF' }}>
                {currentUser.isPremium ? 'MIORA VIP Member 👑' : 'Free Explorer'}
              </span>
              <span
                style={{
                  background: 'rgba(253, 230, 138, 0.25)',
                  color: '#FDE68A',
                  border: '1px solid rgba(253, 230, 138, 0.5)',
                  fontSize: '0.68rem',
                  fontWeight: 900,
                  padding: '2px 8px',
                  borderRadius: 'var(--radius-pill)'
                }}
              >
                {currentUser.subscriptionTier?.toUpperCase() || 'FREE'}
              </span>
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '6px', fontSize: '0.78rem', color: 'rgba(255, 255, 255, 0.9)' }}>
              <span>🚀 <strong>{currentUser.boostsCount || 0}</strong> Boosts</span>
              <span>🌟 <strong>{currentUser.spotlightsCount || 0}</strong> Spotlights</span>
              <span>⭐ <strong>{currentUser.superLikesRemaining || 0}</strong> Super Likes</span>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={openBoostModal}
            style={{
              background: 'rgba(255, 255, 255, 0.15)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              color: '#FFFFFF',
              padding: '8px 16px',
              borderRadius: 'var(--radius-pill)',
              fontWeight: 800,
              fontSize: '0.8rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '5px'
            }}
          >
            <Rocket size={14} /> Boost
          </button>

          <button
            onClick={openUpgradeModal}
            style={{
              background: 'linear-gradient(135deg, #FDE68A 0%, #D4AF37 100%)',
              border: 'none',
              color: '#4C0519',
              padding: '8px 16px',
              borderRadius: 'var(--radius-pill)',
              fontWeight: 900,
              fontSize: '0.8rem',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(212, 175, 55, 0.35)',
              display: 'flex',
              alignItems: 'center',
              gap: '5px'
            }}
          >
            <Crown size={14} /> {currentUser.isPremium ? 'Manage VIP' : 'Upgrade VIP'}
          </button>
        </div>
      </div>

      {/* Wallet & Coins Showcase Card */}
      <div
        style={{
          background: 'linear-gradient(135deg, #FFFFFF 0%, #FFF8FA 60%, #FFF0F4 100%)',
          borderRadius: '28px',
          border: '1.5px solid var(--border-gold, #FCE7F3)',
          boxShadow: '0 8px 30px rgba(76, 5, 25, 0.05)',
          padding: '20px 24px',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div
            style={{
              width: '54px',
              height: '54px',
              borderRadius: '18px',
              background: 'var(--gold-gradient-subtle, rgba(212, 175, 55, 0.15))',
              border: '1.5px solid var(--border-gold, #D4AF37)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--gold-deep, #9A7B2C)',
              boxShadow: 'var(--shadow-xs)'
            }}
          >
            <Coins size={28} />
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span
                style={{
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: 'var(--gold-deep, #9A7B2C)'
                }}
              >
                Wallet & Coins
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '2px', flexWrap: 'wrap' }}>
              <h3 style={{ fontSize: '1.65rem', fontWeight: 900, color: 'var(--text-primary, #1F161A)', margin: 0, fontFamily: 'var(--font-display, inherit)' }}>
                {currentUser.coinBalance}
              </h3>
              <span style={{ fontSize: '0.92rem', fontWeight: 800, color: 'var(--berry-primary, #EE3865)' }}>
                Coins
              </span>
              <span style={{ color: 'var(--text-muted, #9CA3AF)', fontSize: '0.82rem' }}>•</span>
              <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary, #6B7280)', fontWeight: 600 }}>
                {Math.floor(currentUser.talkTimeSecondsRemaining / 60)}m talk time
              </span>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            onClick={() => setCurrentView('wallet')}
            style={{
              background: 'var(--primary-gradient, linear-gradient(135deg, #EE3865, #BE123C))',
              color: '#FFFFFF',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '9999px',
              fontWeight: 800,
              fontSize: '0.84rem',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(238, 56, 101, 0.3)',
              transition: 'transform 0.15s ease'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.03)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          >
            <span>Manage Wallet</span>
            <ArrowRight size={15} />
          </button>
        </div>
      </div>

      {/* Profile Social Tabs */}
      <div
        style={{
          display: 'flex',
          background: '#FFFFFF',
          borderRadius: '999px',
          padding: '4px',
          border: '1px solid #E5E7EB',
          marginBottom: '20px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
        }}
      >
        <button
          onClick={() => setActiveProfileTab('posts')}
          style={{
            flex: 1,
            padding: '10px',
            borderRadius: '999px',
            border: 'none',
            background: activeProfileTab === 'posts' ? 'var(--primary-gradient, #EE3865)' : 'transparent',
            color: activeProfileTab === 'posts' ? '#FFFFFF' : '#6B7280',
            fontWeight: 800,
            fontSize: '0.84rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
        >
          <Image size={15} />
          <span>My Posts ({myPosts.length})</span>
        </button>

        <button
          onClick={() => setActiveProfileTab('saved')}
          style={{
            flex: 1,
            padding: '10px',
            borderRadius: '999px',
            border: 'none',
            background: activeProfileTab === 'saved' ? 'var(--primary-gradient, #EE3865)' : 'transparent',
            color: activeProfileTab === 'saved' ? '#FFFFFF' : '#6B7280',
            fontWeight: 800,
            fontSize: '0.84rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
        >
          <Bookmark size={15} />
          <span>Saved ({mySavedPosts.length})</span>
        </button>

        <button
          onClick={() => setActiveProfileTab('about')}
          style={{
            flex: 1,
            padding: '10px',
            borderRadius: '999px',
            border: 'none',
            background: activeProfileTab === 'about' ? 'var(--primary-gradient, #EE3865)' : 'transparent',
            color: activeProfileTab === 'about' ? '#FFFFFF' : '#6B7280',
            fontWeight: 800,
            fontSize: '0.84rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
        >
          <Sparkles size={15} />
          <span>About & Dating</span>
        </button>
      </div>

      {/* TAB CONTENT */}
      {/* 1. My Posts */}
      {activeProfileTab === 'posts' && (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {myPosts.length === 0 ? (
            <div
              style={{
                background: '#FFFFFF',
                borderRadius: '24px',
                padding: '48px 24px',
                textAlign: 'center',
                border: '1.5px solid #FCE7F3'
              }}
            >
              <Image size={38} color="#EE3865" style={{ opacity: 0.6, marginBottom: '10px' }} />
              <h3 style={{ margin: '0 0 6px', fontSize: '1.15rem', fontWeight: 800, color: '#1F2937' }}>
                No posts shared yet
              </h3>
              <p style={{ margin: '0 0 16px', fontSize: '0.84rem', color: '#6B7280' }}>
                Share your first dating thought, aesthetic picture, or weekend moment!
              </p>
              <button
                onClick={openCreatePostModal}
                style={{
                  background: 'var(--primary-gradient, #EE3865)',
                  color: '#FFFFFF',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '999px',
                  fontWeight: 800,
                  fontSize: '0.84rem',
                  cursor: 'pointer'
                }}
              >
                Create Post
              </button>
            </div>
          ) : (
            myPosts.map((post) => <PostCard key={post.id} post={post} />)
          )}
        </div>
      )}

      {/* 2. Saved Bookmarks (Private) */}
      {activeProfileTab === 'saved' && (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div
            style={{
              background: 'rgba(212, 175, 55, 0.08)',
              borderRadius: '16px',
              padding: '12px 16px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '16px',
              border: '1px solid rgba(212, 175, 55, 0.2)'
            }}
          >
            <Lock size={15} color="#D4AF37" />
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#92400E' }}>
              Only you can see your saved posts
            </span>
          </div>

          {mySavedPosts.length === 0 ? (
            <div
              style={{
                background: '#FFFFFF',
                borderRadius: '24px',
                padding: '48px 24px',
                textAlign: 'center',
                border: '1.5px solid #FCE7F3'
              }}
            >
              <Bookmark size={38} color="#D4AF37" style={{ opacity: 0.6, marginBottom: '10px' }} />
              <h3 style={{ margin: '0 0 6px', fontSize: '1.15rem', fontWeight: 800, color: '#1F2937' }}>
                No saved posts yet
              </h3>
              <p style={{ margin: 0, fontSize: '0.84rem', color: '#6B7280' }}>
                Tap the bookmark icon 🔖 on any post in the feed to save it for later.
              </p>
            </div>
          ) : (
            mySavedPosts.map((post) => <PostCard key={post.id} post={post} />)
          )}
        </div>
      )}

      {/* 3. About & Dating Details */}
      {activeProfileTab === 'about' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Photo Gallery Grid */}
          <div
            style={{
              background: '#FFFFFF',
              borderRadius: '24px',
              padding: '20px',
              border: '1.5px solid #FCE7F3'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#1F2937', textTransform: 'uppercase' }}>
                Photo Gallery ({currentUser.photos.length}/6)
              </span>
              <span
                onClick={() => setCurrentView('edit-profile')}
                style={{ fontSize: '0.78rem', color: '#EE3865', fontWeight: 700, cursor: 'pointer' }}
              >
                Manage
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
              {currentUser.photos.map((photo, index) => (
                <div
                  key={index}
                  style={{
                    height: '110px',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    border: '1px solid #E5E7EB'
                  }}
                >
                  <img src={photo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              ))}
            </div>
          </div>

          {/* Passions & Interests */}
          <div
            style={{
              background: '#FFFFFF',
              borderRadius: '24px',
              padding: '20px',
              border: '1.5px solid #FCE7F3'
            }}
          >
            <span style={{ display: 'block', fontSize: '0.82rem', fontWeight: 800, color: '#1F2937', textTransform: 'uppercase', marginBottom: '12px' }}>
              Passions & Interests
            </span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {currentUser.interests.map((interest) => (
                <span
                  key={interest}
                  style={{
                    padding: '6px 14px',
                    borderRadius: '999px',
                    background: 'rgba(238, 56, 101, 0.08)',
                    color: '#EE3865',
                    fontSize: '0.82rem',
                    fontWeight: 700
                  }}
                >
                  {interest}
                </span>
              ))}
            </div>
          </div>

          {/* Dating Preferences Shortcut */}
          <div
            onClick={() => setCurrentView('dating-preferences')}
            style={{
              background: '#FFFFFF',
              borderRadius: '24px',
              padding: '20px',
              border: '1.5px solid #FCE7F3',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '14px',
                  background: 'rgba(238, 56, 101, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#EE3865'
                }}
              >
                <SlidersHorizontal size={20} />
              </div>
              <div>
                <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 800, color: '#1F2937' }}>
                  Dating Preferences
                </h4>
                <span style={{ fontSize: '0.78rem', color: '#6B7280' }}>
                  Looking for {currentUser.preferences.interestedIn}, ages {currentUser.preferences.ageRange.min}–{currentUser.preferences.ageRange.max}
                </span>
              </div>
            </div>
            <span style={{ color: '#EE3865', fontSize: '1.2rem', fontWeight: 700 }}>›</span>
          </div>

          {/* Wallet & Coins Shortcut */}
          <div
            onClick={() => setCurrentView('wallet')}
            style={{
              background: '#FFFFFF',
              borderRadius: '24px',
              padding: '20px',
              border: '1.5px solid var(--border-gold, #FCE7F3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer',
              transition: 'transform 0.15s ease'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-2px)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '14px',
                  background: 'var(--gold-gradient-subtle, rgba(212, 175, 55, 0.12))',
                  border: '1px solid var(--border-gold, #D4AF37)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--gold-deep, #9A7B2C)'
                }}
              >
                <Coins size={20} />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 800, color: '#1F2937' }}>
                    Wallet & Coins
                  </h4>
                  <span
                    style={{
                      background: 'var(--gold-gradient-subtle, rgba(212, 175, 55, 0.15))',
                      color: 'var(--gold-deep, #9A7B2C)',
                      fontSize: '0.72rem',
                      fontWeight: 800,
                      padding: '2px 8px',
                      borderRadius: '999px',
                      border: '1px solid var(--border-gold, #D4AF37)'
                    }}
                  >
                    💰 {currentUser.coinBalance} Coins
                  </span>
                </div>
                <span style={{ fontSize: '0.78rem', color: '#6B7280' }}>
                  Recharge packs, talk time, gift history & rewards
                </span>
              </div>
            </div>
            <span style={{ color: '#D4AF37', fontSize: '1.2rem', fontWeight: 700 }}>›</span>
          </div>

          {/* Settings & Privacy Shortcut */}
          <div
            onClick={() => setCurrentView('settings')}
            style={{
              background: '#FFFFFF',
              borderRadius: '24px',
              padding: '20px',
              border: '1.5px solid #FCE7F3',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '14px',
                  background: 'rgba(212, 175, 55, 0.12)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#D4AF37'
                }}
              >
                <SettingsIcon size={20} />
              </div>
              <div>
                <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 800, color: '#1F2937' }}>
                  Settings & Safety
                </h4>
                <span style={{ fontSize: '0.78rem', color: '#6B7280' }}>
                  Manage privacy, blocked users, notifications
                </span>
              </div>
            </div>
            <span style={{ color: '#D4AF37', fontSize: '1.2rem', fontWeight: 700 }}>›</span>
          </div>

          {/* Legal Links Footer */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              padding: '16px 0 8px 0',
              fontSize: '0.8rem',
              color: 'var(--text-muted)'
            }}
          >
            <button
              onClick={() => setCurrentView('terms')}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-secondary)',
                cursor: 'pointer',
                fontFamily: 'inherit',
                fontSize: 'inherit',
                textDecoration: 'underline'
              }}
            >
              Terms & Conditions
            </button>
            <span>•</span>
            <button
              onClick={() => setCurrentView('privacy')}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-secondary)',
                cursor: 'pointer',
                fontFamily: 'inherit',
                fontSize: 'inherit',
                textDecoration: 'underline'
              }}
            >
              Privacy Policy
            </button>
          </div>
        </div>
      )}

    </div>
  );
};


