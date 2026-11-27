import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "@fontsource/caveat/500.css";
import "./globals.css";
import { SoundLayer } from "@/components/site/sound-layer";

export const metadata: Metadata = {
  title: "Vikranth Jagdish | Co-founder, HealthPilot",
  description: "Vikranth Jagdish, co-founder and head of product and tech at HealthPilot. Based in Chennai. Work, writing, videos and photos.",
  keywords: ["Vikranth Jagdish", "HealthPilot", "Co-founder", "Head of Product", "Healthcare", "Portfolio", "Chennai"],
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body suppressHydrationWarning>
        {children}
        <SoundLayer />
      </body>
    </html>
  );
}
