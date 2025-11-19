"use client";

import React, { useState } from "react";
import { ArrowRight } from "lucide-react";
import InquiryModal from "./InquiryModal";

export default function GetInTouch() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <InquiryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
      <div
        className="bg-gradient-to-br from-black via-gray-900 to-black py-20 px-4 md:py-32 relative overflow-hidden"
        id="contact"
      >
        {/* Background decorative elements - darker with blue accent */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/3 via-transparent to-blue-500/3"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-20 right-20 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>

        <div className="w-full px-8 lg:px-16 relative z-10">
          {/* Main Content */}
          <div className="text-center max-w-4xl mx-auto">
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-extralight tracking-tight mb-8 text-white">
              Let&apos;s Work Together
            </h2>

            <p className="text-xl font-light text-white/60 mb-12 max-w-2xl mx-auto leading-relaxed">
              Have a project in mind? We&apos;d love to hear about it. Reach out and let&apos;s create something amazing together.
            </p>

            {/* CTA Button */}
            <div>
              <button
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center gap-3 px-12 py-5 text-white bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-2xl shadow-blue-500/20 hover:shadow-blue-500/30 group"
              >
                <span className="text-lg font-medium">Get in Touch</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}