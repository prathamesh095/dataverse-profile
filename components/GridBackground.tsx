"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface GridBackgroundProps {
	children?: React.ReactNode
	animateGrid?: boolean
	gridSize?: number
	showOrbs?: boolean
	// Theme colors will be pulled directly from CSS variables via inline styles
	// The primary, secondary, and accent colors are inherited from the global theme.
	fadeMask?: boolean
}

// --- CSS Variables for Grid Colors (Safer Dark Mode Switch) ---
// Using color variables that map to our main theme colors (Primary and Background/Muted for grid lines)
const GRID_COLOR_LIGHT_VAR = 'var(--border)'; 
const GRID_COLOR_DARK_VAR = 'var(--muted-foreground)'; 

// --- RGB VALUES FOR ORBS (Retrieved from global theme variables) ---
// Note: These variables must be defined in globals.css as RGB triplets (e.g., "255, 107, 107")
const PRIMARY_ORB_COLOR = 'var(--primary-rgb, 255, 107, 107)';
const SECONDARY_ORB_COLOR = 'var(--secondary-rgb, 147, 51, 234)';
const ACCENT_ORB_COLOR = 'var(--tertiary-rgb, 252, 165, 165)'; 

export function GridBackground({
	children,
	animateGrid = false,
	gridSize = 50,
	showOrbs = true,
	fadeMask = true,
}: GridBackgroundProps) {

	return (
		<div className="relative w-full h-full min-h-screen overflow-hidden bg-background">
			
			{/* ANIMATED GRID CONTAINER */}
			<motion.div
				className="absolute inset-0 pointer-events-none will-change-transform transition-colors duration-700 ease-out"
				style={{
					backgroundSize: `${gridSize}px ${gridSize}px`,
					// Dynamic grid pattern using CSS variables
					backgroundImage: `
						linear-gradient(to right, ${GRID_COLOR_LIGHT_VAR} 0.5px, transparent 0.5px),
						linear-gradient(to bottom, ${GRID_COLOR_LIGHT_VAR} 0.5px, transparent 0.5px)
					`,
				}}
				animate={
					animateGrid
						? { backgroundPosition: ["0% 0%", `${gridSize}px ${gridSize}px`] } // Adjusted animation distance
						: {}
				}
				transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
			>
				{/* DARK MODE OVERLAY: Overrides the light grid lines with a dark color variable */}
				<div
					className="absolute inset-0 dark:bg-[linear-gradient(to_right,var(--grid-color-dark)_0.5px,transparent_0.5px),linear-gradient(to_bottom,var(--grid-color-dark)_0.5px,transparent_0.5px)]"
					style={{ '--grid-color-dark': GRID_COLOR_DARK_VAR } as React.CSSProperties}
				/>
			</motion.div>

			{/* RADIAL FADE MASK (Hides the grid near the edges) */}
			{fadeMask && (
				<div
					className="pointer-events-none absolute inset-0 bg-background"
					style={{
						// Using transparent base color for the mask
						maskImage: "radial-gradient(ellipse at center, transparent 15%, black 85%)",
						WebkitMaskImage: "radial-gradient(ellipse at center, transparent 15%, black 85%)",
					}}
				/>
			)}

			{/* FLOATING ORBS (Using dynamic theme colors via opacity and filter) */}
			{showOrbs && (
				<>
					<motion.div
						className={cn("absolute w-96 h-96 rounded-full blur-[80px] opacity-60 mix-blend-multiply dark:mix-blend-screen animate-pulse-slow")}
						style={{ top: "15%", left: "10%", backgroundColor: `rgba(${PRIMARY_ORB_COLOR}, 0.25)` }}
						animate={{ x: [0, 30, -20, 0], y: [0, -40, 20, 0], scale: [1, 1.1, 0.9, 1] }}
						transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
					/>
					<motion.div
						className={cn("absolute w-96 h-96 rounded-full blur-[80px] opacity-60 mix-blend-multiply dark:mix-blend-screen animate-pulse-slow")}
						style={{ bottom: "20%", right: "15%", backgroundColor: `rgba(${SECONDARY_ORB_COLOR}, 0.25)` }}
						animate={{ x: [0, -40, 30, 0], y: [0, 30, -20, 0], scale: [1, 0.9, 1.2, 1] }}
						transition={{ duration: 25, repeat: Infinity, ease: "easeInOut", delay: 2 }}
					/>
					<motion.div
						className={cn("absolute w-80 h-80 rounded-full blur-[80px] opacity-60 mix-blend-multiply dark:mix-blend-screen animate-pulse-slow")}
						style={{ top: "50%", right: "25%", transform: "translateY(-50%)", backgroundColor: `rgba(${ACCENT_ORB_COLOR}, 0.2)` }}
						animate={{ x: [0, 50, -30, 0], y: [0, -30, 40, 0], scale: [1, 1.2, 0.8, 1] }}
						transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 1 }}
					/>
				</>
			)}

			{/* NOISE TEXTURE */}
			<div
				className="pointer-events-none absolute inset-0 opacity-10 mix-blend-soft-light dark:opacity-5"
				style={{
					backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
				}}
			/>

			{/* CONTENT */}
			<div className="relative z-10 w-full min-h-screen">{children}</div>
		</div>
	)
}