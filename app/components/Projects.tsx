"use client";

import { TrendingUp, Users, Award, Rocket } from "lucide-react";
import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";

export default function Projects() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const y2 = useTransform(scrollYProgress, [0, 1], [-100, 100]);

  const stats = [
    { number: "Modern", label: "Tech Stack", icon: <Rocket className="w-6 h-6" /> },
    { number: "Agile", label: "Development", icon: <TrendingUp className="w-6 h-6" /> },
    { number: "24/7", label: "Support", icon: <Users className="w-6 h-6" /> },
    { number: "100%", label: "Commitment", icon: <Award className="w-6 h-6" /> },
  ];

  const caseStudies = [
    {
      client: "Healthcare Agency",
      projectName: "KoreCare Web Platform",
      category: "Healthcare SaaS",
      description: "Electronic Visit Verification (EVV) platform for healthcare agencies. Streamlines caregiver visit tracking, scheduling, and documentation with real-time compliance monitoring and intelligent analytics.",
      tech: ["Next.js 15", "PostgreSQL", "AI/ML"],
      results: ["Visit tracking", "99.9% uptime", "24/7 support"],
      type: "web",
      link: "https://korecare.app",
      mockupImage: "/web-shot.png",
    },
    {
      client: "Healthcare Agency",
      projectName: "KoreCare Mobile",
      category: "Healthcare Mobile App",
      description: "Native mobile companion for healthcare employees featuring GPS-verified clock-in/out, offline visit documentation, and real-time sync with the KoreCare Web platform. Streamlines field operations with intuitive EVV compliance.",
      tech: ["React Native", "Expo", "SQLite"],
      results: ["Clock in/out", "Call off", "Reporting"],
      type: "mobile",
      mockupImages: ["/mobile-shot.png", "/mobile-shot-2.png"],
      appStoreUrl: "https://apps.apple.com",
    },
    {
      client: "Food & Lifestyle",
      projectName: "eatelligence",
      category: "AI-Powered Food App",
      description: "AI-powered food management app with smart pantry tracking via barcode and receipt scanning, personalized recipe suggestions, budget tracking, and an AI assistant for meal planning—all tailored to your dietary preferences.",
      tech: ["React Native", "Expo", "Gemini AI", "Supabase"],
      results: ["Barcode scanning", "Budget tracking", "AI meal planning"],
      type: "mobile",
      mockupImages: ["/recipe-img.png", "/pantry-img.png", "/nutrition-img.png"],
      appStoreUrl: "https://apps.apple.com/us/app/eatelligence/id6755645485",
    },
  ];

  return (
    <div
      ref={containerRef}
      id="projects"
      className="bg-gradient-to-br from-black via-gray-900 to-black py-20 px-6 md:px-8 lg:px-4 md:py-32 relative overflow-hidden"
    >
      {/* Animated background decorative elements - darker with blue accent */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/3 via-transparent to-blue-500/3"></div>
      <motion.div
        style={{ y }}
        className="absolute top-20 left-10 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-3xl"
      ></motion.div>
      <motion.div
        style={{ y: y2 }}
        className="absolute bottom-20 right-10 w-[800px] h-[800px] bg-blue-500/10 rounded-full blur-3xl"
      ></motion.div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-32"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="relative group"
            >
              <div className="bg-gradient-to-br from-gray-900 to-black backdrop-blur-xl rounded-3xl p-8 border border-white/10 group-hover:border-blue-500/40 transition-all duration-500 text-center shadow-2xl">
                <div className="inline-flex p-4 rounded-xl text-blue-500 mb-4 group-hover:scale-110 transition-transform duration-300">
                  {stat.icon}
                </div>
                <div className="text-3xl md:text-4xl font-extralight text-blue-500 mb-2">
                  {stat.number}
                </div>
                <div className="text-sm text-white/60 font-light uppercase tracking-wider">
                  {stat.label}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Case Studies Section */}
        <div className="mb-20 text-center">
          <div>
            <div className="inline-block px-5 py-2.5 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 backdrop-blur-sm rounded-full border border-blue-400/30 mb-6 shadow-lg shadow-blue-500/10">
              <span className="text-sm font-semibold text-blue-300 tracking-wide uppercase">Featured Projects</span>
            </div>
            <h3 className="text-4xl md:text-6xl lg:text-7xl font-extralight text-white mb-6">
              Our Work
            </h3>
            <p className="text-xl text-white/60 max-w-3xl mx-auto leading-relaxed font-light">
              Explore how we&apos;ve transformed digital experiences with innovative solutions tailored to unique challenges.
            </p>
          </div>
        </div>

        {/* Case Study Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {caseStudies.map((study, index) => {
            return (
              <div
                key={index}
                className="group relative bg-gradient-to-br from-gray-900 to-black backdrop-blur-2xl rounded-3xl overflow-hidden border border-white/10 hover:border-blue-500/30 transition-all duration-500 shadow-2xl"
              >
                {/* Mockup Section */}
                <div className={`relative bg-gradient-to-br from-blue-500/10 to-cyan-500/5 border-b border-white/5 flex items-center justify-center overflow-hidden ${study.type === 'mobile' ? 'h-[500px] py-8' : 'h-80 p-8'}`}>
                  {study.type === 'mobile' ? (
                    /* Mobile Phone Mockup - Scrollable */
                    <div className="relative h-full w-full overflow-hidden">
                      <div className="flex gap-6 h-full items-center justify-start px-8 animate-scroll-mobile">
                        {study.mockupImages && study.mockupImages.length > 0 ? (
                          <>
                            {study.mockupImages.map((image, imgIndex) => (
                              <Image
                                key={imgIndex}
                                src={image}
                                alt={`${study.projectName} - Screen ${imgIndex + 1}`}
                                width={300}
                                height={600}
                                className="h-full w-auto object-contain shadow-2xl flex-shrink-0"
                              />
                            ))}
                            {/* Duplicate images for seamless loop */}
                            {study.mockupImages.map((image, imgIndex) => (
                              <Image
                                key={`dup-${imgIndex}`}
                                src={image}
                                alt={`${study.projectName} - Screen ${imgIndex + 1}`}
                                width={300}
                                height={600}
                                className="h-full w-auto object-contain shadow-2xl flex-shrink-0"
                              />
                            ))}
                          </>
                        ) : (
                          <div className="text-white/40 text-sm font-light">No mockup available</div>
                        )}
                      </div>
                    </div>
                  ) : (
                    /* Desktop/Web Mockup */
                    <div className="w-full max-w-lg">
                      {study.mockupImage ? (
                        <Image
                          src={study.mockupImage}
                          alt={study.projectName}
                          width={800}
                          height={600}
                          className="w-full h-auto object-contain shadow-2xl rounded-lg"
                        />
                      ) : (
                        <div className="bg-gray-800 rounded-lg border border-white/10 overflow-hidden shadow-2xl">
                          {/* Browser Bar */}
                          <div className="bg-gray-900 px-4 py-3 flex items-center gap-2 border-b border-white/5">
                            <div className="flex gap-1.5">
                              <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                              <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                              <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                            </div>
                          </div>
                          {/* Screen */}
                          <div className="h-48 bg-gradient-to-br from-blue-600/20 to-cyan-600/20 flex items-center justify-center">
                            <div className="text-white/40 text-sm font-light">Web Preview</div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Content Section */}
                <div className="relative p-12">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs text-blue-400 font-medium uppercase tracking-wider">{study.category}</span>
                    {study.type === 'mobile' && (
                      <div className="flex gap-2">
                        {study.appStoreUrl && (
                          <a href={study.appStoreUrl} target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-white/80 transition-colors">
                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                            </svg>
                          </a>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="mb-2">
                    <h3 className="text-2xl font-extralight text-white mb-4">
                      {study.projectName}
                    </h3>
                  </div>

                  <p className="text-white/60 mb-6 leading-relaxed font-light text-sm">
                    {study.description}
                  </p>

                  {/* Results */}
                  <div className="mb-6 flex flex-wrap gap-2">
                    {study.results.map((result, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 bg-blue-500/10 text-blue-400 text-xs font-medium rounded-full border border-blue-500/20"
                      >
                        {result}
                      </span>
                    ))}
                  </div>

                  {/* Tech Stack */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {study.tech.map((tech) => (
                      <span
                        key={tech}
                        className="text-xs text-white/40 font-light"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  {/* CTA */}
                  {study.type === 'web' && study.link && (
                    <a
                      href={study.link}
                      className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors text-sm font-medium"
                    >
                      Visit Site
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </a>
                  )}
                  {study.type === 'mobile' && study.appStoreUrl && (
                    <a
                      href={study.appStoreUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors text-sm font-medium"
                    >
                      Download App
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}