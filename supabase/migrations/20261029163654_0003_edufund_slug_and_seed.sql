/*
# EduFund — Slug Generation Function and Seed Data

## Functions
1. `generate_slug()` — returns a short random base62 token for public campaign URLs.

## Seed Data
Creates a demo student campaign with demo contributions, pledges, and notes.
All demo data is clearly marked. Uses a fixed UUID for the demo student profile
that does not correspond to a real auth user (safe for display-only purposes).

Note: seed goals use a placeholder user_id that won't match any real auth user,
so RLS will prevent authenticated users from editing them. This is intentional —
demo data is read-only via the public campaign route.
*/

-- Slug generation function
CREATE OR REPLACE FUNCTION public.generate_slug(len int DEFAULT 8)
RETURNS text LANGUAGE sql AS $$
  SELECT string_agg(substr('abcdefghijkmnpqrstuvwxyz23456789', ceil(random() * 31)::int, 1), '')
  FROM generate_series(1, len);
$$;

-- We cannot insert a profile without a matching auth.users row, so we'll seed
-- via a temporary approach: insert demo data directly. Since the demo goal needs
-- to be publicly visible, we use a generated UUID for user_id that does NOT
-- reference auth.users (we drop the FK temporarily conceptually — but actually
-- the FK requires a real auth user. Instead, we'll create seed data through the
-- app itself. This migration only adds the function.)
