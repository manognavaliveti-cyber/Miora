import React from 'react';
import { useApp } from '../../context/AppContext';
import { EditorialProfileView } from '../discover/EditorialProfileView';

export const ProfileDetailsModal: React.FC = () => {
  const {
    isProfileDetailOpen, activeProfile, closeProfileDetail,
    handleLike, handlePass, startDirectMessage
  } = useApp();

  if (!isProfileDetailOpen || !activeProfile) return null;

  const handleSwipeAction = async (direction: 'left' | 'right' | 'up') => {
    closeProfileDetail();
    if (direction === 'left') {
      await handlePass(activeProfile.id);
    } else {
      await handleLike(activeProfile.id, direction === 'up');
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 10000,
        background: 'rgba(10, 4, 8, 0.85)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 0,
        animation: 'fadeIn 0.2s ease-out forwards',
        overflow: 'hidden'
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) closeProfileDetail();
      }}
    >
      <style>{`
        .pdm-editorial-wrapper {
          width: 100%;
          height: 100dvh;
          max-height: 100dvh;
          background: #FFFFFF;
          display: flex;
          flex-direction: column;
          position: relative;
          overflow: hidden;
          box-sizing: border-box;
        }
        @media (min-width: 768px) {
          .pdm-editorial-wrapper {
            width: min(92vw, 580px);
            height: min(92dvh, 880px);
            border-radius: 32px;
            box-shadow: 0 30px 90px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.1);
          }
        }
      `}</style>
      <div className="pdm-editorial-wrapper">
        <EditorialProfileView
          profile={activeProfile}
          onSwipe={handleSwipeAction}
          onMessage={() => {
            closeProfileDetail();
            if (activeProfile.isRealUser) startDirectMessage(activeProfile);
          }}
          isModalView={true}
          onClose={closeProfileDetail}
          isTopCard={true}
        />
      </div>
    </div>
  );
};
