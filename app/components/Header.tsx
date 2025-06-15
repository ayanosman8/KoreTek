"use client";

import React from "react";

const links = [
  {
    title: "Projects",
    href: "#projects",
  },
  {
    title: "Get in Touch",
    href: "#contact",
  },
];

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-700/50">

      {/* Darker background, darker border */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex items-center justify-between h-16">
          {/* Logo/Brand */}
          <div className="flex-shrink-0">
            <a
              href="/"
              className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-200 to-white transition-all duration-300"
              // Lighter gradient to pop on dark background
            >
              Ayan Osman
            </a>
          </div>

          {/* Navigation Links */}
          <ul className="flex items-center space-x-8">
            {links.map((link, index) => (
              <li key={link.title}>
                <a
                  href={link.href}
                  onClick={(e) => {
                    e.preventDefault();
                    document.querySelector(link.href)?.scrollIntoView({
                      behavior: "smooth",
                      block: "start",
                    });
                  }}
                  className="relative text-slate-300 hover:text-white font-medium transition-all duration-300 group cursor-pointer"
                  // Lighter text, white on hover
                >
                  <span className="relative z-10">{link.title}</span>
                  {/* Hover effect background */}
                  <div className="absolute inset-0 -mx-3 -my-2 bg-blue-400/20 rounded-lg scale-0 group-hover:scale-100 transition-transform duration-300 ease-out"></div>
                  {/* Underline effect */}
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-400 to-cyan-400/60 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out origin-left"></div>
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}