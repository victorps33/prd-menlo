'use client';

import { useState, useRef, useEffect } from 'react';
import type { Section, Feature } from '@/lib/types';
import FeatureRow from './FeatureRow';

interface SectionCardProps {
  section: Section;
  filteredFeatures: Feature[];
  getImageUrl: (imageKey: string) => string;
  onFeatureClick: (feature: Feature) => void;
  onFeatureDoubleClick: (feature: Feature) => void;
  onFeatureDelete: (feature: Feature) => void;
  onFeatureUpdate: (feature: Feature, changes: Partial<Feature>) => void;
  onAddFeature: (sectionId: number) => void;
  onSectionUpdate: (sectionId: number, changes: Partial<Section>) => void;
  replacedIds: Set<string>;
  hidden: boolean;
}

export default function SectionCard({
  section,
  filteredFeatures,
  getImageUrl,
  onFeatureClick,
  onFeatureDoubleClick,
  onFeatureDelete,
  onFeatureUpdate,
  onAddFeature,
  onSectionUpdate,
  replacedIds,
  hidden,
}: SectionCardProps) {
  const [editingDesc, setEditingDesc] = useState(false);
  const [descValue, setDescValue] = useState(section.description);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setDescValue(section.description);
  }, [section.description]);

  useEffect(() => {
    if (editingDesc && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [editingDesc]);

  const handleDescSave = () => {
    setEditingDesc(false);
    const trimmed = descValue.trim();
    if (trimmed !== section.description) {
      onSectionUpdate(section.id, { description: trimmed });
    } else {
      setDescValue(section.description);
    }
  };

  if (hidden) return null;

  return (
    <div className="et" id={`e${section.id}`}>
      <div className="et-h">
        <div className="et-n">{section.id}</div>
        <div className="et-t">{section.title}</div>
      </div>
      <div
        className="et-d"
        onClick={() => !editingDesc && setEditingDesc(true)}
        title="Clique para editar o épico"
        style={{ cursor: editingDesc ? 'default' : 'pointer' }}
      >
        {editingDesc ? (
          <textarea
            ref={textareaRef}
            className="desc-input"
            value={descValue}
            onChange={(e) => {
              setDescValue(e.target.value);
              e.target.style.height = 'auto';
              e.target.style.height = e.target.scrollHeight + 'px';
            }}
            onBlur={handleDescSave}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleDescSave();
              }
              if (e.key === 'Escape') {
                setDescValue(section.description);
                setEditingDesc(false);
              }
            }}
            onClick={(e) => e.stopPropagation()}
          />
        ) : (
          <span className="desc-text">{section.description || 'Clique para adicionar épico...'}</span>
        )}
      </div>
      <div className="crud-bar">
        <button className="crud-btn" onClick={() => onAddFeature(section.id)}>
          + Adicionar feature
        </button>
      </div>
      <table className="ft">
        <thead>
          <tr>
            <th>Feature</th>
            <th>MVP</th>
            <th>Compl.</th>
            <th>OBS</th>
          </tr>
        </thead>
        <tbody>
          {filteredFeatures.map((f) => (
            <FeatureRow
              key={f.id}
              feature={f}
              imageUrl={getImageUrl(f.image_key)}
              onClick={() => onFeatureClick(f)}
              onDoubleClick={() => onFeatureDoubleClick(f)}
              onDelete={() => onFeatureDelete(f)}
              onUpdate={(changes) => onFeatureUpdate(f, changes)}
              isReplaced={replacedIds.has(f.id)}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
