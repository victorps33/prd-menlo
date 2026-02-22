'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
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
          maxWidth: 480,
          textAlign: 'center',
          boxShadow: '0 4px 24px rgba(0,0,0,.08)',
          border: '1px solid var(--g2)',
        }}
      >
        <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>
          Algo deu errado
        </h2>
        <p style={{ fontSize: 13, color: 'var(--g5c)', marginBottom: 20 }}>
          {error.message || 'Ocorreu um erro ao carregar a PRD.'}
        </p>
        <button
          onClick={reset}
          style={{
            padding: '8px 20px',
            borderRadius: 8,
            border: 'none',
            background: 'var(--orange)',
            color: '#fff',
            fontSize: 13,
            fontWeight: 600,
            cursor: 'pointer',
            fontFamily: 'inherit',
          }}
        >
          Tentar novamente
        </button>
      </div>
    </div>
  );
}
