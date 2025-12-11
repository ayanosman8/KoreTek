import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Spark | AI-Powered Project Blueprints by KoreLnx",
  description: "Get instant AI-powered project blueprints with features, tech stack recommendations, and next steps. Free, no commitment required.",
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
