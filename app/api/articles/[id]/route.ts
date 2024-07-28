import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../lib/prisma';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export const GET = async (req: NextRequest, { params }: { params: { id: string } }) => {
  const supabase = createRouteHandlerClient({ cookies });
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json({ error: '認証されていません' }, { status: 401 });
    }

    const articleId = parseInt(params.id);
    const article = await prisma.article.findUnique({
      where: { id: articleId, userId: session.user.id },
    });

    if (!article) {
      return NextResponse.json({ error: '記事が見つかりません' }, { status: 404 });
    }

    return NextResponse.json(article);
  } catch (error) {
    console.error('記事取得エラー:', error);
    return NextResponse.json({ error: 'サーバーエラー' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
};

export const DELETE = async (req: NextRequest, { params }: { params: { id: string } }) => {
  const supabase = createRouteHandlerClient({ cookies });
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json({ error: '認証されていません' }, { status: 401 });
    }

    const articleId = parseInt(params.id);
    const deletedArticle = await prisma.article.delete({
      where: { id: articleId, userId: session.user.id },
    });

    return NextResponse.json(deletedArticle);
  } catch (error) {
    console.error('記事削除エラー:', error);
    return NextResponse.json({ error: 'サーバーエラー' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
};

export const PUT = async (req: NextRequest, { params }: { params: { id: string } }) => {
  const supabase = createRouteHandlerClient({ cookies });
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json({ error: '認証されていません' }, { status: 401 });
    }

    const articleId = parseInt(params.id);
    const { title, description, url, imageUrl } = await req.json();
    const updatedArticle = await prisma.article.update({
      where: { id: articleId, userId: session.user.id },
      data: { title, description, url, imageUrl }
    });
    return NextResponse.json(updatedArticle);
  } catch (error) {
    console.error('記事更新エラー:', error);
    return NextResponse.json({ error: 'サーバーエラー' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
};