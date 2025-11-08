"use client";

import React from "react";
import { motion } from "framer-motion";
import { Code2, Palette, Smartphone, Cloud, Database, Shield, Check } from "lucide-react";

export default function Services() {
  const services = [
    {
      icon: <Code2 className="w-12 h-12" />,
      title: "Web Development",
      description: "Enterprise-scale web applications built with cutting-edge technologies and best practices.",
      features: ["Next.js & React", "TypeScript", "API Integration"],
    },
    {
      icon: <Palette className="w-12 h-12" />,
      title: "UI/UX Design",
      description: "Beautiful, intuitive interfaces that delight users and drive engagement.",
      features: ["User Research", "Prototyping", "Design Systems"],
    },
    {
      icon: <Smartphone className="w-12 h-12" />,
      title: "Mobile Apps",
      description: "Cross-platform mobile solutions that reach users wherever they are.",
      features: ["iOS & Android", "React Native", "Offline Support"],
    },
    {
      icon: <Cloud className="w-12 h-12" />,
      title: "Cloud Solutions",
      description: "Scalable cloud architecture designed for reliability and performance.",
      features: ["AWS & Azure", "Auto-Scaling", "99.9% Uptime"],
    },
    {
      icon: <Database className="w-12 h-12" />,
      title: "Data Analytics",
      description: "Transform data into actionable insights with powerful analytics.",
      features: ["Real-time Metrics", "Custom Reports", "Predictive AI"],
    },
    {
      icon: <Shield className="w-12 h-12" />,
      title: "Security & Compliance",
      description: "Enterprise-grade security ensuring your data stays protected.",
      features: ["Encryption", "Compliance", "24/7 Monitoring"],
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  return (
    <div className="bg-gradient-to-br from-black via-gray-900 to-black py-20 px-4 md:py-32 relative overflow-hidden">
      {/* Background effects - darker with blue accent */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/3 via-transparent to-blue-500/3"></div>
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>

      <div className="w-full px-8 lg:px-16 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-extralight tracking-tight mb-6 text-white">
            Our Capabilities
          </h2>

          <p className="text-xl font-light max-w-3xl mx-auto text-white/60 leading-relaxed">
            Full-service digital solutions tailored to your business needs. From concept to deployment, we've got you covered.
          </p>
        </motion.div>

        {/* Services Grid - Pricing Card Style */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {services.map((service, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ y: -10, scale: 1.02 }}
              className="group relative rounded-3xl p-12 border backdrop-blur-xl overflow-hidden transition-all duration-500 bg-gradient-to-br from-gray-900 to-black border-white/10 hover:border-blue-500/40 shadow-2xl hover:shadow-blue-500/10"
            >
              {/* Icon */}
              <div className="text-blue-500 mb-6 group-hover:scale-110 transition-transform duration-300">
                {service.icon}
              </div>

              {/* Content */}
              <h3 className="text-3xl font-extralight mb-4 text-white">
                {service.title}
              </h3>

              <p className="font-light leading-relaxed mb-10 text-white/60">
                {service.description}
              </p>

              {/* Features List */}
              <div className="space-y-4">
                {service.features.map((feature, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <Check className="h-5 w-5 text-blue-500 flex-shrink-0" />
                    <span className="font-light text-white/80">{feature}</span>
                  </div>
                ))}
              </div>

              {/* Bottom gradient accent */}
              <motion.div
                className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-blue-400 to-blue-500"
                initial={{ scaleX: 0 }}
                whileHover={{ scaleX: 1 }}
                transition={{ duration: 0.5 }}
              ></motion.div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
