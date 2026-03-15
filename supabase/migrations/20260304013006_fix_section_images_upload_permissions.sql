/*
  # Fix Section Images Upload Permissions

  1. Changes
    - Drop existing restrictive policies for section-images bucket
    - Create new policies that allow public access (same as hero-images)
    - Allows upload, update, delete, and select for all users (public role)
  
  2. Security
    - Enable public access to match hero-images bucket behavior
    - Allow unrestricted upload for admin functionality
  
  3. Notes
    - This matches the working permissions pattern from hero-images bucket
    - Public role in Supabase includes both authenticated and anonymous users
*/

DROP POLICY IF EXISTS "Authenticated users can upload section images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update section images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete section images" ON storage.objects;
DROP POLICY IF EXISTS "Public read access for section images" ON storage.objects;

CREATE POLICY "Public can upload section images"
  ON storage.objects FOR INSERT
  TO public
  WITH CHECK (bucket_id = 'section-images');

CREATE POLICY "Public can update section images"
  ON storage.objects FOR UPDATE
  TO public
  USING (bucket_id = 'section-images')
  WITH CHECK (bucket_id = 'section-images');

CREATE POLICY "Public can delete section images"
  ON storage.objects FOR DELETE
  TO public
  USING (bucket_id = 'section-images');

CREATE POLICY "Public can view section images"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'section-images');