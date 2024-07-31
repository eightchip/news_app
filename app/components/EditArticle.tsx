'use client';

import { useState } from 'react';
import { textToSpeech } from '../lib/textToSpeech';

interface Article {
  description: string;
  // articleの他のプロパティをここに追加
}

const EditArticle: React.FC<{ article: Article }> = ({ article }) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlay = async (text: string) => {
    if (isPlaying) return;
    setIsPlaying(true);
    try {
      const audioContent = await textToSpeech(text);
      const audio = new Audio(`data:audio/mp3;base64,${audioContent}`);
      audio.play();
      audio.onended = () => setIsPlaying(false);
    } catch (error) {
      console.error('音声再生エラー:', error);
      setIsPlaying(false);
    }
  };

  return (
    <div>
      <div>
        <label htmlFor="description">説明：</label>
        <textarea
          id="description"
          value={article.description}
          readOnly
        />
        <button onClick={() => handlePlay(article.description)} disabled={isPlaying}>
          {isPlaying ? '再生中...' : '読み上げ'}
        </button>
      </div>
    </div>
  );
};

export default EditArticle;