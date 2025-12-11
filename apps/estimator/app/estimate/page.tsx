"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, Code, AlertCircle, Mail, ArrowLeft, X, Save } from "lucide-react";
import type { ProjectEstimate } from "@repo/ai/types";
import { createClient } from "@repo/auth/client";

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
  const [questionAnswers, setQuestionAnswers] = useState<Record<number, "yes" | "no" | undefined>>({});
  const [isRefining, setIsRefining] = useState(false);
  const [refinementCount, setRefinementCount] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const projectDescription = sessionStorage.getItem("projectDescription");

    if (!projectDescription) {
      router.push("/");
      return;
    }

    generateEstimate(projectDescription);
  }, [router]);

  // Check user auth and payment status
  useEffect(() => {
    const checkUserStatus = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        setUser(user);

        // Check if user has paid
        const { data: profile } = await supabase
          .from('user_profiles')
          .select('has_paid')
          .eq('id', user.id)
          .single();

        if (profile?.has_paid) {
          setHasPaid(true);
        }
      }
    };

    checkUserStatus();
  }, []);

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
    // Not logged in - redirect to login
    if (!user) {
      router.push("/auth/login");
      return;
    }

    // Logged in but hasn't paid - redirect to checkout
    if (!hasPaid) {
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

    // Paid user - save estimate
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-2 border-blue-500/20 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-2xl font-light text-white mb-2">Analyzing Your Project</h2>
          <p className="text-white/60 font-light">This will take just a moment...</p>
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
            <button
              onClick={() => router.push("/")}
              className="flex items-center gap-2 text-white/70 hover:text-blue-400 transition-all font-light"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
            <h1 className="text-xl font-extralight tracking-tight">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-300">Scope AI</span>
            </h1>
            <div className="flex items-center gap-3">
              <button
                onClick={handleSaveEstimate}
                disabled={isSaving || saveSuccess}
                className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-lg transition-all text-sm font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>{!user ? "Redirecting..." : !hasPaid ? "Redirecting..." : "Saving..."}</span>
                  </>
                ) : saveSuccess ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Saved!</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>{!user ? "Login to Save" : !hasPaid ? "Unlock Saves" : "Save Estimate"}</span>
                  </>
                )}
              </button>
              <button
                onClick={() => setShowEmailCapture(true)}
                className="px-4 py-2 bg-gradient-to-r from-blue-500/90 to-blue-600/90 hover:from-blue-500 hover:to-blue-600 text-white rounded-lg transition-all text-sm font-medium shadow-lg shadow-blue-500/20"
              >
                Get Proposal
              </button>
            </div>
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
          <div className="bg-black/20 backdrop-blur-xl border border-white/10 rounded-xl p-8 mb-8">
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

          {/* Questions */}
          <div className="bg-black/20 backdrop-blur-xl border border-white/10 rounded-xl p-8 mb-8">
            <h2 className="text-2xl font-light text-white mb-4">Questions for You</h2>
            <p className="text-white/50 mb-6 font-light">
              Answer these questions to get a more refined estimate:
            </p>
            <div className="space-y-4">
              {estimate.questions.map((question, index) => (
                <div key={index} className="p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-all">
                  <p className="text-white/80 font-light mb-3">
                    {question}
                  </p>
                  <div className="flex gap-4">
                    {/* Yes Checkbox */}
                    <label className="flex items-center gap-2 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={questionAnswers[index] === "yes"}
                        onChange={() => setQuestionAnswers(prev => ({
                          ...prev,
                          [index]: prev[index] === "yes" ? undefined : "yes"
                        }))}
                        className="w-5 h-5 rounded border-white/20 bg-white/5 text-blue-500 focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-0 cursor-pointer"
                      />
                      <span className={`text-sm font-medium transition-colors ${
                        questionAnswers[index] === "yes"
                          ? "text-blue-400"
                          : "text-white/50 group-hover:text-white/70"
                      }`}>
                        Yes
                      </span>
                    </label>

                    {/* No Checkbox */}
                    <label className="flex items-center gap-2 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={questionAnswers[index] === "no"}
                        onChange={() => setQuestionAnswers(prev => ({
                          ...prev,
                          [index]: prev[index] === "no" ? undefined : "no"
                        }))}
                        className="w-5 h-5 rounded border-white/20 bg-white/5 text-white/40 focus:ring-2 focus:ring-white/20 focus:ring-offset-0 cursor-pointer"
                      />
                      <span className={`text-sm font-medium transition-colors ${
                        questionAnswers[index] === "no"
                          ? "text-white/70"
                          : "text-white/50 group-hover:text-white/70"
                      }`}>
                        No
                      </span>
                    </label>
                  </div>
                </div>
              ))}
            </div>

            {/* Refine Button */}
            <div className="mt-8 pt-6 border-t border-white/10">
              <button
                onClick={async () => {
                  setIsRefining(true);
                  try {
                    const projectDescription = sessionStorage.getItem("projectDescription");
                    const answeredQuestions = estimate.questions.map((q, i) => ({
                      question: q,
                      answer: questionAnswers[i] === "yes" ? "Yes" : questionAnswers[i] === "no" ? "No" : "Not answered"
                    }));

                    const response = await fetch("/api/refine-estimate", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        projectDescription,
                        originalEstimate: estimate,
                        answeredQuestions
                      }),
                    });

                    if (!response.ok) throw new Error("Failed to refine");

                    const data = await response.json();
                    setEstimate(data.estimate);
                    setRefinementCount(prev => prev + 1);
                    setQuestionAnswers({});
                  } catch (error) {
                    console.error("Error refining estimate:", error);
                  } finally {
                    setIsRefining(false);
                  }
                }}
                disabled={isRefining || Object.values(questionAnswers).filter(a => a !== undefined).length === 0}
                className="w-full px-6 py-4 bg-gradient-to-r from-blue-500/90 to-blue-600/90 hover:from-blue-500 hover:to-blue-600 text-white font-medium rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isRefining ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Refining Estimate...</span>
                  </>
                ) : (
                  <>
                    <span>Refine Estimate</span>
                    {Object.values(questionAnswers).filter(a => a !== undefined).length > 0 && (
                      <span className="text-white/70 text-sm">
                        ({Object.values(questionAnswers).filter(a => a !== undefined).length} answered)
                      </span>
                    )}
                  </>
                )}
              </button>
              {refinementCount > 0 && (
                <div className="mt-4">
                  <p className="text-center text-white/50 text-sm mb-3 font-light">
                    Refined {refinementCount} {refinementCount === 1 ? 'time' : 'times'}
                  </p>
                  {/* Soft Paywall Message */}
                  <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                    <p className="text-white/80 text-sm text-center font-light">
                      Love this refined estimate? <br />
                      <button
                        onClick={handleSaveEstimate}
                        className="text-blue-400 hover:text-blue-300 font-medium underline"
                      >
                        {!user ? "Login to save" : !hasPaid ? "Unlock unlimited saves for $7" : "Save this estimate"}
                      </button> and compare multiple versions of your project.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* CTA */}
          <div className="bg-black/20 border border-white/10 rounded-xl p-12 text-center">
            <h2 className="text-3xl font-light text-white mb-4">Ready to Start?</h2>
            <p className="text-white/60 mb-8 max-w-2xl mx-auto font-light">
              Get a detailed proposal with pricing, timeline, technical specifications, and our team's availability.
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
              Create Another Estimate
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
