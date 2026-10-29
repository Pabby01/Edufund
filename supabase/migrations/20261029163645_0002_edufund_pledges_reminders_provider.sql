/*
# EduFund Schema Part 2 — Pledge Schedules, Reminders, Provider Accounts

## New Tables

1. `pledge_schedules` — projected upcoming contribution dates for each pledge.
   - id, pledge_id, goal_id, scheduled_date, amount_kobo, status (scheduled/skipped/completed),
     created_at.

2. `reminder_preferences` — per-pledge reminder settings.
   - id, pledge_id, reminder_frequency, consent, opted_out, created_at, updated_at.

3. `reminder_events` — log of reminder events generated.
   - id, pledge_id, scheduled_date, status (pending/previewed/sent/failed), channel,
     created_at, sent_at.

4. `provider_accounts` — Cowrywise account linkage (external account ID, verification status).
   - id, user_id, provider_name, external_account_id, verification_status, metadata, created_at, updated_at.

5. `provider_savings_plans` — savings plans created via provider (future).
   - id, user_id, goal_id, provider_account_id, external_plan_id, product_code,
     status, metadata, created_at, updated_at.

6. `provider_webhook_events` — raw webhook log for idempotency.
   - id, provider_name, event_type, external_event_id, payload jsonb, processed boolean, created_at.

7. `audit_events` — security audit log for sensitive actions.
   - id, actor_id, action, target_type, target_id, metadata jsonb, created_at.

## Security
- pledge_schedules: owner SELECT; owner INSERT/UPDATE via edge function (service_role).
- reminder_preferences/reminder_events: owner SELECT; INSERT via public (sponsor sets consent).
- provider_*: owner SELECT only; INSERT/UPDATE via service_role only.
- audit_events: admin SELECT only; INSERT via service_role.
*/

-- ============================================================
-- pledge_schedules
-- ============================================================
CREATE TABLE IF NOT EXISTS pledge_schedules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pledge_id uuid NOT NULL REFERENCES pledges(id) ON DELETE CASCADE,
  goal_id uuid NOT NULL REFERENCES education_goals(id) ON DELETE CASCADE,
  scheduled_date date NOT NULL,
  amount_kobo bigint NOT NULL CHECK (amount_kobo > 0),
  status text NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled','skipped','completed')),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_schedules_pledge_id ON pledge_schedules(pledge_id);
CREATE INDEX IF NOT EXISTS idx_schedules_date ON pledge_schedules(scheduled_date);

ALTER TABLE pledge_schedules ENABLE ROW LEVEL SECURITY;

GRANT SELECT ON pledge_schedules TO authenticated;

DROP POLICY IF EXISTS "schedules_select_owner" ON pledge_schedules;
CREATE POLICY "schedules_select_owner"
ON pledge_schedules FOR SELECT TO authenticated
USING (EXISTS (SELECT 1 FROM education_goals g WHERE g.id = pledge_schedules.goal_id AND g.user_id = auth.uid()));

-- ============================================================
-- reminder_preferences
-- ============================================================
CREATE TABLE IF NOT EXISTS reminder_preferences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pledge_id uuid NOT NULL UNIQUE REFERENCES pledges(id) ON DELETE CASCADE,
  reminder_frequency text CHECK (reminder_frequency IN ('daily','weekly','monthly')),
  consent boolean NOT NULL DEFAULT false,
  opted_out boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE reminder_preferences ENABLE ROW LEVEL SECURITY;

GRANT SELECT, INSERT, UPDATE ON reminder_preferences TO authenticated, anon;

DROP POLICY IF EXISTS "rem_pref_select_owner" ON reminder_preferences;
CREATE POLICY "rem_pref_select_owner"
ON reminder_preferences FOR SELECT TO authenticated
USING (EXISTS (SELECT 1 FROM pledges p JOIN education_goals g ON g.id = p.goal_id WHERE p.id = reminder_preferences.pledge_id AND g.user_id = auth.uid()));

DROP POLICY IF EXISTS "rem_pref_select_sponsor" ON reminder_preferences;
CREATE POLICY "rem_pref_select_sponsor"
ON reminder_preferences FOR SELECT TO anon, authenticated
USING (EXISTS (SELECT 1 FROM pledges p WHERE p.id = reminder_preferences.pledge_id AND p.sponsor_email = current_setting('app.sponsor_email', true)));

DROP POLICY IF EXISTS "rem_pref_insert_public" ON reminder_preferences;
CREATE POLICY "rem_pref_insert_public"
ON reminder_preferences FOR INSERT TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "rem_pref_update_owner" ON reminder_preferences;
CREATE POLICY "rem_pref_update_owner"
ON reminder_preferences FOR UPDATE TO authenticated
USING (EXISTS (SELECT 1 FROM pledges p JOIN education_goals g ON g.id = p.goal_id WHERE p.id = reminder_preferences.pledge_id AND g.user_id = auth.uid()));

DROP POLICY IF EXISTS "rem_pref_update_sponsor" ON reminder_preferences;
CREATE POLICY "rem_pref_update_sponsor"
ON reminder_preferences FOR UPDATE TO anon, authenticated
USING (EXISTS (SELECT 1 FROM pledges p WHERE p.id = reminder_preferences.pledge_id AND p.sponsor_email = current_setting('app.sponsor_email', true)));

-- ============================================================
-- reminder_events
-- ============================================================
CREATE TABLE IF NOT EXISTS reminder_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pledge_id uuid NOT NULL REFERENCES pledges(id) ON DELETE CASCADE,
  scheduled_date date NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','previewed','sent','failed')),
  channel text NOT NULL DEFAULT 'email',
  created_at timestamptz NOT NULL DEFAULT now(),
  sent_at timestamptz
);

CREATE INDEX IF NOT EXISTS idx_rem_events_pledge ON reminder_events(pledge_id);
CREATE INDEX IF NOT EXISTS idx_rem_events_date ON reminder_events(scheduled_date);

ALTER TABLE reminder_events ENABLE ROW LEVEL SECURITY;

GRANT SELECT ON reminder_events TO authenticated;

DROP POLICY IF EXISTS "rem_events_select_owner" ON reminder_events;
CREATE POLICY "rem_events_select_owner"
ON reminder_events FOR SELECT TO authenticated
USING (EXISTS (SELECT 1 FROM pledges p JOIN education_goals g ON g.id = p.goal_id WHERE p.id = reminder_events.pledge_id AND g.user_id = auth.uid()));

-- ============================================================
-- provider_accounts
-- ============================================================
CREATE TABLE IF NOT EXISTS provider_accounts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  provider_name text NOT NULL DEFAULT 'cowrywise',
  external_account_id text,
  verification_status text NOT NULL DEFAULT 'unverified' CHECK (verification_status IN ('unverified','pending','verified','rejected')),
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE provider_accounts ENABLE ROW LEVEL SECURITY;

GRANT SELECT ON provider_accounts TO authenticated;

DROP POLICY IF EXISTS "provider_acct_select_own" ON provider_accounts;
CREATE POLICY "provider_acct_select_own"
ON provider_accounts FOR SELECT TO authenticated
USING (auth.uid() = user_id);

-- ============================================================
-- provider_savings_plans
-- ============================================================
CREATE TABLE IF NOT EXISTS provider_savings_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  goal_id uuid REFERENCES education_goals(id) ON DELETE CASCADE,
  provider_account_id uuid REFERENCES provider_accounts(id) ON DELETE CASCADE,
  external_plan_id text,
  product_code text,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','active','completed','failed')),
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE provider_savings_plans ENABLE ROW LEVEL SECURITY;

GRANT SELECT ON provider_savings_plans TO authenticated;

DROP POLICY IF EXISTS "provider_plan_select_own" ON provider_savings_plans;
CREATE POLICY "provider_plan_select_own"
ON provider_savings_plans FOR SELECT TO authenticated
USING (auth.uid() = user_id);

-- ============================================================
-- provider_webhook_events
-- ============================================================
CREATE TABLE IF NOT EXISTS provider_webhook_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_name text NOT NULL,
  event_type text,
  external_event_id text,
  payload jsonb DEFAULT '{}'::jsonb,
  processed boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE provider_webhook_events ENABLE ROW LEVEL SECURITY;

-- No grants to anon/authenticated — service_role only

-- ============================================================
-- audit_events
-- ============================================================
CREATE TABLE IF NOT EXISTS audit_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  action text NOT NULL,
  target_type text,
  target_id uuid,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE audit_events ENABLE ROW LEVEL SECURITY;

-- No grants to anon/authenticated — service_role only

-- Triggers for new tables
DROP TRIGGER IF EXISTS rem_pref_updated_at ON reminder_preferences;
CREATE TRIGGER rem_pref_updated_at BEFORE UPDATE ON reminder_preferences
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS provider_acct_updated_at ON provider_accounts;
CREATE TRIGGER provider_acct_updated_at BEFORE UPDATE ON provider_accounts
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS provider_plan_updated_at ON provider_savings_plans;
CREATE TRIGGER provider_plan_updated_at BEFORE UPDATE ON provider_savings_plans
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
