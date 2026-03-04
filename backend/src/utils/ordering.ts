import { Section, Video } from '@prisma/client';

export interface FlattenedVideo {
  videoId: number;
  sectionId: number;
  orderIndex: number;
  globalIndex: number;
  previousVideoId: number | null;
  nextVideoId: number | null;
}

export const flattenVideos = (
  sections: (Section & { videos: Video[] })[]
): FlattenedVideo[] => {
  // Sort sections by order_index
  const sortedSections = [...sections].sort((a, b) => a.orderIndex - b.orderIndex);
  
  const flattened: FlattenedVideo[] = [];
  let globalIndex = 0;

  for (const section of sortedSections) {
    // Sort videos within section by order_index
    const sortedVideos = [...section.videos].sort((a, b) => a.orderIndex - b.orderIndex);
    
    for (const video of sortedVideos) {
      flattened.push({
        videoId: video.id,
        sectionId: section.id,
        orderIndex: video.orderIndex,
        globalIndex,
        previousVideoId: null,
        nextVideoId: null,
      });
      globalIndex++;
    }
  }

  // Set previous and next video IDs
  for (let i = 0; i < flattened.length; i++) {
    if (i > 0) {
      flattened[i].previousVideoId = flattened[i - 1].videoId;
    }
    if (i < flattened.length - 1) {
      flattened[i].nextVideoId = flattened[i + 1].videoId;
    }
  }

  return flattened;
};

export const getVideoPosition = (
  videoId: number,
  flattened: FlattenedVideo[]
): FlattenedVideo | null => {
  return flattened.find(v => v.videoId === videoId) || null;
};
