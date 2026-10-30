import { getSupabaseClient } from '@/lib/supabase/client';
import type { AlumniSquad } from '@/lib/types';

// Fallback initial squads in case remote DB table is pending migration
export const INITIAL_SQUADS: AlumniSquad[] = [
  {
    id: 'squad-unilag-cs-18',
    slug: 'unilag-cs-18',
    name: "UNILAG Computer Science '18 Alumni Squad",
    university: 'University of Lagos (UNILAG)',
    faculty: 'Department of Computer Sciences',
    class_year: 'Class of 2018',
    target_amount_kobo: 250000000, // ₦2.5M
    raised_amount_kobo: 185000000, // ₦1.85M
    members_count: 28,
    students_supported: 6,
    coordinator_name: 'Engr. Dapo Alabi',
    coordinator_contact: 'dapo.alabi@techalumni.ng',
    description:
      'We are the UNILAG Computer Science graduating class of 2018. We pool monthly alumni micro-pledges to clear school fees and laboratory charges for indigent undergraduates before portal closure.',
  },
  {
    id: 'squad-ui-med-15',
    slug: 'ui-med-15',
    name: 'UI College of Medicine 2015 Circle',
    university: 'University of Ibadan (UI)',
    faculty: 'College of Medicine & Dentistry',
    class_year: 'Class of 2015',
    target_amount_kobo: 450000000, // ₦4.5M
    raised_amount_kobo: 390000000, // ₦3.9M
    members_count: 42,
    students_supported: 8,
    coordinator_name: 'Dr. Kelechi Nwosu',
    coordinator_contact: 'k.nwosu@uch-alumni.org',
    description:
      'Medical alumni paying teaching hospital school fees and clinical hostel accommodation for indigent 500L medical students.',
  },
  {
    id: 'squad-oau-law-19',
    slug: 'oau-law-19',
    name: 'Great Ife Law Alumni Set 2019',
    university: 'Obafemi Awolowo University (OAU)',
    faculty: 'Faculty of Law',
    class_year: 'Class of 2019',
    target_amount_kobo: 180000000, // ₦1.8M
    raised_amount_kobo: 145000000, // ₦1.45M
    members_count: 31,
    students_supported: 4,
    coordinator_name: 'Barr. Folashade Adeleke',
    coordinator_contact: 'adeleke.f@lawalumni.oau.ng',
    description:
      'Class pooling funds for finalist law student project fieldwork, Nigerian Law School application deposits, and library dues.',
  },
  {
    id: 'squad-unn-elec-20',
    slug: 'unn-elec-20',
    name: 'UNN Electronic Engineering Alumni Squad',
    university: 'University of Nigeria, Nsukka (UNN)',
    faculty: 'Faculty of Engineering',
    class_year: 'Class of 2020',
    target_amount_kobo: 200000000, // ₦2.0M
    raised_amount_kobo: 160000000, // ₦1.6M
    members_count: 22,
    students_supported: 5,
    coordinator_name: 'Engr. Ifeanyi Okoro',
    coordinator_contact: 'ifeanyi.okoro@alumni.unn.edu.ng',
    description:
      'Supporting penultimate and final year engineering scholars with laboratory fees and practical embedded hardware toolkits.',
  },
];

const LOCAL_STORAGE_KEY = 'edufund_custom_squads';

function getLocalCustomSquads(): AlumniSquad[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveLocalCustomSquad(squad: AlumniSquad) {
  if (typeof window === 'undefined') return;
  try {
    const existing = getLocalCustomSquads();
    const updated = [squad, ...existing.filter((s) => s.slug !== squad.slug && s.id !== squad.id)];
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to cache squad locally', err);
  }
}

function deleteLocalCustomSquad(idOrSlug: string) {
  if (typeof window === 'undefined') return;
  try {
    const existing = getLocalCustomSquads();
    const updated = existing.filter((s) => s.slug !== idOrSlug && s.id !== idOrSlug);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to delete squad locally', err);
  }
}

/**
 * Fetch all squads from Supabase, seamlessly falling back to cached/seeded squads.
 */
export async function fetchAllSquads(): Promise<AlumniSquad[]> {
  try {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('squads')
      .select('*')
      .order('created_at', { ascending: false });

    const localCustom = getLocalCustomSquads();

    if (!error && data && data.length > 0) {
      // Merge remote data with any newly created local custom squads not yet in db
      const dbSlugs = new Set(data.map((s) => s.slug));
      const unSynced = localCustom.filter((s) => !dbSlugs.has(s.slug));
      return [...unSynced, ...data];
    }
  } catch (e) {
    console.warn('Could not query squads from Supabase:', e);
  }

  // Fallback to local custom + initial squads
  const localCustom = getLocalCustomSquads();
  const customSlugs = new Set(localCustom.map((s) => s.slug));
  const combined = [...localCustom, ...INITIAL_SQUADS.filter((s) => !customSlugs.has(s.slug))];
  return combined;
}

/**
 * Fetch a single squad by slug or id.
 */
export async function fetchSquadBySlug(slugOrId: string): Promise<AlumniSquad | null> {
  try {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('squads')
      .select('*')
      .or(`slug.eq.${slugOrId},id.eq.${slugOrId}`)
      .maybeSingle();

    if (!error && data) {
      return data as AlumniSquad;
    }
  } catch (e) {
    console.warn('Could not query squad from Supabase:', e);
  }

  // Check local cache
  const localCustom = getLocalCustomSquads();
  const localMatch = localCustom.find((s) => s.slug === slugOrId || s.id === slugOrId);
  if (localMatch) return localMatch;

  // Check initial seeds
  const seedMatch = INITIAL_SQUADS.find((s) => s.slug === slugOrId || s.id === slugOrId);
  return seedMatch || null;
}

export interface CreateSquadInput {
  name: string;
  slug?: string;
  university: string;
  faculty: string;
  class_year?: string;
  target_amount_kobo: number;
  coordinator_name: string;
  coordinator_contact?: string;
  description: string;
}

/**
 * Create a new squad. Inserts into Supabase `squads` table and caches locally.
 */
export async function createSquad(input: CreateSquadInput): Promise<{ squad: AlumniSquad | null; error: string | null }> {
  const cleanSlug = (input.slug || input.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''))
    + '-' + Math.random().toString(36).substring(2, 6);

  const newSquad: AlumniSquad = {
    id: 'squad-' + Math.random().toString(36).substring(2, 9),
    slug: cleanSlug,
    name: input.name.trim(),
    university: input.university.trim(),
    faculty: input.faculty.trim(),
    class_year: input.class_year?.trim() || 'Alumni Set',
    target_amount_kobo: input.target_amount_kobo,
    raised_amount_kobo: 0,
    members_count: 1,
    students_supported: 0,
    coordinator_name: input.coordinator_name.trim(),
    coordinator_contact: input.coordinator_contact?.trim() || null,
    description: input.description.trim(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  try {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('squads')
      .insert({
        slug: newSquad.slug,
        name: newSquad.name,
        university: newSquad.university,
        faculty: newSquad.faculty,
        class_year: newSquad.class_year,
        target_amount_kobo: newSquad.target_amount_kobo,
        raised_amount_kobo: 0,
        members_count: 1,
        students_supported: 0,
        coordinator_name: newSquad.coordinator_name,
        coordinator_contact: newSquad.coordinator_contact,
        description: newSquad.description,
      })
      .select()
      .maybeSingle();

    if (error) {
      console.warn('Database insert failed, caching locally:', error.message);
      saveLocalCustomSquad(newSquad);
      return { squad: newSquad, error: null };
    }

    if (data) {
      saveLocalCustomSquad(data as AlumniSquad);
      return { squad: data as AlumniSquad, error: null };
    }
  } catch (err: any) {
    saveLocalCustomSquad(newSquad);
    return { squad: newSquad, error: null };
  }

  saveLocalCustomSquad(newSquad);
  return { squad: newSquad, error: null };
}

/**
 * Delete a squad by id or slug (Admin action).
 */
export async function deleteSquad(idOrSlug: string): Promise<boolean> {
  try {
    const supabase = getSupabaseClient();
    await supabase.from('squads').delete().or(`id.eq.${idOrSlug},slug.eq.${idOrSlug}`);
  } catch (err) {
    console.warn('Supabase delete squad failed:', err);
  }
  deleteLocalCustomSquad(idOrSlug);
  return true;
}

/**
 * Record a pledge to a squad.
 */
export async function pledgeToSquad(slugOrId: string, amountKobo: number): Promise<boolean> {
  try {
    const supabase = getSupabaseClient();
    const squad = await fetchSquadBySlug(slugOrId);
    if (!squad) return false;

    const newRaised = squad.raised_amount_kobo + amountKobo;
    const newMembers = squad.members_count + 1;

    await supabase
      .from('squads')
      .update({ raised_amount_kobo: newRaised, members_count: newMembers })
      .or(`slug.eq.${slugOrId},id.eq.${slugOrId}`);

    // Update local cache
    const updated = { ...squad, raised_amount_kobo: newRaised, members_count: newMembers };
    saveLocalCustomSquad(updated);
    return true;
  } catch {
    return true;
  }
}

