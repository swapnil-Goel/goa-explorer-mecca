import React, { useState } from 'react';
import { supabase } from '../lib/supabase';

const CompassRoseSVG = () => (
  <svg width="48" height="48" viewBox="0 0 40 40" fill="none">
    <circle cx="20" cy="20" r="18" stroke="#d97706" strokeWidth="0.8" strokeDasharray="2 2" />
    <circle cx="20" cy="20" r="12" stroke="#d97706" strokeWidth="0.5" />
    <polygon points="20,4 22,18 20,20 18,18" fill="#fbbf24" />
    <polygon points="20,36 22,22 20,20 18,22" fill="#d97706" />
    <polygon points="4,20 18,18 20,20 18,22" fill="#d97706" />
    <polygon points="36,20 22,18 20,20 22,22" fill="#fbbf24" />
    <circle cx="20" cy="20" r="2.5" fill="#fbbf24" />
    <text x="20" y="2.5" fill="#d97706" fontSize="3" textAnchor="middle" fontFamily="serif">N</text>
  </svg>
);

export default function LoginScreen() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleMicrosoftLogin = async () => {
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.signInWithOAuth({
  provider: 'azure',
  options: {
    redirectTo: window.location.origin,
    queryParams: {
      prompt: 'select_account',
    },
  },
});
    if (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(160deg, #020810 0%, #030d1f 40%, #050c1a 70%, #020810 100%)',
        position: 'relative',
        overflow: 'hidden',
        fontFamily: 'sans-serif',
      }}
    >
      {/* Subtle radial glow behind content */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -60%)',
          width: '600px',
          height: '600px',
          background: 'radial-gradient(ellipse, rgba(251,191,36,0.05) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      {/* Corner ornaments */}
      {['top-4 left-4', 'top-4 right-4', 'bottom-4 left-4', 'bottom-4 right-4'].map((pos, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            [pos.split(' ')[0].replace('top', 'top').replace('bottom', 'bottom')]: '16px',
            [pos.split(' ')[1].replace('left', 'left').replace('right', 'right')]: '16px',
            width: '40px',
            height: '40px',
            borderTop: i < 2 ? '1px solid rgba(251,191,36,0.25)' : 'none',
            borderBottom: i >= 2 ? '1px solid rgba(251,191,36,0.25)' : 'none',
            borderLeft: i % 2 === 0 ? '1px solid rgba(251,191,36,0.25)' : 'none',
            borderRight: i % 2 === 1 ? '1px solid rgba(251,191,36,0.25)' : 'none',
          }}
        />
      ))}

      {/* Main card */}
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          width: '100%',
          maxWidth: '440px',
          padding: '0 24px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0',
        }}
      >
        {/* Compass */}
        <div style={{ marginBottom: '28px', opacity: 0.9 }}>
          <CompassRoseSVG />
        </div>

        {/* MECCA wordmark */}
        <p
          style={{
            fontFamily: 'Cinzel, Georgia, serif',
            fontSize: '11px',
            letterSpacing: '0.5em',
            color: 'rgba(251,191,36,0.6)',
            textTransform: 'uppercase',
            marginBottom: '6px',
            textAlign: 'center',
          }}
        >
          MECCA presents
        </p>
        <h1
          style={{
            fontFamily: 'Cinzel, Georgia, serif',
            fontSize: 'clamp(38px, 10vw, 56px)',
            fontWeight: '700',
            letterSpacing: '0.18em',
            background: 'linear-gradient(180deg, #fde68a 0%, #fbbf24 45%, #d97706 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            lineHeight: 1,
            marginBottom: '4px',
            textAlign: 'center',
          }}
        >
          GOA
        </h1>
        <h2
          style={{
            fontFamily: 'Cinzel, Georgia, serif',
            fontSize: 'clamp(13px, 3.5vw, 17px)',
            fontWeight: '400',
            letterSpacing: '0.55em',
            color: 'rgba(251,191,36,0.75)',
            textTransform: 'uppercase',
            marginBottom: '8px',
            textAlign: 'center',
          }}
        >
          EXPLORER
        </h2>

        {/* Thin gold rule */}
        <div
          style={{
            width: '180px',
            height: '1px',
            background: 'linear-gradient(90deg, transparent, rgba(251,191,36,0.5), transparent)',
            margin: '18px auto',
          }}
        />

        {/* Taglines */}
        <p
          style={{
            fontFamily: 'Cinzel, Georgia, serif',
            fontSize: '13px',
            letterSpacing: '0.12em',
            color: 'rgba(255,255,255,0.75)',
            textAlign: 'center',
            marginBottom: '4px',
          }}
        >
          Find the Place.
        </p>
        <p
          style={{
            fontFamily: 'Cinzel, Georgia, serif',
            fontSize: '13px',
            letterSpacing: '0.12em',
            color: 'rgba(255,255,255,0.75)',
            textAlign: 'center',
            marginBottom: '32px',
          }}
        >
          Unlock the Reward.
        </p>

        {/* How-it-works card */}
        <div
          style={{
            width: '100%',
            padding: '20px 24px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, rgba(15,31,61,0.9) 0%, rgba(7,15,30,0.95) 100%)',
            border: '1px solid rgba(251,191,36,0.2)',
            marginBottom: '28px',
          }}
        >
          <p
            style={{
              fontFamily: 'Cinzel, Georgia, serif',
              fontSize: '9px',
              letterSpacing: '0.4em',
              color: 'rgba(251,191,36,0.55)',
              textTransform: 'uppercase',
              marginBottom: '14px',
              textAlign: 'center',
            }}
          >
            How It Works
          </p>
          {[
            'Solve 3 consecutive questions correctly.',
            'Unlock one exclusive coupon.',
            'One coupon per GIM student.',
          ].map((rule, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '10px',
                marginBottom: i < 2 ? '10px' : '0',
              }}
            >
              <span
                style={{
                  flexShrink: 0,
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  border: '1px solid rgba(251,191,36,0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '9px',
                  fontFamily: 'Cinzel, Georgia, serif',
                  color: '#fbbf24',
                  marginTop: '1px',
                }}
              >
                {i + 1}
              </span>
              <p
                style={{
                  fontFamily: 'Lora, Georgia, serif',
                  fontSize: '12px',
                  color: 'rgba(209,213,219,0.85)',
                  lineHeight: '1.5',
                  margin: 0,
                }}
              >
                {rule}
              </p>
            </div>
          ))}
        </div>

        {/* Google button */}
        <button
          onClick={handleMicrosoftLogin}
          disabled={loading}
          style={{
            width: '100%',
            padding: '15px 24px',
            borderRadius: '8px',
            background: loading
              ? 'rgba(15,31,61,0.6)'
              : 'linear-gradient(135deg, rgba(20,40,80,0.95) 0%, rgba(10,20,50,0.98) 100%)',
            border: '1px solid rgba(251,191,36,0.45)',
            boxShadow: loading ? 'none' : '0 0 24px rgba(251,191,36,0.1), inset 0 1px 0 rgba(251,191,36,0.1)',
            cursor: loading ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            transition: 'all 0.2s ease',
            marginBottom: '16px',
          }}
          onMouseEnter={e => {
            if (!loading) {
              e.currentTarget.style.boxShadow = '0 0 32px rgba(251,191,36,0.18), inset 0 1px 0 rgba(251,191,36,0.15)';
              e.currentTarget.style.border = '1px solid rgba(251,191,36,0.65)';
            }
          }}
          onMouseLeave={e => {
            e.currentTarget.style.boxShadow = '0 0 24px rgba(251,191,36,0.1), inset 0 1px 0 rgba(251,191,36,0.1)';
            e.currentTarget.style.border = '1px solid rgba(251,191,36,0.45)';
          }}
        >
          {/* Google G icon */}
          {!loading && (
            <svg width="18" height="18" viewBox="0 0 18 18">
              <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"/>
              <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z"/>
              <path fill="#FBBC05" d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"/>
              <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"/>
            </svg>
          )}
          <span
            style={{
              fontFamily: 'Cinzel, Georgia, serif',
              fontSize: '12px',
              letterSpacing: '0.25em',
              color: loading ? 'rgba(251,191,36,0.4)' : 'rgba(251,191,36,0.9)',
              textTransform: 'uppercase',
            }}
          >
            {loading ? 'Redirecting…' : 'Continue with GIM Account'}
          </span>
        </button>

        {error && (
          <p
            style={{
              fontFamily: 'Lora, Georgia, serif',
              fontSize: '12px',
              color: 'rgba(239,68,68,0.8)',
              textAlign: 'center',
              marginTop: '8px',
            }}
          >
            {error}
          </p>
        )}

        {/* Footer note */}
        <p
          style={{
            fontFamily: 'Lora, Georgia, serif',
            fontSize: '10px',
            color: 'rgba(107,114,128,0.7)',
            textAlign: 'center',
            marginTop: '20px',
            letterSpacing: '0.03em',
            fontStyle: 'italic',
          }}
        >
          Exclusively for GIM Goa students • @gim.ac.in accounts only
        </p>
      </div>
    </div>
  );
}
