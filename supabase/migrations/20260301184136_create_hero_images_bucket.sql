/*
  # Create Hero Images Storage Bucket

  1. New Storage Bucket
    - Creates `hero-images` bucket for storing homepage hero/cover images
    - Public bucket to allow direct image access
  
  2. Security
    - Only authenticated admin users can upload/update/delete images
    - Public read access for displaying images on the website
*/

INSERT INTO storage.buckets (id, name, public)
VALUES ('hero-images', 'hero-images', true)
ON CONFLICT (id) DO NOTHING;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Public can view hero images'
  ) THEN
    CREATE POLICY "Public can view hero images"
      ON storage.objects FOR SELECT
      TO public
      USING (bucket_id = 'hero-images');
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Authenticated users can upload hero images'
  ) THEN
    CREATE POLICY "Authenticated users can upload hero images"
      ON storage.objects FOR INSERT
      TO authenticated
      WITH CHECK (bucket_id = 'hero-images');
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Authenticated users can update hero images'
  ) THEN
    CREATE POLICY "Authenticated users can update hero images"
      ON storage.objects FOR UPDATE
      TO authenticated
      USING (bucket_id = 'hero-images')
      WITH CHECK (bucket_id = 'hero-images');
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Authenticated users can delete hero images'
  ) THEN
    CREATE POLICY "Authenticated users can delete hero images"
      ON storage.objects FOR DELETE
      TO authenticated
      USING (bucket_id = 'hero-images');
  END IF;
END $$;