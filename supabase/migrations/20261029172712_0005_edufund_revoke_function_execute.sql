/*
# Revoke public execute on internal SECURITY DEFINER functions

## Purpose
The database linter flagged `generate_slug(integer)` and `set_updated_at()`
as SECURITY DEFINER functions callable by `anon` and `authenticated` via
the PostgREST RPC endpoint. Neither function is meant to be invoked as a
public RPC: `set_updated_at` is a trigger function, and `generate_slug`
is used internally by the application server / triggers, not exposed to
the browser client.

## Changes
1. Revoke EXECUTE on `set_updated_at()` from PUBLIC, anon, authenticated.
2. Revoke EXECUTE on `generate_slug(integer)` from PUBLIC, anon, authenticated.
3. Re-grant EXECUTE on `generate_slug(integer)` to `service_role` only,
   so server-side / edge-function code can still call it if needed.

## Security impact
- `anon` and `authenticated` can no longer call either function via
  `/rest/v1/rpc/...`.
- Trigger invocation of `set_updated_at` is unaffected (triggers run with
  the table owner / invoking role's privileges, not via EXECUTE grants to
  anon/authenticated).
- `service_role` retains EXECUTE on `generate_slug` for any server-side use.

## Notes
- These are non-destructive privilege changes only. No data is touched.
- Migration is idempotent: REVOKE is safe to re-run.
*/

REVOKE EXECUTE ON FUNCTION public.set_updated_at() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.set_updated_at() FROM anon;
REVOKE EXECUTE ON FUNCTION public.set_updated_at() FROM authenticated;

REVOKE EXECUTE ON FUNCTION public.generate_slug(integer) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.generate_slug(integer) FROM anon;
REVOKE EXECUTE ON FUNCTION public.generate_slug(integer) FROM authenticated;

GRANT EXECUTE ON FUNCTION public.generate_slug(integer) TO service_role;
