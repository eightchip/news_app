import React, { forwardRef, useState, useRef, useImperativeHandle } from 'react';
import { Button, ButtonGroup, Icon } from '@chakra-ui/react';
import { FaMicrophone, FaStop } from 'react-icons/fa';

interface SpeechRecognitionResult {
  0: SpeechRecognitionAlternative;
  length: number;
  isFinal: boolean;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognitionEvent {
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResultList {
  [index: number]: SpeechRecognitionResult;
  length: number;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  onresult: (event: SpeechRecognitionEvent) => void;
}

interface GlobalTalkRecordButtonProps {
  onTranscriptionComplete: (text: string) => void;
  onRecordingStart: () => void;
  onRecordingStop: () => void;
  language: string;
}

declare global {
  interface Window {
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}

export const GlobalTalkRecordButton = forwardRef<{ stopRecording: () => void }, GlobalTalkRecordButtonProps>(
  ({ onTranscriptionComplete, onRecordingStart, onRecordingStop, language }, ref) => {
    const [isRecording, setIsRecording] = useState(false);
    const recognitionRef = useRef<SpeechRecognition | null>(null);

    useImperativeHandle(ref, () => ({
      stopRecording: () => {
        if (recognitionRef.current) {
          recognitionRef.current.stop();
          setIsRecording(false);
          onRecordingStop();
        }
      }
    }));

    const startRecording = () => {
      if ('webkitSpeechRecognition' in window) {
        const recognition = new window.webkitSpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = language;

        recognition.onresult = (event: SpeechRecognitionEvent) => {
          const transcript = Array.from(event.results)
            .map((result: SpeechRecognitionResult) => result[0].transcript)
            .join('');
          onTranscriptionComplete(transcript);
        };

        recognition.start();
        recognitionRef.current = recognition;
        setIsRecording(true);
        onRecordingStart();
      }
    };

    const stopRecording = () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
        setIsRecording(false);
        onRecordingStop();
      }
    };

    return (
      <ButtonGroup isAttached={false} variant='outline' spacing={2}>
        <Button
          onClick={startRecording}
          isDisabled={isRecording}
          colorScheme="blue"
          leftIcon={<Icon as={FaMicrophone} />}
        >
          録音
        </Button>
        <Button
          onClick={stopRecording}
          isDisabled={!isRecording}
          colorScheme="red"
          leftIcon={<Icon as={FaStop} />}
        >
          停止
        </Button>
      </ButtonGroup>
    );
  }
);

GlobalTalkRecordButton.displayName = 'GlobalTalkRecordButton';