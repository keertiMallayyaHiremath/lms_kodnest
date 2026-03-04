'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import { AuthGuard } from '@/components/Auth/AuthGuard';
import { Button } from '@/components/common/Button';
import { Spinner } from '@/components/common/Spinner';

interface Subject {
  id: string;
  title: string;
  slug: string;
  description: string;
  createdAt: string;
  _count: {
    sections: number;
  };
}

export default function Home() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/subjects`);
      const data = await response.json();
      setSubjects(data.subjects || []);
    } catch (error) {
      console.error('Failed to fetch subjects:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    router.push('/auth/login');
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Spinner size="lg" className="mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Kodnest LMS</h1>
                <p className="text-gray-600">Welcome back, {user.name}!</p>
              </div>
              <div className="flex items-center space-x-4">
                <Link href="/profile">
                  <Button variant="outline">Profile</Button>
                </Link>
                <Button onClick={handleLogout} variant="ghost">
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900">Available Subjects</h2>
              <p className="text-gray-600">Choose a subject to start learning</p>
            </div>

            {isLoading ? (
              <div className="flex justify-center py-12">
                <Spinner size="lg" />
              </div>
            ) : subjects.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">No subjects available at the moment.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {subjects.map((subject) => (
                  <div key={subject.id} className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-6">
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        {subject.title}
                      </h3>
                      <p className="text-gray-600 mb-4 line-clamp-3">
                        {subject.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">
                          {subject._count.sections} sections
                        </span>
                        <Link href={`/subjects/${subject.id}`}>
                          <Button size="sm">Start Learning</Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </AuthGuard>
  );
}
