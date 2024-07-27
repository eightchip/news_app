'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from './lib/supabase';
import NavBar from './components/Navbar';
import { Box, Heading, Text } from '@chakra-ui/react';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/login');
      }
    };
    checkUser();
  }, [router]);

  return (
    <Box>
      <NavBar />
      <Box p={5} maxW="800px" mx="auto" textAlign="center">
        <Heading>Read Me       
        </Heading>
        <Text mt={5}></Text>
      </Box>
    </Box>
  );
}