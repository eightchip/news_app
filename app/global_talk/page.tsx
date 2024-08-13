'use client';
import React, { useState, useEffect, useRef } from 'react';
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

interface HistorySession {
  sourceLanguage: string;
  targetLanguage: string;
  translations: TranslationHistory[];
}

const GlobalTalkPage = () => {
  const [sourceLanguage, setSourceLanguage] = useState('ja-JP');
  const [targetLanguage, setTargetLanguage] = useState('en-US');
  const [sourceText, setSourceText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);
  const [historySessions, setHistorySessions] = useState<HistorySession[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [isPlayButtonDisabled, setIsPlayButtonDisabled] = useState(true);
  const recordButtonRef = useRef<{ stopRecording: () => void } | null>(null);
  const toast = useToast();
  const [currentTranslation, setCurrentTranslation] = useState<TranslationHistory | null>(null);

  useEffect(() => {
    setSourceText('');
    setTranslatedText('');
    setHistorySessions(prev => [
      ...prev,
      { sourceLanguage, targetLanguage, translations: [] }
    ]);
  }, [sourceLanguage, targetLanguage]);

  const handleLanguageSwitch = () => {
    setSourceLanguage(targetLanguage);
    setTargetLanguage(sourceLanguage);
  };

  const handleTranscriptionComplete = async (text: string) => {
    setSourceText(text);
    await translateText(text);
  };

  const handleRecordingStart = () => {
    setIsRecording(true);
    setCurrentTranslation(null);
    setIsPlayButtonDisabled(true);
  };

  const handleRecordingStop = () => {
    setIsRecording(false);
    setIsPlayButtonDisabled(false);
  };

  const handlePlayButtonClick = () => {
    if (isRecording) {
      toast({
        title: '警告',
        description: '再生する前に録音を停止してください。',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (currentTranslation) {
      setHistorySessions(prev => {
        const newSessions = [...prev];
        const currentSession = newSessions[newSessions.length - 1];
        currentSession.translations.push(currentTranslation);
        return newSessions;
      });
      // 音声再生のロジックをここに追加
      // 例: playAudio(currentTranslation.translatedText);
    }
  };

  const translateText = async (text: string) => {
    setIsTranslating(true);
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30秒でタイムアウト

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
        signal: controller.signal
      });

      clearTimeout(timeoutId);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`翻訳に失敗しました: ${errorData.message || response.statusText}`);
      }

      const { translation } = await response.json();
      setTranslatedText(translation);
      setCurrentTranslation({
        sourceText: text,
        translatedText: translation,
        sourceLanguage,
        targetLanguage
      });
    } catch (error) {
      console.error('翻訳エラー:', error);
      toast({
        title: '翻訳エラー',
        description: error instanceof Error 
          ? (error.name === 'AbortError' ? '翻訳がタイムアウトしました。もう一度お試しください。' : error.message)
          : '翻訳中にエラーが発生しました。もう一度お試しください。',
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
              onRecordingStart={handleRecordingStart}
              onRecordingStop={handleRecordingStop}
              language={sourceLanguage}
              ref={recordButtonRef}
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
              onPlayButtonClick={handlePlayButtonClick}
              isDisabled={isPlayButtonDisabled}
            />
          </HStack>
        </Box>

        {historySessions.length > 0 && (
          <Box borderWidth={1} borderRadius="lg" p={6}>
            <Text fontSize="xl" fontWeight="bold" mb={4}>翻訳履歴:</Text>
            <VStack align="stretch" spacing={4}>
              {historySessions.map((session, sessionIndex) => (
                <Box key={sessionIndex} p={2} borderWidth={1} borderRadius="md">
                  <Text fontWeight="bold">
                    {globalTalkLanguageOptions.find(l => l.value === session.sourceLanguage)?.displayName} →{' '}
                    {globalTalkLanguageOptions.find(l => l.value === session.targetLanguage)?.displayName}
                  </Text>
                  {session.translations.map((item, index) => (
                    <Box key={index} mt={2}>
                      <Text><strong>{item.sourceLanguage}:</strong> {item.sourceText}</Text>
                      <Text><strong>{item.targetLanguage}:</strong> {item.translatedText}</Text>
                    </Box>
                  ))}
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