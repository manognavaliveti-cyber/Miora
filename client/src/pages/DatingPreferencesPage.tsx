import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { MapPin, Sliders, Sparkles, Check, ChevronLeft } from 'lucide-react';

export const DatingPreferencesPage: React.FC = () => {
  const { currentUser, updateUserProfile, updateUserPreferences, setCurrentView, setActiveTab, currentView, openDiscountModal } = useApp();

  const [gender, setGender] = useState<'woman' | 'man' | 'non-binary' | 'prefer-not-to-say'>(currentUser.gender || 'woman');
  const [interestedIn, setInterestedIn] = useState<'women' | 'men' | 'everyone'>(
    currentUser.preferences?.interestedIn || 'women'
  );
  const [minAge, setMinAge] = useState(currentUser.preferences?.ageRange?.min || 18);
  const [maxAge, setMaxAge] = useState(currentUser.preferences?.ageRange?.max || 28);
  const [maxDistance, setMaxDistance] = useState(currentUser.preferences?.maxDistanceKm || 25);
  const [location, setLocation] = useState(currentUser.preferences?.location || 'Bangalore');

  const isFromSettings = currentView === 'dating-preferences' && currentUser.profileCompletion >= 100;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateUserProfile({ gender, profileCompletion: 100 });
    await updateUserPreferences({
      interestedIn,
      ageRange: { min: minAge, max: maxAge },
      maxDistanceKm: maxDistance,
      location
    });

    setCurrentView('discover');
    setActiveTab('discover');
    openDiscountModal();
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
      {/* Top Progress Bar if in onboarding */}
      {!isFromSettings && (
        <div style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span className="tagline-text" style={{ fontSize: '0.75rem', letterSpacing: '0.14em' }}>
              Step 4 of 4 • Gender & Match Preferences
            </span>
            <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--accent-gold)' }}>
              100% Ready
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
                width: '100%',
                height: '100%',
                background: 'linear-gradient(90deg, var(--accent-gold), var(--primary-berry))',
                borderRadius: '3px'
              }}
            />
          </div>
        </div>
      )}

      {/* Title & Back Button */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
          <button
            type="button"
            onClick={() => setCurrentView(isFromSettings ? 'settings' : 'add-photos')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: 'var(--surface-card)',
              border: '1px solid var(--border-light)',
              padding: '6px 14px',
              borderRadius: 'var(--radius-pill)',
              fontFamily: 'var(--font-sans)',
              fontSize: '0.8rem',
              fontWeight: 700,
              color: 'var(--text-primary)',
              cursor: 'pointer',
              boxShadow: 'var(--shadow-xs)'
            }}
          >
            <ChevronLeft size={16} />
            <span>{isFromSettings ? 'Settings' : 'Back to Photos'}</span>
          </button>
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
            Resonance Criteria
          </span>
        </div>
        <h1
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(1.7rem, 4vw, 2.4rem)',
            fontWeight: 800,
            color: 'var(--text-primary)',
            letterSpacing: '-0.02em',
            marginTop: '4px'
          }}
        >
          Dating Preferences
        </h1>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
          Customize who appears in your bespoke daily Discover stack.
        </p>
      </div>

      {/* Form Card */}
      <form
        onSubmit={handleSave}
        className="card-luxury"
        style={{
          padding: 'clamp(18px, 4vw, 36px)',
          display: 'flex',
          flexDirection: 'column',
          gap: '22px'
        }}
      >
        {/* My Gender */}
        <div>
          <label style={{ fontSize: '0.88rem', fontWeight: 650, color: 'var(--text-secondary)', fontFamily: 'var(--font-sans)', display: 'block', marginBottom: '10px' }}>
            My Gender
          </label>
          <div className="dating-gender-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0,1fr))', gap: '10px' }}>
            {[
              { id: 'woman', label: 'Woman', icon: '♀' },
              { id: 'man', label: 'Man', icon: '♂' },
              { id: 'non-binary', label: 'Non-binary', icon: '⚧' },
              { id: 'prefer-not-to-say', label: 'Prefer not to say', icon: '♡' }
            ].map((item) => {
              const selected = gender === item.id;
              return (
                <button
                  type="button"
                  key={item.id}
                  onClick={() => setGender(item.id as typeof gender)}
                  style={{
                    border: selected ? '2px solid var(--primary-berry)' : '1.5px solid var(--border-light)',
                    background: selected ? 'linear-gradient(135deg,#FFF0F3,#FDE1E8)' : '#FFF',
                    color: selected ? 'var(--primary-berry)' : 'var(--text-secondary)',
                    borderRadius: '16px', padding: '12px 10px', cursor: 'pointer', fontWeight: 750,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                    boxShadow: selected ? '0 8px 20px rgba(190,18,60,.12)' : 'none', transition: 'all .2s ease'
                  }}
                >
                  <span style={{ width: 28, height: 28, borderRadius: '50%', display:'flex', alignItems:'center', justifyContent:'center', background: selected ? 'var(--primary-berry)' : '#F8EDF0', color: selected ? '#FFF' : 'var(--primary-berry)', fontSize:'1rem' }}>{item.icon}</span>
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Interested In */}
        <div>
          <label
            style={{
              fontSize: '0.88rem',
              fontWeight: 600,
              color: 'var(--text-secondary)',
              fontFamily: 'var(--font-sans)',
              display: 'block',
              marginBottom: '10px'
            }}
          >
            I Want to Meet
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(90px, 1fr))', gap: '10px' }}>
            {[
              { id: 'women', label: 'Women' },
              { id: 'men', label: 'Men' },
              { id: 'everyone', label: 'Everyone' }
            ].map((item) => {
              const isSelected = interestedIn === item.id;
              return (
                <button
                  type="button"
                  key={item.id}
                  onClick={() => setInterestedIn(item.id as any)}
                  className={`pill ${isSelected ? 'pill-selected' : 'pill-default'}`}
                  style={{
                    justifyContent: 'center',
                    padding: '12px 0',
                    border: isSelected ? '1.5px solid var(--accent-gold)' : '1px solid var(--border-light)'
                  }}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Age Range */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
            <label
              style={{
                fontSize: '0.88rem',
                fontWeight: 600,
                color: 'var(--text-secondary)',
                fontFamily: 'var(--font-sans)'
              }}
            >
              Age Range
            </label>
            <span style={{ fontSize: '0.88rem', fontWeight: 800, color: 'var(--primary-berry)' }}>
              {minAge} – {maxAge} years
            </span>
          </div>

          <input
            type="range"
            min={18}
            max={50}
            value={maxAge}
            onChange={(e) => setMaxAge(Number(e.target.value))}
            style={{
              width: '100%',
              accentColor: 'var(--primary-berry)',
              cursor: 'pointer'
            }}
          />
        </div>

        {/* Maximum Distance */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
            <label
              style={{
                fontSize: '0.88rem',
                fontWeight: 600,
                color: 'var(--text-secondary)',
                fontFamily: 'var(--font-sans)'
              }}
            >
              Maximum Distance
            </label>
            <span style={{ fontSize: '0.88rem', fontWeight: 800, color: 'var(--primary-berry)' }}>
              Up to {maxDistance} km
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
            {[5, 10, 25, 50].map((dist) => {
              const isSelected = maxDistance === dist;
              return (
                <button
                  type="button"
                  key={dist}
                  onClick={() => setMaxDistance(dist)}
                  className={`pill ${isSelected ? 'pill-selected' : 'pill-default'}`}
                  style={{
                    justifyContent: 'center',
                    padding: '10px 0',
                    border: isSelected ? '1.5px solid var(--accent-gold)' : '1px solid var(--border-light)'
                  }}
                >
                  {dist} km
                </button>
              );
            })}
          </div>
        </div>

        {/* Location */}
        <Input
          label="Location City"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          icon={<MapPin size={18} />}
        />

        <Button type="submit" variant="primary" size="lg" fullWidth style={{ marginTop: '8px' }}>
          <span>Find Matches</span>
          <Sparkles size={17} />
        </Button>
      </form>
    </div>
  );
};
