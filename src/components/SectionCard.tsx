'use client';

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
  replacedIds,
  hidden,
}: SectionCardProps) {
  if (hidden) return null;

  return (
    <div className="et" id={`e${section.id}`}>
      <div className="et-h">
        <div className="et-n">{section.id}</div>
        <div className="et-t">{section.title}</div>
      </div>
      <div className="et-d">{section.description}</div>
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
