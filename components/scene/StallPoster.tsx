const STRIPES = 8;

export function StallPoster({ className = "h-full w-full" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 400 260"
      preserveAspectRatio="xMidYMid slice"
      className={className}
      focusable="false"
    >
      <rect width="400" height="260" fill="#f6e3c0" />
      <rect y="214" width="400" height="46" fill="#e2c999" />
      <rect x="48" y="96" width="304" height="118" fill="#e9cfa3" />
      {Array.from({ length: STRIPES }, (_, i) => {
        const xt = 40 + i * 40;
        const xb = 24 + i * 44;
        return (
          <polygon
            key={i}
            points={`${xt},44 ${xt + 40},44 ${xb + 44},100 ${xb},100`}
            fill={i % 2 === 0 ? "#f2a900" : "#c1272d"}
          />
        );
      })}
      <rect x="44" y="96" width="6" height="118" fill="#5b3a1e" />
      <rect x="350" y="96" width="6" height="118" fill="#5b3a1e" />
      <rect x="40" y="170" width="320" height="14" fill="#a9743f" />
      <rect x="48" y="184" width="304" height="30" fill="#8b5a2b" />
      <circle cx="120" cy="116" r="9" fill="#ffb347" />
      <circle cx="200" cy="120" r="9" fill="#ffb347" />
      <circle cx="280" cy="116" r="9" fill="#ffb347" />
      <path d="M232 118h36l-4 52h-28z" fill="#e6f1f2" fillOpacity="0.7" stroke="#9fb7ba" />
      <path d="M236 138h28l-2.5 32h-23z" fill="#b5651d" />
    </svg>
  );
}
