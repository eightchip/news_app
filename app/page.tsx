//app/page.tsx
'use client';
import NavBar from './components/Navbar';
import { Box, Heading, Text } from '@chakra-ui/react';
import { useAuth } from './contexts/AuthContext';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login'); // ユーザーが未認証の場合、ログインページにリダイレクト
    }
  }, [loading, user, router]);

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
          <Text>このアプリは、ユーザーが英文記事を検索、保存、編集、音声再生ができる機能を提供します。</Text>

          <Heading size="md" mt={4}>アプリの機能</Heading>
          <Text>・ 英文記事の検索・音声読み上げ</Text>
          <Text>・ 保存した記事の管理</Text>
          <Text>・ 記事の編集・音声読み上げ</Text>
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