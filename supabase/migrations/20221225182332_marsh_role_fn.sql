create or replace function auth.marshrole() returns text as $$
select nullif(
    (
      (
        current_setting('request.jwt.claims')::jsonb->>'app_metadata'
      )::jsonb->>'marsh_role'
    ),
    ''
  )::text $$ language sql;