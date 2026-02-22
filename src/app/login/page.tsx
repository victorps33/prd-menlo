'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    setLoading(false);

    if (authError) {
      setError(authError.message);
    } else {
      setSent(true);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--off)',
      }}
    >
      <div
        style={{
          background: '#fff',
          borderRadius: 16,
          padding: 40,
          width: '100%',
          maxWidth: 420,
          boxShadow: '0 4px 24px rgba(0,0,0,.08)',
          border: '1px solid var(--g2)',
        }}
      >
        <h1 style={{ fontSize: 20, fontWeight: 700, marginBottom: 4 }}>
          PRD Interativa — <span style={{ color: 'var(--orange)' }}>Menlo</span>
        </h1>
        <p style={{ fontSize: 12, color: 'var(--g5c)', marginBottom: 24 }}>
          Acesse com seu e-mail para visualizar e editar a PRD.
        </p>

        {sent ? (
          <div
            style={{
              background: '#f0fdf4',
              border: '1px solid #bbf7d0',
              borderRadius: 8,
              padding: 16,
              fontSize: 13,
              color: '#166534',
            }}
          >
            Link de acesso enviado para <strong>{email}</strong>. Verifique sua caixa de entrada.
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <label
              style={{
                display: 'block',
                fontSize: 11,
                fontWeight: 500,
                color: 'var(--g6)',
                marginBottom: 4,
              }}
            >
              E-mail
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              required
              style={{
                width: '100%',
                padding: '10px 14px',
                border: '1px solid var(--g2)',
                borderRadius: 8,
                fontSize: 13,
                fontFamily: 'inherit',
                outline: 'none',
                marginBottom: 16,
              }}
            />

            {error && (
              <p style={{ fontSize: 12, color: '#ef4444', marginBottom: 12 }}>{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '10px 20px',
                borderRadius: 8,
                border: 'none',
                background: loading ? 'var(--g3)' : 'var(--orange)',
                color: '#fff',
                fontSize: 13,
                fontWeight: 600,
                cursor: loading ? 'not-allowed' : 'pointer',
                fontFamily: 'inherit',
              }}
            >
              {loading ? 'Enviando...' : 'Enviar link de acesso'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
