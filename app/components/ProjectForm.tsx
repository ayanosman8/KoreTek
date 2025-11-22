"use client";

import React, { useState, useEffect } from "react";
import { X, Check, Globe, Smartphone, Layers, Send } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { z } from "zod";

interface ProjectFormProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPackage?: string;
}

// Validation schemas
const emailSchema = z
  .string()
  .min(1, "Email is required")
  .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Please enter a valid email address");
const phoneSchema = z.string().min(10, "Phone number must be at least 10 digits");
const requiredSchema = z.string().min(1, "This field is required");

export default function ProjectForm({ isOpen, onClose, selectedPackage = "" }: ProjectFormProps) {
  const [formData, setFormData] = useState({
    pricingPackage: selectedPackage,
    package: "",
    firstName: "",
    lastName: "",
    email: "",
    projectType: "",
    company: "",
    phone: "",
    message: "",
    hasWebsite: "",
    websiteUrl: "",
    industry: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Update pricingPackage when selectedPackage prop changes
  useEffect(() => {
    if (selectedPackage) {
      setFormData(prev => ({ ...prev, pricingPackage: selectedPackage }));
    }
  }, [selectedPackage]);

  const updateField = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: "" });
    }
  };

  const validateField = (field: string, value: string): string => {
    try {
      if (field === "email") {
        emailSchema.parse(value);
      } else if (field === "phone") {
        phoneSchema.parse(value);
      } else if (["firstName", "lastName"].includes(field)) {
        requiredSchema.parse(value);
      }
      return "";
    } catch (error) {
      if (error instanceof z.ZodError && error.errors && error.errors.length > 0) {
        return error.errors[0].message;
      }
      return "";
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.pricingPackage.trim()) {
      newErrors.pricingPackage = "Please select a package";
    }
    if (!formData.package.trim()) {
      newErrors.package = "Please select what you need";
    }
    if (!formData.projectType.trim()) {
      newErrors.projectType = "Please select project type";
    }
    if (formData.projectType === "company" && !formData.company.trim()) {
      newErrors.company = "Business name is required";
    }
    if (!formData.industry.trim()) {
      newErrors.industry = "Please select an industry";
    }
    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }
    const emailError = validateField("email", formData.email);
    if (emailError) newErrors.email = emailError;
    const phoneError = validateField("phone", formData.phone);
    if (phoneError) newErrors.phone = phoneError;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
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
          projectType: formData.projectType,
          company: formData.projectType === "company" ? formData.company : null,
          phone: formData.phone,
          pricingPackage: formData.pricingPackage,
          package: formData.package,
          industry: formData.industry,
          hasWebsite: formData.hasWebsite,
          websiteUrl: formData.hasWebsite === "yes" ? formData.websiteUrl : null,
          message: formData.message,
        }),
      });

      if (response.ok) {
        setSubmitSuccess(true);
        setTimeout(() => {
          handleClose();
        }, 3000);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({
      pricingPackage: selectedPackage,
      package: "",
      firstName: "",
      lastName: "",
      email: "",
      projectType: "",
      company: "",
      phone: "",
      message: "",
      hasWebsite: "",
      websiteUrl: "",
      industry: "",
    });
    setErrors({});
    setSubmitSuccess(false);
    onClose();
  };

  const industries = [
    "E-commerce",
    "Healthcare",
    "Finance",
    "Education",
    "Real Estate",
    "Food & Beverage",
    "Technology",
    "Entertainment",
    "Professional Services",
    "Non-Profit",
    "Manufacturing",
    "Other"
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          />

          {/* Sheet */}
          <motion.div
            key="sheet"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-3xl bg-gradient-to-br from-gray-900 to-black border-l border-white/10 shadow-2xl overflow-y-auto modal-scrollbar"
          >
        {/* Background Effects */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/3 via-transparent to-blue-500/3"></div>
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
        </div>

        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-6 right-6 z-50 p-3 rounded-full bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10 transition-all duration-300"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Form Container */}
        <div className="relative z-10 min-h-full flex flex-col py-12 px-8 md:px-12">
        {!submitSuccess ? (
          <div className="w-full space-y-10">
              {/* Header */}
              <div className="text-center pt-12">
                <h1 className="text-3xl md:text-4xl font-extralight text-white mb-4">
                  Start Your Project
                </h1>
                <p className="text-base text-white/50 font-light">
                  Tell us about your vision and we&apos;ll bring it to life
                </p>
              </div>

            {/* Section 1: Choose Package */}
            <div className="space-y-4">
              <h2 className="text-xl font-light text-white">Choose a package</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div
                  onClick={() => updateField("pricingPackage", "Lightning")}
                  className={`p-5 rounded-xl border-2 transition-all duration-200 text-left cursor-pointer hover:border-blue-500/70 active:scale-95 ${
                    formData.pricingPackage === "Lightning"
                      ? "border-blue-500 bg-blue-500/10"
                      : "border-white/10 bg-white/5 hover:bg-white/10"
                  }`}
                >
                  <div className={`text-lg font-semibold ${formData.pricingPackage === "Lightning" ? "text-blue-400" : "text-white"}`}>Lightning</div>
                  <p className="text-2xl font-light text-blue-400 mt-1">$2,000</p>
                  <p className="text-sm text-white/40 mt-2">Small apps & landing pages</p>
                </div>
                <div
                  onClick={() => updateField("pricingPackage", "Bolt")}
                  className={`p-5 rounded-xl border-2 transition-all duration-200 text-left cursor-pointer hover:border-blue-500/70 active:scale-95 ${
                    formData.pricingPackage === "Bolt"
                      ? "border-blue-500 bg-blue-500/10"
                      : "border-white/10 bg-white/5 hover:bg-white/10"
                  }`}
                >
                  <div className={`text-lg font-semibold ${formData.pricingPackage === "Bolt" ? "text-blue-400" : "text-white"}`}>Bolt</div>
                  <p className="text-2xl font-light text-blue-400 mt-1">$8,000</p>
                  <p className="text-sm text-white/40 mt-2">Full-featured applications</p>
                </div>
                <div
                  onClick={() => updateField("pricingPackage", "Alpha")}
                  className={`p-5 rounded-xl border-2 transition-all duration-200 text-left cursor-pointer hover:border-blue-500/70 active:scale-95 ${
                    formData.pricingPackage === "Alpha"
                      ? "border-blue-500 bg-blue-500/10"
                      : "border-white/10 bg-white/5 hover:bg-white/10"
                  }`}
                >
                  <div className={`text-lg font-semibold ${formData.pricingPackage === "Alpha" ? "text-blue-400" : "text-white"}`}>Alpha</div>
                  <p className="text-2xl font-light text-blue-400 mt-1">$30,000</p>
                  <p className="text-sm text-white/40 mt-2">Enterprise solutions</p>
                </div>
              </div>
              {errors.pricingPackage && <p className="text-red-400 text-sm">{errors.pricingPackage}</p>}
            </div>

            {/* Section 2: What do you need? */}
            <div className="space-y-4">
              <h2 className="text-xl font-light text-white">What do you need?</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div
                  onClick={() => updateField("package", "Website")}
                  className={`p-5 rounded-xl border-2 transition-all duration-200 text-left cursor-pointer hover:border-blue-500/70 active:scale-95 ${
                    formData.package === "Website"
                      ? "border-blue-500 bg-blue-500/10"
                      : "border-white/10 bg-white/5 hover:bg-white/10"
                  }`}
                >
                  <Globe className={`w-8 h-8 mb-3 ${formData.package === "Website" ? "text-blue-400" : "text-white/60"}`} />
                  <div className={`text-lg font-light ${formData.package === "Website" ? "text-blue-400" : "text-white"}`}>Website</div>
                  <p className="text-sm text-white/40 mt-1">Web app or landing page</p>
                </div>
                <div
                  onClick={() => updateField("package", "Mobile App")}
                  className={`p-5 rounded-xl border-2 transition-all duration-200 text-left cursor-pointer hover:border-blue-500/70 active:scale-95 ${
                    formData.package === "Mobile App"
                      ? "border-blue-500 bg-blue-500/10"
                      : "border-white/10 bg-white/5 hover:bg-white/10"
                  }`}
                >
                  <Smartphone className={`w-8 h-8 mb-3 ${formData.package === "Mobile App" ? "text-blue-400" : "text-white/60"}`} />
                  <div className={`text-lg font-light ${formData.package === "Mobile App" ? "text-blue-400" : "text-white"}`}>Mobile App</div>
                  <p className="text-sm text-white/40 mt-1">iOS and Android app</p>
                </div>
                <div
                  onClick={() => updateField("package", "Both")}
                  className={`p-5 rounded-xl border-2 transition-all duration-200 text-left cursor-pointer hover:border-blue-500/70 active:scale-95 ${
                    formData.package === "Both"
                      ? "border-blue-500 bg-blue-500/10"
                      : "border-white/10 bg-white/5 hover:bg-white/10"
                  }`}
                >
                  <Layers className={`w-8 h-8 mb-3 ${formData.package === "Both" ? "text-blue-400" : "text-white/60"}`} />
                  <div className={`text-lg font-light ${formData.package === "Both" ? "text-blue-400" : "text-white"}`}>Both</div>
                  <p className="text-sm text-white/40 mt-1">Website + Mobile app</p>
                </div>
              </div>
              {errors.package && <p className="text-red-400 text-sm">{errors.package}</p>}
            </div>

            {/* Section 2: Project Type */}
            <div className="space-y-4">
              <h2 className="text-xl font-light text-white">Is this a personal or business project?</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div
                  onClick={() => {
                    setFormData({ ...formData, projectType: "personal", company: "" });
                    if (errors.projectType) setErrors({ ...errors, projectType: "" });
                  }}
                  className={`p-5 rounded-xl border-2 transition-all duration-200 text-left cursor-pointer hover:border-blue-500/70 active:scale-95 ${
                    formData.projectType === "personal"
                      ? "border-blue-500 bg-blue-500/10"
                      : "border-white/10 bg-white/5 hover:bg-white/10"
                  }`}
                >
                  <div className={`text-lg font-light ${formData.projectType === "personal" ? "text-blue-400" : "text-white"}`}>
                    Personal Project
                  </div>
                  <p className="text-sm text-white/40 mt-1">For myself or a side project</p>
                </div>
                <div
                  onClick={() => {
                    setFormData({ ...formData, projectType: "company" });
                    if (errors.projectType) setErrors({ ...errors, projectType: "" });
                  }}
                  className={`p-5 rounded-xl border-2 transition-all duration-200 text-left cursor-pointer hover:border-blue-500/70 active:scale-95 ${
                    formData.projectType === "company"
                      ? "border-blue-500 bg-blue-500/10"
                      : "border-white/10 bg-white/5 hover:bg-white/10"
                  }`}
                >
                  <div className={`text-lg font-light ${formData.projectType === "company" ? "text-blue-400" : "text-white"}`}>
                    Business Project
                  </div>
                  <p className="text-sm text-white/40 mt-1">For my business or organization</p>
                </div>
              </div>
              {errors.projectType && <p className="text-red-400 text-sm">{errors.projectType}</p>}

              {formData.projectType === "company" && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) => updateField("company", e.target.value)}
                    placeholder="Business name"
                    className={`w-full px-4 py-4 bg-white/5 border-2 ${errors.company ? "border-red-500" : "border-white/10"} rounded-xl text-white text-lg placeholder-white/30 focus:outline-none focus:border-blue-500 focus:bg-white/10 transition-all duration-300 font-light`}
                  />
                  {errors.company && <p className="text-red-400 text-sm mt-2">{errors.company}</p>}
                </motion.div>
              )}
            </div>

            {/* Section 3: Industry */}
            <div className="space-y-4">
              <h2 className="text-xl font-light text-white">What industry are you in?</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {industries.map((industry) => (
                  <div
                    key={industry}
                    onClick={() => updateField("industry", industry)}
                    className={`p-3 rounded-xl border-2 transition-all duration-200 text-center cursor-pointer hover:border-blue-500/70 active:scale-95 ${
                      formData.industry === industry
                        ? "border-blue-500 bg-blue-500/10"
                        : "border-white/10 bg-white/5 hover:bg-white/10"
                    }`}
                  >
                    <div className={`text-sm font-light ${formData.industry === industry ? "text-blue-400" : "text-white"}`}>
                      {industry}
                    </div>
                  </div>
                ))}
              </div>
              {errors.industry && <p className="text-red-400 text-sm">{errors.industry}</p>}
            </div>

            {/* Section 4: Existing Website */}
            <div className="space-y-4">
              <h2 className="text-xl font-light text-white">Do you have an existing website?</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div
                  onClick={() => updateField("hasWebsite", "yes")}
                  className={`p-5 rounded-xl border-2 transition-all duration-200 text-left cursor-pointer hover:border-blue-500/70 active:scale-95 ${
                    formData.hasWebsite === "yes"
                      ? "border-blue-500 bg-blue-500/10"
                      : "border-white/10 bg-white/5 hover:bg-white/10"
                  }`}
                >
                  <div className={`text-lg font-light ${formData.hasWebsite === "yes" ? "text-blue-400" : "text-white"}`}>
                    Yes, I have a website
                  </div>
                </div>
                <div
                  onClick={() => {
                    setFormData({ ...formData, hasWebsite: "no", websiteUrl: "" });
                  }}
                  className={`p-5 rounded-xl border-2 transition-all duration-200 text-left cursor-pointer hover:border-blue-500/70 active:scale-95 ${
                    formData.hasWebsite === "no"
                      ? "border-blue-500 bg-blue-500/10"
                      : "border-white/10 bg-white/5 hover:bg-white/10"
                  }`}
                >
                  <div className={`text-lg font-light ${formData.hasWebsite === "no" ? "text-blue-400" : "text-white"}`}>
                    No, starting fresh
                  </div>
                </div>
              </div>

              {formData.hasWebsite === "yes" && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <input
                    type="url"
                    value={formData.websiteUrl}
                    onChange={(e) => updateField("websiteUrl", e.target.value)}
                    placeholder="https://yourwebsite.com"
                    className="w-full px-4 py-4 bg-white/5 border-2 border-white/10 rounded-xl text-white text-lg placeholder-white/30 focus:outline-none focus:border-blue-500 focus:bg-white/10 transition-all duration-300 font-light"
                  />
                </motion.div>
              )}
            </div>

            {/* Section 5: Contact Info */}
            <div className="space-y-4">
              <h2 className="text-xl font-light text-white">Contact information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => updateField("firstName", e.target.value)}
                    placeholder="First name"
                    className={`w-full px-4 py-4 bg-white/5 border-2 ${errors.firstName ? "border-red-500" : "border-white/10"} rounded-xl text-white text-lg placeholder-white/30 focus:outline-none focus:border-blue-500 focus:bg-white/10 transition-all duration-300 font-light`}
                  />
                  {errors.firstName && <p className="text-red-400 text-sm mt-2">{errors.firstName}</p>}
                </div>
                <div>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => updateField("lastName", e.target.value)}
                    placeholder="Last name"
                    className={`w-full px-4 py-4 bg-white/5 border-2 ${errors.lastName ? "border-red-500" : "border-white/10"} rounded-xl text-white text-lg placeholder-white/30 focus:outline-none focus:border-blue-500 focus:bg-white/10 transition-all duration-300 font-light`}
                  />
                  {errors.lastName && <p className="text-red-400 text-sm mt-2">{errors.lastName}</p>}
                </div>
              </div>
              <div>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => updateField("email", e.target.value)}
                  placeholder="Email address"
                  className={`w-full px-4 py-4 bg-white/5 border-2 ${errors.email ? "border-red-500" : "border-white/10"} rounded-xl text-white text-lg placeholder-white/30 focus:outline-none focus:border-blue-500 focus:bg-white/10 transition-all duration-300 font-light`}
                />
                {errors.email && <p className="text-red-400 text-sm mt-2">{errors.email}</p>}
              </div>
              <div>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => updateField("phone", e.target.value)}
                  placeholder="Phone number"
                  className={`w-full px-4 py-4 bg-white/5 border-2 ${errors.phone ? "border-red-500" : "border-white/10"} rounded-xl text-white text-lg placeholder-white/30 focus:outline-none focus:border-blue-500 focus:bg-white/10 transition-all duration-300 font-light`}
                />
                {errors.phone && <p className="text-red-400 text-sm mt-2">{errors.phone}</p>}
              </div>
            </div>

            {/* Section 6: Message (Optional) */}
            <div className="space-y-4">
              <h2 className="text-xl font-light text-white">
                Tell us about your business and design needs <span className="text-white/40">(Optional)</span>
              </h2>
              <p className="text-sm text-white/40">
                Describe your brand, target audience, and the goals you are aiming to achieve
              </p>
              <textarea
                value={formData.message}
                onChange={(e) => updateField("message", e.target.value)}
                placeholder="e.g., We're a fitness startup. We need a modern app that helps users track workouts and connect with trainers..."
                rows={4}
                className="w-full px-4 py-4 bg-white/5 border-2 border-white/10 rounded-xl text-white text-lg placeholder-white/30 focus:outline-none focus:border-blue-500 focus:bg-white/10 transition-all duration-300 font-light resize-none"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-4 pb-8">
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="w-full inline-flex items-center justify-center gap-3 px-8 py-5 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white text-lg font-medium shadow-lg shadow-blue-500/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  "Sending..."
                ) : (
                  <>
                    Submit
                    <Send className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex-1 flex items-center justify-center px-4"
          >
            <div className="w-full bg-white/5 border border-white/10 rounded-2xl p-12 text-center">
              <div className="w-20 h-20 rounded-full bg-green-500/20 border-2 border-green-500 flex items-center justify-center mx-auto mb-6">
                <Check className="w-10 h-10 text-green-500" />
              </div>
              <h1 className="text-3xl md:text-4xl font-extralight text-white mb-4">
                You&apos;re all set!
              </h1>
              <p className="text-lg text-white/60 font-light mb-2">
                Thank you for your interest in KoreLynx
              </p>
              <p className="text-base text-white/50 font-light">
                We&apos;ll reach out to you shortly
              </p>
            </div>
          </motion.div>
        )}
        </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
