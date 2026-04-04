export default function Loading() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        {/* Animated logo */}
        <div className="relative">
          <div className="w-14 h-14 rounded-2xl hero-gradient flex items-center justify-center shadow-neon-primary animate-pulse">
            <svg
              className="w-7 h-7 text-on-primary"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M13 2L4.09 12.26L11 12.97L10.08 21.72L19 11.47L12.09 10.76L13 2Z" />
            </svg>
          </div>
          <div className="absolute inset-0 rounded-2xl hero-gradient opacity-30 blur-lg animate-pulse" />
        </div>

        {/* Loading bar */}
        <div className="w-32 h-1 bg-surface-container rounded-full overflow-hidden">
          <div
            className="h-full rounded-full"
            style={{
              background: "linear-gradient(90deg, #61cdff, #aa8bff)",
              animation: "shimmer 1.5s infinite",
              backgroundSize: "200% 100%",
            }}
          />
        </div>

        <p className="text-sm text-on-surface-variant animate-pulse">
          Chargement...
        </p>
      </div>
    </div>
  );
}
