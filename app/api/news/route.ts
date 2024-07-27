import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q') || '';
  const apiKey = process.env.NEXT_PUBLIC_NEWS_API_KEY;

  const res = await fetch(`https://newsapi.org/v2/everything?q=${query}&apiKey=${apiKey}`);
  const data = await res.json();

  return NextResponse.json(data);
}