import React from 'react';
import { useApp } from '../../context/AppContext';
import { X, Image, Sparkles, MessageCircle, Smile, PlusCircle } from 'lucide-react';

export const CreateBottomSheet: React.FC = () => {
  const {
    isCreateSheetOpen,
    closeCreateSheet,
    openCreatePostModal,
    openCreateStatusModal,
    openStatusNoteModal
  } = useApp();

  if (!isCreateSheetOpen) return null;

  const handleAction = (actionFn: () => void) => {
    closeCreateSheet();
    actionFn();
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 95,
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        background: 'rgba(31, 22, 26, 0.75)',
        backdropFilter: 'blur(12px)',
        animation: 'fadeIn 0.2s ease-out'
      }}
      onClick={closeCreateSheet}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '520px',
          background: 'linear-gradient(180deg, #FFFFFF 0%, #FFF5F7 100%)',
          borderTopLeftRadius: '32px',
          borderTopRightRadius: '32px',
          padding: '24px 20px 36px',
          boxShadow: '0 -16px 60px rgba(0,0,0,0.25)',
          borderTop: '2px solid var(--border-gold, #FCE7F3)',
          animation: 'slideUp 0.25s ease-out',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800, color: '#1F2937' }}>
              Create & Share ✨
            </h3>
            <span style={{ fontSize: '0.78rem', color: '#6B7280' }}>
              Express yourself to your matches and community
            </span>
          </div>

          <button
            onClick={closeCreateSheet}
            style={{
              width: '34px',
              height: '34px',
              borderRadius: '50%',
              border: 'none',
              background: 'rgba(0,0,0,0.05)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#4B5563'
            }}
          >
            <X size={17} />
          </button>
        </div>

        {/* 3 Creation Options */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {/* 1. Feed Post */}
          <div
            onClick={() => handleAction(openCreatePostModal)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              padding: '16px',
              borderRadius: '20px',
              background: '#FFFFFF',
              border: '1.5px solid #FCE7F3',
              boxShadow: '0 4px 16px rgba(238, 56, 101, 0.06)',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            <div
              style={{
                width: '46px',
                height: '46px',
                borderRadius: '16px',
                background: 'linear-gradient(135deg, #EE3865 0%, #EC4899 100%)',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(238, 56, 101, 0.3)'
              }}
            >
              <Image size={22} />
            </div>
            <div style={{ flex: 1 }}>
              <span style={{ display: 'block', fontWeight: 800, fontSize: '0.98rem', color: '#1F2937' }}>
                New Feed Post
              </span>
              <span style={{ fontSize: '0.8rem', color: '#6B7280' }}>
                Share an aesthetic photo, dating question, or mood
              </span>
            </div>
          </div>

          {/* 2. 24h Story */}
          <div
            onClick={() => handleAction(openCreateStatusModal)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              padding: '16px',
              borderRadius: '20px',
              background: '#FFFFFF',
              border: '1.5px solid #FCE7F3',
              boxShadow: '0 4px 16px rgba(238, 56, 101, 0.06)',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            <div
              style={{
                width: '46px',
                height: '46px',
                borderRadius: '16px',
                background: 'linear-gradient(135deg, #D4AF37 0%, #F59E0B 100%)',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(212, 175, 55, 0.3)'
              }}
            >
              <Sparkles size={22} />
            </div>
            <div style={{ flex: 1 }}>
              <span style={{ display: 'block', fontWeight: 800, fontSize: '0.98rem', color: '#1F2937' }}>
                Add 24h Story
              </span>
              <span style={{ fontSize: '0.8rem', color: '#6B7280' }}>
                Post a moment that disappears automatically after 24 hours
              </span>
            </div>
          </div>

          {/* 3. Status Note */}
          <div
            onClick={() => handleAction(openStatusNoteModal)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              padding: '16px',
              borderRadius: '20px',
              background: '#FFFFFF',
              border: '1.5px solid #FCE7F3',
              boxShadow: '0 4px 16px rgba(238, 56, 101, 0.06)',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            <div
              style={{
                width: '46px',
                height: '46px',
                borderRadius: '16px',
                background: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)'
              }}
            >
              <Smile size={22} />
            </div>
            <div style={{ flex: 1 }}>
              <span style={{ display: 'block', fontWeight: 800, fontSize: '0.98rem', color: '#1F2937' }}>
                Set Status Thought
              </span>
              <span style={{ fontSize: '0.8rem', color: '#6B7280' }}>
                Share a quick emoji + thought bubble on your profile
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
