"use client"

import { useState, useMemo, useEffect, useCallback, useDeferredValue, memo } from "react"
import Image from "next/image"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { motion, AnimatePresence } from "framer-motion"
import { skillCategories, Skill, SkillCategory } from "@/lib/skills"
import { Search, TrendingUp, Award, Zap, Filter, Grid3X3, List } from "lucide-react"
import { cn } from "@/lib/utils"

// Extend Skill interface to include certifications
interface ExtendedSkill extends Skill {
	certifications?: number
}

// Debounce hook
function useDebounce<T>(value: T, delay: number): T {
	const [debouncedValue, setDebouncedValue] = useState(value)
	useEffect(() => {
		const handler = setTimeout(() => setDebouncedValue(value), delay)
		return () => clearTimeout(handler)
	}, [value, delay])
	return debouncedValue
}

const StatsCard = memo(
	({
		label,
		value,
		icon: Icon,
		premium = false,
	}: {
		label: string
		value: string | number
		icon: React.ComponentType<{ className?: string }>
		premium?: boolean
	}) => (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true }}
			transition={{ type: "spring", stiffness: 320, damping: 26 }}
			className="group relative"
			whileHover={{ y: -6 }}
		>
			<Card 
				// Using theme colors and glassmorphism class
				className="relative overflow-hidden glassmorphism rounded-3xl p-6 transition-all duration-500 hover:shadow-2xl border border-border/40"
			>
				{/* OUTER GLOW BORDER – visible on hover (Using Secondary/Primary Theme Colors) */}
				<motion.div
					className="absolute -inset-px rounded-3xl bg-linear-to-r from-secondary/30 via-primary/20 to-secondary/30 opacity-0 blur-xl pointer-events-none"
					whileHover={{ opacity: 1 }}
					transition={{ duration: 0.5 }}
				/>
				
				{/* INNER FROSTED BORDER - Relying on .card styles and inner glow div */}
				
				{/* PREMIUM TOP ACCENT BORDER (Using Primary Theme Color) */}
				{premium && (
					<motion.div 
						className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-primary/80 to-transparent" 
						initial={{ scaleX: 0 }}
						whileHover={{ scaleX: 1 }}
						transition={{ duration: 0.7, ease: "easeOut" }}
					/>
				)}
				
				{/* Soft inner glow - Theme colors */}
				<div className="absolute inset-0 rounded-3xl bg-linear-to-br from-primary/10 via-transparent to-primary/5 dark:from-primary/5 pointer-events-none" />

				<div className="relative flex items-center justify-between gap-4">
					<div className="space-y-1">
						<p className="text-xs font-medium uppercase tracking-widest text-muted-foreground/80">{label}</p>
						<motion.p
							className={cn(
								"text-4xl font-bold tracking-tight text-foreground", // Removed font-cal
								premium &&
									// Premium stat text uses theme primary gradient
									"bg-clip-text text-transparent bg-linear-to-r from-primary to-secondary dark:from-primary/80 dark:to-secondary/80"
							)}
							whileHover={{ scale: 1.06 }}
							transition={{ duration: 0.25 }}
						>
							{value}
						</motion.p>
					</div>

					{/* GLASS PILL ICON (Using Primary/Secondary Theme Colors) */}
					<motion.div
						className="relative p-4 rounded-full bg-surface-level-1/70 backdrop-blur-md shadow-2xl shadow-black/20 ring-2 ring-primary/40 dark:ring-primary/30 group-hover:ring-secondary/60 transition duration-300"
						whileHover={{ scale: 1.25, rotate: 15 }}
					>
						{/* Inner glow uses primary/secondary theme colors */}
						<motion.div className="absolute inset-0 rounded-full bg-linear-to-br from-primary/40 to-secondary/30 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-600" />
						<Icon className="w-7 h-7 text-primary relative z-10" />
					</motion.div>
				</div>

				{/* BOTTOM GLOW LINE – expands on hover (Using Secondary Theme Color) */}
				<motion.div
					className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-px bg-linear-to-r from-transparent via-secondary/70 to-transparent"
					whileHover={{ width: "80%" }}
					transition={{ duration: 0.7, ease: "easeOut" }}
				/>
			</Card>
		</motion.div>
	)
)

StatsCard.displayName = "StatsCard"

// ------------------- SkillCard (Grid View) -------------------

const SkillCard = memo(
	({
		skill,
		getProficiencyColor,
		getProficiencyLabel,
		getCategoryColor,
	}: {
		skill: ExtendedSkill
		getProficiencyColor: (level: number) => string
		getProficiencyLabel: (level: number) => string
		getCategoryColor: (categoryId: string) => string
	}) => {
		const category = useMemo(
			() => skillCategories.find((cat: SkillCategory) => cat.id === skill.category),
			[skill.category]
		)
		const certifications = skill.certifications ?? 0

		return (
			<motion.div
				layout
				initial={{ opacity: 0, scale: 0.95, y: 20 }}
				animate={{ opacity: 1, scale: 1, y: 0 }}
				exit={{ opacity: 0, scale: 0.95, y: -20 }}
				transition={{ duration: 0.3, ease: "easeOut" }}
				whileHover={{ y: -4 }}
				className="group"
			>
				<Card 
					// Theme borders, background, and hover effects
					className="h-full hover:shadow-xl transition-all duration-300 border border-primary/20 bg-card/60 backdrop-blur-sm hover:bg-card/90 overflow-hidden"
				>
					<CardHeader className="pb-4">
						<div className="flex items-start justify-between gap-4">
							{/* Skill logo (new) */}
							{skill.logo && (
								<div 
									// Theme borders and background
									className="relative w-10 h-10 rounded-md overflow-hidden border border-primary/30 bg-white/40 dark:bg-card/40 flex items-center justify-center shrink-0"
								>
									<Image
										src={skill.logo}
										alt={`${skill.name} logo`}
										fill
										className="object-contain p-1.5 transition-transform duration-300 group-hover:scale-110"
										sizes="40px"
									/>
								</div>
							)}

							{/* Skill title + info */}
							<div className="flex-1">
								<CardTitle 
									// Theme hover text color
									className="text-lg text-foreground leading-tight group-hover:text-primary transition-colors"
								>
									{skill.name}
								</CardTitle>
								<CardDescription className="text-xs mt-1 flex flex-wrap items-center gap-2">
									<span>{skill.yearsOfExperience}+ years</span>
									<span>• {skill.lastUsed}</span>
									<span 
										// Theme primary color
										className="text-primary font-medium"
									>
										{category?.title.split(" ")[0] || skill.category}
									</span>
								</CardDescription>
							</div>

							{/* Proficiency Badge */}
							<Badge
								variant="secondary"
								// Proficiency badge colors are set dynamically by functions, so we need to ensure the classes used in those functions map correctly to the theme colors.
								// We modify the default classes here to use general theme structure or rely on the function output.
								className={cn(
									"text-xs font-semibold whitespace-nowrap shrink-0 border",
									// The color functions below need to output TW-compatible classes based on theme, NOT hardcoded colors.
									skill.level >= 90
										? "bg-primary/10 text-primary border-primary/30"
										: skill.level >= 80
										? "bg-secondary/10 text-secondary border-secondary/30"
										: skill.level >= 70
										? "bg-tertiary/10 text-tertiary border-tertiary/30"
										: "bg-status-success/10 text-status-success border-status-success/30"
								)}
							>
								{getProficiencyLabel(skill.level)}
							</Badge>
						</div>
					</CardHeader>

					<CardContent className="space-y-4 pt-0">
						{/* Progress Bar */}
						<div className="space-y-2">
							<div className="flex items-center justify-between text-xs">
								<span className="font-medium text-muted-foreground">Proficiency</span>
								<span className="font-bold text-foreground">{skill.level}%</span>
							</div>
							<div className="h-2 bg-muted rounded-full overflow-hidden">
								<motion.div
									initial={{ width: 0 }}
									animate={{ width: `${skill.level}%` }}
									transition={{ duration: 1, ease: "easeOut" }}
									className={cn(
										"h-full bg-linear-to-r rounded-full transition-all duration-700",
										getProficiencyColor(skill.level)
									)}
								/>
							</div>
						</div>

						{/* Projects + Certifications */}
						<div className="grid grid-cols-2 gap-3">
							<div 
								// Theme borders and background
								className="bg-muted/50 rounded-lg p-3 text-center border border-primary/10 group-hover:bg-muted/70 transition"
							>
								<p className="text-xs text-muted-foreground font-medium">Projects</p>
								<p className="text-lg font-bold text-foreground mt-1">{skill.projects}</p>
							</div>
							<div 
								// Theme borders and background
								className="bg-muted/50 rounded-lg p-3 text-center border border-primary/10 group-hover:bg-muted/70 transition"
							>
								<p className="text-xs text-muted-foreground font-medium">Certifications</p>
								<p className="text-lg font-bold text-foreground mt-1">{certifications}</p>
							</div>
						</div>

						{/* Category Badge */}
						<Badge
							variant="outline"
							className={cn(
								"w-full justify-center border-primary/30 text-primary",
								getCategoryColor(skill.category)
							)}
						>
							{category?.icon && <category.icon className="w-3 h-3 mr-1" aria-hidden="true" />}
							{category?.title.split(" ")[0] || skill.category}
						</Badge>
					</CardContent>
				</Card>
			</motion.div>
		)
	}
)
SkillCard.displayName = "SkillCard"

// ------------------- SkillListRow (List View) -------------------

const SkillListRow = memo(
    ({
        skill,
        getProficiencyLabel,
    }: {
        skill: ExtendedSkill
        getProficiencyLabel: (level: number) => string
    }) => {
        const category = useMemo(
            () => skillCategories.find((cat: SkillCategory) => cat.id === skill.category),
            [skill.category]
        )
        const certifications = skill.certifications ?? 0

        return (
            <motion.div
                layout
                // *** ANIMATION MATCHING projects-grid.tsx LIST VIEW ***
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                // ***************************************************
                className="group"
            >
                <Card className="hover:shadow-xl transition-all duration-300 border border-primary/20 bg-card/60 backdrop-blur-sm hover:bg-card/90">
                    <div className="flex gap-4 p-4 sm:p-6 items-center justify-between">
                        {/* Title and Info */}
                        <div className="flex items-center gap-4 flex-1 min-w-0">
                            {skill.logo && (
                                <div 
                                    className="relative w-8 h-8 sm:w-10 sm:h-10 rounded-md overflow-hidden border border-primary/30 bg-white/40 dark:bg-card/40 flex items-center justify-center shrink-0"
                                >
                                    <Image
                                        src={skill.logo}
                                        alt={`${skill.name} logo`}
                                        fill
                                        className="object-contain p-1 transition-transform duration-300 group-hover:scale-110"
                                        sizes="40px"
                                    />
                                </div>
                            )}
                            <div className="min-w-0">
                                <CardTitle 
                                    className="text-base sm:text-lg text-foreground leading-tight truncate group-hover:text-primary transition-colors"
                                >
                                    {skill.name}
                                </CardTitle>
                                <CardDescription className="text-xs sm:text-sm mt-0.5 flex flex-wrap items-center gap-x-2">
                                    <span className="text-primary font-medium">{category?.title.split(" ")[0] || skill.category}</span>
                                    <span className="hidden sm:inline">•</span>
                                    <span className="hidden sm:inline">{skill.yearsOfExperience}+ years</span>
                                    <span className="hidden sm:inline">•</span>
                                    <span className="hidden sm:inline">Last used: {skill.lastUsed}</span>
                                </CardDescription>
                            </div>
                        </div>

                        {/* Stats */}
                        <div className="flex items-center gap-4 sm:gap-6 shrink-0">
                            <div className="text-center hidden sm:block">
                                <p className="text-xs text-muted-foreground font-medium">Projects</p>
                                <p className="text-base font-bold text-foreground mt-0.5">{skill.projects}</p>
                            </div>
                            <div className="text-center hidden sm:block">
                                <p className="text-xs text-muted-foreground font-medium">Certs</p>
                                <p className="text-base font-bold text-foreground mt-0.5">{certifications}</p>
                            </div>
                            
                            {/* Proficiency Badge */}
                            <Badge
                                variant="secondary"
                                className={cn(
                                    "text-xs font-semibold whitespace-nowrap shrink-0 border",
                                    skill.level >= 90
                                        ? "bg-primary/10 text-primary border-primary/30"
                                        : skill.level >= 80
                                        ? "bg-secondary/10 text-secondary border-secondary/30"
                                        : skill.level >= 70
                                        ? "bg-tertiary/10 text-tertiary border-tertiary/30"
                                        : "bg-status-success/10 text-status-success border-status-success/30"
                                )}
                            >
                                {getProficiencyLabel(skill.level)} ({skill.level}%)
                            </Badge>
                        </div>
                    </div>
                </Card>
            </motion.div>
        )
    }
)
SkillListRow.displayName = "SkillListRow"

// Controls
const Controls = memo(({ 
	selectedCategory, setSelectedCategory, searchQuery, setSearchQuery, sortBy, setSortBy,
	allSkillsWithCategory, skillCategories, viewMode, setViewMode
}: {
	selectedCategory: string
	setSelectedCategory: (cat: string) => void
	searchQuery: string
	setSearchQuery: (q: string) => void
	sortBy: "level" | "projects" | "certifications"
	setSortBy: (s: typeof sortBy) => void
	allSkillsWithCategory: ExtendedSkill[]
	skillCategories: SkillCategory[]
	viewMode: "grid" | "list"
	setViewMode: (v: "grid" | "list") => void
}) => {
	const debouncedSearchQuery = useDebounce(searchQuery, 300)

	return (
		<div className="flex flex-col lg:flex-row gap-4 items-end justify-between">
			{/* Filters and Sort */}
			<div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-4 flex-1 w-full lg:w-auto">
				<div className="flex-1">
					<label htmlFor="category-select" className="sr-only">Select category</label>
					<Select value={selectedCategory} onValueChange={setSelectedCategory}>
						<SelectTrigger 
							id="category-select" 
							// Theme borders and background
							className="bg-muted/80 backdrop-blur-sm border border-primary/30"
						>
							<SelectValue placeholder="Select category" />
						</SelectTrigger>
						<SelectContent className="max-h-96 overflow-y-auto">
							<SelectItem value="all">
								<div className="flex items-center gap-2">
									{/* Gradient indicator for "All" item */}
									<div className="w-4 h-4 bg-linear-to-br from-primary to-secondary rounded" />
									All Skills ({allSkillsWithCategory.length})
								</div>
							</SelectItem>
							{skillCategories.map((category) => (
								<SelectItem key={category.id} value={category.id}>
									<div className="flex items-center gap-2">
										{/* Theme primary color for icon */}
										<category.icon className="w-4 h-4 text-primary" aria-hidden="true" />
										{category.title} ({category.skills.length})
									</div>
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>

				<div className="flex-1 relative">
					<label htmlFor="search-input" className="sr-only">Search skills</label>
					{/* Theme primary color for icon */}
					<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" aria-hidden="true" />
					<Input
						id="search-input"
						placeholder="Search skills..."
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						// Theme borders and background
						className="pl-10 bg-muted/80 backdrop-blur-sm border border-primary/30 placeholder:text-muted-foreground/60"
					/>
				</div>

				<div className="flex gap-2" role="group" aria-label="Sort by">
					{(["level", "projects", "certifications"] as const).map((sort) => (
						<button
							key={sort}
							type="button"
							onClick={() => setSortBy(sort)}
							className={cn(
								"flex-1 px-3 py-2 rounded-lg font-medium text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
								sortBy === sort
									// Active state uses theme gradient
									? "bg-linear-to-r from-primary to-secondary text-white shadow-md"
									// Inactive state uses muted background and primary outline/text
									: "bg-muted/80 backdrop-blur-sm text-primary border border-primary/30 hover:bg-primary/10",
							)}
							aria-pressed={sortBy === sort}
							aria-label={`Sort by ${sort.charAt(0).toUpperCase() + sort.slice(1)}`}
						>
							{sort.charAt(0).toUpperCase() + sort.slice(1)}
						</button>
					))}
				</div>
			</div>

			{/* GRID / LIST TOGGLE */}
			<div className="flex bg-muted/50 rounded-lg p-1 shadow-inner w-full lg:w-auto">
				<button
					onClick={() => setViewMode("grid")}
					className={cn(
						"flex-1 lg:flex-none px-4 py-2 rounded-md flex items-center justify-center gap-2 transition-all",
						viewMode === "grid" ? "bg-background shadow-md text-primary" : "text-muted-foreground"
					)}
					aria-label="Grid view"
				>
					<Grid3X3 className="w-4 h-4" /> 
					<span className="lg:hidden">Grid</span>
				</button>
				<button
					onClick={() => setViewMode("list")}
					className={cn(
						"flex-1 lg:flex-none px-4 py-2 rounded-md flex items-center justify-center gap-2 transition-all",
						viewMode === "list" ? "bg-background shadow-md text-primary" : "text-muted-foreground"
					)}
					aria-label="List view"
				>
					<List className="w-4 h-4" /> 
					<span className="lg:hidden">List</span>
				</button>
			</div>
		</div>
	)
})
Controls.displayName = "Controls"

export function SkillsMatrix() {
	const [searchQuery, setSearchQuery] = useState("")
	const [selectedCategory, setSelectedCategory] = useState("all")
	const [sortBy, setSortBy] = useState<"level" | "projects" | "certifications">("level")
	const [maxSkills, setMaxSkills] = useState(12)
	const [viewMode, setViewMode] = useState<"grid" | "list">("grid") // NEW STATE

	const debouncedSearchQuery = useDebounce(searchQuery, 300)
	const deferredSearchQuery = useDeferredValue(debouncedSearchQuery)

	useEffect(() => {
		const resizeObserver = new ResizeObserver((entries) => {
			const width = entries[0]?.contentRect.width || window.innerWidth
			// Max skills calculation can be adjusted based on viewMode if needed, 
			// but for now, we'll keep it simple for the layout change.
			setMaxSkills(width >= 1024 ? 12 : width >= 768 ? 8 : 6)
		})
		resizeObserver.observe(document.body)
		return () => resizeObserver.disconnect()
	}, [])

	const allSkillsWithCategory = useMemo(() => 
		skillCategories.flatMap((cat: SkillCategory) =>
			cat.skills.map((skill: Skill) => ({
				...skill,
				category: cat.id
			})) as ExtendedSkill[]
		), 
	[skillCategories])

	if (allSkillsWithCategory.length === 0) {
		return (
			<div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
				<div className="max-w-7xl mx-auto text-center">
					<p className="text-muted-foreground" role="alert">No skills available. Please check the data source.</p>
				</div>
			</div>
		)
	}

	const stats = useMemo(() => {
		const baseSkills = selectedCategory === "all" ? allSkillsWithCategory : 
						   allSkillsWithCategory.filter(s => s.category === selectedCategory)
		
		const skills = deferredSearchQuery 
			? baseSkills.filter(s => s.name.toLowerCase().includes(deferredSearchQuery.toLowerCase()))
			: baseSkills

		const avgLevel = skills.length ? Math.round(skills.reduce((sum, s) => sum + s.level, 0) / skills.length) : 0
		const totalProjects = skills.reduce((sum, s) => sum + s.projects, 0)
		const totalCertifications = skills.reduce((sum, s) => sum + (s.certifications ?? 0), 0)
		const expertSkills = skills.filter((s) => s.level >= 90).length

		return { 
			avgLevel, 
			totalProjects, 
			totalCertifications, 
			expertSkills, 
			totalSkills: baseSkills.length,
			displayedSkills: skills.length 
		}
	}, [allSkillsWithCategory, selectedCategory, deferredSearchQuery])

	const filteredSkills = useMemo(() => {
		let skills = selectedCategory === "all" ? allSkillsWithCategory : 
					   allSkillsWithCategory.filter(s => s.category === selectedCategory)

		if (deferredSearchQuery) {
			skills = skills.filter((skill) => 
				skill.name.toLowerCase().includes(deferredSearchQuery.toLowerCase())
			)
		}

		skills = [...skills].sort((a, b) => {
			switch (sortBy) {
				case "projects": return b.projects - a.projects
				case "certifications": return (b.certifications ?? 0) - (a.certifications ?? 0)
				case "level": default: return b.level - a.level
			}
		})

		return skills.slice(0, maxSkills)
	}, [allSkillsWithCategory, deferredSearchQuery, selectedCategory, sortBy, maxSkills])

	const currentCategory = useMemo(() => {
		if (selectedCategory === "all") {
			return {
				id: "all",
				title: "All Skills",
				description: "Comprehensive view of all technical expertise across all domains",
				// Theme gradient applied here
				color: "bg-linear-to-r from-primary to-secondary",
				icon: Filter
			} as const
		}
		// Assuming skillCategories items have a 'color' property that returns a Tailwind gradient class string
		return skillCategories.find((cat: SkillCategory) => cat.id === selectedCategory) || {
			id: selectedCategory,
			title: selectedCategory,
			description: "",
			color: "bg-linear-to-r from-primary to-secondary",
			icon: Filter
		}
	}, [selectedCategory])

	// Maps proficiency level to a theme-compliant gradient for the progress bar
	const getProficiencyColor = useCallback((level: number): string => {
		if (level >= 90) return "from-primary to-secondary" // Coral to Violet
		if (level >= 80) return "from-status-info to-secondary" // Blue to Violet
		if (level >= 70) return "from-secondary to-tertiary" // Violet to Pink
		return "from-tertiary to-status-warning" // Pink to Amber
	}, [])

	const getProficiencyLabel = useCallback((level: number): string => {
		if (level >= 90) return "Expert"
		if (level >= 80) return "Advanced"
		if (level >= 70) return "Intermediate"
		return "Beginner"
	}, [])

	// Maps category to a theme-compliant gradient for the category badge background
	const getCategoryColor = useCallback((categoryId: string): string => {
		const category = skillCategories.find((cat: SkillCategory) => cat.id === categoryId)
		// We can't rely on `category.color` being a full Tailwind gradient string,
		// so we'll enforce a theme gradient for consistent styling if the data structure doesn't provide a custom class.
		return "bg-linear-to-r from-primary/10 to-secondary/10"
	}, [skillCategories])

	return (
		<div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8" role="main" aria-label="Skills Matrix">
			<div className="max-w-7xl mx-auto space-y-12">
				<motion.section
					initial={{ opacity: 0, y: -20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.6 }}
					className="text-center space-y-4"
				>
					{/* Theme primary badge with border */}
					<div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
						<Zap className="w-4 h-4 text-primary" aria-hidden="true" />
						<span className="text-sm font-medium text-primary">Professional Skills</span>
					</div>
					<h1 className="text-4xl md:text-5xl font-bold text-foreground">Technical Skills Matrix</h1>
					<p className="text-lg text-muted-foreground max-w-2xl mx-auto">
						Comprehensive overview of expertise across multiple domains with proficiency levels, project experience, and
						professional certifications.
					</p>
				</motion.section>

				<motion.section
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.6, delay: 0.1 }}
					className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
					aria-label="Skills Statistics"
				>
					{[
						// Stats Card definitions using theme colors
						{ label: "Avg Proficiency", value: `${stats.avgLevel}%`, icon: TrendingUp, color: "from-status-info/10 to-secondary/10" },
						{ label: "Total Projects", value: stats.totalProjects, icon: Award, color: "from-primary/10 to-tertiary/10" },
						{ label: "Expert Skills", value: stats.expertSkills, icon: Zap, color: "from-secondary/10 to-accent/10" },
						{ label: "Skills Displayed", value: stats.displayedSkills, icon: Filter, color: "from-status-success/10 to-primary/10" },
					].map((stat) => (
						<StatsCard key={stat.label} {...stat} />
					))}
				</motion.section>

				<motion.section
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.6, delay: 0.2 }}
					className="space-y-6"
					aria-labelledby="skills-controls-heading"
				>
					<header className="space-y-2" id="skills-controls-heading">
						<div className="flex items-center gap-3">
							{/* Category header uses theme color and icon */}
							<div className={cn("w-12 h-12 rounded-lg bg-linear-to-br flex items-center justify-center shrink-0", currentCategory.color)}>
								<currentCategory.icon className="w-6 h-6 text-white" />
							</div>
							<div>
								<h2 className="text-2xl font-bold text-foreground">{currentCategory.title}</h2>
								<p className="text-sm text-muted-foreground">{currentCategory.description}</p>
							</div>
						</div>
					</header>

					<Controls
						selectedCategory={selectedCategory}
						setSelectedCategory={setSelectedCategory}
						searchQuery={searchQuery}
						setSearchQuery={setSearchQuery}
						sortBy={sortBy}
						setSortBy={setSortBy}
						allSkillsWithCategory={allSkillsWithCategory}
						skillCategories={skillCategories}
						viewMode={viewMode}
						setViewMode={setViewMode}
					/>

					<div className={cn( // CONDITIONAL LAYOUT
						"gap-6",
						viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "space-y-6"
					)} role="list" aria-label="Skills list">
						<AnimatePresence mode="popLayout">
							{filteredSkills.length > 0 ? (
								filteredSkills.map((skill, idx) => (
									viewMode === "grid" ? (
										<SkillCard
											key={`${skill.name}-${idx}`}
											skill={skill}
											getProficiencyColor={getProficiencyColor}
											getProficiencyLabel={getProficiencyLabel}
											getCategoryColor={getCategoryColor}
										/>
									) : (
										<SkillListRow
											key={`${skill.name}-${idx}`}
											skill={skill}
											getProficiencyLabel={getProficiencyLabel}
										/>
									)
								))
							) : (
								<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="col-span-full text-center py-12" role="status" aria-live="polite">
									<p className="text-muted-foreground">No skills found matching your search. Try adjusting filters.</p>
								</motion.div>
							)}
						</AnimatePresence>
					</div>
				</motion.section>

				<motion.footer
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.5, delay: 0.3 }}
					className="border-t border-primary/20 pt-8 text-center"
				>
					<p className="text-sm text-muted-foreground" aria-label="Skills summary">
						Total Skills: <span className="font-bold text-foreground">{allSkillsWithCategory.length}</span> •
						Categories: <span className="font-bold text-foreground">{skillCategories.length}</span> •
						Showing: <span className="font-bold text-primary">{filteredSkills.length}</span> of {stats.totalSkills}
					</p>
				</motion.footer>
			</div>
		</div>
	)
}