"use client";

import { ArrowRight, ExternalLink } from "lucide-react";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel"; // Adjust import path if needed

export default function Projects() {
  const [api, setApi] = useState<CarouselApi>();
  const [currentSlide, setCurrentSlide] = useState(0);

  const projects = [
    {
      name: "Clarity",
      description: "A Journal app that helps you track your mood and thoughts.",
      images: [
        {
          src: "/clarity.png",
          alt: "Clarity Main Interface",
        },
        {
          src: "/clarity-home.png",
          alt: "Clarity Home",
        },
        {
          src: "/clarity-login.png",
          alt: "Clarity Login",
        },
        {
          src: "/clarity-analytics.png",
          alt: "Clarity Analytics",
        },
      ],
      link: "https://journal-app-three-alpha.vercel.app/",
      tech: ["Next.js", "React", "TypeScript", "Tailwind CSS"],
    },
    // {
    //   name: "Project Nova",
    //   description: "A comprehensive project management tool for teams.",
    //   images: [
    //     { src: "/project-nova-dashboard.png", alt: "Project Nova Dashboard" },
    //     { src: "/project-nova-tasks.png", alt: "Project Nova Tasks" },
    //     { src: "/project-nova-settings.png", alt: "Project Nova Settings" },
    //   ],
    //   link: "https://project-nova.vercel.app/",
    //   tech: ["Node.js", "Express", "MongoDB", "React", "Material-UI"],
    // },
    // {
    //   name: "Recipe Finder",
    //   description:
    //     "Discover and save recipes with an intuitive search and filter.",
    //   images: [
    //     { src: "/recipe-finder-search.png", alt: "Recipe Finder Search" },
    //     { src: "/recipe-finder-details.png", alt: "Recipe Finder Details" },
    //   ],
    //   link: "https://recipe-finder-example.vercel.app/",
    //   tech: ["React", "API Integration", "CSS Modules"],
    // },
  ];

  // Sync carousel slide with state
  useEffect(() => {
    if (!api) {
      return;
    }
    setCurrentSlide(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrentSlide(api.selectedScrollSnap());
    });
  }, [api]);

  // Framer Motion variants for scroll animation of project cards
  const projectVariants = {
    initial: { opacity: 0, y: 100 },
    whileInView: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  // Variants for header text elements (fade in from top)
  const headerVariants = {
    initial: { opacity: 0, y: -30 },
    animate: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
    whileInView: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  return (
    // Main background: Darker gradient
    <div
      id="projects"
      className="bg-gradient-to-br from-slate-950 to-slate-800 py-12 px-4 md:py-16"
    >
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12 md:mb-16">
          <motion.div
            initial="initial"
            animate="animate"
            variants={headerVariants}
          >
            <motion.div // Portfolio badge
              initial="initial"
              animate="animate"
              variants={headerVariants}
              className="inline-block px-3 py-1.5 bg-gradient-to-r from-blue-400 to-cyan-400/70 rounded-full text-sm font-medium text-slate-900 mb-3" // Darker accent
            >
              Portfolio
            </motion.div>

            <motion.h1 // Project section title
              initial="initial"
              animate="animate"
              variants={headerVariants}
              className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-white via-blue-200 to-white mb-2" // Lighter gradient to pop on dark
            >
              Check out my projects!
            </motion.h1>

            <motion.p // Description text
              initial="initial"
              animate="animate"
              variants={headerVariants}
              className="text-lg text-slate-300 max-w-2xl mx-auto" // Lighter text color
            >
              Crafted with attention to detail and user experience in mind
            </motion.p>
          </motion.div>
        </div>

        {/* Projects Section */}
        <div className="space-y-16 md:space-y-20">
          {projects.map((project, projectIndex) => (
            <motion.div // Project card
              key={project.name}
              variants={projectVariants}
              initial="initial"
              whileInView="whileInView"
              viewport={{ once: true, amount: 0.2 }}
              className="bg-slate-900 rounded-2xl shadow-lg overflow-hidden border border-slate-700" // Dark card background, darker border
            >
              {/* Project Header and Actions */}
              <div className="p-5 md:p-6 bg-gradient-to-r from-blue-400/20 to-cyan-400/10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-1.5">
                    {project.name}
                  </h2>
                  <p className="text-base text-slate-300 max-w-2xl">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {project.tech?.map((tech) => (
                      <span
                        key={tech}
                        className="px-2.5 py-0.5 bg-slate-800 text-blue-300 text-xs rounded-full border border-slate-700" // Dark tech pills, lighter text
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 bg-gradient-to-r from-blue-400 to-cyan-400/80 text-slate-900 px-4 py-2 rounded-lg font-medium text-sm hover:from-blue-500 hover:to-cyan-500 transition-all duration-300 hover:scale-105 shadow-md" // Darker accent button
                >
                  <span>View Project</span>
                  <ExternalLink size={16} />
                </a>
              </div>

              {/* Image Carousel */}
              <div className="p-5">
                <Carousel
                  setApi={setApi}
                  className="w-full relative group"
                  opts={{
                    loop: true,
                  }}
                >
                  <CarouselContent>
                    {project.images?.map((image, index) => (
                      <CarouselItem key={index}>
                        <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-800 shadow-md">
                          {" "}
                          {/* Darker placeholder background */}
                          <Image
                            src={image.src}
                            alt={image.alt}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 900px"
                          />
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious className="absolute left-3 top-1/2 -translate-y-1/2 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 w-8 h-8 bg-slate-700 text-white hover:bg-slate-600" />
                  <CarouselNext className="absolute right-3 top-1/2 -translate-y-1/2 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 w-8 h-8 bg-slate-700 text-white hover:bg-slate-600" />
                  {/* Darker navigation buttons */}
                  {/* Dot navigation */}
                  <div className="flex justify-center mt-3 gap-1.5">
                    {project.images?.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => api?.scrollTo(index)}
                        className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                          currentSlide === index
                            ? "bg-blue-400 scale-125" // Darker accent for active dot
                            : "bg-slate-600 hover:bg-slate-500" // Darker dots
                        }`}
                        aria-label={`Go to slide ${index + 1}`}
                      />
                    ))}
                  </div>
                </Carousel>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}