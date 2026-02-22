'use client';

import { useRef, useState, useEffect } from 'react';
import type { Feature } from '@/lib/types';

const BASE_URL = 'https://menlocobranca.vercel.app';

interface ScreenshotModalProps {
  feature: Feature | null;
  imageUrl: string;
  isReplaced: boolean;
  onClose: () => void;
  onNavigate: (dir: 1 | -1) => void;
  onReplace: (file: File) => void;
}

export default function ScreenshotModal({
  feature,
  imageUrl,
  isReplaced,
  onClose,
  onNavigate,
  onReplace,
}: ScreenshotModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(true);

  // Reset loading state when image changes
  useEffect(() => {
    if (imageUrl) {
      setLoading(true);
    } else {
      setLoading(false);
    }
  }, [imageUrl]);

  if (!feature) return null;

  return (
    <div className="mo op" onClick={onClose}>
      <div className="mc" onClick={(e) => e.stopPropagation()}>
        <button className="mx" onClick={onClose}>
          ×
        </button>
        <div className="mh">
          <h3>{feature.name}</h3>
          <span className="mr">{feature.route}</span>
        </div>
        <div className="mw">
          {imageUrl ? (
            <>
              {loading && (
                <div style={{ padding: 40, textAlign: 'center' }}>
                  <div
                    style={{
                      width: 24,
                      height: 24,
                      border: '3px solid var(--g2)',
                      borderTopColor: 'var(--orange)',
                      borderRadius: '50%',
                      animation: 'spin 0.8s linear infinite',
                      margin: '0 auto',
                    }}
                  />
                  <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
                </div>
              )}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imageUrl}
                alt={feature.name}
                onLoad={() => setLoading(false)}
                style={{ display: loading ? 'none' : 'block' }}
              />
            </>
          ) : (
            <div style={{ padding: 40, textAlign: 'center', color: '#8A8A85' }}>
              Sem imagem disponível
            </div>
          )}
        </div>
        <div className="mf">
          <span className="mft">Elemento destacado com borda vermelha</span>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <button
              className={`flag-btn${isReplaced ? ' done' : ''}`}
              onClick={() => fileInputRef.current?.click()}
            >
              {isReplaced ? '✓ Print substituído — clique para trocar' : '⚑ Substituir print'}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) onReplace(file);
                e.target.value = '';
              }}
            />
            <a
              className="mb"
              href={`${BASE_URL}${feature.route}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Abrir na plataforma
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
