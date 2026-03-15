/*
  # Create Section Images Storage Bucket

  1. New Storage Bucket
    - `section-images` - Store section cover images for homepage sections
  
  2. Security
    - Enable RLS on the bucket
    - Public read access for all images (anon and authenticated users)
    - Upload/Update/Delete restricted to authenticated users only
  
  3. Purpose
    - Centralized storage for section cover images (Pour Elle, Pour Lui, Collection)
    - Secure upload from admin panel
    - Public access for displaying images on the site
*/

INSERT INTO storage.buckets (id, name, public)
VALUES ('section-images', 'section-images', true)
ON CONFLICT (id) DO NOTHING;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Public read access for section images'
  ) THEN
    CREATE POLICY "Public read access for section images"
      ON storage.objects FOR SELECT
      TO public
      USING (bucket_id = 'section-images');
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Authenticated users can upload section images'
  ) THEN
    CREATE POLICY "Authenticated users can upload section images"
      ON storage.objects FOR INSERT
      TO authenticated
      WITH CHECK (bucket_id = 'section-images');
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Authenticated users can update section images'
  ) THEN
    CREATE POLICY "Authenticated users can update section images"
      ON storage.objects FOR UPDATE
      TO authenticated
      USING (bucket_id = 'section-images')
      WITH CHECK (bucket_id = 'section-images');
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Authenticated users can delete section images'
  ) THEN
    CREATE POLICY "Authenticated users can delete section images"
      ON storage.objects FOR DELETE
      TO authenticated
      USING (bucket_id = 'section-images');
  END IF;
END $$;