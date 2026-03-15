/*
  # Debug Admin Access Issues
  
  1. Purpose
    - Add temporary logging to understand why admin policies are failing
    - Create a function to check admin status that can be called from the frontend
  
  2. Changes Made
    - Create a function to check if current user is admin
    - This will help debug RLS policy issues
*/

-- Create a function to check if the current user is an admin
CREATE OR REPLACE FUNCTION is_user_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM admin_users
    WHERE id = auth.uid()
  );
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION is_user_admin() TO authenticated;
