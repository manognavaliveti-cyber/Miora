import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Edit3,
  Settings as SettingsIcon,
  Shield,
  Sparkles,
  MapPin,
  ShieldCheck,
  Briefcase,
  GraduationCap,
  Share2,
  Wallet,
  ArrowRight,
  Crown,
  Rocket,
  Heart,
  LogOut,
  SlidersHorizontal
} from 'lucide-react';

export const MyProfilePage: React.FC = () => {
  const {
    currentUser,
    setCurrentView,
    openUpgradeModal,
    openBoostModal,
    logout,
    showToast
  } = useApp();

  const userPhoto = currentUser.photos[0] || 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22400%22 height=%22400%22 viewBox=%220 0 400 400%22%3E%3Crect width=%22400%22 height=%22400%22 rx=%22200%22 fill=%22%23f8e9ee%22/%3E%3Ccircle cx=%22200%22 cy=%22155%22 r=%2270%22 fill=%22%23c08497%22/%3E%3Cpath d=%22M80 360c18-92 222-92 240 0%22 fill=%22%23c08497%22/%3E%3C/svg%3E';

  const handleShareProfile = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(`${window.location.origin}/#profile-${currentUser.id}`);
      showToast('Profile link copied to clipboard! 📋✨');
    }
  };

  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        padding: '8px 0 40px 0',
        width: '100%',
        maxWidth: '680px',
        margin: '0 auto',
        animation: 'fadeIn 0.25s ease-out forwards'
      }}
    >
      {/* 1. Main Profile Header Card */}
      <div
        style={{
          background: '#FFFFFF',
          borderRadius: '28px',
          border: '1.5px solid var(--border-gold, #FCE7F3)',
          boxShadow: '0 8px 30px rgba(76, 5, 25, 0.05)',
          padding: '24px 20px',
          marginBottom: '20px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
          {/* Main Photo */}
          <div style={{ position: 'relative' }}>
            <img
              src={userPhoto}
              alt={currentUser.name}
              style={{
                width: '88px',
                height: '88px',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '3px solid #EE3865',
                boxShadow: '0 6px 20px rgba(238, 56, 101, 0.28)'
              }}
            />
          </div>

          {/* User Info */}
          <div style={{ flex: 1, minWidth: '200px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <h2
                style={{
                  fontFamily: 'var(--font-serif, inherit)',
                  fontSize: '1.55rem',
                  fontWeight: 800,
                  color: '#1F2937',
                  margin: 0
                }}
              >
                {currentUser.name}, {currentUser.age}
              </h2>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  color: '#D4AF37',
                  fontSize: '0.74rem',
                  fontWeight: 800,
                  background: 'rgba(212, 175, 55, 0.1)',
                  padding: '3px 10px',
                  borderRadius: '999px',
                  border: '1px solid #D4AF37'
                }}
              >
                <ShieldCheck size={14} color="#D4AF37" />
                Verified
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#6B7280', fontSize: '0.86rem', marginTop: '4px' }}>
              <MapPin size={14} color="#EE3865" />
              <span>{currentUser.location || 'Add your location'}</span>
            </div>

            {currentUser.bio && (
              <p style={{ fontSize: '0.88rem', color: '#4B5563', margin: '8px 0 0', lineHeight: 1.45 }}>
                {currentUser.bio}
              </p>
            )}
          </div>
        </div>

        {/* Action Buttons: Edit Profile & Share Profile */}
        <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
          <button
            onClick={() => setCurrentView('edit-profile')}
            style={{
              flex: 1,
              background: 'linear-gradient(135deg, #8B1E3F 0%, #681028 100%)',
              color: '#FFFFFF',
              border: 'none',
              padding: '9px 14px',
              borderRadius: '999px',
              fontWeight: 800,
              fontSize: '0.76rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(139, 30, 63, 0.3)'
            }}
          >
            <Edit3 size={14} />
            <span>Edit Profile</span>
          </button>

          <button
            onClick={handleShareProfile}
            style={{
              flex: 1,
              background: '#FFFFFF',
              color: '#374151',
              border: '1.5px solid #E5E7EB',
              padding: '9px 14px',
              borderRadius: '999px',
              fontWeight: 800,
              fontSize: '0.76rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              cursor: 'pointer'
            }}
          >
            <Share2 size={14} />
            <span>Share Profile</span>
          </button>
        </div>
      </div>

      {/* 2. Real Money Wallet Card */}
      <div
        style={{
          background: 'linear-gradient(135deg, #FFFFFF 0%, #FFF8FA 60%, #FFF0F4 100%)',
          borderRadius: '24px',
          border: '1.5px solid #FCE7F3',
          boxShadow: '0 8px 24px rgba(76, 5, 25, 0.05)',
          padding: '20px 22px',
          marginBottom: '16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div
            style={{
              width: '52px',
              height: '52px',
              borderRadius: '16px',
              background: 'rgba(212, 175, 55, 0.15)',
              border: '1.5px solid #D4AF37',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#9A7B2C',
              boxShadow: '0 4px 12px rgba(212, 175, 55, 0.2)'
            }}
          >
            <Wallet size={26} />
          </div>

          <div>
            <span style={{ fontSize: '0.74rem', fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#9A7B2C' }}>
              Wallet
            </span>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '2px' }}>
              <h3 style={{ fontSize: '1.35rem', fontWeight: 900, color: '#1F161A', margin: 0 }}>
                ₹{(currentUser.walletBalance || 0).toFixed(2)}
              </h3>
            </div>
          </div>
        </div>

        <button
          onClick={() => setCurrentView('wallet')}
          style={{
            background: 'linear-gradient(135deg, #8B1E3F 0%, #681028 100%)',
            color: '#FFFFFF',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '999px',
            fontWeight: 800,
            fontSize: '0.84rem',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(139, 30, 63, 0.3)'
          }}
        >
          <span>Manage Wallet</span>
          <ArrowRight size={15} />
        </button>
      </div>

      {/* 3. Membership Status Card */}
      <div
        style={{
          background: currentUser.subscriptionTier === 'vip'
            ? 'linear-gradient(135deg, #261D20 0%, #7D1730 100%)'
            : currentUser.subscriptionTier === 'pro'
            ? 'linear-gradient(135deg, #7D1730 0%, #A91E45 100%)'
            : 'linear-gradient(135deg, #FFFFFF 0%, #FFF5F7 100%)',
          borderRadius: '24px',
          padding: '20px 22px',
          color: (currentUser.subscriptionTier && currentUser.subscriptionTier !== 'free') ? '#FFFFFF' : '#261D20',
          border: currentUser.subscriptionTier === 'vip' ? '2px solid #D4AF37' : '1.5px solid #F4C5CF',
          marginBottom: '20px',
          boxShadow: '0 8px 24px rgba(125, 23, 48, 0.12)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '50%',
              background: currentUser.subscriptionTier === 'vip'
                ? 'linear-gradient(135deg, #FDE68A 0%, #D4AF37 100%)'
                : currentUser.subscriptionTier === 'pro'
                ? '#E66B83'
                : '#FBEDEF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}
          >
            <Crown size={22} color={currentUser.subscriptionTier === 'vip' ? '#261D20' : currentUser.subscriptionTier === 'pro' ? '#FFFFFF' : '#A91E45'} />
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '0.98rem', fontWeight: 900, color: (currentUser.subscriptionTier && currentUser.subscriptionTier !== 'free') ? '#FFFFFF' : '#261D20' }}>
                {currentUser.subscriptionTier === 'vip' ? 'VIP ACTIVE 👑' : currentUser.subscriptionTier === 'pro' ? 'PRO ACTIVE ⚡' : 'FREE PLAN'}
              </span>
            </div>

            <div style={{ fontSize: '0.78rem', color: (currentUser.subscriptionTier && currentUser.subscriptionTier !== 'free') ? '#F4C5CF' : '#7D1730', marginTop: '4px', fontWeight: 600 }}>
              {(!currentUser.subscriptionTier || currentUser.subscriptionTier === 'free')
                ? '10 Swipes • 10 Likes • 500 Messages'
                : `Active 28-Day Entitlement • Wallet: ₹${(currentUser.walletBalance || 0).toFixed(2)}`}
            </div>
          </div>
        </div>

        <button
          onClick={openUpgradeModal}
          style={{
            background: currentUser.subscriptionTier === 'vip'
              ? 'linear-gradient(135deg, #FDE68A 0%, #D4AF37 100%)'
              : currentUser.subscriptionTier === 'pro'
              ? '#FFFFFF'
              : 'linear-gradient(135deg, #A91E45 0%, #C52E59 100%)',
            border: 'none',
            color: currentUser.subscriptionTier === 'vip' ? '#261D20' : currentUser.subscriptionTier === 'pro' ? '#A91E45' : '#FFFFFF',
            padding: '8px 14px',
            borderRadius: '999px',
            fontWeight: 800,
            fontSize: '0.76rem',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(125, 23, 48, 0.2)'
          }}
        >
          {(!currentUser.subscriptionTier || currentUser.subscriptionTier === 'free') ? 'Upgrade' : 'View Benefits'}
        </button>
      </div>

      {/* 4. Photos Showcase */}
      <div
        style={{
          background: '#FFFFFF',
          borderRadius: '24px',
          border: '1.5px solid #FCE7F3',
          padding: '20px',
          marginBottom: '20px'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#1F2937', margin: 0 }}>
            Photos ({currentUser.photos.length})
          </h3>
          <button
            onClick={() => setCurrentView('edit-profile')}
            style={{
              background: 'none',
              border: 'none',
              color: '#8B1E3F',
              fontWeight: 800,
              fontSize: '0.82rem',
              cursor: 'pointer'
            }}
          >
            + Manage
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
          {currentUser.photos.map((photo, idx) => (
            <img
              key={idx}
              src={photo}
              alt={`Photo ${idx + 1}`}
              style={{
                width: '100%',
                height: '110px',
                borderRadius: '16px',
                objectFit: 'cover'
              }}
            />
          ))}
        </div>
      </div>

      {/* 5. Account Settings & Safety Quick Links */}
      <div
        style={{
          background: '#FFFFFF',
          borderRadius: '24px',
          border: '1.5px solid #FCE7F3',
          padding: '8px',
          display: 'flex',
          flexDirection: 'column',
          gap: '2px'
        }}
      >
        <button
          onClick={() => setCurrentView('dating-preferences')}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '14px 16px',
            borderRadius: '16px',
            border: 'none',
            background: 'transparent',
            color: '#1F2937',
            fontWeight: 700,
            fontSize: '0.9rem',
            cursor: 'pointer'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <SlidersHorizontal size={18} color="#8B1E3F" />
            <span>Dating Preferences</span>
          </div>
          <ArrowRight size={16} color="#9CA3AF" />
        </button>

        <button
          onClick={() => setCurrentView('settings')}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '14px 16px',
            borderRadius: '16px',
            border: 'none',
            background: 'transparent',
            color: '#1F2937',
            fontWeight: 700,
            fontSize: '0.9rem',
            cursor: 'pointer'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <SettingsIcon size={18} color="#8B1E3F" />
            <span>Settings & Privacy</span>
          </div>
          <ArrowRight size={16} color="#9CA3AF" />
        </button>

        <button
          onClick={() => setCurrentView('blocked-users')}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '14px 16px',
            borderRadius: '16px',
            border: 'none',
            background: 'transparent',
            color: '#1F2937',
            fontWeight: 700,
            fontSize: '0.9rem',
            cursor: 'pointer'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Shield size={18} color="#8B1E3F" />
            <span>Safety & Blocked Profiles</span>
          </div>
          <ArrowRight size={16} color="#9CA3AF" />
        </button>

        <button
          onClick={logout}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '14px 16px',
            borderRadius: '16px',
            border: 'none',
            background: 'transparent',
            color: '#EF4444',
            fontWeight: 800,
            fontSize: '0.9rem',
            cursor: 'pointer'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <LogOut size={18} color="#EF4444" />
            <span>Log Out</span>
          </div>
        </button>
      </div>
    </div>
  );
};
