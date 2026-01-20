"use client";

export function MinimalBackground() {
  return (
    <div className="absolute inset-0 z-0">
      {/* Subtle gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-primary/3 opacity-30" />

      {/* Minimalistic dots pattern */}
      <svg
        className="absolute w-full h-full opacity-20"
        xmlns="http://www.w3.org/2000/svg"
        width="100%"
        height="100%"
        viewBox="0 0 100 100"
        patternUnits="userSpaceOnUse"
      >
        <pattern
          id="dots"
          x="0"
          y="0"
          width="50"
          height="50"
          patternUnits="userSpaceOnUse"
        >
          <circle
            cx="12.5"
            cy="12.5"
            r="1.5"
            fill="currentColor"
            className="text-primary/20"
          />
        </pattern>
        <rect width="100%" height="100%" fill="url(#dots)" />
      </svg>

      {/* Floating blurred elements */}
      <div className="absolute top-20 right-20 w-72 h-72 rounded-full bg-primary/10 blur-3xl opacity-20 animate-pulse" />
      <div className="absolute bottom-40 left-10 w-96 h-96 rounded-full bg-primary/5 blur-3xl opacity-15 animate-pulse animation-delay-2000" />
    </div>
  );
}
