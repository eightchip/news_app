'use client';
import React, { useState, useRef, useEffect } from 'react';
import { Button, Select, Box, Icon, useToast } from '@chakra-ui/react';
import { FaMicrophone, FaStop } from 'react-icons/fa';

interface SpeechToTextButtonProps {
  onTranscriptionComplete: (text: string) => void;
  language: string;
}

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

export const SpeechToTextButton: React.FC<SpeechToTextButtonProps> = ({ 
  onTranscriptionComplete,
  language
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const toast = useToast();
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const checkBrowserSupport = async () => {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setIsSupported(false);
        toast({
          title: '警告',
          description: 'このブラウザは録音をサポートしていません。',
          status: 'warning',
          duration: 5000,
          isClosable: true,
        });
      } else {
        try {
          await navigator.mediaDevices.getUserMedia({ audio: true });
          setIsSupported(true);
        } catch (error) {
          console.error('マイクアクセスエラー:', error);
          setIsSupported(false);
          toast({
            title: '警告',
            description: 'マイクへのアクセスが許可されていません。',
            status: 'warning',
            duration: 5000,
            isClosable: true,
          });
        }
      }
    };

    checkBrowserSupport();
  }, [toast]);

  const startRecording = async () => {
    try {
      setIsRecording(true);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const options = {
        mimeType: 'audio/webm;codecs=opus',
      };
      
      if (!MediaRecorder.isTypeSupported(options.mimeType)) {
        console.warn(`${options.mimeType}はサポートされていません。代替フォーマットを使用します。`);
        options.mimeType = 'audio/ogg;codecs=opus';
        if (!MediaRecorder.isTypeSupported(options.mimeType)) {
          options.mimeType = '';
        }
      }
      const mediaRecorder = new MediaRecorder(stream, options);
      mediaRecorderRef.current = mediaRecorder;
      const audioChunks: Blob[] = [];

      mediaRecorder.addEventListener('dataavailable', (event) => {
        audioChunks.push(event.data);
      });

      mediaRecorder.addEventListener('stop', async () => {
        const audioBlob = new Blob(audioChunks, { type: options.mimeType });

        if (audioRef.current) {
          audioRef.current.src = URL.createObjectURL(audioBlob);
        }

        const formData = new FormData();
        formData.append('audio', audioBlob);
        formData.append('language', language);

        try {
          const response = await fetch('/api/speech-to-text', {
            method: 'POST',
            body: formData,
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`音声認識に失敗しました: ${errorData.details}`);
          }

          const { text } = await response.json();
          onTranscriptionComplete(text);
        } catch (error) {
          console.error('音声認識エラー:', error);
          toast({
            title: 'エラー',
            description: '音声認識に失敗しました。',
            status: 'error',
            duration: 5000,
            isClosable: true,
          });
        } finally {
          setIsRecording(false);
        }
      });

      mediaRecorder.start();
    } catch (error) {
      console.error('録音エラー:', error);
      let errorMessage = '録音の開始に失敗しました。';
      if (error instanceof DOMException) {
        switch (error.name) {
          case 'NotAllowedError':
            errorMessage += 'マイクへのアクセスが許可されていません。';
            break;
          case 'NotFoundError':
            errorMessage += 'マイクが見つかりません。';
            break;
          case 'NotReadableError':
            errorMessage += 'マイクにアクセスできません。';
            break;
          default:
            errorMessage += 'ブラウザの設定を確認してください。';
        }
      }
      toast({
        title: 'エラー',
        description: errorMessage,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      setIsRecording(false);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
    }
  };

  if (!isSupported) {
    return <Box>お使いのデバイスは録音をサポートしていません。</Box>;
  }

  return (
    <Box display="flex" alignItems="center">
      <Button
        leftIcon={<Icon as={FaMicrophone} />}
        onClick={startRecording}
        isDisabled={isRecording}
        variant="outline"
        colorScheme="teal"
        size="md"
        width="auto"
      >
        録音
      </Button>
      <Button
        ml={2}
        leftIcon={<Icon as={FaStop} />}
        onClick={stopRecording}
        isDisabled={!isRecording}
        variant="outline"
        colorScheme="red"
        size="md"
        width="auto"
      >
        停止
      </Button>
      <audio ref={audioRef} controls style={{ display: 'none' }} />
    </Box>
  );
};