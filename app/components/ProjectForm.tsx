"use client";

import React, { useState } from "react";
import { X, ArrowRight, ArrowLeft, Check } from "lucide-react";
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
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [formData, setFormData] = useState({
    package: selectedPackage,
    firstName: "",
    lastName: "",
    email: "",
    projectType: "", // "personal" or "company"
    company: "",
    phone: "",
    budget: "",
    timeline: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const totalQuestions = 6;

  const updateField = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
    // Clear error when user starts typing
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
      } else if (["firstName", "lastName", "company", "message"].includes(field)) {
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

  const validateCurrentQuestion = (): boolean => {
    const newErrors: Record<string, string> = {};

    switch (currentQuestion) {
      case 1:
        if (!formData.package.trim()) {
          newErrors.package = "Please select a package";
        }
        break;
      case 2:
        if (!formData.projectType.trim()) {
          newErrors.projectType = "Please select project type";
        } else if (formData.projectType === "company") {
          const companyError = validateField("company", formData.company);
          if (companyError) newErrors.company = companyError;
        }
        break;
      case 3:
        const messageError = validateField("message", formData.message);
        if (messageError) newErrors.message = messageError;
        break;
      case 4:
        if (!formData.timeline.trim()) {
          newErrors.timeline = "Please select a timeline";
        }
        break;
      case 5:
        if (!formData.budget.trim()) {
          newErrors.budget = "Please select a budget range";
        }
        break;
      case 6:
        const firstNameError = validateField("firstName", formData.firstName);
        const lastNameError = validateField("lastName", formData.lastName);
        const emailError = validateField("email", formData.email);
        const phoneError = validateField("phone", formData.phone);
        if (firstNameError) newErrors.firstName = firstNameError;
        if (lastNameError) newErrors.lastName = lastNameError;
        if (emailError) newErrors.email = emailError;
        if (phoneError) newErrors.phone = phoneError;
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextQuestion = () => {
    if (validateCurrentQuestion() && currentQuestion < totalQuestions) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const prevQuestion = () => {
    if (currentQuestion > 1) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = async () => {
    if (!validateCurrentQuestion()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          company: formData.projectType === "company" ? formData.company : "Personal Project",
          phone: formData.phone,
          package: formData.package,
          budget: formData.budget,
          timeline: formData.timeline,
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
    setCurrentQuestion(1);
    setFormData({
      package: "",
      firstName: "",
      lastName: "",
      email: "",
      projectType: "",
      company: "",
      phone: "",
      budget: "",
      timeline: "",
      message: "",
    });
    setErrors({});
    setSubmitSuccess(false);
    onClose();
  };

  const canContinue = () => {
    switch (currentQuestion) {
      case 1:
        return formData.package.trim() !== "";
      case 2:
        if (formData.projectType === "personal") {
          return true;
        } else if (formData.projectType === "company") {
          return formData.company.trim() !== "";
        }
        return false;
      case 3:
        return formData.message.trim() !== "";
      case 4:
        return formData.timeline.trim() !== "";
      case 5:
        return formData.budget.trim() !== "";
      case 6:
        return (
          formData.firstName.trim() !== "" &&
          formData.lastName.trim() !== "" &&
          formData.email.trim() !== "" &&
          validateField("email", formData.email) === "" &&
          formData.phone.trim() !== "" &&
          validateField("phone", formData.phone) === ""
        );
      default:
        return false;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/3 via-transparent to-blue-500/3"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
      </div>

      {/* Form Container */}
      <div className="relative z-10 h-full flex flex-col">
        {/* Main Content Area */}
        <div className="flex-1 flex flex-col justify-center px-6 pt-24 pb-32 max-w-3xl mx-auto w-full gap-12">
          <AnimatePresence mode="wait">
            {!submitSuccess && (
              <>
                {currentQuestion === 1 && (
                  <motion.div
                    key="q1"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="flex flex-col gap-6"
                  >
                    <div>
                      <h1 className="text-3xl md:text-4xl lg:text-5xl font-extralight text-white mb-2 leading-tight">
                        What do you need help with?
                      </h1>
                      <p className="text-base md:text-lg text-white/50 font-light">
                        Choose what best fits your needs
                      </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {["Landing Page", "Mobile App", "Web Platform", "Complete Platform", "Not sure yet"].map(
                        (pkg) => (
                          <div
                            key={pkg}
                            onClick={() => {
                              setFormData({ ...formData, package: pkg });
                              if (errors.package) {
                                setErrors({ ...errors, package: "" });
                              }
                            }}
                            className={`p-5 rounded-xl border-2 transition-all duration-200 text-left cursor-pointer hover:border-blue-500/70 active:scale-95 ${
                              formData.package === pkg
                                ? "border-blue-500 bg-blue-500/10"
                                : "border-white/10 bg-white/5 hover:bg-white/10"
                            }`}
                          >
                            <div className={`text-lg md:text-xl font-light transition-colors pointer-events-none ${
                              formData.package === pkg ? "text-blue-400" : "text-white"
                            }`}>{pkg}</div>
                          </div>
                        )
                      )}
                    </div>
                  </motion.div>
                )}

                {currentQuestion === 2 && (
                  <motion.div
                    key="q3"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="flex flex-col gap-6"
                  >
                    <div>
                      <h1 className="text-3xl md:text-4xl lg:text-5xl font-extralight text-white mb-2 leading-tight">
                        Is this a personal or company project?
                      </h1>
                      <p className="text-base md:text-lg text-white/50 font-light">
                        Help us understand your needs better
                      </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div
                        onClick={() => {
                          setFormData({ ...formData, projectType: "personal", company: "" });
                          if (errors.projectType) {
                            setErrors({ ...errors, projectType: "" });
                          }
                        }}
                        className={`p-5 rounded-xl border-2 transition-all duration-200 text-left cursor-pointer hover:border-blue-500/70 active:scale-95 ${
                          formData.projectType === "personal"
                            ? "border-blue-500 bg-blue-500/10"
                            : "border-white/10 bg-white/5 hover:bg-white/10"
                        }`}
                      >
                        <div className={`text-lg md:text-xl font-light transition-colors pointer-events-none ${
                          formData.projectType === "personal" ? "text-blue-400" : "text-white"
                        }`}>
                          Personal Project
                        </div>
                        <p className="text-sm text-white/40 mt-1 pointer-events-none">For myself or a side project</p>
                      </div>
                      <div
                        onClick={() => {
                          setFormData({ ...formData, projectType: "company" });
                          if (errors.projectType) {
                            setErrors({ ...errors, projectType: "" });
                          }
                        }}
                        className={`p-5 rounded-xl border-2 transition-all duration-200 text-left cursor-pointer hover:border-blue-500/70 active:scale-95 ${
                          formData.projectType === "company"
                            ? "border-blue-500 bg-blue-500/10"
                            : "border-white/10 bg-white/5 hover:bg-white/10"
                        }`}
                      >
                        <div className={`text-lg md:text-xl font-light transition-colors pointer-events-none ${
                          formData.projectType === "company" ? "text-blue-400" : "text-white"
                        }`}>
                          Company Project
                        </div>
                        <p className="text-sm text-white/40 mt-1 pointer-events-none">For my business or organization</p>
                      </div>
                    </div>

                    {formData.projectType === "company" && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <input
                          type="text"
                          value={formData.company}
                          onChange={(e) => updateField("company", e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && canContinue() && nextQuestion()}
                          placeholder="Company name"
                          className={`w-full px-4 py-4 bg-white/5 border-2 ${errors.company ? "border-red-500" : "border-white/10"} rounded-xl text-white text-lg md:text-xl placeholder-white/30 focus:outline-none focus:border-blue-500 focus:bg-white/10 transition-all duration-300 font-light`}
                          autoFocus
                        />
                        {errors.company && (
                          <p className="text-red-400 text-sm mt-2">{errors.company}</p>
                        )}
                      </motion.div>
                    )}
                  </motion.div>
                )}

                {currentQuestion === 3 && (
                  <motion.div
                    key="q5"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="flex flex-col gap-6"
                  >
                    <div>
                      <h1 className="text-3xl md:text-4xl lg:text-5xl font-extralight text-white leading-tight">
                        Briefly describe your project
                      </h1>
                    </div>
                    <div>
                      <textarea
                        value={formData.message}
                        onChange={(e) => updateField("message", e.target.value)}
                        placeholder="Share your vision or any specific features you have in mind..."
                        rows={6}
                        className={`w-full px-4 py-4 bg-white/5 border-2 ${errors.message ? "border-red-500" : "border-white/10"} rounded-xl text-white text-lg md:text-xl placeholder-white/30 focus:outline-none focus:border-blue-500 focus:bg-white/10 transition-all duration-300 font-light resize-none`}
                        autoFocus
                      />
                      {errors.message && (
                        <p className="text-red-400 text-sm mt-2">{errors.message}</p>
                      )}
                    </div>
                  </motion.div>
                )}

                {currentQuestion === 4 && (
                  <motion.div
                    key="q4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="flex flex-col gap-6"
                  >
                    <div>
                      <h1 className="text-3xl md:text-4xl lg:text-5xl font-extralight text-white mb-2 leading-tight">
                        What&apos;s your timeline?
                      </h1>
                      <p className="text-base md:text-lg text-white/50 font-light">
                        When would you like to get started?
                      </p>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {["ASAP", "1-2 weeks", "2-4 weeks", "1-2 months", "2-3 months", "Just exploring"].map(
                        (timelineOption) => (
                          <div
                            key={timelineOption}
                            onClick={() => {
                              setFormData({ ...formData, timeline: timelineOption });
                              if (errors.timeline) {
                                setErrors({ ...errors, timeline: "" });
                              }
                            }}
                            className={`p-4 rounded-xl border-2 transition-all duration-200 text-center cursor-pointer hover:border-blue-500/70 active:scale-95 ${
                              formData.timeline === timelineOption
                                ? "border-blue-500 bg-blue-500/10"
                                : "border-white/10 bg-white/5 hover:bg-white/10"
                            }`}
                          >
                            <div className={`text-sm md:text-base font-light transition-colors pointer-events-none ${
                              formData.timeline === timelineOption ? "text-blue-400" : "text-white"
                            }`}>
                              {timelineOption}
                            </div>
                          </div>
                        )
                      )}
                    </div>
                    {errors.timeline && (
                      <p className="text-red-400 text-sm mt-2">{errors.timeline}</p>
                    )}
                  </motion.div>
                )}

                {currentQuestion === 5 && (
                  <motion.div
                    key="q5"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="flex flex-col gap-6"
                  >
                    <div>
                      <h1 className="text-3xl md:text-4xl lg:text-5xl font-extralight text-white mb-2 leading-tight">
                        What&apos;s your budget range?
                      </h1>
                      <p className="text-base md:text-lg text-white/50 font-light">
                        This helps us recommend the right solution
                      </p>
                    </div>

                    <div>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {["Under $5k", "$5k - $10k", "$10k - $25k", "$25k - $50k", "$50k+", "Not sure yet"].map(
                          (budgetOption) => (
                            <div
                              key={budgetOption}
                              onClick={() => {
                                setFormData({ ...formData, budget: budgetOption });
                                if (errors.budget) {
                                  setErrors({ ...errors, budget: "" });
                                }
                              }}
                              className={`p-4 rounded-xl border-2 transition-all duration-200 text-center cursor-pointer hover:border-blue-500/70 active:scale-95 ${
                                formData.budget === budgetOption
                                  ? "border-blue-500 bg-blue-500/10"
                                  : "border-white/10 bg-white/5 hover:bg-white/10"
                              }`}
                            >
                              <div className={`text-sm md:text-base font-light transition-colors pointer-events-none ${
                                formData.budget === budgetOption ? "text-blue-400" : "text-white"
                              }`}>
                                {budgetOption}
                              </div>
                            </div>
                          )
                        )}
                      </div>
                      {errors.budget && (
                        <p className="text-red-400 text-sm mt-2">{errors.budget}</p>
                      )}
                    </div>
                  </motion.div>
                )}

                {currentQuestion === 6 && (
                  <motion.div
                    key="q2"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="flex flex-col gap-6"
                  >
                    <div>
                      <h1 className="text-3xl md:text-4xl lg:text-5xl font-extralight text-white leading-tight">
                        Great! How can we contact you?
                      </h1>
                    </div>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <input
                            type="text"
                            value={formData.firstName}
                            onChange={(e) => updateField("firstName", e.target.value)}
                            placeholder="First name"
                            className={`w-full px-4 py-4 bg-white/5 border-2 ${errors.firstName ? "border-red-500" : "border-white/10"} rounded-xl text-white text-lg md:text-xl placeholder-white/30 focus:outline-none focus:border-blue-500 focus:bg-white/10 transition-all duration-300 font-light`}
                            autoFocus
                          />
                          {errors.firstName && (
                            <p className="text-red-400 text-sm mt-2">{errors.firstName}</p>
                          )}
                        </div>
                        <div>
                          <input
                            type="text"
                            value={formData.lastName}
                            onChange={(e) => updateField("lastName", e.target.value)}
                            placeholder="Last name"
                            className={`w-full px-4 py-4 bg-white/5 border-2 ${errors.lastName ? "border-red-500" : "border-white/10"} rounded-xl text-white text-lg md:text-xl placeholder-white/30 focus:outline-none focus:border-blue-500 focus:bg-white/10 transition-all duration-300 font-light`}
                          />
                          {errors.lastName && (
                            <p className="text-red-400 text-sm mt-2">{errors.lastName}</p>
                          )}
                        </div>
                      </div>
                      <div>
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => updateField("email", e.target.value)}
                          placeholder="Email address"
                          className={`w-full px-4 py-4 bg-white/5 border-2 ${errors.email ? "border-red-500" : "border-white/10"} rounded-xl text-white text-lg md:text-xl placeholder-white/30 focus:outline-none focus:border-blue-500 focus:bg-white/10 transition-all duration-300 font-light`}
                        />
                        {errors.email && (
                          <p className="text-red-400 text-sm mt-2">{errors.email}</p>
                        )}
                      </div>
                      <div>
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => updateField("phone", e.target.value)}
                          placeholder="Phone number"
                          className={`w-full px-4 py-4 bg-white/5 border-2 ${errors.phone ? "border-red-500" : "border-white/10"} rounded-xl text-white text-lg md:text-xl placeholder-white/30 focus:outline-none focus:border-blue-500 focus:bg-white/10 transition-all duration-300 font-light`}
                        />
                        {errors.phone && (
                          <p className="text-red-400 text-sm mt-2">{errors.phone}</p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
              </>
            )}

            {submitSuccess && (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center h-full text-center"
              >
                <div className="w-20 h-20 rounded-full bg-green-500/20 border-2 border-green-500 flex items-center justify-center mx-auto mb-6">
                  <Check className="w-10 h-10 text-green-500" />
                </div>
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-extralight text-white mb-4">
                  You&apos;re all set! 🎉
                </h1>
                <p className="text-lg md:text-xl text-white/60 font-light">
                  We&apos;ll reach out within 24 hours
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Bottom Section - Navigation & Counter */}
        {!submitSuccess && (
          <div className="px-6 pb-8">
            <div className="w-full max-w-4xl mx-auto">
              {/* Navigation Buttons */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <button
                    onClick={prevQuestion}
                    disabled={currentQuestion === 1}
                    className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl transition-all duration-300 ${
                      currentQuestion === 1
                        ? "opacity-0 pointer-events-none"
                        : "text-white/60 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <ArrowLeft className="w-5 h-5" />
                    <span className="font-light">Back</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleClose}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-500/10 border border-red-500/30 hover:border-red-500/50 transition-all duration-300"
                  >
                    <X className="w-5 h-5" />
                    <span className="font-light">Exit</span>
                  </button>
                </div>

                {currentQuestion < totalQuestions ? (
                  <button
                    onClick={nextQuestion}
                    disabled={!canContinue()}
                    className={`inline-flex items-center gap-2 px-8 py-4 rounded-xl transition-all duration-300 ${
                      canContinue()
                        ? "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg shadow-blue-500/30"
                        : "bg-white/5 text-white/30 cursor-not-allowed"
                    }`}
                  >
                    <span className="font-medium">Continue</span>
                    <ArrowRight className="w-5 h-5" />
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit}
                    disabled={!canContinue() || isSubmitting}
                    className={`inline-flex items-center gap-2 px-8 py-4 rounded-xl transition-all duration-300 ${
                      canContinue() && !isSubmitting
                        ? "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg shadow-blue-500/30"
                        : "bg-white/5 text-white/30 cursor-not-allowed"
                    }`}
                  >
                    <span className="font-medium">{isSubmitting ? "Sending..." : "Submit"}</span>
                    <ArrowRight className="w-5 h-5" />
                  </button>
                )}
              </div>

              {/* Question Counter */}
              <div className="text-center">
                <span className="text-white/40 font-light text-lg">
                  {currentQuestion} / {totalQuestions}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
