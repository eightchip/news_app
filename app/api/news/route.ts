import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q') || '';
  const sources = searchParams.get('sources') || '';
  const sortBy = searchParams.get('sortBy') || 'publishedAt';
  const sortOrder = searchParams.get('sortOrder') || 'desc';
  const apiKey = process.env.NEXT_PUBLIC_NEWS_API_KEY;

  const res = await fetch(`https://newsapi.org/v2/everything?q=${query}&sources=${sources}&sortBy=${sortBy}&language=en&apiKey=${apiKey}`);
  const data = await res.json();

  // クライアントサイドでソートするためのロジック
  if (sortBy === 'source') {
    data.articles.sort((a: { source: { name: string } }, b: { source: { name: string } }) => {
      const comparison = a.source.name.localeCompare(b.source.name);
      return sortOrder === 'asc' ? comparison : -comparison;
    });
  }

  return NextResponse.json(data);
}