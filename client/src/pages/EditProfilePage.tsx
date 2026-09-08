import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { PhotoUploader } from '../components/profile/PhotoUploader';
import { InterestPicker } from '../components/profile/InterestPicker';
import { User, MapPin, Sparkles, Check, ChevronLeft } from 'lucide-react';

export const EditProfilePage: React.FC = () => {
  const { currentUser, updateUserProfile, setCurrentView } = useApp();

  const [name, setName] = useState(currentUser.name);
  const [age, setAge] = useState(currentUser.age);
  const [location, setLocation] = useState(currentUser.location);
  const [bio, setBio] = useState(currentUser.bio);
  const [interests, setInterests] = useState<string[]>(currentUser.interests);
  const [photos, setPhotos] = useState<string[]>(currentUser.photos);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    await updateUserProfile({
      name: name.trim(),
      age: Number(age),
      location: location.trim(),
      bio: bio.trim(),
      interests,
      photos
    });
    setIsSaving(false);
    setCurrentView('my-profile');
  };

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
          Edit Profile
        </h1>
        <div style={{ width: '40px' }} />
      </div>

      <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* Photo Gallery Editor */}
        <div className="card-luxury" style={{ padding: 'clamp(20px, 3vw, 28px)' }}>
          <h3
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '1.2rem',
              fontWeight: 700,
              color: 'var(--text-primary)',
              marginBottom: '14px'
            }}
          >
            Manage Photos (Up to 6)
          </h3>
          <PhotoUploader photos={photos} onChange={setPhotos} maxPhotos={6} />
        </div>

        {/* Basic Info Editor */}
        <div
          className="card-luxury"
          style={{
            padding: 'clamp(20px, 3vw, 28px)',
            display: 'flex',
            flexDirection: 'column',
            gap: '18px'
          }}
        >
          <h3
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '1.2rem',
              fontWeight: 700,
              color: 'var(--text-primary)'
            }}
          >
            Personal Details
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
            <Input
              label="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              icon={<User size={18} />}
            />
            <Input
              label="Age"
              type="number"
              min={18}
              max={99}
              value={age}
              onChange={(e) => setAge(Number(e.target.value))}
              required
            />
          </div>

          <Input
            label="Location City"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
            icon={<MapPin size={18} />}
          />

          <div>
            <label
              style={{
                fontSize: '0.84rem',
                fontWeight: 600,
                color: 'var(--text-secondary)',
                fontFamily: 'var(--font-sans)',
                display: 'block',
                marginBottom: '6px'
              }}
            >
              Bio
            </label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={4}
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: 'var(--radius-md)',
                border: '1.5px solid var(--border-light)',
                background: 'var(--bg-warm-ivory)',
                fontFamily: 'var(--font-sans)',
                fontSize: '0.92rem',
                color: 'var(--text-primary)',
                outline: 'none',
                resize: 'none'
              }}
              onFocus={(e) => (e.target.style.borderColor = 'var(--primary-berry)')}
              onBlur={(e) => (e.target.style.borderColor = 'var(--border-light)')}
            />
          </div>
        </div>

        {/* Interests Editor */}
        <div className="card-luxury" style={{ padding: 'clamp(20px, 3vw, 28px)' }}>
          <h3
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '1.2rem',
              fontWeight: 700,
              color: 'var(--text-primary)',
              marginBottom: '14px'
            }}
          >
            Passions & Interests
          </h3>
          <InterestPicker selectedInterests={interests} onChange={setInterests} maxSelection={6} />
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '16px' }}>
          <Button
            type="button"
            onClick={() => setCurrentView('my-profile')}
            variant="ghost"
            size="lg"
            fullWidth
          >
            Cancel
          </Button>

          <Button type="submit" variant="primary" size="lg" fullWidth disabled={isSaving}>
            <Check size={18} />
            <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
          </Button>
        </div>
      </form>
    </div>
  );
};
