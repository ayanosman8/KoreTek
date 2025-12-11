import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Spark | AI-Powered Project Estimator by KoreLnx",
  description: "Get instant AI-powered project estimates with pricing, timeline, and tech stack recommendations. Free, no commitment required.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-gradient-to-br from-black via-gray-900 to-black min-h-screen">
        {children}
      </body>
    </html>
  );
}
