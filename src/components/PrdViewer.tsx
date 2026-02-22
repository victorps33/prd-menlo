'use client';

import { useState, useCallback } from 'react';
import { PrdProvider, usePrd, usePrdDispatch } from '@/context/PrdContext';
import type { Section, Feature } from '@/lib/types';
import Header from './Header';
import Sidebar from './Sidebar';
import SectionCard from './SectionCard';
import ScreenshotModal from './ScreenshotModal';
import CrudModal from './CrudModal';
import SyncIndicator from './SyncIndicator';
import { useSearch } from '@/hooks/useSearch';
import { useKeyboardNav } from '@/hooks/useKeyboardNav';
import { useSyncEngine } from '@/hooks/useSyncEngine';

const STORAGE_BASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
  ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/screenshots/screenshots/`
  : '';

function getImageUrl(imageKey: string): string {
  if (!imageKey) return '';
  return `${STORAGE_BASE_URL}${imageKey}.png`;
}

function PrdViewerInner() {
  const { sections } = usePrd();
  const dispatch = usePrdDispatch();
  const { addFeature, updateFeature, deleteFeature, updateSection, uploadImage, pendingCount } = useSyncEngine();

  // Search
  const { searchQuery, setSearchQuery, filteredSections, visibleCount, allVisibleFeatures } =
    useSearch(sections);

  // Screenshot modal
  const [modalFeature, setModalFeature] = useState<Feature | null>(null);

  // CRUD modal
  const [crudOpen, setCrudOpen] = useState(false);
  const [crudSectionId, setCrudSectionId] = useState(0);
  const [editingFeature, setEditingFeature] = useState<Feature | null>(null);

  // Replaced image tracking
  const [replacedIds, setReplacedIds] = useState<Set<string>>(new Set());

  // Close handlers
  const handleCloseModal = useCallback(() => {
    setModalFeature(null);
    document.body.style.overflow = '';
  }, []);

  const handleCloseCrud = useCallback(() => {
    setCrudOpen(false);
    setEditingFeature(null);
  }, []);

  // Keyboard navigation
  useKeyboardNav({
    modalFeature,
    allVisibleFeatures,
    onNavigate: setModalFeature,
    onCloseModal: handleCloseModal,
    onCloseCrud: handleCloseCrud,
  });

  // Feature click -> open screenshot modal
  const handleFeatureClick = useCallback((feature: Feature) => {
    setModalFeature(feature);
    document.body.style.overflow = 'hidden';
  }, []);

  // Double-click -> edit feature
  const handleFeatureDoubleClick = useCallback((feature: Feature) => {
    setEditingFeature(feature);
    setCrudSectionId(feature.section_id);
    setCrudOpen(true);
  }, []);

  // Delete feature
  const handleFeatureDelete = useCallback(
    (feature: Feature) => {
      if (!confirm(`Remover "${feature.name}"?`)) return;
      dispatch({ type: 'DELETE_FEATURE', payload: { id: feature.id, section_id: feature.section_id } });
      deleteFeature(feature.id);
    },
    [dispatch, deleteFeature]
  );

  // Inline update (toggle MVP/Complete, edit OBS)
  const handleFeatureUpdate = useCallback(
    (feature: Feature, changes: Partial<Feature>) => {
      const updated: Feature = {
        ...feature,
        ...changes,
        updated_at: new Date().toISOString(),
      };
      dispatch({ type: 'UPDATE_FEATURE', payload: updated });
      updateFeature(updated);
    },
    [dispatch, updateFeature]
  );

  // Section update (description/epic editing)
  const handleSectionUpdate = useCallback(
    (sectionId: number, changes: Partial<Section>) => {
      dispatch({ type: 'UPDATE_SECTION', payload: { id: sectionId, changes } });
      updateSection(sectionId, changes);
    },
    [dispatch, updateSection]
  );

  // Add feature button
  const handleAddFeature = useCallback((sectionId: number) => {
    setEditingFeature(null);
    setCrudSectionId(sectionId);
    setCrudOpen(true);
  }, []);

  // Save CRUD
  const handleCrudSave = useCallback(
    async (data: { name: string; mvp: '✓' | '—'; complete: '✓' | '—'; route: string; image_key: string }) => {
      if (editingFeature) {
        const updated: Feature = {
          ...editingFeature,
          ...data,
          updated_at: new Date().toISOString(),
        };
        dispatch({ type: 'UPDATE_FEATURE', payload: updated });
        updateFeature(updated);
      } else {
        const newFeature: Feature = {
          id: crypto.randomUUID(),
          section_id: crudSectionId,
          ...data,
          sort_order: (sections.find((s) => s.id === crudSectionId)?.features.length ?? 0),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        dispatch({ type: 'ADD_FEATURE', payload: { section_id: crudSectionId, feature: newFeature } });
        addFeature(newFeature);
      }
      handleCloseCrud();
    },
    [editingFeature, crudSectionId, dispatch, addFeature, updateFeature, sections, handleCloseCrud]
  );

  // Replace screenshot
  const handleReplace = useCallback(
    async (file: File) => {
      if (!modalFeature) return;
      const newKey = await uploadImage(file, modalFeature.id, modalFeature.image_key);
      if (newKey) {
        dispatch({ type: 'UPDATE_IMAGE', payload: { feature_id: modalFeature.id, image_key: newKey } });
        setReplacedIds((prev) => new Set(prev).add(modalFeature.id));
        setModalFeature((prev) => (prev ? { ...prev, image_key: newKey } : null));
      }
    },
    [modalFeature, dispatch, uploadImage]
  );

  // Export JSON
  const handleExportJson = useCallback(() => {
    const data = JSON.stringify(sections, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'PRD-Menlo-export.json';
    a.click();
    URL.revokeObjectURL(url);
  }, [sections]);

  // Navigate in modal
  const handleNavigate = useCallback(
    (dir: 1 | -1) => {
      if (!modalFeature) return;
      const idx = allVisibleFeatures.findIndex((f) => f.id === modalFeature.id);
      const next = allVisibleFeatures[idx + dir];
      if (next) setModalFeature(next);
    },
    [modalFeature, allVisibleFeatures]
  );

  return (
    <>
      <Header
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        visibleCount={visibleCount}
      />

      <div className="ly">
        <Sidebar />

        <div className="mn">
          <div className="lg">
            <div className="li">
              <span className="ck">✓</span> No escopo
            </div>
            <div className="li">
              <span className="da">—</span> Não incluído
            </div>
            <div className="li">
              <svg
                style={{ width: 12, height: 12 }}
                viewBox="0 0 24 24"
                fill="none"
                stroke="#F85B00"
                strokeWidth={2}
              >
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>{' '}
              Clique = print com destaque
            </div>
          </div>

          {visibleCount === 0 && (
            <div className="nr" style={{ display: 'block' }}>
              Nenhuma feature encontrada.
            </div>
          )}

          {filteredSections.map(({ section, features }) => (
            <SectionCard
              key={section.id}
              section={section}
              filteredFeatures={features}
              getImageUrl={getImageUrl}
              onFeatureClick={handleFeatureClick}
              onFeatureDoubleClick={handleFeatureDoubleClick}
              onFeatureDelete={handleFeatureDelete}
              onFeatureUpdate={handleFeatureUpdate}
              onAddFeature={handleAddFeature}
              onSectionUpdate={handleSectionUpdate}
              replacedIds={replacedIds}
              hidden={features.length === 0}
            />
          ))}

          <div className="fo">Menlo Cobrança · PRD · 2026</div>
        </div>
      </div>

      {modalFeature && (
        <ScreenshotModal
          feature={modalFeature}
          imageUrl={getImageUrl(modalFeature.image_key)}
          isReplaced={replacedIds.has(modalFeature.id)}
          onClose={handleCloseModal}
          onNavigate={handleNavigate}
          onReplace={handleReplace}
        />
      )}

      <CrudModal
        isOpen={crudOpen}
        editingFeature={editingFeature}
        sectionId={crudSectionId}
        onClose={handleCloseCrud}
        onSave={handleCrudSave}
      />

      <SyncIndicator pendingCount={pendingCount} />

      <div className="export-wrap">
        <button
          className="export-btn vis"
          onClick={handleExportJson}
        >
          Exportar JSON
        </button>
      </div>
    </>
  );
}

export default function PrdViewer({ initialData }: { initialData: Section[] }) {
  return (
    <PrdProvider initialData={initialData}>
      <PrdViewerInner />
    </PrdProvider>
  );
}
