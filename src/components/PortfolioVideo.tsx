import React, { useState, useRef, useEffect, useCallback } from "react";
import "./styles/PortfolioVideo.css";

const PortfolioVideo = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState("0:00");
  const [duration, setDuration] = useState("0:00");
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Lazy load: only render the video when the section scrolls into view
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px", threshold: 0.1 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleLoadedData = useCallback(() => {
    setIsLoaded(true);
    if (videoRef.current) {
      setDuration(formatTime(videoRef.current.duration));
    }
  }, []);

  const handleTimeUpdate = useCallback(() => {
    if (videoRef.current) {
      const pct = (videoRef.current.currentTime / videoRef.current.duration) * 100;
      setProgress(pct);
      setCurrentTime(formatTime(videoRef.current.currentTime));
    }
  }, []);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!videoRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = (e.clientX - rect.left) / rect.width;
    videoRef.current.currentTime = pct * videoRef.current.duration;
  };

  const handleEnded = () => {
    setIsPlaying(false);
  };

  return (
    <div className="portfolio-video-section" ref={containerRef} id="portfolio-video">
      <div className="portfolio-video-header">
        <h3 className="portfolio-video-title">
          PORTFOLIO <span>SHOWREEL</span>
        </h3>
        <p className="portfolio-video-subtitle">
          A quick walkthrough of my work, projects, and what I bring to the table.
        </p>
      </div>

      <div className={`portfolio-video-wrapper ${isLoaded ? "loaded" : ""}`}>
        {!isVisible && (
          <div className="portfolio-video-placeholder">
            <div className="placeholder-pulse"></div>
          </div>
        )}

        {isVisible && (
          <>
            {!isLoaded && (
              <div className="portfolio-video-loader">
                <div className="loader-spinner"></div>
                <p>Loading video...</p>
              </div>
            )}

            <video
              ref={videoRef}
              className="portfolio-video-player"
              preload="metadata"
              playsInline
              onLoadedData={handleLoadedData}
              onTimeUpdate={handleTimeUpdate}
              onEnded={handleEnded}
              onClick={togglePlay}
            >
              <source src="/videos/Prathmesh_Phalke__AI_Dev.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>

            {/* Play overlay (shown when not playing and loaded) */}
            {isLoaded && !isPlaying && (
              <div className="portfolio-video-play-overlay" onClick={togglePlay}>
                <div className="play-button">
                  <svg viewBox="0 0 24 24" fill="currentColor" width="40" height="40">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>
            )}

            {/* Custom controls */}
            {isLoaded && (
              <div className={`portfolio-video-controls ${isPlaying ? "playing" : ""}`}>
                <button className="control-btn" onClick={togglePlay}>
                  {isPlaying ? (
                    <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                      <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  )}
                </button>
                <span className="time-display">{currentTime} / {duration}</span>
                <div className="progress-bar" onClick={handleProgressClick}>
                  <div className="progress-filled" style={{ width: `${progress}%` }}></div>
                  <div className="progress-handle" style={{ left: `${progress}%` }}></div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default PortfolioVideo;
