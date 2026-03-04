'use client';

import { useState } from 'react';
import SubjectSidebar from '@/components/Sidebar/SubjectSidebar';
import { useSidebarStore } from '@/store/sidebarStore';

export default function SubjectLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { subjectId: string };
}) {
  const { isOpen, toggle } = useSidebarStore();
  const subjectId = parseInt(params.subjectId);

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div
        className={`${
          isOpen ? 'w-80' : 'w-0'
        } transition-all duration-300 overflow-hidden border-r`}
      >
        <SubjectSidebar subjectId={subjectId} />
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-auto">
        <div className="p-4 border-b bg-white">
          <button
            onClick={toggle}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
