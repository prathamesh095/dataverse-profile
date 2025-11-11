"use client"

import { useState, useEffect, useRef } from "react"
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog"
import {
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from "@/components/ui/tabs"
import { motion, easeOut } from "framer-motion"
import { X, Mail, Shield, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { cn } from "@/lib/utils" // Ensure cn is imported for conditional styling

interface PrivacyModalProps {
	isOpen: boolean
	onClose: () => void
}

export function PrivacyModal({ isOpen, onClose }: PrivacyModalProps) {
	const [activeTab, setActiveTab] = useState("privacy")
	const contentRef = useRef<HTMLDivElement>(null)

	/* ------------------- Focus‑trap & keyboard ------------------- */
	useEffect(() => {
		if (!isOpen) return

		const focusable = contentRef.current?.querySelectorAll(
			'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
		)
		const first = focusable?.[0] as HTMLElement
		const last = focusable?.[focusable?.length - 1] as HTMLElement

		const onKey = (e: KeyboardEvent) => {
			if (e.key === "Escape") onClose()
			if (e.key !== "Tab") return
			if (e.shiftKey && document.activeElement === first) {
				e.preventDefault()
				last?.focus()
			} else if (!e.shiftKey && document.activeElement === last) {
				e.preventDefault()
				first?.focus()
			}
		}

		first?.focus()
		document.addEventListener("keydown", onKey)
		return () => document.removeEventListener("keydown", onKey)
	}, [isOpen, onClose])

	/* -------------------------- Animations -------------------------- */
	const fadeInUp = {
		hidden: { opacity: 0, y: 20 },
		visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: easeOut } },
	}

	const container = {
		hidden: { opacity: 0 },
		visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
	}

	const child = {
		hidden: { opacity: 0, y: 8 },
		visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
	}

	const today = new Date().toLocaleDateString("en-US", {
		year: "numeric",
		month: "long",
		day: "2-digit",
	})

	/* -------------------------- Sections -------------------------- */
	const PrivacySection = () => (
		<motion.div variants={container} className="space-y-7">
			<motion.section variants={child} aria-labelledby="privacy-1">
				<h4 id="privacy-1" className="font-semibold text-primary mb-3 text-lg flex items-center gap-2">
					<Shield className="w-5 h-5 text-primary/80" />
					1. Information We Collect
				</h4>
				<p className="text-muted-foreground text-sm leading-relaxed pl-7">
					We collect personal information you voluntarily provide (e.g., name,
					email via contact forms). Non‑personal data such as IP addresses,
					browser type, and usage analytics is gathered via Google Analytics to
					improve the site.
				</p>
			</motion.section>

			<motion.section variants={child} aria-labelledby="privacy-2">
				<h4 id="privacy-2" className="font-semibold text-primary mb-3 text-lg flex items-center gap-2">
					<Shield className="w-5 h-5 text-primary/80" />
					2. Use of Information
				</h4>
				<p className="text-muted-foreground text-sm leading-relaxed pl-7">
					Data is used solely to answer inquiries, optimise performance, and
					derive content insights. We never sell, rent, or share personal data
					with third parties except when required by law or with your explicit
					consent.
				</p>
			</motion.section>

			<motion.section variants={child} aria-labelledby="privacy-3">
				<h4 id="privacy-3" className="font-semibold text-primary mb-3 text-lg flex items-center gap-2">
					<Shield className="w-5 h-5 text-primary/80" />
					3. Cookies & Tracking
				</h4>
				<p className="text-muted-foreground text-sm leading-relaxed pl-7">
					Essential cookies power core functionality; optional analytics cookies
					monitor performance. Manage preferences in your browser settings.
				</p>
			</motion.section>

			<motion.section variants={child} aria-labelledby="privacy-4">
				<h4 id="privacy-4" className="font-semibold text-primary mb-3 text-lg flex items-center gap-2">
					<Shield className="w-5 h-5 text-primary/80" />
					4. Security & Rights
				</h4>
				<p className="text-muted-foreground text-sm leading-relaxed pl-7">
					Industry‑standard safeguards protect your data (absolute security
					cannot be guaranteed). Under GDPR (where applicable) you may access,
					rectify, or erase your data – email{" "}
					<Link
						href="mailto:pawar.prathamesh@outlook.com"
						// Theme primary color for links
						className="text-primary hover:underline font-medium focus-visible:ring-2 focus-visible:ring-primary/50 rounded-sm"
					>
						pawar.prathamesh@outlook.com
					</Link>
					.
				</p>
			</motion.section>

			<motion.section variants={child} aria-labelledby="privacy-5">
				<h4 id="privacy-5" className="font-semibold text-primary mb-3 text-lg flex items-center gap-2">
					<Shield className="w-5 h-5 text-primary/80" />
					5. Policy Updates
				</h4>
				<p className="text-muted-foreground text-sm leading-relaxed pl-7">
					This policy may change; material updates will be posted here.
					Continued use implies acceptance.
				</p>
			</motion.section>
		</motion.div>
	)

	const TermsSection = () => (
		<motion.div variants={container} className="space-y-7">
			<motion.section variants={child} aria-labelledby="terms-1">
				<h4 id="terms-1" className="font-semibold text-primary mb-3 text-lg flex items-center gap-2">
					<FileText className="w-5 h-5 text-primary/80" />
					1. Acceptance
				</h4>
				<p className="text-muted-foreground text-sm leading-relaxed pl-7">
					By using this site you agree to these Terms. Check periodically for
					updates.
				</p>
			</motion.section>

			<motion.section variants={child} aria-labelledby="terms-2">
				<h4 id="terms-2" className="font-semibold text-primary mb-3 text-lg flex items-center gap-2">
					<FileText className="w-5 h-5 text-primary/80" />
					2. Intellectual Property
				</h4>
				<p className="text-muted-foreground text-sm leading-relaxed pl-7">
					All content is owned by Prathamesh Pawar (or licensed). Personal,
					non‑commercial viewing is permitted; reproduction requires written
					consent.
				</p>
			</motion.section>

			<motion.section variants={child} aria-labelledby="terms-3">
				<h4 id="terms-3" className="font-semibold text-primary mb-3 text-lg flex items-center gap-2">
					<FileText className="w-5 h-5 text-primary/80" />
					3. Conduct
				</h4>
				<p className="text-muted-foreground text-sm leading-relaxed pl-7">
					No illegal activity, malware, or harassment. Access may be revoked
					without notice.
				</p>
			</motion.section>

			<motion.section variants={child} aria-labelledby="terms-4">
				<h4 id="terms-4" className="font-semibold text-primary mb-3 text-lg flex items-center gap-2">
					<FileText className="w-5 h-5 text-primary/80" />
					4. Third‑Party Links
				</h4>
				<p className="text-muted-foreground text-sm leading-relaxed pl-7">
					External links are for convenience; we are not responsible for their
					content or privacy.
				</p>
			</motion.section>

			<motion.section variants={child} aria-labelledby="terms-5">
				<h4 id="terms-5" className="font-semibold text-primary mb-3 text-lg flex items-center gap-2">
					<FileText className="w-5 h-5 text-primary/80" />
					5. Disclaimer & Liability
				</h4>
				<p className="text-muted-foreground text-sm leading-relaxed pl-7">
					Site provided “as‑is”. No liability for indirect damages.
				</p>
			</motion.section>

			<motion.section variants={child} aria-labelledby="terms-6">
				<h4 id="terms-6" className="font-semibold text-primary mb-3 text-lg flex items-center gap-2">
					<FileText className="w-5 h-5 text-primary/80" />
					6. Governing Law
				</h4>
				<p className="text-muted-foreground text-sm leading-relaxed pl-7">
					Governed by Indian law; jurisdiction: Pune courts.
				</p>
			</motion.section>
		</motion.div>
	)

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent
				// Ensuring content box uses theme colors
				className="max-w-4xl max-h-[90vh] overflow-hidden bg-card text-card-foreground rounded-2xl p-0 shadow-2xl border-border/50"
				aria-describedby="legal-desc"
			>
				{/* Header */}
				<DialogHeader className="sticky top-0 z-20 p-6 border-b border-border bg-card/95 backdrop-blur-sm">
					<div className="flex items-center justify-between">
						<DialogTitle className="text-2xl font-bold tracking-tight">
							Legal Information
						</DialogTitle>
						<Button
							variant="ghost"
							size="icon"
							onClick={onClose}
							// Theme focus ring
							className="rounded-full hover:bg-muted/80 focus-visible:ring-2 focus-visible:ring-primary/50"
							aria-label="Close modal"
						>
							<X className="w-5 h-5" />
						</Button>
					</div>
				</DialogHeader>

				{/* Scrollable body */}
				<div
					ref={contentRef}
					id="legal-desc"
					role="region"
					aria-live="polite"
					className="overflow-y-auto p-6 max-h-[calc(90vh-120px)]"
				>
					<motion.div
						initial="hidden"
						animate="visible"
						variants={fadeInUp}
						className="space-y-8"
					>
						{/* ------------------- Tabs with Theme Colors ------------------- */}
						<Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
							<TabsList 
								// Tab List Gradient and Border (Primary/Secondary)
								className={cn(
									"inline-flex h-12 items-center justify-center rounded-full p-1.5 backdrop-blur-sm shadow-inner",
									"bg-linear-to-r from-primary/10 to-secondary/10 border border-primary/20"
								)}
							>
								<TabsTrigger
									value="privacy"
									className={cn(
										`relative flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-medium transition-all duration-200`,
										// Active: Primary/Secondary Gradient
										`data-[state=active]:bg-linear-to-r data-[state=active]:from-primary data-[state=active]:to-secondary`,
										`data-[state=active]:text-white data-[state=active]:shadow-md data-[state=active]:font-semibold`,
										// Hover: Primary/20 background, Primary focus ring
										`hover:bg-primary/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50`
									)}
									aria-controls="privacy-panel"
								>
									<Shield className="w-4 h-4" />
									Privacy Policy
								</TabsTrigger>
								<TabsTrigger
									value="terms"
									className={cn(
										`relative flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-medium transition-all duration-200`,
										// Active: Secondary/Primary Gradient
										`data-[state=active]:bg-linear-to-r data-[state=active]:from-secondary data-[state=active]:to-primary`,
										`data-[state=active]:text-white data-[state=active]:shadow-md data-[state=active]:font-semibold`,
										// Hover: Secondary/20 background, Secondary focus ring
										`hover:bg-secondary/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary/50`
									)}
									aria-controls="terms-panel"
								>
									<FileText className="w-4 h-4" />
									Terms of Service
								</TabsTrigger>
							</TabsList>

							{/* ------------------- Content ------------------- */}
							<div className="prose prose-sm max-w-none dark:prose-invert mt-8">
								<TabsContent
									value="privacy"
									id="privacy-panel"
									role="tabpanel"
									className="mt-0 p-0 space-y-5"
								>
									<p className="font-medium text-muted-foreground">
										<strong>Last Updated:</strong> {today}
									</p>
									<p className="text-muted-foreground">
										This Privacy Policy describes our practices regarding the
										collection, use, and protection of your personal information
										on this personal portfolio website operated by Prathamesh
										Pawar.
									</p>
									<PrivacySection />
								</TabsContent>

								<TabsContent
									value="terms"
									id="terms-panel"
									role="tabpanel"
									className="mt-0 p-0 space-y-5"
								>
									<p className="font-medium text-muted-foreground">
										<strong>Last Updated:</strong> {today}
									</p>
									<p className="text-muted-foreground">
										These Terms of Service govern your access to and use of the
										website. By using the site you accept these terms in full.
									</p>
									<TermsSection />
								</TabsContent>
							</div>
						</Tabs>

						{/* ------------------- Footer ------------------- */}
						<div className="mt-10 pt-6 border-t border-border text-center">
							<p className="text-xs text-muted-foreground leading-relaxed">
								Questions? Contact{" "}
								<Link
									href="mailto:pawar.prathamesh@outlook.com"
									// Theme primary color for link and focus ring
									className="inline-flex items-center gap-1.5 text-primary hover:underline font-medium focus-visible:ring-2 focus-visible:ring-primary/50 rounded-sm"
								>
									<Mail className="w-3.5 h-3.5" aria-hidden="true" />
									pawar.prathamesh@outlook.com
								</Link>
								.
							</p>
						</div>
					</motion.div>
				</div>
			</DialogContent>
		</Dialog>
	)
}