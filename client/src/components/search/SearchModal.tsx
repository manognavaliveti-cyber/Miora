import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Profile } from '../../types';
import {
  X,
  Search,
  User,
  CheckCircle2,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { VerifiedBadge } from '../common/VerifiedBadge';

export const SearchModal: React.FC = () => {
  const {
    isSearchModalOpen,
    closeSearchModal,
    searchablePeople,
    refreshRealProfiles,
    openProfileDetail
  } = useApp();

  const [query, setQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'people'>('all');
  const [searchResults, setSearchResults] = useState<Profile[]>([]);

  // Every time the search box opens, re-read who is registered so a person who just
  // logged in on another device can be found immediately.
  useEffect(() => {
    if (isSearchModalOpen) refreshRealProfiles();
  }, [isSearchModalOpen]);

  useEffect(() => {
    if (!isSearchModalOpen) return;

    if (!query.trim()) {
      setSearchResults(searchablePeople.slice(0, 8));
      return;
    }

    const q = query.toLowerCase().trim();
    const matchedProfiles = searchablePeople
      .filter(
        (p) =>
          (p.name || '').toLowerCase().includes(q) ||
          (p.location || '').toLowerCase().includes(q) ||
          (p.bio || '').toLowerCase().includes(q) ||
          (p.interests && p.interests.some((i) => i.toLowerCase().includes(q)))
      )
      .sort((a, b) => {
        const an = (a.name || '').toLowerCase();
        const bn = (b.name || '').toLowerCase();
        const rank = (n: string) => (n.startsWith(q) ? 0 : n.includes(q) ? 1 : 2);
        return rank(an) - rank(bn);
      });

    setSearchResults(matchedProfiles);
  }, [query, isSearchModalOpen, searchablePeople]);

  if (!isSearchModalOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        background: 'rgba(31, 22, 26, 0.8)',
        backdropFilter: 'blur(16px)',
        padding: '24px 16px',
        animation: 'fadeIn 0.2s ease-out'
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '600px',
          maxHeight: '88vh',
          background: '#FFFFFF',
          borderRadius: '32px',
          boxShadow: '0 24px 70px rgba(0,0,0,0.3)',
          border: '1.5px solid var(--border-gold, #FCE7F3)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          animation: 'scaleIn 0.25s ease-out'
        }}
      >
        {/* Search Bar Header */}
        <div style={{ padding: '20px 24px 14px', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
            <div
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                background: '#F9FAFB',
                borderRadius: '999px',
                padding: '10px 18px',
                border: '1.5px solid #E5E7EB'
              }}
            >
              <Search size={18} color="#EE3865" />
              <input
                type="text"
                autoFocus
                placeholder="Search people, interests, locations..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                style={{
                  flex: 1,
                  border: 'none',
                  background: 'transparent',
                  fontSize: '0.94rem',
                  outline: 'none',
                  color: '#1F2937'
                }}
              />
              {query && (
                <button
                  onClick={() => setQuery('')}
                  style={{
                    border: 'none',
                    background: 'transparent',
                    cursor: 'pointer',
                    color: '#9CA3AF',
                    padding: 0
                  }}
                >
                  <X size={16} />
                </button>
              )}
            </div>

            <button
              onClick={closeSearchModal}
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                border: 'none',
                background: 'rgba(238, 56, 101, 0.08)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#4B5563'
              }}
            >
              <X size={18} />
            </button>
          </div>

          {/* Filter Pills */}
          <div style={{ display: 'flex', gap: '8px' }}>
            {(['all', 'people'] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                style={{
                  padding: '6px 16px',
                  borderRadius: '999px',
                  border: activeFilter === filter ? 'none' : '1px solid #E5E7EB',
                  background: activeFilter === filter ? 'var(--primary-gradient, #EE3865)' : '#FFFFFF',
                  color: activeFilter === filter ? '#FFFFFF' : '#4B5563',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  textTransform: 'capitalize'
                }}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* Search Results Content */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '16px 24px 24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px'
          }}
        >
          {/* People Section */}
          {searchResults.length > 0 && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px' }}>
                <User size={15} color="#EE3865" />
                <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#6B7280', textTransform: 'uppercase' }}>
                  PEOPLE ({searchResults.length})
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {searchResults.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => {
                      closeSearchModal();
                      openProfileDetail(p);
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '12px 16px',
                      background: '#FFFFFF',
                      borderRadius: '20px',
                      border: '1.5px solid #F3F4F6',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(238, 56, 101, 0.3)';
                      e.currentTarget.style.transform = 'translateY(-1px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = '#F3F4F6';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flex: 1 }}>
                      <img
                        src={p.photos[0] || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&q=80'}
                        alt={p.name}
                        style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover' }}
                      />
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                          <span style={{ fontWeight: 800, fontSize: '0.96rem', color: '#1F2937' }}>
                            {p.name}{p.age ? `, ${p.age}` : ''}
                          </span>
                          {(p.verified || p.isVerified) && <VerifiedBadge size={16} />}
                        </div>
                        <span style={{ fontSize: '0.8rem', color: '#6B7280' }}>
                          {p.location || 'Location hidden'}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        closeSearchModal();
                        openProfileDetail(p);
                      }}
                      style={{
                        padding: '8px 18px',
                        borderRadius: '999px',
                        border: 'none',
                        background: 'linear-gradient(135deg, #7D1730 0%, #A91E45 100%)',
                        color: '#FFFFFF',
                        fontSize: '0.82rem',
                        fontWeight: 800,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        cursor: 'pointer',
                        boxShadow: '0 4px 12px rgba(169, 30, 69, 0.25)',
                        transition: 'transform 0.18s ease'
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.04)')}
                      onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                    >
                      <span>View Profile</span>
                      <ChevronRight size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {searchResults.length === 0 && (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: '#9CA3AF' }}>
              <Sparkles size={36} color="#EE3865" style={{ opacity: 0.6, marginBottom: '8px' }} />
              <p style={{ fontWeight: 700, margin: 0, color: '#4B5563' }}>No people found</p>
              <p style={{ fontSize: '0.84rem', margin: '4px 0 0' }}>Try searching for a different name, city, or interest.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
