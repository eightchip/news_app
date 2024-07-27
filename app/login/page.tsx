'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../lib/supabase';
import { Box, Button, FormControl, FormLabel, Input,  Heading, useToast, Flex, VStack, Text, Link } from '@chakra-ui/react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const toast = useToast();
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        router.push('/article/search'); // Redirect to article search page
      }
    };
    checkUser();
  }, [router]);

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      toast({
        title: 'Error',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } else {
      toast({
        title: 'Success',
        description: 'Logged in successfully!',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      router.push('/article/search'); // Redirect to article search page
    }
  };

  return (
    <Flex height="100vh" alignItems="center" justifyContent="center">
      <Box width="100%" maxWidth="400px" p={5} borderWidth={1} borderRadius="lg" boxShadow="lg">
        <Heading mb={5} textAlign="center">Login</Heading>
        <VStack spacing={4}>
          <FormControl id="email" isRequired mb={4} borderBottom="none">
            <FormLabel mb={2}>Email</FormLabel>
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              borderRadius="md"
              focusBorderColor="blue.500"
            />
          </FormControl>
          <FormControl id="password" isRequired mb={4} borderBottom="none">
            <FormLabel mb={2}>Password</FormLabel>
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              borderRadius="md"
              focusBorderColor="blue.500"
            />
          </FormControl>
          <Button onClick={handleLogin} colorScheme="blue" width="full">
            Login
          </Button>
          <Text mt={2}>
            アカウントをお持ちでない方は <Link color="blue.500" href="/signup">Sign Up</Link>
          </Text>
        </VStack>
      </Box>
    </Flex>
  );
};

export default Login;