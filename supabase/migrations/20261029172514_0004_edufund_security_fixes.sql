/*
# EduFund — Fix security advisor findings

1. Fix mutable search_path on set_updated_at() and generate_slug()
2. Revoke EXECUTE on handle_new_user() from authenticated role
3. Add deny policies on audit_events and provider_webhook_events
   (service_role-only tables that have RLS but no policies — intentional,
   but adding explicit deny policies to satisfy the advisor)
*/

-- Fix set_updated_at search_path
DROP TRIGGER IF EXISTS profiles_updated_at ON profiles;
DROP TRIGGER IF EXISTS goals_updated_at ON education_goals;
DROP TRIGGER IF EXISTS pledges_updated_at ON pledges;
DROP TRIGGER IF EXISTS notes_updated_at ON encouragement_notes;
DROP TRIGGER IF EXISTS rem_pref_updated_at ON reminder_preferences;
DROP TRIGGER IF EXISTS provider_acct_updated_at ON provider_accounts;
DROP TRIGGER IF EXISTS provider_plan_updated_at ON provider_savings_plans;

DROP FUNCTION IF EXISTS public.set_updated_at();

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  new.updated_at = now();
  RETURN new;
END;
$$;

DROP TRIGGER IF EXISTS profiles_updated_at ON profiles;
CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
DROP TRIGGER IF EXISTS goals_updated_at ON education_goals;
CREATE TRIGGER goals_updated_at BEFORE UPDATE ON education_goals
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
DROP TRIGGER IF EXISTS pledges_updated_at ON pledges;
CREATE TRIGGER pledges_updated_at BEFORE UPDATE ON pledges
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
DROP TRIGGER IF EXISTS notes_updated_at ON encouragement_notes;
CREATE TRIGGER notes_updated_at BEFORE UPDATE ON encouragement_notes
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
DROP TRIGGER IF EXISTS rem_pref_updated_at ON reminder_preferences;
CREATE TRIGGER rem_pref_updated_at BEFORE UPDATE ON reminder_preferences
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
DROP TRIGGER IF EXISTS provider_acct_updated_at ON provider_accounts;
CREATE TRIGGER provider_acct_updated_at BEFORE UPDATE ON provider_accounts
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
DROP TRIGGER IF EXISTS provider_plan_updated_at ON provider_savings_plans;
CREATE TRIGGER provider_plan_updated_at BEFORE UPDATE ON provider_savings_plans
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Fix generate_slug search_path
DROP FUNCTION IF EXISTS public.generate_slug(int);

CREATE OR REPLACE FUNCTION public.generate_slug(len int DEFAULT 8)
RETURNS text
LANGUAGE sql
SECURITY DEFINER SET search_path = public
AS $$
  SELECT string_agg(substr('abcdefghijkmnpqrstuvwxyz23456789', ceil(random() * 31)::int, 1), '')
  FROM generate_series(1, len);
$$;

-- Revoke EXECUTE on handle_new_user from authenticated (it's a trigger, not a public RPC)
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM authenticated, anon;

-- Add explicit deny policies on service-role-only tables
DROP POLICY IF EXISTS "deny_audit_events" ON audit_events;
CREATE POLICY "deny_audit_events"
ON audit_events FOR SELECT TO authenticated, anon
USING (false);

DROP POLICY IF EXISTS "deny_webhook_events" ON provider_webhook_events;
CREATE POLICY "deny_webhook_events"
ON provider_webhook_events FOR SELECT TO authenticated, anon
USING (false);
