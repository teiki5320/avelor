import { NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase';

export const revalidate = 300;

export async function GET() {
  const sb = getSupabase();
  if (!sb) {
    return NextResponse.json({ count: 0 });
  }
  try {
    const { count, error } = await sb
      .from('fiches')
      .select('*', { count: 'exact', head: true });
    if (error) return NextResponse.json({ count: 0 });
    return NextResponse.json({ count: count ?? 0 });
  } catch {
    return NextResponse.json({ count: 0 });
  }
}
