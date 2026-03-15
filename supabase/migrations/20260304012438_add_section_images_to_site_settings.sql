/*
  # Add Section Images to Site Settings

  1. Changes
    - Add columns to `site_settings` table for section cover images:
      - `section_femme_image_url` (text, nullable) - Cover image for "Pour Elle" section
      - `section_homme_image_url` (text, nullable) - Cover image for "Pour Lui" section
      - `section_collection_image_url` (text, nullable) - Cover image for "Collection 2024" section
    
  2. Purpose
    - Allow admin users to customize section cover images from the admin settings page
    - Provide flexibility in branding and visual presentation
    - Default to existing static images if not set

  3. Notes
    - All new columns are nullable to maintain backward compatibility
    - Default values will be handled in the application layer
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'site_settings' AND column_name = 'section_femme_image_url'
  ) THEN
    ALTER TABLE site_settings ADD COLUMN section_femme_image_url text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'site_settings' AND column_name = 'section_homme_image_url'
  ) THEN
    ALTER TABLE site_settings ADD COLUMN section_homme_image_url text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'site_settings' AND column_name = 'section_collection_image_url'
  ) THEN
    ALTER TABLE site_settings ADD COLUMN section_collection_image_url text;
  END IF;
END $$;