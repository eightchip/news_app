// components/PlayButton.tsx
import React, { useState, useRef } from 'react';
import { Button, Icon, Box } from '@chakra-ui/react';
import { FaVolumeUp, FaPause } from 'react-icons/fa';

interface PlayButtonProps {
  text: string;
  language?: string;
  size?: string;
}

export const PlayButton: React.FC<PlayButtonProps> = ({ text, language = 'en-US', size }) => {
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
        size={size}
        width="auto"
      >
        再生 ({language === 'en-US' ? 'US' : 'UK'})
      </Button>
      <Box ml={2}>
        <Button
          leftIcon={<Icon as={FaPause} />}
          onClick={handlePause}
          isDisabled={!isPlaying || isLoading}
          variant="outline"
          colorScheme="teal"
          size={size}
          width="auto"
        >
          停止
        </Button>
      </Box>
      <audio ref={audioRef} onEnded={handleAudioEnded} />
    </Box>
  );
};