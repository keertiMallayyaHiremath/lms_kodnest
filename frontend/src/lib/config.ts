export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';

export const API_ENDPOINTS = {
  // Auth
  AUTH: {
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
    REFRESH: '/api/auth/refresh',
    LOGOUT: '/api/auth/logout',
  },
  
  // Subjects
  SUBJECTS: {
    LIST: '/api/subjects',
    DETAIL: (id: string) => `/api/subjects/${id}`,
    TREE: (id: string) => `/api/subjects/${id}/tree`,
    FIRST_VIDEO: (id: string) => `/api/subjects/${id}/first-video`,
  },
  
  // Videos
  VIDEOS: {
    DETAIL: (id: string) => `/api/videos/${id}`,
    BY_SUBJECT: (subjectId: string) => `/api/videos/subject/${subjectId}`,
  },
  
  // Progress
  PROGRESS: {
    VIDEO: (id: string) => `/api/progress/videos/${id}`,
    SUBJECT: (id: string) => `/api/progress/subjects/${id}`,
    SUMMARY: '/api/progress/summary',
  },
  
  // Health
  HEALTH: '/health',
} as const;
