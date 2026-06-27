import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

/* ─────────────────────────────────────────────
   MECCA Logo (inline SVG — matches red-burst
   logo mark in the reference image)
───────────────────────────────────────────── */
const MeccaLogo = () => (
  <svg width="72" height="72" viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Outer ring */}
    <circle cx="36" cy="36" r="34" stroke="#C9A84C" strokeWidth="0.6" strokeDasharray="3 3" opacity="0.4" />
    {/* Burst petals */}
    {Array.from({ length: 16 }).map((_, i) => {
      const angle = (i * 360) / 16;
      const rad = (angle * Math.PI) / 180;
      const x1 = 36 + 12 * Math.cos(rad);
      const y1 = 36 + 12 * Math.sin(rad);
      const x2 = 36 + 28 * Math.cos(rad);
      const y2 = 36 + 28 * Math.sin(rad);
      const isLong = i % 2 === 0;
      return (
        <line
          key={i}
          x1={x1} y1={y1}
          x2={isLong ? x2 : 36 + 21 * Math.cos(rad)}
          y2={isLong ? y2 : 36 + 21 * Math.sin(rad)}
          stroke={isLong ? '#C0392B' : '#E74C3C'}
          strokeWidth={isLong ? 2.2 : 1.4}
          strokeLinecap="round"
          opacity={isLong ? 1 : 0.7}
        />
      );
    })}
    {/* Center dot */}
    <circle cx="36" cy="36" r="5" fill="#C9A84C" opacity="0.9" />
    <circle cx="36" cy="36" r="2.5" fill="#fff" opacity="0.85" />
  </svg>
);

/* ─────────────────────────────────────────────
   Inline keyframes injected once
───────────────────────────────────────────── */
const STYLE = `
  @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700&family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300&display=swap');

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(18px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes floatLogo {
    0%, 100% { transform: translateY(0px);   }
    50%       { transform: translateY(-5px);  }
  }
  @keyframes pulseGlow {
    0%, 100% { box-shadow: 0 0 32px rgba(201,168,76,0.12), inset 0 1px 0 rgba(201,168,76,0.1); }
    50%       { box-shadow: 0 0 52px rgba(201,168,76,0.22), inset 0 1px 0 rgba(201,168,76,0.18); }
  }
  @keyframes shimmerLine {
    0%   { background-position: -200% center; }
    100% { background-position:  200% center; }
  }
  @keyframes subtleDrift {
    0%, 100% { opacity: 0.18; transform: translateY(0px) scaleX(1); }
    50%       { opacity: 0.26; transform: translateY(-8px) scaleX(1.02); }
  }

  .login-root * { box-sizing: border-box; }

  .login-card {
    animation: fadeUp 0.9s cubic-bezier(0.16,1,0.3,1) 0.15s both;
  }
  .logo-wrap {
    animation: floatLogo 6s ease-in-out infinite;
  }
  .login-btn {
    transition: border-color 0.25s ease, box-shadow 0.25s ease, background 0.25s ease, transform 0.15s ease;
    animation: pulseGlow 4s ease-in-out infinite;
  }
  .login-btn:hover:not(:disabled) {
    border-color: rgba(201,168,76,0.85) !important;
    box-shadow: 0 0 60px rgba(201,168,76,0.28), 0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(201,168,76,0.2) !important;
    transform: translateY(-1px);
  }
  .login-btn:active:not(:disabled) {
    transform: translateY(0px);
    box-shadow: 0 0 24px rgba(201,168,76,0.14), inset 0 1px 0 rgba(201,168,76,0.1) !important;
  }
  .shimmer-rule {
    background: linear-gradient(90deg, transparent 0%, rgba(201,168,76,0.6) 30%, rgba(255,236,160,0.9) 50%, rgba(201,168,76,0.6) 70%, transparent 100%);
    background-size: 200% 100%;
    animation: shimmerLine 3.5s linear infinite;
  }
  .gold-line-drift {
    animation: subtleDrift 9s ease-in-out infinite;
  }
  .gold-line-drift-2 {
    animation: subtleDrift 12s ease-in-out infinite reverse;
  }
  .stagger-1 { animation: fadeUp 0.9s cubic-bezier(0.16,1,0.3,1) 0.3s both; }
  .stagger-2 { animation: fadeUp 0.9s cubic-bezier(0.16,1,0.3,1) 0.45s both; }
  .stagger-3 { animation: fadeUp 0.9s cubic-bezier(0.16,1,0.3,1) 0.6s both; }
`;

/* ─────────────────────────────────────────────
   CSS-only Goa skyline silhouette (SVG bg)
───────────────────────────────────────────── */
const SkylineBg = () => (
  <svg
    style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: '38%', pointerEvents: 'none' }}
    viewBox="0 0 1440 280"
    preserveAspectRatio="xMidYMax slice"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Portuguese church silhouette left */}
    <path
      d="M60,280 L60,160 L70,160 L70,130 L80,110 L90,130 L90,100 L95,85 L100,100 L100,130 L110,130 L110,160 L120,160 L120,280 Z"
      fill="rgba(201,168,76,0.06)"
    />
    {/* Bell tower */}
    <path
      d="M92,85 L95,60 L98,85 Z"
      fill="rgba(201,168,76,0.08)"
    />
    {/* Cross */}
    <line x1="95" y1="55" x2="95" y2="42" stroke="rgba(201,168,76,0.1)" strokeWidth="1.5" />
    <line x1="90" y1="48" x2="100" y2="48" stroke="rgba(201,168,76,0.1)" strokeWidth="1.5" />

    {/* Palm trees right */}
    <line x1="1300" y1="280" x2="1300" y2="180" stroke="rgba(201,168,76,0.08)" strokeWidth="3" strokeLinecap="round" />
    <path d="M1300,180 Q1275,165 1260,155 Q1270,170 1290,175 Q1280,165 1282,158 Q1295,168 1300,180" fill="rgba(201,168,76,0.07)" />
    <path d="M1300,180 Q1325,165 1340,155 Q1330,170 1310,175 Q1320,165 1318,158 Q1305,168 1300,180" fill="rgba(201,168,76,0.07)" />

    <line x1="1360" y1="280" x2="1360" y2="200" stroke="rgba(201,168,76,0.06)" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M1360,200 Q1340,187 1328,178 Q1337,191 1353,195 Q1343,186 1345,180 Q1356,189 1360,200" fill="rgba(201,168,76,0.05)" />
    <path d="M1360,200 Q1380,187 1392,178 Q1383,191 1367,195 Q1377,186 1375,180 Q1364,189 1360,200" fill="rgba(201,168,76,0.05)" />

    {/* Sailboat */}
    <path d="M680,255 L690,255 L685,210 Z" fill="rgba(201,168,76,0.06)" />
    <path d="M685,210 L695,255 L675,255 Z" fill="rgba(201,168,76,0.04)" />
    <line x1="685" y1="255" x2="685" y2="270" stroke="rgba(201,168,76,0.07)" strokeWidth="1" />
    <ellipse cx="685" cy="270" rx="18" ry="3" fill="rgba(201,168,76,0.04)" />

    {/* Horizon water shimmer */}
    <path
      d="M0,265 Q180,258 360,265 Q540,272 720,265 Q900,258 1080,265 Q1260,272 1440,265 L1440,280 L0,280 Z"
      fill="rgba(201,168,76,0.04)"
    />
  </svg>
);

/* ─────────────────────────────────────────────
   Curved gold lines (purely decorative)
───────────────────────────────────────────── */
const GoldCurves = () => (
  <>
    <svg
      className="gold-line-drift"
      style={{ position: 'absolute', top: '-10%', right: '-8%', width: '55%', pointerEvents: 'none', opacity: 0.18 }}
      viewBox="0 0 600 600"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M600,0 Q400,200 500,400 Q550,500 400,600" stroke="url(#goldGrad1)" strokeWidth="1.5" fill="none" />
      <path d="M580,0 Q380,220 480,420 Q530,520 380,600" stroke="url(#goldGrad1)" strokeWidth="0.8" fill="none" />
      <defs>
        <linearGradient id="goldGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#C9A84C" stopOpacity="0" />
          <stop offset="40%" stopColor="#C9A84C" stopOpacity="1" />
          <stop offset="100%" stopColor="#C9A84C" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>

    <svg
      className="gold-line-drift-2"
      style={{ position: 'absolute', bottom: '5%', left: '-5%', width: '45%', pointerEvents: 'none', opacity: 0.14 }}
      viewBox="0 0 500 500"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M0,500 Q150,300 50,150 Q0,50 100,0" stroke="url(#goldGrad2)" strokeWidth="1.2" fill="none" />
      <defs>
        <linearGradient id="goldGrad2" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#C9A84C" stopOpacity="0" />
          <stop offset="50%" stopColor="#C9A84C" stopOpacity="1" />
          <stop offset="100%" stopColor="#C9A84C" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  </>
);

/* ─────────────────────────────────────────────
   Corner ornaments
───────────────────────────────────────────── */
const corners = [
  { top: 16, left: 16,   borderTop: true,  borderLeft: true  },
  { top: 16, right: 16,  borderTop: true,  borderRight: true },
  { bottom: 16, left: 16,  borderBottom: true, borderLeft: true  },
  { bottom: 16, right: 16, borderBottom: true, borderRight: true },
];
const CornerOrnaments = () => (
  <>
    {corners.map((c, i) => (
      <div
        key={i}
        style={{
          position: 'absolute',
          top: c.top, left: c.left, right: c.right, bottom: c.bottom,
          width: 44, height: 44,
          borderTop:    c.borderTop    ? '1px solid rgba(201,168,76,0.3)' : 'none',
          borderBottom: c.borderBottom ? '1px solid rgba(201,168,76,0.3)' : 'none',
          borderLeft:   c.borderLeft   ? '1px solid rgba(201,168,76,0.3)' : 'none',
          borderRight:  c.borderRight  ? '1px solid rgba(201,168,76,0.3)' : 'none',
          pointerEvents: 'none',
        }}
      />
    ))}
  </>
);

/* ─────────────────────────────────────────────
   Google "G" icon
───────────────────────────────────────────── */
const GoogleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 18 18" style={{ flexShrink: 0 }}>
    <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"/>
    <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z"/>
    <path fill="#FBBC05" d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"/>
    <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"/>
  </svg>
);

/* ═══════════════════════════════════════════
   Main Component
═══════════════════════════════════════════ */
export default function LoginScreen() {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  /* ── Auth handler — unchanged ── */
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
    <div
      className="login-root"
      style={{
        minHeight: '100vh',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: `
          radial-gradient(ellipse 80% 60% at 50% 0%,   rgba(201,168,76,0.07) 0%, transparent 60%),
          radial-gradient(ellipse 60% 40% at 80% 80%,  rgba(201,168,76,0.04) 0%, transparent 55%),
          linear-gradient(170deg, #06080f 0%, #0b1220 35%, #080e1c 65%, #040609 100%)
        `,
        position: 'relative',
        overflow: 'hidden',
        fontFamily: "'Cinzel', 'Georgia', serif",
      }}
    >
      {/* Inject keyframes */}
      <style>{STYLE}</style>

      {/* Decorative layers */}
      <GoldCurves />
      <SkylineBg />
      <CornerOrnaments />

      {/* Vignette overlay */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(ellipse 90% 90% at 50% 50%, transparent 40%, rgba(0,0,0,0.55) 100%)',
      }} />

      {/* ── LOGO SECTION ── */}
      <div className="stagger-1" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 36 }}>
        <div className="logo-wrap" style={{ marginBottom: 20 }}>
          <MeccaLogo />
        </div>

        {/* MECCA wordmark */}
        <h1 style={{
          fontFamily: "'Cinzel', 'Georgia', serif",
          fontSize: 'clamp(28px, 7vw, 42px)',
          fontWeight: 700,
          letterSpacing: '0.32em',
          background: 'linear-gradient(180deg, #f5e6a3 0%, #C9A84C 50%, #9c7a2a 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          margin: '0 0 6px',
          textAlign: 'center',
          lineHeight: 1,
        }}>
          MECCA
        </h1>

        <p style={{
          fontFamily: "'Cinzel', 'Georgia', serif",
          fontSize: 10,
          letterSpacing: '0.3em',
          color: 'rgba(201,168,76,0.65)',
          textTransform: 'uppercase',
          margin: '0 0 18px',
          textAlign: 'center',
        }}>
          THE MARKETING CLUB OF GIM
        </p>

        {/* Thin rule with dots */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
          <div style={{ width: 40, height: '1px', background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.45))' }} />
          <span style={{ fontFamily: "'Cinzel', serif", fontSize: 8, letterSpacing: '0.35em', color: 'rgba(201,168,76,0.5)', textTransform: 'uppercase' }}>
            THE OLDEST CLUB OF GIM
          </span>
          <div style={{ width: 40, height: '1px', background: 'linear-gradient(90deg, rgba(201,168,76,0.45), transparent)' }} />
        </div>

        <p style={{
          fontFamily: "'Cinzel', 'Georgia', serif",
          fontSize: 11,
          letterSpacing: '0.25em',
          color: 'rgba(220,200,140,0.6)',
          margin: '0 0 8px',
          textAlign: 'center',
        }}>
          LEGACY BEYOND YEARS
        </p>

        {/* 1999 → ∞ */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{
            fontFamily: "'Cormorant Garamond', 'Georgia', serif",
            fontSize: 18,
            fontWeight: 300,
            letterSpacing: '0.12em',
            color: 'rgba(201,168,76,0.75)',
          }}>1999</span>
          <svg width="48" height="10" viewBox="0 0 48 10">
            <line x1="0" y1="5" x2="36" y2="5" stroke="rgba(201,168,76,0.55)" strokeWidth="1" />
            <polygon points="32,2 40,5 32,8" fill="rgba(201,168,76,0.55)" />
          </svg>
          <span style={{
            fontFamily: "'Cormorant Garamond', 'Georgia', serif",
            fontSize: 22,
            fontWeight: 300,
            color: 'rgba(201,168,76,0.75)',
            lineHeight: 1,
          }}>∞</span>
        </div>
      </div>

      {/* ── MAIN GLASS CARD ── */}
      <div
        className="login-card"
        style={{
          position: 'relative',
          zIndex: 10,
          width: '100%',
          maxWidth: 460,
          margin: '0 24px',
          padding: '40px 40px 36px',
          borderRadius: 16,
          background: 'linear-gradient(145deg, rgba(14,26,52,0.88) 0%, rgba(6,12,26,0.94) 100%)',
          border: '1px solid rgba(201,168,76,0.28)',
          boxShadow: '0 24px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(201,168,76,0.08), inset 0 1px 0 rgba(201,168,76,0.12)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
        }}
      >
        {/* Card inner top accent */}
        <div style={{
          position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
          width: '60%', height: '1px',
          background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.55), transparent)',
        }} />

        {/* EXPERIENCE label */}
        <p className="stagger-2" style={{
          fontFamily: "'Cinzel', serif",
          fontSize: 9,
          letterSpacing: '0.5em',
          color: 'rgba(201,168,76,0.5)',
          textTransform: 'uppercase',
          textAlign: 'center',
          margin: '0 0 10px',
        }}>
          EXPERIENCE
        </p>

        {/* GOA EXPLORER */}
        <h2 className="stagger-2" style={{
          fontFamily: "'Cinzel', serif",
          fontSize: 'clamp(26px, 6vw, 38px)',
          fontWeight: 700,
          letterSpacing: '0.14em',
          background: 'linear-gradient(180deg, #f5e6a3 0%, #C9A84C 55%, #8a6620 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          textAlign: 'center',
          margin: '0 0 4px',
          lineHeight: 1.1,
        }}>
          GOA EXPLORER
        </h2>

        {/* Shimmer divider */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, margin: '18px 0' }}>
          <div style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.3))' }} />
          <div style={{ width: 5, height: 5, borderRadius: '50%', background: 'rgba(201,168,76,0.5)', boxShadow: '0 0 6px rgba(201,168,76,0.6)' }} />
          <div className="shimmer-rule" style={{ width: 80, height: '1px' }} />
          <div style={{ width: 5, height: 5, borderRadius: '50%', background: 'rgba(201,168,76,0.5)', boxShadow: '0 0 6px rgba(201,168,76,0.6)' }} />
          <div style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg, rgba(201,168,76,0.3), transparent)' }} />
        </div>

        {/* Premium copy */}
        <div className="stagger-2" style={{ marginBottom: 30, textAlign: 'center' }}>
          <p style={{
            fontFamily: "'Cormorant Garamond', 'Georgia', serif",
            fontSize: 15,
            fontWeight: 300,
            fontStyle: 'italic',
            letterSpacing: '0.06em',
            color: 'rgba(255,255,255,0.78)',
            margin: '0 0 6px',
            lineHeight: 1.6,
          }}>
            Explore. Compete. Lead.
          </p>
          <p style={{
            fontFamily: "'Cormorant Garamond', 'Georgia', serif",
            fontSize: 13,
            fontWeight: 300,
            letterSpacing: '0.04em',
            color: 'rgba(201,168,76,0.6)',
            margin: 0,
            lineHeight: 1.6,
          }}>
            This is more than a game. This is MECCA.
          </p>
        </div>

        {/* Login button */}
        <button
          className="login-btn stagger-3"
          onClick={handleMicrosoftLogin}
          disabled={loading}
          style={{
            width: '100%',
            padding: '16px 24px',
            borderRadius: 10,
            background: loading
              ? 'rgba(10,20,42,0.7)'
              : 'linear-gradient(135deg, rgba(22,42,88,0.96) 0%, rgba(10,18,44,0.98) 100%)',
            border: '1px solid rgba(201,168,76,0.48)',
            cursor: loading ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 14,
            outline: 'none',
            marginBottom: 10,
          }}
        >
          {!loading && <GoogleIcon />}
          <span style={{
            fontFamily: "'Cinzel', serif",
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: '0.28em',
            color: loading ? 'rgba(201,168,76,0.35)' : 'rgba(201,168,76,0.92)',
            textTransform: 'uppercase',
          }}>
            {loading ? 'Redirecting…' : 'Continue with GIM Account'}
          </span>
        </button>

        {error && (
          <p style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 12,
            color: 'rgba(239,68,68,0.82)',
            textAlign: 'center',
            margin: '10px 0 0',
            letterSpacing: '0.03em',
          }}>
            {error}
          </p>
        )}

        {/* Footer */}
        <p style={{
          fontFamily: "'Cormorant Garamond', 'Georgia', serif",
          fontSize: 11,
          fontWeight: 300,
          fontStyle: 'italic',
          color: 'rgba(107,114,128,0.65)',
          textAlign: 'center',
          margin: '20px 0 0',
          letterSpacing: '0.04em',
          lineHeight: 1.6,
        }}>
          Exclusively for GIM Goa students<br />
          <span style={{ fontSize: 10, letterSpacing: '0.06em' }}>@gim.ac.in accounts only</span>
        </p>

        {/* Card inner bottom accent */}
        <div style={{
          position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)',
          width: '40%', height: '1px',
          background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.25), transparent)',
        }} />
      </div>

       {/* Creator Signature */}
<div
  style={{
    position: "fixed",
    right: "20px",
    bottom: "16px",
    zIndex: 9999,
    pointerEvents: "none",
    fontFamily: "Cinzel",
    fontSize: "9px",
    letterSpacing: "0.28em",
    textTransform: "uppercase",
    color: "rgba(212,175,55,0.32)",
    opacity: 0.8,
    userSelect: "none",
  }}
>
  MADE BY • SWAPNIL GOEL
</div>
       
    </div>
  );
}
