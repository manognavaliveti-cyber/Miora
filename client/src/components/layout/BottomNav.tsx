import React from 'react';
import { useApp } from '../../context/AppContext';
import { Home, MessageCircle, Gamepad2, Heart, User } from 'lucide-react';
import { MainTab } from '../../types';

export const BottomNav: React.FC = () => {
  const { activeTab, navigateToTab, matches } = useApp();

  const unreadMessagesCount = matches.reduce((acc, m) => acc + (m.unreadCount || 0), 0);

  const tabs: {
    id: MainTab;
    label: string;
    icon: (isActive: boolean) => React.ReactNode;
    badge?: number;
  }[] = [
    {
      id: 'home',
      label: 'Home',
      icon: (isActive) => (
        <Home
          size={24}
          color={isActive ? '#F43F5E' : 'rgba(255, 255, 255, 0.45)'}
          strokeWidth={isActive ? 2.5 : 2}
        />
      )
    },
    {
      id: 'chat',
      label: 'Chat',
      badge: unreadMessagesCount > 0 ? unreadMessagesCount : undefined,
      icon: (isActive) => (
        <MessageCircle
          size={24}
          color={isActive ? '#F43F5E' : 'rgba(255, 255, 255, 0.45)'}
          strokeWidth={isActive ? 2.5 : 2}
        />
      )
    },
    {
      id: 'games',
      label: 'Games',
      icon: (isActive) => (
        <Gamepad2
          size={24}
          color={isActive ? '#F43F5E' : 'rgba(255, 255, 255, 0.45)'}
          strokeWidth={isActive ? 2.5 : 2}
        />
      )
    },
    {
      id: 'likes',
      label: 'Likes',
      icon: (isActive) => (
        <Heart
          size={24}
          color={isActive ? '#F43F5E' : 'rgba(255, 255, 255, 0.45)'}
          fill={isActive ? '#F43F5E' : 'none'}
          strokeWidth={isActive ? 0 : 2}
        />
      )
    },
    {
      id: 'profile',
      label: 'Profile',
      icon: (isActive) => (
        <User
          size={24}
          color={isActive ? '#F43F5E' : 'rgba(255, 255, 255, 0.45)'}
          strokeWidth={isActive ? 2.5 : 2}
        />
      )
    }
  ];

  return (
    <>
      <style>{`
        @keyframes navIconBounce {
          0% { transform: scale(1); }
          40% { transform: scale(1.18); }
          70% { transform: scale(0.95); }
          100% { transform: scale(1.08); }
        }

        .nav-icon-active {
          animation: navIconBounce 300ms cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }

        .nav-btn-touch {
          transition: transform 200ms ease, opacity 150ms ease;
        }
        .nav-btn-touch:active {
          transform: scale(0.92);
          opacity: 0.8;
        }
      `}</style>

      <nav
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-around',
          padding: '0 12px calc(6px + env(safe-area-inset-bottom, 0px)) 12px',
          height: 'calc(60px + env(safe-area-inset-bottom, 0px))',
          background: 'rgba(12, 10, 14, 0.94)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          position: 'relative',
          zIndex: 9999,
          width: '100%',
          boxSizing: 'border-box',
          boxShadow: '0 -10px 32px rgba(0, 0, 0, 0.7)'
        }}
      >
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => navigateToTab(tab.id)}
              className="nav-btn-touch"
              style={{
                flex: 1,
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: 'none',
                background: 'transparent',
                cursor: 'pointer',
                position: 'relative',
                zIndex: 2,
                outline: 'none',
                padding: 0
              }}
              aria-label={tab.label}
              title={tab.label}
            >
              <div
                style={{
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '42px',
                  height: '42px',
                  borderRadius: '50%',
                  background: isActive ? 'radial-gradient(circle, rgba(244, 63, 94, 0.18) 0%, rgba(244, 63, 94, 0) 75%)' : 'transparent',
                  transition: 'background 250ms ease'
                }}
              >
                <div className={isActive ? 'nav-icon-active' : ''} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {tab.icon(isActive)}
                </div>

                {/* Notification Badge */}
                {tab.badge !== undefined && tab.badge > 0 && (
                  <span
                    style={{
                      position: 'absolute',
                      top: '2px',
                      right: '2px',
                      background: '#E11D48',
                      color: '#FFFFFF',
                      fontSize: '0.6rem',
                      fontWeight: 900,
                      minWidth: '15px',
                      height: '15px',
                      borderRadius: '9999px',
                      padding: '0 3px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '2px solid #0C0A0E',
                      boxShadow: '0 2px 6px rgba(225, 29, 72, 0.6)'
                    }}
                  >
                    {tab.badge}
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </nav>
    </>
  );
};



