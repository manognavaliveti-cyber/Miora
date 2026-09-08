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
      title: 'Preferences & Matching',
      items: [
        {
          icon: <SlidersHorizontal size={18} color="var(--primary-berry)" />,
          label: 'Dating Preferences',
          desc: 'Age, distance, gender interested in',
          action: () => setCurrentView('dating-preferences')
        },
        {
          icon: <Bell size={18} color="var(--primary-berry)" />,
          label: 'Push Notifications',
          desc: notificationsEnabled ? 'Enabled (Matches, Messages)' : 'Disabled',
          action: () => {
            setNotificationsEnabled(!notificationsEnabled);
            showToast(`Notifications ${!notificationsEnabled ? 'enabled' : 'disabled'}`);
          }
        }
      ]
    },
    {
      title: 'Safety & Privacy',
      items: [
        {
          icon: <ShieldAlert size={18} color="#E11D48" />,
          label: 'Blocked Profiles',
          desc: 'Manage blocked profiles',
          action: () => setCurrentView('blocked-users')
        },
        {
          icon: <Lock size={18} color="var(--accent-gold)" />,
          label: 'Privacy & Permissions',
          desc: 'Profile visibility & incognito mode',
          action: () => showToast('Incognito mode active ✨')
        },
        {
          icon: <HelpCircle size={18} color="var(--text-secondary)" />,
          label: 'Help & Safety Center',
          desc: 'Tips for safe dating & 24/7 assistance',
          action: () => showToast('Connecting to 24/7 MIORA Safety Desk 🛡️')
        }
      ]
    },
    {
      title: 'Legal & Compliance',
      items: [
        {
          icon: <FileText size={18} color="var(--primary-berry)" />,
          label: 'Terms & Conditions',
          desc: 'Read official terms, user agreements & rules',
          action: () => setCurrentView('terms')
        },
        {
          icon: <Shield size={18} color="var(--accent-gold)" />,
          label: 'Privacy Policy',
          desc: 'How your data is protected and handled',
          action: () => setCurrentView('privacy')
        }
      ]
    },
    {
      title: 'Account Actions',
      items: [
        {
          icon: <LogOut size={18} color="var(--text-secondary)" />,
          label: 'Log Out',
          desc: `Signed in as ${currentUser.email}`,
          action: logout
        },
        {
          icon: <Trash2 size={18} color="#E11D48" />,
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
        padding: '16px 16px 40px 16px',
        gap: '24px',
        width: '100%',
        maxWidth: '860px',
        margin: '0 auto',
        animation: 'fadeIn 0.25s ease-out forwards'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button
          onClick={() => setCurrentView('my-profile')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            background: 'var(--surface-card)',
            border: '1px solid var(--border-light)',
            padding: '8px 16px',
            borderRadius: 'var(--radius-pill)',
            fontFamily: 'var(--font-sans)',
            fontSize: '0.84rem',
            fontWeight: 700,
            color: 'var(--text-primary)',
            cursor: 'pointer',
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          <ChevronLeft size={17} />
          <span>Back to Profile</span>
        </button>

        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-primary)' }}>
          Settings & Safety
        </h1>
        <div style={{ width: '40px' }} />
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
            {section.items.map((item, idx) => (
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
                      width: '42px',
                      height: '42px',
                      borderRadius: '12px',
                      background: item.danger
                        ? 'rgba(225, 29, 72, 0.08)'
                        : 'linear-gradient(135deg, rgba(136, 19, 55, 0.08) 0%, rgba(212, 175, 55, 0.1) 100%)',
                      border: '1px solid var(--border-light)',
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
                        display: 'block',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
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
