"use client";

import React, { useRef, useLayoutEffect } from "react";
import { Code2, Palette, Smartphone, Check } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Services() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  const services = [
    {
      icon: <Code2 className="w-12 h-12" />,
      title: "Web Development",
      description: "Enterprise-scale web applications built with cutting-edge technologies and best practices.",
      features: ["Next.js & React", "TypeScript", "API Integration"],
    },
    {
      icon: <Palette className="w-12 h-12" />,
      title: "Product Design",
      description: "Intuitive interfaces crafted as part of every project we build.",
      features: ["Wireframes & Mockups", "Responsive Layouts", "User Flow Optimization"],
    },
    {
      icon: <Smartphone className="w-12 h-12" />,
      title: "Mobile Apps",
      description: "Cross-platform mobile solutions that reach users wherever they are.",
      features: ["iOS & Android", "React Native", "Production-Ready Features"],
    },
  ];

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Header animation
      gsap.fromTo(
        headerRef.current,
        { opacity: 0, y: 60 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: headerRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );

      // Cards animation with stagger
      const cards = cardsRef.current?.querySelectorAll(".service-card");
      if (cards) {
        gsap.fromTo(
          cards,
          { opacity: 0, y: 80 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out",
            stagger: 0.15,
            scrollTrigger: {
              trigger: cardsRef.current,
              start: "top 75%",
              toggleActions: "play none none none",
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={sectionRef} id="services" className="bg-gradient-to-br from-black via-gray-900 to-black py-20 px-4 md:py-32 relative overflow-hidden">
      {/* Background effects - darker with blue accent */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/3 via-transparent to-blue-500/3"></div>
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>

      <div className="w-full px-8 lg:px-16 relative z-10">
        {/* Header */}
        <div ref={headerRef} className="text-center mb-20">
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-extralight tracking-tight mb-6 text-white">
            Our Capabilities
          </h2>

          <p className="text-xl font-light max-w-3xl mx-auto text-white/60 leading-relaxed">
            Full-service digital solutions tailored to your business needs. From concept to deployment, we&apos;ve got you covered.
          </p>
        </div>

        {/* Services Grid */}
        <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className="service-card group relative rounded-3xl p-12 border backdrop-blur-xl overflow-hidden bg-gradient-to-br from-gray-900 to-black border-white/10 hover:border-blue-500/40 shadow-2xl hover:shadow-blue-500/10 transition-all duration-300 hover:scale-[1.02]"
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
