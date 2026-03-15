/*
  # Fix Final Security Issues

  1. Security Issues Fixed
    - **Issue 1**: Missing UPDATE policy on admin_users table (admins couldn't update their profile)
    - **Issue 2**: Missing DELETE policy on site_settings table
    - **Issue 3**: Orders and order_items INSERT policies use WITH CHECK (true), allowing anyone to insert malicious data
  
  2. Changes Made
    - Add UPDATE policy for admin_users (admins can update admin records)
    - Add DELETE policy for site_settings (admins can delete settings)
    - Replace WITH CHECK (true) with proper validation for orders
    - Replace WITH CHECK (true) with proper validation for order_items
  
  3. Security Improvements
    - Admins can now properly manage admin_users
    - Site settings are fully protected with all CRUD operations
    - Orders can only be created with valid data (no arbitrary field injection)
    - Order items can only be created with valid product references
*/

-- Fix 1: Add UPDATE policy for admin_users
CREATE POLICY "Only admins can update admin users"
  ON admin_users FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users admin_users_1
      WHERE admin_users_1.id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users admin_users_1
      WHERE admin_users_1.id = auth.uid()
    )
  );

-- Fix 2: Add DELETE policy for site_settings
CREATE POLICY "Only admins can delete site settings"
  ON site_settings FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
    )
  );

-- Fix 3: Replace insecure orders INSERT policy
DROP POLICY IF EXISTS "Anyone can create orders" ON orders;

CREATE POLICY "Anyone can create orders with valid data"
  ON orders FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    -- Ensure required fields are present and valid
    customer_name IS NOT NULL
    AND phone IS NOT NULL
    AND address IS NOT NULL
    AND city IS NOT NULL
    AND total_amount > 0
    AND (status IS NULL OR status = 'pending')
  );

-- Fix 4: Replace insecure order_items INSERT policy
DROP POLICY IF EXISTS "Anyone can create order items" ON order_items;

CREATE POLICY "Anyone can create order items with valid data"
  ON order_items FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    -- Ensure required fields are present and valid
    order_id IS NOT NULL
    AND product_id IS NOT NULL
    AND product_name IS NOT NULL
    AND size IS NOT NULL
    AND quantity > 0
    AND price >= 0
    -- Ensure the product exists
    AND EXISTS (
      SELECT 1 FROM products
      WHERE products.id = product_id
    )
  );
