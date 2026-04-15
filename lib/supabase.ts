import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { FicheRecord } from './types';

let cached: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient | null {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  if (cached) return cached;
  cached = createClient(url, key, { auth: { persistSession: false } });
  return cached;
}

export async function saveFiche(fiche: FicheRecord): Promise<boolean> {
  const sb = getSupabase();
  if (!sb) return false;
  try {
    const { error } = await sb.from('fiches').insert({
      token: fiche.token,
      siret: fiche.siret,
      reponses: fiche.reponses,
      company_data: fiche.company_data,
      email: fiche.email ?? null,
    });
    return !error;
  } catch {
    return false;
  }
}

export async function getFicheByToken(token: string): Promise<FicheRecord | null> {
  const sb = getSupabase();
  if (!sb) return null;
  try {
    const { data, error } = await sb
      .from('fiches')
      .select('*')
      .eq('token', token)
      .maybeSingle();
    if (error || !data) return null;
    return data as FicheRecord;
  } catch {
    return null;
  }
}

export async function updateFicheEmail(token: string, email: string): Promise<boolean> {
  const sb = getSupabase();
  if (!sb) return false;
  try {
    const { error } = await sb.from('fiches').update({ email }).eq('token', token);
    return !error;
  } catch {
    return false;
  }
}
