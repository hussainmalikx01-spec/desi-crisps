export default function TikTokIcon({ size = 20, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M16.5 3c.3 1.9 1.6 3.3 3.5 3.6v2.6c-1.3.1-2.5-.3-3.5-1v6.6c0 3.1-2.2 5.2-5 5.2s-5-2.1-5-5.1c0-3 2.4-5.1 5.2-5v2.7c-1.3 0-2.4 1-2.4 2.3 0 1.3 1.1 2.4 2.4 2.4 1.4 0 2.5-1.1 2.5-2.6V3h2.3z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}
