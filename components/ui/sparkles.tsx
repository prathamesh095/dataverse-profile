"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface SparklesCoreProps {
  /**
   * Background color of the sparkles container
   * @default "transparent"
   */
  background?: string
  /**
   * Minimum size of each sparkle (rem)
   * @default 0.4
   */
  minSize?: number
  /**
   * Maximum size of each sparkle (rem)
   * @default 1
   */
  maxSize?: number
  /**
   * Number of sparkles
   * @default 30
   */
  particleDensity?: number
  /**
   * Custom class name
   */
  className?: string
  /**
   * Color of the sparkles (hex, rgb, or tailwind class)
   * @default "#FFF"
   */
  particleColor?: string
}

export const SparklesCore = React.forwardRef<HTMLDivElement, SparklesCoreProps>(
  (
    {
      background = "transparent",
      minSize = 0.4,
      maxSize = 1,
      particleDensity = 30,
      className,
      particleColor = "#FFF",
    },
    ref
  ) => {
    const sparkles = React.useMemo(() => {
      return Array.from({ length: particleDensity }, (_, i) => {
        const size = Math.random() * (maxSize - minSize) + minSize
        const duration = Math.random() * 8 + 4
        const delay = Math.random() * 5
        const left = Math.random() * 100
        const top = Math.random() * 100

        return {
          id: i,
          size,
          duration,
          delay,
          left,
          top,
        }
      })
    }, [particleDensity, minSize, maxSize])

    return (
      <div
        ref={ref}
        className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
        style={{ background }}
      >
        {sparkles.map((sparkle) => (
          <div
            key={sparkle.id}
            className="absolute animate-twinkle"
            style={{
              width: `${sparkle.size}rem`,
              height: `${sparkle.size}rem`,
              left: `${sparkle.left}%`,
              top: `${sparkle.top}%`,
              background: particleColor,
              borderRadius: "50%",
              animation: `twinkle ${sparkle.duration}s infinite ${sparkle.delay}s ease-in-out`,
              boxShadow: `0 0 ${sparkle.size * 10}px ${particleColor}`,
            }}
          />
        ))}
        <style jsx>{`
          @keyframes twinkle {
            0%, 100% {
              opacity: 0;
              transform: scale(0) rotate(0deg);
            }
            50% {
              opacity: 1;
              transform: scale(1) rotate(180deg);
            }
          }
        `}</style>
      </div>
    )
  }
)

SparklesCore.displayName = "SparklesCore"