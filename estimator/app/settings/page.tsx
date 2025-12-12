"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, CreditCard, UserX, LogOut, Trash2, Settings as SettingsIcon } from "lucide-react";
import { createClient } from "@/lib/auth/client";

export default function SettingsPage() {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [subscriptionStatus, setSubscriptionStatus] = useState<string | null>(null);
  const [isUpgrading, setIsUpgrading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const router = useRouter();

  useEffect(() => {
    checkAuth();

    // Check for success parameter in URL
    const params = new URLSearchParams(window.location.search);
    if (params.get('success') === 'true') {
      setShowSuccess(true);
      // Remove the success param from URL
      window.history.replaceState({}, '', '/settings');
      setTimeout(() => setShowSuccess(false), 5000);
    }
  }, []);

  const checkAuth = async () => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      router.push("/");
      return;
    }

    setUser(user);

    // Fetch subscription status from profiles
    const { data: profile } = await supabase
      .from('profiles')
      .select('subscription_status, has_paid')
      .eq('id', user.id)
      .single();

    if (profile) {
      setSubscriptionStatus(profile.subscription_status || (profile.has_paid ? 'active' : null));
    }

    setIsLoading(false);
  };

  const handleUpgradeToPro = async () => {
    setIsUpgrading(true);
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
      });

      if (!response.ok) throw new Error('Failed to create checkout session');

      const { url } = await response.json();
      window.location.href = url;
    } catch (error) {
      console.error('Error creating checkout session:', error);
      alert('Failed to start checkout. Please try again.');
      setIsUpgrading(false);
    }
  };

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
  };

  const handleDeleteAccount = async () => {
    if (!confirm('Are you sure you want to delete your account? This action cannot be undone and all your blueprints will be permanently deleted.')) {
      return;
    }

    const finalConfirm = prompt('Type "DELETE" to confirm account deletion:');
    if (finalConfirm !== 'DELETE') {
      alert('Account deletion cancelled.');
      return;
    }

    // TODO: Implement actual account deletion API
    alert('Account deletion will be implemented soon');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/3 via-transparent to-blue-500/3"></div>
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-white/60 hover:text-white transition-colors mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>

          <div className="flex items-center gap-4">
            <SettingsIcon className="w-8 h-8 text-blue-400" />
            <h1 className="text-4xl font-extralight text-white">Settings</h1>
          </div>
        </div>

        {/* Account Info */}
        <div className="bg-black/20 backdrop-blur-xl border border-white/10 rounded-xl p-8 mb-6">
          <h2 className="text-xl font-light text-white mb-4">Account Information</h2>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-white/50 mb-1">Email</p>
              <p className="text-white">{user?.email}</p>
            </div>
            {user?.user_metadata?.full_name && (
              <div>
                <p className="text-sm text-white/50 mb-1">Name</p>
                <p className="text-white">{user.user_metadata.full_name}</p>
              </div>
            )}
          </div>
        </div>

        {/* Success Message */}
        {showSuccess && (
          <div className="bg-green-500/20 border border-green-500/50 rounded-xl p-4 mb-6 flex items-center gap-3">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <p className="text-green-400 text-sm font-medium">
              Successfully upgraded to Pro! Your subscription is now active.
            </p>
          </div>
        )}

        {/* Subscription Management */}
        <div className="bg-black/20 backdrop-blur-xl border border-white/10 rounded-xl p-8 mb-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-xl font-light text-white mb-2">Subscription</h2>
              <p className="text-white/60 text-sm">Manage your billing and subscription</p>
            </div>
            <CreditCard className="w-6 h-6 text-blue-400" />
          </div>

          {/* Current Plan */}
          <div className="bg-black/30 border border-white/10 rounded-lg p-6 mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-white font-medium">Current Plan</span>
              <span className={`px-3 py-1 rounded-full text-sm ${
                subscriptionStatus === 'active'
                  ? 'bg-blue-500/20 text-blue-400'
                  : 'bg-white/10 text-white/60'
              }`}>
                {subscriptionStatus === 'active' ? 'Pro' : 'Free'}
              </span>
            </div>
            {subscriptionStatus === 'active' ? (
              <p className="text-white/60 text-sm">You have access to all Pro features</p>
            ) : (
              <p className="text-white/60 text-sm">Upgrade to Pro for unlimited blueprints and advanced features</p>
            )}
          </div>

          {/* Pro Tier Card */}
          {subscriptionStatus !== 'active' && (
            <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/30 rounded-lg p-6 mb-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-medium text-white mb-1">Spark Pro</h3>
                  <div className="flex items-baseline gap-2 mb-3">
                    <span className="text-3xl font-light text-white">$29</span>
                    <span className="text-white/60 text-sm">/month</span>
                  </div>
                </div>
              </div>

              <ul className="space-y-3 mb-6">
                <li className="flex items-start gap-2 text-white/80 text-sm">
                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-1.5" />
                  <span>Unlimited blueprint generation</span>
                </li>
                <li className="flex items-start gap-2 text-white/80 text-sm">
                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-1.5" />
                  <span>Save unlimited blueprints to library</span>
                </li>
                <li className="flex items-start gap-2 text-white/80 text-sm">
                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-1.5" />
                  <span>Advanced blueprint enhancements</span>
                </li>
                <li className="flex items-start gap-2 text-white/80 text-sm">
                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-1.5" />
                  <span>Target audience analysis</span>
                </li>
                <li className="flex items-start gap-2 text-white/80 text-sm">
                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-1.5" />
                  <span>Monetization strategies</span>
                </li>
                <li className="flex items-start gap-2 text-white/80 text-sm">
                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-1.5" />
                  <span>MVP comparison & roadmap</span>
                </li>
                <li className="flex items-start gap-2 text-white/80 text-sm">
                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-1.5" />
                  <span>Priority support</span>
                </li>
              </ul>

              <button
                onClick={handleUpgradeToPro}
                disabled={isUpgrading}
                className="w-full px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isUpgrading ? 'Redirecting to checkout...' : 'Upgrade to Pro'}
              </button>
            </div>
          )}

          {/* Manage Subscription Button (for Pro users) */}
          {subscriptionStatus === 'active' && (
            <button
              onClick={() => {
                // TODO: Implement customer portal
                alert('Customer portal coming soon! You can manage your subscription from Stripe.');
              }}
              className="w-full px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-lg transition-all"
            >
              Manage Subscription
            </button>
          )}
        </div>

        {/* Danger Zone */}
        <div className="bg-black/20 backdrop-blur-xl border border-red-500/20 rounded-xl p-8">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-xl font-light text-red-400 mb-2">Danger Zone</h2>
              <p className="text-white/60 text-sm">Irreversible and destructive actions</p>
            </div>
            <UserX className="w-6 h-6 text-red-400" />
          </div>

          <div className="space-y-4">
            {/* Logout */}
            <div className="bg-black/30 border border-white/10 rounded-lg p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-white font-medium mb-1">Log Out</h3>
                  <p className="text-white/60 text-sm">Sign out of your account on this device</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-lg transition-all flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Log Out
                </button>
              </div>
            </div>

            {/* Delete Account */}
            <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-red-400 font-medium mb-1">Delete Account</h3>
                  <p className="text-white/60 text-sm">Permanently delete your account and all data</p>
                  <p className="text-red-400/80 text-xs mt-2">This action cannot be undone!</p>
                </div>
                <button
                  onClick={handleDeleteAccount}
                  className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 text-red-400 rounded-lg transition-all flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
