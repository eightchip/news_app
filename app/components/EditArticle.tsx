'use client';

import { useState, useEffect } from 'react';
import { textToSpeech } from '../lib/textToSpeech';

interface Article {
  id: number;
  description: string;
  // articleの他のプロパティをここに追加
}

interface WordList {
  id: number;
  words: string[];
  articleId: number;
}

const EditArticle: React.FC<{ article: Article }> = ({ article }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [wordList, setWordList] = useState<WordList>({ id: 0, words: [], articleId: article.id });
  const [newWords, setNewWords] = useState('');

  useEffect(() => {
    const fetchWordList = async () => {
      const res = await fetch(`/api/wordlists/${article.id}`);
      if (res.ok) {
        const data = await res.json();
        setWordList(data);
      } else {
        console.error('単語リストの取得に失敗しました');
      }
    };
    fetchWordList();
  }, [article.id]);

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

  const handleAddWords = async () => {
    const wordsArray = newWords.split(',').map(word => word.trim());
    if (wordsArray.some(word => word === '')) {
      alert('単語はカンマで区切って入力してください。');
      return;
    }

    const updatedWordList = { ...wordList, words: [...wordList.words, ...wordsArray] };
    const res = await fetch(`/api/wordlists/${article.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedWordList),
    });

    if (res.ok) {
      setWordList(updatedWordList);
      setNewWords('');
      alert('単語を追加しました');
    } else {
      alert('単語の追加に失敗しました');
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
      <div>
        <label htmlFor="wordList">単語リスト：</label>
        <textarea
          id="wordList"
          value={wordList.words.join(', ')}
          readOnly
        />
      </div>
      <div>
        <label htmlFor="newWords">単語を追加：</label>
        <input
          id="newWords"
          value={newWords}
          onChange={(e) => setNewWords(e.target.value)}
          placeholder="カンマで区切って入力"
        />
        <button onClick={handleAddWords}>単語追加</button>
      </div>
    </div>
  );
};

export default EditArticle;