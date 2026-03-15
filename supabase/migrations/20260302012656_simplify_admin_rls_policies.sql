/*
  # Simplify Admin RLS Policies
  
  1. Purpose
    - Simplify RLS policies to use the new is_user_admin() function
    - This should fix issues with admin authentication
  
  2. Changes Made
    - Drop existing complex policies
    - Create new simplified policies using is_user_admin()
    - Apply to products, categories, and storage tables
  
  3. Tables Affected
    - products
    - categories
    - storage.objects (product-images and hero-images buckets)
*/

-- ============================================
-- PRODUCTS TABLE POLICIES
-- ============================================

DROP POLICY IF EXISTS "Only admins can insert products" ON products;
DROP POLICY IF EXISTS "Only admins can update products" ON products;
DROP POLICY IF EXISTS "Only admins can delete products" ON products;

CREATE POLICY "Admins can insert products"
  ON products FOR INSERT
  TO authenticated
  WITH CHECK (is_user_admin());

CREATE POLICY "Admins can update products"
  ON products FOR UPDATE
  TO authenticated
  USING (is_user_admin())
  WITH CHECK (is_user_admin());

CREATE POLICY "Admins can delete products"
  ON products FOR DELETE
  TO authenticated
  USING (is_user_admin());

-- ============================================
-- CATEGORIES TABLE POLICIES
-- ============================================

DROP POLICY IF EXISTS "Only admins can insert categories" ON categories;
DROP POLICY IF EXISTS "Only admins can update categories" ON categories;
DROP POLICY IF EXISTS "Only admins can delete categories" ON categories;

CREATE POLICY "Admins can insert categories"
  ON categories FOR INSERT
  TO authenticated
  WITH CHECK (is_user_admin());

CREATE POLICY "Admins can update categories"
  ON categories FOR UPDATE
  TO authenticated
  USING (is_user_admin())
  WITH CHECK (is_user_admin());

CREATE POLICY "Admins can delete categories"
  ON categories FOR DELETE
  TO authenticated
  USING (is_user_admin());

-- ============================================
-- STORAGE POLICIES
-- ============================================

DROP POLICY IF EXISTS "Only admins can upload product images" ON storage.objects;
DROP POLICY IF EXISTS "Only admins can update product images" ON storage.objects;
DROP POLICY IF EXISTS "Only admins can delete product images" ON storage.objects;
DROP POLICY IF EXISTS "Only admins can upload hero images" ON storage.objects;
DROP POLICY IF EXISTS "Only admins can update hero images" ON storage.objects;
DROP POLICY IF EXISTS "Only admins can delete hero images" ON storage.objects;

-- Product images policies
CREATE POLICY "Admins can upload product images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'product-images'
    AND is_user_admin()
  );

CREATE POLICY "Admins can update product images"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'product-images'
    AND is_user_admin()
  );

CREATE POLICY "Admins can delete product images"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'product-images'
    AND is_user_admin()
  );

-- Hero images policies
CREATE POLICY "Admins can upload hero images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'hero-images'
    AND is_user_admin()
  );

CREATE POLICY "Admins can update hero images"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'hero-images'
    AND is_user_admin()
  );

CREATE POLICY "Admins can delete hero images"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'hero-images'
    AND is_user_admin()
  );
