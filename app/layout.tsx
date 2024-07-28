// app/layout.tsx
'use client';
import { ChakraProvider } from '@chakra-ui/react';
import { Suspense } from 'react';
import Loading from './components/Loading';
import AuthProviderWrapper from './components/AuthProviderWrapper';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body>
        <ChakraProvider>
          <Suspense fallback={<Loading />}>
            <AuthProviderWrapper>
              {children}
            </AuthProviderWrapper>
          </Suspense>
        </ChakraProvider>
      </body>
    </html>
  );
}