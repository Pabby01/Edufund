'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { getSupabaseClient } from '@/lib/supabase/client';
import { Profile } from '@/lib/types';

export const ADMIN_EMAILS: readonly string[] = [
  'adeolalasisi6@gmail.com',
];

export function isUserAdmin(email?: string | null, profileIsAdmin?: boolean): boolean {
  if (profileIsAdmin) return true;
  if (!email) return false;
  return ADMIN_EMAILS.includes(email.trim().toLowerCase());
}

interface AuthContextValue {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (email: string, password: string, displayName: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function syncAuthCookies(session: Session | null) {
  if (typeof document === 'undefined') return;
  if (session?.access_token) {
    const maxAge = 60 * 60 * 24 * 7; // 7 days
    document.cookie = `sb-access-token=${session.access_token}; path=/; max-age=${maxAge}; SameSite=Lax`;
    document.cookie = `edufund-auth=1; path=/; max-age=${maxAge}; SameSite=Lax`;
    if (session.refresh_token) {
      document.cookie = `sb-refresh-token=${session.refresh_token}; path=/; max-age=${maxAge}; SameSite=Lax`;
    }
  } else {
    document.cookie = 'sb-access-token=; path=/; max-age=0; SameSite=Lax';
    document.cookie = 'edufund-auth=; path=/; max-age=0; SameSite=Lax';
    document.cookie = 'sb-refresh-token=; path=/; max-age=0; SameSite=Lax';
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const supabase = getSupabaseClient();
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const loadProfile = useCallback(async (uid: string, userEmail?: string | null) => {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', uid)
      .maybeSingle();

    const isAdmin = isUserAdmin(userEmail, (data as Profile | null)?.is_admin);

    if (data) {
      const enriched: Profile = {
        ...(data as Profile),
        is_admin: isAdmin,
      };

      // If user is designated as admin by email but DB record hasn't updated yet, sync to DB
      if (isAdmin && !data.is_admin) {
        supabase.from('profiles').update({ is_admin: true }).eq('id', uid).then();
      }

      setProfile(enriched);
    } else if (userEmail) {
      // Fallback: profile row does not exist yet for this user
      const newProfile: Partial<Profile> = {
        id: uid,
        display_name: userEmail.split('@')[0],
        is_admin: isAdmin,
      };
      await supabase.from('profiles').upsert(newProfile);
      setProfile({
        id: uid,
        display_name: userEmail.split('@')[0],
        institution: null,
        course: null,
        graduation_year: null,
        avatar_url: null,
        public_display_name: null,
        is_admin: isAdmin,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
    } else {
      setProfile(null);
    }
  }, [supabase]);

  const refreshProfile = useCallback(async () => {
    if (user) {
      await loadProfile(user.id, user.email);
    }
  }, [user, loadProfile]);

  useEffect(() => {
    let mounted = true;

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!mounted) return;
      setSession(session);
      setUser(session?.user ?? null);
      syncAuthCookies(session);
      if (session?.user) {
        loadProfile(session.user.id, session.user.email).finally(() => {
          if (mounted) setLoading(false);
        });
      } else {
        setLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      (async () => {
        setSession(session);
        setUser(session?.user ?? null);
        syncAuthCookies(session);
        if (session?.user) {
          await loadProfile(session.user.id, session.user.email);
        } else {
          setProfile(null);
        }
        setLoading(false);
      })();
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [supabase, loadProfile]);

  const signIn = useCallback(async (email: string, password: string) => {
    const { error, data } = await supabase.auth.signInWithPassword({ email, password });
    if (data?.session) {
      syncAuthCookies(data.session);
    }
    return { error: error?.message ?? null };
  }, [supabase]);

  const signUp = useCallback(async (email: string, password: string, displayName: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { display_name: displayName } },
    });
    if (error) return { error: error.message };
    if (data?.session) {
      syncAuthCookies(data.session);
    }
    if (data.user) {
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({ id: data.user.id, display_name: displayName });
      if (profileError) {
        // profile trigger should handle it, but upsert as fallback
      }
    }
    return { error: null };
  }, [supabase]);

  const signOut = useCallback(async () => {
    syncAuthCookies(null);
    await supabase.auth.signOut();
    setSession(null);
    setUser(null);
    setProfile(null);
  }, [supabase]);

  return (
    <AuthContext.Provider value={{ session, user, profile, loading, signIn, signUp, signOut, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
