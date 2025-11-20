// app/layout.tsx

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import FontAwesomeConfig from "./components/FontAwesomeConfig";
import { Toaster } from "sonner";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import StructuredData from "./components/StructuredData";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://korelnx.com'),
  title: {
    default: "KoreLnx - Modern Solutions | Web Development & Design",
    template: "%s | KoreLnx"
  },
  description: "KoreLnx delivers enterprise-scale web applications, stunning UI/UX design, and cross-platform mobile solutions. Transform your vision into reality with cutting-edge technology.",
  keywords: ["web development", "UI/UX design", "mobile apps", "React", "Next.js", "TypeScript", "enterprise solutions", "custom software"],
  authors: [{ name: "KoreLnx" }],
  creator: "KoreLnx",
  publisher: "KoreLnx",
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: [
      { url: '/apple-icon.svg', type: 'image/svg+xml' },
    ],
  },
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://korelnx.com",
    title: "KoreLnx - Modern Solutions | Web Development & Design",
    description: "Enterprise-scale web applications, stunning UI/UX design, and cross-platform mobile solutions. Your Vision.Engineered.",
    siteName: "KoreLnx",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "KoreLnx - Your Vision.Engineered.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "KoreLnx - Modern Solutions | Web Development & Design",
    description: "Enterprise-scale web applications, stunning UI/UX design, and cross-platform mobile solutions.",
    images: ["/og-image.png"],
    creator: "@KoreLnx",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    // Add your verification codes here when you set them up
    // google: 'your-google-verification-code',
    // yandex: 'your-yandex-verification-code',
    // bing: 'your-bing-verification-code',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <StructuredData />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black text-white`}
      >
        <FontAwesomeConfig />
        {children}
        <Toaster
          position="top-center"
          richColors
          theme="dark"
          toastOptions={{
            style: {
              background: 'rgba(17, 24, 39, 0.95)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(12px)',
            },
          }}
        />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}