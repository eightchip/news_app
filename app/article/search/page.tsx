'use client';
import Link from 'next/link';
import { useState } from 'react';
import { Box, Button, Checkbox, Heading, Input, List, ListItem, Text, useToast, Flex } from '@chakra-ui/react';
import NavBar from '../../components/Navbar';

const ArticleSearch = () => {
  const [query, setQuery] = useState('');
  const [articles, setArticles] = useState([]);
  const [selectedArticles, setSelectedArticles] = useState([]);
  const [page, setPage] = useState(1);
  const articlesPerPage = 20;
  const toast = useToast();
  const [allChecked, setAllChecked] = useState(false);

  const searchArticles = async () => {
    const res = await fetch(`/api/news?q=${query}`);
    const data = await res.json();
    setArticles(data.articles);
  };

  const handleCheckboxChange = (index: number) => {
    const article = articles[(page - 1) * articlesPerPage + index];
    if (selectedArticles.includes(article)) {
      setSelectedArticles(selectedArticles.filter((_, i) => i !== index));
    } else {
      setSelectedArticles([...selectedArticles, article]);
    }
  };

  const handleCheckAll = () => {
    if (allChecked) {
      setSelectedArticles([]);
    } else {
      setSelectedArticles(paginatedArticles);
    }
    setAllChecked(!allChecked);
  };

  const saveSelectedArticles = async () => {
    for (const article of selectedArticles) {
      const response = await fetch('/api/articles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: (article as any).title ?? 'No Title',
          content: (article as any).content ?? 'No Content',
          imageUrl: (article as any).urlToImage ?? 'No Image',
          userId: 1, // ユーザーIDを適切に設定
        }),
      });

      if (!response.ok) {
        console.error('Failed to save article');
        toast({
          title: 'Error',
          description: 'Failed to save some articles',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
        return;
      }
    }
    toast({
      title: 'Success',
      description: 'Selected articles saved successfully!',
      status: 'success',
      duration: 5000,
      isClosable: true,
    });
  };

  const paginatedArticles = articles.slice((page - 1) * articlesPerPage, page * articlesPerPage);

  return (
    <Box>
      <NavBar />
      <Box p={5} textAlign="center">
        <Heading mb={5}>英文記事を検索</Heading>
        <Input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="type keyword in English"
          mb={5}
          mx="auto"
          width="50%"
        />
        <Flex justifyContent="center" mb={5}>
          <Button onClick={searchArticles} colorScheme="blue" mr={2}>Search</Button>
          <Button onClick={handleCheckAll} colorScheme="blue">
            {allChecked ? 'Uncheck All' : 'Check All'}
          </Button>
        </Flex>
        <List spacing={3} textAlign="left" mx="auto" width="50%">
          {paginatedArticles.map((article, index) => (
            <ListItem key={index} display="flex" alignItems="center">
              <Checkbox
                isChecked={selectedArticles.includes(articles[(page - 1) * articlesPerPage + index])}
                onChange={() => handleCheckboxChange(index)}
                mr={2}
              />
              <Link href={(article as any).url} target="_blank" rel="noopener noreferrer" passHref>
                <Text as="span" color="blue.500">{(article as any).title}</Text>
              </Link>
            </ListItem>
          ))}
        </List>
        <Flex mt={5} justifyContent="center">
          <Button onClick={() => setPage(page > 1 ? page - 1 : 1)} mr={2}>Previous</Button>
          <Button onClick={() => setPage(page + 1)}>Next</Button>
        </Flex>
        <Button onClick={saveSelectedArticles} mt={5} colorScheme="green">Save Selected Articles</Button>
      </Box>
    </Box>
  );
};

export default ArticleSearch;