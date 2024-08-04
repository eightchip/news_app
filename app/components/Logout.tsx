'use client';
import { Button, ButtonProps, useToast } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import supabase from '../lib/supabase';

const LogoutButton: React.FC<ButtonProps> = (props) => {
  const router = useRouter();
  const toast = useToast();

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      toast({
        title: 'ログアウト成功',
        description: 'ログアウトしました。',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      
      router.push('/login');
    } catch (error) {
      console.error('ログアウトエラー:', error);
      toast({
        title: 'ログアウトエラー',
        description: 'ログアウトに失敗しました。',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return <Button {...props} onClick={handleLogout}>ログアウト</Button>;
};

export default LogoutButton;