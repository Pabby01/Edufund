export type GoalCategory = 'tuition' | 'accommodation' | 'books' | 'other';
export type GoalVisibility = 'draft' | 'published' | 'archived';
export type ContributionStatus = 'demo_confirmed' | 'pending' | 'verified';
export type NoteModeration = 'pending' | 'approved' | 'hidden';
export type PledgeFrequency = 'daily' | 'weekly' | 'monthly';
export type PledgeStatus = 'active' | 'paused' | 'completed' | 'cancelled';
export type VerificationStatus = 'unverified' | 'pending' | 'verified' | 'rejected';

export interface Profile {
  id: string;
  display_name: string;
  institution: string | null;
  course: string | null;
  graduation_year: number | null;
  avatar_url: string | null;
  public_display_name: string | null;
  is_admin: boolean;
  created_at: string;
  updated_at: string;
}

export interface EducationGoal {
  id: string;
  user_id: string;
  title: string;
  category: GoalCategory;
  institution: string | null;
  session: string | null;
  target_amount_kobo: number;
  starting_savings_kobo: number;
  deadline: string;
  story: string | null;
  cover_image_url: string | null;
  visibility: GoalVisibility;
  public_slug: string | null;
  public_display_name: string | null;
  consent_public: boolean;
  currency: string;
  created_at: string;
  updated_at: string;
}

export interface Contribution {
  id: string;
  goal_id: string;
  sponsor_name: string;
  amount_kobo: number;
  status: ContributionStatus;
  note: string | null;
  note_consent: boolean;
  note_moderation: NoteModeration;
  currency: string;
  created_at: string;
}

export interface Pledge {
  id: string;
  goal_id: string;
  sponsor_name: string;
  sponsor_email: string | null;
  amount_per_kobo: number;
  frequency: PledgeFrequency;
  first_date: string;
  end_date: string | null;
  note: string | null;
  note_consent: boolean;
  note_moderation: NoteModeration;
  status: PledgeStatus;
  reminder_consent: boolean;
  reminder_frequency: PledgeFrequency | null;
  created_at: string;
  updated_at: string;
}

export interface EncouragementNote {
  id: string;
  goal_id: string;
  contribution_id: string | null;
  pledge_id: string | null;
  author_name: string;
  content: string;
  consent_public: boolean;
  moderation_status: NoteModeration;
  created_at: string;
  updated_at: string;
}

export interface PledgeSchedule {
  id: string;
  pledge_id: string;
  goal_id: string;
  scheduled_date: string;
  amount_kobo: number;
  status: 'scheduled' | 'skipped' | 'completed';
  created_at: string;
}

export interface ReminderPreference {
  id: string;
  pledge_id: string;
  reminder_frequency: PledgeFrequency | null;
  consent: boolean;
  opted_out: boolean;
  created_at: string;
  updated_at: string;
}

export interface ReminderEvent {
  id: string;
  pledge_id: string;
  scheduled_date: string;
  status: 'pending' | 'previewed' | 'sent' | 'failed';
  channel: string;
  created_at: string;
  sent_at: string | null;
}

export interface ProviderAccount {
  id: string;
  user_id: string;
  provider_name: string;
  external_account_id: string | null;
  verification_status: VerificationStatus;
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}
