import React, { useState, useRef } from 'react';
import { Button, ButtonGroup, Icon } from '@chakra-ui/react';
import { FaPlay, FaStop } from 'react-icons/fa';

interface GlobalTalkPlayButtonProps {
  text: string;
  language: string;
  onPlayButtonClick: () => void;
  isDisabled: boolean;
}

export const GlobalTalkPlayButton: React.FC<GlobalTalkPlayButtonProps> = ({ text, language, onPlayButtonClick, isDisabled }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handlePlay = async () => {
    if (isPlaying) return;
    onPlayButtonClick();
    try {
      const response = await fetch('/api/text-to-speech', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text, language }),
      });

      if (!response.ok) {
        throw new Error('Failed to synthesize speech');
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      
      if (audioRef.current) {
        audioRef.current.src = audioUrl;
        audioRef.current.play();
        setIsPlaying(true);
      }
    } catch (error) {
      console.error('Error playing audio:', error);
    }
  };

  const handleStop = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
    }
  };

  return (
    <>
      <ButtonGroup isAttached={false} variant='outline' spacing={2}>
        <Button
          onClick={handlePlay}
          isDisabled={isDisabled || isPlaying}
          colorScheme="blue"
          leftIcon={<Icon as={FaPlay} />}
        >
          再生
        </Button>
        <Button
          onClick={handleStop}
          isDisabled={!isPlaying}
          colorScheme="red"
          leftIcon={<Icon as={FaStop} />}
        >
          停止
        </Button>
      </ButtonGroup>
      <audio ref={audioRef} onEnded={() => setIsPlaying(false)} />
    </>
  );
};