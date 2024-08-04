import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function GET() {
  const supabase = createRouteHandlerClient({ cookies });

  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data: wordLists, error } = await supabase
    .from('WordList')
    .select(`
      id,
      words,
      articleId,
      article:Article (
        title,
        description
      )
    `)
    .not('words', 'is', null)
    .not('words', 'eq', '{}')
    .order('id', { ascending: false });

  if (error) {
    console.error('Error fetching word lists:', error);
    return NextResponse.json({ error: error.message, details: error }, { status: 500 });
  }

  return NextResponse.json(wordLists);
}