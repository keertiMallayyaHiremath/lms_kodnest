import apiClient from './apiClient';

export interface VideoProgress {
  lastPositionSeconds: number;
  isCompleted: boolean;
}

export interface SubjectProgress {
  totalVideos: number;
  completedVideos: number;
  percentComplete: number;
  lastVideoId: number | null;
  lastPositionSeconds: number;
}

export const progressApi = {
  getVideoProgress: async (videoId: number): Promise<VideoProgress> => {
    const { data } = await apiClient.get(`/progress/videos/${videoId}`);
    return data;
  },

  updateVideoProgress: async (
    videoId: number,
    lastPositionSeconds: number,
    isCompleted: boolean
  ): Promise<VideoProgress> => {
    const { data } = await apiClient.post(`/progress/videos/${videoId}`, {
      lastPositionSeconds,
      isCompleted,
    });
    return data;
  },

  getSubjectProgress: async (subjectId: number): Promise<SubjectProgress> => {
    const { data } = await apiClient.get(`/progress/subjects/${subjectId}`);
    return data;
  },
};
