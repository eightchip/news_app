'use client';
import NavBar from './components/Navbar';
import { Box, Heading, Text } from '@chakra-ui/react';

export default function Home() {
  return (
    <Box>
      <NavBar />
      <Box p={5} maxW="800px" mx="auto" textAlign="center">
        <Heading>Read Me</Heading>
        <Text mt={5}>ようこそ！ここにコンテンツを表示します。</Text>
      </Box>
    </Box>
  );
}