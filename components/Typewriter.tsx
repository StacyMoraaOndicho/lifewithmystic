"use client";
import { useEffect, useState } from "react";

export default function Typewriter({ text = "" , speed = 60 }: { text?: string; speed?: number }) {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    setIndex(0);
    if (!text) return;
    const id = setInterval(() => setIndex((i) => Math.min(i + 1, text.length)), speed);
    return () => clearInterval(id);
  }, [text, speed]);

  return <span aria-label={text}>{text.slice(0, index)}</span>;
}
