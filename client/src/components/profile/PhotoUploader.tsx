import React, { useState } from 'react';
import { Plus, X, Image as ImageIcon } from 'lucide-react';

interface PhotoUploaderProps {
  photos: string[];
  onChange: (photos: string[]) => void;
  maxPhotos?: number;
}

export const PhotoUploader: React.FC<PhotoUploaderProps> = ({
  photos,
  onChange,
  maxPhotos = 6
}) => {
  const [showPresetPicker, setShowPresetPicker] = useState<number | null>(null);

  const handleRemove = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const next = photos.filter((_, idx) => idx !== index);
    onChange(next);
  };



  const handleSelectPreset = (url: string) => {
    if (showPresetPicker === null) return;
    const next = [...photos];
    if (showPresetPicker < next.length) next[showPresetPicker] = url;
    else next.push(url);
    onChange(next);
    setShowPresetPicker(null);
  };

  // Generate 6 slots
  const slots = Array.from({ length: maxPhotos }, (_, i) => photos[i] || null);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '12px'
        }}
      >
        {slots.map((photoUrl, idx) => {
          const isCover = idx === 0;
          return (
            <div
              key={idx}
              onClick={() => setShowPresetPicker(idx)}
              style={{
                aspectRatio: '3/4',
                borderRadius: 'var(--radius-md)',
                position: 'relative',
                overflow: 'hidden',
                background: photoUrl ? '#1E1B1E' : 'var(--bg-blush-accent)',
                border: photoUrl
                  ? '2px solid rgba(225, 29, 72, 0.15)'
                  : '2px dashed var(--border-light)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: photoUrl ? 'var(--shadow-sm)' : 'none',
                transition: 'all var(--transition-fast)'
              }}
            >
              {photoUrl ? (
                <>
                  <img
                    src={photoUrl}
                    alt={`Photo slot ${idx + 1}`}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  {isCover && (
                    <span
                      style={{
                        position: 'absolute',
                        bottom: '6px',
                        left: '6px',
                        background: 'rgba(0,0,0,0.65)',
                        backdropFilter: 'blur(6px)',
                        color: '#FFFFFF',
                        fontSize: '0.65rem',
                        fontWeight: 700,
                        padding: '2px 8px',
                        borderRadius: 'var(--radius-pill)'
                      }}
                    >
                      Cover
                    </span>
                  )}
                  <button
                    onClick={(e) => handleRemove(idx, e)}
                    style={{
                      position: 'absolute',
                      top: '6px',
                      right: '6px',
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      background: 'rgba(0, 0, 0, 0.65)',
                      backdropFilter: 'blur(4px)',
                      color: '#FFFFFF',
                      border: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer'
                    }}
                  >
                    <X size={14} />
                  </button>
                </>
              ) : (
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '4px',
                    color: 'var(--primary-magenta)'
                  }}
                >
                  <Plus size={24} />
                  <span style={{ fontSize: '0.72rem', fontWeight: 600 }}>Add</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Preset Photo Selector Modal */}
      {showPresetPicker !== null && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            zIndex: 60,
            background: 'rgba(0, 0, 0, 0.65)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
        >
          <div
            className="card-white"
            style={{
              width: '100%',
              maxWidth: 'min(94vw, 420px)',
              maxHeight: '90vh',
              overflowY: 'auto',
              padding: 'clamp(16px, 4vw, 22px)',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <ImageIcon size={18} color="var(--primary-magenta)" />
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 800 }}>
                  Add a Photo
                </h3>
              </div>
              <button
                onClick={() => setShowPresetPicker(null)}
                style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
              Add a photo by pasting an image URL. Your profile will only use photos you provide.
            </p>


            {/* Upload Custom URL or Local file simulation */}
            <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '12px' }}>
              <label
                style={{
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  color: 'var(--text-secondary)',
                  display: 'block',
                  marginBottom: '6px'
                }}
              >
                Or Paste Image URL:
              </label>
              <input
                type="text"
                placeholder="https://..."
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                    handleSelectPreset(e.currentTarget.value.trim());
                  }
                }}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1.5px solid var(--border-subtle)',
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.85rem',
                  outline: 'none'
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
