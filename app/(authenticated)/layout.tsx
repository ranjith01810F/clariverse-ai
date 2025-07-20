'use client';

import React from 'react';
import { Header } from '@/components/Header/Header';
import { useRouter, usePathname } from 'next/navigation';

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  // Check if user is not logged in, redirect to login
  React.useEffect(() => {
    // Add your authentication check logic here
    const isAuthenticated = true; // Replace with your actual auth check
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-900">
      <Header transparent={false} isLoggedIn={true} />
      <div className="pt-[72px]"> {/* Add padding top to account for fixed header */}
        {children}
      </div>
    </div>
  );
} 