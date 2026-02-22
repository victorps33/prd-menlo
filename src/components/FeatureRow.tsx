'use client';

import { useState, useRef, useEffect } from 'react';
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
  onUpdate: (updated: Partial<Feature>) => void;
  isReplaced?: boolean;
}

export default function FeatureRow({
  feature,
  imageUrl,
  onClick,
  onDoubleClick,
  onDelete,
  onUpdate,
  isReplaced,
}: FeatureRowProps) {
  const [editingObs, setEditingObs] = useState(false);
  const [obsValue, setObsValue] = useState(feature.route);
  const [editingName, setEditingName] = useState(false);
  const [nameValue, setNameValue] = useState(feature.name);
  const obsInputRef = useRef<HTMLInputElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setObsValue(feature.route);
  }, [feature.route]);

  useEffect(() => {
    setNameValue(feature.name);
  }, [feature.name]);

  useEffect(() => {
    if (editingObs && obsInputRef.current) obsInputRef.current.focus();
  }, [editingObs]);

  useEffect(() => {
    if (editingName && nameInputRef.current) nameInputRef.current.focus();
  }, [editingName]);

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

  // Name editing
  const handleNameEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingName(true);
  };

  const handleNameSave = () => {
    setEditingName(false);
    const trimmed = nameValue.trim();
    if (trimmed && trimmed !== feature.name) {
      onUpdate({ name: trimmed });
    } else {
      setNameValue(feature.name);
    }
  };

  // OBS editing
  const handleObsClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingObs(true);
  };

  const handleObsSave = () => {
    setEditingObs(false);
    if (obsValue !== feature.route) {
      onUpdate({ route: obsValue });
    }
  };

  const handleToggleMvp = (e: React.MouseEvent) => {
    e.stopPropagation();
    onUpdate({ mvp: feature.mvp === '✓' ? '—' : '✓' });
  };

  const handleToggleComplete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onUpdate({ complete: feature.complete === '✓' ? '—' : '✓' });
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
        {editingName ? (
          <input
            ref={nameInputRef}
            className="name-input"
            type="text"
            value={nameValue}
            onChange={(e) => setNameValue(e.target.value)}
            onBlur={handleNameSave}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleNameSave();
              if (e.key === 'Escape') {
                setNameValue(feature.name);
                setEditingName(false);
              }
            }}
            onClick={(e) => e.stopPropagation()}
          />
        ) : (
          <span className="fn">
            <EyeIcon />
            {feature.name}
            <button
              className="row-action edit-btn"
              onClick={handleNameEdit}
              title="Editar nome"
            >
              ✎
            </button>
            <button
              className="row-action del-btn"
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              title="Remover feature"
            >
              ✕
            </button>
          </span>
        )}
      </td>
      <td>
        <span
          className={feature.mvp === '✓' ? 'ck toggle-check' : 'da toggle-check'}
          onClick={handleToggleMvp}
          title="Clique para alternar"
        >
          {feature.mvp === '✓' ? '✓' : '—'}
        </span>
      </td>
      <td>
        <span
          className={feature.complete === '✓' ? 'ck toggle-check' : 'da toggle-check'}
          onClick={handleToggleComplete}
          title="Clique para alternar"
        >
          {feature.complete === '✓' ? '✓' : '—'}
        </span>
      </td>
      <td className="obs-cell">
        {editingObs ? (
          <input
            ref={obsInputRef}
            className="obs-input"
            type="text"
            value={obsValue}
            onChange={(e) => setObsValue(e.target.value)}
            onBlur={handleObsSave}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleObsSave();
              if (e.key === 'Escape') {
                setObsValue(feature.route);
                setEditingObs(false);
              }
            }}
            onClick={(e) => e.stopPropagation()}
          />
        ) : (
          <span className="obs-text" onClick={handleObsClick} title="Clique para editar">
            {feature.route || '—'}
          </span>
        )}
      </td>
    </tr>
  );
}
