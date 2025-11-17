"use client";

import React, { useState, useEffect } from "react";
import { X, Send, Check, Upload } from "lucide-react";
import { toast } from "sonner";
import SuccessModal from "./SuccessModal";
import { z } from "zod";
import { useDropzone } from "react-dropzone";

// Zod validation schema
const inquiryFormSchema = z.object({
  package: z.string().optional(),
  organization: z.string().optional(),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().optional(),
  businessType: z.string().optional(),
  hasExistingWebsite: z.string().optional(),
  websiteUrl: z.string().optional(),
  companyDescription: z.string().optional(),
  businessDescription: z.string().optional(),
  hasExistingBranding: z.string().optional(),
  platforms: z.string().optional(),
  appType: z.string().optional(),
  expectedUsers: z.string().optional(),
  techStack: z.string().optional(),
  teamSize: z.string().optional(),
  compliance: z.string().optional(),
});

interface InquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPackage?: string;
}

export default function InquiryModal({ isOpen, onClose, selectedPackage }: InquiryModalProps) {
  const [formData, setFormData] = useState({
    package: "",
    organization: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    businessType: "",
    hasExistingWebsite: "",
    websiteUrl: "",
    companyDescription: "",
    // Package-specific questions
    businessDescription: "",
    hasExistingBranding: "",
    platforms: "",
    appType: "",
    expectedUsers: "",
    techStack: "",
    teamSize: "",
    compliance: "",
  });
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  // Dropzone for file uploads
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.svg', '.pdf']
    },
    maxFiles: 3,
    maxSize: 5242880, // 5MB
    onDrop: (acceptedFiles) => {
      setUploadedFiles(prev => [...prev, ...acceptedFiles].slice(0, 3));
    },
    onDropRejected: (rejectedFiles) => {
      rejectedFiles.forEach(file => {
        file.errors.forEach(err => {
          if (err.code === 'file-too-large') {
            toast.error('File too large', { description: 'Maximum file size is 5MB' });
          } else if (err.code === 'too-many-files') {
            toast.error('Too many files', { description: 'Maximum 3 files allowed' });
          }
        });
      });
    }
  });

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

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
    setValidationErrors({});

    try {
      // Validate form data with Zod
      const validatedData = inquiryFormSchema.parse(formData);

      // Add file information
      const fileInfo = uploadedFiles.map(file => ({
        name: file.name,
        size: `${(file.size / 1024).toFixed(2)} KB`,
        type: file.type
      }));

      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...validatedData,
          uploadedFiles: fileInfo
        }),
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
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        businessType: "",
        hasExistingWebsite: "",
        websiteUrl: "",
        companyDescription: "",
        businessDescription: "",
        hasExistingBranding: "",
        platforms: "",
        appType: "",
        expectedUsers: "",
        techStack: "",
        teamSize: "",
        compliance: "",
      });
      setUploadedFiles([]);
      setSubmitStatus('idle');

      // Close the inquiry form modal
      onClose();
    } catch (error) {
      console.error('Error submitting form:', error);

      // Handle Zod validation errors
      if (error instanceof z.ZodError) {
        const errors: Record<string, string> = {};
        error.issues.forEach((issue) => {
          if (issue.path[0]) {
            errors[issue.path[0].toString()] = issue.message;
          }
        });
        setValidationErrors(errors);
        toast.error('Please fix the validation errors', {
          description: 'Check the highlighted fields',
          duration: 5000,
        });
        setSubmitStatus('error');
        return;
      }

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
                Package Interest
              </label>
              <select
                value={formData.package}
                onChange={(e) =>
                  setFormData({ ...formData, package: e.target.value })
                }
                className={`w-full px-3 py-2.5 md:px-4 md:py-3 bg-white/5 border ${
                  validationErrors.package ? 'border-red-500' : 'border-white/10'
                } rounded-lg md:rounded-xl text-white text-xs md:text-sm focus:border-blue-500/40 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 appearance-none cursor-pointer`}
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
              {selectedPackage && !validationErrors.package && (
                <p className="mt-1 text-[10px] md:text-xs text-blue-400 flex items-center gap-1">
                  <Check className="w-3 h-3" />
                  Pre-selected based on your interest
                </p>
              )}
              {validationErrors.package && (
                <p className="mt-1 text-xs text-red-400">{validationErrors.package}</p>
              )}
            </div>

            {/* Organization/Company Name */}
            <div>
              <label className="block text-xs md:text-sm font-medium text-white/80 mb-1.5">
                Organization / Company Name
              </label>
              <input
                type="text"
                value={formData.organization}
                onChange={(e) =>
                  setFormData({ ...formData, organization: e.target.value })
                }
                className={`w-full px-3 py-2.5 md:px-4 md:py-3 bg-white/5 border ${
                  validationErrors.organization ? 'border-red-500' : 'border-white/10'
                } rounded-lg md:rounded-xl text-white text-xs md:text-sm placeholder-white/40 focus:border-blue-500/40 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-300`}
                placeholder="Acme Corporation"
              />
              {validationErrors.organization && (
                <p className="mt-1 text-xs text-red-400">{validationErrors.organization}</p>
              )}
            </div>

            {/* Name - Split into First and Last */}
            <div className="grid grid-cols-2 gap-3 md:gap-4">
              <div>
                <label className="block text-xs md:text-sm font-medium text-white/80 mb-1.5">
                  First Name <span className="text-amber-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.firstName}
                  onChange={(e) =>
                    setFormData({ ...formData, firstName: e.target.value })
                  }
                  className={`w-full px-3 py-2.5 md:px-4 md:py-3 bg-white/5 border ${
                    validationErrors.firstName ? 'border-red-500' : 'border-white/10'
                  } rounded-lg md:rounded-xl text-white text-xs md:text-sm placeholder-white/40 focus:border-blue-500/40 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-300`}
                  placeholder="John"
                />
                {validationErrors.firstName && (
                  <p className="mt-1 text-xs text-red-400">{validationErrors.firstName}</p>
                )}
              </div>
              <div>
                <label className="block text-xs md:text-sm font-medium text-white/80 mb-1.5">
                  Last Name <span className="text-amber-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.lastName}
                  onChange={(e) =>
                    setFormData({ ...formData, lastName: e.target.value })
                  }
                  className={`w-full px-3 py-2.5 md:px-4 md:py-3 bg-white/5 border ${
                    validationErrors.lastName ? 'border-red-500' : 'border-white/10'
                  } rounded-lg md:rounded-xl text-white text-xs md:text-sm placeholder-white/40 focus:border-blue-500/40 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-300`}
                  placeholder="Doe"
                />
                {validationErrors.lastName && (
                  <p className="mt-1 text-xs text-red-400">{validationErrors.lastName}</p>
                )}
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs md:text-sm font-medium text-white/80 mb-1.5">
                Email <span className="text-amber-400">*</span>
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className={`w-full px-3 py-2.5 md:px-4 md:py-3 bg-white/5 border ${
                  validationErrors.email ? 'border-red-500' : 'border-white/10'
                } rounded-lg md:rounded-xl text-white text-xs md:text-sm placeholder-white/40 focus:border-blue-500/40 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-300`}
                placeholder="john@example.com"
              />
              {validationErrors.email && (
                <p className="mt-1 text-xs text-red-400">{validationErrors.email}</p>
              )}
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

            {/* Business Type */}
            <div>
              <label className="block text-xs md:text-sm font-medium text-white/80 mb-1.5">
                Business Type / Industry
              </label>
              <select
                value={formData.businessType}
                onChange={(e) =>
                  setFormData({ ...formData, businessType: e.target.value })
                }
                className={`w-full px-3 py-2.5 md:px-4 md:py-3 bg-white/5 border ${
                  validationErrors.businessType ? 'border-red-500' : 'border-white/10'
                } rounded-lg md:rounded-xl text-white text-xs md:text-sm focus:border-blue-500/40 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 appearance-none cursor-pointer`}
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='rgba(255,255,255,0.4)'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 1rem center',
                  backgroundSize: '1.5em 1.5em',
                  paddingRight: '3rem',
                }}
              >
                <option value="" className="bg-gray-900">Select your industry...</option>
                <option value="Technology / Software" className="bg-gray-900">Technology / Software</option>
                <option value="E-commerce / Retail" className="bg-gray-900">E-commerce / Retail</option>
                <option value="Healthcare / Medical" className="bg-gray-900">Healthcare / Medical</option>
                <option value="Finance / Fintech" className="bg-gray-900">Finance / Fintech</option>
                <option value="Education / E-learning" className="bg-gray-900">Education / E-learning</option>
                <option value="Real Estate" className="bg-gray-900">Real Estate</option>
                <option value="Food & Beverage" className="bg-gray-900">Food & Beverage</option>
                <option value="Hospitality / Travel" className="bg-gray-900">Hospitality / Travel</option>
                <option value="Marketing / Advertising" className="bg-gray-900">Marketing / Advertising</option>
                <option value="Consulting / Professional Services" className="bg-gray-900">Consulting / Professional Services</option>
                <option value="Manufacturing / Industrial" className="bg-gray-900">Manufacturing / Industrial</option>
                <option value="Non-Profit / NGO" className="bg-gray-900">Non-Profit / NGO</option>
                <option value="Entertainment / Media" className="bg-gray-900">Entertainment / Media</option>
                <option value="Fitness / Wellness" className="bg-gray-900">Fitness / Wellness</option>
                <option value="Automotive" className="bg-gray-900">Automotive</option>
                <option value="Agriculture" className="bg-gray-900">Agriculture</option>
                <option value="Legal Services" className="bg-gray-900">Legal Services</option>
                <option value="Other" className="bg-gray-900">Other</option>
              </select>
              {validationErrors.businessType && (
                <p className="mt-1 text-xs text-red-400">{validationErrors.businessType}</p>
              )}
            </div>

            {/* Do you have an existing website? */}
            <div>
              <label className="block text-xs md:text-sm font-medium text-white/80 mb-1.5">
                Do you or your company have an existing website?
              </label>
              <select
                value={formData.hasExistingWebsite}
                onChange={(e) =>
                  setFormData({ ...formData, hasExistingWebsite: e.target.value })
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
                <option value="" className="bg-gray-900">Select...</option>
                <option value="Yes" className="bg-gray-900">Yes</option>
                <option value="No" className="bg-gray-900">No</option>
              </select>
            </div>

            {/* Website URL - Show only if they have an existing website */}
            {formData.hasExistingWebsite === "Yes" && (
              <div>
                <label className="block text-xs md:text-sm font-medium text-white/80 mb-1.5">
                  Website URL
                </label>
                <input
                  type="url"
                  value={formData.websiteUrl}
                  onChange={(e) =>
                    setFormData({ ...formData, websiteUrl: e.target.value })
                  }
                  className="w-full px-3 py-2.5 md:px-4 md:py-3 bg-white/5 border border-white/10 rounded-lg md:rounded-xl text-white text-xs md:text-sm placeholder-white/40 focus:border-blue-500/40 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-300"
                  placeholder="https://www.example.com"
                />
              </div>
            )}

            {/* File Upload Dropzone for Logo/Branding */}
            <div>
              <label className="block text-xs md:text-sm font-medium text-white/80 mb-1.5">
                Upload existing logo or branding <span className="text-white/40 font-light text-[10px] md:text-xs">(Optional)</span>
              </label>
              <div
                {...getRootProps()}
                className={`w-full px-3 py-6 md:px-4 md:py-8 bg-white/5 border-2 border-dashed ${
                  isDragActive ? 'border-blue-500/60 bg-blue-500/10' : 'border-white/10'
                } rounded-lg md:rounded-xl text-white text-xs md:text-sm transition-all duration-300 cursor-pointer hover:border-blue-500/40 hover:bg-white/10`}
              >
                <input {...getInputProps()} />
                <div className="flex flex-col items-center justify-center gap-2 text-center">
                  <Upload className="w-6 h-6 md:w-8 md:h-8 text-white/40" />
                  {isDragActive ? (
                    <p className="text-blue-400">Drop the files here...</p>
                  ) : (
                    <>
                      <p className="text-white/60">
                        Drag &amp; drop files here, or click to select
                      </p>
                      <p className="text-white/40 text-[10px] md:text-xs">
                        Max 3 files, 5MB each (PNG, JPG, SVG, PDF)
                      </p>
                    </>
                  )}
                </div>
              </div>
              {uploadedFiles.length > 0 && (
                <div className="mt-2 space-y-2">
                  {uploadedFiles.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between px-3 py-2 bg-white/5 border border-white/10 rounded-lg"
                    >
                      <span className="text-xs text-white/80 truncate flex-1">
                        {file.name}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        className="ml-2 p-1 hover:bg-white/10 rounded transition-colors"
                      >
                        <X className="w-4 h-4 text-white/60 hover:text-white" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Open-ended question about company and needs */}
            <div>
              <label className="block text-xs md:text-sm font-medium text-white/80 mb-1.5">
                Tell us more
              </label>
              <textarea
                value={formData.companyDescription}
                onChange={(e) =>
                  setFormData({ ...formData, companyDescription: e.target.value })
                }
                rows={4}
                className={`w-full px-3 py-2.5 md:px-4 md:py-3 bg-white/5 border ${
                  validationErrors.companyDescription ? 'border-red-500' : 'border-white/10'
                } rounded-lg md:rounded-xl text-white text-xs md:text-sm placeholder-white/40 focus:border-blue-500/40 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 resize-none`}
                placeholder="Describe your company, target audience, main goals, key features you need, and any specific requirements or challenges you're facing..."
              />
              {validationErrors.companyDescription && (
                <p className="mt-1 text-xs text-red-400">{validationErrors.companyDescription}</p>
              )}
            </div>

            {/* Package-Specific Questions */}
            {formData.package.includes("Landing Page") && (
              <>
                <div className="pt-2 border-t border-white/10">
                  <p className="text-xs md:text-sm text-blue-400 font-medium mb-3">Help us understand your landing page needs</p>
                </div>

                <div>
                  <label className="block text-xs md:text-sm font-medium text-white/80 mb-1.5">
                    What is your business/brand about?
                  </label>
                  <textarea
                    value={formData.businessDescription}
                    onChange={(e) =>
                      setFormData({ ...formData, businessDescription: e.target.value })
                    }
                    rows={2}
                    className="w-full px-3 py-2.5 md:px-4 md:py-3 bg-white/5 border border-white/10 rounded-lg md:rounded-xl text-white text-xs md:text-sm placeholder-white/40 focus:border-blue-500/40 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 resize-none"
                    placeholder="Brief description of your business, target audience, and goals"
                  />
                </div>

                <div>
                  <label className="block text-xs md:text-sm font-medium text-white/80 mb-1.5">
                    Do you have existing branding?
                  </label>
                  <select
                    value={formData.hasExistingBranding}
                    onChange={(e) =>
                      setFormData({ ...formData, hasExistingBranding: e.target.value })
                    }
                    className="w-full px-3 py-2.5 md:px-4 md:py-3 bg-white/5 border border-white/10 rounded-lg md:rounded-xl text-white text-xs md:text-sm focus:border-blue-500/40 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 appearance-none cursor-pointer"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='rgba(255,255,255,0.4)'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'right 0.5rem center',
                      backgroundSize: '1.25em 1.25em',
                      paddingRight: '2.5rem',
                    }}
                  >
                    <option value="" className="bg-gray-900">Select...</option>
                    <option value="Yes - logo and brand guidelines" className="bg-gray-900">Yes - I have logo and brand guidelines</option>
                    <option value="Partial - logo only" className="bg-gray-900">Partial - I have a logo only</option>
                    <option value="No - need help with branding" className="bg-gray-900">No - I need help with branding</option>
                  </select>
                </div>
              </>
            )}

            {formData.package.includes("Mobile App") && (
              <>
                <div className="pt-2 border-t border-white/10">
                  <p className="text-xs md:text-sm text-blue-400 font-medium mb-3">Help us understand your mobile app needs</p>
                </div>

                <div>
                  <label className="block text-xs md:text-sm font-medium text-white/80 mb-1.5">
                    Which platforms do you need?
                  </label>
                  <select
                    value={formData.platforms}
                    onChange={(e) =>
                      setFormData({ ...formData, platforms: e.target.value })
                    }
                    className="w-full px-3 py-2.5 md:px-4 md:py-3 bg-white/5 border border-white/10 rounded-lg md:rounded-xl text-white text-xs md:text-sm focus:border-blue-500/40 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 appearance-none cursor-pointer"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='rgba(255,255,255,0.4)'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'right 0.5rem center',
                      backgroundSize: '1.25em 1.25em',
                      paddingRight: '2.5rem',
                    }}
                  >
                    <option value="" className="bg-gray-900">Select...</option>
                    <option value="Both iOS and Android" className="bg-gray-900">Both iOS and Android</option>
                    <option value="iOS only" className="bg-gray-900">iOS only</option>
                    <option value="Android only" className="bg-gray-900">Android only</option>
                  </select>
                </div>

              </>
            )}

            {formData.package.includes("Full-Stack Web App") && (
              <>
                <div className="pt-2 border-t border-white/10">
                  <p className="text-xs md:text-sm text-blue-400 font-medium mb-3">Help us understand your web app needs</p>
                </div>

                <div>
                  <label className="block text-xs md:text-sm font-medium text-white/80 mb-1.5">
                    What type of web application?
                  </label>
                  <select
                    value={formData.appType}
                    onChange={(e) =>
                      setFormData({ ...formData, appType: e.target.value })
                    }
                    className="w-full px-3 py-2.5 md:px-4 md:py-3 bg-white/5 border border-white/10 rounded-lg md:rounded-xl text-white text-xs md:text-sm focus:border-blue-500/40 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 appearance-none cursor-pointer"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='rgba(255,255,255,0.4)'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'right 0.5rem center',
                      backgroundSize: '1.25em 1.25em',
                      paddingRight: '2.5rem',
                    }}
                  >
                    <option value="" className="bg-gray-900">Select...</option>
                    <option value="SaaS Platform" className="bg-gray-900">SaaS Platform</option>
                    <option value="Marketplace" className="bg-gray-900">Marketplace</option>
                    <option value="Dashboard/Admin Panel" className="bg-gray-900">Dashboard/Admin Panel</option>
                    <option value="E-commerce" className="bg-gray-900">E-commerce</option>
                    <option value="Social Platform" className="bg-gray-900">Social Platform</option>
                    <option value="Other" className="bg-gray-900">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs md:text-sm font-medium text-white/80 mb-1.5">
                    Expected number of users?
                  </label>
                  <select
                    value={formData.expectedUsers}
                    onChange={(e) =>
                      setFormData({ ...formData, expectedUsers: e.target.value })
                    }
                    className="w-full px-3 py-2.5 md:px-4 md:py-3 bg-white/5 border border-white/10 rounded-lg md:rounded-xl text-white text-xs md:text-sm focus:border-blue-500/40 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 appearance-none cursor-pointer"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='rgba(255,255,255,0.4)'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'right 0.5rem center',
                      backgroundSize: '1.25em 1.25em',
                      paddingRight: '2.5rem',
                    }}
                  >
                    <option value="" className="bg-gray-900">Select...</option>
                    <option value="Less than 100" className="bg-gray-900">Less than 100</option>
                    <option value="100-1,000" className="bg-gray-900">100-1,000</option>
                    <option value="1,000-10,000" className="bg-gray-900">1,000-10,000</option>
                    <option value="10,000+" className="bg-gray-900">10,000+</option>
                  </select>
                </div>

              </>
            )}

            {formData.package.includes("Enterprise") && (
              <>
                <div className="pt-2 border-t border-white/10">
                  <p className="text-xs md:text-sm text-blue-400 font-medium mb-3">Help us understand your enterprise needs</p>
                </div>

                <div>
                  <label className="block text-xs md:text-sm font-medium text-white/80 mb-1.5">
                    Current tech stack <span className="text-white/40 font-light text-[10px] md:text-xs">(if any)</span>
                  </label>
                  <input
                    type="text"
                    value={formData.techStack}
                    onChange={(e) =>
                      setFormData({ ...formData, techStack: e.target.value })
                    }
                    className="w-full px-3 py-2.5 md:px-4 md:py-3 bg-white/5 border border-white/10 rounded-lg md:rounded-xl text-white text-xs md:text-sm placeholder-white/40 focus:border-blue-500/40 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-300"
                    placeholder="e.g., AWS, React, Node.js, PostgreSQL"
                  />
                </div>

                <div>
                  <label className="block text-xs md:text-sm font-medium text-white/80 mb-1.5">
                    Team size that will use the platform?
                  </label>
                  <select
                    value={formData.teamSize}
                    onChange={(e) =>
                      setFormData({ ...formData, teamSize: e.target.value })
                    }
                    className="w-full px-3 py-2.5 md:px-4 md:py-3 bg-white/5 border border-white/10 rounded-lg md:rounded-xl text-white text-xs md:text-sm focus:border-blue-500/40 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 appearance-none cursor-pointer"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='rgba(255,255,255,0.4)'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'right 0.5rem center',
                      backgroundSize: '1.25em 1.25em',
                      paddingRight: '2.5rem',
                    }}
                  >
                    <option value="" className="bg-gray-900">Select...</option>
                    <option value="1-10" className="bg-gray-900">1-10</option>
                    <option value="10-50" className="bg-gray-900">10-50</option>
                    <option value="50-200" className="bg-gray-900">50-200</option>
                    <option value="200+" className="bg-gray-900">200+</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs md:text-sm font-medium text-white/80 mb-1.5">
                    Any compliance requirements? <span className="text-white/40 font-light text-[10px] md:text-xs">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    value={formData.compliance}
                    onChange={(e) =>
                      setFormData({ ...formData, compliance: e.target.value })
                    }
                    className="w-full px-3 py-2.5 md:px-4 md:py-3 bg-white/5 border border-white/10 rounded-lg md:rounded-xl text-white text-xs md:text-sm placeholder-white/40 focus:border-blue-500/40 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-300"
                    placeholder="e.g., HIPAA, SOC2, GDPR, PCI-DSS"
                  />
                </div>
              </>
            )}

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
