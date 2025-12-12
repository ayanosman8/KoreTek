"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function MyEstimatesRedirect() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to dashboard (where blueprints are now managed)
    router.replace("/dashboard");
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-white/60">Redirecting to Dashboard...</p>
      </div>
    </div>
  );
}
