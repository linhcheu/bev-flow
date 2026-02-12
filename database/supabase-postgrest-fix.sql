-- ==============================================
-- BEV Flow - PostgREST Recovery / Diagnostic
-- Run this in Supabase SQL Editor if PostgREST shows "Unhealthy"
-- ==============================================

-- STEP 1: Check if all tables exist and are accessible
SELECT 'Tables check' AS step, 
       string_agg(tablename, ', ') AS existing_tables
FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename IN (
    'users','products','suppliers','sales','saleitems',
    'purchaseorders','purchaseorderitems','customers',
    'forecasts','annualorders','product_supplier_availability',
    'dailystockreports'
  );

-- STEP 2: Check views
SELECT 'Views check' AS step,
       string_agg(viewname, ', ') AS existing_views
FROM pg_views
WHERE schemaname = 'public';

-- STEP 3: Check for broken policies  
SELECT 'Policy check' AS step,
       tablename, policyname, cmd, qual
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- STEP 4: Notify PostgREST to reload schema cache
NOTIFY pgrst, 'reload schema';

-- STEP 5: Grant PostgREST roles proper access
-- This is the most common fix for PostgREST unhealthy state
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon;

-- STEP 6: Ensure the view is accessible
GRANT SELECT ON supplier_po_summary TO anon, authenticated, service_role;

-- STEP 7: Force PostgREST schema cache reload again
NOTIFY pgrst, 'reload schema';
NOTIFY pgrst, 'reload config';

SELECT 'Done! Wait 30 seconds then check PostgREST status.' AS result;
