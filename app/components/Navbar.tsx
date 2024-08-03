'use client'
import NextLink from 'next/link';
import { Flex, Button, Box, keyframes } from '@chakra-ui/react';
import { usePathname } from 'next/navigation';
import LogoutButton from '../components/Logout';
import { FaHome, FaSearch, FaEdit } from 'react-icons/fa';

const rotateAnimation = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const NavBar = () => {
  const pathname = usePathname();

  return (
    <Flex 
      as="nav" 
      bgGradient="linear(to-r, blue.300, cyan.300, yellow.300, orange.300)" 
      color="white" 
      p={4} 
      justifyContent="space-between"
      alignItems="center"
      boxShadow="0 2px 4px rgba(0,0,0,0.1)"
    >
      <Box 
        as="span" 
        fontSize="2xl" 
        fontWeight="bold" 
        mr={4}
        animation={`${rotateAnimation} 10s linear infinite`}
      >
        🌐
      </Box>
      <Flex>
        {[
          { href: '/', label: 'ホーム', icon: FaHome },
          { href: '/article/search', label: '記事検索', icon: FaSearch },
          { href: '/article/manage', label: '記事編集', icon: FaEdit },
        ].map(({ href, label, icon }) => (
          <NextLink key={href} href={href} passHref legacyBehavior>
            <Button 
              as="a" 
              variant="ghost" 
              mr={2}
              leftIcon={<Box as={icon} />}
              position="relative"
              color="gray.700"
              _hover={{
                transform: 'scale(1.05)',
                bgGradient: 'linear(to-r, blue.200, cyan.200, yellow.200, orange.200)',
                color: 'gray.900',
              }}
              transition="all 0.3s"
            >
              {label}
              {pathname === href && (
                <Box 
                  position="absolute" 
                  bottom="0" 
                  left="0" 
                  right="0" 
                  height="2px" 
                  bgGradient="linear(to-r, blue.500, cyan.500, yellow.500, orange.500)"
                  animation="fadeIn 0.5s"
                />
              )}
            </Button>
          </NextLink>
        ))}
      </Flex>
      <LogoutButton />
    </Flex>
  );
};

export default NavBar;