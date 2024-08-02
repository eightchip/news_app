//app/api/articles/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../lib/prisma';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
  }

  try {
    const articles = await prisma.article.findMany({
      where: { userId: userId },
      orderBy: { publishedAt: 'desc' }, // 正しいフィールド名に変更
    });

    return NextResponse.json(articles);
  } catch (error) {
    console.error('記事取得エラー:', error);
    return NextResponse.json({ error: '記事の取得に失敗しました' }, { status: 500 });
  }
}

export const POST = async (req: NextRequest) => {
  const supabase = createRouteHandlerClient({ cookies: () => req.cookies as any });

  try {
    // セッションの確認
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return new Response(JSON.stringify({ error: '認証されていません' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const { title, description, url, imageUrl } = await req.json();
    const userId = session.user.id;

    console.log('受け取ったデータ:', { title, description, url, imageUrl, userId });

    const newArticle = await prisma.article.create({
      data: {
        title,
        description,
        url,
        imageUrl,
        userId: userId, // String型からNumber型に変換
        source: 'User Input',
      },
    });

    console.log('作成された記事:', newArticle);

    return NextResponse.json(newArticle);
  } catch (err) {
    console.error('記事作成エラー:', err);
    return NextResponse.json({ message: "Error", err }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
};