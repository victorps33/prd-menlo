export interface Feature {
  id: string;
  section_id: number;
  name: string;
  mvp: '✓' | '—';
  complete: '✓' | '—';
  route: string;
  image_key: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface Section {
  id: number;
  title: string;
  description: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
  features: Feature[];
}

export type PrdAction =
  | { type: 'SET_DATA'; payload: Section[] }
  | { type: 'ADD_FEATURE'; payload: { section_id: number; feature: Feature } }
  | { type: 'UPDATE_FEATURE'; payload: Feature }
  | { type: 'DELETE_FEATURE'; payload: { id: string; section_id: number } }
  | { type: 'UPDATE_IMAGE'; payload: { feature_id: string; image_key: string } };

export interface PendingChange {
  id: string;
  type: 'insert' | 'update' | 'delete';
  table: 'features';
  data: Partial<Feature> & { id: string };
  timestamp: number;
}

export interface SyncState {
  sections: Section[];
  syncedAt: string | null;
  pending: PendingChange[];
}
