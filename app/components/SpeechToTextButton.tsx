'use client';
import React, { useState, useRef, useEffect } from 'react';
import { Button, Select, Box, Icon, useToast } from '@chakra-ui/react';
import { FaMicrophone, FaStop } from 'react-icons/fa';

interface SpeechToTextButtonProps {
  onTranscriptionComplete: (text: string) => void;
  onTranscriptionStart: () => void;
}

export const SpeechToTextButton: React.FC<SpeechToTextButtonProps> = ({ 
  onTranscriptionComplete, 
  onTranscriptionStart 
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [language, setLanguage] = useState('en-US');
  const [isSupported, setIsSupported] = useState(true);
  const toast = useToast();
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)) {
      setIsSupported(false);
      toast({
        title: '警告',
        description: 'このブラウザは録音をサポートしていません。',
        status: 'warning',
        duration: 5000,
        isClosable: true,
      });
    }
  }, [toast]);

  const startRecording = async () => {
    try {
      setIsRecording(true);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm;codecs=opus' });
      mediaRecorderRef.current = mediaRecorder;
      const audioChunks: Blob[] = [];

      mediaRecorder.addEventListener('dataavailable', (event) => {
        audioChunks.push(event.data);
      });

      mediaRecorder.addEventListener('stop', async () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });

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
      toast({
        title: 'エラー',
        description: '録音の開始に失敗しました。マイクへのアクセスが許可されているか確認してください。',
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
      onTranscriptionStart();
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
        size="sm"
        width="auto"
      >
        録音
      </Button>
      <Box ml={2}>
        <Button
          leftIcon={<Icon as={FaStop} />}
          onClick={stopRecording}
          isDisabled={!isRecording}
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
          onChange={(e) => setLanguage(e.target.value)}
          size="sm"
        >
          <option value="en-US">English</option>
          <option value="ja-JP">日本語</option>
        </Select>
      </Box>
      <audio ref={audioRef} controls style={{ display: 'none' }} />
    </Box>
  );
};