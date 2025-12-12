"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, Settings, LogOut, ChevronDown } from "lucide-react";
import { createClient } from "@/lib/auth/client";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<any>(null);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
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
  };

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
  };

  const getAvatarUrl = (email: string) => {
    const name = email.split('@')[0];
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=3b82f6&color=fff&size=128&bold=true`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
      {/* Background effects */}
      <div className="fixed inset-0 bg-gradient-to-r from-blue-500/3 via-transparent to-blue-500/3 pointer-events-none"></div>
      <div className="fixed top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="fixed bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Header */}
      <header className="relative z-20 border-b border-white/10 bg-black/40 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-blue-400" />
              <h1 className="text-xl font-light text-white">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-300">Spark</span>
              </h1>
            </div>

            {/* Spacer */}
            <div className="flex-1"></div>

            {/* Navigation */}
            <nav className="hidden md:flex items-center gap-1 mr-4">
              <button
                onClick={() => router.push('/dashboard')}
                className="px-4 py-2 rounded-lg transition-colors text-white/60 hover:text-white hover:bg-white/5"
              >
                Blueprints
              </button>
            </nav>

            {/* User Profile */}
            {user && (
              <div className="relative">
                <button
                  onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                  className="flex items-center gap-3 hover:opacity-80 transition-opacity"
                >
                  <div className="text-right hidden md:block">
                    <p className="text-sm font-medium text-white">{user.user_metadata?.full_name || user.email?.split('@')[0]}</p>
                    <p className="text-xs text-white/50">{user.email}</p>
                  </div>
                  <div className="relative">
                    <img
                      src={user.email ? getAvatarUrl(user.email) : ''}
                      alt={user.user_metadata?.full_name || user.email || 'User'}
                      className="w-10 h-10 rounded-full border-2 border-blue-500/50 bg-blue-500"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                        if (fallback) fallback.style.display = 'flex';
                      }}
                    />
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center border-2 border-blue-500/50" style={{ display: 'none' }}>
                      <span className="text-white font-medium text-sm">
                        {(user.user_metadata?.full_name || user.email || 'U')[0].toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <ChevronDown className="w-4 h-4 text-white/50 hidden md:block" />
                </button>

                {showProfileDropdown && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setShowProfileDropdown(false)}
                    />
                    <div className="absolute right-0 mt-2 w-56 bg-black/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden">
                      <div className="p-3 border-b border-white/10">
                        <p className="text-sm font-medium text-white truncate">{user.user_metadata?.full_name || user.email?.split('@')[0]}</p>
                        <p className="text-xs text-white/50 truncate">{user.email}</p>
                      </div>

                      <div className="py-1">
                        <button
                          onClick={() => {
                            setShowProfileDropdown(false);
                            router.push('/dashboard/settings');
                          }}
                          className="w-full px-4 py-2.5 flex items-center gap-3 hover:bg-white/5 transition-colors text-left"
                        >
                          <Settings className="w-4 h-4 text-white/70" />
                          <span className="text-sm text-white/90">Settings</span>
                        </button>

                        <button
                          onClick={() => {
                            setShowProfileDropdown(false);
                            handleLogout();
                          }}
                          className="w-full px-4 py-2.5 flex items-center gap-3 hover:bg-white/5 transition-colors text-left"
                        >
                          <LogOut className="w-4 h-4 text-white/70" />
                          <span className="text-sm text-white/90">Log Out</span>
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10">
        {children}
      </main>
    </div>
  );
}
