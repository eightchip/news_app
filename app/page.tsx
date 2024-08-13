'use client';
import NavBar from './components/Navbar';
import { Box, Heading, UnorderedList, ListItem, Image, Text } from '@chakra-ui/react';
import { useAuth } from './contexts/AuthContext';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import QRCode from 'qrcode';

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [qrCodeUrl, setQrCodeUrl] = useState('');

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [loading, user, router]);

  useEffect(() => {
    const generateQRCode = async () => {
      try {
        const url = window.location.href;
        const qrCodeDataUrl = await QRCode.toDataURL(url);
        setQrCodeUrl(qrCodeDataUrl);
      } catch (error) {
        console.error('QRコードの生成に失敗しました:', error);
      }
    };

    generateQRCode();
  }, []);

  return (
    <Box>
      <NavBar />
      <Box p={5} maxW="800px" mx="auto" boxShadow="md" borderRadius="lg" bg="orange.50">
        <Heading as="h1" size="xl" textAlign="center" mb={6} color="orange.600">Read Me</Heading>
        
        {qrCodeUrl && (
          <Box textAlign="center" mb={6}>
            <Image src={qrCodeUrl} alt="QR Code" mx="auto" boxSize="150px" />
            <Text fontSize="sm" mt={2}>このページのQRコード</Text>
          </Box>
        )}
        
        <Heading as="h2" size="lg" textAlign="center" mb={6} color="orange.500">EchoLingo</Heading>
        
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
            <ListItem>Google Translate API（翻訳）</ListItem>
            <ListItem>Google Speech-to-Text API（音声認識）</ListItem>
          </UnorderedList>
        </Box>

        <Box mt={8}>
          <Heading as="h2" size="lg" mb={4}>アプリの機能と使用方法</Heading>
          <UnorderedList spacing={3}>
            <ListItem>
              ユーザー認証: EMAIL(ダミー), PASSWORD(6桁以上)でアカウント作成・ログイン
            </ListItem>
            <ListItem>
              記事検索ページ:
              <UnorderedList>
                <ListItem>検索ワード入力、MEDIA選択で主要英語メディアの記事検索</ListItem>
                <ListItem>記事の音声再生(US/UK)、保存機能</ListItem>
              </UnorderedList>
            </ListItem>
            <ListItem>
              記事編集ページ:
              <UnorderedList>
                <ListItem>保存した記事の編集・削除</ListItem>
                <ListItem>本文の音声再生(US/UK)、翻訳機能</ListItem>
                <ListItem>表現リストへの追加・編集機能</ListItem>
              </UnorderedList>
            </ListItem>
            <ListItem>
              表現集ページ:
              <UnorderedList>
                <ListItem>登録した表現のリスト表示</ListItem>
                <ListItem>表現の音声再生(US/UK)</ListItem>
              </UnorderedList>
            </ListItem>
            <ListItem>
              グローバルトークページ:
              <UnorderedList>
                <ListItem>多言語音声認識・翻訳機能</ListItem>
                <ListItem>会議進行補助機能</ListItem>
              </UnorderedList>
            </ListItem>
          </UnorderedList>
        </Box>
      </Box>
    </Box>
  );
}