"use client";

import React from "react";
import { motion } from "framer-motion";

// Badge component placeholder - replace with your actual Badge component
function Badge() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 1.2 }}
      // Darker badge
      className="inline-block px-4 py-2 bg-gradient-to-r from-blue-400 to-cyan-400/80 rounded-full text-sm font-medium text-slate-900 shadow-lg"
    >
      Available for work
    </motion.div>
  );
}

export default function Hero() {
  const text =
    "I build Full Stack Applications. Slick Modern UI, made with only the best technologies.";

  // Split the text into words
  const words = text.split(" ");

  // Define a more colorful and visible gradient for the highlighted text on a dark background
  // Using lighter colors that pop against dark mode backgrounds
  const colorfulGradientClasses =
    "bg-clip-text text-transparent bg-gradient-to-r from-blue-300 via-cyan-200 to-blue-300";

  return (
    // Main background: Darker gradient
    <div className="min-h-screen bg-gradient-to-br from-slate-950 to-slate-800 flex items-center justify-center px-4">
      <div className="max-w-4xl mx-auto text-center space-y-8">
        {/* Main heading with word animation */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.08,
                delayChildren: 0.2,
              },
            },
          }}
          className="space-y-2"
        >
          <motion.h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight">
            {words.map((word, index) => (
              <motion.span
                key={index}
                variants={{
                  hidden: {
                    opacity: 0,
                    y: 20,
                    filter: "blur(4px)",
                  },
                  visible: {
                    opacity: 1,
                    y: 0,
                    filter: "blur(0px)",
                    transition: {
                      duration: 0.6,
                      ease: "easeOut",
                    },
                  },
                }}
                className={`inline-block ${
                  word === "Full" ||
                  word === "Stack" ||
                  word === "Applications."
                    ? colorfulGradientClasses // Use the new colorful gradient
                    : "text-white" // Default text color for other words changed to white
                }`}
              >
                {word}
                {index !== words.length - 1 && "\u00A0"}
              </motion.span>
            ))}
          </motion.h1>
        </motion.div>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.0 }}
          className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed" // Subtitle text darker
        >
          Crafting digital experiences with modern technologies and thoughtful
          design
        </motion.p>

        {/* Badge */}
        <Badge />

        {/* Subtle decorative element */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 1.4 }}
          className="flex justify-center pt-8"
        >
          {/* Decorative line color changed for dark mode */}
          <div className="w-24 h-1 bg-gradient-to-r from-transparent via-blue-400 to-transparent rounded-full"></div>
        </motion.div>
      </div>
    </div>
  );
}
