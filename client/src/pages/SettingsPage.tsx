import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  User,
  Lock,
  Bell,
  SlidersHorizontal,
  ShieldAlert,
  HelpCircle,
  LogOut,
  Trash2,
  ChevronRight,
  Shield,
  Heart,
  ChevronLeft,
  Sparkles,
  FileText
} from 'lucide-react';
import { MioraLogo } from '../components/common/MioraLogo';

export const SettingsPage: React.FC = () => {
  const { currentUser, logout, setCurrentView, showToast } = useApp();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const sections = [
    {
      title: 'ACCOUNT',
      items: [
        {
          icon: <User size={20} color="#8B1E3F" />,
          bg: 'linear-gradient(135deg, #FFE4E9 0%, #FCE4E8 100%)',
          borderColor: 'rgba(244, 63, 94, 0.25)',
          label: 'Edit Profile',
          desc: 'Photos, bio, passions and details',
          action: () => setCurrentView('edit-profile')
        },
        {
          icon: <SlidersHorizontal size={20} color="#8B1E3F" />,
          bg: 'linear-gradient(135deg, #FFE4E9 0%, #FCE4E8 100%)',
          borderColor: 'rgba(244, 63, 94, 0.25)',
          label: 'Dating Preferences',
          desc: 'Age, distance, gender interested in',
          action: () => setCurrentView('dating-preferences')
        },
        {
          icon: <Sparkles size={20} color="#9A7B2C" />,
          bg: 'linear-gradient(135deg, #FFF5D6 0%, #FDF3D6 100%)',
          borderColor: 'rgba(212, 175, 55, 0.3)',
          label: 'Account Information',
          desc: `${currentUser.email} • ${currentUser.subscriptionTier?.toUpperCase() || 'FREE'}`,
          action: () => showToast(`Signed in as ${currentUser.email} ✨`)
        }
      ]
    },
    {
      title: 'PRIVACY & SAFETY',
      items: [
        {
          icon: <Lock size={20} color="#9A7B2C" />,
          bg: 'linear-gradient(135deg, #FFF5D6 0%, #FDF3D6 100%)',
          borderColor: 'rgba(212, 175, 55, 0.3)',
          label: 'Privacy & Permissions',
          desc: 'Profile visibility & incognito mode',
          action: () => showToast('Incognito mode active ✨')
        },
        {
          icon: <ShieldAlert size={20} color="#E11D48" />,
          bg: 'linear-gradient(135deg, #FFE4E6 0%, #FEE2E2 100%)',
          borderColor: 'rgba(225, 29, 72, 0.25)',
          label: 'Blocked Profiles',
          desc: 'Manage blocked profiles',
          action: () => setCurrentView('blocked-users')
        },
        {
          icon: <HelpCircle size={20} color="#8B1E3F" />,
          bg: 'linear-gradient(135deg, #FDE8EC 0%, #FCE4E8 100%)',
          borderColor: 'rgba(244, 63, 94, 0.25)',
          label: 'Help & Safety Center',
          desc: 'Tips for safe dating & 24/7 assistance',
          action: () => showToast('Connecting to 24/7 MIORA Safety Desk 🛡️')
        }
      ]
    },
    {
      title: 'APP & LEGAL',
      items: [
        {
          icon: <Bell size={20} color="#8B1E3F" />,
          bg: 'linear-gradient(135deg, #FFE4E9 0%, #FCE4E8 100%)',
          borderColor: 'rgba(244, 63, 94, 0.25)',
          label: 'Push Notifications',
          desc: notificationsEnabled ? 'Enabled (Matches, Messages)' : 'Disabled',
          action: () => {
            setNotificationsEnabled(!notificationsEnabled);
            showToast(`Notifications ${!notificationsEnabled ? 'enabled' : 'disabled'}`);
          }
        },
        {
          icon: <FileText size={20} color="#8B1E3F" />,
          bg: 'linear-gradient(135deg, #FFE4E9 0%, #FDF0F3 100%)',
          borderColor: 'rgba(244, 63, 94, 0.25)',
          label: 'Terms & Conditions',
          desc: 'Read official terms, user agreements & rules',
          action: () => setCurrentView('terms')
        },
        {
          icon: <Shield size={20} color="#9A7B2C" />,
          bg: 'linear-gradient(135deg, #FFF5D6 0%, #FDF3D6 100%)',
          borderColor: 'rgba(212, 175, 55, 0.3)',
          label: 'Privacy Policy',
          desc: 'How your data is protected and handled',
          action: () => setCurrentView('privacy')
        }
      ]
    },
    {
      title: 'ACCOUNT ACTIONS',
      items: [
        {
          icon: <LogOut size={20} color="#475569" />,
          bg: 'linear-gradient(135deg, #F1F5F9 0%, #E2E8F0 100%)',
          borderColor: 'rgba(71, 85, 105, 0.2)',
          label: 'Log Out',
          desc: `Signed in as ${currentUser.email}`,
          action: logout
        },
        {
          icon: <Trash2 size={20} color="#E11D48" />,
          bg: 'linear-gradient(135deg, #FEE2E2 0%, #FECACA 100%)',
          borderColor: 'rgba(225, 29, 72, 0.3)',
          label: 'Delete Account',
          desc: 'Permanently remove your profile and matches',
          action: () => setShowDeleteConfirm(true),
          danger: true
        }
      ]
    }
  ];

  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        padding: '8px 0 40px 0',
        gap: '24px',
        width: '100%',
        maxWidth: '860px',
        margin: '0 auto',
        animation: 'fadeIn 0.25s ease-out forwards'
      }}
    >
      {/* Settings Header */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <div>
          <button
            onClick={() => setCurrentView('my-profile')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: '#FFFFFF',
              border: '1.5px solid #F4C5CF',
              padding: '8px 16px',
              borderRadius: 'var(--radius-pill)',
              fontSize: '0.84rem',
              fontWeight: 700,
              color: '#7D1730',
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(125, 23, 48, 0.08)'
            }}
          >
            <ChevronLeft size={16} />
            <span>Back to Profile</span>
          </button>
        </div>

        <div>
          <h1 style={{ fontSize: '1.65rem', fontWeight: 900, color: '#261D20', margin: '0 0 2px 0' }}>
            Settings & Safety
          </h1>
          <p style={{ fontSize: '0.82rem', color: '#7D1730', margin: 0, fontWeight: 500 }}>
            Manage your account preferences, privacy controls, and security options
          </p>
        </div>
      </div>

      {sections.map((section, sIdx) => (
        <div key={sIdx}>
          <h3
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '0.75rem',
              fontWeight: 800,
              color: 'var(--accent-gold)',
              textTransform: 'uppercase',
              letterSpacing: '0.12em',
              marginBottom: '10px',
              paddingLeft: '4px'
            }}
          >
            {section.title}
          </h3>

          <div className="card-luxury" style={{ overflow: 'hidden', padding: 0 }}>
            {section.items.map((item: any, idx: number) => (
              <div
                key={idx}
                onClick={item.action}
                style={{
                  padding: '16px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderBottom:
                    idx < section.items.length - 1 ? '1px solid var(--border-light)' : 'none',
                  cursor: 'pointer',
                  transition: 'background var(--transition-fast)'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bg-blush-subtle)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', minWidth: 0 }}>
                  <div
                    style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '14px',
                      background: item.bg || 'linear-gradient(135deg, #FFE4E9 0%, #FCE4E8 100%)',
                      border: `1.5px solid ${item.borderColor || 'rgba(244, 63, 94, 0.25)'}`,
                      boxShadow: '0 2px 8px rgba(186, 73, 98, 0.08)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}
                  >
                    {item.icon}
                  </div>
                  <div style={{ minWidth: 0, overflow: 'hidden' }}>
                    <h4
                      style={{
                        fontFamily: 'var(--font-serif)',
                        fontSize: '1.02rem',
                        fontWeight: 700,
                        color: item.danger ? '#E11D48' : 'var(--text-primary)',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}
                    >
                      {item.label}
                    </h4>
                    <span
                      style={{
                        fontSize: '0.78rem',
                        color: 'var(--text-secondary)',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        lineHeight: 1.35
                      }}
                    >
                      {item.desc}
                    </span>
                  </div>
                </div>

                <ChevronRight size={17} color="var(--accent-gold)" style={{ flexShrink: 0 }} />
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* App Version Info */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '16px', gap: '8px', color: 'var(--text-muted)' }}>
        <MioraLogo size={36} showTagline={true} showWordmark={true} vertical={true} />
        <span style={{ fontSize: '0.74rem', color: '#94A3B8' }}>Bespoke Edition v1.0.0</span>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            zIndex: 60,
            background: 'rgba(30, 8, 16, 0.7)',
            backdropFilter: 'blur(10px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
        >
          <div
            className="card-luxury"
            style={{
              padding: 'clamp(20px, 4vw, 32px)',
              maxWidth: '400px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              border: '1px solid var(--border-gold)'
            }}
          >
            <div
              style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                background: 'rgba(225, 29, 72, 0.1)',
                color: '#E11D48',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto',
                border: '1px solid rgba(225, 29, 72, 0.2)'
              }}
            >
              <Trash2 size={26} />
            </div>

            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              Delete Account?
            </h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              Are you sure you want to delete your MIORA account? All matches and chat history will be permanently wiped.
            </p>

            <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                style={{
                  flex: 1,
                  padding: '12px',
                  borderRadius: 'var(--radius-pill)',
                  border: '1px solid var(--border-light)',
                  background: 'transparent',
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontFamily: 'var(--font-sans)',
                  color: 'var(--text-secondary)'
                }}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowDeleteConfirm(false);
                  logout();
                }}
                style={{
                  flex: 1,
                  padding: '12px',
                  borderRadius: 'var(--radius-pill)',
                  border: 'none',
                  background: 'linear-gradient(135deg, #BE123C, #881337)',
                  color: '#FFFFFF',
                  fontWeight: 700,
                  cursor: 'pointer',
                  fontFamily: 'var(--font-sans)',
                  boxShadow: '0 4px 14px rgba(136, 19, 55, 0.3)'
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
