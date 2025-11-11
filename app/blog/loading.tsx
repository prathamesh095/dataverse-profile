"use client"

import React from "react"

export default function Loading() {
	return (
		<div className="min-h-screen flex items-center justify-center bg-background">
			<div className="flex flex-col items-center space-y-4 animate-pulse">
				{/* Loading Orb: Uses primary and secondary colors for a theme-specific gradient effect */}
				<div 
					className="w-20 h-20 rounded-full bg-linear-to-r from-primary to-secondary shadow-lg shadow-primary/20 dark:shadow-secondary/30" 
				/>
				
				{/* Placeholder elements use Card and Muted background colors */}
				<div className="w-56 h-6 bg-card rounded-md shadow-sm" />
				<div className="w-80 h-4 bg-muted rounded-md shadow-sm" />
			</div>
		</div>
	)
}