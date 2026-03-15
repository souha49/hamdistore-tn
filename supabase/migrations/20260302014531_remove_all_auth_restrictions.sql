/*
  # Remove Authentication Restrictions for Admin Access

  1. Changes
    - Remove all authentication checks from products table
    - Remove all authentication checks from categories table
    - Remove all authentication checks from orders table
    - Remove all authentication checks from order_items table
    - Remove all authentication checks from site_settings table
    - Remove all authentication checks from storage buckets
    - Allow public access to all admin functions

  2. Security
    - This migration removes all Row Level Security restrictions
    - CAUTION: This makes all data publicly accessible and modifiable
*/

-- Drop all existing RLS policies on products
DROP POLICY IF EXISTS "Anyone can view products" ON products;
DROP POLICY IF EXISTS "Authenticated admins can insert products" ON products;
DROP POLICY IF EXISTS "Authenticated admins can update products" ON products;
DROP POLICY IF EXISTS "Authenticated admins can delete products" ON products;

-- Drop all existing RLS policies on categories
DROP POLICY IF EXISTS "Anyone can view categories" ON categories;
DROP POLICY IF EXISTS "Admins can manage categories" ON categories;
DROP POLICY IF EXISTS "Authenticated admins can insert categories" ON categories;
DROP POLICY IF EXISTS "Authenticated admins can update categories" ON categories;
DROP POLICY IF EXISTS "Authenticated admins can delete categories" ON categories;

-- Drop all existing RLS policies on orders
DROP POLICY IF EXISTS "Users can view their own orders" ON orders;
DROP POLICY IF EXISTS "Admins can view all orders" ON orders;
DROP POLICY IF EXISTS "Anyone can create orders" ON orders;
DROP POLICY IF EXISTS "Admins can update order status" ON orders;
DROP POLICY IF EXISTS "Authenticated admins can view all orders" ON orders;
DROP POLICY IF EXISTS "Authenticated admins can update orders" ON orders;

-- Drop all existing RLS policies on order_items
DROP POLICY IF EXISTS "Users can view their order items" ON order_items;
DROP POLICY IF EXISTS "Admins can view all order items" ON order_items;
DROP POLICY IF EXISTS "Anyone can create order items" ON order_items;
DROP POLICY IF EXISTS "Authenticated admins can view all order items" ON order_items;

-- Drop all existing RLS policies on site_settings
DROP POLICY IF EXISTS "Anyone can view site settings" ON site_settings;
DROP POLICY IF EXISTS "Admins can update site settings" ON site_settings;
DROP POLICY IF EXISTS "Authenticated admins can update site settings" ON site_settings;

-- Drop all existing storage policies
DROP POLICY IF EXISTS "Anyone can view product images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can upload product images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete product images" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view hero images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can upload hero images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete hero images" ON storage.objects;
DROP POLICY IF EXISTS "Public can view product images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated admins can upload product images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated admins can delete product images" ON storage.objects;
DROP POLICY IF EXISTS "Public can view hero images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated admins can upload hero images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated admins can delete hero images" ON storage.objects;

-- Create permissive policies for products
CREATE POLICY "Public access to products"
  ON products
  FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

-- Create permissive policies for categories
CREATE POLICY "Public access to categories"
  ON categories
  FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

-- Create permissive policies for orders
CREATE POLICY "Public access to orders"
  ON orders
  FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

-- Create permissive policies for order_items
CREATE POLICY "Public access to order_items"
  ON order_items
  FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

-- Create permissive policies for site_settings
CREATE POLICY "Public access to site_settings"
  ON site_settings
  FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

-- Create permissive policies for storage (product-images bucket)
CREATE POLICY "Public can view product images"
  ON storage.objects
  FOR SELECT
  TO public
  USING (bucket_id = 'product-images');

CREATE POLICY "Public can upload product images"
  ON storage.objects
  FOR INSERT
  TO public
  WITH CHECK (bucket_id = 'product-images');

CREATE POLICY "Public can update product images"
  ON storage.objects
  FOR UPDATE
  TO public
  USING (bucket_id = 'product-images')
  WITH CHECK (bucket_id = 'product-images');

CREATE POLICY "Public can delete product images"
  ON storage.objects
  FOR DELETE
  TO public
  USING (bucket_id = 'product-images');

-- Create permissive policies for storage (hero-images bucket)
CREATE POLICY "Public can view hero images"
  ON storage.objects
  FOR SELECT
  TO public
  USING (bucket_id = 'hero-images');

CREATE POLICY "Public can upload hero images"
  ON storage.objects
  FOR INSERT
  TO public
  WITH CHECK (bucket_id = 'hero-images');

CREATE POLICY "Public can update hero images"
  ON storage.objects
  FOR UPDATE
  TO public
  USING (bucket_id = 'hero-images')
  WITH CHECK (bucket_id = 'hero-images');

CREATE POLICY "Public can delete hero images"
  ON storage.objects
  FOR DELETE
  TO public
  USING (bucket_id = 'hero-images');