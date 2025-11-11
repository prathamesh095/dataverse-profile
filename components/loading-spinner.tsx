"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils"; // Assuming cn utility is available
import { motion } from "framer-motion";

interface LoadingSpinnerProps {
	size?: "sm" | "md" | "lg";
	className?: string;
	colorClass?: string; // Optional color override
}

/**
 * Basic, highly efficient CSS Spinner Component.
 */
export function LoadingSpinner({
	size = "md",
	className = "",
	colorClass = "text-primary", // Defaults to the theme's primary color
}: LoadingSpinnerProps) {
	// Define dimensions via static classes
	const sizeMap = {
		sm: "w-4 h-4",
		md: "w-8 h-8",
		lg: "w-12 h-12",
	};

	// The background ring color is hardcoded to a light opacity version of primary-rgb
	// The active border color is set by the Tailwind class (colorClass/text-primary)
	return (
		<div
			className={cn(
				"relative animate-spin rounded-full",
				sizeMap[size],
				// Apply the text color class which determines the active border color
				colorClass,
				className,
			)}
			style={
				{
					borderWidth: "2px", // Consistent border width
					borderStyle: "solid",
					// Base ring color (faint version of the primary theme color)
					borderColor: `rgba(var(--color-primary-rgb), 0.2) rgba(var(--color-primary-rgb), 0.2) rgba(var(--color-primary-rgb), 0.2) currentColor`,
					// The top border (the spinning part) uses the 'currentColor' set by colorClass
				} as React.CSSProperties
			}
		>
			<span className="sr-only">Loading...</span>
		</div>
	);
}

interface PageLoaderProps {
	/** Whether the application state/data is truly ready. Defaults to false (always showing). */
	appReady?: boolean;
}

/**
 * Full-screen overlay loader, designed to be unmounted when the application is ready.
 */
export function PageLoader({ appReady = false }: PageLoaderProps) {
	// State to control visibility. Initially true.
	const [isVisible, setIsVisible] = useState(true);

	// This effect ensures the loader unmounts only when the application is truly ready (appReady is true).
	useEffect(() => {
		if (appReady) {
			// Add a slight delay (e.g., 200ms) for a smooth transition before unmounting
			const timer = setTimeout(() => {
				setIsVisible(false);
			}, 200);
			return () => clearTimeout(timer);
		}
	}, [appReady]);

	// If the application is ready and the visibility timer has passed, unmount the loader.
	if (!isVisible) return null;

	return (
		<div className="fixed inset-0 bg-background/80 backdrop-blur-md z-9999 flex flex-col items-center justify-center transition-opacity duration-300">
			<motion.div
				initial={{ opacity: 0, y: 10 }}
				animate={{ opacity: 1, y: 0 }}
				exit={{ opacity: 0, y: -10 }}
				transition={{ duration: 0.3 }}
				className="text-center space-y-4"
			>
				<LoadingSpinner size="lg" colorClass="text-primary" />
				<p className="text-muted-foreground font-medium animate-pulse">
					Initializing Data Scientist Portfolio...
				</p>
			</motion.div>
		</div>
	);
}