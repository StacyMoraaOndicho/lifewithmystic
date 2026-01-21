"use client";
import { ThemeProvider } from "next-themes";
import ThemeEngine from "./ThemeEngine";
import SensoryMount from "./SensoryMount";

export default function ClientThemeProvider({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <ThemeProvider attribute="data-theme" defaultTheme="zen">
      <ThemeEngine />
      <SensoryMount>{children}</SensoryMount>
    </ThemeProvider>
  );
}
