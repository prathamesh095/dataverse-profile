// components/Spotlight.tsx
"use client"

import { cn } from "@/lib/utils"

interface SpotlightProps {
  className?: string
}

export function Spotlight({ className }: SpotlightProps) {
  return (
    <svg
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 z-0 h-full w-full blur-3xl opacity-60",
        className
      )}
      width="100%"
      height="100%"
      viewBox="0 0 960 540"
      fill="none"
    >
      <g filter="url(#spotlight-filter)">
        {/* Light mode: soft white glow */}
        <circle cx="200" cy="100" r="200" fill="rgba(255,255,255,0.08)" className="dark:hidden" />
        <circle cx="760" cy="440" r="200" fill="rgba(255,255,255,0.08)" className="dark:hidden" />
        {/* Dark mode: soft black glow */}
        <circle cx="200" cy="100" r="200" fill="rgba(0,0,0,0.08)" className="hidden dark:inline" />
        <circle cx="760" cy="440" r="200" fill="rgba(0,0,0,0.08)" className="hidden dark:inline" />
      </g>
      <defs>
        <filter
          id="spotlight-filter"
          x="-40%"
          y="-40%"
          width="180%"
          height="180%"
          filterUnits="objectBoundingBox"
        >
          <feGaussianBlur in="SourceGraphic" stdDeviation="151.604" />
        </filter>
      </defs>
    </svg>
  )
}