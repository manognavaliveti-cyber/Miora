import React from 'react';
import { useApp } from '../../context/AppContext';
import { ChevronLeft, SlidersHorizontal, Settings, Search } from 'lucide-react';
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

  return (
    <header
      style={{
        padding: '10px 14px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: 'linear-gradient(135deg, #7D1730 0%, #A91E45 100%)',
        boxShadow: '0 4px 18px rgba(125, 23, 48, 0.25)',
        position: 'sticky',
        top: 0,
        zIndex: 30,
        gap: '8px',
        boxSizing: 'border-box'
      }}
    >
      {/* Left side: MIORA Chats title on Chat List, MIORA Logo elsewhere, or Back Button on subpages */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0, minWidth: 0 }}>
        {currentView === 'chat-list' && !showBack ? (
          <div style={{ display: 'flex', alignItems: 'center', minWidth: 0 }}>
            <h1
              style={{
                fontSize: '1.22rem',
                fontWeight: 900,
                color: '#FFFFFF',
                margin: 0,
                whiteSpace: 'nowrap',
                letterSpacing: '-0.02em'
              }}
            >
              MIORA Chats
            </h1>
          </div>
        ) : showBack ? (
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

      {/* Center: Title if subpage. Chat list title is rendered on the left to avoid duplicate headings. */}
      {!isHome && title && currentView !== 'chat-list' && (
        <div style={{ textAlign: 'center', flex: 1, minWidth: 0, overflow: 'hidden' }}>
          <h1
            style={{
              fontSize: '1.1rem',
              fontWeight: 800,
              color: '#FFFFFF',
              margin: 0,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}
          >
            {title}
          </h1>
        </div>
      )}

      {/* Right side: Wallet Pill (on EVERY Page) + Search + Preferences/Settings */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', justifyContent: 'flex-end', flexShrink: 0, marginLeft: 'auto' }}>
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
          <span>₹{walletBal.toFixed(0)}</span>
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
