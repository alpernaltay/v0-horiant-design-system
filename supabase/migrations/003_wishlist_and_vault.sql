-- ============================================================
-- HORIANT — Wishlist and Vault Image Upload Updates
-- Run this in your Supabase SQL Editor (Dashboard → SQL)
-- ============================================================

-- ──────────────────────────────────────────────────────────────
-- 1. Add Vault Image URL to Profiles
-- ──────────────────────────────────────────────────────────────
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS vault_image_url text DEFAULT '';

-- ──────────────────────────────────────────────────────────────
-- 2. Create Wishlists Table
-- ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.wishlists (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid not null references public.profiles(id) on delete cascade,
  watch_id    uuid not null references public.watches(id) on delete cascade,
  added_at    timestamptz default now(),

  -- Prevent a user from adding the same watch to their wishlist twice
  unique(user_id, watch_id)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_wishlists_user ON public.wishlists(user_id);
CREATE INDEX IF NOT EXISTS idx_wishlists_watch ON public.wishlists(watch_id);

-- ──────────────────────────────────────────────────────────────
-- 3. Row Level Security (RLS) for Wishlists
-- ──────────────────────────────────────────────────────────────
ALTER TABLE public.wishlists ENABLE ROW LEVEL SECURITY;

-- Users can only view their own wishlist
CREATE POLICY "Users can view their own wishlist"
  ON public.wishlists FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert into their own wishlist
CREATE POLICY "Users can add to their own wishlist"
  ON public.wishlists FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can delete from their own wishlist
CREATE POLICY "Users can remove from their own wishlist"
  ON public.wishlists FOR DELETE
  USING (auth.uid() = user_id);
