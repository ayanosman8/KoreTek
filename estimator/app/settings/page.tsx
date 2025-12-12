"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, CreditCard, UserX, LogOut, Trash2, Settings as SettingsIcon } from "lucide-react";
import { createClient } from "@/lib/auth/client";

export default function SettingsPage() {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      router.push("/");
      return;
    }

    setUser(user);
    setIsLoading(false);
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
            <div>
              <p className="text-sm text-white/50 mb-1">Account ID</p>
              <p className="text-white/70 text-sm font-mono">{user?.id}</p>
            </div>
          </div>
        </div>

        {/* Subscription Management */}
        <div className="bg-black/20 backdrop-blur-xl border border-white/10 rounded-xl p-8 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-xl font-light text-white mb-2">Subscription</h2>
              <p className="text-white/60 text-sm">Manage your billing and subscription</p>
            </div>
            <CreditCard className="w-6 h-6 text-blue-400" />
          </div>

          <div className="bg-black/30 border border-white/10 rounded-lg p-6 mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-white font-medium">Current Plan</span>
              <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm">Free</span>
            </div>
            <p className="text-white/60 text-sm">Upgrade to Pro for advanced features</p>
          </div>

          <button
            onClick={() => {
              // TODO: Implement subscription management
              alert('Subscription management coming soon!');
            }}
            className="w-full px-6 py-3 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/50 text-blue-400 rounded-lg transition-all"
          >
            Manage Subscription
          </button>
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
