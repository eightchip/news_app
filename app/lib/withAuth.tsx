import React, { useEffect, ComponentType } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from './auth';

function withAuth<P extends Record<string, any>>(WrappedComponent: ComponentType<P>) {
  const WithAuth: React.FC<P> = (props) => {
    const router = useRouter();
    const user = useAuth();

    useEffect(() => {
      if (!user) {
        router.push('/login');
      }
    }, [user, router]);

    if (!user) {
      return null;
    }

    return React.createElement(WrappedComponent, props);
  };

  return WithAuth;
}

export default withAuth;