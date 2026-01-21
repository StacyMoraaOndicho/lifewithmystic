import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ClientThemeProvider from "../components/ClientThemeProvider";
import Nav from "../components/Nav";
import { ImmersiveModeProvider } from "@/lib/immersive-context";
import { ReadingProgressBar } from "@/app/components/ReadingProgressBar";
import { metadata } from "@/lib/metadata";
import { Analytics } from "@/app/components/Analytics";
import { AuthProvider } from "@/lib/auth-context";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export { metadata };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <Analytics />
          <ReadingProgressBar />
          <ImmersiveModeProvider>
            <header>
              <Nav />
            </header>
            <ClientThemeProvider>
              {/* sensory layer + motion container are client components */}
              <div>
                {/* Particles background */}
                <div id="sensory-root" />
              </div>
              {children}
            </ClientThemeProvider>
          </ImmersiveModeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
