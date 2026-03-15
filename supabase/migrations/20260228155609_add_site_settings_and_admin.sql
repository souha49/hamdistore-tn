/*
  # Add Site Settings and Admin Features

  ## New Tables
  
  1. `site_settings`
    - `id` (uuid, primary key) - unique identifier
    - `store_name` (text) - name of the store
    - `logo_url` (text, nullable) - URL to store logo
    - `primary_color` (text) - primary brand color
    - `secondary_color` (text) - secondary brand color
    - `header_style` (text) - header layout style
    - `products_per_row_desktop` (int) - desktop grid columns
    - `products_per_row_tablet` (int) - tablet grid columns
    - `products_per_row_mobile` (int) - mobile grid columns
    - `updated_at` (timestamptz) - last update timestamp

  2. `admin_users`
    - `id` (uuid, primary key) - references auth.users
    - `email` (text) - admin email
    - `created_at` (timestamptz) - creation timestamp

  ## Security
  
  - Enable RLS on `site_settings` table
    - Public can read settings
    - Only admins can update settings
  - Enable RLS on `admin_users` table
    - Only admins can read/manage admin users
  
  ## Initial Data
  
  - Insert default site settings for Hamdi Store
*/

-- Create site_settings table
CREATE TABLE IF NOT EXISTS site_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  store_name text NOT NULL DEFAULT 'Hamdi Store',
  logo_url text,
  primary_color text NOT NULL DEFAULT '#2563eb',
  secondary_color text NOT NULL DEFAULT '#1e40af',
  header_style text NOT NULL DEFAULT 'modern',
  products_per_row_desktop int NOT NULL DEFAULT 4,
  products_per_row_tablet int NOT NULL DEFAULT 3,
  products_per_row_mobile int NOT NULL DEFAULT 2,
  updated_at timestamptz DEFAULT now()
);

-- Create admin_users table
CREATE TABLE IF NOT EXISTS admin_users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL UNIQUE,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Site settings policies
CREATE POLICY "Anyone can read site settings"
  ON site_settings FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Only admins can update site settings"
  ON site_settings FOR UPDATE
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

CREATE POLICY "Only admins can insert site settings"
  ON site_settings FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
    )
  );

-- Admin users policies
CREATE POLICY "Only admins can read admin users"
  ON admin_users FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
    )
  );

CREATE POLICY "Only admins can insert admin users"
  ON admin_users FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
    )
  );

CREATE POLICY "Only admins can delete admin users"
  ON admin_users FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
    )
  );

-- Update existing product and category policies to allow admin management
DROP POLICY IF EXISTS "Anyone can view products" ON products;
DROP POLICY IF EXISTS "Anyone can view categories" ON categories;

CREATE POLICY "Anyone can view products"
  ON products FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Only admins can insert products"
  ON products FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
    )
  );

CREATE POLICY "Only admins can update products"
  ON products FOR UPDATE
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

CREATE POLICY "Only admins can delete products"
  ON products FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
    )
  );

CREATE POLICY "Anyone can view categories"
  ON categories FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Only admins can insert categories"
  ON categories FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
    )
  );

CREATE POLICY "Only admins can update categories"
  ON categories FOR UPDATE
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

CREATE POLICY "Only admins can delete categories"
  ON categories FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
    )
  );

-- Insert default site settings
INSERT INTO site_settings (store_name, primary_color, secondary_color, header_style, products_per_row_desktop, products_per_row_tablet, products_per_row_mobile)
VALUES ('Hamdi Store', '#2563eb', '#1e40af', 'modern', 4, 3, 2)
ON CONFLICT DO NOTHING;
