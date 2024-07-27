'use client';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Button, FormControl, FormLabel, Input, Textarea, useToast, Spinner, Center } from '@chakra-ui/react';
import NavBar from '../../../components/Navbar';

interface Params {
  id: string;
}

const EditArticlePage = ({ params }: { params: Params }) => {
  const { id } = params;
  const [article, setArticle] = useState({ title: '', content: '', imageUrl: '' });
  const [isLoading, setIsLoading] = useState(true);
  const toast = useToast();
  const router = useRouter();

  const fetchArticle = useCallback(async () => {
    try {
      const res = await fetch(`/api/articles/${id}`);
      const data = await res.json();
      setArticle(data.article);
    } catch (error) {
      console.error('Failed to fetch article:', error);
      toast({
        title: 'エラー',
        description: '記事の取得に失敗しました',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchArticle();
  }, [fetchArticle]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/articles/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(article)
      });
      if (res.ok) {
        toast({
          title: '成功',
          description: '記事が更新されました',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
        router.push('/article/manage');
      } else {
        throw new Error('Failed to update article');
      }
    } catch (error) {
      console.error('Failed to update article:', error);
      toast({
        title: 'エラー',
        description: '記事の更新に失敗しました',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setArticle(prev => ({ ...prev, [name]: value }));
  };

  if (isLoading) {
    return (
      <Center height="100vh">
        <Spinner
          thickness="4px"
          speed="0.65s"
          emptyColor="gray.200"
          color="blue.500"
          size="xl"
        />
      </Center>
    );
  }

  return (
    <Box>
      <NavBar />
      <Box p={5}>
        <form onSubmit={handleUpdate}>
          <FormControl id="title" isRequired mb={4} borderBottom="none">
            <FormLabel mb={2}>タイトル</FormLabel>
            <Input
              name="title"
              value={article.title}
              onChange={handleInputChange}
              borderRadius="md"
              focusBorderColor="blue.500"
            />
          </FormControl>
          <FormControl id="content" isRequired mb={4} borderBottom="none">
            <FormLabel mb={2}>内容</FormLabel>
            <Textarea
              name="content"
              value={article.content}
              onChange={handleInputChange}
              borderRadius="md"
              focusBorderColor="blue.500"
            />
          </FormControl>
          <FormControl id="imageUrl" mb={4} borderBottom="none">
            <FormLabel mb={2}>画像URL</FormLabel>
            <Input
              name="imageUrl"
              value={article.imageUrl}
              onChange={handleInputChange}
              borderRadius="md"
              focusBorderColor="blue.500"
            />
          </FormControl>
          <Button type="submit" colorScheme="blue" mt={4}>
            記事を更新
          </Button>
        </form>
      </Box>
    </Box>
  );
};

export default EditArticlePage;