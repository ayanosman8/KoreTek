"use client";

import React, { useState } from "react";
import { ArrowRight, Mail, Phone, Send, Check } from "lucide-react";
import { z } from "zod";

const contactSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Please enter a valid email address"),
  message: z.string().min(1, "Message is required"),
});

export default function GetInTouch() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    message: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Validate with Zod
    const result = contactSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        if (issue.path[0]) {
          fieldErrors[issue.path[0].toString()] = issue.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          message: formData.message,
          package: "Quick Contact",
          projectType: "contact",
        }),
      });

      if (response.ok) {
        setSubmitSuccess(true);
        setFormData({ firstName: "", lastName: "", email: "", message: "" });
        setTimeout(() => setSubmitSuccess(false), 5000);
      }
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: <Mail className="w-6 h-6" />,
      label: "Email",
      value: "info@korelnx.com",
      href: "mailto:info@korelnx.com",
    },
    {
      icon: <Phone className="w-6 h-6" />,
      label: "Phone",
      value: "(614) 804-0905",
      href: "tel:+16148040905",
    },
  ];

  return (
    <div
      className="bg-gradient-to-br from-black via-gray-900 to-black py-20 px-4 md:py-32 relative overflow-hidden"
      id="contact"
    >
        {/* Background decorative elements */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/3 via-transparent to-blue-500/3"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-20 right-20 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>

        <div className="w-full px-8 lg:px-16 relative z-10">
          <div className="max-w-6xl mx-auto">
            {/* Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
              {/* Left - Heading & CTA */}
              <div>
                <h2 className="text-6xl md:text-7xl lg:text-8xl font-extralight tracking-tight text-white leading-none mb-8">
                  <span className="block">Get in</span>
                  <span className="block text-blue-500">Touch</span>
                </h2>

                <p className="text-xl font-light text-white/60 leading-relaxed max-w-md">
                  Have a project in mind? We&apos;d love to hear about it. Let&apos;s create something amazing together.
                </p>
              </div>

              {/* Right - Contact Info Cards */}
              <div className="space-y-6">
                {contactInfo.map((item, index) => (
                  <div
                    key={index}
                    className="group relative"
                  >
                    {item.href ? (
                      <a
                        href={item.href}
                        className="block p-6 rounded-2xl border border-white/10 bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-sm hover:border-blue-500/40 hover:bg-blue-500/5 transition-all duration-300"
                      >
                        <div className="flex items-center gap-6">
                          <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-500 group-hover:bg-blue-500/20 group-hover:scale-110 transition-all duration-300">
                            {item.icon}
                          </div>
                          <div>
                            <div className="text-sm text-white/40 uppercase tracking-wider font-medium mb-1">
                              {item.label}
                            </div>
                            <div className="text-xl font-light text-white group-hover:text-blue-400 transition-colors">
                              {item.value}
                            </div>
                          </div>
                          <ArrowRight className="w-5 h-5 text-white/20 group-hover:text-blue-500 group-hover:translate-x-2 transition-all duration-300 ml-auto" />
                        </div>
                      </a>
                    ) : (
                      <div className="block p-6 rounded-2xl border border-white/10 bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-sm">
                        <div className="flex items-center gap-6">
                          <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-500">
                            {item.icon}
                          </div>
                          <div>
                            <div className="text-sm text-white/40 uppercase tracking-wider font-medium mb-1">
                              {item.label}
                            </div>
                            <div className="text-xl font-light text-white">
                              {item.value}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}

                {/* Quick Contact Form */}
                <form onSubmit={handleSubmit} className="mt-8 p-6 rounded-2xl border border-white/10 bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-sm space-y-4">
                  <h3 className="text-lg font-light text-white mb-4">Send us a message</h3>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <input
                        type="text"
                        placeholder="First name"
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        className={`w-full px-4 py-3 bg-white/5 border ${errors.firstName ? 'border-red-500' : 'border-white/10'} rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-blue-500/50 transition-all`}
                      />
                      {errors.firstName && <p className="text-red-400 text-xs mt-1">{errors.firstName}</p>}
                    </div>
                    <div>
                      <input
                        type="text"
                        placeholder="Last name"
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                        className={`w-full px-4 py-3 bg-white/5 border ${errors.lastName ? 'border-red-500' : 'border-white/10'} rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-blue-500/50 transition-all`}
                      />
                      {errors.lastName && <p className="text-red-400 text-xs mt-1">{errors.lastName}</p>}
                    </div>
                  </div>

                  <div>
                    <input
                      type="email"
                      placeholder="Your email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className={`w-full px-4 py-3 bg-white/5 border ${errors.email ? 'border-red-500' : 'border-white/10'} rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-blue-500/50 transition-all`}
                    />
                    {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
                  </div>

                  <div>
                    <textarea
                      placeholder="Your message"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      rows={4}
                      className={`w-full px-4 py-3 bg-white/5 border ${errors.message ? 'border-red-500' : 'border-white/10'} rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-blue-500/50 transition-all resize-none`}
                    />
                    {errors.message && <p className="text-red-400 text-xs mt-1">{errors.message}</p>}
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting || submitSuccess}
                    className="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium rounded-xl transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {submitSuccess ? (
                      <>
                        <Check className="w-5 h-5" />
                        Message Sent!
                      </>
                    ) : isSubmitting ? (
                      "Sending..."
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        Send Message
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
    </div>
  );
}