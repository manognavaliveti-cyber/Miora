import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Button } from '../components/common/Button';
import { Mail, Lock, Sparkles, ChevronLeft, ShieldCheck, ArrowRight } from 'lucide-react';
import { MioraLogo } from '../components/common/MioraLogo';
import { authService } from '../services/authService';

export const LoginPage: React.FC = () => {
  const { login, googleAuth, setCurrentView, showToast } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your email address');
      return;
    }
    if (!password) {
      setError('Please enter your password');
      return;
    }

    setIsLoading(true);
    const result = await login(email.trim(), password);
    setIsLoading(false);

    if (!result.success) {
      setError(result.message || 'Invalid login credentials');
    }
  };

  const handleForgotPassword = async () => {
    if (!email.trim()) {
      setError('Enter your email address above, then tap "Forgot Password?"');
      return;
    }
    try {
      await authService.sendPasswordReset(email.trim());
      setError('');
      showToast('Password reset email sent. Please check your inbox (and spam folder) ✨');
    } catch (err: any) {
      console.error('Password reset error:', err);
      setError(err?.code === 'auth/invalid-email' ? 'Please enter a valid email address.' : 'Could not send the reset email. Please try again.');
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'clamp(16px, 4vw, 40px)',
        position: 'relative',
        overflow: 'hidden',
        background: 'radial-gradient(circle at 50% 30%, #FCE4E8 0%, #F8D8DC 60%, #F4CED3 100%)'
      }}
    >
      {/* Background Floating Glass Orbs */}
      <div
        style={{
          position: 'absolute',
          top: '-10%',
          left: '-5%',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255, 182, 193, 0.4) 0%, rgba(216, 27, 96, 0.15) 70%, transparent 100%)',
          filter: 'blur(80px)',
          pointerEvents: 'none'
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '-10%',
          right: '-5%',
          width: '550px',
          height: '550px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(253, 224, 230, 0.5) 0%, rgba(139, 30, 63, 0.12) 70%, transparent 100%)',
          filter: 'blur(90px)',
          pointerEvents: 'none'
        }}
      />

      <div
        style={{
          width: '100%',
          maxWidth: '1160px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
          gap: 'clamp(24px, 4vw, 48px)',
          alignItems: 'center',
          zIndex: 10
        }}
      >
        {/* LEFT COLUMN (Frosted Glass Showcase Panel) */}
        <div
          className="desktop-only"
          style={{
            flexDirection: 'column',
            gap: '24px',
            padding: 'clamp(32px, 4vw, 48px)',
            background: 'rgba(255, 255, 255, 0.45)',
            backdropFilter: 'blur(28px) saturate(180%)',
            WebkitBackdropFilter: 'blur(28px) saturate(180%)',
            borderRadius: '32px',
            border: '1.5px solid rgba(255, 255, 255, 0.75)',
            boxShadow: '0 20px 50px rgba(186, 73, 98, 0.12), inset 0 1px 2px rgba(255, 255, 255, 0.9)',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          {/* Back Button */}
          <button
            onClick={() => setCurrentView('welcome')}
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.7)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(255, 255, 255, 0.9)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#3A121A',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
              transition: 'transform 0.2s ease'
            }}
            aria-label="Back to welcome"
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.06)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          >
            <ChevronLeft size={20} />
          </button>

          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <MioraLogo size={46} showTagline={true} showWordmark={true} vertical={false} />
          </div>

          <div>
            <h1
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: 'clamp(2.5rem, 4.2vw, 3.6rem)',
                fontWeight: 800,
                color: '#3A121A',
                letterSpacing: '-0.025em',
                lineHeight: 1.15
              }}
            >
              Where authentic hearts reconnect.
            </h1>
            <p style={{ fontSize: '1.15rem', color: '#6B3845', marginTop: '14px', lineHeight: 1.6, fontWeight: 500 }}>
              Continue your meaningful conversations, review new mutual sparks, and explore curated daily chemistry.
            </p>
          </div>

          {/* Glass Feature Badges */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '6px' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                borderRadius: '999px',
                background: 'rgba(255, 255, 255, 0.65)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(255, 255, 255, 0.85)',
                fontSize: '0.92rem',
                fontWeight: 800,
                color: '#8B1E3F'
              }}
            >
              <ShieldCheck size={16} color="#8B1E3F" />
              <span>100% Verified Profiles</span>
            </div>

            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                borderRadius: '999px',
                background: 'rgba(255, 255, 255, 0.65)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(255, 255, 255, 0.85)',
                fontSize: '0.92rem',
                fontWeight: 800,
                color: '#8B1E3F'
              }}
            >
              <Sparkles size={16} color="#D81B60" />
              <span>Bespoke Vibe Matching</span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN (Ultra-Modern Glassmorphic Login Form) */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%'
          }}
        >
          {/* Mobile Top Header */}
          <div className="mobile-only" style={{ width: '100%', maxWidth: '440px', marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <button
              onClick={() => setCurrentView('welcome')}
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.7)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(255, 255, 255, 0.8)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#3A121A',
                cursor: 'pointer'
              }}
              aria-label="Back to welcome"
            >
              <ChevronLeft size={18} />
            </button>
            <MioraLogo size={36} showTagline={false} showWordmark={true} vertical={false} />
            <div style={{ width: '38px' }} />
          </div>

          {/* GLASSMORPHISM CARD */}
          <div
            style={{
              width: '100%',
              maxWidth: '440px',
              padding: 'clamp(28px, 4vw, 42px)',
              borderRadius: '32px',
              background: 'rgba(255, 255, 255, 0.65)',
              backdropFilter: 'blur(32px) saturate(180%)',
              WebkitBackdropFilter: 'blur(32px) saturate(180%)',
              border: '1.5px solid rgba(255, 255, 255, 0.85)',
              boxShadow: '0 24px 60px rgba(139, 30, 63, 0.15), inset 0 1px 2px rgba(255, 255, 255, 0.95)',
              boxSizing: 'border-box'
            }}
          >
            <div style={{ marginBottom: '28px' }}>
              <h2
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: '2.35rem',
                  fontWeight: 800,
                  color: '#3A121A',
                  letterSpacing: '-0.02em',
                  margin: 0
                }}
              >
                Sign In
              </h2>
              <p style={{ fontSize: '1.02rem', color: '#6B3845', marginTop: '6px', fontWeight: 600 }}>
                Enter your credentials to access your account.
              </p>
            </div>

            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Email Glass Input */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '0.9rem', fontWeight: 800, color: '#4A1724' }}>
                  Email Address
                </label>
                <div
                  style={{
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  <div style={{ position: 'absolute', left: '16px', color: '#8B1E3F', display: 'flex' }}>
                    <Mail size={18} />
                  </div>
                  <input
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setError('');
                    }}
                    style={{
                      width: '100%',
                      padding: '12px 16px 12px 46px',
                      borderRadius: '16px',
                      border: '1.5px solid rgba(255, 255, 255, 0.9)',
                      background: 'rgba(255, 255, 255, 0.75)',
                      backdropFilter: 'blur(12px)',
                      fontSize: '1.02rem',
                      fontWeight: 600,
                      color: '#3A121A',
                      outline: 'none',
                      boxShadow: '0 2px 8px rgba(186, 73, 98, 0.05)',
                      transition: 'all 0.2s ease'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#8B1E3F';
                      e.target.style.boxShadow = '0 0 16px rgba(139, 30, 63, 0.2)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = 'rgba(255, 255, 255, 0.9)';
                      e.target.style.boxShadow = '0 2px 8px rgba(186, 73, 98, 0.05)';
                    }}
                  />
                </div>
              </div>

              {/* Password Glass Input */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '0.9rem', fontWeight: 800, color: '#4A1724' }}>
                  Password
                </label>
                <div
                  style={{
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  <div style={{ position: 'absolute', left: '16px', color: '#8B1E3F', display: 'flex' }}>
                    <Lock size={18} />
                  </div>
                  <input
                    type="password"
                    autoComplete="current-password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setError('');
                    }}
                    style={{
                      width: '100%',
                      padding: '12px 16px 12px 46px',
                      borderRadius: '16px',
                      border: '1.5px solid rgba(255, 255, 255, 0.9)',
                      background: 'rgba(255, 255, 255, 0.75)',
                      backdropFilter: 'blur(12px)',
                      fontSize: '1.02rem',
                      fontWeight: 600,
                      color: '#3A121A',
                      outline: 'none',
                      boxShadow: '0 2px 8px rgba(186, 73, 98, 0.05)',
                      transition: 'all 0.2s ease'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#8B1E3F';
                      e.target.style.boxShadow = '0 0 16px rgba(139, 30, 63, 0.2)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = 'rgba(255, 255, 255, 0.9)';
                      e.target.style.boxShadow = '0 2px 8px rgba(186, 73, 98, 0.05)';
                    }}
                  />
                </div>
              </div>

              {error && (
                <div
                  style={{
                    padding: '12px 16px',
                    borderRadius: '14px',
                    background: 'rgba(239, 68, 68, 0.12)',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    color: '#DC2626',
                    fontSize: '0.95rem',
                    fontWeight: 700
                  }}
                >
                  {error}
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#8B1E3F',
                    fontSize: '0.95rem',
                    fontWeight: 800,
                    cursor: 'pointer'
                  }}
                >
                  Forgot Password?
                </button>
              </div>

              {/* Glossy Primary Sign In Button */}
              <button
                type="submit"
                disabled={isLoading}
                style={{
                  width: '100%',
                  padding: '14px 20px',
                  borderRadius: '999px',
                  background: 'linear-gradient(135deg, #8B1E3F 0%, #681028 100%)',
                  border: '1.5px solid rgba(255, 255, 255, 0.3)',
                  color: '#FFFFFF',
                  fontSize: '1.1rem',
                  fontWeight: 800,
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  boxShadow: '0 8px 24px rgba(139, 30, 63, 0.35)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  transition: 'all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
                  opacity: isLoading ? 0.7 : 1
                }}
                onMouseEnter={(e) => {
                  if (!isLoading) {
                    e.currentTarget.style.transform = 'translateY(-2px) scale(1.01)';
                    e.currentTarget.style.boxShadow = '0 12px 30px rgba(139, 30, 63, 0.48)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isLoading) {
                    e.currentTarget.style.transform = 'translateY(0) scale(1)';
                    e.currentTarget.style.boxShadow = '0 8px 24px rgba(139, 30, 63, 0.35)';
                  }
                }}
              >
                <span>{isLoading ? 'Signing In...' : 'Sign In'}</span>
                <ArrowRight size={18} />
              </button>

              {/* Divider: ———— or ———— */}
              <div style={{ display: 'flex', alignItems: 'center', margin: '2px 0', gap: '12px' }}>
                <div style={{ flex: 1, height: '1px', background: 'rgba(139, 30, 63, 0.18)' }} />
                <span style={{ fontSize: '0.9rem', color: '#7C4351', fontWeight: 600 }}>or</span>
                <div style={{ flex: 1, height: '1px', background: 'rgba(139, 30, 63, 0.18)' }} />
              </div>

              {/* Continue with Google */}
              <button
                type="button"
                onClick={() => googleAuth('login')}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  background: 'rgba(255, 255, 255, 0.85)',
                  backdropFilter: 'blur(12px)',
                  border: '1.5px solid rgba(255, 255, 255, 0.9)',
                  borderRadius: '999px',
                  padding: '13px 20px',
                  fontSize: '1.05rem',
                  fontWeight: 700,
                  color: '#3A121A',
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(186, 73, 98, 0.06)',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#FFFFFF';
                  e.currentTarget.style.transform = 'scale(1.01)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.85)';
                  e.currentTarget.style.transform = 'scale(1)';
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

              <p style={{ fontSize: '1rem', color: '#6B3845', fontWeight: 600 }}>
                  Don’t have an account?{' '}
                  <button
                    type="button"
                    onClick={() => setCurrentView('signup')}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: '#8B1E3F',
                      fontWeight: 800,
                      cursor: 'pointer'
                    }}
                  >
                    Create Account
                  </button>
                </p>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    marginTop: '16px',
                    fontSize: '0.85rem',
                    color: '#7C4351',
                    fontWeight: 600
                  }}
                >
                  <button
                    type="button"
                    onClick={() => setCurrentView('terms')}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#7C4351',
                      cursor: 'pointer',
                      fontSize: 'inherit',
                      fontFamily: 'inherit',
                      textDecoration: 'underline'
                    }}
                  >
                    Terms & Conditions
                  </button>
                  <span>•</span>
                  <button
                    type="button"
                    onClick={() => setCurrentView('privacy')}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#7C4351',
                      cursor: 'pointer',
                      fontSize: 'inherit',
                      fontFamily: 'inherit',
                      textDecoration: 'underline'
                    }}
                  >
                    Privacy Policy
                  </button>
                </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

