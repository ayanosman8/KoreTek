export function BlueprintCardSkeleton({ delay = 0 }: { delay?: number }) {
  return (
    <div
      className="bg-black/20 backdrop-blur-xl border border-white/10 rounded-xl p-6 animate-pulse"
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            {/* Title skeleton */}
            <div className="h-6 bg-white/10 rounded w-40"></div>
            {/* Icon skeleton */}
            <div className="w-4 h-4 bg-white/10 rounded"></div>
          </div>
          {/* Date skeleton */}
          <div className="h-4 bg-white/10 rounded w-24"></div>
        </div>
        {/* Star skeleton */}
        <div className="w-5 h-5 bg-white/10 rounded"></div>
      </div>

      {/* Status Badge */}
      <div className="mb-3">
        <div className="h-6 bg-white/10 rounded-full w-20"></div>
      </div>

      {/* Summary */}
      <div className="space-y-2 mb-4">
        <div className="h-4 bg-white/10 rounded w-full"></div>
        <div className="h-4 bg-white/10 rounded w-3/4"></div>
      </div>

      {/* Tech Stack Badges */}
      <div className="flex flex-wrap gap-2 mb-3">
        <div className="h-6 bg-white/10 rounded w-16"></div>
        <div className="h-6 bg-white/10 rounded w-20"></div>
        <div className="h-6 bg-white/10 rounded w-14"></div>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-4">
        <div className="h-6 bg-white/10 rounded-full w-16"></div>
        <div className="h-6 bg-white/10 rounded-full w-20"></div>
        <div className="h-6 bg-white/10 rounded-full w-14"></div>
      </div>

      {/* Stats */}
      <div className="flex items-center gap-4 mb-4">
        <div className="h-4 bg-white/10 rounded w-20"></div>
        <div className="w-1 h-1 bg-white/10 rounded-full"></div>
        <div className="h-4 bg-white/10 rounded w-16"></div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 pt-4 border-t border-white/10">
        <div className="flex-1 h-9 bg-white/10 rounded-lg"></div>
        <div className="h-9 w-9 bg-white/10 rounded-lg"></div>
      </div>
    </div>
  );
}

export function StatSkeleton() {
  return (
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 bg-white/10 rounded-lg flex-shrink-0 animate-pulse"></div>
      <div className="space-y-2">
        <div className="h-3 bg-white/10 rounded w-16 animate-pulse"></div>
        <div className="h-6 bg-white/10 rounded w-12 animate-pulse"></div>
      </div>
    </div>
  );
}

export function BlueprintGridSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, i) => (
        <BlueprintCardSkeleton key={i} delay={i * 100} />
      ))}
    </div>
  );
}
