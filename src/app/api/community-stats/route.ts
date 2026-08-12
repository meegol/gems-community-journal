import { NextResponse } from 'next/server';
import { getDbCommunityStats } from '@/lib/db';
import { isSupabaseConfigured, supabase } from '@/lib/supabase';

export async function GET() {
  if (isSupabaseConfigured()) {
    const { data, error } = await supabase.rpc('get_community_aggregate_stats');
    if (!error && data && data.length > 0) {
      return NextResponse.json({
        privacyGuaranteed: true,
        stats: data[0],
      });
    }
  }

  const localStats = getDbCommunityStats();
  return NextResponse.json(localStats);
}
