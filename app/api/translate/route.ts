import { NextRequest, NextResponse } from 'next/server';
import { Translate } from '@google-cloud/translate/build/src/v2';

export async function POST(req: NextRequest) {
  try {
    const { text, sourceLanguage, targetLanguage } = await req.json();

    const credentials = JSON.parse(Buffer.from(process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON!, 'base64').toString());
    const translate = new Translate({ credentials });

    const [translation] = await translate.translate(text, {
      from: sourceLanguage,
      to: targetLanguage,
    });

    return NextResponse.json({ translation });
  } catch (error) {
    console.error('翻訳エラー:', error);
    return NextResponse.json({ error: '翻訳処理に失敗しました' }, { status: 500 });
  }
}