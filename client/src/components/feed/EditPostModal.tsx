import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Edit3, MapPin, Check } from 'lucide-react';

export const EditPostModal: React.FC = () => {
  const { isEditPostModalOpen, closeEditPostModal, editTargetPost, editFeedPost } = useApp();
  const [content, setContent] = useState('');
  const [location, setLocation] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (editTargetPost) {
      setContent(editTargetPost.content || '');
      setLocation(editTargetPost.location || '');
    }
  }, [editTargetPost]);

  if (!isEditPostModalOpen || !editTargetPost) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    setIsSubmitting(true);
    await editFeedPost(editTargetPost.id, content.trim(), location.trim() || undefined);
    setIsSubmitting(false);
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
        animation: 'fadeIn 0.2s ease-out'
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '500px',
          background: 'linear-gradient(180deg, #FFFFFF 0%, #FFF5F7 100%)',
          borderRadius: '32px',
          boxShadow: '0 24px 60px rgba(76, 5, 25, 0.35)',
          border: '1.5px solid var(--border-gold, #FCE7F3)',
          padding: '28px 24px',
          position: 'relative'
        }}
      >
        <button
          onClick={closeEditPostModal}
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
            color: 'var(--text-secondary, #705A65)'
          }}
        >
          <X size={18} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
          <Edit3 size={22} color="#EE3865" />
          <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: '#1F2937' }}>
            Edit Post Caption
          </h3>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, color: '#6B7280', marginBottom: '6px' }}>
              Caption Text
            </label>
            <textarea
              rows={4}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: '16px',
                border: '1.5px solid #E5E7EB',
                fontSize: '0.92rem',
                outline: 'none',
                resize: 'none',
                background: '#FFFFFF'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, color: '#6B7280', marginBottom: '6px' }}>
              Location (Optional)
            </label>
            <div style={{ position: 'relative' }}>
              <MapPin size={16} color="#EE3865" style={{ position: 'absolute', left: '14px', top: '13px' }} />
              <input
                type="text"
                placeholder="e.g. Indiranagar, Bangalore"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 16px 10px 38px',
                  borderRadius: '14px',
                  border: '1.5px solid #E5E7EB',
                  fontSize: '0.88rem',
                  outline: 'none',
                  background: '#FFFFFF'
                }}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={!content.trim() || isSubmitting}
            style={{
              background: 'var(--primary-gradient, linear-gradient(135deg, #EE3865, #EC4899))',
              color: '#FFFFFF',
              border: 'none',
              padding: '13px',
              borderRadius: '999px',
              fontWeight: 800,
              fontSize: '0.94rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              cursor: content.trim() ? 'pointer' : 'default',
              boxShadow: '0 4px 14px rgba(238, 56, 101, 0.35)',
              marginTop: '8px'
            }}
          >
            <Check size={17} />
            <span>Save Changes</span>
          </button>
        </form>
      </div>
    </div>
  );
};
