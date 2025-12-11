"use client";

import dynamic from "next/dynamic";

// Disable SSR for Projects component to avoid localStorage issues
const Projects = dynamic(() => import("./Projects"), {
  ssr: false,
  loading: () => <div className="bg-gradient-to-br from-slate-950 to-slate-800 py-12 px-4 md:py-16" />,
});

export default Projects;
