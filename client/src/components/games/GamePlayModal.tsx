import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  Sparkles,
  Heart,
  Coins,
  Lock,
  Unlock,
  Award,
  CheckCircle2,
  ArrowRight,
  Flame,
  Send
} from 'lucide-react';
import { MIORA_PRICING } from '../../config/pricing';

export const GamePlayModal: React.FC = () => {
  const {
    activeGameSession,
    answerGameQuestion,
    unlockPremiumGamePack,
    finishGameAndClaimReward,
    closeGameModal,
    currentUser
  } = useApp();

  const [customTextAnswer, setCustomTextAnswer] = useState('');

  if (!activeGameSession) return null;

  const {
    game,
    partner,
    currentQuestionIndex,
    userAnswers,
    partnerAnswers,
    isPartnerTyping,
    isCompleted,
    compatibilityScore,
    isPremiumUnlocked
  } = activeGameSession;

  const currentQ = game.questions[currentQuestionIndex];
  const isAnsweredByMe = userAnswers[currentQuestionIndex] !== undefined;
  const isAnsweredByPartner = partnerAnswers[currentQuestionIndex] !== undefined;
  const totalQuestions = game.questions.length;

  const handleSelectOption = (opt: string) => {
    if (isAnsweredByMe) return;
    answerGameQuestion(currentQuestionIndex, opt);
  };

  const handleSendCustomAnswer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customTextAnswer.trim() || isAnsweredByMe) return;
    answerGameQuestion(currentQuestionIndex, customTextAnswer.trim());
    setCustomTextAnswer('');
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
        background: 'rgba(31, 22, 26, 0.82)',
        backdropFilter: 'blur(20px)',
        padding: '16px',
        animation: 'fadeIn 0.25s ease-out'
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '560px',
          maxHeight: '90vh',
          overflowY: 'auto',
          background: 'linear-gradient(180deg, #FFFFFF 0%, #FFF5F7 100%)',
          borderRadius: '28px',
          boxShadow: '0 24px 60px rgba(76, 5, 25, 0.35)',
          border: '2px solid var(--border-gold)',
          padding: 'clamp(20px, 4vw, 28px) clamp(16px, 3.5vw, 24px)',
          position: 'relative'
        }}
      >
        {/* Close */}
        <button
          onClick={closeGameModal}
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

        {/* Top Game Bar: Title, Step Progress */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '1.8rem' }}>{game.icon}</span>
            <div>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                {game.title}
              </h3>
              <span style={{ fontSize: '0.78rem', color: 'var(--berry-primary)', fontWeight: 700 }}>
                Playing with {partner.name} 💕
              </span>
            </div>
          </div>

          <div style={{ textAlign: 'right', paddingRight: '36px' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--gold-deep)' }}>
              Round {currentQuestionIndex + 1}/{totalQuestions}
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div style={{ width: '100%', height: '6px', borderRadius: '3px', background: 'var(--border-subtle)', marginBottom: '22px', overflow: 'hidden' }}>
          <div
            style={{
              width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%`,
              height: '100%',
              background: 'var(--primary-gradient)',
              borderRadius: '3px',
              transition: 'width 0.4s ease'
            }}
          />
        </div>

        {/* GAME PLAY VIEW: When not completed */}
        {!isCompleted ? (
          <div>
            {/* Question Card */}
            <div
              style={{
                background: 'var(--surface-white)',
                border: '1.5px solid var(--border-gold)',
                borderRadius: '24px',
                padding: '24px',
                textAlign: 'center',
                boxShadow: 'var(--shadow-sm)',
                marginBottom: '20px',
                position: 'relative'
              }}
            >
              {currentQ.isPremium && !isPremiumUnlocked && (
                <div
                  style={{
                    position: 'absolute',
                    top: '12px',
                    right: '16px',
                    background: 'var(--gold-gradient)',
                    color: '#1C1217',
                    fontSize: '0.66rem',
                    fontWeight: 900,
                    padding: '2px 8px',
                    borderRadius: 'var(--radius-pill)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <Lock size={11} />
                  <span>PREMIUM</span>
                </div>
              )}

              <span
                style={{
                  fontSize: '0.72rem',
                  fontFamily: 'var(--font-display)',
                  fontWeight: 800,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: 'var(--gold-deep)',
                  display: 'block',
                  marginBottom: '6px'
                }}
              >
                Question {currentQuestionIndex + 1}
              </span>

              <h4
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: '1.25rem',
                  fontWeight: 800,
                  color: 'var(--text-primary)',
                  lineHeight: 1.4
                }}
              >
                {currentQ.text}
              </h4>
            </div>

            {/* If Premium locked */}
            {currentQ.isPremium && !isPremiumUnlocked ? (
              <div
                style={{
                  background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.12) 0%, rgba(244, 63, 94, 0.08) 100%)',
                  border: '1.5px solid var(--border-gold)',
                  borderRadius: '20px',
                  padding: '20px',
                  textAlign: 'center',
                  marginBottom: '16px'
                }}
              >
                <Lock size={28} color="var(--gold-deep)" style={{ margin: '0 auto 8px auto' }} />
                <h4 style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--text-primary)' }}>
                  Unlock Premium Romantic Round
                </h4>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                  Deeper compatibility questions, spicy challenges, and bonus compatibility points.
                </p>

                <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '14px' }}>
                  <button
                    onClick={unlockPremiumGamePack}
                    style={{
                      background: 'var(--primary-gradient)',
                      color: '#FFFFFF',
                      border: 'none',
                      padding: '9px 20px',
                      borderRadius: 'var(--radius-pill)',
                      fontWeight: 800,
                      fontSize: '0.86rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      boxShadow: 'var(--shadow-berry-glow)'
                    }}
                  >
                    <Coins size={16} />
                    <span>Unlock for 💰 20 Coins</span>
                  </button>
                </div>
              </div>
            ) : currentQ.options ? (
              /* Options Grid */
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
                {currentQ.options.map((opt, i) => {
                  const isSelected = userAnswers[currentQuestionIndex] === opt;
                  return (
                    <button
                      key={i}
                      onClick={() => handleSelectOption(opt)}
                      style={{
                        background: isSelected
                          ? 'linear-gradient(135deg, rgba(238, 56, 101, 0.12) 0%, rgba(251, 113, 133, 0.06) 100%)'
                          : 'var(--surface-white)',
                        border: isSelected ? '2px solid var(--berry-primary)' : '1.5px solid var(--border-subtle)',
                        borderRadius: '18px',
                        padding: '14px 18px',
                        textAlign: 'left',
                        cursor: isAnsweredByMe ? 'default' : 'pointer',
                        fontSize: '0.94rem',
                        fontWeight: 700,
                        color: isSelected ? 'var(--berry-primary)' : 'var(--text-primary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        transition: 'all var(--transition-fast)'
                      }}
                    >
                      <span>{opt}</span>
                      {isSelected && <CheckCircle2 size={18} color="var(--berry-primary)" />}
                    </button>
                  );
                })}
              </div>
            ) : (
              /* Text Input Prompt */
              <form onSubmit={handleSendCustomAnswer} style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
                <input
                  type="text"
                  placeholder="Type your honest answer..."
                  value={customTextAnswer}
                  onChange={(e) => setCustomTextAnswer(e.target.value)}
                  disabled={isAnsweredByMe}
                  style={{
                    flex: 1,
                    padding: '12px 18px',
                    borderRadius: 'var(--radius-pill)',
                    border: '1.5px solid var(--border-subtle)',
                    background: 'var(--surface-white)',
                    fontSize: '0.92rem',
                    outline: 'none'
                  }}
                />
                <button
                  type="submit"
                  disabled={isAnsweredByMe || !customTextAnswer.trim()}
                  style={{
                    background: 'var(--primary-gradient)',
                    color: '#FFFFFF',
                    border: 'none',
                    padding: '12px 20px',
                    borderRadius: 'var(--radius-pill)',
                    fontWeight: 800,
                    cursor: customTextAnswer.trim() ? 'pointer' : 'default',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <Send size={16} />
                  <span>Answer</span>
                </button>
              </form>
            )}

            {/* Partner Status / Answer Reveal */}
            <div
              style={{
                background: 'var(--surface-white)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '18px',
                padding: '12px 16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <img
                  src={partner.photos[0]}
                  alt={partner.name}
                  style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }}
                />
                <div>
                  <span style={{ fontSize: '0.84rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                    {partner.name}
                  </span>
                  <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', display: 'block' }}>
                    {isPartnerTyping
                      ? 'Thinking & typing answer... 💭'
                      : isAnsweredByPartner
                      ? `Answered: "${partnerAnswers[currentQuestionIndex]}"`
                      : 'Waiting for round answer'}
                  </span>
                </div>
              </div>

              {isAnsweredByMe && isAnsweredByPartner && (
                <span style={{ fontSize: '0.8rem', color: '#10B981', fontWeight: 800 }}>
                  Synced! ✨
                </span>
              )}
            </div>
          </div>
        ) : (
          /* GAME COMPLETED & RESULTS VIEW */
          <div style={{ textAlign: 'center', padding: '16px 0' }}>
            <div
              style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                background: 'var(--primary-gradient)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '3rem',
                margin: '0 auto 16px auto',
                boxShadow: 'var(--shadow-berry-glow)',
                animation: 'bounceIn 0.5s ease'
              }}
            >
              🏆
            </div>

            <span
              style={{
                fontSize: '0.74rem',
                fontFamily: 'var(--font-display)',
                fontWeight: 800,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: 'var(--gold-deep)'
              }}
            >
              Challenge Completed!
            </span>

            <h3
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '2rem',
                fontWeight: 800,
                color: 'var(--text-primary)',
                marginTop: '4px'
              }}
            >
              {compatibilityScore || 94}% Soul Harmony! 💖
            </h3>

            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '4px', lineHeight: 1.5, maxWidth: '400px', margin: '6px auto 22px auto' }}>
              You and {partner.name} have exceptional conversational chemistry and aligned values!
            </p>

            <button
              onClick={finishGameAndClaimReward}
              style={{
                background: 'var(--primary-gradient)',
                color: '#FFFFFF',
                border: 'none',
                padding: '14px 32px',
                borderRadius: 'var(--radius-pill)',
                fontWeight: 800,
                fontSize: '1rem',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: 'var(--shadow-berry-glow)',
                transition: 'transform var(--transition-fast)'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.04)')}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            >
              <Sparkles size={18} />
              <span>Claim +15 Coins & Share Result</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
