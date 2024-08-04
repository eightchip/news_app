'use client';
import NavBar from './components/Navbar';
import { Box, Heading, Text, UnorderedList, ListItem } from '@chakra-ui/react';
import { useAuth } from './contexts/AuthContext';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [loading, user, router]);

  return (
    <Box>
      <NavBar />
      <Box p={5} maxW="800px" mx="auto">
        <Heading as="h1" size="xl" textAlign="center" mb={6}>Read Me</Heading>
        
        <Box mt={5}>
          <Heading as="h2" size="lg" mb={4}>使用方法</Heading>
          <UnorderedList spacing={3}>
            <ListItem>
              アカウントを作成してログインします。<br />
              メールアドレスはダミーでOKです（メールは送信されません）。
            </ListItem>
            <ListItem>
              記事検索：
              <UnorderedList>
                <ListItem>検索語を入力し、主要な英語メディアの記事を検索します。</ListItem>
                <ListItem>興味のある記事を保存します。</ListItem>
              </UnorderedList>
            </ListItem>
            <ListItem>
              記事編集：
              <UnorderedList>
                <ListItem>保存した記事を管理し、必要に応じて編集します。</ListItem>
                <ListItem>記事の全文を音声再生できます（米語・英語の切り替え可能）。</ListItem>
              </UnorderedList>
            </ListItem>
            <ListItem>
              表現追加：
              <UnorderedList>
                <ListItem>記事から学びたい単語や表現を登録します。</ListItem>
                <ListItem>登録した単語・表現は音声再生が可能です（米語・英語の切り替え可能）。</ListItem>
                <ListItem>表現追加は記事ごとに管理されます。</ListItem>
              </UnorderedList>
            </ListItem>
          </UnorderedList>
        </Box>

        <Box mt={8}>
          <Heading as="h2" size="lg" mb={4}>使用技術</Heading>
          <UnorderedList spacing={2}>
            <ListItem>Next.js（React）</ListItem>
            <ListItem>TypeScript（言語）</ListItem>
            <ListItem>Chakra,React icons（UI）</ListItem>
            <ListItem>Supabase（バックエンド）</ListItem>
            <ListItem>GitHub（バージョン管理）</ListItem>
            <ListItem>NEWS API（記事取得）</ListItem>
            <ListItem>Google Text to Speech API（音声再生）</ListItem>
          </UnorderedList>
        </Box>

        <Box mt={8}>
          <Heading as="h2" size="lg" mb={4}>アプリの機能</Heading>
          <UnorderedList spacing={2}>
            <ListItem>ユーザー認証:email(ﾀﾞﾐｰ),password(6桁以上) </ListItem>
            <ListItem>記事検索:検索ワード/media選択, 音声再生(US/UK), 保存</ListItem>
            <ListItem>記事編集:保存記事の編集/削除, 編集:本文音声再生/表現登録</ListItem>
            <ListItem>表現追加:登録表現のリスト表示/音声再生</ListItem>
          </UnorderedList>
        </Box>
      </Box>
    </Box>
  );
}