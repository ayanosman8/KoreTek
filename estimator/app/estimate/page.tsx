"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, Code, AlertCircle, Mail, ArrowLeft, X, Save, Copy, Download, FileText, ChevronDown, RefreshCw, BookmarkPlus } from "lucide-react";
import type { ProjectEstimate, QuestionOption } from "@/lib/ai/types";
import { createClient, signInWithGoogle } from "@/lib/auth/client";
import jsPDF from "jspdf";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function EstimatePage() {
  const [estimate, setEstimate] = useState<ProjectEstimate | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showEmailCapture, setShowEmailCapture] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [hasPaid, setHasPaid] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [enhancements, setEnhancements] = useState<Record<string, any>>({});
  const [loadingEnhancement, setLoadingEnhancement] = useState<string | null>(null);
  const [showSignUpModal, setShowSignUpModal] = useState(false);
  const [signUpLoading, setSignUpLoading] = useState(false);
  const [addedFeatures, setAddedFeatures] = useState<Set<string>>(new Set());
  const [isSavingToLibrary, setIsSavingToLibrary] = useState(false);
  const [saveToLibrarySuccess, setSaveToLibrarySuccess] = useState(false);
  const hasStartedGenerating = useRef(false);
  const router = useRouter();

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
    const savedEnhancements = localStorage.getItem("latestBlueprintEnhancements");
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
      // Clear old enhancements when generating new blueprint
      localStorage.removeItem("latestBlueprintEnhancements");
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

        // Restore enhancements if they exist
        if (savedEnhancements) {
          try {
            const parsedEnhancements = JSON.parse(savedEnhancements);

            // Only keep valid enhancement keys (discard old ones)
            const validKeys = ['target-audience', 'monetization', 'mvp-comparison', 'cool-features'];
            const cleanedEnhancements: Record<string, any> = {};

            Object.entries(parsedEnhancements).forEach(([key, value]) => {
              if (validKeys.includes(key)) {
                cleanedEnhancements[key] = value;
              }
            });

            setEnhancements(cleanedEnhancements);
            // Save cleaned data back to localStorage
            localStorage.setItem("latestBlueprintEnhancements", JSON.stringify(cleanedEnhancements));
            console.log("Restored enhancements (old ones discarded):", cleanedEnhancements);
          } catch (e) {
            console.error("Failed to parse saved enhancements:", e);
          }
        }

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

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (showDropdown && !target.closest('.relative')) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [showDropdown]);

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

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const projectDescription = sessionStorage.getItem("projectDescription");

      await fetch("/api/save-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          projectDescription,
          estimate,
        }),
      });

      setEmailSubmitted(true);
    } catch (error) {
      console.error("Error saving lead:", error);
      setEmailSubmitted(true);
    }
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
      markdown += `- ${feature}\n`;
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
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
      setShowDropdown(false);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const handleDownloadMarkdown = () => {
    // TODO: Re-enable auth check later
    // if (!user) {
    //   setShowSignUpModal(true);
    //   setShowDropdown(false);
    //   return;
    // }

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
    setShowDropdown(false);
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
      addText(`• ${feature}`, 10);
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
          enhancements: enhancements,
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
            <div className="w-24"></div> {/* Spacer for centering */}
          </div>
        </div>
      </header>

      <main className="pt-32 pb-20 px-6">
        <div className="max-w-5xl mx-auto">
          {/* Project Name */}
          <div className="mb-16">
            <h1 className="text-4xl md:text-6xl font-extralight text-white mb-4 tracking-tight">
              {estimate.projectName}
            </h1>
            <p className="text-xl text-white/60 font-light leading-relaxed">{estimate.summary}</p>
          </div>


          {/* Features */}
          <div className="features-section bg-black/20 backdrop-blur-xl border border-white/10 rounded-xl p-8 mb-8">
            <h2 className="text-2xl font-light text-white mb-6">Core Features</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {estimate.features.map((feature, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                  <span className="text-white/70 font-light">{feature}</span>
                </div>
              ))}
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
                  <h3 className="text-sm font-medium text-white/50 uppercase mb-3 tracking-wider">{category}</h3>
                  <div className="flex flex-wrap gap-2">
                    {technologies.map((tech, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-black/20 border border-white/10 rounded-full text-sm text-blue-400 font-light"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Risks */}
          {estimate.risks.length > 0 && (
            <div className="bg-black/20 border border-white/10 rounded-xl p-8 mb-8">
              <div className="flex items-center gap-3 mb-4">
                <AlertCircle className="w-6 h-6 text-blue-400" />
                <h2 className="text-2xl font-light text-white">Potential Risks</h2>
              </div>
              <ul className="space-y-2">
                {estimate.risks.map((risk, index) => (
                  <li key={index} className="text-white/60 flex items-start gap-2 font-light">
                    <span className="text-white/40 mt-1">•</span>
                    <span>{risk}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Next Steps */}
          <div className="bg-black/20 border border-white/10 rounded-xl p-8 mb-8">
            <h2 className="text-2xl font-light text-white mb-6">Next Steps</h2>
            <ol className="space-y-4">
              {estimate.nextSteps.map((step, index) => (
                <li key={index} className="text-white/70 flex items-start gap-3 font-light">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-500/20 text-blue-400 rounded-full flex items-center justify-center text-sm font-medium">
                    {index + 1}
                  </span>
                  <span className="pt-0.5">{step}</span>
                </li>
              ))}
            </ol>
          </div>

          {/* Enhancement Buttons */}
          <div className="mb-12">
            <div className="mb-8">
              <h2 className="text-3xl font-extralight text-white mb-2">Enhance Your Blueprint</h2>
              <p className="text-white/50 font-light">
                Add detailed insights to make smarter decisions
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {[
                {
                  id: 'target-audience',
                  gradient: 'from-blue-500/10 to-cyan-500/10',
                  border: 'border-blue-500/20',
                  activeBorder: 'border-blue-500',
                  title: 'Target Audience',
                  desc: 'User personas and pain points'
                },
                {
                  id: 'monetization',
                  gradient: 'from-emerald-500/10 to-teal-500/10',
                  border: 'border-emerald-500/20',
                  activeBorder: 'border-emerald-500',
                  title: 'Monetization Ideas',
                  desc: 'Revenue models and pricing strategies'
                },
                {
                  id: 'mvp-comparison',
                  gradient: 'from-purple-500/10 to-pink-500/10',
                  border: 'border-purple-500/20',
                  activeBorder: 'border-purple-500',
                  title: 'MVP Strategy',
                  desc: 'Quick launch vs full build comparison'
                },
                {
                  id: 'cool-features',
                  gradient: 'from-orange-500/10 to-amber-500/10',
                  border: 'border-orange-500/20',
                  activeBorder: 'border-orange-500',
                  title: 'Feature Ideas',
                  desc: 'Innovative additions to consider'
                }
              ].map(button => (
                <button
                  key={button.id}
                  onClick={async () => {
                    if (enhancements[button.id]) {
                      document.getElementById(`enhancement-${button.id}`)?.scrollIntoView({ behavior: 'smooth' });
                      return;
                    }

                    setLoadingEnhancement(button.id);
                    try {
                      const response = await fetch("/api/enhance-blueprint", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                          projectDescription: localStorage.getItem("latestBlueprintDescription"),
                          estimate,
                          enhancementType: button.id
                        }),
                      });

                      if (!response.ok) throw new Error("Failed to enhance");

                      const data = await response.json();
                      const updatedEnhancements = { ...enhancements, [button.id]: data.enhancement };
                      setEnhancements(updatedEnhancements);

                      // Save enhancements to localStorage
                      localStorage.setItem("latestBlueprintEnhancements", JSON.stringify(updatedEnhancements));

                      setTimeout(() => {
                        document.getElementById(`enhancement-${button.id}`)?.scrollIntoView({ behavior: 'smooth' });
                      }, 100);
                    } catch (error) {
                      console.error("Error enhancing:", error);
                    } finally {
                      setLoadingEnhancement(null);
                    }
                  }}
                  disabled={loadingEnhancement !== null}
                  className={`
                    group relative overflow-hidden
                    bg-gradient-to-br ${button.gradient}
                    backdrop-blur-xl border-2 ${enhancements[button.id] ? button.activeBorder : button.border}
                    rounded-2xl p-6 text-left
                    transition-all duration-300 ease-out
                    ${loadingEnhancement === button.id ? 'opacity-70' : ''}
                    disabled:cursor-not-allowed
                  `}
                >
                  <div className="relative">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-white text-lg">{button.title}</h3>
                      <div className="flex items-center gap-2">
                        {loadingEnhancement === button.id && (
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        )}
                        {enhancements[button.id] && (
                          <CheckCircle2 className="w-5 h-5 text-green-400" />
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-white/60 font-light leading-relaxed">{button.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Enhanced Sections */}
          {Object.entries(enhancements).map(([type, content]) => {
            // Special handling for cool-features
            if (type === 'cool-features') {
              let features: Array<{ title: string; description: string; category: string }> = [];

              try {
                // Try to parse JSON
                console.log("Raw content for cool-features:", content);
                features = JSON.parse(content);
                console.log("Parsed features:", features);
              } catch (e) {
                // If parsing fails, show error message
                console.error("Failed to parse cool-features:", e);
                console.log("Content that failed to parse:", content);
                return (
                  <div key={type} id={`enhancement-${type}`} className="bg-black/20 border border-blue-500/30 rounded-xl p-8 mb-8">
                    <h2 className="text-2xl font-light text-white mb-4">Additional Feature Ideas</h2>
                    <p className="text-white/60">Failed to load feature suggestions. Please try again.</p>
                  </div>
                );
              }

              return (
                <div key={type} id={`enhancement-${type}`} className="bg-black/20 border border-blue-500/30 rounded-xl p-8 mb-8" style={{ position: 'relative', zIndex: 10 }}>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-light text-white">Additional Feature Ideas</h2>
                    <button
                      onClick={async () => {
                        setLoadingEnhancement(type);
                        try {
                          const response = await fetch("/api/enhance-blueprint", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                              projectDescription: localStorage.getItem("latestBlueprintDescription"),
                              estimate,
                              enhancementType: type
                            }),
                          });

                          if (!response.ok) throw new Error("Failed to enhance");

                          const data = await response.json();
                          const updatedEnhancements = { ...enhancements, [type]: data.enhancement };
                          setEnhancements(updatedEnhancements);
                          localStorage.setItem("latestBlueprintEnhancements", JSON.stringify(updatedEnhancements));
                        } catch (error) {
                          console.error("Error regenerating:", error);
                        } finally {
                          setLoadingEnhancement(null);
                        }
                      }}
                      disabled={loadingEnhancement !== null}
                      className="flex items-center gap-2 px-3 py-1.5 text-sm text-blue-400 hover:text-blue-300 transition-colors disabled:opacity-50"
                    >
                      <RefreshCw className={`w-4 h-4 ${loadingEnhancement === type ? 'animate-spin' : ''}`} />
                      Regenerate
                    </button>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    {features.map((feature, index) => {
                      const isAdded = addedFeatures.has(feature.title);

                      return (
                        <div key={index} className="bg-black/30 border border-white/10 rounded-lg p-5 hover:border-white/20 transition-all" style={{ position: 'relative', zIndex: 20 }}>
                          <h3 className="font-medium text-white mb-3">{feature.title}</h3>
                          <p className="text-sm text-white/60 font-light mb-4 leading-relaxed">
                            {feature.description}
                          </p>
                          <button
                            type="button"
                            onClick={() => {
                              console.log("Adding feature:", feature.title);
                              handleAddFeature(feature.title);
                            }}
                            disabled={isAdded}
                            className={`
                              w-full px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer
                              ${isAdded
                                ? 'bg-green-500/20 text-green-400'
                                : 'bg-blue-500/20 text-blue-400 hover:bg-blue-500/30'
                              }
                            `}
                            style={{ position: 'relative', zIndex: 30, pointerEvents: 'auto' }}
                          >
                            {isAdded ? (
                              <span className="flex items-center justify-center gap-2">
                                <CheckCircle2 className="w-4 h-4" />
                                Added to Blueprint
                              </span>
                            ) : (
                              '+ Add to Blueprint'
                            )}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            }

            // Regular rendering for other enhancement types
            const titles: Record<string, string> = {
              'target-audience': 'Target Audience',
              'monetization': 'Monetization Ideas',
              'mvp-comparison': 'MVP Strategy'
            };

            return (
              <div key={type} id={`enhancement-${type}`} className="bg-black/20 border border-blue-500/30 rounded-xl p-8 mb-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-light text-white">{titles[type] || type}</h2>
                  <button
                    onClick={async () => {
                      setLoadingEnhancement(type);
                      try {
                        const response = await fetch("/api/enhance-blueprint", {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({
                            projectDescription: localStorage.getItem("latestBlueprintDescription"),
                            estimate,
                            enhancementType: type
                          }),
                        });

                        if (!response.ok) throw new Error("Failed to enhance");

                        const data = await response.json();
                        const updatedEnhancements = { ...enhancements, [type]: data.enhancement };
                        setEnhancements(updatedEnhancements);
                        localStorage.setItem("latestBlueprintEnhancements", JSON.stringify(updatedEnhancements));
                      } catch (error) {
                        console.error("Error regenerating:", error);
                      } finally {
                        setLoadingEnhancement(null);
                      }
                    }}
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
                    {content}
                  </ReactMarkdown>
                </div>
              </div>
            );
          })}

          {/* Export & Actions Bar */}
          <div className="bg-black/20 border border-white/10 rounded-xl p-8 mb-8">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-center sm:text-left">
                <h3 className="text-lg font-medium text-white mb-1">Export Your Blueprint</h3>
                <p className="text-sm text-white/50 font-light">Download or copy your project blueprint</p>
              </div>

              <div className="flex items-center gap-3 flex-wrap relative z-0">
                {/* Test Button - Temporary for debugging */}
                <button
                  onClick={() => {
                    console.log("🧪 TEST BUTTON CLICKED!");
                    alert("Test button works! Check console for logs.");
                  }}
                  onMouseEnter={() => console.log("🖱️ Mouse entered TEST button")}
                  className="px-4 py-2 bg-red-500/20 text-red-400 border border-red-500/50 rounded-lg text-sm relative z-20"
                  style={{ pointerEvents: 'auto' }}
                >
                  Test Click
                </button>

                {/* Save to Library Button */}
                <button
                  onClick={handleSaveToLibrary}
                  onMouseEnter={() => console.log("🖱️ Mouse entered Save to Library button")}
                  disabled={isSavingToLibrary}
                  className={`px-6 py-3 rounded-lg transition-all inline-flex items-center gap-2 font-medium relative z-20 ${
                    saveToLibrarySuccess
                      ? "bg-green-500/20 text-green-400 border border-green-500/50"
                      : "bg-white/5 hover:bg-white/10 border border-white/10 text-white"
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                  style={{ pointerEvents: 'auto' }}
                >
                  {isSavingToLibrary ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
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

                {/* Export Dropdown */}
                <div className="relative z-10">
                  <button
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium rounded-lg transition-all inline-flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Export
                    <ChevronDown className={`w-4 h-4 transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
                  </button>

                  {showDropdown && (
                    <div className="absolute right-0 mt-2 w-48 bg-black/95 backdrop-blur-xl border border-white/10 rounded-lg shadow-xl overflow-hidden z-50">
                      <button
                        onClick={handleCopyToClipboard}
                        className="w-full px-4 py-3 text-left text-white hover:bg-white/10 transition-colors flex items-center gap-3 font-light"
                      >
                        <Copy className="w-4 h-4" />
                        {copySuccess ? 'Copied!' : 'Copy as Markdown'}
                      </button>
                      <button
                        onClick={handleDownloadMarkdown}
                        className="w-full px-4 py-3 text-left text-white hover:bg-white/10 transition-colors flex items-center gap-3 font-light border-t border-white/5"
                      >
                        <FileText className="w-4 h-4" />
                        Download Markdown
                      </button>
                      <button
                        onClick={handleDownloadPDF}
                        className="w-full px-4 py-3 text-left text-white hover:bg-white/10 transition-colors flex items-center gap-3 font-light border-t border-white/5"
                      >
                        <Download className="w-4 h-4" />
                        Download PDF
                      </button>
                    </div>
                  )}
                </div>

                {/* Get Proposal Button */}
                <button
                  onClick={() => setShowEmailCapture(true)}
                  className="px-6 py-3 bg-gradient-to-r from-blue-500/90 to-blue-600/90 hover:from-blue-500 hover:to-blue-600 text-white font-medium rounded-lg transition-all inline-flex items-center gap-2 shadow-lg shadow-blue-500/20"
                >
                  <Mail className="w-4 h-4" />
                  Get Proposal
                </button>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="bg-black/20 border border-white/10 rounded-xl p-12 text-center">
            <h2 className="text-3xl font-light text-white mb-4">Ready to Start Building?</h2>
            <p className="text-white/60 mb-8 max-w-2xl mx-auto font-light">
              Turn your blueprint into reality with KoreLnx. Get a detailed proposal with pricing, timeline, technical specifications, and our team's availability.
            </p>
            <button
              onClick={() => setShowEmailCapture(true)}
              className="px-8 py-4 bg-gradient-to-r from-blue-500/90 to-blue-600/90 hover:from-blue-500 hover:to-blue-600 text-white font-medium rounded-xl transition-all inline-flex items-center gap-2 shadow-lg shadow-blue-500/20"
            >
              <Mail className="w-5 h-5" />
              Request Detailed Proposal
            </button>
          </div>
        </div>
      </main>

      {/* Email Capture Modal */}
      {showEmailCapture && !emailSubmitted && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-6 z-50">
          <div className="bg-black border border-white/10 rounded-2xl p-8 max-w-md w-full">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-light text-white">Get Full Proposal</h3>
              <button
                onClick={() => setShowEmailCapture(false)}
                className="text-white/50 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-white/60 mb-6 font-light">
              Enter your details and we'll send you a comprehensive proposal.
            </p>
            <form onSubmit={handleEmailSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-white/70 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-lg text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-white/20 font-light"
                  placeholder="John Doe"
                  required
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-white/70 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-lg text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-white/20 font-light"
                  placeholder="john@example.com"
                  required
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowEmailCapture(false)}
                  className="flex-1 px-4 py-3 bg-white/5 text-white rounded-lg hover:bg-white/10 transition-colors font-light"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-500/90 to-blue-600/90 hover:from-blue-500 hover:to-blue-600 text-white font-medium rounded-lg transition-all"
                >
                  Send Proposal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {emailSubmitted && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-6 z-50">
          <div className="bg-black border border-white/10 rounded-2xl p-8 max-w-md w-full text-center">
            <CheckCircle2 className="w-16 h-16 text-blue-400 mx-auto mb-4" />
            <h3 className="text-2xl font-light text-white mb-4">Proposal Sent</h3>
            <p className="text-white/60 mb-6 font-light">
              Check your email at <strong className="text-white">{email}</strong>. We'll be in touch soon.
            </p>
            <button
              onClick={() => router.push("/")}
              className="px-6 py-3 bg-gradient-to-r from-blue-500/90 to-blue-600/90 hover:from-blue-500 hover:to-blue-600 text-white rounded-lg transition-all font-medium"
            >
              Create Another Blueprint
            </button>
          </div>
        </div>
      )}

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

            <div className="mt-6 pt-6 border-t border-white/10">
              <p className="text-center text-sm text-white/40 font-light">
                Free forever • No credit card required
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
