/*
  # Fix Storage Security Policies

  1. Security Issue
    - Storage policies allow ANYONE (including anonymous users) to upload, update, and delete images
    - This is a critical security vulnerability that could lead to:
      - Malicious file uploads
      - Image deletion/vandalism
      - Storage abuse
  
  2. Changes Made
    - Remove all public INSERT/UPDATE/DELETE policies on product-images bucket
    - Remove all public INSERT/UPDATE/DELETE policies on hero-images bucket
    - Add admin-only policies for INSERT/UPDATE/DELETE operations
    - Keep SELECT (view) policies public so images remain visible to everyone
  
  3. Security Improvements
    - Only authenticated admins can upload images
    - Only authenticated admins can update images
    - Only authenticated admins can delete images
    - Everyone can still view images (required for the public website)
*/

-- Drop all insecure public policies for product-images
DROP POLICY IF EXISTS "Anyone can upload product images" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can update product images" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can delete product images" ON storage.objects;

-- Drop all insecure public policies for hero-images
DROP POLICY IF EXISTS "Public can upload hero images" ON storage.objects;
DROP POLICY IF EXISTS "Public can update hero images" ON storage.objects;
DROP POLICY IF EXISTS "Public can delete hero images" ON storage.objects;

-- Create secure admin-only policies for product-images
CREATE POLICY "Only admins can upload product images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'product-images'
    AND EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
    )
  );

CREATE POLICY "Only admins can update product images"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'product-images'
    AND EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
    )
  );

CREATE POLICY "Only admins can delete product images"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'product-images'
    AND EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
    )
  );

-- Create secure admin-only policies for hero-images
CREATE POLICY "Only admins can upload hero images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'hero-images'
    AND EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
    )
  );

CREATE POLICY "Only admins can update hero images"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'hero-images'
    AND EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
    )
  );

CREATE POLICY "Only admins can delete hero images"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'hero-images'
    AND EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
    )
  );
