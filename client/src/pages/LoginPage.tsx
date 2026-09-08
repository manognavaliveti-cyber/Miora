import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { Mail, Lock, Heart, Sparkles, ChevronLeft, ShieldCheck, ArrowRight } from 'lucide-react';
import { MioraLogo } from '../components/common/MioraLogo';

export const LoginPage: React.FC = () => {
  const { login, directGuestLogin, setCurrentView, showToast } = useApp();
  const [email, setEmail] = useState('dev@miora.app');
  const [password, setPassword] = useState('password123');
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
    const success = await login(email, password);
    setIsLoading(false);

    if (!success) {
      setError('Invalid login credentials');
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
        animation: 'fadeIn 0.3s ease-out forwards'
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '1240px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: 'clamp(20px, 4vw, 56px)',
          alignItems: 'center'
        }}
      >
        {/* LEFT COLUMN (Desktop Romantic Pink Visual Showcase) */}
        <div
          className="desktop-only"
          style={{
            flexDirection: 'column',
            gap: '24px',
            padding: 'clamp(24px, 3.5vw, 40px)',
            background: 'linear-gradient(145deg, rgba(255, 230, 236, 0.7) 0%, rgba(254, 215, 226, 0.4) 100%)',
            borderRadius: 'var(--radius-xl)',
            border: '1.5px solid var(--border-subtle)',
            backdropFilter: 'blur(16px)',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          {/* Back to Welcome */}
          <button
            onClick={() => setCurrentView('welcome')}
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '50%',
              background: 'var(--surface-white)',
              border: '1px solid var(--border-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-primary)',
              cursor: 'pointer',
              boxShadow: 'var(--shadow-xs)'
            }}
            aria-label="Back to welcome"
          >
            <ChevronLeft size={20} />
          </button>

          {/* MIORA Brand Icon & Wordmark */}
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <MioraLogo size={46} showTagline={true} showWordmark={true} vertical={false} />
          </div>

          <div>
            <h1
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: 'clamp(2.2rem, 3.8vw, 3.2rem)',
                fontWeight: 800,
                color: 'var(--text-primary)',
                letterSpacing: '-0.025em',
                lineHeight: 1.15
              }}
            >
              Where authentic hearts reconnect.
            </h1>
            <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', marginTop: '14px', lineHeight: 1.6 }}>
              Continue your meaningful conversations, review new mutual sparks, and explore curated daily chemistry.
            </p>
          </div>

          {/* Social Proof & Quick Feature Pill */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '14px 20px',
              borderRadius: 'var(--radius-pill)',
              background: 'rgba(255, 255, 255, 0.92)',
              border: '1px solid var(--border-gold)',
              boxShadow: 'var(--shadow-sm)',
              width: 'fit-content'
            }}
          >
            <Sparkles size={18} color="var(--gold-deep)" />
            <span style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--berry-primary)' }}>
              100% Verified Members • Sincere Intentions Only ✨
            </span>
          </div>
        </div>

        {/* RIGHT COLUMN (Login Form Card) */}
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
                background: 'var(--surface-white)',
                border: '1px solid var(--border-subtle)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--text-primary)',
                cursor: 'pointer',
                boxShadow: 'var(--shadow-xs)'
              }}
              aria-label="Back to welcome"
            >
              <ChevronLeft size={18} />
            </button>
            <MioraLogo size={36} showTagline={false} showWordmark={true} vertical={false} />
            <div style={{ width: '38px' }} />
          </div>

          <div
            className="card-white"
            style={{
              width: '100%',
              maxWidth: '440px',
              padding: 'clamp(24px, 4vw, 40px)',
              borderRadius: '28px',
              boxShadow: 'var(--shadow-lg)',
              border: '1.5px solid var(--border-subtle)',
              background: 'var(--surface-white)',
              boxSizing: 'border-box'
            }}
          >
            <div style={{ marginBottom: '28px' }}>
              <h2
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: '2rem',
                  fontWeight: 800,
                  color: 'var(--text-primary)'
                }}
              >
                Sign In
              </h2>
              <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', marginTop: '6px' }}>
                Enter your credentials to access your account.
              </p>
            </div>

            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <Input
                label="Email Address"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError('');
                }}
                icon={<Mail size={18} />}
              />

              <Input
                label="Password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError('');
                }}
                icon={<Lock size={18} />}
              />

              {error && (
                <div
                  style={{
                    padding: '12px 16px',
                    borderRadius: 'var(--radius-sm)',
                    background: 'rgba(239, 68, 68, 0.1)',
                    color: '#EF4444',
                    fontSize: '0.86rem',
                    fontWeight: 600
                  }}
                >
                  {error}
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => showToast('Password reset instructions sent to email ✨')}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--berry-primary)',
                    fontSize: '0.86rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  Forgot Password?
                </button>
              </div>

              <Button type="submit" variant="primary" size="lg" fullWidth disabled={isLoading}>
                {isLoading ? 'Signing In...' : 'Sign In'}
              </Button>

              {/* Direct Instant 1-Click Access */}
              <button
                type="button"
                onClick={directGuestLogin}
                style={{
                  width: '100%',
                  padding: '12px 18px',
                  borderRadius: 'var(--radius-pill)',
                  background: 'linear-gradient(135deg, rgba(254, 226, 232, 0.7) 0%, rgba(254, 205, 211, 0.4) 100%)',
                  border: '1.5px dashed var(--berry-primary)',
                  color: 'var(--berry-primary)',
                  fontWeight: 800,
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  transition: 'all var(--transition-fast)'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(254, 205, 211, 0.7)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'linear-gradient(135deg, rgba(254, 226, 232, 0.7) 0%, rgba(254, 205, 211, 0.4) 100%)')}
              >
                <Sparkles size={16} color="var(--berry-primary)" />
                <span>Direct 1-Click Login • Explore Without Account</span>
              </button>

              <div style={{ textAlign: 'center', marginTop: '10px' }}>
                <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)' }}>
                  Don’t have an account?{' '}
                  <button
                    type="button"
                    onClick={() => setCurrentView('signup')}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: 'var(--berry-primary)',
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
                    marginTop: '18px',
                    fontSize: '0.76rem',
                    color: 'var(--text-muted)'
                  }}
                >
                  <button
                    type="button"
                    onClick={() => setCurrentView('terms')}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--text-secondary)',
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
                      color: 'var(--text-secondary)',
                      cursor: 'pointer',
                      fontSize: 'inherit',
                      fontFamily: 'inherit',
                      textDecoration: 'underline'
                    }}
                  >
                    Privacy Policy
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
