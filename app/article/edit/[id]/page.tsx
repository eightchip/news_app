'use client';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Button, FormControl, FormLabel, Input, Textarea, Text, VStack, HStack, useToast, Icon, Spinner, Select, Flex } from '@chakra-ui/react';
import { FaSave } from 'react-icons/fa';
import NavBar from '../../../components/Navbar';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { PlayButton } from '../../../components/PlayButton';
import { SpeechToTextButton } from '../../../components/SpeechToTextButton';

interface Params {
  id: string;
}

interface Article {
  title: string;
  description: string;
  url: string;
  imageUrl: string;
}

interface WordList {
  id: number;
  words: string[];
  articleId: number;
}

const EditArticlePage = ({ params }: { params: Params }) => {
  const [article, setArticle] = useState<Article>({ title: '', description: '', url: '', imageUrl: '' });
  const [wordList, setWordList] = useState<WordList>({ id: 0, words: [], articleId: 0 });
  const [editingWords, setEditingWords] = useState('');
  const [translatedWords, setTranslatedWords] = useState('');
  const router = useRouter();
  const toast = useToast();
  const supabase = createClientComponentClient();
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<'en-US' | 'en-GB'>('en-US');
  const [wordListLanguage, setWordListLanguage] = useState<'en-US' | 'en-GB'>('en-US');
  const [speechToTextLanguage, setSpeechToTextLanguage] = useState<'ja-JP' | 'en-US' | 'en-GB'>('ja-JP');

  const fetchArticle = useCallback(async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      router.push('/login');
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

    const wordListRes = await fetch(`/api/wordlists/${params.id}`);
    if (wordListRes.ok) {
      const wordListData = await wordListRes.json();
      setWordList(wordListData);
    } else {
      console.error('単語リストの取得に失敗しました');
    }
  }, [params.id, router, supabase, toast]);

  useEffect(() => {
    fetchArticle();
  }, [fetchArticle]);

  useEffect(() => {
    if (wordList.words) {
      setEditingWords(wordList.words.join(', '));
    }
  }, [wordList]);

  const handleTranscriptionStart = () => {
    setIsProcessing(true);
  };

  const handleTranscriptionComplete = (text: string) => {
    setEditingWords(prev => {
      const newWords = prev ? `${prev}, ${text}` : text;
      return newWords;
    });
    setIsProcessing(false);
    toast({
      title: '音声認識完了',
      description: '認識されたテキストが表現リストに追加されました。',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const wordsArray = editingWords.split(',').map(word => word.trim()).filter(word => word !== '');
    const updatedWordList = { ...wordList, words: wordsArray };

    const articleRes = await fetch(`/api/articles/${params.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(article),
    });

    const wordListRes = await fetch(`/api/wordlists/${params.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedWordList),
    });

    if (articleRes.ok && wordListRes.ok) {
      setWordList(updatedWordList);
      toast({ title: '記事と表現リストを更新しました', status: 'success' });
      router.push('/article/manage');
    } else {
      toast({ title: '更新に失敗しました', status: 'error' });
    }
  };

  const handleTranslate = async () => {
    try {
      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: article.description }),
      });
      
      if (response.ok) {
        const { translation } = await response.json();
        setTranslatedWords(translation);
        toast({
          title: '翻訳完了',
          description: '本文が翻訳されました。表現リストに追加するには、下の「表現リストに追加」ボタンを押してください。',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
      } else {
        throw new Error('翻訳に失敗しました');
      }
    } catch (error) {
      console.error('翻訳エラー:', error);
      toast({
        title: 'エラー',
        description: '翻訳に失敗しました。しばらくしてからもう一度お試しください。',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleAddToWordList = () => {
    if (translatedWords.trim()) {
      setEditingWords(prev => {
        const newWords = prev ? `${prev}\n${translatedWords}` : translatedWords;
        return newWords;
      });
      setTranslatedWords('');
      toast({
        title: '追加完了',
        description: '翻訳された文章が表現リストに追加されました。',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box>
      <NavBar />
      <Box maxWidth="800px" margin="auto" mt={5} p={5} boxShadow="md" borderRadius="lg" bg="orange.50">
        <form onSubmit={handleSubmit}>
          <VStack spacing={6} align="stretch">
            <FormControl>
              <FormLabel color="orange.600" fontWeight="bold">タイトル</FormLabel>
              <Input 
                value={article.title} 
                onChange={(e) => setArticle({...article, title: e.target.value})}
                borderColor="gray.300"
                _hover={{ borderColor: "gray.400" }}
                _focus={{ borderColor: "orange.500", boxShadow: "0 0 0 1px orange.500" }}
                bg="white"
              />
            </FormControl>
            <FormControl>
              <FormLabel color="orange.600" fontWeight="bold">本文</FormLabel>
              <Textarea 
                value={article.description} 
                onChange={(e) => setArticle({...article, description: e.target.value})}
                borderColor="gray.300"
                _hover={{ borderColor: "gray.400" }}
                _focus={{ borderColor: "orange.500", boxShadow: "0 0 0 1px orange.500" }}
                minHeight="150px"
                bg="white"
              />
              <Box mt={2}>
                <Flex alignItems="center">
                  <Select
                    value={selectedLanguage}
                    onChange={(e) => setSelectedLanguage(e.target.value as 'en-US' | 'en-GB')}
                    width="auto"
                    size="sm"
                    mr={2}
                  >
                    <option value="en-US">US</option>
                    <option value="en-GB">UK</option>
                  </Select>
                  <PlayButton text={article.description} language={selectedLanguage} size="sm" />
                </Flex>
              </Box>
            </FormControl>
            
            <FormControl>
              <FormLabel color="orange.600" fontWeight="bold">翻訳</FormLabel>
              <Button onClick={handleTranslate} colorScheme="teal" mb={4} size="sm">
                本文を和訳
              </Button>
              <Textarea
                value={translatedWords}
                onChange={(e) => setTranslatedWords(e.target.value)}
                placeholder="ここに翻訳された文章が表示されます。必要に応じて編集できます。"
                height="150px"
                mb={4}
              />
              <Button onClick={handleAddToWordList} colorScheme="blue" mb={4} isDisabled={!translatedWords.trim()} size="sm">
                表現リストに追加
              </Button>
            </FormControl>

            <FormControl>
              <FormLabel color="orange.600" fontWeight="bold">表現リスト</FormLabel>
              <Textarea
                value={editingWords}
                onChange={(e) => setEditingWords(e.target.value)}
                placeholder={`言語選択、録音または再生\n発音練習・リスニング・シャドーイング練習など自分のニーズに合った使い方を見つけて下さい。`}
                height="150px"
                mb={4}
              />
              <VStack align="start" spacing={2} mt={2}>
                <HStack>
                  <Select
                    value={wordListLanguage}
                    onChange={(e) => setWordListLanguage(e.target.value as 'en-US' | 'en-GB')}
                    size="sm"
                    width="auto"
                  >
                    <option value="en-US">US</option>
                    <option value="en-GB">UK</option>
                  </Select>
                  <PlayButton text={editingWords} language={wordListLanguage} size="sm" />
                </HStack>
                <HStack>
                  <Select
                    value={speechToTextLanguage}
                    onChange={(e) => setSpeechToTextLanguage(e.target.value as 'ja-JP' | 'en-US' | 'en-GB')}
                    size="sm"
                    width="auto"
                  >
                    <option value="ja-JP">JPN</option>
                    <option value="en-US">US</option>
                    <option value="en-GB">UK</option>
                  </Select>
                  <SpeechToTextButton 
                    onTranscriptionStart={handleTranscriptionStart}
                    onTranscriptionComplete={handleTranscriptionComplete}
                    language={speechToTextLanguage}
                    size="sm"
                  />
                </HStack>
              </VStack>
              {isProcessing && <Spinner mb={4} />}
            </FormControl>
            
            <Box display="flex" flexWrap="wrap" justifyContent="flex-start" mt={4} gap={2}>
              <Button type="submit" colorScheme="blue" leftIcon={<Icon as={FaSave} />} fontSize={{ base: 'sm', md: 'md' }} px={4} py={2} size="sm">
                更新
              </Button>
            </Box>
          </VStack>
        </form>
      </Box>
    </Box>
  );
};

export default EditArticlePage;