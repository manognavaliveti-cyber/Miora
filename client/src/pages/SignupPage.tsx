import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { MioraLogo } from '../components/common/MioraLogo';
import { User, Mail, Lock, Eye, EyeOff, ArrowRight, ChevronLeft, MapPin, Phone, Sparkles, SkipForward, LogIn } from 'lucide-react';

export const SignupPage: React.FC = () => {
  const { signup, googleAuth, setCurrentView, showToast, isLoading } = useApp();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [location, setLocation] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [termsAgreed, setTermsAgreed] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState('');

  const handleSignup = async (mode: 'build' | 'skip' | 'choice' = 'choice') => {
    setFormError('');
    const next: Record<string, string> = {};
    if (!name.trim()) next.name = 'Name is required';
    if (!email.trim() || !email.includes('@')) next.email = 'Valid email is required';
    if (!mobile.trim() || mobile.replace(/\D/g, '').length < 10) next.mobile = 'Valid mobile number is required';
    if (!location.trim()) next.location = 'Location is required';
    if (!password || password.length < 6) next.password = 'Password must be at least 6 characters';
    if (!termsAgreed) next.terms = 'Please accept the Terms & Conditions and Privacy Policy.';
    if (Object.keys(next).length) { setErrors(next); showToast('Please complete the required fields and accept the Terms & Conditions.'); return; }

    const result = await signup({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: mobile.trim(),
      location: location.trim(),
      termsAccepted: true,
      termsVersion: '1.0',
      termsAcceptedAt: new Date().toISOString()
    }, password, mode);
    if (!result.success) setFormError(result.message || 'Unable to create your account. Please try again.');
  };

  const handleGoogleSignup = async () => {
    if (!termsAgreed) {
      setErrors((p) => ({ ...p, terms: 'Please accept the Terms & Conditions and Privacy Policy.' }));
      return;
    }
    await googleAuth('signup');
  };

  const field = (error?: string): React.CSSProperties => ({
    display:'flex', alignItems:'center', gap:10, background:'rgba(255,247,249,.94)', borderRadius:16,
    padding:'13px 15px', border:error ? '1.5px solid #E11D48' : '1.5px solid #F3D0D9',
    boxShadow:'inset 0 1px 0 rgba(255,255,255,.95)', transition:'all .2s ease'
  });
  const input: React.CSSProperties = { flex:1, minWidth:0, background:'transparent', border:0, outline:0, fontSize:'1rem', color:'#24151D', fontWeight:550, fontFamily:'inherit' };
  const label: React.CSSProperties = { display:'block', fontSize:'.78rem', fontWeight:800, color:'#5F4B55', marginBottom:7 };

  return (
    <div style={{ minHeight:'100vh', width:'100%', background:'linear-gradient(180deg,#FFF0F3,#FFE8EE 48%,#FFF7F8)', display:'flex', alignItems:'center', justifyContent:'center', padding:'28px 16px', boxSizing:'border-box', position:'relative', overflow:'hidden' }}>
      <style>{`
        @keyframes signupIn{from{opacity:0;transform:translateY(20px) scale(.98)}to{opacity:1;transform:none}}
        .miora-signup-final{animation:signupIn .65s cubic-bezier(.2,.8,.2,1) both}
        .miora-final-field:focus-within{border-color:#E11D48!important;box-shadow:0 0 0 4px rgba(225,29,72,.07)!important;transform:translateY(-1px)}
        .miora-final-primary:hover{transform:translateY(-2px);box-shadow:0 15px 30px rgba(190,18,60,.28)!important}
        .miora-final-google:hover{transform:translateY(-2px);background:#FFF8FA!important;border-color:#E8AFC0!important}.miora-signup-actions button:disabled{opacity:.6;cursor:not-allowed;transform:none!important;box-shadow:none!important}
        @media(max-width:800px){.miora-signup-actions{grid-template-columns:1fr!important}.miora-signup-layout{grid-template-columns:1fr!important}.miora-signup-hero{display:none!important}.miora-signup-card{max-width:560px!important}}
        @media(prefers-reduced-motion:reduce){.miora-signup-final{animation:none!important}}
      `}</style>
      <div style={{ position:'absolute', width:440, height:440, borderRadius:'50%', border:'1px solid rgba(190,18,60,.12)', top:-180, left:-170 }} />
      <div style={{ position:'absolute', width:520, height:520, borderRadius:'50%', border:'1px solid rgba(190,18,60,.12)', bottom:-250, right:-200 }} />

      <div className="miora-signup-layout miora-signup-final" style={{ position:'relative', zIndex:1, width:'100%', maxWidth:1080, display:'grid', gridTemplateColumns:'minmax(300px,.9fr) minmax(380px,1.1fr)', gap:'clamp(24px,5vw,60px)', alignItems:'center' }}>
        <div className="miora-signup-hero" style={{ minHeight:560, borderRadius:34, padding:40, background:'linear-gradient(145deg,#FFE2E9,#FFD6E1)', border:'1.5px solid #F2C4CF', boxShadow:'0 20px 60px rgba(125,23,48,.08)', display:'flex', flexDirection:'column', justifyContent:'space-between' }}>
          <div>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:40 }}>
              <button type="button" onClick={() => setCurrentView('welcome')} style={{ width:44,height:44,borderRadius:'50%',border:'1px solid #F0CDD5',background:'#FFF',display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',color:'#6B5560' }}><ChevronLeft size={21}/></button>
              <MioraLogo size={44} showTagline={false} showWordmark vertical={false}/>
            </div>
            <div style={{ color:'#BE123C', fontSize:'.76rem', fontWeight:850, letterSpacing:'.16em' }}>CREATE YOUR ACCOUNT</div>
            <h1 style={{ fontSize:'clamp(2.2rem,4vw,3rem)', lineHeight:1.1, margin:'12px 0', color:'#21161B', fontWeight:900 }}>Start your MIORA story.</h1>
            <p style={{ color:'#765E68', lineHeight:1.7, fontSize:'1rem' }}>Create your account first. Then you can build your profile with interests, photos and dating preferences — or skip and explore MIORA right away.</p>
          </div>
          <div style={{ display:'flex', gap:10, flexWrap:'wrap' }}>
            {['Simple signup','Build later','Your preferences'].map((t)=><span key={t} style={{ background:'rgba(255,255,255,.7)', border:'1px solid #F1CBD4', padding:'8px 12px', borderRadius:999, color:'#7D1730', fontSize:'.76rem', fontWeight:750 }}>{t}</span>)}
          </div>
        </div>

        <div className="miora-signup-card" style={{ background:'rgba(255,255,255,.95)', borderRadius:30, padding:'clamp(24px,4vw,36px)', border:'1px solid rgba(244,63,94,.14)', boxShadow:'0 24px 70px rgba(125,23,48,.12)', boxSizing:'border-box' }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:18 }}>
            <div>
              <div style={{ fontSize:'.72rem', color:'#BE123C', fontWeight:850, letterSpacing:'.14em', textTransform:'uppercase' }}>Welcome to MIORA</div>
              <h2 style={{ margin:'6px 0 3px', fontSize:'1.8rem', color:'#24151D', fontWeight:900 }}>Create Account</h2>
              <p style={{ margin:0, color:'#806D76', fontSize:'.84rem' }}>Only the essentials. Build the rest when you're ready.</p>
            </div>
          </div>

          <form onSubmit={(e) => e.preventDefault()} style={{ display:'flex', flexDirection:'column', gap:16 }}>
            <div><label style={label}>Name</label><div className="miora-final-field" style={field(errors.name)}><User size={18} color="#B27A89"/><input value={name} onChange={e=>{setName(e.target.value);setErrors(p=>({...p,name:''}))}} placeholder="Your name" style={input}/></div>{errors.name&&<small style={{color:'#E11D48'}}>{errors.name}</small>}</div>
            <div><label style={label}>Email</label><div className="miora-final-field" style={field(errors.email)}><Mail size={18} color="#B27A89"/><input type="email" value={email} onChange={e=>{setEmail(e.target.value);setErrors(p=>({...p,email:''}))}} placeholder="you@example.com" style={input}/></div>{errors.email&&<small style={{color:'#E11D48'}}>{errors.email}</small>}</div>
            <div><label style={label}>Mobile Number</label><div className="miora-final-field" style={field(errors.mobile)}><Phone size={18} color="#B27A89"/><input type="tel" inputMode="tel" value={mobile} onChange={e=>{setMobile(e.target.value);setErrors(p=>({...p,mobile:''}))}} placeholder="+91 98765 43210" style={input}/></div>{errors.mobile&&<small style={{color:'#E11D48'}}>{errors.mobile}</small>}</div>
            <div><label style={label}>Location</label><div className="miora-final-field" style={field(errors.location)}><MapPin size={18} color="#B27A89"/><input value={location} onChange={e=>{setLocation(e.target.value);setErrors(p=>({...p,location:''}))}} placeholder="City" style={input}/></div>{errors.location&&<small style={{color:'#E11D48'}}>{errors.location}</small>}</div>
            <div><label style={label}>Password</label><div className="miora-final-field" style={field(errors.password)}><Lock size={18} color="#B27A89"/><input type={showPassword?'text':'password'} value={password} onChange={e=>{setPassword(e.target.value);setErrors(p=>({...p,password:''}))}} placeholder="At least 6 characters" style={input}/><button type="button" onClick={()=>setShowPassword(v=>!v)} style={{border:0,background:'transparent',padding:0,cursor:'pointer',color:'#9B7884'}}>{showPassword?<EyeOff size={18}/>:<Eye size={18}/>}</button></div>{errors.password&&<small style={{color:'#E11D48'}}>{errors.password}</small>}</div>

            <label style={{ display:'flex', alignItems:'flex-start', gap:9, cursor:'pointer', color:'#5F4B55', fontSize:'.79rem', lineHeight:1.45 }}>
              <input type="checkbox" checked={termsAgreed} onChange={e=>{setTermsAgreed(e.target.checked);if(e.target.checked)setErrors(p=>({...p,terms:''}))}} style={{ marginTop:2, width:17,height:17,accentColor:'#BE123C' }}/>
              <span>I agree to the <button type="button" onClick={()=>setCurrentView('terms')} style={{border:0,background:'none',padding:0,color:'#BE123C',fontWeight:800,textDecoration:'underline',cursor:'pointer'}}>Terms & Conditions</button> and <button type="button" onClick={()=>setCurrentView('privacy')} style={{border:0,background:'none',padding:0,color:'#BE123C',fontWeight:800,textDecoration:'underline',cursor:'pointer'}}>Privacy Policy</button>.</span>
            </label>
            {errors.terms&&<small style={{color:'#E11D48'}}>{errors.terms}</small>}

            {formError && (
              <div role="alert" style={{ padding:'12px 14px', borderRadius:14, background:'rgba(239,68,68,.10)', border:'1px solid rgba(239,68,68,.35)', color:'#B91C1C', fontSize:'.85rem', fontWeight:650, lineHeight:1.45 }}>
                {formError}
              </div>
            )}

            <div className="miora-signup-actions" style={{display:'grid',gridTemplateColumns:'1fr',gap:10}}>
              <button className="miora-final-primary" type="button" disabled={isLoading} onClick={() => handleSignup('choice')} style={{border:0,borderRadius:999,padding:'11px 18px',maxWidth:360,margin:'0 auto',width:'100%',background:'linear-gradient(135deg,#BE123C,#9F1239)',color:'#FFF',fontWeight:850,fontSize:'.94rem',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',gap:8,boxShadow:'0 8px 20px rgba(190,18,60,.20)',transition:'all .2s ease'}}>
                <LogIn size={17}/> {isLoading ? 'Please wait…' : 'Sign Up'} <ArrowRight size={17}/>
              </button>
            </div>

            <div style={{display:'flex',alignItems:'center',gap:10}}><div style={{flex:1,height:1,background:'#EBDDE2'}}/><span style={{fontSize:'.75rem',color:'#A18C95'}}>OR</span><div style={{flex:1,height:1,background:'#EBDDE2'}}/></div>
            <button className="miora-final-google" type="button" onClick={handleGoogleSignup} style={{border:'1.5px solid #E6D9DE',borderRadius:999,padding:'10px 18px',maxWidth:360,margin:'0 auto',width:'100%',background:'#FFF',color:'#26313B',fontWeight:750,fontSize:'.88rem',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',gap:10,transition:'all .2s ease'}}>
              <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/></svg>
              Continue with Google
            </button>
            <div style={{textAlign:'center',marginTop:2}}><span style={{fontSize:'.82rem',color:'#7E6E77'}}>Already have an account? <button type="button" onClick={()=>setCurrentView('login')} style={{border:0,background:'transparent',color:'#BE123C',fontWeight:850,cursor:'pointer',padding:0}}>Log In</button></span></div>
          </form>
        </div>
      </div>
    </div>
  );
};
