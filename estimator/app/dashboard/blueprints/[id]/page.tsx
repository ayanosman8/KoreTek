"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Sparkles, RefreshCw, CheckCircle2, Lock, Code, Edit2, Save, X, Plus, Trash2 } from "lucide-react";
import type { Blueprint } from "@/lib/ai/types";
import { createClient } from "@/lib/auth/client";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function BlueprintDetailPage() {
  const [blueprint, setBlueprint] = useState<Blueprint | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPro, setIsPro] = useState(false);
  const [loadingEnhancement, setLoadingEnhancement] = useState<string | null>(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [editedData, setEditedData] = useState<any>({});
  const [isSaving, setIsSaving] = useState(false);
  const [swappingTech, setSwappingTech] = useState<{ category: string; tech: string; index: number } | null>(null);
  const [techSuggestions, setTechSuggestions] = useState<string[]>([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [customTech, setCustomTech] = useState("");
  const router = useRouter();
  const params = useParams();
  const blueprintId = params.id as string;

  useEffect(() => {
    checkAuthAndFetch();
  }, [blueprintId]);

  const checkAuthAndFetch = async () => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      router.push("/");
      return;
    }

    // Check Pro status
    const { data: profile } = await supabase
      .from('profiles')
      .select('subscription_status, has_paid')
      .eq('id', user.id)
      .single();

    if (profile) {
      const status = profile.subscription_status || (profile.has_paid ? 'active' : null);
      setIsPro(status === 'active');
    }

    // Fetch blueprint
    const response = await fetch(`/api/blueprints/${blueprintId}`);
    if (!response.ok) {
      router.push("/dashboard");
      return;
    }

    const data = await response.json();
    setBlueprint(data.blueprint);
    setIsLoading(false);
  };

  const handleEnhance = async (enhancementType: string) => {
    if (!isPro) {
      setShowUpgradeModal(true);
      return;
    }

    if (!blueprint) return;

    setLoadingEnhancement(enhancementType);
    try {
      const response = await fetch("/api/enhance-blueprint", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectDescription: blueprint.project_description,
          estimate: {
            projectName: blueprint.project_name,
            summary: blueprint.summary,
            features: blueprint.features,
            techStack: blueprint.tech_stack,
            risks: blueprint.risks,
            nextSteps: blueprint.next_steps,
            questions: blueprint.questions,
          },
          enhancementType,
        }),
      });

      if (!response.ok) throw new Error("Failed to enhance");

      const data = await response.json();

      // Update blueprint with new enhancement
      const updatedEnhancements = {
        ...blueprint.enhancements,
        [enhancementType]: data.enhancement
      };

      // Save to database
      const updateResponse = await fetch(`/api/blueprints/${blueprintId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ enhancements: updatedEnhancements }),
      });

      if (!updateResponse.ok) throw new Error("Failed to save");

      // Update local state
      setBlueprint({ ...blueprint, enhancements: updatedEnhancements });

      // Scroll to enhancement
      setTimeout(() => {
        document.getElementById(`enhancement-${enhancementType}`)?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (error) {
      console.error("Error enhancing:", error);
      alert("Failed to generate enhancement. Please try again.");
    } finally {
      setLoadingEnhancement(null);
    }
  };

  const startEditing = (section: string) => {
    if (!isPro) {
      setShowUpgradeModal(true);
      return;
    }

    setEditingSection(section);

    // Initialize edited data with current values
    if (blueprint) {
      switch (section) {
        case 'header':
          setEditedData({
            project_name: blueprint.project_name,
            summary: blueprint.summary || ''
          });
          break;
        case 'features':
          setEditedData({ features: [...blueprint.features] });
          break;
        case 'tech_stack':
          setEditedData({ tech_stack: { ...blueprint.tech_stack } });
          break;
        case 'risks':
          setEditedData({ risks: [...(blueprint.risks || [])] });
          break;
        case 'next_steps':
          setEditedData({ next_steps: [...(blueprint.next_steps || [])] });
          break;
      }
    }
  };

  const cancelEditing = () => {
    setEditingSection(null);
    setEditedData({});
  };

  const saveEdits = async () => {
    if (!blueprint) return;

    setIsSaving(true);
    try {
      const response = await fetch(`/api/blueprints/${blueprintId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editedData),
      });

      if (!response.ok) throw new Error("Failed to save");

      const data = await response.json();
      setBlueprint(data.blueprint);
      setEditingSection(null);
      setEditedData({});
    } catch (error) {
      console.error("Error saving edits:", error);
      alert("Failed to save changes. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const startTechSwap = async (category: string, tech: string, index: number) => {
    if (!isPro) {
      setShowUpgradeModal(true);
      return;
    }

    setSwappingTech({ category, tech, index });
    setCustomTech("");
    setLoadingSuggestions(true);

    try {
      const response = await fetch("/api/suggest-tech-alternatives", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ technology: tech, category }),
      });

      if (!response.ok) throw new Error("Failed to get suggestions");

      const data = await response.json();
      setTechSuggestions(data.alternatives || []);
    } catch (error) {
      console.error("Error getting suggestions:", error);
      setTechSuggestions([]);
    } finally {
      setLoadingSuggestions(false);
    }
  };

  const swapTechnology = async (newTech: string) => {
    if (!blueprint || !swappingTech) return;

    const updatedTechStack = { ...blueprint.tech_stack } as any;
    const categoryItems = [...updatedTechStack[swappingTech.category]];
    categoryItems[swappingTech.index] = newTech;
    updatedTechStack[swappingTech.category] = categoryItems;

    setIsSaving(true);
    try {
      const response = await fetch(`/api/blueprints/${blueprintId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tech_stack: updatedTechStack }),
      });

      if (!response.ok) throw new Error("Failed to save");

      const data = await response.json();
      setBlueprint(data.blueprint);
      setSwappingTech(null);
      setTechSuggestions([]);
      setCustomTech("");
    } catch (error) {
      console.error("Error swapping tech:", error);
      alert("Failed to swap technology. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const cancelTechSwap = () => {
    setSwappingTech(null);
    setTechSuggestions([]);
    setCustomTech("");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  if (!blueprint) {
    return null;
  }

  const enhancementButtons = [
    {
      id: 'target-audience',
      gradient: 'from-blue-500/10 to-cyan-500/10',
      border: 'border-blue-500/20',
      activeBorder: 'border-blue-500',
      title: 'Target Audience',
      desc: 'User personas and pain points',
      icon: '👥'
    },
    {
      id: 'monetization',
      gradient: 'from-emerald-500/10 to-teal-500/10',
      border: 'border-emerald-500/20',
      activeBorder: 'border-emerald-500',
      title: 'Monetization Ideas',
      desc: 'Revenue models and pricing strategies',
      icon: '💰'
    },
    {
      id: 'mvp-comparison',
      gradient: 'from-purple-500/10 to-pink-500/10',
      border: 'border-purple-500/20',
      activeBorder: 'border-purple-500',
      title: 'MVP Strategy',
      desc: 'Quick launch vs full build comparison',
      icon: '🚀'
    },
    {
      id: 'cool-features',
      gradient: 'from-orange-500/10 to-amber-500/10',
      border: 'border-orange-500/20',
      activeBorder: 'border-orange-500',
      title: 'Feature Ideas',
      desc: 'Innovative additions to consider',
      icon: '✨'
    }
  ];

  const enhancementTitles: Record<string, string> = {
    'target-audience': 'Target Audience',
    'monetization': 'Monetization Ideas',
    'mvp-comparison': 'MVP Strategy',
    'cool-features': 'Feature Ideas'
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/3 via-transparent to-blue-500/3"></div>
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.push("/dashboard")}
            className="flex items-center gap-2 text-white/60 hover:text-white transition-colors mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Dashboard</span>
          </button>

          {editingSection === 'header' ? (
            <div className="bg-black/20 backdrop-blur-xl border border-blue-500/30 rounded-xl p-6 mb-4">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-white/60 mb-2">Project Name</label>
                  <input
                    type="text"
                    value={editedData.project_name || ''}
                    onChange={(e) => setEditedData({ ...editedData, project_name: e.target.value })}
                    className="w-full px-4 py-3 bg-black/30 border border-white/20 rounded-lg text-white text-2xl font-extralight focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  />
                </div>
                <div>
                  <label className="block text-sm text-white/60 mb-2">Summary</label>
                  <textarea
                    value={editedData.summary || ''}
                    onChange={(e) => setEditedData({ ...editedData, summary: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-3 bg-black/30 border border-white/20 rounded-lg text-white font-light focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={saveEdits}
                    disabled={isSaving}
                    className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-all flex items-center gap-2 disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" />
                    {isSaving ? 'Saving...' : 'Save'}
                  </button>
                  <button
                    onClick={cancelEditing}
                    disabled={isSaving}
                    className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-all flex items-center gap-2 disabled:opacity-50"
                  >
                    <X className="w-4 h-4" />
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="relative group">
              <h1 className="text-4xl md:text-5xl font-extralight text-white mb-4 tracking-tight">
                {blueprint.project_name}
              </h1>
              {blueprint.summary && (
                <p className="text-xl text-white/60 font-light leading-relaxed mb-4">{blueprint.summary}</p>
              )}
              {isPro && (
                <button
                  onClick={() => startEditing('header')}
                  className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity px-3 py-1.5 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/50 text-blue-400 rounded-lg flex items-center gap-2 text-sm"
                >
                  <Edit2 className="w-4 h-4" />
                  Edit
                </button>
              )}
            </div>
          )}
        </div>

        {/* Core Blueprint Content */}
        <div className="space-y-8 mb-12">
          {/* Features */}
          <div className="bg-black/20 backdrop-blur-xl border border-white/10 rounded-xl p-8 relative group">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-light text-white">Core Features</h2>
              {isPro && editingSection !== 'features' && (
                <button
                  onClick={() => startEditing('features')}
                  className="opacity-0 group-hover:opacity-100 transition-opacity px-3 py-1.5 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/50 text-blue-400 rounded-lg flex items-center gap-2 text-sm"
                >
                  <Edit2 className="w-4 h-4" />
                  Edit
                </button>
              )}
            </div>

            {editingSection === 'features' ? (
              <div className="space-y-4">
                {editedData.features?.map((feature: string, index: number) => (
                  <div key={index} className="flex items-start gap-2">
                    <input
                      type="text"
                      value={feature}
                      onChange={(e) => {
                        const newFeatures = [...editedData.features];
                        newFeatures[index] = e.target.value;
                        setEditedData({ ...editedData, features: newFeatures });
                      }}
                      className="flex-1 px-4 py-2 bg-black/30 border border-white/20 rounded-lg text-white font-light focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    />
                    <button
                      onClick={() => {
                        const newFeatures = editedData.features.filter((_: any, i: number) => i !== index);
                        setEditedData({ ...editedData, features: newFeatures });
                      }}
                      className="p-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 text-red-400 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => {
                    const newFeatures = [...editedData.features, ''];
                    setEditedData({ ...editedData, features: newFeatures });
                  }}
                  className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-lg flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Feature
                </button>
                <div className="flex gap-2 pt-4">
                  <button
                    onClick={saveEdits}
                    disabled={isSaving}
                    className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-all flex items-center gap-2 disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" />
                    {isSaving ? 'Saving...' : 'Save'}
                  </button>
                  <button
                    onClick={cancelEditing}
                    disabled={isSaving}
                    className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-all flex items-center gap-2 disabled:opacity-50"
                  >
                    <X className="w-4 h-4" />
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {blueprint.features.map((feature, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                    <span className="text-white/70 font-light">{feature}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Tech Stack */}
          <div className="bg-black/20 backdrop-blur-xl border border-white/10 rounded-xl p-8 relative">
            <h2 className="text-2xl font-light text-white mb-6 flex items-center gap-3">
              <Code className="w-6 h-6 text-blue-400" />
              Tech Stack
              {isPro && (
                <span className="text-xs text-blue-400/60 font-normal">(Click to swap)</span>
              )}
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {Object.entries(blueprint.tech_stack).map(([category, items]) => (
                <div key={category}>
                  <h3 className="text-sm font-medium text-blue-400 uppercase tracking-wider mb-3">
                    {category}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {(items as string[]).map((item, index) => {
                      const isSwapping = swappingTech?.category === category && swappingTech?.index === index;

                      return (
                        <div key={index} className="relative">
                          {isSwapping ? (
                            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6" onClick={cancelTechSwap}>
                              <div className="bg-gradient-to-br from-gray-900 to-black border border-white/10 rounded-2xl p-6 max-w-md w-full" onClick={(e) => e.stopPropagation()}>
                                <div className="flex items-center justify-between mb-4">
                                  <h3 className="text-xl font-light text-white">Swap {item}</h3>
                                  <button
                                    onClick={cancelTechSwap}
                                    className="p-1 hover:bg-white/10 rounded-lg transition-colors"
                                  >
                                    <X className="w-5 h-5 text-white/60" />
                                  </button>
                                </div>

                                {loadingSuggestions ? (
                                  <div className="flex items-center justify-center py-8">
                                    <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                  </div>
                                ) : (
                                  <>
                                    <div className="mb-4">
                                      <label className="block text-sm text-white/60 mb-2">AI Suggestions</label>
                                      <div className="space-y-2 max-h-60 overflow-y-auto">
                                        {techSuggestions.map((suggestion, idx) => (
                                          <button
                                            key={idx}
                                            onClick={() => swapTechnology(suggestion)}
                                            disabled={isSaving}
                                            className="w-full px-4 py-2 bg-white/5 hover:bg-blue-500/20 border border-white/10 hover:border-blue-500/50 rounded-lg text-white text-left transition-all disabled:opacity-50"
                                          >
                                            {suggestion}
                                          </button>
                                        ))}
                                      </div>
                                    </div>

                                    <div className="border-t border-white/10 pt-4">
                                      <label className="block text-sm text-white/60 mb-2">Or type custom</label>
                                      <div className="flex gap-2">
                                        <input
                                          type="text"
                                          value={customTech}
                                          onChange={(e) => setCustomTech(e.target.value)}
                                          onKeyDown={(e) => {
                                            if (e.key === 'Enter' && customTech.trim()) {
                                              swapTechnology(customTech.trim());
                                            }
                                          }}
                                          placeholder="Enter technology name..."
                                          className="flex-1 px-4 py-2 bg-black/30 border border-white/20 rounded-lg text-white font-light focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                                        />
                                        <button
                                          onClick={() => customTech.trim() && swapTechnology(customTech.trim())}
                                          disabled={!customTech.trim() || isSaving}
                                          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                          {isSaving ? 'Saving...' : 'Swap'}
                                        </button>
                                      </div>
                                    </div>
                                  </>
                                )}
                              </div>
                            </div>
                          ) : (
                            <button
                              onClick={() => startTechSwap(category, item, index)}
                              disabled={!isPro}
                              className={`px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-white/80 text-sm transition-all ${
                                isPro ? 'hover:bg-blue-500/20 hover:border-blue-500/50 cursor-pointer' : 'cursor-not-allowed'
                              }`}
                            >
                              {item}
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Risks */}
          {blueprint.risks && blueprint.risks.length > 0 && (
            <div className="bg-black/20 backdrop-blur-xl border border-white/10 rounded-xl p-8 relative group">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-light text-white">Potential Risks</h2>
                {isPro && editingSection !== 'risks' && (
                  <button
                    onClick={() => startEditing('risks')}
                    className="opacity-0 group-hover:opacity-100 transition-opacity px-3 py-1.5 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/50 text-blue-400 rounded-lg flex items-center gap-2 text-sm"
                  >
                    <Edit2 className="w-4 h-4" />
                    Edit
                  </button>
                )}
              </div>

              {editingSection === 'risks' ? (
                <div className="space-y-4">
                  {editedData.risks?.map((risk: string, index: number) => (
                    <div key={index} className="flex items-start gap-2">
                      <input
                        type="text"
                        value={risk}
                        onChange={(e) => {
                          const newRisks = [...editedData.risks];
                          newRisks[index] = e.target.value;
                          setEditedData({ ...editedData, risks: newRisks });
                        }}
                        className="flex-1 px-4 py-2 bg-black/30 border border-white/20 rounded-lg text-white font-light focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                      />
                      <button
                        onClick={() => {
                          const newRisks = editedData.risks.filter((_: any, i: number) => i !== index);
                          setEditedData({ ...editedData, risks: newRisks });
                        }}
                        className="p-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 text-red-400 rounded-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => {
                      const newRisks = [...editedData.risks, ''];
                      setEditedData({ ...editedData, risks: newRisks });
                    }}
                    className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-lg flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Add Risk
                  </button>
                  <div className="flex gap-2 pt-4">
                    <button
                      onClick={saveEdits}
                      disabled={isSaving}
                      className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-all flex items-center gap-2 disabled:opacity-50"
                    >
                      <Save className="w-4 h-4" />
                      {isSaving ? 'Saving...' : 'Save'}
                    </button>
                    <button
                      onClick={cancelEditing}
                      disabled={isSaving}
                      className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-all flex items-center gap-2 disabled:opacity-50"
                    >
                      <X className="w-4 h-4" />
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <ul className="space-y-3">
                  {blueprint.risks.map((risk, index) => (
                    <li key={index} className="flex items-start gap-3 text-white/70 font-light">
                      <span className="text-amber-400 mt-1">⚠️</span>
                      {risk}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {/* Next Steps */}
          {blueprint.next_steps && blueprint.next_steps.length > 0 && (
            <div className="bg-black/20 backdrop-blur-xl border border-white/10 rounded-xl p-8 relative group">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-light text-white">Next Steps</h2>
                {isPro && editingSection !== 'next_steps' && (
                  <button
                    onClick={() => startEditing('next_steps')}
                    className="opacity-0 group-hover:opacity-100 transition-opacity px-3 py-1.5 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/50 text-blue-400 rounded-lg flex items-center gap-2 text-sm"
                  >
                    <Edit2 className="w-4 h-4" />
                    Edit
                  </button>
                )}
              </div>

              {editingSection === 'next_steps' ? (
                <div className="space-y-4">
                  {editedData.next_steps?.map((step: string, index: number) => (
                    <div key={index} className="flex items-start gap-2">
                      <span className="text-blue-400 font-medium mt-2">{index + 1}.</span>
                      <input
                        type="text"
                        value={step}
                        onChange={(e) => {
                          const newSteps = [...editedData.next_steps];
                          newSteps[index] = e.target.value;
                          setEditedData({ ...editedData, next_steps: newSteps });
                        }}
                        className="flex-1 px-4 py-2 bg-black/30 border border-white/20 rounded-lg text-white font-light focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                      />
                      <button
                        onClick={() => {
                          const newSteps = editedData.next_steps.filter((_: any, i: number) => i !== index);
                          setEditedData({ ...editedData, next_steps: newSteps });
                        }}
                        className="p-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 text-red-400 rounded-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => {
                      const newSteps = [...editedData.next_steps, ''];
                      setEditedData({ ...editedData, next_steps: newSteps });
                    }}
                    className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-lg flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Add Step
                  </button>
                  <div className="flex gap-2 pt-4">
                    <button
                      onClick={saveEdits}
                      disabled={isSaving}
                      className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-all flex items-center gap-2 disabled:opacity-50"
                    >
                      <Save className="w-4 h-4" />
                      {isSaving ? 'Saving...' : 'Save'}
                    </button>
                    <button
                      onClick={cancelEditing}
                      disabled={isSaving}
                      className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-all flex items-center gap-2 disabled:opacity-50"
                    >
                      <X className="w-4 h-4" />
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <ol className="space-y-3">
                  {blueprint.next_steps.map((step, index) => (
                    <li key={index} className="flex items-start gap-3 text-white/70 font-light">
                      <span className="text-blue-400 font-medium">{index + 1}.</span>
                      {step}
                    </li>
                  ))}
                </ol>
              )}
            </div>
          )}
        </div>

        {/* Pro Badge */}
        {isPro && (
          <div className="mb-8 flex items-center gap-2 text-blue-400">
            <Sparkles className="w-5 h-5" />
            <span className="text-sm font-medium">Pro Feature Available</span>
          </div>
        )}

        {/* Enhancement Buttons */}
        <div className="mb-12">
          <div className="mb-8">
            <h2 className="text-3xl font-extralight text-white mb-2">Enhance Your Blueprint</h2>
            <p className="text-white/50 font-light">
              {isPro ? 'Add detailed insights to make smarter decisions' : 'Upgrade to Pro to unlock advanced enhancements'}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {enhancementButtons.map(button => {
              const hasEnhancement = blueprint.enhancements && blueprint.enhancements[button.id];

              return (
                <button
                  key={button.id}
                  onClick={() => handleEnhance(button.id)}
                  disabled={loadingEnhancement !== null}
                  className={`
                    group relative overflow-hidden
                    bg-gradient-to-br ${button.gradient}
                    backdrop-blur-xl border-2 ${hasEnhancement ? button.activeBorder : button.border}
                    rounded-2xl p-6 text-left
                    transition-all duration-300 ease-out
                    hover:scale-[1.02]
                    disabled:cursor-not-allowed disabled:opacity-50
                    ${!isPro && 'opacity-60'}
                  `}
                >
                  <div className="relative">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{button.icon}</span>
                        <h3 className="font-medium text-white text-lg">{button.title}</h3>
                      </div>
                      <div className="flex items-center gap-2">
                        {!isPro && <Lock className="w-5 h-5 text-white/50" />}
                        {loadingEnhancement === button.id && (
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        )}
                        {hasEnhancement && (
                          <CheckCircle2 className="w-5 h-5 text-green-400" />
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-white/60 font-light leading-relaxed">{button.desc}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Display Enhancements */}
        {blueprint.enhancements && Object.keys(blueprint.enhancements).length > 0 && (
          <div className="space-y-8">
            {Object.entries(blueprint.enhancements).map(([type, content]) => (
              <div key={type} id={`enhancement-${type}`} className="bg-black/20 border border-blue-500/30 rounded-xl p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-light text-white">{enhancementTitles[type] || type}</h2>
                  <button
                    onClick={() => handleEnhance(type)}
                    disabled={loadingEnhancement !== null}
                    className="flex items-center gap-2 px-3 py-1.5 text-sm text-blue-400 hover:text-blue-300 transition-colors disabled:opacity-50"
                  >
                    <RefreshCw className={`w-4 h-4 ${loadingEnhancement === type ? 'animate-spin' : ''}`} />
                    Regenerate
                  </button>
                </div>
                <div className="prose prose-invert prose-lg max-w-none
                  prose-headings:text-white prose-headings:font-light
                  prose-h2:text-xl prose-h2:mb-4 prose-h2:mt-6 prose-h2:text-blue-400
                  prose-h3:text-lg prose-h3:mb-3 prose-h3:mt-4 prose-h3:text-blue-300
                  prose-p:text-white/70 prose-p:leading-relaxed prose-p:mb-4
                  prose-ul:text-white/70 prose-ul:mb-4 prose-ul:list-disc prose-ul:ml-6
                  prose-ol:text-white/70 prose-ol:mb-4 prose-ol:list-decimal prose-ol:ml-6
                  prose-li:mb-2
                  prose-strong:text-white prose-strong:font-medium
                  prose-code:text-blue-300 prose-code:bg-black/30 prose-code:px-2 prose-code:py-1 prose-code:rounded
                ">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {content as string}
                  </ReactMarkdown>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Upgrade Modal */}
      {showUpgradeModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="bg-gradient-to-br from-gray-900 to-black border border-white/10 rounded-2xl p-8 max-w-md w-full">
            <div className="flex items-center gap-3 mb-4">
              <Lock className="w-8 h-8 text-blue-400" />
              <h3 className="text-2xl font-light text-white">Upgrade to Pro</h3>
            </div>
            <p className="text-white/70 mb-6 leading-relaxed">
              Advanced blueprint enhancements are available exclusively for Pro users. Upgrade now to unlock target audience analysis, monetization strategies, MVP comparisons, and more.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => router.push('/dashboard/settings')}
                className="flex-1 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-all font-medium"
              >
                Upgrade to Pro
              </button>
              <button
                onClick={() => setShowUpgradeModal(false)}
                className="px-6 py-3 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
