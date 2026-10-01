import React from 'react';
import { useApp } from '../../context/AppContext';
import { ChevronLeft, SlidersHorizontal, Settings, Search, Heart } from 'lucide-react';
import { MioraLogo } from '../common/MioraLogo';

interface TopHeaderProps {
  title?: string;
  showBack?: boolean;
  onBack?: () => void;
  rightAction?: 'filters' | 'settings' | 'none';
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  title,
  showBack = false,
  onBack,
  rightAction = 'none'
}) => {
  const {
    currentView,
    setCurrentView,
    navigateToTab,
    currentUser,
    openSearchModal,
    openFilterModal,
    openUpgradeModal
  } = useApp();

  const handleBack = () => {
    if (onBack) {
      onBack();
      return;
    }
    if (currentView === 'chat') {
      setCurrentView('chat-list');
    } else if (currentView === 'edit-profile' || currentView === 'settings' || currentView === 'blocked-users') {
      setCurrentView('my-profile');
    } else if (currentView === 'dating-preferences') {
      setCurrentView('my-profile');
    } else {
      navigateToTab('home');
    }
  };

  const isHome = currentView === 'discover' || currentView === 'home';
  const walletBal = currentUser.walletBalance || 0;

  // Compute page heading title according to MIORA global header guidelines
  const getDisplayHeading = () => {
    if (title) return title;
    switch (currentView) {
      case 'home':
      case 'discover':
        return 'HOME';
      case 'chat-list':
      case 'chat':
        return 'CHATS';
      case 'likes':
        return 'LIKES';
      case 'matches':
        return 'MATCHES';
      case 'my-profile':
        return 'PROFILE';
      case 'games':
      case 'play':
        return 'GAMES';
      case 'notifications':
        return 'NOTIFICATIONS';
      case 'feed':
        return 'FEED';
      case 'rooms':
        return 'ROOMS';
      case 'wallet':
        return 'WALLET';
      case 'edit-profile':
        return 'EDIT PROFILE';
      case 'settings':
        return 'SETTINGS';
      case 'blocked-users':
        return 'BLOCKED PROFILES';
      default:
        return 'MIORA';
    }
  };

  const displayHeading = getDisplayHeading();

  return (
    <header
      style={{
        height: '56px',
        padding: '0 14px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: 'linear-gradient(135deg, #7D1730 0%, #A91E45 100%)',
        boxShadow: '0 4px 18px rgba(125, 23, 48, 0.25)',
        position: 'sticky',
        top: 0,
        zIndex: 30,
        boxSizing: 'border-box',
        width: '100%'
      }}
    >
      {/* Left side: Back Button on subpages, or MIORA Logo on main pages */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', zIndex: 2, position: 'relative', flexShrink: 0 }}>
        {showBack ? (
          <button
            onClick={handleBack}
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.2)',
              border: '1px solid rgba(255, 255, 255, 0.35)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              cursor: 'pointer',
              backdropFilter: 'blur(8px)',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}
            aria-label="Back"
          >
            <ChevronLeft size={19} color="#FFFFFF" />
          </button>
        ) : (
          <div
            onClick={() => navigateToTab('home')}
            style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <MioraLogo size={24} showTagline={false} showWordmark={true} vertical={false} colorScheme="light" />
          </div>
        )}
      </div>

      {/* Center: Horizontally and vertically centered page heading (relative to the entire header/viewport width) */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 1,
          pointerEvents: 'none',
          textAlign: 'center',
          maxWidth: 'calc(100% - 170px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <h1
          style={{
            fontSize: '1.12rem',
            fontWeight: 900,
            color: '#FFFFFF',
            margin: 0,
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            pointerEvents: 'auto',
            lineHeight: 1.2
          }}
        >
          {displayHeading}
        </h1>
      </div>

      {/* Right side: Wallet Pill + Search + Preferences/Settings */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          justifyContent: 'flex-end',
          marginLeft: 'auto',
          zIndex: 2,
          position: 'relative',
          flexShrink: 0
        }}
      >
        {/* Global Wallet Pill (Mandatory on EVERY Single Page) */}
        <button
          onClick={openUpgradeModal}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            background: 'rgba(255, 255, 255, 0.2)',
            border: '1px solid rgba(255, 255, 255, 0.35)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            padding: '5px 11px',
            borderRadius: '9999px',
            color: '#FFFFFF',
            fontSize: '0.82rem',
            fontWeight: 800,
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
          }}
          title="MIORA Wallet & Plans"
        >
          <span>₹ {walletBal.toFixed(0)}</span>
        </button>

        {/* Global Search Button */}
        <button
          onClick={openSearchModal}
          style={{
            width: '34px',
            height: '34px',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.2)',
            border: '1px solid rgba(255, 255, 255, 0.35)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFFFFF',
            cursor: 'pointer',
            boxShadow: '0 2px 6px rgba(0,0,0,0.08)'
          }}
          title="Search"
          aria-label="Search"
        >
          <Search size={15} color="#FFFFFF" />
        </button>

        {/* Preferences / Filter Button on Home */}
        {(isHome || rightAction === 'filters') && (
          <button
            onClick={openFilterModal}
            style={{
              width: '34px',
              height: '34px',
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.2)',
              border: '1px solid rgba(255, 255, 255, 0.35)',
              backdropFilter: 'blur(8px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              cursor: 'pointer',
              boxShadow: '0 2px 6px rgba(0,0,0,0.08)'
            }}
            title="Dating Preferences & Filters"
            aria-label="Preferences"
          >
            <SlidersHorizontal size={15} color="#FFFFFF" />
          </button>
        )}

        {/* Settings Button on Profile */}
        {currentView === 'my-profile' && (
          <button
            onClick={() => setCurrentView('settings')}
            style={{
              width: '34px',
              height: '34px',
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.2)',
              border: '1px solid rgba(255, 255, 255, 0.35)',
              backdropFilter: 'blur(8px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              cursor: 'pointer',
              boxShadow: '0 2px 6px rgba(0,0,0,0.08)'
            }}
            title="Settings"
            aria-label="Settings"
          >
            <Settings size={15} color="#FFFFFF" />
          </button>
        )}
      </div>
    </header>
  );
};
