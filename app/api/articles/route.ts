import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../lib/prisma';

export const GET = async (req: NextRequest) => {
  try {
    const articles = await prisma.article.findMany();
    return NextResponse.json(articles);
  } catch (err) {
    return NextResponse.json({ message: "Error", err }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
};

export const POST = async (req: NextRequest) => {
  try {
    const { title, content, imageUrl, userId } = await req.json();
    const newArticle = await prisma.article.create({
      data: {
        title,
        content,
        imageUrl,
        userId,
      },
    });
    return NextResponse.json(newArticle);
  } catch (err) {
    return NextResponse.json({ message: "Error", err }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
};
