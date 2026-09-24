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
    animationClass: string;
  }[] = [
    {
      id: 'home',
      label: 'Home',
      animationClass: 'nav-anim-home',
      icon: (isActive) => <Home size={22} color={isActive ? '#FFFFFF' : 'rgba(255, 255, 255, 0.5)'} strokeWidth={isActive ? 2.5 : 2} />
    },
    {
      id: 'chat',
      label: 'Chat',
      animationClass: 'nav-anim-chat',
      badge: unreadMessagesCount > 0 ? unreadMessagesCount : undefined,
      icon: (isActive) => <MessageCircle size={22} color={isActive ? '#FFFFFF' : 'rgba(255, 255, 255, 0.5)'} strokeWidth={isActive ? 2.5 : 2} />
    },
    {
      id: 'games',
      label: 'Games',
      animationClass: 'nav-anim-games',
      icon: (isActive) => <Gamepad2 size={22} color={isActive ? '#FFFFFF' : 'rgba(255, 255, 255, 0.5)'} strokeWidth={isActive ? 2.5 : 2} />
    },
    {
      id: 'likes',
      label: 'Likes',
      animationClass: 'nav-anim-likes',
      icon: (isActive) => (
        <Heart
          size={22}
          color={isActive ? '#FFFFFF' : 'rgba(255, 255, 255, 0.5)'}
          fill={isActive ? '#FFFFFF' : 'none'}
          strokeWidth={isActive ? 0 : 2}
        />
      )
    },
    {
      id: 'profile',
      label: 'Profile',
      animationClass: 'nav-anim-profile',
      icon: (isActive) => <User size={22} color={isActive ? '#FFFFFF' : 'rgba(255, 255, 255, 0.5)'} strokeWidth={isActive ? 2.5 : 2} />
    }
  ];

  const activeIndex = tabs.findIndex((t) => t.id === activeTab);
  const safeActiveIndex = activeIndex >= 0 ? activeIndex : 0;

  return (
    <>
      {/* Modern Creative Micro-Animations */}
      <style>{`
        @keyframes navPopHome {
          0% { transform: scale(1) rotate(0deg); }
          40% { transform: scale(1.32) rotate(-8deg); }
          75% { transform: scale(0.92) rotate(4deg); }
          100% { transform: scale(1) rotate(0deg); }
        }

        @keyframes navBounceChat {
          0% { transform: translateY(0) scale(1); }
          30% { transform: translateY(-10px) scale(1.22); }
          60% { transform: translateY(3px) scale(0.95); }
          85% { transform: translateY(-2px) scale(1.04); }
          100% { transform: translateY(0) scale(1); }
        }

        @keyframes navTiltGames {
          0% { transform: rotate(0deg) scale(1); }
          25% { transform: rotate(-22deg) scale(1.28); }
          60% { transform: rotate(16deg) scale(0.94); }
          85% { transform: rotate(-6deg) scale(1.05); }
          100% { transform: rotate(0deg) scale(1); }
        }

        @keyframes navPulseLikes {
          0% { transform: scale(1); }
          25% { transform: scale(1.38); }
          50% { transform: scale(0.9); }
          75% { transform: scale(1.18); }
          100% { transform: scale(1); }
        }

        @keyframes navFlipProfile {
          0% { transform: rotateY(0deg) scale(0.85); opacity: 0.6; }
          50% { transform: rotateY(180deg) scale(1.24); opacity: 0.9; }
          100% { transform: rotateY(360deg) scale(1); opacity: 1; }
        }

        @keyframes activePulseHalo {
          0%, 100% { box-shadow: 0 6px 20px rgba(225, 29, 72, 0.48), 0 0 0 0 rgba(225, 29, 72, 0.3); }
          50% { box-shadow: 0 10px 28px rgba(225, 29, 72, 0.65), 0 0 0 6px rgba(225, 29, 72, 0); }
        }

        .nav-anim-home { animation: navPopHome 380ms cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
        .nav-anim-chat { animation: navBounceChat 400ms cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
        .nav-anim-games { animation: navTiltGames 420ms cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
        .nav-anim-likes { animation: navPulseLikes 380ms cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
        .nav-anim-profile { animation: navFlipProfile 450ms cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }

        .nav-btn-touch {
          transition: transform 180ms ease, opacity 180ms ease;
        }
        .nav-btn-touch:active {
          transform: scale(0.84) !important;
        }
      `}</style>

      <nav
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-around',
          padding: '0 8px calc(4px + env(safe-area-inset-bottom, 0px)) 8px',
          height: 'calc(66px + env(safe-area-inset-bottom, 0px))',
          background: 'rgba(8, 8, 10, 0.96)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          position: 'relative',
          zIndex: 9999,
          width: '100%',
          boxSizing: 'border-box',
          boxShadow: '0 -8px 30px rgba(0, 0, 0, 0.6)'
        }}
      >
        {/* Sliding Fluid Active Cherry Indicator */}
        <div
          style={{
            position: 'absolute',
            top: '8px',
            left: `calc(${(safeActiveIndex / tabs.length) * 100}% + ${100 / (tabs.length * 2)}% - 25px)`,
            width: '50px',
            height: '50px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #8E1538 0%, #C52E59 55%, #E8557C 100%)',
            border: '2px solid rgba(255, 255, 255, 0.25)',
            transform: 'translateY(-9px)',
            transition: 'left 320ms cubic-bezier(0.34, 1.56, 0.64, 1), transform 320ms cubic-bezier(0.34, 1.56, 0.64, 1)',
            pointerEvents: 'none',
            zIndex: 1,
            animation: 'activePulseHalo 3s ease-in-out infinite'
          }}
        />

        {tabs.map((tab, idx) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => navigateToTab(tab.id)}
              className="nav-btn-touch"
              style={{
                flex: 1,
                minWidth: 0,
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
                  width: '50px',
                  height: '50px',
                  transform: isActive ? 'translateY(-9px)' : 'translateY(0)',
                  transition: 'transform 320ms cubic-bezier(0.34, 1.56, 0.64, 1)'
                }}
              >
                <div
                  className={isActive ? tab.animationClass : ''}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    perspective: '800px'
                  }}
                >
                  {tab.icon(isActive)}
                </div>

                {/* Creative Pulse Notification Badge */}
                {tab.badge !== undefined && tab.badge > 0 && (
                  <span
                    style={{
                      position: 'absolute',
                      top: isActive ? '-2px' : '3px',
                      right: isActive ? '-2px' : '2px',
                      background: '#E11D48',
                      color: '#FFFFFF',
                      fontSize: '0.62rem',
                      fontWeight: 900,
                      minWidth: '17px',
                      height: '17px',
                      borderRadius: '9999px',
                      padding: '0 4px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '2px solid #080808',
                      boxShadow: '0 2px 8px rgba(225, 29, 72, 0.5)',
                      transition: 'all 200ms ease'
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


