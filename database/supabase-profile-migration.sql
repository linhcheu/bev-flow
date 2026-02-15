-- ==============================================
-- BEV Flow - Profile & Settings Migration for Supabase
-- Run this in Supabase SQL Editor
-- Safe to run multiple times (uses IF NOT EXISTS / IF NOT EXISTS checks)
-- ==============================================

-- ==============================================
-- STEP 1: Add profile_image column to users table
-- Stores base64 data URL for user avatar (max ~500KB)
-- ==============================================
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'users' AND column_name = 'profile_image'
    ) THEN
        ALTER TABLE users ADD COLUMN profile_image TEXT;
        RAISE NOTICE '✅ Added profile_image column to users table';
    ELSE
        RAISE NOTICE 'ℹ️ profile_image column already exists, skipping';
    END IF;
END $$;

-- ==============================================
-- STEP 2: Create UserSettings table (minimal - for account management)
-- ==============================================
CREATE TABLE IF NOT EXISTS usersettings (
    setting_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL UNIQUE REFERENCES users(user_id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index for fast user lookup
CREATE INDEX IF NOT EXISTS idx_usersettings_user_id ON usersettings(user_id);

-- Trigger for auto-updating updated_at
DROP TRIGGER IF EXISTS update_usersettings_updated_at ON usersettings;
CREATE TRIGGER update_usersettings_updated_at
    BEFORE UPDATE ON usersettings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ==============================================
-- STEP 3: Enable RLS + policies for usersettings
-- ==============================================
ALTER TABLE usersettings ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if re-running
DROP POLICY IF EXISTS "usersettings_select" ON usersettings;
DROP POLICY IF EXISTS "usersettings_insert" ON usersettings;
DROP POLICY IF EXISTS "usersettings_update" ON usersettings;
DROP POLICY IF EXISTS "usersettings_delete" ON usersettings;

CREATE POLICY "usersettings_select" ON usersettings FOR SELECT USING (true);
CREATE POLICY "usersettings_insert" ON usersettings FOR INSERT
  WITH CHECK ((select current_setting('role')) IN ('service_role', 'authenticated'));
CREATE POLICY "usersettings_update" ON usersettings FOR UPDATE
  USING ((select current_setting('role')) IN ('service_role', 'authenticated'))
  WITH CHECK ((select current_setting('role')) IN ('service_role', 'authenticated'));
CREATE POLICY "usersettings_delete" ON usersettings FOR DELETE
  USING ((select current_setting('role')) IN ('service_role', 'authenticated'));

-- ==============================================
-- STEP 4: Grants for usersettings
-- ==============================================
GRANT ALL ON usersettings TO service_role;
GRANT ALL ON usersettings TO authenticated;
GRANT SELECT ON usersettings TO anon;
GRANT USAGE, SELECT ON SEQUENCE usersettings_setting_id_seq TO service_role;
GRANT USAGE, SELECT ON SEQUENCE usersettings_setting_id_seq TO authenticated;

-- ==============================================
-- STEP 5: Refresh all grants (safety net)
-- ==============================================
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon;

-- Force PostgREST to pick up the new column & table
NOTIFY pgrst, 'reload schema';

-- ==============================================
-- VERIFY
-- ==============================================
SELECT '✅ Migration complete!' AS status;

-- Check profile_image column exists
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'users' AND column_name = 'profile_image';

-- Check usersettings table exists  
SELECT 'usersettings table' AS check_item, COUNT(*) AS row_count FROM usersettings;
