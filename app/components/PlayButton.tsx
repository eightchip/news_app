// components/PlayButton.tsx
import React, { useState, useRef } from 'react';
import { Button, Icon, Box, Select } from '@chakra-ui/react';
import { FaVolumeUp, FaPause } from 'react-icons/fa';

interface PlayButtonProps {
  text: string;
}

export const PlayButton: React.FC<PlayButtonProps> = ({ text }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [language, setLanguage] = useState<'en-US' | 'en-GB' | 'ja-JP'>('en-US');
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
        size="sm"
        width="auto"
      >
        再生
      </Button>
      <Box ml={2}>
        <Button
          leftIcon={<Icon as={FaPause} />}
          onClick={handlePause}
          isDisabled={!isPlaying || isLoading}
          variant="outline"
          colorScheme="teal"
          size="sm"
          width="auto"
        >
          停止
        </Button>
      </Box>
      <Box ml={2}>
        <Select
          value={language}
          onChange={(e) => setLanguage(e.target.value as 'en-US' | 'en-GB' | 'ja-JP')}
          size="sm"
        >
          <option value="en-US">US</option>
          <option value="en-GB">UK</option>
          <option value="ja-JP">JP</option>
        </Select>
      </Box>
      <audio ref={audioRef} onEnded={handleAudioEnded} />
    </Box>
  );
};