/*
  # Add Hero Image to Site Settings

  1. Changes
    - Add `hero_image_url` column to `site_settings` table
    - Set default value to current hero image URL
  
  2. Purpose
    - Allows admin to change the homepage hero/cover image from the admin panel
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'site_settings' AND column_name = 'hero_image_url'
  ) THEN
    ALTER TABLE site_settings 
    ADD COLUMN hero_image_url text DEFAULT '/WhatsApp_Image_2026-02-28_at_19.24.51.jpeg';
  END IF;
END $$;