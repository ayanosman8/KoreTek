"use client";

import React, { useState, useEffect } from "react";
import { Type, X } from "lucide-react";

const fonts = [
  { name: "Inter", value: "Inter" },
  { name: "Geist", value: "var(--font-geist-sans)" },
  { name: "Poppins", value: "Poppins" },
  { name: "Roboto", value: "Roboto" },
  { name: "Montserrat", value: "Montserrat" },
  { name: "Space Grotesk", value: "Space Grotesk" },
  { name: "Outfit", value: "Outfit" },
  { name: "DM Sans", value: "DM Sans" },
  { name: "Work Sans", value: "Work Sans" },
  { name: "Manrope", value: "Manrope" },
];

export default function FontPicker() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFont, setSelectedFont] = useState("Geist");
  const [loadedFonts, setLoadedFonts] = useState<Set<string>>(new Set(["Geist"]));

  const loadFont = (fontName: string) => {
    if (loadedFonts.has(fontName) || fontName.includes("var(")) return;

    const link = document.createElement("link");
    link.href = `https://fonts.googleapis.com/css2?family=${fontName.replace(
      / /g,
      "+"
    )}:wght@300;400;500;600;700;800&display=swap`;
    link.rel = "stylesheet";
    document.head.appendChild(link);

    setLoadedFonts((prev) => new Set([...prev, fontName]));
  };

  const changeFont = (fontValue: string, fontName: string) => {
    setSelectedFont(fontName);
    loadFont(fontName);

    // Apply font to header
    const header = document.querySelector("header");
    if (header) {
      header.style.fontFamily = fontValue;
    }

    // Target header elements
    document.querySelectorAll("header h1, header h2, header h3, header p, header span, header button").forEach((el) => {
      (el as HTMLElement).style.fontFamily = fontValue;
    });

    // Target promo banner - get the first div after header
    const promoBanner = document.querySelector("header + div");
    if (promoBanner) {
      promoBanner.style.fontFamily = fontValue;
      promoBanner.querySelectorAll("*").forEach((el) => {
        (el as HTMLElement).style.fontFamily = fontValue;
      });
    }

    // Target hero section - look for the gradient div
    const heroSection = document.querySelector("[class*='gradient']");
    if (heroSection) {
      heroSection.style.fontFamily = fontValue;
      heroSection.querySelectorAll("h1, h2, h3, h4, h5, h6, p, span, button, a").forEach((el) => {
        (el as HTMLElement).style.fontFamily = fontValue;
      });
    }

    // Also target by looking for common hero patterns
    document.querySelectorAll("main > div:first-of-type, [class*='hero'], [class*='Hero'], [class*='banner'], [class*='Banner']").forEach((section) => {
      (section as HTMLElement).style.fontFamily = fontValue;
      section.querySelectorAll("h1, h2, h3, h4, h5, h6, p, span, button, a").forEach((el) => {
        (el as HTMLElement).style.fontFamily = fontValue;
      });
    });
  };

  useEffect(() => {
    // Preload popular fonts
    ["Inter", "Poppins", "Roboto"].forEach(loadFont);
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-[100]">
      {/* Font Picker Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group relative px-5 py-3 bg-gradient-to-r from-blue-500/90 to-purple-500/90 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl hover:shadow-blue-500/50 transition-all duration-300 flex items-center gap-2"
        >
          <Type className="w-5 h-5 text-white" />
          <span className="text-white font-medium text-sm">Font Preview</span>
        </button>
      )}

      {/* Font Picker Panel */}
      {isOpen && (
        <div className="bg-gradient-to-br from-gray-900/95 to-black/95 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl p-6 w-80">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Type className="w-5 h-5 text-blue-400" />
              <h3 className="text-white font-semibold">Choose Font</h3>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <X className="w-4 h-4 text-white/60" />
            </button>
          </div>

          {/* Current Font */}
          <div className="mb-4 p-3 bg-blue-500/10 border border-blue-500/30 rounded-xl">
            <p className="text-xs text-blue-400 mb-1">Current Font</p>
            <p className="text-white font-semibold">{selectedFont}</p>
          </div>

          {/* Font List */}
          <div className="space-y-2 max-h-96 overflow-y-auto modal-scrollbar">
            {fonts.map((font) => (
              <button
                key={font.name}
                onClick={() => changeFont(font.value, font.name)}
                className={`w-full text-left p-4 rounded-xl transition-all duration-300 border ${
                  selectedFont === font.name
                    ? "bg-blue-500/20 border-blue-500/50 shadow-lg shadow-blue-500/20"
                    : "bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20"
                }`}
                style={{ fontFamily: font.value }}
              >
                <p className="text-white font-medium mb-1">{font.name}</p>
                <p className="text-white/50 text-sm">
                  The quick brown fox jumps over the lazy dog
                </p>
              </button>
            ))}
          </div>

          {/* Info */}
          <div className="mt-4 p-3 bg-white/5 rounded-xl">
            <p className="text-white/50 text-xs text-center">
              Click any font to preview it on the entire page
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
