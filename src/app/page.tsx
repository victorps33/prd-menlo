import { createClient } from '@/lib/supabase/server';
import type { Section, Feature } from '@/lib/types';
import PrdViewer from '@/components/PrdViewer';

async function fetchSections(): Promise<Section[]> {
  const supabase = await createClient();

  const { data: sections, error: sectionsError } = await supabase
    .from('sections')
    .select('*')
    .order('sort_order', { ascending: true });

  if (sectionsError) {
    console.error('Failed to fetch sections:', sectionsError.message);
    return [];
  }

  const { data: features, error: featuresError } = await supabase
    .from('features')
    .select('*')
    .order('sort_order', { ascending: true });

  if (featuresError) {
    console.error('Failed to fetch features:', featuresError.message);
    return [];
  }

  return (sections || []).map((s) => ({
    id: s.id,
    title: s.title,
    description: s.description,
    sort_order: s.sort_order,
    created_at: s.created_at,
    updated_at: s.updated_at,
    features: (features || [])
      .filter((f: Feature) => f.section_id === s.id)
      .sort((a: Feature, b: Feature) => a.sort_order - b.sort_order),
  }));
}

export default async function Page() {
  const sections = await fetchSections();

  return <PrdViewer initialData={sections} />;
}
