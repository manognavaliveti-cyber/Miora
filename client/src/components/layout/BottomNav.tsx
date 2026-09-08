import React from 'react';
import { useApp } from '../../context/AppContext';
import { Sparkles, Heart, Compass, Radio, Gamepad2, MessageCircle, Coins, User } from 'lucide-react';
import { MainTab } from '../../types';

export const BottomNav: React.FC = () => {
  const { activeTab, navigateToTab, matches } = useApp();

  const unreadMessagesCount = matches.reduce((acc, m) => acc + (m.unreadCount || 0), 0);

  const tabs: { id: MainTab; label: string; icon: React.ReactNode; badge?: number }[] = [
    {
      id: 'discover',
      label: 'Discover',
      icon: <Sparkles size={17} />
    },
    {
      id: 'feed',
      label: 'Feed',
      icon: <Compass size={17} />
    },
    {
      id: 'rooms',
      label: 'Rooms',
      icon: <Radio size={17} />
    },
    {
      id: 'play',
      label: 'Play',
      icon: <Gamepad2 size={17} />
    },
    {
      id: 'messages',
      label: 'Chat',
      icon: <MessageCircle size={17} />,
      badge: unreadMessagesCount > 0 ? unreadMessagesCount : undefined
    },
    {
      id: 'profile',
      label: 'Profile',
      icon: <User size={17} />
    }
  ];

  return (
    <nav
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '6px 2px calc(8px + env(safe-area-inset-bottom, 0px)) 2px',
        background: 'rgba(255, 255, 255, 0.97)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderTop: '1px solid var(--border-subtle)',
        boxShadow: '0 -4px 20px rgba(76, 5, 25, 0.06)',
        position: 'relative',
        zIndex: 25,
        width: '100%',
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
              flex: 1,
              minWidth: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '2px',
              padding: '4px 1px',
              borderRadius: '12px',
              border: 'none',
              background: isActive ? 'var(--bg-soft-blush)' : 'transparent',
              color: isActive ? 'var(--berry-primary)' : 'var(--text-muted)',
              cursor: 'pointer',
              transition: 'all var(--transition-fast)',
              position: 'relative',
              outline: 'none'
            }}
            aria-label={tab.label}
          >
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {React.cloneElement(tab.icon as React.ReactElement, {
                fill: isActive ? 'var(--rose-petal)' : 'none',
                color: isActive ? 'var(--berry-primary)' : 'currentColor',
                size: 16
              })}

              {tab.badge !== undefined && tab.badge > 0 && (
                <span
                  style={{
                    position: 'absolute',
                    top: '-4px',
                    right: '-7px',
                    background: 'var(--primary-gradient)',
                    color: '#FFFFFF',
                    fontSize: '0.55rem',
                    fontWeight: 800,
                    minWidth: '14px',
                    height: '14px',
                    borderRadius: 'var(--radius-pill)',
                    padding: '0 3px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 2px 6px rgba(136, 19, 55, 0.35)'
                  }}
                >
                  {tab.badge}
                </span>
              )}
            </div>

            <span
              style={{
                fontSize: 'clamp(0.55rem, 2.1vw, 0.64rem)',
                fontWeight: isActive ? 800 : 500,
                fontFamily: 'var(--font-primary)',
                letterSpacing: '-0.02em',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                maxWidth: '100%',
                lineHeight: 1.1
              }}
            >
              {tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};
