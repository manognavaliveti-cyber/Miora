import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Sparkles,
  Heart,
  MessageCircle,
  User,
  Radio,
  Gamepad2,
  Coins,
  Settings,
  Bell,
  SlidersHorizontal,
  Compass,
  Flame,
  Plus,
  Search
} from 'lucide-react';
import { MainTab } from '../../types';
import { MioraLogo } from '../common/MioraLogo';

export const DesktopNav: React.FC = () => {
  const {
    activeTab,
    navigateToTab,
    matches,
    currentUser,
    setCurrentView,
    openNotifDrawer,
    unreadNotifsCount,
    openSearchModal,
    openCreateSheet
  } = useApp();

  const unreadMessagesCount = matches.reduce((acc, m) => acc + (m.unreadCount || 0), 0);

  const tabs: { id: MainTab; label: string; icon: React.ReactNode; badge?: number }[] = [
    {
      id: 'discover',
      label: 'Discover',
      icon: <Sparkles size={16} />
    },
    {
      id: 'feed',
      label: 'Feed',
      icon: <Compass size={16} />
    },
    {
      id: 'messages',
      label: 'Messages',
      icon: <MessageCircle size={16} />,
      badge: unreadMessagesCount > 0 ? unreadMessagesCount : undefined
    },
    {
      id: 'rooms',
      label: 'Rooms',
      icon: <Radio size={16} />
    },
    {
      id: 'play',
      label: 'Play',
      icon: <Gamepad2 size={16} />
    },
    {
      id: 'profile',
      label: 'Profile',
      icon: <User size={16} />
    }
  ];

  const userPhoto =
    currentUser.photos[0] ||
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80';

  return (
    <header
      className="desktop-only"
      style={{
        width: '100%',
        position: 'sticky',
        top: 0,
        zIndex: 40,
        background: 'rgba(255, 245, 247, 0.95)',
        backdropFilter: 'blur(24px)',
        borderBottom: '1px solid var(--border-subtle)',
        marginBottom: '6px'
      }}
    >
      <div
        className="app-container"
        style={{
          minHeight: 'auto',
          paddingTop: '12px',
          paddingBottom: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexDirection: 'row',
          boxSizing: 'border-box'
        }}
      >
        {/* Brand Wordmark & Tagline: MIORA ♡ */}
        <div
          onClick={() => navigateToTab('discover')}
          style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', transition: 'transform var(--transition-fast)' }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.03)')}
          onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
        >
          <MioraLogo size={46} showTagline={true} showWordmark={true} vertical={false} />
        </div>

      {/* Center Navigation Tabs (Discover, Feed, Matches, Messages, Rooms, Play, Profile) */}
      <nav
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          background: 'var(--surface-white)',
          padding: '4px',
          borderRadius: 'var(--radius-pill)',
          boxShadow: 'var(--shadow-xs)',
          border: '1.5px solid var(--border-subtle)',
          height: '42px',
          boxSizing: 'border-box'
        }}
      >
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => navigateToTab(tab.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '7px 14px',
                borderRadius: 'var(--radius-pill)',
                border: 'none',
                background: isActive ? 'var(--primary-gradient)' : 'transparent',
                color: isActive ? '#FFFFFF' : 'var(--text-secondary)',
                cursor: 'pointer',
                fontFamily: 'var(--font-primary)',
                fontWeight: isActive ? 700 : 600,
                fontSize: '0.86rem',
                transition: 'all var(--transition-fast)',
                position: 'relative',
                boxShadow: isActive ? '0 4px 14px rgba(238, 56, 101, 0.32)' : 'none',
                height: '34px'
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.color = 'var(--berry-primary)';
                  e.currentTarget.style.background = 'var(--bg-soft-blush)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.color = 'var(--text-secondary)';
                  e.currentTarget.style.background = 'transparent';
                }
              }}
            >
              {React.cloneElement(tab.icon as React.ReactElement, {
                fill: isActive ? '#FFFFFF' : 'none',
                color: isActive ? '#FFFFFF' : 'currentColor'
              })}
              <span>{tab.label}</span>

              {tab.badge !== undefined && tab.badge > 0 && (
                <span
                  style={{
                    background: isActive ? 'var(--gold-champagne)' : 'var(--primary-gradient)',
                    color: isActive ? '#1F161A' : '#FFFFFF',
                    fontSize: '0.66rem',
                    fontWeight: 800,
                    padding: '2px 6px',
                    borderRadius: 'var(--radius-pill)'
                  }}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Right Controls: Search, Create, Coins Pill, Notifications, Settings, Profile */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {/* Global Search Button */}
        <button
          onClick={openSearchModal}
          style={{
            width: '38px',
            height: '38px',
            borderRadius: '50%',
            background: 'var(--surface-white)',
            border: '1.5px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-secondary)',
            cursor: 'pointer',
            boxShadow: 'var(--shadow-xs)',
            transition: 'all var(--transition-fast)'
          }}
          title="Search people & posts"
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'var(--berry-primary)';
            e.currentTarget.style.color = 'var(--berry-primary)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'var(--border-subtle)';
            e.currentTarget.style.color = 'var(--text-secondary)';
          }}
        >
          <Search size={17} />
        </button>

        {/* Create Post/Story Button */}
        <button
          onClick={openCreateSheet}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            background: 'var(--primary-gradient)',
            color: '#FFFFFF',
            border: 'none',
            padding: '0 16px',
            height: '38px',
            borderRadius: 'var(--radius-pill)',
            fontWeight: 700,
            fontSize: '0.84rem',
            cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(238, 56, 101, 0.35)',
            transition: 'transform var(--transition-fast)'
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.04)')}
          onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          title="Create post or story"
        >
          <Plus size={15} strokeWidth={2.5} />
          <span>Create</span>
        </button>

        {/* MIORA Coins Balance Pill */}
        <div
          onClick={() => setCurrentView('wallet')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            background: 'var(--gold-gradient-subtle)',
            border: '1.5px solid var(--border-gold)',
            padding: '0 14px',
            height: '38px',
            borderRadius: 'var(--radius-pill)',
            cursor: 'pointer',
            boxShadow: 'var(--shadow-xs)',
            transition: 'all var(--transition-fast)',
            flexShrink: 0,
            whiteSpace: 'nowrap'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.04)';
            e.currentTarget.style.borderColor = 'var(--gold-deep)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.borderColor = 'var(--border-gold)';
          }}
          title="Open MIORA Wallet & Coins"
        >
          <Coins size={16} color="var(--gold-deep)" />
          <span style={{ fontSize: '0.84rem', fontWeight: 800, color: 'var(--gold-deep)', whiteSpace: 'nowrap', lineHeight: 1 }}>
            {currentUser.coinBalance} Coins
          </span>
        </div>

        {/* Notifications Trigger */}
        <button
          onClick={openNotifDrawer}
          style={{
            width: '38px',
            height: '38px',
            borderRadius: '50%',
            background: 'var(--surface-white)',
            border: '1.5px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-secondary)',
            cursor: 'pointer',
            boxShadow: 'var(--shadow-xs)',
            position: 'relative',
            transition: 'all var(--transition-fast)'
          }}
          title="Notifications"
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'var(--berry-primary)';
            e.currentTarget.style.color = 'var(--berry-primary)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'var(--border-subtle)';
            e.currentTarget.style.color = 'var(--text-secondary)';
          }}
        >
          <Bell size={17} />
          {unreadNotifsCount > 0 && (
            <span
              style={{
                position: 'absolute',
                top: '6px',
                right: '7px',
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: 'var(--berry-primary)',
                boxShadow: '0 0 6px var(--berry-primary)'
              }}
            />
          )}
        </button>

        {/* Settings */}
        <button
          onClick={() => setCurrentView('settings')}
          style={{
            width: '38px',
            height: '38px',
            borderRadius: '50%',
            background: 'var(--surface-white)',
            border: '1.5px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-secondary)',
            cursor: 'pointer',
            boxShadow: 'var(--shadow-xs)',
            transition: 'all var(--transition-fast)'
          }}
          title="Settings & Privacy"
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'var(--berry-primary)';
            e.currentTarget.style.color = 'var(--berry-primary)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'var(--border-subtle)';
            e.currentTarget.style.color = 'var(--text-secondary)';
          }}
        >
          <Settings size={17} />
        </button>

        {/* User Avatar */}
        <div
          onClick={() => navigateToTab('profile')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'var(--surface-white)',
            border: '1.5px solid var(--border-subtle)',
            padding: '3px 14px 3px 4px',
            height: '38px',
            borderRadius: 'var(--radius-pill)',
            cursor: 'pointer',
            boxShadow: 'var(--shadow-xs)',
            transition: 'all var(--transition-fast)'
          }}
          onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--berry-primary)')}
          onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--border-subtle)')}
        >
          <img
            src={userPhoto}
            alt={currentUser.name}
            style={{
              width: '30px',
              height: '30px',
              borderRadius: '50%',
              objectFit: 'cover',
              border: '2px solid var(--gold-champagne)'
            }}
          />
          <span style={{ fontSize: '0.84rem', fontWeight: 800, fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>
            {currentUser.name}
          </span>
        </div>
      </div>
    </div>
  </header>
  );
};

