"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, Trash2, Eye, ArrowLeft, Loader2 } from "lucide-react";
import { createClient } from "@repo/auth/client";
import type { ProjectEstimate } from "@repo/ai/types";

interface SavedEstimate {
  id: string;
  project_description: string;
  estimate: ProjectEstimate;
  created_at: string;
}

export default function MyEstimatesPage() {
  const [estimates, setEstimates] = useState<SavedEstimate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedEstimate, setSelectedEstimate] = useState<SavedEstimate | null>(null);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    checkAuthAndLoadEstimates();
  }, []);

  const checkAuthAndLoadEstimates = async () => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      router.push("/auth/login");
      return;
    }

    setUser(user);

    // Load user's saved estimates
    const { data, error } = await supabase
      .from('user_estimates')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Error loading estimates:", error);
    } else {
      setEstimates(data || []);
    }

    setIsLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this estimate?")) {
      return;
    }

    const supabase = createClient();
    const { error } = await supabase
      .from('user_estimates')
      .delete()
      .eq('id', id);

    if (error) {
      console.error("Error deleting estimate:", error);
      alert("Failed to delete estimate");
    } else {
      setEstimates(estimates.filter(e => e.id !== id));
      if (selectedEstimate?.id === id) {
        setSelectedEstimate(null);
      }
    }
  };

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-400 animate-spin mx-auto mb-4" />
          <p className="text-white/60 font-light">Loading your estimates...</p>
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
              New Estimate
            </button>
            <h1 className="text-xl font-extralight tracking-tight">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-300">My Estimates</span>
            </h1>
            <button
              onClick={handleSignOut}
              className="text-sm text-white/70 hover:text-blue-400 transition-all font-light"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <main className="pt-32 pb-20 px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          {estimates.length === 0 ? (
            <div className="text-center py-20">
              <Sparkles className="w-16 h-16 text-blue-400/50 mx-auto mb-6" />
              <h2 className="text-2xl font-light text-white mb-4">No saved estimates yet</h2>
              <p className="text-white/60 mb-8 font-light">
                Generate and save your first project estimate to get started
              </p>
              <button
                onClick={() => router.push("/")}
                className="px-6 py-3 bg-gradient-to-r from-blue-500/90 to-blue-600/90 hover:from-blue-500 hover:to-blue-600 text-white rounded-lg transition-all font-medium"
              >
                Create New Estimate
              </button>
            </div>
          ) : (
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Estimates List */}
              <div className="space-y-4">
                <h2 className="text-2xl font-light text-white mb-6">
                  Saved Estimates ({estimates.length})
                </h2>
                {estimates.map((estimate) => (
                  <div
                    key={estimate.id}
                    className="bg-black/20 backdrop-blur-xl border border-white/10 rounded-xl p-6 hover:border-white/20 transition-all"
                  >
                    <h3 className="text-lg font-medium text-white mb-2">
                      {estimate.estimate.projectName}
                    </h3>
                    <p className="text-sm text-white/60 mb-2 font-light line-clamp-2">
                      {estimate.project_description}
                    </p>
                    <p className="text-xs text-white/40 mb-4 font-light">
                      Saved {new Date(estimate.created_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setSelectedEstimate(estimate)}
                        className="flex-1 px-4 py-2 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 text-blue-400 rounded-lg transition-all text-sm font-medium flex items-center justify-center gap-2"
                      >
                        <Eye className="w-4 h-4" />
                        View Details
                      </button>
                      <button
                        onClick={() => handleDelete(estimate.id)}
                        className="px-4 py-2 bg-white/5 hover:bg-red-500/10 border border-white/10 hover:border-red-500/20 text-white/70 hover:text-red-400 rounded-lg transition-all text-sm"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Estimate Details */}
              <div className="lg:sticky lg:top-32 h-fit">
                {selectedEstimate ? (
                  <div className="bg-black/20 backdrop-blur-xl border border-white/10 rounded-xl p-8 space-y-6">
                    <div>
                      <h2 className="text-3xl font-light text-white mb-3">
                        {selectedEstimate.estimate.projectName}
                      </h2>
                      <p className="text-white/60 font-light leading-relaxed">
                        {selectedEstimate.estimate.summary}
                      </p>
                    </div>

                    {/* Features */}
                    <div>
                      <h3 className="text-xl font-light text-white mb-3">Core Features</h3>
                      <div className="space-y-2">
                        {selectedEstimate.estimate.features.map((feature, index) => (
                          <div key={index} className="flex items-start gap-2">
                            <span className="text-blue-400 mt-1">•</span>
                            <span className="text-white/70 font-light text-sm">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Tech Stack */}
                    <div>
                      <h3 className="text-xl font-light text-white mb-3">Tech Stack</h3>
                      <div className="space-y-3">
                        {Object.entries(selectedEstimate.estimate.techStack).map(([category, technologies]) => (
                          <div key={category}>
                            <h4 className="text-xs font-medium text-white/50 uppercase mb-2 tracking-wider">
                              {category}
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {technologies.map((tech, index) => (
                                <span
                                  key={index}
                                  className="px-2 py-1 bg-black/20 border border-white/10 rounded text-xs text-blue-400 font-light"
                                >
                                  {tech}
                                </span>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Next Steps */}
                    {selectedEstimate.estimate.nextSteps && (
                      <div>
                        <h3 className="text-xl font-light text-white mb-3">Next Steps</h3>
                        <ol className="space-y-2">
                          {selectedEstimate.estimate.nextSteps.map((step, index) => (
                            <li key={index} className="flex items-start gap-3">
                              <span className="flex-shrink-0 w-5 h-5 bg-blue-500/20 text-blue-400 rounded-full flex items-center justify-center text-xs font-medium">
                                {index + 1}
                              </span>
                              <span className="text-white/70 font-light text-sm">{step}</span>
                            </li>
                          ))}
                        </ol>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="bg-black/20 backdrop-blur-xl border border-white/10 rounded-xl p-8 text-center">
                    <Eye className="w-12 h-12 text-white/20 mx-auto mb-4" />
                    <p className="text-white/40 font-light">
                      Select an estimate to view details
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
