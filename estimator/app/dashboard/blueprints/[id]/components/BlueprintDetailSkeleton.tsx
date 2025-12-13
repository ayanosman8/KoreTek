export function HeaderSkeleton() {
  return (
    <div className="bg-black/20 backdrop-blur-xl border border-white/10 rounded-xl p-6 animate-pulse">
      <div className="space-y-4">
        {/* Project Name */}
        <div>
          <div className="h-3 bg-white/10 rounded w-24 mb-2"></div>
          <div className="h-12 bg-white/10 rounded"></div>
        </div>

        {/* Summary */}
        <div>
          <div className="h-3 bg-white/10 rounded w-20 mb-2"></div>
          <div className="space-y-2">
            <div className="h-10 bg-white/10 rounded"></div>
            <div className="h-10 bg-white/10 rounded"></div>
            <div className="h-10 bg-white/10 rounded w-3/4"></div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-2 pt-2">
          <div className="h-10 bg-white/10 rounded w-32"></div>
          <div className="h-10 bg-white/10 rounded w-24"></div>
        </div>
      </div>
    </div>
  );
}

export function FeatureCardSkeleton({ delay = 0 }: { delay?: number }) {
  return (
    <div
      className="bg-black/30 border border-white/10 rounded-xl p-6 animate-pulse"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="space-y-4">
        {/* Name and Tier */}
        <div className="flex items-start gap-3">
          <div className="flex-1 h-10 bg-white/10 rounded-lg"></div>
          <div className="h-10 w-20 bg-white/10 rounded-lg"></div>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <div className="h-4 bg-white/10 rounded w-full"></div>
          <div className="h-4 bg-white/10 rounded w-4/5"></div>
        </div>

        {/* Tech Stack */}
        <div className="grid md:grid-cols-3 gap-3">
          <div>
            <div className="h-3 bg-blue-400/20 rounded w-12 mb-1"></div>
            <div className="h-9 bg-white/10 rounded-lg"></div>
          </div>
          <div>
            <div className="h-3 bg-green-400/20 rounded w-20 mb-1"></div>
            <div className="h-9 bg-white/10 rounded-lg"></div>
          </div>
          <div>
            <div className="h-3 bg-purple-400/20 rounded w-16 mb-1"></div>
            <div className="h-9 bg-white/10 rounded-lg"></div>
          </div>
        </div>

        {/* Database */}
        <div className="grid md:grid-cols-2 gap-3">
          <div>
            <div className="h-3 bg-orange-400/20 rounded w-24 mb-1"></div>
            <div className="h-9 bg-white/10 rounded-lg"></div>
          </div>
          <div>
            <div className="h-3 bg-orange-400/20 rounded w-16 mb-1"></div>
            <div className="h-9 bg-white/10 rounded-lg"></div>
          </div>
        </div>

        {/* Implementation */}
        <div>
          <div className="h-3 bg-blue-400/20 rounded w-32 mb-1"></div>
          <div className="space-y-2">
            <div className="h-4 bg-white/10 rounded w-full"></div>
            <div className="h-4 bg-white/10 rounded w-3/4"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function InsightCardSkeleton({ delay = 0 }: { delay?: number }) {
  return (
    <div
      className="bg-black/20 border border-blue-500/30 rounded-xl p-6 animate-pulse"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-white/10 rounded"></div>
          <div className="h-5 bg-white/10 rounded w-40"></div>
        </div>
        <div className="h-4 bg-white/10 rounded w-20"></div>
      </div>
      <div className="space-y-3">
        <div className="h-4 bg-white/10 rounded w-full"></div>
        <div className="h-4 bg-white/10 rounded w-5/6"></div>
        <div className="h-4 bg-white/10 rounded w-4/5"></div>
        <div className="h-4 bg-white/10 rounded w-full"></div>
        <div className="h-4 bg-white/10 rounded w-3/4"></div>
      </div>
    </div>
  );
}

export function ChecklistSkeleton({ delay = 0 }: { delay?: number }) {
  return (
    <div
      className="bg-black/30 border border-white/10 rounded-lg p-4 animate-pulse"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-center gap-3">
        <div className="w-6 h-6 bg-white/10 rounded-md flex-shrink-0"></div>
        <div className="flex-1 h-10 bg-white/10 rounded"></div>
        <div className="w-10 h-10 bg-white/10 rounded-lg flex-shrink-0"></div>
      </div>
    </div>
  );
}

export function BlueprintDetailSkeleton({ activeTab }: { activeTab: 'features' | 'checklist' }) {
  return (
    <div>
      {activeTab === 'features' && (
        <div className="bg-black/20 backdrop-blur-xl border border-white/10 rounded-xl p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="h-8 bg-white/10 rounded w-40 animate-pulse"></div>
            <div className="h-10 bg-white/10 rounded w-48 animate-pulse"></div>
          </div>
          <div className="space-y-6">
            {[...Array(3)].map((_, i) => (
              <FeatureCardSkeleton key={i} delay={i * 100} />
            ))}
          </div>
        </div>
      )}

      {activeTab === 'checklist' && (
        <div className="bg-black/20 backdrop-blur-xl border border-white/10 rounded-xl p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="h-8 bg-white/10 rounded w-64 animate-pulse"></div>
            <div className="h-10 bg-white/10 rounded w-48 animate-pulse"></div>
          </div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <ChecklistSkeleton key={i} delay={i * 100} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
