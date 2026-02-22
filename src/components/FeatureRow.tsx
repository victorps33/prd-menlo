'use client';

import type { Feature } from '@/lib/types';

const EyeIcon = () => (
  <svg
    className="fe"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

interface FeatureRowProps {
  feature: Feature;
  imageUrl: string;
  onClick: () => void;
  onDoubleClick: () => void;
  onDelete: () => void;
  isReplaced?: boolean;
}

export default function FeatureRow({
  feature,
  imageUrl,
  onClick,
  onDoubleClick,
  onDelete,
  isReplaced,
}: FeatureRowProps) {
  const handleMouseEnter = () => {
    if (imageUrl) {
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.as = 'image';
      link.href = imageUrl;
      if (!document.querySelector(`link[href="${imageUrl}"]`)) {
        document.head.appendChild(link);
      }
    }
  };

  return (
    <tr
      className={`fr${isReplaced ? ' replaced' : ''}`}
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onDoubleClick={(e) => {
        e.stopPropagation();
        onDoubleClick();
      }}
    >
      <td>
        <span className="fn">
          <EyeIcon />
          {feature.name}
        </span>
      </td>
      <td>
        {feature.mvp === '✓' ? (
          <span className="ck">✓</span>
        ) : (
          <span className="da">—</span>
        )}
      </td>
      <td>
        {feature.complete === '✓' ? (
          <span className="ck">✓</span>
        ) : (
          <span className="da">—</span>
        )}
      </td>
      <td>
        <span className="rb">{feature.route}</span>
        <button
          className="crud-btn del"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          title="Remover"
        >
          ✕
        </button>
      </td>
    </tr>
  );
}
