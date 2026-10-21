export function LogoMark({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <rect width="64" height="64" rx="16" fill="#0E0E12" />
      <path d="M14 40 L32 14 L50 40 Z" fill="#FF5A1F" />
      <rect x="12" y="44" width="40" height="7" rx="3.5" fill="#FAFAF7" />
    </svg>
  );
}
