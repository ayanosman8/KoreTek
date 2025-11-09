"use client";

import React, { useState, useEffect } from "react";
import { X, Send, Check } from "lucide-react";

interface InquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPackage?: string;
}

export default function InquiryModal({ isOpen, onClose, selectedPackage }: InquiryModalProps) {
  const [formData, setFormData] = useState({
    package: "",
    organization: "",
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const packageOptions = [
    "Landing Page ($1,999)",
    "Mobile App Package ($4,000)",
    "Full-Stack Web App ($9,999)",
    "Enterprise Solution ($19,999+)",
    "Not sure yet / Custom",
  ];

  // Set selected package when modal opens
  useEffect(() => {
    if (isOpen && selectedPackage) {
      setFormData(prev => ({ ...prev, package: selectedPackage }));
    }
  }, [isOpen, selectedPackage]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    console.log("Form submitted:", formData);
    // You can add your form submission logic here
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="relative bg-gradient-to-br from-gray-900 to-black border border-white/10 rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Background effects */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/3 via-transparent to-blue-500/3 rounded-3xl"></div>
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>

        {/* Content */}
        <div className="relative p-8 md:p-12">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-4xl md:text-5xl font-extralight text-white mb-2">
                Get Started
              </h2>
              <p className="text-white/60 font-light">
                Tell us about your project
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-3 rounded-xl hover:bg-white/10 transition-all duration-300 text-white/60 hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Package Selection */}
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Package Interest <span className="text-white/40 font-light text-xs">(You can change this anytime)</span>
              </label>
              <select
                required
                value={formData.package}
                onChange={(e) =>
                  setFormData({ ...formData, package: e.target.value })
                }
                className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-xl text-white focus:border-blue-500/40 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 appearance-none cursor-pointer"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='rgba(255,255,255,0.4)'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 1rem center',
                  backgroundSize: '1.5em 1.5em',
                  paddingRight: '3rem',
                }}
              >
                <option value="" className="bg-gray-900">Select a package...</option>
                {packageOptions.map((pkg) => (
                  <option key={pkg} value={pkg} className="bg-gray-900">
                    {pkg}
                  </option>
                ))}
              </select>
              {selectedPackage && (
                <p className="mt-2 text-xs text-blue-400 flex items-center gap-1">
                  <Check className="w-3 h-3" />
                  Pre-selected based on your interest
                </p>
              )}
              <p className="mt-2 text-xs text-white/40 font-light italic">
                This is just to help us understand your needs - nothing is locked in yet
              </p>
            </div>

            {/* Organization/Company Name */}
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Organization / Company Name
              </label>
              <input
                type="text"
                required
                value={formData.organization}
                onChange={(e) =>
                  setFormData({ ...formData, organization: e.target.value })
                }
                className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:border-blue-500/40 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-300"
                placeholder="Acme Corporation"
              />
            </div>

            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Your Name
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:border-blue-500/40 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-300"
                placeholder="John Doe"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Email
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:border-blue-500/40 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-300"
                placeholder="john@example.com"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Phone <span className="text-white/40 font-light text-xs">(Optional)</span>
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:border-blue-500/40 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-300"
                placeholder="(555) 123-4567"
              />
            </div>

            {/* Message */}
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Tell us about your project <span className="text-white/40 font-light">(Optional)</span>
              </label>
              <textarea
                value={formData.message}
                onChange={(e) =>
                  setFormData({ ...formData, message: e.target.value })
                }
                rows={4}
                className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:border-blue-500/40 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 resize-none"
                placeholder="Any specific features or requirements you have in mind?"
              />
            </div>

            {/* Submit Button */}
            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-8 py-4 text-white/80 border border-white/10 rounded-xl hover:bg-white/5 transition-all duration-300 font-light"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-8 py-4 text-white bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 font-medium inline-flex items-center justify-center gap-2"
              >
                Send Inquiry
                <Send className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
