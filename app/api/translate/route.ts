import { NextResponse } from 'next/server';
import { v2 } from '@google-cloud/translate';

const translate = new v2.Translate({
  key: process.env.GOOGLE_TRANSLATE_API_KEY
});

export async function POST(req: Request) {
  try {
    const { text } = await req.json();
    const [translation] = await translate.translate(text, 'ja');
    return NextResponse.json({ translation });
  } catch (error) {
    console.error('Translation error:', error);
    return NextResponse.json({ error: 'Translation failed' }, { status: 500 });
  }
}