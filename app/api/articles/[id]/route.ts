import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../lib/prisma';

export const GET = async (req: NextRequest, { params }: { params: { id: string } }) => {
  try {
    const id = parseInt(params.id);
    const article = await prisma.article.findUnique({ where: { id } });
    return NextResponse.json({ article });
  } catch (err) {
    return NextResponse.json({ message: "Error", err }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
};

export const DELETE = async (req: NextRequest, { params }: { params: { id: string } }) => {
  try {
    const id = parseInt(params.id);
    await prisma.article.delete({ where: { id } });
    return NextResponse.json({ message: 'Article deleted' }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ message: "Error", err }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
};

export const PUT = async (req: NextRequest, { params }: { params: { id: string } }) => {
  try {
    const id = parseInt(params.id);
    const { title, content, imageUrl } = await req.json();
    const updatedArticle = await prisma.article.update({
      where: { id },
      data: { title, content, imageUrl }
    });
    return NextResponse.json({ updatedArticle });
  } catch (err) {
    console.error('Error updating article:', err);
    return NextResponse.json({ message: "Error updating article", err }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
};