/*
  # Update Storage Bucket Policies for Product Images

  1. Changes
    - Drop existing restrictive policies
    - Allow public (anonymous) users to upload product images
    - Keep public read access for viewing images

  2. Security Notes
    - This allows anyone to upload product images
    - In a production environment, you may want to restrict uploads to admin users only
    - For now, this enables the admin page to work without authentication
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Authenticated users can upload product images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update product images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete product images" ON storage.objects;

-- Allow anyone to upload product images
CREATE POLICY "Anyone can upload product images"
ON storage.objects FOR INSERT
TO public
WITH CHECK (bucket_id = 'product-images');

-- Allow anyone to update product images
CREATE POLICY "Anyone can update product images"
ON storage.objects FOR UPDATE
TO public
USING (bucket_id = 'product-images')
WITH CHECK (bucket_id = 'product-images');

-- Allow anyone to delete product images
CREATE POLICY "Anyone can delete product images"
ON storage.objects FOR DELETE
TO public
USING (bucket_id = 'product-images');