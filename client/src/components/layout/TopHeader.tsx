import React from 'react';
import { useApp } from '../../context/AppContext';
import { ChevronLeft, SlidersHorizontal, Bell, Coins, Settings, Search, Plus } from 'lucide-react';
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
    openNotifDrawer,
    unreadNotifsCount,
    openSearchModal,
    openCreateSheet
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
      navigateToTab('discover');
    }
  };

  return (
    <header
      style={{
        padding: '10px 14px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--border-light)',
        position: 'sticky',
        top: 0,
        zIndex: 30,
        gap: '8px'
      }}
    >
      {/* Left side: Back button OR Mobile Coin Balance Pill */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: '70px' }}>
        {showBack ? (
          <button
            onClick={handleBack}
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              background: 'var(--surface-card)',
              border: '1px solid var(--border-light)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-primary)',
              cursor: 'pointer',
              boxShadow: 'var(--shadow-sm)',
              transition: 'transform var(--transition-fast)'
            }}
            aria-label="Back"
          >
            <ChevronLeft size={19} />
          </button>
        ) : (
          <button
            onClick={() => navigateToTab('wallet')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              background: 'var(--gold-gradient-subtle)',
              border: '1.5px solid var(--border-gold)',
              padding: '5px 10px',
              borderRadius: 'var(--radius-pill)',
              cursor: 'pointer',
              boxShadow: 'var(--shadow-xs)',
              color: 'var(--gold-deep)',
              fontWeight: 800,
              fontSize: '0.78rem'
            }}
            title="Open MIORA Wallet"
          >
            <Coins size={14} color="var(--gold-deep)" />
            <span>{currentUser.coinBalance}</span>
          </button>
        )}
      </div>

      {/* Center: Title or Logo */}
      <div style={{ textAlign: 'center', flex: 1, minWidth: 0, overflow: 'hidden' }}>
        {title ? (
          <h1
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '1.15rem',
              fontWeight: 800,
              color: 'var(--text-primary)',
              letterSpacing: '-0.02em',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}
          >
            {title}
          </h1>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <MioraLogo size={26} showTagline={false} showWordmark={true} vertical={false} />
          </div>
        )}
      </div>

      {/* Right side: Notifications Bell + Filter or Settings */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', minWidth: '70px', justifyContent: 'flex-end' }}>
        {/* Global Search Button */}
        <button
          onClick={openSearchModal}
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            background: 'var(--surface-white)',
            border: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-secondary)',
            cursor: 'pointer',
            boxShadow: 'var(--shadow-xs)'
          }}
          title="Search people & posts"
          aria-label="Search"
        >
          <Search size={16} />
        </button>

        {/* Create Post/Story Button (Quick access) */}
        <button
          onClick={openCreateSheet}
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            background: 'var(--primary-gradient)',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFFFFF',
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(238, 56, 101, 0.3)'
          }}
          title="Create post, story or status"
          aria-label="Create"
        >
          <Plus size={18} strokeWidth={2.5} />
        </button>

        {/* Notifications */}
        <button
          onClick={openNotifDrawer}
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            background: 'var(--surface-white)',
            border: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-secondary)',
            cursor: 'pointer',
            boxShadow: 'var(--shadow-xs)',
            position: 'relative'
          }}
          title="Notifications"
          aria-label="Notifications"
        >
          <Bell size={16} />
          {unreadNotifsCount > 0 && (
            <span
              style={{
                position: 'absolute',
                top: '6px',
                right: '6px',
                width: '7px',
                height: '7px',
                borderRadius: '50%',
                background: 'var(--berry-primary)',
                boxShadow: '0 0 4px var(--berry-primary)'
              }}
            />
          )}
        </button>

        {/* Filters action (for Discover) */}
        {rightAction === 'filters' && (
          <button
            onClick={() => setCurrentView('dating-preferences')}
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              background: 'var(--surface-white)',
              border: '1px solid var(--border-gold)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--berry-primary)',
              cursor: 'pointer',
              boxShadow: 'var(--shadow-xs)'
            }}
            title="Dating Preferences"
            aria-label="Dating Preferences"
          >
            <SlidersHorizontal size={15} />
          </button>
        )}

        {/* Settings action if on Profile */}
        {currentView === 'my-profile' && (
          <button
            onClick={() => setCurrentView('settings')}
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              background: 'var(--surface-white)',
              border: '1px solid var(--border-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              boxShadow: 'var(--shadow-xs)'
            }}
            title="Settings & Privacy"
            aria-label="Settings"
          >
            <Settings size={15} />
          </button>
        )}
      </div>
    </header>
  );
};
