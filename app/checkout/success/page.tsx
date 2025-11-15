"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle } from "lucide-react";

export default function CheckoutSuccess() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading state
    setTimeout(() => setLoading(false), 1000);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-gradient-to-br from-gray-900 to-black border border-white/10 rounded-3xl shadow-2xl p-8 md:p-12 text-center">
        {/* Background effects */}
        <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 via-transparent to-green-500/5 rounded-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-green-500/10 rounded-full blur-3xl"></div>

        {/* Content */}
        <div className="relative z-10">
          {/* Success Icon */}
          <div className="mx-auto mb-6 inline-block">
            <div className="relative">
              <div className="absolute inset-0 bg-green-500/20 rounded-full blur-2xl animate-pulse"></div>
              <CheckCircle className="w-24 h-24 text-green-500 relative z-10" strokeWidth={1.5} />
            </div>
          </div>

          {/* Message */}
          <h1 className="text-4xl md:text-5xl font-extralight text-white mb-4">
            Payment Successful!
          </h1>
          <p className="text-white/70 font-light text-lg mb-6">
            Thank you for your purchase. Your payment has been processed successfully.
          </p>

          {loading ? (
            <div className="text-white/50 text-sm mb-6">
              Processing your order...
            </div>
          ) : (
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-6">
              <p className="text-white/50 text-xs mb-1">Session ID</p>
              <p className="text-white/80 text-sm font-mono break-all">
                {sessionId || "N/A"}
              </p>
            </div>
          )}

          {/* Next Steps */}
          <div className="text-left bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 mb-8">
            <p className="text-blue-400 text-sm font-medium mb-2">What happens next?</p>
            <ul className="text-white/70 text-sm space-y-1">
              <li>• You'll receive a confirmation email shortly</li>
              <li>• Our team will reach out within 24 hours</li>
              <li>• We'll begin work on your project</li>
            </ul>
          </div>

          {/* Action Buttons */}
          <Link
            href="/"
            className="inline-block px-8 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-lg shadow-green-500/20 hover:shadow-green-500/30 font-medium"
          >
            Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
