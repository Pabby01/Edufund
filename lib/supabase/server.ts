import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

export async function getServerSupabase() {
  const cookieStore = cookies();
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
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
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        persistSession: false,
      },
    }
  );
}
