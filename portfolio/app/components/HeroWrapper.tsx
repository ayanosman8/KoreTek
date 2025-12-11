"use client";

import dynamic from "next/dynamic";

// Disable SSR for Hero component to avoid localStorage issues
const Hero = dynamic(() => import("./Hero"), {
  ssr: false,
  loading: () => <div className="min-h-screen bg-gradient-to-br from-slate-950 to-slate-800" />,
});

export default Hero;
