import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Image, Sparkles, Send, Tag } from 'lucide-react';

export const CreatePostModal: React.FC = () => {
  const { isCreatePostModalOpen, closeCreatePostModal, createFeedPost, currentUser } = useApp();
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [tagsInput, setTagsInput] = useState('FirstDate, Vibe');

  if (!isCreatePostModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim().replace(/^#/, ''))
      .filter((t) => t.length > 0);

    createFeedPost(content.trim(), imageUrl.trim() || undefined, undefined, tags);
    setContent('');
    setImageUrl('');
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
          maxWidth: '520px',
          background: 'linear-gradient(180deg, #FFFFFF 0%, #FFF5F7 100%)',
          borderRadius: '32px',
          boxShadow: '0 24px 60px rgba(76, 5, 25, 0.35)',
          border: '1.5px solid var(--border-gold)',
          padding: '28px 24px',
          position: 'relative'
        }}
      >
        <button
          onClick={closeCreatePostModal}
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

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
          <img
            src={currentUser.photos[0]}
            alt={currentUser.name}
            style={{ width: '46px', height: '46px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--gold-champagne)' }}
          />
          <div>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              Create Dating Thought
            </h3>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
              Posting as {currentUser.name}
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <textarea
            placeholder="What's on your mind? Share a dating question, relationship thought, or weekend plan..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            rows={4}
            style={{
              width: '100%',
              padding: '14px 18px',
              borderRadius: '20px',
              border: '1.5px solid var(--border-subtle)',
              background: 'var(--surface-white)',
              fontSize: '0.94rem',
              outline: 'none',
              resize: 'none',
              lineHeight: 1.5
            }}
          />

          <div>
            <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 800, color: 'var(--text-secondary)', marginBottom: '4px' }}>
              Photo URL (Optional)
            </label>
            <input
              type="url"
              placeholder="Paste an aesthetic image URL..."
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
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

          <div>
            <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 800, color: 'var(--text-secondary)', marginBottom: '4px' }}>
              Tags (comma separated)
            </label>
            <input
              type="text"
              placeholder="e.g. FirstDate, RomanticMoments, CoffeeVibes"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
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
            <span>Publish to MIORA Feed</span>
          </button>
        </form>
      </div>
    </div>
  );
};
