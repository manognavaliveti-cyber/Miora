import React, { useState, useRef, useEffect } from 'react';
import { Send, Gift, Heart, Sparkles, Camera, Image, X, Check, Mic, Zap, Plus, Gamepad2 } from 'lucide-react';
import { MessageType } from '../../types';
import { useApp } from '../../context/AppContext';
import { MIORA_PRICING, CHAT_PER_MINUTE_INR } from '../../config/pricing';

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

const SPECIAL_CHAT_FEATURES = [
  {
    id: 'feat_vibe_question',
    title: '💫 Deep-Dive Vibe Question',
    emoji: '💫',
    prompt: "What is a secret dream destination you'd run away to with the right person?",
    tag: 'Compatibility Spark'
  },
  {
    id: 'feat_flirty_icebreaker',
    title: '🔥 Romantic Movie Meet-Cute',
    emoji: '🔥',
    prompt: "If we starred in a romantic movie, how would our meet-cute happen?",
    tag: 'Flirty Icebreaker'
  },
  {
    id: 'feat_midnight_confession',
    title: '🌙 Midnight Sweet Question',
    emoji: '🌙',
    prompt: "What is the sweetest, most thoughtful gesture someone has ever done for you?",
    tag: 'Heart to Heart'
  }
];

export const MessageInput: React.FC<MessageInputProps> = ({ onSendMessage, disabled = false }) => {
  const {
    currentUser,
    spendCoins,
    navigateToTab,
    showToast,
    activeMatch,
    currentChatMessages,
    openGiftModal,
    startGameWithPartner,
    coupleGames,
    openWalletPackModal
  } = useApp();

  const [text, setText] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageCaption, setImageCaption] = useState('');
  const [isGalleryDrawerOpen, setIsGalleryDrawerOpen] = useState(false);
  const [isSpecialFeaturesOpen, setIsSpecialFeaturesOpen] = useState(false);
  const [isPriorityMode, setIsPriorityMode] = useState(false);
  const [isActionTrayOpen, setIsActionTrayOpen] = useState(false);

  // Voice recording simulation state
  const [isRecordingVoice, setIsRecordingVoice] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isRecordingVoice) {
      setRecordingSeconds(0);
      timer = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isRecordingVoice]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (disabled) return;

    // Chat is pay-per-minute: with less than one minute's price in the wallet, ask for a top-up.
    if ((currentUser.walletBalance || 0) < CHAT_PER_MINUTE_INR) {
      openWalletPackModal(`Chat costs ₹${CHAT_PER_MINUTE_INR}/min — add money to keep chatting.`, CHAT_PER_MINUTE_INR);
      return;
    }

    // 1. Send Photo Message (15 Coins)
    if (selectedImage) {
      const photoCost = MIORA_PRICING.chat.sendPhotoCoins;
      if (currentUser.coinBalance < photoCost) {
        showToast(`Sending a photo requires ${photoCost} coins 🪙`);
        navigateToTab('wallet');
        return;
      }

      const ok = spendCoins(photoCost, 'Sent Photo in Chat 📸');
      if (!ok) {
        navigateToTab('wallet');
        return;
      }

      onSendMessage(imageCaption.trim() || 'Shared a photo 📸', 'image', {
        imageUrl: selectedImage,
        caption: imageCaption.trim()
      });
      setSelectedImage(null);
      setImageCaption('');
      setIsGalleryDrawerOpen(false);
      showToast(`Photo sent! -${photoCost} Coins 🪙`);
      return;
    }

    if (!text.trim()) return;

    // 2. Send Priority Message (25 Coins)
    if (isPriorityMode) {
      const priorityCost = MIORA_PRICING.chat.priorityMessageCoins;
      if (currentUser.coinBalance < priorityCost) {
        showToast(`Priority delivery requires ${priorityCost} coins ⚡`);
        navigateToTab('wallet');
        return;
      }

      const ok = spendCoins(priorityCost, 'Sent Priority Message ⚡');
      if (!ok) {
        navigateToTab('wallet');
        return;
      }

      onSendMessage(text.trim(), 'priority', { isPriority: true });
      setText('');
      setIsPriorityMode(false);
      showToast(`Priority Message Sent! -${priorityCost} Coins ⚡`);
      return;
    }

    // 3. Regular text message — no per-message fee. Chat is billed ₹3 per completed minute from the wallet.
    onSendMessage(text.trim(), 'text');
    setText('');
  };

  const handleSendVoiceMessage = () => {
    const voiceCost = MIORA_PRICING.chat.sendVoiceMessageCoins;
    if (currentUser.coinBalance < voiceCost) {
      showToast(`Sending a voice note requires ${voiceCost} coins 🎙️`);
      setIsRecordingVoice(false);
      navigateToTab('wallet');
      return;
    }

    const ok = spendCoins(voiceCost, 'Sent Voice Message 🎙️');
    if (!ok) {
      navigateToTab('wallet');
      return;
    }

    const dur = Math.max(3, recordingSeconds);
    onSendMessage(`Voice message (0:${String(dur).padStart(2, '0')}s) 🎙️`, 'voice', {
      audioDurationSec: dur
    });

    setIsRecordingVoice(false);
    showToast(`Voice Note Sent! -${voiceCost} Coins 🎙️`);
  };

  const handleUnlockSpecialFeature = (feat: typeof SPECIAL_CHAT_FEATURES[0]) => {
    const featCost = MIORA_PRICING.chat.unlockSpecialFeatureCoins;
    if (currentUser.coinBalance < featCost) {
      showToast(`Unlocking special chat feature requires ${featCost} coins ✨`);
      navigateToTab('wallet');
      return;
    }

    const ok = spendCoins(featCost, `Unlocked ${feat.title} ✨`);
    if (!ok) {
      navigateToTab('wallet');
      return;
    }

    onSendMessage(feat.prompt, 'special-feature', {
      featureName: feat.title,
      featureEmoji: feat.emoji
    });

    setIsSpecialFeaturesOpen(false);
    showToast(`${feat.title} Unlocked & Sent! -${featCost} Coins ✨`);
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
        flexShrink: 0,
        padding: '12px 18px calc(16px + env(safe-area-inset-bottom, 0px)) 18px',
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

      {/* Voice Recorder Active Bar */}
      {isRecordingVoice && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '12px 18px',
            background: 'linear-gradient(135deg, #FFF1F4 0%, #FFE4E9 100%)',
            borderRadius: 'var(--radius-lg)',
            border: '1.5px solid var(--berry-bright)',
            boxShadow: '0 4px 16px rgba(244, 63, 94, 0.18)',
            animation: 'fadeIn 0.2s ease-out forwards'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                background: '#EF4444',
                animation: 'liveDotPulse 1.2s infinite ease-in-out'
              }}
            />
            <span style={{ fontSize: '0.86rem', fontWeight: 800, color: 'var(--berry-primary)' }}>
              Recording Voice Note: 0:{String(recordingSeconds).padStart(2, '0')}
            </span>
            <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', background: 'rgba(255,255,255,0.7)', padding: '2px 8px', borderRadius: '12px', fontWeight: 700 }}>
              20 Coins 🪙
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              type="button"
              onClick={() => setIsRecordingVoice(false)}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-muted)',
                fontSize: '0.8rem',
                fontWeight: 700,
                cursor: 'pointer',
                padding: '4px 8px'
              }}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSendVoiceMessage}
              style={{
                background: 'var(--primary-gradient)',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: 'var(--radius-pill)',
                padding: '6px 16px',
                fontSize: '0.82rem',
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                cursor: 'pointer',
                boxShadow: '0 2px 10px rgba(238, 56, 101, 0.35)'
              }}
            >
              <Send size={14} />
              <span>Send (20🪙)</span>
            </button>
          </div>
        </div>
      )}

      {/* Selected Image Preview Capsule */}
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
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Camera size={13} color="var(--berry-primary)" />
                <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--berry-primary)' }}>
                  Photo ready to send ✨
                </span>
              </div>
              <span style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--berry-primary)', background: '#FFFFFF', padding: '2px 8px', borderRadius: '12px' }}>
                15 Coins 🪙
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

      {/* Quick Gallery Presets Drawer */}
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
              Send Photo (15 Coins 🪙)
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

      {/* Special Chat Features Unlock Drawer (30 Coins) */}
      {isSpecialFeaturesOpen && (
        <div
          style={{
            padding: '14px',
            background: 'linear-gradient(135deg, #FFF9FA 0%, #FDF2F5 100%)',
            borderRadius: 'var(--radius-lg)',
            border: '1.5px solid var(--border-gold)',
            boxShadow: '0 8px 24px rgba(212, 175, 55, 0.22)',
            animation: 'fadeIn 0.2s ease-out forwards'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Sparkles size={16} color="var(--gold-deep)" />
              <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--gold-deep)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Unlock Special Feature (30 Coins 🪙)
              </span>
            </div>
            <button
              type="button"
              onClick={() => setIsSpecialFeaturesOpen(false)}
              style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
            >
              <X size={16} />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {SPECIAL_CHAT_FEATURES.map((feat) => (
              <button
                key={feat.id}
                type="button"
                onClick={() => handleUnlockSpecialFeature(feat)}
                style={{
                  padding: '10px 14px',
                  borderRadius: '16px',
                  background: '#FFFFFF',
                  border: '1px solid rgba(212, 175, 55, 0.35)',
                  textAlign: 'left',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '12px',
                  transition: 'all 0.15s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--gold-champagne)';
                  e.currentTarget.style.boxShadow = '0 4px 14px rgba(212, 175, 55, 0.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.35)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div>
                  <div style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '2px' }}>
                    {feat.title}
                  </div>
                  <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)' }}>
                    "{feat.prompt}"
                  </div>
                </div>
                <div style={{ background: 'var(--gold-gradient-subtle)', padding: '4px 10px', borderRadius: '12px', fontSize: '0.72rem', fontWeight: 800, color: 'var(--gold-deep)', whiteSpace: 'nowrap' }}>
                  Unlock 30🪙
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Expandable Action Tray toggled by the + button */}
      {isActionTrayOpen && (
        <div
          style={{
            padding: '12px',
            background: 'linear-gradient(135deg, #FFF9FA 0%, #FFF1F4 100%)',
            borderRadius: 'var(--radius-lg)',
            border: '1.5px solid var(--border-light)',
            boxShadow: '0 -4px 20px rgba(136, 19, 55, 0.08)',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            animation: 'fadeIn 0.2s ease-out forwards'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.76rem', fontWeight: 800, color: 'var(--berry-primary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Special Actions & Features
            </span>
            <button
              type="button"
              onClick={() => setIsActionTrayOpen(false)}
              style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
            >
              <X size={16} />
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
            {/* Priority Toggle */}
            <button
              type="button"
              onClick={() => {
                setIsPriorityMode(!isPriorityMode);
                setIsActionTrayOpen(false);
                if (!isPriorityMode) showToast('Priority mode enabled (25 Coins on send) ⚡');
              }}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '4px',
                padding: '10px 6px',
                borderRadius: '12px',
                background: isPriorityMode ? 'var(--gold-gradient)' : '#FFFFFF',
                border: isPriorityMode ? '1.5px solid #FFFFFF' : '1px solid var(--border-gold)',
                color: isPriorityMode ? '#4C0519' : 'var(--gold-deep)',
                cursor: 'pointer',
                fontSize: '0.72rem',
                fontWeight: 800
              }}
            >
              <Zap size={18} fill={isPriorityMode ? '#4C0519' : 'var(--gold-deep)'} />
              <span>{isPriorityMode ? 'Priority On' : 'Priority (25🪙)'}</span>
            </button>

            {/* Voice Note */}
            <button
              type="button"
              onClick={() => {
                setIsRecordingVoice(true);
                setIsActionTrayOpen(false);
              }}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '4px',
                padding: '10px 6px',
                borderRadius: '12px',
                background: '#FFFFFF',
                border: '1px solid rgba(244, 63, 94, 0.3)',
                color: '#BE123C',
                cursor: 'pointer',
                fontSize: '0.72rem',
                fontWeight: 700
              }}
            >
              <Mic size={18} color="#BE123C" />
              <span>Voice (20🪙)</span>
            </button>

            {/* Special Feature */}
            <button
              type="button"
              onClick={() => {
                setIsSpecialFeaturesOpen(true);
                setIsActionTrayOpen(false);
              }}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '4px',
                padding: '10px 6px',
                borderRadius: '12px',
                background: '#FFFFFF',
                border: '1px solid rgba(212, 175, 55, 0.4)',
                color: 'var(--gold-deep)',
                cursor: 'pointer',
                fontSize: '0.72rem',
                fontWeight: 700
              }}
            >
              <Sparkles size={18} color="var(--gold-deep)" />
              <span>Special (30🪙)</span>
            </button>

            {/* Send Gift */}
            <button
              type="button"
              onClick={() => {
                if (activeMatch?.profile) openGiftModal(activeMatch.profile);
                else handleSendGift();
                setIsActionTrayOpen(false);
              }}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '4px',
                padding: '10px 6px',
                borderRadius: '12px',
                background: '#FFFFFF',
                border: '1px solid rgba(244, 63, 94, 0.3)',
                color: '#BE123C',
                cursor: 'pointer',
                fontSize: '0.72rem',
                fontWeight: 700
              }}
            >
              <Gift size={18} color="#BE123C" />
              <span>Send Gift 🎁</span>
            </button>

            {/* Heart Crown */}
            <button
              type="button"
              onClick={() => {
                handleSendHearts();
                setIsActionTrayOpen(false);
              }}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '4px',
                padding: '10px 6px',
                borderRadius: '12px',
                background: '#FFFFFF',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                color: '#DC2626',
                cursor: 'pointer',
                fontSize: '0.72rem',
                fontWeight: 700
              }}
            >
              <Heart size={18} fill="#DC2626" color="#DC2626" />
              <span>Heart Crown ❤️</span>
            </button>

            {/* Couple Game */}
            <button
              type="button"
              onClick={() => {
                if (activeMatch?.profile && coupleGames?.length > 0) {
                  startGameWithPartner(coupleGames[0], activeMatch.profile);
                } else {
                  showToast('Select a partner to play couple game 🎮');
                }
                setIsActionTrayOpen(false);
              }}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '4px',
                padding: '10px 6px',
                borderRadius: '12px',
                background: '#FFFFFF',
                border: '1px solid rgba(136, 19, 55, 0.25)',
                color: 'var(--berry-primary)',
                cursor: 'pointer',
                fontSize: '0.72rem',
                fontWeight: 700
              }}
            >
              <Gamepad2 size={18} />
              <span>Play Game 🎮</span>
            </button>
          </div>

          {/* Quick Icebreakers */}
          <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingTop: '4px' }}>
            {['Hey! Your Pic is amazing 😍', 'Coffee date this weekend? ☕', 'Love your vibe! ✨'].map((pillText, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  onSendMessage(pillText, 'text');
                  setIsActionTrayOpen(false);
                }}
                style={{
                  background: '#FFFFFF',
                  border: '1px solid rgba(244, 114, 182, 0.3)',
                  padding: '4px 10px',
                  borderRadius: '9999px',
                  fontSize: '0.74rem',
                  fontWeight: 600,
                  color: '#4B5563',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  flexShrink: 0
                }}
              >
                {pillText}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Main Input Form with + Action Tray Button, Camera Button, Text Capsule & Send Button */}
      <form onSubmit={handleSend} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        {/* Compact + Plus Button (Toggles Action Tray) */}
        <button
          type="button"
          onClick={() => {
            setIsActionTrayOpen(!isActionTrayOpen);
            if (isGalleryDrawerOpen) setIsGalleryDrawerOpen(false);
            if (isSpecialFeaturesOpen) setIsSpecialFeaturesOpen(false);
          }}
          title="More actions (+)"
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            background: isActionTrayOpen ? 'var(--primary-gradient)' : 'var(--bg-soft-blush)',
            border: '1.5px solid var(--border-light)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: isActionTrayOpen ? '#FFFFFF' : 'var(--berry-primary)',
            cursor: 'pointer',
            boxShadow: 'var(--shadow-xs)',
            transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
            flexShrink: 0
          }}
        >
          <Plus size={20} strokeWidth={2.5} style={{ transform: isActionTrayOpen ? 'rotate(45deg)' : 'none', transition: 'transform 0.2s ease' }} />
        </button>

        {/* Instagram / Snapchat Style Camera Icon Button (15 Coins) */}
        <button
          type="button"
          onClick={() => {
            setIsGalleryDrawerOpen(!isGalleryDrawerOpen);
            if (isActionTrayOpen) setIsActionTrayOpen(false);
            if (isSpecialFeaturesOpen) setIsSpecialFeaturesOpen(false);
          }}
          title="Send photo from camera or gallery (15 Coins)"
          style={{
            width: '40px',
            height: '40px',
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
        >
          <Camera size={19} strokeWidth={2.2} />
        </button>

        {/* Text Input Capsule */}
        <div style={{ flex: 1, minWidth: 0, position: 'relative', display: 'flex', alignItems: 'center' }}>
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={
              isPriorityMode
                ? '⚡ Type Priority Message (25 Coins)...'
                : selectedImage
                ? 'Ready to send photo (15 Coins)...'
                : 'Message...'
            }
            disabled={disabled}
            style={{
              width: '100%',
              padding: '10px 16px',
              borderRadius: '9999px',
              border: isPriorityMode
                ? '2px solid var(--gold-champagne)'
                : '1.5px solid rgba(244, 114, 182, 0.35)',
              background: isPriorityMode ? '#FFFDF8' : '#FFFFFF',
              fontFamily: 'var(--font-primary)',
              fontSize: '0.9rem',
              color: '#1F2937',
              outline: 'none',
              boxShadow: isPriorityMode ? '0 0 12px rgba(212, 175, 55, 0.25)' : '0 2px 8px rgba(0, 0, 0, 0.04)',
              transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
              boxSizing: 'border-box'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = isPriorityMode ? '#D4AF37' : '#F43F5E';
              e.target.style.boxShadow = isPriorityMode
                ? '0 0 0 3px rgba(212, 175, 55, 0.25)'
                : '0 0 0 3px rgba(244, 63, 94, 0.15)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = isPriorityMode ? 'var(--gold-champagne)' : 'rgba(244, 114, 182, 0.35)';
              e.target.style.boxShadow = isPriorityMode ? '0 0 12px rgba(212, 175, 55, 0.25)' : '0 2px 8px rgba(0, 0, 0, 0.04)';
            }}
          />
        </div>

        {/* Circular Vibrant Pink / Gold Send Button */}
        <button
          type="submit"
          disabled={(!text.trim() && !selectedImage) || disabled}
          aria-label="Send Message"
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            background: isPriorityMode
              ? 'linear-gradient(135deg, #F9E7B4 0%, #D4AF37 50%, #B89230 100%)'
              : 'linear-gradient(135deg, #EE3865 0%, #F43F5E 50%, #EC4899 100%)',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: isPriorityMode ? '#4C0519' : '#FFFFFF',
            cursor: (text.trim() || selectedImage) && !disabled ? 'pointer' : 'default',
            boxShadow: isPriorityMode
              ? '0 4px 14px rgba(212, 175, 55, 0.5)'
              : '0 4px 14px rgba(238, 56, 101, 0.42)',
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
              fill={isPriorityMode ? '#4C0519' : '#FFFFFF'}
            />
          </svg>
        </button>
      </form>
    </div>
  );
};

