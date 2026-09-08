import React, { useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { ChatBubble } from '../components/chat/ChatBubble';
import { MessageInput } from '../components/chat/MessageInput';
import { ChevronLeft, Phone, Video, Gift, Gamepad2 } from 'lucide-react';

export const ChatPage: React.FC = () => {
  const {
    activeMatch,
    currentUser,
    currentChatMessages,
    sendChatMessage,
    setCurrentView,
    openProfileDetail,
    isTyping,
    startCall,
    openGiftModal,
    startGameWithPartner,
    coupleGames
  } = useApp();

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentChatMessages, isTyping]);

  if (!activeMatch) {
    return (
      <div style={{ padding: '24px', textAlign: 'center' }}>
        <p>No active chat selected.</p>
        <button onClick={() => setCurrentView('chat-list')}>Back to chats</button>
      </div>
    );
  }

  const matchProfile = activeMatch.profile;
  const matchAvatar =
    matchProfile.photos[0] ||
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80';
  const userAvatar =
    currentUser.photos[0] ||
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80';

  const heartWallpaper = `url("data:image/svg+xml,%3Csvg width='90' height='90' viewBox='0 0 90 90' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23F472B6' fill-opacity='0.16'%3E%3Cpath d='M25 22 C23 15 13 15 11 19 C9 24 16 30 25 36 C34 30 41 24 39 19 C37 15 27 15 25 22 Z' transform='scale(0.55) rotate(-10 25 22)' /%3E%3Cpath d='M70 65 C68 58 58 58 56 62 C54 67 61 73 70 79 C79 73 86 67 84 62 C82 58 72 58 70 65 Z' transform='scale(0.65) rotate(18 70 65)' fill='%23FB7185' fill-opacity='0.14' /%3E%3Cpath d='M75 20 C73 14 65 14 63 17 C61 21 67 26 75 31 C83 26 89 21 87 17 C85 14 77 14 75 20 Z' transform='scale(0.4) rotate(8 75 20)' fill='%23FDA4AF' fill-opacity='0.18' /%3E%3Cpath d='M20 70 C18 65 13 65 11 67 C9 70 14 74 20 78 C26 74 31 70 29 67 C27 65 22 65 20 70 Z' transform='scale(0.45) rotate(-22 20 70)' fill='%23F472B6' fill-opacity='0.13' /%3E%3C/g%3E%3C/svg%3E")`;

  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        height: '100dvh',
        maxHeight: '100dvh',
        background: '#FDF2F4',
        backgroundImage: heartWallpaper,
        backgroundRepeat: 'repeat',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Top Header: Back arrow, Avatar + Online status, Name, Phone & Video icons */}
      <div
        style={{
          padding: '10px 12px',
          background: 'rgba(255, 255, 255, 0.96)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(244, 114, 182, 0.25)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'sticky',
          top: 0,
          zIndex: 20,
          boxShadow: '0 2px 10px rgba(190, 24, 60, 0.04)',
          gap: '8px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0, flex: 1 }}>
          {/* Back Chevron */}
          <button
            onClick={() => setCurrentView('chat-list')}
            aria-label="Back to conversations"
            style={{
              background: 'transparent',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#18181B',
              cursor: 'pointer',
              padding: '2px',
              flexShrink: 0
            }}
          >
            <ChevronLeft size={26} strokeWidth={2.5} />
          </button>

          {/* Avatar & Online Name Stack */}
          <div
            onClick={() => openProfileDetail(matchProfile)}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', minWidth: 0, overflow: 'hidden' }}
          >
            <img
              src={matchAvatar}
              alt={matchProfile.name}
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '2px solid #FFFFFF',
                boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
                flexShrink: 0
              }}
            />

            <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0, overflow: 'hidden' }}>
              <h3
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1rem',
                  fontWeight: 800,
                  color: '#18181B',
                  margin: 0,
                  lineHeight: 1.2,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}
              >
                {matchProfile.name}
              </h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '1px' }}>
                <span
                  style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    background: '#10B981',
                    display: 'inline-block',
                    flexShrink: 0
                  }}
                />
                <span style={{ fontSize: '0.72rem', color: '#6B7280', fontWeight: 600 }}>
                  Online
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Action Icons: Phone, Video, Gift, Game */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0 }}>
          <button
            onClick={() => startCall(matchProfile, 'audio')}
            aria-label="Voice Call"
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--berry-primary)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '6px',
              borderRadius: '50%'
            }}
          >
            <Phone size={18} strokeWidth={2.2} fill="currentColor" />
          </button>

          <button
            onClick={() => startCall(matchProfile, 'video')}
            aria-label="Video Call"
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--berry-primary)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '6px',
              borderRadius: '50%'
            }}
          >
            <Video size={19} strokeWidth={2.2} fill="currentColor" />
          </button>

          <button
            onClick={() => openGiftModal(matchProfile)}
            aria-label="Send Gift"
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--berry-primary)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '6px',
              borderRadius: '50%'
            }}
          >
            <Gift size={18} />
          </button>

          <button
            onClick={() => startGameWithPartner(coupleGames[0], matchProfile)}
            aria-label="Play Game"
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--berry-primary)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '6px',
              borderRadius: '50%'
            }}
          >
            <Gamepad2 size={18} />
          </button>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '16px 12px 10px 12px',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {/* Message Bubbles */}
        {currentChatMessages.map((msg) => {
          const isMe = msg.senderId === 'me' || msg.senderId === 'user_me';
          return (
            <ChatBubble
              key={msg.id}
              message={msg}
              isMe={isMe}
              avatarUrl={isMe ? userAvatar : matchAvatar}
            />
          );
        })}

        {/* Typing Indicator */}
        {isTyping && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '12px 16px',
              borderRadius: '20px 20px 20px 4px',
              background: '#FFFFFF',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
              width: 'fit-content',
              marginBottom: '12px',
              animation: 'fadeIn 0.2s ease-out'
            }}
          >
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#F43F5E', animation: 'float 0.8s infinite alternate' }} />
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#FB7185', animation: 'float 0.8s infinite alternate 0.2s' }} />
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#BE123C', animation: 'float 0.8s infinite alternate 0.4s' }} />
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Message Input Bottom Bar */}
      <MessageInput onSendMessage={sendChatMessage} />
    </div>
  );
};
