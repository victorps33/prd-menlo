'use client';

interface SyncIndicatorProps {
  pendingCount: number;
}

export default function SyncIndicator({ pendingCount }: SyncIndicatorProps) {
  if (pendingCount === 0) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 24,
        left: 24,
        zIndex: 200,
        background: '#fef3c7',
        border: '1px solid #fbbf24',
        borderRadius: 8,
        padding: '6px 14px',
        fontSize: 11,
        color: '#92400e',
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        boxShadow: '0 2px 8px rgba(0,0,0,.1)',
      }}
    >
      <div
        style={{
          width: 8,
          height: 8,
          borderRadius: '50%',
          background: '#f59e0b',
          animation: 'pulse 1.5s infinite',
        }}
      />
      {pendingCount} mudança{pendingCount !== 1 ? 's' : ''} pendente{pendingCount !== 1 ? 's' : ''}
      <style>{`@keyframes pulse { 0%, 100% { opacity: 1 } 50% { opacity: 0.4 } }`}</style>
    </div>
  );
}
