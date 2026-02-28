-- ============================================================
-- HORIANT — Storage RLS Fix for vault_images
-- Run this in your Supabase SQL Editor (Dashboard → SQL)
-- ============================================================

-- First, drop the old policies on the vault_images bucket objects
DROP POLICY IF EXISTS "Public read access for vault_images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload to their folder" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own uploads" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own uploads" ON storage.objects;

-- Enable RLS just in case it was disabled (Commented out because it often causes ownership errors in the SQL Editor)
-- ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- 1. Anyone can view uploaded images (Public read access)
CREATE POLICY "Public read access for vault_images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'vault_images');

-- 2. Authenticated users can INSERT (upload new files) to their own folder
CREATE POLICY "Users can upload to their own folder"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'vault_images'
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- 3. Authenticated users can UPDATE their own uploads
CREATE POLICY "Users can update their own uploads"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'vault_images'
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- 4. Authenticated users can DELETE their own uploads
CREATE POLICY "Users can delete their own uploads"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'vault_images'
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );
