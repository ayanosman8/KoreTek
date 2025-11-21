"use client";

import React, { useState } from "react";
import { Check, Zap, ArrowRight } from "lucide-react";
import ProjectForm from "./ProjectForm";

export default function Pricing() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<string>("");

  const pricingTiers = [
    {
      name: "Landing Page",
      price: "$2,000",
      originalPrice: "$5,000",
      description: "Establish your digital presence with a stunning, high-converting landing page",
      features: [
        "Single-page responsive design",
        "Custom animations & interactions",
        "Contact form with email integration",
        "SEO optimization & meta tags",
        "Performance optimization",
      ],
      popular: false,
    },
    {
      name: "Mobile App",
      price: "$5,000",
      originalPrice: "$12,500",
      description: "Cross-platform mobile app for iOS and Android",
      features: [
        "iOS & Android apps (React Native)",
        "Up to 6 core screens",
        "Custom UI/UX design",
        "Basic API integration",
        "App store submission assistance",
      ],
      popular: false,
    },
    {
      name: "Web Platform",
      price: "$10,000",
      originalPrice: "$25,000",
      description: "Full-featured web application with backend and database",
      features: [
        "Multi-page web application",
        "User authentication & authorization",
        "Database architecture & setup",
        "Admin dashboard",
        "RESTful API development",
        "Cloud hosting & deployment",
      ],
      popular: true,
    },
    {
      name: "Complete Platform",
      price: "$35,000",
      originalPrice: "$87,500",
      description: "End-to-end digital ecosystem with web and mobile applications",
      features: [
        "Full web application + backend",
        "iOS & Android apps (React Native)",
        "Up to 10 core mobile screens",
        "Advanced API architecture",
        "Real-time data synchronization",
        "Push notifications",
        "Scalable cloud infrastructure",
        "App store submission assistance",
        "Comprehensive testing & QA",
      ],
      popular: false,
    },
  ];

  return (
    <>
      <ProjectForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        selectedPackage={selectedPackage}
      />
      <div id="pricing" className="bg-gradient-to-br from-black via-gray-900 to-black py-20 px-4 md:py-32 relative overflow-hidden">
        {/* Background effects - darker with blue accent */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/3 via-transparent to-blue-500/3"></div>
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Header */}
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 backdrop-blur-sm rounded-full border border-blue-400/30 mb-6 shadow-lg shadow-blue-500/10">
              <Zap className="w-5 h-5 text-cyan-400" />
              <span className="text-sm font-semibold text-cyan-300 tracking-wide uppercase">Introductory Pricing</span>
            </div>
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-extralight tracking-tight mb-6 text-white">
              Early Adopter Rates
            </h2>
            <p className="text-xl font-light max-w-3xl mx-auto text-white/60 leading-relaxed mb-4">
              Get enterprise quality at startup prices.
            </p>
            <p className="text-sm text-blue-400 font-medium mb-4">
              Limited spots available - Lock in these rates today
            </p>
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-blue-500/10 backdrop-blur-sm rounded-lg border border-blue-400/20">
              <span className="text-sm text-white/80 font-light">
                <span className="font-medium text-blue-400">Payment terms:</span> We require 50% upfront to begin your project, with the remaining 50% due upon project approval.
              </span>
            </div>
          </div>

          {/* Pricing Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {pricingTiers.map((tier, index) => (
              <div
                key={index}
                className={`group relative rounded-3xl p-8 border backdrop-blur-xl overflow-hidden transition-all duration-500 bg-gradient-to-br from-gray-900 to-black shadow-2xl ${
                  tier.popular
                    ? "border-blue-500/40 shadow-blue-500/20 scale-105"
                    : "border-white/10 hover:border-blue-500/40 hover:shadow-blue-500/10"
                }`}
              >
                {/* Popular Badge */}
                {tier.popular && (
                  <div className="absolute top-4 right-4 bg-blue-500/20 text-blue-400 text-xs px-3 py-1.5 rounded-full font-medium border border-blue-500/30">
                    POPULAR
                  </div>
                )}

                {/* Tier Name */}
                <h3 className={`text-2xl font-extralight text-white mb-2 ${tier.popular ? 'pr-24' : ''}`}>
                  {tier.name}
                </h3>

                {/* Price */}
                <div className="mb-4">
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="text-4xl font-extralight text-blue-500">
                      {tier.price}
                    </span>
                  </div>
                  <div className="text-sm text-white/40 line-through">
                    {tier.originalPrice}
                  </div>
                </div>

                {/* Description */}
                <p className="text-white/60 font-light text-sm mb-6 leading-relaxed">
                  {tier.description}
                </p>

                {/* Features List */}
                <div className="space-y-3 mb-8">
                  {tier.features.map((feature, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                      <span className="font-light text-white/80 text-sm">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* CTA Button */}
                <button
                  onClick={() => {
                    // Map pricing tier to form package option
                    const packageMap: Record<string, string> = {
                      "Landing Page": "Website",
                      "Web Platform": "Website",
                      "Mobile App": "Mobile App",
                      "Complete Platform": "Both",
                    };
                    setSelectedPackage(packageMap[tier.name] || tier.name);
                    setIsFormOpen(true);
                  }}
                  className="w-full px-6 py-3 text-white bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 font-medium inline-flex items-center justify-center gap-2 group"
                >
                  Choose This Package
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
