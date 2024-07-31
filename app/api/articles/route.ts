//app/api/articles/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../lib/prisma';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';


export const GET = async (req: NextRequest) => {
  const supabase = createRouteHandlerClient({ cookies });
  
  try {
    const { data: { session } } = await supabase.auth.getSession();
    console.log('APIルート - セッション:', session);

    const userId = session?.user?.id;
    console.log('APIルート - ユーザーID:', userId);

    if (!userId) {
      return NextResponse.json({ error: '認証されていません' }, { status: 401 });
    }

    const articles = await prisma.article.findMany({
      where: { userId: userId },
      include: { wordLists: true },
      orderBy: { publishedAt: 'desc' },
    });

    console.log('APIルート - 取得した記事数:', articles.length);
    return NextResponse.json(articles);
  } catch (error) {
    console.error('APIルート - 記事取得エラー:', error);
    return NextResponse.json({ error: 'サーバーエラー' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
};

export const POST = async (req: NextRequest) => {
  const supabase = createRouteHandlerClient({ cookies });

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