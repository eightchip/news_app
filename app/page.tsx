'use client';
import NavBar from './components/Navbar';
import { Box, Heading, Text } from '@chakra-ui/react';

export default function Home() {
  return (
    <Box>
      <NavBar />
      <Box p={5} maxW="800px" mx="auto" textAlign="center">
        <Heading>Read Me</Heading>
        
        <Box mt={5} textAlign="left">
          <Heading size="md">技術スタック</Heading>
          <Text>・ Next.js（フレームワーク）</Text>
          <Text>・ TypeScript(言語)</Text>
          <Text>・ Chakra UI（UI）</Text>
          <Text>・ Supabase（バックエンド）</Text>
          <Text>・ GitHub（バージョン管理）</Text>

          <Heading size="md" mt={4}>仕様</Heading>
          <Text>このアプリは、ユーザーが記事を検索、保存、編集できる機能を提供します。</Text>

          <Heading size="md" mt={4}>アプリの機能</Heading>
          <Text>・ 記事の検索</Text>
          <Text>・ 保存した記事の管理</Text>
          <Text>・ 記事の編集</Text>
          <Text>・ ユーザー認証</Text>

          <Heading size="md" mt={4}>使用方法</Heading>
          <Text>1. アカウントを作成またはログインします。</Text>
          <Text>2. 記事を検索し、興味のある記事を保存します。</Text>
          <Text>3. 保存した記事を管理し、必要に応じて編集します。</Text>
        </Box>
      </Box>
    </Box>
  );
}