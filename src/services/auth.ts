import { supabase } from './supabase';
import type { Profile } from '@/types';

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  if (!data.user) throw new Error('Login failed — no user returned');

  // Verify admin role
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('id, email, full_name, phone, avatar_url, role, created_at, updated_at')
    .eq('id', data.user.id)
    .single();

  if (profileError) throw profileError;

  const p = profile as Profile;
  if (p.role !== 'admin') {
    await supabase.auth.signOut();
    throw new Error('Access denied — admin only');
  }

  return { user: data.user, session: data.session, profile: p };
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function getSession() {
  const { data: { session }, error } = await supabase.auth.getSession();
  if (error) throw error;
  return session;
}

export async function getProfile(userId: string): Promise<Profile> {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, email, full_name, phone, avatar_url, role, created_at, updated_at')
    .eq('id', userId)
    .single();

  if (error) throw error;
  return data as Profile;
}

export function onAuthStateChange(callback: (event: string, session: unknown) => void) {
  return supabase.auth.onAuthStateChange(callback);
}
