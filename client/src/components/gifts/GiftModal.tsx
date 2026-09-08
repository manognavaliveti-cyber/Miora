import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Coins, Sparkles, Plus, Gift as GiftIcon } from 'lucide-react';
import { MIORA_PRICING, VirtualGiftDef } from '../../config/pricing';
import { VirtualGift } from '../../types';

export const GiftModal: React.FC = () => {
  const {
    isGiftModalOpen,
    closeGiftModal,
    giftTargetProfile,
    sendVirtualGift,
    currentUser,
    setCurrentView
  } = useApp();

  const [selectedCategory, setSelectedCategory] = useState<'all' | 'romantic' | 'luxury' | 'fun'>('all');
  const [selectedGift, setSelectedGift] = useState<VirtualGiftDef | null>(MIORA_PRICING.gifts[0]);

  if (!isGiftModalOpen) return null;

  const filteredGifts = MIORA_PRICING.gifts.filter((g) =>
    selectedCategory === 'all' ? true : g.category === selectedCategory
  );

  const handleSend = () => {
    if (selectedGift) {
      sendVirtualGift(selectedGift as VirtualGift, giftTargetProfile || undefined);
    }
  };

  const handleRecharge = () => {
    closeGiftModal();
    setCurrentView('wallet');
  };

  const recipientName = giftTargetProfile?.name || 'Your Match';

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 95,
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
          maxHeight: '90vh',
          overflowY: 'auto',
          background: 'linear-gradient(180deg, #FFFFFF 0%, #FFF5F7 100%)',
          borderRadius: '28px',
          boxShadow: '0 24px 60px rgba(76, 5, 25, 0.35)',
          border: '1.5px solid var(--border-gold)',
          padding: 'clamp(18px, 4vw, 24px) clamp(14px, 3.5vw, 20px)',
          position: 'relative'
        }}
      >
        {/* Ambient Top Glow */}
        <div
          style={{
            position: 'absolute',
            top: '-50px',
            right: '-50px',
            width: '140px',
            height: '140px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(238, 56, 101, 0.25) 0%, transparent 70%)',
            pointerEvents: 'none'
          }}
        />

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <GiftIcon size={20} color="var(--berry-primary)" />
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.45rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                Send Gift to {recipientName}
              </h3>
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
              Express your genuine feelings with romantic virtual gifts.
            </p>
          </div>

          <button
            onClick={closeGiftModal}
            style={{
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
        </div>

        {/* User Balance & Recharge Button */}
        <div
          style={{
            background: 'var(--surface-white)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '18px',
            padding: '10px 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '16px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Coins size={18} color="var(--gold-deep)" />
            <span style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              Coin Balance: <strong style={{ color: 'var(--berry-primary)' }}>{currentUser.coinBalance}</strong>
            </span>
          </div>

          <button
            onClick={handleRecharge}
            style={{
              background: 'var(--gold-gradient-subtle)',
              border: '1px solid var(--border-gold)',
              color: 'var(--gold-deep)',
              padding: '5px 14px',
              borderRadius: 'var(--radius-pill)',
              fontSize: '0.78rem',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <Plus size={13} />
            <span>Recharge</span>
          </button>
        </div>

        {/* Category Tabs */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', overflowX: 'auto', paddingBottom: '4px' }}>
          {(['all', 'romantic', 'luxury', 'fun'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              style={{
                padding: '6px 14px',
                borderRadius: 'var(--radius-pill)',
                border: 'none',
                background: selectedCategory === cat ? 'var(--primary-gradient)' : 'var(--surface-white)',
                color: selectedCategory === cat ? '#FFFFFF' : 'var(--text-secondary)',
                fontSize: '0.8rem',
                fontWeight: 700,
                textTransform: 'capitalize',
                cursor: 'pointer',
                boxShadow: selectedCategory === cat ? '0 2px 8px rgba(238, 56, 101, 0.3)' : 'var(--shadow-xs)'
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Gift Grid (10 items) */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(70px, 1fr))',
            gap: '10px',
            marginBottom: '20px',
            maxHeight: '230px',
            overflowY: 'auto',
            padding: '4px'
          }}
        >
          {filteredGifts.map((gift) => {
            const isSelected = selectedGift?.id === gift.id;
            return (
              <div
                key={gift.id}
                onClick={() => setSelectedGift(gift)}
                style={{
                  background: isSelected
                    ? 'linear-gradient(135deg, rgba(238, 56, 101, 0.12) 0%, rgba(251, 113, 133, 0.08) 100%)'
                    : 'var(--surface-white)',
                  border: isSelected ? '2px solid var(--berry-primary)' : '1px solid var(--border-subtle)',
                  borderRadius: '18px',
                  padding: '12px 6px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'all var(--transition-fast)',
                  transform: isSelected ? 'scale(1.05)' : 'scale(1)',
                  boxShadow: isSelected ? '0 4px 14px rgba(238, 56, 101, 0.2)' : 'var(--shadow-xs)'
                }}
              >
                <div style={{ fontSize: '2rem', marginBottom: '4px' }}>{gift.emoji}</div>
                <div
                  style={{
                    fontSize: '0.74rem',
                    fontWeight: 800,
                    color: 'var(--text-primary)',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}
                >
                  {gift.name}
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '2px',
                    fontSize: '0.72rem',
                    fontWeight: 800,
                    color: 'var(--gold-deep)',
                    marginTop: '2px'
                  }}
                >
                  <span>💰</span>
                  <span>{gift.coinValue}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Send Action */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
          {selectedGift && (
            <div style={{ fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
              Cost: <strong style={{ color: 'var(--berry-primary)', fontSize: '0.98rem' }}>💰 {selectedGift.coinValue} Coins</strong>
            </div>
          )}

          <button
            onClick={handleSend}
            disabled={!selectedGift}
            style={{
              flex: 1,
              background: 'var(--primary-gradient)',
              color: '#FFFFFF',
              border: 'none',
              padding: '13px 24px',
              borderRadius: 'var(--radius-pill)',
              fontWeight: 800,
              fontSize: '0.95rem',
              cursor: selectedGift ? 'pointer' : 'not-allowed',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: 'var(--shadow-berry-glow)',
              transition: 'transform var(--transition-fast)'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.02)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          >
            <Sparkles size={18} />
            <span>Send {selectedGift?.emoji} {selectedGift?.name}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
