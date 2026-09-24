import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { OnboardingInterestsPicker } from '../components/profile/OnboardingInterestsPicker';
import { MapPin, User, ChevronRight, ChevronLeft, ArrowRight } from 'lucide-react';

export const ProfileSetupPage: React.FC = () => {
  const { currentUser, updateUserProfile, setCurrentView } = useApp();

  const [step, setStep] = useState<1 | 2>(1);

  // Step 1 State
  const [name, setName] = useState(currentUser.name || 'Dev');
  const [age, setAge] = useState(currentUser.age > 0 ? String(currentUser.age) : '');
  const [location, setLocation] = useState(currentUser.location || 'Bangalore, India');
  const [bio, setBio] = useState(
    currentUser.bio ||
      'Product designer obsessed with aesthetics, indie music, slow coffee, and weekend getaways.'
  );

  // Step 2 State (Right Phone Reference Image)
  const [relationshipIntent, setRelationshipIntent] = useState<string>(
    currentUser.relationshipIntent || 'Long-term Relationship'
  );
  const [interests, setInterests] = useState<string[]>(
    currentUser.interests.length > 0
      ? currentUser.interests
      : ['Music', 'Travel', 'Movies', 'Food', 'Gaming']
  );

  const handleNextStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2);
  };

  const handleFinishOnboarding = async () => {
    if (interests.length < 3) return;

    await updateUserProfile({
      name: name.trim(),
      age: Number(age),
      location: location.trim(),
      bio: bio.trim(),
      relationshipIntent: relationshipIntent as any,
      interests,
      profileCompletion: 75
    });

    setCurrentView('add-photos');
  };

  return (
    <div
      style={{
        width: '100%',
        maxWidth: '560px',
        margin: '0 auto',
        padding: '16px 16px 60px 16px',
        animation: 'fadeIn 0.3s ease-out forwards',
        boxSizing: 'border-box'
      }}
    >
      {/* Top Header & Slim Cherry Progress Bar matching Right Phone Reference */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          {step === 2 && (
            <button
              onClick={() => setStep(1)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                background: 'transparent',
                border: 'none',
                color: '#7D1730',
                fontSize: '0.84rem',
                fontWeight: 700,
                cursor: 'pointer',
                padding: 0
              }}
            >
              <ChevronLeft size={16} /> Back
            </button>
          )}
          <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#A91E45', textTransform: 'uppercase', letterSpacing: '0.08em', marginLeft: step === 1 ? 'auto' : 0 }}>
            Step {step} of 4 • {step === 1 ? 'About You' : 'Interests & Intent'}
          </span>
        </div>

        {/* Slim Cherry Progress Bar */}
        <div
          style={{
            width: '100%',
            height: '8px',
            borderRadius: '4px',
            background: '#FBEDEF',
            overflow: 'hidden'
          }}
        >
          <div
            style={{
              width: step === 1 ? '25%' : '50%',
              height: '100%',
              background: 'linear-gradient(90deg, #7D1730 0%, #A91E45 50%, #C52E59 100%)',
              borderRadius: '4px',
              transition: 'width 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
            }}
          />
        </div>
      </div>

      {step === 1 ? (
        /* STEP 1: BASIC IDENTITY FORM */
        <div>
          <div style={{ marginBottom: '20px' }}>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#261D20', margin: '0 0 4px 0' }}>
              Tell Us About Yourself
            </h1>
            <p style={{ fontSize: '0.88rem', color: '#7D1730', margin: 0, fontWeight: 500 }}>
              Help us discover people who resonate with your vibe and lifestyle.
            </p>
          </div>

          <form
            onSubmit={handleNextStep1}
            style={{
              background: '#FFFFFF',
              borderRadius: '24px',
              padding: '24px',
              border: '1.5px solid #F4C5CF',
              boxShadow: '0 10px 30px rgba(125, 23, 48, 0.08)',
              display: 'flex',
              flexDirection: 'column',
              gap: '20px'
            }}
          >
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '14px' }}>
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
                onChange={(e) => setAge(e.target.value)}
                placeholder="Your age"
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
              <label style={{ fontSize: '0.84rem', fontWeight: 700, color: '#261D20', display: 'block', marginBottom: '6px' }}>
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
                  borderRadius: '16px',
                  border: '1.5px solid #F4C5CF',
                  background: '#F7F2EE',
                  fontSize: '0.92rem',
                  color: '#261D20',
                  outline: 'none',
                  resize: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <button
              type="submit"
              style={{
                width: '100%',
                background: 'linear-gradient(135deg, #7D1730 0%, #A91E45 100%)',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '9999px',
                padding: '16px',
                fontSize: '1rem',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 6px 20px rgba(125, 23, 48, 0.3)'
              }}
            >
              <span>Continue</span>
              <ArrowRight size={18} />
            </button>
          </form>
        </div>
      ) : (
        /* STEP 2: LOOKING FOR & INTERESTS 2-COLUMN GRID (RIGHT PHONE REFERENCE IMAGE) */
        <div>
          <OnboardingInterestsPicker
            selectedLookingFor={relationshipIntent}
            onLookingForChange={setRelationshipIntent}
            selectedInterests={interests}
            onInterestsChange={setInterests}
            minSelection={3}
            maxSelection={8}
          />

          {/* Floating Pill Next Button matching reference image */}
          <div
            style={{
              position: 'sticky',
              bottom: '16px',
              marginTop: '32px',
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
              zIndex: 30
            }}
          >
            <button
              type="button"
              onClick={handleFinishOnboarding}
              disabled={interests.length < 3}
              style={{
                background: interests.length >= 3
                  ? 'linear-gradient(135deg, #7D1730 0%, #A91E45 100%)'
                  : '#CBD5E1',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '9999px',
                padding: '14px 44px',
                fontSize: '1rem',
                fontWeight: 900,
                cursor: interests.length >= 3 ? 'pointer' : 'not-allowed',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                boxShadow: interests.length >= 3 ? '0 10px 28px rgba(125, 23, 48, 0.4)' : 'none',
                transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
              }}
            >
              <span>Next</span>
              <span
                style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  background: 'rgba(255, 255, 255, 0.25)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <ChevronRight size={16} strokeWidth={3} />
              </span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
