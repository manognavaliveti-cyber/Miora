import React, { useState, useRef } from 'react';
import { Send, Gift, Heart, Sparkles, Camera, Image, X, Check } from 'lucide-react';
import { MessageType } from '../../types';

interface MessageInputProps {
  onSendMessage: (text: string, type?: MessageType, metadata?: any) => void;
  disabled?: boolean;
}

const PRESET_GALLERY_PHOTOS = [
  {
    id: 'preset_coffee',
    name: 'Café Vibes',
    emoji: '☕',
    url: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80',
    caption: 'Cozy coffee moment ✨☕'
  },
  {
    id: 'preset_sunset',
    name: 'Golden Hour',
    emoji: '🌅',
    url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
    caption: 'Sunset sky is unreal today 🌅💫'
  },
  {
    id: 'preset_music',
    name: 'Vinyl Records',
    emoji: '🎵',
    url: 'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&w=800&q=80',
    caption: 'Found this vintage vinyl record store! 🎧🎶'
  },
  {
    id: 'preset_dog',
    name: 'Cute Pup',
    emoji: '🐕',
    url: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=800&q=80',
    caption: 'Met the sweetest furry friend today 🐶🐾'
  }
];

export const MessageInput: React.FC<MessageInputProps> = ({ onSendMessage, disabled = false }) => {
  const [text, setText] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageCaption, setImageCaption] = useState('');
  const [isGalleryDrawerOpen, setIsGalleryDrawerOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (disabled) return;

    if (selectedImage) {
      onSendMessage(imageCaption.trim() || 'Shared a photo 📸', 'image', {
        imageUrl: selectedImage,
        caption: imageCaption.trim()
      });
      setSelectedImage(null);
      setImageCaption('');
      setIsGalleryDrawerOpen(false);
      return;
    }

    if (!text.trim()) return;
    onSendMessage(text.trim(), 'text');
    setText('');
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setSelectedImage(event.target.result as string);
          setIsGalleryDrawerOpen(false);
        }
      };
      reader.readAsDataURL(file);
    }
    // reset input value so re-selecting same file triggers event
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSelectPreset = (url: string, defaultCaption: string) => {
    setSelectedImage(url);
    setImageCaption(defaultCaption);
    setIsGalleryDrawerOpen(false);
  };

  const handleSendGift = () => {
    onSendMessage('A sweet gift surprise for you! 🎁', 'gift', { giftEmoji: '🎁', giftName: 'Sweet Surprise' });
  };

  const handleSendHearts = () => {
    onSendMessage('Thank You ❤️', 'heart-crowned');
  };

  return (
    <div
      style={{
        padding: '12px 18px 20px 18px',
        background: 'rgba(255, 255, 255, 0.96)',
        backdropFilter: 'blur(20px)',
        borderTop: '1px solid rgba(244, 114, 182, 0.2)',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        zIndex: 10,
        fontFamily: 'var(--font-primary)'
      }}
    >
      {/* Hidden File Input for Camera & Gallery Upload */}
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleFileSelect}
      />

      {/* Selected Image Preview Capsule (Instagram / Snapchat Style) */}
      {selectedImage && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '10px 14px',
            background: 'linear-gradient(135deg, rgba(253, 232, 238, 0.9) 0%, rgba(254, 215, 226, 0.8) 100%)',
            border: '1.5px solid var(--border-light)',
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--shadow-sm)',
            animation: 'fadeIn 0.2s ease-out forwards'
          }}
        >
          <div style={{ position: 'relative', width: '56px', height: '56px', borderRadius: '14px', overflow: 'hidden', flexShrink: 0, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            <img
              src={selectedImage}
              alt="Preview"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            <button
              type="button"
              onClick={() => setSelectedImage(null)}
              style={{
                position: 'absolute',
                top: '2px',
                right: '2px',
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                background: 'rgba(0, 0, 0, 0.65)',
                color: '#FFFFFF',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              <X size={12} />
            </button>
          </div>

          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Camera size={13} color="var(--berry-primary)" />
              <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--berry-primary)' }}>
                Photo ready to send ✨
              </span>
            </div>
            <input
              type="text"
              value={imageCaption}
              onChange={(e) => setImageCaption(e.target.value)}
              placeholder="Add a sweet caption (optional)..."
              style={{
                width: '100%',
                padding: '6px 10px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid rgba(244, 63, 94, 0.25)',
                background: '#FFFFFF',
                fontSize: '0.85rem',
                color: 'var(--text-primary)',
                outline: 'none',
                fontFamily: 'var(--font-primary)'
              }}
            />
          </div>
        </div>
      )}

      {/* Quick Gallery Presets Drawer (Snapchat / Instagram Quick Photo Vibe) */}
      {isGalleryDrawerOpen && !selectedImage && (
        <div
          style={{
            padding: '12px',
            background: 'var(--bg-soft-blush)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-subtle)',
            boxShadow: 'var(--shadow-sm)',
            animation: 'fadeIn 0.2s ease-out forwards'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.76rem', fontWeight: 700, color: 'var(--berry-primary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Choose or Take a Photo 📸
            </span>
            <button
              type="button"
              onClick={() => setIsGalleryDrawerOpen(false)}
              style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
            >
              <X size={16} />
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))', gap: '8px' }}>
            {/* Upload from Device Gallery Button */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                padding: '12px 8px',
                borderRadius: 'var(--radius-md)',
                background: '#FFFFFF',
                border: '1.5px dashed var(--berry-primary)',
                color: 'var(--berry-primary)',
                cursor: 'pointer',
                transition: 'all var(--transition-fast)'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.03)')}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            >
              <Camera size={22} color="var(--berry-primary)" />
              <span style={{ fontSize: '0.75rem', fontWeight: 700 }}>Upload / Cam</span>
            </button>

            {/* Aesthetic Gallery Presets */}
            {PRESET_GALLERY_PHOTOS.map((preset) => (
              <button
                key={preset.id}
                type="button"
                onClick={() => handleSelectPreset(preset.url, preset.caption)}
                style={{
                  position: 'relative',
                  height: '70px',
                  borderRadius: 'var(--radius-md)',
                  overflow: 'hidden',
                  border: '1px solid var(--border-subtle)',
                  padding: 0,
                  cursor: 'pointer',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.06)',
                  transition: 'transform var(--transition-fast)'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.04)')}
                onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
              >
                <img
                  src={preset.url}
                  alt={preset.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    padding: '3px 6px',
                    background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)',
                    color: '#FFFFFF',
                    fontSize: '0.68rem',
                    fontWeight: 700,
                    textAlign: 'left'
                  }}
                >
                  {preset.emoji} {preset.name}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Quick Interactive Triggers for Romantic Features */}
      <div
        className="scroll-touch-x"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          overflowX: 'auto',
          paddingBottom: '2px',
          whiteSpace: 'nowrap'
        }}
      >
        <button
          type="button"
          onClick={handleSendGift}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '5px',
            background: 'linear-gradient(135deg, #FDE2E8 0%, #FDD2DE 100%)',
            border: '1px solid rgba(244, 63, 94, 0.3)',
            padding: '5px 12px',
            borderRadius: '9999px',
            fontSize: '0.78rem',
            fontWeight: 700,
            color: '#BE123C',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
            transition: 'all 0.15s ease',
            flexShrink: 0
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.04)')}
          onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
        >
          <Gift size={13} color="#BE123C" />
          <span>Send Gift 🎁</span>
        </button>

        <button
          type="button"
          onClick={handleSendHearts}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '5px',
            background: 'linear-gradient(135deg, #FEE2E2 0%, #FECACA 100%)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            padding: '5px 12px',
            borderRadius: '9999px',
            fontSize: '0.78rem',
            fontWeight: 700,
            color: '#DC2626',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
            transition: 'all 0.15s ease',
            flexShrink: 0
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.04)')}
          onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
        >
          <Heart size={13} fill="#DC2626" color="#DC2626" />
          <span>Heart Crown ❤️</span>
        </button>

        {['Hey! Your Pic is amazing 😍', 'Coffee date this weekend? ☕', 'Love your vibe! ✨'].map((pillText, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => onSendMessage(pillText, 'text')}
            style={{
              background: '#FDF2F4',
              border: '1px solid rgba(244, 114, 182, 0.25)',
              padding: '5px 12px',
              borderRadius: '9999px',
              fontSize: '0.78rem',
              fontWeight: 600,
              color: '#4B5563',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all 0.15s ease',
              flexShrink: 0
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#BE123C';
              e.currentTarget.style.color = '#BE123C';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(244, 114, 182, 0.25)';
              e.currentTarget.style.color = '#4B5563';
            }}
          >
            {pillText}
          </button>
        ))}
      </div>

      {/* Main Input Form with Camera Button, White Capsule & Send Button */}
      <form onSubmit={handleSend} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        {/* Instagram / Snapchat Style Camera Icon Button */}
        <button
          type="button"
          onClick={() => setIsGalleryDrawerOpen(!isGalleryDrawerOpen)}
          title="Send photo from camera or gallery"
          style={{
            width: '42px',
            height: '42px',
            borderRadius: '50%',
            background: isGalleryDrawerOpen ? 'var(--primary-gradient)' : 'var(--bg-soft-blush)',
            border: '1.5px solid var(--border-light)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: isGalleryDrawerOpen ? '#FFFFFF' : 'var(--berry-primary)',
            cursor: 'pointer',
            boxShadow: 'var(--shadow-xs)',
            transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
            flexShrink: 0
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.08)';
            e.currentTarget.style.boxShadow = 'var(--shadow-berry-glow)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = 'var(--shadow-xs)';
          }}
        >
          <Camera size={20} strokeWidth={2.2} />
        </button>

        {/* Text Input Capsule */}
        <div style={{ flex: 1, minWidth: 0, position: 'relative', display: 'flex', alignItems: 'center' }}>
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={selectedImage ? 'Ready to send photo...' : 'Message...'}
            disabled={disabled}
            style={{
              width: '100%',
              padding: '11px 16px',
              borderRadius: '9999px',
              border: '1.5px solid rgba(244, 114, 182, 0.35)',
              background: '#FFFFFF',
              fontFamily: 'var(--font-primary)',
              fontSize: '0.9rem',
              color: '#1F2937',
              outline: 'none',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
              transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
              boxSizing: 'border-box'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#F43F5E';
              e.target.style.boxShadow = '0 0 0 3px rgba(244, 63, 94, 0.15)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = 'rgba(244, 114, 182, 0.35)';
              e.target.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.04)';
            }}
          />
        </div>

        {/* Circular Vibrant Pink Gradient Send Button */}
        <button
          type="submit"
          disabled={(!text.trim() && !selectedImage) || disabled}
          aria-label="Send Message"
          style={{
            width: '42px',
            height: '42px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #EE3865 0%, #F43F5E 50%, #EC4899 100%)',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFFFFF',
            cursor: (text.trim() || selectedImage) && !disabled ? 'pointer' : 'default',
            boxShadow: '0 4px 14px rgba(238, 56, 101, 0.42)',
            opacity: (text.trim() || selectedImage) && !disabled ? 1 : 0.75,
            transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
            flexShrink: 0
          }}
          onMouseEnter={(e) => {
            if (text.trim() || selectedImage) e.currentTarget.style.transform = 'scale(1.08)';
          }}
          onMouseLeave={(e) => {
            if (text.trim() || selectedImage) e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ transform: 'translateX(1px) translateY(-1px)' }}>
            <path
              d="M2.01 21L23 12L2.01 3L2 10L17 12L2 14L2.01 21Z"
              fill="#FFFFFF"
            />
          </svg>
        </button>
      </form>
    </div>
  );
};
