// app/api/wordlists/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '../lib/prisma';

export async function POST(request: Request) {
  const { articleId, words } = await request.json();
  const wordList = await prisma.WordList.create({
    data: {
      articleId,
      words,
    },
  });
  return NextResponse.json(wordList);
}