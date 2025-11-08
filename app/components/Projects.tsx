"use client";

import { ExternalLink, Sparkles, Zap, Target, TrendingUp, Users, Award, Rocket, ShoppingCart, BarChart3, Smartphone, Brain } from "lucide-react";
import React, { useRef } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";

export default function Projects() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  const stats = [
    { number: "Modern", label: "Tech Stack", icon: <Rocket className="w-6 h-6" /> },
    { number: "Agile", label: "Development", icon: <TrendingUp className="w-6 h-6" /> },
    { number: "24/7", label: "Support", icon: <Users className="w-6 h-6" /> },
    { number: "100%", label: "Commitment", icon: <Award className="w-6 h-6" /> },
  ];

  const products = [
    {
      name: "NexusCommerce",
      description: "A next-generation e-commerce platform featuring AI-powered product recommendations, real-time inventory management, and seamless multi-channel integration. Built for scale with enterprise-grade security.",
      gradient: "from-purple-600 via-pink-600 to-purple-600",
      link: "#",
      tech: ["Next.js 15", "PostgreSQL", "Stripe", "Redis", "GraphQL"],
      icon: <ShoppingCart className="w-6 h-6" />,
      features: ["AI Recommendations", "Real-time Analytics", "Multi-currency Support"],
      metrics: [
        { label: "Conversion Rate", value: "+45%" },
        { label: "Page Load", value: "0.8s" },
        { label: "Uptime", value: "99.9%" },
      ]
    },
    {
      name: "DataVista",
      description: "Transform complex data into actionable insights with our intelligent analytics platform. Features real-time dashboards, predictive analytics, and automated reporting for data-driven decision making.",
      gradient: "from-blue-600 via-cyan-600 to-blue-600",
      link: "#",
      tech: ["React", "Python", "TensorFlow", "AWS", "D3.js"],
      icon: <BarChart3 className="w-6 h-6" />,
      features: ["Predictive Analytics", "Custom Dashboards", "API Integration"],
      metrics: [
        { label: "Data Processing", value: "10M+/day" },
        { label: "Response Time", value: "<100ms" },
        { label: "Accuracy", value: "98.5%" },
      ]
    },
    {
      name: "MobileForge",
      description: "Cross-platform mobile app development framework that delivers native performance with a single codebase. Includes offline-first architecture, push notifications, and seamless cloud sync.",
      gradient: "from-orange-600 via-red-600 to-orange-600",
      link: "#",
      tech: ["React Native", "TypeScript", "Firebase", "WebSockets"],
      icon: <Smartphone className="w-6 h-6" />,
      features: ["Offline-First", "Push Notifications", "Cloud Sync"],
      metrics: [
        { label: "App Size", value: "12MB" },
        { label: "Launch Time", value: "1.2s" },
        { label: "Platforms", value: "iOS/Android" },
      ]
    },
    {
      name: "CogniFlow",
      description: "AI-powered workflow automation platform that learns from your team's behavior to optimize processes. Features natural language processing, smart task routing, and intelligent scheduling.",
      gradient: "from-green-600 via-emerald-600 to-green-600",
      link: "#",
      tech: ["Node.js", "OpenAI", "MongoDB", "Kubernetes", "Docker"],
      icon: <Brain className="w-6 h-6" />,
      features: ["AI Automation", "NLP Processing", "Smart Scheduling"],
      metrics: [
        { label: "Time Saved", value: "40hrs/mo" },
        { label: "Accuracy", value: "96%" },
        { label: "Tasks/day", value: "5000+" },
      ]
    },
  ];

  // Variants for animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  return (
    <div
      ref={containerRef}
      id="projects"
      className="bg-gradient-to-br from-black via-gray-900 to-black py-20 px-4 md:py-32 relative overflow-hidden"
    >
      {/* Animated background decorative elements - darker with blue accent */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/3 via-transparent to-blue-500/3"></div>
      <motion.div
        style={{ y }}
        className="absolute top-20 left-10 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-3xl"
      ></motion.div>
      <motion.div
        style={{ y: useTransform(scrollYProgress, [0, 1], [-100, 100]) }}
        className="absolute bottom-20 right-10 w-[800px] h-[800px] bg-blue-500/10 rounded-full blur-3xl"
      ></motion.div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Mission Statement Section */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="text-center mb-32"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 backdrop-blur-sm rounded-full border border-blue-400/30 mb-8 shadow-lg shadow-blue-500/10"
          >
            <Target className="w-5 h-5 text-cyan-400" />
            <span className="text-sm font-semibold text-cyan-300 tracking-wide uppercase">Our Mission</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-5xl md:text-7xl lg:text-8xl font-extralight mb-8 text-white leading-tight"
          >
            Design Doesn't Have to Be Hard
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-2xl md:text-3xl text-white/70 max-w-5xl mx-auto leading-relaxed mb-6 font-light"
          >
            We believe in making technology accessible and beautiful for everyone.
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="text-lg md:text-xl text-white/60 max-w-4xl mx-auto leading-relaxed"
          >
            In a world where complexity often overshadows simplicity, we craft enterprise-grade solutions that are intuitive, powerful, and designed with you in mind. Every product we build is a testament to our commitment to excellence and user-centric design.
          </motion.p>
        </motion.div>

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

        {/* Our Products Section */}
        <div className="mb-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-block px-5 py-2.5 bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-sm rounded-full border border-purple-400/30 mb-6 shadow-lg shadow-purple-500/10"
            >
              <span className="text-sm font-semibold text-purple-300 tracking-wide uppercase">Enterprise Solutions</span>
            </motion.div>
            <h3 className="text-4xl md:text-6xl lg:text-7xl font-extralight text-white mb-6">
              Our Products
            </h3>
            <p className="text-xl text-white/60 max-w-3xl mx-auto leading-relaxed font-light">
              Innovative solutions built with passion and precision. Explore our portfolio of cutting-edge products designed to transform your business.
            </p>
          </motion.div>
        </div>

        {/* Product Cards Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12"
        >
          {products.map((product, index) => {
            const productRef = useRef(null);
            const isInView = useInView(productRef, { once: true, amount: 0.3 });

            return (
              <motion.div
                key={product.name}
                ref={productRef}
                variants={itemVariants}
                initial={{ opacity: 0, y: 100, rotateX: 10 }}
                animate={isInView ? { opacity: 1, y: 0, rotateX: 0 } : {}}
                transition={{ duration: 0.8, delay: index * 0.2, ease: "easeOut" }}
                whileHover={{ y: -15, scale: 1.02 }}
                className="group relative bg-gradient-to-br from-gray-900 to-black backdrop-blur-2xl rounded-3xl overflow-hidden border border-white/10 hover:border-blue-500/40 transition-all duration-700 shadow-2xl hover:shadow-blue-500/10"
                style={{ transformStyle: "preserve-3d", perspective: 1000 }}
              >

                {/* Image Section with Animated Gradient */}
                <div className="relative h-80 overflow-hidden">
                  {/* Animated gradient background */}
                  <motion.div
                    className={`absolute inset-0 bg-gradient-to-br ${product.gradient}`}
                    initial={{ opacity: 0.6 }}
                    whileHover={{ opacity: 0.9 }}
                    transition={{ duration: 0.5 }}
                  >
                    {/* Animated mesh pattern */}
                    <motion.div
                      className="absolute inset-0 opacity-20"
                      style={{
                        backgroundImage: `
                          linear-gradient(0deg, transparent 24%, rgba(255, 255, 255, .05) 25%, rgba(255, 255, 255, .05) 26%, transparent 27%, transparent 74%, rgba(255, 255, 255, .05) 75%, rgba(255, 255, 255, .05) 76%, transparent 77%, transparent),
                          linear-gradient(90deg, transparent 24%, rgba(255, 255, 255, .05) 25%, rgba(255, 255, 255, .05) 26%, transparent 27%, transparent 74%, rgba(255, 255, 255, .05) 75%, rgba(255, 255, 255, .05) 76%, transparent 77%, transparent)
                        `,
                        backgroundSize: '50px 50px'
                      }}
                      animate={{
                        backgroundPosition: ['0px 0px', '50px 50px'],
                      }}
                      transition={{
                        duration: 20,
                        repeat: Infinity,
                        ease: 'linear',
                      }}
                    ></motion.div>

                    {/* Glowing orbs */}
                    <motion.div
                      className="absolute top-10 right-10 w-32 h-32 bg-white/20 rounded-full blur-3xl"
                      animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.3, 0.6, 0.3],
                      }}
                      transition={{
                        duration: 4,
                        repeat: Infinity,
                      }}
                    ></motion.div>
                    <motion.div
                      className="absolute bottom-10 left-10 w-40 h-40 bg-white/20 rounded-full blur-3xl"
                      animate={{
                        scale: [1, 1.3, 1],
                        opacity: [0.2, 0.5, 0.2],
                      }}
                      transition={{
                        duration: 5,
                        repeat: Infinity,
                        delay: 1,
                      }}
                    ></motion.div>
                  </motion.div>

                  {/* Overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent"></div>

                  {/* Animated Icon Badge */}
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={isInView ? { scale: 1, rotate: 0 } : {}}
                    transition={{ duration: 0.6, delay: index * 0.2 + 0.4 }}
                    whileHover={{ scale: 1.2, rotate: 5 }}
                    className={`absolute top-6 left-6 p-4 bg-gradient-to-br ${product.gradient} rounded-2xl text-white shadow-2xl`}
                  >
                    {product.icon}
                  </motion.div>

                  {/* Floating particles */}
                  <motion.div
                    className="absolute top-10 right-10 w-3 h-3 bg-white/60 rounded-full"
                    animate={{ y: [0, -20, 0], opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
                  ></motion.div>
                  <motion.div
                    className="absolute bottom-20 right-20 w-2 h-2 bg-white/80 rounded-full"
                    animate={{ y: [0, -15, 0], opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2.5, repeat: Infinity, delay: 1 }}
                  ></motion.div>
                  <motion.div
                    className="absolute top-1/2 left-1/4 w-2 h-2 bg-white/70 rounded-full"
                    animate={{ y: [0, -25, 0], opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: 3.5, repeat: Infinity, delay: 1.5 }}
                  ></motion.div>

                  {/* Product metrics overlay */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center"
                  >
                    <div className="grid grid-cols-3 gap-6 px-8">
                      {product.metrics.map((metric, i) => (
                        <motion.div
                          key={i}
                          initial={{ y: 20, opacity: 0 }}
                          whileHover={{ y: 0, opacity: 1 }}
                          transition={{ delay: i * 0.1 }}
                          className="text-center"
                        >
                          <div className={`text-2xl font-black bg-gradient-to-r ${product.gradient} bg-clip-text text-transparent mb-1`}>
                            {metric.value}
                          </div>
                          <div className="text-xs text-slate-400">{metric.label}</div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                </div>

                {/* Content Section */}
                <div className="relative p-10">
                  <motion.h3
                    initial={{ opacity: 0, x: -20 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.6, delay: index * 0.2 + 0.3 }}
                    className="text-3xl font-extralight text-white mb-4 group-hover:text-blue-300 transition-colors duration-300"
                  >
                    {product.name}
                  </motion.h3>

                  <motion.p
                    initial={{ opacity: 0, x: -20 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.6, delay: index * 0.2 + 0.4 }}
                    className="text-white/70 mb-6 leading-relaxed text-lg font-light"
                  >
                    {product.description}
                  </motion.p>

                  {/* Features List */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6, delay: index * 0.2 + 0.5 }}
                    className="flex flex-wrap gap-2 mb-6"
                  >
                    {product.features.map((feature, i) => (
                      <motion.span
                        key={feature}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={isInView ? { opacity: 1, scale: 1 } : {}}
                        transition={{ duration: 0.4, delay: index * 0.2 + 0.6 + i * 0.1 }}
                        className="px-4 py-1.5 bg-blue-500/10 text-blue-400 text-sm font-medium rounded-full border border-blue-500/20"
                      >
                        {feature}
                      </motion.span>
                    ))}
                  </motion.div>

                  {/* Tech Stack */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6, delay: index * 0.2 + 0.7 }}
                    className="flex flex-wrap gap-2 mb-8"
                  >
                    {product.tech.map((tech, i) => (
                      <motion.span
                        key={tech}
                        initial={{ opacity: 0, x: -10 }}
                        animate={isInView ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.4, delay: index * 0.2 + 0.8 + i * 0.05 }}
                        className="px-3 py-1 bg-white/5 text-white/60 text-xs font-light rounded-full border border-white/10"
                      >
                        {tech}
                      </motion.span>
                    ))}
                  </motion.div>

                  {/* CTA Buttons */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6, delay: index * 0.2 + 0.9 }}
                    className="flex gap-4"
                  >
                    <motion.a
                      href={product.link}
                      whileHover={{ scale: 1.05, x: 5 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex-1 inline-flex items-center justify-center gap-3 px-6 py-3.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium rounded-xl shadow-2xl shadow-blue-500/20 transition-all duration-300 group/btn"
                    >
                      <span>View Demo</span>
                      <motion.div
                        animate={{ x: [0, 5, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        <ExternalLink className="w-5 h-5" />
                      </motion.div>
                    </motion.a>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-6 py-3.5 border border-white/10 text-white/70 font-light rounded-xl hover:border-white/20 hover:text-white transition-all duration-300"
                    >
                      Details
                    </motion.button>
                  </motion.div>
                </div>

                {/* Bottom accent line */}
                <motion.div
                  className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-blue-400 to-blue-500"
                  initial={{ scaleX: 0 }}
                  whileHover={{ scaleX: 1 }}
                  transition={{ duration: 0.5 }}
                ></motion.div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
}