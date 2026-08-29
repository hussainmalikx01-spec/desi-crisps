"use client";

import { useState } from "react";

export default function WhatsAppButton({ number }: { number: string }) {
  const [expanded, setExpanded] = useState(false);
  const cleaned = number.replace(/[^\d+]/g, "").replace("+", "");

  return (
    <a
      href={`https://wa.me/${cleaned}`}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
      className="fixed bottom-6 right-6 z-50 flex h-14 items-center gap-2.5 overflow-hidden rounded-full border border-gold/40 bg-ink-card px-4 shadow-lg shadow-black/40 transition-all duration-300 hover:border-gold hover:pl-4 hover:pr-5"
      style={{ width: expanded ? "auto" : "56px" }}
      aria-label="Chat with us on WhatsApp"
    >
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className="shrink-0 text-gold">
        <path
          d="M12 2a10 10 0 00-8.6 15L2 22l5.2-1.4A10 10 0 1012 2z"
          stroke="currentColor"
          strokeWidth="1.6"
        />
        <path
          d="M8.5 8.7c.2-.5.4-.5.6-.5h.5c.2 0 .4 0 .6.4.2.5.7 1.6.7 1.7.1.1.1.3 0 .4-.1.2-.1.3-.3.4-.1.2-.3.3-.4.5-.1.1-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.2 1 2.1 1.4 2.4 1.5.3.2.5.1.6-.1.2-.2.7-.8.9-1 .2-.3.4-.2.6-.1l1.5.7c.2.1.4.2.5.3.1.2.1.9-.2 1.7-.3.8-1.6 1.5-2.3 1.6-.6.1-1.3.1-2.1-.1a12 12 0 01-4.7-2.9 12.4 12.4 0 01-2.3-3.9c-.3-.7-.3-1.4-.2-2 .1-.5.6-1.1.9-1.3z"
          fill="currentColor"
        />
      </svg>
      <span
        className={`whitespace-nowrap font-utility text-sm text-cream transition-opacity duration-200 ${
          expanded ? "opacity-100" : "opacity-0"
        }`}
      >
        Chat with us
      </span>
    </a>
  );
}
