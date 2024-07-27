'use client';
import { useState, useEffect, useRef } from 'react';
import { Box, Button, Heading, List, ListItem, Text, useToast, AlertDialog, AlertDialogBody, AlertDialogFooter, AlertDialogHeader, AlertDialogContent, AlertDialogOverlay, Flex, Spacer, Link } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import NavBar from '../../components/Navbar';

const ArticleManage = () => {
  const [articles, setArticles] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(null);
  const cancelRef = useRef<HTMLButtonElement>(null);
  const toast = useToast();
  const router = useRouter();

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      const res = await fetch('/api/articles');
      const data = await res.json();
      setArticles(data);
    } catch (error) {
      console.error('Error fetching articles:', error);
    }
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

  return (
    <Box>
      <NavBar />
      <Box p={5} maxW="800px" mx="auto">
        <Heading mb={5} textAlign="center">保存した記事を編集する</Heading>
        <List spacing={3}>
          {articles.map((article: { id: string; title: string }) => (
            <ListItem key={article.id} borderWidth="1px" p={3} borderRadius="md" display="flex" alignItems="center">
              <Text fontWeight="bold">{article.title}</Text>
              <Spacer />
              <Flex>
                <Link href={`/article/edit/${article.id}`}>
                  <Button as="a" size="sm" colorScheme="blue" mr={2}>Edit</Button>
                </Link>
                <Button size="sm" colorScheme="red" onClick={() => openDeleteDialog(article.id)}>Delete</Button>
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
      </Box>
    </Box>
  );
};

export default ArticleManage;