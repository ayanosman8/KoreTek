"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, Code, AlertCircle, ArrowLeft, X, Save, Copy, Download, FileText, ChevronDown, BookmarkPlus, LogOut, Settings, RefreshCw, Edit2, Plus, Trash2, GripVertical } from "lucide-react";
import type { ProjectEstimate, QuestionOption } from "@/lib/ai/types";
import { createClient, signInWithGoogle } from "@/lib/auth/client";
import jsPDF from "jspdf";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function EstimatePage() {
  const [estimate, setEstimate] = useState<ProjectEstimate | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [hasPaid, setHasPaid] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [showSignUpModal, setShowSignUpModal] = useState(false);
  const [signUpLoading, setSignUpLoading] = useState(false);
  const [addedFeatures, setAddedFeatures] = useState<Set<string>>(new Set());
  const [isSavingToLibrary, setIsSavingToLibrary] = useState(false);
  const [saveToLibrarySuccess, setSaveToLibrarySuccess] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [editingProjectName, setEditingProjectName] = useState(false);
  const [editingSummary, setEditingSummary] = useState(false);
  const [draggedFeatureIndex, setDraggedFeatureIndex] = useState<number | null>(null);
  const hasStartedGenerating = useRef(false);
  const router = useRouter();

  // Generate avatar URL from email
  const getAvatarUrl = (email: string) => {
    const name = email.split('@')[0];
    console.log("Generating avatar for:", email, "name:", name);
    const url = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=3b82f6&color=fff&size=128&bold=true`;
    console.log("Avatar URL:", url);
    return url;
  };

  useEffect(() => {
    // If we've already started, don't run again
    if (hasStartedGenerating.current) {
      console.log("Already started generating, skipping");
      return;
    }

    console.log("EstimatePage useEffect running");

    // First, check if we have a saved blueprint in localStorage
    const savedBlueprint = localStorage.getItem("latestBlueprint");
    const savedDescription = localStorage.getItem("latestBlueprintDescription");
    const savedAddedFeatures = localStorage.getItem("latestBlueprintAddedFeatures");
    console.log("Saved blueprint exists:", !!savedBlueprint);
    console.log("Saved description:", savedDescription);

    // Check if there's a NEW project description from the homepage
    const projectDescription = sessionStorage.getItem("projectDescription");
    console.log("Session description:", projectDescription);

    // If there's a new description AND it's different from the saved one, generate new
    if (projectDescription && projectDescription !== savedDescription) {
      console.log("Generating new estimate");
      hasStartedGenerating.current = true;
      // Clear sessionStorage immediately to prevent re-runs
      sessionStorage.removeItem("projectDescription");
      // Clear old data when generating new blueprint
      localStorage.removeItem("latestBlueprintAddedFeatures");
      // Generate a new blueprint
      generateEstimate(projectDescription);
      return;
    }

    // Otherwise, load from localStorage if available
    if (savedBlueprint && savedDescription) {
      console.log("Loading from localStorage");
      hasStartedGenerating.current = true;
      try {
        const parsedEstimate = JSON.parse(savedBlueprint);
        setEstimate(parsedEstimate);

        // Restore added features if they exist
        if (savedAddedFeatures) {
          try {
            const parsedAddedFeatures = JSON.parse(savedAddedFeatures);
            setAddedFeatures(new Set(parsedAddedFeatures));
            console.log("Restored added features:", parsedAddedFeatures);
          } catch (e) {
            console.error("Failed to parse saved added features:", e);
          }
        }

        setIsLoading(false);
        return;
      } catch (error) {
        console.error("Failed to restore blueprint:", error);
      }
    }

    // No saved blueprint and no new description - redirect home
    console.log("No blueprint found, redirecting to home");
    router.push("/");
  }, [router]);

  // TODO: Re-enable auth checks later
  // useEffect(() => {
  //   const checkUserStatus = async () => {
  //     try {
  //       const supabase = createClient();
  //       const { data: { user } } = await supabase.auth.getUser();
  //       if (user) {
  //         setUser(user);
  //       }
  //     } catch (error) {
  //       console.error('Error checking user status:', error);
  //     }
  //   };
  //   checkUserStatus();
  // }, []);

  const generateEstimate = async (description: string) => {
    try {
      const response = await fetch("/api/generate-estimate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectDescription: description }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate estimate");
      }

      const data = await response.json();
      setEstimate(data.estimate);

      // Save to localStorage for free users (persists across refreshes)
      localStorage.setItem("latestBlueprint", JSON.stringify(data.estimate));
      localStorage.setItem("latestBlueprintDescription", description);

      // Auto-save estimate to database for analytics
      try {
        await fetch("/api/save-estimate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            projectDescription: description,
            estimate: data.estimate,
          }),
        });
      } catch (saveError) {
        // Don't fail if saving to analytics fails
        console.error("Failed to save estimate for analytics:", saveError);
      }
    } catch (err) {
      setError("Failed to generate estimate. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
  };

  const handleSaveEstimate = async () => {
    // DEV MODE: Skip payment check for save feature in development
    const isDev = process.env.NODE_ENV === 'development';

    // Not logged in - redirect to login
    if (!user && !isDev) {
      router.push("/auth/login");
      return;
    }

    // Logged in but hasn't paid - redirect to checkout (skip in dev)
    if (!hasPaid && !isDev) {
      setIsSaving(true);
      try {
        const response = await fetch("/api/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        });

        const { url } = await response.json();
        if (url) {
          window.location.href = url;
        }
      } catch (error) {
        console.error("Error creating checkout:", error);
        setIsSaving(false);
      }
      return;
    }

    // Paid user - save estimate (or dev mode)
    setIsSaving(true);
    try {
      const projectDescription = sessionStorage.getItem("projectDescription");

      await fetch("/api/save-user-estimate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectDescription,
          estimate,
        }),
      });

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error("Error saving estimate:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const formatBlueprintAsMarkdown = () => {
    if (!estimate) return '';

    let markdown = `# ${estimate.projectName}\n\n`;
    markdown += `${estimate.summary}\n\n`;

    markdown += `## Core Features\n\n`;
    estimate.features.forEach(feature => {
      const featureName = typeof feature === 'object' ? feature.name : feature;
      markdown += `- ${featureName}\n`;
    });

    markdown += `\n## Recommended Tech Stack\n\n`;
    Object.entries(estimate.techStack).forEach(([category, technologies]) => {
      markdown += `### ${category}\n`;
      technologies.forEach(tech => {
        markdown += `- ${tech}\n`;
      });
      markdown += `\n`;
    });

    if (estimate.risks.length > 0) {
      markdown += `## Potential Risks\n\n`;
      estimate.risks.forEach(risk => {
        markdown += `- ${risk}\n`;
      });
      markdown += `\n`;
    }

    markdown += `## Next Steps\n\n`;
    estimate.nextSteps.forEach((step, index) => {
      markdown += `${index + 1}. ${step}\n`;
    });

    markdown += `\n---\n\n*Generated by Spark - KoreLnx Project Blueprint Tool*\n`;

    return markdown;
  };

  const handleCopyToClipboard = async () => {
    // TODO: Re-enable auth check later
    // if (!user) {
    //   setShowSignUpModal(true);
    //   setShowDropdown(false);
    //   return;
    // }

    const markdown = formatBlueprintAsMarkdown();

    try {
      await navigator.clipboard.writeText(markdown);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const handleDownloadMarkdown = () => {
    const markdown = formatBlueprintAsMarkdown();
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${estimate?.projectName.replace(/[^a-z0-9]/gi, '-').toLowerCase() || 'blueprint'}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleAddFeature = (featureTitle: string) => {
    if (!estimate) return;

    console.log("Adding feature:", featureTitle);

    const updatedEstimate = {
      ...estimate,
      features: [...estimate.features, featureTitle]
    };

    // Add to estimate features
    setEstimate(updatedEstimate);

    // Update localStorage
    localStorage.setItem("latestBlueprint", JSON.stringify(updatedEstimate));

    // Track as added
    setAddedFeatures(prev => {
      const newSet = new Set(prev);
      newSet.add(featureTitle);
      console.log("Added features:", newSet);

      // Save to localStorage
      localStorage.setItem("latestBlueprintAddedFeatures", JSON.stringify(Array.from(newSet)));

      return newSet;
    });

    // Scroll to features section to show it was added
    setTimeout(() => {
      const featuresSection = document.querySelector('.features-section');
      if (featuresSection) {
        featuresSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  const handleDownloadPDF = () => {
    if (!estimate) return;

    // TODO: Re-enable auth check later
    // if (!user) {
    //   setShowSignUpModal(true);
    //   setShowDropdown(false);
    //   return;
    // }

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;
    let yPos = margin;

    // Helper function to add text with word wrap
    const addText = (text: string, fontSize: number, isBold: boolean = false, color: number[] = [0, 0, 0]) => {
      doc.setFontSize(fontSize);
      doc.setFont('helvetica', isBold ? 'bold' : 'normal');
      doc.setTextColor(color[0], color[1], color[2]);
      const lines = doc.splitTextToSize(text, pageWidth - (margin * 2));

      lines.forEach((line: string) => {
        if (yPos > pageHeight - margin) {
          doc.addPage();
          yPos = margin;
        }
        doc.text(line, margin, yPos);
        yPos += fontSize * 0.5;
      });
    };

    const addSpacing = (space: number) => {
      yPos += space;
    };

    // Header
    doc.setFillColor(59, 130, 246); // Blue color
    doc.rect(0, 0, pageWidth, 30, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text('Spark', margin, 20);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('Project Blueprint', pageWidth - margin - 40, 20);

    yPos = 45;

    // Project Name
    addText(estimate.projectName, 18, true, [59, 130, 246]);
    addSpacing(8);

    // Summary
    addText(estimate.summary, 11, false, [60, 60, 60]);
    addSpacing(12);

    // Features
    doc.setDrawColor(200, 200, 200);
    doc.line(margin, yPos, pageWidth - margin, yPos);
    addSpacing(8);
    addText('Core Features', 14, true, [59, 130, 246]);
    addSpacing(6);

    estimate.features.forEach((feature) => {
      const featureName = typeof feature === 'object' ? feature.name : feature;
      addText(`• ${featureName}`, 10);
      addSpacing(2);
    });
    addSpacing(10);

    // Tech Stack
    doc.line(margin, yPos, pageWidth - margin, yPos);
    addSpacing(8);
    addText('Recommended Tech Stack', 14, true, [59, 130, 246]);
    addSpacing(6);

    Object.entries(estimate.techStack).forEach(([category, technologies]) => {
      addText(category, 11, true);
      addSpacing(3);
      technologies.forEach((tech) => {
        addText(`  • ${tech}`, 10);
        addSpacing(2);
      });
      addSpacing(4);
    });
    addSpacing(6);

    // Risks
    if (estimate.risks.length > 0) {
      doc.line(margin, yPos, pageWidth - margin, yPos);
      addSpacing(8);
      addText('Potential Risks', 14, true, [59, 130, 246]);
      addSpacing(6);

      estimate.risks.forEach((risk) => {
        addText(`• ${risk}`, 10);
        addSpacing(2);
      });
      addSpacing(10);
    }

    // Next Steps
    doc.line(margin, yPos, pageWidth - margin, yPos);
    addSpacing(8);
    addText('Next Steps', 14, true, [59, 130, 246]);
    addSpacing(6);

    estimate.nextSteps.forEach((step, index) => {
      addText(`${index + 1}. ${step}`, 10);
      addSpacing(2);
    });

    // Footer
    const finalYPos = doc.internal.pageSize.getHeight() - 15;
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.setFont('helvetica', 'normal');
    doc.text('Generated by Spark - KoreLnx Project Blueprint Tool', pageWidth / 2, finalYPos, { align: 'center' });

    // Save the PDF
    const fileName = `${estimate.projectName.replace(/[^a-z0-9]/gi, '-').toLowerCase()}-blueprint.pdf`;
    doc.save(fileName);
    setShowDropdown(false);
  };

  // Update estimate and save to localStorage
  const updateEstimate = (updates: Partial<ProjectEstimate>) => {
    if (!estimate) return;

    const updatedEstimate = { ...estimate, ...updates };
    setEstimate(updatedEstimate);

    // Save to localStorage
    localStorage.setItem("latestBlueprint", JSON.stringify(updatedEstimate));
  };

  // Handle feature drag and drop
  const handleDragStart = (index: number) => {
    setDraggedFeatureIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.stopPropagation();

    if (draggedFeatureIndex === null || draggedFeatureIndex === index) return;

    const newFeatures = [...estimate.features];
    const draggedFeature = newFeatures[draggedFeatureIndex];

    // Remove from old position
    newFeatures.splice(draggedFeatureIndex, 1);
    // Insert at new position
    newFeatures.splice(index, 0, draggedFeature);

    updateEstimate({ features: newFeatures });
    setDraggedFeatureIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedFeatureIndex(null);
  };

  const handleSaveToLibrary = async () => {
    console.log("🔷 Save to Library button clicked");

    if (!estimate) {
      console.log("❌ No estimate found");
      return;
    }

    console.log("✅ Estimate exists, checking auth...");

    // Check if user is logged in
    const supabase = createClient();
    const { data: { user: currentUser } } = await supabase.auth.getUser();

    console.log("👤 Current user:", currentUser ? currentUser.email : "Not logged in");

    if (!currentUser) {
      console.log("🔓 No user - showing sign up modal");
      // Set flag to auto-save after signup
      localStorage.setItem('autoSaveAfterSignup', 'true');
      setShowSignUpModal(true);
      return;
    }

    console.log("💾 User is logged in, saving to library...");
    setIsSavingToLibrary(true);

    try {
      const projectDescription = localStorage.getItem("latestBlueprintDescription") || "";

      const response = await fetch("/api/blueprints", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          project_name: estimate.projectName,
          project_description: projectDescription,
          summary: estimate.summary,
          features: estimate.features,
          tech_stack: estimate.techStack,
          risks: estimate.risks,
          next_steps: estimate.nextSteps,
          questions: estimate.questions,
        }),
      });

      if (!response.ok) throw new Error("Failed to save blueprint");

      setSaveToLibrarySuccess(true);
      setTimeout(() => setSaveToLibrarySuccess(false), 3000);
    } catch (error) {
      console.error("Error saving to library:", error);
      alert("Failed to save blueprint to library. Please try again.");
    } finally {
      setIsSavingToLibrary(false);
    }
  };

  // Check auth status
  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient();
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      setUser(currentUser);
    };
    checkAuth();
  }, []);

  // Auto-save after signup if flag is set
  useEffect(() => {
    const shouldAutoSave = localStorage.getItem('autoSaveAfterSignup');

    if (shouldAutoSave === 'true' && user && estimate) {
      console.log("🔄 Auto-saving blueprint after signup...");
      localStorage.removeItem('autoSaveAfterSignup');
      handleSaveToLibrary();
    }
  }, [user, estimate]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black relative overflow-hidden flex items-center justify-center">
        {/* Animated background effects */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/3 via-transparent to-blue-500/3"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>

        <div className="text-center relative z-10">
          {/* Animated loader */}
          <div className="relative w-32 h-32 mx-auto mb-8">
            {/* Outer ring */}
            <div className="absolute inset-0 border-4 border-blue-500/20 rounded-full"></div>

            {/* Spinning ring 1 */}
            <div className="absolute inset-0 border-4 border-transparent border-t-blue-500 border-r-blue-400 rounded-full animate-spin"></div>

            {/* Spinning ring 2 - counter direction */}
            <div className="absolute inset-3 border-4 border-transparent border-b-blue-400 border-l-blue-300 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>

            {/* Inner pulsing circle */}
            <div className="absolute inset-8 bg-gradient-to-br from-blue-500/40 to-blue-600/40 rounded-full animate-pulse"></div>

            {/* Center sparkle */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-3 h-3 bg-blue-400 rounded-full animate-ping"></div>
            </div>
          </div>

          <h2 className="text-3xl font-light text-white mb-3 animate-pulse">
            Creating Your Project Blueprint
          </h2>

          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-blue-300 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>

          <p className="text-white/60 font-light text-lg">
            Analyzing your idea with AI
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center px-6">
        <div className="max-w-md w-full bg-black/20 backdrop-blur-xl border border-white/10 rounded-xl p-8 text-center">
          <AlertCircle className="w-12 h-12 text-blue-400 mx-auto mb-4" />
          <h2 className="text-xl font-medium text-white mb-2">Error</h2>
          <p className="text-white/60 mb-4 font-light">{error}</p>
          <button
            onClick={() => router.push("/")}
            className="px-6 py-2 bg-gradient-to-r from-blue-500/90 to-blue-600/90 text-white rounded-lg hover:from-blue-500 hover:to-blue-600 transition-all"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!estimate) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black relative overflow-hidden">
      {/* Background effects - blue accent */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/3 via-transparent to-blue-500/3"></div>
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50">
        <div className="absolute inset-0 bg-black/40 backdrop-blur-xl border-b border-white/10"></div>
        <div className="relative w-full px-6 lg:px-12 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push("/")}
                className="flex items-center gap-2 text-white/70 hover:text-blue-400 transition-all font-light"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>
              {user && (
                <button
                  onClick={() => router.push("/dashboard")}
                  className="flex items-center gap-2 text-white/70 hover:text-blue-400 transition-all font-light"
                >
                  <BookmarkPlus className="w-4 h-4" />
                  My Library
                </button>
              )}
            </div>
            <h1 className="text-xl font-extralight tracking-tight">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-300">Spark</span>
            </h1>

            <div className="flex items-center gap-4">
              {/* Save to Library Button */}
              <button
                onClick={handleSaveToLibrary}
                disabled={isSavingToLibrary}
                className={`px-4 py-2 rounded-lg transition-all inline-flex items-center gap-2 font-medium ${
                  saveToLibrarySuccess
                    ? 'bg-green-500/20 border border-green-500/50 text-green-400'
                    : 'bg-gradient-to-r from-blue-500/90 to-blue-600/90 hover:from-blue-500 hover:to-blue-600 text-white'
                }`}
              >
                {isSavingToLibrary ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Saving...
                  </>
                ) : saveToLibrarySuccess ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    Saved!
                  </>
                ) : (
                  <>
                    <BookmarkPlus className="w-4 h-4" />
                    Save to Library
                  </>
                )}
              </button>

              {/* User Profile */}
              {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                  className="flex items-center gap-3 hover:opacity-80 transition-opacity"
                >
                  <div className="text-right hidden sm:block">
                    <p className="text-sm font-medium text-white">{user.user_metadata?.full_name || user.email?.split('@')[0]}</p>
                    <p className="text-xs text-white/50">{user.email}</p>
                  </div>
                  <div className="relative">
                    <img
                      src={user.email ? getAvatarUrl(user.email) : ''}
                      alt={user.user_metadata?.full_name || user.email || 'User'}
                      className="w-10 h-10 rounded-full border-2 border-blue-500/50 bg-blue-500"
                      onError={(e) => {
                        console.log("Avatar image failed to load, showing fallback");
                        // Fallback to initials if image fails to load
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
                  <ChevronDown className="w-4 h-4 text-white/50 hidden sm:block" />
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
              ) : (
                <button
                  onClick={() => setShowSignUpModal(true)}
                  className="px-4 py-2 bg-gradient-to-r from-blue-500/90 to-blue-600/90 hover:from-blue-500 hover:to-blue-600 text-white text-sm rounded-lg transition-all"
                >
                  Sign In
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="pt-32 pb-20 px-6">
        <div className="max-w-5xl mx-auto">
          {/* Project Name */}
          <div className="mb-16">
            <div className="group relative">
              {editingProjectName ? (
                <input
                  type="text"
                  value={estimate.projectName}
                  onChange={(e) => updateEstimate({ projectName: e.target.value })}
                  onBlur={() => setEditingProjectName(false)}
                  autoFocus
                  className="w-full text-4xl md:text-6xl font-extralight text-white mb-4 tracking-tight bg-transparent border-b-2 border-blue-500 focus:outline-none pb-2"
                />
              ) : (
                <div className="flex items-center gap-3 mb-4">
                  <h1 className="text-4xl md:text-6xl font-extralight text-white tracking-tight">
                    {estimate.projectName}
                  </h1>
                  <button
                    onClick={() => setEditingProjectName(true)}
                    className="opacity-0 group-hover:opacity-100 p-2 hover:bg-white/10 rounded-lg transition-all"
                    title="Edit project name"
                  >
                    <Edit2 className="w-5 h-5 text-white/60" />
                  </button>
                </div>
              )}
            </div>

            <div className="group relative">
              {editingSummary ? (
                <textarea
                  value={estimate.summary}
                  onChange={(e) => updateEstimate({ summary: e.target.value })}
                  onBlur={() => setEditingSummary(false)}
                  autoFocus
                  rows={3}
                  className="w-full text-xl text-white/60 font-light leading-relaxed bg-transparent border-2 border-blue-500 rounded-lg p-3 focus:outline-none resize-none"
                />
              ) : (
                <div className="flex items-start gap-3">
                  <p className="flex-1 text-xl text-white/60 font-light leading-relaxed">{estimate.summary}</p>
                  <button
                    onClick={() => setEditingSummary(true)}
                    className="opacity-0 group-hover:opacity-100 p-2 hover:bg-white/10 rounded-lg transition-all flex-shrink-0"
                    title="Edit summary"
                  >
                    <Edit2 className="w-5 h-5 text-white/60" />
                  </button>
                </div>
              )}
            </div>
          </div>


          {/* Features */}
          <div className="features-section bg-black/20 backdrop-blur-xl border border-white/10 rounded-xl p-8 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-light text-white">Features</h2>
              <button
                onClick={() => {
                  const newFeatures = [
                    ...estimate.features,
                    {
                      name: 'New Feature',
                      description: '',
                      tier: 'free' as const,
                      tech: { packages: [], services: [] },
                      resources: []
                    }
                  ];
                  updateEstimate({ features: newFeatures });
                }}
                className="px-3 py-1.5 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/50 text-blue-400 rounded-lg transition-all flex items-center gap-2 text-sm font-medium"
              >
                <Plus className="w-4 h-4" />
                Add Feature
              </button>
            </div>

            <div className="space-y-3">
              {estimate.features.map((feature, index) => {
                const featureObj = typeof feature === 'object' ? feature : { name: feature, description: '', tier: 'free' as const, tech: { packages: [], services: [] }, resources: [] };

                return (
                  <div
                    key={index}
                    draggable
                    onDragStart={() => handleDragStart(index)}
                    onDragOver={(e) => handleDragOver(e, index)}
                    onDragEnd={handleDragEnd}
                    className={`bg-black/30 border border-white/10 rounded-lg hover:border-white/20 transition-all cursor-move ${
                      draggedFeatureIndex === index ? 'opacity-50' : ''
                    }`}
                  >
                    <div className="p-4">
                      <div className="flex items-start gap-3 mb-3">
                        {/* Drag Handle */}
                        <div className="flex-shrink-0 pt-1 cursor-move">
                          <GripVertical className="w-4 h-4 text-white/30" />
                        </div>

                        {/* Feature Name */}
                        <div className="flex-1">
                          <input
                            type="text"
                            value={featureObj.name}
                            onChange={(e) => {
                              const newFeatures = [...estimate.features];
                              newFeatures[index] = { ...featureObj, name: e.target.value };
                              updateEstimate({ features: newFeatures });
                            }}
                            className="w-full px-2 py-1 bg-transparent text-white font-medium focus:outline-none focus:bg-white/5 rounded"
                            placeholder="Feature name..."
                          />
                        </div>

                        {/* Tier Badge */}
                        <button
                          onClick={() => {
                            const newFeatures = [...estimate.features];
                            const newTier = featureObj.tier === 'free' ? 'pro' as const : 'free' as const;
                            newFeatures[index] = { ...featureObj, tier: newTier };
                            updateEstimate({ features: newFeatures });
                          }}
                          className={`px-2 py-1 rounded text-xs font-medium transition-all ${
                            featureObj.tier === 'pro'
                              ? 'bg-purple-500/20 text-purple-400 border border-purple-500/40'
                              : 'bg-green-500/20 text-green-400 border border-green-500/40'
                          }`}
                        >
                          {featureObj.tier === 'pro' ? 'PRO' : 'FREE'}
                        </button>

                        {/* Delete */}
                        <button
                          onClick={() => {
                            const newFeatures = estimate.features.filter((_, i) => i !== index);
                            updateEstimate({ features: newFeatures });
                          }}
                          className="flex-shrink-0 p-1 hover:bg-red-500/20 text-red-400 rounded transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Description - Always Visible */}
                      <div className="ml-7">
                        <textarea
                          value={featureObj.description || ''}
                          onChange={(e) => {
                            const newFeatures = [...estimate.features];
                            newFeatures[index] = { ...featureObj, description: e.target.value };
                            updateEstimate({ features: newFeatures });
                          }}
                          className="w-full px-3 py-2 bg-black/40 text-white/70 text-sm focus:outline-none focus:bg-black/60 rounded resize-none border border-white/5"
                          rows={3}
                          placeholder="Technical details: screens, components, database tables, integrations..."
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Tech Stack */}
          <div className="bg-black/20 backdrop-blur-xl border border-white/10 rounded-xl p-8 mb-8">
            <div className="flex items-center gap-3 mb-6">
              <Code className="w-6 h-6 text-blue-400" />
              <h2 className="text-2xl font-light text-white">Recommended Tech Stack</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {Object.entries(estimate.techStack).map(([category, technologies]) => (
                <div key={category}>
                  <h3 className="text-sm font-medium text-white/50 uppercase mb-3 tracking-wider">{category.replace(/_/g, ' ')}</h3>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {technologies.map((tech, techIndex) => (
                      <span
                        key={techIndex}
                        className="px-3 py-1 bg-blue-500/20 border border-blue-500/30 rounded-lg text-sm text-blue-400 font-light flex items-center gap-2 group"
                      >
                        {tech}
                        <button
                          onClick={() => {
                            const newTechStack = { ...estimate.techStack };
                            newTechStack[category as keyof typeof newTechStack] = technologies.filter((_, i) => i !== techIndex);
                            updateEstimate({ techStack: newTechStack });
                          }}
                          className="opacity-0 group-hover:opacity-100 text-blue-400/60 hover:text-blue-400 transition-opacity"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                  <input
                    type="text"
                    placeholder={`Add ${category.replace(/_/g, ' ')}...`}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                        const newTechStack = { ...estimate.techStack };
                        newTechStack[category as keyof typeof newTechStack] = [...technologies, e.currentTarget.value.trim()];
                        updateEstimate({ techStack: newTechStack });
                        e.currentTarget.value = '';
                      }
                    }}
                    className="w-full px-3 py-1.5 bg-black/30 border border-white/10 rounded-lg text-white text-sm placeholder-white/30 focus:outline-none focus:border-blue-500/50"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Next Steps */}
          <div className="bg-black/20 border border-white/10 rounded-xl p-8 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-light text-white">Next Steps</h2>
              <button
                onClick={() => {
                  const newNextSteps = [...estimate.nextSteps, ''];
                  updateEstimate({ nextSteps: newNextSteps });
                }}
                className="px-3 py-1.5 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/50 text-blue-400 rounded-lg transition-all flex items-center gap-2 text-sm font-medium"
              >
                <Plus className="w-4 h-4" />
                Add Step
              </button>
            </div>
            <ol className="space-y-4">
              {estimate.nextSteps.map((step, index) => (
                <li key={index} className="text-white/70 flex items-start gap-3 font-light group">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-500/20 text-blue-400 rounded-full flex items-center justify-center text-sm font-medium">
                    {index + 1}
                  </span>
                  <input
                    type="text"
                    value={step}
                    onChange={(e) => {
                      const newNextSteps = [...estimate.nextSteps];
                      newNextSteps[index] = e.target.value;
                      updateEstimate({ nextSteps: newNextSteps });
                    }}
                    className="flex-1 px-2 py-1 bg-transparent text-white/70 focus:outline-none focus:bg-white/5 rounded"
                    placeholder="Describe the next step..."
                  />
                  <button
                    onClick={() => {
                      const newNextSteps = estimate.nextSteps.filter((_, i) => i !== index);
                      updateEstimate({ nextSteps: newNextSteps });
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-500/20 text-red-400 rounded transition-all flex-shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </main>

      {/* Sign Up Modal */}
      {showSignUpModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-6 z-50">
          <div className="bg-gradient-to-br from-gray-900 to-black border border-white/10 rounded-2xl p-8 max-w-md w-full">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-light text-white">Sign Up to Save Your Blueprint</h3>
              <button
                onClick={() => setShowSignUpModal(false)}
                className="text-white/50 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-white/60 mb-6 font-light">
              Create a free account to save this blueprint to your library and access all your projects anytime.
            </p>

            {/* Google Sign In */}
            <button
              type="button"
              onClick={async () => {
                setSignUpLoading(true);
                try {
                  await signInWithGoogle();
                } catch (error) {
                  console.error("Sign up error:", error);
                  setSignUpLoading(false);
                }
              }}
              disabled={signUpLoading}
              className="w-full px-6 py-3 bg-white hover:bg-gray-50 text-gray-800 font-medium rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-lg"
            >
              {signUpLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-gray-800/30 border-t-gray-800 rounded-full animate-spin" />
                  <span>Signing up...</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Continue with Google
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
