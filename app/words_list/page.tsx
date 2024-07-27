// app/words_list/page.tsx
'use client'
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const WordsList = () => {
  const [articles, setArticles] = useState<any[]>([]);
  const [selectedArticle, setSelectedArticle] = useState<any>(null);

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    const { data, error } = await supabase
      .from('Article')
      .select('*');
    if (error) console.log('Error fetching articles:', error.message);
    else setArticles(data as any[]);
  };

  const saveWordList = async (words: string[]) => {
    if (!selectedArticle) {
      console.log('No article selected');
      return;
    }
    const { error } = await supabase
      .from('WordList')
      .insert([{ article_id: selectedArticle.id, words }]);
    if (error) console.log('Error saving word list:', error.message);
    else fetchArticles();
  };

  return (
    <div>
      <h1>Word Lists</h1>
      <ul>
        {articles.map((article, index) => (
          <li key={index} onClick={() => setSelectedArticle(article)}>{article.title}</li>
        ))}
      </ul>
      {selectedArticle && (
        <div>
          <h2>{selectedArticle.title}</h2>
          <button onClick={() => saveWordList(['word1', 'word2'])}>Save Words</button>
        </div>
      )}
    </div>
  );
};

export default WordsList;