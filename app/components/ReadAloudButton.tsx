import React from 'react';
import { Button, Icon } from '@chakra-ui/react';
import { FaVolumeUp } from 'react-icons/fa';

interface ReadAloudButtonProps {
  onClick: () => void;
  isLoading: boolean;
  language: 'en-US' | 'en-GB';
}

export const ReadAloudButton: React.FC<ReadAloudButtonProps> = ({ onClick, isLoading, language }) => {
  return (
    <Button
      leftIcon={<Icon as={FaVolumeUp} />}
      onClick={onClick}
      isLoading={isLoading}
      loadingText="再生中"
      variant="outline"
      colorScheme="teal"
      size="sm"
      width="auto"
    >
      読み上げ ({language === 'en-US' ? 'US' : 'UK'})
    </Button>
  );
};