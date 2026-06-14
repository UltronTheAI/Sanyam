import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://github.com/UltronTheAI/Sanyam/"),
  title: {
    default: "Sanyam",
    template: "%s | Sanyam",
  },
  description:
    "Sanyam is a funny Android self-discipline app for screen breaks, sleep mode, water reminders, app blocking, and safer browsing.",
  keywords: [
    "Sanyam",
    "Android app",
    "digital wellbeing",
    "self discipline",
    "screen time blocker",
    "water reminder",
    "Expo",
    "React Native",
    "UltronTheAI",
  ],
  authors: [{ name: "Swaraj Puppalwar", url: "https://github.com/UltronTheAI" }],
  creator: "Swaraj Puppalwar",
  publisher: "UltronTheAI",
  openGraph: {
    title: "Sanyam",
    description:
      "Beat the tiny rectangle goblin with breaks, sleep mode, water reminders, and safer browsing.",
    url: "https://github.com/UltronTheAI/Sanyam/",
    siteName: "Sanyam",
    images: [
      {
        url: "/smp.png",
        width: 1200,
        height: 630,
        alt: "Sanyam Android discipline app preview",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sanyam",
    description: "Android discipline app vs tiny rectangle goblin.",
    images: ["/smp.png"],
    creator: "@PuppalwarSwaraj",
  },
  alternates: {
    canonical: "https://github.com/UltronTheAI/Sanyam/",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#050608] text-zinc-100">{children}</body>
    </html>
  );
}
