const fs = require('fs');
let code = fs.readFileSync('src/components/subscription/BoostModal.tsx', 'utf8');

const startStr = "return (";
const endStr = "  );\n};\n";

const startIndex = code.indexOf(startStr);
const endIndex = code.lastIndexOf(endStr);

if (startIndex !== -1 && endIndex !== -1) {
  const newCode = code.substring(0, startIndex) + `return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'rgba(0, 0, 0, 0.6)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end', // Bottom sheet
        animation: 'fadeIn 0.2s ease-out'
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) closeBoostModal();
      }}
    >
      <div
        style={{
          width: '100%',
          background: '#FFFFFF', // Clean white background for modal
          color: '#1F171A',
          borderTopLeftRadius: '28px',
          borderTopRightRadius: '28px',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          padding: '16px 24px 32px 24px',
          boxSizing: 'border-box',
          boxShadow: '0 -4px 20px rgba(0,0,0,0.1)',
          animation: 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      >
        <style>{\`
          @keyframes slideUp {
            from { transform: translateY(100%); }
            to { transform: translateY(0); }
          }
          .boost-carousel-hide-scrollbar::-webkit-scrollbar {
            display: none;
          }
        \`}</style>
        
        {/* Top Pill Indicator */}
        <div 
          style={{ 
            width: '44px', 
            height: '5px', 
            background: '#FCE7F1', 
            borderRadius: '4px', 
            margin: '0 auto 24px auto' 
          }} 
        />

        {/* Title */}
        <h2
          style={{
            fontFamily: "'Cormorant Garamond', 'Playfair Display', Georgia, serif",
            fontSize: '2rem',
            fontWeight: 800,
            color: '#1F171A',
            margin: '0 0 28px 0',
            lineHeight: 1.15,
            textAlign: 'center'
          }}
        >
          Boost your profile<br/>for more views
        </h2>

        {/* Swipable Package Carousel */}
        <div
          className="boost-carousel-hide-scrollbar"
          onScroll={(e) => {
            const container = e.currentTarget;
            const scrollLeft = container.scrollLeft;
            const cardWidth = container.clientWidth;
            const index = Math.round(scrollLeft / cardWidth);
            if (index === 0 && selectedId !== 'boost_30m') setSelectedId('boost_30m');
            else if (index === 1 && selectedId !== 'boost_2h') setSelectedId('boost_2h');
            else if (index === 2 && selectedId !== 'boost_24h') setSelectedId('boost_24h');
          }}
          style={{
            display: 'flex',
            gap: '16px',
            overflowX: 'auto',
            scrollSnapType: 'x mandatory',
            scrollBehavior: 'smooth',
            paddingBottom: '8px',
            WebkitOverflowScrolling: 'touch',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none'
          }}
        >
          {/* Card 1 */}
          <div
            onClick={(e) => {
               setSelectedId('boost_30m');
               e.currentTarget.parentElement?.scrollTo({ left: 0, behavior: 'smooth' });
            }}
            role="button"
            tabIndex={0}
            style={{
              minWidth: '100%',
              scrollSnapAlign: 'center',
              borderRadius: '20px',
              border: selectedId === 'boost_30m' ? '2.5px solid #9E2A4B' : '1.5px solid #FCE7F1',
              background: selectedId === 'boost_30m' ? 'linear-gradient(180deg, #FFF9FA 0%, #FFFFFF 100%)' : '#FFFFFF',
              padding: '24px 20px',
              textAlign: 'center',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              boxSizing: 'border-box',
              transition: 'all 0.2s ease',
              boxShadow: selectedId === 'boost_30m' ? '0 12px 32px rgba(158, 42, 75, 0.08)' : 'none'
            }}
          >
            <Zap size={32} color="#9E2A4B" fill="#9E2A4B" style={{ marginBottom: '16px', filter: 'drop-shadow(0 4px 6px rgba(158,42,75,0.2))' }} />
            <h3 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#1F171A', margin: '0 0 8px 0', fontFamily: "'Cormorant Garamond', serif" }}>
              1 Superboost
            </h3>
            <div style={{ fontSize: '1.05rem', color: '#9E2A4B', fontWeight: 700, marginBottom: '20px' }}>
              ₹100
            </div>
            <div style={{ fontSize: '0.9rem', color: '#6B7280', lineHeight: 1.5, padding: '0 10px', fontWeight: 500 }}>
              Stand out 11x more with a 30-minute boost. Use it at any time.
            </div>
          </div>

          {/* Card 2 */}
          <div
            onClick={(e) => {
               setSelectedId('boost_2h');
               e.currentTarget.parentElement?.scrollTo({ left: e.currentTarget.parentElement.clientWidth, behavior: 'smooth' });
            }}
            role="button"
            tabIndex={0}
            style={{
              minWidth: '100%',
              scrollSnapAlign: 'center',
              borderRadius: '20px',
              border: selectedId === 'boost_2h' ? '2.5px solid #9E2A4B' : '1.5px solid #FCE7F1',
              background: selectedId === 'boost_2h' ? 'linear-gradient(180deg, #FFF9FA 0%, #FFFFFF 100%)' : '#FFFFFF',
              padding: '24px 20px',
              textAlign: 'center',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              boxSizing: 'border-box',
              transition: 'all 0.2s ease',
              boxShadow: selectedId === 'boost_2h' ? '0 12px 32px rgba(158, 42, 75, 0.08)' : 'none'
            }}
          >
            <Zap size={32} color="#9E2A4B" fill="#9E2A4B" style={{ marginBottom: '16px', filter: 'drop-shadow(0 4px 6px rgba(158,42,75,0.2))' }} />
            <h3 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#1F171A', margin: '0 0 8px 0', fontFamily: "'Cormorant Garamond', serif" }}>
              4 Superboosts
            </h3>
            <div style={{ fontSize: '1.05rem', color: '#9E2A4B', fontWeight: 700, marginBottom: '20px' }}>
              ₹62.50 each
            </div>
            <div style={{ fontSize: '0.9rem', color: '#6B7280', lineHeight: 1.5, padding: '0 10px', fontWeight: 500 }}>
              Dominate the feed for 2 full hours. Perfect for peak times.
            </div>
          </div>

          {/* Card 3 */}
          <div
            onClick={(e) => {
               setSelectedId('boost_24h');
               e.currentTarget.parentElement?.scrollTo({ left: e.currentTarget.parentElement.clientWidth * 2, behavior: 'smooth' });
            }}
            role="button"
            tabIndex={0}
            style={{
              minWidth: '100%',
              scrollSnapAlign: 'center',
              borderRadius: '20px',
              border: selectedId === 'boost_24h' ? '2.5px solid #9E2A4B' : '1.5px solid #FCE7F1',
              background: selectedId === 'boost_24h' ? 'linear-gradient(180deg, #FFF9FA 0%, #FFFFFF 100%)' : '#FFFFFF',
              padding: '24px 20px',
              textAlign: 'center',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              boxSizing: 'border-box',
              transition: 'all 0.2s ease',
              boxShadow: selectedId === 'boost_24h' ? '0 12px 32px rgba(158, 42, 75, 0.08)' : 'none'
            }}
          >
            <Zap size={32} color="#9E2A4B" fill="#9E2A4B" style={{ marginBottom: '16px', filter: 'drop-shadow(0 4px 6px rgba(158,42,75,0.2))' }} />
            <h3 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#1F171A', margin: '0 0 8px 0', fontFamily: "'Cormorant Garamond', serif" }}>
              Unlimited Boost
            </h3>
            <div style={{ fontSize: '1.05rem', color: '#9E2A4B', fontWeight: 700, marginBottom: '20px' }}>
              ₹1600 total
            </div>
            <div style={{ fontSize: '0.9rem', color: '#6B7280', lineHeight: 1.5, padding: '0 10px', fontWeight: 500 }}>
              Get seen first by everyone with a massive 24-hour Superboost.
            </div>
          </div>
        </div>
        
        {/* Carousel Dots */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', margin: '20px 0 28px 0' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: selectedId === 'boost_30m' ? '#9E2A4B' : '#FCE7F1', transition: 'background 0.2s ease' }} />
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: selectedId === 'boost_2h' ? '#9E2A4B' : '#FCE7F1', transition: 'background 0.2s ease' }} />
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: selectedId === 'boost_24h' ? '#9E2A4B' : '#FCE7F1', transition: 'background 0.2s ease' }} />
        </div>

        {/* Select Button */}
        <button
          type="button"
          onClick={handleSelect}
          disabled={isActivating}
          style={{
            width: '100%',
            height: '54px',
            border: 'none',
            borderRadius: '27px',
            background: 'linear-gradient(135deg, #A31D45 0%, #801B38 100%)',
            color: '#FFFFFF',
            fontSize: '1.05rem',
            fontWeight: 700,
            cursor: isActivating ? 'wait' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 8px 20px rgba(163, 29, 69, 0.25)',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.02)')}
          onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
        >
          {isActivating ? 'Processing...' : (tokens > 0 && !isBoostActive ? \`Activate Token (\${tokens})\` : 'Select Package')}
        </button>
      </div>
    </div>
` + code.substring(endIndex);
  
  fs.writeFileSync('src/components/subscription/BoostModal.tsx', newCode, 'utf8');
  console.log('Success');
} else {
  console.log('Markers not found');
}
