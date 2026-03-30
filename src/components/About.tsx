import "./styles/About.css";
import { useRef, useState, useEffect, useCallback } from "react";

const About = () => {
  const [loadVideo, setLoadVideo] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const videoWrapRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isPlayingRef = useRef(false);

  // Keep ref in sync with state (needed inside setTimeout)
  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  // Lazy load on scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setLoadVideo(true);
          observer.disconnect();
        }
      },
      { rootMargin: "300px", threshold: 0.05 }
    );
    if (videoWrapRef.current) observer.observe(videoWrapRef.current);
    return () => observer.disconnect();
  }, []);

  // Fullscreen listener
  useEffect(() => {
    const onFsChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onFsChange);
    return () => document.removeEventListener("fullscreenchange", onFsChange);
  }, []);

  const startHideTimer = useCallback(() => {
    if (hideTimer.current) clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => {
      if (isPlayingRef.current) setShowControls(false);
    }, 2500);
  }, []);

  const handleMouseMove = useCallback(() => {
    setShowControls(true);
    startHideTimer();
  }, [startHideTimer]);

  const handleMouseLeave = useCallback(() => {
    if (hideTimer.current) clearTimeout(hideTimer.current);
    if (isPlayingRef.current) setShowControls(false);
  }, []);

  const handleLoadedMetadata = useCallback(() => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
      setIsReady(true);
      setHasError(false);
    }
  }, []);

  const handleError = useCallback(() => {
    setHasError(true);
  }, []);

  const handleCanPlay = useCallback(() => {
    setIsReady(true);
    setHasError(false);
    if (videoRef.current && !duration) setDuration(videoRef.current.duration);
  }, [duration]);

  const handlePlay = useCallback(() => {
    setIsPlaying(true);
    startHideTimer();
  }, [startHideTimer]);

  const handlePause = useCallback(() => {
    setIsPlaying(false);
    setShowControls(true);
    if (hideTimer.current) clearTimeout(hideTimer.current);
  }, []);

  const handleEnded = useCallback(() => {
    setIsPlaying(false);
    setShowControls(true);
    setProgress(0);
    setCurrentTime(0);
    if (hideTimer.current) clearTimeout(hideTimer.current);
    if (videoRef.current) videoRef.current.currentTime = 0;
  }, []);

  const handleTimeUpdate = useCallback(() => {
    if (!videoRef.current) return;
    const cur = videoRef.current.currentTime;
    const dur = videoRef.current.duration || 1;
    setCurrentTime(cur);
    setProgress((cur / dur) * 100);
  }, []);

  const doTogglePlay = useCallback(() => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play().catch(console.error);
    } else {
      videoRef.current.pause();
    }
  }, []);

  // Only toggle when clicking directly on the video element
  const handleContainerClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === videoRef.current) doTogglePlay();
  }, [doTogglePlay]);

  const handlePlayBtnClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    doTogglePlay();
  }, [doTogglePlay]);

  const toggleMute = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    const next = !videoRef.current.muted;
    videoRef.current.muted = next;
    setIsMuted(next);
  }, []);

  const handleVolumeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    const val = parseFloat(e.target.value);
    videoRef.current.volume = val;
    videoRef.current.muted = val === 0;
    setVolume(val);
    setIsMuted(val === 0);
  }, []);

  const handleSeek = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    videoRef.current.currentTime = ratio * (videoRef.current.duration || 0);
  }, []);

  const toggleFullscreen = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(console.error);
    } else {
      document.exitFullscreen();
    }
  }, []);

  const retryLoad = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setHasError(false);
    setIsReady(false);
    if (videoRef.current) videoRef.current.load();
  }, []);

  const formatTime = (secs: number) => {
    if (!secs || isNaN(secs)) return "0:00";
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const controlsVisible = showControls || !isPlaying;

  return (
    <div className="about-section" id="about">
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

        <div className="resume-video-wrap" ref={videoWrapRef}>
          <h4>Resume Video.</h4>

          {/* Outer div has NO overflow:hidden so fullscreen works */}
          <div className="resume-video-outer">
            <div
              ref={containerRef}
              className={`resume-video-container custom-video-container${controlsVisible ? " controls-visible" : ""}`}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              onClick={handleContainerClick}
            >
              {loadVideo ? (
                <>
                  <video
                    ref={videoRef}
                    className="resume-video"
                    preload="auto"
                    playsInline
                    onLoadedMetadata={handleLoadedMetadata}
                    onCanPlay={handleCanPlay}
                    onPlay={handlePlay}
                    onPause={handlePause}
                    onEnded={handleEnded}
                    onError={handleError}
                    onTimeUpdate={handleTimeUpdate}
                  >
                    <source src="/videos/Prathmesh_Phalke__AI_Dev.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>

                  {/* Big center play — only when paused */}
                  {isReady && !isPlaying && (
                    <div className="center-play-overlay" onClick={handlePlayBtnClick}>
                      <div className="big-play-btn">
                        <svg viewBox="0 0 24 24" fill="currentColor" width="40" height="40">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    </div>
                  )}

                  {/* Bottom controls bar */}
                  {isReady && (
                    <div
                      className="yt-controls-bar"
                      onClick={(e) => e.stopPropagation()}
                      onMouseEnter={() => {
                        if (hideTimer.current) clearTimeout(hideTimer.current);
                        setShowControls(true);
                      }}
                      onMouseLeave={() => startHideTimer()}
                    >
                      <div className="yt-progress-track" onClick={handleSeek}>
                        <div className="yt-progress-fill" style={{ width: `${progress}%` }} />
                        <div className="yt-progress-thumb" style={{ left: `${progress}%` }} />
                      </div>

                      <div className="yt-controls-row">
                        <div className="yt-controls-left">
                          <button className="yt-ctrl-btn" onClick={handlePlayBtnClick} title={isPlaying ? "Pause" : "Play"}>
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

                          <button className="yt-ctrl-btn" onClick={toggleMute} title={isMuted ? "Unmute" : "Mute"}>
                            {isMuted || volume === 0 ? (
                              <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                                <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
                              </svg>
                            ) : (
                              <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                                <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
                              </svg>
                            )}
                          </button>

                          <input
                            className="yt-volume-slider"
                            type="range" min="0" max="1" step="0.05"
                            value={isMuted ? 0 : volume}
                            onChange={handleVolumeChange}
                            onClick={(e) => e.stopPropagation()}
                          />

                          <span className="yt-time">
                            {formatTime(currentTime)} / {formatTime(duration)}
                          </span>
                        </div>

                        <div className="yt-controls-right">
                          <button className="yt-ctrl-btn" onClick={toggleFullscreen} title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}>
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
                  )}

                  {!isReady && !hasError && (
                    <div className="video-loading-overlay">
                      <div className="video-spinner"></div>
                      <p>Loading video...</p>
                    </div>
                  )}

                  {hasError && (
                    <div className="video-error-overlay">
                      <p>⚠️ Could not load video</p>
                      <button onClick={retryLoad} className="video-retry-btn">Try Again</button>
                    </div>
                  )}
                </>
              ) : (
                <div className="resume-video-placeholder">
                  <div className="placeholder-pulse"></div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
