'use client';

import { useEffect, useCallback, useRef, useState } from 'react';
import { usePrd, usePrdDispatch } from '@/context/PrdContext';
import { createClient } from '@/lib/supabase/client';
import type { Feature, Section, PendingChange } from '@/lib/types';

const LS_SECTIONS = 'prd:sections';
const LS_SYNCED_AT = 'prd:syncedAt';
const LS_PENDING = 'prd:pending';
const SYNC_INTERVAL = 30_000; // 30s

function readLS<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function writeLS(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // localStorage full or unavailable
  }
}

export function useSyncEngine() {
  const { sections } = usePrd();
  const dispatch = usePrdDispatch();
  const supabaseRef = useRef(createClient());
  const syncingRef = useRef(false);
  const [pendingCount, setPendingCount] = useState(0);

  // Keep pending count in sync
  const refreshPendingCount = useCallback(() => {
    setPendingCount(readLS<PendingChange[]>(LS_PENDING, []).length);
  }, []);

  // Save sections to localStorage whenever they change
  useEffect(() => {
    if (sections.length > 0) {
      writeLS(LS_SECTIONS, sections);
    }
  }, [sections]);

  // On mount: load localStorage first, then sync from Supabase
  useEffect(() => {
    const cached = readLS<Section[]>(LS_SECTIONS, []);
    if (cached.length > 0 && sections.length === 0) {
      dispatch({ type: 'SET_DATA', payload: cached });
    }

    syncFromSupabase();

    // Background sync interval
    const interval = setInterval(syncFromSupabase, SYNC_INTERVAL);

    // Sync on tab focus
    const handleFocus = () => syncFromSupabase();
    window.addEventListener('focus', handleFocus);

    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', handleFocus);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fetch from Supabase and update if newer
  const syncFromSupabase = useCallback(async () => {
    if (syncingRef.current) return;
    syncingRef.current = true;

    try {
      // First, flush any pending changes
      await flushPending();

      const supabase = supabaseRef.current;

      const { data: dbSections } = await supabase
        .from('sections')
        .select('*')
        .order('sort_order', { ascending: true });

      const { data: dbFeatures } = await supabase
        .from('features')
        .select('*')
        .order('sort_order', { ascending: true });

      if (!dbSections || !dbFeatures) return;

      const merged: Section[] = dbSections.map((s) => ({
        id: s.id,
        title: s.title,
        description: s.description,
        sort_order: s.sort_order,
        created_at: s.created_at,
        updated_at: s.updated_at,
        features: dbFeatures
          .filter((f: Feature) => f.section_id === s.id)
          .sort((a: Feature, b: Feature) => a.sort_order - b.sort_order),
      }));

      // Compare timestamps: if Supabase is newer, update
      const localSynced = readLS<string | null>(LS_SYNCED_AT, null);
      const remoteMax = Math.max(
        ...dbFeatures.map((f: Feature) => new Date(f.updated_at).getTime()),
        ...dbSections.map((s: Section) => new Date(s.updated_at).getTime())
      );

      const localMax = localSynced ? new Date(localSynced).getTime() : 0;

      if (remoteMax > localMax || merged.length > 0) {
        dispatch({ type: 'SET_DATA', payload: merged });
        writeLS(LS_SECTIONS, merged);
        writeLS(LS_SYNCED_AT, new Date().toISOString());
      }
    } catch (err) {
      console.error('Sync failed:', err);
    } finally {
      syncingRef.current = false;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  // Flush pending changes to Supabase
  const flushPending = useCallback(async () => {
    const pending = readLS<PendingChange[]>(LS_PENDING, []);
    if (pending.length === 0) return;

    const supabase = supabaseRef.current;
    const remaining: PendingChange[] = [];

    for (const change of pending) {
      try {
        if (change.type === 'insert') {
          const { error } = await supabase.from(change.table).insert(change.data);
          if (error) throw error;
        } else if (change.type === 'update') {
          const { id, ...rest } = change.data;
          const { error } = await supabase.from(change.table).update(rest).eq('id', id);
          if (error) throw error;
        } else if (change.type === 'delete') {
          const { error } = await supabase.from(change.table).delete().eq('id', change.data.id);
          if (error) throw error;
        }
      } catch {
        remaining.push(change);
      }
    }

    writeLS(LS_PENDING, remaining);
    refreshPendingCount();
  }, [refreshPendingCount]);

  // Push a change: write to pending queue, then try to flush
  const pushChange = useCallback(
    async (change: Omit<PendingChange, 'id' | 'timestamp'>) => {
      const pending = readLS<PendingChange[]>(LS_PENDING, []);
      const entry: PendingChange = {
        ...change,
        id: crypto.randomUUID(),
        timestamp: Date.now(),
      };
      pending.push(entry);
      writeLS(LS_PENDING, pending);

      // Try immediate flush
      await flushPending();
    },
    [flushPending]
  );

  // CRUD operations that write localStorage + push to Supabase

  const addFeature = useCallback(
    (feature: Feature) => {
      pushChange({
        type: 'insert',
        table: 'features',
        data: feature,
      });
    },
    [pushChange]
  );

  const updateFeature = useCallback(
    (feature: Feature) => {
      pushChange({
        type: 'update',
        table: 'features',
        data: feature,
      });
    },
    [pushChange]
  );

  const deleteFeature = useCallback(
    (featureId: string) => {
      pushChange({
        type: 'delete',
        table: 'features',
        data: { id: featureId },
      });
    },
    [pushChange]
  );

  const updateSection = useCallback(
    (sectionId: number, changes: Partial<Section>) => {
      pushChange({
        type: 'update',
        table: 'sections',
        data: { id: sectionId, ...changes, updated_at: new Date().toISOString() },
      });
    },
    [pushChange]
  );

  const uploadImage = useCallback(
    async (file: File, featureId: string, currentKey: string): Promise<string | null> => {
      const supabase = supabaseRef.current;
      const newKey = `${currentKey}__${featureId.slice(0, 8)}`;
      const storagePath = `screenshots/${newKey}.png`;

      const { error } = await supabase.storage
        .from('screenshots')
        .upload(storagePath, file, {
          contentType: file.type,
          upsert: true,
        });

      if (error) {
        console.error('Upload failed:', error.message);
        return null;
      }

      // Update feature in Supabase
      await supabase
        .from('features')
        .update({ image_key: newKey, updated_at: new Date().toISOString() })
        .eq('id', featureId);

      return newKey;
    },
    []
  );

  return {
    addFeature,
    updateFeature,
    deleteFeature,
    updateSection,
    uploadImage,
    syncFromSupabase,
    pendingCount,
  };
}
