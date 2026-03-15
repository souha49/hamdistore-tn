/*
  # Fix Hero Images Upload Permissions
  
  1. Changes
    - Drop restrictive authenticated-only policies for hero-images
    - Create public policies to allow anyone to upload/update/delete hero images
    - Matches the same permissions as product-images bucket
  
  2. Security Notes
    - This allows public uploads to hero-images bucket
    - In production, restrict to admin users only via app logic
*/

-- Drop existing restrictive policies for hero-images
DROP POLICY IF EXISTS "Authenticated users can upload hero images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update hero images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete hero images" ON storage.objects;

-- Create public policies for hero-images (same as product-images)
CREATE POLICY "Public can upload hero images"
  ON storage.objects FOR INSERT
  TO public
  WITH CHECK (bucket_id = 'hero-images');

CREATE POLICY "Public can update hero images"
  ON storage.objects FOR UPDATE
  TO public
  USING (bucket_id = 'hero-images')
  WITH CHECK (bucket_id = 'hero-images');

CREATE POLICY "Public can delete hero images"
  ON storage.objects FOR DELETE
  TO public
  USING (bucket_id = 'hero-images');