"use client"

import { motion, useMotionValue, useTransform } from "framer-motion"
import {
	Code2, Database, Brain, BarChart3, Cpu, Zap
} from "lucide-react"
import React, { useState } from "react"

const tiles = [
	{
		icon: Code2,
		title: "Data-Driven Development",
		description:
			"Clean architecture and modern tooling to transform data into elegant, functional products."
	},
	{
		icon: Database,
		title: "Robust Data Architecture",
		description:
			"Designing resilient data models, optimized queries, and ETL pipelines that scale with your needs."
	},
	{
		icon: Brain,
		title: "Machine Learning",
		description:
			"Building predictive, interpretable systems that turn information into intelligence."
	},
	{
		icon: BarChart3,
		title: "Business Intelligence",
		// FIX: Changed Ldescription back to the correct key: description
		description:
			"Delivering KPI dashboards and visual analytics that empower informed decisions."
	},
	{
		icon: Cpu,
		title: "Automation & AI",
		description:
			"Streamlining repetitive workflows using AI-assisted and rules-based automation."
	},
	{
		icon: Zap,
		title: "Performance Optimization",
		description:
			"Focusing on responsiveness, scalability, and cost-efficiency for data-centric applications."
	}
]

export function OverviewTiles() {
	return (
		<section
			aria-labelledby="overview"
			className="relative w-full py-24 sm:py-28 bg-transparent"
		>
			<div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
				{/* heading */}
				<motion.div
					initial={{ opacity: 0, y: 40 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.9, ease: [0.25, 0.1, 0.25, 1] }}
					viewport={{ once: true }}
					className="text-center max-w-3xl mx-auto mb-16"
				>
					<h2
						id="overview"
						// Using custom gradient class which pulls colors from globals.css
						className="text-4xl sm:text-5xl font-extrabold gradient-text"
					>
						What I Do
					</h2>
					<p className="mt-4 text-lg text-muted-foreground" style={{color: 'var(--color-muted-foreground)'}}>
						Each solution blends code, data, and insight — engineered for clarity, speed, and scalability.
					</p>
				</motion.div>

				{/* dynamic grid */}
				{/* The grid container manages the width, and the tile manages the fixed height */}
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
					{tiles.map((tile, idx) => (
						<DynamicTile key={tile.title} tile={tile} index={idx} />
					))}
				</div>
			</div>

			{/* ambient glowing lights (using theme colors) */}
			<div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
				{/* Primary Color Glow Orb (Coral/Violet) */}
				<div className="absolute w-[400px] h-[400px] bg-primary/10 blur-[160px] rounded-full top-[20%] left-[10%]" style={{backgroundColor: 'rgba(59, 130, 246, 0.1)'}}/>
				{/* Accent Color Glow Orb (Navy/Pink) */}
				<div className="absolute w-[300px] h-[300px] bg-accent/10 blur-[120px] rounded-full bottom-[10%] right-[10%]" style={{backgroundColor: 'rgba(239, 68, 68, 0.1)'}}/>
			</div>
		</section>
	)
}

/* ────────────────────────────────
   Subcomponent: Interactive tile
   ──────────────────────────────── */
function DynamicTile({
	tile,
	index
}: {
	tile: { icon: any; title: string; description: string }
	index: number
}) {
	const Icon = tile.icon
	const [hovered, setHovered] = useState(false)

	const x = useMotionValue(0)
	const y = useMotionValue(0)
	// Less tilt on mobile devices via framer motion transforms
	const rotateX = useTransform(y, [-40, 40], [8, -8])
	const rotateY = useTransform(x, [-40, 40], [-8, 8])

	return (
		<motion.div
			initial={{ opacity: 0, y: 40 }}
			whileInView={{ opacity: 1, y: 0 }}
			transition={{
				delay: index * 0.08,
				duration: 0.8,
				ease: [0.25, 0.1, 0.25, 1]
			}}
			viewport={{ once: true }}
			// Enforcing w-full ensures it takes up the grid column space
			className="w-full" 
		>
			<motion.div
				// CRITICAL FIX: Added h-[300px] to strictly enforce uniform card height.
				className={`
					relative p-8 rounded-2xl border border-border w-full h-[300px]
					bg-card/60 backdrop-blur-md shadow-md flex flex-col justify-between
					transition-all duration-300 cursor-pointer
					hover:shadow-2xl hover:border-primary/40
					
					// Apply conditional glow/hover effects from globals.css
					${hovered ? 'animate-glow-primary' : ''}
				`}
				onMouseMove={(e) => {
					const rect = e.currentTarget.getBoundingClientRect()
					const px = e.clientX - rect.left - rect.width / 2
					const py = e.clientY - rect.top - rect.height / 2
					x.set(px)
					y.set(py)
				}}
				onMouseLeave={() => {
					x.set(0)
					y.set(0)
					setHovered(false)
				}}
				onMouseEnter={() => setHovered(true)}
				style={{ 
					rotateX, 
					rotateY, 
					transformStyle: "preserve-3d",
					// Apply hover shadow using theme variables
					boxShadow: hovered ? 'var(--midnight-glow)' : '', // Using the glow variable from globals.css
					backgroundColor: 'var(--color-card)'
				}}
			>
				<div>
					{/* gradient shimmer border */}
					<motion.div
						animate={{
							opacity: hovered ? 1 : 0
						}}
						transition={{ duration: 0.6 }}
						// FIX: Replaced bg-gradient-to-r with bg-linear-to-r
						className="absolute inset-0 rounded-2xl bg-linear-to-r from-primary/20 via-accent/20 to-transparent blur-[2px] pointer-events-none"
					/>

					{/* Icon Block */}
					<div 
						className="flex items-center justify-center w-14 h-14 rounded-xl mb-6"
						style={{backgroundColor: 'rgba(59, 130, 246, 0.1)'}} // Primary/10
					>
						<Icon className="w-7 h-7" style={{color: 'var(--color-primary)'}} />
					</div>

					<h3 className="text-xl font-semibold mb-3">{tile.title}</h3>
					{/* Adjusted p tag for fixed height layout */}
					<p className="text-muted-foreground leading-relaxed text-sm" style={{color: 'var(--color-muted-foreground)'}}>
						{tile.description}
					</p>
				</div>

				{/* animated underline */}
				<motion.div
					// FIX: Replaced bg-gradient-to-r with bg-linear-to-r
					className="mt-6 h-0.5 w-0 bg-linear-to-r from-primary to-accent rounded-full"
					animate={{ width: hovered ? "100%" : "0%" }}
					transition={{ duration: 0.5 }}
					style={{ 
						backgroundImage: 'linear-gradient(to right, var(--color-primary), var(--color-accent))'
					}}
				/>
			</motion.div>
		</motion.div>
	)
}

export default OverviewTiles