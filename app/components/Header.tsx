"use client";

import Link from "next/link";
import Image from "next/image";
import React, { useState } from "react";
import ProjectForm from "./ProjectForm";

const links = [
  {
    title: "Services",
    href: "#services",
  },
  {
    title: "About",
    href: "#about",
  },
  {
    title: "Pricing",
    href: "#pricing",
  },
  {
    title: "Projects",
    href: "#projects",
  },
  {
    title: "Contact",
    href: "#contact",
  },
];

export default function Header() {
  const [isFormOpen, setIsFormOpen] = useState(false);

  return (
    <>
      <ProjectForm isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} selectedPackage="" />
    <header className="fixed top-0 left-0 right-0 z-50">
      {/* Glassmorphism background - darker */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-xl border-b border-white/10"></div>

      <div className="relative w-full px-6 lg:px-12 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative">
              {/* Custom logo */}
              <Image
                src="/logo.png"
                alt="KoreLnx Logo"
                width={300}
                height={185}
                className="rounded-xl"
                style={{ height: '60px', width: 'auto' }}
              />
              {/* Old lightning bolt icon - commented out
              <div className="h-11 w-11 rounded-2xl border-2 border-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.4)] group-hover:shadow-[0_0_25px_rgba(59,130,246,0.7)] bg-black/50 backdrop-blur-sm flex items-center justify-center transition-all duration-300 p-1.5">
                <svg className="h-6 w-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-blue-500 animate-pulse"></div>
              */}
            </div>
          </Link>

          {/* Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {links.map((link) => (
              link.href.startsWith("/") ? (
                <Link
                  key={link.title}
                  href={link.href}
                  className="text-sm font-medium text-white/70 hover:text-blue-400 transition-all duration-300 hover:scale-105 cursor-pointer"
                >
                  {link.title}
                </Link>
              ) : (
                <a
                  key={link.title}
                  href={link.href}
                  onClick={(e) => {
                    e.preventDefault();
                    document.querySelector(link.href)?.scrollIntoView({
                      behavior: "smooth",
                      block: "start",
                    });
                  }}
                  className="text-sm font-medium text-white/70 hover:text-blue-400 transition-all duration-300 hover:scale-105 cursor-pointer"
                >
                  {link.title}
                </a>
              )
            ))}
          </div>

          {/* CTA Button */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={() => setIsFormOpen(true)}
              className="group relative px-6 py-2.5 text-sm font-medium text-white rounded-xl cursor-pointer overflow-hidden"
            >
              {/* Black background with glowing border (default) */}
              <div className="absolute inset-0 rounded-xl border-2 border-blue-500/50 shadow-[0_0_20px_rgba(59,130,246,0.5)] group-hover:shadow-[0_0_30px_rgba(59,130,246,0.8)] transition-all duration-300"></div>
              <div className="absolute inset-0.5 rounded-[10px] bg-black"></div>

              {/* Button content */}
              <span className="relative z-10">Get Started</span>
            </button>
          </div>
        </div>
      </div>
    </header>
    </>
  );
}