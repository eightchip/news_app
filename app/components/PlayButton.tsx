// components/PlayButton.tsx
import React, { useState, useRef } from 'react';
import { Button, Icon, Box, Select } from '@chakra-ui/react';
import { FaVolumeUp, FaPause } from 'react-icons/fa';

interface PlayButtonProps {
  text: string;
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

export const PlayButton: React.FC<PlayButtonProps> = ({ text, language }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handlePlay = async () => {
    if (isPlaying) return;

    setIsLoading(true);
    try {
      const response = await fetch('/api/text-to-speech', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text, language }),
      });

      if (!response.ok) {
        throw new Error('音声データの取得に失敗しました');
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);

      if (audioRef.current) {
        audioRef.current.src = audioUrl;
        await audioRef.current.play();
        setIsPlaying(true);
      }
    } catch (error) {
      console.error('音声の再生中にエラーが発生しました:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePause = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleAudioEnded = () => {
    setIsPlaying(false);
  };

  return (
    <Box display="flex" alignItems="center">
      <Button
        leftIcon={<Icon as={FaVolumeUp} />}
        onClick={handlePlay}
        isDisabled={isPlaying || isLoading}
        variant="outline"
        colorScheme="teal"
        size="md"
        width="auto"
      >
        再生
      </Button>
      <Button
        ml={2}
        leftIcon={<Icon as={FaPause} />}
        onClick={handlePause}
        isDisabled={!isPlaying || isLoading}
        variant="outline"
        colorScheme="red"
        size="md"
        width="auto"
      >
        停止
      </Button>
      <audio ref={audioRef} onEnded={handleAudioEnded} />
    </Box>
  );
};