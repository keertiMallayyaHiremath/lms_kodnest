'use client';

import { useEffect, useRef, useState } from 'react';
import YouTube, { YouTubeProps } from 'react-youtube';

interface VideoPlayerProps {
  youtubeVideoId: string;
  startPositionSeconds: number;
  onProgress: (currentTime: number) => void;
  onCompleted: () => void;
}

export default function VideoPlayer({
  youtubeVideoId,
  startPositionSeconds,
  onProgress,
  onCompleted,
}: VideoPlayerProps) {
  const playerRef = useRef<any>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, []);

  const onReady: YouTubeProps['onReady'] = (event) => {
    playerRef.current = event.target;
    setIsReady(true);
    
    // Seek to start position
    if (startPositionSeconds > 0) {
      event.target.seekTo(startPositionSeconds, true);
    }
  };

  const onPlay: YouTubeProps['onPlay'] = () => {
    // Start tracking progress
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
    }

    progressIntervalRef.current = setInterval(() => {
      if (playerRef.current) {
        const currentTime = playerRef.current.getCurrentTime();
        onProgress(Math.floor(currentTime));
      }
    }, 5000); // Update every 5 seconds
  };

  const onPause: YouTubeProps['onPause'] = () => {
    // Save progress on pause
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
    }

    if (playerRef.current) {
      const currentTime = playerRef.current.getCurrentTime();
      onProgress(Math.floor(currentTime));
    }
  };

  const onEnd: YouTubeProps['onEnd'] = () => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
    }
    onCompleted();
  };

  const opts: YouTubeProps['opts'] = {
    height: '100%',
    width: '100%',
    playerVars: {
      autoplay: 0,
      start: startPositionSeconds,
    },
  };

  return (
    <div className="aspect-video bg-black">
      <YouTube
        videoId={youtubeVideoId}
        opts={opts}
        onReady={onReady}
        onPlay={onPlay}
        onPause={onPause}
        onEnd={onEnd}
        className="w-full h-full"
      />
    </div>
  );
}
