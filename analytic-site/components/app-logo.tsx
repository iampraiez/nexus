export function AppLogo({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 128 128"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <style>
          {`
            @media (prefers-color-scheme: light) {
              .logo-line { stroke: #0070f3; }
              .logo-dot { fill: #0070f3; }
            }
            @media (prefers-color-scheme: dark) {
              .logo-line { stroke: #00d9ff; }
              .logo-dot { fill: #00d9ff; }
            }
          `}
        </style>
      </defs>

      {/* Horizontal baseline */}
      <line
        className="logo-line"
        x1="20"
        y1="80"
        x2="108"
        y2="80"
        strokeWidth="1.5"
        opacity="0.3"
      />

      {/* Rising pulse chart */}
      <polyline
        className="logo-line"
        points="20,76 32,68 44,72 56,52 68,60 80,40 92,48 108,32"
        fill="none"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Data points */}
      <circle className="logo-dot" cx="20" cy="76" r="2" />
      <circle className="logo-dot" cx="44" cy="72" r="2" />
      <circle className="logo-dot" cx="68" cy="60" r="2" />
      <circle className="logo-dot" cx="92" cy="48" r="2" />
      <circle className="logo-dot" cx="108" cy="32" r="2" />
    </svg>
  );
}
