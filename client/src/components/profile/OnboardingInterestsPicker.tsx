import React from 'react';
import { MIORA_INTERESTS_GRID, MIORA_LOOKING_FOR_OPTIONS, MioraInterestDetail } from '../../data/mockData';
import { Check } from 'lucide-react';

interface OnboardingInterestsPickerProps {
  selectedLookingFor?: string;
  onLookingForChange: (intent: string) => void;
  selectedInterests: string[];
  onInterestsChange: (interests: string[]) => void;
  minSelection?: number;
  maxSelection?: number;
}

export const OnboardingInterestsPicker: React.FC<OnboardingInterestsPickerProps> = ({
  selectedLookingFor,
  onLookingForChange,
  selectedInterests,
  onInterestsChange,
  minSelection = 3,
  maxSelection = 8
}) => {
  const toggleInterest = (name: string) => {
    if (selectedInterests.includes(name)) {
      onInterestsChange(selectedInterests.filter((i) => i !== name));
    } else {
      if (selectedInterests.length < maxSelection) {
        onInterestsChange([...selectedInterests, name]);
      }
    }
  };

  const isMinReached = selectedInterests.length >= minSelection;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Section 1: I'm Looking For... */}
      <div>
        <div style={{ marginBottom: '12px' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#261D20', margin: '0 0 4px 0' }}>
            I'm looking for...
          </h3>
          <p style={{ fontSize: '0.82rem', color: '#7D1730', margin: 0, fontWeight: 500 }}>
            Tell us what kind of connection you are hoping to find.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
            gap: '10px'
          }}
        >
          {MIORA_LOOKING_FOR_OPTIONS.map((opt) => {
            const isSelected = selectedLookingFor === opt.label;
            return (
              <button
                type="button"
                key={opt.id}
                onClick={() => onLookingForChange(opt.label)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 14px',
                  borderRadius: '16px',
                  border: isSelected ? '2px solid #A91E45' : '1.5px solid #F4C5CF',
                  background: isSelected ? '#FBEDEF' : '#FFFFFF',
                  color: isSelected ? '#7D1730' : '#261D20',
                  fontSize: '0.84rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  boxShadow: isSelected ? '0 4px 14px rgba(169, 30, 69, 0.15)' : '0 2px 6px rgba(0, 0, 0, 0.02)',
                  transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                  textAlign: 'left'
                }}
              >
                <span style={{ fontSize: '1.1rem' }}>{opt.icon}</span>
                <span style={{ flex: 1, lineHeight: 1.2 }}>{opt.label}</span>
                {isSelected && (
                  <span
                    style={{
                      width: '18px',
                      height: '18px',
                      borderRadius: '50%',
                      background: '#A91E45',
                      color: '#FFFFFF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}
                  >
                    <Check size={11} strokeWidth={3} />
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Section 2: Interests & Activities 2-Column Grid */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '14px' }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#261D20', margin: '0 0 4px 0' }}>
              Interests & Activities
            </h3>
            <p style={{ fontSize: '0.82rem', color: '#7D1730', margin: 0, fontWeight: 500 }}>
              Pick the things that feel like you.
            </p>
          </div>

          <div
            style={{
              fontSize: '0.8rem',
              fontWeight: 800,
              padding: '4px 12px',
              borderRadius: '9999px',
              background: isMinReached ? '#ECFDF5' : '#FEF2F2',
              color: isMinReached ? '#059669' : '#DC2626',
              border: isMinReached ? '1px solid #A7F3D0' : '1px solid #FECACA',
              whiteSpace: 'nowrap'
            }}
          >
            {selectedInterests.length}/{maxSelection} selected
          </div>
        </div>

        {!isMinReached && (
          <div style={{ fontSize: '0.76rem', color: '#DC2626', marginBottom: '10px', fontWeight: 600 }}>
            ⚠️ Please select at least {minSelection} interests to continue ({minSelection - selectedInterests.length} more required)
          </div>
        )}

        {/* 2-Column Grid matching reference image */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '12px'
          }}
        >
          {MIORA_INTERESTS_GRID.map((item: MioraInterestDetail) => {
            const isSelected = selectedInterests.includes(item.name);
            return (
              <div
                key={item.id}
                onClick={() => toggleInterest(item.name)}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '18px 12px',
                  borderRadius: '22px',
                  border: isSelected ? '2px solid #A91E45' : '1.5px solid #F4C5CF',
                  background: isSelected ? '#FBEDEF' : '#FFFFFF',
                  cursor: 'pointer',
                  boxShadow: isSelected ? '0 6px 18px rgba(169, 30, 69, 0.16)' : '0 2px 8px rgba(0,0,0,0.03)',
                  transition: 'all 0.22s cubic-bezier(0.16, 1, 0.3, 1)',
                  position: 'relative',
                  userSelect: 'none'
                }}
              >
                {/* Selected Checkmark Badge */}
                {isSelected && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '10px',
                      right: '10px',
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                      background: '#A91E45',
                      color: '#FFFFFF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 2px 6px rgba(169, 30, 69, 0.3)'
                    }}
                  >
                    <Check size={12} strokeWidth={3} />
                  </div>
                )}

                {/* Big Emoji / Icon */}
                <div style={{ fontSize: '2.1rem', marginBottom: '8px', filter: isSelected ? 'drop-shadow(0 2px 4px rgba(169, 30, 69, 0.2))' : 'none' }}>
                  {item.icon}
                </div>

                {/* Title */}
                <div style={{ fontSize: '0.94rem', fontWeight: 800, color: '#261D20', textAlign: 'center', lineHeight: 1.2 }}>
                  {item.name}
                </div>

                {/* Subtitle */}
                <div style={{ fontSize: '0.74rem', color: isSelected ? '#7D1730' : '#8A7A80', marginTop: '3px', textAlign: 'center' }}>
                  {item.subtitle}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
