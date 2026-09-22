import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Crown, Zap, Check, ShieldCheck, Heart, Sparkles, Lock } from 'lucide-react';
import { MIORA_PRICING } from '../../config/pricing';

type PlanId = 'pro' | 'vip';

interface PlanDef {
  id: PlanId;
  tabLabel: string;
  name: string;
  regularInr: number;
  offerInr: number;
  savePercent: number;
  walletValue: string;
  bonus: string;
  accent: string; // highlight colour (tab underline, ticks, badges)
  accentSoft: string;
  ctaGradient: string;
  ctaText: string;
  heroGradient: string;
  headline: string;
  subline: string;
  groups: { title: string; items: { title: string; sub: string }[] }[];
}

// PRO ₹499 → ₹379, VIP ₹999 → ₹789 (28 days each)
const PLANS: Record<PlanId, PlanDef> = {
  pro: {
    id: 'pro',
    tabLabel: 'PRO',
    name: 'MIORA PRO',
    regularInr: 499,
    offerInr: MIORA_PRICING.subscriptionPlans.find((p) => p.id === 'gold')?.priceInr ?? 379,
    savePercent: 24,
    walletValue: '₹524',
    bonus: '₹25 bonus',
    accent: '#FF6B94',
    accentSoft: 'rgba(255, 107, 148, 0.14)',
    ctaGradient: 'linear-gradient(135deg, #8E1538 0%, #C52E59 60%, #E8557C 100%)',
    ctaText: '#FFFFFF',
    heroGradient: 'linear-gradient(160deg, #3B0A1D 0%, #7D1730 55%, #C52E59 120%)',
    headline: 'Connect More with PRO',
    subline: 'More connection. More possibilities.',
    groups: [
      {
        title: 'Grow Your Network',
        items: [
          { title: 'See Who Likes You', sub: 'Know who is interested.' },
          { title: '30 Swipes & Likes / Day', sub: 'Reach out to more people.' }
        ]
      },
      {
        title: 'Talk More',
        items: [
          { title: '1,000 Messages / Day', sub: 'Keep every chat going.' },
          { title: '30 Audio + 20 Video Calls / Day', sub: 'Included free with your plan.' }
        ]
      },
      {
        title: 'Stand Out',
        items: [
          { title: 'Star User Access', sub: 'Chat with Star users.' }
        ]
      }
    ]
  },
  vip: {
    id: 'vip',
    tabLabel: 'VIP',
    name: 'MIORA VIP',
    regularInr: 999,
    offerInr: MIORA_PRICING.subscriptionPlans.find((p) => p.id === 'vip')?.priceInr ?? 789,
    savePercent: 21,
    walletValue: '₹1,049',
    bonus: '₹50 bonus',
    accent: '#F5D77A',
    accentSoft: 'rgba(245, 215, 122, 0.14)',
    ctaGradient: 'linear-gradient(135deg, #B8912B 0%, #E9C766 50%, #F8E29A 100%)',
    ctaText: '#3A2A00',
    heroGradient: 'linear-gradient(160deg, #1B1408 0%, #4A3510 55%, #B8912B 120%)',
    headline: 'Go Unlimited with VIP',
    subline: 'Swipes, chats and calls without limits.',
    groups: [
      {
        title: 'Everything Unlimited',
        items: [
          { title: 'Unlimited Swipes & Likes', sub: 'Swipe freely and explore.' },
          { title: 'Unlimited Messages', sub: 'Never run out of chats.' },
          { title: 'Unlimited Audio & Video Calls', sub: 'Talk as long as you like.' }
        ]
      },
      {
        title: 'Increase Your Matches',
        items: [
          { title: 'See Who Liked You', sub: 'Know instantly when someone is interested.' },
          { title: 'All Eligible Profiles', sub: 'Nobody is hidden from you.' },
          { title: 'Star User Access', sub: 'Chat with Star users.' }
        ]
      }
    ]
  }
};

export const UpgradeModal: React.FC = () => {
  const {
    isUpgradeModalOpen,
    closeUpgradeModal,
    purchaseProduct,
    currentUser,
    isLoading,
    upgradeContext,
    whoLikedMeProfiles
  } = useApp();

  const [tab, setTab] = useState<PlanId>(upgradeContext.tab);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [successPlan, setSuccessPlan] = useState<PlanId | null>(null);

  useEffect(() => {
    if (isUpgradeModalOpen) {
      const proPrice = MIORA_PRICING.subscriptionPlans.find((p) => p.id === 'gold')?.priceInr ?? 379;
      const vipPrice = MIORA_PRICING.subscriptionPlans.find((p) => p.id === 'vip')?.priceInr ?? 789;
      PLANS.pro.offerInr = proPrice;
      PLANS.vip.offerInr = vipPrice;
      setTab(upgradeContext.tab);
      setSuccessPlan(null);
    }
  }, [isUpgradeModalOpen, upgradeContext.tab]);

  if (!isUpgradeModalOpen) return null;

  const plan = PLANS[tab];
  const currentTier = currentUser.subscriptionTier || 'free';
  const isCurrent = currentTier === plan.id;

  const handleSelectPlan = async () => {
    setIsProcessing(true);
    try {
      await purchaseProduct(plan.id);
      setSuccessPlan(plan.id);
    } catch (err) {
      console.error('Subscription error:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const likerCount = whoLikedMeProfiles.length;
  const showLikesBanner = upgradeContext.reason === 'likes';

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'rgba(8, 4, 6, 0.78)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '12px',
        boxSizing: 'border-box',
        animation: 'fadeIn 0.2s ease-out'
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) closeUpgradeModal();
      }}
    >
      <style>{`
        @keyframes upSheetIn { from { opacity: 0; transform: translateY(26px) scale(0.98); } to { opacity: 1; transform: translateY(0) scale(1); } }
        @keyframes upFloat { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
        .up-scroll::-webkit-scrollbar { width: 0; }
        .up-cta { transition: transform .2s ease, filter .2s ease; }
        .up-cta:hover:not(:disabled) { transform: translateY(-2px); filter: brightness(1.06); }
        .up-cta:active:not(:disabled) { transform: scale(0.98); }
      `}</style>

      <div
        style={{
          width: '100%',
          maxWidth: '460px',
          height: 'min(92dvh, 820px)',
          background: '#0E0A0C',
          color: '#FFFFFF',
          borderRadius: '26px',
          boxShadow: '0 30px 80px rgba(0,0,0,0.6)',
          border: '1px solid rgba(255,255,255,0.08)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          position: 'relative',
          animation: 'upSheetIn 0.35s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      >
        {successPlan ? (
          <div style={{ flex: 1, padding: '40px 24px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '18px' }}>
            <div
              style={{
                width: '76px',
                height: '76px',
                borderRadius: '50%',
                background: PLANS[successPlan].ctaGradient,
                color: PLANS[successPlan].ctaText,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: `0 12px 30px ${PLANS[successPlan].accentSoft}`
              }}
            >
              {successPlan === 'vip' ? <Crown size={36} /> : <Sparkles size={36} />}
            </div>
            <h2 style={{ margin: 0, fontSize: '1.7rem', fontWeight: 900 }}>Welcome to {PLANS[successPlan].tabLabel}</h2>
            <div
              style={{
                width: '100%',
                borderRadius: '18px',
                padding: '16px 20px',
                border: `1.5px solid ${PLANS[successPlan].accent}55`,
                background: PLANS[successPlan].accentSoft
              }}
            >
              <div style={{ fontSize: '0.78rem', letterSpacing: '0.06em', textTransform: 'uppercase', opacity: 0.75, fontWeight: 700 }}>
                Wallet credit added
              </div>
              <div style={{ fontSize: '1.9rem', fontWeight: 900, color: PLANS[successPlan].accent, marginTop: '2px' }}>
                {PLANS[successPlan].walletValue}
              </div>
              <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>Includes {PLANS[successPlan].bonus} • 28 days active</div>
            </div>
            <button
              onClick={() => {
                setSuccessPlan(null);
                closeUpgradeModal();
              }}
              className="up-cta"
              style={{
                width: '100%',
                border: 'none',
                borderRadius: '9999px',
                padding: '15px',
                fontSize: '1rem',
                fontWeight: 900,
                cursor: 'pointer',
                background: PLANS[successPlan].ctaGradient,
                color: PLANS[successPlan].ctaText
              }}
            >
              Continue
            </button>
          </div>
        ) : (
          <>
            {/* Plan tabs */}
            <div style={{ display: 'flex', flexShrink: 0, borderBottom: '1px solid rgba(255,255,255,0.08)', background: '#0A0708' }}>
              {(['pro', 'vip'] as PlanId[]).map((id) => {
                const active = tab === id;
                const p = PLANS[id];
                return (
                  <button
                    key={id}
                    onClick={() => setTab(id)}
                    style={{
                      flex: 1,
                      padding: '16px 8px 13px 8px',
                      border: 'none',
                      background: 'transparent',
                      color: active ? '#FFFFFF' : 'rgba(255,255,255,0.55)',
                      fontSize: '1rem',
                      fontWeight: 900,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '7px',
                      borderBottom: `3px solid ${active ? p.accent : 'transparent'}`,
                      transition: 'all .2s ease'
                    }}
                  >
                    {id === 'vip' ? <Crown size={17} color={active ? p.accent : 'currentColor'} /> : <Zap size={17} color={active ? p.accent : 'currentColor'} />}
                    {p.tabLabel}
                    <span style={{ fontSize: '0.68rem', fontWeight: 800, color: active ? p.accent : 'rgba(255,255,255,0.4)' }}>
                      ₹{p.offerInr}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Scrollable body */}
            <div className="up-scroll" style={{ flex: 1, overflowY: 'auto' }}>
              {/* Hero */}
              <div
                style={{
                  position: 'relative',
                  padding: '34px 22px 26px 22px',
                  textAlign: 'center',
                  background: plan.heroGradient,
                  overflow: 'hidden'
                }}
              >
                <span style={{ position: 'absolute', top: '-40px', right: '-30px', width: '150px', height: '150px', borderRadius: '50%', background: 'rgba(255,255,255,0.08)' }} />
                <span style={{ position: 'absolute', bottom: '-50px', left: '-20px', width: '130px', height: '130px', borderRadius: '50%', background: 'rgba(255,255,255,0.06)' }} />

                <button
                  onClick={closeUpgradeModal}
                  aria-label="Close"
                  style={{
                    position: 'absolute',
                    top: '14px',
                    left: '14px',
                    width: '34px',
                    height: '34px',
                    borderRadius: '50%',
                    border: 'none',
                    background: 'rgba(0,0,0,0.35)',
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    zIndex: 2
                  }}
                >
                  <X size={18} />
                </button>

                {showLikesBanner ? (
                  <div style={{ position: 'relative', zIndex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '12px', animation: 'upFloat 3.2s ease-in-out infinite' }}>
                      {whoLikedMeProfiles.slice(0, 3).map((w, i) => (
                        <div
                          key={w.id}
                          style={{
                            width: '52px',
                            height: '52px',
                            borderRadius: '50%',
                            overflow: 'hidden',
                            border: '2.5px solid #FFFFFF',
                            marginLeft: i === 0 ? 0 : '-14px',
                            background: '#222'
                          }}
                        >
                          <img
                            src={w.profile.photos[0]}
                            alt=""
                            style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'blur(7px) brightness(0.85)', transform: 'scale(1.3)' }}
                          />
                        </div>
                      ))}
                      <div
                        style={{
                          width: '52px',
                          height: '52px',
                          borderRadius: '50%',
                          marginLeft: '-14px',
                          border: '2.5px solid #FFFFFF',
                          background: 'linear-gradient(135deg, #E8557C, #C52E59)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        <Lock size={20} color="#FFFFFF" />
                      </div>
                    </div>
                    <h2 style={{ margin: 0, fontSize: '1.7rem', fontWeight: 900, lineHeight: 1.15 }}>
                      {likerCount} {likerCount === 1 ? 'person' : 'people'} liked your profile
                    </h2>
                    <p style={{ margin: '8px 0 0 0', fontSize: '0.95rem', opacity: 0.9 }}>
                      Subscribe to see exactly who liked you and match instantly.
                    </p>
                  </div>
                ) : (
                  <div style={{ position: 'relative', zIndex: 1 }}>
                    <div
                      style={{
                        width: '58px',
                        height: '58px',
                        borderRadius: '18px',
                        margin: '0 auto 12px auto',
                        background: 'rgba(255,255,255,0.16)',
                        backdropFilter: 'blur(8px)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        animation: 'upFloat 3.2s ease-in-out infinite'
                      }}
                    >
                      {plan.id === 'vip' ? <Crown size={30} color={plan.accent} /> : <Heart size={28} color="#FFFFFF" fill="#FFFFFF" />}
                    </div>
                    <h2 style={{ margin: 0, fontSize: '1.8rem', fontWeight: 900, lineHeight: 1.15 }}>{plan.headline}</h2>
                    <p style={{ margin: '8px 0 0 0', fontSize: '0.95rem', opacity: 0.9 }}>{plan.subline}</p>
                  </div>
                )}
              </div>

              {/* Price tiles */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', padding: '18px 18px 6px 18px' }}>
                <div
                  style={{
                    borderRadius: '18px',
                    padding: '14px 14px 12px 14px',
                    background: plan.accentSoft,
                    border: `1.5px solid ${plan.accent}`
                  }}
                >
                  <div style={{ fontSize: '1rem', fontWeight: 800 }}>28 days</div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '6px' }}>
                    <span style={{ fontSize: '1.6rem', fontWeight: 900, color: plan.accent, lineHeight: 1 }}>₹{plan.offerInr}</span>
                    <span style={{ fontSize: '0.95rem', textDecoration: 'line-through', opacity: 0.55, fontWeight: 600 }}>₹{plan.regularInr}</span>
                  </div>
                  <div style={{ marginTop: '8px', fontSize: '0.82rem', fontWeight: 800, color: plan.accent }}>Save {plan.savePercent}%</div>
                </div>

                <div
                  style={{
                    borderRadius: '18px',
                    padding: '14px 14px 12px 14px',
                    border: '1.5px solid rgba(255,255,255,0.14)',
                    background: 'rgba(255,255,255,0.03)'
                  }}
                >
                  <div style={{ fontSize: '1rem', fontWeight: 800 }}>Wallet credit</div>
                  <div style={{ fontSize: '1.6rem', fontWeight: 900, marginTop: '6px', lineHeight: 1 }}>{plan.walletValue}</div>
                  <div style={{ marginTop: '8px', fontSize: '0.82rem', fontWeight: 700, opacity: 0.75 }}>Includes {plan.bonus}</div>
                </div>
              </div>

              {plan.id === 'vip' && (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 24px 0 24px', fontSize: '0.98rem', fontWeight: 700 }}>
                  <span>Includes all PRO features</span>
                  <Check size={22} color={plan.accent} strokeWidth={3} />
                </div>
              )}

              {/* Feature groups */}
              <div style={{ padding: '22px 18px 20px 18px', display: 'flex', flexDirection: 'column', gap: '26px' }}>
                {plan.groups.map((group) => (
                  <div
                    key={group.title}
                    style={{
                      position: 'relative',
                      border: '1.5px solid rgba(255,255,255,0.16)',
                      borderRadius: '18px',
                      padding: '24px 18px 6px 18px'
                    }}
                  >
                    <span
                      style={{
                        position: 'absolute',
                        top: '-13px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        background: '#0E0A0C',
                        border: '1.5px solid rgba(255,255,255,0.22)',
                        borderRadius: '9999px',
                        padding: '3px 14px',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        color: 'rgba(255,255,255,0.75)',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {group.title}
                    </span>
                    {group.items.map((item) => (
                      <div key={item.title} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', paddingBottom: '18px' }}>
                        <div>
                          <div style={{ fontSize: '1.02rem', fontWeight: 800 }}>{item.title}</div>
                          <div style={{ fontSize: '0.86rem', opacity: 0.65, marginTop: '2px' }}>{item.sub}</div>
                        </div>
                        <Check size={22} color={plan.accent} strokeWidth={3} style={{ flexShrink: 0 }} />
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>

            {/* Sticky footer: fine print + CTA */}
            <div
              style={{
                flexShrink: 0,
                padding: '12px 18px calc(16px + env(safe-area-inset-bottom, 0px)) 18px',
                background: '#0A0708',
                borderTop: '1px solid rgba(255,255,255,0.08)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '0.72rem', opacity: 0.55, marginBottom: '10px', textAlign: 'center' }}>
                <ShieldCheck size={13} /> 28-day plan • Secure Razorpay payment • Instant activation
              </div>
              <button
                onClick={handleSelectPlan}
                disabled={isProcessing || isLoading}
                className="up-cta"
                style={{
                  width: '100%',
                  border: 'none',
                  borderRadius: '9999px',
                  padding: '16px',
                  fontSize: '1.05rem',
                  fontWeight: 900,
                  cursor: isProcessing ? 'wait' : 'pointer',
                  background: plan.ctaGradient,
                  color: plan.ctaText,
                  boxShadow: `0 12px 28px ${plan.accentSoft}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                {isProcessing ? (
                  'Connecting Razorpay…'
                ) : (
                  <>
                    {isCurrent ? `Renew ${plan.tabLabel}` : `Get ${plan.tabLabel}`} –
                    <span style={{ textDecoration: 'line-through', opacity: 0.6, fontWeight: 700, fontSize: '0.9rem' }}>₹{plan.regularInr}</span>
                    <span>₹{plan.offerInr}</span>
                  </>
                )}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
