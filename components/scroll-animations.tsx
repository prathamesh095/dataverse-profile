"use client"

import React, { useEffect, useRef } from "react"
// Replaced clsx with cn for consistency with your existing project utils
import { cn } from "@/lib/utils" 

interface ScrollAnimationProps {
	children: React.ReactNode
	className?: string
	animation?: "fadeInUp" | "fadeInLeft" | "fadeInRight" | "scaleIn" | "slideInUp"
	delay?: number
	duration?: number
	threshold?: number
}

/**
 * Utility component for intersection observer-based scroll animations.
 * NOTE: For Framer Motion projects, consider using motion.div's whileInView property instead.
 */
export function ScrollAnimation({
	children,
	className = "",
	animation = "fadeInUp",
	delay = 0,
	// Using a default closer to Framer Motion's typical duration for smoothness
	duration = 650, 
	threshold = 0.15,
}: ScrollAnimationProps) {
	const elementRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		const el = elementRef.current
		if (!el) return

		const observer = new IntersectionObserver(
			(entries, observer) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						setTimeout(() => {
							el.classList.add("animate-in")
						}, delay)
						observer.unobserve(el) // Animate once
					}
				})
			},
			{ threshold, rootMargin: "0px 0px -60px 0px" },
		)

		observer.observe(el)
		return () => observer.disconnect()
	}, [delay, threshold])

	const baseClasses =
		"opacity-0 will-change-transform transition-all ease-out"

	// Define initial transformation classes based on the selected animation
	const initialTransformClasses: Record<string, string> = {
		fadeInUp: "translate-y-8",
		fadeInLeft: "-translate-x-8",
		fadeInRight: "translate-x-8",
		scaleIn: "scale-95",
		slideInUp: "translate-y-12",
	}
    
	// Apply classes using cn for conditional styling
	return (
		<div
			ref={elementRef}
			className={cn(baseClasses, initialTransformClasses[animation], className)}
			style={{
				transitionDuration: `${duration}ms`,
			}}
		>
			{children}
			<style jsx>{`
				.animate-in {
					opacity: 1 !important;
					transform: none !important;
                    // Use the motion ease standard defined in globals.css
					transition-timing-function: var(--motion-ease-standard) !important;
				}
			`}</style>
		</div>
	)
}