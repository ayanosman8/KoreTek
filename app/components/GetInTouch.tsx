import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub } from "@fortawesome/free-brands-svg-icons"; // For GitHub (Brands icon)
import { faEnvelope } from "@fortawesome/free-solid-svg-icons"; // For Email (Solid icon, usually an envelope)
import Link from "next/link";

export default function GetInTouch() {
  const contactLinks = [
    {
      title: "Email",
      href: "mailto:akay@gmail.com", // Use mailto: for email links
      icon: faEnvelope, // Use the imported Font Awesome icon object
    },
    {
      title: "GitHub",
      href: "https://github.com/me", // Full URL recommended
      icon: faGithub, // Use the imported Font Awesome icon object
    },
  ];

  return (
    <div
      className="bg-gradient-to-br from-slate-950 to-slate-800 py-16 px-4" // Darker gradient background
      id="contact"
    >
      <div className="max-w-xl mx-auto text-center">
        <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-white via-blue-200 to-white mb-8">
 
          {/* Lighter gradient for heading */}
          Get In Touch
        </h2>
        <p className="text-lg text-slate-300 mb-10">
    
      
          Feel free to reach out for collaborations, questions, or just to say
          hello!
        </p>

        <div className="flex flex-col md:flex-row justify-center items-center gap-8">
          {contactLinks.map((link, index) => (
            <Link
              key={index}
              href={link.href}
              className="flex items-center space-x-3 text-slate-200 hover:text-blue-400 transition-colors duration-300 group"
              // Default text color very light, hover color a vibrant accent
              target="_blank"
              rel="noopener noreferrer"
            >
              <FontAwesomeIcon
                icon={link.icon}
                className="text-3xl group-hover:scale-110 transition-transform duration-300"
              />
              <span className="text-xl font-medium">{link.title}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}