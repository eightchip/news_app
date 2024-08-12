'use client';
import React, { useState, useEffect } from 'react';
import { Box, VStack, HStack, Text, Select, Button, Flex, useToast, Spinner, Textarea } from '@chakra-ui/react';
import NavBar from '../components/Navbar';
import { globalTalkLanguageOptions } from '../global_talk/constants';
import { GlobalTalkRecordButton } from '../components/GlobalTalkRecordButton';
import { GlobalTalkPlayButton } from '../components/GlobalTalkPlayButton';

interface TranslationHistory {
  sourceText: string;
  translatedText: string;
  sourceLanguage: string;
  targetLanguage: string;
}

const GlobalTalkPage = () => {
  const [sourceLanguage, setSourceLanguage] = useState('ja-JP');
  const [targetLanguage, setTargetLanguage] = useState('en-US');
  const [sourceText, setSourceText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);
  const [history, setHistory] = useState<TranslationHistory[]>([]);
  const toast = useToast();

  useEffect(() => {
    setSourceText('');
    setTranslatedText('');
  }, [sourceLanguage, targetLanguage]);

  const handleLanguageSwitch = () => {
    setSourceLanguage(targetLanguage);
    setTargetLanguage(sourceLanguage);
  };

  const handleTranscriptionComplete = async (text: string) => {
    setSourceText(text);
    await translateText(text);
  };

  const translateText = async (text: string) => {
    setIsTranslating(true);
    try {
      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          text, 
          sourceLanguage: sourceLanguage.split('-')[0],
          targetLanguage: targetLanguage.split('-')[0],
        }),
      });
      
      if (response.ok) {
        const { translation } = await response.json();
        setTranslatedText(translation);
        setHistory(prev => [...prev, {
          sourceText: text,
          translatedText: translation,
          sourceLanguage,
          targetLanguage
        }]);
      } else {
        throw new Error('翻訳に失敗しました');
      }
    } catch (error) {
      console.error('翻訳エラー:', error);
      toast({
        title: '翻訳エラー',
        description: '翻訳中にエラーが発生しました。もう一度お試しください。',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsTranslating(false);
    }
  };

  const handleSourceTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setSourceText(e.target.value);
  };

  return (
    <Box>
      <NavBar />
      <VStack spacing={8} align="stretch" maxW="800px" mx="auto" mt={8} p={4}>
        <Flex justifyContent="space-between" alignItems="center">
          <Select value={sourceLanguage} onChange={(e) => setSourceLanguage(e.target.value)} width="40%">
            {globalTalkLanguageOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.displayName} / {option.label}
              </option>
            ))}
          </Select>
          <Button onClick={handleLanguageSwitch}>⇄</Button>
          <Select value={targetLanguage} onChange={(e) => setTargetLanguage(e.target.value)} width="40%">
            {globalTalkLanguageOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.displayName} / {option.label}
              </option>
            ))}
          </Select>
        </Flex>

        <Box borderWidth={1} borderRadius="lg" p={6}>
          <Text fontSize="xl" fontWeight="bold" mb={4}>
            入力 ({globalTalkLanguageOptions.find(l => l.value === sourceLanguage)?.displayName} / {globalTalkLanguageOptions.find(l => l.value === sourceLanguage)?.label}):
          </Text>
          <Textarea
            value={sourceText}
            onChange={handleSourceTextChange}
            placeholder="ここにテキストを入力または音声入力の結果を編集できます"
            minHeight="100px"
            mb={4}
          />
          <HStack mt={4} spacing={4}>
            <GlobalTalkRecordButton 
              onTranscriptionComplete={handleTranscriptionComplete}
              language={sourceLanguage}
            />
            <Button onClick={() => translateText(sourceText)} colorScheme="blue">
              翻訳
            </Button>
          </HStack>
        </Box>

        <Box borderWidth={1} borderRadius="lg" p={6}>
          <Text fontSize="xl" fontWeight="bold" mb={4}>
            翻訳 ({globalTalkLanguageOptions.find(l => l.value === targetLanguage)?.displayName} / {globalTalkLanguageOptions.find(l => l.value === targetLanguage)?.label}):
          </Text>
          {isTranslating ? (
            <Flex justify="center" align="center" minHeight="100px">
              <Spinner size="xl" />
              <Text ml={4}>翻訳中...</Text>
            </Flex>
          ) : (
            <Text fontSize="lg" minHeight="100px">{translatedText}</Text>
          )}
          <HStack mt={4} spacing={4}>
            <GlobalTalkPlayButton 
              text={translatedText} 
              language={globalTalkLanguageOptions.find(l => l.value === targetLanguage)?.ttsCode || targetLanguage} 
            />
          </HStack>
        </Box>

        {history.length > 0 && (
          <Box borderWidth={1} borderRadius="lg" p={6}>
            <Text fontSize="xl" fontWeight="bold" mb={4}>翻訳履歴:</Text>
            <VStack align="stretch" spacing={4}>
              {history.slice(-5).reverse().map((item, index) => (
                <Box key={index} p={2} borderWidth={1} borderRadius="md">
                  <Text><strong>{item.sourceLanguage}:</strong> {item.sourceText}</Text>
                  <Text><strong>{item.targetLanguage}:</strong> {item.translatedText}</Text>
                </Box>
              ))}
            </VStack>
          </Box>
        )}
      </VStack>
    </Box>
  );
};

export default GlobalTalkPage;