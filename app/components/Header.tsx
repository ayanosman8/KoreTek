"use client";

import Link from "next/link";
import React from "react";

const links = [
  {
    title: "Platform",
    href: "#services",
  },
  {
    title: "About",
    href: "#projects",
  },
  {
    title: "Contact",
    href: "#contact",
  },
];

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      {/* Glassmorphism background - darker */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-xl border-b border-white/10"></div>

      <div className="relative w-full px-6 lg:px-12 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="h-11 w-11 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-xl group-hover:shadow-blue-500/25 transition-all duration-300 group-hover:scale-105">
                <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-blue-500 animate-pulse"></div>
            </div>
            <div className="flex flex-col">
              <h1 className="text-xl font-bold tracking-tight text-white">
                KoreTek
              </h1>
              <span className="text-xs text-blue-500 font-medium uppercase tracking-wider">
                Technology
              </span>
            </div>
          </Link>

          {/* Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {links.map((link) => (
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
            ))}
          </div>

          {/* CTA Button */}
          <div className="hidden md:flex items-center gap-3">
            <a
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                document.querySelector("#contact")?.scrollIntoView({
                  behavior: "smooth",
                  block: "start",
                });
              }}
              className="px-6 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-blue-500/25 hover:scale-105 cursor-pointer"
            >
              Get Started
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}