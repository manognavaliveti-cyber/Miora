import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { MioraLogo } from '../components/common/MioraLogo';
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ChevronLeft,
  Calendar,
  ShieldAlert,
  Sparkles
} from 'lucide-react';

export const SignupPage: React.FC = () => {
  const { signup, setCurrentView } = useApp();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [dob, setDob] = useState('2001-08-15');
  const [gender, setGender] = useState<'woman' | 'man' | 'non-binary' | 'prefer-not-to-say'>('woman');
  const [termsAgreed, setTermsAgreed] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateAge = (birthDateStr: string): boolean => {
    const birthDate = new Date(birthDateStr);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age >= 18;
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!name.trim()) newErrors.name = 'Full name is required';
    if (!email.trim() || !email.includes('@')) newErrors.email = 'Valid email is required';
    if (!password || password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (!dob) {
      newErrors.dob = 'Date of birth is required';
    } else if (!validateAge(dob)) {
      newErrors.dob = 'You must be at least 18 years old to join MIORA.';
    }
    if (!termsAgreed) {
      newErrors.terms = 'Please accept the Terms & Conditions and Privacy Policy to continue.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const birthDate = new Date(dob);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();

    signup({
      name: name.trim(),
      email: email.trim(),
      dateOfBirth: dob,
      age,
      gender,
      termsAccepted: true,
      termsVersion: '1.0',
      termsAcceptedAt: new Date().toISOString()
    });
  };

  const handleGoogleSignup = () => {
    if (!termsAgreed) {
      setErrors((prev) => ({
        ...prev,
        terms: 'Please agree to the Terms & Conditions and Privacy Policy before signing up with Google.'
      }));
      return;
    }

    signup({
      name: 'Google User',
      email: 'user@gmail.com',
      dateOfBirth: '2001-08-15',
      age: 25,
      gender: 'woman',
      termsAccepted: true,
      termsVersion: '1.0',
      termsAcceptedAt: new Date().toISOString()
    });
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100%',
        background: 'linear-gradient(180deg, #FFF0F3 0%, #FFEBF0 45%, #FFF5F7 100%)',
        position: 'relative',
        overflowX: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'clamp(20px, 4vw, 48px) 16px',
        fontFamily: 'var(--font-primary)'
      }}
    >
      {/* ====================================================
          ORGANIC BACKGROUND CURVES & BOTANICAL LEAF SHADOWS
          ==================================================== */}
      {/* Botanical Leaf Shadow Overlay (Left Side) */}
      <svg
        viewBox="0 0 400 800"
        style={{
          position: 'absolute',
          top: '3%',
          left: '-50px',
          width: 'clamp(240px, 35vw, 480px)',
          height: 'auto',
          opacity: 0.16,
          pointerEvents: 'none',
          filter: 'blur(3px)',
          zIndex: 0
        }}
      >
        <path
          d="M 50 100 Q 140 250 60 400 Q 160 550 40 750"
          stroke="#9F1239"
          strokeWidth="6"
          fill="none"
          strokeLinecap="round"
        />
        <path d="M 60 180 C 130 150 180 200 130 250 C 90 230 60 200 60 180 Z" fill="#9F1239" />
        <path d="M 80 280 C 170 260 210 320 150 370 C 100 350 80 300 80 280 Z" fill="#9F1239" />
        <path d="M 60 380 C 140 370 190 440 120 480 C 80 450 60 410 60 380 Z" fill="#9F1239" />
        <path d="M 70 490 C 160 480 210 560 130 600 C 90 560 70 520 70 490 Z" fill="#9F1239" />
        <path d="M 50 610 C 130 610 170 690 100 720 C 70 680 50 640 50 610 Z" fill="#9F1239" />
      </svg>

      {/* Abstract Background Arcs */}
      <div
        style={{
          position: 'absolute',
          top: '-80px',
          left: '-60px',
          width: '440px',
          height: '440px',
          borderRadius: '50%',
          border: '1.5px solid rgba(244, 63, 94, 0.18)',
          pointerEvents: 'none',
          zIndex: 0
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '-120px',
          right: '-80px',
          width: '520px',
          height: '520px',
          borderRadius: '50%',
          border: '1.5px solid rgba(244, 63, 94, 0.18)',
          pointerEvents: 'none',
          zIndex: 0
        }}
      />

      {/* Ambient Top Right Glow */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: '480px',
          height: '380px',
          background: 'radial-gradient(ellipse at top right, rgba(254, 205, 211, 0.55) 0%, rgba(255, 241, 245, 0) 70%)',
          pointerEvents: 'none',
          zIndex: 0
        }}
      />

      {/* Middle Left: "REAL PEOPLE BRIGHTER STORIES" (Desktop Only to prevent overlap) */}
      <div
        className="desktop-only"
        style={{
          position: 'absolute',
          top: 'clamp(260px, 38vh, 380px)',
          left: 'clamp(14px, 4vw, 60px)',
          textAlign: 'left',
          zIndex: 1,
          opacity: 0.75
        }}
      >
        <span
          style={{
            display: 'block',
            fontSize: '0.68rem',
            fontWeight: 800,
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color: '#8A7A82',
            lineHeight: 1.7
          }}
        >
          REAL<br />
          PEOPLE<br />
          BRIGHTER<br />
          STORIES
        </span>
        <div style={{ width: '32px', height: '1.5px', background: '#D8B4BE', marginTop: '6px' }} />
      </div>

      {/* ====================================================
          RESPONSIVE CARD CONTENT (DESKTOP SPLIT & MOBILE VIEW)
          ==================================================== */}
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          width: '100%',
          maxWidth: '1080px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '20px'
        }}
      >
        {/* Top Floating Logo & Back Bar on Mobile */}
        <div
          className="mobile-only"
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '4px'
          }}
        >
          <button
            type="button"
            onClick={() => setCurrentView('welcome')}
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: '#FFFFFF',
              border: '1px solid var(--border-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: 'var(--text-primary)',
              boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
            }}
          >
            <ChevronLeft size={20} />
          </button>
          <MioraLogo size={68} showTagline={false} showWordmark={true} vertical={false} />
          <div style={{ width: '40px' }} />
        </div>

        {/* Desktop Split Container / Mobile Card */}
        <div
          style={{
            width: '100%',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))',
            gap: 'clamp(20px, 4vw, 48px)',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {/* Desktop Left Hero Card (Photo 2) */}
          <div
            className="desktop-only"
            style={{
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: '24px',
              padding: '40px',
              background: 'linear-gradient(145deg, #FFE8EE 0%, #FFDCE5 100%)',
              borderRadius: '34px',
              border: '1.5px solid rgba(244, 63, 94, 0.22)',
              boxShadow: '0 20px 60px rgba(190, 18, 60, 0.08)',
              minHeight: '560px'
            }}
          >
            <div>
              {/* Back Button & Logo */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px' }}>
                <button
                  type="button"
                  onClick={() => setCurrentView('welcome')}
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '50%',
                    background: '#FFFFFF',
                    border: '1px solid var(--border-subtle)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    color: 'var(--text-primary)',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
                  }}
                >
                  <ChevronLeft size={20} />
                </button>

                <MioraLogo size={46} showTagline={false} showWordmark={true} vertical={false} />
              </div>

              {/* Left Hero Titles */}
              <span
                style={{
                  fontSize: '0.74rem',
                  fontWeight: 800,
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  color: '#E11D48',
                  display: 'block',
                  marginBottom: '10px'
                }}
              >
                CREATE YOUR ACCOUNT
              </span>

              <h1
                style={{
                  fontSize: 'clamp(2.1rem, 3.2vw, 2.8rem)',
                  fontWeight: 800,
                  color: '#1C1217',
                  letterSpacing: '-0.025em',
                  lineHeight: 1.18,
                  margin: 0
                }}
              >
                Meet people who resonate with your vibe.
              </h1>

              <p
                style={{
                  fontSize: '1rem',
                  color: '#7E6E77',
                  marginTop: '14px',
                  lineHeight: 1.6
                }}
              >
                Join a bespoke community designed for sincere connections, shared passions, and genuine romance.
              </p>
            </div>

            {/* Curated Daily Stacks Pill */}
            <div
              style={{
                padding: '12px 20px',
                borderRadius: '9999px',
                background: 'rgba(255, 255, 255, 0.94)',
                border: '1px solid var(--border-gold)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                width: 'fit-content',
                boxShadow: '0 4px 14px rgba(225, 29, 72, 0.08)'
              }}
            >
              <Sparkles size={16} color="var(--gold-deep)" />
              <span style={{ fontSize: '0.84rem', color: '#BE123C', fontWeight: 700 }}>
                Curated daily stacks • Privacy protected • Verified real singles ✨
              </span>
            </div>
          </div>

          {/* Right Floating Card (Matching Photos 1 & 2) */}
          <div
            style={{
              width: '100%',
              maxWidth: '480px',
              margin: '0 auto',
              background: '#FFFFFF',
              borderRadius: '34px',
              padding: 'clamp(28px, 5vw, 40px) clamp(20px, 4vw, 36px)',
              boxShadow: '0 20px 60px rgba(190, 18, 60, 0.08), 0 4px 16px rgba(0, 0, 0, 0.02)',
              border: '1px solid rgba(254, 226, 232, 0.85)',
              display: 'flex',
              flexDirection: 'column',
              gap: '20px',
              animation: 'popIn 0.35s ease-out'
            }}
          >
            {/* Card Header */}
            <div>
              <div className="mobile-only" style={{ marginBottom: '8px' }}>
                <span
                  style={{
                    fontSize: '0.74rem',
                    fontWeight: 800,
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    color: '#E11D48',
                    display: 'block'
                  }}
                >
                  CREATE YOUR ACCOUNT
                </span>
              </div>

              <h2
                style={{
                  fontSize: 'clamp(1.65rem, 2.8vw, 2.1rem)',
                  fontWeight: 800,
                  color: '#1C1217',
                  letterSpacing: '-0.02em',
                  lineHeight: 1.2,
                  margin: 0
                }}
              >
                Create Account
              </h2>

              <p
                style={{
                  fontSize: '0.9rem',
                  color: '#7E6E77',
                  marginTop: '6px',
                  lineHeight: 1.5,
                  margin: '6px 0 0 0'
                }}
              >
                Enter your details to begin your personalized profile.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSignup} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {/* Full Name */}
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#64748B', marginBottom: '6px' }}>
                  Full Name
                </label>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    background: '#F6F3F5',
                    borderRadius: '16px',
                    padding: '13px 18px',
                    border: errors.name ? '1.5px solid #F43F5E' : '1px solid rgba(0,0,0,0.03)',
                    transition: 'border-color var(--transition-fast)'
                  }}
                >
                  <User size={18} color="#94A3B8" />
                  <input
                    type="text"
                    placeholder="e.g. Priya Sharma"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      setErrors((prev) => ({ ...prev, name: '' }));
                    }}
                    style={{
                      flex: 1,
                      background: 'transparent',
                      border: 'none',
                      outline: 'none',
                      fontSize: '0.94rem',
                      color: '#1C1217',
                      fontWeight: 500
                    }}
                  />
                </div>
                {errors.name && (
                  <span style={{ fontSize: '0.74rem', color: '#F43F5E', fontWeight: 600, marginTop: '4px', display: 'block', marginLeft: '6px' }}>
                    {errors.name}
                  </span>
                )}
              </div>

              {/* Email Address */}
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#64748B', marginBottom: '6px' }}>
                  Email Address
                </label>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    background: '#F6F3F5',
                    borderRadius: '16px',
                    padding: '13px 18px',
                    border: errors.email ? '1.5px solid #F43F5E' : '1px solid rgba(0,0,0,0.03)',
                    transition: 'border-color var(--transition-fast)'
                  }}
                >
                  <Mail size={18} color="#94A3B8" />
                  <input
                    type="email"
                    placeholder="priya@example.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setErrors((prev) => ({ ...prev, email: '' }));
                    }}
                    style={{
                      flex: 1,
                      background: 'transparent',
                      border: 'none',
                      outline: 'none',
                      fontSize: '0.94rem',
                      color: '#1C1217',
                      fontWeight: 500
                    }}
                  />
                </div>
                {errors.email && (
                  <span style={{ fontSize: '0.74rem', color: '#F43F5E', fontWeight: 600, marginTop: '4px', display: 'block', marginLeft: '6px' }}>
                    {errors.email}
                  </span>
                )}
              </div>

              {/* Password */}
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#64748B', marginBottom: '6px' }}>
                  Password
                </label>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    background: '#F6F3F5',
                    borderRadius: '16px',
                    padding: '13px 18px',
                    border: errors.password ? '1.5px solid #F43F5E' : '1px solid rgba(0,0,0,0.03)',
                    transition: 'border-color var(--transition-fast)'
                  }}
                >
                  <Lock size={18} color="#94A3B8" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Create password (6+ characters)"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setErrors((prev) => ({ ...prev, password: '' }));
                    }}
                    style={{
                      flex: 1,
                      background: 'transparent',
                      border: 'none',
                      outline: 'none',
                      fontSize: '0.94rem',
                      color: '#1C1217',
                      fontWeight: 500
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      color: '#94A3B8',
                      display: 'flex',
                      alignItems: 'center',
                      padding: 0
                    }}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.password && (
                  <span style={{ fontSize: '0.74rem', color: '#F43F5E', fontWeight: 600, marginTop: '4px', display: 'block', marginLeft: '6px' }}>
                    {errors.password}
                  </span>
                )}
              </div>

              {/* Date of Birth */}
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#64748B', marginBottom: '6px' }}>
                  Date of Birth
                </label>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    background: '#F6F3F5',
                    borderRadius: '16px',
                    padding: '13px 18px',
                    border: errors.dob ? '1.5px solid #F43F5E' : '1px solid rgba(0,0,0,0.03)'
                  }}
                >
                  <Calendar size={18} color="#94A3B8" />
                  <input
                    type="date"
                    value={dob}
                    onChange={(e) => {
                      setDob(e.target.value);
                      setErrors((prev) => ({ ...prev, dob: '' }));
                    }}
                    style={{
                      flex: 1,
                      background: 'transparent',
                      border: 'none',
                      outline: 'none',
                      fontSize: '0.94rem',
                      color: '#1C1217',
                      fontWeight: 500,
                      cursor: 'pointer'
                    }}
                  />
                </div>
                {errors.dob && (
                  <span style={{ fontSize: '0.74rem', color: '#F43F5E', fontWeight: 600, marginTop: '4px', display: 'block', marginLeft: '6px' }}>
                    {errors.dob}
                  </span>
                )}
              </div>

              {/* Gender Identity Pills */}
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#64748B', marginBottom: '8px' }}>
                  I identify as
                </label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {[
                    { id: 'woman', label: 'Woman' },
                    { id: 'man', label: 'Man' },
                    { id: 'non-binary', label: 'Non-binary' },
                    { id: 'prefer-not-to-say', label: 'Prefer not to say' }
                  ].map((item) => {
                    const isSelected = gender === item.id;
                    return (
                      <button
                        type="button"
                        key={item.id}
                        onClick={() => setGender(item.id as any)}
                        style={{
                          padding: '7px 16px',
                          borderRadius: '9999px',
                          border: isSelected ? '1.5px solid transparent' : '1px solid #E2E8F0',
                          background: isSelected ? 'linear-gradient(135deg, #F43F5E 0%, #BE123C 100%)' : '#FFFFFF',
                          color: isSelected ? '#FFFFFF' : '#475569',
                          fontWeight: isSelected ? 700 : 600,
                          fontSize: '0.82rem',
                          cursor: 'pointer',
                          boxShadow: isSelected ? '0 4px 12px rgba(244, 63, 94, 0.28)' : 'none',
                          transition: 'all var(--transition-fast)'
                        }}
                      >
                        {item.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 18+ Safety Notice Banner */}
              <div
                style={{
                  padding: '12px 14px',
                  borderRadius: '16px',
                  background: 'rgba(254, 226, 232, 0.5)',
                  border: '1px solid rgba(244, 63, 94, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  fontSize: '0.76rem',
                  color: '#881337',
                  lineHeight: 1.45
                }}
              >
                <ShieldAlert size={18} color="#E11D48" style={{ flexShrink: 0 }} />
                <span>
                  By continuing, you confirm that you are at least 18 years old and agree to MIORA’s Safety Guidelines.
                </span>
              </div>

              {/* Terms & Conditions and Privacy Policy Consent Checkbox */}
              <div style={{ marginTop: '4px', marginBottom: '4px' }}>
                <label
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '10px',
                    cursor: 'pointer',
                    fontSize: '0.82rem',
                    color: '#334155',
                    lineHeight: 1.5,
                    userSelect: 'none'
                  }}
                >
                  <input
                    type="checkbox"
                    id="terms-consent-checkbox"
                    checked={termsAgreed}
                    onChange={(e) => {
                      setTermsAgreed(e.target.checked);
                      if (e.target.checked) {
                        setErrors((prev) => ({ ...prev, terms: '' }));
                      }
                    }}
                    style={{
                      marginTop: '3px',
                      width: '18px',
                      height: '18px',
                      accentColor: '#F43F5E',
                      cursor: 'pointer',
                      borderRadius: '4px'
                    }}
                  />
                  <span>
                    I agree to the{' '}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setCurrentView('terms');
                      }}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#E11D48',
                        fontWeight: 700,
                        textDecoration: 'underline',
                        cursor: 'pointer',
                        padding: 0,
                        fontSize: 'inherit',
                        fontFamily: 'inherit'
                      }}
                    >
                      Terms & Conditions
                    </button>{' '}
                    and{' '}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setCurrentView('privacy');
                      }}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#E11D48',
                        fontWeight: 700,
                        textDecoration: 'underline',
                        cursor: 'pointer',
                        padding: 0,
                        fontSize: 'inherit',
                        fontFamily: 'inherit'
                      }}
                    >
                      Privacy Policy
                    </button>
                    .
                  </span>
                </label>
                {errors.terms && (
                  <span
                    style={{
                      fontSize: '0.74rem',
                      color: '#F43F5E',
                      fontWeight: 600,
                      marginTop: '5px',
                      display: 'block',
                      marginLeft: '28px'
                    }}
                  >
                    {errors.terms}
                  </span>
                )}
              </div>

              {/* Primary Create Account Button */}
              <button
                type="submit"
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  background: 'linear-gradient(135deg, #F43F5E 0%, #BE123C 100%)',
                  color: '#FFFFFF',
                  border: 'none',
                  padding: '15px 24px',
                  borderRadius: '9999px',
                  fontWeight: 700,
                  fontSize: '0.98rem',
                  cursor: 'pointer',
                  boxShadow: '0 8px 24px rgba(244, 63, 94, 0.38)',
                  marginTop: '4px',
                  transition: 'all var(--transition-fast)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.02)';
                  e.currentTarget.style.boxShadow = '0 12px 28px rgba(244, 63, 94, 0.52)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(244, 63, 94, 0.38)';
                }}
              >
                <span>Create Account</span>
                <ArrowRight size={18} />
              </button>

              {/* Divider: ———— or ———— */}
              <div style={{ display: 'flex', alignItems: 'center', margin: '2px 0', gap: '12px' }}>
                <div style={{ flex: 1, height: '1px', background: '#E2E8F0' }} />
                <span style={{ fontSize: '0.82rem', color: '#94A3B8', fontWeight: 600 }}>or</span>
                <div style={{ flex: 1, height: '1px', background: '#E2E8F0' }} />
              </div>

              {/* Continue with Google */}
              <button
                type="button"
                onClick={handleGoogleSignup}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  background: '#FFFFFF',
                  border: '1.5px solid #E2E8F0',
                  borderRadius: '9999px',
                  padding: '13px 20px',
                  fontSize: '0.94rem',
                  fontWeight: 700,
                  color: '#1E293B',
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
                  transition: 'all var(--transition-fast)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#CBD5E1';
                  e.currentTarget.style.background = '#F8FAFC';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#E2E8F0';
                  e.currentTarget.style.background = '#FFFFFF';
                }}
              >
                <svg width="19" height="19" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Continue with Google</span>
              </button>

              {/* Terms of Service & Privacy Policy */}
              <p
                style={{
                  fontSize: '0.78rem',
                  color: '#94A3B8',
                  textAlign: 'center',
                  lineHeight: 1.5,
                  margin: '4px 0 0 0'
                }}
              >
                By creating an account, you agree to our{' '}
                <a
                  href="#terms"
                  onClick={(e) => e.preventDefault()}
                  style={{ color: '#E11D48', textDecoration: 'underline', fontWeight: 600 }}
                >
                  Terms of Service
                </a>{' '}
                and{' '}
                <a
                  href="#privacy"
                  onClick={(e) => e.preventDefault()}
                  style={{ color: '#E11D48', textDecoration: 'underline', fontWeight: 600 }}
                >
                  Privacy Policy
                </a>
                .
              </p>

              {/* Already have an account? Log In */}
              <div style={{ textAlign: 'center', marginTop: '4px' }}>
                <span style={{ fontSize: '0.86rem', color: '#7E6E77' }}>
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => setCurrentView('login')}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: '#BE123C',
                      fontWeight: 800,
                      cursor: 'pointer',
                      fontSize: '0.86rem',
                      padding: 0
                    }}
                  >
                    Log In
                  </button>
                </span>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
