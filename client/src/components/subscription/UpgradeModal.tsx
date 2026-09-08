import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { MIORA_PRICING, SubscriptionPlanDef } from '../../config/pricing';
import {
  X,
  Crown,
  Sparkles,
  Check,
  Zap,
  Flame,
  Star,
  Eye,
  SlidersHorizontal,
  Coins,
  ShieldCheck,
  Lock
} from 'lucide-react';
import { Button } from '../common/Button';

export const UpgradeModal: React.FC = () => {
  const {
    isUpgradeModalOpen,
    closeUpgradeModal,
    subscribeToPlan,
    currentUser,
    isLoading
  } = useApp();

  const [selectedPlanId, setSelectedPlanId] = useState<'gold' | 'vip' | 'monthly' | 'quarterly' | 'yearly'>('gold');
  const [paymentMethod, setPaymentMethod] = useState<'inr' | 'coins'>('inr');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  if (!isUpgradeModalOpen) return null;

  const plans = MIORA_PRICING.subscriptionPlans;
  const currentPlan = plans.find((p) => p.id === selectedPlanId) || plans[0];

  const handleUpgrade = async () => {
    setIsProcessing(true);
    try {
      await subscribeToPlan(selectedPlanId, paymentMethod);
      closeUpgradeModal();
    } catch (err) {
      console.error('Subscription error:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'rgba(15, 23, 42, 0.75)',
        backdropFilter: 'blur(12px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        animation: 'fadeIn 0.25s ease-out forwards',
        boxSizing: 'border-box'
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) closeUpgradeModal();
      }}
    >
      <div
        style={{
          background: 'linear-gradient(180deg, #FFFFFF 0%, #FFFDFD 100%)',
          width: '100%',
          maxWidth: '580px',
          maxHeight: '90vh',
          borderRadius: '28px',
          boxShadow: '0 25px 60px -15px rgba(136, 19, 55, 0.3), 0 0 0 1px rgba(212, 175, 55, 0.3)',
          overflowY: 'auto',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          boxSizing: 'border-box'
        }}
      >
        {/* Header Ribbon */}
        <div
          style={{
            background: 'linear-gradient(135deg, #4C0519 0%, #881337 50%, #BE123C 100%)',
            padding: '30px 24px 22px 24px',
            color: '#FFFFFF',
            position: 'relative',
            textAlign: 'center',
            overflow: 'hidden'
          }}
        >
          {/* Close button */}
          <button
            onClick={closeUpgradeModal}
            aria-label="Close"
            style={{
              position: 'absolute',
              top: '16px',
              right: '16px',
              background: 'rgba(255, 255, 255, 0.15)',
              border: 'none',
              borderRadius: '50%',
              width: '36px',
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              cursor: 'pointer',
              transition: 'background var(--transition-fast)'
            }}
          >
            <X size={18} />
          </button>

          {/* Crown Icon */}
          <div
            style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #FDE68A 0%, #D4AF37 50%, #92400E 100%)',
              margin: '0 auto 12px auto',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 24px rgba(212, 175, 55, 0.6)',
              border: '2px solid #FFFFFF'
            }}
          >
            <Crown size={30} color="#4C0519" />
          </div>

          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: 'rgba(253, 230, 138, 0.25)',
              border: '1px solid rgba(253, 230, 138, 0.5)',
              padding: '4px 12px',
              borderRadius: 'var(--radius-pill)',
              fontSize: '0.75rem',
              fontWeight: 800,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              color: '#FDE68A',
              marginBottom: '6px'
            }}
          >
            <Sparkles size={12} /> Unlock Full Romance Potential
          </span>

          <h2
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '1.75rem',
              fontWeight: 900,
              margin: '4px 0 6px 0',
              letterSpacing: '-0.02em',
              color: '#FFFFFF'
            }}
          >
            Choose Your MIORA Plan
          </h2>
          <p style={{ fontSize: '0.86rem', color: 'rgba(255, 255, 255, 0.88)', margin: 0 }}>
            Unlimited likes, secret admirers, call discounts, and instant bonus coins.
          </p>
        </div>

        {/* Content Body */}
        <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Plan Selector Grid */}
          <div>
            <label
              style={{
                display: 'block',
                fontSize: '0.82rem',
                fontWeight: 800,
                color: 'var(--text-secondary)',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                marginBottom: '10px'
              }}
            >
              Select Membership Tier:
            </label>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '12px'
              }}
            >
              {plans.map((plan) => {
                const isSelected = selectedPlanId === plan.id;
                const isVip = plan.id === 'vip';
                return (
                  <div
                    key={plan.id}
                    onClick={() => setSelectedPlanId(plan.id)}
                    style={{
                      border: isSelected
                        ? (isVip ? '2px solid #CA8A04' : '2px solid var(--berry-primary)')
                        : '1.5px solid var(--border-subtle)',
                      background: isSelected
                        ? (isVip ? 'linear-gradient(180deg, #FEFCE8 0%, #FFFFFF 100%)' : 'linear-gradient(180deg, #FFF1F2 0%, #FFFFFF 100%)')
                        : '#FFFFFF',
                      borderRadius: '20px',
                      padding: '16px 14px',
                      textAlign: 'center',
                      cursor: 'pointer',
                      position: 'relative',
                      boxShadow: isSelected
                        ? (isVip ? '0 12px 28px rgba(202, 138, 4, 0.2)' : '0 12px 28px rgba(136, 19, 55, 0.15)')
                        : 'var(--shadow-sm)',
                      transition: 'all var(--transition-fast)',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      minHeight: '140px'
                    }}
                  >
                    {/* Badge */}
                    {plan.badge && (
                      <div
                        style={{
                          position: 'absolute',
                          top: '-10px',
                          left: '50%',
                          transform: 'translateX(-50%)',
                          background: isVip
                            ? 'linear-gradient(135deg, #CA8A04 0%, #92400E 100%)'
                            : 'var(--primary-gradient)',
                          color: '#FFFFFF',
                          fontSize: '0.66rem',
                          fontWeight: 900,
                          padding: '2px 10px',
                          borderRadius: 'var(--radius-pill)',
                          whiteSpace: 'nowrap',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                        }}
                      >
                        {plan.badge}
                      </div>
                    )}

                    <div>
                      <div
                        style={{
                          fontSize: '1rem',
                          fontWeight: 900,
                          color: isSelected ? (isVip ? '#854D0E' : 'var(--berry-primary)') : 'var(--text-primary)',
                          marginTop: '6px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px'
                        }}
                      >
                        {isVip && <Crown size={16} color="#CA8A04" />}
                        {plan.name}
                      </div>
                      <div
                        style={{
                          fontSize: '1.4rem',
                          fontWeight: 900,
                          color: 'var(--text-primary)',
                          margin: '4px 0'
                        }}
                      >
                        ₹{plan.priceInr}
                        <span style={{ fontSize: '0.74rem', fontWeight: 600, color: 'var(--text-secondary)' }}>/month</span>
                      </div>
                    </div>

                    <div
                      style={{
                        fontSize: '0.78rem',
                        color: isVip ? '#B45309' : 'var(--berry-primary)',
                        fontWeight: 800,
                        background: isVip ? 'rgba(253, 230, 138, 0.35)' : 'rgba(255, 228, 230, 0.6)',
                        padding: '4px 8px',
                        borderRadius: 'var(--radius-pill)',
                        marginTop: '6px'
                      }}
                    >
                      +{plan.bonusCoins.toLocaleString()} Bonus Coins 🪙
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Payment Method Toggle */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: '#F8FAFC',
              padding: '8px 12px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)'
            }}
          >
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
              Pay via:
            </span>
            <div style={{ display: 'flex', gap: '6px' }}>
              <button
                onClick={() => setPaymentMethod('inr')}
                style={{
                  padding: '6px 14px',
                  borderRadius: 'var(--radius-pill)',
                  border: 'none',
                  background: paymentMethod === 'inr' ? 'var(--berry-primary)' : 'transparent',
                  color: paymentMethod === 'inr' ? '#FFFFFF' : 'var(--text-secondary)',
                  fontSize: '0.78rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  transition: 'all var(--transition-fast)'
                }}
              >
                ₹ INR UPI/Cards
              </button>
              <button
                onClick={() => setPaymentMethod('coins')}
                style={{
                  padding: '6px 14px',
                  borderRadius: 'var(--radius-pill)',
                  border: 'none',
                  background: paymentMethod === 'coins' ? 'var(--gold-deep)' : 'transparent',
                  color: paymentMethod === 'coins' ? '#FFFFFF' : 'var(--text-secondary)',
                  fontSize: '0.78rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  transition: 'all var(--transition-fast)'
                }}
              >
                <Coins size={13} /> {currentPlan.coinPrice} Coins
              </button>
            </div>
          </div>

          {/* Feature Breakdown */}
          <div
            style={{
              background: '#FFFDFD',
              border: '1px solid var(--border-gold)',
              borderRadius: '20px',
              padding: '16px'
            }}
          >
            <div
              style={{
                fontSize: '0.82rem',
                fontWeight: 800,
                color: 'var(--berry-primary)',
                marginBottom: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Sparkles size={14} color="var(--gold-deep)" /> Included with {currentPlan.name}:
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {currentPlan.features.map((feat, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div
                    style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      background: 'rgba(16, 185, 129, 0.12)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}
                  >
                    <Check size={14} color="#10B981" />
                  </div>
                  <div style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    {feat}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Button */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <Button
              variant="primary"
              size="lg"
              fullWidth
              loading={isProcessing || isLoading}
              onClick={handleUpgrade}
              style={{
                boxShadow: 'var(--shadow-berry-glow)',
                height: '52px',
                fontSize: '1rem',
                fontWeight: 900
              }}
            >
              <Crown size={20} />
              {paymentMethod === 'coins'
                ? `Activate ${currentPlan.name} for ${currentPlan.coinPrice} Coins`
                : `Get ${currentPlan.name} for ₹${currentPlan.priceInr}/month`}
            </Button>

            <p style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)', textAlign: 'center', margin: 0 }}>
              Includes +{currentPlan.bonusCoins.toLocaleString()} bonus coins credited instantly. Cancel anytime.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

