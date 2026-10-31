import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

const FALLBACK_SUPABASE_URL = 'https://jmsaaltnmneujqtccpxx.supabase.co';
const FALLBACK_SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imptc2FhbHRubW5ldWpxdGNjcHh4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTMyODMyMjMsImV4cCI6MjEwODg1OTIyM30.HliproMNLwXedRVr4ETMfimsj1k_DTM8Cf4RMQTrP8k';

export async function getServerSupabase() {
  const cookieStore = cookies();
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || FALLBACK_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || FALLBACK_SUPABASE_ANON_KEY;

  const supabase = createClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      auth: {
        persistSession: false,
      },
    }
  );

  // Restore session from cookies
  const authCookie = cookieStore.get('sb-access-token');
  if (authCookie) {
    await supabase.auth.setSession({
      access_token: authCookie.value,
      refresh_token: cookieStore.get('sb-refresh-token')?.value || '',
    });
  }

  return supabase;
}

export function getServerSupabaseAdmin() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || FALLBACK_SUPABASE_URL;
  const serviceRoleKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    FALLBACK_SUPABASE_ANON_KEY;

  return createClient(
    supabaseUrl,
    serviceRoleKey,
    {
      auth: {
        persistSession: false,
      },
    }
  );
}
