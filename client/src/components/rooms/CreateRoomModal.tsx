import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Mic, Sparkles, Radio } from 'lucide-react';
import { LiveRoom } from '../../types';

interface CreateRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateRoomModal: React.FC<CreateRoomModalProps> = ({ isOpen, onClose }) => {
  const { createLiveRoom } = useApp();
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<LiveRoom['category']>('advice');
  const [description, setDescription] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    createLiveRoom({
      title: title.trim(),
      category,
      description: description.trim() || 'Join our dating and relationship discussion stage!'
    });

    onClose();
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
        animation: 'fadeIn 0.25s ease-out',
        fontFamily: 'var(--font-primary)'
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '500px',
          maxHeight: '90vh',
          overflowY: 'auto',
          background: 'linear-gradient(180deg, #FFFFFF 0%, #FFF5F7 100%)',
          borderRadius: '28px',
          boxShadow: '0 24px 60px rgba(76, 5, 25, 0.35)',
          border: '1.5px solid var(--border-gold)',
          padding: 'clamp(20px, 4vw, 28px) clamp(16px, 3.5vw, 24px)',
          position: 'relative'
        }}
      >
        <button
          onClick={onClose}
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

        <div style={{ textAlign: 'center', marginBottom: '22px' }}>
          <div
            style={{
              width: '60px',
              height: '60px',
              borderRadius: '20px',
              background: 'linear-gradient(135deg, #F43F5E 0%, #BE123C 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 12px auto',
              color: '#FFFFFF',
              boxShadow: '0 8px 24px rgba(244, 63, 94, 0.35)'
            }}
          >
            <Mic size={28} />
          </div>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
            Start a Live Stage 🎙️
          </h3>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginTop: '4px', lineHeight: 1.5 }}>
            Host a live dating discussion, invite listeners on stage, and share authentic conversations.
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-secondary)', marginBottom: '6px' }}>
              Stage Topic / Title
            </label>
            <input
              type="text"
              placeholder="e.g. Modern Dating Red Flags & Green Flags 🌿"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: 'var(--radius-md)',
                border: '1.5px solid var(--border-subtle)',
                fontSize: '0.92rem',
                outline: 'none',
                background: 'var(--surface-white)'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-secondary)', marginBottom: '6px' }}>
              Topic Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as any)}
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: 'var(--radius-md)',
                border: '1.5px solid var(--border-subtle)',
                fontSize: '0.92rem',
                outline: 'none',
                background: 'var(--surface-white)',
                cursor: 'pointer'
              }}
            >
              <option value="advice">💬 First Date Advice</option>
              <option value="relationship">❤️ Relationship Talks</option>
              <option value="crush">💘 Crush & Approaching</option>
              <option value="breakup">💔 Breakup Support & Healing</option>
              <option value="stories">😂 Funny Dating Stories</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-secondary)', marginBottom: '6px' }}>
              Stage Description
            </label>
            <textarea
              placeholder="Share what this room is about, debate rules, or conversation prompts..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: 'var(--radius-md)',
                border: '1.5px solid var(--border-subtle)',
                fontSize: '0.92rem',
                outline: 'none',
                resize: 'none',
                background: 'var(--surface-white)'
              }}
            />
          </div>

          <button
            type="submit"
            style={{
              background: 'linear-gradient(135deg, #F43F5E 0%, #BE123C 100%)',
              color: '#FFFFFF',
              border: 'none',
              padding: '14px',
              borderRadius: 'var(--radius-pill)',
              fontWeight: 800,
              fontSize: '0.98rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: '0 8px 24px rgba(244, 63, 94, 0.4)',
              marginTop: '6px',
              transition: 'all var(--transition-fast)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.02)';
              e.currentTarget.style.boxShadow = '0 12px 28px rgba(244, 63, 94, 0.55)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = '0 8px 24px rgba(244, 63, 94, 0.4)';
            }}
          >
            <Sparkles size={18} />
            <span>Go Live on Stage Now</span>
          </button>
        </form>
      </div>
    </div>
  );
};
