import type { Metadata } from "next";
import "@fontsource/space-mono/400.css";
import "@fontsource/space-mono/700.css";
import "./globals.css";

import { DitheringShader } from "@/components/ui/dithering-shader";

export const metadata: Metadata = {
  title: "Vikranth Jagdish | Co-founder, HealthPilot.ai",
  description: "Vikranth Jagdish, co-founder and head of product & tech at HealthPilot.ai. Built the team from 0 to 15, iterated to product-market fit and closed two large hospitals. Based in Chennai.",
  keywords: ["Vikranth Jagdish", "HealthPilot", "Co-founder", "Head of Product", "Healthcare AI", "Portfolio", "Chennai", "Next.js"],
  icons: {
    icon: [
      { url: "/icon.png", sizes: "32x32", type: "image/png" },
      { url: "/icon.png", sizes: "192x192", type: "image/png" },
      { url: "/icon.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
};

import { GlobalSpotifyCard } from "@/components/global-spotify-card";
import { BootSequence } from "@/components/motion/boot-sequence";
import { CustomCursor } from "@/components/motion/custom-cursor";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        suppressHydrationWarning
        className="antialiased bg-black text-white"
        style={{ fontFamily: "'Space Mono', monospace" }}
      >
        <div className="fixed inset-0 pointer-events-none -z-10 opacity-40">
          <DitheringShader
            shape="swirl"
            type="4x4"
            colorBack="#050505"
            colorFront="#4a4200"
            pxSize={4}
            speed={0.2}
            className="w-full h-full"
          />
        </div>
        {children}
        <GlobalSpotifyCard />
        <BootSequence />
        <CustomCursor />
      </body>
    </html>
  );
}
