-- PRD Menlo: Supabase Schema
-- Run this in the Supabase SQL Editor to set up tables and storage.

-- 1. Sections table
create table if not exists sections (
  id          serial primary key,
  title       text not null,
  description text not null default '',
  sort_order  integer not null default 0,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

-- 2. Features table
create table if not exists features (
  id          uuid primary key default gen_random_uuid(),
  section_id  integer references sections(id) on delete cascade,
  name        text not null,
  mvp         text not null default '—' check (mvp in ('✓', '—')),
  complete    text not null default '—' check (complete in ('✓', '—')),
  route       text not null default '',
  image_key   text not null default '',
  sort_order  integer not null default 0,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

-- 3. Indexes
create index if not exists idx_features_section_id on features(section_id);
create index if not exists idx_features_sort_order on features(sort_order);

-- 4. RLS policies
alter table sections enable row level security;
alter table features enable row level security;

-- Authenticated users can read/write
create policy "Authenticated users can read sections"
  on sections for select to authenticated using (true);

create policy "Authenticated users can insert sections"
  on sections for insert to authenticated with check (true);

create policy "Authenticated users can update sections"
  on sections for update to authenticated using (true);

create policy "Authenticated users can read features"
  on features for select to authenticated using (true);

create policy "Authenticated users can insert features"
  on features for insert to authenticated with check (true);

create policy "Authenticated users can update features"
  on features for update to authenticated using (true);

create policy "Authenticated users can delete features"
  on features for delete to authenticated using (true);

-- 5. Anon policies (public read access without login)
create policy "Anon can read sections"
  on sections for select to anon using (true);

create policy "Anon can read features"
  on features for select to anon using (true);

-- 6. Storage bucket (run in Dashboard or via API)
-- Create a public bucket called 'screenshots'
-- In Supabase Dashboard: Storage > New bucket > Name: screenshots > Public: yes

-- Storage RLS:
-- Authenticated can upload/update/delete
-- Public can read
