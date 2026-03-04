'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { Spinner } from '@/components/common/Spinner';

interface AuthGuardProps {
  children: React.ReactNode;
}

export const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuthStore();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      // If not authenticated and not loading, redirect to login
      if (!isAuthenticated && !isLoading) {
        router.push('/auth/login');
        return;
      }
      
      setIsChecking(false);
    };

    checkAuth();
  }, [isAuthenticated, isLoading, router]);

  // Show loading spinner while checking authentication
  if (isChecking || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Spinner size="lg" className="mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // If not authenticated, don't render children (will be redirected)
  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
};
