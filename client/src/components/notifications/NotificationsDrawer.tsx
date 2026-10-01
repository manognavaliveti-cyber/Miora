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
    navigateToTab,
    canSeeLikerNames,
    viewLikeNotification,
    currentUser
  } = useApp();

  const isSubscriber =
    currentUser.subscriptionTier === 'pro' || currentUser.subscriptionTier === 'vip' || !!currentUser.isPremium;

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

  // "Someone liked your profile": the real name is only shown when the wallet has money (or PRO/VIP).
  const getLikeDisplay = (notif: any) => {
    const name: string = notif.metadata?.likerName || 'Someone';
    const photo: string | undefined = notif.metadata?.likerPhoto || notif.avatarUrl;
    return {
      title: canSeeLikerNames ? `${name} liked your profile 💗` : 'Someone liked your profile 💗',
      message: canSeeLikerNames
        ? 'Tap to view their profile and match instantly.'
        : 'Recharge your wallet to see who liked you.',
      photo,
      blurred: !canSeeLikerNames
    };
  };

  const handleItemClick = (notif: any) => {
    if (notif.type === 'profile_like') {
      viewLikeNotification(notif);
      return;
    }
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
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        background: 'rgba(20, 12, 16, 0.45)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        animation: 'fadeIn 0.2s ease-out'
      }}
      onClick={closeNotifDrawer}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '460px',
          maxHeight: '85vh',
          background: 'rgba(255, 255, 255, 0.82)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.7)',
          borderRadius: '24px',
          boxShadow: '0 20px 50px rgba(136, 19, 55, 0.15), 0 4px 12px rgba(0, 0, 0, 0.05)',
          display: 'flex',
          flexDirection: 'column',
          padding: '24px 20px',
          overflow: 'hidden',
          animation: 'scaleUp 0.25s ease-out',
          boxSizing: 'border-box'
        }}
      >
        {/* Centered Top Header */}
        <div
          style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            paddingBottom: '16px',
            borderBottom: '1px solid rgba(136, 19, 55, 0.1)'
          }}
        >
          {notifications.length > 0 && (
            <button
              onClick={clearAllNotifs}
              style={{
                position: 'absolute',
                left: 0,
                background: 'transparent',
                border: 'none',
                color: '#6E6266',
                fontSize: '0.78rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontWeight: 600
              }}
              title="Clear all"
            >
              <Trash2 size={14} />
              <span>Clear</span>
            </button>
          )}

          {/* Centered Title */}
          <h3
            style={{
              fontFamily: "'Cormorant Garamond', 'Playfair Display', Georgia, serif",
              fontSize: '1.5rem',
              fontWeight: 800,
              color: '#1F171A',
              margin: 0,
              textAlign: 'center'
            }}
          >
            Notifications
          </h3>

          <button
            onClick={closeNotifDrawer}
            style={{
              position: 'absolute',
              right: 0,
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: 'rgba(136, 19, 55, 0.06)',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#1F171A'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Notifications List */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 0 4px 0', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {notifications.length > 0 ? (
            notifications.map((notif) => {
              const like = notif.type === 'profile_like' ? getLikeDisplay(notif) : null;
              return (
                <div
                  key={notif.id}
                  onClick={() => handleItemClick(notif)}
                  style={{
                    background: notif.read ? 'rgba(255, 255, 255, 0.9)' : 'linear-gradient(135deg, rgba(253, 242, 248, 0.95) 0%, rgba(252, 231, 243, 0.8) 100%)',
                    border: notif.read ? '1px solid rgba(243, 235, 230, 0.8)' : '1px solid rgba(244, 114, 182, 0.5)',
                    borderRadius: '18px',
                    padding: '14px',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '12px',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.02)'
                  }}
                >
                  <div
                    style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: '12px',
                      background: '#FFF0F3',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      marginTop: '2px'
                    }}
                  >
                    {like ? (
                      <div style={{ position: 'relative', width: '38px', height: '38px' }}>
                        <div style={{ width: '38px', height: '38px', borderRadius: '50%', overflow: 'hidden', background: 'linear-gradient(135deg, #FFB6D2, #C9A6FF)' }}>
                          {like.photo && (
                            <img
                              src={like.photo}
                              alt=""
                              style={{ width: '100%', height: '100%', objectFit: 'cover', filter: like.blurred ? 'blur(6px) brightness(0.9)' : 'none', transform: like.blurred ? 'scale(1.25)' : 'none' }}
                            />
                          )}
                        </div>
                        <span
                          style={{
                            position: 'absolute', right: '-4px', bottom: '-4px', width: '18px', height: '18px', borderRadius: '50%',
                            background: 'linear-gradient(135deg, #E8557C, #C52E59)', border: '2px solid #FFFFFF',
                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                          }}
                        >
                          <Heart size={9} color="#FFFFFF" fill="#FFFFFF" />
                        </span>
                      </div>
                    ) : (
                      getIconForType(notif.type)
                    )}
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '0.88rem', fontWeight: 800, color: '#1F171A' }}>
                        {like ? like.title : notif.title}
                      </span>
                      {!notif.read && (
                        <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#BE123C' }} />
                      )}
                    </div>
                    <p style={{ fontSize: '0.82rem', color: '#6E6266', marginTop: '2px', lineHeight: 1.4 }}>
                      {like ? like.message : notif.message}
                    </p>
                    <span style={{ fontSize: '0.7rem', color: '#9CA3AF', marginTop: '4px', display: 'block' }}>
                      {notif.timestamp}
                    </span>
                  </div>
                </div>
              );
            })
          ) : (
            <div style={{ textAlign: 'center', padding: '50px 20px', color: '#6E6266' }}>
              <Bell size={36} color="#F472B6" style={{ margin: '0 auto 12px auto' }} />
              <p style={{ fontSize: '0.95rem', fontWeight: 700, color: '#1F171A' }}>No new notifications</p>
              <p style={{ fontSize: '0.82rem', marginTop: '4px' }}>You're all caught up with your romance sparks!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
