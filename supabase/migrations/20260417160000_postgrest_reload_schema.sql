-- After ALTER TABLE (or new columns), PostgREST may serve stale schema and return PGRST204
-- ("column ... not found in the schema cache"). Run this in SQL Editor or include in deploy:
NOTIFY pgrst, 'reload schema';
