import { NextRequest, NextResponse } from 'next/server';
import { Translate } from '@google-cloud/translate/build/src/v2';

export async function POST(req: NextRequest) {
  try {
    const { text, sourceLanguage, targetLanguage } = await req.json();

    // 言語コードをGoogle Translate APIの形式に変換
    const languageMap: { [key: string]: string } = {
      'ja': 'ja',
      'en-US': 'en',
      'en-GB': 'en',
      'ko': 'ko',
      'zh-CN': 'zh-CN',
      'zh-HK': 'zh-TW',  // 香港の中国語は繁体字なので zh-TW を使用
      'th': 'th',
      'id': 'id',
      'hi': 'hi',
      'vi': 'vi'
    };

    const credentials = JSON.parse(Buffer.from(process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON!, 'base64').toString());
    const translate = new Translate({ credentials });

    // グローバルトーク用の処理
    if (sourceLanguage && targetLanguage) {
      const [translation] = await translate.translate(text, {
        from: languageMap[sourceLanguage] || sourceLanguage,
        to: languageMap[targetLanguage] || targetLanguage,
      });
      return NextResponse.json({ translation, targetLanguage });
    } 
    // 記事編集ページ用の処理（日本語への翻訳）
    else {
      const [translation] = await translate.translate(text, {
        from: 'en',
        to: 'ja',
      });
      return NextResponse.json({ translation });
    }
  } catch (error) {
    console.error('翻訳エラー:', error);
    return NextResponse.json({ error: '翻訳処理に失敗しました' }, { status: 500 });
  }
}