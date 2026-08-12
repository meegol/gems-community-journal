import { NextResponse } from 'next/server';
import { getDbPosts, saveDbPost } from '@/lib/db';
import { isSupabaseConfigured, supabase } from '@/lib/supabase';
import { CommunityPost } from '@/lib/types';

export async function GET() {
  if (isSupabaseConfigured()) {
    const { data, error } = await supabase
      .from('community_posts')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      return NextResponse.json({ posts: data });
    }
  }

  const posts = getDbPosts();
  return NextResponse.json({ posts });
}

export async function POST(request: Request) {
  try {
    const post: CommunityPost = await request.json();

    if (isSupabaseConfigured()) {
      const { data, error } = await supabase.from('community_posts').insert([
        {
          id: post.id,
          user_id: post.userId,
          user_name: post.userName,
          user_avatar: post.userAvatar,
          anonymized_handle: post.anonymizedHandle,
          date: post.date,
          title: post.title,
          instrument: post.instrument,
          direction: post.direction,
          realized_pnl: post.realizedPnL,
          realized_rr: post.realizedRR,
          screenshots: post.screenshots,
          setup_tag: post.setupTag,
          notes: post.notes,
          likes_count: post.likesCount,
          comments_count: post.commentsCount,
        },
      ]).select();

      if (!error && data) {
        return NextResponse.json({ success: true, post: data[0] });
      }
    }

    const updated = saveDbPost(post);
    return NextResponse.json({ success: true, posts: updated });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
