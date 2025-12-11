"use client";

import React from "react";
import Divider from "./Divider";

export default function Skills() {
  const tech = [
    "TypeScript",
    "React",
    "NextJS",
    "NodeJS",
    "ExpressJS",
    "MongoDB",
    "PostgreSQL",
    "SQL",
    "Git",
    "GitHub",
    "Figma",
  ];


  return (
    <section className="gap-4 flex justify-center items-center">
     

      <div className="flex flex-wrap gap-4 justify-center mt-8">
        {tech.map((tech, index) => (
          <div key={index}
         
            className="border border-gray-300 rounded-md px-4 py-2 text-gray-700"
          >
            {tech}
          </div>
         
        ))}
        <Divider />
      </div>
    </section>
  );
}
