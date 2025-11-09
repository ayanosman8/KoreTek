"use client";

import React from "react";
import { Mail, Github, ArrowRight, Check } from "lucide-react";

export default function GetInTouch() {
  const contactLinks = [
    {
      title: "Email",
      href: "mailto:akay@gmail.com",
      icon: <Mail className="w-12 h-12" />,
      description: "Drop us a message anytime",
      features: ["24/7 Response", "Direct Contact", "Fast Turnaround"],
    },
    {
      title: "GitHub",
      href: "https://github.com/me",
      icon: <Github className="w-12 h-12" />,
      description: "Explore our open source work",
      features: ["Public Repos", "Code Samples", "Active Projects"],
    },
  ];

  return (
    <div
      className="bg-gradient-to-br from-black via-gray-900 to-black py-20 px-4 md:py-32 relative overflow-hidden"
      id="contact"
    >
      {/* Background decorative elements - darker with blue accent */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/3 via-transparent to-blue-500/3"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-3xl"></div>
      <div className="absolute top-20 right-20 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>

      <div className="w-full px-8 lg:px-16 relative z-10">
        {/* Header */}
        <div className="text-center mb-20">
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-extralight tracking-tight mb-8 text-white">
            Let's Work Together
          </h2>

          <p className="text-xl font-light max-w-2xl mx-auto leading-relaxed text-white/60">
            Have a project in mind? We'd love to hear about it. Reach out and let's create something amazing together.
          </p>
        </div>

        {/* Contact Cards - Pricing Card Style */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12 max-w-5xl mx-auto">
          {contactLinks.map((link, index) => (
            <a
              key={index}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative rounded-3xl p-12 border backdrop-blur-xl overflow-hidden transition-all duration-500 bg-gradient-to-br from-gray-900 to-black border-white/10 hover:border-blue-500/40 shadow-2xl hover:shadow-blue-500/10"
            >
              {/* Icon */}
              <div className="text-blue-500 mb-6">
                {link.icon}
              </div>

              {/* Content */}
              <h3 className="text-3xl font-extralight mb-4 text-white group-hover:text-blue-300 transition-colors duration-300">
                {link.title}
              </h3>

              <p className="font-light leading-relaxed mb-10 text-white/60">
                {link.description}
              </p>

              {/* Features List */}
              <div className="space-y-4 mb-6">
                {link.features.map((feature, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <Check className="h-5 w-5 text-blue-500 flex-shrink-0" />
                    <span className="font-light text-white/80">{feature}</span>
                  </div>
                ))}
              </div>

            </a>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center max-w-4xl mx-auto">
          <h3 className="text-4xl md:text-5xl font-extralight text-white mb-6">
            Ready to Start Your Project?
          </h3>
          <p className="text-xl font-light text-white/60 mb-12 max-w-2xl mx-auto leading-relaxed">
            Whether you're looking for a complete solution or just need some expert advice, we're here to help bring your vision to life.
          </p>
          <a
            href="mailto:akay@gmail.com"
            className="inline-flex items-center gap-3 px-12 py-5 text-white bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-2xl shadow-blue-500/20 hover:shadow-blue-500/30 group"
          >
            <span className="text-lg font-medium">Send Us a Message</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>
      </div>
    </div>
  );
}