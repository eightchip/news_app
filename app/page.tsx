'use client';
import NavBar from './components/Navbar';
import { Box, Heading, UnorderedList, ListItem } from '@chakra-ui/react';
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
      <Box p={5} maxW="800px" mx="auto" boxShadow="md" borderRadius="lg" bg="orange.50">
        <Heading as="h1" size="xl" textAlign="center" mb={6} color="orange.600">Read Me</Heading>
        
        <Heading as="h2" size="lg" textAlign="center" mb={6} color="orange.500">EchoLingo</Heading>
        
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
                <ListItem>保存した記事の編集・削除が出来ます。</ListItem>
                <ListItem>本文：編集と音声再生が出来ます（米語・英語の切り替え可能）。</ListItem>
                <ListItem>表現リスト：表現集で再生し、リスニング・シャドーイング練習が出来ます。</ListItem>
              </UnorderedList>
            </ListItem>
            <ListItem>
              表現集：
              <UnorderedList>
                <ListItem>登録した表現の音声再生が可能です（米語・英語の切り替え可能）。</ListItem>
                <ListItem>登録した表現は記事ごとに管理されます。</ListItem>
              </UnorderedList>
            </ListItem>
          </UnorderedList>
        </Box>

        <Box mt={8}>
          <Heading as="h2" size="lg" mb={4}>使用技術</Heading>
          <UnorderedList spacing={2}>
            <ListItem>Next.js（React）</ListItem>
            <ListItem>TypeScript（言語）</ListItem>
            <ListItem>Chakra UI, React icons</ListItem>
            <ListItem>Supabase（バックエンド）</ListItem>
            <ListItem>GitHub（バージョン管理）</ListItem>
            <ListItem>NEWS API（記事取得）</ListItem>
            <ListItem>Google Text to Speech API（音声再生）</ListItem>
          </UnorderedList>
        </Box>

        <Box mt={8}>
          <Heading as="h2" size="lg" mb={4}>アプリの機能</Heading>
          <UnorderedList spacing={2}>
            <ListItem>ユーザー認証:EMAIL(ダミー),PASSWORD(6桁以上) </ListItem>
            <ListItem>記事検索:検索ワード/MEDIA選択, 音声再生(US/UK), 保存</ListItem>
            <ListItem>記事編集:保存記事の編集/削除, 編集:本文音声再生/表現登録</ListItem>
            <ListItem>表現集:登録表現のリスト表示/音声再生</ListItem>
          </UnorderedList>
        </Box>

        <Box mt={8}>
          <Heading as="h2" size="lg" mb={4}>追加実装点：</Heading>
          <UnorderedList spacing={2}>
            <ListItem>
              <strong>録音機能の改善</strong>
              <UnorderedList>
                <ListItem>モバイルデバイスでの互換性向上</ListItem>
                <ListItem>エラーハンドリングの強化</ListItem>
                <ListItem>ユーザーフィードバックの改善</ListItem>
              </UnorderedList>
            </ListItem>
            <ListItem>
              <strong>翻訳機能の拡張</strong>
              <UnorderedList>
                <ListItem>本文の翻訳機能追加</ListItem>
                <ListItem>翻訳結果を表現リストに追加する機能</ListItem>
                <ListItem>翻訳UIの改良</ListItem>
              </UnorderedList>
            </ListItem>
            <ListItem>
              <strong>検索ページのUI改良</strong>
              <UnorderedList>
                <ListItem>検索結果の表示方法を最適化</ListItem>
                <ListItem>フィルタリングオプションの追加</ListItem>
                <ListItem>ページネーション機能の実装</ListItem>
              </UnorderedList>
            </ListItem>
          </UnorderedList>
          <p>これらの追加機能により、より使いやすく効果的な英語学習ツールとなりました。</p>
        </Box>
      </Box>
    </Box>
  );
}