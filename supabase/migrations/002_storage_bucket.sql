-- ============================================================
-- HORIANT — Storage Bucket: vault_images
-- Run this in Supabase SQL Editor (Dashboard → SQL)
-- ============================================================

-- Create a public bucket for user SOTC box photos
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'vault_images',
  'vault_images',
  true,
  5242880,  -- 5 MB max per file
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/avif']
)
ON CONFLICT (id) DO NOTHING;

-- ─── RLS Policies ───────────────────────────────────────────

-- Anyone can view uploaded images (public bucket)
CREATE POLICY "Public read access for vault_images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'vault_images');

-- Authenticated users can upload to their own folder (user_id/filename)
CREATE POLICY "Authenticated users can upload to their folder"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'vault_images'
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- Users can update their own uploads
CREATE POLICY "Users can update their own uploads"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'vault_images'
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- Users can delete their own uploads
CREATE POLICY "Users can delete their own uploads"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'vault_images'
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );
