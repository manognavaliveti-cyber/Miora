const fs = require('fs');
let code = fs.readFileSync('src/pages/ChatListPage.tsx', 'utf8');

const startStr = "<h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#111827', margin: '0 0 12px 0' }}>Featured Experts</h2>";
const endStr = "<div className=\"desktop-chat-container\">";

const startIndex = code.indexOf(startStr);
const endIndex = code.indexOf(endStr);

if (startIndex !== -1 && endIndex !== -1) {
  const newCode = code.substring(0, startIndex) + `<h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#1F171A', margin: '0 0 16px 0', fontFamily: "'Cormorant Garamond', 'Playfair Display', serif" }}>
          Chats
        </h2>

        {/* Expert Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', paddingBottom: '20px' }}>
          {mobileMatches.length > 0 ? mobileMatches.map((match) => {
            const photo = match.profile.photos[0] || 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22300%22 height=%22300%22 viewBox=%220 0 300 300%22%3E%3Crect width=%22300%22 height=%22300%22 rx=%22150%22 fill=%22%23f8e9ee%22/%3E%3C/svg%3E';
            
            return (
              <div
                key={match.id}
                onClick={() => handleStartChat(match)}
                style={{
                  background: '#FFFFFF',
                  borderRadius: '20px',
                  padding: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  border: '1.5px solid #FDF0F3',
                  boxShadow: '0 8px 24px rgba(158, 42, 75, 0.04)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                {/* Left: Avatar with Online indicator */}
                <div style={{ position: 'relative', flexShrink: 0 }}>
                  <img 
                    src={photo} 
                    alt={match.profile.name} 
                    style={{ width: '64px', height: '64px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #FDF0F3' }} 
                  />
                  <div style={{
                    position: 'absolute',
                    bottom: '2px',
                    right: '2px',
                    width: '14px',
                    height: '14px',
                    borderRadius: '50%',
                    background: '#10B981',
                    border: '2.5px solid #FFFFFF'
                  }} />
                </div>

                {/* Middle: Details */}
                <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontWeight: 800, fontSize: '1.15rem', color: '#1F171A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {match.profile.name}
                    </span>
                    <span style={{ fontSize: '1rem', color: '#6B7280', fontWeight: 500 }}>
                      {match.profile.age} Y
                    </span>
                  </div>
                  
                  <div style={{ fontSize: '0.9rem', color: '#6B7280', marginTop: '2px' }}>
                    {match.profile.location || 'Mumbai, IN'}
                  </div>
                  
                  <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#9E2A4B', marginTop: '6px' }}>
                    ₹5<span style={{ fontSize: '0.85rem', color: '#9CA3AF', fontWeight: 600 }}>/min</span>
                  </div>
                </div>

                {/* Right: Call Button */}
                <button
                  onClick={(e) => { e.stopPropagation(); handleStartCall(match.profile); }}
                  style={{
                    flexShrink: 0,
                    width: '46px',
                    height: '46px',
                    borderRadius: '50%',
                    border: 'none',
                    background: 'linear-gradient(135deg, #A31D45 0%, #801B38 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    boxShadow: '0 6px 16px rgba(163, 29, 69, 0.25)',
                    transition: 'transform 0.15s ease'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="white" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                </button>
              </div>
            );
          }) : (
            <div className="mobile-chat-empty" style={{ textAlign: 'center', padding: '40px 0', color: '#9CA3AF' }}>
              <div style={{ fontSize: '1rem', fontWeight: 600 }}>No experts found</div>
            </div>
          )}
        </div>
      </div>

      ` + code.substring(endIndex);
  
  fs.writeFileSync('src/pages/ChatListPage.tsx', newCode, 'utf8');
  console.log('Success');
} else {
  console.log('Markers not found');
}
