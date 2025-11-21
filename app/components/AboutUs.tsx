"use client";

import React from "react";
import { Target, Users, Zap, Shield } from "lucide-react";

export default function AboutUs() {
  const values = [
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Cutting-Edge Tech",
      description: "We leverage the latest technologies to build solutions that are fast, scalable, and future-proof.",
    },
    {
      icon: <Target className="w-8 h-8" />,
      title: "User-Centric Design",
      description: "Every product we build puts the end-user first, ensuring intuitive and delightful experiences.",
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Client Partnership",
      description: "We work closely with you from start to finish, ensuring a smooth, personalized experience.",
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Enterprise Quality",
      description: "We deliver enterprise-grade solutions that are reliable, secure, and built to scale.",
    },
  ];

  return (
    <div id="about" className="bg-gradient-to-br from-black via-gray-900 to-black py-20 px-4 md:py-32 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/3 via-transparent to-blue-500/3"></div>
      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/3 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>

      <div className="w-full px-8 lg:px-16 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-extralight tracking-tight mb-6 text-white">
            About Us
          </h2>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto mb-20">
          <div className="relative rounded-3xl p-8 md:p-12 border backdrop-blur-xl overflow-hidden bg-gradient-to-br from-gray-900 to-black border-white/10 shadow-2xl">
            <p className="text-lg md:text-xl font-light leading-relaxed text-white/80 mb-6">
              At <span className="text-blue-400 font-normal">KoreLnx</span>, we build tailored digital solutions by combining cutting-edge technology with bold design and practical functionality.
            </p>

            <p className="text-lg md:text-xl font-light leading-relaxed text-white/60 mb-6">
              In a world where complexity often overshadows simplicity, we craft enterprise-grade solutions that are intuitive, powerful, and designed with you in mind. Every product we build is a testament to our commitment to excellence and user-centric design.
            </p>

            <p className="text-lg md:text-xl font-light leading-relaxed text-white/60 mb-6">
              Beyond creating exceptional products, we pride ourselves on providing excellent customer service by working closely with each client to ensure a smooth, personalized experience from start to finish.
            </p>

            <p className="text-lg md:text-xl font-light leading-relaxed text-white/80">
              Our goal is to help businesses operate smarter, grow faster, and stand out with confidence&mdash;so you can focus on what matters most: <span className="text-blue-400">delivering exceptional value to your clients</span>.
            </p>
          </div>
        </div>

        {/* Values Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((value, index) => (
            <div
              key={index}
              className="group relative rounded-2xl p-8 border backdrop-blur-xl overflow-hidden transition-all duration-500 bg-gradient-to-br from-gray-900/50 to-black/50 border-white/10 hover:border-blue-500/40 shadow-xl hover:shadow-blue-500/10"
            >
              {/* Icon */}
              <div className="text-blue-500 mb-4">
                {value.icon}
              </div>

              {/* Content */}
              <h3 className="text-xl font-light mb-3 text-white">
                {value.title}
              </h3>

              <p className="text-sm font-light leading-relaxed text-white/50">
                {value.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
