import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AdvancedFilterCriteria } from '../../types';
import {
  X,
  SlidersHorizontal,
  Crown,
  ShieldCheck,
  Sparkles,
  Heart,
  Check,
  RotateCcw
} from 'lucide-react';
import { Button } from '../common/Button';

export const AdvancedFilterModal: React.FC = () => {
  const {
    isFilterModalOpen,
    closeFilterModal,
    advancedFilters,
    setAdvancedFilters,
    currentUser,
    openUpgradeModal
  } = useApp();

  const isPremium = currentUser.isPremium;

  const [localFilters, setLocalFilters] = useState<AdvancedFilterCriteria>(advancedFilters);

  if (!isFilterModalOpen) return null;

  const handleApply = () => {
    setAdvancedFilters(localFilters);
    closeFilterModal();
  };

  const handleReset = () => {
    const defaultFilters: AdvancedFilterCriteria = {
      minAge: 18,
      maxAge: 35,
      maxDistanceKm: 50,
      verifiedOnly: false,
      minCompatibility: 70
    };
    setLocalFilters(defaultFilters);
    setAdvancedFilters(defaultFilters);
  };

  const intentOptions = ['Long-term', 'Marriage', 'Casual dating', 'New friends', 'Open to anything'];
  const drinkingOptions = ['Never', 'Socially', 'Frequently'];
  const smokingOptions = ['Never', 'Socially', 'Regularly'];
  const workoutOptions = ['Active / Gym', 'Yoga & Pilates', 'Occasionally', 'Never'];
  const zodiacOptions = [
    'Aries ♈', 'Taurus ♉', 'Gemini ♊', 'Cancer ♋',
    'Leo ♌', 'Virgo ♍', 'Libra ♎', 'Scorpio ♏',
    'Sagittarius ♐', 'Capricorn ♑', 'Aquarius ♒', 'Pisces ♓'
  ];

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'rgba(15, 23, 42, 0.75)',
        backdropFilter: 'blur(12px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        animation: 'fadeIn 0.25s ease-out forwards',
        boxSizing: 'border-box'
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) closeFilterModal();
      }}
    >
      <div
        style={{
          background: '#FFFFFF',
          width: '100%',
          maxWidth: '540px',
          maxHeight: '88vh',
          borderRadius: '28px',
          boxShadow: '0 25px 60px -15px rgba(136, 19, 55, 0.3)',
          overflowY: 'auto',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          boxSizing: 'border-box'
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '20px 24px',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            position: 'sticky',
            top: 0,
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(8px)',
            zIndex: 10
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: 'rgba(136, 19, 55, 0.08)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--berry-primary)'
              }}
            >
              <SlidersHorizontal size={18} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--text-primary)', margin: 0 }}>
                Discovery Filters
              </h2>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                Refine your romance stack
              </span>
            </div>
          </div>

          <button
            onClick={closeFilterModal}
            aria-label="Close"
            style={{
              background: '#F1F5F9',
              border: 'none',
              borderRadius: '50%',
              width: '34px',
              height: '34px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: 'var(--text-secondary)'
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Content Body */}
        <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '22px' }}>
          {/* Section 1: Basic Filters (Age, Distance, Min Match) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Age Range */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  Age Range
                </span>
                <span style={{ fontSize: '0.85rem', fontWeight: 900, color: 'var(--berry-primary)' }}>
                  {localFilters.minAge} - {localFilters.maxAge} years
                </span>
              </div>
              <input
                type="range"
                min={18}
                max={50}
                value={localFilters.maxAge}
                onChange={(e) => setLocalFilters({ ...localFilters, maxAge: Number(e.target.value) })}
                style={{ width: '100%', accentColor: 'var(--berry-primary)' }}
              />
            </div>

            {/* Max Distance */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  Maximum Distance
                </span>
                <span style={{ fontSize: '0.85rem', fontWeight: 900, color: 'var(--berry-primary)' }}>
                  Within {localFilters.maxDistanceKm} km
                </span>
              </div>
              <input
                type="range"
                min={5}
                max={100}
                step={5}
                value={localFilters.maxDistanceKm}
                onChange={(e) => setLocalFilters({ ...localFilters, maxDistanceKm: Number(e.target.value) })}
                style={{ width: '100%', accentColor: 'var(--berry-primary)' }}
              />
            </div>

            {/* Min Compatibility */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  Minimum Vibe Compatibility
                </span>
                <span style={{ fontSize: '0.85rem', fontWeight: 900, color: 'var(--berry-primary)' }}>
                  {localFilters.minCompatibility}%+ Match
                </span>
              </div>
              <input
                type="range"
                min={60}
                max={95}
                step={5}
                value={localFilters.minCompatibility}
                onChange={(e) => setLocalFilters({ ...localFilters, minCompatibility: Number(e.target.value) })}
                style={{ width: '100%', accentColor: 'var(--berry-primary)' }}
              />
            </div>
          </div>

          {/* Section 2: Verified Only Toggle (VIP) */}
          <div
            style={{
              background: '#F8FAFC',
              border: '1.5px solid var(--border-subtle)',
              borderRadius: '18px',
              padding: '14px 16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <ShieldCheck size={22} color="#0284C7" />
              <div>
                <div style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  Verified Profiles Only
                </div>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)' }}>
                  Only show identity-verified genuine matches
                </div>
              </div>
            </div>

            <input
              type="checkbox"
              checked={localFilters.verifiedOnly}
              onChange={(e) => {
                if (!isPremium) {
                  openUpgradeModal();
                  return;
                }
                setLocalFilters({ ...localFilters, verifiedOnly: e.target.checked });
              }}
              style={{
                width: '20px',
                height: '20px',
                accentColor: 'var(--berry-primary)',
                cursor: 'pointer'
              }}
            />
          </div>

          {/* Section 3: VIP Advanced Filters Header */}
          <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Crown size={16} color="var(--gold-deep)" />
                <span style={{ fontSize: '0.85rem', fontWeight: 900, color: 'var(--text-primary)' }}>
                  VIP Lifestyle & Intent Filters
                </span>
              </div>
              {!isPremium && (
                <span
                  onClick={openUpgradeModal}
                  style={{
                    fontSize: '0.72rem',
                    fontWeight: 900,
                    color: 'var(--berry-primary)',
                    cursor: 'pointer',
                    background: 'rgba(136, 19, 55, 0.08)',
                    padding: '2px 8px',
                    borderRadius: 'var(--radius-pill)'
                  }}
                >
                  Unlock VIP 👑
                </span>
              )}
            </div>

            {/* Relationship Intent */}
            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                Looking For:
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {intentOptions.map((opt) => {
                  const isSelected = localFilters.relationshipIntent === opt;
                  return (
                    <button
                      key={opt}
                      onClick={() => {
                        if (!isPremium) {
                          openUpgradeModal();
                          return;
                        }
                        setLocalFilters({
                          ...localFilters,
                          relationshipIntent: isSelected ? undefined : opt
                        });
                      }}
                      style={{
                        padding: '6px 12px',
                        borderRadius: 'var(--radius-pill)',
                        border: isSelected ? '1.5px solid var(--berry-primary)' : '1px solid var(--border-subtle)',
                        background: isSelected ? 'rgba(136, 19, 55, 0.08)' : '#FFFFFF',
                        color: isSelected ? 'var(--berry-primary)' : 'var(--text-secondary)',
                        fontSize: '0.76rem',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Zodiac Filter */}
            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                Zodiac Sign:
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {zodiacOptions.map((opt) => {
                  const isSelected = localFilters.zodiac === opt.split(' ')[0];
                  return (
                    <button
                      key={opt}
                      onClick={() => {
                        if (!isPremium) {
                          openUpgradeModal();
                          return;
                        }
                        const name = opt.split(' ')[0];
                        setLocalFilters({
                          ...localFilters,
                          zodiac: isSelected ? undefined : name
                        });
                      }}
                      style={{
                        padding: '5px 10px',
                        borderRadius: 'var(--radius-pill)',
                        border: isSelected ? '1.5px solid var(--gold-deep)' : '1px solid var(--border-subtle)',
                        background: isSelected ? '#FEFCE8' : '#FFFFFF',
                        color: isSelected ? '#854D0E' : 'var(--text-secondary)',
                        fontSize: '0.74rem',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Drinking & Workout */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  Drinking:
                </label>
                <select
                  value={localFilters.drinking || ''}
                  onChange={(e) => {
                    if (!isPremium) {
                      openUpgradeModal();
                      return;
                    }
                    setLocalFilters({ ...localFilters, drinking: e.target.value || undefined });
                  }}
                  style={{
                    width: '100%',
                    padding: '8px',
                    borderRadius: '12px',
                    border: '1px solid var(--border-subtle)',
                    fontSize: '0.78rem',
                    color: 'var(--text-primary)'
                  }}
                >
                  <option value="">Any</option>
                  {drinkingOptions.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  Workout:
                </label>
                <select
                  value={localFilters.workout || ''}
                  onChange={(e) => {
                    if (!isPremium) {
                      openUpgradeModal();
                      return;
                    }
                    setLocalFilters({ ...localFilters, workout: e.target.value || undefined });
                  }}
                  style={{
                    width: '100%',
                    padding: '8px',
                    borderRadius: '12px',
                    border: '1px solid var(--border-subtle)',
                    fontSize: '0.78rem',
                    color: 'var(--text-primary)'
                  }}
                >
                  <option value="">Any</option>
                  {workoutOptions.map((w) => (
                    <option key={w} value={w}>{w}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
            <Button
              variant="outline"
              size="md"
              onClick={handleReset}
              style={{ flex: 1 }}
            >
              <RotateCcw size={15} /> Reset
            </Button>
            <Button
              variant="primary"
              size="md"
              onClick={handleApply}
              style={{ flex: 2, boxShadow: 'var(--shadow-berry-glow)' }}
            >
              <Check size={16} /> Apply Filters
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
