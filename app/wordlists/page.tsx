'use client'
import { useState, useEffect, useCallback } from 'react';
import { Box, VStack, Heading, Text, useToast, Flex } from '@chakra-ui/react';
import NavBar from '../components/Navbar';
import { PlayButton } from '../components/PlayButton';

interface WordList {
  id: number;
  words: string[];
  articleId: number;
  article: {
    title: string;
    description: string;
  };
}

const WordListsPage = () => {
  const [wordLists, setWordLists] = useState<WordList[]>([]);
  const toast = useToast();

  const fetchWordLists = useCallback(async () => {
    try {
      const response = await fetch('/api/wordlists');
      if (!response.ok) {
        throw new Error('単語リストの取得に失敗しました');
      }
      const data = await response.json();
      setWordLists(data.filter((wordList: WordList) => wordList.words && wordList.words.length > 0));
    } catch (error) {
      console.error('Error fetching word lists:', error);
      toast({
        title: 'エラー',
        description: '単語リストの取得に失敗しました。',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  }, [toast]);

  useEffect(() => {
    fetchWordLists();
  }, [fetchWordLists]);

  return (
    <Box>
      <NavBar />
      <Box maxWidth="800px" margin="auto" mt={3} px={[2, 3, 4]} boxShadow="sm" borderRadius="md" bg="orange.50">
        <Heading mb={2} color="orange.600" textAlign="center" fontSize={["xl", "2xl"]}>Expressions</Heading>
        <VStack spacing={2} align="stretch">
          {wordLists.map((wordList) => (
            <Box key={wordList.id} p={3} borderWidth="1px" borderRadius="sm" bg="white">
              <Heading size="md" mb={1} color="orange.500" fontSize="lg">{wordList.article.title}</Heading>
              <Text fontSize="sm" mb={1} color="gray.600">{wordList.article.description}</Text>
              <Box mb={2}>
                <PlayButton text={wordList.article.description} />
              </Box>
              <Text fontWeight="bold" mb={1} fontSize="sm">登録した表現:</Text>
              <Text mb={1} fontSize="sm">{wordList.words.join(', ')}</Text>
              <Box>
                <PlayButton text={wordList.words.join(', ')} />
              </Box>
            </Box>
          ))}
        </VStack>
      </Box>
    </Box>
  );
};

export const dynamic = 'force-dynamic';

export default WordListsPage;