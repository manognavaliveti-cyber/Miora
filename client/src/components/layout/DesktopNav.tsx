import React from 'react';
import { useApp } from '../../context/AppContext';
import { Home, Heart, MessageCircle, User, Gamepad2, Bell, Search, Settings } from 'lucide-react';
import { MainTab } from '../../types';
import { MioraLogo } from '../common/MioraLogo';

const IconBtn: React.FC<{ onClick: () => void; title?: string; 'aria-label'?: string; children: React.ReactNode }> = ({
  onClick,
  title,
  'aria-label': ariaLabel,
  children
}) => (
  <button
    onClick={onClick}
    title={title}
    aria-label={ariaLabel || title}
    style={{
      width: '34px',
      height: '34px',
      borderRadius: '50%',
      background: '#FFFFFF',
      border: '1.5px solid rgba(210, 170, 185, 0.38)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#6B4A57',
      cursor: 'pointer',
      flexShrink: 0,
      boxShadow: '0 2px 6px rgba(0, 0, 0, 0.03)',
      transition: 'all 0.18s cubic-bezier(0.4, 0, 0.2, 1)'
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.borderColor = '#BE123C';
      e.currentTarget.style.color = '#BE123C';
      e.currentTarget.style.background = 'rgba(190, 18, 60, 0.06)';
      e.currentTarget.style.transform = 'translateY(-1px)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.borderColor = 'rgba(210, 170, 185, 0.38)';
      e.currentTarget.style.color = '#6B4A57';
      e.currentTarget.style.background = '#FFFFFF';
      e.currentTarget.style.transform = 'translateY(0)';
    }}
  >
    {children}
  </button>
);

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
    openUpgradeModal
  } = useApp();

  const unreadMessages = matches.reduce((acc, m) => acc + (m.unreadCount || 0), 0);

  const tabs: { id: MainTab; label: string; icon: React.ReactElement; badge?: number }[] = [
    { id: 'home', label: 'Home', icon: <Home size={15} /> },
    { id: 'chat', label: 'Chat', icon: <MessageCircle size={15} />, badge: unreadMessages || undefined },
    { id: 'games', label: 'Games', icon: <Gamepad2 size={15} /> },
    { id: 'likes', label: 'Likes', icon: <Heart size={15} /> },
    { id: 'profile', label: 'Profile', icon: <User size={15} /> },
  ];

  const userPhoto =
    currentUser.photos?.[0] ||
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80';

  // Show only first name to keep it compact
  const firstName = (currentUser.name || 'You').split(' ')[0];

  return (
    <>
      <style>{`
        @media (max-width: 1240px) {
          .miora-header-brand .miora-logo-tagline {
            display: none !important;
          }
        }
        @media (max-width: 1040px) {
          .miora-nav-pill-btn {
            padding: 5px 10px !important;
            font-size: 0.80rem !important;
            gap: 5px !important;
          }
        }
        @media (max-width: 920px) {
          .miora-header-user-name {
            display: none !important;
          }
          .miora-nav-pill-btn {
            padding: 5px 8px !important;
          }
        }
      `}</style>

      <header
        className="desktop-only miora-desktop-header"
        style={{
          width: '100%',
          position: 'sticky',
          top: 0,
          zIndex: 40,
          background: 'rgba(255, 250, 252, 0.96)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderBottom: '1px solid rgba(240, 200, 215, 0.65)',
          boxShadow: '0 2px 14px rgba(125, 23, 48, 0.05)'
        }}
      >
        <div
          style={{
            width: '100%',
            maxWidth: '1440px',
            margin: '0 auto',
            height: '62px',
            padding: '0 clamp(12px, 2vw, 24px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
            boxSizing: 'border-box'
          }}
        >
          {/* ── Brand ── */}
          <div
            onClick={() => navigateToTab('home')}
            className="miora-header-brand"
            style={{
              display: 'flex',
              alignItems: 'center',
              cursor: 'pointer',
              flexShrink: 0,
              userSelect: 'none',
              transition: 'transform 0.15s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.02)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
            }}
            title="MIORA Home"
          >
            <MioraLogo size={34} showTagline={true} showWordmark={true} vertical={false} />
          </div>

          {/* ── Center nav tabs — always fully visible, never clipped ── */}
          <nav
            className="miora-header-nav"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}
          >
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '3px',
                background: '#FFFFFF',
                padding: '3px 4px',
                borderRadius: '9999px',
                border: '1.5px solid rgba(235, 195, 210, 0.6)',
                boxShadow: '0 2px 8px rgba(125, 23, 48, 0.04)',
                boxSizing: 'border-box'
              }}
            >
              {tabs.map((tab) => {
                const active = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => navigateToTab(tab.id)}
                    title={tab.label}
                    className={`miora-nav-pill-btn ${active ? 'active' : ''}`}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '6px 13px',
                      borderRadius: '9999px',
                      border: 'none',
                      background: active
                        ? 'linear-gradient(135deg, #7D1730 0%, #BE123C 100%)'
                        : 'transparent',
                      color: active ? '#FFFFFF' : '#6B4A57',
                      cursor: 'pointer',
                      fontWeight: active ? 700 : 600,
                      fontSize: '0.83rem',
                      fontFamily: 'inherit',
                      transition: 'all 0.18s cubic-bezier(0.4, 0, 0.2, 1)',
                      boxShadow: active ? '0 3px 12px rgba(125, 23, 48, 0.32)' : 'none',
                      height: '34px',
                      whiteSpace: 'nowrap',
                      flexShrink: 0,
                      letterSpacing: '0.01em'
                    }}
                    onMouseEnter={(e) => {
                      if (!active) {
                        e.currentTarget.style.color = '#BE123C';
                        e.currentTarget.style.background = 'rgba(190, 18, 60, 0.07)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!active) {
                        e.currentTarget.style.color = '#6B4A57';
                        e.currentTarget.style.background = 'transparent';
                      }
                    }}
                  >
                    {React.cloneElement(tab.icon, {
                      size: 15,
                      color: active ? '#FFFFFF' : 'currentColor',
                      fill: active && (tab.id === 'likes' || tab.id === 'home') ? '#FFFFFF' : 'none',
                      strokeWidth: 2.2
                    })}
                    <span>{tab.label}</span>
                    {tab.badge && tab.badge > 0 && (
                      <span
                        style={{
                          background: active ? 'rgba(255, 255, 255, 0.3)' : '#BE123C',
                          color: '#FFFFFF',
                          fontSize: '0.62rem',
                          fontWeight: 800,
                          padding: '1px 5px',
                          borderRadius: '9999px',
                          lineHeight: 1.4,
                          marginLeft: '1px'
                        }}
                      >
                        {tab.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </nav>

          {/* ── Right actions ── */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              flexShrink: 0
            }}
          >
            {/* Search */}
            <IconBtn onClick={openSearchModal} title="Search profiles & matches">
              <Search size={15} />
            </IconBtn>

            {/* Wallet pill */}
            <button
              onClick={openUpgradeModal}
              title="MIORA Wallet & Plans"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                height: '34px',
                padding: '0 12px',
                borderRadius: '9999px',
                border: '1.5px solid rgba(190, 18, 60, 0.22)',
                background: '#FFFFFF',
                color: '#7D1730',
                fontWeight: 800,
                fontSize: '0.82rem',
                cursor: 'pointer',
                flexShrink: 0,
                boxShadow: '0 2px 6px rgba(0, 0, 0, 0.04)',
                transition: 'all 0.15s ease',
                whiteSpace: 'nowrap'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(190, 18, 60, 0.06)';
                e.currentTarget.style.borderColor = '#BE123C';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#FFFFFF';
                e.currentTarget.style.borderColor = 'rgba(190, 18, 60, 0.22)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <span style={{ fontSize: '0.86rem', color: '#BE123C', fontWeight: 900 }}>₹</span>
              <span>{(currentUser.walletBalance || 0).toLocaleString('en-IN')}</span>
            </button>

            {/* Notifications bell */}
            <div style={{ position: 'relative' }}>
              <IconBtn onClick={openNotifDrawer} title="Notifications">
                <Bell size={15} />
              </IconBtn>
              {unreadNotifsCount > 0 && (
                <span
                  style={{
                    position: 'absolute',
                    top: '2px',
                    right: '2px',
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: '#BE123C',
                    border: '1.5px solid #FFF5F7',
                    pointerEvents: 'none'
                  }}
                />
              )}
            </div>

            {/* Settings */}
            <IconBtn onClick={() => setCurrentView('settings')} title="Settings">
              <Settings size={15} />
            </IconBtn>

            {/* Avatar + name pill */}
            <div
              onClick={() => navigateToTab('profile')}
              title={`View ${currentUser.name || 'Your'} Profile`}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '7px',
                height: '34px',
                padding: '0 12px 0 4px',
                borderRadius: '9999px',
                border: '1.5px solid rgba(210, 170, 185, 0.45)',
                background: '#FFFFFF',
                cursor: 'pointer',
                flexShrink: 0,
                boxShadow: '0 2px 6px rgba(0, 0, 0, 0.04)',
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.borderColor = '#BE123C';
                (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(210, 170, 185, 0.45)';
                (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
              }}
            >
              <img
                src={userPhoto}
                alt={currentUser.name}
                style={{
                  width: '26px',
                  height: '26px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '1.5px solid rgba(190, 18, 60, 0.25)'
                }}
              />
              <span
                className="miora-header-user-name"
                style={{ fontSize: '0.80rem', fontWeight: 700, color: '#3D1A26', whiteSpace: 'nowrap' }}
              >
                {firstName}
              </span>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};
