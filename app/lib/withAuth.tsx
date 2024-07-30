import React, { useEffect, ComponentType } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from './auth';

function withAuth<P extends {}>(WrappedComponent: ComponentType<P>): ComponentType<P> {
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

    return <WrappedComponent {...props} />;
  };

  return WithAuth;
}

export default withAuth;