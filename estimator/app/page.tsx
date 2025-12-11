"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, Zap, CheckCircle2, AlertCircle } from "lucide-react";

export default function Home() {
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    setIsLoading(true);

    try {
      sessionStorage.setItem("projectDescription", description);
      router.push("/estimate");
    } catch (error) {
      console.error("Error:", error);
      setIsLoading(false);
    }
  };

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
            <h1 className="text-xl font-extralight tracking-tight">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-300">Spark</span>
            </h1>
            <a
              href="https://korelnx.com"
              className="text-sm font-medium text-white/70 hover:text-blue-400 transition-all duration-300 cursor-pointer"
            >
              KoreLnx
            </a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-32 pb-20 px-4 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Hero */}
          <div className="text-center mb-16 space-y-6">
            <p className="text-lg md:text-xl text-white/60 font-light tracking-wide">
              Powered by KoreLnx
            </p>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-extralight leading-tight tracking-tight">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-blue-300 to-blue-400">
                Spark
              </span>
            </h1>

            <p className="text-2xl md:text-3xl text-white/80 font-light">
              Get Instant Project Estimates
            </p>

            <p className="text-xl md:text-2xl text-white/70 max-w-3xl mx-auto leading-relaxed font-light">
              Describe your idea and receive a comprehensive breakdown of features,
              tech stack recommendations, and next steps in seconds.
            </p>

            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center gap-8 pt-4">
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-extralight text-blue-500">
                  Free
                </div>
                <div className="text-sm text-white/60 font-light uppercase tracking-wider">Forever</div>
              </div>
              <div className="w-px h-12 bg-white/10"></div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-extralight text-blue-500">
                  5s
                </div>
                <div className="text-sm text-white/60 font-light uppercase tracking-wider">Results</div>
              </div>
              <div className="w-px h-12 bg-white/10"></div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-extralight text-blue-500">
                  100%
                </div>
                <div className="text-sm text-white/60 font-light uppercase tracking-wider">Accurate</div>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="mb-20">
            <div className="bg-black/20 backdrop-blur-xl border border-white/10 rounded-2xl p-8 md:p-10">
              <label htmlFor="description" className="block text-sm font-medium text-white/70 mb-4 uppercase tracking-wider">
                What do you want to build?
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Example: I want a mobile app like Uber but for dog walking. Users can book dog walkers nearby, track walks in real-time with GPS, and pay through the app..."
                className="w-full h-40 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 resize-none font-light transition-all"
                required
              />
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-6">
                <span className="text-sm text-white/50 font-light">
                  {description.length > 0 ? (
                    <span className="text-blue-400">{description.length} characters</span>
                  ) : (
                    "The more detail, the better the estimate"
                  )}
                </span>
                <button
                  type="submit"
                  disabled={isLoading || !description.trim()}
                  className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-blue-500/90 to-blue-600/90 hover:from-blue-500 hover:to-blue-600 text-white font-medium rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Generating...</span>
                    </>
                  ) : (
                    <>
                      <span>Get Estimate</span>
                      <Sparkles className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: Zap,
                title: "Tech Stack",
                description: "Expert recommendations for modern technologies and frameworks tailored to your project"
              },
              {
                icon: CheckCircle2,
                title: "Core Features",
                description: "Detailed breakdown of essential features and functionality for your app"
              },
              {
                icon: AlertCircle,
                title: "Risk Analysis",
                description: "Identify potential challenges and risks early in the planning phase"
              }
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-black/20 backdrop-blur-xl border border-white/10 rounded-xl p-8 hover:border-white/20 transition-all duration-300 group"
              >
                <feature.icon className="w-10 h-10 text-blue-400 mb-4 group-hover:scale-110 transition-transform duration-300" />
                <h3 className="text-lg font-medium text-white mb-2">{feature.title}</h3>
                <p className="text-sm text-white/60 font-light leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 px-6 py-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-sm text-white/40 font-light">
            Spark by KoreLnx
          </p>
        </div>
      </footer>
    </div>
  );
}
