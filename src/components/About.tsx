import { useState, useCallback, useRef, useEffect } from "react";
import "./styles/About.css";

const About = () => {
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoContainerRef = useRef<HTMLDivElement>(null);

  // Show video as soon as it can start playing (progressive loading)
  const handleCanPlay = useCallback(() => {
    setVideoLoaded(true);
    setIsLoading(false);
    setVideoError(false);
  }, []);

  // Show when enough data is loaded to display first frame
  const handleLoadedData = useCallback(() => {
    setVideoLoaded(true);
    setIsLoading(false);
  }, []);

  const handleError = useCallback(() => {
    setVideoError(true);
    setVideoLoaded(false);
    setIsLoading(false);
  }, []);

  // Track buffering state with debounce to prevent frequent re-renders
  const loadingTimeoutRef = useRef<number | null>(null);

  const handleWaiting = useCallback(() => {
    if (loadingTimeoutRef.current) clearTimeout(loadingTimeoutRef.current);
    loadingTimeoutRef.current = window.setTimeout(() => {
      setIsLoading(true);
    }, 500); // Only show loading if buffered for 500ms+
  }, []);

  const handlePlaying = useCallback(() => {
    if (loadingTimeoutRef.current) {
      clearTimeout(loadingTimeoutRef.current);
      loadingTimeoutRef.current = null;
    }
    setIsLoading(false);
  }, []);

  const togglePlay = useCallback(() => {
    const video = videoRef.current;
    const container = videoContainerRef.current;
    if (!video) return;
    if (video.paused) {
      video.play().catch(() => setVideoError(true));
      setIsPlaying(true);
      if (container) {
        container.classList.add("is-playing");
      }
    } else {
      video.pause();
      setIsPlaying(false);
      if (container) {
        container.classList.remove("is-playing");
      }
    }
  }, []);

  const toggleFullscreen = useCallback(async () => {
    const container = videoContainerRef.current;
    const video = videoRef.current;
    if (!container) return;

    const wasPlaying = video ? !video.paused : false;

    if (!document.fullscreenElement) {
      try {
        await container.requestFullscreen();
        setIsFullscreen(true);
        if (wasPlaying && video) {
          await video.play().catch(() => { });
        }
      } catch (err) {
        console.error('Error attempting to enable fullscreen:', err);
      }
    } else {
      try {
        await document.exitFullscreen();
        setIsFullscreen(false);
        if (wasPlaying && video) {
          await video.play().catch(() => { });
        }
      } catch (err) {
        console.error('Error exiting fullscreen:', err);
      }
    }
  }, []);

  // Listen for fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = async () => {
      const isFull = !!document.fullscreenElement;
      setIsFullscreen(isFull);

      const video = videoRef.current;
      if (video) {
        try {
          await video.play().catch(() => { });
          setIsPlaying(true);
          const container = videoContainerRef.current;
          if (container) container.classList.add("is-playing");
        } catch {
          setIsPlaying(false);
          const container = videoContainerRef.current;
          if (container) container.classList.remove("is-playing");
        }
      }
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  // Sync playing state with video events (avoid inline handlers for performance)
  useEffect(() => {
    const video = videoRef.current;
    const container = videoContainerRef.current;
    if (!video || !container) return;

    const handlePlay = () => {
      setIsPlaying(true);
      container.classList.add("is-playing");
    };
    const handlePause = () => {
      setIsPlaying(false);
      container.classList.remove("is-playing");
    };
    const handleEnded = () => {
      setIsPlaying(false);
      container.classList.remove("is-playing");
    };

    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('ended', handleEnded);

    return () => {
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('ended', handleEnded);
    };
  }, []);

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="about-section section-container" id="about">
      <div className="about-me">
        <h3 className="title">About Me</h3>
        <p className="para">
          Full Stack Web Developer with real-world experience building scalable
          websites and AI-powered tools. Skilled in handling complete project
          development—from UI design to backend architecture and deployment.
          Also pursuing Architecture, combining technical expertise with strong
          design thinking, enabling creation of visually appealing and highly
          functional digital solutions.
        </p>

        <div className="resume-video-wrap" data-cursor="disable">
          <h4>Resume Video.</h4>

          <div className="video-container" ref={videoContainerRef}>
            {/* Loading overlay */}
            {isLoading && !videoError && (
              <div className="video-loading">
                <div className="video-spinner"></div>
                <span>Loading video...</span>
              </div>
            )}

            {/* Error state with fallback */}
            {videoError && (
              <div className="video-error">
                <p>Video could not be loaded.</p>
                <a
                  href="/videos/Prathmesh_Phalke__AI_Dev.mp4"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="video-download-link"
                >
                  Open Video Directly
                </a>
              </div>
            )}

            {/* Video element - use preload="metadata" for faster page load */}
            <video
              ref={videoRef}
              className={`resume-video ${videoLoaded ? "loaded" : ""}`}
              controlsList="nodownload"
              preload="metadata"
              playsInline
              onCanPlay={handleCanPlay}
              onLoadedData={handleLoadedData}
              onWaiting={handleWaiting}
              onPlaying={handlePlaying}
              onError={handleError}
              onClick={togglePlay}
              onDoubleClick={toggleFullscreen}
              style={{ cursor: 'pointer' }}
            >
              <source src="/videos/Prathmesh_Phalke__AI_Dev.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>

            {/* Floating play/pause button overlay */}
            {videoLoaded && (
              <button
                className="video-play-float"
                onClick={togglePlay}
                aria-label={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? (
                  <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
                    <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                )}
              </button>
            )}

            {/* Fullscreen button - render always for better performance */}
            <button
              className={`video-fullscreen-btn ${!videoLoaded ? 'hidden' : ''}`}
              onClick={toggleFullscreen}
              aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
              style={{ display: videoLoaded ? 'flex' : 'none' }}
            >
              {isFullscreen ? (
                <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                  <path d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                  <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;