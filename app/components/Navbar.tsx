'use client'
import NextLink from 'next/link';
import { Flex, Button } from '@chakra-ui/react';
import LogoutButton from '../components/Logout';

const NavBar = () => {
  return (
    <Flex as="nav" bg="blue.300" color="white" p={4} justifyContent="space-between">
      <Flex>
        <NextLink href="/" passHref legacyBehavior>
          <Button as="a" variant="ghost" mr={2}>ホーム</Button>
        </NextLink>
        <NextLink href="/article/search" passHref legacyBehavior>
          <Button as="a" variant="ghost" mr={2}>記事検索</Button>
        </NextLink>
        <NextLink href="/article/manage" passHref legacyBehavior>
          <Button as="a" variant="ghost" mr={2}>記事編集</Button>
        </NextLink>
      </Flex>
      <LogoutButton />
    </Flex>
  );
};

export default NavBar;