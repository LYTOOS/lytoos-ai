export default function Logo({ size = 38 }: { size?: number }) {
  return (
    <span className="inline-flex items-center gap-3">
      <svg width={size} height={size} viewBox="0 0 64 64" fill="none" aria-label="Lytoos AI logo" className="drop-shadow-[0_8px_20px_rgba(124,58,237,0.45)]">
        <defs>
          <linearGradient id="lytoos-g" x1="8" y1="6" x2="56" y2="58" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#A78BFA" /><stop offset=".52" stopColor="#7C3AED" /><stop offset="1" stopColor="#4F46E5" />
          </linearGradient>
        </defs>
        <rect x="4" y="4" width="56" height="56" rx="16" fill="url(#lytoos-g)" />
        <path d="M24 18v24.5c0 1.9 1.6 3.5 3.5 3.5H44" stroke="#fff" strokeWidth="6.5" strokeLinecap="round" />
        <circle cx="43.5" cy="20.5" r="4.6" fill="#fff" />
      </svg>
      <span className="leading-none">
        <span className="block text-[19px] font-semibold tracking-tight text-white">Lytoos<span className="text-violet-400"> AI</span></span>
        <span className="mt-1 block text-[10px] font-medium uppercase tracking-[0.22em] text-zinc-500">AI Gateway</span>
      </span>
    </span>
  );
}
