"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { LyricPlayer, BackgroundRender } from "@applemusic-like-lyrics/react";
import type {
  LyricLine,
  LyricLineMouseEvent,
} from "@applemusic-like-lyrics/core";
import "@applemusic-like-lyrics/core/style.css";
import lyricsData from "@/../public/lyrics-parsed.json";

const lyrics = lyricsData as LyricLine[];

export default function LyricsDemo() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [isSeeking, setIsSeeking] = useState(false);
  const [isMobile] = useState(
    () => window.innerWidth < 768 || "maxTouchPoints" in navigator && navigator.maxTouchPoints > 0,
  );

  useEffect(() => {
    const audio = new Audio("/Shape%20of%20You%20-%20Ed%20Sheeran.m4a");
    audio.preload = "auto";
    audioRef.current = audio;

    const onTimeUpdate = () => {
      if (!isSeeking) setCurrentTime(audio.currentTime * 1000);
    };
    const onDurationChange = () => setDuration(audio.duration * 1000);
    const onEnded = () => setPlaying(false);
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);

    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("durationchange", onDurationChange);
    audio.addEventListener("ended", onEnded);
    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);

    return () => {
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("durationchange", onDurationChange);
      audio.removeEventListener("ended", onEnded);
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
      audio.pause();
      audio.src = "";
    };
  }, [isSeeking]);

  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      if (audio.ended) {
        audio.currentTime = 0;
        setCurrentTime(0);
      }
      audio.play();
    } else {
      audio.pause();
    }
  }, []);

  const handleSeek = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const time = Number(e.target.value);
    setCurrentTime(time);
    if (audioRef.current) audioRef.current.currentTime = time / 1000;
  }, []);

  const handleLyricLineClick = useCallback((ev: LyricLineMouseEvent) => {
    const line = ev.line.getLine();
    const time = line?.startTime;
    if (time != null && audioRef.current) {
      audioRef.current.currentTime = time / 1000;
      setCurrentTime(time);
    }
  }, []);

  const formatTime = (ms: number) => {
    if (!ms) return "0:00";
    const s = Math.floor(ms / 1000);
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  return (
    <div className="relative h-screen w-screen bg-black overflow-hidden select-none">
      <BackgroundRender
        album="/album-art.jpg"
        playing={playing}
        hasLyric
        flowSpeed={isMobile ? 0.8 : 1.5}
        lowFreqVolume={0.6}
        renderScale={isMobile ? 0.15 : 0.5}
        fps={isMobile ? 10 : 30}
        staticMode={isMobile}
        className="absolute inset-0 z-0"
      />
      <div
        className="absolute inset-0 z-1"
        style={
          {
            "--amll-lp-color": "#ffffff",
            "--amll-lp-font-size": "max(3.5vh, 2vw, 14px)",
            "fontWeight": "700",
          } as React.CSSProperties
        }
      >
        <LyricPlayer
          lyricLines={lyrics}
          currentTime={currentTime}
          playing={playing}
          isSeeking={isSeeking}
          enableSpring
          enableBlur
          enableScale
          wordFadeWidth={0.5}
          alignAnchor="center"
          alignPosition={0.35}
          onLyricLineClick={handleLyricLineClick}
          className="xl:w-[50%] lg:w-[60%] md:w-[70%] w-full h-[90%]"
        />
      </div>
      <div className="absolute bottom-0 left-0 right-0 z-10 flex flex-col">
        <div className="px-6 pb-1 text-xs text-white/40">
          Ed Sheeran &middot; Shape of You
        </div>
        <div className="flex items-center gap-4 px-6 py-3 bg-linear-to-t from-black/80 to-transparent">
          <button
            onClick={togglePlay}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur transition-colors shrink-0 cursor-pointer"
          >
            {playing ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                <rect x="6" y="4" width="4" height="16" />
                <rect x="14" y="4" width="4" height="16" />
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                <polygon points="8,5 19,12 8,19" />
              </svg>
            )}
          </button>
          <span className="text-xs text-white/60 tabular-nums w-10 text-right">
            {formatTime(currentTime)}
          </span>
          <input
            type="range"
            min={0}
            max={duration || 230824}
            value={currentTime}
            onChange={handleSeek}
            onMouseDown={() => setIsSeeking(true)}
            onMouseUp={() => setIsSeeking(false)}
            onTouchStart={() => setIsSeeking(true)}
            onTouchEnd={() => setIsSeeking(false)}
            className="flex-1 h-0.5 accent-white cursor-pointer appearance-none bg-white/20 rounded-full [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-2.5 [&::-webkit-slider-thumb]:h-2.5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
          />
          <span className="text-xs text-white/60 tabular-nums w-10">
            {formatTime(duration || 230824)}
          </span>
        </div>
      </div>
    </div>
  );
}
