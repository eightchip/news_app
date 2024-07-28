'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Box, Button, Checkbox, Heading, Input, List, ListItem, Text, useToast, Flex, Select, VStack } from '@chakra-ui/react';
import NavBar from '../../components/Navbar';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Article } from '../../types/Article';

const englishSources = [
  { id: 'bbc-news', name: 'BBC News' },
  { id: 'cnn', name: 'CNN' },
  { id: 'the-new-york-times', name: 'The New York Times' },
  { id: 'the-guardian-uk', name: 'The Guardian' },
  { id: 'reuters', name: 'Reuters' },
];

const ArticleSearch = () => {
  const supabase = createClientComponentClient();
  const [query, setQuery] = useState('');
  const [articles, setArticles] = useState<Article[]>([]);
  const [selectedArticles, setSelectedArticles] = useState<Article[]>([]);
  const [page, setPage] = useState(1);
  const articlesPerPage = 20;
  const toast = useToast();
  const [selectedSources, setSelectedSources] = useState(englishSources.map(source => source.id));
  const [sortBy, setSortBy] = useState('publishedAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [allSourcesSelected, setAllSourcesSelected] = useState(true);
  const [allArticlesSelected, setAllArticlesSelected] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setUserId(session.user.id);
      } else {
        console.log('セッションがありません');
      }
    };
    fetchUser();
  }, [supabase]);

  const searchArticles = async () => {
    const sourcesQuery = selectedSources.join(',');
    const res = await fetch(`/api/news?q=${query}&sources=${sourcesQuery}&sortBy=${sortBy}&sortOrder=${sortOrder}`);
    const data = await res.json();
    setArticles(data.articles);
  };

  const handleSourceChange = (sourceId: string) => {
    setSelectedSources(prev => 
      prev.includes(sourceId) ? prev.filter(id => id !== sourceId) : [...prev, sourceId]
    );
  };

  const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(event.target.value);
  };

  const handleSortOrderChange = () => {
    setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
  };

  const handleCheckboxChange = (index: number) => {
    const article = articles[(page - 1) * articlesPerPage + index];
    setSelectedArticles(prev => [...prev, article]);
  };

  const saveSelectedArticles = async () => {
    if (!userId) {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setUserId(session.user.id);
      } else {
        toast({
          title: 'エラー',
          description: 'ユーザーIDが取得できません。ログインしているか確認してください。',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
        return;
      }
    }

    const preparedArticles = selectedArticles.map(article => ({
      title: article.title,
      description: article.description,
      url: article.url,
      imageUrl: article.urlToImage || 'No Image',
      userId: userId,
      source: article.source
    }));

    const results = await Promise.all(preparedArticles.map(async (article) => {
      try {
        const response = await fetch('/api/articles', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(article),
        });
        if (!response.ok) throw new Error(`記事の保存に失敗しました: ${article.title}`);
        return { success: true, article };
      } catch (error) {
        console.error(error);
        return { 
          success: false, 
          article, 
          error: error instanceof Error ? error.message : '未知のエラーが発生しました'
        };
      }
    }));

    const successfulSaves = results.filter(r => r.success);
    const failedSaves = results.filter(r => !r.success);

    toast({
      title: '保存結果',
      description: `${successfulSaves.length}件の記事が保存されました。${failedSaves.length}件の記事の保存に失敗しました。`,
      status: successfulSaves.length > 0 ? 'success' : 'warning',
      duration: 5000,
      isClosable: true,
    });
  };

  const handleAllSourcesToggle = () => {
    if (allSourcesSelected) {
      setSelectedSources([]);
    } else {
      setSelectedSources(englishSources.map(source => source.id));
    }
    setAllSourcesSelected(!allSourcesSelected);
  };

  const handleAllArticlesToggle = () => {
    if (allArticlesSelected) {
      setSelectedArticles([]);
    } else {
      setSelectedArticles(paginatedArticles);
    }
    setAllArticlesSelected(!allArticlesSelected);
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
        <VStack spacing={4} align="stretch" mb={5}>
          <Flex justifyContent="center" flexWrap="wrap">
            <Checkbox
              isChecked={allSourcesSelected}
              onChange={handleAllSourcesToggle}
              mr={4}
            >
              check all sources
            </Checkbox>
          </Flex>
          <Flex justifyContent="center" flexWrap="wrap">
            {englishSources.map(source => (
              <Checkbox
                key={source.id}
                isChecked={selectedSources.includes(source.id)}
                onChange={() => handleSourceChange(source.id)}
                mr={4}
              >
                {source.name}
              </Checkbox>
            ))}
          </Flex>
        </VStack>
        <Flex justifyContent="center" mb={5}>
          <Select value={sortBy} onChange={handleSortChange} mr={2} width="auto">
            <option value="publishedAt">Published Date</option>
            <option value="source">Source</option>
          </Select>
          <Button onClick={handleSortOrderChange} mr={2}>
            {sortOrder === 'asc' ? 'Ascending' : 'Descending'}
          </Button>
          <Button onClick={searchArticles} colorScheme="blue">Search</Button>
        </Flex>
        <Flex justifyContent="center" mb={3}>
          <Checkbox
            isChecked={allArticlesSelected}
            onChange={handleAllArticlesToggle}
          >
            check all
          </Checkbox>
        </Flex>
        <List spacing={3} textAlign="left" mx="auto" width="50%">
          {paginatedArticles.map((article, index) => (
            <ListItem key={index} display="flex" alignItems="center">
              <Checkbox
                isChecked={selectedArticles.includes(article)}
                onChange={() => handleCheckboxChange(index)}
                mr={2}
              />
              <Box>
                <Link href={article.url} target="_blank" rel="noopener noreferrer" passHref>
                  <Text as="span" color="blue.500">{article.title}</Text>
                </Link>
                <Text fontSize="sm">{article.source} - {new Date(article.publishedAt).toLocaleString()}</Text>
                <Text fontSize="sm">{article.description}</Text>
              </Box>
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