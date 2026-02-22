export default function Loading() {
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
      <div style={{ textAlign: 'center' }}>
        <div
          style={{
            width: 32,
            height: 32,
            border: '3px solid var(--g2)',
            borderTopColor: 'var(--orange)',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
            margin: '0 auto 12px',
          }}
        />
        <p style={{ fontSize: 13, color: 'var(--g5c)' }}>Carregando PRD...</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
      </div>
    </div>
  );
}
