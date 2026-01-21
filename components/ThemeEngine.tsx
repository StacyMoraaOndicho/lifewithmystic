"use client";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function ThemeEngine() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const current = theme ?? "zen";

  return (
    <div className="fixed top-4 right-4 z-40">
      <div className="flex items-center gap-2 bg-white/5 backdrop-blur-sm p-2 rounded">
        <button
          onClick={() => setTheme("zen")}
          aria-pressed={current === "zen"}
          className={`px-3 py-1 rounded ${current === "zen" ? "font-semibold underline" : "opacity-80"}`}
        >
          Zen
        </button>
        <button
          onClick={() => setTheme("academia")}
          aria-pressed={current === "academia"}
          className={`px-3 py-1 rounded ${current === "academia" ? "font-semibold underline" : "opacity-80"}`}
        >
          Academia
        </button>
      </div>
    </div>
  );
}
