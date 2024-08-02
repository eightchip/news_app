// components/PlayButton.tsx
import { useState } from 'react';
import { FaVolumeUp } from 'react-icons/fa';

export function PlayButton({ text }: { text: string }) {
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlay = async () => {
    if (isPlaying) return;

    setIsPlaying(true);
    try {
      const response = await fetch('/api/text-to-speech', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text, language: 'en-US' }),
      });

      if (!response.ok) {
        throw new Error('音声データの取得に失敗しました');
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);

      const audio = new Audio(audioUrl);
      
      audio.onended = () => {
        setIsPlaying(false);
        URL.revokeObjectURL(audioUrl);
      };

      await audio.play();
    } catch (error) {
      console.error('音声の再生中にエラーが発生しました:', error);
      // ここでユーザーにエラーメッセージを表示することをお勧めします
    } finally {
      setIsPlaying(false);
    }
  };

  return (
    <button
      onClick={handlePlay}
      disabled={isPlaying}
      className="flex items-center px-3 py-1.5 rounded bg-white border-2 border-gray-400 text-gray-700 text-sm hover:bg-gray-100 hover:border-gray-500"
    >
      <FaVolumeUp className="mr-2 text-gray-600" />
      {isPlaying ? '再生中...' : '読み上げ (US)'}
    </button>
  );
}