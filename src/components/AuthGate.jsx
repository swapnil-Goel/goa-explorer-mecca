import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import LoginScreen from './LoginScreen';

export default function AuthGate({ children }) {
  const [session, setSession] = useState(undefined); // undefined = loading
  const [domainError, setDomainError] = useState(false);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      handleSession(session);
    });

    // Listen for auth changes (e.g. after OAuth redirect)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      handleSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSession = async (session) => {
    if (!session) {
      setSession(null);
      setDomainError(false);
      return;
    }

    const email = session.user?.email ?? '';
    if (!email.endsWith('@gim.ac.in')) {
      // Not a GIM student — sign out immediately
      await supabase.auth.signOut();
      setSession(null);
      setDomainError(true);
      return;
    }

    setDomainError(false);
    setSession(session);
  };

  // Loading state
  if (session === undefined) {
    return (
      <div
        style={{
          minHeight: '100vh',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#020810',
        }}
      >
        <div
          style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            border: '2px solid rgba(251,191,36,0.15)',
            borderTop: '2px solid rgba(251,191,36,0.7)',
            animation: 'spin 0.8s linear infinite',
          }}
        />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  // Not logged in
  if (!session) {
    return (
      <>
        <LoginScreen />
        {domainError && (
          <div
            style={{
              position: 'fixed',
              bottom: '32px',
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 9999,
              padding: '14px 28px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, rgba(15,31,61,0.98), rgba(7,15,30,0.99))',
              border: '1px solid rgba(239,68,68,0.4)',
              boxShadow: '0 4px 24px rgba(0,0,0,0.6)',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            }}
          >
            <span style={{ fontSize: '16px' }}>⚠️</span>
            <p
              style={{
                fontFamily: 'Cinzel, Georgia, serif',
                fontSize: '12px',
                letterSpacing: '0.1em',
                color: 'rgba(239,68,68,0.9)',
                margin: 0,
                whiteSpace: 'nowrap',
              }}
            >
              Only GIM students can participate.
            </p>
          </div>
        )}
      </>
    );
  }

  // Valid GIM session — render the app
  return children;
}
