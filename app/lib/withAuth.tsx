// lib/withAuth.tsx
'use client'
import { useAuth } from './auth';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { ComponentType } from 'react';

const withAuth = (WrappedComponent: ComponentType) => {
  return (props:any) => {
    const user = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!user) {
        router.push('/login');
      }
    }, [user, router]);

    if (!user) {
      return <div>Loading...</div>;
    }

    return <WrappedComponent {...props} />;
  };
};

export default withAuth;