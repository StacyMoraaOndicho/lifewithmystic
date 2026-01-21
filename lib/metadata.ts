import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "lifewithmystic | Sacred Philosophical Writings",
  description: "Deep, contemplative essays on philosophy, spirituality, and mysticism. Explore the intersection of consciousness, technology, and the sacred.",
  keywords: ["philosophy", "spirituality", "mysticism", "consciousness", "essays"],
  authors: [{ name: "lifewithmystic" }],
  creator: "lifewithmystic",
  
  // Open Graph
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://lifewithmystic.com", // Replace with actual domain
    title: "lifewithmystic | Sacred Philosophical Writings",
    description: "Deep, contemplative essays on philosophy, spirituality, and mysticism.",
    siteName: "lifewithmystic",
    images: [
      {
        url: "https://lifewithmystic.com/og-image.jpg", // Add OG image to /public
        width: 1200,
        height: 630,
        alt: "lifewithmystic - Sacred Digital Space",
        type: "image/jpeg",
      },
    ],
  },

  // Twitter Card
  twitter: {
    card: "summary_large_image",
    title: "lifewithmystic | Sacred Philosophical Writings",
    description: "Deep, contemplative essays on philosophy, spirituality, and mysticism.",
    images: ["https://lifewithmystic.com/og-image.jpg"], // Replace with actual domain
    creator: "@lifewithmystic", // Replace with actual Twitter handle
  },

  // Favicon
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },

  // Robots
  robots: {
    index: true,
    follow: true,
    "max-image-preview": "large",
    "max-snippet": -1 as any,
    "max-video-preview": -1 as any,
  },

  // Verification codes (optional)
  // verification: {
  //   google: "google-site-verification-code",
  // },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};
