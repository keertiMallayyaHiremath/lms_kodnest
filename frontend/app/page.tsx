'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import apiClient from '@/lib/apiClient';
import { useAuthStore } from '@/store/authStore';

interface Subject {
  id: number;
  title: string;
  description: string;
  slug: string;
}

export default function Home() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    try {
      const { data } = await apiClient.get('/subjects');
      setSubjects(data.subjects);
    } catch (error) {
      console.error('Failed to fetch subjects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubjectClick = async (subjectId: number) => {
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }

    try {
      const { data } = await apiClient.get(`/subjects/${subjectId}/first-video`);
      router.push(`/subjects/${subjectId}/video/${data.videoId}`);
    } catch (error) {
      console.error('Failed to get first video:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">LMS</h1>
            <div className="space-x-4">
              {!isAuthenticated ? (
                <>
                  <button
                    onClick={() => router.push('/auth/login')}
                    className="text-gray-700 hover:text-gray-900"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => router.push('/auth/register')}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                  >
                    Register
                  </button>
                </>
              ) : (
                <button
                  onClick={() => router.push('/profile')}
                  className="text-gray-700 hover:text-gray-900"
                >
                  Profile
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Available Courses</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subjects.map((subject) => (
            <div
              key={subject.id}
              onClick={() => handleSubjectClick(subject.id)}
              className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow"
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {subject.title}
              </h3>
              <p className="text-gray-600">{subject.description}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
