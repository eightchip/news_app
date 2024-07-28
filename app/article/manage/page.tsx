'use client';
import { useState, useEffect, useRef } from 'react';
import { Box, Button, Heading, List, ListItem, Text, useToast, AlertDialog, AlertDialogBody, AlertDialogFooter, AlertDialogHeader, AlertDialogContent, AlertDialogOverlay, Flex, Spacer, Link, Select } from '@chakra-ui/react';
import NavBar from '../../components/Navbar';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Article } from '../../types/Article';
import { useRouter } from 'next/navigation';

const ArticleManage = () => {
  const [isRouterReady, setIsRouterReady] = useState(false);
  const router = useRouter();

  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'publishedAt' | 'source'>('publishedAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(null);
  const cancelRef = useRef<HTMLButtonElement>(null);
  const toast = useToast();
  const supabase = createClientComponentClient();

  useEffect(() => {
    setIsRouterReady(true);
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/login');
      } else {
        fetchArticles();
      }
    };

    checkAuth();
  }, []);

  const fetchArticles = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      console.log('クライアント - セッション:', session);
      const userId = session?.user?.id;
      console.log('クライアント - ユーザーID:', userId);

      if (!userId) {
        throw new Error('ユーザーが認証されていません');
      }

      const res = await fetch('/api/articles');
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || '記事の取得に失敗しました');
      }
      const data = await res.json();
      console.log('クライアント - 取得した記事:', data);
      setArticles(data);
    } catch (error) {
      console.error('クライアント - 記事の取得エラー:', error);
      setError(error instanceof Error ? error.message : '未知のエラーが発生しました');
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
  };

  const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newSortBy = event.target.value as 'publishedAt' | 'source';
    setSortBy(newSortBy);
    sortArticles(newSortBy, sortOrder);
  };

  const handleSortOrderChange = () => {
    const newOrder = sortOrder === 'asc' ? 'desc' : 'asc';
    setSortOrder(newOrder);
    sortArticles(sortBy, newOrder);
  };

  const sortArticles = (sortByField: 'source' | 'publishedAt', order: 'asc' | 'desc') => {
    const sortedArticles = [...articles].sort((a, b) => {
      if (sortByField === 'source') {
        return order === 'asc' ? a.source.localeCompare(b.source) : b.source.localeCompare(a.source);
      } else {
        return order === 'asc' 
          ? new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime() 
          : new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
      }
    });
    setArticles(sortedArticles);
  };

  const handleDelete = async () => {
    if (selectedArticleId) {
      try {
        const res = await fetch(`/api/articles/${selectedArticleId}`, {
          method: 'DELETE',
        });
        if (res.ok) {
          toast({
            title: 'Success',
            description: 'Article deleted successfully',
            status: 'success',
            duration: 5000,
            isClosable: true,
          });
          fetchArticles();
        } else {
          throw new Error('Failed to delete article');
        }
      } catch (error) {
        console.error('Error deleting article:', error);
        toast({
          title: 'Error',
          description: 'Failed to delete article',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setIsOpen(false);
        setSelectedArticleId(null);
      }
    }
  };

  const openDeleteDialog = (id: string) => {
    setSelectedArticleId(id);
    setIsOpen(true);
  };

  if (!isRouterReady) {
    return null; // または読み込み中の表示
  }

  if (isLoading) {
    return <Box>読み込み中...</Box>;
  }

  if (error) {
    return <Box>エラー: {error}</Box>;
  }

  return (
    <Box>
      <NavBar />
      <Box p={5} maxW="800px" mx="auto">
        <Heading mb={5} textAlign="center">保存した記事を編集する</Heading>
        {articles.length === 0 ? (
          <Text>保存された記事はありません。</Text>
        ) : (
          <>
            <Flex justifyContent="center" mb={5}>
              <Select value={sortBy} onChange={handleSortChange} mr={2}>
                <option value="publishedAt">Published Date</option>
                <option value="source">Source</option>
              </Select>
              <Button onClick={handleSortOrderChange}>
                {sortOrder === 'asc' ? 'Ascending' : 'Descending'}
              </Button>
            </Flex>
            <List spacing={3}>
              {articles.map((article) => (
                <ListItem key={article.id} borderWidth="1px" p={3} borderRadius="md">
                  <Flex alignItems="center">
                    <Box>
                      <Text fontWeight="bold">{article.title}</Text>
                      <Text fontSize="sm">{article.source} - {new Date(article.publishedAt).toLocaleString()}</Text>
                      <Link href={article.url} color="blue.500" isExternal>
                        Read original
                      </Link>
                    </Box>
                    <Spacer />
                    <Flex>
                      <Link href={`/article/edit/${article.id}`}>
                        <Button as="a" size="sm" colorScheme="blue" mr={2}>Edit</Button>
                      </Link>
                      <Button size="sm" colorScheme="red" onClick={() => openDeleteDialog(article.id)}>Delete</Button>
                    </Flex>
                  </Flex>
                </ListItem>
              ))}
            </List>

            <AlertDialog
              isOpen={isOpen}
              leastDestructiveRef={cancelRef}
              onClose={() => setIsOpen(false)}
            >
              <AlertDialogOverlay>
                <AlertDialogContent>
                  <AlertDialogHeader fontSize="lg" fontWeight="bold">
                    Delete Article
                  </AlertDialogHeader>

                  <AlertDialogBody>
                    Are you sure you want to delete this article? This action cannot be undone.
                  </AlertDialogBody>

                  <AlertDialogFooter>
                    <Button ref={cancelRef} onClick={() => setIsOpen(false)}>
                      Cancel
                    </Button>
                    <Button colorScheme="red" onClick={handleDelete} ml={3}>
                      Delete
                    </Button>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialogOverlay>
            </AlertDialog>
          </>
        )}
      </Box>
    </Box>
  );
};

export default ArticleManage;