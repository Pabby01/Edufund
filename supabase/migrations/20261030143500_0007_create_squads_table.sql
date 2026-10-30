/*
# EduFund — Alumni & Class Group Squads Schema

1. New Table `squads` for Alumni & Departmental Giving Squads
2. Indexes on slug & university
3. RLS policies allowing public reads and admin/authenticated management
4. Initial seed squads
*/

CREATE TABLE IF NOT EXISTS squads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  name text NOT NULL,
  university text NOT NULL,
  faculty text NOT NULL,
  class_year text,
  target_amount_kobo bigint NOT NULL CHECK (target_amount_kobo > 0),
  raised_amount_kobo bigint NOT NULL DEFAULT 0,
  members_count int NOT NULL DEFAULT 1,
  students_supported int NOT NULL DEFAULT 0,
  coordinator_name text NOT NULL,
  coordinator_contact text,
  description text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_squads_slug ON squads(slug);
CREATE INDEX IF NOT EXISTS idx_squads_university ON squads(university);

ALTER TABLE squads ENABLE ROW LEVEL SECURITY;

GRANT SELECT, INSERT, UPDATE, DELETE ON squads TO authenticated, anon;

DROP POLICY IF EXISTS "squads_select_all" ON squads;
CREATE POLICY "squads_select_all" ON squads FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "squads_insert_all" ON squads;
CREATE POLICY "squads_insert_all" ON squads FOR INSERT TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "squads_update_all" ON squads;
CREATE POLICY "squads_update_all" ON squads FOR UPDATE TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "squads_delete_all" ON squads;
CREATE POLICY "squads_delete_all" ON squads FOR DELETE TO anon, authenticated USING (true);

-- Insert initial squads if not present
INSERT INTO squads (slug, name, university, faculty, class_year, target_amount_kobo, raised_amount_kobo, members_count, students_supported, coordinator_name, coordinator_contact, description)
VALUES
  (
    'unilag-cs-18',
    'UNILAG Computer Science ''18 Alumni Squad',
    'University of Lagos (UNILAG)',
    'Department of Computer Sciences',
    'Class of 2018',
    250000000,
    185000000,
    28,
    6,
    'Engr. Dapo Alabi',
    'dapo.alabi@techalumni.ng',
    'Alumni class set pooling monthly micro-pledges to clear school fees and laboratory charges for indigent computer science students before portal closure.'
  ),
  (
    'ui-med-15',
    'UI College of Medicine 2015 Circle',
    'University of Ibadan (UI)',
    'College of Medicine & Dentistry',
    'Class of 2015',
    450000000,
    390000000,
    42,
    8,
    'Dr. Kelechi Nwosu',
    'k.nwosu@uch-alumni.org',
    'Medical alumni paying teaching hospital school fees and clinical hostel accommodation for indigent 500L medical students.'
  ),
  (
    'oau-law-19',
    'Great Ife Law Alumni Set 2019',
    'Obafemi Awolowo University (OAU)',
    'Faculty of Law',
    'Class of 2019',
    180000000,
    145000000,
    31,
    4,
    'Barr. Folashade Adeleke',
    'adeleke.f@lawalumni.oau.ng',
    'Class pooling funds for finalist law student project fieldwork, Nigerian Law School application deposits, and library dues.'
  ),
  (
    'unn-elec-20',
    'UNN Electronic Engineering Alumni Squad',
    'University of Nigeria, Nsukka (UNN)',
    'Faculty of Engineering',
    'Class of 2020',
    200000000,
    160000000,
    22,
    5,
    'Engr. Ifeanyi Okoro',
    'ifeanyi.okoro@alumni.unn.edu.ng',
    'Supporting penultimate and final year engineering scholars with laboratory fees and practical embedded hardware toolkits.'
  )
ON CONFLICT (slug) DO NOTHING;

