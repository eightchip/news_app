//app/signup/page.tsx
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Button, FormControl, FormLabel, Input, Heading, useToast, Flex, VStack, Text, Link } from '@chakra-ui/react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const toast = useToast();
  const router = useRouter();
  const supabase = createClientComponentClient();

  const handleSignup = async () => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          // ここにユーザーの追加情報を追加できます
        }
      }
    });

    if (error) {
      toast({
        title: 'エラー',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } else if (data.user) {
      toast({
        title: '成功',
        description: '確認メールを送信しました。メールを確認してアカウントを有効化してください。',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      router.push('/login');
    }
  };

  return (
    <Flex height="100vh" alignItems="center" justifyContent="center">
      <Box width="100%" maxWidth="400px" p={5} borderWidth={1} borderRadius="lg" boxShadow="lg">
        <Heading mb={5} textAlign="center">Sign Up</Heading>
        <VStack spacing={4}>
          <FormControl id="email" isRequired>
            <FormLabel>Email</FormLabel>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
            />
          </FormControl>
          <FormControl id="password" isRequired>
            <FormLabel>Password</FormLabel>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
            />
          </FormControl>
          <Button onClick={handleSignup} colorScheme="blue" width="full">
            Sign Up
          </Button>
          <Text mt={2}>
            既にアカウントをお持ちの方は{' '}
            <Link
              href="/login"
              color="blue.500"
              _hover={{ textDecoration: 'underline' }}
            >
              Login
            </Link>
          </Text>
        </VStack>
      </Box>
    </Flex>
  );
};

export default Signup;