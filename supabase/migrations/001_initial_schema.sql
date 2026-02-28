-- ============================================================
-- HORIANT — Initial Schema Migration
-- Run this in your Supabase SQL Editor (Dashboard → SQL)
-- ============================================================

-- Enable UUID generation
create extension if not exists "uuid-ossp";

-- ──────────────────────────────────────────────────────────────
-- 1. PROFILES
-- ──────────────────────────────────────────────────────────────
create table public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  username    text unique,
  wrist_size  numeric(3,1),           -- e.g. 17.0 cm
  bio         text default '',
  avatar_url  text default '',
  is_pro      boolean default false,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

-- Auto-create profile on user signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, username)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'username', 'collector_' || left(new.id::text, 8)));
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ──────────────────────────────────────────────────────────────
-- 2. WATCHES
-- ──────────────────────────────────────────────────────────────
create table public.watches (
  id               uuid primary key default uuid_generate_v4(),
  brand            text not null,
  model            text not null,
  reference        text not null,
  year             int,
  caliber          text,
  power_reserve    text,
  case_size        text,           -- e.g. "41.0 mm"
  lug_to_lug       text,
  thickness        text,
  material         text,
  water_resistance text,
  crystal          text,
  bracelet         text,
  story_text       text default '',
  image_url        text default '',
  category         text,           -- Diver, Dress, Chronograph, GMT, Pilot
  price            text,
  market_trend     text,
  transactions     int default 0,
  rating           numeric(2,1) default 0.0,
  frequency        text,
  jewels           text,
  chrono24_url     text default '',
  complications    text[] default '{}',
  slug             text unique,     -- SEO-friendly URL slug
  is_featured      boolean default false,
  created_at       timestamptz default now()
);

-- Index for common queries
create index idx_watches_category on public.watches(category);
create index idx_watches_brand on public.watches(brand);
create index idx_watches_slug on public.watches(slug);

-- ──────────────────────────────────────────────────────────────
-- 3. COLLECTIONS
-- ──────────────────────────────────────────────────────────────
create table public.collections (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid not null references public.profiles(id) on delete cascade,
  watch_id    uuid not null references public.watches(id) on delete cascade,
  is_verified boolean default false,
  added_at    timestamptz default now(),

  unique(user_id, watch_id)          -- prevent duplicate entries
);

create index idx_collections_user on public.collections(user_id);

-- ──────────────────────────────────────────────────────────────
-- 4. REVIEWS
-- ──────────────────────────────────────────────────────────────
create table public.reviews (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid not null references public.profiles(id) on delete cascade,
  watch_id    uuid not null references public.watches(id) on delete cascade,
  rating      int check (rating >= 1 and rating <= 5),
  title       text default '',
  comment     text default '',
  created_at  timestamptz default now()
);

create index idx_reviews_watch on public.reviews(watch_id);
create index idx_reviews_user on public.reviews(user_id);

-- ──────────────────────────────────────────────────────────────
-- 5. ROW LEVEL SECURITY
-- ──────────────────────────────────────────────────────────────

-- Profiles
alter table public.profiles enable row level security;

create policy "Public profiles are viewable by everyone"
  on public.profiles for select using (true);

create policy "Users can update their own profile"
  on public.profiles for update using (auth.uid() = id);

-- Watches (public read, admin write)
alter table public.watches enable row level security;

create policy "Watches are viewable by everyone"
  on public.watches for select using (true);

-- Collections
alter table public.collections enable row level security;

create policy "Users can view their own collection"
  on public.collections for select using (auth.uid() = user_id);

create policy "Users can add to their own collection"
  on public.collections for insert with check (auth.uid() = user_id);

create policy "Users can remove from their own collection"
  on public.collections for delete using (auth.uid() = user_id);

-- Reviews
alter table public.reviews enable row level security;

create policy "Reviews are viewable by everyone"
  on public.reviews for select using (true);

create policy "Authenticated users can create reviews"
  on public.reviews for insert with check (auth.uid() = user_id);

create policy "Users can update their own reviews"
  on public.reviews for update using (auth.uid() = user_id);

create policy "Users can delete their own reviews"
  on public.reviews for delete using (auth.uid() = user_id);
