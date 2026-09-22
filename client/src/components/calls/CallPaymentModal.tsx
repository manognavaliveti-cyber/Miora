import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Phone, Video, CreditCard, ShieldCheck, X, Sparkles } from 'lucide-react';
import { Profile } from '../../types';
import { paymentService } from '../../services/payment';

export interface CallPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  partner: Profile | null;
  callType: 'audio' | 'video';
  onPaymentSuccess: (method: 'wallet' | 'razorpay') => void;
}

export const CallPaymentModal: React.FC<CallPaymentModalProps> = ({
  isOpen,
  onClose,
  partner,
  callType,
  onPaymentSuccess
}) => {
  const { currentUser, updateWalletBalance, showToast } = useApp();
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  if (!isOpen || !partner) return null;

  const requiredAmount = callType === 'video' ? 12.0 : 8.0;
  const currentWallet = currentUser.walletBalance || 0;
  const hasEnoughWallet = currentWallet >= requiredAmount;
  const title = callType === 'audio' ? 'Audio Call · ₹8/min' : 'Video Call · ₹12/min';

  const handlePayFromWallet = () => {
    onPaymentSuccess('wallet');
  };

  const handlePayWithRazorpay = async () => {
    setIsProcessing(true);
    try {
      await paymentService.initiateCheckout({
        packageId: 'pack_150',
        userName: currentUser.name,
        userEmail: currentUser.email,
        onSuccess: async (result) => {
          setIsProcessing(false);
          const addedCredit = result.creditAddedInr ?? 150;
          const newBal = result.newWalletBalance ?? (currentWallet + addedCredit);
          await updateWalletBalance(newBal, addedCredit);
          showToast(`Payment Verified! ₹${addedCredit} Wallet Credit added ✨`);
          onPaymentSuccess('razorpay');
        },
        onError: (err) => {
          setIsProcessing(false);
          showToast(err || 'Payment was not completed');
        },
        onDismiss: () => {
          setIsProcessing(false);
        }
      });
    } catch (e: any) {
      setIsProcessing(false);
      showToast(e?.message || 'Failed to initiate Razorpay payment');
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'rgba(15, 10, 12, 0.78)',
        backdropFilter: 'blur(12px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        boxSizing: 'border-box'
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        style={{
          background: '#F7F2EE', // Warm Cream
          width: '100%',
          maxWidth: '440px',
          borderRadius: '24px',
          boxShadow: '0 20px 50px rgba(125, 23, 48, 0.35)',
          overflow: 'hidden',
          position: 'relative',
          padding: '24px',
          boxSizing: 'border-box'
        }}
      >
        <button
          onClick={onClose}
          aria-label="Close"
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: 'rgba(125, 23, 48, 0.1)',
            border: 'none',
            borderRadius: '50%',
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#7D1730',
            cursor: 'pointer'
          }}
        >
          <X size={18} />
        </button>

        {/* Icon Header */}
        <div style={{ textAlign: 'center', marginBottom: '16px' }}>
          <div
            style={{
              width: '58px',
              height: '58px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #7D1730 0%, #A91E45 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              margin: '0 auto 10px auto',
              boxShadow: '0 8px 20px rgba(169, 30, 69, 0.3)'
            }}
          >
            {callType === 'audio' ? <Phone size={28} /> : <Video size={28} />}
          </div>
          <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#261D20', margin: '0 0 4px 0' }}>
            {title}
          </h3>
          <p style={{ fontSize: '0.84rem', color: '#7D1730', margin: 0, fontWeight: 500 }}>
            Connect with {partner.name}
          </p>
        </div>

        {/* Package Card */}
        <div
          style={{
            background: '#FFFFFF',
            borderRadius: '18px',
            padding: '16px',
            border: '1.5px solid #F4C5CF',
            marginBottom: '16px',
            textAlign: 'center'
          }}
        >
          <div style={{ fontSize: '0.74rem', fontWeight: 800, color: '#A91E45', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            CALL PACKAGE
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', margin: '6px 0' }}>
            <span style={{ fontSize: '1.1rem', color: '#99888C', textDecoration: 'line-through', fontWeight: 600 }}>₹999</span>
            <span style={{ fontSize: '2.2rem', fontWeight: 900, color: '#A91E45' }}>
              ₹{requiredAmount.toFixed(0)}
            </span>
          </div>

          <div style={{ height: '1px', background: '#FBEDEF', margin: '10px 0' }} />

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.84rem' }}>
            <span style={{ color: '#7D1730', fontWeight: 600 }}>Your Wallet Balance:</span>
            <span style={{ fontWeight: 800, color: hasEnoughWallet ? '#059669' : '#DC2626' }}>
              ₹{currentWallet.toFixed(2)}
            </span>
          </div>
        </div>

        {/* CTA Button based on Wallet Balance */}
        {hasEnoughWallet ? (
          <button
            onClick={handlePayFromWallet}
            style={{
              width: '100%',
              background: 'linear-gradient(135deg, #7D1730 0%, #A91E45 100%)',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '14px',
              padding: '14px',
              fontSize: '0.96rem',
              fontWeight: 800,
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(125, 23, 48, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            <Sparkles size={18} />
            <span>Pay ₹{requiredAmount.toFixed(0)} from Wallet</span>
          </button>
        ) : (
          <div>
            <p style={{ fontSize: '0.78rem', color: '#991B1B', marginBottom: '10px', textAlign: 'center', fontWeight: 600 }}>
              Insufficient wallet balance. Recharge your wallet to start your call.
            </p>
            <button
              onClick={handlePayWithRazorpay}
              disabled={isProcessing}
              style={{
                width: '100%',
                background: 'linear-gradient(135deg, #A91E45 0%, #C52E59 100%)',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '14px',
                padding: '14px',
                fontSize: '0.96rem',
                fontWeight: 800,
                cursor: isProcessing ? 'not-allowed' : 'pointer',
                boxShadow: '0 4px 14px rgba(169, 30, 69, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              <CreditCard size={18} />
              <span>{isProcessing ? 'Opening Razorpay...' : `Pay ₹${requiredAmount.toFixed(0)} with Razorpay`}</span>
            </button>
          </div>
        )}

        <div style={{ marginTop: '14px', textAlign: 'center', fontSize: '0.7rem', color: '#99888C', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
          <ShieldCheck size={14} color="#A91E45" /> Charge captured only upon call connection
        </div>
      </div>
    </div>
  );
};
