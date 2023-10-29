"use client";
import Image from "next/image";
import { useState, useEffect, useRef, type FC } from "react";
import SnipBtn from "./SnipBtn";
import { useSnipsStore } from "~stores/sniptube";
import { getSnips } from "~lib/storage";
import SectionHeader from "~components/Common/SectionHeader";
import TimelineSnip from "./TimelineSnip";

const Demo: FC = () => {
  const [isPaused, setIsPaused] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isTheaterMode, setIsTheaterMode] = useState(false);
  const [isMiniPlayer, setIsMiniPlayer] = useState(false);
  const [currentTime, setCurrentTime] = useState(36);
  const [totalTime, setTotalTime] = useState(0);
  const [captionsVisible, setCaptionsVisible] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const videoRef = useRef<HTMLVideoElement>(null);
  const timelineContainerRef = useRef<HTMLDivElement>(null);
  const videoContainerRef = useRef<HTMLDivElement>(null);

  const snips = useSnipsStore((state) => state.snips);

  const getTimeFromSeconds = (seconds: number) => {
    const numMinutes = Math.floor(seconds / 60);
    const numSeconds = Math.floor(seconds % 60);

    const formattedMinutes = numMinutes.toString().padStart(2, "0");
    const formattedSeconds = numSeconds.toString().padStart(2, "0");

    return `${formattedMinutes}:${formattedSeconds}`;
  };

  const handlePlayPause = () => {
    const videoElement = videoRef.current;

    if (videoElement) {
      if (videoElement.paused) {
        videoElement.play();
        setIsPaused(false);
      } else {
        videoElement.pause();
        setIsPaused(true);
      }
    }
  };
  const updateVideoCurrentTime = () => {
    const videoElement = videoRef.current;
    const timelineContainer = timelineContainerRef.current;

    if (videoElement) {
      setCurrentTime(videoElement.currentTime);
      const percentViewed = videoElement.currentTime / videoElement.duration;
      // const thumbIndicator = document.querySelector(".thumb-indicator") as HTMLDivElement;
      // const previewImg = document.querySelector(".preview-img") as HTMLImageElement;

      if (timelineContainer) {
        timelineContainer.style.setProperty("--progress-position", percentViewed.toString());
        // thumbIndicator.style.setProperty("--progress-position", percentViewed.toString());
        // previewImg.style.setProperty("--preview-position", percentViewed.toString());
      }

      // if (videoElement.currentTime >= 5) {
      //   videoElement.pause();
      //   setIsPaused(true);
      // }
    }
  };
  useEffect(() => {
    // getSnips().then((allSnips) => setSnips(allSnips));

    const videoElement = videoRef.current;
    videoElement.currentTime = currentTime;
    const timelineContainer = timelineContainerRef.current;
    const videoContainer = videoContainerRef.current;
    const previewImg = document.querySelector(".preview-img") as HTMLImageElement;
    const thumbnailImg = document.querySelector(".thumbnail-img") as HTMLImageElement;

    const handleFullScreen = () => {
      if (videoElement) {
        if (!isFullScreen) {
          if (videoElement.requestFullscreen) {
            videoElement.requestFullscreen();
            // } else if (videoElement.requestFullScreen) {
            //   videoElement.mozRequestFullScreen();
            // } else if (videoElement.webkitRequestFullscreen) {
            //   videoElement.webkitRequestFullscreen();
          }
        } else {
          if (document.exitFullscreen) {
            document.exitFullscreen();
            // } else if (document.mozCancelFullScreen) {
            //   document.mozCancelFullScreen();
            // } else if (document.webkitExitFullscreen) {
            //   document.webkitExitFullscreen();
          }
        }
      }
    };
    setTotalTime(videoElement?.duration || 0);

    // Timeline
    let isScrubbing = false;
    let wasPaused: boolean;
    function toggleScrubbing(e: MouseEvent) {
      const rect = timelineContainer.getBoundingClientRect();
      const percent = Math.min(Math.max(0, e.x - rect.x), rect.width) / rect.width;
      isScrubbing = (e.buttons & 1) === 1;
      videoContainer.classList.toggle("scrubbing", isScrubbing);
      if (isScrubbing) {
        wasPaused = videoElement.paused;
        videoElement.pause();
      } else {
        videoElement.currentTime = percent * videoElement.duration;
        if (!wasPaused) videoElement.play();
      }

      handleTimelineUpdate(e);
    }

    function handleTimelineUpdate(e: MouseEvent) {
      const rect = timelineContainer.getBoundingClientRect();
      const percent = Math.min(Math.max(0, e.x - rect.x), rect.width) / rect.width;
      const previewImgSrc = "demo-yt/preview.png";
      previewImg.src = previewImgSrc;
      timelineContainer.style.setProperty("--preview-position", percent.toString());

      if (isScrubbing) {
        e.preventDefault();
        thumbnailImg.src = previewImgSrc;
        timelineContainer.style.setProperty("--progress-position", percent.toString());
      }
    }

    // event listeners
    videoElement.addEventListener("timeupdate", updateVideoCurrentTime);
    timelineContainer.addEventListener("mousemove", handleTimelineUpdate);
    timelineContainer.addEventListener("mousedown", toggleScrubbing);
    document.addEventListener("mouseup", (e) => {
      if (isScrubbing) toggleScrubbing(e);
    });
    document.addEventListener("mousemove", (e) => {
      if (isScrubbing) handleTimelineUpdate(e);
    });
    return () => {
      // remove event listeners
      videoElement.removeEventListener("timeupdate", updateVideoCurrentTime);
      timelineContainer.removeEventListener("mousemove", handleTimelineUpdate);
      timelineContainer.removeEventListener("mousedown", toggleScrubbing);
      document.removeEventListener("mouseup", (e) => {
        if (isScrubbing) toggleScrubbing(e);
      });
      document.removeEventListener("mousemove", (e) => {
        if (isScrubbing) handleTimelineUpdate(e);
      });
    };
  }, []);

  return (
    <>
      {/* <!-- ===== Demo Start ===== --> */}
      <section
        id="demo"
        className="py-20 lg:py-25 xl:py-30 px-4 md:px-8 2xl:px-0 overflow-hidden"
      >
        {/* <!-- Section Title Start --> */}
        <SectionHeader
          className="pb-12.5 lg:pb-15 xl:pb-20"
          headerInfo={{
            title: "DEMO",
            subtitle: "SnipTube in Action",
            description:
              "Give SnipTube a try and see how it can help you. This is just a simplified demo, there's a lot more you can do with SnipTube like annotating, writing your own notes, exporting and more!",
          }}
        />
        {/* <!-- Section Title End --> */}
        <div
          ref={videoContainerRef}
          className={`video-container ${isPaused ? "paused" : ""} ${isFullScreen ? "full-screen" : ""} ${
            isTheaterMode ? "theater" : ""
          }`}
          data-volume-level="high"
        >
          <img className="thumbnail-img" />
          <div className="video-controls-container">
            <div
              className="timeline-container"
              ref={timelineContainerRef}
            >
              <div className="timeline">
                {snips.map((snip, index) => (
                  <TimelineSnip
                    key={snip.id}
                    snip={snip}
                    videoRef={videoRef}
                    firstSnip={index === 0}
                  />
                ))}
                <img className="preview-img" />
                <div className="thumb-indicator z-40" />
              </div>
            </div>
            <div className="controls">
              <button
                className="play-pause-btn"
                onClick={handlePlayPause}
              >
                <svg
                  className="play-icon"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="currentColor"
                    d="M8,5.14V19.14L19,12.14L8,5.14Z"
                  />
                </svg>
                <svg
                  className="pause-icon"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="currentColor"
                    d="M14,19H18V5H14M6,19H10V5H6V19Z"
                  />
                </svg>
              </button>
              <div className="volume-container">
                <button className="mute-btn">
                  <svg
                    className="volume-high-icon"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fill="currentColor"
                      d="M14,3.23V5.29C16.89,6.15 19,8.83 19,12C19,15.17 16.89,17.84 14,18.7V20.77C18,19.86 21,16.28 21,12C21,7.72 18,4.14 14,3.23M16.5,12C16.5,10.23 15.5,8.71 14,7.97V16C15.5,15.29 16.5,13.76 16.5,12M3,9V15H7L12,20V4L7,9H3Z"
                    />
                  </svg>
                  <svg
                    className="volume-low-icon"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fill="currentColor"
                      d="M5,9V15H9L14,20V4L9,9M18.5,12C18.5,10.23 17.5,8.71 16,7.97V16C17.5,15.29 18.5,13.76 18.5,12Z"
                    />
                  </svg>
                  <svg
                    className="volume-muted-icon"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fill="currentColor"
                      d="M12,4L9.91,6.09L12,8.18M4.27,3L3,4.27L7.73,9H3V15H7L12,20V13.27L16.25,17.53C15.58,18.04 14.83,18.46 14,18.7V20.77C15.38,20.45 16.63,19.82 17.68,18.96L19.73,21L21,19.73L12,10.73M19,12C19,12.94 18.8,13.82 18.46,14.64L19.97,16.15C20.62,14.91 21,13.5 21,12C21,7.72 18,4.14 14,3.23V5.29C16.89,6.15 19,8.83 19,12M16.5,12C16.5,10.23 15.5,8.71 14,7.97V10.18L16.45,12.63C16.5,12.43 16.5,12.21 16.5,12Z"
                    />
                  </svg>
                </button>
                <input
                  className="volume-slider"
                  type="range"
                  min={0}
                  max={1}
                  step="any"
                  value={volume}
                  onChange={(e) => setVolume(Number(e.target.value))}
                />
              </div>
              <div className="duration-container">
                <div className="current-time">{getTimeFromSeconds(currentTime)}</div>/
                <div className="total-time">{getTimeFromSeconds(totalTime)}</div>
              </div>
              <SnipBtn
                videoRef={videoRef}
                className=""
              />
              <button className="captions-btn">
                <svg viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M18,11H16.5V10.5H14.5V13.5H16.5V13H18V14A1,1 0 0,1 17,15H14A1,1 0 0,1 13,14V10A1,1 0 0,1 14,9H17A1,1 0 0,1 18,10M11,11H9.5V10.5H7.5V13.5H9.5V13H11V14A1,1 0 0,1 10,15H7A1,1 0 0,1 6,14V10A1,1 0 0,1 7,9H10A1,1 0 0,1 11,10M19,4H5C3.89,4 3,4.89 3,6V18A2,2 0 0,0 5,20H19A2,2 0 0,0 21,18V6C21,4.89 20.1,4 19,4Z"
                  />
                </svg>
              </button>
              <button className="speed-btn wide-btn">1x</button>
              <button className="mini-player-btn">
                <svg viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M21 3H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H3V5h18v14zm-10-7h9v6h-9z"
                  />
                </svg>
              </button>
              <button className="theater-btn">
                <svg
                  className="tall"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="currentColor"
                    d="M19 6H5c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm0 10H5V8h14v8z"
                  />
                </svg>
                <svg
                  className="wide"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="currentColor"
                    d="M19 7H5c-1.1 0-2 .9-2 2v6c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V9c0-1.1-.9-2-2-2zm0 8H5V9h14v6z"
                  />
                </svg>
              </button>
              <button className="full-screen-btn">
                <svg
                  className="open"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="currentColor"
                    d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"
                  />
                </svg>
                <svg
                  className="close"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="currentColor"
                    d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z"
                  />
                </svg>
              </button>
            </div>
          </div>
          <video
            ref={videoRef}
            src="demo-yt/demo-video.webm"
          >
            <track
              kind="captions"
              srcLang="en"
              src="demo-yt/subtitles.vtt"
            />
          </video>
        </div>
        <style jsx>{`
          .video-container {
            position: relative;
            width: 90%;
            max-width: 1000px;
            display: flex;
            justify-content: center;
            margin-inline: auto;
            background-color: black;
          }

          .video-container.theater,
          .video-container.full-screen {
            max-width: initial;
            width: 100%;
          }

          .video-container.theater {
            max-height: 90vh;
          }

          .video-container.full-screen {
            max-height: 100vh;
          }

          video {
            width: 100%;
          }

          .video-controls-container {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            color: white;
            z-index: 30;
            opacity: 0;
            transition: opacity 150ms ease-in-out;
          }

          .video-controls-container::before {
            content: "";
            position: absolute;
            bottom: 0;
            background: linear-gradient(to top, rgba(0, 0, 0, 0.75), transparent);
            width: 100%;
            aspect-ratio: 6 / 1;
            z-index: -1;
            pointer-events: none;
          }

          .video-container:hover .video-controls-container,
          .video-container:focus-within .video-controls-container,
          .video-container.paused .video-controls-container {
            opacity: 1;
          }

          .video-controls-container .controls {
            display: flex;
            gap: 0.75rem;
            padding: 0.25rem;
            align-items: center;
          }

          .video-controls-container .controls button {
            background: none;
            border: none;
            color: inherit;
            padding: 0;
            height: 30px;
            width: 30px;
            font-size: 1.1rem;
            cursor: pointer;
            opacity: 0.85;
            transition: opacity 150ms ease-in-out;
          }

          .video-controls-container .controls button:hover {
            opacity: 1;
          }

          .video-container.paused .pause-icon {
            display: none;
          }

          .video-container:not(.paused) .play-icon {
            display: none;
          }

          .video-container.theater .tall {
            display: none;
          }

          .video-container:not(.theater) .wide {
            display: none;
          }

          .video-container.full-screen .open {
            display: none;
          }

          .video-container:not(.full-screen) .close {
            display: none;
          }

          .volume-high-icon,
          .volume-low-icon,
          .volume-muted-icon {
            display: none;
          }

          .video-container[data-volume-level="high"] .volume-high-icon {
            display: block;
          }

          .video-container[data-volume-level="low"] .volume-low-icon {
            display: block;
          }

          .video-container[data-volume-level="muted"] .volume-muted-icon {
            display: block;
          }

          .volume-container {
            display: flex;
            align-items: center;
          }

          .volume-slider {
            width: 0;
            transform-origin: left;
            transform: scaleX(0);
            transition: width 150ms ease-in-out, transform 150ms ease-in-out;
          }

          .volume-container:hover .volume-slider,
          .volume-slider:focus-within {
            width: 100px;
            transform: scaleX(1);
          }

          .duration-container {
            display: flex;
            align-items: center;
            gap: 0.25rem;
            flex-grow: 1;
          }

          .video-container.captions .captions-btn {
            border-bottom: 3px solid red;
          }

          .video-controls-container .controls button.wide-btn {
            width: 40px;
          }

          .timeline-container {
            height: 7px;
            margin-inline: 0.5rem;
            cursor: pointer;
            display: flex;
            align-items: center;
          }

          .timeline {
            background-color: rgba(100, 100, 100, 0.5);
            height: 3px;
            width: 100%;
            position: relative;
          }

          .timeline::before {
            content: "";
            position: absolute;
            left: 0;
            top: 0;
            bottom: 0;
            right: calc(100% - var(--preview-position) * 100%);
            background-color: rgb(150, 150, 150);
            display: none;
          }

          .timeline::after {
            content: "";
            position: absolute;
            left: 0;
            top: 0;
            bottom: 0;
            right: calc(100% - var(--progress-position) * 100%);
            background-color: red;
          }

          .timeline .thumb-indicator {
            --scale: 0;
            position: absolute;
            transform: translateX(-50%) scale(var(--scale));
            height: 200%;
            top: -50%;
            left: calc(var(--progress-position) * 100%);
            background-color: red;
            border-radius: 50%;
            transition: transform 150ms ease-in-out;
            aspect-ratio: 1 / 1;
          }

          .timeline .preview-img {
            position: absolute;
            height: 80px;
            aspect-ratio: 16 / 9;
            top: -1rem;
            transform: translate(-50%, -100%);
            left: calc(var(--preview-position) * 100%);
            border-radius: 0.25rem;
            border: 2px solid white;
            display: none;
          }

          .thumbnail-img {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            width: 100%;
            height: 100%;
            display: none;
          }

          .video-container.scrubbing .thumbnail-img {
            display: block;
          }

          .video-container.scrubbing .preview-img,
          .timeline-container:hover .preview-img {
            display: block;
          }

          .video-container.scrubbing .timeline::before,
          .timeline-container:hover .timeline::before {
            display: block;
          }

          .video-container.scrubbing .thumb-indicator,
          .timeline-container:hover .thumb-indicator {
            --scale: 1;
          }

          .video-container.scrubbing .timeline,
          .timeline-container:hover .timeline {
            height: 100%;
          }
        `}</style>
      </section>
      {/* <!-- ===== Demo End ===== --> */}
    </>
  );
};

export default Demo;
