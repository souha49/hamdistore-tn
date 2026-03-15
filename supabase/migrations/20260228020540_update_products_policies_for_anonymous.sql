/*
  # Update Products Table Policies for Anonymous Access

  1. Changes
    - Drop existing restrictive policies that require authentication
    - Allow public (anonymous) users to insert, update, and delete products
    - Keep public read access for viewing products

  2. Security Notes
    - This allows anyone to manage products without authentication
    - In a production environment, you should restrict these operations to admin users only
    - For now, this enables the admin page to work without authentication
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Authenticated users can insert products" ON products;
DROP POLICY IF EXISTS "Authenticated users can update products" ON products;
DROP POLICY IF EXISTS "Authenticated users can delete products" ON products;

-- Allow anyone to insert products
CREATE POLICY "Anyone can insert products"
ON products FOR INSERT
TO public
WITH CHECK (true);

-- Allow anyone to update products
CREATE POLICY "Anyone can update products"
ON products FOR UPDATE
TO public
USING (true)
WITH CHECK (true);

-- Allow anyone to delete products
CREATE POLICY "Anyone can delete products"
ON products FOR DELETE
TO public
USING (true);