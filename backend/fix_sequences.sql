DO $$
DECLARE
  r RECORD;
  seq_name TEXT;
  max_id BIGINT;
BEGIN
  FOR r IN
    SELECT table_name
    FROM information_schema.tables
    WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
  LOOP
    BEGIN
      seq_name := pg_get_serial_sequence(r.table_name, 'id');
      IF seq_name IS NOT NULL THEN
        EXECUTE format('SELECT COALESCE(MAX(id), 0) FROM %I', r.table_name) INTO max_id;
        PERFORM setval(seq_name, GREATEST(max_id, 1), true);
        RAISE NOTICE 'Reset % sequence to %', r.table_name, max_id;
      END IF;
    EXCEPTION WHEN OTHERS THEN
      RAISE NOTICE 'Skip % : %', r.table_name, SQLERRM;
    END;
  END LOOP;
END
$$;
