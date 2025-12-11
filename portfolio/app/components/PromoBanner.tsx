"use client";

import { Zap } from "lucide-react";

export default function PromoBanner() {
  return (
    <div className="pt-28 pb-12 px-4 relative">
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="mb-0">
          <div className="relative group">
            {/* Glowing border effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-500 rounded-3xl blur-lg opacity-50 group-hover:opacity-75 transition duration-1000 animate-pulse"></div>

            {/* Banner content */}
            <div className="relative bg-gradient-to-r from-blue-500/20 via-cyan-500/20 to-blue-500/20 backdrop-blur-xl rounded-3xl border-2 border-blue-400/50 p-8 md:p-12 overflow-hidden">
              {/* Animated background effects */}
              <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
                <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
              </div>

              <div className="relative text-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/30 backdrop-blur-sm rounded-full border border-blue-400/40 mb-4 shadow-lg shadow-blue-500/20">
                  <Zap className="w-4 h-4 text-cyan-300 animate-pulse" />
                  <span className="text-xs font-bold text-white tracking-wider uppercase">Limited Time Offer</span>
                </div>

                <h3 className="text-3xl md:text-5xl font-extralight text-white mb-4 leading-tight">
                  <span className="bg-gradient-to-r from-blue-200 via-cyan-200 to-blue-200 bg-clip-text text-transparent">
                    Launch Special
                  </span>
                  {" "}— December & January Only
                </h3>

                <p className="text-lg md:text-xl text-white/80 font-light max-w-3xl mx-auto leading-relaxed">
                  Get premium development services at exclusive startup rates—
                  <span className="text-cyan-300 font-medium"> 50% off standard pricing.</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
