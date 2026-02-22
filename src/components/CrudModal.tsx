'use client';

import { useState, useEffect } from 'react';
import type { Feature } from '@/lib/types';

interface CrudModalProps {
  isOpen: boolean;
  editingFeature: Feature | null;
  sectionId: number;
  onClose: () => void;
  onSave: (data: {
    name: string;
    mvp: '✓' | '—';
    complete: '✓' | '—';
    route: string;
    image_key: string;
  }) => void;
}

export default function CrudModal({
  isOpen,
  editingFeature,
  sectionId,
  onClose,
  onSave,
}: CrudModalProps) {
  const [name, setName] = useState('');
  const [mvp, setMvp] = useState<'✓' | '—'>('✓');
  const [complete, setComplete] = useState<'✓' | '—'>('—');
  const [route, setRoute] = useState('');
  const [imageKey, setImageKey] = useState('');

  useEffect(() => {
    if (editingFeature) {
      setName(editingFeature.name);
      setMvp(editingFeature.mvp);
      setComplete(editingFeature.complete);
      setRoute(editingFeature.route);
      setImageKey(editingFeature.image_key);
    } else {
      setName('');
      setMvp('✓');
      setComplete('—');
      setRoute('');
      setImageKey('');
    }
  }, [editingFeature, sectionId, isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    if (!name.trim()) {
      alert('Nome é obrigatório');
      return;
    }
    onSave({ name: name.trim(), mvp, complete, route: route.trim(), image_key: imageKey.trim() });
  };

  return (
    <div className="crud-modal op" onClick={onClose}>
      <div className="crud-box" onClick={(e) => e.stopPropagation()}>
        <h3>{editingFeature ? 'Editar feature' : 'Adicionar feature'}</h3>
        <label>Nome da feature</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ex: Exportação de relatórios em PDF"
        />
        <div style={{ display: 'flex', gap: 12 }}>
          <div style={{ flex: 1 }}>
            <label>MVP</label>
            <select value={mvp} onChange={(e) => setMvp(e.target.value as '✓' | '—')}>
              <option value="✓">✓ Sim</option>
              <option value="—">— Não</option>
            </select>
          </div>
          <div style={{ flex: 1 }}>
            <label>Completo</label>
            <select value={complete} onChange={(e) => setComplete(e.target.value as '✓' | '—')}>
              <option value="✓">✓ Sim</option>
              <option value="—">— Não</option>
            </select>
          </div>
        </div>
        <label>Observação</label>
        <input
          type="text"
          value={route}
          onChange={(e) => setRoute(e.target.value)}
          placeholder="Ex: Precisa revisar com o time"
        />
        <label>Chave do print</label>
        <input
          type="text"
          value={imageKey}
          onChange={(e) => setImageKey(e.target.value)}
          placeholder="Ex: rel-export-pdf"
        />
        <div className="crud-actions">
          <button className="crud-cancel" onClick={onClose}>
            Cancelar
          </button>
          <button className="crud-save" onClick={handleSave}>
            Salvar
          </button>
        </div>
      </div>
    </div>
  );
}
