import React from 'react';
import { useApp } from '../context/AppContext';
import { ShieldCheck, UserX, Unlock, ChevronLeft } from 'lucide-react';
import { Button } from '../components/common/Button';

export const BlockedUsersPage: React.FC = () => {
  const { blockedUsers, unblockProfile, setCurrentView } = useApp();

  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        padding: '16px 16px 40px 16px',
        gap: '20px',
        width: '100%',
        maxWidth: '860px',
        margin: '0 auto',
        animation: 'fadeIn 0.25s ease-out forwards'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button
          onClick={() => setCurrentView('settings')}
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
          <span>Back to Settings</span>
        </button>

        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-primary)' }}>
          Blocked Profiles
        </h1>
        <div style={{ width: '40px' }} />
      </div>

      <div
        style={{
          padding: '16px 20px',
          borderRadius: 'var(--radius-md)',
          background: 'var(--bg-blush-subtle)',
          border: '1px solid var(--border-light)',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}
      >
        <ShieldCheck size={22} color="var(--primary-berry)" style={{ flexShrink: 0 }} />
        <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', lineHeight: 1.45 }}>
          Blocked members cannot view your profile, send you messages, or appear in your Discover stack.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {blockedUsers.length > 0 ? (
          blockedUsers.map((item) => (
            <div
              key={item.id}
              className="card-luxury"
              style={{
                padding: '16px 20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <img
                  src={
                    item.profilePhoto ||
                    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80'
                  }
                  alt={item.profileName}
                  style={{ width: '50px', height: '50px', borderRadius: '50%', objectFit: 'cover', border: '1.5px solid var(--border-gold)' }}
                />
                <div>
                  <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    {item.profileName}
                  </h4>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    Blocked on {new Date(item.blockedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <button
                onClick={() => unblockProfile(item.profileId)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 16px',
                  borderRadius: 'var(--radius-pill)',
                  border: '1px solid var(--border-light)',
                  background: 'var(--surface-card)',
                  color: 'var(--text-primary)',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  fontFamily: 'var(--font-sans)',
                  cursor: 'pointer',
                  transition: 'all var(--transition-fast)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--primary-berry)';
                  e.currentTarget.style.color = 'var(--primary-berry)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border-light)';
                  e.currentTarget.style.color = 'var(--text-primary)';
                }}
              >
                <Unlock size={14} />
                <span>Unblock</span>
              </button>
            </div>
          ))
        ) : (
          <div
            className="card-luxury"
            style={{
              padding: '48px 24px',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '14px'
            }}
          >
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, rgba(136, 19, 55, 0.08) 0%, rgba(212, 175, 55, 0.1) 100%)',
                color: 'var(--primary-berry)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid var(--border-gold)'
              }}
            >
              <UserX size={28} color="var(--accent-gold)" />
            </div>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              No Blocked Profiles
            </h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
              Your block list is currently clean.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
