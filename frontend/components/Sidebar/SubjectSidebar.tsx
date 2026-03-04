'use client';

import { useEffect, useState } from 'react';
import apiClient from '@/lib/apiClient';
import SectionItem from './SectionItem';

interface Video {
  id: number;
  title: string;
  orderIndex: number;
  durationSeconds: number;
  isCompleted: boolean;
  locked: boolean;
}

interface Section {
  id: number;
  title: string;
  orderIndex: number;
  videos: Video[];
}

interface SubjectTree {
  id: number;
  title: string;
  description: string;
  sections: Section[];
}

interface SubjectSidebarProps {
  subjectId: number;
  currentVideoId?: number;
}

export default function SubjectSidebar({ subjectId, currentVideoId }: SubjectSidebarProps) {
  const [tree, setTree] = useState<SubjectTree | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTree();
  }, [subjectId]);

  const fetchTree = async () => {
    try {
      const { data } = await apiClient.get(`/subjects/${subjectId}/tree`);
      setTree(data);
    } catch (error) {
      console.error('Failed to fetch subject tree:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-4">Loading...</div>;
  }

  if (!tree) {
    return <div className="p-4">Failed to load content</div>;
  }

  return (
    <div className="h-full overflow-y-auto bg-gray-50">
      <div className="p-4 border-b bg-white">
        <h2 className="text-xl font-bold text-gray-900">{tree.title}</h2>
        {tree.description && (
          <p className="text-sm text-gray-600 mt-1">{tree.description}</p>
        )}
      </div>

      <div className="p-4 space-y-4">
        {tree.sections.map((section) => (
          <SectionItem
            key={section.id}
            section={section}
            subjectId={subjectId}
            currentVideoId={currentVideoId}
          />
        ))}
      </div>
    </div>
  );
}
