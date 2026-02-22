'use client';

import { usePrd } from '@/context/PrdContext';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  visibleCount: number;
}

export default function Header({ searchQuery, onSearchChange, visibleCount }: HeaderProps) {
  const { sections } = usePrd();
  const totalFeatures = sections.reduce((a, s) => a + s.features.length, 0);
  const uniqueImages = new Set(
    sections.flatMap((s) => s.features.map((f) => f.image_key).filter(Boolean))
  ).size;

  return (
    <div className="hd">
      <div className="hd-in">
        <h1>
          PRD — <span>Menlo</span> Cobrança
        </h1>
        <p>Clique em qualquer feature para ver o print. Duplo-clique para editar.</p>
        <div className="hd-st">
          <div className="hd-s">
            <strong>{totalFeatures}</strong>Features
          </div>
          <div className="hd-s">
            <strong>{uniqueImages}</strong>Prints únicos
          </div>
          <div className="hd-s">
            <strong>{sections.length}</strong>Etapas
          </div>
        </div>
        <div className="sb">
          <div className="sb-in">
            <span className="si-icon">&#x1F50D;</span>
            <input
              type="text"
              className="si"
              placeholder="Buscar features..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
            />
            <span className="si-count">
              {visibleCount} feature{visibleCount !== 1 ? 's' : ''}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
