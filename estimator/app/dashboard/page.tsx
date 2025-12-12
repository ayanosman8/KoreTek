"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Star,
  Archive,
  Plus,
  Trash2,
  Edit,
  ArrowLeft,
  Filter,
  Calendar,
  Code,
  Sparkles,
  LogOut,
  Settings,
  ChevronDown
} from "lucide-react";
import type { Blueprint } from "@/lib/ai/types";
import { createClient } from "@/lib/auth/client";

export default function DashboardPage() {
  const [blueprints, setBlueprints] = useState<Blueprint[]>([]);
  const [filteredBlueprints, setFilteredBlueprints] = useState<Blueprint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStarred, setFilterStarred] = useState(false);
  const [filterArchived, setFilterArchived] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [allTags, setAllTags] = useState<string[]>([]);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [subscriptionStatus, setSubscriptionStatus] = useState<string | null>(null);
  const [isPro, setIsPro] = useState(false);
  const router = useRouter();

  // Generate avatar URL from email
  const getAvatarUrl = (email: string) => {
    const name = email.split('@')[0];
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=3b82f6&color=fff&size=128&bold=true`;
  };

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (user) {
      fetchBlueprints();
    }
  }, [user, filterStarred, filterArchived]);

  useEffect(() => {
    filterBlueprints();
  }, [blueprints, searchQuery, selectedTags]);

  const checkAuth = async () => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      router.push("/");
      return;
    }

    setUser(user);

    // Fetch subscription status
    const { data: profile } = await supabase
      .from('profiles')
      .select('subscription_status, has_paid')
      .eq('id', user.id)
      .single();

    if (profile) {
      const status = profile.subscription_status || (profile.has_paid ? 'active' : null);
      setSubscriptionStatus(status);
      setIsPro(status === 'active');
    }
  };

  const fetchBlueprints = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (filterStarred) params.append("starred", "true");
      if (filterArchived) params.append("archived", "true");

      const response = await fetch(`/api/blueprints?${params.toString()}`);
      if (!response.ok) throw new Error("Failed to fetch blueprints");

      const data = await response.json();
      setBlueprints(data.blueprints || []);

      // Extract all unique tags
      const tags = new Set<string>();
      data.blueprints?.forEach((bp: Blueprint) => {
        bp.tags?.forEach((tag: string) => tags.add(tag));
      });
      setAllTags(Array.from(tags));
    } catch (error) {
      console.error("Error fetching blueprints:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
  };

  const filterBlueprints = () => {
    let filtered = [...blueprints];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(bp =>
        bp.project_name.toLowerCase().includes(query) ||
        bp.project_description?.toLowerCase().includes(query) ||
        bp.summary?.toLowerCase().includes(query)
      );
    }

    // Tags filter
    if (selectedTags.length > 0) {
      filtered = filtered.filter(bp =>
        selectedTags.some(tag => bp.tags?.includes(tag))
      );
    }

    setFilteredBlueprints(filtered);
  };

  const toggleStar = async (id: string, currentStarred: boolean) => {
    try {
      const response = await fetch(`/api/blueprints/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_starred: !currentStarred }),
      });

      if (!response.ok) throw new Error("Failed to update");

      setBlueprints(blueprints.map(bp =>
        bp.id === id ? { ...bp, is_starred: !currentStarred } : bp
      ));
    } catch (error) {
      console.error("Error toggling star:", error);
    }
  };

  const toggleArchive = async (id: string, currentArchived: boolean) => {
    try {
      const response = await fetch(`/api/blueprints/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_archived: !currentArchived }),
      });

      if (!response.ok) throw new Error("Failed to update");

      fetchBlueprints(); // Refresh list
    } catch (error) {
      console.error("Error toggling archive:", error);
    }
  };

  const deleteBlueprint = async (id: string) => {
    if (!confirm("Are you sure you want to delete this blueprint?")) return;

    try {
      const response = await fetch(`/api/blueprints/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete");

      setBlueprints(blueprints.filter(bp => bp.id !== id));
    } catch (error) {
      console.error("Error deleting blueprint:", error);
    }
  };

  const openBlueprint = (blueprint: Blueprint) => {
    // Navigate to blueprint detail page
    router.push(`/dashboard/blueprints/${blueprint.id}`);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white/60">Loading your blueprints...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/3 via-transparent to-blue-500/3"></div>
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50">
        <div className="absolute inset-0 bg-black/40 backdrop-blur-xl border-b border-white/10"></div>
        <div className="relative w-full px-6 lg:px-12 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.push("/")}
              className="flex items-center gap-2 text-white/70 hover:text-blue-400 transition-all font-light"
            >
              <ArrowLeft className="w-4 h-4" />
              Home
            </button>
            <h1 className="text-xl font-extralight tracking-tight">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-300">
                My Blueprints
              </span>
            </h1>

            {/* User Profile & Actions */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push("/")}
                className="px-4 py-2 bg-gradient-to-r from-blue-500/90 to-blue-600/90 hover:from-blue-500 hover:to-blue-600 text-white rounded-lg transition-all inline-flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">New Blueprint</span>
              </button>

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
                              router.push('/settings');
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
        </div>
      </header>

      <main className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-black/20 backdrop-blur-xl border border-white/10 rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/50 text-sm font-light mb-1">Total Blueprints</p>
                  <p className="text-3xl font-light text-white">{blueprints.length}</p>
                </div>
                <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-blue-400" />
                </div>
              </div>
            </div>

            <div className="bg-black/20 backdrop-blur-xl border border-white/10 rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/50 text-sm font-light mb-1">Starred</p>
                  <p className="text-3xl font-light text-white">
                    {blueprints.filter(bp => bp.is_starred).length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-yellow-500/20 rounded-full flex items-center justify-center">
                  <Star className="w-6 h-6 text-yellow-400" />
                </div>
              </div>
            </div>

            <div className="bg-black/20 backdrop-blur-xl border border-white/10 rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/50 text-sm font-light mb-1">This Month</p>
                  <p className="text-3xl font-light text-white">
                    {blueprints.filter(bp => {
                      const date = new Date(bp.created_at);
                      const now = new Date();
                      return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
                    }).length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-green-400" />
                </div>
              </div>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="bg-black/20 backdrop-blur-xl border border-white/10 rounded-xl p-6 mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                <input
                  type="text"
                  placeholder="Search blueprints..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-black/20 border border-white/10 rounded-lg text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500/50 font-light"
                />
              </div>

              {/* Filters */}
              <div className="flex gap-2">
                <button
                  onClick={() => setFilterStarred(!filterStarred)}
                  className={`px-4 py-3 rounded-lg border transition-all inline-flex items-center gap-2 ${
                    filterStarred
                      ? "bg-yellow-500/20 border-yellow-500/50 text-yellow-400"
                      : "bg-black/20 border-white/10 text-white/70 hover:border-white/20"
                  }`}
                >
                  <Star className="w-4 h-4" />
                  Starred
                </button>
                <button
                  onClick={() => setFilterArchived(!filterArchived)}
                  className={`px-4 py-3 rounded-lg border transition-all inline-flex items-center gap-2 ${
                    filterArchived
                      ? "bg-gray-500/20 border-gray-500/50 text-gray-400"
                      : "bg-black/20 border-white/10 text-white/70 hover:border-white/20"
                  }`}
                >
                  <Archive className="w-4 h-4" />
                  Archived
                </button>
              </div>
            </div>

            {/* Tags */}
            {allTags.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="text-white/50 text-sm font-light">Tags:</span>
                {allTags.map(tag => (
                  <button
                    key={tag}
                    onClick={() => {
                      setSelectedTags(prev =>
                        prev.includes(tag)
                          ? prev.filter(t => t !== tag)
                          : [...prev, tag]
                      );
                    }}
                    className={`px-3 py-1 rounded-full text-sm transition-all ${
                      selectedTags.includes(tag)
                        ? "bg-blue-500/30 text-blue-300 border border-blue-500/50"
                        : "bg-black/20 text-white/60 border border-white/10 hover:border-white/20"
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Blueprints Grid */}
          {filteredBlueprints.length === 0 ? (
            <div className="bg-black/20 backdrop-blur-xl border border-white/10 rounded-xl p-12 text-center">
              <Sparkles className="w-16 h-16 text-blue-400/50 mx-auto mb-4" />
              <h3 className="text-xl font-light text-white mb-2">
                {blueprints.length === 0 ? "No blueprints yet" : "No matching blueprints"}
              </h3>
              <p className="text-white/60 mb-6 font-light">
                {blueprints.length === 0
                  ? "Create your first blueprint to get started"
                  : "Try adjusting your filters or search query"
                }
              </p>
              {blueprints.length === 0 && (
                <button
                  onClick={() => router.push("/")}
                  className="px-6 py-3 bg-gradient-to-r from-blue-500/90 to-blue-600/90 hover:from-blue-500 hover:to-blue-600 text-white rounded-lg transition-all inline-flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Create Blueprint
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredBlueprints.map((blueprint) => (
                <div
                  key={blueprint.id}
                  className="bg-black/20 backdrop-blur-xl border border-white/10 rounded-xl p-6 hover:border-blue-500/50 transition-all cursor-pointer group"
                  onClick={() => openBlueprint(blueprint)}
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-medium text-white truncate mb-1 group-hover:text-blue-400 transition-colors">
                        {blueprint.project_name}
                      </h3>
                      <p className="text-sm text-white/50 font-light">
                        {formatDate(blueprint.created_at)}
                      </p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleStar(blueprint.id, blueprint.is_starred);
                      }}
                      className="flex-shrink-0"
                    >
                      <Star
                        className={`w-5 h-5 transition-colors ${
                          blueprint.is_starred
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-white/30 hover:text-yellow-400"
                        }`}
                      />
                    </button>
                  </div>

                  {/* Summary */}
                  <p className="text-white/70 text-sm font-light mb-4 line-clamp-2">
                    {blueprint.summary || "No summary available"}
                  </p>

                  {/* Tags */}
                  {blueprint.tags && blueprint.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {blueprint.tags.slice(0, 3).map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                      {blueprint.tags.length > 3 && (
                        <span className="px-2 py-1 bg-white/10 text-white/50 text-xs rounded-full">
                          +{blueprint.tags.length - 3}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Stats */}
                  <div className="flex items-center gap-4 mb-4 text-sm text-white/50 font-light">
                    <span>{blueprint.features?.length || 0} features</span>
                    <span>•</span>
                    <span>{blueprint.risks?.length || 0} risks</span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-4 border-t border-white/10">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleArchive(blueprint.id, blueprint.is_archived);
                      }}
                      className="flex-1 px-3 py-2 bg-white/5 hover:bg-white/10 text-white/70 rounded-lg transition-all inline-flex items-center justify-center gap-2"
                    >
                      <Archive className="w-4 h-4" />
                      {blueprint.is_archived ? "Unarchive" : "Archive"}
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteBlueprint(blueprint.id);
                      }}
                      className="px-3 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
