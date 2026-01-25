'use client';

import { ReactNode, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { isAuthenticated } from '@/lib/actions/auth.actions';

interface RootLayoutProps {
  children: ReactNode;
}

const RootLayout = ({ children }: RootLayoutProps) => {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const auth = await isAuthenticated(); // client-side check
      if (!auth) {
        router.push('/sign-in'); // redirect if not logged in
      } else {
        setLoading(false); // authenticated, show children
      }
    };
    checkAuth();
  }, [router]);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="root-layout">
      <nav className="flex items-center gap-2 p-4">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo.svg" alt="Logo" width={38} height={32} />
          <h2 className="text-primary-100">Prepwise</h2>
        </Link>
      </nav>
      <main>{children}</main>
    </div>
  );
};

export default RootLayout;

