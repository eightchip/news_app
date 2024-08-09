// lib/speechToText
import { NextRequest, NextResponse } from 'next/server';
import { SpeechClient } from '@google-cloud/speech';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const audio = formData.get('audio') as Blob;
    const language = formData.get('language') as string;

    const credentials = JSON.parse(Buffer.from(process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON!, 'base64').toString());
    const client = new SpeechClient({ credentials });

    const audioBytes = await audio.arrayBuffer();
    const audioContent = Buffer.from(audioBytes).toString('base64');

    const [response] = await client.recognize({
      audio: { content: audioContent },
      config: {
        encoding: 'LINEAR16',
        sampleRateHertz: 48000,
        languageCode: language,
      },
    });

    const transcription = response.results
      ?.map(result => result.alternatives?.[0].transcript)
      .join('\n');

    return NextResponse.json({ text: transcription });
  } catch (error) {
    console.error('Speech-to-Text error:', error);
    return NextResponse.json({ error: 'Speech-to-Text processing failed' }, { status: 500 });
  }
}