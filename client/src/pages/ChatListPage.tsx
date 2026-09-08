import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { ChatBubble } from '../components/chat/ChatBubble';
import { MessageInput } from '../components/chat/MessageInput';
import { Button } from '../components/common/Button';
import {
  MessageCircle,
  Search,
  Sparkles,
  Phone,
  Video,
  Info,
  Flame,
  Heart,
  ShieldCheck,
  Gift,
  Gamepad2
} from 'lucide-react';

export const ChatListPage: React.FC = () => {
  const {
    matches,
    currentUser,
    activeMatch,
    currentChatMessages,
    openChatWithMatch,
    sendChatMessage,
    setCurrentView,
    openProfileDetail,
    isTyping,
    showToast,
    startCall,
    openGiftModal,
    startGameWithPartner,
    coupleGames
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const heartWallpaper = `url("data:image/svg+xml,%3Csvg width='90' height='90' viewBox='0 0 90 90' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23F472B6' fill-opacity='0.16'%3E%3Cpath d='M25 22 C23 15 13 15 11 19 C9 24 16 30 25 36 C34 30 41 24 39 19 C37 15 27 15 25 22 Z' transform='scale(0.55) rotate(-10 25 22)' /%3E%3Cpath d='M70 65 C68 58 58 58 56 62 C54 67 61 73 70 79 C79 73 86 67 84 62 C82 58 72 58 70 65 Z' transform='scale(0.65) rotate(18 70 65)' fill='%23FB7185' fill-opacity='0.14' /%3E%3Cpath d='M75 20 C73 14 65 14 63 17 C61 21 67 26 75 31 C83 26 89 21 87 17 C85 14 77 14 75 20 Z' transform='scale(0.4) rotate(8 75 20)' fill='%23FDA4AF' fill-opacity='0.18' /%3E%3Cpath d='M20 70 C18 65 13 65 11 67 C9 70 14 74 20 78 C26 74 31 70 29 67 C27 65 22 65 20 70 Z' transform='scale(0.45) rotate(-22 20 70)' fill='%23F472B6' fill-opacity='0.13' /%3E%3C/g%3E%3C/svg%3E")`;

  useEffect(() => {
    // On desktop, auto-select first match if none is active
    if (!activeMatch && matches.length > 0) {
      openChatWithMatch(matches[0]);
    }
  }, [matches, activeMatch]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentChatMessages, isTyping]);

  const filteredMatches = matches.filter((m) =>
    m.profile.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedMatch = activeMatch || (matches.length > 0 ? matches[0] : null);
  const userAvatar = currentUser.photos[0] || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80';

  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        margin: '0 auto',
        padding: '0 0 24px 0',
        animation: 'fadeIn 0.25s ease-out forwards'
      }}
    >
      <div className="desktop-chat-container">
        {/* LEFT COLUMN: Conversation Threads & Search */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            borderRight: '1.5px solid var(--border-subtle)',
            background: 'var(--surface-white)',
            height: '100%',
            overflowY: 'auto'
          }}
        >
          {/* Header & Search */}
          <div style={{ padding: '20px 18px 14px 18px', borderBottom: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Sparkles size={16} color="var(--gold-deep)" />
                <h2
                  style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: '1.35rem',
                    fontWeight: 800,
                    color: 'var(--text-primary)'
                  }}
                >
                  Conversations
                </h2>
              </div>
              <span
                style={{
                  background: 'rgba(136, 19, 55, 0.08)',
                  color: 'var(--berry-primary)',
                  border: '1px solid var(--border-gold)',
                  fontSize: '0.74rem',
                  fontWeight: 800,
                  padding: '2px 9px',
                  borderRadius: 'var(--radius-pill)'
                }}
              >
                {matches.length} Active
              </span>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 16px',
                borderRadius: 'var(--radius-pill)',
                background: 'var(--bg-soft-blush)',
                border: '1px solid var(--border-subtle)',
                transition: 'border-color var(--transition-fast)'
              }}
            >
              <Search size={15} color="var(--text-muted)" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search conversations..."
                style={{
                  border: 'none',
                  background: 'transparent',
                  outline: 'none',
                  fontSize: '0.86rem',
                  fontFamily: 'var(--font-display)',
                  width: '100%',
                  color: 'var(--text-primary)'
                }}
              />
            </div>
          </div>

          {/* Conversations List */}
          <div style={{ display: 'flex', flex: 1, flexDirection: 'column', padding: '10px 8px' }}>
            {filteredMatches.length > 0 ? (
              filteredMatches.map((match) => {
                const isSelected = selectedMatch?.id === match.id;
                const photo =
                  match.profile.photos[0] ||
                  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&q=80';
                const hasUnread = match.unreadCount > 0;

                return (
                  <div
                    key={match.id}
                    onClick={() => {
                      openChatWithMatch(match);
                      // If on mobile viewport, switch to full chat view
                      if (window.innerWidth < 1024) {
                        setCurrentView('chat');
                      }
                    }}
                    style={{
                      padding: '12px 14px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      borderRadius: 'var(--radius-md)',
                      cursor: 'pointer',
                      background: isSelected
                        ? 'linear-gradient(135deg, rgba(136, 19, 55, 0.09) 0%, rgba(212, 175, 55, 0.09) 100%)'
                        : hasUnread
                        ? 'var(--bg-soft-blush)'
                        : 'transparent',
                      border: isSelected
                        ? '1.5px solid var(--border-gold)'
                        : '1.5px solid transparent',
                      transition: 'all var(--transition-fast)',
                      marginBottom: '4px'
                    }}
                    onMouseEnter={(e) => {
                      if (!isSelected) e.currentTarget.style.background = 'rgba(136, 19, 55, 0.04)';
                    }}
                    onMouseLeave={(e) => {
                      if (!isSelected) e.currentTarget.style.background = hasUnread ? 'var(--bg-soft-blush)' : 'transparent';
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ position: 'relative' }}>
                        <img
                          src={photo}
                          alt={match.profile.name}
                          style={{
                            width: '52px',
                            height: '52px',
                            borderRadius: '50%',
                            objectFit: 'cover',
                            border: isSelected ? '2.5px solid var(--berry-primary)' : '1.5px solid var(--border-subtle)'
                          }}
                        />
                        {match.profile.online && (
                          <span
                            style={{
                              position: 'absolute',
                              bottom: '1px',
                              right: '1px',
                              width: '13px',
                              height: '13px',
                              borderRadius: '50%',
                              background: '#059669',
                              border: '2px solid #FFFFFF'
                            }}
                          />
                        )}
                      </div>

                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <h3
                            style={{
                              fontFamily: 'var(--font-serif)',
                              fontSize: '1.05rem',
                              fontWeight: 800,
                              color: 'var(--text-primary)'
                            }}
                          >
                            {match.profile.name}
                          </h3>
                        </div>

                        <p
                          style={{
                            fontSize: '0.82rem',
                            color: hasUnread ? 'var(--text-primary)' : 'var(--text-secondary)',
                            fontWeight: hasUnread ? 700 : 400,
                            marginTop: '2px',
                            display: '-webkit-box',
                            WebkitLineClamp: 1,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden'
                          }}
                        >
                          {match.lastMessage || 'Connected on MIORA ✨'}
                        </p>
                      </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                        {match.lastMessageTime || '2h'}
                      </span>
                      {hasUnread && (
                        <span
                          style={{
                            width: '8px',
                            height: '8px',
                            borderRadius: '50%',
                            background: 'var(--berry-primary)'
                          }}
                        />
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <div style={{ padding: '36px 16px', textAlign: 'center' }}>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>No conversations yet.</p>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN (Desktop Active Conversation Pane) */}
        <div
          className="desktop-only"
          style={{
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            background: '#FDF2F4',
            backgroundImage: heartWallpaper,
            backgroundRepeat: 'repeat',
            position: 'relative'
          }}
        >
          {selectedMatch ? (
            <>
              {/* Header */}
              <div
                style={{
                  padding: '16px 24px',
                  background: 'rgba(255, 255, 255, 0.96)',
                  backdropFilter: 'blur(16px)',
                  borderBottom: '1px solid rgba(244, 114, 182, 0.25)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <div
                  onClick={() => openProfileDetail(selectedMatch.profile)}
                  style={{ display: 'flex', alignItems: 'center', gap: '14px', cursor: 'pointer' }}
                >
                  <img
                    src={selectedMatch.profile.photos[0]}
                    alt={selectedMatch.profile.name}
                    style={{
                      width: '50px',
                      height: '50px',
                      borderRadius: '50%',
                      objectFit: 'cover',
                      border: '2px solid var(--border-gold)'
                    }}
                  />
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <h3
                        style={{
                          fontFamily: 'var(--font-serif)',
                          fontSize: '1.25rem',
                          fontWeight: 800,
                          color: 'var(--text-primary)'
                        }}
                      >
                        {selectedMatch.profile.name}, {selectedMatch.profile.age}
                      </h3>
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '3px',
                          background: 'rgba(136, 19, 55, 0.08)',
                          border: '1px solid var(--border-gold)',
                          padding: '2px 8px',
                          borderRadius: 'var(--radius-pill)',
                          fontSize: '0.74rem',
                          fontWeight: 800,
                          color: 'var(--berry-primary)'
                        }}
                      >
                        <Flame size={12} fill="var(--berry-primary)" />
                        {selectedMatch.profile.compatibility}% Match
                      </span>
                    </div>
                    <span style={{ fontSize: '0.78rem', color: selectedMatch.profile.online ? '#059669' : 'var(--text-muted)', fontWeight: 600 }}>
                      {selectedMatch.profile.online ? '• Online' : 'Connected on MIORA'}
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <button
                    onClick={() => startCall(selectedMatch.profile, 'audio')}
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      background: 'var(--surface-white)',
                      border: '1.5px solid rgba(244, 114, 182, 0.3)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--berry-primary)',
                      cursor: 'pointer',
                      boxShadow: 'var(--shadow-xs)',
                      transition: 'all var(--transition-fast)'
                    }}
                    title="Start Voice Call"
                    onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--berry-primary)')}
                    onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'rgba(244, 114, 182, 0.3)')}
                  >
                    <Phone size={18} fill="currentColor" />
                  </button>

                  <button
                    onClick={() => startCall(selectedMatch.profile, 'video')}
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      background: 'var(--surface-white)',
                      border: '1.5px solid rgba(244, 114, 182, 0.3)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--berry-primary)',
                      cursor: 'pointer',
                      boxShadow: 'var(--shadow-xs)',
                      transition: 'all var(--transition-fast)'
                    }}
                    title="Start Video Call"
                    onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--berry-primary)')}
                    onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'rgba(244, 114, 182, 0.3)')}
                  >
                    <Video size={19} fill="currentColor" />
                  </button>

                  <button
                    onClick={() => openGiftModal(selectedMatch.profile)}
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, rgba(244,63,94,0.1), rgba(212,175,55,0.15))',
                      border: '1.5px solid var(--border-gold)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--berry-primary)',
                      cursor: 'pointer',
                      boxShadow: 'var(--shadow-xs)',
                      transition: 'all var(--transition-fast)'
                    }}
                    title="Send Virtual Gift 🎁"
                    onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.06)')}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                  >
                    <Gift size={18} />
                  </button>

                  <button
                    onClick={() => startGameWithPartner(coupleGames[0], selectedMatch.profile)}
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, rgba(136,19,55,0.08), rgba(244,63,94,0.1))',
                      border: '1.5px solid var(--border-gold)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--berry-primary)',
                      cursor: 'pointer',
                      boxShadow: 'var(--shadow-xs)',
                      transition: 'all var(--transition-fast)'
                    }}
                    title="Play Couple Game 🎮"
                    onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.06)')}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                  >
                    <Gamepad2 size={18} />
                  </button>

                  <button
                    onClick={() => openProfileDetail(selectedMatch.profile)}
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      background: 'var(--surface-white)',
                      border: '1.5px solid rgba(244, 114, 182, 0.3)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--text-secondary)',
                      cursor: 'pointer',
                      boxShadow: 'var(--shadow-xs)',
                      transition: 'all var(--transition-fast)'
                    }}
                    title="View Full Profile"
                    onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--berry-primary)')}
                    onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'rgba(244, 114, 182, 0.3)')}
                  >
                    <Info size={18} />
                  </button>
                </div>
              </div>

              {/* Messages Area */}
              <div
                style={{
                  flex: 1,
                  overflowY: 'auto',
                  padding: '24px 28px',
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                {currentChatMessages.map((msg) => {
                  const isMe = msg.senderId === 'me' || msg.senderId === 'user_me';
                  return (
                    <ChatBubble
                      key={msg.id}
                      message={msg}
                      isMe={isMe}
                      avatarUrl={isMe ? userAvatar : selectedMatch.profile.photos[0]}
                    />
                  );
                })}

                {isTyping && (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '12px 16px',
                      borderRadius: '18px 18px 18px 4px',
                      background: 'var(--surface-white)',
                      border: '1px solid rgba(244, 114, 182, 0.3)',
                      boxShadow: 'var(--shadow-sm)',
                      width: 'fit-content',
                      marginBottom: '12px'
                    }}
                  >
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#F43F5E', animation: 'float 0.8s infinite alternate' }} />
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#FB7185', animation: 'float 0.8s infinite alternate 0.2s' }} />
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#BE123C', animation: 'float 0.8s infinite alternate 0.4s' }} />
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <MessageInput onSendMessage={sendChatMessage} />
            </>
          ) : (
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <p style={{ color: 'var(--text-secondary)' }}>Select a conversation to start chatting.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};


