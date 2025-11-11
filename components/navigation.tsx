"use client"

import React, { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
	motion,
	AnimatePresence,
	cubicBezier,
	useReducedMotion,
} from "framer-motion"

// UI
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"

// Data sources
import { projects } from "@/lib/types"
import { skillCategories } from "@/lib/skills"
import { certifications } from "@/lib/certifications"
import { blogPosts } from "@/lib/blogs"

// Modals
import { ResumeModal } from "@/components/resume-modal"
import { AchievementsPopup } from "@/components/AchievementsPopup"

// Utils
import { cn } from "@/lib/utils"

// Lucide Icons
import {
	Search,
	Menu,
	X,
	Home,
	User,
	Award,
	Briefcase,
	BookOpen,
	Mail,
	Command,
	Download,
	Linkedin,
	Github,
	ChevronDown,
	ChevronRight,
	Globe,
	ExternalLink,
} from "lucide-react"

/* =============================================================================
 * Types & Static Config
 * ========================================================================== */

type NavItem = {
	name: string
	href: string
	icon: React.ComponentType<{ className?: string }>
}

const navigation: NavItem[] = [
	{ name: "Home", href: "/", icon: Home },
	{ name: "About", href: "/about", icon: User },
	{ name: "Skills", href: "/skills", icon: Award },
	{ name: "Projects", href: "/projects", icon: Briefcase },
	{ name: "Blog", href: "/blog", icon: BookOpen },
	{ name: "Contact", href: "/contact", icon: Mail },
]

type QuickAction =
	| { name: "Resume"; icon: React.ComponentType<{ className?: string }>; action: "openResume" }
	| { name: "LinkedIn" | "GitHub"; icon: React.ComponentType<{ className?: string }>; href: string; external: true }

const quickActions: QuickAction[] = [
	{ name: "Resume", icon: Download, action: "openResume" },
	{ name: "LinkedIn", href: "https://www.linkedin.com/in/prathamesh095/", icon: Linkedin, external: true },
	{ name: "GitHub", href: "https://github.com/prathamesh095", icon: Github, external: true },
]

/* =============================================================================
 * Component
 * ========================================================================== */

export function Navigation() {
	// Core header + menus
	const [isOpen, setIsOpen] = useState(false) // mobile menu
	const [scrolled, setScrolled] = useState(false) // header style on scroll

	// Search (inline, below button, all devices)
	const [searchOpen, setSearchOpen] = useState(false)
	const [searchQuery, setSearchQuery] = useState("")
	const [searchResults, setSearchResults] = useState<
		Array<
			| { title: string; type: "project" | "skill" | "blog" | "certification"; url: string }
			| { title: string; type: "achievement"; url: string; onClick: () => void }
		>
	>([])

	// Dropdowns / Modals
	const [actionsOpen, setActionsOpen] = useState(false)
	const [resumeOpen, setResumeOpen] = useState(false)
	const [achievementsOpen, setAchievementsOpen] = useState(false)

	// Hover state for subtle nav icon animation
	const [hoveredItem, setHoveredItem] = useState<string | null>(null)

	// Refs
	const pathname = usePathname()
	const actionsRef = useRef<HTMLDivElement>(null)
	const searchPanelRef = useRef<HTMLDivElement>(null)
	const headerRef = useRef<HTMLElement>(null)

	// Motion preference
	const prefersReducedMotion = useReducedMotion()

	/* =======================================================================
	 * Effects: Scroll, Shortcuts, Scroll-Lock, Click Outside
	 * ==================================================================== */

	// Header background + border when scrolled
	useEffect(() => {
		const onScroll = () => setScrolled(window.scrollY > 10)
		window.addEventListener("scroll", onScroll, { passive: true })
		return () => window.removeEventListener("scroll", onScroll)
	}, [])

	// Global shortcuts: Cmd/Ctrl+K toggles search; Esc closes all overlays
	useEffect(() => {
		const onKey = (e: KeyboardEvent) => {
			if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
				e.preventDefault()
				setSearchOpen((v) => !v)
				setSearchQuery("")
			}
			if (e.key === "Escape") {
				setSearchOpen(false)
				setActionsOpen(false)
				setResumeOpen(false)
				setAchievementsOpen(false)
				setIsOpen(false)
			}
		}
		window.addEventListener("keydown", onKey)
		return () => window.removeEventListener("keydown", onKey)
	}, [])

	// Scroll-lock for mobile menu ONLY (restores scroll on close)
	useEffect(() => {
		if (!isOpen) {
			const top = document.body.style.top
			document.body.style.overflow = ""
			document.body.style.position = ""
			document.body.style.top = ""
			document.body.style.width = ""
			if (top) window.scrollTo(0, parseInt(top || "0") * -1)
			return
		}
		const scrollY = window.scrollY
		document.body.style.overflow = "hidden"
		document.body.style.position = "fixed"
		document.body.style.top = `-${scrollY}px`
		document.body.style.width = "100%"
	}, [isOpen])

	// Click outside to close dropdowns and inline search
	useEffect(() => {
		const handleClickOutside = (e: MouseEvent) => {
			const target = e.target as Node
			if (actionsRef.current && !actionsRef.current.contains(target)) setActionsOpen(false)
			if (
				searchOpen &&
				searchPanelRef.current &&
				!searchPanelRef.current.contains(target) &&
				headerRef.current &&
				!headerRef.current.contains(target)
			) {
				setSearchOpen(false)
			}
		}
		document.addEventListener("mousedown", handleClickOutside)
		return () => document.removeEventListener("mousedown", handleClickOutside)
	}, [searchOpen])

	/* =======================================================================
	 * Search Logic (Debounced)
	 * ==================================================================== */

	useEffect(() => {
		const timeoutId = setTimeout(() => {
			if (!searchQuery.trim()) {
				setSearchResults([])
				return
			}
			const q = searchQuery.toLowerCase()

			// 1) Projects
			const projectResults = (projects as any[])
				.filter(
					(p) =>
						p.title?.toLowerCase().includes(q) ||
						p.tagline?.toLowerCase().includes(q) ||
						p.description?.toLowerCase().includes(q) ||
						(Array.isArray(p.tags) && p.tags.some((t: string) => t.toLowerCase().includes(q))) ||
						(Array.isArray(p.technologies) && p.technologies.some((t: string) => t.toLowerCase().includes(q))),
				)
				.map((p) => ({ title: p.title, type: "project" as const, url: `/projects/${p.id}`, priority: 1 }))

			// 2) Skills (flatten categories)
			const skillResults = (skillCategories as any[]).flatMap((cat) =>
				(cat.skills || [])
					.filter((s: any) => s.name?.toLowerCase().includes(q))
					.map((s: any) => ({ title: s.name, type: "skill" as const, url: `/skills#${cat.id}`, priority: 2 })),
			)

			// 3) Blogs
			const blogResults = (blogPosts as any[])
				.filter(
					(b) =>
						b.title?.toLowerCase().includes(q) ||
						b.excerpt?.toLowerCase().includes(q) ||
						(Array.isArray(b.tags) && b.tags.some((t: string) => t.toLowerCase().includes(q))),
				)
				.map((b) => ({ title: b.title, type: "blog" as const, url: `/blog/${b.id}`, priority: 3 }))

			// 4) Certifications
			const certificationResults = (certifications as any[])
				.filter((c) => c.title?.toLowerCase().includes(q) || (c.skills || []).some((s: string) => s.toLowerCase().includes(q)))
				.map((c) => ({ title: c.title, type: "certification" as const, url: `/about#certifications`, priority: 4 }))

			// 5) Special achievements link — always present
			const achievementResults = [
				{
					title: "View All Achievements",
					type: "achievement" as const,
					url: "#",
					priority: 5,
					onClick: () => {
						setAchievementsOpen(true)
						setSearchOpen(false)
					},
				},
			]

			const combined = [
				...projectResults,
				...skillResults,
				...blogResults,
				...certificationResults,
				...achievementResults,
			]
				.sort((a, b) => (a as any).priority - (b as any).priority)
				.map(({ priority, ...item }) => item as any)

			setSearchResults(combined)
		}, 150)

		return () => clearTimeout(timeoutId)
	}, [searchQuery])

	/* =======================================================================
	 * Event handlers
	 * ==================================================================== */

	const handleQuickAction = (action: string) => {
		if (action === "openResume") {
			setResumeOpen(true)
			setActionsOpen(false)
		}
	}

	/* =======================================================================
	 * Render
	 * ==================================================================== */

	return (
		<>
			{/* Modals */}
			<ResumeModal isOpen={resumeOpen} onClose={() => setResumeOpen(false)} />
			<AchievementsPopup isOpen={achievementsOpen} onClose={() => setAchievementsOpen(false)} />

			{/* HEADER */}
			<motion.header
				ref={headerRef}
				initial={{ y: -100 }}
				animate={{ y: 0 }}
				transition={{ duration: 0.5, ease: cubicBezier(0.22, 1, 0.36, 1) }}
				className={cn(
					"fixed top-0 left-0 right-0 z-100 transition-all duration-700 ease-out",
					scrolled
						? "bg-background/95 backdrop-blur-2xl border-b border-border/30 shadow-xl"
						: "bg-transparent/80 backdrop-blur-xl",
				)}
			>
				<nav className="container mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex items-center justify-between h-16">
						{/* LOGO */}
						<Link href="/" className="group relative flex items-center space-x-2 select-none">
							<motion.div
								// Logo background: Primary (#FF6B6B) to Secondary (#9333EA)
								className="relative w-10 h-10 bg-linear-to-br from-primary to-secondary rounded-xl flex items-center justify-center shadow-xl group-hover:shadow-2xl transition-all duration-500"
								whileHover={!prefersReducedMotion ? { scale: 1.05, rotate: 5 } : {}}
								whileTap={!prefersReducedMotion ? { scale: 0.95 } : {}}
							>
								<span className="text-white font-bold text-lg tracking-tight">PP</span>
							</motion.div>
							<motion.span
								// Text Gradient: Primary -> Secondary -> Highlight
								className="font-bold text-xl bg-linear-to-r from-primary via-secondary to-accent bg-clip-text text-transparent hidden sm:block tracking-tight"
								initial={{ x: -20, opacity: 0 }}
								animate={{ x: 0, opacity: 1 }}
								transition={{ delay: 0.2 }}
							>
								Prathamesh Pawar
							</motion.span>
						</Link>

						{/* DESKTOP NAV */}
						<motion.div className="hidden lg:flex items-center space-x-1">
							{navigation.map((item) => {
								const Icon = item.icon
								const isActive = pathname === item.href
								return (
									<div
										key={item.name}
										className="relative"
										onMouseEnter={() => setHoveredItem(item.name)}
										onMouseLeave={() => setHoveredItem(null)}
									>
										<Link
											href={item.href}
											className={cn(
												"relative flex items-center space-x-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 overflow-hidden",
												isActive
													// Active link gradient: Primary -> Secondary
													? "bg-linear-to-r from-primary/90 to-secondary/90 text-white shadow-lg shadow-primary/25 dark:shadow-secondary/25"
													// Hover link style: text-primary and muted background
													: "text-muted-foreground hover:text-primary hover:bg-primary/10 dark:hover:text-primary/80",
											)}
										>
											<Icon
												className={cn(
													"w-4 h-4 transition-transform duration-300",
													isActive ? "text-white" : "text-foreground", // Ensure active icon is white
													hoveredItem === item.name && "scale-110",
												)}
											/>
											<span className={cn(isActive ? "text-white" : "text-foreground")}>{item.name}</span>
											{isActive && (
												<motion.div
													// Subtle pulse glow on active link
													className="pointer-events-none absolute inset-0 rounded-xl bg-linear-to-r from-primary/10 to-secondary/10"
													animate={!prefersReducedMotion ? { scale: [1, 1.05, 1] } : {}}
													transition={{ duration: 2, repeat: Infinity }}
												/>
											)}
										</Link>
									</div>
								)
							})}
						</motion.div>

						{/* RIGHT CONTROLS */}
						<div className="flex items-center space-x-2">
							{/* SEARCH (Inline dropdown under button; all devices) */}
							<div className="relative" ref={searchPanelRef}>
								<Button
									variant="ghost"
									size="sm"
									className={cn(
										"h-10 px-3 flex items-center space-x-1.5 transition-all duration-300",
										// Search button hover/active styles updated to primary theme
										"hover:text-primary dark:hover:text-primary/80 hover:bg-primary/10",
										searchOpen && "ring-2 ring-primary/20",
									)}
									onClick={() => setSearchOpen((v) => !v)}
									aria-expanded={searchOpen}
									aria-controls="global-search-panel"
									aria-haspopup="dialog"
								>
									<Search className="w-4 h-4" />
									<span className="hidden sm:block text-sm">Search</span>
									<kbd
										className="hidden sm:inline-flex h-5 items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-semibold"
										aria-label="Keyboard shortcut"
									>
										<Command className="w-3 h-3" />K
									</kbd>
								</Button>

								<AnimatePresence initial={false}>
									{searchOpen && (
										<motion.div
											id="global-search-panel"
											initial={{ opacity: 0, y: -10 }}
											animate={{ opacity: 1, y: 0 }}
											exit={{ opacity: 0, y: -10 }}
											transition={{ duration: 0.18 }}
											className={cn(
												"absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[90vw] max-w-sm",
												"bg-background border border-border/20 rounded-2xl shadow-2xl z-120 overflow-hidden",
											)}
											role="dialog"
											aria-label="Global search"
										>
											{/* Input row */}
											<div className="p-3 border-b border-border/20">
												<div className="relative">
													<Search
														className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground"
														aria-hidden="true"
													/>
													<input
														type="text"
														placeholder="Search projects, skills, blogs, achievements..."
														value={searchQuery}
														onChange={(e) => setSearchQuery(e.target.value)}
														// Updated focus ring and removed hardcoded border-0
														className="w-full pl-10 pr-3 py-2.5 bg-muted/50 rounded-lg border-0 focus:ring-2 focus:ring-primary/50 text-sm outline-none"
														autoFocus
														aria-autocomplete="list"
														aria-controls="search-results"
														aria-activedescendant=""
													/>
												</div>
											</div>

											{/* Results */}
											<div id="search-results" className="max-h-80 overflow-y-auto">
												{searchResults.length > 0 ? (
													searchResults.slice(0, 8).map((result, i) => (
														<motion.div
															key={`${result.title}-${i}`}
															initial={{ opacity: 0, x: -16 }}
															animate={{ opacity: 1, x: 0 }}
															transition={{ delay: i * 0.04 }}
															className="px-3 py-2.5 hover:bg-muted/50 border-b border-border/10 last:border-b-0"
															role="option"
														>
															{"onClick" in result && typeof result.onClick === "function" ? (
																<button
																	onClick={() => {
																		result.onClick()
																		setSearchQuery("")
																	}}
																	className="flex items-center justify-between w-full text-left"
																>
																	<div className="flex items-center space-x-2">
																		{/* Achievement Badge: Use tertiary color (Highlight/Soft Pink) */}
																		<span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-tertiary/10 text-tertiary dark:text-tertiary/80">
																			{result.type}
																		</span>
																		<span className="text-sm font-medium">{result.title}</span>
																	</div>
																	<ChevronRight className="w-4 h-4 text-muted-foreground" />
																</button>
															) : (
																<Link
																	href={(result as any).url}
																	className="flex items-center justify-between"
																	onClick={() => {
																		setSearchOpen(false)
																		setSearchQuery("")
																	}}
																>
																	<div className="flex items-center space-x-2">
																		<span
																			className={cn(
																				"px-2 py-0.5 rounded-full text-xs font-semibold",
																				// Project: Secondary (Deep Violet)
																				(result as any).type === "project" && "bg-secondary/10 text-secondary dark:text-secondary/80",
																				// Skill: Success Green
																				(result as any).type === "skill" && "bg-status-success/10 text-status-success dark:text-status-success/80",
																				// Blog: Accent (Night Navy)
																				(result as any).type === "blog" && "bg-accent/10 text-accent dark:text-accent/80",
																				// Certification: Primary (Coral)
																				(result as any).type === "certification" && "bg-primary/10 text-primary dark:text-primary/80",
																			)}
																		>
																			{(result as any).type}
																		</span>
																		<span className="text-sm font-medium">{(result as any).title}</span>
																	</div>
																	<ChevronRight className="w-4 h-4 text-muted-foreground" />
																</Link>
															)}
														</motion.div>
													))
												) : searchQuery ? (
													<div className="p-6 text-center text-muted-foreground">
														<Search className="w-10 h-10 mx-auto mb-2 opacity-60" aria-hidden="true" />
														<p className="text-sm">No results for “{searchQuery}”.</p>
													</div>
												) : (
													<div className="p-6 text-center text-muted-foreground">
														<p className="text-sm">Type to search anything across the site.</p>
													</div>
												)}
											</div>
										</motion.div>
									)}
								</AnimatePresence>
							</div>

							{/* QUICK ACTIONS (Desktop) */}
							<div className="relative hidden md:block" ref={actionsRef}>
								<Button
									variant="ghost"
									size="sm"
									className="h-10 px-3 flex items-center space-x-1.5 hover:bg-primary/10 hover:text-primary dark:hover:text-primary/80 transition-all duration-300"
									onClick={() => setActionsOpen((v) => !v)}
									aria-expanded={actionsOpen}
									aria-controls="quick-actions-menu"
									aria-haspopup="menu"
								>
									<Globe className="w-4 h-4" />
									<ChevronDown className={cn("w-3 h-3 transition-transform", actionsOpen && "rotate-180")} />
								</Button>

								<AnimatePresence>
									{actionsOpen && (
										<motion.div
											id="quick-actions-menu"
											initial={{ opacity: 0, y: -10, scale: 0.98 }}
											animate={{ opacity: 1, y: 0, scale: 1 }}
											exit={{ opacity: 0, y: -10, scale: 0.98 }}
											transition={{ duration: 0.18 }}
											className="absolute top-full right-0 mt-2 w-52 bg-background border border-border/20 rounded-2xl shadow-2xl z-110 py-1.5"
											role="menu"
										>
											{quickActions.map((action, i) => {
												const Icon = action.icon
												const onClick =
													"action" in action
														? () => handleQuickAction(action.action)
														: () => window.open((action as any).href, "_blank", "noopener,noreferrer")

												return (
													<motion.button
														key={action.name}
														onClick={onClick}
														// Updated hover styles to match primary theme
														className="flex items-center space-x-2.5 px-3 py-2.5 text-sm font-medium text-muted-foreground hover:text-primary dark:hover:text-primary/80 hover:bg-primary/10 w-full text-left group transition-colors duration-300"
														initial={{ opacity: 0, x: -20 }}
														animate={{ opacity: 1, x: 0 }}
														transition={{ delay: i * 0.05 }}
														role="menuitem"
													>
														<Icon className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
														<span>{action.name}</span>
														{"external" in action && (action as any).external && (
															<ExternalLink className="w-3 h-3 ml-auto opacity-60" aria-hidden="true" />
														)}
													</motion.button>
												)
											})}
										</motion.div>
									)}
								</AnimatePresence>
							</div>

							{/* THEME TOGGLE */}
							<ThemeToggle />

							{/* MOBILE MENU TOGGLE */}
							<Button
								variant="ghost"
								size="sm"
								// Updated hover styles to match primary theme
								className="h-10 w-10 p-0 lg:hidden hover:text-primary dark:hover:text-primary/80 hover:bg-primary/10 transition-colors duration-300"
								onClick={() => setIsOpen((v) => !v)}
								aria-expanded={isOpen}
								aria-controls="mobile-menu"
							>
								{isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
							</Button>
						</div>
					</div>

					{/* MOBILE MENU (scroll-locked when open) */}
					<AnimatePresence>
						{isOpen && (
							<motion.div
								id="mobile-menu"
								initial={{ opacity: 0, height: 0 }}
								animate={{ opacity: 1, height: "auto" }}
								exit={{ opacity: 0, height: 0 }}
								transition={{ type: "spring", stiffness: 120, damping: 18 }}
								className="lg:hidden overflow-hidden"
							>
								<div className="px-4 pb-4 space-y-1 bg-background/80 backdrop-blur-xl border-top border-border/20">
									{navigation.map((item, i) => {
										const Icon = item.icon
										const isActive = pathname === item.href
										return (
											<motion.div
												key={item.name}
												initial={{ opacity: 0, x: -20 }}
												animate={{ opacity: 1, x: 0 }}
												transition={{ delay: i * 0.05 }}
											>
												<Link
													href={item.href}
													className={cn(
														"flex items-center space-x-3 p-3 rounded-xl text-base font-semibold transition-colors duration-300",
														isActive
															// Active link gradient: Primary -> Secondary
															? "bg-linear-to-r from-primary/90 to-secondary/90 text-white shadow-lg shadow-primary/25 dark:shadow-secondary/25"
															// Hover link style: text-primary and muted background
															: "text-muted-foreground hover:text-primary dark:hover:text-primary/80 hover:bg-primary/10",
													)}
													onClick={() => setIsOpen(false)}
												>
													<Icon className="w-5 h-5" />
													<span>{item.name}</span>
												</Link>
											</motion.div>
										)
									})}

									{/* Mobile Quick Actions */}
									<div className="pt-3 space-y-1">
										{/* Resume */}
										<motion.button
											initial={{ opacity: 0, x: -20 }}
											animate={{ opacity: 1, x: 0 }}
											transition={{ delay: 0.35 }}
											onClick={() => {
												setResumeOpen(true)
												setIsOpen(false)
											}}
											// Updated hover styles to match primary theme
											className="flex items-center space-x-3 p-3 text-sm font-medium text-muted-foreground hover:text-primary dark:hover:text-primary/80 hover:bg-primary/10 rounded-xl w-full transition-colors duration-300"
										>
											<Download className="w-4 h-4" />
											<span>Resume</span>
										</motion.button>

										{/* Achievements */}
										<motion.button
											initial={{ opacity: 0, x: -20 }}
											animate={{ opacity: 1, x: 0 }}
											transition={{ delay: 0.4 }}
											onClick={() => {
												setAchievementsOpen(true)
												setIsOpen(false)
											}}
											// Updated hover styles to match primary theme
											className="flex items-center space-x-3 p-3 text-sm font-medium text-muted-foreground hover:text-primary dark:hover:text-primary/80 hover:bg-primary/10 rounded-xl w-full transition-colors duration-300"
										>
											<Award className="w-4 h-4" />
											<span>Achievements</span>
										</motion.button>

										{/* External links (type-narrowed) */}
										{quickActions.slice(1).map((action, idx) => {
											if (!("href" in action)) return null
											const Icon = action.icon
											return (
												<motion.a
													key={action.name}
													href={action.href}
													target="_blank"
													rel="noopener noreferrer"
													// Updated hover styles to match primary theme
													className="flex items-center space-x-3 p-3 text-sm font-medium text-muted-foreground hover:text-primary dark:hover:text-primary/80 hover:bg-primary/10 rounded-xl transition-colors duration-300"
													initial={{ opacity: 0, x: -20 }}
													animate={{ opacity: 1, x: 0 }}
													transition={{ delay: 0.45 + idx * 0.05 }}
													onClick={() => setIsOpen(false)}
												>
													<Icon className="w-4 h-4" />
													<span>{action.name}</span>
													<ExternalLink className="w-3 h-3 ml-auto opacity-60" aria-hidden="true" />
												</motion.a>
											)
										})}
									</div>
								</div>
							</motion.div>
						)}
					</AnimatePresence>
				</nav>
			</motion.header>
		</>
	)
}