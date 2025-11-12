"use client";

import React from "react";
import { CheckCircle, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SuccessModal({ isOpen, onClose }: SuccessModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="relative bg-gradient-to-br from-gray-900 to-black border border-white/10 rounded-3xl shadow-2xl max-w-md w-full overflow-hidden"
          >
            {/* Background effects */}
            <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 via-transparent to-green-500/5"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-green-500/10 rounded-full blur-3xl"></div>

            {/* Content */}
            <div className="relative p-8 md:p-10 text-center">
              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 rounded-xl hover:bg-white/10 transition-all duration-300 text-white/60 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Success Icon with animation */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 15 }}
                className="mx-auto mb-6"
              >
                <div className="relative inline-block">
                  {/* Glow effect */}
                  <div className="absolute inset-0 bg-green-500/20 rounded-full blur-2xl animate-pulse"></div>
                  {/* Icon */}
                  <CheckCircle className="w-24 h-24 text-green-500 relative z-10" strokeWidth={1.5} />
                </div>
              </motion.div>

              {/* Success Message */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <h3 className="text-3xl md:text-4xl font-extralight text-white mb-3">
                  Thank You!
                </h3>
                <p className="text-white/70 font-light text-base md:text-lg mb-2">
                  Thank you for your interest in working with KoreTek
                </p>
                <p className="text-white/50 font-light text-sm">
                  We&apos;ve received your inquiry and will be in touch soon.
                </p>
              </motion.div>

              {/* Close Button */}
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                onClick={onClose}
                className="mt-8 px-8 py-3 text-white bg-gradient-to-r from-green-500 to-green-600 rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-lg shadow-green-500/20 hover:shadow-green-500/30 font-medium"
              >
                Got it!
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
