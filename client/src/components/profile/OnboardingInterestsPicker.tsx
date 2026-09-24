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

/* ─── Responsive breakpoint helper (CSS-in-JS) ─── */
const useIsMobile = () => {
  const [isMobile, setIsMobile] = React.useState(window.innerWidth < 480);
  React.useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 480);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);
  return isMobile;
};

export const OnboardingInterestsPicker: React.FC<OnboardingInterestsPickerProps> = ({
  selectedLookingFor,
  onLookingForChange,
  selectedInterests,
  onInterestsChange,
  minSelection = 3,
  maxSelection = 8
}) => {
  const isMobile = useIsMobile();

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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>

      {/* ─── Section 1: I'm Looking For ─── */}
      <div>
        <div style={{ marginBottom: '16px' }}>
          <h3
            style={{
              fontSize: isMobile ? '1.05rem' : '1.15rem',
              fontWeight: 800,
              color: 'var(--text-primary, #261D20)',
              margin: '0 0 6px 0',
              fontFamily: 'var(--font-serif, inherit)'
            }}
          >
            I'm looking for...
          </h3>
          <p
            style={{
              fontSize: '0.82rem',
              color: 'var(--primary-berry, #7D1730)',
              margin: 0,
              fontWeight: 500,
              lineHeight: 1.4
            }}
          >
            Tell us what kind of connection you are hoping to find.
          </p>
        </div>

        {/* Looking-for chips — single column on narrow mobile, auto-fit otherwise */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(auto-fit, minmax(155px, 1fr))',
            gap: isMobile ? '8px' : '10px'
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
                  padding: isMobile ? '10px 12px' : '12px 14px',
                  borderRadius: '14px',
                  border: isSelected ? '2px solid #A91E45' : '1.5px solid #F4C5CF',
                  background: isSelected ? '#FBEDEF' : '#FFFFFF',
                  color: isSelected ? '#7D1730' : '#261D20',
                  fontSize: isMobile ? '0.78rem' : '0.84rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  boxShadow: isSelected
                    ? '0 4px 14px rgba(169, 30, 69, 0.15)'
                    : '0 1px 4px rgba(0, 0, 0, 0.04)',
                  transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                  textAlign: 'left',
                  fontFamily: 'var(--font-sans, inherit)',
                  outline: 'none',
                  WebkitTapHighlightColor: 'transparent'
                }}
              >
                <span style={{ fontSize: isMobile ? '1rem' : '1.1rem', flexShrink: 0 }}>{opt.icon}</span>
                <span style={{ flex: 1, lineHeight: 1.25 }}>{opt.label}</span>
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

      {/* ─── Section 2: Interests & Activities ─── */}
      <div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            marginBottom: '14px',
            gap: '12px',
            flexWrap: 'wrap'
          }}
        >
          <div style={{ minWidth: 0, flex: 1 }}>
            <h3
              style={{
                fontSize: isMobile ? '1.1rem' : '1.25rem',
                fontWeight: 900,
                color: 'var(--text-primary, #261D20)',
                margin: '0 0 4px 0',
                fontFamily: 'var(--font-serif, inherit)'
              }}
            >
              Interests & Activities
            </h3>
            <p
              style={{
                fontSize: '0.82rem',
                color: 'var(--primary-berry, #7D1730)',
                margin: 0,
                fontWeight: 500,
                lineHeight: 1.4
              }}
            >
              Pick the things that feel like you.
            </p>
          </div>

          {/* Counter badge */}
          <div
            style={{
              fontSize: '0.78rem',
              fontWeight: 800,
              padding: '5px 14px',
              borderRadius: '9999px',
              background: isMinReached ? '#ECFDF5' : '#FEF2F2',
              color: isMinReached ? '#059669' : '#DC2626',
              border: isMinReached ? '1px solid #A7F3D0' : '1px solid #FECACA',
              whiteSpace: 'nowrap',
              flexShrink: 0
            }}
          >
            {selectedInterests.length}/{maxSelection} selected
          </div>
        </div>

        {!isMinReached && (
          <div
            style={{
              fontSize: '0.76rem',
              color: '#DC2626',
              marginBottom: '12px',
              fontWeight: 600,
              lineHeight: 1.4
            }}
          >
            ⚠️ Please select at least {minSelection} interests to continue ({minSelection - selectedInterests.length} more
            required)
          </div>
        )}

        {/* Responsive interests grid: 3 cols mobile, 3-4 cols tablet/desktop */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: isMobile
              ? 'repeat(3, 1fr)'
              : 'repeat(auto-fill, minmax(130px, 1fr))',
            gap: isMobile ? '8px' : '12px'
          }}
        >
          {MIORA_INTERESTS_GRID.map((item: MioraInterestDetail) => {
            const isSelected = selectedInterests.includes(item.name);
            return (
              <div
                key={item.id}
                onClick={() => toggleInterest(item.name)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleInterest(item.name); } }}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: isMobile ? '12px 6px' : '18px 12px',
                  borderRadius: isMobile ? '16px' : '20px',
                  border: isSelected ? '2px solid #A91E45' : '1.5px solid #F4C5CF',
                  background: isSelected ? '#FBEDEF' : '#FFFFFF',
                  cursor: 'pointer',
                  boxShadow: isSelected
                    ? '0 4px 14px rgba(169, 30, 69, 0.14)'
                    : '0 1px 4px rgba(0, 0, 0, 0.03)',
                  transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                  position: 'relative',
                  userSelect: 'none',
                  WebkitTapHighlightColor: 'transparent',
                  outline: 'none',
                  minHeight: isMobile ? '80px' : '100px'
                }}
              >
                {/* Selected checkmark */}
                {isSelected && (
                  <div
                    style={{
                      position: 'absolute',
                      top: isMobile ? '6px' : '8px',
                      right: isMobile ? '6px' : '8px',
                      width: isMobile ? '16px' : '20px',
                      height: isMobile ? '16px' : '20px',
                      borderRadius: '50%',
                      background: '#A91E45',
                      color: '#FFFFFF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 2px 6px rgba(169, 30, 69, 0.3)'
                    }}
                  >
                    <Check size={isMobile ? 10 : 12} strokeWidth={3} />
                  </div>
                )}

                {/* Emoji icon */}
                <div
                  style={{
                    fontSize: isMobile ? '1.5rem' : '2rem',
                    marginBottom: isMobile ? '4px' : '8px',
                    lineHeight: 1,
                    filter: isSelected ? 'drop-shadow(0 2px 4px rgba(169, 30, 69, 0.2))' : 'none'
                  }}
                >
                  {item.icon}
                </div>

                {/* Title */}
                <div
                  style={{
                    fontSize: isMobile ? '0.72rem' : '0.9rem',
                    fontWeight: 800,
                    color: 'var(--text-primary, #261D20)',
                    textAlign: 'center',
                    lineHeight: 1.2,
                    fontFamily: 'var(--font-sans, inherit)'
                  }}
                >
                  {item.name}
                </div>

                {/* Subtitle — hide on very small screens for cleanliness */}
                {!isMobile && (
                  <div
                    style={{
                      fontSize: '0.72rem',
                      color: isSelected ? '#7D1730' : '#8A7A80',
                      marginTop: '3px',
                      textAlign: 'center',
                      lineHeight: 1.2
                    }}
                  >
                    {item.subtitle}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
