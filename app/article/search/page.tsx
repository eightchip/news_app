// app/article/search/page.tsx
'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import supabase from '../../lib/supabase';
import { Box, Button, Checkbox, Heading, Input, List, ListItem, Text, useToast, Flex, Select, VStack, Spinner, Radio, RadioGroup } from '@chakra-ui/react';
import NavBar from '../../components/Navbar';
import { Article } from '../../types/Article';
import Link from 'next/link';
import { ReadAloudButton } from '../../components/ReadAloudButton';

const englishSources = [
  { id: 'bbc-news', name: 'BBC News' },
  { id: 'cnn', name: 'CNN' },
  { id: 'the-new-york-times', name: 'The New York Times' },
  { id: 'the-guardian-uk', name: 'The Guardian' },
  { id: 'reuters', name: 'Reuters' },
];

const ArticleSearch = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [articles, setArticles] = useState<Article[]>([]);
  const [selectedArticles, setSelectedArticles] = useState<Article[]>([]);
  const [page, setPage] = useState(1);
  const [selectedSources, setSelectedSources] = useState(englishSources.map(source => source.id));
  const [sortBy, setSortBy] = useState('publishedAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [allSourcesSelected, setAllSourcesSelected] = useState(true);
  const [allArticlesSelected, setAllArticlesSelected] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [voiceLanguage, setVoiceLanguage] = useState<'en-US' | 'en-GB'>('en-US');

  const router = useRouter();
  const toast = useToast();
  const articlesPerPage = 10;

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          setUserId(session.user.id);
          setIsLoading(false);
        } else {
          router.push('/login');
        }
      } catch (error) {
        console.error('認証チェックエラー:', error);
        toast({
          title: '認証エラー',
          description: '認証状態の確認中にエラーが発生しました。',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    };
    checkAuth();
  }, [router, toast]);

  useEffect(() => {
    const handleAudioEnded = () => {
      console.log('Audio ended');
      setIsPlaying(false);
    };

    const handleAudioPause = () => {
      console.log('Audio paused');
      setIsPlaying(false);
    };

    const audioElement = audioRef.current;
    if (audioElement) {
      audioElement.addEventListener('ended', handleAudioEnded);
      audioElement.addEventListener('pause', handleAudioPause);
    }

    return () => {
      if (audioElement) {
        audioElement.removeEventListener('ended', handleAudioEnded);
        audioElement.removeEventListener('pause', handleAudioPause);
      }
    };
  }, []);

  const searchArticles = async () => {
    setIsSearching(true);
    const sourcesQuery = selectedSources.join(',');
    try {
      const res = await fetch(`/api/news?q=${query}&sources=${sourcesQuery}&sortBy=${sortBy}&sortOrder=${sortOrder}`);
      if (!res.ok) {
        throw new Error('記事の取得に失敗しました');
      }
      const data = await res.json();
      setArticles(data.articles || []); // データがない場合は空配列を設定
    } catch (error) {
      console.error('記事の検索中にエラーが発生しました:', error);
      toast({
        title: 'エラー',
        description: '記事の検索中にエラーが発生しました。',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      setArticles([]); // エラー時は空配列を設定
    } finally {
      setIsSearching(false);
    }
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
    setIsSaving(true);
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      toast({
        title: 'エラー',
        description: 'セッションが無効です。再度ログインしてください。',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      router.push('/login');
      setIsSaving(false);
      return;
    }

    const userId = session.user.id;

    const preparedArticles = selectedArticles.map(article => ({
      title: article.title,
      description: article.description,
      url: article.url,
      imageUrl: article.urlToImage || 'No Image',
      userId: userId,
      source: typeof article.source === 'string' ? article.source : article.source.name
    }));

    try {
      const results = await Promise.all(preparedArticles.map(async (article) => {
        try {
          const response = await fetch('/api/articles', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(article),
            credentials: 'include',
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
        description: `${successfulSaves.length}件の記事が保存されました。`,
        status: successfulSaves.length > 0 ? 'success' : 'warning',
        duration: 5000,
        isClosable: true,
      });

      // 保存が成功した記事を選択リストから削除
      setSelectedArticles(prev => prev.filter(article => 
        !successfulSaves.some(save => save.article.url === article.url)
      ));
    } catch (error) {
      console.error('記事の保存中にエラーが発生しました:', error);
      toast({
        title: 'エラー',
        description: '記事の保存中にエラーが発生しました。',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsSaving(false);
    }
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

  const playDescription = async (description: string) => {
    console.log('playDescription called');
    try {
      const response = await fetch('/api/text-to-speech', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: description, language: voiceLanguage }),
      });

      if (!response.ok) {
        throw new Error('Failed to synthesize speech');
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);

      if (audioRef.current) {
        audioRef.current.src = audioUrl;
        await audioRef.current.play();
        setIsPlaying(true);
        console.log('Audio playing');
      }
    } catch (error) {
      console.error('Error playing description:', error);
      toast({
        title: 'エラー',
        description: '音声の再生に失敗しました。',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      setIsPlaying(false); // エラー時に再生状態をリセット
    }
  };

  const pauseDescription = () => {
    console.log('pauseDescription called');
    if (audioRef.current && !audioRef.current.paused) {
      audioRef.current.pause();
      setIsPlaying(false);
      console.log('Audio paused');
    }
  };

  const paginatedArticles = articles ? articles.slice((page - 1) * articlesPerPage, page * articlesPerPage) : [];

  if (isLoading) {
    return <Box>Loading...</Box>;
  }

  return (
    <Box>
      <NavBar />
      <Box p={5} textAlign="center">
        <Heading mb={5}>Search Articles</Heading>
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
          <Button onClick={searchArticles} colorScheme="blue" isDisabled={isSearching}>
            {isSearching ? (
              <>
                <Spinner size="sm" mr={2} />
                検索しています...
              </>
            ) : (
              'Search'
            )}
          </Button>
        </Flex>
        <RadioGroup onChange={(value) => setVoiceLanguage(value as 'en-US' | 'en-GB')} value={voiceLanguage} mb={5}>
          <Flex justifyContent="center">
            <Radio value="en-US" mr={4}>American English</Radio>
            <Radio value="en-GB">British English</Radio>
          </Flex>
        </RadioGroup>
        <Flex justifyContent="center" mb={3}>
          <Checkbox
            isChecked={allArticlesSelected}
            onChange={handleAllArticlesToggle}
            mr={2}
          >
            check all articles
          </Checkbox>
        </Flex>
        <Box width="80%" mx="auto">
          <List spacing={3} textAlign="left">
            {paginatedArticles.map((article, index) => (
              <ListItem key={index} borderWidth="1px" borderRadius="lg" overflow="hidden" p={4}>
                <Flex alignItems="flex-start">
                  <Checkbox
                    isChecked={selectedArticles.includes(article)}
                    onChange={() => handleCheckboxChange(index)}
                    mr={2}
                    mt={1}
                  />
                  <Box flex={1}>
                    <Link href={article.url} target="_blank" rel="noopener noreferrer">
                      <Text as="span" color="blue.500" fontWeight="bold">{article.title}</Text>
                    </Link>
                    <Text fontSize="sm" color="gray.500">
                      {typeof article.source === 'string' ? article.source : article.source.name} - {new Date(article.publishedAt).toLocaleString()}
                    </Text>
                    <Text fontSize="sm" mt={2}>{article.description}</Text>
                    <Box mt={2}>
                      <ReadAloudButton
                        onPlay={() => playDescription(article.description)}
                        onPause={pauseDescription}
                        isPlaying={isPlaying}
                        isLoading={false}
                        language={voiceLanguage}
                      />
                    </Box>
                  </Box>
                </Flex>
              </ListItem>
            ))}
          </List>
        </Box>
        <Flex mt={5} justifyContent="center">
          <Button 
            onClick={() => setPage(page > 1 ? page - 1 : 1)} 
            mr={2}
            isDisabled={page === 1}
          >
            Previous
          </Button>
          <Text mx={2} alignSelf="center">
            Page {page} of {Math.ceil(articles.length / articlesPerPage)}
          </Text>
          <Button 
            onClick={() => setPage(page + 1)}
            isDisabled={page >= Math.ceil(articles.length / articlesPerPage)}
          >
            Next
          </Button>
        </Flex>
        <Button 
          onClick={saveSelectedArticles} 
          mt={5} 
          colorScheme="green" 
          isDisabled={isSaving || selectedArticles.length === 0}
        >
          {isSaving ? (
            <>
              <Spinner size="sm" mr={2} />
              記事を保存しています...
            </>
          ) : (
            'Save Selected Articles'
          )}
        </Button>
      </Box>
      <audio ref={audioRef} onEnded={() => setIsPlaying(false)} />
    </Box>
  );
};

export default ArticleSearch;