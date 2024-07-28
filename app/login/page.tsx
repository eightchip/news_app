'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Button, FormControl, FormLabel, Input, Heading, useToast, Flex, VStack, Text, Link } from '@chakra-ui/react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import Loading from '../components/Loading';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();
  const router = useRouter();
  const supabase = createClientComponentClient();

  const handleLogin = async () => {
    setIsLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      toast({
        title: 'エラー',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      setIsLoading(false);
    } else {
      toast({
        title: '成功',
        description: 'ログインしました。',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      // ログイン成功後、少し遅延を入れてからリダイレクト
      setTimeout(() => {
        router.push('/dashboard');
      }, 1000);
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <Flex height="100vh" alignItems="center" justifyContent="center">
      <Box width="100%" maxWidth="400px" p={5} borderWidth={1} borderRadius="lg" boxShadow="lg">
        <Heading mb={5} textAlign="center">ログイン</Heading>
        <VStack spacing={4}>
          <FormControl id="email" isRequired>
            <FormLabel>メールアドレス</FormLabel>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="メールアドレス"
            />
          </FormControl>
          <FormControl id="password" isRequired>
            <FormLabel>パスワード</FormLabel>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="パスワード"
            />
          </FormControl>
          <Button onClick={handleLogin} colorScheme="blue" width="full">
            Login
          </Button>
          <Text mt={2}>
            アカウントをお持ちでない方は <Link color="blue.500" href="/signup">Signup</Link>
          </Text>
        </VStack>
      </Box>
    </Flex>
  );
};

export default Login;