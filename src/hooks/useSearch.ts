'use client';

import { useState, useMemo } from 'react';
import type { Section, Feature } from '@/lib/types';

export interface FilteredSection {
  section: Section;
  features: Feature[];
}

export function useSearch(sections: Section[]) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredSections: FilteredSection[] = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return sections.map((s) => ({
      section: s,
      features: q
        ? s.features.filter((f) => f.name.toLowerCase().includes(q))
        : s.features,
    }));
  }, [sections, searchQuery]);

  const visibleCount = useMemo(
    () => filteredSections.reduce((a, s) => a + s.features.length, 0),
    [filteredSections]
  );

  const allVisibleFeatures = useMemo(
    () => filteredSections.flatMap((s) => s.features),
    [filteredSections]
  );

  return {
    searchQuery,
    setSearchQuery,
    filteredSections,
    visibleCount,
    allVisibleFeatures,
  };
}
