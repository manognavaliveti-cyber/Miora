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
  MapPin,
  Star,
  MoreVertical,
  Trash2,
} from 'lucide-react';
import { Match, Profile } from '../types';
import { markRealMessagesAsRead } from '../services/realtimeUsers';
import { VerifiedBadge } from '../components/common/VerifiedBadge';

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
    currentView,
    deleteChatMessage
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [hiddenChatMap, setHiddenChatMap] = useState<Record<string, number>>(() => {
    try { return JSON.parse(localStorage.getItem('miora_hidden_chats') || '{}'); } catch { return {}; }
  });
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const shouldAutoScrollRef = useRef(true);

  useEffect(() => {
    const el = messagesContainerRef.current;
    if (!el || !shouldAutoScrollRef.current) return;
    el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
  }, [currentChatMessages, isTyping]);

  const handleMessagesScroll = () => {
    const el = messagesContainerRef.current;
    if (!el) return;
    const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    shouldAutoScrollRef.current = distanceFromBottom < 120;
  };

  const filteredMatches = matches.filter((match) => {
    const q = searchQuery.toLowerCase();
    return match.profile.name.toLowerCase().includes(q) || (match.profile.location || '').toLowerCase().includes(q);
  });

  // Chat inboxes contain actual conversations only, not every possible match.
  // A locally deleted thread stays hidden until a newer real message arrives.
  const conversationMatches = filteredMatches
    .filter((match) => Boolean(match.lastMessage?.trim()) || (match.unreadCount || 0) > 0)
    .filter((match) => {
      const hiddenAt = hiddenChatMap[match.id];
      if (!hiddenAt) return true;
      const updatedAt = new Date(match.matchedAt || 0).getTime();
      return updatedAt > hiddenAt;
    });
  const mobileMatches = conversationMatches;
  const mobileUnreadCount = mobileMatches.reduce((sum, match) => sum + (match.unreadCount || 0), 0);

  // A conversation is only "open" (and billed ₹3/min) once you tap a person — never automatically.
  const selectedMatch = currentView === 'chat' ? activeMatch : null;

  useEffect(() => {
    if (!selectedMatch?.id || !selectedMatch.profile.isRealUser || currentUser.id === 'user_me') return;
    markRealMessagesAsRead(selectedMatch.id, currentUser.id).catch(() => {});
  }, [selectedMatch?.id, currentUser.id]);

  const handleDeleteChat = (match: Match) => {
    if (!window.confirm(`Delete chat with ${match.profile.name}?`)) return;
    const next = { ...hiddenChatMap, [match.id]: Date.now() };
    setHiddenChatMap(next);
    localStorage.setItem('miora_hidden_chats', JSON.stringify(next));
    if (activeMatch?.id === match.id) {
      setCurrentView('chat-list');
    }
    showToast(`Chat with ${match.profile.name} deleted from this device.`);
  };

  const handleStartCall = (profile: Profile) => {
    startCall(profile, 'audio');
  };

  const handleStartChat = (match: Match) => {
    // openChatWithMatch shows the wallet pop-up instead when there is no money for a chat minute.
    openChatWithMatch(match);
  };

  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        margin: '0 auto',
        padding: '0',
        animation: 'fadeIn 0.25s ease-out forwards',
        boxSizing: 'border-box',
        height: '100%',
        minHeight: 0,
        overflow: 'hidden'
      }}
    >
      {/* MOBILE INBOX: Instagram/WhatsApp-style conversation list */}
      <div className="mobile-chat-inbox" aria-label="Messages">
        <div className="mobile-chat-inbox-header">
          <div>
            <h2>Messages</h2>
            <p>{mobileUnreadCount > 0 ? `${mobileUnreadCount} unread message${mobileUnreadCount === 1 ? '' : 's'}` : 'Your conversations'}</p>
          </div>
          <div className="mobile-chat-search">
            <Search size={17} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search"
              aria-label="Search conversations"
            />
          </div>
        </div>

        <div className="mobile-chat-thread-list">
          {mobileMatches.length > 0 ? mobileMatches.map((match) => {
            const photo = match.profile.photos[0] || 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22300%22 height=%22300%22 viewBox=%220 0 300 300%22%3E%3Crect width=%22300%22 height=%22300%22 rx=%22150%22 fill=%22%23f8e9ee%22/%3E%3Ccircle cx=%22150%22 cy=%22115%22 r=%2250%22 fill=%22%23c08497%22/%3E%3Cpath d=%22M55 270c16-80 174-80 190 0%22 fill=%22%23c08497%22/%3E%3C/svg%3E';
            const preview = match.lastMessage?.trim() || 'Start a conversation 👋';
            const unread = (match.unreadCount || 0) > 0;
            return (
              <button
                key={match.id}
                type="button"
                className={`mobile-chat-thread ${unread ? 'is-unread' : ''}`}
                onClick={() => handleStartChat(match)}
              >
                <span className="mobile-chat-avatar-wrap">
                  <img src={photo} alt={match.profile.name} className="mobile-chat-avatar" />
                  {match.profile.online && <span className="mobile-chat-online" />}
                </span>
                <span className="mobile-chat-thread-body">
                  <span className="mobile-chat-thread-top">
                    <span className="mobile-chat-name" style={{ display: 'inline-flex', alignItems: 'center', gap: '2px' }}>
                      <span>{match.profile.name}</span>
                      {(match.profile.verified || match.profile.isVerified) && <VerifiedBadge size={14} />}
                    </span>
                    <span className={`mobile-chat-status ${match.profile.online ? 'is-online' : 'is-offline'}`}>{match.profile.online ? 'Online' : 'Offline'}</span>
                    <span className="mobile-chat-time">{match.lastMessageTime || ''}</span>
                  </span>
                  <span className="mobile-chat-thread-bottom">
                    <span className="mobile-chat-preview">{preview}</span>
                    {unread && <span className="mobile-chat-unread-dot" aria-label={`${match.unreadCount} unread message${match.unreadCount === 1 ? '' : 's'}`} />}
                    <span
                      role="button"
                      tabIndex={0}
                      className="mobile-chat-thread-menu"
                      aria-label={`Delete chat with ${match.profile.name}`}
                      title="Delete chat"
                      onClick={(event) => { event.stopPropagation(); handleDeleteChat(match); }}
                      onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); event.stopPropagation(); handleDeleteChat(match); } }}
                    >
                      <MoreVertical size={18} />
                    </span>
                  </span>
                </span>
              </button>
            );
          }) : (
            <div className="mobile-chat-empty">
              <MessageCircle size={34} />
              <strong>No conversations yet</strong>
              <span>When someone messages you, their chat will appear here.</span>
            </div>
          )}
        </div>
      </div>

      <div className="desktop-chat-container">
        {/* LEFT COLUMN: People to Connect & Stacked Connection Cards */}
        <div
          className="desktop-chat-left-pane"
          style={{
            display: 'flex',
            flexDirection: 'column',
            borderRight: '1.5px solid var(--border-subtle)',
            background: 'var(--bg-soft-blush)',
            height: '100%',
            overflowY: 'auto'
          }}
        >
          {/* Chat Profiles Header */}
          <div
            style={{
              padding: '16px 18px 14px 18px',
              background: 'var(--surface-white)',
              borderBottom: '1px solid var(--border-subtle)',
              position: 'sticky',
              top: 0,
              zIndex: 10
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '9px', marginBottom: '12px' }}>
              <Sparkles size={19} color="var(--berry-primary)" />
              <div>
                <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.35rem', fontWeight: 900, color: 'var(--text-primary)', margin: 0 }}>MIORA Conversations</h2>
                <p style={{ margin: '2px 0 0', fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700 }}>Connect with people online</p>
              </div>
            </div>
            {/* Search Input */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 14px',
                borderRadius: 'var(--radius-pill)',
                background: 'var(--bg-soft-blush)',
                border: '1px solid var(--border-subtle)'
              }}
            >
              <Search size={15} color="var(--text-muted)" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search people..."
                style={{
                  border: 'none',
                  background: 'transparent',
                  outline: 'none',
                  fontSize: '0.84rem',
                  width: '100%',
                  color: 'var(--text-primary)'
                }}
              />
            </div>
          </div>

          {/* Vertically Stacked Profile Connection Cards */}
          <div style={{ padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {conversationMatches.length > 0 ? (
              conversationMatches.map((match) => {
                const photo = match.profile.photos[0] || 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22400%22 height=%22400%22 viewBox=%220 0 400 400%22%3E%3Crect width=%22400%22 height=%22400%22 rx=%22200%22 fill=%22%23f8e9ee%22/%3E%3Ccircle cx=%22200%22 cy=%22155%22 r=%2270%22 fill=%22%23c08497%22/%3E%3Cpath d=%22M80 360c18-92 222-92 240 0%22 fill=%22%23c08497%22/%3E%3C/svg%3E';
                const isSelected = selectedMatch?.id === match.id;
                // Derive a friendly star rating from vibe-match compatibility so every
                // profile card shows a consistent, believable score (like the reference UI).
                const rating = Math.min(5, Math.max(3.8, (match.profile.compatibility || 88) / 20)).toFixed(1);

                return (
                  <div
                    key={match.id}
                    style={{
                      background: 'var(--surface-white)',
                      borderRadius: '18px',
                      padding: '12px 14px',
                      border: isSelected ? '2px solid var(--berry-primary)' : '1.5px solid var(--border-subtle)',
                      boxShadow: '0 4px 16px rgba(0,0,0,0.04)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {/* Avatar + Name + Location + Chat rate */}
                    <div
                      onClick={() => handleStartChat(match)}
                      style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', flex: 1, minWidth: 0 }}
                    >
                      <div style={{ position: 'relative', flexShrink: 0 }}>
                        <img
                          src={photo}
                          alt={match.profile.name}
                          style={{
                            width: '58px',
                            height: '58px',
                            borderRadius: '16px',
                            objectFit: 'cover',
                            border: '2px solid var(--bg-soft-blush)'
                          }}
                        />
                        {match.profile.online && (
                          <span
                            style={{
                              position: 'absolute',
                              bottom: '-2px',
                              right: '-2px',
                              width: '14px',
                              height: '14px',
                              borderRadius: '50%',
                              background: '#10B981',
                              border: '2.5px solid #FFFFFF'
                            }}
                          />
                        )}
                      </div>

                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                          <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                            <span>{match.profile.name}, {match.profile.age}</span>
                            {(match.profile.verified || match.profile.isVerified) && <VerifiedBadge size={16} />}
                          </h3>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '2px', fontSize: '0.76rem', fontWeight: 800, color: '#D97706' }}>
                            <Star size={12} fill="#F59E0B" color="#F59E0B" />
                            {rating}
                          </span>
                        </div>

                        <p style={{ fontSize: '0.72rem', color: match.profile.online ? '#10B981' : 'var(--text-muted)', margin: '2px 0 0 0', fontWeight: 800 }}>
                          {match.profile.online ? '● Online' : '○ Offline'}
                        </p>
                        {match.profile.location && (
                          <p style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', margin: '2px 0 0 0', display: 'flex', alignItems: 'center', gap: '4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            <MapPin size={11} color="var(--berry-primary)" />
                            {match.profile.location}
                          </p>
                        )}
                        <p style={{ fontSize: '0.76rem', color: 'var(--berry-primary)', margin: '3px 0 0 0', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <MessageCircle size={11} />
                          ₹3/min Chat
                        </p>
                      </div>
                    </div>

                    {/* Compact circular-pill Call Button, price shown like the reference design */}
                    <button
                      onClick={() => handleStartCall(match.profile)}
                      aria-label={`Call ${match.profile.name}`}
                      style={{
                        flexShrink: 0,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '2px',
                        width: '68px',
                        padding: '10px 6px',
                        borderRadius: '16px',
                        border: 'none',
                        background: 'linear-gradient(135deg, #A91E45 0%, #7D1730 100%)',
                        color: '#FFFFFF',
                        cursor: 'pointer',
                        fontWeight: 800,
                        boxShadow: '0 8px 18px rgba(125, 23, 48, 0.28)',
                        transition: 'transform 0.15s ease'
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.05)'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
                    >
                      <Phone size={18} fill="#FFFFFF" />
                      <span style={{ fontSize: '0.7rem', lineHeight: 1 }}>₹8/min</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteChat(match)}
                      aria-label={`Delete chat with ${match.profile.name}`}
                      title="Delete chat"
                      style={{
                        width: '34px',
                        height: '34px',
                        borderRadius: '50%',
                        border: '1px solid var(--border-subtle)',
                        background: '#FFFFFF',
                        color: 'var(--text-muted)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        flexShrink: 0
                      }}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                );
              })
            ) : (
              <div style={{ textAlign: 'center', padding: '40px 16px', color: 'var(--text-muted)' }}>
                <MessageCircle size={32} style={{ marginBottom: '8px', opacity: 0.5 }} />
                <p style={{ fontSize: '0.9rem', fontWeight: 600 }}>No profiles found in this category</p>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Active Chat Thread (Desktop View) */}
        <div
          className="desktop-chat-right-pane"
          style={{
            display: 'flex',
            flexDirection: 'column',
            background: 'var(--surface-white)',
            height: '100%',
            minHeight: 0,
            overflow: 'hidden'
          }}
        >
          {selectedMatch ? (
            <>
              {/* Header */}
              <div
                style={{
                  padding: '14px 20px',
                  borderBottom: '1px solid var(--border-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  background: '#FFFFFF'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <img
                    src={selectedMatch.profile.photos[0]}
                    alt={selectedMatch.profile.name}
                    style={{ width: '44px', height: '44px', borderRadius: '50%', objectFit: 'cover' }}
                  />
                  <div>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      <span>{selectedMatch.profile.name}, {selectedMatch.profile.age}</span>
                      {(selectedMatch.profile.verified || selectedMatch.profile.isVerified) && <VerifiedBadge size={16} />}
                    </h3>
                    <span style={{ fontSize: '0.76rem', color: selectedMatch.profile.online ? '#10B981' : 'var(--text-muted)', fontWeight: 600 }}>
                      {selectedMatch.profile.online ? '● Online' : 'Offline'}
                    </span>
                  </div>
                </div>

                {/* Top Action Buttons */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <button
                    onClick={() => startCall(selectedMatch.profile, 'audio')}
                    style={{
                      padding: '8px 14px',
                      borderRadius: 'var(--radius-pill)',
                      border: '1px solid rgba(16, 185, 129, 0.3)',
                      background: 'rgba(16, 185, 129, 0.08)',
                      color: '#059669',
                      fontSize: '0.8rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <Phone size={14} /> Audio · ₹8/min
                  </button>

                  <button
                    onClick={() => startCall(selectedMatch.profile, 'video')}
                    style={{
                      padding: '8px 14px',
                      borderRadius: 'var(--radius-pill)',
                      border: '1px solid rgba(239, 68, 68, 0.3)',
                      background: 'rgba(239, 68, 68, 0.08)',
                      color: '#DC2626',
                      fontSize: '0.8rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <Video size={14} /> Video · ₹12/min
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteChat(selectedMatch)}
                    aria-label="Delete chat"
                    title="Delete chat"
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      border: '1px solid var(--border-subtle)',
                      background: '#FFFFFF',
                      color: 'var(--text-muted)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer'
                    }}
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>

              {/* Messages Container */}
              <div ref={messagesContainerRef} onScroll={handleMessagesScroll} style={{ flex: 1, minHeight: 0, padding: '20px', overflowY: 'auto', overscrollBehavior: 'contain', background: 'var(--bg-soft-blush)' }}>
                {currentChatMessages.map((msg) => (
                  <ChatBubble key={msg.id} message={msg} isMe={msg.senderId === currentUser.id || msg.senderId === 'me' || msg.senderId === 'user_me'} avatarUrl={msg.senderId === currentUser.id || msg.senderId === 'me' || msg.senderId === 'user_me' ? (currentUser.photos[0] || '') : (selectedMatch.profile.photos[0] || '')} onDeleteMessage={(message) => { void deleteChatMessage(message.id); }} />
                ))}
              </div>

              {/* Input Bar */}
              <MessageInput onSendMessage={(text) => sendChatMessage(text)} />
            </>
          ) : (
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
              Select a conversation to start chatting · ₹3/min
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
