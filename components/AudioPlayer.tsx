"use client";
import { useEffect, useRef, useState } from "react";

export default function AudioPlayer({ src }: { src: string }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    const onEnd = () => setPlaying(false);
    a.addEventListener('ended', onEnd);
    return () => a.removeEventListener('ended', onEnd);
  }, []);

  return (
    <div className="fixed bottom-4 left-4 z-40 flex items-center gap-2 bg-black/30 p-2 rounded">
      <audio ref={audioRef} src={src} loop />
      <button
        onClick={() => {
          const a = audioRef.current!;
          if (playing) {
            a.pause();
            setPlaying(false);
          } else {
            a.play();
            setPlaying(true);
          }
        }}
        aria-pressed={playing}
        className="px-3 py-1 rounded bg-white/5"
      >
        {playing ? 'Pause' : 'Play'}
      </button>
    </div>
  );
}
