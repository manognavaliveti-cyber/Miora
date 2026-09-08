import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Sparkles, Smile, Trash2, Check } from 'lucide-react';

export const StatusNoteModal: React.FC = () => {
  const {
    isStatusNoteModalOpen,
    closeStatusNoteModal,
    myStatusNote,
    setStatusNote,
    deleteStatusNote,
    currentUser
  } = useApp();

  const [noteText, setNoteText] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState('✨');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const emojiOptions = ['✨', '🎵', '☕', '🎧', '✈️', '💻', '🎨', '🍜', '🌙', '🌸', '🎮', '🍸'];

  useEffect(() => {
    if (myStatusNote) {
      setNoteText(myStatusNote.noteText || myStatusNote.text || '');
      setSelectedEmoji(myStatusNote.emoji || '✨');
    } else {
      setNoteText('');
      setSelectedEmoji('✨');
    }
  }, [myStatusNote, isStatusNoteModalOpen]);

  if (!isStatusNoteModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteText.trim()) return;
    setIsSubmitting(true);
    await setStatusNote(noteText.trim(), selectedEmoji);
    setIsSubmitting(false);
  };

  const handleClear = async () => {
    setIsSubmitting(true);
    await deleteStatusNote();
    setIsSubmitting(false);
    closeStatusNoteModal();
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
          maxWidth: '460px',
          background: 'linear-gradient(180deg, #FFFFFF 0%, #FFF5F7 100%)',
          borderRadius: '32px',
          boxShadow: '0 24px 60px rgba(76, 5, 25, 0.35)',
          border: '1.5px solid var(--border-gold, #FCE7F3)',
          padding: '26px 24px',
          position: 'relative'
        }}
      >
        <button
          onClick={closeStatusNoteModal}
          style={{
            position: 'absolute',
            top: '18px',
            right: '18px',
            width: '34px',
            height: '34px',
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
          <X size={17} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: 'rgba(238, 56, 101, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.25rem'
            }}
          >
            {selectedEmoji}
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800, color: '#1F2937' }}>
              Share a 24h Thought Note
            </h3>
            <span style={{ fontSize: '0.78rem', color: '#6B7280' }}>
              Visible to your matches & followers for 24 hours
            </span>
          </div>
        </div>

        {/* Live Preview Thought Bubble */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px 0 20px'
          }}
        >
          <div style={{ position: 'relative', display: 'inline-block' }}>
            <img
              src={currentUser.photos[0]}
              alt={currentUser.name}
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '3px solid #EE3865'
              }}
            />
            <div
              style={{
                position: 'absolute',
                top: '-16px',
                left: '50%',
                transform: 'translateX(-50%)',
                background: '#FFFFFF',
                borderRadius: '16px',
                padding: '4px 10px',
                boxShadow: '0 4px 14px rgba(0,0,0,0.12)',
                border: '1.5px solid #FCE7F3',
                fontSize: '0.78rem',
                fontWeight: 700,
                color: '#1F2937',
                whiteSpace: 'nowrap',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                maxWidth: '180px',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}
            >
              <span>{selectedEmoji}</span>
              <span>{noteText.trim() || 'What’s on your mind?'}</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, color: '#6B7280', marginBottom: '6px' }}>
              Choose Vibe / Mood
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {emojiOptions.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => setSelectedEmoji(emoji)}
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '12px',
                    border: selectedEmoji === emoji ? '2px solid #EE3865' : '1px solid #E5E7EB',
                    background: selectedEmoji === emoji ? 'rgba(238,56,101,0.08)' : '#FFFFFF',
                    fontSize: '1.15rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, color: '#6B7280', marginBottom: '6px' }}>
              Note (Max 60 chars)
            </label>
            <input
              type="text"
              maxLength={60}
              placeholder="e.g. Listening to Lana Del Rey 🎧"
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: '16px',
                border: '1.5px solid #E5E7EB',
                fontSize: '0.92rem',
                outline: 'none',
                background: '#FFFFFF'
              }}
            />
            <span style={{ display: 'block', textAlign: 'right', fontSize: '0.72rem', color: '#9CA3AF', marginTop: '4px' }}>
              {noteText.length}/60
            </span>
          </div>

          <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
            {myStatusNote && (
              <button
                type="button"
                onClick={handleClear}
                disabled={isSubmitting}
                style={{
                  padding: '12px 16px',
                  borderRadius: '999px',
                  border: '1.5px solid #FCA5A5',
                  background: '#FEF2F2',
                  color: '#EF4444',
                  fontWeight: 800,
                  fontSize: '0.88rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  cursor: 'pointer'
                }}
              >
                <Trash2 size={16} />
                <span>Clear</span>
              </button>
            )}

            <button
              type="submit"
              disabled={!noteText.trim() || isSubmitting}
              style={{
                flex: 1,
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
                cursor: noteText.trim() ? 'pointer' : 'default',
                boxShadow: '0 4px 14px rgba(238, 56, 101, 0.35)'
              }}
            >
              <Check size={17} />
              <span>{myStatusNote ? 'Update Note' : 'Share Note'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
