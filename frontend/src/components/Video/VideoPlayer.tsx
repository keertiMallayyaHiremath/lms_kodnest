'use client';

import React, { useState, useEffect, useRef } from 'react';
import YouTube from 'react-youtube';

interface VideoPlayerProps {
  videoId: string;
  youtubeUrl?: string;
  startPositionSeconds?: number;
  onProgress?: (currentTime: number) => void;
  onCompleted?: () => void;
  className?: string;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  videoId,
  youtubeUrl,
  startPositionSeconds = 0,
  onProgress,
  onCompleted,
  className = '',
}) => {
  const [player, setPlayer] = useState<any>(null);
  const [isReady, setIsReady] = useState(false);
  const progressInterval = useRef<NodeJS.Timeout | null>(null);

  // Extract YouTube video ID from URL if provided
  const getYouTubeVideoId = (url: string): string | null => {
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[7].length === 11) ? match[7] : null;
  };

  const actualVideoId = videoId || (youtubeUrl ? getYouTubeVideoId(youtubeUrl) : '');

  const opts = {
    height: '390',
    width: '640',
    playerVars: {
      autoplay: 0,
      controls: 1,
      rel: 0,
      showinfo: 0,
      modestbranding: 1,
      start: startPositionSeconds,
    },
  };

  const onPlayerReady = (event: any) => {
    setPlayer(event.target);
    setIsReady(true);
    
    // Seek to start position if specified
    if (startPositionSeconds > 0) {
      event.target.seekTo(startPositionSeconds, true);
    }
  };

  const onPlayerStateChange = (event: any) => {
    const { data } = event;
    
    // Clear existing interval
    if (progressInterval.current) {
      clearInterval(progressInterval.current);
      progressInterval.current = null;
    }

    switch (data) {
      case YouTube.PlayerState.PLAYING:
        // Start progress tracking
        progressInterval.current = setInterval(() => {
          if (player && onProgress) {
            const currentTime = player.getCurrentTime();
            onProgress(Math.floor(currentTime));
          }
        }, 5000); // Update every 5 seconds
        break;
        
      case YouTube.PlayerState.ENDED:
        // Video completed
        if (onCompleted) {
          onCompleted();
        }
        break;
        
      case YouTube.PlayerState.PAUSED:
        // Send final progress when paused
        if (player && onProgress) {
          const currentTime = player.getCurrentTime();
          onProgress(Math.floor(currentTime));
        }
        break;
    }
  };

  useEffect(() => {
    // Cleanup interval on unmount
    return () => {
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
    };
  }, []);

  if (!actualVideoId) {
    return (
      <div className={`bg-gray-100 rounded-lg flex items-center justify-center ${className}`}>
        <div className="text-center p-8">
          <p className="text-gray-500">No video available</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-black rounded-lg overflow-hidden ${className}`}>
      {!isReady && (
        <div className="aspect-video flex items-center justify-center">
          <div className="text-white text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
            <p>Loading video...</p>
          </div>
        </div>
      )}
      <YouTube
        videoId={actualVideoId}
        opts={opts}
        onReady={onPlayerReady}
        onStateChange={onPlayerStateChange}
        className={!isReady ? 'hidden' : ''}
      />
    </div>
  );
};
