'use client';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Button, FormControl, FormLabel, Input, Textarea, useToast } from '@chakra-ui/react';
import NavBar from '../../../components/Navbar';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

interface Params {
  id: string;
}

const EditArticlePage = ({ params }: { params: Params }) => {
  const [article, setArticle] = useState({ title: '', description: '', url: '', imageUrl: '' });
  const router = useRouter();
  const toast = useToast();
  const supabase = createClientComponentClient();

  const fetchArticle = useCallback(async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      const res = await fetch(`/api/articles/${params.id}`);
      if (res.ok) {
        const data = await res.json();
        setArticle(data);
      } else {
        console.error('記事の取得に失敗しました');
      }
    } else {
      router.push('/login');
    }
  }, [params.id, router, supabase]);

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
            <FormLabel>URL</FormLabel>
            <Input value={article.url} onChange={(e) => setArticle({...article, url: e.target.value})} />
          </FormControl>
          <FormControl mt={4}>
            <FormLabel>画像URL</FormLabel>
            <Input value={article.imageUrl} onChange={(e) => setArticle({...article, imageUrl: e.target.value})} />
          </FormControl>
          <Button mt={4} colorScheme="blue" type="submit">更新</Button>
        </form>
      </Box>
    </Box>
  );
};

export default EditArticlePage;