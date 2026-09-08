import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Button } from '../common/Button';
import { SAFETY_REPORT_REASONS } from '../../data/mockData';
import { ShieldAlert, X, CheckCircle2 } from 'lucide-react';

export const ReportUserModal: React.FC = () => {
  const { isReportModalOpen, reportTarget, closeReportModal, submitReport } = useApp();
  const [selectedReason, setSelectedReason] = useState<string>(SAFETY_REPORT_REASONS[0]);
  const [details, setDetails] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  if (!isReportModalOpen || !reportTarget) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await submitReport(selectedReason, details);
    setIsSubmitting(false);
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 60,
        background: 'rgba(30, 8, 16, 0.7)',
        backdropFilter: 'blur(10px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}
    >
      <div
        className="card-luxury"
        style={{
          width: '100%',
          maxWidth: '400px',
          maxHeight: '90vh',
          overflowY: 'auto',
          padding: 'clamp(20px, 4vw, 28px)',
          animation: 'popIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          border: '1px solid var(--border-gold)'
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#E11D48' }}>
            <ShieldAlert size={22} />
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', fontWeight: 800 }}>
              Report {reportTarget.name}
            </h2>
          </div>
          <button
            onClick={closeReportModal}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--text-muted)'
            }}
          >
            <X size={20} />
          </button>
        </div>

        <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', lineHeight: 1.45 }}>
          Your safety is our top priority. Please select the primary reason for reporting this profile:
        </p>

        {/* Reasons List */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {SAFETY_REPORT_REASONS.map((reason) => {
              const isSelected = selectedReason === reason;
              return (
                <div
                  key={reason}
                  onClick={() => setSelectedReason(reason)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 14px',
                    borderRadius: 'var(--radius-sm)',
                    border: isSelected ? '1.5px solid var(--primary-berry)' : '1px solid var(--border-light)',
                    background: isSelected ? 'rgba(136, 19, 55, 0.08)' : 'var(--surface-card)',
                    cursor: 'pointer',
                    transition: 'all var(--transition-fast)'
                  }}
                >
                  <span
                    style={{
                      fontSize: '0.88rem',
                      fontWeight: isSelected ? 700 : 500,
                      color: isSelected ? 'var(--primary-berry)' : 'var(--text-primary)',
                      fontFamily: 'var(--font-sans)'
                    }}
                  >
                    {reason}
                  </span>
                  {isSelected && <CheckCircle2 size={17} color="var(--primary-berry)" />}
                </div>
              );
            })}
          </div>

          {/* Optional Details */}
          <div>
            <label
              style={{
                fontSize: '0.82rem',
                fontWeight: 600,
                color: 'var(--text-secondary)',
                fontFamily: 'var(--font-sans)',
                display: 'block',
                marginBottom: '6px'
              }}
            >
              Additional Details (Optional)
            </label>
            <textarea
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="Tell us what happened..."
              rows={3}
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: 'var(--radius-sm)',
                border: '1.5px solid var(--border-light)',
                background: 'var(--bg-warm-ivory)',
                fontFamily: 'var(--font-sans)',
                fontSize: '0.88rem',
                color: 'var(--text-primary)',
                outline: 'none',
                resize: 'none'
              }}
              onFocus={(e) => (e.target.style.borderColor = 'var(--primary-berry)')}
              onBlur={(e) => (e.target.style.borderColor = 'var(--border-light)')}
            />
          </div>

          <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
            <Button type="button" variant="ghost" onClick={closeReportModal} fullWidth size="md">
              Cancel
            </Button>
            <Button type="submit" variant="primary" fullWidth size="md" disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Submit Report'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
