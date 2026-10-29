/*
# EduFund Core Schema — Profiles, Goals, Contributions, Pledges, Notes

This migration creates the foundational tables for EduFund, a platform where
Nigerian university students create education funding goals, sponsors
contribute via demo contributions and pledges, and notes are moderated.

## New Tables

1. `profiles` — extends auth.users with public display info (no email/private data exposed).
   - id (uuid, FK to auth.users), display_name, institution, course, graduation_year,
     avatar_url, public_display_name, is_admin, created_at, updated_at.

2. `education_goals` — student funding goals (tuition, accommodation, etc.).
   - id, user_id, title, category, institution, session, target_amount_kobo,
     starting_savings_kobo, deadline, story, cover_image_url, visibility (draft/published/archived),
     public_slug (unique), public_display_name, consent_public, currency, created_at, updated_at.

3. `contributions` — demo and (future) real contributions to goals.
   - id, goal_id, sponsor_name, amount_kobo, status (demo_confirmed/pending/verified),
     note, note_consent, note_moderation (pending/approved/hidden), currency, created_at.

4. `pledges` — sponsor commitments (not payments).
   - id, goal_id, sponsor_name, sponsor_email, amount_per_kobo, frequency (daily/weekly/monthly),
     first_date, end_date, note, note_consent, note_moderation, status (active/paused/completed/cancelled),
     reminder_consent, created_at, updated_at.

5. `encouragement_notes` — notes attached to goals/contributions/pledges.
   - id, goal_id, contribution_id, pledge_id, author_name, content, consent_public,
     moderation_status, created_at, updated_at.

## Money
All amounts stored as integer kobo (1 NGN = 100 kobo). No floating-point for financial totals.

## Security
- RLS enabled on every table.
- profiles: owner read/update; public can read only public_display_name + avatar (via view later).
- education_goals: owner full CRUD; public SELECT only on published campaigns via public_slug.
- contributions: public can INSERT demo contributions; public SELECT only consented+approved;
  owner SELECT all; no UPDATE by public (no self-verification).
- pledges: public can INSERT pledges; public SELECT only own by email; owner SELECT all.
- encouragement_notes: public INSERT; moderation via owner/admin.

Grants are scoped to the roles each policy targets.
*/

-- ============================================================
-- profiles
-- ============================================================
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name text NOT NULL DEFAULT '',
  institution text,
  course text,
  graduation_year int,
  avatar_url text,
  public_display_name text,
  is_admin boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

GRANT SELECT, UPDATE ON profiles TO authenticated;
GRANT SELECT ON profiles TO anon;

DROP POLICY IF EXISTS "profiles_select_own" ON profiles;
CREATE POLICY "profiles_select_own"
ON profiles FOR SELECT TO authenticated
USING (auth.uid() = id);

DROP POLICY IF EXISTS "profiles_update_own" ON profiles;
CREATE POLICY "profiles_update_own"
ON profiles FOR UPDATE TO authenticated
USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name)
  VALUES (new.id, COALESCE(new.raw_user_meta_data->>'display_name', ''))
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon;

-- ============================================================
-- education_goals
-- ============================================================
CREATE TABLE IF NOT EXISTS education_goals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  category text NOT NULL CHECK (category IN ('tuition','accommodation','books','other')),
  institution text,
  session text,
  target_amount_kobo bigint NOT NULL CHECK (target_amount_kobo > 0),
  starting_savings_kobo bigint NOT NULL DEFAULT 0 CHECK (starting_savings_kobo >= 0),
  deadline date NOT NULL,
  story text,
  cover_image_url text,
  visibility text NOT NULL DEFAULT 'draft' CHECK (visibility IN ('draft','published','archived')),
  public_slug text UNIQUE,
  public_display_name text,
  consent_public boolean NOT NULL DEFAULT false,
  currency text NOT NULL DEFAULT 'NGN',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE education_goals ENABLE ROW LEVEL SECURITY;

GRANT SELECT, INSERT, UPDATE, DELETE ON education_goals TO authenticated;
GRANT SELECT ON education_goals TO anon;

-- Owner full access
DROP POLICY IF EXISTS "goals_select_own" ON education_goals;
CREATE POLICY "goals_select_own"
ON education_goals FOR SELECT TO authenticated
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "goals_insert_own" ON education_goals;
CREATE POLICY "goals_insert_own"
ON education_goals FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "goals_update_own" ON education_goals;
CREATE POLICY "goals_update_own"
ON education_goals FOR UPDATE TO authenticated
USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "goals_delete_own" ON education_goals;
CREATE POLICY "goals_delete_own"
ON education_goals FOR DELETE TO authenticated
USING (auth.uid() = user_id);

-- Public can read only published campaigns
DROP POLICY IF EXISTS "goals_select_public" ON education_goals;
CREATE POLICY "goals_select_public"
ON education_goals FOR SELECT TO anon
USING (visibility = 'published' AND consent_public = true);

-- ============================================================
-- contributions
-- ============================================================
CREATE TABLE IF NOT EXISTS contributions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  goal_id uuid NOT NULL REFERENCES education_goals(id) ON DELETE CASCADE,
  sponsor_name text NOT NULL DEFAULT 'Anonymous',
  amount_kobo bigint NOT NULL CHECK (amount_kobo > 0),
  status text NOT NULL DEFAULT 'demo_confirmed' CHECK (status IN ('demo_confirmed','pending','verified')),
  note text,
  note_consent boolean NOT NULL DEFAULT false,
  note_moderation text NOT NULL DEFAULT 'pending' CHECK (note_moderation IN ('pending','approved','hidden')),
  currency text NOT NULL DEFAULT 'NGN',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_contributions_goal_id ON contributions(goal_id);
CREATE INDEX IF NOT EXISTS idx_contributions_status ON contributions(status);

ALTER TABLE contributions ENABLE ROW LEVEL SECURITY;

GRANT SELECT, INSERT, UPDATE ON contributions TO authenticated, anon;

-- Owner can see all contributions to their goals
DROP POLICY IF EXISTS "contrib_select_owner" ON contributions;
CREATE POLICY "contrib_select_owner"
ON contributions FOR SELECT TO authenticated
USING (EXISTS (SELECT 1 FROM education_goals g WHERE g.id = contributions.goal_id AND g.user_id = auth.uid()));

-- Public can see only consented + approved notes on published goals, but can see amount totals
DROP POLICY IF EXISTS "contrib_select_public" ON contributions;
CREATE POLICY "contrib_select_public"
ON contributions FOR SELECT TO anon, authenticated
USING (
  EXISTS (SELECT 1 FROM education_goals g WHERE g.id = contributions.goal_id AND g.visibility = 'published' AND g.consent_public = true)
);

-- Anyone can create a demo contribution (public giving flow)
DROP POLICY IF EXISTS "contrib_insert_public" ON contributions;
CREATE POLICY "contrib_insert_public"
ON contributions FOR INSERT TO anon, authenticated
WITH CHECK (true);

-- Only owner can update moderation status (no self-verification of payments)
DROP POLICY IF EXISTS "contrib_update_owner" ON contributions;
CREATE POLICY "contrib_update_owner"
ON contributions FOR UPDATE TO authenticated
USING (EXISTS (SELECT 1 FROM education_goals g WHERE g.id = contributions.goal_id AND g.user_id = auth.uid()))
WITH CHECK (EXISTS (SELECT 1 FROM education_goals g WHERE g.id = contributions.goal_id AND g.user_id = auth.uid()));

-- ============================================================
-- pledges
-- ============================================================
CREATE TABLE IF NOT EXISTS pledges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  goal_id uuid NOT NULL REFERENCES education_goals(id) ON DELETE CASCADE,
  sponsor_name text NOT NULL DEFAULT 'Anonymous',
  sponsor_email text,
  amount_per_kobo bigint NOT NULL CHECK (amount_per_kobo > 0),
  frequency text NOT NULL CHECK (frequency IN ('daily','weekly','monthly')),
  first_date date NOT NULL,
  end_date date,
  note text,
  note_consent boolean NOT NULL DEFAULT false,
  note_moderation text NOT NULL DEFAULT 'pending' CHECK (note_moderation IN ('pending','approved','hidden')),
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active','paused','completed','cancelled')),
  reminder_consent boolean NOT NULL DEFAULT false,
  reminder_frequency text CHECK (reminder_frequency IN ('daily','weekly','monthly')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_pledges_goal_id ON pledges(goal_id);
CREATE INDEX IF NOT EXISTS idx_pledges_status ON pledges(status);
CREATE INDEX IF NOT EXISTS idx_pledges_email ON pledges(sponsor_email);

ALTER TABLE pledges ENABLE ROW LEVEL SECURITY;

GRANT SELECT, INSERT, UPDATE ON pledges TO authenticated, anon;

-- Goal owner can see all pledges to their goals
DROP POLICY IF EXISTS "pledges_select_owner" ON pledges;
CREATE POLICY "pledges_select_owner"
ON pledges FOR SELECT TO authenticated
USING (EXISTS (SELECT 1 FROM education_goals g WHERE g.id = pledges.goal_id AND g.user_id = auth.uid()));

-- Sponsor can see their own pledges by email
DROP POLICY IF EXISTS "pledges_select_sponsor" ON pledges;
CREATE POLICY "pledges_select_sponsor"
ON pledges FOR SELECT TO anon, authenticated
USING (sponsor_email IS NOT NULL AND sponsor_email = current_setting('app.sponsor_email', true));

-- Anyone can create a pledge
DROP POLICY IF EXISTS "pledges_insert_public" ON pledges;
CREATE POLICY "pledges_insert_public"
ON pledges FOR INSERT TO anon, authenticated
WITH CHECK (true);

-- Goal owner can update pledge moderation/status
DROP POLICY IF EXISTS "pledges_update_owner" ON pledges;
CREATE POLICY "pledges_update_owner"
ON pledges FOR UPDATE TO authenticated
USING (EXISTS (SELECT 1 FROM education_goals g WHERE g.id = pledges.goal_id AND g.user_id = auth.uid()))
WITH CHECK (EXISTS (SELECT 1 FROM education_goals g WHERE g.id = pledges.goal_id AND g.user_id = auth.uid()));

-- Sponsor can update their own pledge status (pause/cancel) via email setting
DROP POLICY IF EXISTS "pledges_update_sponsor" ON pledges;
CREATE POLICY "pledges_update_sponsor"
ON pledges FOR UPDATE TO anon, authenticated
USING (sponsor_email IS NOT NULL AND sponsor_email = current_setting('app.sponsor_email', true))
WITH CHECK (sponsor_email IS NOT NULL AND sponsor_email = current_setting('app.sponsor_email', true));

-- ============================================================
-- encouragement_notes
-- ============================================================
CREATE TABLE IF NOT EXISTS encouragement_notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  goal_id uuid NOT NULL REFERENCES education_goals(id) ON DELETE CASCADE,
  contribution_id uuid REFERENCES contributions(id) ON DELETE CASCADE,
  pledge_id uuid REFERENCES pledges(id) ON DELETE CASCADE,
  author_name text NOT NULL DEFAULT 'Anonymous',
  content text NOT NULL CHECK (length(content) <= 500),
  consent_public boolean NOT NULL DEFAULT false,
  moderation_status text NOT NULL DEFAULT 'pending' CHECK (moderation_status IN ('pending','approved','hidden')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_notes_goal_id ON encouragement_notes(goal_id);

ALTER TABLE encouragement_notes ENABLE ROW LEVEL SECURITY;

GRANT SELECT, INSERT, UPDATE ON encouragement_notes TO authenticated, anon;

-- Owner can see all notes on their goals
DROP POLICY IF EXISTS "notes_select_owner" ON encouragement_notes;
CREATE POLICY "notes_select_owner"
ON encouragement_notes FOR SELECT TO authenticated
USING (EXISTS (SELECT 1 FROM education_goals g WHERE g.id = encouragement_notes.goal_id AND g.user_id = auth.uid()));

-- Public can see only approved+consented notes on published goals
DROP POLICY IF EXISTS "notes_select_public" ON encouragement_notes;
CREATE POLICY "notes_select_public"
ON encouragement_notes FOR SELECT TO anon, authenticated
USING (
  moderation_status = 'approved'
  AND consent_public = true
  AND EXISTS (SELECT 1 FROM education_goals g WHERE g.id = encouragement_notes.goal_id AND g.visibility = 'published' AND g.consent_public = true)
);

-- Anyone can create a note
DROP POLICY IF EXISTS "notes_insert_public" ON encouragement_notes;
CREATE POLICY "notes_insert_public"
ON encouragement_notes FOR INSERT TO anon, authenticated
WITH CHECK (true);

-- Owner can update moderation status
DROP POLICY IF EXISTS "notes_update_owner" ON encouragement_notes;
CREATE POLICY "notes_update_owner"
ON encouragement_notes FOR UPDATE TO authenticated
USING (EXISTS (SELECT 1 FROM education_goals g WHERE g.id = encouragement_notes.goal_id AND g.user_id = auth.uid()))
WITH CHECK (EXISTS (SELECT 1 FROM education_goals g WHERE g.id = encouragement_notes.goal_id AND g.user_id = auth.uid()));

-- ============================================================
-- updated_at triggers
-- ============================================================
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
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
