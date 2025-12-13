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
  Filter,
  Calendar,
  Code,
  Folder,
  Globe,
  Lock
} from "lucide-react";
import type { Blueprint, BlueprintStatus } from "@/lib/ai/types";
import { createClient } from "@/lib/auth/client";
import { BlueprintGridSkeleton, StatSkeleton } from "./components/BlueprintSkeleton";

export default function DashboardPage() {
  const [blueprints, setBlueprints] = useState<Blueprint[]>([]);
  const [filteredBlueprints, setFilteredBlueprints] = useState<Blueprint[]>([]);
  const [isLoadingBlueprints, setIsLoadingBlueprints] = useState(true);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStarred, setFilterStarred] = useState(false);
  const [filterArchived, setFilterArchived] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [allTags, setAllTags] = useState<string[]>([]);
  const [filterStatus, setFilterStatus] = useState<BlueprintStatus | 'all'>('all');
  const [subscriptionStatus, setSubscriptionStatus] = useState<string | null>(null);
  const [isPro, setIsPro] = useState(false);
  const router = useRouter();

  // Helper function to get status badge colors
  const getStatusColor = (status: BlueprintStatus) => {
    switch (status) {
      case 'idea':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
      case 'planning':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'building':
        return 'bg-orange-500/20 text-orange-300 border-orange-500/30';
      case 'shipped':
        return 'bg-green-500/20 text-green-300 border-green-500/30';
      default:
        return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  const getStatusLabel = (status: BlueprintStatus) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
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
  }, [blueprints, searchQuery, selectedTags, filterStatus]);

  const checkAuth = async () => {
    try {
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
    } finally {
      setIsLoadingUser(false);
    }
  };

  const fetchBlueprints = async () => {
    setIsLoadingBlueprints(true);
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
      setIsLoadingBlueprints(false);
    }
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

    // Status filter
    if (filterStatus !== 'all') {
      filtered = filtered.filter(bp => bp.status === filterStatus);
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

  const togglePublic = async (id: string, currentPublic: boolean) => {
    try {
      const response = await fetch(`/api/blueprints/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_public: !currentPublic }),
      });

      if (!response.ok) throw new Error("Failed to update");

      setBlueprints(blueprints.map(bp =>
        bp.id === id ? { ...bp, is_public: !currentPublic } : bp
      ));
    } catch (error) {
      console.error("Error toggling public:", error);
    }
  };

  const updateStatus = async (id: string, newStatus: BlueprintStatus) => {
    try {
      const response = await fetch(`/api/blueprints/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Update failed:", errorData);
        throw new Error(errorData.error || "Failed to update");
      }

      setBlueprints(blueprints.map(bp =>
        bp.id === id ? { ...bp, status: newStatus } : bp
      ));
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update status. Check console for details.");
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

  // Redirect check - only show spinner if redirecting
  if (isLoadingUser && !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white/60">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Compact Header with Stats */}
        <div className="bg-black/20 backdrop-blur-xl border border-white/10 rounded-xl p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-extralight text-white mb-1">My Blueprints</h1>
              <p className="text-white/50 text-sm">Explore and manage your project ideas</p>
            </div>
            <button
              onClick={() => router.push("/")}
              className="px-5 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg transition-all inline-flex items-center gap-2 font-medium text-sm shadow-lg shadow-blue-500/20"
            >
              <Plus className="w-4 h-4" />
              New Blueprint
            </button>
          </div>

          {/* Compact Stats Row */}
          <div className="grid grid-cols-3 gap-4">
            {isLoadingBlueprints ? (
              <>
                <StatSkeleton />
                <StatSkeleton />
                <StatSkeleton />
              </>
            ) : (
              <>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Folder className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-white/40 text-xs font-light">Total</p>
                    <p className="text-2xl font-light text-white">{blueprints.length}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Star className="w-5 h-5 text-yellow-400" />
                  </div>
                  <div>
                    <p className="text-white/40 text-xs font-light">Starred</p>
                    <p className="text-2xl font-light text-white">
                      {blueprints.filter(bp => bp.is_starred).length}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-5 h-5 text-green-400" />
                  </div>
                  <div>
                    <p className="text-white/40 text-xs font-light">This Month</p>
                    <p className="text-2xl font-light text-white">
                      {blueprints.filter(bp => {
                        const date = new Date(bp.created_at);
                        const now = new Date();
                        return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
                      }).length}
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

          {/* Compact Search and Filters */}
          <div className="bg-black/20 backdrop-blur-xl border border-white/10 rounded-xl p-4 mb-6">
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
                {/* Status Filter Dropdown */}
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value as BlueprintStatus | 'all')}
                  className="px-4 py-3 bg-black/20 border border-white/10 rounded-lg text-white/70 hover:border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                >
                  <option value="all">All Status</option>
                  <option value="idea">Idea</option>
                  <option value="planning">Planning</option>
                  <option value="building">Building</option>
                  <option value="shipped">Shipped</option>
                </select>

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
          {isLoadingBlueprints ? (
            <BlueprintGridSkeleton />
          ) : filteredBlueprints.length === 0 ? (
            <div className="bg-black/20 backdrop-blur-xl border border-white/10 rounded-xl p-12 text-center">
              <Folder className="w-16 h-16 text-blue-400/50 mx-auto mb-4" />
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
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-medium text-white truncate group-hover:text-blue-400 transition-colors">
                          {blueprint.project_name}
                        </h3>
                        {/* Public/Private Badge */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            togglePublic(blueprint.id, blueprint.is_public);
                          }}
                          className="flex-shrink-0 p-1 hover:bg-white/10 rounded transition-all"
                          title={blueprint.is_public ? "Public - Click to make private" : "Private - Click to make public"}
                        >
                          {blueprint.is_public ? (
                            <Globe className="w-4 h-4 text-green-400" />
                          ) : (
                            <Lock className="w-4 h-4 text-white/40" />
                          )}
                        </button>
                      </div>
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

                  {/* Status Badge */}
                  <div className="mb-3">
                    <select
                      value={blueprint.status || 'idea'}
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) => {
                        e.stopPropagation();
                        updateStatus(blueprint.id, e.target.value as BlueprintStatus);
                      }}
                      className={`px-3 py-1 rounded-full text-xs border font-medium cursor-pointer focus:outline-none focus:ring-2 focus:ring-white/20 ${getStatusColor(blueprint.status || 'idea')}`}
                    >
                      <option value="idea">Idea</option>
                      <option value="planning">Planning</option>
                      <option value="building">Building</option>
                      <option value="shipped">Shipped</option>
                    </select>
                  </div>

                  {/* Summary */}
                  <p className="text-white/70 text-sm font-light mb-4 line-clamp-2">
                    {blueprint.summary || "No summary available"}
                  </p>

                  {/* Tech Stack Badges */}
                  {blueprint.tech_stack && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {blueprint.tech_stack.frontend?.slice(0, 2).map((tech, index) => (
                        <span
                          key={`frontend-${index}`}
                          className="px-2 py-1 bg-cyan-500/20 text-cyan-300 text-xs rounded border border-cyan-500/30 font-medium"
                        >
                          {tech}
                        </span>
                      ))}
                      {blueprint.tech_stack.backend?.slice(0, 1).map((tech, index) => (
                        <span
                          key={`backend-${index}`}
                          className="px-2 py-1 bg-emerald-500/20 text-emerald-300 text-xs rounded border border-emerald-500/30 font-medium"
                        >
                          {tech}
                        </span>
                      ))}
                      {blueprint.tech_stack.database?.slice(0, 1).map((tech, index) => (
                        <span
                          key={`database-${index}`}
                          className="px-2 py-1 bg-violet-500/20 text-violet-300 text-xs rounded border border-violet-500/30 font-medium"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}

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
    </div>
  );
}
