'use client';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Button, FormControl, FormLabel, Input, Textarea, useToast, Icon } from '@chakra-ui/react';
import { FaSave } from 'react-icons/fa';
import NavBar from '../../../components/Navbar';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { textToSpeech } from '../../../lib/textToSpeech';
import { ReadAloudButton } from '../../../components/ReadAloudButton';

interface Params {
  id: string;
}

interface Article {
  title: string;
  description: string;
  url: string;
  imageUrl: string;
}

const EditArticlePage = ({ params }: { params: Params }) => {
  const [article, setArticle] = useState<Article>({ title: '', description: '', url: '', imageUrl: '' });
  const [isPlaying, setIsPlaying] = useState(false);
  const router = useRouter();
  const toast = useToast();
  const supabase = createClientComponentClient();

  const fetchArticle = useCallback(async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      router.push('/login'); // セッションがない場合はリダイレクト
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
      router.push('/article/manage'); // 更新成功時のみリダイレクト
    } else {
      toast({ title: '更新に失敗しました', status: 'error' });
    }
  };

  const handlePlay = async (text: string) => {
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
      toast({
        title: 'エラー',
        description: '音声の再生に失敗しました。',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      setIsPlaying(false);
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
            <Textarea 
              value={article.description} 
              onChange={(e) => setArticle({...article, description: e.target.value})}
              className="w-full"
            />
          </FormControl>
          <FormControl mt={4}>
            <FormLabel>URL</FormLabel>
            <Input value={article.url} onChange={(e) => setArticle({...article, url: e.target.value})} />
          </FormControl>
          <FormControl mt={4}>
            <FormLabel>画像URL</FormLabel>
            <Input value={article.imageUrl} onChange={(e) => setArticle({...article, imageUrl: e.target.value})} />
          </FormControl>
          <Box display="flex" justifyContent="flex-start" mt={4} gap={2}>
            <ReadAloudButton
              onClick={() => handlePlay(article.description)}
              isLoading={isPlaying}
            />
            <Button
              type="submit"
              colorScheme="blue"
              leftIcon={<Icon as={FaSave} />}
            >
              更新
            </Button>
          </Box>
        </form>
      </Box>
    </Box>
  );
};

export default EditArticlePage;