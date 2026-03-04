export interface VideoWithOrder {
  id: bigint;
  title: string;
  sectionId: bigint;
  sectionTitle: string;
  orderIndex: number;
  sectionOrderIndex: number;
}

export interface FlattenedVideo extends VideoWithOrder {
  previousVideoId?: bigint;
  nextVideoId?: bigint;
}

export function flattenVideos(videos: VideoWithOrder[]): FlattenedVideo[] {
  // Sort by section order, then by video order
  const sortedVideos = [...videos].sort((a, b) => {
    if (a.sectionOrderIndex !== b.sectionOrderIndex) {
      return a.sectionOrderIndex - b.sectionOrderIndex;
    }
    return a.orderIndex - b.orderIndex;
  });

  // Add previous/next relationships
  return sortedVideos.map((video, index) => ({
    ...video,
    previousVideoId: index > 0 ? sortedVideos[index - 1].id : undefined,
    nextVideoId: index < sortedVideos.length - 1 ? sortedVideos[index + 1].id : undefined,
  }));
}

export function getPrerequisiteVideo(videoId: bigint, flattenedVideos: FlattenedVideo[]): FlattenedVideo | null {
  const video = flattenedVideos.find(v => v.id === videoId);
  if (!video || !video.previousVideoId) {
    return null;
  }
  
  return flattenedVideos.find(v => v.id === video.previousVideoId) || null;
}
