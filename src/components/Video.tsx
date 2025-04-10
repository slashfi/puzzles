'use client';
import type React from 'react';
import { useEffect, useRef, useState } from 'react';

// SVG icons for video controls
const PlayIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    fill="currentColor"
    viewBox="0 0 16 16"
    aria-hidden="true"
    role="img"
  >
    <title>Play</title>
    <path d="M10.804 8 5 4.633v6.734L10.804 8zm.792-.696a.802.802 0 0 1 0 1.392l-6.363 3.692C4.713 12.69 4 12.345 4 11.692V4.308c0-.653.713-.998 1.233-.696l6.363 3.692z" />
  </svg>
);

const PauseIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    fill="currentColor"
    viewBox="0 0 16 16"
    aria-hidden="true"
    role="img"
  >
    <title>Pause</title>
    <path d="M5.5 3.5A1.5 1.5 0 0 1 7 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5zm5 0A1.5 1.5 0 0 1 12 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5z" />
  </svg>
);

const FullscreenIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    fill="currentColor"
    viewBox="0 0 16 16"
    aria-hidden="true"
    role="img"
  >
    <title>Fullscreen</title>
    <path d="M1.5 1a.5.5 0 0 0-.5.5v4a.5.5 0 0 1-1 0v-4A1.5 1.5 0 0 1 1.5 0h4a.5.5 0 0 1 0 1h-4zM10 .5a.5.5 0 0 1 .5-.5h4A1.5 1.5 0 0 1 16 1.5v4a.5.5 0 0 1-1 0v-4a.5.5 0 0 0-.5-.5h-4a.5.5 0 0 1-.5-.5zM.5 10a.5.5 0 0 1 .5.5v4a.5.5 0 0 0 .5.5h4a.5.5 0 0 1 0 1h-4A1.5 1.5 0 0 1 0 14.5v-4a.5.5 0 0 1 .5-.5zm15 0a.5.5 0 0 1 .5.5v4a1.5 1.5 0 0 1-1.5 1.5h-4a.5.5 0 0 1 0-1h4a.5.5 0 0 0 .5-.5v-4a.5.5 0 0 1 .5-.5z" />
  </svg>
);

interface VideoProps {
  src: string;
  width?: string | number;
  height?: string | number;
  controls?: boolean;
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
  className?: string;
  preload?: 'auto' | 'metadata' | 'none';
}

interface VideoState {
  progress: number;
  isPlaying: boolean;
  duration: number;
  isDragging: boolean;
  isTransitionEnabled: boolean;
  isHoverVisible: boolean;
  wasPlayingBeforeDrag: boolean;
}

export function Video({
  src,
  width = '100%',
  height = 'auto',
  controls = false,
  autoPlay = true,
  loop = true,
  muted = true,
  className = '',
  preload = 'metadata',
}: VideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hoverPositionRef = useRef<number>(0);
  const timeDisplayRef = useRef<HTMLSpanElement>(null);

  const [videoState, setVideoState] = useState<VideoState>({
    progress: 0,
    isPlaying: autoPlay,
    duration: 0,
    isDragging: false,
    isTransitionEnabled: true,
    isHoverVisible: false,
    wasPlayingBeforeDrag: false,
  });

  useEffect(() => {
    const video = videoRef.current;
    const timeDisplay = timeDisplayRef.current;
    if (!video) return;

    const updateProgress = () => {
      const currentProgress = (video.currentTime / video.duration) * 100;
      setVideoState((prev) => ({ ...prev, progress: currentProgress }));

      // Update time display directly
      if (timeDisplay && video.duration) {
        const currentTime = formatTime(video.currentTime);
        const totalTime = formatTime(video.duration);
        timeDisplay.textContent = `${currentTime} / ${totalTime}`;
      }
    };

    const handleDurationChange = () => {
      setVideoState((prev) => ({ ...prev, duration: video.duration }));
    };

    const handleEnded = () => {
      if (loop) {
        video.play();
        setVideoState((prev) => ({ ...prev, isPlaying: true }));
      } else {
        setVideoState((prev) => ({ ...prev, isPlaying: false }));
      }
    };

    video.addEventListener('timeupdate', updateProgress);
    video.addEventListener('durationchange', handleDurationChange);
    video.addEventListener('ended', handleEnded);

    return () => {
      video.removeEventListener('timeupdate', updateProgress);
      video.removeEventListener('durationchange', handleDurationChange);
      video.removeEventListener('ended', handleEnded);
    };
  }, [loop]);

  const updateVideoTime = (clientX: number, element: HTMLElement) => {
    const video = videoRef.current;
    if (!video) return;

    const rect = element.getBoundingClientRect();
    const position = (clientX - rect.left) / rect.width;
    const clampedPosition = Math.max(0, Math.min(position, 1));

    setVideoState((prev) => ({ ...prev, isTransitionEnabled: false }));
    video.currentTime = clampedPosition * video.duration;
    const newProgress = clampedPosition * 100;

    setVideoState((prev) => ({ ...prev, progress: newProgress }));

    // Re-enable transitions after a short delay
    setTimeout(() => {
      setVideoState((prev) => ({ ...prev, isTransitionEnabled: true }));
    }, 50);

    return newProgress;
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    updateVideoTime(e.clientX, e.currentTarget);
  };

  const handleProgressMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const progressBar = e.currentTarget;
    const rect = progressBar.getBoundingClientRect();
    const position = (e.clientX - rect.left) / rect.width;
    const clampedPosition = Math.max(0, Math.min(position, 1));

    hoverPositionRef.current = clampedPosition * 100;
    setVideoState((prev) => ({ ...prev, isHoverVisible: true }));

    if (videoState.isDragging) {
      updateVideoTime(e.clientX, progressBar);
    }
  };

  const handleProgressMouseLeave = () => {
    setVideoState((prev) => ({ ...prev, isHoverVisible: false }));

    // Don't stop dragging when mouse leaves the progress bar
    // Only the global mouseup handler should stop dragging
  };

  const handleProgressMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const video = videoRef.current;
    if (video) {
      const wasPlaying = videoState.isPlaying;
      setVideoState((prev) => ({
        ...prev,
        wasPlayingBeforeDrag: wasPlaying,
        isDragging: true,
      }));

      if (wasPlaying) {
        video.pause();
        setVideoState((prev) => ({ ...prev, isPlaying: false }));
      }
    }
    updateVideoTime(e.clientX, e.currentTarget);
  };

  const handleProgressMouseUp = () => {
    const video = videoRef.current;
    if (video && videoState.wasPlayingBeforeDrag) {
      video.play();
      setVideoState((prev) => ({
        ...prev,
        isPlaying: true,
        isDragging: false,
      }));
    } else {
      setVideoState((prev) => ({ ...prev, isDragging: false }));
    }
  };

  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (videoState.isDragging) {
        const progressBar = document.querySelector('.progress-bar');
        if (progressBar) {
          updateVideoTime(e.clientX, progressBar as HTMLElement);
        }
      }
    };

    const handleGlobalMouseUp = () => {
      if (videoState.isDragging) {
        const video = videoRef.current;
        if (video && videoState.wasPlayingBeforeDrag) {
          video.play();
          setVideoState((prev) => ({
            ...prev,
            isPlaying: true,
            isDragging: false,
          }));
        } else {
          setVideoState((prev) => ({ ...prev, isDragging: false }));
        }
      }
    };

    window.addEventListener('mousemove', handleGlobalMouseMove);
    window.addEventListener('mouseup', handleGlobalMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleGlobalMouseMove);
      window.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, [videoState.isDragging, videoState.wasPlayingBeforeDrag]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (videoState.isPlaying) {
      video.pause();
      setVideoState((prev) => ({ ...prev, isPlaying: false }));
    } else {
      video.play();
      setVideoState((prev) => ({ ...prev, isPlaying: true }));
    }
  };

  const toggleFullscreen = () => {
    // Use the video element directly for fullscreen instead of the container
    const video = videoRef.current;
    if (!video) return;

    if (!document.fullscreenElement) {
      video.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === ' ' || e.key === 'Enter') {
      togglePlay();
    }
  };

  return (
    <div
      className={`video-container relative group ${className} pb-4`}
      id="video-container"
    >
      <div className="relative rounded-md overflow-hidden">
        <video
          ref={videoRef}
          src={src}
          width={width}
          height={height}
          controls={controls}
          autoPlay={autoPlay}
          loop={loop}
          muted={muted}
          preload={preload}
          className="rounded-md cursor-pointer w-full"
          style={{ maxWidth: '100%' }}
          onClick={togglePlay}
          onDoubleClick={toggleFullscreen}
          onKeyDown={handleKeyDown}
          onLoadedMetadata={(e) => {
            const video = e.currentTarget;
            if (video.duration && !Number.isNaN(video.duration)) {
              setVideoState((prev) => ({ ...prev, duration: video.duration }));
            }
          }}
          tabIndex={0}
        />

        {/* Overlay controls - visible on hover using CSS group */}
        <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/70 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 fullscreen:opacity-100 rounded-b-md">
          <div
            className="progress-bar h-2.5 bg-gray-200/30 rounded-full cursor-pointer mb-2 relative"
            onClick={handleProgressClick}
            onMouseMove={handleProgressMouseMove}
            onMouseLeave={handleProgressMouseLeave}
            onMouseDown={handleProgressMouseDown}
            onMouseUp={handleProgressMouseUp}
            onKeyDown={handleKeyDown}
            tabIndex={0}
            role="slider"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={videoState.progress}
          >
            {/* Base progress bar */}
            <div
              className={`progress h-full bg-blue-500 rounded-full ${videoState.isTransitionEnabled && !videoState.isDragging ? 'transition-all duration-300 ease-linear' : ''}`}
              style={{ width: `${videoState.progress}%` }}
            />

            {/* Hover indicator */}
            {videoState.isHoverVisible && (
              <div
                className="absolute top-0 bottom-0 w-1 bg-white/70 rounded-full transform -translate-x-1/2 z-10"
                style={{
                  left: `${hoverPositionRef.current}%`,
                }}
              />
            )}

            {/* Progress knob */}
            <div
              className={`absolute top-1/2 h-3.5 w-3.5 bg-white rounded-full shadow-md transform -translate-y-1/2 -translate-x-1/2 z-20 ${videoState.isTransitionEnabled && !videoState.isDragging ? 'transition-all ease-linear duration-300' : ''}`}
              style={{ left: `${videoState.progress}%` }}
            />
          </div>

          <div className="flex justify-between items-center text-xs text-white">
            <div className="flex items-center gap-3">
              <button
                onClick={togglePlay}
                onKeyDown={handleKeyDown}
                className="flex items-center justify-center w-6 h-6 hover:text-blue-300 transition-colors cursor-pointer"
                type="button"
                aria-label={videoState.isPlaying ? 'Pause' : 'Play'}
              >
                {videoState.isPlaying ? <PauseIcon /> : <PlayIcon />}
              </button>
              <span ref={timeDisplayRef}>0:00 / 0:00</span>
            </div>
            <button
              onClick={toggleFullscreen}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  toggleFullscreen();
                }
              }}
              className="flex items-center justify-center w-6 h-6 hover:text-blue-300 transition-colors cursor-pointer"
              type="button"
              aria-label="Fullscreen"
            >
              <FullscreenIcon />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
