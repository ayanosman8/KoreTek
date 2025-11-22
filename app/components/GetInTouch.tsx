"use client";

import React from "react";
import { ArrowRight, Mail, Phone } from "lucide-react";

export default function GetInTouch() {
  const contactInfo = [
    {
      icon: <Mail className="w-6 h-6" />,
      label: "Email",
      value: "info@korelnx.com",
      href: "mailto:info@korelnx.com",
    },
    {
      icon: <Phone className="w-6 h-6" />,
      label: "Phone",
      value: "+1 (555) 123-4567",
      href: "tel:+15551234567",
    },
  ];

  return (
    <div
      className="bg-gradient-to-br from-black via-gray-900 to-black py-20 px-4 md:py-32 relative overflow-hidden"
      id="contact"
    >
        {/* Background decorative elements */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/3 via-transparent to-blue-500/3"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-20 right-20 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>

        <div className="w-full px-8 lg:px-16 relative z-10">
          <div className="max-w-6xl mx-auto">
            {/* Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
              {/* Left - Heading & CTA */}
              <div>
                <h2 className="text-6xl md:text-7xl lg:text-8xl font-extralight tracking-tight text-white leading-none mb-8">
                  <span className="block">Get in</span>
                  <span className="block text-blue-500">Touch</span>
                </h2>

                <p className="text-xl font-light text-white/60 leading-relaxed max-w-md">
                  Have a project in mind? We&apos;d love to hear about it. Let&apos;s create something amazing together.
                </p>
              </div>

              {/* Right - Contact Info Cards */}
              <div className="space-y-6">
                {contactInfo.map((item, index) => (
                  <div
                    key={index}
                    className="group relative"
                  >
                    {item.href ? (
                      <a
                        href={item.href}
                        className="block p-6 rounded-2xl border border-white/10 bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-sm hover:border-blue-500/40 hover:bg-blue-500/5 transition-all duration-300"
                      >
                        <div className="flex items-center gap-6">
                          <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-500 group-hover:bg-blue-500/20 group-hover:scale-110 transition-all duration-300">
                            {item.icon}
                          </div>
                          <div>
                            <div className="text-sm text-white/40 uppercase tracking-wider font-medium mb-1">
                              {item.label}
                            </div>
                            <div className="text-xl font-light text-white group-hover:text-blue-400 transition-colors">
                              {item.value}
                            </div>
                          </div>
                          <ArrowRight className="w-5 h-5 text-white/20 group-hover:text-blue-500 group-hover:translate-x-2 transition-all duration-300 ml-auto" />
                        </div>
                      </a>
                    ) : (
                      <div className="block p-6 rounded-2xl border border-white/10 bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-sm">
                        <div className="flex items-center gap-6">
                          <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-500">
                            {item.icon}
                          </div>
                          <div>
                            <div className="text-sm text-white/40 uppercase tracking-wider font-medium mb-1">
                              {item.label}
                            </div>
                            <div className="text-xl font-light text-white">
                              {item.value}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
    </div>
  );
}