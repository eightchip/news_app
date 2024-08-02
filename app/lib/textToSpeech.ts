// app/lib/textToSpeech
'use server'
import { TextToSpeechClient } from '@google-cloud/text-to-speech';

export async function textToSpeech(text: string, language: string = 'en-US'): Promise<Uint8Array> {
  let credentials;
  if (process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON) {
    credentials = JSON.parse(Buffer.from(process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON, 'base64').toString());
  }

  const client = new TextToSpeechClient({ credentials });
  
  console.log('Synthesizing speech with language:', language); // Added for debugging

  const [response] = await client.synthesizeSpeech({
    input: { text },
    voice: { languageCode: language, ssmlGender: 'NEUTRAL' },
    audioConfig: { audioEncoding: 'MP3' },
  });

  if (response.audioContent instanceof Uint8Array) {
    return response.audioContent;
  }
  
  throw new Error('音声データの生成に失敗しました');
}