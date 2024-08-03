// app/article/edit/[id]/page.tsx
'use client';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Button, FormControl, FormLabel, Input, Textarea, useToast, Icon } from '@chakra-ui/react';
import { FaSave } from 'react-icons/fa';
import NavBar from '../../../components/Navbar';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { PlayButton } from '../../../components/PlayButton';

interface Params {
  id: string;
}

interface Article {
  title: string;
  description: string;
  url: string;
  imageUrl: string;
}

interface WordList {
  id: number;
  words: string[];
  articleId: number;
}

const EditArticlePage = ({ params }: { params: Params }) => {
  const [article, setArticle] = useState<Article>({ title: '', description: '', url: '', imageUrl: '' });
  const [wordList, setWordList] = useState<WordList>({ id: 0, words: [], articleId: 0 });
  const [newWords, setNewWords] = useState('');
  const router = useRouter();
  const toast = useToast();
  const supabase = createClientComponentClient();

  const fetchArticle = useCallback(async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      router.push('/login');
      return;
    }

    const res = await fetch(`/api/articles/${params.id}`);
    if (res.ok) {
      const data = await res.json();
      setArticle(data);
    } else {
      console.error('記事の取得に失敗しました');
      toast({
        title: 'エラー',
        description: '記事の取得に失敗しました。',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }

    const wordListRes = await fetch(`/api/wordlists/${params.id}`);
    if (wordListRes.ok) {
      const wordListData = await wordListRes.json();
      setWordList(wordListData);
    } else {
      console.error('単語リストの取得に失敗しました');
    }
  }, [params.id, router, supabase, toast]);

  useEffect(() => {
    fetchArticle();
  }, [fetchArticle]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch(`/api/articles/${params.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(article),
    });
    if (res.ok) {
      toast({ title: '記事を更新しました', status: 'success' });
      router.push('/article/manage');
    } else {
      toast({ title: '更新に失敗しました', status: 'error' });
    }
  };

  const handleAddWords = async () => {
    const wordsArray = newWords.split(',').map(word => word.trim());
    if (wordsArray.some(word => word === '')) {
      toast({
        title: 'エラー',
        description: '単語はカンマで区切って入力してください。',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    const updatedWordList = { ...wordList, words: [...wordList.words, ...wordsArray] };
    const res = await fetch(`/api/wordlists/${params.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedWordList),
    });

    if (res.ok) {
      setWordList(updatedWordList);
      setNewWords('');
      toast({ title: '単語を追加しました', status: 'success' });
    } else {
      toast({ title: '単語の追加に失敗しました', status: 'error' });
    }
  };

  return (
    <Box>
      <NavBar />
      <Box maxWidth="800px" margin="auto" mt={5}>
        <form onSubmit={handleSubmit}>
          <FormControl>
            <FormLabel>タイトル</FormLabel>
            <Input value={article.title} onChange={(e) => setArticle({...article, title: e.target.value})} />
          </FormControl>
          <FormControl mt={4}>
            <FormLabel>説明</FormLabel>
            <Textarea value={article.description} onChange={(e) => setArticle({...article, description: e.target.value})} />
          </FormControl>
          <FormControl mt={4}>
            <FormLabel>単語リスト</FormLabel>
            <Textarea value={wordList.words.join(', ')} readOnly />
          </FormControl>
          <FormControl mt={4}>
            <FormLabel>単語を追加</FormLabel>
            <Input value={newWords} onChange={(e) => setNewWords(e.target.value)} placeholder="カンマで区切って入力" />
          </FormControl>
          <Box display="flex" justifyContent="flex-start" mt={4} gap={2}>
            <PlayButton text={article.description} />
            <Button onClick={handleAddWords} colorScheme="green">
              単語追加
            </Button>
            <Button type="submit" colorScheme="blue" leftIcon={<Icon as={FaSave} />}>
              更新
            </Button>
          </Box>
        </form>
      </Box>
    </Box>
  );
};

export default EditArticlePage;