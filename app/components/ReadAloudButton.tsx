// app/components/ReadAloudButton.tsx
import React from 'react';
import { Button, Icon, Box } from '@chakra-ui/react';
import { FaVolumeUp, FaPause } from 'react-icons/fa';

interface ReadAloudButtonProps {
  onPlay: () => void;
  onPause: () => void;
  isPlaying: boolean;
  isLoading: boolean;
  language: 'en-US' | 'en-GB';
}

export const ReadAloudButton: React.FC<ReadAloudButtonProps> = ({ onPlay, onPause, isPlaying, isLoading, language }) => {
  return (
    <Box display="flex" alignItems="center">
      <Button
        leftIcon={<Icon as={FaVolumeUp} />}
        onClick={onPlay}
        isDisabled={isPlaying || isLoading}
        variant="outline"
        colorScheme="teal"
        size="sm"
        width="auto"
      >
        再生 ({language === 'en-US' ? 'US' : 'UK'})
      </Button>
      <Box ml={2}>
        <Button
          leftIcon={<Icon as={FaPause} />}
          onClick={onPause}
          isDisabled={!isPlaying || isLoading}
          variant="outline"
          colorScheme="teal"
          size="sm"
          width="auto"
        >
          停止
        </Button>
      </Box>
    </Box>
  );
};