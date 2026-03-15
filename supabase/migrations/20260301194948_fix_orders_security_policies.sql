/*
  # Fix Security Issues in Orders and Order Items RLS Policies

  1. Security Issues Fixed
    - **Issue 1**: Authenticated users could view ALL orders (not just theirs)
    - **Issue 2**: Authenticated users could update ALL orders (not just admin)
    - **Issue 3**: Authenticated users could view ALL order items
    - **Issue 4**: Missing DELETE policies on order_items

  2. Changes
    - Replace overly permissive "Authenticated users can view orders" with admin-only policy
    - Replace overly permissive "Authenticated users can update orders" with admin-only policy
    - Replace overly permissive "Authenticated users can view order items" with admin-only policy
    - Add admin-only UPDATE and DELETE policies for order_items
  
  3. Security Model
    - Only admins can view, update, and delete orders and order items
    - Anonymous and authenticated users can only CREATE orders (for checkout)
    - No user can view or modify other users' orders
*/

-- Drop insecure policies on orders
DROP POLICY IF EXISTS "Authenticated users can view orders" ON orders;
DROP POLICY IF EXISTS "Authenticated users can update orders" ON orders;

-- Add admin-only policies for orders
CREATE POLICY "Only admins can view orders"
  ON orders FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
    )
  );

CREATE POLICY "Only admins can update orders"
  ON orders FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
    )
  );

CREATE POLICY "Only admins can delete orders"
  ON orders FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
    )
  );

-- Drop insecure policy on order_items
DROP POLICY IF EXISTS "Authenticated users can view order items" ON order_items;

-- Add admin-only policies for order_items
CREATE POLICY "Only admins can view order items"
  ON order_items FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
    )
  );

CREATE POLICY "Only admins can update order items"
  ON order_items FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
    )
  );

CREATE POLICY "Only admins can delete order items"
  ON order_items FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
    )
  );
