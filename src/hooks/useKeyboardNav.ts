'use client';

import { useEffect, useCallback } from 'react';
import type { Feature } from '@/lib/types';

interface UseKeyboardNavProps {
  modalFeature: Feature | null;
  allVisibleFeatures: Feature[];
  onNavigate: (feature: Feature) => void;
  onCloseModal: () => void;
  onCloseCrud: () => void;
}

export function useKeyboardNav({
  modalFeature,
  allVisibleFeatures,
  onNavigate,
  onCloseModal,
  onCloseCrud,
}: UseKeyboardNavProps) {
  const navigate = useCallback(
    (dir: 1 | -1) => {
      if (!modalFeature) return;
      const idx = allVisibleFeatures.findIndex((f) => f.id === modalFeature.id);
      const next = allVisibleFeatures[idx + dir];
      if (next) onNavigate(next);
    },
    [modalFeature, allVisibleFeatures, onNavigate]
  );

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onCloseModal();
        onCloseCrud();
      }
      if (!modalFeature) return;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        navigate(1);
      }
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        navigate(-1);
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [modalFeature, navigate, onCloseModal, onCloseCrud]);

  return { navigate };
}
