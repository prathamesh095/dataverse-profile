"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface GridBackgroundProps {
  children?: React.ReactNode
  animateGrid?: boolean
  gridSize?: number
  showOrbs?: boolean
  fadeMask?: boolean
}

const GRID_COLOR_LIGHT_VAR = "var(--border)"
const GRID_COLOR_DARK_VAR = "var(--muted-foreground)"
const PRIMARY_ORB_COLOR = "var(--primary-rgb, 255, 107, 107)"
const SECONDARY_ORB_COLOR = "var(--secondary-rgb, 147, 51, 234)"
const ACCENT_ORB_COLOR = "var(--tertiary-rgb, 252, 165, 165)"

export function GridBackground({
  children,
  animateGrid = false,
  gridSize = 50,
  showOrbs = true,
  fadeMask = true,
}: GridBackgroundProps) {
  return (
    // Use stable viewport unit and avoid forcing layout-centering.
    // 100svh is more robust across mobile/desktop and avoids Chrome min-height oddities.
    <div className="relative w-full min-h-svh overflow-hidden bg-background">
      {/* ===== GRID LAYER (purely decorative; behind everything) ===== */}
      <motion.div
        // keep it behind content so it cannot affect layout
        className={cn(
          "absolute inset-0 pointer-events-none -z-20",
          // don't use will-change here globally — GPU promotion via transform in style below instead
        )}
        style={{
          backgroundSize: `${gridSize}px ${gridSize}px`,
          backgroundImage: `
            linear-gradient(to right, ${GRID_COLOR_LIGHT_VAR} 0.5px, transparent 0.5px),
            linear-gradient(to bottom, ${GRID_COLOR_LIGHT_VAR} 0.5px, transparent 0.5px)
          `,
          transform: "translateZ(0)", // promote to its own layer
        }}
        animate={
          animateGrid
            ? { backgroundPosition: ["0px 0px", `${gridSize}px ${gridSize}px`] }
            : {}
        }
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        aria-hidden
      >
        {/* dark mode overlay for grid color — placed inside grid layer and still behind content */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(to right, ${GRID_COLOR_DARK_VAR} 0.5px, transparent 0.5px), linear-gradient(to bottom, ${GRID_COLOR_DARK_VAR} 0.5px, transparent 0.5px)`,
            opacity: "0", // default; theme CSS can toggle it (keeps layout stable)
            transform: "translateZ(0)",
          }}
        />
      </motion.div>

      {/* ===== FADED ORBS (all behind content, non-interactive) ===== */}
      {showOrbs && (
        <>
          <motion.div
            aria-hidden
            className="absolute w-96 h-96 rounded-full blur-[80px] opacity-60 mix-blend-multiply dark:mix-blend-screen pointer-events-none -z-10"
            style={{ top: "15%", left: "10%", backgroundColor: `rgba(${PRIMARY_ORB_COLOR}, 0.25)` }}
            animate={{ x: [0, 30, -20, 0], y: [0, -40, 20, 0], scale: [1, 1.1, 0.9, 1] }}
            transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            aria-hidden
            className="absolute w-96 h-96 rounded-full blur-[80px] opacity-60 mix-blend-multiply dark:mix-blend-screen pointer-events-none -z-10"
            style={{ bottom: "20%", right: "15%", backgroundColor: `rgba(${SECONDARY_ORB_COLOR}, 0.25)` }}
            animate={{ x: [0, -40, 30, 0], y: [0, 30, -20, 0], scale: [1, 0.9, 1.2, 1] }}
            transition={{ duration: 25, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          />
          <motion.div
            aria-hidden
            className="absolute w-80 h-80 rounded-full blur-[80px] opacity-60 mix-blend-multiply dark:mix-blend-screen pointer-events-none -z-10"
            style={{ top: "50%", right: "25%", transform: "translateY(-50%)", backgroundColor: `rgba(${ACCENT_ORB_COLOR}, 0.2)` }}
            animate={{ x: [0, 50, -30, 0], y: [0, -30, 40, 0], scale: [1, 1.2, 0.8, 1] }}
            transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          />
        </>
      )}

      {/* ===== NOISE LAYER (decorative, behind content) ===== */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-10 mix-blend-soft-light dark:opacity-5 -z-10"
        style={{
          backgroundImage:
            'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\'/%3E%3C/svg%3E")',
          transform: "translateZ(0)",
        }}
      />

      {/* ===== RADIAL FADE MASK ===== */}
      {fadeMask && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            maskImage: "radial-gradient(ellipse at center, transparent 15%, black 85%)",
            WebkitMaskImage: "radial-gradient(ellipse at center, transparent 15%, black 85%)",
          }}
        />
      )}

      {/* ===== CONTENT - flows normally; use svh to avoid Chrome toolbar resizing issues ===== */}
      <div className="relative z-10 w-full min-h-svh">
        {children}
      </div>
    </div>
  )
}
