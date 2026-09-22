import React from 'react';
import { AVAILABLE_INTERESTS } from '../../data/mockData';

interface InterestPickerProps {
  selectedInterests: string[];
  onChange: (interests: string[]) => void;
  maxSelection?: number;
}

export const InterestPicker: React.FC<InterestPickerProps> = ({
  selectedInterests,
  onChange,
  maxSelection = 6
}) => {
  const toggleInterest = (name: string) => {
    if (selectedInterests.includes(name)) {
      onChange(selectedInterests.filter((item) => item !== name));
    } else {
      if (selectedInterests.length < maxSelection) {
        onChange([...selectedInterests, name]);
      }
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
          Selected {selectedInterests.length}/{maxSelection}
        </span>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
        {AVAILABLE_INTERESTS.map((interest) => {
          const isSelected = selectedInterests.includes(interest.name);
          return (
            <button
              type="button"
              key={interest.id}
              onClick={() => toggleInterest(interest.name)}
              className={`pill ${isSelected ? 'pill-selected' : 'pill-default'}`}
              style={{
                fontSize: '0.88rem',
                padding: '8px 16px',
                border: isSelected ? '1.5px solid transparent' : '1.5px solid var(--border-subtle)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer'
              }}
            >
              <span>{interest.icon}</span>
              <span>{interest.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
