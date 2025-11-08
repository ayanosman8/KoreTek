"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Play, ArrowRight } from "lucide-react";

export default function Hero() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const text =
    "Modern Solutions. Cutting-Edge Design. Unmatched Efficiency.";

  // Split the text into words
  const words = text.split(" ");

  // Define gradient for the highlighted text on a dark background
  const colorfulGradientClasses =
    "bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-blue-300 to-blue-400";

  return (
    <section ref={containerRef} className="pt-28 pb-20 w-full min-h-screen flex items-center relative overflow-hidden bg-gradient-to-br from-black via-gray-900 to-black">
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
      <motion.div style={{ y, opacity }} className="max-w-4xl mx-auto text-center space-y-8 relative z-10">
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
                delayChildren: 0.3,
              },
            },
          }}
          className="space-y-2"
        >
          <motion.h1 className="text-4xl md:text-6xl lg:text-7xl font-extralight leading-tight text-center tracking-tight">
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
              </motion.span>
            ))}
          </motion.h1>
        </motion.div>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="text-xl md:text-2xl text-white/70 max-w-3xl mx-auto leading-relaxed font-light"
        >
          Transforming ideas into powerful digital solutions with cutting-edge
          technology and innovative design
        </motion.p>

        {/* Trust Indicators */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.4 }}
          className="flex flex-wrap justify-center gap-8 pt-4"
        >
          <motion.div
            whileHover={{ scale: 1.1 }}
            className="text-center"
          >
            <div className="text-2xl md:text-3xl font-extralight text-blue-500">
              24/7
            </div>
            <div className="text-sm text-white/60 font-light uppercase tracking-wider">Support</div>
          </motion.div>
          <div className="w-px h-12 bg-white/10"></div>
          <motion.div
            whileHover={{ scale: 1.1 }}
            className="text-center"
          >
            <div className="text-2xl md:text-3xl font-extralight text-blue-500">
              100%
            </div>
            <div className="text-sm text-white/60 font-light uppercase tracking-wider">Dedicated</div>
          </motion.div>
          <div className="w-px h-12 bg-white/10"></div>
          <motion.div
            whileHover={{ scale: 1.1 }}
            className="text-center"
          >
            <div className="text-2xl md:text-3xl font-extralight text-blue-500">
              Fast
            </div>
            <div className="text-sm text-white/60 font-light uppercase tracking-wider">Delivery</div>
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 2 }}
          className="flex justify-center pt-12"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-6 h-10 border-2 border-white/20 rounded-full flex justify-center p-1"
          >
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-1.5 h-1.5 bg-blue-500 rounded-full"
            ></motion.div>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}
