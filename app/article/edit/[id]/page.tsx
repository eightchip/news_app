// app/article/edit/[id]/page.tsx
'use client';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Button, FormControl, FormLabel, Input, Textarea, useToast, Icon, VStack } from '@chakra-ui/react';
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
  const [editingWords, setEditingWords] = useState('');
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

  useEffect(() => {
    if (wordList.words) {
      setEditingWords(wordList.words.join(', '));
    }
  }, [wordList]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const wordsArray = editingWords.split(',').map(word => word.trim()).filter(word => word !== '');
    const updatedWordList = { ...wordList, words: wordsArray };

    const articleRes = await fetch(`/api/articles/${params.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(article),
    });

    const wordListRes = await fetch(`/api/wordlists/${params.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedWordList),
    });

    if (articleRes.ok && wordListRes.ok) {
      setWordList(updatedWordList);
      toast({ title: '記事と表現リストを更新しました', status: 'success' });
      router.push('/article/manage');
    } else {
      toast({ title: '更新に失敗しました', status: 'error' });
    }
  };

  return (
    <Box>
      <NavBar />
      <Box maxWidth="800px" margin="auto" mt={5} p={5} boxShadow="md" borderRadius="lg" bg="orange.50">
        <form onSubmit={handleSubmit}>
          <VStack spacing={6} align="stretch">
            <FormControl>
              <FormLabel color="orange.600" fontWeight="bold">タイトル</FormLabel>
              <Input 
                value={article.title} 
                onChange={(e) => setArticle({...article, title: e.target.value})}
                borderColor="gray.300"
                _hover={{ borderColor: "gray.400" }}
                _focus={{ borderColor: "orange.500", boxShadow: "0 0 0 1px orange.500" }}
                bg="white"
              />
            </FormControl>
            <FormControl>
              <FormLabel color="orange.600" fontWeight="bold">本文</FormLabel>
              <Textarea 
                value={article.description} 
                onChange={(e) => setArticle({...article, description: e.target.value})}
                borderColor="gray.300"
                _hover={{ borderColor: "gray.400" }}
                _focus={{ borderColor: "orange.500", boxShadow: "0 0 0 1px orange.500" }}
                minHeight="150px"
                bg="white"
              />
              <Box mt={2}>
                <PlayButton text={article.description} />
              </Box>
            </FormControl>
            <FormControl>
              <FormLabel color="orange.600" fontWeight="bold">表現リスト</FormLabel>
              <Textarea 
                value={editingWords} 
                onChange={(e) => setEditingWords(e.target.value)}
                borderColor="gray.300"
                _hover={{ borderColor: "gray.400" }}
                _focus={{ borderColor: "orange.500", boxShadow: "0 0 0 1px orange.500" }}
                minHeight="150px"
                bg="white"
                placeholder="気になる単語や表現を入力して下さい。"
              />
            </FormControl>
            <Box display="flex" flexWrap="wrap" justifyContent="flex-start" mt={4} gap={2}>
              <Button type="submit" colorScheme="blue" leftIcon={<Icon as={FaSave} />} fontSize={{ base: 'sm', md: 'md' }} px={4} py={2}>
                更新
              </Button>
            </Box>
          </VStack>
        </form>
      </Box>
    </Box>
  );
};

export default EditArticlePage;