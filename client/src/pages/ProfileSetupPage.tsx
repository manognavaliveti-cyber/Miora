import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { InterestPicker } from '../components/profile/InterestPicker';
import { MapPin, Sparkles, User, ChevronLeft } from 'lucide-react';

export const ProfileSetupPage: React.FC = () => {
  const { currentUser, updateUserProfile, setCurrentView } = useApp();

  const [name, setName] = useState(currentUser.name || 'Dev');
  const [age, setAge] = useState(currentUser.age || 23);
  const [location, setLocation] = useState(currentUser.location || 'Bangalore, India');
  const [bio, setBio] = useState(
    currentUser.bio ||
      'Product designer obsessed with aesthetics, indie music, slow coffee, and weekend getaways.'
  );
  const [interests, setInterests] = useState<string[]>(
    currentUser.interests.length > 0
      ? currentUser.interests
      : ['Music', 'Travel', 'Movies', 'Food']
  );

  const handleContinue = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateUserProfile({
      name: name.trim(),
      age: Number(age),
      location: location.trim(),
      bio: bio.trim(),
      interests,
      profileCompletion: 65
    });
    setCurrentView('add-photos');
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
            Step 2 of 4 • Profile Setup
          </span>
          <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--accent-gold)' }}>
            65% Completed
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
              width: '65%',
              height: '100%',
              background: 'linear-gradient(90deg, var(--accent-gold), var(--primary-berry))',
              borderRadius: '3px',
              transition: 'width 0.4s ease'
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
          Your Identity
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
          Tell Us About Yourself
        </h1>
        <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
          Help us discover people who resonate with your lifestyle, values, and energy.
        </p>
      </div>

      {/* Form Container */}
      <form
        onSubmit={handleContinue}
        className="card-luxury"
        style={{
          padding: 'clamp(24px, 3.5vw, 36px)',
          display: 'flex',
          flexDirection: 'column',
          gap: '22px'
        }}
      >
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
          <Input
            label="Display Name"
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
            Personal Bio
          </label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="What gets you excited? Favorite cafe orders, weekend passions..."
            rows={3}
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

        {/* Interests Picker */}
        <div>
          <label
            style={{
              fontSize: '0.84rem',
              fontWeight: 600,
              color: 'var(--text-secondary)',
              fontFamily: 'var(--font-sans)',
              display: 'block',
              marginBottom: '10px'
            }}
          >
            Your Passions & Interests (Choose up to 6)
          </label>
          <InterestPicker selectedInterests={interests} onChange={setInterests} maxSelection={6} />
        </div>

        <Button type="submit" variant="primary" size="lg" fullWidth style={{ marginTop: '8px' }}>
          Continue to Add Photos
        </Button>
      </form>
    </div>
  );
};
