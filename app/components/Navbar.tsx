'use client'
import Link from 'next/link';
import { Flex, Button } from '@chakra-ui/react';
import LogoutButton from '../components/Logout';

const NavBar = () => {
  return (
    <Flex as="nav" bg="blue.300" color="white" p={4} justifyContent="space-between">
      <Flex>
        <Link href="/">
          <Button as="a" variant="ghost" mr={2}>ホーム</Button>
        </Link>
        <Link href="/article/search">
          <Button as="a" variant="ghost" mr={2}>記事検索</Button>
        </Link>
        <Link href="/article/manage">
          <Button as="a" variant="ghost" mr={2}>記事編集</Button>
        </Link>
      </Flex>
      <LogoutButton />
    </Flex>
  );
};

export default NavBar;