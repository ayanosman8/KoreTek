"use client";

import React from "react";

export default function ClientLogos() {
  const clients = [
    "TechRetail Inc.",
    "DataFlow Analytics",
    "FitLife App",
    "AutomateHub",
    "CloudScale Systems",
    "NexGen Solutions",
  ];

  return (
    <div className="bg-gradient-to-br from-black via-gray-900 to-black py-16 px-4 md:py-24 relative overflow-hidden border-y border-white/5">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/3 via-transparent to-blue-500/3"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-sm font-medium text-white/40 uppercase tracking-widest mb-8">
            Trusted by Industry Leaders
          </p>
        </div>

        {/* Logos Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
          {clients.map((client, index) => (
            <div
              key={index}
              className="group relative flex items-center justify-center p-6 rounded-2xl border border-white/5 hover:border-blue-500/20 transition-all duration-500 bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-sm"
            >
              {/* Client name as placeholder for logo */}
              <div className="text-center">
                <div className="text-white/40 group-hover:text-white/60 transition-colors duration-300 font-light text-sm">
                  {client}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20 pt-16 border-t border-white/5">
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-extralight text-blue-500 mb-2">50+</div>
            <div className="text-sm text-white/60 font-light uppercase tracking-wider">Projects Completed</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-extralight text-blue-500 mb-2">30+</div>
            <div className="text-sm text-white/60 font-light uppercase tracking-wider">Happy Clients</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-extralight text-blue-500 mb-2">98%</div>
            <div className="text-sm text-white/60 font-light uppercase tracking-wider">Satisfaction Rate</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-extralight text-blue-500 mb-2">5+</div>
            <div className="text-sm text-white/60 font-light uppercase tracking-wider">Years Experience</div>
          </div>
        </div>
      </div>
    </div>
  );
}
