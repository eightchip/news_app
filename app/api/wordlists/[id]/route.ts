import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export const GET = async (req: NextRequest, { params }: { params: { id: string } }) => {
  const supabase = createRouteHandlerClient({ cookies });
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json({ error: '認証されていません' }, { status: 401 });
    }

    const wordList = await prisma.wordList.findFirst({
      where: { articleId: parseInt(params.id) },
    });

    if (!wordList) {
      return NextResponse.json({ error: '単語リストが見つかりません' }, { status: 404 });
    }

    return NextResponse.json(wordList);
  } catch (error) {
    console.error('単語リスト取得エラー:', error);
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

    const { words } = await req.json();
    const wordList = await prisma.wordList.findFirst({
      where: { articleId: parseInt(params.id) },
    });

    if (!wordList) {
      return NextResponse.json({ error: '単語リストが見つかりません' }, { status: 404 });
    }

    const updatedWordList = await prisma.wordList.update({
      where: { id: wordList.id }, // idを使用して更新
      data: { words },
    });

    return NextResponse.json(updatedWordList);
  } catch (error) {
    console.error('単語リスト更新エラー:', error);
    return NextResponse.json({ error: 'サーバーエラー' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
};

// DELETE メソッドの追加
export const DELETE = async (req: NextRequest, { params }: { params: { id: string } }) => {
  const supabase = createRouteHandlerClient({ cookies });
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json({ error: '認証されていません' }, { status: 401 });
    }

    await prisma.wordList.deleteMany({
      where: { articleId: parseInt(params.id) },
    });

    return NextResponse.json({ message: '単語リストが正常に削除されました' });
  } catch (error) {
    console.error('単語リスト削除エラー:', error);
    return NextResponse.json({ error: 'サーバーエラー' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
};