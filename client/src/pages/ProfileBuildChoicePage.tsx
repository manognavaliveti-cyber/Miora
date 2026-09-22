import React from 'react';
import { useApp } from '../context/AppContext';
import { Sparkles, ArrowRight, SkipForward, Heart } from 'lucide-react';

export const ProfileBuildChoicePage: React.FC = () => {
  const { setCurrentView, setActiveTab, openDiscountModal } = useApp();

  const handleSkip = () => {
    setCurrentView('home');
    setActiveTab('home');
    openDiscountModal();
  };

  return (
    <div style={{ minHeight: '100vh', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '28px 18px', boxSizing: 'border-box', background: 'linear-gradient(180deg,#FFF1F4 0%,#FFE5EB 48%,#FFF7F8 100%)', position: 'relative', overflow: 'hidden' }}>
      <style>{`
        @keyframes choiceIn { from { opacity:0; transform:translateY(24px) scale(.98) } to { opacity:1; transform:none } }
        @keyframes heartFloat { 0%,100% { transform:translateY(0) rotate(-6deg) } 50% { transform:translateY(-12px) rotate(6deg) } }
        .miora-choice-card { animation: choiceIn .65s cubic-bezier(.2,.8,.2,1) both; }
        .miora-choice-heart { animation: heartFloat 4s ease-in-out infinite; }
        .miora-choice-primary:hover { transform:translateY(-3px); box-shadow:0 18px 38px rgba(190,18,60,.28)!important; }
        .miora-choice-skip:hover { background:#FFF1F4!important; color:#9F1239!important; }
        @media(max-width:600px){ .miora-choice-card{padding:28px 22px!important}.miora-choice-title{font-size:2rem!important} }
        @media(prefers-reduced-motion:reduce){.miora-choice-card,.miora-choice-heart{animation:none!important}}
      `}</style>
      <div style={{ position:'absolute', width:360, height:360, borderRadius:'50%', background:'rgba(244,63,94,.08)', filter:'blur(10px)', top:-130, right:-100 }} />
      <div style={{ position:'absolute', width:300, height:300, borderRadius:'50%', background:'rgba(190,18,60,.07)', filter:'blur(12px)', bottom:-120, left:-100 }} />
      <div className="miora-choice-card" style={{ width:'100%', maxWidth:620, background:'rgba(255,255,255,.92)', border:'1px solid rgba(244,63,94,.18)', borderRadius:32, padding:'44px 42px', boxShadow:'0 28px 80px rgba(125,23,48,.13)', textAlign:'center', position:'relative', zIndex:1, boxSizing:'border-box' }}>
        <div className="miora-choice-heart" style={{ width:78, height:78, margin:'0 auto 20px', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', background:'linear-gradient(145deg,#FFE0E8,#FFF5F7)', color:'#BE123C', boxShadow:'0 14px 34px rgba(190,18,60,.16)' }}>
          <Heart size={38} fill="currentColor" />
        </div>
        <div style={{ fontSize:'.75rem', fontWeight:800, letterSpacing:'.16em', color:'#BE123C', textTransform:'uppercase' }}>Welcome to MIORA</div>
        <h1 className="miora-choice-title" style={{ margin:'9px 0 10px', fontSize:'2.45rem', lineHeight:1.12, color:'#24151D', fontWeight:900 }}>Build your profile</h1>
        <p style={{ margin:'0 auto', maxWidth:500, color:'#765E68', fontSize:'1rem', lineHeight:1.65 }}>Create a richer profile with your interests, photos, and dating preferences. You can complete it now or explore MIORA first.</p>

        <div style={{ display:'grid', gap:12, marginTop:30 }}>
          <button className="miora-choice-primary" onClick={() => setCurrentView('profile-setup')} style={{ border:0, borderRadius:999, padding:'16px 22px', background:'linear-gradient(135deg,#BE123C,#9F1239)', color:'#FFF', fontSize:'1.02rem', fontWeight:850, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:10, boxShadow:'0 10px 28px rgba(190,18,60,.22)', transition:'all .2s ease' }}>
            <Sparkles size={19} /> Build Your Profile <ArrowRight size={19} />
          </button>
          <button className="miora-choice-skip" onClick={handleSkip} style={{ border:'1.5px solid #E9C9D1', borderRadius:999, padding:'14px 22px', background:'#FFF', color:'#6B5560', fontSize:'.95rem', fontWeight:750, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:9, transition:'all .2s ease' }}>
            <SkipForward size={17} /> Skip for now
          </button>
        </div>
        <p style={{ margin:'18px 0 0', color:'#A08A93', fontSize:'.76rem' }}>You can complete or edit your profile later from Settings.</p>
      </div>
    </div>
  );
};
