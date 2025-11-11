"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import {
	X,
	FileText,
	Download,
	Printer,
	Share2,
	Maximize,
	Minimize,
	Code2,
	Mail,
	Menu,
} from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils" // Ensure cn is imported if used elsewhere

const uniqueFontStyle = {
	fontFamily: "'Inter', sans-serif",
	fontWeight: 900,
	letterSpacing: "-0.025em",
} as const

export function ResumeModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
	const [isLoading, setIsLoading] = useState(true)
	const [loadError, setLoadError] = useState(false)
	const [isFullScreen, setIsFullScreen] = useState(false)
	const [showMobileSheet, setShowMobileSheet] = useState(false)
	const iframeRef = useRef<HTMLIFrameElement>(null)

	// Reset state on open
	useEffect(() => {
		if (isOpen) {
			setIsLoading(true)
			setLoadError(false)
			setIsFullScreen(false)
			setShowMobileSheet(false)
			// Small delay for loading animation to show
			const timer = setTimeout(() => setIsLoading(false), 600) 
			return () => clearTimeout(timer)
		}
	}, [isOpen])

	// Escape to close and scroll lock
	useEffect(() => {
		const handleEsc = (e: KeyboardEvent) => {
			if (e.key === "Escape") onClose()
		}
		if (isOpen) {
			document.addEventListener("keydown", handleEsc)
			document.body.style.overflow = "hidden"
		}
		return () => {
			document.removeEventListener("keydown", handleEsc)
			document.body.style.overflow = ""
		}
	}, [isOpen, onClose])

	// Download PDF
	const handleDownload = useCallback(() => {
		const link = document.createElement("a")
		link.href = "/resume/Prathamesh Pawar CV.pdf"
		link.download = "Prathamesh_Pawar_Resume.pdf"
		link.click()
		setTimeout(onClose, 400)
	}, [onClose])

	// Share
	const handleShare = useCallback(async () => {
		const url = window.location.origin
		if (navigator.share) {
			try {
				await navigator.share({ title: "Prathamesh Pawar - Resume", url })
			} catch {
				// Fallback if sharing API fails
				await navigator.clipboard.writeText(url)
				alert("Portfolio link copied!")
			}
		} else {
			// Fallback for non-share API browsers
			await navigator.clipboard.writeText(url)
			alert("Portfolio link copied!")
		}
	}, [])

	const toggleFullScreen = useCallback(() => {
		setIsFullScreen((v) => !v)
	}, [])

	const closeSheet = useCallback(() => setShowMobileSheet(false), [])

	if (!isOpen) return null

	return (
		<AnimatePresence>
			{/* Backdrop */}
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				exit={{ opacity: 0 }}
				className="fixed inset-0 z-100 flex items-center justify-center p-3 bg-black/70 backdrop-blur-md"
				onClick={onClose}
				role="dialog"
				aria-modal="true"
				aria-labelledby="resume-modal-title"
			>
				{/* Modal Container */}
				<motion.div
					initial={{ scale: 0.92, opacity: 0 }}
					animate={{ scale: 1, opacity: 1 }}
					exit={{ scale: 0.92, opacity: 0 }}
					transition={{ type: "spring", stiffness: 300, damping: 30 }}
					className={`relative w-full bg-card rounded-2xl overflow-hidden shadow-2xl flex flex-col ${
						isFullScreen ? "h-[92vh] max-w-7xl" : "h-[85vh] max-w-5xl"
					}`}
					onClick={(e) => e.stopPropagation()}
				>
					{/* Header */}
					{/* Header background uses the primary-secondary gradient */}
					<header className="bg-linear-to-r from-primary to-secondary p-4 sm:p-5 text-white shrink-0">
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-3">
								<FileText className="w-6 h-6" />
								<div>
									<h2 id="resume-modal-title" className="text-lg sm:text-xl font-bold" style={uniqueFontStyle}>
										Prathamesh Pawar CV
									</h2>
									<p className="text-xs opacity-90 text-primary-foreground/90">Data Analyst & Scientist</p>
								</div>
							</div>
							<div className="flex items-center gap-1">
								<Button
									variant="ghost"
									size="icon"
									className="h-8 w-8 text-white hover:bg-white/20"
									onClick={toggleFullScreen}
									aria-label={isFullScreen ? "Exit fullscreen" : "Enter fullscreen"}
								>
									{isFullScreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
								</Button>
								<Button
									variant="ghost"
									size="icon"
									className="h-8 w-8 text-white hover:bg-white/20"
									onClick={onClose}
									aria-label="Close"
								>
									<X className="w-4 h-4" />
								</Button>
							</div>
						</div>
					</header>

					{/* Body */}
					<div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
						{/* PDF Viewer */}
						<div className="flex-1 bg-muted/50 overflow-hidden relative">
							{isLoading ? (
								<div className="flex items-center justify-center h-full">
									<div className="text-center">
										{/* Loading spinner uses theme primary color */}
										<div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto mb-3" />
										<p className="text-sm text-muted-foreground">Loading resume...</p>
									</div>
								</div>
							) : loadError ? (
								<div className="flex flex-col items-center justify-center h-full text-destructive space-y-3">
									<X className="w-10 h-10" />
									<p>Failed to load PDF</p>
									<Button onClick={handleDownload} size="sm">
										<Download className="w-4 h-4 mr-1" /> Download Anyway
									</Button>
								</div>
							) : (
								<iframe
									ref={iframeRef}
									src="/resume/Prathamesh Pawar CV.pdf"
									className="w-full h-full border-0"
									title="Prathamesh Pawar Resume"
									onLoad={() => setIsLoading(false)}
									onError={() => setLoadError(true)}
									loading="lazy"
								/>
							)}
						</div>

						{/* Desktop Sidebar */}
						<aside className="hidden lg:flex w-80 flex-col bg-card border-l border-border p-6 space-y-6 overflow-y-auto">
							<Section title="Download Options" icon={Download}>
								{/* Download Button uses theme gradient */}
								<Button className="w-full bg-linear-to-r from-primary to-secondary" onClick={handleDownload}>
									<Download className="w-4 h-4 mr-2" /> Download PDF
								</Button>
								<Button variant="outline" className="w-full" onClick={() => window.print()}>
									<Printer className="w-4 h-4 mr-2" /> Print
								</Button>
								{/* Share button uses ghost style with hover effect */}
								<Button variant="ghost" className="w-full justify-start hover:text-primary hover:bg-primary/10" onClick={handleShare}>
									<Share2 className="w-4 h-4 mr-2" /> Share
								</Button>
							</Section>

							<div className="text-xs space-y-1 p-3 bg-muted/50 rounded-lg">
								<Info label="File" value="Prathamesh Pawar CV.pdf" />
								<Info label="Size" value="1.2 MB" />
								<Info label="Format" value="PDF" />
							</div>

							<Section title="Quick Links">
								<LinkButton href="/projects" icon={Code2}>View Projects</LinkButton>
								<LinkButton href="/contact" icon={Mail}>Contact Me</LinkButton>
							</Section>
						</aside>
					</div>

					{/* Mobile FAB */}
					<div className="lg:hidden">
						<Button
							onClick={() => setShowMobileSheet(true)}
							// FAB uses the theme gradient
							className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-xl bg-linear-to-r from-primary to-secondary p-0"
							aria-label="Open actions"
						>
							<Menu className="w-6 h-6" />
						</Button>
					</div>
				</motion.div>
			</motion.div>

			{/* Mobile Bottom Sheet */}
			<AnimatePresence>
				{showMobileSheet && (
					<>
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							className="fixed inset-0 bg-black/50 backdrop-blur-sm z-101"
							onClick={closeSheet}
						/>
						<motion.div
							initial={{ y: "100%" }}
							animate={{ y: 0 }}
							exit={{ y: "100%" }}
							transition={{ type: "spring", stiffness: 300, damping: 30 }}
							className="fixed bottom-0 left-0 right-0 bg-card rounded-t-3xl shadow-2xl p-6 z-102 max-h-[80vh] overflow-y-auto"
						>
							<div className="flex justify-between items-center mb-4">
								<h3 className="text-lg font-semibold">Quick Actions</h3>
								<Button variant="ghost" size="icon" onClick={closeSheet}>
									<X className="w-5 h-5" />
								</Button>
							</div>

							<div className="space-y-3">
								<Button className="w-full bg-linear-to-r from-primary to-secondary" onClick={handleDownload}>
									<Download className="w-5 h-5 mr-2" /> Download PDF
								</Button>
								<Button variant="outline" className="w-full" onClick={() => window.print()}>
									<Printer className="w-5 h-5 mr-2" /> Print
								</Button>
								<Button variant="ghost" className="w-full justify-start hover:text-primary hover:bg-primary/10" onClick={handleShare}>
									<Share2 className="w-5 h-5 mr-2" /> Share Portfolio
								</Button>

								<div className="pt-3 border-t">
									<h4 className="font-medium mb-2 text-sm">Quick Links</h4>
									<LinkButton href="/projects" icon={Code2}>View Projects</LinkButton>
									<LinkButton href="/contact" icon={Mail}>Contact Me</LinkButton>
								</div>
							</div>
						</motion.div>
					</>
				)}
			</AnimatePresence>
		</AnimatePresence>
	)
}

// Helper Components (Updated to use theme colors)
const Section = ({ title, icon: Icon, children }: { title: string; icon?: React.FC<any>; children: React.ReactNode }) => (
	<div>
		<h3 className="font-semibold flex items-center gap-2 mb-3 text-foreground">
			{Icon && <Icon className="w-5 h-5 text-primary" />}
			{title}
		</h3>
		<div className="space-y-2">{children}</div>
	</div>
)

const Info = ({ label, value }: { label: string; value: string }) => (
	<div className="flex justify-between">
		<span className="text-muted-foreground">{label}:</span>
		<span className="font-medium text-foreground">{value}</span>
	</div>
)

const LinkButton = ({ href, icon: Icon, children }: { href: string; icon: React.FC<any>; children: React.ReactNode }) => (
	// Link buttons use ghost style with hover effect
	<Button variant="ghost" size="sm" className="w-full justify-start hover:text-primary hover:bg-primary/10" asChild>
		<Link href={href} className="flex items-center">
			<Icon className="w-4 h-4 mr-2" /> {children}
		</Link>
	</Button>
)