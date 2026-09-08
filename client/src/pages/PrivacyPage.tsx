import React from 'react';
import { useApp } from '../context/AppContext';
import { MioraLogo } from '../components/common/MioraLogo';
import {
  Shield,
  Lock,
  ArrowLeft,
  Heart,
  Eye,
  Database,
  Trash2,
  FileText,
  Mail,
  Scale
} from 'lucide-react';

export const PrivacyPage: React.FC = () => {
  const { setCurrentView } = useApp();

  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        minHeight: '100vh',
        padding: 'clamp(16px, 3vw, 32px) 0 60px 0',
        animation: 'fadeIn 0.3s ease-out forwards',
        boxSizing: 'border-box'
      }}
    >
      {/* Top Header Navigation */}
      <div
        style={{
          width: '100%',
          maxWidth: '960px',
          margin: '0 auto',
          padding: '0 clamp(16px, 4vw, 24px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '20px',
          flexWrap: 'wrap',
          gap: '12px'
        }}
      >
        <button
          onClick={() => {
            if (window.history.length > 1) {
              window.history.back();
            } else {
              setCurrentView('discover');
            }
          }}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 16px',
            borderRadius: 'var(--radius-pill)',
            background: 'var(--surface-white)',
            border: '1.5px solid var(--border-subtle)',
            color: 'var(--text-primary)',
            fontFamily: 'var(--font-display)',
            fontWeight: 700,
            fontSize: '0.84rem',
            cursor: 'pointer',
            boxShadow: 'var(--shadow-xs)'
          }}
        >
          <ArrowLeft size={16} />
          <span>Back</span>
        </button>

        <button
          onClick={() => setCurrentView('terms')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '8px 16px',
            borderRadius: 'var(--radius-pill)',
            background: 'var(--surface-white)',
            border: '1.5px solid var(--border-gold)',
            color: 'var(--berry-primary)',
            fontFamily: 'var(--font-display)',
            fontWeight: 700,
            fontSize: '0.82rem',
            cursor: 'pointer',
            boxShadow: 'var(--shadow-xs)'
          }}
        >
          <FileText size={14} color="var(--gold-deep)" />
          <span>Terms & Conditions →</span>
        </button>
      </div>

      {/* Main Document Content */}
      <div
        style={{
          width: '100%',
          maxWidth: '960px',
          margin: '0 auto',
          padding: '0 clamp(16px, 4vw, 24px)',
          boxSizing: 'border-box'
        }}
      >
        {/* Document Header Hero Card */}
        <div
          className="card-luxury"
          style={{
            padding: 'clamp(24px, 4vw, 36px)',
            marginBottom: '28px',
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(254, 242, 244, 0.85) 100%)',
            border: '1.5px solid var(--border-gold)',
            boxShadow: 'var(--shadow-md)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
            <MioraLogo size={42} showTagline={false} showWordmark={true} />
            <div style={{ height: '24px', width: '1px', background: 'var(--border-subtle)', margin: '0 4px' }} />
            <span
              style={{
                fontSize: '0.72rem',
                fontFamily: 'var(--font-display)',
                fontWeight: 800,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: 'var(--gold-deep)',
                background: 'rgba(212, 175, 55, 0.12)',
                padding: '4px 10px',
                borderRadius: 'var(--radius-pill)',
                border: '1px solid var(--border-gold)'
              }}
            >
              Privacy & Data Protection
            </span>
          </div>

          <h1
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(1.8rem, 4vw, 2.6rem)',
              fontWeight: 800,
              color: 'var(--text-primary)',
              letterSpacing: '-0.025em',
              lineHeight: 1.15,
              margin: '0 0 10px 0'
            }}
          >
            Privacy Policy
          </h1>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '18px' }}>
            <span style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
              Last Updated:
            </span>
            <span
              style={{
                fontFamily: 'monospace',
                fontSize: '0.84rem',
                color: 'var(--berry-primary)',
                background: 'var(--bg-soft-blush)',
                padding: '2px 8px',
                borderRadius: '6px',
                fontWeight: 700
              }}
            >
              [INSERT DATE]
            </span>
            <span style={{ color: 'var(--text-muted)' }}>•</span>
            <span style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>
              Version 1.0 (Official Document)
            </span>
          </div>

          <p style={{ fontSize: '0.94rem', color: 'var(--text-secondary)', lineHeight: 1.7, margin: 0 }}>
            At MIORA, protecting your personal data, privacy, and safety is our foremost commitment. This Privacy Policy details how we collect, use, store, process, and protect your information across the MIORA discovery platform and services.
          </p>
        </div>

        {/* Content Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <article className="card-luxury" style={{ padding: '24px', border: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
              <Database size={18} color="var(--berry-primary)" />
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem', fontWeight: 800, margin: 0 }}>
                1. Information We Collect
              </h2>
            </div>
            <p style={{ lineHeight: 1.7, color: 'var(--text-secondary)', marginBottom: '10px' }}>
              We collect information you provide directly during registration and profile creation:
            </p>
            <ul style={{ paddingLeft: '24px', lineHeight: 1.7, display: 'flex', flexDirection: 'column', gap: '6px', color: 'var(--text-secondary)' }}>
              <li>Account credentials (email, name, date of birth, gender identity).</li>
              <li>Profile data (photos, bio, occupation, education, passions, lifestyle tags).</li>
              <li>Discovery preferences (distance, age range, matching interests).</li>
              <li>Communication and interactions (matches, direct messages, virtual gifts sent/received).</li>
              <li>Transaction records (recharge packages, Razorpay transaction references; full credit card details are never stored on MIORA servers).</li>
            </ul>
          </article>

          <article className="card-luxury" style={{ padding: '24px', border: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
              <Eye size={18} color="var(--berry-primary)" />
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem', fontWeight: 800, margin: 0 }}>
                2. How We Use Your Information
              </h2>
            </div>
            <ul style={{ paddingLeft: '24px', lineHeight: 1.7, display: 'flex', flexDirection: 'column', gap: '6px', color: 'var(--text-secondary)' }}>
              <li>Facilitating discovery, smart vibe matching, and genuine mutual connections.</li>
              <li>Operating dating rooms, real-time messaging, and interactive couple games.</li>
              <li>Enforcing safety guidelines, anti-fraud protections, and content moderation.</li>
              <li>Complying with statutory accounting and legal obligations under applicable law.</li>
            </ul>
          </article>

          <article className="card-luxury" style={{ padding: '24px', border: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
              <Lock size={18} color="var(--berry-primary)" />
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem', fontWeight: 800, margin: 0 }}>
                3. Security & Storage
              </h2>
            </div>
            <p style={{ lineHeight: 1.7, color: 'var(--text-secondary)' }}>
              We implement enterprise-grade security including Firebase Authentication token encryption, strict Firestore security rules, rate limiting, and secure HTTPS transmission to safeguard your information against unauthorized access.
            </p>
          </article>

          <article className="card-luxury" style={{ padding: '24px', border: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
              <Trash2 size={18} color="var(--berry-primary)" />
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem', fontWeight: 800, margin: 0 }}>
                4. Account Deletion & User Rights
              </h2>
            </div>
            <p style={{ lineHeight: 1.7, color: 'var(--text-secondary)' }}>
              You retain full control over your data. You may request account deletion at any time via <strong>Settings → Delete Account</strong>, which removes or anonymizes your profile, posts, and matches in accordance with our retention policy and applicable statutory requirements.
            </p>
          </article>

          <article className="card-luxury" style={{ padding: '24px', border: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
              <Mail size={18} color="var(--berry-primary)" />
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem', fontWeight: 800, margin: 0 }}>
                5. Privacy Inquiries & Contact
              </h2>
            </div>
            <p style={{ lineHeight: 1.7, color: 'var(--text-secondary)', margin: '0 0 10px 0' }}>
              For data access requests, privacy concerns, or questions regarding this Policy, contact:
            </p>
            <div style={{ color: 'var(--text-primary)', fontSize: '0.88rem' }}>
              <strong>Privacy Officer:</strong>{' '}
              <span style={{ color: 'var(--berry-primary)', fontFamily: 'monospace', background: 'var(--bg-soft-blush)', padding: '2px 6px', borderRadius: '4px' }}>
                [INSERT OFFICIAL SUPPORT EMAIL]
              </span>
            </div>
          </article>
        </div>
      </div>
    </div>
  );
};
