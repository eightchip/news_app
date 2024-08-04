'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { Box, Button, Heading, List, ListItem, Text, useToast, AlertDialog, AlertDialogBody, AlertDialogFooter, AlertDialogHeader, AlertDialogContent, AlertDialogOverlay, Flex, Spacer, Link, Spinner, VStack } from '@chakra-ui/react';
import NavBar from '../../components/Navbar';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Article } from '../../types/Article';

const ArticleManage = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(null);
  const cancelRef = useRef<HTMLButtonElement>(null);
  const toast = useToast();
  const supabase = createClientComponentClient();

  const fetchArticles = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      console.log('セッション:', session);
      const userId = session?.user?.id;
      console.log('ユーザーID:', userId);

      if (!userId) {
        throw new Error('ユーザーが認証されていません');
      }

      const res = await fetch(`/api/articles?userId=${userId}`);
      if (!res.ok) {
        throw new Error('記事の取得に失敗しました');
      }
      const data = await res.json();
      console.log('取得した記事:', data);
      setArticles(data);
    } catch (error) {
      console.error('記事の取得エラー:', error);
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
  }, [toast, supabase.auth]);

  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  const handleSortOrderChange = () => {
    setSortOrder(prevOrder => prevOrder === 'asc' ? 'desc' : 'asc');
  };

  const sortedArticles = [...articles].sort((a, b) => {
    return sortOrder === 'asc' 
      ? new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime() 
      : new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
  });

  const handleDelete = async () => {
    if (selectedArticleId) {
      try {
        const deleteWordListRes = await fetch(`/api/wordlists/${selectedArticleId}`, {
          method: 'DELETE',
        });
        if (!deleteWordListRes.ok) {
          throw new Error('関連するWordListエントリの削除に失敗しました');
        }

        const res = await fetch(`/api/articles/${selectedArticleId}`, {
          method: 'DELETE',
        });
        if (res.ok) {
          toast({
            title: '成功',
            description: '記事が正常に削除されました',
            status: 'success',
            duration: 5000,
            isClosable: true,
          });
          fetchArticles();
        } else {
          throw new Error('記事の削除に失敗しました');
        }
      } catch (error) {
        console.error('記事削除エラー:', error);
        toast({
          title: 'エラー',
          description: '記事の削除に失敗しました',
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

  if (isLoading) {
    return (
      <Box>
        <NavBar />
        <VStack spacing={4} align="center" justify="center" height="calc(100vh - 64px)">
          <Spinner size="xl" color="blue.500" />
          <Text fontSize="lg">記事を読み込んでいます...</Text>
        </VStack>
      </Box>
    );
  }

  if (error) {
    return <Box>エラー: {error}</Box>;
  }

  return (
    <Box>
      <NavBar />
      <Box p={5} maxW="800px" mx="auto">
        <Heading mb={5} textAlign="center">Edit Articles</Heading>
        {articles.length === 0 ? (
          <Text>保存された記事はありません。</Text>
        ) : (
          <>
            <Flex justifyContent="flex-end" mb={5}>
              <Button onClick={handleSortOrderChange}>
                {sortOrder === 'asc' ? '古い順' : '新しい順'}
              </Button>
            </Flex>
            <List spacing={3}>
              {sortedArticles.map((article) => (
                <ListItem key={article.id} borderWidth="1px" p={3} borderRadius="md" bg="orange.50">
                  <Flex alignItems="flex-start">
                    <Box flex={1}>
                      <Text fontWeight="bold" color="orange.600">{article.title}</Text>
                      <Text fontSize="sm" color="gray.600">{article.source.name} - {new Date(article.publishedAt).toLocaleString()}</Text>
                      <Link href={article.url} color="blue.500" isExternal>
                        Read original
                      </Link>
                    </Box>
                    <VStack spacing={2} align="stretch">
                      <Link href={`/article/edit/${article.id}`} style={{ width: '100%' }}>
                        <Button as="a" size="sm" colorScheme="blue" width="100%">Edit</Button>
                      </Link>
                      <Button size="sm" colorScheme="red" width="100%" onClick={() => openDeleteDialog(article.id)}>Delete</Button>
                    </VStack>
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