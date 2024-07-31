import { NextRequest, NextResponse } from 'next/server';
import { textToSpeech } from '../../lib/textToSpeech';

export async function POST(req: NextRequest) {
  try {
    const { text, language } = await req.json();
    
    if (!text || !language) {
      return NextResponse.json({ error: 'Text and language are required' }, { status: 400 });
    }

    const audioContent = await textToSpeech(text, language);
    return new NextResponse(audioContent, {
      status: 200,
      headers: {
        'Content-Type': 'audio/mp3',
      },
    });
  } catch (error) {
    console.error('Text-to-Speech error:', error);
    return NextResponse.json({ error: 'Failed to synthesize speech' }, { status: 500 });
  }
}