import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Coins, Sparkles, CreditCard, ShieldCheck, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import { MIORA_PRICING, RechargePackage } from '../../config/pricing';
import { paymentService } from '../../services/payment';

interface RechargeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RechargeModal: React.FC<RechargeModalProps> = ({ isOpen, onClose }) => {
  const { currentUser, updateWalletBalance, showToast } = useApp();

  const [selectedPkg, setSelectedPkg] = useState<RechargePackage>(
    MIORA_PRICING.rechargePackages.find((p) => p.popular) || MIORA_PRICING.rechargePackages[0]
  );
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [paymentStep, setPaymentStep] = useState<'select' | 'processing' | 'success' | 'error'>('select');
  const [successInfo, setSuccessInfo] = useState<{ addedCoins: number; newBalance: number } | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');

  if (!isOpen) return null;

  const handleBuyNow = async () => {
    setIsProcessing(true);
    setPaymentStep('processing');
    setErrorMessage('');

    await paymentService.initiateCheckout({
      packageId: selectedPkg.id,
      userName: currentUser.name,
      userEmail: currentUser.email,
      onSuccess: async (result) => {
        setIsProcessing(false);
        setSuccessInfo({
          addedCoins: result.coinsAdded,
          newBalance: result.newBalance
        });
        setPaymentStep('success');

        // Refresh global wallet balance & transactions
        await updateWalletBalance(result.newBalance, result.coinsAdded);
        showToast(`Payment Successful! +${result.coinsAdded} Coins added ✨`);
      },
      onError: (err) => {
        setIsProcessing(false);
        setErrorMessage(err || "Payment couldn't be completed.");
        setPaymentStep('error');
      },
      onDismiss: () => {
        setIsProcessing(false);
        setPaymentStep('select');
      }
    });
  };

  const handleClose = () => {
    setPaymentStep('select');
    setSuccessInfo(null);
    setErrorMessage('');
    setIsProcessing(false);
    onClose();
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 105,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(31, 22, 26, 0.78)',
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
          padding: 'clamp(20px, 4vw, 28px) clamp(16px, 3.5vw, 24px)',
          position: 'relative'
        }}
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
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

        {/* STEP 1: Package Selection */}
        {paymentStep === 'select' && (
          <>
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '20px',
                  background: 'var(--gold-gradient-subtle)',
                  border: '1.5px solid var(--border-gold)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 10px auto'
                }}
              >
                <Coins size={28} color="var(--gold-deep)" />
              </div>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.55rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                Purchase MIORA Coins
              </h3>
              <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
                Instant crediting via Razorpay TEST Checkout • UPI, Cards & Netbanking
              </p>
            </div>

            {/* Packages List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '22px' }}>
              {MIORA_PRICING.rechargePackages.map((pkg) => {
                const isSelected = selectedPkg.id === pkg.id;
                return (
                  <div
                    key={pkg.id}
                    onClick={() => setSelectedPkg(pkg)}
                    style={{
                      background: isSelected
                        ? 'linear-gradient(135deg, rgba(238, 56, 101, 0.09) 0%, rgba(251, 113, 133, 0.04) 100%)'
                        : 'var(--surface-white)',
                      border: isSelected ? '2px solid var(--berry-primary)' : '1.5px solid var(--border-subtle)',
                      borderRadius: '20px',
                      padding: '14px 18px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      cursor: 'pointer',
                      transition: 'all var(--transition-fast)',
                      position: 'relative'
                    }}
                  >
                    {pkg.popular && (
                      <span
                        style={{
                          position: 'absolute',
                          top: '-9px',
                          right: '18px',
                          background: 'var(--primary-gradient)',
                          color: '#FFFFFF',
                          fontSize: '0.64rem',
                          fontWeight: 900,
                          padding: '2px 8px',
                          borderRadius: 'var(--radius-pill)',
                          boxShadow: '0 2px 8px rgba(238, 56, 101, 0.4)'
                        }}
                      >
                        MOST POPULAR
                      </span>
                    )}
                    {pkg.bestValue && (
                      <span
                        style={{
                          position: 'absolute',
                          top: '-9px',
                          right: '18px',
                          background: 'var(--gold-gradient)',
                          color: '#1C1217',
                          fontSize: '0.64rem',
                          fontWeight: 900,
                          padding: '2px 8px',
                          borderRadius: 'var(--radius-pill)',
                          boxShadow: '0 2px 8px rgba(212, 175, 55, 0.4)'
                        }}
                      >
                        BEST VALUE
                      </span>
                    )}

                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div
                        style={{
                          width: '42px',
                          height: '42px',
                          borderRadius: '14px',
                          background: isSelected ? 'var(--primary-gradient)' : 'var(--bg-soft-blush)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: isSelected ? '#FFFFFF' : 'var(--berry-primary)'
                        }}
                      >
                        <Coins size={22} />
                      </div>

                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                            {pkg.coins} Coins
                          </span>
                          {pkg.bonusCoins > 0 && (
                            <span
                              style={{
                                background: 'var(--gold-gradient-subtle)',
                                color: 'var(--gold-deep)',
                                border: '1px solid var(--border-gold)',
                                fontSize: '0.68rem',
                                fontWeight: 800,
                                padding: '2px 8px',
                                borderRadius: 'var(--radius-pill)'
                              }}
                            >
                              +{pkg.bonusCoins} Bonus
                            </span>
                          )}
                        </div>
                        <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{pkg.tagline}</span>
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--text-primary)' }}>
                        ₹{pkg.priceInr}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Buy Now Button */}
            <button
              onClick={handleBuyNow}
              disabled={isProcessing}
              style={{
                width: '100%',
                background: 'var(--primary-gradient)',
                color: '#FFFFFF',
                border: 'none',
                padding: '14px 24px',
                borderRadius: 'var(--radius-pill)',
                fontWeight: 800,
                fontSize: '1rem',
                cursor: isProcessing ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: 'var(--shadow-berry-glow)',
                transition: 'transform var(--transition-fast)'
              }}
              onMouseEnter={(e) => {
                if (!isProcessing) e.currentTarget.style.transform = 'scale(1.02)';
              }}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            >
              <CreditCard size={18} />
              <span>Buy Now • ₹{selectedPkg.priceInr}</span>
            </button>
          </>
        )}

        {/* STEP 2: Processing / Razorpay Active */}
        {paymentStep === 'processing' && (
          <div style={{ textAlign: 'center', padding: '36px 0' }}>
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: 'var(--bg-soft-blush)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px auto'
              }}
            >
              <RefreshCw size={30} color="var(--berry-primary)" className="spin" />
            </div>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.45rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              Opening Razorpay Checkout...
            </h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginTop: '6px' }}>
              Please complete your test payment in the secure Razorpay window.
            </p>
          </div>
        )}

        {/* STEP 3: Payment Success UI */}
        {paymentStep === 'success' && successInfo && (
          <div style={{ textAlign: 'center', padding: '24px 0' }}>
            <div
              style={{
                width: '76px',
                height: '76px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 18px auto',
                boxShadow: '0 8px 28px rgba(16, 185, 129, 0.45)'
              }}
            >
              <CheckCircle2 size={44} color="#FFFFFF" />
            </div>

            <h3
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '1.8rem',
                fontWeight: 800,
                color: '#065F46',
                margin: 0
              }}
            >
              Payment Successful ✓
            </h3>

            <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', marginTop: '8px', fontWeight: 600 }}>
              <strong style={{ color: 'var(--berry-primary)' }}>{successInfo.addedCoins} MIORA Coins</strong> have been added.
            </p>

            {/* New Balance Box */}
            <div
              style={{
                background: 'var(--gold-gradient-subtle)',
                border: '1.5px solid var(--border-gold)',
                borderRadius: '20px',
                padding: '16px 24px',
                margin: '20px auto',
                maxWidth: '260px'
              }}
            >
              <span style={{ fontSize: '0.78rem', color: 'var(--gold-deep)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                New Balance
              </span>
              <div style={{ fontSize: '2.2rem', fontWeight: 900, color: 'var(--text-primary)', fontFamily: 'var(--font-display)', marginTop: '4px' }}>
                🪙 {successInfo.newBalance}
              </div>
            </div>

            {/* Continue Button */}
            <button
              onClick={handleClose}
              style={{
                width: '100%',
                background: 'var(--primary-gradient)',
                color: '#FFFFFF',
                border: 'none',
                padding: '13px 24px',
                borderRadius: 'var(--radius-pill)',
                fontWeight: 800,
                fontSize: '1rem',
                cursor: 'pointer',
                boxShadow: 'var(--shadow-berry-glow)',
                transition: 'transform var(--transition-fast)'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.02)')}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            >
              Continue
            </button>
          </div>
        )}

        {/* STEP 4: Payment Failure UI */}
        {paymentStep === 'error' && (
          <div style={{ textAlign: 'center', padding: '24px 0' }}>
            <div
              style={{
                width: '76px',
                height: '76px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 18px auto',
                boxShadow: '0 8px 28px rgba(239, 68, 68, 0.4)'
              }}
            >
              <AlertCircle size={44} color="#FFFFFF" />
            </div>

            <h3
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '1.65rem',
                fontWeight: 800,
                color: '#991B1B',
                margin: 0
              }}
            >
              Payment couldn't be completed.
            </h3>

            <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', marginTop: '8px' }}>
              No coins were deducted or added.
            </p>

            {errorMessage && (
              <div
                style={{
                  background: 'rgba(239, 68, 68, 0.08)',
                  border: '1px solid rgba(239, 68, 68, 0.25)',
                  borderRadius: '14px',
                  padding: '10px 14px',
                  margin: '16px auto',
                  fontSize: '0.82rem',
                  color: '#B91C1C'
                }}
              >
                {errorMessage}
              </div>
            )}

            {/* Try Again Button */}
            <button
              onClick={() => setPaymentStep('select')}
              style={{
                width: '100%',
                background: 'var(--primary-gradient)',
                color: '#FFFFFF',
                border: 'none',
                padding: '13px 24px',
                borderRadius: 'var(--radius-pill)',
                fontWeight: 800,
                fontSize: '0.98rem',
                cursor: 'pointer',
                marginTop: '12px',
                boxShadow: 'var(--shadow-berry-glow)'
              }}
            >
              Try Again
            </button>
          </div>
        )}

        {/* Security Trust Badge */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '16px' }}>
          <ShieldCheck size={14} color="var(--gold-deep)" />
          <span>Razorpay 256-Bit Encrypted Test Sandbox • Verified Gateway</span>
        </div>
      </div>
    </div>
  );
};
