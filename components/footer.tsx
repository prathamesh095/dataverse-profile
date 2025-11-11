"use client";

import Link from "next/link";
import {
	Github,
	Linkedin,
	Mail,
	Twitter,
	Globe,
	BookOpen,
	FolderKanban,
	User,
	Award,
	FileText,
	Info,
	ArrowUp,
	ChevronDown,
	ChevronUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";
import Script from "next/script";
import {
	motion,
	AnimatePresence,
	useInView,
	useAnimation,
	cubicBezier,
} from "framer-motion";
import { useEffect, useRef, useState, useCallback } from "react";
// Assuming these components are available in your structure
import { AchievementsPopup } from "@/components/AchievementsPopup";
import { PrivacyModal } from "@/components/PrivacyModal";
import { cn } from "@/lib/utils";


export function Footer() {
	const currentYear = new Date().getFullYear();
	const footerRef = useRef<HTMLDivElement>(null);
	const isInView = useInView(footerRef, { once: true, amount: 0.1 });
	const controls = useAnimation();
	const [showTop, setShowTop] = useState(false);
	const [expanded, setExpanded] = useState<string | null>(null);
	const [achievementsOpen, setAchievementsOpen] = useState(false);
	const [privacyOpen, setPrivacyOpen] = useState(false);

	// --- Animation and Scroll Logic ---
	useEffect(() => {
		if (isInView) controls.start("visible");
	}, [isInView, controls]);

	useEffect(() => {
		const handleScroll = () => setShowTop(window.scrollY > 300);
		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	// --- Mobile Collapse Logic ---
	const handleNavClick = useCallback(() => {
		// Reset expanded state on any navigation click (mobile menu closes)
		setExpanded(null);
	}, []);

	useEffect(() => {
		// Reset expanded state when the viewport hits the desktop breakpoint (md)
		const mediaQuery = window.matchMedia("(min-width: 640px)"); // Tailwind's 'sm' breakpoint
		
		const handleResize = () => {
			// If we are wide enough for the desktop footer, ensure mobile menu is closed (null)
			if (mediaQuery.matches) {
				setExpanded(null);
			}
		};
		
		handleResize(); // Initial check
		mediaQuery.addEventListener('change', handleResize);
		return () => mediaQuery.removeEventListener('change', handleResize);
	}, []);
	// -----------------------------

	const sectionVariants = {
		hidden: { opacity: 0, y: 30 },
		visible: (i: number) => ({
			opacity: 1,
			y: 0,
			transition: {
				delay: i * 0.15,
				duration: 0.6,
				ease: cubicBezier(0.22, 1, 0.36, 1),
			},
		}),
	};

	const structuredData = {
		"@context": "https://schema.org",
		"@type": "Person",
		name: "Prathamesh Sanjay Pawar",
		jobTitle: "Data Analyst & Scientist",
		url: "https://yourdomain.com",
		sameAs: [
			"https://github.com/prathamesh095",
			"https://www.linkedin.com/in/prathamesh095/",
			"https://x.com/prathamesh095",
			"https://www.kaggle.com/prathamesh095",
		],
		email: "mailto:pawar.prathamesh@outlook.com",
		description:
			"Data Analyst & Scientist passionate about turning data into actionable insights through storytelling, visualization, and machine learning.",
	};

	type NavItem = {
		href?: string;
		label: string;
		Icon: LucideIcon;
		external?: boolean;
		onClick?: () => void;
	};

	const quickLinks: NavItem[] = [
		{ href: "/projects", label: "Projects", Icon: FolderKanban },
		{
			label: "Achievements",
			Icon: Award,
			onClick: () => { setAchievementsOpen(true); handleNavClick(); }, // Call handleNavClick to close mobile menu
		},
		{ href: "/blog", label: "Blog", Icon: BookOpen },
		{ href: "/about", label: "About", Icon: User },
	];

	const resources: NavItem[] = [
		{ href: "/contact", label: "Contact", Icon: Mail },
		{
			href: "/resume/Prathamesh Pawar CV.pdf",
			label: "Resume",
			Icon: FileText,
			external: true,
		},
		{
			label: "Privacy & Terms",
			Icon: Info,
			onClick: () => { setPrivacyOpen(true); handleNavClick(); }, // Call handleNavClick to close mobile menu
		},
	];

	const socials: NavItem[] = [
		{
			href: "https://github.com/prathamesh095",
			label: "GitHub",
			Icon: Github,
			external: true,
		},
		{
			href: "https://www.linkedin.com/in/prathamesh095/",
			label: "LinkedIn",
			Icon: Linkedin,
			external: true,
		},
		{
			href: "https://x.com/prathamesh095",
			label: "Twitter",
			Icon: Twitter,
			external: true,
		},
		{
			href: "https://www.kaggle.com/prathamesh095",
			label: "Kaggle",
			Icon: Globe,
			external: true,
		},
	];

	// --- Hover + Active Color Feedback ---
	const renderNavItem = ({ href, label, Icon, external, onClick }: NavItem) => {
		// Base class uses theme primary color for hover effects
		const baseClass = `
			flex items-center gap-2 rounded text-sm
			text-muted-foreground
			hover:text-primary dark:hover:text-primary/80
			transition-all duration-300 ease-out
			focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50
			active:text-primary dark:active:text-primary/90
		`;

		if (onClick) {
			return (
				<button onClick={onClick} className={baseClass} aria-label={label}>
					<Icon className="w-4 h-4 transition-colors duration-300" />
					{label}
				</button>
			);
		}

		if (external) {
			return (
				<a
					href={href!}
					target="_blank"
					rel="noopener noreferrer me"
					className={baseClass}
					aria-label={`Visit ${label}`}
					onClick={handleNavClick} // Added click handler to close mobile menu
					{...(label === "Resume" ? { download: true } : {})}
				>
					<Icon className="w-4 h-4 transition-colors duration-300" />
					{label}
				</a>
			);
		}

		return (
			<Link href={href!} className={baseClass} aria-label={label} onClick={handleNavClick}> {/* Added click handler to close mobile menu */}
				<Icon className="w-4 h-4 transition-colors duration-300" />
				{label}
			</Link>
		);
	};

	const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });
	const MotionButton = motion(Button);

	return (
		<>
			<Script
				id="structured-data-person"
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
			/>

			<AchievementsPopup
				isOpen={achievementsOpen}
				onClose={() => setAchievementsOpen(false)}
			/>
			<PrivacyModal
				isOpen={privacyOpen}
				onClose={() => setPrivacyOpen(false)}
			/>

			<footer
				// Using glassmorphism for the footer background
				className="backdrop-blur-2xl glassmorphism border-t border-border"
				ref={footerRef}
			>
				<div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
					{/* ---------- DESKTOP GRID ---------- */}
					<motion.div
						className="hidden sm:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10"
						variants={sectionVariants}
						initial="hidden"
						animate={controls}
					>
						{[
							/* Brand */
							<div className="space-y-4" key="brand">
								<div className="flex items-center gap-3">
									<div 
										// Logo background: Use custom gradient for prominence
										className="w-10 h-10 bg-linear-to-br from-primary to-secondary rounded-lg flex items-center justify-center shadow-md overflow-hidden"
									>
										<motion.span
											className="text-white font-bold text-sm"
											animate={{ rotate: [0, 360] }}
											transition={{
												duration: 20,
												repeat: Infinity,
												ease: "linear",
											}}
										>
											PP
										</motion.span>
									</div>
									<span className="font-semibold text-lg tracking-tight text-foreground">
										Prathamesh Pawar
									</span>
								</div>
								<p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
									Data Analyst & Scientist passionate about turning data into
									actionable insights through storytelling, visualization, and
									machine learning.
								</p>
							</div>,

							/* Quick Links */
							<nav key="quick">
								<h3 className="font-semibold mb-4 text-foreground">
									Quick Links
								</h3>
								<ul className="space-y-3">
									{quickLinks.map((item, i) => (
										<li key={i}>{renderNavItem(item)}</li>
									))}
								</ul>
							</nav>,

							/* Resources */
							<nav key="resources">
								<h3 className="font-semibold mb-4 text-foreground">
									Resources
								</h3>
								<ul className="space-y-3">
									{resources.map((item, i) => (
										<li key={i}>{renderNavItem(item)}</li>
									))}
								</ul>
							</nav>,

							/* Connect */
							<div key="connect">
								<h3 className="font-semibold mb-4 text-foreground">Connect</h3>
								<div className="flex flex-wrap gap-2 mb-4">
									{socials.map((s, i) => (
										<motion.a
											key={i}
											href={s.href}
											target="_blank"
											rel="noopener noreferrer me"
											// Social hover styles updated to theme colors
											className="rounded-full p-2 hover:bg-primary/10 border border-border/50 text-muted-foreground hover:text-primary transition-colors duration-300"
											whileHover={{ scale: 1.1 }}
											whileTap={{ scale: 0.95 }}
											aria-label={`Visit ${s.label}`}
										>
											<s.Icon className="w-4 h-4 transition-colors duration-300" />
										</motion.a>
									))}
								</div>
								<p className="text-sm text-muted-foreground flex items-center gap-1">
									<Mail className="w-3.5 h-3.5" />
									<a
										href="mailto:pawar.prathamesh@outlook.com"
										className="hover:underline hover:text-primary transition-colors duration-300"
									>
										pawar.prathamesh@outlook.com
									</a>
								</p>
							</div>,
						].map((child, i) => (
							<motion.div
								key={i}
								variants={sectionVariants}
								custom={i}
								initial="hidden"
								whileInView="visible"
								viewport={{ once: true, amount: 0.2 }}
							>
								{child}
							</motion.div>
						))}
					</motion.div>

					{/* ---------- MOBILE ---------- */}
					<div className="sm:hidden space-y-4">
						{/* Brand */}
						<motion.div
							initial="hidden"
							whileInView="visible"
							viewport={{ once: true, amount: 0.3 }}
							variants={sectionVariants}
							custom={0}
						>
							<div className="flex items-center gap-3">
								<div 
									// Logo background: Use custom gradient for prominence
									className="w-10 h-10 bg-linear-to-br from-primary to-secondary rounded-lg flex items-center justify-center shadow-md overflow-hidden"
								>
									<motion.span
										className="text-white font-bold text-sm"
										animate={{ rotate: [0, 360] }}
										transition={{
											duration: 20,
											repeat: Infinity,
											ease: "linear",
										}}
									>
										PP
									</motion.span>
								</div>
								<span className="font-semibold text-lg tracking-tight text-foreground">
									Prathamesh Pawar
								</span>
							</div>
							<p className="text-muted-foreground text-sm leading-relaxed mt-2">
								Data Analyst & Scientist passionate about turning data into
								actionable insights through storytelling, visualization, and
								machine learning.
							</p>
						</motion.div>

						{/* Collapsible Sections */}
						{[
							{ title: "Quick Links", items: quickLinks },
							{ title: "Resources", items: resources },
							{ title: "Connect", items: socials, isSocial: true }, // Added isSocial flag
						].map((section, i) => (
							<motion.div
								key={i}
								initial="hidden"
								whileInView="visible"
								viewport={{ once: true, amount: 0.2 }}
								variants={sectionVariants}
								custom={i + 1}
								className="border-b border-border/60 pb-3"
							>
								<button
									onClick={() =>
										setExpanded(
											expanded === section.title ? null : section.title
										)
									}
									className={`
										flex w-full justify-between items-center text-left font-medium py-2
										transition-colors duration-300 ease-out
										text-foreground hover:text-primary dark:hover:text-primary/80
										${
											expanded === section.title
												? "text-primary dark:text-primary/80"
												: ""
										}
									`}
									aria-expanded={expanded === section.title}
									aria-controls={`footer-collapse-${section.title.replace(/\s/g, "-")}`}
								>
									{section.title}
									{expanded === section.title ? (
										<ChevronUp className="w-5 h-5 text-muted-foreground transition-transform" />
									) : (
										<ChevronDown className="w-5 h-5 text-muted-foreground transition-transform" />
									)}
								</button>

								<AnimatePresence initial={false}>
									{expanded === section.title && (
										<motion.ul
											id={`footer-collapse-${section.title.replace(/\s/g, "-")}`}
											initial={{ height: 0, opacity: 0 }}
											animate={{ height: "auto", opacity: 1 }}
											exit={{ height: 0, opacity: 0 }}
											transition={{ duration: 0.3 }}
											className="space-y-2 pl-2 mt-2 overflow-hidden"
										>
											{section.isSocial ? (
												<li className="flex flex-wrap gap-4 py-1">
													{socials.map((social, i) => (
														<motion.a
															key={i}
															href={social.href}
															target="_blank"
															rel="noopener noreferrer me"
															// Social hover styles updated to theme colors
															className="rounded-full p-2 bg-primary/10 border border-border/50 text-muted-foreground hover:text-primary transition-colors duration-300"
															whileHover={{ scale: 1.1 }}
															whileTap={{ scale: 0.95 }}
															onClick={handleNavClick} // Close menu on click
															aria-label={`Visit ${social.label}`}
														>
															<social.Icon className="w-5 h-5 transition-colors duration-300" />
														</motion.a>
													))}
												</li>
											) : (
												section.items.map((item, k) => (
													<li key={k} className="py-1">
														{renderNavItem(item)}
													</li>
												))
											)}
										</motion.ul>
									)}
								</AnimatePresence>
							</motion.div>
						))}

						{/* Direct Email Link in Mobile Connect Section */}
						<motion.div
								initial="hidden"
								whileInView="visible"
								viewport={{ once: true, amount: 0.3 }}
								variants={sectionVariants}
								custom={4}
								className="pt-4"
							>
							<p className="text-sm text-muted-foreground flex items-center gap-1">
								<Mail className="w-3.5 h-3.5" />
								<a
									href="mailto:pawar.prathamesh@outlook.com"
									className="hover:underline hover:text-primary transition-colors duration-300"
									onClick={handleNavClick} // Close menu on click
								>
									pawar.prathamesh@outlook.com
								</a>
							</p>
						</motion.div>
					</div>

					{/* ---------- FOOTER BOTTOM ---------- */}
					<motion.div
						className="border-t border-border mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center text-center sm:text-left text-sm text-muted-foreground"
						initial="hidden"
						whileInView="visible"
						viewport={{ once: true, amount: 0.3 }}
						variants={sectionVariants}
						custom={5} // Changed custom index to 5 to follow mobile sections
					>
						<p>
							© {currentYear}{" "}
							<span className="font-medium">Prathamesh Sanjay Pawar</span>. All
							rights reserved.
						</p>
						<p className="mt-2 sm:mt-0">
							Crafted with data-driven curiosity & machine learning passion.
						</p>
					</motion.div>

					{/* Back to Top */}
					<motion.div
						className="fixed bottom-6 right-6 z-50"
						initial={{ opacity: 0, scale: 0 }}
						animate={{
							opacity: showTop ? 1 : 0,
							scale: showTop ? 1 : 0,
						}}
						transition={{ duration: 0.3 }}
					>
						<MotionButton
							variant="outline"
							size="sm"
							onClick={scrollToTop}
							className="
								rounded-full p-3 shadow-lg hover:shadow-xl
								transition-all duration-300 ease-out
								text-foreground hover:text-primary dark:hover:text-primary/80
								hover:border-primary hover:bg-primary/10
							"
							whileHover={{ scale: 1.1 }}
							whileTap={{ scale: 0.95 }}
							aria-label="Scroll to top"
						>
							<ArrowUp className="w-4 h-4 transition-colors duration-300" />
						</MotionButton>
					</motion.div>
				</div>
			</footer>
		</>
	);
}