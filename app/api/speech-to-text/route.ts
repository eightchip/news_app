import { NextRequest, NextResponse } from 'next/server';
import { SpeechClient } from '@google-cloud/speech';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const audio = formData.get('audio') as Blob;
    const language = formData.get('language') as string;

    console.log('Received audio:', audio);
    console.log('Received audio type:', audio.type);
    console.log('Received audio size:', audio.size);
    console.log('Language:', language);

    const credentials = JSON.parse(Buffer.from(process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON!, 'base64').toString());
    const client = new SpeechClient({ credentials });

    const audioBytes = await audio.arrayBuffer();
    const audioContent = Buffer.from(audioBytes).toString('base64');

    console.log('Audio content (base64):', audioContent);

    const [response] = await client.recognize({
      audio: { content: audioContent },
      config: {
        encoding: 'WEBM_OPUS',
        sampleRateHertz: 48000,
        languageCode: language,
        audioChannelCount: 1,
        enableAutomaticPunctuation: true,
        model: 'default',
      },
    });

    console.log('Speech-to-Text response:', response);

    const transcription = response.results
      ?.map(result => result.alternatives?.[0].transcript)
      .join('\n');

    console.log('Transcription:', transcription);

    return NextResponse.json({ text: transcription });
  } catch (error) {
    console.error('音声認識エラー:', error);
    return NextResponse.json({ error: '音声認識処理に失敗しました' }, { status: 500 });
  }
}