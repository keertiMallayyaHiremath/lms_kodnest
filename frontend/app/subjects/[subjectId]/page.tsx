'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import apiClient from '@/lib/apiClient';

export default function SubjectPage({ params }: { params: { subjectId: string } }) {
  const router = useRouter();
  const subjectId = parseInt(params.subjectId);

  useEffect(() => {
    redirectToFirstVideo();
  }, []);

  const redirectToFirstVideo = async () => {
    try {
      const { data } = await apiClient.get(`/subjects/${subjectId}/first-video`);
      router.push(`/subjects/${subjectId}/video/${data.videoId}`);
    } catch (error) {
      console.error('Failed to get first video:', error);
    }
  };

  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-xl">Loading...</div>
    </div>
  );
}
