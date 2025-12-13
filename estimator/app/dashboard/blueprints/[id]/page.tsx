"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, RefreshCw, CheckCircle2, Lock, Code, Edit2, Save, X, Plus, Trash2, Link as LinkIcon, ExternalLink, Check, Circle, ChevronDown, ChevronRight, Clock, AlertCircle, FileText, Layers, CheckSquare, GripVertical } from "lucide-react";
import type { Blueprint, FeatureDetail } from "@/lib/ai/types";
import { createClient } from "@/lib/auth/client";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { HeaderSkeleton, BlueprintDetailSkeleton } from "./components/BlueprintDetailSkeleton";

export default function BlueprintDetailPage() {
  const [blueprint, setBlueprint] = useState<Blueprint | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPro, setIsPro] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [editedData, setEditedData] = useState<any>({});
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'features' | 'checklist'>('features');
  const [expandedFeatures, setExpandedFeatures] = useState<Set<number | string>>(new Set());
  const [draggedFeatureIndex, setDraggedFeatureIndex] = useState<number | null>(null);
  const [generatingName, setGeneratingName] = useState(false);
  const [generatingSummary, setGeneratingSummary] = useState(false);
  const [loadingEnhancement, setLoadingEnhancement] = useState<string | null>(null);
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

    // Convert all features to enhanced format
    const enhancedFeatures = (data.blueprint.features || []).map((feature: any) => {
      // If it's already an enhanced feature, return as-is
      if (typeof feature === 'object' && feature.hasOwnProperty('name')) {
        return {
          name: feature.name || '',
          description: feature.description || '',
          tier: feature.tier || 'free',
          tech: feature.tech || { packages: [], services: [] },
          database: feature.database || { tables: [], fields: [] },
          implementation: feature.implementation || '',
          inspiration: feature.inspiration || [],
          tasks: feature.tasks || []
        };
      }
      // Convert old-style string feature to enhanced format
      return {
        name: typeof feature === 'string' ? feature : '',
        description: '',
        tier: 'free',
        tech: { packages: [], services: [] },
        database: { tables: [], fields: [] },
        implementation: '',
        inspiration: [],
        tasks: []
      };
    });

    // Auto-populate payment and AI APIs if not already set
    const enhancedTechStack = {
      ...data.blueprint.tech_stack,
      payment_apis: data.blueprint.tech_stack?.payment_apis?.length > 0
        ? data.blueprint.tech_stack.payment_apis
        : ['Stripe', 'PayPal'],
      ai_apis: data.blueprint.tech_stack?.ai_apis?.length > 0
        ? data.blueprint.tech_stack.ai_apis
        : ['OpenAI', 'Anthropic']
    };

    setBlueprint({
      ...data.blueprint,
      features: enhancedFeatures,
      tech_stack: enhancedTechStack
    });

    // Auto-populate checklist from features if empty
    let checklistItems = data.blueprint.checklist || [];
    if (checklistItems.length === 0 && enhancedFeatures.length > 0) {
      checklistItems = enhancedFeatures.map((feature: any) => ({
        text: feature.name || 'Unnamed Feature',
        status: 'pending',
        notes: [],
        issues: []
      }));
    }

    // Initialize editedData with all blueprint data for always-editable sections
    setEditedData({
      features: enhancedFeatures,
      next_steps: data.blueprint.next_steps || [],
      checklist: checklistItems,
    });

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

  const saveSection = async (section: string) => {
    if (!blueprint) return;

    setIsSaving(true);
    try {
      const dataToSave: any = {};
      dataToSave[section] = editedData[section];

      const response = await fetch(`/api/blueprints/${blueprintId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSave),
      });

      if (!response.ok) throw new Error("Failed to save");

      const data = await response.json();
      setBlueprint(data.blueprint);

      // Update editedData to reflect the saved changes
      setEditedData({
        ...editedData,
        [section]: data.blueprint[section]
      });
    } catch (error) {
      console.error("Error saving section:", error);
      alert("Failed to save changes. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  // Handle feature drag and drop
  const handleDragStart = (index: number) => {
    setDraggedFeatureIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.stopPropagation();

    if (draggedFeatureIndex === null || draggedFeatureIndex === index) return;

    const newFeatures = [...editedData.features];
    const draggedFeature = newFeatures[draggedFeatureIndex];

    // Remove from old position
    newFeatures.splice(draggedFeatureIndex, 1);
    // Insert at new position
    newFeatures.splice(index, 0, draggedFeature);

    setEditedData({ ...editedData, features: newFeatures });
    setDraggedFeatureIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedFeatureIndex(null);
  };

  const suggestProjectName = async () => {
    if (!isPro) {
      setShowUpgradeModal(true);
      return;
    }

    if (!blueprint) return;

    setGeneratingName(true);
    try {
      // Extract feature names for context
      const featureNames = blueprint.features.map((f: any) =>
        typeof f === 'object' && f.name ? f.name : f
      );

      const response = await fetch("/api/suggest-project-name", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectDescription: blueprint.project_description,
          currentName: blueprint.project_name,
          features: featureNames
        }),
      });

      if (!response.ok) throw new Error("Failed to suggest name");

      const data = await response.json();
      setEditedData({ ...editedData, project_name: data.name });
    } catch (error) {
      console.error("Error suggesting name:", error);
      alert("Failed to generate name suggestion. Please try again.");
    } finally {
      setGeneratingName(false);
    }
  };

  const suggestProjectSummary = async () => {
    if (!isPro) {
      setShowUpgradeModal(true);
      return;
    }

    if (!blueprint) return;

    setGeneratingSummary(true);
    try {
      // Extract feature names for context
      const featureNames = blueprint.features.map((f: any) =>
        typeof f === 'object' && f.name ? f.name : f
      );

      const response = await fetch("/api/suggest-project-summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectDescription: blueprint.project_description,
          projectName: editedData.project_name || blueprint.project_name,
          features: featureNames
        }),
      });

      if (!response.ok) throw new Error("Failed to suggest summary");

      const data = await response.json();
      setEditedData({ ...editedData, summary: data.summary });
    } catch (error) {
      console.error("Error suggesting summary:", error);
      alert("Failed to generate summary suggestion. Please try again.");
    } finally {
      setGeneratingSummary(false);
    }
  };

  // Don't show anything until we have either the blueprint or confirmed redirect
  if (isLoading && !blueprint) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  if (!blueprint && !isLoading) {
    return null;
  }

  if (!blueprint) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/3 via-transparent to-blue-500/3"></div>
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-12">
        {/* Header - Always Editable */}
        <div className="mb-8">
          <button
            onClick={() => router.push("/dashboard")}
            className="flex items-center gap-2 text-white/60 hover:text-white transition-colors mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Dashboard</span>
          </button>

          {isLoading ? (
            <HeaderSkeleton />
          ) : (
          <div className="bg-black/20 backdrop-blur-xl border border-white/10 rounded-xl p-4 sm:p-6">
            <div className="space-y-4">
              {/* Project Name */}
              <div>
                <label className="block text-sm text-white/60 mb-2">Project Name</label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    value={editedData.project_name || blueprint.project_name}
                    onChange={(e) => setEditedData({ ...editedData, project_name: e.target.value })}
                    className="flex-1 px-4 py-3 bg-black/30 border border-white/20 rounded-lg text-white text-xl sm:text-2xl font-extralight focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    placeholder="Project Name"
                  />
                  <button
                    onClick={suggestProjectName}
                    disabled={generatingName}
                    className="px-4 py-2 bg-gradient-to-r from-emerald-500/80 to-teal-500/80 hover:from-emerald-500 hover:to-teal-500 text-white rounded-lg flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-50 whitespace-nowrap"
                  >
                    {generatingName ? (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <RefreshCw className="w-4 h-4" />
                    )}
                    <span className="hidden sm:inline">{generatingName ? 'Generating...' : `Suggest ${!isPro ? '(Pro)' : ''}`}</span>
                    <span className="sm:hidden">{generatingName ? '...' : 'Suggest'}</span>
                  </button>
                </div>
              </div>

              {/* Summary */}
              <div>
                <label className="block text-sm text-white/60 mb-2">Summary</label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <textarea
                    value={editedData.summary || blueprint.summary || ''}
                    onChange={(e) => setEditedData({ ...editedData, summary: e.target.value })}
                    rows={3}
                    className="flex-1 px-4 py-3 bg-black/30 border border-white/20 rounded-lg text-white font-light focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    placeholder="Project summary"
                  />
                  <button
                    onClick={suggestProjectSummary}
                    disabled={generatingSummary}
                    className="px-4 py-2 bg-gradient-to-r from-emerald-500/80 to-teal-500/80 hover:from-emerald-500 hover:to-teal-500 text-white rounded-lg flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-500/20 sm:self-start disabled:opacity-50 whitespace-nowrap"
                  >
                    {generatingSummary ? (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <RefreshCw className="w-4 h-4" />
                    )}
                    <span className="hidden sm:inline">{generatingSummary ? 'Generating...' : `Suggest ${!isPro ? '(Pro)' : ''}`}</span>
                    <span className="sm:hidden">{generatingSummary ? '...' : 'Suggest'}</span>
                  </button>
                </div>
              </div>

              {/* Tech Stack */}
              <div>
                <label className="block text-sm text-white/60 mb-2">Tech</label>
                <div className="flex flex-wrap gap-2">
                  {[
                    ...(editedData.tech_stack?.frontend || blueprint.tech_stack?.frontend || []),
                    ...(editedData.tech_stack?.backend || blueprint.tech_stack?.backend || []),
                    ...(editedData.tech_stack?.database || blueprint.tech_stack?.database || []),
                    ...(editedData.tech_stack?.payment_apis || blueprint.tech_stack?.payment_apis || []),
                    ...(editedData.tech_stack?.ai_apis || blueprint.tech_stack?.ai_apis || [])
                  ].map((tech: string, index: number) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-500/20 text-blue-300 rounded-full text-sm border border-blue-500/30 hover:border-blue-400/50 transition-colors"
                    >
                      {tech}
                      <button
                        type="button"
                        onClick={() => {
                          const allTech = [
                            ...(editedData.tech_stack?.frontend || blueprint.tech_stack?.frontend || []),
                            ...(editedData.tech_stack?.backend || blueprint.tech_stack?.backend || []),
                            ...(editedData.tech_stack?.database || blueprint.tech_stack?.database || []),
                            ...(editedData.tech_stack?.payment_apis || blueprint.tech_stack?.payment_apis || []),
                            ...(editedData.tech_stack?.ai_apis || blueprint.tech_stack?.ai_apis || [])
                          ];
                          const updated = allTech.filter((_: string, i: number) => i !== index);
                          setEditedData({ ...editedData, tech_stack: { frontend: updated, backend: [], database: [], payment_apis: [], ai_apis: [] } });
                        }}
                        className="hover:text-red-400 transition-colors"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </span>
                  ))}
                  <input
                    type="text"
                    placeholder="+ Add"
                    className="px-3 py-1.5 bg-black/30 border border-blue-500/20 rounded-full text-white text-sm w-20 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:w-32 transition-all"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                        e.preventDefault();
                        const currentFrontend = editedData.tech_stack?.frontend || blueprint.tech_stack?.frontend || [];
                        setEditedData({ ...editedData, tech_stack: { ...blueprint.tech_stack, ...editedData.tech_stack, frontend: [...currentFrontend, e.currentTarget.value.trim()] } });
                        e.currentTarget.value = '';
                      }
                    }}
                  />
                </div>
              </div>

              {/* Save/Reset Buttons */}
              <div className="flex flex-col sm:flex-row gap-2 pt-2">
                <button
                  onClick={async () => {
                    setIsSaving(true);
                    try {
                      const response = await fetch(`/api/blueprints/${blueprintId}`, {
                        method: "PATCH",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                          project_name: editedData.project_name || blueprint.project_name,
                          summary: editedData.summary || blueprint.summary,
                          tech_stack: editedData.tech_stack || blueprint.tech_stack
                        }),
                      });

                      if (!response.ok) throw new Error("Failed to save");

                      const data = await response.json();
                      setBlueprint(data.blueprint);
                      setEditedData({ ...editedData, project_name: '', summary: '', tech_stack: undefined });
                    } catch (error) {
                      console.error("Error saving header:", error);
                      alert("Failed to save changes. Please try again.");
                    } finally {
                      setIsSaving(false);
                    }
                  }}
                  disabled={isSaving}
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 text-sm"
                >
                  <Save className="w-4 h-4" />
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  onClick={() => setEditedData({ ...editedData, project_name: '', summary: '', tech_stack: undefined })}
                  disabled={isSaving}
                  className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 text-sm"
                >
                  <X className="w-4 h-4" />
                  Reset
                </button>
              </div>
            </div>
          </div>
          )}
        </div>

        {/* Tab Navigation */}
        <div className="mb-6 sm:mb-8 bg-black/20 backdrop-blur-xl border border-white/10 rounded-xl p-2 flex gap-2">
          <button
            onClick={() => setActiveTab('features')}
            className={`flex-1 px-3 sm:px-6 py-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2 text-sm sm:text-base ${
              activeTab === 'features'
                ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/20'
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Features</span>
          </button>
          <button
            onClick={() => setActiveTab('checklist')}
            className={`flex-1 px-3 sm:px-6 py-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2 text-sm sm:text-base ${
              activeTab === 'checklist'
                ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/20'
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            <CheckSquare className="w-4 h-4" />
            <span>Checklist</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="mb-12">
          {isLoading ? (
            <BlueprintDetailSkeleton activeTab={activeTab} />
          ) : (
          <>
          {/* Features Tab */}
          {activeTab === 'features' && (
          <div className="bg-black/20 backdrop-blur-xl border border-white/10 rounded-xl p-4 sm:p-6 md:p-8 relative">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
              <h2 className="text-xl sm:text-2xl font-light text-white">Features</h2>
              <button
                onClick={() => {
                  // Add a new feature with popular pre-populated options
                  const newFeature = {
                    name: '',
                    description: '',
                    tier: 'free',
                    tech: {
                      packages: ['react-query', 'axios', 'zustand'],
                      services: ['Vercel', 'Supabase']
                    },
                    resources: []
                  };
                  setEditedData({
                    ...editedData,
                    features: [...(editedData.features || []), newFeature]
                  });
                  // Auto-expand the new feature
                  setExpandedFeatures(new Set([...expandedFeatures, editedData.features.length]));
                }}
                className="w-full sm:w-auto px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-500/20 text-sm"
              >
                <Plus className="w-4 h-4" />
                Add Feature
              </button>
            </div>

            <div className="space-y-4">
              {editedData.features?.map((feature: any, index: number) => {
                // Check if this is a new-format feature (object) or old-format (string)
                const isEnhanced = typeof feature === 'object' && feature.hasOwnProperty('name');
                const isExpanded = expandedFeatures.has(index);

                return (
                  <div
                    key={index}
                    draggable
                    onDragStart={() => handleDragStart(index)}
                    onDragOver={(e) => handleDragOver(e, index)}
                    onDragEnd={handleDragEnd}
                    className={`group cursor-move ${
                      draggedFeatureIndex === index ? 'opacity-50' : ''
                    }`}
                  >
                    {isEnhanced ? (
                      // Enhanced feature with all fields
                      <div className="space-y-3">
                        {/* Name and Expand/Delete */}
                        <div className="flex items-start gap-2">
                          <div className="flex-shrink-0 pt-2 cursor-move">
                            <GripVertical className="w-4 h-4 text-white/30" />
                          </div>
                          <button
                            onClick={() => {
                              const newExpanded = new Set(expandedFeatures);
                              if (isExpanded) {
                                newExpanded.delete(index);
                              } else {
                                newExpanded.add(index);
                              }
                              setExpandedFeatures(newExpanded);
                            }}
                            className="flex-shrink-0 p-2 hover:bg-white/5 rounded transition-colors"
                          >
                            {isExpanded ? (
                              <ChevronDown className="w-4 h-4 text-white/60" />
                            ) : (
                              <ChevronRight className="w-4 h-4 text-white/60" />
                            )}
                          </button>
                          <input
                            type="text"
                            value={feature.name || ''}
                            onChange={(e) => {
                              const newFeatures = [...editedData.features];
                              newFeatures[index] = { ...feature, name: e.target.value };
                              setEditedData({ ...editedData, features: newFeatures });
                            }}
                            className="flex-1 px-4 py-2 bg-black/40 border border-white/20 rounded-lg text-white font-light focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                            placeholder="Feature Name"
                          />
                          <button
                            onClick={() => {
                              const newFeatures = editedData.features.filter((_: any, i: number) => i !== index);
                              setEditedData({ ...editedData, features: newFeatures });
                            }}
                            className="p-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 text-red-400 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Collapsible Details */}
                        {isExpanded && (
                        <div className="space-y-6 pl-6 pt-4 border-t border-white/5">

                        {/* Basic Info Section */}
                        <div className="space-y-3">
                          {/* Tier */}
                          <div className="flex items-center gap-3">
                            <label className="text-xs text-white/40 w-16">Tier</label>
                            <div className="relative">
                              <select
                                value={feature.tier || 'free'}
                                onChange={(e) => {
                                  const newFeatures = [...editedData.features];
                                  newFeatures[index] = { ...feature, tier: e.target.value };
                                  setEditedData({ ...editedData, features: newFeatures });
                                }}
                                className="appearance-none pl-3 pr-8 py-2 bg-black/40 border border-white/20 rounded-lg text-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/50 cursor-pointer hover:border-white/30 transition-colors"
                              >
                                <option value="free">FREE</option>
                                <option value="pro">PRO</option>
                              </select>
                              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 pointer-events-none" />
                            </div>
                          </div>

                          {/* Description */}
                          <div>
                            <label className="block text-xs text-white/40 mb-1.5">Description</label>
                            <textarea
                              value={feature.description || ''}
                              onChange={(e) => {
                                const newFeatures = [...editedData.features];
                                newFeatures[index] = { ...feature, description: e.target.value };
                                setEditedData({ ...editedData, features: newFeatures });
                              }}
                              rows={2}
                              className="w-full px-3 py-2 bg-black/40 border border-white/20 rounded text-white text-sm font-light focus:outline-none focus:ring-1 focus:ring-blue-500/50"
                              placeholder="What does this feature do?"
                            />
                          </div>
                        </div>

                        {/* Tech Stack Section */}
                        <div className="space-y-3">
                          <h4 className="text-xs font-medium text-white/60 uppercase tracking-wider">Tech Stack</h4>

                        {/* NPM Packages */}
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <label className="text-sm text-white/70">NPM Packages</label>
                            <button
                              onClick={() => {
                                const newFeatures = [...editedData.features];
                                const currentPackages = Array.isArray(feature.tech?.packages) ? feature.tech.packages : [];
                                newFeatures[index] = {
                                  ...feature,
                                  tech: { ...(feature.tech || {}), packages: [...currentPackages, ''] }
                                };
                                setEditedData({ ...editedData, features: newFeatures });
                              }}
                              className="text-sm text-white/60 hover:text-white/80 flex items-center gap-1"
                            >
                              <Plus className="w-4 h-4" />
                              Add
                            </button>
                          </div>
                          <div className="space-y-2">
                            {Array.isArray(feature.tech?.packages) && feature.tech.packages.map((pkg: string, pkgIndex: number) => (
                              <div key={pkgIndex} className="flex gap-2">
                                <input
                                  type="text"
                                  value={pkg}
                                  onChange={(e) => {
                                    const newFeatures = [...editedData.features];
                                    const updatedPackages = [...feature.tech.packages];
                                    updatedPackages[pkgIndex] = e.target.value;
                                    newFeatures[index] = {
                                      ...feature,
                                      tech: { ...(feature.tech || {}), packages: updatedPackages }
                                    };
                                    setEditedData({ ...editedData, features: newFeatures });
                                  }}
                                  className="flex-1 px-3 py-2 bg-black/40 border border-white/20 rounded text-white text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                                  placeholder="react-native-voice"
                                />
                                <button
                                  onClick={() => {
                                    const newFeatures = [...editedData.features];
                                    const updatedPackages = feature.tech.packages.filter((_: string, i: number) => i !== pkgIndex);
                                    newFeatures[index] = {
                                      ...feature,
                                      tech: { ...(feature.tech || {}), packages: updatedPackages }
                                    };
                                    setEditedData({ ...editedData, features: newFeatures });
                                  }}
                                  className="p-2 text-red-400 hover:text-red-300"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Services */}
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <label className="text-sm text-white/70">Services</label>
                            <button
                              onClick={() => {
                                const newFeatures = [...editedData.features];
                                const currentServices = Array.isArray(feature.tech?.services) ? feature.tech.services : [];
                                newFeatures[index] = {
                                  ...feature,
                                  tech: { ...(feature.tech || {}), services: [...currentServices, ''] }
                                };
                                setEditedData({ ...editedData, features: newFeatures });
                              }}
                              className="text-sm text-white/60 hover:text-white/80 flex items-center gap-1"
                            >
                              <Plus className="w-4 h-4" />
                              Add
                            </button>
                          </div>
                          <div className="space-y-2">
                            {Array.isArray(feature.tech?.services) && feature.tech.services.map((service: string, serviceIndex: number) => (
                              <div key={serviceIndex} className="flex gap-2">
                                <input
                                  type="text"
                                  value={service}
                                  onChange={(e) => {
                                    const newFeatures = [...editedData.features];
                                    const updatedServices = [...feature.tech.services];
                                    updatedServices[serviceIndex] = e.target.value;
                                    newFeatures[index] = {
                                      ...feature,
                                      tech: { ...(feature.tech || {}), services: updatedServices }
                                    };
                                    setEditedData({ ...editedData, features: newFeatures });
                                  }}
                                  className="flex-1 px-3 py-2 bg-black/40 border border-white/20 rounded text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                                  placeholder="Vercel, Supabase"
                                />
                                <button
                                  onClick={() => {
                                    const newFeatures = [...editedData.features];
                                    const updatedServices = feature.tech.services.filter((_: string, i: number) => i !== serviceIndex);
                                    newFeatures[index] = {
                                      ...feature,
                                      tech: { ...(feature.tech || {}), services: updatedServices }
                                    };
                                    setEditedData({ ...editedData, features: newFeatures });
                                  }}
                                  className="p-2 text-red-400 hover:text-red-300"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                        </div>

                        {/* Resources Section */}
                        <div className="space-y-3">
                          <h4 className="text-xs font-medium text-white/60 uppercase tracking-wider">Resources</h4>

                          <div className="space-y-2">
                            {Array.isArray(feature.resources) && feature.resources.map((resource: string, resourceIndex: number) => (
                              <div key={resourceIndex} className="flex items-center gap-2">
                                <a
                                  href={resource}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex-1 flex items-center gap-2 px-3 py-2 bg-black/40 border border-white/20 rounded text-white text-sm hover:bg-black/60 transition-colors group"
                                >
                                  <LinkIcon className="w-4 h-4 flex-shrink-0" />
                                  <span className="truncate flex-1">{resource}</span>
                                </a>
                                <button
                                  onClick={() => {
                                    const newFeatures = [...editedData.features];
                                    const updatedResources = feature.resources.filter((_: string, i: number) => i !== resourceIndex);
                                    newFeatures[index] = { ...feature, resources: updatedResources };
                                    setEditedData({ ...editedData, features: newFeatures });
                                  }}
                                  className="p-2 text-red-400 hover:text-red-300"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                            ))}
                            <div className="flex gap-2">
                              <input
                                type="url"
                                placeholder="Paste link, documentation, tutorial, etc..."
                                className="flex-1 px-3 py-2 bg-black/40 border border-white/20 rounded text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                                    const newFeatures = [...editedData.features];
                                    const currentResources = Array.isArray(feature.resources) ? feature.resources : [];
                                    newFeatures[index] = {
                                      ...feature,
                                      resources: [...currentResources, e.currentTarget.value.trim()]
                                    };
                                    setEditedData({ ...editedData, features: newFeatures });
                                    e.currentTarget.value = '';
                                  }
                                }}
                              />
                              <button
                                onClick={(e) => {
                                  const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                                  if (input && input.value.trim()) {
                                    const newFeatures = [...editedData.features];
                                    const currentResources = Array.isArray(feature.resources) ? feature.resources : [];
                                    newFeatures[index] = {
                                      ...feature,
                                      resources: [...currentResources, input.value.trim()]
                                    };
                                    setEditedData({ ...editedData, features: newFeatures });
                                    input.value = '';
                                  }
                                }}
                                className="px-3 py-2 text-white/60 hover:text-white/80 flex items-center gap-1 text-sm"
                              >
                                <Plus className="w-4 h-4" />
                                <span className="hidden sm:inline">Add</span>
                              </button>
                            </div>
                          </div>
                        </div>
                        </div>
                        )}
                      </div>
                    ) : (
                      // Old-style string feature
                      <div className="flex items-start gap-2">
                        <input
                          type="text"
                          value={feature}
                          onChange={(e) => {
                            const newFeatures = [...editedData.features];
                            newFeatures[index] = e.target.value;
                            setEditedData({ ...editedData, features: newFeatures });
                          }}
                          className="flex-1 px-4 py-2 bg-black/40 border border-white/20 rounded-lg text-white font-light focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                        />
                        <button
                          onClick={() => {
                            const newFeatures = editedData.features.filter((_: any, i: number) => i !== index);
                            setEditedData({ ...editedData, features: newFeatures });
                          }}
                          className="p-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 text-red-400 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="flex gap-2 pt-6 border-t border-white/5 mt-6">
              <button
                onClick={() => saveSection('features')}
                disabled={isSaving}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-all flex items-center gap-2 disabled:opacity-50 text-sm"
              >
                <Save className="w-4 h-4" />
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                onClick={() => setEditedData({ ...editedData, features: blueprint.features })}
                disabled={isSaving}
                className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-all flex items-center gap-2 disabled:opacity-50 text-sm"
              >
                <X className="w-4 h-4" />
                Reset
              </button>
            </div>
          </div>
          )}

          {/* Checklist Tab */}
          {activeTab === 'checklist' && (
          <div className="bg-black/20 backdrop-blur-xl border border-white/10 rounded-xl p-4 sm:p-6 md:p-8 relative">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
              <h2 className="text-xl sm:text-2xl font-light text-white">Implementation Checklist</h2>
              <button
                onClick={() => {
                  const newItem = {
                    text: '',
                    status: 'pending',
                    notes: [],
                    issues: []
                  };
                  setEditedData({
                    ...editedData,
                    checklist: [...(editedData.checklist || []), newItem]
                  });
                }}
                className="w-full sm:w-auto px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-500/20 text-sm"
              >
                <Plus className="w-4 h-4" />
                Add Item
              </button>
            </div>

            <div className="space-y-3">
              {editedData.checklist?.map((item: any, index: number) => {
                const isExpanded = expandedFeatures.has(`checklist-${index}`);
                const itemStatus = item.status || 'pending';

                return (
                  <div key={index} className="bg-black/30 border border-white/10 rounded-lg group hover:border-white/20 transition-all">
                    <div className="p-3 sm:p-4">
                      <div className="flex items-start gap-3">
                        {/* Expand/Collapse */}
                        <button
                          onClick={() => {
                            const newExpanded = new Set(expandedFeatures);
                            if (isExpanded) {
                              newExpanded.delete(`checklist-${index}`);
                            } else {
                              newExpanded.add(`checklist-${index}`);
                            }
                            setExpandedFeatures(newExpanded);
                          }}
                          className="flex-shrink-0 p-2 hover:bg-white/5 rounded transition-colors"
                        >
                          {isExpanded ? (
                            <ChevronDown className="w-4 h-4 text-white/60" />
                          ) : (
                            <ChevronRight className="w-4 h-4 text-white/60" />
                          )}
                        </button>

                        {/* Status Indicator */}
                        <button
                          onClick={() => {
                            const newChecklist = [...editedData.checklist];
                            const nextStatus = itemStatus === 'pending' ? 'in_progress' : itemStatus === 'in_progress' ? 'completed' : 'pending';
                            newChecklist[index] = { ...item, status: nextStatus };
                            setEditedData({ ...editedData, checklist: newChecklist });
                          }}
                          className={`flex-shrink-0 w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all ${
                            itemStatus === 'completed'
                              ? 'bg-green-500 border-green-500'
                              : itemStatus === 'in_progress'
                              ? 'bg-yellow-500 border-yellow-500'
                              : 'bg-black/40 border-white/20 hover:border-white/40'
                          }`}
                          title={itemStatus === 'pending' ? 'Not started' : itemStatus === 'in_progress' ? 'In progress' : 'Completed'}
                        >
                          {itemStatus === 'completed' && <Check className="w-4 h-4 text-white" />}
                          {itemStatus === 'in_progress' && <Clock className="w-4 h-4 text-white" />}
                        </button>

                        {/* Text Input */}
                        <div className="flex-1 flex items-center gap-2">
                          <input
                            type="text"
                            value={item.text || ''}
                            onChange={(e) => {
                              const newChecklist = [...editedData.checklist];
                              newChecklist[index] = { ...item, text: e.target.value };
                              setEditedData({ ...editedData, checklist: newChecklist });
                            }}
                            className={`flex-1 px-3 py-2 bg-transparent border-none text-white focus:outline-none ${
                              itemStatus === 'completed' ? 'line-through text-white/40' : ''
                            }`}
                            placeholder="Add checklist item..."
                          />
                          {itemStatus === 'in_progress' && (
                            <span className="px-2 py-1 bg-yellow-500/20 border border-yellow-500/40 rounded-md text-xs font-medium text-yellow-400 flex items-center gap-1 whitespace-nowrap">
                              <Clock className="w-3 h-3" />
                              In Progress
                            </span>
                          )}
                        </div>

                        {/* Delete Button */}
                        <button
                          onClick={() => {
                            const newChecklist = editedData.checklist.filter((_: any, i: number) => i !== index);
                            setEditedData({ ...editedData, checklist: newChecklist });
                          }}
                          className="flex-shrink-0 p-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 text-red-400 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Expanded Content */}
                      {isExpanded && (
                        <div className="mt-4 pl-6 space-y-4 border-t border-white/5 pt-4">
                          {/* Notes Section */}
                          <div>
                            <label className="text-sm text-white/70 flex items-center gap-2 mb-2">
                              <FileText className="w-4 h-4" />
                              Notes
                            </label>
                            <div className="space-y-2">
                              {(() => {
                                const notes = Array.isArray(item.notes) ? item.notes : [];
                                const displayNotes = notes.length > 0 ? notes : [''];

                                return displayNotes.map((note: string, noteIndex: number) => (
                                  <div key={noteIndex} className="flex gap-2">
                                    <input
                                      type="text"
                                      value={note}
                                      onChange={(e) => {
                                        const newChecklist = [...editedData.checklist];
                                        const currentNotes = Array.isArray(item.notes) ? [...item.notes] : [];

                                        if (currentNotes.length === 0) {
                                          // First note being added
                                          currentNotes[0] = e.target.value;
                                        } else {
                                          currentNotes[noteIndex] = e.target.value;
                                        }

                                        newChecklist[index] = { ...item, notes: currentNotes };
                                        setEditedData({ ...editedData, checklist: newChecklist });

                                        // Auto-add a new empty field if this is the last one and it has content
                                        if (noteIndex === currentNotes.length - 1 && e.target.value.trim()) {
                                          setTimeout(() => {
                                            const updatedChecklist = [...editedData.checklist];
                                            updatedChecklist[index] = {
                                              ...updatedChecklist[index],
                                              notes: [...currentNotes, '']
                                            };
                                            setEditedData({ ...editedData, checklist: updatedChecklist });
                                          }, 0);
                                        }
                                      }}
                                      className="flex-1 px-3 py-2 bg-black/40 border border-white/20 rounded text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                                      placeholder="Add a note..."
                                    />
                                    {notes.length > 0 && (noteIndex < notes.length || note.trim()) && (
                                      <button
                                        onClick={() => {
                                          const newChecklist = [...editedData.checklist];
                                          const updatedNotes = item.notes.filter((_: string, i: number) => i !== noteIndex);
                                          newChecklist[index] = { ...item, notes: updatedNotes };
                                          setEditedData({ ...editedData, checklist: newChecklist });
                                        }}
                                        className="p-2 text-red-400 hover:text-red-300"
                                      >
                                        <X className="w-4 h-4" />
                                      </button>
                                    )}
                                  </div>
                                ));
                              })()}
                            </div>
                          </div>

                          {/* Issues Section */}
                          <div>
                            <label className="text-sm text-white/70 flex items-center gap-2 mb-2">
                              <AlertCircle className="w-4 h-4" />
                              Issues
                            </label>
                            <div className="space-y-2">
                              {(() => {
                                const issues = Array.isArray(item.issues) ? item.issues : [];
                                const displayIssues = issues.length > 0 ? issues : [''];

                                return displayIssues.map((issue: string, issueIndex: number) => (
                                  <div key={issueIndex} className="flex gap-2">
                                    <input
                                      type="text"
                                      value={issue}
                                      onChange={(e) => {
                                        const newChecklist = [...editedData.checklist];
                                        const currentIssues = Array.isArray(item.issues) ? [...item.issues] : [];

                                        if (currentIssues.length === 0) {
                                          // First issue being added
                                          currentIssues[0] = e.target.value;
                                        } else {
                                          currentIssues[issueIndex] = e.target.value;
                                        }

                                        newChecklist[index] = { ...item, issues: currentIssues };
                                        setEditedData({ ...editedData, checklist: newChecklist });

                                        // Auto-add a new empty field if this is the last one and it has content
                                        if (issueIndex === currentIssues.length - 1 && e.target.value.trim()) {
                                          setTimeout(() => {
                                            const updatedChecklist = [...editedData.checklist];
                                            updatedChecklist[index] = {
                                              ...updatedChecklist[index],
                                              issues: [...currentIssues, '']
                                            };
                                            setEditedData({ ...editedData, checklist: updatedChecklist });
                                          }, 0);
                                        }
                                      }}
                                      className="flex-1 px-3 py-2 bg-black/40 border border-red-500/20 rounded text-white text-sm focus:outline-none focus:ring-2 focus:ring-red-500/50"
                                      placeholder="Describe an issue or blocker..."
                                    />
                                    {issues.length > 0 && (issueIndex < issues.length || issue.trim()) && (
                                      <button
                                        onClick={() => {
                                          const newChecklist = [...editedData.checklist];
                                          const updatedIssues = item.issues.filter((_: string, i: number) => i !== issueIndex);
                                          newChecklist[index] = { ...item, issues: updatedIssues };
                                          setEditedData({ ...editedData, checklist: newChecklist });
                                        }}
                                        className="p-2 text-red-400 hover:text-red-300"
                                      >
                                        <X className="w-4 h-4" />
                                      </button>
                                    )}
                                  </div>
                                ));
                              })()}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

              {(!editedData.checklist || editedData.checklist.length === 0) && (
                <div className="text-center py-12 text-white/40">
                  <Circle className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>Checklist auto-populated from features. Add more items if needed!</p>
                </div>
              )}
            </div>

            <div className="flex gap-2 pt-6 border-t border-white/5 mt-6">
              <button
                onClick={() => saveSection('checklist')}
                disabled={isSaving}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-all flex items-center gap-2 disabled:opacity-50 text-sm"
              >
                <Save className="w-4 h-4" />
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                onClick={() => setEditedData({ ...editedData, checklist: blueprint.checklist || [] })}
                disabled={isSaving}
                className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-all flex items-center gap-2 disabled:opacity-50 text-sm"
              >
                <X className="w-4 h-4" />
                Reset
              </button>
            </div>
          </div>
          )}
          </>
          )}
        </div>
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
              Advanced insights are available exclusively for Pro users. Upgrade now to unlock target audience analysis, monetization strategies, and AI-powered feature suggestions.
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
