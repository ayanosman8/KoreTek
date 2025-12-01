"use client";

import React from "react";
import { Linkedin, Twitter } from "lucide-react";

export default function Team() {
  const teamMembers = [
    {
      name: "Ayan Osman",
      role: "Chief Technology Officer",
      bio: "10+ years building scalable web and mobile applications. Expert in React, Node.js, and cloud architecture.",
      image: "/ayan2.JPEG",
      linkedin: "#",
      twitter: "#",
    },
    {
      name: "Hayat Kore",
      role: "Chief Executive Officer",
      bio: "10+ years of extensive experience across client success, analytics, account management, and sales with a focus on bringing a customer-centric approach to decision-making and driving business growth.",
      image: "/hayat2.JPEG",
      linkedin: "#",
      twitter: "#",
    },
    {
      name: "Sahra Osman",
      role: "Chief Operating Officer",
      bio: "Strategic and results-driven leader with a strong background in operations, logistics, and streamlining workflows to maximize efficiency.",
      image: "/sahra.JPG",
      linkedin: "#",
      twitter: "#",
    },
  ];

  return (
    <div className="bg-gradient-to-br from-black via-gray-900 to-black py-20 px-4 md:py-32 relative overflow-hidden">
      {/* Background effects - darker with blue accent */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/3 via-transparent to-blue-500/3"></div>
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-20">
          <div className="inline-block px-5 py-2.5 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 backdrop-blur-sm rounded-full border border-blue-400/30 mb-6 shadow-lg shadow-blue-500/10">
            <span className="text-sm font-semibold text-blue-300 tracking-wide uppercase">Our Team</span>
          </div>
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-extralight tracking-tight mb-6 text-white">
            Meet the Minds
          </h2>
          <p className="text-xl font-light max-w-3xl mx-auto text-white/60 leading-relaxed">
            A passionate team dedicated to building exceptional digital experiences.
          </p>
        </div>

        {/* Team Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {teamMembers.map((member, index) => (
            <div
              key={index}
              className="group relative rounded-3xl p-12 border backdrop-blur-xl overflow-hidden transition-all duration-500 bg-gradient-to-br from-gray-900 to-black border-white/10 hover:border-blue-500/40 shadow-2xl hover:shadow-blue-500/10"
            >
              {/* Profile Image */}
              <div className="flex flex-col items-center mb-8">
                <div className="relative mb-6">
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border-2 border-blue-500/30 flex items-center justify-center overflow-hidden">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {/* Online indicator */}
                  <div className="absolute bottom-2 right-2 w-4 h-4 bg-emerald-500 rounded-full border-2 border-gray-900"></div>
                </div>

                {/* Name & Role */}
                <h3 className="text-2xl font-extralight text-white mb-2 text-center">
                  {member.name}
                </h3>
                <p className="text-blue-400 text-sm font-medium uppercase tracking-wider mb-4">
                  {member.role}
                </p>
              </div>

              {/* Bio */}
              <p className="text-white/60 font-light leading-relaxed text-center mb-8">
                {member.bio}
              </p>

              {/* Social Links */}
              <div className="flex items-center justify-center gap-4">
                <a
                  href={member.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-xl bg-white/5 border border-white/10 hover:border-blue-500/40 hover:bg-blue-500/10 transition-all duration-300 text-white/60 hover:text-blue-400"
                >
                  <Linkedin className="w-5 h-5" />
                </a>
                <a
                  href={member.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-xl bg-white/5 border border-white/10 hover:border-blue-500/40 hover:bg-blue-500/10 transition-all duration-300 text-white/60 hover:text-blue-400"
                >
                  <Twitter className="w-5 h-5" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
