"use client";

import React from "react";
import { Quote, Star } from "lucide-react";

export default function Testimonials() {
  const testimonials = [
    {
      quote: "Working with KoreTek transformed our business. The e-commerce platform they built exceeded our expectations and delivered real results. Our conversion rates increased by 45% within the first month.",
      author: "Sarah Chen",
      role: "CEO",
      company: "TechRetail Inc.",
      rating: 5,
    },
    {
      quote: "The team's expertise in data analytics and AI is outstanding. They built us a platform that processes millions of data points daily with incredible accuracy. Truly enterprise-grade work.",
      author: "Michael Rodriguez",
      role: "CTO",
      company: "DataFlow Analytics",
      rating: 5,
    },
    {
      quote: "Our fitness app became a reality thanks to their mobile development skills. The user experience is seamless, and the integration with health devices works flawlessly. We've reached 50K downloads in just 6 months.",
      author: "Emily Johnson",
      role: "Founder",
      company: "FitLife App",
      rating: 5,
    },
    {
      quote: "The workflow automation platform they developed has saved our team over 40 hours per month. The AI integration is incredibly accurate and has streamlined our entire operation.",
      author: "David Park",
      role: "Operations Director",
      company: "AutomateHub",
      rating: 5,
    },
  ];

  return (
    <div className="bg-gradient-to-br from-black via-gray-900 to-black py-20 px-4 md:py-32 relative overflow-hidden">
      {/* Background effects - darker with blue accent */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/3 via-transparent to-blue-500/3"></div>
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-20">
          <div className="inline-block px-5 py-2.5 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 backdrop-blur-sm rounded-full border border-blue-400/30 mb-6 shadow-lg shadow-blue-500/10">
            <span className="text-sm font-semibold text-blue-300 tracking-wide uppercase">Client Testimonials</span>
          </div>
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-extralight tracking-tight mb-6 text-white">
            What Our Clients Say
          </h2>
          <p className="text-xl font-light max-w-3xl mx-auto text-white/60 leading-relaxed">
            Don&apos;t just take our word for it. Hear from the businesses we&apos;ve helped transform.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="group relative rounded-3xl p-12 border backdrop-blur-xl overflow-hidden transition-all duration-500 bg-gradient-to-br from-gray-900 to-black border-white/10 hover:border-blue-500/40 shadow-2xl hover:shadow-blue-500/10"
            >
              {/* Quote Icon */}
              <div className="text-blue-500/20 mb-6">
                <Quote className="w-12 h-12" />
              </div>

              {/* Rating */}
              <div className="flex gap-1 mb-6">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-blue-500 fill-blue-500" />
                ))}
              </div>

              {/* Quote */}
              <p className="text-white/80 font-light leading-relaxed mb-8 text-lg">
                &quot;{testimonial.quote}&quot;
              </p>

              {/* Author Info */}
              <div className="border-t border-white/10 pt-6">
                <div className="text-white font-medium mb-1">{testimonial.author}</div>
                <div className="text-white/60 text-sm font-light">
                  {testimonial.role} at {testimonial.company}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
