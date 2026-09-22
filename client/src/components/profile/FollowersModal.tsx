import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Users, UserCheck, UserPlus, Sparkles } from 'lucide-react';

export const FollowersModal: React.FC = () => {
  const {
    isFollowersModalOpen,
    closeFollowersModal,
    followersModalType,
    profiles,
    followingIds,
    toggleFollowUser,
    openProfileDetail
  } = useApp();

  const [activeTab, setActiveTab] = useState<'followers' | 'following'>(followersModalType);

  if (!isFollowersModalOpen) return null;

  // Compute followers and following list from state
  const followingList = profiles.filter((p) => followingIds.includes(p.id));
  const followersList = profiles.slice(0, 2); // Seed sample followers

  const displayList = activeTab === 'followers' ? followersList : followingList;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(31, 22, 26, 0.75)',
        backdropFilter: 'blur(16px)',
        padding: '16px',
        animation: 'fadeIn 0.2s ease-out'
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '480px',
          background: '#FFFFFF',
          borderRadius: '32px',
          boxShadow: '0 24px 60px rgba(76, 5, 25, 0.35)',
          border: '1.5px solid var(--border-gold, #FCE7F3)',
          padding: '24px',
          position: 'relative',
          animation: 'scaleIn 0.25s ease-out',
          display: 'flex',
          flexDirection: 'column',
          maxHeight: '80vh'
        }}
      >
        <button
          onClick={closeFollowersModal}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            width: '34px',
            height: '34px',
            borderRadius: '50%',
            background: 'rgba(0,0,0,0.05)',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: '#4B5563'
          }}
        >
          <X size={17} />
        </button>

        {/* Tab Headers */}
        <div style={{ display: 'flex', borderBottom: '1.5px solid #F3F4F6', marginBottom: '16px', paddingRight: '40px' }}>
          <button
            onClick={() => setActiveTab('followers')}
            style={{
              flex: 1,
              padding: '10px',
              border: 'none',
              background: 'transparent',
              fontWeight: 800,
              fontSize: '0.96rem',
              color: activeTab === 'followers' ? '#EE3865' : '#6B7280',
              borderBottom: activeTab === 'followers' ? '3px solid #EE3865' : '3px solid transparent',
              cursor: 'pointer'
            }}
          >
            Followers ({followersList.length})
          </button>
          <button
            onClick={() => setActiveTab('following')}
            style={{
              flex: 1,
              padding: '10px',
              border: 'none',
              background: 'transparent',
              fontWeight: 800,
              fontSize: '0.96rem',
              color: activeTab === 'following' ? '#EE3865' : '#6B7280',
              borderBottom: activeTab === 'following' ? '3px solid #EE3865' : '3px solid transparent',
              cursor: 'pointer'
            }}
          >
            Following ({followingList.length})
          </button>
        </div>

        {/* User List */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            paddingRight: '4px'
          }}
        >
          {displayList.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '36px 16px', color: '#9CA3AF' }}>
              <Users size={36} color="#EE3865" style={{ opacity: 0.6, marginBottom: '8px' }} />
              <p style={{ fontWeight: 700, margin: 0, color: '#4B5563' }}>
                {activeTab === 'followers' ? 'No followers yet' : 'Not following anyone yet'}
              </p>
              <p style={{ fontSize: '0.82rem', margin: '4px 0 0' }}>
                Explore the Feed and Discover to connect with amazing people!
              </p>
            </div>
          ) : (
            displayList.map((p) => {
              const isFollowing = followingIds.includes(p.id);
              return (
                <div
                  key={p.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 14px',
                    borderRadius: '16px',
                    background: '#F9FAFB',
                    border: '1px solid #F3F4F6'
                  }}
                >
                  <div
                    onClick={() => {
                      closeFollowersModal();
                      openProfileDetail(p);
                    }}
                    style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', flex: 1 }}
                  >
                    <img
                      src={p.photos[0]}
                      alt={p.name}
                      style={{ width: '42px', height: '42px', borderRadius: '50%', objectFit: 'cover' }}
                    />
                    <div>
                      <span style={{ fontWeight: 800, fontSize: '0.92rem', color: '#1F2937', display: 'block' }}>
                        {p.name}, {p.age}
                      </span>
                      <span style={{ fontSize: '0.78rem', color: '#6B7280' }}>{p.location}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => toggleFollowUser(p.id)}
                    style={{
                      padding: '6px 14px',
                      borderRadius: '999px',
                      border: isFollowing ? '1px solid #E5E7EB' : 'none',
                      background: isFollowing ? '#FFFFFF' : 'var(--primary-gradient, #EE3865)',
                      color: isFollowing ? '#4B5563' : '#FFFFFF',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    {isFollowing ? (
                      <>
                        <UserCheck size={13} />
                        <span>Following</span>
                      </>
                    ) : (
                      <>
                        <UserPlus size={13} />
                        <span>Follow</span>
                      </>
                    )}
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
