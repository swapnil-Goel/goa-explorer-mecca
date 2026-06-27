import React, { useState } from 'react';
import { supabase } from '../lib/supabase';

/* ─────────────────────────────────────────────
   Global styles + keyframes
───────────────────────────────────────────── */
const STYLE = `
  @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes floatCard {
    0%, 100% { transform: translateY(0px); }
    50%       { transform: translateY(-4px); }
  }
  @keyframes glowLogo {
    0%, 100% { filter: drop-shadow(0 0 8px rgba(212,175,55,0.25)); }
    50%       { filter: drop-shadow(0 0 18px rgba(212,175,55,0.5)); }
  }
  @keyframes shimmer {
    0%   { background-position: -300% center; }
    100% { background-position:  300% center; }
  }
  @keyframes btnPulse {
    0%, 100% { box-shadow: 0 0 18px rgba(212,175,55,0.18), inset 0 1px 0 rgba(212,175,55,0.12); }
    50%       { box-shadow: 0 0 36px rgba(212,175,55,0.32), inset 0 1px 0 rgba(212,175,55,0.22); }
  }
  @keyframes driftLeft {
    0%, 100% { transform: translateY(0) rotate(0deg); opacity: 0.13; }
    50%       { transform: translateY(-12px) rotate(0.5deg); opacity: 0.2; }
  }
  @keyframes driftRight {
    0%, 100% { transform: translateY(0) rotate(0deg); opacity: 0.1; }
    50%       { transform: translateY(-8px) rotate(-0.4deg); opacity: 0.16; }
  }

  .gex-root { font-family: 'Cinzel', Georgia, serif; }

  .gex-logo  { animation: glowLogo 5s ease-in-out infinite; }
  .gex-card  { animation: floatCard 7s ease-in-out infinite; }

  .gex-s1 { animation: fadeIn 1s cubic-bezier(0.16,1,0.3,1) 0.1s both; }
  .gex-s2 { animation: fadeIn 1s cubic-bezier(0.16,1,0.3,1) 0.28s both; }
  .gex-s3 { animation: fadeIn 1s cubic-bezier(0.16,1,0.3,1) 0.46s both; }
  .gex-s4 { animation: fadeIn 1s cubic-bezier(0.16,1,0.3,1) 0.62s both; }

  .gex-btn {
    animation: btnPulse 4s ease-in-out infinite;
    transition: border-color 0.22s, box-shadow 0.22s, transform 0.16s, background 0.22s;
  }
  .gex-btn:hover:not(:disabled) {
    border-color: rgba(212,175,55,0.9) !important;
    box-shadow: 0 0 56px rgba(212,175,55,0.35), 0 10px 40px rgba(0,0,0,0.45), inset 0 1px 0 rgba(212,175,55,0.25) !important;
    transform: translateY(-2px);
    background: linear-gradient(135deg, rgba(28,50,100,0.98) 0%, rgba(14,24,58,1) 100%) !important;
  }
  .gex-btn:active:not(:disabled) {
    transform: translateY(0);
    box-shadow: 0 0 18px rgba(212,175,55,0.15) !important;
  }
  .gex-shimmer {
    background: linear-gradient(90deg,
      transparent 0%,
      rgba(212,175,55,0.5) 25%,
      rgba(255,240,170,0.95) 50%,
      rgba(212,175,55,0.5) 75%,
      transparent 100%
    );
    background-size: 300% 100%;
    animation: shimmer 4s linear infinite;
  }
  .bg-drift-l { animation: driftLeft  11s ease-in-out infinite; }
  .bg-drift-r { animation: driftRight 14s ease-in-out infinite; }
`;

/* ─────────────────────────────────────────────
   Cinematic SVG background — Goa seascape
───────────────────────────────────────────── */
const CinematicBg = () => (
  <svg
    aria-hidden="true"
    style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
    viewBox="0 0 1440 900"
    preserveAspectRatio="xMidYMid slice"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <radialGradient id="seaGlow" cx="50%" cy="62%" r="45%">
        <stop offset="0%"   stopColor="#D4AF37" stopOpacity="0.06" />
        <stop offset="100%" stopColor="#D4AF37" stopOpacity="0" />
      </radialGradient>
      <linearGradient id="horizonFade" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%"   stopColor="#D4AF37" stopOpacity="0" />
        <stop offset="100%" stopColor="#D4AF37" stopOpacity="0.08" />
      </linearGradient>
      <linearGradient id="shipMast" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%"   stopColor="#C9A84C" stopOpacity="0.22" />
        <stop offset="100%" stopColor="#C9A84C" stopOpacity="0.08" />
      </linearGradient>
      <filter id="softBlur">
        <feGaussianBlur stdDeviation="2.5" />
      </filter>
    </defs>

    {/* Sea glow */}
    <rect x="0" y="0" width="1440" height="900" fill="url(#seaGlow)" />

    {/* Horizon water line */}
    <path d="M0,590 Q360,578 720,590 Q1080,602 1440,590 L1440,900 L0,900 Z"
          fill="rgba(212,175,55,0.03)" />

    {/* Gentle water ripples */}
    {[600,620,640,660,680,700,720,740].map((y, i) => (
      <path key={i}
        d={`M${i * 90},${y} Q${180 + i * 90},${y - 4} ${360 + i * 90},${y} Q${540 + i * 90},${y + 4} ${720 + i * 90},${y}`}
        stroke="rgba(212,175,55,0.04)" strokeWidth="1" fill="none"
      />
    ))}

    {/* ── LEFT: Goa coastline rocks + palm trees ── */}
    {/* Rocky coastline */}
    <path d="M0,900 L0,720 Q30,690 60,700 Q90,710 110,680 Q130,650 150,660 Q170,670 190,640 Q210,610 230,630 Q250,650 260,680 L260,900 Z"
          fill="rgba(212,175,55,0.055)" filter="url(#softBlur)" />
    <path d="M0,900 L0,760 Q20,745 45,750 Q70,755 85,730 Q100,705 120,720 Q140,735 155,760 L155,900 Z"
          fill="rgba(212,175,55,0.04)" />

    {/* Left palm tree — tall */}
    <line x1="90" y1="900" x2="105" y2="610" stroke="rgba(212,175,55,0.13)" strokeWidth="5" strokeLinecap="round" />
    {/* Palm fronds left */}
    <path d="M105,610 Q75,580 45,568 Q60,582 88,592 Q72,578 74,568 Q90,582 105,610"
          fill="rgba(212,175,55,0.10)" />
    <path d="M105,610 Q128,575 148,560 Q138,578 118,586 Q132,572 133,562 Q118,578 105,610"
          fill="rgba(212,175,55,0.09)" />
    <path d="M105,610 Q88,568 78,545 Q86,564 100,572 Q90,558 92,548 Q100,566 105,610"
          fill="rgba(212,175,55,0.08)" />

    {/* Left palm tree — shorter, forward */}
    <line x1="30" y1="900" x2="42" y2="680" stroke="rgba(212,175,55,0.11)" strokeWidth="4" strokeLinecap="round" />
    <path d="M42,680 Q18,655 2,645 Q14,658 35,665 Q20,654 21,646 Q34,660 42,680"
          fill="rgba(212,175,55,0.08)" />
    <path d="M42,680 Q62,650 76,638 Q66,653 50,660 Q62,648 62,640 Q50,655 42,680"
          fill="rgba(212,175,55,0.07)" />

    {/* Pirate flag on left rock */}
    <line x1="195" y1="640" x2="195" y2="580" stroke="rgba(212,175,55,0.15)" strokeWidth="1.5" />
    <path d="M195,580 L218,589 L195,598 Z" fill="rgba(212,175,55,0.14)" />

    {/* ── RIGHT: Pirate ship + palm trees ── */}
    {/* Right palm trees */}
    <line x1="1360" y1="900" x2="1348" y2="600" stroke="rgba(212,175,55,0.12)" strokeWidth="5" strokeLinecap="round" />
    <path d="M1348,600 Q1318,572 1296,560 Q1314,576 1338,584 Q1322,570 1324,560 Q1338,576 1348,600"
          fill="rgba(212,175,55,0.09)" />
    <path d="M1348,600 Q1372,568 1390,554 Q1378,572 1358,580 Q1374,566 1374,556 Q1360,574 1348,600"
          fill="rgba(212,175,55,0.09)" />
    <path d="M1348,600 Q1332,556 1320,532 Q1330,554 1344,562 Q1334,548 1336,538 Q1344,558 1348,600"
          fill="rgba(212,175,55,0.07)" />

    <line x1="1420" y1="900" x2="1410" y2="660" stroke="rgba(212,175,55,0.10)" strokeWidth="4" strokeLinecap="round" />
    <path d="M1410,660 Q1388,635 1372,625 Q1386,638 1404,645 Q1390,634 1391,626 Q1404,640 1410,660"
          fill="rgba(212,175,55,0.07)" />
    <path d="M1410,660 Q1430,632 1444,620 Q1434,636 1416,642 Q1430,630 1430,622 Q1418,638 1410,660"
          fill="rgba(212,175,55,0.07)" />

    {/* Pirate ship silhouette */}
    {/* Hull */}
    <path d="M1050,680 Q1060,720 1080,730 L1250,730 Q1270,720 1280,680 Z"
          fill="rgba(212,175,55,0.09)" />
    {/* Hull bottom curve */}
    <path d="M1070,730 Q1165,750 1260,730" stroke="rgba(212,175,55,0.08)" strokeWidth="2" fill="none" />
    {/* Deck rail */}
    <line x1="1055" y1="680" x2="1275" y2="680" stroke="rgba(212,175,55,0.10)" strokeWidth="1.5" />
    {/* Bowsprit */}
    <line x1="1055" y1="685" x2="1005" y2="650" stroke="rgba(212,175,55,0.10)" strokeWidth="2" strokeLinecap="round" />
    {/* Main mast */}
    <line x1="1155" y1="680" x2="1155" y2="530" stroke="url(#shipMast)" strokeWidth="3" strokeLinecap="round" />
    {/* Fore mast */}
    <line x1="1100" y1="680" x2="1100" y2="560" stroke="url(#shipMast)" strokeWidth="2.5" strokeLinecap="round" />
    {/* Mizzen mast */}
    <line x1="1210" y1="680" x2="1210" y2="580" stroke="url(#shipMast)" strokeWidth="2" strokeLinecap="round" />
    {/* Main sail */}
    <path d="M1155,535 Q1190,570 1195,620 L1155,620 Z" fill="rgba(212,175,55,0.07)" />
    <path d="M1155,535 Q1120,570 1115,620 L1155,620 Z" fill="rgba(212,175,55,0.06)" />
    {/* Fore sail */}
    <path d="M1100,562 Q1126,582 1128,628 L1100,628 Z" fill="rgba(212,175,55,0.06)" />
    <path d="M1100,562 Q1076,582 1074,628 L1100,628 Z" fill="rgba(212,175,55,0.05)" />
    {/* Mizzen sail */}
    <path d="M1210,582 Q1230,600 1232,640 L1210,640 Z" fill="rgba(212,175,55,0.05)" />
    {/* Rigging lines */}
    <line x1="1100" y1="562" x2="1155" y2="535" stroke="rgba(212,175,55,0.07)" strokeWidth="1" />
    <line x1="1155" y1="535" x2="1210" y2="580" stroke="rgba(212,175,55,0.06)" strokeWidth="1" />
    <line x1="1005" y1="650" x2="1100" y2="562" stroke="rgba(212,175,55,0.06)" strokeWidth="1" />
    {/* Pirate flag */}
    <line x1="1155" y1="530" x2="1155" y2="495" stroke="rgba(212,175,55,0.12)" strokeWidth="1.5" />
    <path d="M1155,495 L1180,504 L1155,513 Z" fill="rgba(212,175,55,0.12)" />

    {/* Moon glow (top-right) */}
    <circle cx="1060" cy="160" r="55" fill="rgba(212,175,55,0.04)" />
    <circle cx="1060" cy="160" r="38" fill="rgba(212,175,55,0.05)" />
    <circle cx="1060" cy="160" r="22" fill="rgba(212,175,55,0.08)" />
    {/* Moon rays */}
    {[0,30,60,90,120,150,180,210,240,270,300,330].map((deg, i) => {
      const r = (deg * Math.PI) / 180;
      return (
        <line key={i}
          x1={1060 + 25 * Math.cos(r)} y1={160 + 25 * Math.sin(r)}
          x2={1060 + 65 * Math.cos(r)} y2={160 + 65 * Math.sin(r)}
          stroke="rgba(212,175,55,0.04)" strokeWidth="1"
        />
      );
    })}

    {/* Moon reflection on water */}
    <path d="M1020,590 Q1060,585 1100,590 Q1060,595 1020,590 Z"
          fill="rgba(212,175,55,0.08)" />
    <path d="M1035,600 Q1060,596 1085,600 Q1060,604 1035,600 Z"
          fill="rgba(212,175,55,0.06)" />
    <path d="M1045,610 Q1060,607 1075,610 Q1060,613 1045,610 Z"
          fill="rgba(212,175,55,0.05)" />

    {/* Subtle horizon glow */}
    <rect x="0" y="560" width="1440" height="60" fill="url(#horizonFade)" opacity="0.5" />
  </svg>
);

/* ─────────────────────────────────────────────
   Decorative gold curves (large, drifting)
───────────────────────────────────────────── */
const GoldCurves = () => (
  <>
    <svg className="bg-drift-l"
      style={{ position:'absolute', top:'-5%', right:'-6%', width:'52%', pointerEvents:'none', opacity:0.13 }}
      viewBox="0 0 600 700" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="gc1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"   stopColor="#D4AF37" stopOpacity="0"/>
          <stop offset="45%"  stopColor="#D4AF37" stopOpacity="1"/>
          <stop offset="100%" stopColor="#D4AF37" stopOpacity="0"/>
        </linearGradient>
      </defs>
      <path d="M600,0 Q380,180 460,380 Q520,520 380,700" stroke="url(#gc1)" strokeWidth="1.4" fill="none"/>
      <path d="M570,0 Q355,200 435,395 Q495,535 355,700" stroke="url(#gc1)" strokeWidth="0.7" fill="none"/>
    </svg>
    <svg className="bg-drift-r"
      style={{ position:'absolute', bottom:'0%', left:'-4%', width:'42%', pointerEvents:'none', opacity:0.10 }}
      viewBox="0 0 500 600" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="gc2" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%"   stopColor="#D4AF37" stopOpacity="0"/>
          <stop offset="50%"  stopColor="#D4AF37" stopOpacity="1"/>
          <stop offset="100%" stopColor="#D4AF37" stopOpacity="0"/>
        </linearGradient>
      </defs>
      <path d="M0,600 Q140,420 60,230 Q10,100 120,0" stroke="url(#gc2)" strokeWidth="1.2" fill="none"/>
    </svg>
  </>
);

/* ─────────────────────────────────────────────
   Corner frame ornaments
───────────────────────────────────────────── */
const CornerFrames = () => {
  const sz = 48;
  const pos = [
    { top:16, left:16,   bt:'borderTop',    bl:'borderLeft'  },
    { top:16, right:16,  bt:'borderTop',    bl:'borderRight' },
    { bottom:16, left:16,  bt:'borderBottom', bl:'borderLeft'  },
    { bottom:16, right:16, bt:'borderBottom', bl:'borderRight' },
  ];
  return (
    <>
      {pos.map((p, i) => (
        <div key={i} style={{
          position: 'absolute',
          top: p.top, left: p.left, right: p.right, bottom: p.bottom,
          width: sz, height: sz,
          borderTop:    p.bt === 'borderTop'    ? '1px solid rgba(212,175,55,0.35)' : 'none',
          borderBottom: p.bt === 'borderBottom' ? '1px solid rgba(212,175,55,0.35)' : 'none',
          borderLeft:   p.bl === 'borderLeft'   ? '1px solid rgba(212,175,55,0.35)' : 'none',
          borderRight:  p.bl === 'borderRight'  ? '1px solid rgba(212,175,55,0.35)' : 'none',
          pointerEvents: 'none',
        }} />
      ))}
    </>
  );
};

/* ─────────────────────────────────────────────
   Microsoft icon
───────────────────────────────────────────── */
const MicrosoftIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" style={{ flexShrink:0 }}>
    <path fill="#F25022" d="M3 3h8v8H3z"/>
    <path fill="#7FBA00" d="M13 3h8v8h-8z"/>
    <path fill="#00A4EF" d="M3 13h8v8H3z"/>
    <path fill="#FFB900" d="M13 13h8v8h-8z"/>
  </svg>
);

/* ─────────────────────────────────────────────
   Shared style tokens
───────────────────────────────────────────── */
const GOLD      = '#D4AF37';
const GOLD_BR   = '#F5E6A3';
const GOLD_DIM  = 'rgba(212,175,55,0.7)';
const GOLD_MID  = 'rgba(212,175,55,0.5)';
const GOLD_LOW  = 'rgba(212,175,55,0.3)';
const WHITE_HI  = 'rgba(255,255,255,0.88)';
const WHITE_MID = 'rgba(255,255,255,0.62)';
const MUTED     = 'rgba(180,165,130,0.55)';

const goldText = {
  background: `linear-gradient(180deg, ${GOLD_BR} 0%, ${GOLD} 50%, #9c7022 100%)`,
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
};

/* ═══════════════════════════════════════════
   LoginScreen
═══════════════════════════════════════════ */
export default function LoginScreen() {
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(null);

  /* ── Auth — DO NOT MODIFY ── */
  const handleMicrosoftLogin = async () => {
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'azure',
      options: {
        redirectTo: window.location.origin,
        queryParams: { prompt: 'select_account' },
      },
    });
    if (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <div className="gex-root" style={{
      minHeight: '100vh',
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: `
        radial-gradient(ellipse 70% 55% at 50% 48%, rgba(212,175,55,0.07) 0%, transparent 65%),
        radial-gradient(ellipse 100% 50% at 50% 100%, rgba(212,175,55,0.05) 0%, transparent 60%),
        linear-gradient(165deg, #060c16 0%, #0b1627 38%, #07101e 65%, #030609 100%)
      `,
      position: 'relative',
      overflow: 'hidden',
      padding: '40px 24px',
    }}>
      <style>{STYLE}</style>

      {/* Background layers */}
      <CinematicBg />
      <GoldCurves />
      <CornerFrames />

      {/* Vignette */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(ellipse 85% 85% at 50% 50%, transparent 30%, rgba(0,0,0,0.65) 100%)',
      }} />

      {/* Center glow behind content */}
      <div style={{
        position: 'absolute', top:'50%', left:'50%',
        transform: 'translate(-50%, -55%)',
        width: 560, height: 560,
        background: 'radial-gradient(ellipse, rgba(212,175,55,0.06) 0%, transparent 68%)',
        pointerEvents: 'none',
      }} />

      {/* ══ TOP: Experience label + GOA EXPLORER ══ */}
      <div className="gex-s1" style={{ textAlign:'center', marginBottom: 6 }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:12, marginBottom:14 }}>
          <div style={{ width:32, height:'1px', background:`linear-gradient(90deg, transparent, ${GOLD_MID})` }}/>
          <span style={{
            fontFamily: "'Cinzel', serif",
            fontSize: 9,
            letterSpacing: '0.5em',
            color: GOLD_MID,
            textTransform: 'uppercase',
          }}>THE LEGACY CONTINUES</span>
          <div style={{ width:32, height:'1px', background:`linear-gradient(90deg, ${GOLD_MID}, transparent)` }}/>
        </div>

        <h1 style={{
          fontFamily: "'Cinzel', serif",
          fontSize: 'clamp(40px, 7vw, 72px)',
          fontWeight: 700,
          letterSpacing: '0.18em',
          ...goldText,
          lineHeight: 1,
          marginBottom: 14,
          textShadow: '0 2px 40px rgba(212,175,55,0.2)',
        }}>
          GOA EXPLORER
        </h1>

        <p style={{
          fontFamily: "'Cinzel', serif",
          fontSize: 'clamp(10px, 1.5vw, 13px)',
          letterSpacing: '0.45em',
          color: WHITE_HI,
          textTransform: 'uppercase',
          marginBottom: 10,
        }}>
          EXPLORE. COMPETE. LEAD.
        </p>

        {/* Shimmer divider */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:10, marginBottom:10 }}>
          <div style={{ flex:1, maxWidth:120, height:'1px', background:`linear-gradient(90deg, transparent, ${GOLD_LOW})` }}/>
          <div className="gex-shimmer" style={{ width:100, height:'1px' }} />
          <div style={{ flex:1, maxWidth:120, height:'1px', background:`linear-gradient(90deg, ${GOLD_LOW}, transparent)` }}/>
        </div>

        <p style={{
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          fontSize: 'clamp(12px, 1.6vw, 15px)',
          fontStyle: 'italic',
          letterSpacing: '0.06em',
          color: GOLD_DIM,
        }}>
          This is more than a game. This is MECCA.
        </p>
      </div>

      {/* ══ CENTER CARD ══ */}
      <div className="gex-card gex-s2" style={{
        position: 'relative',
        zIndex: 10,
        width: '100%',
        maxWidth: 480,
        marginTop: 28,
        padding: '38px 44px 34px',
        borderRadius: 14,
        background: 'linear-gradient(150deg, rgba(12,24,50,0.92) 0%, rgba(6,12,28,0.96) 100%)',
        border: `1px solid rgba(212,175,55,0.32)`,
        boxShadow: `
          0 28px 80px rgba(0,0,0,0.65),
          0 0 0 1px rgba(212,175,55,0.1),
          inset 0 1px 0 rgba(212,175,55,0.16)
        `,
        backdropFilter: 'blur(14px)',
        WebkitBackdropFilter: 'blur(14px)',
      }}>
        {/* Card top accent line */}
        <div style={{
          position:'absolute', top:0, left:'50%', transform:'translateX(-50%)',
          width:'55%', height:'1px',
          background:`linear-gradient(90deg, transparent, ${GOLD}, transparent)`,
          opacity: 0.6,
        }}/>

        {/* MECCA logo image */}
        <div className="gex-logo gex-s2" style={{ display:'flex', justifyContent:'center', marginBottom:16 }}>
          <img
            src="/mecca-logo1.png"
            alt="MECCA"
            style={{ width:90, height:'auto', objectFit:'contain' }}
          />
        </div>

        {/* MECCA wordmark */}
        <h2 className="gex-s3" style={{
          fontFamily: "'Cinzel', serif",
          fontSize: 'clamp(24px, 4vw, 34px)',
          fontWeight: 700,
          letterSpacing: '0.3em',
          ...goldText,
          textAlign: 'center',
          marginBottom: 6,
          lineHeight: 1,
        }}>
          MECCA
        </h2>

        <p className="gex-s3" style={{
          fontFamily: "'Cinzel', serif",
          fontSize: 9,
          letterSpacing: '0.3em',
          color: GOLD_DIM,
          textTransform: 'uppercase',
          textAlign: 'center',
          marginBottom: 18,
        }}>
          The Marketing Club of GIM
        </p>

        {/* THE OLDEST CLUB OF GIM */}
        <div className="gex-s3" style={{ display:'flex', alignItems:'center', gap:10, marginBottom:12, justifyContent:'center' }}>
          <div style={{ flex:1, height:'1px', background:`linear-gradient(90deg, transparent, ${GOLD_LOW})` }}/>
          <span style={{
            fontFamily: "'Cinzel', serif",
            fontSize: 8,
            letterSpacing: '0.32em',
            color: GOLD_MID,
            textTransform: 'uppercase',
            whiteSpace: 'nowrap',
          }}>THE OLDEST CLUB OF GIM</span>
          <div style={{ flex:1, height:'1px', background:`linear-gradient(90deg, ${GOLD_LOW}, transparent)` }}/>
        </div>

        <p className="gex-s3" style={{
          fontFamily: "'Cinzel', serif",
          fontSize: 10,
          letterSpacing: '0.28em',
          color: 'rgba(220,200,140,0.72)',
          textAlign: 'center',
          marginBottom: 8,
          textTransform: 'uppercase',
        }}>
          Legacy Beyond Years
        </p>

        {/* 1999 → ∞ */}
        <div className="gex-s3" style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:10, marginBottom:28 }}>
          <span style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: 20,
            fontWeight: 300,
            letterSpacing: '0.1em',
            color: GOLD_DIM,
          }}>1999</span>
          <svg width="52" height="12" viewBox="0 0 52 12">
            <line x1="0" y1="6" x2="40" y2="6" stroke={GOLD_MID} strokeWidth="1"/>
            <polygon points="36,3 44,6 36,9" fill={GOLD_MID}/>
          </svg>
          <span style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: 26,
            fontWeight: 300,
            color: GOLD_DIM,
            lineHeight: 1,
          }}>∞</span>
        </div>

        {/* Welcome Back label */}
        <div className="gex-s4" style={{ textAlign:'center', marginBottom:6 }}>
          <p style={{
            fontFamily: "'Cinzel', serif",
            fontSize: 10,
            letterSpacing: '0.42em',
            color: GOLD_MID,
            textTransform: 'uppercase',
            marginBottom: 10,
          }}>WELCOME BACK</p>
          <p style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: 13,
            fontWeight: 300,
            color: WHITE_MID,
            letterSpacing: '0.04em',
            marginBottom: 22,
          }}>
            Sign in to continue your adventure
          </p>
        </div>

        {/* Login button */}
        <button
          className="gex-btn gex-s4"
          onClick={handleMicrosoftLogin}
          disabled={loading}
          style={{
            width: '100%',
            padding: '16px 24px',
            borderRadius: 8,
            background: loading
              ? 'rgba(8,16,38,0.8)'
              : 'linear-gradient(135deg, rgba(20,38,82,0.97) 0%, rgba(10,18,46,1) 100%)',
            border: `1px solid rgba(212,175,55,${loading ? 0.25 : 0.5})`,
            cursor: loading ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 14,
            outline: 'none',
            marginBottom: 10,
          }}
        >
          {!loading && <MicrosoftIcon />}
          <span style={{
            fontFamily: "'Cinzel', serif",
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: '0.28em',
            color: loading ? GOLD_LOW : GOLD,
            textTransform: 'uppercase',
          }}>
            {loading ? 'Redirecting…' : 'Continue with GIM Account'}
          </span>
        </button>

        {error && (
          <p style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 12,
            color: 'rgba(239,68,68,0.85)',
            textAlign: 'center',
            marginTop: 10,
            letterSpacing: '0.03em',
          }}>
            {error}
          </p>
        )}

        {/* Footer note inside card */}
        <p style={{
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          fontSize: 11,
          fontWeight: 300,
          fontStyle: 'italic',
          color: MUTED,
          textAlign: 'center',
          marginTop: 18,
          letterSpacing: '0.04em',
          lineHeight: 1.6,
        }}>
          Exclusively for GIM Goa students<br/>
          <span style={{ fontSize:10, letterSpacing:'0.06em' }}>@gim.ac.in accounts only</span>
        </p>

        {/* Card bottom accent */}
        <div style={{
          position:'absolute', bottom:0, left:'50%', transform:'translateX(-50%)',
          width:'40%', height:'1px',
          background:`linear-gradient(90deg, transparent, rgba(212,175,55,0.28), transparent)`,
        }}/>
      </div>

      {/* ══ BOTTOM DIVIDER ══ */}
      <div className="gex-s4" style={{
        display:'flex', alignItems:'center', gap:12,
        marginTop: 32, width:'100%', maxWidth:480,
      }}>
        <div style={{ flex:1, height:'1px', background:`linear-gradient(90deg, transparent, ${GOLD_LOW})` }}/>
        <div style={{ width:4, height:4, borderRadius:'50%', background:GOLD_MID, boxShadow:`0 0 8px ${GOLD}` }}/>
        <div style={{ flex:1, height:'1px', background:`linear-gradient(90deg, ${GOLD_LOW}, transparent)` }}/>
      </div>

      {/* ══ PAGE FOOTER ══ */}
      <div className="gex-s4" style={{
        position: 'fixed',
        right: 24,
        bottom: 18,
        zIndex: 9999,
        pointerEvents: 'none',
        userSelect: 'none',
        fontFamily: "'Cinzel', serif",
        fontSize: 9,
        fontWeight: 600,
        letterSpacing: '0.22em',
        textTransform: 'uppercase',
        ...goldText,
        opacity: 0.8,
      }}>
        DESIGNED &amp; DEVELOPED BY • SWAPNIL GOEL
      </div>
    </div>
  );
}
