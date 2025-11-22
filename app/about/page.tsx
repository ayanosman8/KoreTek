import Header from "../components/Header";
import { Target, Users, Zap, Shield, Linkedin, Twitter } from "lucide-react";

const values = [
  {
    icon: <Zap className="w-8 h-8" />,
    title: "Cutting-Edge Tech",
    description: "We leverage the latest technologies to build solutions that are fast, scalable, and future-proof.",
  },
  {
    icon: <Target className="w-8 h-8" />,
    title: "User-Centric Design",
    description: "Every product we build puts the end-user first, ensuring intuitive and delightful experiences.",
  },
  {
    icon: <Users className="w-8 h-8" />,
    title: "Client Partnership",
    description: "We work closely with you from start to finish, ensuring a smooth, personalized experience.",
  },
  {
    icon: <Shield className="w-8 h-8" />,
    title: "Enterprise Quality",
    description: "We deliver enterprise-grade solutions that are reliable, secure, and built to scale.",
  },
];

const teamMembers = [
  {
    name: "Ayan Osman",
    role: "Chief Technology Officer",
    bio: "10+ years building scalable web and mobile applications. Expert in React, Node.js, and cloud architecture.",
    linkedin: "#",
    twitter: "#",
  },
  {
    name: "Hayat Kore",
    role: "Sales & Client Success",
    bio: "10+ years of experience in client success, sales, and account management driving business growth.",
    linkedin: "#",
    twitter: "#",
  },
  {
    name: "Sahra Osman",
    role: "Operations",
    bio: "Passionate about creating innovative solutions and delivering exceptional results.",
    linkedin: "#",
    twitter: "#",
  },
];

export default function AboutPage() {
  return (
    <>
      <Header />
      <div className="bg-gradient-to-br from-black via-gray-900 to-black min-h-screen">
        {/* Hero Section */}
        <div className="pt-32 pb-20 px-4 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/3 via-transparent to-blue-500/3"></div>
          <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>

          <div className="max-w-4xl mx-auto text-center relative z-10">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extralight tracking-tight mb-6 text-white">
              About Us
            </h1>
            <p className="text-xl md:text-2xl font-light text-white/60 leading-relaxed">
              Building the future of digital experiences, one project at a time.
            </p>
          </div>
        </div>

        {/* Our Story Section */}
        <div className="py-20 px-4 relative">
          <div className="max-w-4xl mx-auto">
            <div className="relative rounded-3xl p-8 md:p-12 border backdrop-blur-xl overflow-hidden bg-gradient-to-br from-gray-900 to-black border-white/10 shadow-2xl">
              <h2 className="text-3xl md:text-4xl font-extralight text-white mb-8">Our Story</h2>

              <p className="text-lg md:text-xl font-light leading-relaxed text-white/80 mb-6">
                At <span className="text-blue-400 font-normal">KoreLnx</span>, we build tailored digital solutions by combining cutting-edge technology with bold design and practical functionality.
              </p>

              <p className="text-lg md:text-xl font-light leading-relaxed text-white/60 mb-6">
                In a world where complexity often overshadows simplicity, we craft enterprise-grade solutions that are intuitive, powerful, and designed with you in mind. Every product we build is a testament to our commitment to excellence and user-centric design.
              </p>

              <p className="text-lg md:text-xl font-light leading-relaxed text-white/60 mb-6">
                Beyond creating exceptional products, we pride ourselves on providing excellent customer service by working closely with each client to ensure a smooth, personalized experience from start to finish.
              </p>

              <p className="text-lg md:text-xl font-light leading-relaxed text-white/80">
                Our goal is to help businesses operate smarter, grow faster, and stand out with confidence&mdash;so you can focus on what matters most: <span className="text-blue-400">delivering exceptional value to your clients</span>.
              </p>
            </div>
          </div>
        </div>

        {/* Values Section */}
        <div className="py-20 px-4 relative">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-extralight text-white text-center mb-16">Our Values</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((value, index) => (
                <div
                  key={index}
                  className="group relative rounded-2xl p-8 border backdrop-blur-xl overflow-hidden transition-all duration-500 bg-gradient-to-br from-gray-900/50 to-black/50 border-white/10 hover:border-blue-500/40 shadow-xl hover:shadow-blue-500/10"
                >
                  <div className="text-blue-500 mb-4">
                    {value.icon}
                  </div>
                  <h3 className="text-xl font-light mb-3 text-white">
                    {value.title}
                  </h3>
                  <p className="text-sm font-light leading-relaxed text-white/50">
                    {value.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="py-20 px-4 relative overflow-hidden">
          <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>

          <div className="max-w-6xl mx-auto relative z-10">
            <div className="text-center mb-16">
              <div className="inline-block px-5 py-2.5 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 backdrop-blur-sm rounded-full border border-blue-400/30 mb-6 shadow-lg shadow-blue-500/10">
                <span className="text-sm font-semibold text-blue-300 tracking-wide uppercase">Our Team</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-extralight tracking-tight mb-6 text-white">
                Meet the Minds
              </h2>
              <p className="text-xl font-light max-w-3xl mx-auto text-white/60 leading-relaxed">
                A passionate team dedicated to building exceptional digital experiences.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {teamMembers.map((member, index) => (
                <div
                  key={index}
                  className="group relative rounded-3xl p-10 border backdrop-blur-xl overflow-hidden transition-all duration-500 bg-gradient-to-br from-gray-900 to-black border-white/10 hover:border-blue-500/40 shadow-2xl hover:shadow-blue-500/10"
                >
                  <div className="flex flex-col items-center mb-6">
                    <div className="relative mb-5">
                      <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border-2 border-blue-500/30 flex items-center justify-center overflow-hidden">
                        <div className="text-4xl font-extralight text-blue-500">
                          {member.name.charAt(0)}
                        </div>
                      </div>
                      <div className="absolute bottom-1 right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-gray-900"></div>
                    </div>

                    <h3 className="text-xl font-extralight text-white mb-1 text-center">
                      {member.name}
                    </h3>
                    <p className="text-blue-400 text-xs font-medium uppercase tracking-wider mb-4">
                      {member.role}
                    </p>
                  </div>

                  <p className="text-white/60 font-light leading-relaxed text-center text-sm mb-6">
                    {member.bio}
                  </p>

                  <div className="flex items-center justify-center gap-3">
                    <a
                      href={member.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2.5 rounded-xl bg-white/5 border border-white/10 hover:border-blue-500/40 hover:bg-blue-500/10 transition-all duration-300 text-white/60 hover:text-blue-400"
                    >
                      <Linkedin className="w-4 h-4" />
                    </a>
                    <a
                      href={member.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2.5 rounded-xl bg-white/5 border border-white/10 hover:border-blue-500/40 hover:bg-blue-500/10 transition-all duration-300 text-white/60 hover:text-blue-400"
                    >
                      <Twitter className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="py-20 px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-extralight text-white mb-6">
              Ready to work together?
            </h2>
            <p className="text-lg text-white/60 font-light mb-8">
              Let&apos;s build something amazing.
            </p>
            <a
              href="/#contact"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 font-medium shadow-lg shadow-blue-500/20"
            >
              Get in Touch
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
