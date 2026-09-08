import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  Bell,
  Heart,
  MessageCircle,
  Gift,
  Award,
  Phone,
  Radio,
  Coins,
  CheckCircle2,
  Trash2
} from 'lucide-react';
import { NotificationType } from '../../types';

export const NotificationsDrawer: React.FC = () => {
  const {
    isNotifDrawerOpen,
    closeNotifDrawer,
    notifications,
    markNotifAsRead,
    clearAllNotifs,
    navigateToTab
  } = useApp();

  if (!isNotifDrawerOpen) return null;

  const getIconForType = (type: NotificationType) => {
    switch (type) {
      case 'match':
        return <Heart size={16} color="var(--berry-primary)" fill="var(--berry-primary)" />;
      case 'message':
        return <MessageCircle size={16} color="#3B82F6" />;
      case 'gift_received':
        return <Gift size={16} color="#F59E0B" />;
      case 'game_reward':
      case 'game_invite':
        return <Award size={16} color="#10B981" />;
      case 'call_incoming':
      case 'call_missed':
        return <Phone size={16} color="#EF4444" />;
      case 'room_invite':
        return <Radio size={16} color="#9333EA" />;
      case 'recharge_success':
      case 'coin_reward':
        return <Coins size={16} color="var(--gold-deep)" />;
      default:
        return <Bell size={16} color="var(--berry-primary)" />;
    }
  };

  const handleItemClick = (notif: any) => {
    markNotifAsRead(notif.id);
    if (notif.linkTab) {
      navigateToTab(notif.linkTab);
      closeNotifDrawer();
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        display: 'flex',
        justifyContent: 'flex-end',
        background: 'rgba(31, 22, 26, 0.65)',
        backdropFilter: 'blur(12px)',
        animation: 'fadeIn 0.2s ease-out'
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '420px',
          height: '100%',
          background: 'linear-gradient(180deg, #FFFFFF 0%, #FFF5F7 100%)',
          boxShadow: '-12px 0 40px rgba(0,0,0,0.3)',
          borderLeft: '1.5px solid var(--border-gold)',
          display: 'flex',
          flexDirection: 'column',
          padding: '24px 20px',
          overflow: 'hidden',
          animation: 'slideInRight 0.25s ease-out'
        }}
      >
        {/* Top Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '16px', borderBottom: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Bell size={20} color="var(--berry-primary)" />
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              Notifications
            </h3>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {notifications.length > 0 && (
              <button
                onClick={clearAllNotifs}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-muted)',
                  fontSize: '0.78rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
                title="Clear all"
              >
                <Trash2 size={14} />
                <span>Clear</span>
              </button>
            )}

            <button
              onClick={closeNotifDrawer}
              style={{
                width: '34px',
                height: '34px',
                borderRadius: '50%',
                background: 'rgba(238, 56, 101, 0.08)',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: 'var(--text-secondary)'
              }}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 0', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {notifications.length > 0 ? (
            notifications.map((notif) => (
              <div
                key={notif.id}
                onClick={() => handleItemClick(notif)}
                style={{
                  background: notif.read ? 'var(--surface-white)' : 'linear-gradient(135deg, rgba(238, 56, 101, 0.08) 0%, rgba(251, 113, 133, 0.04) 100%)',
                  border: notif.read ? '1px solid var(--border-subtle)' : '1.5px solid var(--berry-primary)',
                  borderRadius: '18px',
                  padding: '14px',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '12px',
                  cursor: 'pointer',
                  transition: 'all var(--transition-fast)'
                }}
              >
                <div
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '12px',
                    background: 'var(--bg-soft-blush)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    marginTop: '2px'
                  }}
                >
                  {getIconForType(notif.type)}
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '0.88rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                      {notif.title}
                    </span>
                    {!notif.read && (
                      <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: 'var(--berry-primary)' }} />
                    )}
                  </div>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '2px', lineHeight: 1.4 }}>
                    {notif.message}
                  </p>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>
                    {notif.timestamp}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
              <Bell size={36} color="var(--border-gold)" style={{ margin: '0 auto 12px auto' }} />
              <p style={{ fontSize: '0.92rem', fontWeight: 700 }}>No new notifications</p>
              <p style={{ fontSize: '0.8rem', marginTop: '4px' }}>You're all caught up with your romance sparks!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
