'use client'
import NextLink from 'next/link';
import { Flex, Button, Box, keyframes, IconButton, VStack } from '@chakra-ui/react';
import { usePathname } from 'next/navigation';
import LogoutButton from '../components/Logout';
import { FaHome, FaSearch, FaEdit, FaBook, FaPlane } from 'react-icons/fa';
import { HamburgerIcon, CloseIcon } from '@chakra-ui/icons';
import { useState } from 'react';

const rotateAnimation = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const NavBar = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  const navItems = [
    { href: '/', label: 'ホーム', icon: FaHome },
    { href: '/article/search', label: '記事検索', icon: FaSearch },
    { href: '/article/manage', label: '記事編集', icon: FaEdit },
    { href: '/wordlists', label: '表現集', icon: FaBook },
    { href: '/global_talk', label: 'グローバルトーク', icon: FaPlane },
  ];

  return (
    <Flex 
      as="nav" 
      bgGradient="linear(to-r, blue.300, cyan.300, yellow.300, orange.300)" 
      color="white" 
      p={4} 
      justifyContent="center"
      alignItems="center"
      boxShadow="0 2px 4px rgba(0,0,0,0.1)"
      flexDirection={{ base: 'column', md: 'row' }}
    >
      <Flex 
        justifyContent="space-between" 
        width="100%" 
        maxWidth="1200px"
        alignItems="center"
        px={{ base: 0, md: 4 }}
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
        <IconButton
          display={{ base: 'block', md: 'none' }}
          onClick={toggleMenu}
          icon={isOpen ? <CloseIcon boxSize={6} /> : <HamburgerIcon boxSize={6} />}
          aria-label="メニューを開く"
          variant="ghost"
          size="lg"
          fontSize="24px"
        />
        
        <Flex
          as={VStack}
          display={{ base: isOpen ? 'flex' : 'none', md: 'flex' }}
          width={{ base: 'full', md: 'auto' }}
          alignItems="stretch"
          flexDirection={{ base: 'column', md: 'row' }}
          mt={{ base: 4, md: 0 }}
          justifyContent="center"
          flex={1}
        >
          {navItems.map(({ href, label, icon }) => (
            <NextLink key={href} href={href} passHref legacyBehavior>
              <Button 
                as="a" 
                variant="ghost" 
                mx={1}
                leftIcon={<Box as={icon} />}
                position="relative"
                color="gray.700"
                _hover={{
                  transform: 'scale(1.05)',
                  bgGradient: 'linear(to-r, blue.200, cyan.200, yellow.200, orange.200)',
                  color: 'gray.900',
                }}
                transition="all 0.3s"
                width={{ base: 'full', md: 'auto' }}
                justifyContent={{ base: 'flex-start', md: 'center' }}
                fontSize={{ base: 'md', md: 'lg' }}
                py={2}
                px={6}
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
          <LogoutButton 
            display={{ base: 'block', md: 'block' }} 
            mt={{ base: 4, md: 0 }} 
            fontSize={{ base: 'md', md: 'lg' }}
            py={2}
            px={6}
          />
        </Flex>
      </Flex>
    </Flex>
  );
};

export default NavBar;