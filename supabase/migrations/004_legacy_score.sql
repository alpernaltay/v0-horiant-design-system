-- ============================================================
-- HORIANT — Legacy Score and Horological Metrics
-- Run this in your Supabase SQL Editor (Dashboard → SQL)
-- ============================================================

-- ──────────────────────────────────────────────────────────────
-- 1. Add Legacy Metrics to Profiles
-- ──────────────────────────────────────────────────────────────
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS legacy_score integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS total_pieces integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS total_complications integer DEFAULT 0;

-- ──────────────────────────────────────────────────────────────
-- 2. Performance Indexes
-- ──────────────────────────────────────────────────────────────
-- We will query and sort by legacy_score heavily on the Community page
CREATE INDEX IF NOT EXISTS idx_profiles_legacy_score ON public.profiles(legacy_score DESC);
