import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Sparkles, Clock, Image } from 'lucide-react';

export const CreateStatusModal: React.FC = () => {
  const { isCreateStatusModalOpen, closeCreateStatusModal, createStatusStory, currentUser } = useApp();
  const [text, setText] = useState('');
  const [mediaUrl, setMediaUrl] = useState('');

  if (!isCreateStatusModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    createStatusStory(text.trim(), mediaUrl.trim() || undefined);
    setText('');
    setMediaUrl('');
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(31, 22, 26, 0.75)',
        backdropFilter: 'blur(16px)',
        padding: '16px',
        animation: 'fadeIn 0.25s ease-out'
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '460px',
          background: 'linear-gradient(180deg, #FFFFFF 0%, #FFF5F7 100%)',
          borderRadius: '32px',
          boxShadow: '0 24px 60px rgba(76, 5, 25, 0.35)',
          border: '1.5px solid var(--border-gold)',
          padding: '28px 24px',
          position: 'relative'
        }}
      >
        <button
          onClick={closeCreateStatusModal}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            background: 'rgba(238, 56, 101, 0.08)',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: 'var(--text-secondary)'
          }}
        >
          <X size={18} />
        </button>

        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '20px',
              background: 'var(--primary-gradient)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 12px auto',
              color: '#FFFFFF',
              boxShadow: 'var(--shadow-berry-glow)'
            }}
          >
            <Clock size={28} />
          </div>
          <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            Add 24h Status Update
          </h3>
          <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
            Post a quick romantic update or current vibe that disappears in 24 hours.
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-secondary)', marginBottom: '6px' }}>
              Your Status Message
            </label>
            <input
              type="text"
              placeholder="e.g. Coffee + indie vinyls on a rainy afternoon ☕❤️"
              value={text}
              onChange={(e) => setText(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '12px 18px',
                borderRadius: 'var(--radius-pill)',
                border: '1.5px solid var(--border-subtle)',
                fontSize: '0.92rem',
                outline: 'none'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-secondary)', marginBottom: '6px' }}>
              Background Image URL (Optional)
            </label>
            <input
              type="url"
              placeholder="Paste image link..."
              value={mediaUrl}
              onChange={(e) => setMediaUrl(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 16px',
                borderRadius: 'var(--radius-md)',
                border: '1.5px solid var(--border-subtle)',
                fontSize: '0.88rem',
                outline: 'none'
              }}
            />
          </div>

          <button
            type="submit"
            style={{
              background: 'var(--primary-gradient)',
              color: '#FFFFFF',
              border: 'none',
              padding: '13px',
              borderRadius: 'var(--radius-pill)',
              fontWeight: 800,
              fontSize: '0.96rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: 'var(--shadow-berry-glow)',
              marginTop: '6px'
            }}
          >
            <Sparkles size={17} />
            <span>Post 24h Story</span>
          </button>
        </form>
      </div>
    </div>
  );
};
