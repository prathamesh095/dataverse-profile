"use client";

import React, { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
	ArrowRight,
	Database,
	TrendingUp,
	BarChart3,
	Target,
	Zap,
	Brain,
	Code,
	Eye,
	LucideIcon,
	GitBranch, // Added GitBranch for consistency, although not used in the map
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

// --- UPDATED IMPORT ---
import { projects, type Project, type ProcessStep } from "@/lib/types"; 

// --- Project Types and Icon Mapping ---

// Define the exact set of icon keys used in the ProcessStep type from types.ts
type ProcessIconKey = ProcessStep['icon'];

// Map icon strings to Lucide components
const iconMap: Record<ProcessIconKey, LucideIcon> = {
	Database,
	Code,
	Brain,
	BarChart3,
	TrendingUp,
	Zap,
	Eye,
	Target,
} as const;

// --- Component ---

export function FeaturedInsights() {
	const [currentIndex, setCurrentIndex] = useState(0);
	const intervalRef = useRef<NodeJS.Timeout | null>(null);

	// Use useMemo to transform and filter projects only once
	const featuredProjects = useMemo(() => {
		// Defensive check for 'projects'
		if (!Array.isArray(projects) || projects.length === 0) {
			return [];
		}
		
		// --- CHANGE: Show only the first 3 projects ---
		return projects.slice(0, 3).map((p: Project) => {
			// Safely extract icon, defaulting to 'Database'
			const iconKey = p.process[0]?.icon || "Database";
			// Use the mapped icon component
			const IconComponent = iconMap[iconKey as ProcessIconKey] || Database;
			
			return {
				id: p.id,
				title: p.title,
				tagline: p.tagline,
				// Clean up description (using description as it's shorter)
				description: p.description.replace(/\s*\.\.\.\s*$/, "").trim(),
				image: p.image,
				metrics: p.metrics,
				icon: IconComponent,
				href: `/projects/${p.id}`,
			};
		});
	}, []); 

	const projectCount = featuredProjects.length;

	const goToSlide = useCallback((idx: number) => {
		setCurrentIndex(idx);
		
		// Reset the auto-scroll timer for smooth manual navigation
		if (intervalRef.current) {
			clearInterval(intervalRef.current);
			intervalRef.current = null;
			
			// Re-establish interval after a short delay, but only if motion isn't reduced
			if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
				intervalRef.current = setInterval(() => {
					setCurrentIndex((prev) => (prev + 1) % projectCount);
				}, 5000);
			}
		}
	}, [projectCount]);


	useEffect(() => {
		if (projectCount === 0) return;
		
		// Cleanup existing interval
		if (intervalRef.current) {
			clearInterval(intervalRef.current);
		}

		if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
			return; // Skip auto-scroll
		}

		// Setup auto-scroll interval
		intervalRef.current = setInterval(() => {
			setCurrentIndex((prev) => (prev + 1) % projectCount);
		}, 5000);

		return () => {
			// Final cleanup on component unmount
			if (intervalRef.current) {
				clearInterval(intervalRef.current);
			}
		};
	}, [projectCount]); // Effect depends on the number of projects

	if (projectCount === 0) {
		return (
			<div className="py-20 text-center text-muted-foreground">
				No featured projects available.
			</div>
		);
	}

	const current = featuredProjects[currentIndex];
	const Icon = current.icon;

	// Only 2 quick cards (next two in cycle)
	const quickProjects = [
		featuredProjects[(currentIndex + 1) % projectCount],
		featuredProjects[(currentIndex + 2) % projectCount],
	];

	return (
		<section className="py-20 bg-transparent" aria-label="Featured Projects Carousel">
			<div className="container mx-auto px-4 sm:px-6 lg:px-8">
				{/* Header - Clean & Professional */}
				<header className="text-center mb-16">
					<h2 className="text-3xl sm:text-4xl font-bold mb-4 text-foreground">
						Featured Projects
					</h2>
					<p className="text-lg text-muted-foreground/80 max-w-2xl mx-auto">
						Highlighting impactful data science and analytics projects
					</p>
				</header>

				<div className="max-w-5xl mx-auto">
					{/* Main Hero Card - Your Original Design, Perfected */}
					<Card 
						// Using the new .card styles for elevation, border, and hover effect
						className="overflow-hidden border border-border/30 shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-[1.01]"
					>
						<CardContent className="p-0">
							<div className="grid md:grid-cols-2">
								{/* Image Side */}
								<div className="relative w-full h-80 sm:h-[400px] md:h-[450px] overflow-hidden">
									<Image
										src={current.image}
										alt={current.title}
										fill
										sizes="(max-width: 768px) 100vw, 50vw"
										className="object-cover transition-transform duration-700 hover:scale-105"
										priority
									/>
									<div className="absolute inset-0 bg-linear-to-t from-black/50 via-black/20 to-transparent" />
									{/* Badge uses theme primary color */}
									<Badge className="absolute top-4 left-4 bg-primary/80 text-primary-foreground shadow-md backdrop-blur-md text-sm sm:text-base">
										{current.tagline}
									</Badge>
								</div>

								{/* Content Side */}
								<div className="p-6 sm:p-8 flex flex-col justify-center glassmorphism">
									<div className="flex items-center mb-4">
										{/* Icon background uses primary/10 */}
										<div className="p-2 rounded-lg bg-primary/10 mr-3">
											<Icon className="w-5 h-5 text-primary" />
										</div>
										<span className="text-sm font-medium text-muted-foreground/90">
											Featured Project
										</span>
									</div>

									<h3 className="text-xl sm:text-2xl font-bold mb-3 text-foreground">
										{current.title}
									</h3>
									<p className="text-sm sm:text-base text-muted-foreground/80 mb-6 leading-relaxed">
										{current.description}
									</p>

									{/* Metrics Grid */}
									<div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
										{Object.entries(current.metrics).map(([key, value]) => (
											<div key={key} className="text-center">
												{/* Metric values use theme primary color */}
												<div className="text-lg sm:text-xl font-bold text-primary">
													{value}
												</div>
												{/* Improved key to label transformation */}
												<div className="text-xs text-muted-foreground/80 capitalize">
													{key.replace(/([A-Z])/g, " $1").trim()}
												</div>
											</div>
										))}
									</div>

									<Button className="group w-fit" asChild>
										<Link href={current.href}>
											View Details
											<ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
										</Link>
									</Button>
								</div>
							</div>
						</CardContent>
					</Card>

					{/* Indicators */}
					<div className="flex justify-center mt-8 space-x-2" role="tablist" aria-label="Project carousel indicators">
						{featuredProjects.map((_, idx) => (
							<button
								key={idx}
								onClick={() => goToSlide(idx)}
								className={`w-3 h-3 rounded-full transition-all duration-300 ${
									idx === currentIndex
										? "bg-primary scale-125" // Active indicator uses primary color
										: "bg-muted-foreground/30 hover:bg-muted-foreground/50"
								}`}
								aria-label={`Go to project ${idx + 1}`}
								role="tab"
								aria-selected={idx === currentIndex}
							/>
						))}
					</div>

					{/* Only 2 Quick Navigation Cards */}
					<div className="grid md:grid-cols-2 gap-4 mt-12">
						{quickProjects.map((project) => {
							const QuickIcon = project.icon;
							return (
								<Card
									key={project.id}
									// Using glassmorphism for a frosted card look
									className="group cursor-pointer hover-lift border border-border/30 glassmorphism"
								>
									<CardContent className="p-4">
										<Link href={project.href} className="block" aria-label={`Quick link to ${project.title}`}>
											<div className="flex items-start space-x-3">
												{/* Icon block uses primary/10 */}
												<div className="p-2 rounded-lg bg-primary/10 shrink-0">
													<QuickIcon className="w-4 h-4 text-primary" />
												</div>
												<div className="flex-1 min-w-0">
													<h4 className="font-semibold text-sm group-hover:text-primary transition-colors">
														{project.title}
													</h4>
													<p className="text-xs text-muted-foreground/80 mt-1 line-clamp-2">
														{project.description}
													</p>
												</div>
												{/* Arrow uses primary color on hover */}
												<ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all shrink-0" />
											</div>
										</Link>
									</CardContent>
								</Card>
							);
						})}
					</div>
				</div>
			</div>
		</section>
	);
}