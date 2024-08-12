'use client';
import React, { useState, useEffect } from 'react';
import { Box, VStack, HStack, Text, Select, Button, Flex } from '@chakra-ui/react';
import NavBar from '../components/Navbar';
import { SpeechToTextButton } from '../components/SpeechToTextButton';
import { PlayButton } from '../components/PlayButton';

const languageOptions = [
  { value: 'ja-JP', label: '日本語' },
  { value: 'en-US', label: 'English (US)' },
  { value: 'en-GB', label: 'English (UK)' },
  { value: 'ko-KR', label: '한국어' },
  { value: 'zh-CN', label: '中文 (简体)' },
  { value: 'zh-HK', label: '中文 (香港)' },
  { value: 'th-TH', label: 'ไทย' },
  { value: 'id-ID', label: 'Bahasa Indonesia' },
  { value: 'hi-IN', label: 'हिन्दी' },
  { value: 'vi-VN', label: 'Tiếng Việt' }, // ベトナム語を追加
];

const GlobalTalkPage = () => {
  const [sourceLanguage, setSourceLanguage] = useState('ja-JP');
  const [targetLanguage, setTargetLanguage] = useState('en-US');
  const [sourceText, setSourceText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);

  useEffect(() => {
    // 言語が変更されたときに入力テキストをクリア
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
      } else {
        throw new Error('翻訳に失敗しました');
      }
    } catch (error) {
      console.error('翻訳エラー:', error);
      // エラー処理を追加（例：トースト通知）
    } finally {
      setIsTranslating(false);
    }
  };

  return (
    <Box>
      <NavBar />
      <VStack spacing={8} align="stretch" maxW="800px" mx="auto" mt={8} p={4}>
        <Flex justifyContent="space-between" alignItems="center">
          <Select value={sourceLanguage} onChange={(e) => setSourceLanguage(e.target.value)} width="40%">
            {languageOptions.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </Select>
          <Button onClick={handleLanguageSwitch}>⇄</Button>
          <Select value={targetLanguage} onChange={(e) => setTargetLanguage(e.target.value)} width="40%">
            {languageOptions.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </Select>
        </Flex>

        <Box borderWidth={1} borderRadius="lg" p={6}>
          <Text fontSize="xl" fontWeight="bold" mb={4}>入力 ({languageOptions.find(l => l.value === sourceLanguage)?.label}):</Text>
          <Text fontSize="lg" minHeight="100px">{sourceText}</Text>
          <HStack mt={4}>
            <SpeechToTextButton 
              onTranscriptionComplete={handleTranscriptionComplete}
              language={sourceLanguage}
            />
          </HStack>
        </Box>

        <Box borderWidth={1} borderRadius="lg" p={6}>
          <Text fontSize="xl" fontWeight="bold" mb={4}>翻訳 ({languageOptions.find(l => l.value === targetLanguage)?.label}):</Text>
          <Text fontSize="lg" minHeight="100px">{isTranslating ? '翻訳中...' : translatedText}</Text>
          <HStack mt={4}>
            <PlayButton text={translatedText} language={targetLanguage} />
          </HStack>
        </Box>
      </VStack>
    </Box>
  );
};

export default GlobalTalkPage;