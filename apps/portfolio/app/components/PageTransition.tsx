"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const overlayRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [displayChildren, setDisplayChildren] = useState(children);
  const isFirstRender = useRef(true);

  useEffect(() => {
    // Skip animation on first render
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const overlay = overlayRef.current;
    const content = contentRef.current;

    if (!overlay || !content) return;

    // Timeline for the transition
    const tl = gsap.timeline();

    // Phase 1: Overlay slides in from left
    tl.set(overlay, { xPercent: -100 })
      .to(overlay, {
        xPercent: 0,
        duration: 0.5,
        ease: "power4.inOut",
      })
      // Phase 2: Update content while overlay covers screen
      .add(() => {
        setDisplayChildren(children);
        window.scrollTo(0, 0);
      })
      // Small pause while fully covered
      .to({}, { duration: 0.1 })
      // Phase 3: Overlay slides out to right
      .to(overlay, {
        xPercent: 100,
        duration: 0.5,
        ease: "power4.inOut",
      });

  }, [pathname, children]);

  return (
    <div className="relative">
      {/* Transition Overlay */}
      <div
        ref={overlayRef}
        className="fixed inset-0 z-[100] pointer-events-none"
        style={{ transform: "translateX(-100%)" }}
      >
        {/* Main overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-500" />

        {/* Logo/branding in center during transition */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-white text-4xl font-bold tracking-tight">
            KoreLnx
          </div>
        </div>
      </div>

      {/* Page Content */}
      <div ref={contentRef}>
        {displayChildren}
      </div>
    </div>
  );
}
