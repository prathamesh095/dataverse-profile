"use client";

import { useState, useEffect, useCallback, useMemo, memo, useRef, Suspense } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Github,
  Eye,
  CheckCircle,
  Lightbulb,
  Target,
  Zap,
  Code,
  Database,
  BarChart3,
  Brain,
  TrendingUp,
  Award,
  ArrowLeft,
  ChevronLeft,
  Calendar,
  Clock,
  Users,
  Globe,
  Star,
  GitBranch,
  Layers,
  Sparkles,
  ZoomIn,
  ChevronRight,
  ChevronLeft as ChevronLeftIcon,
  Download,
  Link2,
  Play,
  Pause,
  Maximize2,
  FileText,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence, cubicBezier, useReducedMotion } from "framer-motion";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

const Navigation = dynamic(() => import("@/components/navigation").then(m => m.Navigation), { ssr: false });
const Footer = dynamic(() => import("@/components/footer").then(m => m.Footer), { ssr: false });
const SmoothScroll = dynamic(() => import("@/components/smooth-scroll").then(m => m.SmoothScroll), { ssr: false });
const PerformanceMonitor = dynamic(() => import("@/components/performance-monitor").then(m => m.PerformanceMonitor), { ssr: false });

import { cn } from "@/lib/utils";
import { Project, projects } from "@/lib/types";

/* =========================== */
/* Shared easing & animations  */
/* =========================== */
const EASE = cubicBezier(0.22, 1, 0.36, 1);

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
};

const scaleIn = (delay = 0) => ({
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: EASE, delay } },
});

const slideInX = (x = -20, delay = 0) => ({
  initial: { opacity: 0, x },
  animate: { opacity: 1, x: 0, transition: { duration: 0.5, ease: EASE, delay } },
});

/* =========================== */
/* Safe Icon Map               */
/* =========================== */
const iconMap = {
  Database,
  Code,
  Brain,
  BarChart3,
  TrendingUp,
  Zap,
  Eye,
  Target,
} as const;
type IconKey = keyof typeof iconMap;

/* =========================== */
/* PREMIUM ANIMATED BUTTON     */
/* =========================== */
const AnimatedButton = memo(({ children, className = "", ...props }: React.ComponentProps<typeof Button>) => (
  <motion.div
    whileHover={{ scale: 1.05, y: -2 }}
    whileTap={{ scale: 0.96 }}
    transition={{ type: "spring", stiffness: 300, damping: 20 }}
  >
    <Button
      {...props}
      className={cn(
        "transition-all duration-300 font-medium",
        "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        className
      )}
    >
      {children}
    </Button>
  </motion.div>
));
AnimatedButton.displayName = "AnimatedButton";

/* =========================== */
/* Lightweight Loading UI      */
/* =========================== */
const LoadingSkeleton = memo(function LoadingSkeleton() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-3xl px-6">
        <div className="animate-pulse space-y-4">
          <div className="h-5 w-40 bg-muted rounded" />
          <div className="h-10 w-3/4 bg-muted rounded" />
          <div className="h-4 w-2/3 bg-muted rounded" />
          <div className="h-64 w-full bg-muted rounded-xl" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-16 bg-muted rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
});

/* =========================== */
/* Scroll Progress (top bar)   */
/* =========================== */
const ScrollProgress = memo(() => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (typeof window === "undefined" || typeof document === "undefined") return;

    const handleScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop || 0;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const newProgress = docHeight > 0 ? Math.min(1, scrollTop / docHeight) : 0;
      setProgress(newProgress);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 z-120 h-0.5 bg-transparent">
      <div
        className="h-full bg-primary/80 transition-[width] duration-150"
        style={{ width: `${progress * 100}%` }}
      />
    </div>
  );
});
ScrollProgress.displayName = "ScrollProgress";

/* =========================== */
/* Back to Projects Button     */
/* =========================== */
export const BackToProjectsButton = memo(() => (
  <Button
    asChild
    variant="ghost"
    className={cn(
      "fixed left-4 top-24 z-100 flex items-center gap-2 px-4 py-2 rounded-full shadow-md",
      "border border-primary/20 bg-background/80 backdrop-blur-md",
      "hover:bg-primary/10 hover:text-primary transition-all duration-300 ease-out",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30",
      "text-sm font-medium select-none transform-gpu"
    )}
  >
    <Link href="/projects" aria-label="Back to Projects">
      <ChevronLeft className="w-5 h-5" />
      Back to Projects
    </Link>
  </Button>
));
BackToProjectsButton.displayName = "BackToProjectsButton";

/* =========================== */
/* Hero Section                */
/* =========================== */
const HeroSection = memo(({ project, onDownloadAll }: { project: Project; onDownloadAll: () => void }) => {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.section
      className="relative min-h-[50vh] flex items-center justify-center overflow-hidden pt-20 pb-8"
      initial="initial"
      animate="animate"
      variants={{
        initial: { opacity: 0 },
        animate: { opacity: 1, transition: { duration: 0.6, ease: EASE } },
      }}
    >
      <div className="absolute inset-0 bg-linear-to-br from-primary/5 via-accent/5 to-transparent" />
      <div className="relative z-10 text-center max-w-4xl mx-auto px-4 sm:px-6">
        <motion.div variants={fadeInUp}>
          <Badge className="badge-primary mb-4 px-3 py-1 text-sm">
            {project.category} • {project.domain} • {project.year}
          </Badge>
        </motion.div>

        <motion.h1
          className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 animate-text-shimmer bg-clip-text text-transparent"
          variants={fadeInUp}
          transition={{ ...fadeInUp.animate.transition, delay: 0.1 }}
        >
          {project.title}
        </motion.h1>

        <motion.p
          className="text-muted-foreground mb-8 max-w-xl mx-auto text-base sm:text-lg"
          variants={fadeInUp}
          transition={{ ...fadeInUp.animate.transition, delay: 0.2 }}
        >
          {project.tagline}
        </motion.p>

        <motion.div
          className="relative mx-auto mb-8 max-w-3xl rounded-xl overflow-hidden shadow-2xl border border-primary/10 animate-on-scroll"
          {...scaleIn(0.25)}
          style={{ willChange: "transform" }}
          whileHover={!prefersReducedMotion ? { y: -4 } : {}}
          transition={{ duration: 0.35, ease: EASE }}
        >
          <Image
            src={project.image || "/placeholder.svg"}
            alt={project.title}
            width={1200}
            height={600}
            priority
            className="w-full h-auto object-cover"
            sizes="(max-width: 768px) 100vw, 800px"
          />
        </motion.div>

        <motion.div
          className="flex flex-wrap gap-4 justify-center"
          variants={fadeInUp}
          transition={{ ...fadeInUp.animate.transition, delay: 0.3 }}
        >
          <AnimatedButton size="lg" className="btn-outline-premium">
            <a href={project.links.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
              <Github className="w-5 h-5" />
              Source Code
            </a>
          </AnimatedButton>

          {project.links.report && (
            <AnimatedButton size="lg" className="btn-outline-premium">
              <a href={project.links.report} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Project Report
              </a>
            </AnimatedButton>
          )}

          {project.links.dashboard && (
            <AnimatedButton size="lg" className="btn-filled-premium">
              <Link href={project.links.dashboard} className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Dashboard
              </Link>
            </AnimatedButton>
          )}
        </motion.div>
      </div>
    </motion.section>
  );
});
HeroSection.displayName = "HeroSection";

/* =========================== */
/* Related Projects            */
/* =========================== */
const RelatedProjects = memo(({ current }: { current: Project }) => {
  const related = useMemo(() => {
    const pool = projects.filter(p =>
      p.id !== current.id &&
      (p.domain === current.domain || p.category === current.category)
    );
    return pool.slice(0, 3);
  }, [current]);

  if (related.length === 0) return null;

  return (
    <section className="mt-16">
      <h3 className="text-2xl font-bold mb-6">Related Projects</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {related.map((p, i) => (
          <motion.div
            key={p.id}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, amount: 0.25 }}
            variants={scaleIn(i * 0.06)}
            className="group h-full"
          >
            <Card className="flex flex-col h-full overflow-hidden border border-primary/10 dark:border-primary/10 bg-card/60 backdrop-blur-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="relative h-40 overflow-hidden shrink-0">
                <Image
                  src={p.image}
                  alt={p.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent" />
                <Badge className="badge-secondary absolute top-3 left-3 text-white">
                  {p.category}
                </Badge>
              </div>
              <CardContent className="p-5 flex flex-col flex-1">
                <div className="flex items-center mb-2">
                  <BarChart3 className="w-4 h-4 text-primary mr-2 shrink-0" />
                  <h4 className="font-semibold line-clamp-2">{p.title}</h4>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                  {p.tagline}
                </p>
                <div className="mt-auto flex gap-2 pt-2">
                  <AnimatedButton size="sm" className="btn-filled-premium">
                    <Link href={`/projects/${p.id}`} className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      View
                    </Link>
                  </AnimatedButton>
                  <AnimatedButton size="sm" variant="outline" className="btn-outline-premium">
                    <a href={p.links.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1">
                      <Github className="w-4 h-4" />
                      Code
                    </a>
                  </AnimatedButton>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  );
});
RelatedProjects.displayName = "RelatedProjects";

/* =========================== */
/* Main Component              */
/* =========================== */
export default function ProjectDetailsClient({ project }: { project: Project | undefined }) {
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [galleryExpanded, setGalleryExpanded] = useState(false);
  const [autoPlay, setAutoPlay] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const v = window.localStorage.getItem("lightbox-autoplay");
      setAutoPlay(v === "1");
    } catch { }
  }, []);

  const tabsListRef = useRef<HTMLDivElement>(null);
  const [activeValue, setActiveValue] = useState("overview");
  const [indicatorStyle, setIndicatorStyle] = useState<React.CSSProperties>({});
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (!tabsListRef.current || typeof window === "undefined") return;
    const container = tabsListRef.current;
    const active = container.querySelector(`[data-state="active"]`) as HTMLElement | null;
    if (!active) return;

    const scrollLeft = active.offsetLeft - container.clientWidth / 2 + active.offsetWidth / 2;
    container.scrollTo({ left: scrollLeft, behavior: "smooth" });

    if (window.innerWidth < 640) {
      setIndicatorStyle({
        left: `${active.offsetLeft}px`,
        width: `${active.offsetWidth}px`,
      });
    }
  }, [activeValue]);

  useEffect(() => {
    if (project === undefined) return;
    if (!project) router.push("/projects");
  }, [project, router]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const handleKey = (e: KeyboardEvent) => {
      if (!selectedImage) return;
      if (e.key === "Escape") setSelectedImage(null);
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
      if (e.key === "?") {
        alert("Shortcuts: ←/→ navigate • Esc close • Space toggle autoplay");
      }
      if (e.key === " ") {
        e.preventDefault();
        setAutoPlay((v) => !v);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [selectedImage, galleryIndex, project?.gallery]);

  useEffect(() => {
    if (typeof document === "undefined") return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );
    document.querySelectorAll(".animate-on-scroll").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem("lightbox-autoplay", autoPlay ? "1" : "0");
    } catch { }
  }, [autoPlay]);

  useEffect(() => {
    if (!autoPlay || !selectedImage || !project?.gallery?.length) return;
    const timer = setInterval(() => {
      setGalleryIndex((prev) => {
        const next = (prev + 1) % project.gallery.length;
        setSelectedImage(project.gallery[next]);
        return next;
      });
    }, 2500);
    return () => clearInterval(timer);
  }, [autoPlay, selectedImage, project?.gallery]);

  const tabs = useMemo(() => {
    const base = [
      { value: "overview", label: "Overview", icon: Target },
      { value: "tech-stack", label: "Tech Stack", icon: Code },
      { value: "features", label: "Features", icon: Zap },
      { value: "process", label: "Process", icon: BarChart3 },
      { value: "gallery", label: "Gallery", icon: Eye },
      { value: "learnings", label: "Learnings & Outcomes", icon: Lightbulb },
      { value: "stats", label: "Stats & Metrics", icon: TrendingUp },
    ];
    if (project?.achievements.length) {
      base.push({ value: "achievements", label: "Achievements", icon: Award });
    }
    return base;
  }, [project?.achievements.length]);

  const openLightbox = (img: string, index: number) => {
    setSelectedImage(img);
    setGalleryIndex(index);
  };
  const closeLightbox = () => setSelectedImage(null);
  const goPrev = () => {
    if (!project) return;
    const prev = (galleryIndex - 1 + project.gallery.length) % project.gallery.length;
    setGalleryIndex(prev);
    setSelectedImage(project.gallery[prev]);
  };
  const goNext = () => {
    if (!project) return;
    const next = (galleryIndex + 1) % project.gallery.length;
    setGalleryIndex(next);
    setSelectedImage(project.gallery[next]);
  };

  const visibleGallery = useMemo(() => {
    if (!project?.gallery) return [];
    if (galleryExpanded) return project.gallery;
    return project.gallery.slice(0, Math.min(6, project.gallery.length));
  }, [project?.gallery, galleryExpanded]);

  const handleCopyImageLink = async () => {
    if (!selectedImage) return;
    try {
      const tempTextArea = document.createElement('textarea');
      tempTextArea.value = selectedImage;
      document.body.appendChild(tempTextArea);
      tempTextArea.select();
      document.execCommand('copy');
      document.body.removeChild(tempTextArea);
      alert("Image link copied!");
    } catch (e) {
      console.error("Failed to copy:", e);
      alert("Failed to copy link.");
    }
  };

  const handleDownloadImage = async () => {
    if (!selectedImage) return;
    if (typeof document === "undefined") return;
    const a = document.createElement("a");
    a.href = selectedImage;
    a.download = selectedImage.split("/").pop() || "image";
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  const handleDownloadAll = async () => {
    if (!project?.gallery?.length) return;
    if (typeof document === "undefined") return;
    project.gallery.forEach((src) => {
      const a = document.createElement("a");
      a.href = src;
      a.download = src.split("/").pop() || "image";
      document.body.appendChild(a);
      a.click();
      a.remove();
    });
  };

  if (project === undefined) {
    return <LoadingSkeleton />;
  }

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold text-foreground">Project Not Found</h1>
          <AnimatedButton asChild className="btn-filled-premium">
            <Link href="/projects">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Projects
            </Link>
          </AnimatedButton>
        </div>
      </div>
    );
  }

  return (
    <>
      <Suspense fallback={<LoadingSkeleton />}>
        <SmoothScroll />
        <PerformanceMonitor />
      </Suspense>
      <ScrollProgress />
      <Navigation />
      <BackToProjectsButton />
      <main className="pt-16">
        <HeroSection project={project} onDownloadAll={handleDownloadAll} />

        <section className="bg-muted/50 py-6 border-y border-primary/10 mt-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div className="space-y-1">
                <div className="flex items-center justify-center gap-2 text-primary">
                  <Calendar className="w-5 h-5" />
                  <span className="font-semibold text-lg">{project.year}</span>
                </div>
                <p className="text-xs text-muted-foreground">Year</p>
              </div>
              <div className="space-y-1">
                <div className="flex items-center justify-center gap-2 text-primary">
                  <Clock className="w-5 h-5" />
                  <span className="font-semibold text-lg">{project.duration || "N/A"}</span>
                </div>
                <p className="text-xs text-muted-foreground">Duration</p>
              </div>
              <div className="space-y-1">
                <div className="flex items-center justify-center gap-2 text-primary">
                  <Users className="w-5 h-5" />
                  <span className="font-semibold text-lg">{project.teamSize || "Solo"}</span>
                </div>
                <p className="text-xs text-muted-foreground">Team</p>
              </div>
              <div className="space-y-1">
                <div className="flex items-center justify-center gap-2 text-primary">
                  <Globe className="w-5 h-5" />
                  <span className="font-semibold text-lg">{project.domain}</span>
                </div>
                <p className="text-xs text-muted-foreground">Domain</p>
              </div>
            </div>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
          <Tabs defaultValue="overview" className="space-y-8" onValueChange={setActiveValue}>
            <div className="relative">
              <TabsList
                ref={tabsListRef}
                className={cn(
                  "inline-flex h-auto min-h-12 w-full flex-nowrap overflow-x-auto rounded-xl bg-transparent p-1 gap-1.5 scrollbar-hide",
                  "md:justify-center md:flex-wrap md:overflow-visible"
                )}
              >
                {tabs.map(({ value, label, icon: Icon }) => (
                  <TabsTrigger
                    key={value}
                    value={value}
                    className={cn(
                      "group relative shrink-0 flex items-center gap-1.5 whitespace-nowrap rounded-lg px-3 py-2 text-xs font-medium transition-all",
                      "data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm",
                      "text-muted-foreground hover:text-foreground hover:bg-primary/5",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30",
                      "sm:px-4 sm:py-2.5 sm:text-sm"
                    )}
                  >
                    <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform group-data-[state=active]:scale-110" />
                    <span className="hidden sm:inline">{label}</span>
                    <span className="sm:hidden">{label.split(" ")[0]}</span>
                  </TabsTrigger>
                ))}
              </TabsList>
              <motion.div
                className="absolute bottom-0 h-0.5 bg-primary sm:hidden"
                style={indicatorStyle}
                layout
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            </div>

            {/* ALL TABS CONTENT - UNCHANGED EXCEPT BUTTONS */}
            <TabsContent value="overview" className="mt-0">
              <Card className="animate-on-scroll">
                <CardContent className="p-6 sm:p-8 space-y-6">
                  <h2 className="text-2xl sm:text-3xl font-bold flex items-center gap-3">
                    <Target className="w-7 h-7 text-primary" />
                    Project Overview
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">{project.fullDescription}</p>
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="border-primary/30">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {Object.entries(project.metrics).map(([key, value]) => (
                      <div key={key} className="text-center p-4 bg-muted/50 rounded-xl border border-primary/10">
                        <div className="text-xl sm:text-2xl font-bold text-primary">{value}</div>
                        <div className="text-xs sm:text-sm text-muted-foreground capitalize">
                          {key.replace(/([A-Z])/g, " $1").trim()}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* TECH STACK */}
            <TabsContent value="tech-stack">
              <Card className="animate-on-scroll">
                <CardContent className="p-6 sm:p-8">
                  <h2 className="text-2xl sm:text-3xl font-bold mb-6 flex items-center gap-3">
                    <Code className="w-7 h-7 text-primary" />
                    Tech Stack
                  </h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {project.technologies.map((tech, i) => (
                      <motion.div
                        key={tech}
                        initial="initial"
                        whileInView="animate"
                        viewport={{ once: true, amount: 0.3 }}
                        variants={scaleIn(i * 0.05)}
                        className="flex flex-col items-center p-4 bg-muted/30 rounded-xl border border-primary/10"
                      >
                        <Layers className="w-8 h-8 text-primary mb-2" />
                        <span className="text-sm font-medium text-foreground text-center">{tech}</span>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* FEATURES */}
            <TabsContent value="features">
              <Card className="animate-on-scroll">
                <CardContent className="p-6 sm:p-8">
                  <h2 className="text-2xl sm:text-3xl font-bold mb-6 flex items-center gap-3">
                    <Zap className="w-7 h-7 text-primary" />
                    Key Features
                  </h2>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {project.features.map((f, i) => (
                      <motion.div
                        key={i}
                        initial="initial"
                        whileInView="animate"
                        viewport={{ once: true, amount: 0.25 }}
                        variants={slideInX(-20, i * 0.08)}
                        className="flex items-start gap-3 p-4 bg-muted/30 rounded-lg border border-primary/10"
                      >
                        <CheckCircle className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                        <span className="text-muted-foreground">{f}</span>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* PROCESS */}
            <TabsContent value="process">
              <Card className="animate-on-scroll">
                <CardContent className="p-6 sm:p-8">
                  <h2 className="text-2xl sm:text-3xl font-bold mb-8 flex items-center gap-3">
                    <BarChart3 className="w-7 h-7 text-primary" />
                    Development Process
                  </h2>
                  <div className="relative pl-12 space-y-12 before:absolute before:left-6 before:top-0 before:bottom-0 before:w-0.5 before:bg-primary/20">
                    {project.process.map((step, i) => {
                      const Icon = iconMap[step.icon as IconKey] ?? Target;
                      return (
                        <motion.div
                          key={i}
                          initial="initial"
                          whileInView="animate"
                          viewport={{ once: true, amount: 0.25 }}
                          variants={slideInX(-30, i * 0.12)}
                          className="relative flex items-start gap-4"
                        >
                          <div className="absolute -left-11 top-1.5 w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                            <Icon className="w-5 h-5 text-primary" />
                          </div>
                          <div className="flex-1 bg-card border border-primary/10 rounded-xl p-5 shadow-sm">
                            <h3 className="font-semibold text-foreground flex items-center gap-2">
                              <GitBranch className="w-4 h-4 text-primary" />
                              {step.step}
                            </h3>
                            <p className="text-sm text-muted-foreground mt-1">{step.description}</p>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* GALLERY */}
            <TabsContent value="gallery">
              <Card className="animate-on-scroll">
                <CardContent className="p-6 sm:p-8">
                  <div className="flex items-center justify-between gap-3 mb-4">
                    <h2 className="text-2xl sm:text-3xl font-bold flex items-center gap-3">
                      <Eye className="w-7 h-7 text-primary" />
                      Gallery
                    </h2>
                    <div className="flex gap-2">
                      {project.gallery.length > 6 && (
                        <AnimatedButton
                          variant="outline"
                          size="sm"
                          onClick={() => setGalleryExpanded((v) => !v)}
                          className="btn-outline-premium"
                        >
                          {galleryExpanded ? "Collapse" : "View All"}
                        </AnimatedButton>
                      )}
                      <AnimatedButton
                        variant="outline"
                        size="sm"
                        className="btn-outline-premium"
                        onClick={handleDownloadAll}
                      >
                        <Download className="w-4 h-4 mr-1" />
                        Download All
                      </AnimatedButton>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground mb-4">
                    Click any image to open the lightbox. Use ←/→ keys to navigate.
                  </p>

                  <div className={cn("grid gap-3", "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4")}>
                    {visibleGallery.map((img, i) => (
                      <motion.button
                        key={`${img}-${i}`}
                        initial="initial"
                        whileInView="animate"
                        viewport={{ once: true, amount: 0.25 }}
                        variants={scaleIn(0.03 * (i % 8))}
                        onClick={() => openLightbox(img, galleryExpanded ? i : i)}
                        className="group relative aspect-4/3 rounded-lg overflow-hidden border border-primary/15 bg-muted/40"
                        aria-label={`Open image ${i + 1}`}
                      >
                        <Image
                          src={img}
                          alt={`Screenshot ${i + 1}`}
                          fill
                          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                          className="object-cover transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-linear-to-t from-black/25 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="rounded-full bg-black/40 text-white p-2 backdrop-blur">
                            <ZoomIn className="w-5 h-5" />
                          </div>
                        </div>
                        <div className="absolute bottom-2 left-2 rounded-full bg-black/60 text-white text-xs px-2 py-0.5">
                          {i + 1}
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* LEARNINGS & OUTCOMES */}
            <TabsContent value="learnings">
              <div className="grid md:grid-cols-2 gap-6">
                {[
                  { title: "Key Learnings", icon: Lightbulb, items: project.keyLearnings },
                  { title: "Outcomes & Impact", icon: Target, items: project.outcomes },
                ].map(({ title, icon: Icon, items }) => (
                  <Card key={title} className="animate-on-scroll">
                    <CardContent className="p-6 sm:p-8">
                      <h2 className="text-xl sm:text-2xl font-bold mb-6 flex items-center gap-3">
                        <Icon className="w-7 h-7 text-primary" />
                        {title}
                      </h2>
                      <ul className="space-y-4">
                        {items.map((item, i) => (
                          <motion.li
                            key={i}
                            initial="initial"
                            whileInView="animate"
                            viewport={{ once: true, amount: 0.25 }}
                            variants={fadeInUp}
                            transition={{ ...fadeInUp.animate.transition, delay: i * 0.08 }}
                            className="flex items-start gap-3 text-muted-foreground"
                          >
                            <Sparkles className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                            {item}
                          </motion.li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* STATS */}
            <TabsContent value="stats">
              <Card className="animate-on-scroll">
                <CardContent className="p-6 sm:p-8">
                  <h2 className="text-2xl sm:text-3xl font-bold mb-6 flex items-center gap-3">
                    <TrendingUp className="w-7 h-7 text-primary" />
                    Stats & Metrics
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold flex items-center gap-2">
                        <Star className="w-5 h-5 text-primary" />
                        Performance Highlights
                      </h3>
                      <ul className="space-y-3">
                        {Object.entries(project.metrics).map(([key, value]) => (
                          <li key={key} className="flex justify-between text-sm">
                            <span className="text-muted-foreground capitalize">{key.replace(/([A-Z])/g, " $1").trim()}</span>
                            <span className="font-semibold text-primary">{value}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="bg-muted/50 rounded-xl p-6 flex items-center justify-center">
                      <div className="text-center">
                        <BarChart3 className="w-16 h-16 text-primary mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground">Detailed analytics available in dashboard</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* ACHIEVEMENTS */}
            {project.achievements.length > 0 && (
              <TabsContent value="achievements">
                <Card className="animate-on-scroll">
                  <CardContent className="p-6 sm:p-8">
                    <h2 className="text-2xl sm:text-3xl font-bold mb-6 flex items-center gap-3">
                      <Award className="w-7 h-7 text-primary" />
                      Achievements
                    </h2>
                    <div className="grid sm:grid-cols-2 gap-4">
                      {project.achievements.map((ach, i) => (
                        <motion.div
                          key={i}
                          initial="initial"
                          whileInView="animate"
                          viewport={{ once: true, amount: 0.25 }}
                          variants={scaleIn(i * 0.08)}
                          className="flex items-center gap-3 p-4 bg-linear-to-r from-primary/5 to-accent/5 rounded-xl border border-primary/10"
                        >
                          <Award className="w-6 h-6 text-primary shrink-0" />
                          <span className="font-medium text-foreground">{ach}</span>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            )}
          </Tabs>

          {/* FINAL CTA */}
          <motion.section
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, amount: 0.25 }}
            variants={fadeInUp}
            className="mt-16 text-center"
          >
            <Card className="border-primary/20">
              <CardContent className="p-8 sm:p-10">
                <h2 className="text-2xl font-bold mb-6">Explore This Project</h2>
                <div className="flex flex-wrap gap-4 justify-center">
                  <AnimatedButton className="btn-outline-premium">
                    <a href={project.links.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                      <Github className="w-5 h-5" />
                      Source Code
                    </a>
                  </AnimatedButton>

                  {project.links.report && (
                    <AnimatedButton className="btn-outline-premium">
                      <a href={project.links.report} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                        <FileText className="w-5 h-5" />
                        Project Report
                      </a>
                    </AnimatedButton>
                  )}

                  {project.links.dashboard && (
                    <AnimatedButton className="btn-filled-premium">
                      <Link href={project.links.dashboard} className="flex items-center gap-2">
                        <BarChart3 className="w-5 h-5" />
                        Dashboard
                      </Link>
                    </AnimatedButton>
                  )}
                </div>

                <RelatedProjects current={project} />
              </CardContent>
            </Card>
          </motion.section>
        </div>
      </main>
      <Footer />

      {/* LIGHTBOX - ALL BUTTONS FIXED */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            className="fixed inset-0 z-200 flex items-center justify-center bg-black/95 backdrop-blur-sm p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeLightbox}
          >
            <motion.div
              className="relative max-w-6xl w-full"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="text-white/80 text-sm">
                  {galleryIndex + 1} / {project.gallery.length}
                </div>
                <div className="flex items-center gap-2">
                  <AnimatedButton variant="ghost" size="sm" onClick={() => setAutoPlay(v => !v)} className="text-white hover:bg-white/15">
                    {autoPlay ? <Pause className="w-4 h-4 mr-1" /> : <Play className="w-4 h-4 mr-1" />}
                    {autoPlay ? "Pause" : "Play"}
                  </AnimatedButton>
                  <AnimatedButton variant="ghost" size="icon" onClick={() => window.open(selectedImage!, "_blank")} className="text-white hover:bg-white/15">
                    <Maximize2 className="w-5 h-5" />
                  </AnimatedButton>
                  <AnimatedButton variant="ghost" size="icon" onClick={handleCopyImageLink} className="text-white hover:bg-white/15">
                    <Link2 className="w-5 h-5" />
                  </AnimatedButton>
                  <AnimatedButton variant="ghost" size="icon" onClick={handleDownloadImage} className="text-white hover:bg-white/15">
                    <Download className="w-5 h-5" />
                  </AnimatedButton>
                  <AnimatedButton variant="ghost" size="icon" onClick={closeLightbox} className="text-white hover:bg-white/15">
                    <ChevronRight className="w-5 h-5" />
                  </AnimatedButton>
                </div>
              </div>

              <div className="relative aspect-video bg-black rounded-lg overflow-hidden shadow-2xl">
                <Image src={selectedImage} alt="Full-size" fill className="object-contain" priority />
              </div>

              {project.gallery.length > 1 && (
                <>
                  <AnimatedButton variant="ghost" size="icon" onClick={goPrev} className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20">
                    <ChevronLeftIcon className="w-8 h-8" />
                  </AnimatedButton>
                  <AnimatedButton variant="ghost" size="icon" onClick={goNext} className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20">
                    <ChevronRight className="w-8 h-8" />
                  </AnimatedButton>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx>{`
        .animate-on-scroll {
          opacity: 0;
          transform: translateY(30px);
        }
        .animate-on-scroll.visible {
          animation: fade-in-up 0.8s var(--motion-ease-standard) forwards;
        }
      `}</style>
    </>
  );
}