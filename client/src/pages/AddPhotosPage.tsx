import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Button } from '../components/common/Button';
import { PhotoUploader } from '../components/profile/PhotoUploader';
import { Sparkles, ChevronLeft, Image as ImageIcon } from 'lucide-react';

export const AddPhotosPage: React.FC = () => {
  const { currentUser, updateUserProfile, setCurrentView, showToast } = useApp();
  const [photos, setPhotos] = useState<string[]>(
    currentUser.photos.length > 0
      ? currentUser.photos
      : [
          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80'
        ]
  );

  const handleContinue = async () => {
    if (photos.length === 0) {
      showToast('Please add at least 1 photo to continue');
      return;
    }

    await updateUserProfile({
      photos,
      profileCompletion: 80
    });
    setCurrentView('dating-preferences');
  };

  return (
    <div
      style={{
        width: '100%',
        maxWidth: '720px',
        margin: '0 auto',
        padding: '24px 16px 40px 16px',
        animation: 'fadeIn 0.3s ease-out forwards'
      }}
    >
      {/* Top Progress Bar */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <span className="tagline-text" style={{ fontSize: '0.75rem', letterSpacing: '0.14em' }}>
            Step 3 of 4 • Profile Photos
          </span>
          <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--accent-gold)' }}>
            80% Completed
          </span>
        </div>
        <div
          style={{
            width: '100%',
            height: '6px',
            borderRadius: '3px',
            background: 'var(--border-light)',
            overflow: 'hidden'
          }}
        >
          <div
            style={{
              width: '80%',
              height: '100%',
              background: 'linear-gradient(90deg, var(--accent-gold), var(--primary-berry))',
              borderRadius: '3px'
            }}
          />
        </div>
      </div>

      {/* Title */}
      <div style={{ marginBottom: '24px' }}>
        <span
          style={{
            fontSize: '0.72rem',
            fontFamily: 'var(--font-sans)',
            fontWeight: 700,
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            color: 'var(--accent-gold)'
          }}
        >
          Visual Storytelling
        </span>
        <h1
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(2rem, 3vw, 2.4rem)',
            fontWeight: 800,
            color: 'var(--text-primary)',
            letterSpacing: '-0.02em',
            marginTop: '4px'
          }}
        >
          Add Your Best Photos
        </h1>
        <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
          Profiles with 3 or more photos receive 4x more mutual vibe matches.
        </p>
      </div>

      {/* Photo Grid Card */}
      <div
        className="card-luxury"
        style={{
          padding: 'clamp(24px, 3.5vw, 36px)'
        }}
      >
        <PhotoUploader photos={photos} onChange={setPhotos} maxPhotos={6} />
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '24px' }}>
        <Button onClick={handleContinue} variant="primary" size="lg" fullWidth>
          Continue to Preferences
        </Button>

        <button
          onClick={() => setCurrentView('profile-setup')}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--text-secondary)',
            fontSize: '0.88rem',
            fontWeight: 600,
            cursor: 'pointer',
            textAlign: 'center',
            fontFamily: 'var(--font-sans)',
            transition: 'color var(--transition-fast)'
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--primary-berry)')}
          onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
        >
          Back to Details
        </button>
      </div>
    </div>
  );
};
