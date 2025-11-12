"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export default function Hero() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const text =
    "Modern Solutions. Cutting-Edge Design. Unmatched Efficiency.";

  // Split the text into words
  const words = text.split(" ");

  // Define gradient for the highlighted text on a dark background
  const colorfulGradientClasses =
    "bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-blue-300 to-blue-400";

  return (
    <section ref={containerRef} className="pt-20 pb-20 w-full min-h-screen flex items-center relative overflow-hidden">
      {/* Background Effects - darker with blue accent */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/3 via-transparent to-blue-500/3"></div>
      <motion.div
        style={{ y: useTransform(scrollYProgress, [0, 1], [0, -50]) }}
        className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"
      ></motion.div>
      <motion.div
        style={{ y: useTransform(scrollYProgress, [0, 1], [0, 50]) }}
        className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"
      ></motion.div>
      <div className="max-w-4xl mx-auto text-center space-y-8 relative z-10">
        {/* Main heading */}
        <div className="space-y-2">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extralight leading-tight text-center tracking-tight">
            {words.map((word, index) => (
              <span
                key={index}
                className={`inline-block ${
                  word === "Modern" ||
                  word === "Solutions." ||
                  word === "Cutting-Edge" ||
                  word === "Design." ||
                  word === "Efficiency."
                    ? colorfulGradientClasses
                    : "text-white"
                }`}
              >
                {word}
                {index !== words.length - 1 && "\u00A0"}
              </span>
            ))}
          </h1>
        </div>

        {/* Subtitle */}
        <p className="text-xl md:text-2xl text-white/70 max-w-3xl mx-auto leading-relaxed font-light">
          Transforming ideas into powerful digital solutions with cutting-edge
          technology and innovative design
        </p>

        {/* Trust Indicators */}
        <div className="flex flex-wrap justify-center gap-8 pt-4">
          <div className="text-center">
            <div className="text-2xl md:text-3xl font-extralight text-blue-500">
              24/7
            </div>
            <div className="text-sm text-white/60 font-light uppercase tracking-wider">Support</div>
          </div>
          <div className="w-px h-12 bg-white/10"></div>
          <div className="text-center">
            <div className="text-2xl md:text-3xl font-extralight text-blue-500">
              100%
            </div>
            <div className="text-sm text-white/60 font-light uppercase tracking-wider">Dedicated</div>
          </div>
          <div className="w-px h-12 bg-white/10"></div>
          <div className="text-center">
            <div className="text-2xl md:text-3xl font-extralight text-blue-500">
              Fast
            </div>
            <div className="text-sm text-white/60 font-light uppercase tracking-wider">Delivery</div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="flex justify-center pt-12">
          <div className="w-6 h-10 border-2 border-white/20 rounded-full flex justify-center p-1">
            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
