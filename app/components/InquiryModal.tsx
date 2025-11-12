"use client";

import React, { useState, useEffect } from "react";
import { X, Send, Check } from "lucide-react";
import { toast } from "sonner";
import SuccessModal from "./SuccessModal";

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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [showSuccessModal, setShowSuccessModal] = useState(false);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to send email');
      }

      setSubmitStatus('success');

      // Show success modal
      setShowSuccessModal(true);

      // Reset form
      setFormData({
        package: "",
        organization: "",
        name: "",
        email: "",
        phone: "",
        message: "",
      });
      setSubmitStatus('idle');

      // Close the inquiry form modal
      onClose();
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitStatus('error');

      // Try to get error details from response
      let errorDetails = 'Please try again or email us directly at ayanosman8@gmail.com';
      if (error instanceof Error) {
        errorDetails = error.message;
      }

      // Show error toast with details
      toast.error('Failed to send your inquiry', {
        description: errorDetails,
        duration: 8000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return (
    <>
      <SuccessModal isOpen={showSuccessModal} onClose={() => setShowSuccessModal(false)} />
    </>
  );

  return (
    <>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 md:p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="relative bg-gradient-to-br from-gray-900 to-black border border-white/10 rounded-2xl md:rounded-3xl shadow-2xl max-w-md md:max-w-lg lg:max-w-xl w-full max-h-[92vh] overflow-y-auto modal-scrollbar">
        {/* Background effects */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/3 via-transparent to-blue-500/3 rounded-3xl"></div>
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>

        {/* Content */}
        <div className="relative p-5 md:p-6 lg:p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-4 md:mb-6">
            <div>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-extralight text-white mb-1">
                Get Started
              </h2>
              <p className="text-xs md:text-sm text-white/60 font-light">
                Tell us about your project
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 md:p-3 rounded-xl hover:bg-white/10 transition-all duration-300 text-white/60 hover:text-white flex-shrink-0"
            >
              <X className="w-5 h-5 md:w-6 md:h-6" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3 md:space-y-4">
            {/* Package Selection */}
            <div>
              <label className="block text-xs md:text-sm font-medium text-white/80 mb-1.5">
                Package Interest <span className="text-white/40 font-light text-xs">(Optional)</span>
              </label>
              <select
                required
                value={formData.package}
                onChange={(e) =>
                  setFormData({ ...formData, package: e.target.value })
                }
                className="w-full px-3 py-2.5 md:px-4 md:py-3 bg-white/5 border border-white/10 rounded-lg md:rounded-xl text-white text-xs md:text-sm focus:border-blue-500/40 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 appearance-none cursor-pointer"
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
                <p className="mt-1 text-[10px] md:text-xs text-blue-400 flex items-center gap-1">
                  <Check className="w-3 h-3" />
                  Pre-selected based on your interest
                </p>
              )}
            </div>

            {/* Organization/Company Name */}
            <div>
              <label className="block text-xs md:text-sm font-medium text-white/80 mb-1.5">
                Organization / Company Name
              </label>
              <input
                type="text"
                required
                value={formData.organization}
                onChange={(e) =>
                  setFormData({ ...formData, organization: e.target.value })
                }
                className="w-full px-3 py-2.5 md:px-4 md:py-3 bg-white/5 border border-white/10 rounded-lg md:rounded-xl text-white text-xs md:text-sm placeholder-white/40 focus:border-blue-500/40 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-300"
                placeholder="Acme Corporation"
              />
            </div>

            {/* Name */}
            <div>
              <label className="block text-xs md:text-sm font-medium text-white/80 mb-1.5">
                Your Name
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full px-3 py-2.5 md:px-4 md:py-3 bg-white/5 border border-white/10 rounded-lg md:rounded-xl text-white text-xs md:text-sm placeholder-white/40 focus:border-blue-500/40 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-300"
                placeholder="John Doe"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs md:text-sm font-medium text-white/80 mb-1.5">
                Email
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full px-3 py-2.5 md:px-4 md:py-3 bg-white/5 border border-white/10 rounded-lg md:rounded-xl text-white text-xs md:text-sm placeholder-white/40 focus:border-blue-500/40 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-300"
                placeholder="john@example.com"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-xs md:text-sm font-medium text-white/80 mb-1.5">
                Phone <span className="text-white/40 font-light text-[10px] md:text-xs">(Optional)</span>
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                className="w-full px-3 py-2.5 md:px-4 md:py-3 bg-white/5 border border-white/10 rounded-lg md:rounded-xl text-white text-xs md:text-sm placeholder-white/40 focus:border-blue-500/40 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-300"
                placeholder="(555) 123-4567"
              />
            </div>

            {/* Message */}
            <div>
              <label className="block text-xs md:text-sm font-medium text-white/80 mb-1.5">
                Tell us about your project <span className="text-white/40 font-light text-[10px] md:text-xs">(Optional)</span>
              </label>
              <textarea
                value={formData.message}
                onChange={(e) =>
                  setFormData({ ...formData, message: e.target.value })
                }
                rows={2}
                className="w-full px-3 py-2.5 md:px-4 md:py-3 bg-white/5 border border-white/10 rounded-lg md:rounded-xl text-white text-xs md:text-sm placeholder-white/40 focus:border-blue-500/40 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 resize-none"
                placeholder="Any specific features or requirements you have in mind?"
              />
            </div>

            {/* Submit Button */}
            <div className="flex gap-2 md:gap-3 pt-2 md:pt-3">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="flex-1 px-4 py-2.5 md:px-6 md:py-3 text-xs md:text-sm text-white/80 border border-white/10 rounded-lg md:rounded-xl hover:bg-white/5 transition-all duration-300 font-light disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 px-4 py-2.5 md:px-6 md:py-3 text-xs md:text-sm text-white bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg md:rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 font-medium inline-flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    Sending...
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  </>
                ) : submitStatus === 'success' ? (
                  <>
                    Sent!
                    <Check className="w-4 h-4" />
                  </>
                ) : (
                  <>
                    Send Inquiry
                    <Send className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
    <SuccessModal isOpen={showSuccessModal} onClose={() => setShowSuccessModal(false)} />
    </>
  );
}
