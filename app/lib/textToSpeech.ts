'use server'
import { TextToSpeechClient } from '@google-cloud/text-to-speech';

export async function textToSpeech(text: string, language: string = 'en-US'): Promise<Uint8Array> {
  let credentials;
  if (process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON) {
    credentials = JSON.parse(Buffer.from(process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON, 'base64').toString());
  }

  const client = new TextToSpeechClient({ credentials });
  
  console.log('Synthesizing speech with language:', language); // Added for debugging

  // Convert language code to Google Cloud TTS API format
  const languageCode = language.split('-')[0] + '-' + language.split('-')[1].toUpperCase();

  try {
    const [response] = await client.synthesizeSpeech({
      input: { text },
      voice: { languageCode: languageCode, ssmlGender: 'NEUTRAL' },
      audioConfig: { audioEncoding: 'MP3' },
    });

    if (response.audioContent instanceof Uint8Array) {
      return response.audioContent;
    }
    
    throw new Error('Audio data is not in the expected format');
  } catch (error) {
    console.error('Text-to-Speech error:', error);
    throw new Error(`Failed to generate audio data: ${(error as Error).message}`);
  }
}