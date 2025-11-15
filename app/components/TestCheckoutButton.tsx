"use client";

import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { CreditCard } from "lucide-react";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function TestCheckoutButton() {
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    try {
      setLoading(true);

      // Call your API to create a checkout session
      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          packageName: "Test Package - $10",
        }),
      });

      const { url, error } = await response.json();

      if (error) {
        console.error("Checkout error:", error);
        alert("Failed to create checkout session. Check console for details.");
        setLoading(false);
        return;
      }

      // Redirect to Stripe Checkout
      if (url) {
        window.location.href = url;
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong. Check console for details.");
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 left-6 z-50">
      <button
        onClick={handleCheckout}
        disabled={loading}
        className="group relative px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-2xl shadow-2xl hover:shadow-blue-500/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3"
      >
        <CreditCard className="w-5 h-5" />
        <span className="font-medium">
          {loading ? "Loading..." : "Test Stripe Checkout"}
        </span>
      </button>
      <div className="mt-2 text-xs text-white/50 bg-black/50 backdrop-blur-sm rounded-lg px-3 py-2 max-w-xs">
        Click to test Stripe payment flow ($10 test charge)
      </div>
    </div>
  );
}
