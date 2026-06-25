"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { audioData } from "@/data/content";
import AnimatedBlobs, { defaultPalettes } from "@/components/AnimatedBlobs";
import Scroll3DWrapper from "@/components/Scroll3DWrapper";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const RADIAL_BARS = 32;

function useAudioVisualizer(isPlaying: boolean, barCount: number) {
  const [amplitudes, setAmplitudes] = useState<number[]>(() =>
    Array.from({ length: barCount }, () => 0.15)
  );
  const rafRef = useRef<number>(0);
  const timeRef = useRef(0);
  const targetsRef = useRef<number[]>(Array.from({ length: barCount }, () => 0.15));
  const currentRef = useRef<number[]>(Array.from({ length: barCount }, () => 0.15));

  useEffect(() => {
    if (!isPlaying) {
      const decay = () => {
        let allIdle = true;
        const next = currentRef.current.map((v, i) => {
          const target = 0.08 + Math.sin(Date.now() * 0.001 + i * 0.5) * 0.04;
          const diff = target - v;
          if (Math.abs(diff) > 0.005) allIdle = false;
          return v + diff * 0.06;
        });
        currentRef.current = next;
        setAmplitudes([...next]);
        if (!allIdle) rafRef.current = requestAnimationFrame(decay);
      };
      rafRef.current = requestAnimationFrame(decay);
      return () => cancelAnimationFrame(rafRef.current);
    }

    const generateTargets = () => {
      timeRef.current += 0.016;
      const t = timeRef.current;
      return Array.from({ length: barCount }, (_, i) => {
        const norm = i / barCount;
        const bass = Math.max(0, 1 - norm * 2.5) * (0.5 + 0.3 * Math.sin(t * 2.1 + i));
        const mid = Math.exp(-Math.pow((norm - 0.35) * 4, 2)) * (0.4 + 0.35 * Math.sin(t * 3.7 + i * 0.3));
        const high = Math.max(0, norm - 0.5) * 2 * (0.2 + 0.2 * Math.sin(t * 5.3 + i * 0.7));
        const spike = Math.random() > 0.92 ? Math.random() * 0.3 : 0;
        return Math.min(1, Math.max(0.05, bass + mid + high + spike));
      });
    };

    const animate = () => {
      targetsRef.current = generateTargets();
      const next = currentRef.current.map((v, i) => {
        const target = targetsRef.current[i];
        return v + (target - v) * 0.18;
      });
      currentRef.current = next;
      setAmplitudes([...next]);
      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [isPlaying, barCount]);

  return amplitudes;
}

function formatTime(sec: number) {
  if (!sec || !isFinite(sec)) return "0:00";
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function AudioHub() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(80);
  const [isMuted, setIsMuted] = useState(false);
  const [played, setPlayed] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const playerRef = useRef<YT.Player | null>(null);
  const { ref, isVisible } = useScrollReveal({ threshold: 0.1 });
  const prefersReduced = useReducedMotion();
  const amplitudes = useAudioVisualizer(isPlaying, RADIAL_BARS);
  const pollRef = useRef<NodeJS.Timeout | null>(null);

  // Load YouTube IFrame API
  useEffect(() => {
    if (typeof window === "undefined") return;

    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    const firstScriptTag = document.getElementsByTagName("script")[0];
    firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

    window.onYouTubeIframeAPIReady = () => {
      new YT.Player("yt-audio-player", {
        videoId: audioData.youtubeId,
        playerVars: {
          autoplay: 0,
          controls: 0,
          disablekb: 1,
          fs: 0,
          iv_load_policy: 3,
          modestbranding: 1,
          rel: 0,
          showinfo: 0,
          origin: window.location.origin,
        },
        events: {
          onReady: (e: YT.PlayerEvent) => {
            playerRef.current = e.target;
            setDuration(e.target.getDuration());
          },
          onStateChange: (e: YT.OnStateChangeEvent) => {
            if (e.data === YT.PlayerState.ENDED) {
              setIsPlaying(false);
              setPlayed(0);
            }
          },
        },
      });
    };

    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, []);

  // Poll current time when playing
  useEffect(() => {
    if (isPlaying && playerRef.current) {
      pollRef.current = setInterval(() => {
        const player = playerRef.current;
        if (player) {
          setPlayed(player.getCurrentTime());
          setDuration(player.getDuration());
        }
      }, 250);
    } else if (pollRef.current) {
      clearInterval(pollRef.current);
    }
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [isPlaying]);

  const togglePlay = useCallback(() => {
    const player = playerRef.current;
    if (!player) return;

    if (isPlaying) {
      player.pauseVideo();
      setIsPlaying(false);
    } else {
      player.playVideo();
      setIsPlaying(true);
    }
  }, [isPlaying]);

  const handleSeek = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const player = playerRef.current;
      if (!player || !duration) return;
      const rect = e.currentTarget.getBoundingClientRect();
      const fraction = (e.clientX - rect.left) / rect.width;
      player.seekTo(fraction * duration, true);
      setPlayed(fraction * duration);
    },
    [duration]
  );

  const skip = useCallback(
    (seconds: number) => {
      const player = playerRef.current;
      if (!player || !duration) return;
      const current = player.getCurrentTime();
      player.seekTo(Math.max(0, Math.min(duration, current + seconds)), true);
    },
    [duration]
  );

  const handleVolumeChange = useCallback((val: number) => {
    setVolume(val);
    if (playerRef.current) {
      playerRef.current.setVolume(val);
    }
    if (val > 0) setIsMuted(false);
  }, []);

  const toggleMute = useCallback(() => {
    const player = playerRef.current;
    if (!player) return;
    if (isMuted) {
      player.unMute();
      setIsMuted(false);
      setVolume(player.getVolume());
    } else {
      player.mute();
      setIsMuted(true);
    }
  }, [isMuted]);

  const handleSpeedChange = useCallback((speed: number) => {
    setPlaybackRate(speed);
    if (playerRef.current) {
      playerRef.current.setPlaybackRate(speed);
    }
    setShowSpeedMenu(false);
  }, []);

  const speeds = [0.5, 0.75, 1, 1.25, 1.5, 2];
  const progressFraction = duration > 0 ? played / duration : 0;

  return (
    <section id="audio" className="bg-mesh-sage animate-gradient-rotate bg-ink py-20 md:py-32 relative overflow-hidden">
      <AnimatedBlobs colors={defaultPalettes.dark} count={4} />
      <Scroll3DWrapper className="max-w-5xl mx-auto px-6 md:px-12 lg:px-20 relative z-10">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-10"
        >
          <motion.span
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isVisible ? { opacity: 1, scale: 1 } : {}}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sage/15 border border-sage/30 text-sage-light text-xs font-medium mb-4"
          >
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55C7.79 13 6 14.79 6 17s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
            </svg>
            Liputan6 — Berita &amp; Fakta
          </motion.span>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-cream mb-4 text-glow">
            {audioData.title}
          </h2>
          <p className="text-cream/80 text-lg max-w-3xl mx-auto">
            {audioData.description}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="cs-glass cs-glass-strong cs-glass-rounded-3xl p-6 md:p-10 backdrop-glow"
        >
          {/* Hidden YouTube player */}
          <div className="absolute opacity-0 pointer-events-none" style={{ width: 1, height: 1 }}>
            <div id="yt-audio-player" />
          </div>

          {/* Top section */}
          <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8 mb-6">
            {/* Album art */}
            <div className="relative w-36 h-36 md:w-44 md:h-44 flex-shrink-0">
              <motion.div
                className="absolute inset-0 rounded-2xl overflow-hidden shadow-xl"
                animate={isPlaying ? { scale: [1, 1.02] } : {}}
                transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
              >
                <Image
                  src={`https://img.youtube.com/vi/${audioData.youtubeId}/mqdefault.jpg`}
                  alt={audioData.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/40 to-transparent" />
              </motion.div>
              {isPlaying && (
                <motion.div
                  className="absolute -inset-2 rounded-2xl border-2 border-sage-light/25"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                />
              )}
              {isPlaying && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute bottom-3 left-3 flex gap-0.5"
                >
                  {[...Array(3)].map((_, i) => (
                    <motion.span
                      key={i}
                      animate={{ height: [4, 16, 6, 4] }}
                      transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                      className="w-1.5 bg-sage-light rounded-full"
                    />
                  ))}
                </motion.div>
              )}
            </div>

            {/* Info + controls */}
            <div className="flex-1 text-center md:text-left">
              <p className="text-cream font-semibold text-lg mb-1">{audioData.title}</p>
              <p className="text-cream/70 text-sm mb-3">{audioData.source}</p>

              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 text-xs text-cream/70 mb-4">
                <span className="inline-flex items-center gap-1">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
                  </svg>
                  {audioData.episodeMeta.duration}
                </span>
                <span className="text-cream/40">|</span>
                <span>{audioData.episodeMeta.date}</span>
                <span className="text-cream/40">|</span>
                <span>{audioData.episodeMeta.category}</span>
              </div>

              {/* Controls */}
              <div className="flex items-center justify-center md:justify-start gap-3">
                <button
                  onClick={() => skip(-10)}
                  className="text-cream/60 hover:text-cream transition-colors cursor-pointer"
                  aria-label="Skip back 10 seconds"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12.663 18.673A8.997 8.997 0 0012 18a9 9 0 100-18c-1.17 0-2.3.203-3.337.547M15 12H9m3-3v6" />
                  </svg>
                </button>

                <motion.button
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.92 }}
                  onClick={togglePlay}
                  className="relative w-14 h-14 flex-shrink-0 cursor-pointer"
                  aria-label={isPlaying ? "Jeda audio" : "Putar audio"}
                >
                  <motion.div
                    className="absolute inset-0 rounded-full bg-sage-light/20"
                    animate={isPlaying ? { scale: [1, 1.4], opacity: [0.3, 0] } : {}}
                    transition={{ duration: 1, repeat: Infinity, repeatType: "reverse" }}
                  />
                  <div className="relative w-full h-full bg-sage rounded-full flex items-center justify-center shadow-lg">
                    {isPlaying ? (
                      <svg className="w-6 h-6 text-cream" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                      </svg>
                    ) : (
                      <svg className="w-6 h-6 text-cream ml-1" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    )}
                  </div>
                </motion.button>

                <button
                  onClick={() => skip(10)}
                  className="text-cream/60 hover:text-cream transition-colors cursor-pointer"
                  aria-label="Skip forward 10 seconds"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.337 18.673A8.997 8.997 0 0012 18a9 9 0 100-18c1.17 0 2.3.203 3.337.547M9 12h6m-3-3v6" />
                  </svg>
                </button>

                {/* Volume */}
                <div className="flex items-center gap-2 group/vol ml-2">
                  <button
                    onClick={toggleMute}
                    className="text-cream/60 hover:text-cream transition-colors cursor-pointer"
                    aria-label={isMuted ? "Unmute" : "Mute"}
                  >
                    {isMuted || volume === 0 ? (
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" /></svg>
                    ) : (
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z" /></svg>
                    )}
                  </button>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    step={5}
                    value={isMuted ? 0 : volume}
                    onChange={(e) => handleVolumeChange(parseInt(e.target.value))}
                    className="w-16 h-1 accent-sage-light appearance-none bg-white/20 rounded-full cursor-pointer opacity-0 group-hover/vol:opacity-100 transition-opacity"
                    aria-label="Volume"
                  />
                </div>

                {/* Speed */}
                <div className="relative ml-1">
                  <button
                    onClick={() => setShowSpeedMenu(!showSpeedMenu)}
                    className="px-2 py-1 text-xs text-cream/60 hover:text-cream border border-cream/20 hover:border-cream/40 rounded transition-colors cursor-pointer font-mono"
                    aria-label="Playback speed"
                  >
                    {playbackRate}x
                  </button>
                  {showSpeedMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: 4, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      className="absolute bottom-full mb-2 left-0 bg-ink/95 backdrop-blur-xl border border-sage/20 rounded-lg p-1 z-20 shadow-xl"
                    >
                      {speeds.map((s) => (
                        <button
                          key={s}
                          onClick={() => handleSpeedChange(s)}
                          className={`block w-full text-left px-3 py-1.5 text-xs rounded transition-colors cursor-pointer ${
                            playbackRate === s
                              ? "text-sage-light bg-sage/15"
                              : "text-cream/70 hover:text-cream hover:bg-white/5"
                          }`}
                        >
                          {s}x
                        </button>
                      ))}
                    </motion.div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Progress bar */}
          <div className="mb-6">
            <div
              className="w-full h-1.5 bg-white/10 rounded-full cursor-pointer group/prog hover:h-2 transition-all"
              onClick={handleSeek}
              role="slider"
              aria-label="Audio progress"
              aria-valuenow={Math.round(progressFraction * 100)}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              <motion.div
                className="h-full bg-gradient-to-r from-sage to-sage-light rounded-full relative"
                style={{ width: `${progressFraction * 100}%` }}
              >
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-cream rounded-full shadow-lg opacity-0 group-hover/prog:opacity-100 transition-opacity" />
              </motion.div>
            </div>
            <div className="flex justify-between mt-1.5 text-[11px] text-cream/55 font-mono">
              <span>{formatTime(played)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Visualizer */}
          {!prefersReduced && (
            <div className="relative flex items-center justify-center h-40 mb-6">
              {amplitudes.map((amp, i) => {
                const angle = (i / RADIAL_BARS) * 360 - 90;
                const radians = (angle * Math.PI) / 180;
                const innerRadius = 44;
                const maxBarHeight = 36;
                const barHeight = Math.max(3, amp * maxBarHeight);
                const x = 50 + innerRadius * Math.cos(radians);
                const y = 50 + innerRadius * Math.sin(radians);

                const norm = i / RADIAL_BARS;
                const r = Math.round(61 + norm * 95);
                const g = Math.round(90 + norm * 94);
                const b = Math.round(80 + norm * 92);
                const alpha = 0.3 + amp * 0.6;

                return (
                  <div
                    key={i}
                    className="absolute rounded-full"
                    style={{
                      left: `${x}%`,
                      top: `${y}%`,
                      width: "3px",
                      height: `${barHeight}px`,
                      backgroundColor: `rgba(${r},${g},${b},${alpha})`,
                      transform: `translate(-50%, -50%) rotate(${angle}deg)`,
                      transformOrigin: "center center",
                      transition: "height 0.05s ease",
                    }}
                  />
                );
              })}
              <motion.div
                className="w-20 h-20 rounded-full bg-ink border-2 border-sage/25 flex items-center justify-center z-10 shadow-lg"
                animate={isPlaying ? { scale: [1, 1.05] } : {}}
                transition={{ duration: 1, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
              >
                <svg className="w-7 h-7 text-sage" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55C7.79 13 6 14.79 6 17s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
                </svg>
              </motion.div>
            </div>
          )}

          {/* Highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {audioData.highlights.map((highlight, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={isVisible ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.4, delay: 0.4 + index * 0.1, ease: [0.21, 1.02, 0.73, 1] }}
                className="flex items-start gap-2"
              >
                <motion.span
                  className="text-sage-light mt-0.5 flex-shrink-0"
                  whileHover={{ scale: 1.2, rotate: 10 }}
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </motion.span>
                <span className="text-sm text-cream/80">{highlight}</span>
              </motion.div>
            ))}
          </div>

          <a
            href={audioData.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-sage-light hover:text-sage transition-colors mt-4"
          >
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 19H5V5h7V3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z" />
            </svg>
            Tonton di YouTube
          </a>
        </motion.div>
      </Scroll3DWrapper>
    </section>
  );
}
