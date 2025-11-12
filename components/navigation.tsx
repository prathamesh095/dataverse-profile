"use client";

import React, { useEffect, useRef, useState, useMemo, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence, cubicBezier, useReducedMotion } from "framer-motion";
import Fuse from "fuse.js";
import FocusTrap from "focus-trap-react";
import { Toaster, toast } from "sonner";

// UI
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";

// Note: datasets are loaded lazily when search opens for performance (we do not import them at top)

// Modals
import { ResumeModal } from "@/components/resume-modal";
import { AchievementsPopup } from "@/components/AchievementsPopup";

// Utils
import { cn } from "@/lib/utils";

// Icons
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
  Mic,
  CornerDownLeft,
} from "lucide-react";

/* -------------------------------------------------------------------------- */
/* Types & Config */
/* -------------------------------------------------------------------------- */

type NavItem = { name: string; href: string; icon: React.ComponentType<{ className?: string }> };
type QuickAction =
  | { name: "Resume"; icon: React.ComponentType<{ className?: string }>; action: "openResume" }
  | { name: "LinkedIn" | "GitHub"; icon: React.ComponentType<{ className?: string }>; href: string; external: true };

const navigation: NavItem[] = [
  { name: "Home", href: "/", icon: Home },
  { name: "About", href: "/about", icon: User },
  { name: "Skills", href: "/skills", icon: Award },
  { name: "Projects", href: "/projects", icon: Briefcase },
  { name: "Blog", href: "/blog", icon: BookOpen },
  { name: "Contact", href: "/contact", icon: Mail },
];

const quickActions: QuickAction[] = [
  { name: "Resume", icon: Download, action: "openResume" },
  { name: "LinkedIn", href: "https://www.linkedin.com/in/prathamesh095/", icon: Linkedin, external: true },
  { name: "GitHub", href: "https://github.com/prathamesh095", icon: Github, external: true },
];

/* -------------------------------------------------------------------------- */
/* Final integrated component */
/* -------------------------------------------------------------------------- */

export function Navigation() {
  const pathname = usePathname();
  const prefersReducedMotion = useReducedMotion();

  // core
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false); // mobile menu
  const [actionsOpen, setActionsOpen] = useState(false);

  // modals
  const [resumeOpen, setResumeOpen] = useState(false);
  const [achievementsOpen, setAchievementsOpen] = useState(false);

  // search
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  // lazy datasets & fuse
  const [datasets, setDatasets] = useState<any[] | null>(null);
  const fuse = useMemo(() => {
    if (!datasets || datasets.length === 0) return null;
    return new Fuse(datasets, {
      keys: ["title", "keywords"],
      threshold: 0.35,
      distance: 100,
      minMatchCharLength: 2,
      includeScore: true,
    });
  }, [datasets]);

  // voice state
  const [listening, setListening] = useState(false);

  // header hide on scroll
  const [headerHidden, setHeaderHidden] = useState(false);
  const lastScrollY = useRef<number>(0);

  // refs
  const headerRef = useRef<HTMLElement | null>(null);
  const searchPanelRef = useRef<HTMLDivElement | null>(null);
  const actionsRef = useRef<HTMLDivElement | null>(null);

  /* -------------------------------------------------------------------------- */
  /* Effects: scroll states, shortcuts, scroll-lock for mobile menu             */
  /* -------------------------------------------------------------------------- */

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const delta = y - (lastScrollY.current || 0);
      const threshold = 10;
      if (Math.abs(delta) > threshold) {
        if (delta > 0 && y > 80) setHeaderHidden(true);
        else setHeaderHidden(false);
      }
      lastScrollY.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen((v) => !v);
        setSearchQuery("");
        setActiveIndex(0);
      }
      if (e.key === "Escape") {
        setSearchOpen(false);
        setActionsOpen(false);
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (!isOpen) {
      const top = document.body.style.top;
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      if (top) window.scrollTo(0, parseInt(top || "0") * -1);
      return;
    }
    const scrollY = window.scrollY;
    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = "100%";
  }, [isOpen]);

  useEffect(() => {
  if (!searchOpen && !actionsOpen) return;

  const handleOutside = (e: MouseEvent | TouchEvent | PointerEvent) => {
    const target = e.target as Node;
    if (actionsRef.current && !actionsRef.current.contains(target)) setActionsOpen(false);
    if (
      searchPanelRef.current &&
      !searchPanelRef.current.contains(target) &&
      headerRef.current &&
      !headerRef.current.contains(target)
    ) {
      setSearchOpen(false);
    }
  };

  // Support all input types
  document.addEventListener("mousedown", handleOutside);
  document.addEventListener("touchstart", handleOutside);
  document.addEventListener("pointerdown", handleOutside);

  return () => {
    document.removeEventListener("mousedown", handleOutside);
    document.removeEventListener("touchstart", handleOutside);
    document.removeEventListener("pointerdown", handleOutside);
  };
}, [searchOpen, actionsOpen]);


  /* -------------------------------------------------------------------------- */
  /* Lazy-load datasets when search opens (turn raw data into search docs)     */
  /* -------------------------------------------------------------------------- */
  useEffect(() => {
    if (!searchOpen) return;
    if (datasets && datasets.length > 0) return; // already loaded

    (async () => {
      try {
        const [{ projects }, { skillCategories }, { certifications }, { blogPosts }, { achievements }] = await Promise.all([
          import("@/lib/types"),
          import("@/lib/skills"),
          import("@/lib/certifications"),
          import("@/lib/blogs"),
          import("@/lib/data/achievements "),
        ]);

        const safeArray = (v: any) => (Array.isArray(v) ? v : []);

        const projectsData = safeArray(projects).map((p: any) => ({
          title: p.title ?? "Untitled project",
          type: "project",
          url: p.id ? `/projects/${p.id}` : "/projects",
          keywords: [
            p.tagline ?? "",
            p.description ?? "",
            ...(Array.isArray(p.tags) ? p.tags : []),
            ...(Array.isArray(p.technologies) ? p.technologies : []),
          ].filter(Boolean),
        }));

        const skillsData = safeArray(skillCategories).flatMap((cat: any) =>
          (Array.isArray(cat.skills) ? cat.skills : []).map((s: any) => ({
            title: s.name ?? "Skill",
            type: "skill",
            url: `/skills#${cat.id ?? ""}`,
            keywords: [s.name ?? "", ...(s.keywords || [])].filter(Boolean),
          }))
        );

        // BLOGS: map to /blog (not /blog/[id])
        const blogsData = safeArray(blogPosts).map((b: any) => ({
          title: b.title ?? "Blog",
          type: "blog",
          url: "/blog", // always link to blog list page as you deleted /blog/[id]
          keywords: [b.excerpt ?? "", ...(Array.isArray(b.tags) ? b.tags : [])].filter(Boolean),
        }));

        const certData = safeArray(certifications).map((c: any) => ({
          title: c.title ?? "Certification",
          type: "certification",
          url: "/about#certifications",
          keywords: [...(Array.isArray(c.skills) ? c.skills : []), c.issuer ?? ""].filter(Boolean),
        }));

        // achievements: add as one-off item plus individual items if provided
        const achievementsItems: any[] = [
          {
            title: "View All Achievements",
            type: "achievement",
            url: "#",
            onClick: () => {
              /* handled separately when injected into UI */
            },
            keywords: ["achievements", "award"],
          },
        ];
        if (Array.isArray(achievements) && achievements.length > 0) {
          const parsed = achievements.map((a: any) => ({
            title: a.title ?? "Achievement",
            type: "achievement",
            url: "/#achievements",
            keywords: [a.description ?? "", ...(Array.isArray(a.tags) ? a.tags : [])].filter(Boolean),
          }));
          achievementsItems.push(...parsed);
        }

        const merged = [...projectsData, ...skillsData, ...blogsData, ...certData, ...achievementsItems];
        setDatasets(merged);
      } catch (err) {
        console.error("Error loading search datasets:", err);
        setDatasets([]); // safe fallback
      }
    })();
  }, [searchOpen, datasets]);

  /* -------------------------------------------------------------------------- */
  /* Debounced search + command palette handling                                */
  /* -------------------------------------------------------------------------- */
  useEffect(() => {
    const id = setTimeout(() => {
      if (!searchQuery.trim()) {
        setSearchResults([]);
        setActiveIndex(0);
        return;
      }

      // Command palette support
      if (searchQuery.startsWith("/")) {
        const q = searchQuery.slice(1).toLowerCase();
        const commands = ["resume", "achievements", "blog", "projects", "contact", "theme"].filter((c) => c.startsWith(q));
        const mapped = commands.map((c) => ({ title: `/${c}`, type: "command", command: c }));
        setSearchResults(mapped);
        setActiveIndex(0);
        return;
      }

      // If fuse ready use it, otherwise fallback simple filter
      if (fuse) {
        try {
          const results = fuse.search(searchQuery).map((r) => r.item);
          setSearchResults(results);
        } catch (err) {
          // in case fuse errors, fallback to simple filter
          const q = searchQuery.toLowerCase();
          const fallback = (datasets || []).filter(
            (d) => (d.title || "").toLowerCase().includes(q) || (Array.isArray(d.keywords) && d.keywords.join(" ").toLowerCase().includes(q))
          );
          setSearchResults(fallback);
        }
      } else {
        const q = searchQuery.toLowerCase();
        const fallback = (datasets || []).filter(
          (d) => (d.title || "").toLowerCase().includes(q) || (Array.isArray(d.keywords) && d.keywords.join(" ").toLowerCase().includes(q))
        );
        setSearchResults(fallback);
      }
      setActiveIndex(0);
    }, 250);

    return () => clearTimeout(id);
  }, [searchQuery, fuse, datasets]);

  /* -------------------------------------------------------------------------- */
  /* Voice search (Web Speech API)                                               */
  /* -------------------------------------------------------------------------- */
  const handleVoiceSearch = useCallback(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      toast("Voice search not supported in this browser.");
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => setListening(true);
    recognition.onresult = (e: any) => {
      const t = e.results[0][0].transcript;
      setSearchQuery(t);
      toast.success("Captured voice input");
    };
    recognition.onerror = () => {
      toast.error("Voice recognition error");
      setListening(false);
    };
    recognition.onend = () => setListening(false);
    recognition.start();
  }, []);

  /* -------------------------------------------------------------------------- */
  /* Keyboard navigation for results                                              */
  /* -------------------------------------------------------------------------- */
  useEffect(() => {
    if (!searchOpen || searchResults.length === 0) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex((s) => (s + 1) % searchResults.length);
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex((s) => (s - 1 + searchResults.length) % searchResults.length);
      }
      if (e.key === "Enter") {
        const item = searchResults[activeIndex];
        if (!item) return;
        if (item.type === "command" && item.command) {
          // run command
          switch (item.command) {
            case "resume":
              setResumeOpen(true);
              toast("Opened resume");
              break;
            case "achievements":
              setAchievementsOpen(true);
              toast("Opened achievements");
              break;
            case "blog":
              window.location.href = "/blog";
              break;
            case "projects":
              window.location.href = "/projects";
              break;
            case "contact":
              window.location.href = "/contact";
              break;
            case "theme":
              document.dispatchEvent(new Event("toggle-theme"));
              toast("Toggled theme");
              break;
            default:
              break;
          }
        } else if (item.url) {
          // special-case blog: open list page
          if (item.type === "blog") window.location.href = "/blog";
          else window.location.href = item.url;
        }
        setSearchOpen(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [searchOpen, searchResults, activeIndex]);

  /* -------------------------------------------------------------------------- */
  /* SEO JSON-LD microdata                                                      */
  /* -------------------------------------------------------------------------- */
  const ldJson = useMemo(() => {
    return {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "url": "https://yourdomain.com",
      "name": "Prathamesh Pawar",
      "potentialAction": {
        "@type": "SearchAction",
        "target": "https://yourdomain.com/search?q={search_term_string}",
        "query-input": "required name=search_term_string",
      },
    };
  }, []);

  /* -------------------------------------------------------------------------- */
  /* Render                                                                     */
  /* -------------------------------------------------------------------------- */

  return (
    <>
      <Toaster position="top-right" richColors />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ldJson) }} />

      <ResumeModal isOpen={resumeOpen} onClose={() => setResumeOpen(false)} />
      <AchievementsPopup isOpen={achievementsOpen} onClose={() => setAchievementsOpen(false)} />

      <motion.header
        ref={headerRef}
        initial={{ y: -100 }}
        animate={{ y: headerHidden ? -80 : 0 }}
        transition={{ duration: prefersReducedMotion ? 0 : 0.28, ease: cubicBezier(0.22, 1, 0.36, 1) }}
        className={cn(
          "fixed top-0 left-0 right-0 z-50 h-16 transition-all duration-700 ease-out",
          scrolled ? "bg-background/95 backdrop-blur-2xl border-b border-border/30 shadow-xl" : "bg-transparent/80 backdrop-blur-xl"
        )}
      >
        <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="group relative flex items-center space-x-2 select-none">
              <motion.div
                className="relative w-10 h-10 bg-linear-to-br from-primary to-secondary rounded-xl flex items-center justify-center shadow-xl group-hover:shadow-2xl transition-all duration-500"
                whileHover={!prefersReducedMotion ? { scale: 1.05, rotate: 5 } : {}}
                whileTap={!prefersReducedMotion ? { scale: 0.95 } : {}}
              >
                <span className="text-white font-bold text-lg tracking-tight">PP</span>
              </motion.div>
              <motion.span
                className="font-bold text-xl bg-linear-to-r from-primary via-secondary to-accent bg-clip-text text-transparent hidden sm:block tracking-tight"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                Prathamesh Pawar
              </motion.span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center space-x-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
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
                        isActive ? "bg-linear-to-r from-primary/90 to-secondary/90 text-white shadow-lg" : "text-muted-foreground hover:text-primary hover:bg-primary/10 dark:hover:text-primary/80"
                      )}
                    >
                      <Icon className={cn("w-4 h-4 transition-transform duration-300", hoveredItem === item.name && "scale-110")} />
                      <span>{item.name}</span>
                    </Link>
                  </div>
                );
              })}
            </div>

            {/* Right Controls */}
            <div className="flex items-center space-x-2">
              {/* Search Button */}
              <div className="relative">
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn("h-10 px-3 flex items-center space-x-1.5 transition-all duration-300", "hover:text-primary dark:hover:text-primary/80 hover:bg-primary/10")}
                  onClick={() => {
                    setSearchOpen(true);
                    setTimeout(() => {
                      // datasets effect will start loading
                    }, 0);
                  }}
                  aria-expanded={searchOpen}
                  aria-controls="global-search-panel"
                  aria-haspopup="dialog"
                >
                  <Search className="w-4 h-4" />
                  <span className="hidden sm:block text-sm">Search</span>
                  <kbd className="hidden sm:inline-flex h-5 items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-semibold" aria-label="Keyboard shortcut">
                    <Command className="w-3 h-3" />K
                  </kbd>
                </Button>
              </div>

              {/* Quick Actions */}
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
                      className="absolute top-full right-0 mt-2 w-52 bg-background border border-border/20 rounded-2xl shadow-2xl z-50 py-1.5"
                      role="menu"
                    >
                      {quickActions.map((action, i) => {
                        const Icon = action.icon;
                        const onClick = "action" in action ? () => { setResumeOpen(true); toast("Opened resume"); } : () => window.open((action as any).href, "_blank", "noopener,noreferrer");
                        return (
                          <motion.button
                            key={action.name}
                            onClick={onClick}
                            className="flex items-center space-x-2.5 px-3 py-2.5 text-sm font-medium text-muted-foreground hover:text-primary dark:hover:text-primary/80 hover:bg-primary/10 w-full text-left group transition-colors duration-300"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.05 }}
                            role="menuitem"
                          >
                            <Icon className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                            <span>{action.name}</span>
                            {"external" in action && (action as any).external && <ExternalLink className="w-3 h-3 ml-auto opacity-60" aria-hidden="true" />}
                          </motion.button>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <ThemeToggle />

              {/* Mobile Menu Toggle */}
              <Button
                variant="ghost"
                size="sm"
                className="h-10 w-10 p-0 lg:hidden hover:text-primary dark:hover:text-primary/80 hover:bg-primary/10 transition-colors duration-300"
                onClick={() => setIsOpen((v) => !v)}
                aria-expanded={isOpen}
                aria-controls="mobile-menu"
                aria-label="Toggle menu"
              >
                {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </div>
          </div>
        </nav>
      </motion.header>

      {/* Centered / Mobile-friendly Search Panel (shared layer) */}
      <AnimatePresence>
        {searchOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 bg-black/20 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onMouseDown={() => setSearchOpen(false)}
            />

            {/* Panel */}
            <FocusTrap active={searchOpen}>
              <motion.div
                ref={searchPanelRef}
                id="global-search-panel"
                role="dialog"
                aria-label="Global search"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.18 }}
                className="fixed top-20 left-1/2 -translate-x-1/2 z-50 w-[92vw] max-w-2xl bg-background/95 backdrop-blur-xl border border-border/30 shadow-2xl rounded-2xl overflow-hidden"
              >
                {/* Input */}
                <div className="p-4 border-b border-border/20">
                  <div className="relative flex items-center gap-2">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" aria-hidden="true" />
                    <input
                      type="text"
                      placeholder="Type / for commands or search projects, skills, blogs..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-3 py-2.5 bg-muted/50 rounded-lg border-0 focus:ring-2 focus:ring-primary/50 text-sm outline-none"
                      autoFocus
                      aria-autocomplete="list"
                      aria-controls="search-results"
                    />
                    <Button size="icon" variant="ghost" onClick={handleVoiceSearch} className={listening ? "animate-pulse text-primary" : ""} aria-label="Voice search">
                      <Mic className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Results */}
                <div id="search-results" className="max-h-80 overflow-y-auto">
                  {searchResults.length > 0 ? (
                    searchResults.slice(0, 8).map((result, i) => {
                      const key = `${result.title ?? result.command}-${i}`;
                      const isActive = i === activeIndex;
                      return (
                        <motion.div
                          key={key}
                          initial={{ opacity: 0, x: -12 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.04 }}
                          className={cn(
                            "px-4 py-2.5 hover:bg-muted/50 border-b border-border/10 last:border-b-0 flex items-center justify-between",
                            isActive ? "bg-primary/10" : ""
                          )}
                          role="option"
                          onMouseEnter={() => setActiveIndex(i)}
                        >
                          {"command" in result ? (
                            <button
                              onClick={() => {
                                const cmd = result.command;
                                switch (cmd) {
                                  case "resume":
                                    setResumeOpen(true);
                                    toast("Opened resume");
                                    break;
                                  case "achievements":
                                    setAchievementsOpen(true);
                                    toast("Opened achievements");
                                    break;
                                  case "blog":
                                    window.location.href = "/blog";
                                    break;
                                  case "projects":
                                    window.location.href = "/projects";
                                    break;
                                  case "contact":
                                    window.location.href = "/contact";
                                    break;
                                  case "theme":
                                    document.dispatchEvent(new Event("toggle-theme"));
                                    toast("Toggled theme");
                                    break;
                                  default:
                                    break;
                                }
                                setSearchOpen(false);
                                setSearchQuery("");
                              }}
                              className="flex items-center justify-between w-full text-left"
                            >
                              <div className="flex items-center space-x-2">
                                <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-tertiary/10 text-tertiary dark:text-tertiary/80">
                                  {result.type}
                                </span>
                                <span className="text-sm font-medium">{result.title}</span>
                              </div>
                              <CornerDownLeft className="w-4 h-4 text-muted-foreground" />
                            </button>
                          ) : (
                            <Link
                              href={result.url}
                              className="flex items-center justify-between w-full"
                              onClick={() => {
                                // always send blogs to /blog list
                                if (result.type === "blog") window.location.href = "/blog";
                                setSearchOpen(false);
                                setSearchQuery("");
                              }}
                            >
                              <div className="flex items-center space-x-2">
                                <span
                                  className={cn(
                                    "px-2 py-0.5 rounded-full text-xs font-semibold",
                                    result.type === "project" && "bg-secondary/10 text-secondary",
                                    result.type === "skill" && "bg-status-success/10 text-status-success",
                                    result.type === "blog" && "bg-accent/10 text-accent",
                                    result.type === "certification" && "bg-primary/10 text-primary",
                                    result.type === "achievement" && "bg-tertiary/10 text-tertiary"
                                  )}
                                >
                                  {result.type}
                                </span>
                                <span className="text-sm font-medium">{result.title}</span>
                              </div>
                              <ChevronRight className="w-4 h-4 text-muted-foreground" />
                            </Link>
                          )}
                        </motion.div>
                      );
                    })
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
            </FocusTrap>
          </>
        )}
      </AnimatePresence>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ type: "spring", stiffness: 120, damping: 18 }}
            className="lg:hidden overflow-hidden bg-background/80 backdrop-blur-xl border-t border-border/20"
          >
            <div className="px-4 pb-4 space-y-1">
              {navigation.map((item, i) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <motion.div key={item.name} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center space-x-3 p-3 rounded-xl text-base font-semibold transition-colors duration-300",
                        isActive ? "bg-linear-to-r from-primary/90 to-secondary/90 text-white shadow-lg" : "text-muted-foreground hover:text-primary hover:bg-primary/10 dark:hover:text-primary/80"
                      )}
                      onClick={() => setIsOpen(false)}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{item.name}</span>
                    </Link>
                  </motion.div>
                );
              })}

              {/* Mobile Quick Actions */}
              <div className="pt-3 space-y-1">
                <motion.button initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.35 }} onClick={() => { setResumeOpen(true); setIsOpen(false); toast("Opened resume"); }} className="flex items-center space-x-3 p-3 text-sm font-medium text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-xl w-full">
                  <Download className="w-4 h-4" />
                  <span>Resume</span>
                </motion.button>

                <motion.button initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }} onClick={() => { setAchievementsOpen(true); setIsOpen(false); toast("Opened achievements"); }} className="flex items-center space-x-3 p-3 text-sm font-medium text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-xl w-full">
                  <Award className="w-4 h-4" />
                  <span>Achievements</span>
                </motion.button>

                {quickActions.slice(1).map((action) => {
                  if ("href" in action) {
                    const Icon = action.icon;
                    return (
                      <a key={action.name} href={action.href} target="_blank" rel="noopener noreferrer" onClick={() => setIsOpen(false)} className="flex items-center space-x-3 p-3 text-sm font-medium text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-xl w-full">
                        <Icon className="w-4 h-4" />
                        <span>{action.name}</span>
                        <ExternalLink className="w-3 h-3 ml-auto opacity-60" />
                      </a>
                    );
                  }
                  return null;
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* spacer for fixed header */}
      <div className="h-16" aria-hidden="true" />
    </>
  );
}
