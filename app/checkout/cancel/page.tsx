"use client";

import Link from "next/link";
import { XCircle } from "lucide-react";

export default function CheckoutCancel() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-gradient-to-br from-gray-900 to-black border border-white/10 rounded-3xl shadow-2xl p-8 md:p-12 text-center">
        {/* Background effects */}
        <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 via-transparent to-red-500/5 rounded-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-red-500/10 rounded-full blur-3xl"></div>

        {/* Content */}
        <div className="relative z-10">
          {/* Cancel Icon */}
          <div className="mx-auto mb-6 inline-block">
            <div className="relative">
              <div className="absolute inset-0 bg-red-500/20 rounded-full blur-2xl"></div>
              <XCircle className="w-24 h-24 text-red-500 relative z-10" strokeWidth={1.5} />
            </div>
          </div>

          {/* Message */}
          <h1 className="text-4xl md:text-5xl font-extralight text-white mb-4">
            Payment Cancelled
          </h1>
          <p className="text-white/70 font-light text-lg mb-8">
            Your payment was cancelled. No charges were made to your account.
          </p>

          {/* Info Box */}
          <div className="text-left bg-white/5 border border-white/10 rounded-xl p-4 mb-8">
            <p className="text-white/50 text-sm">
              If you encountered any issues or have questions, please don&apos;t hesitate to contact us.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/#pricing"
              className="px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 font-medium"
            >
              Try Again
            </Link>
            <Link
              href="/"
              className="px-8 py-3 bg-white/5 border border-white/10 text-white rounded-xl hover:bg-white/10 transition-all duration-300 font-medium"
            >
              Return Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
