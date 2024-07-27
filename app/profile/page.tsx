'use client';
import { ComponentType } from 'react';
import withAuth from '../lib/withAuth';
import { useAuth } from '../lib/auth';
import { Box, Heading, Text } from '@chakra-ui/react';

const Profile: ComponentType = () => {
  const user = useAuth();

  return (
    <Box p={5}>
      <Heading mb={5}>プロフィール</Heading>
      <Text>メールアドレス: {user?.email}</Text>
    </Box>
  );
};

const AuthenticatedProfile = withAuth(Profile);

export default AuthenticatedProfile;