"use client";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

export default function AudioPlayer({ src }: { src: string }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  // Switch tracks when src changes
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.src = src;
    audio.currentTime = 0;
    if (playing) {
      audio.play().catch(() => {
        // Autoplay prevented by browser
        setPlaying(false);
      });
    }
  }, [src, playing]);

  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;

    const onEnd = () => setPlaying(false);
    const onTimeUpdate = () => setProgress(a.currentTime);
    const onLoadedMetadata = () => setDuration(a.duration);

    a.addEventListener("ended", onEnd);
    a.addEventListener("timeupdate", onTimeUpdate);
    a.addEventListener("loadedmetadata", onLoadedMetadata);

    return () => {
      a.removeEventListener("ended", onEnd);
      a.removeEventListener("timeupdate", onTimeUpdate);
      a.removeEventListener("loadedmetadata", onLoadedMetadata);
    };
  }, []);

  const togglePlay = () => {
    const a = audioRef.current!;
    if (playing) {
      a.pause();
      setPlaying(false);
    } else {
      a.play()
        .then(() => {
          setPlaying(true);
        })
        .catch((error) => {
          console.error('Playback error:', error);
          setPlaying(false);
          alert('Unable to play audio. Please try another track.');
        });
    }
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed bottom-4 left-4 z-40 bg-black/50 backdrop-blur-sm p-4 rounded-lg border border-white/10 w-80"
    >
      <audio ref={audioRef} loop preload="metadata" />

      {/* Play Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={togglePlay}
        className="w-full mb-3 px-4 py-3 rounded bg-blue-500/30 text-blue-300 hover:bg-blue-500/50 transition-colors font-semibold flex items-center justify-center gap-2"
      >
        {playing ? "⏸ Pause" : "▶ Play"}
      </motion.button>

      {/* Progress Bar */}
      <div className="flex items-center gap-2 text-xs text-opacity-60 mb-2">
        <span>{formatTime(progress)}</span>
        <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-blue-500"
            animate={{ width: duration ? `${(progress / duration) * 100}%` : "0%" }}
            transition={{ type: "tween", duration: 0.1 }}
          />
        </div>
        <span>{formatTime(duration)}</span>
      </div>

      {/* Volume Control */}
      <input
        type="range"
        min="0"
        max="100"
        defaultValue="70"
        onChange={(e) => {
          if (audioRef.current) {
            audioRef.current.volume = parseInt(e.target.value) / 100;
          }
        }}
        className="w-full h-1 bg-white/10 rounded-full appearance-none cursor-pointer accent-blue-500"
      />
    </motion.div>
  );
}
