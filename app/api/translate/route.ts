import { NextRequest, NextResponse } from 'next/server';
import { Translate } from '@google-cloud/translate/build/src/v2';

export async function POST(req: NextRequest) {
  console.log('Translation request received');
  try {
    const { text, sourceLanguage, targetLanguage } = await req.json();
    console.log('Request body:', { text, sourceLanguage, targetLanguage });

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

    console.time('translation');
    let translation;
    // グローバルトーク用の処理
    if (sourceLanguage && targetLanguage) {
      [translation] = await Promise.race([
        translate.translate(text, {
          from: languageMap[sourceLanguage] || sourceLanguage,
          to: languageMap[targetLanguage] || targetLanguage,
        }),
        new Promise((_, reject) => setTimeout(() => reject(new Error('Translation timeout')), 20000))
      ]);
    } 
    // 記事編集ページ用の処理（日本語への翻訳）
    else {
      [translation] = await Promise.race([
        translate.translate(text, {
          from: 'en',
          to: 'ja',
        }),
        new Promise((_, reject) => setTimeout(() => reject(new Error('Translation timeout')), 20000))
      ]);
    }
    console.timeEnd('translation');

    console.log('Translation completed');
    return NextResponse.json({ translation, targetLanguage });
  } catch (error) {
    console.error('翻訳エラー:', error);
    if (error instanceof Error) {
      return NextResponse.json({ error: `翻訳処理に失敗しました: ${error.message}` }, { status: 500 });
    } else {
      return NextResponse.json({ error: '翻訳処理に失敗しました' }, { status: 500 });
    }
  }
}