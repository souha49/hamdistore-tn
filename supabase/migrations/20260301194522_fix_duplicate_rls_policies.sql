/*
  # Fix Duplicate and Insecure RLS Policies

  1. Changes
    - Remove duplicate and overly permissive policies on products and categories
    - Keep only admin-restricted policies for insert, update, delete operations
    - Keep public read access for products and categories
  
  2. Security
    - Ensures only admins can modify products and categories
    - Maintains public read access for browsing the store
    - Removes conflicting policies that could allow unauthorized modifications
*/

-- Drop overly permissive policies on products
DROP POLICY IF EXISTS "Anyone can insert products" ON products;
DROP POLICY IF EXISTS "Anyone can update products" ON products;
DROP POLICY IF EXISTS "Anyone can delete products" ON products;

-- Drop duplicate policies on categories
DROP POLICY IF EXISTS "Authenticated users can insert categories" ON categories;
DROP POLICY IF EXISTS "Authenticated users can update categories" ON categories;
DROP POLICY IF EXISTS "Authenticated users can delete categories" ON categories;
