"use client";

import React from "react";
import { Code2, Palette, Smartphone, Check } from "lucide-react";

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
      features: ["User Testing & Research", "Interactive Prototypes", "Scalable Design Systems"],
    },
    {
      icon: <Smartphone className="w-12 h-12" />,
      title: "Mobile Apps",
      description: "Cross-platform mobile solutions that reach users wherever they are.",
      features: ["iOS & Android", "React Native", "Offline Support"],
    },
  ];

  return (
    <div id="services" className="bg-gradient-to-br from-black via-gray-900 to-black py-20 px-4 md:py-32 relative overflow-hidden">
      {/* Background effects - darker with blue accent */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/3 via-transparent to-blue-500/3"></div>
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>

      <div className="w-full px-8 lg:px-16 relative z-10">
        {/* Header */}
        <div className="text-center mb-20">
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-extralight tracking-tight mb-6 text-white">
            Our Capabilities
          </h2>

          <p className="text-xl font-light max-w-3xl mx-auto text-white/60 leading-relaxed">
            Full-service digital solutions tailored to your business needs. From concept to deployment, we&apos;ve got you covered.
          </p>
        </div>

        {/* Services Grid - Pricing Card Style */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className="group relative rounded-3xl p-12 border backdrop-blur-xl overflow-hidden transition-all duration-500 bg-gradient-to-br from-gray-900 to-black border-white/10 hover:border-blue-500/40 shadow-2xl hover:shadow-blue-500/10"
            >
              {/* Icon */}
              <div className="text-blue-500 mb-6">
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

            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
