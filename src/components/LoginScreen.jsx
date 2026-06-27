import React, { useState } from 'react';
import { supabase } from '../lib/supabase';

const STYLE = `
  @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(14px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes btnPulse {
    0%, 100% { box-shadow: 0 0 0 1px rgba(212,175,55,0.5), 0 0 20px rgba(212,175,55,0.15); }
    50%       { box-shadow: 0 0 0 1px rgba(212,175,55,0.8), 0 0 36px rgba(212,175,55,0.28); }
  }
  @keyframes shimmer {
    0%   { background-position: -300% center; }
    100% { background-position:  300% center; }
  }

  .gex-root {
    font-family: 'Cinzel', Georgia, serif;
    min-height: 100vh;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: relative;
    overflow: hidden;
    background-image: url('/login-bg.jpg');
    background-size: cover;
    background-position: center center;
    background-repeat: no-repeat;
  }

  .gex-s1 { animation: fadeIn 0.9s cubic-bezier(0.16,1,0.3,1) 0.05s both; }
  .gex-s2 { animation: fadeIn 0.9s cubic-bezier(0.16,1,0.3,1) 0.2s  both; }
  .gex-s3 { animation: fadeIn 0.9s cubic-bezier(0.16,1,0.3,1) 0.35s both; }
  .gex-s4 { animation: fadeIn 0.9s cubic-bezier(0.16,1,0.3,1) 0.5s  both; }
  .gex-s5 { animation: fadeIn 0.9s cubic-bezier(0.16,1,0.3,1) 0.65s both; }

  .gex-btn {
    animation: btnPulse 3.5s ease-in-out infinite;
    transition: transform 0.18s ease, background 0.2s ease, box-shadow 0.2s ease;
    cursor: pointer;
  }
  .gex-btn:hover:not(:disabled) {
    transform: translateY(-2px);
    background: linear-gradient(90deg, rgba(212,175,55,0.22) 0%, rgba(212,175,55,0.18) 100%) !important;
  }
  .gex-btn:active:not(:disabled) {
    transform: translateY(0px);
  }
  .gex-shimmer {
    background: linear-gradient(90deg,
      transparent 0%, rgba(212,175,55,0.55) 30%,
      rgba(255,240,170,1) 50%, rgba(212,175,55,0.55) 70%, transparent 100%
    );
    background-size: 300% 100%;
    animation: shimmer 3.5s linear infinite;
  }
`;

const GOLD       = '#D4AF37';
const GOLD_BR    = '#F5E6A3';
const GOLD_DIM   = 'rgba(212,175,55,0.75)';
const GOLD_MID   = 'rgba(212,175,55,0.55)';
const GOLD_LOW   = 'rgba(212,175,55,0.3)';
const WHITE_HI   = 'rgba(255,255,255,0.92)';
const WHITE_MID  = 'rgba(220,210,190,0.72)';

const goldText = {
  background: `linear-gradient(180deg, ${GOLD_BR} 0%, ${GOLD} 55%, #a07820 100%)`,
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
};

const MicrosoftIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
    <path fill="#F25022" d="M3 3h8v8H3z"/>
    <path fill="#7FBA00" d="M13 3h8v8h-8z"/>
    <path fill="#00A4EF" d="M3 13h8v8H3z"/>
    <path fill="#FFB900" d="M13 13h8v8h-8z"/>
  </svg>
);

/* Corner ornaments */
const CornerFrames = () => {
  const corners = [
    { top: 18, left: 18,   borderTop: true,  borderLeft: true  },
    { top: 18, right: 18,  borderTop: true,  borderRight: true },
    { bottom: 18, left: 18,  borderBottom: true, borderLeft: true  },
    { bottom: 18, right: 18, borderBottom: true, borderRight: true },
  ];
  return (
    <>
      {corners.map((c, i) => (
        <div key={i} style={{
          position: 'absolute',
          top: c.top, left: c.left, right: c.right, bottom: c.bottom,
          width: 44, height: 44,
          borderTop:    c.borderTop    ? `1px solid ${GOLD_MID}` : 'none',
          borderBottom: c.borderBottom ? `1px solid ${GOLD_MID}` : 'none',
          borderLeft:   c.borderLeft   ? `1px solid ${GOLD_MID}` : 'none',
          borderRight:  c.borderRight  ? `1px solid ${GOLD_MID}` : 'none',
          pointerEvents: 'none',
          zIndex: 2,
        }}/>
      ))}
    </>
  );
};

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
    <div className="gex-root">
      <style>{STYLE}</style>

      {/* Dark overlay so background never kills readability */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none',
        background: 'linear-gradient(to bottom, rgba(4,8,16,0.62) 0%, rgba(4,8,18,0.52) 50%, rgba(4,8,16,0.72) 100%)',
      }}/>

      {/* Soft center radial glow */}
      <div style={{
        position: 'absolute', top: '50%', left: '50%', zIndex: 0, pointerEvents: 'none',
        transform: 'translate(-50%, -50%)',
        width: 700, height: 600,
        background: 'radial-gradient(ellipse, rgba(212,175,55,0.07) 0%, transparent 70%)',
      }}/>

      <CornerFrames />

      {/* ══════════════════════════════════
          MAIN CONTENT COLUMN
      ══════════════════════════════════ */}
      <div style={{
        position: 'relative', zIndex: 2,
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        width: '100%', padding: '32px 24px 80px',
        gap: 0,
      }}>

        {/* ── MECCA logo image ── */}
        <div className="gex-s1" style={{ marginBottom: 10 }}>
          <img
            src="/mecca-logo1.png"
            alt="MECCA"
            style={{ width: 80, height: 'auto', objectFit: 'contain',
              filter: 'drop-shadow(0 0 12px rgba(212,175,55,0.35))' }}
          />
        </div>

        {/* ── THE OLDEST CLUB OF GIM rule ── */}
        <div className="gex-s2" style={{
          display: 'flex', alignItems: 'center', gap: 10,
          width: '100%', maxWidth: 560, marginBottom: 10,
        }}>
          <div style={{ flex: 1, height: '1px', background: `linear-gradient(90deg, transparent, ${GOLD_MID})` }}/>
          <span style={{
            fontFamily: "'Cinzel', serif", fontSize: 10,
            letterSpacing: '0.32em', color: GOLD,
            textTransform: 'uppercase', whiteSpace: 'nowrap',
          }}>THE OLDEST CLUB OF GIM</span>
          <div style={{ flex: 1, height: '1px', background: `linear-gradient(90deg, ${GOLD_MID}, transparent)` }}/>
        </div>

        {/* LEGACY BEYOND YEARS */}
        <p className="gex-s2" style={{
          fontFamily: "'Cinzel', serif",
          fontSize: 11,
          letterSpacing: '0.3em',
          color: WHITE_MID,
          textTransform: 'uppercase',
          textAlign: 'center',
          marginBottom: 8,
        }}>
          LEGACY BEYOND YEARS
        </p>

        {/* 1999 → ∞ */}
        <div className="gex-s2" style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          gap: 10, marginBottom: 30,
        }}>
          <span style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: 22, fontWeight: 400,
            letterSpacing: '0.08em', color: GOLD_DIM,
          }}>1999</span>
          <svg width="60" height="14" viewBox="0 0 60 14">
            <line x1="0" y1="7" x2="46" y2="7" stroke={GOLD_MID} strokeWidth="1.2"/>
            <polygon points="42,4 52,7 42,10" fill={GOLD_MID}/>
          </svg>
          <span style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: 28, fontWeight: 300,
            color: GOLD_DIM, lineHeight: 1,
          }}>∞</span>
        </div>

        {/* ── BIG HERO TITLE: GOA EXPLORER ── */}
        <h2 className="gex-s3" style={{
          fontFamily: "'Cinzel', serif",
          fontSize: 'clamp(44px, 9vw, 80px)',
          fontWeight: 700,
          letterSpacing: '0.18em',
          ...goldText,
          textAlign: 'center',
          lineHeight: 1,
          marginBottom: 16,
          textShadow: '0 4px 40px rgba(212,175,55,0.25)',
        }}>
          GOA EXPLORER
        </h2>

        {/* EXPLORE. COMPETE. LEAD. */}
        <p className="gex-s3" style={{
          fontFamily: "'Cinzel', serif",
          fontSize: 'clamp(10px, 1.6vw, 13px)',
          letterSpacing: '0.45em',
          color: WHITE_HI,
          textTransform: 'uppercase',
          textAlign: 'center',
          marginBottom: 8,
        }}>
          EXPLORE. COMPETE. LEAD.
        </p>

        {/* Shimmer divider */}
        <div className="gex-s3" style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          gap: 10, width: '100%', maxWidth: 400, marginBottom: 8,
        }}>
          <div style={{ flex: 1, height: '1px', background: `linear-gradient(90deg, transparent, ${GOLD_LOW})` }}/>
          <div className="gex-shimmer" style={{ width: 80, height: '1px' }}/>
          <div style={{ flex: 1, height: '1px', background: `linear-gradient(90deg, ${GOLD_LOW}, transparent)` }}/>
        </div>

        {/* Italic tagline */}
        <p className="gex-s3" style={{
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          fontSize: 'clamp(13px, 1.8vw, 16px)',
          fontStyle: 'italic',
          letterSpacing: '0.06em',
          color: GOLD_DIM,
          textAlign: 'center',
          marginBottom: 32,
        }}>
          This is more than a game. This is MECCA.
        </p>

        {/* ══ CARD: Welcome Back ══ */}
        <div className="gex-s4" style={{
          width: '100%',
          maxWidth: 400,
          padding: '32px 36px 28px',
          borderRadius: 12,
          background: 'linear-gradient(145deg, rgba(10,18,40,0.82) 0%, rgba(5,10,22,0.88) 100%)',
          border: `1px solid rgba(212,175,55,0.38)`,
          boxShadow: `
            0 20px 70px rgba(0,0,0,0.6),
            0 0 0 1px rgba(212,175,55,0.08),
            inset 0 1px 0 rgba(212,175,55,0.14)
          `,
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          position: 'relative',
        }}>

          {/* Card top accent */}
          <div style={{
            position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
            width: '50%', height: '1px',
            background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)`,
            opacity: 0.65,
          }}/>

          {/* Welcome Back */}
          <p style={{
            fontFamily: "'Cinzel', serif",
            fontSize: 'clamp(16px, 2.2vw, 20px)',
            fontWeight: 600,
            letterSpacing: '0.12em',
            color: WHITE_HI,
            textAlign: 'center',
            marginBottom: 8,
          }}>
            Welcome Back
          </p>

          <p style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: 13,
            fontWeight: 300,
            letterSpacing: '0.04em',
            color: WHITE_MID,
            textAlign: 'center',
            marginBottom: 24,
          }}>
            Sign in to continue your adventure
          </p>

          {/* Login button */}
          <button
            className="gex-btn"
            onClick={handleMicrosoftLogin}
            disabled={loading}
            style={{
              width: '100%',
              padding: '15px 20px',
              borderRadius: 8,
              background: loading
                ? 'rgba(212,175,55,0.08)'
                : 'linear-gradient(90deg, rgba(212,175,55,0.16) 0%, rgba(212,175,55,0.12) 100%)',
              border: `1px solid ${loading ? GOLD_LOW : GOLD_DIM}`,
              cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 12,
              outline: 'none',
              marginBottom: 6,
            }}
          >
            {!loading && <MicrosoftIcon />}
            <span style={{
              fontFamily: "'Cinzel', serif",
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: '0.22em',
              color: loading ? GOLD_LOW : WHITE_HI,
              textTransform: 'uppercase',
            }}>
              {loading ? 'Redirecting…' : 'Continue with GIM Account'}
            </span>
          </button>

          {error && (
            <p style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 12,
              color: 'rgba(239,80,80,0.88)',
              textAlign: 'center',
              marginTop: 10,
              letterSpacing: '0.03em',
            }}>
              {error}
            </p>
          )}

          {/* Footer note */}
          <div style={{
            marginTop: 20,
            paddingTop: 16,
            borderTop: `1px solid rgba(212,175,55,0.14)`,
            textAlign: 'center',
          }}>
            {/* Shield icon */}
            <svg width="14" height="14" viewBox="0 0 24 24" style={{ marginBottom: 6, display:'block', margin:'0 auto 6px' }}>
              <path d="M12 2L3 6v6c0 5.25 3.75 10.15 9 11.35C17.25 22.15 21 17.25 21 12V6L12 2z"
                    fill="none" stroke={GOLD_MID} strokeWidth="1.5"/>
            </svg>
            <p style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: 11,
              fontWeight: 300,
              fontStyle: 'italic',
              color: 'rgba(180,165,130,0.6)',
              letterSpacing: '0.04em',
              lineHeight: 1.65,
            }}>
              Exclusively for GIM Goa students<br/>
              <span style={{ fontSize: 10, letterSpacing: '0.06em' }}>@gim.ac.in accounts only</span>
            </p>
          </div>

          {/* Card bottom accent */}
          <div style={{
            position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)',
            width: '35%', height: '1px',
            background: `linear-gradient(90deg, transparent, rgba(212,175,55,0.22), transparent)`,
          }}/>
        </div>

        {/* Bottom ornament */}
        <div className="gex-s5" style={{
          display: 'flex', alignItems: 'center', gap: 10,
          marginTop: 24, width: '100%', maxWidth: 320,
        }}>
          <div style={{ flex: 1, height: '1px', background: `linear-gradient(90deg, transparent, ${GOLD_LOW})` }}/>
          <div style={{ width: 4, height: 4, borderRadius: '50%', background: GOLD_MID,
            boxShadow: `0 0 8px ${GOLD}` }}/>
          <div style={{ flex: 1, height: '1px', background: `linear-gradient(90deg, ${GOLD_LOW}, transparent)` }}/>
        </div>
      </div>

      {/* ══ PAGE FOOTER ══ */}
      <div style={{
        position: 'fixed', right: 22, bottom: 16,
        zIndex: 9999, pointerEvents: 'none', userSelect: 'none',
        fontFamily: "'Cinzel', serif",
        fontSize: 9, fontWeight: 600,
        letterSpacing: '0.22em', textTransform: 'uppercase',
        ...goldText, opacity: 0.82,
      }}>
        DESIGNED &amp; DEVELOPED BY • SWAPNIL GOEL
      </div>
    </div>
  );
}
