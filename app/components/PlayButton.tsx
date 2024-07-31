import { useState } from 'react';
import { textToSpeech } from '../lib/textToSpeech';

export function PlayButton({ text }: { text: string }) {
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlay = async () => {
    if (isPlaying) return;

    setIsPlaying(true);
    try {
      const audioContent = await textToSpeech(text);
      const audioBlob = new Blob([audioContent], { type: 'audio/mp3' });
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      
      audio.onended = () => {
        setIsPlaying(false);
        URL.revokeObjectURL(audioUrl);
      };

      await audio.play();
    } catch (error) {
      console.error('音声の再生中にエラーが発生しました:', error);
      setIsPlaying(false);
    }
  };

  return (
    <button
      onClick={handlePlay}
      disabled={isPlaying}
      className="px-4 py-2 rounded bg-teal-500 hover:bg-teal-600 text-white"
    >
      読み上げ
    </button>
  );
}