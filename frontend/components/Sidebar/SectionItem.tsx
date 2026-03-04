'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

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

interface SectionItemProps {
  section: Section;
  subjectId: number;
  currentVideoId?: number;
}

export default function SectionItem({ section, subjectId, currentVideoId }: SectionItemProps) {
  const router = useRouter();
  const [isExpanded, setIsExpanded] = useState(true);

  const handleVideoClick = (videoId: number, locked: boolean) => {
    if (locked) return;
    router.push(`/subjects/${subjectId}/video/${videoId}`);
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50"
      >
        <span className="font-semibold text-gray-900">{section.title}</span>
        <svg
          className={`w-5 h-5 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isExpanded && (
        <div className="border-t">
          {section.videos.map((video) => (
            <button
              key={video.id}
              onClick={() => handleVideoClick(video.id, video.locked)}
              disabled={video.locked}
              className={`w-full px-4 py-3 text-left border-b last:border-b-0 hover:bg-gray-50 transition-colors ${
                currentVideoId === video.id ? 'bg-blue-50' : ''
              } ${video.locked ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    {video.isCompleted && (
                      <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                    {video.locked && (
                      <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                    <span className="text-sm font-medium text-gray-900">{video.title}</span>
                  </div>
                </div>
                <span className="text-xs text-gray-500 ml-2">
                  {formatDuration(video.durationSeconds)}
                </span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
