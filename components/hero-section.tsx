"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Download,
  Mail,
  Github,
  Linkedin,
  Code2,
  Database,
  Brain,
  BarChart3,
  Award,
  Zap,
  LucideIcon,
} from "lucide-react";
import { AnimatedCounter } from "./animated-counter";
import { ResumeModal } from "./resume-modal";
import { projects } from "@/lib/types";

/* ===========================================
   🔹 ROLE DESCRIPTIONS & SKILL ICONS
   =========================================== */
const ROLES = [
  {
    title: "Data Analyst",
    description:
      "Turning raw data into clear, actionable insights through dashboards and reports that empower data-driven decisions.",
  },
  {
    title: "Data Scientist",
    description:
      "Designing predictive models, finding hidden patterns, and translating algorithms into business impact.",
  },
  {
    title: "ML Engineer",
    description:
      "Building, deploying and scaling machine learning systems that operate reliably in production.",
  },
  {
    title: "Business Intelligence Analyst",
    description:
      "Crafting KPIs, visual narratives, and dashboards that inform strategy and executive decisions.",
  },
] as const;

interface Skill {
  name: string;
  icon: LucideIcon;
  color: string;
}

const SKILLS: Skill[] = [
  { name: "Python", icon: Code2, color: "var(--color-accent)" },
  { name: "SQL", icon: Database, color: "var(--color-chart-1)" },
  { name: "Tableau", icon: BarChart3, color: "var(--color-tertiary)" },
  { name: "Power BI", icon: BarChart3, color: "var(--color-chart-5)" },
  { name: "Machine Learning", icon: Brain, color: "var(--color-status-success)" },
  { name: "Big Data", icon: Database, color: "var(--color-primary)" },
  { name: "AI", icon: Zap, color: "var(--color-status-warning)" },
  { name: "Statistics", icon: Award, color: "var(--color-secondary)" },
];

const uniqueFontStyle = {
  fontFamily: "'Inter', sans-serif",
  fontWeight: 900,
  letterSpacing: "-0.025em",
};

/* ===========================================
   🔹 TYPEWRITER HOOK
   =========================================== */
function useTypewriter(
  texts: readonly { description: string }[],
  {
    typingSpeed = 28,
    deletingSpeed = 14,
    pauseAfterTyping = 1500,
  } = {}
) {
  const shouldReduceMotion = useReducedMotion();
  const [roleIndex, setRoleIndex] = useState(0);
  const [display, setDisplay] = useState("");
  const phaseRef = useRef<"typing" | "pause" | "deleting">("typing");
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    };
  }, []);

  useEffect(() => {
    if (shouldReduceMotion) {
      setDisplay(texts[roleIndex].description);
      return;
    }

    const currentDescription = texts[roleIndex].description;
    const phase = phaseRef.current;

    if (phase === "typing") {
      if (display.length < currentDescription.length) {
        timeoutRef.current = window.setTimeout(() => {
          setDisplay((d) => currentDescription.slice(0, d.length + 1));
        }, typingSpeed);
      } else {
        phaseRef.current = "pause";
        timeoutRef.current = window.setTimeout(() => {
          phaseRef.current = "deleting";
          setDisplay((d) => d);
        }, pauseAfterTyping);
      }
      return;
    }

    if (phase === "deleting") {
      if (display.length > 0) {
        timeoutRef.current = window.setTimeout(() => {
          setDisplay((d) => currentDescription.slice(0, d.length - 1));
        }, deletingSpeed);
      } else {
        phaseRef.current = "typing";
        setRoleIndex((i) => (i + 1) % texts.length);
      }
      return;
    }
  }, [display, roleIndex, texts, typingSpeed, deletingSpeed, pauseAfterTyping, shouldReduceMotion]);

  return { display, roleIndex };
}

/* ===========================================
   🔹 SEEDED PARTICLE GENERATOR
   =========================================== */
type Particle = { left: number; top: number; delay: number; duration: number; size: number };

function seededRng(seed: number) {
  return function () {
    seed ^= seed << 13;
    seed ^= seed >>> 17;
    seed ^= seed << 5;
    return ((seed < 0 ? ~seed + 1 : seed) % 1000000) / 1000000;
  };
}

/* ===========================================
   ⚡ HERO SECTION
   =========================================== */
export function HeroSection(): JSX.Element {
  const [mounted, setMounted] = useState(false);
  const [showResumeModal, setShowResumeModal] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const [particles, setParticles] = useState<Particle[] | null>(null);

  useEffect(() => {
    setMounted(true);
    const rng = seededRng(Date.now() % 2147483647);
    const arr: Particle[] = Array.from({ length: 12 }).map(() => ({
      left: Math.round(rng() * 10000) / 100,
      top: Math.round(rng() * 10000) / 100,
      delay: Math.round(rng() * 3000),
      duration: 3000 + Math.round(rng() * 7000),
      size: 1 + Math.round(rng() * 6),
    }));
    setParticles(arr);
  }, []);

  const { display, roleIndex } = useTypewriter(ROLES, {
    typingSpeed: 26,
    deletingSpeed: 12,
    pauseAfterTyping: 1600,
  });

  const { projectCount, technologyCount } = useMemo(() => {
    const projectCount = projects.length;
    const allTechnologies = projects.flatMap((p) => p.technologies);
    const uniqueTechnologies = new Set(allTechnologies);
    const technologyCount = uniqueTechnologies.size;
    return { projectCount, technologyCount };
  }, []);

  const handleResumeClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setShowResumeModal(true);
  }, []);

  return (
    <>
      <section
        className="relative min-h-screen flex items-center justify-center pt-16 overflow-hidden"
        style={{
          background:
            "linear-gradient(to bottom right, var(--color-primary)/5, transparent, var(--color-accent)/5)",
        }}
      >
        {mounted &&
          !shouldReduceMotion &&
          particles &&
          particles.map((p, i) => (
            <motion.div
              key={`p-${i}`}
              aria-hidden
              className="absolute rounded-full"
              style={{
                backgroundColor:
                  "color-mix(in srgb, var(--color-primary) 30%, transparent)",
                left: `${p.left}%`,
                top: `${p.top}%`,
                width: `${p.size}px`,
                height: `${p.size}px`,
              }}
              animate={{
                y: [0, -12 - p.size, 0],
                opacity: [0.35, 1, 0.35],
              }}
              transition={{
                duration: p.duration / 1000,
                repeat: Infinity,
                delay: p.delay / 1000,
                repeatType: "mirror",
                ease: "easeInOut",
              }}
            />
          ))}

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-8 max-w-4xl">
          <motion.h1
            style={uniqueFontStyle}
            className="text-4xl sm:text-6xl lg:text-7xl font-black bg-clip-text text-transparent gradient-text"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
          >
            Prathamesh Pawar
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p
              className="text-xl sm:text-2xl lg:text-3xl font-semibold"
              style={{ color: "var(--color-muted-foreground)" }}
            >
              <span className="inline-flex items-center">
                <span
                  className="mr-2 text-lg"
                  style={{ color: "var(--color-primary)" }}
                >
                  ✦
                </span>
                <span aria-atomic="true" aria-live="polite">
                  {ROLES[roleIndex].title}
                </span>
              </span>
            </p>
          </motion.div>

          <motion.p
            className="text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed min-h-14 mt-3"
            style={{ color: "var(--color-muted-foreground)" }}
            aria-live="polite"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.08 }}
          >
            <span>{display}</span>
            {!shouldReduceMotion && (
              <span
                className="inline-block align-middle ml-1 h-[1.2em] w-2 animate-blink-cursor"
                style={{ backgroundColor: "var(--color-accent)" }}
                aria-hidden
              />
            )}
          </motion.p>

          {/* 🔹 Stat Counters */}
          <div className="grid grid-cols-3 gap-8 max-w-md mx-auto py-8">
            <StatCounter end={projectCount} label="Projects" icon={Code2} />
            <GrowingStat />
            <StatCounter end={technologyCount} label="Technologies" icon={Database} />
          </div>

          <div className="flex flex-wrap gap-3 justify-center max-w-3xl mx-auto">
            {SKILLS.map((skill, i) => (
              <SkillBadge key={skill.name} {...skill} index={i} />
            ))}
          </div>

          <div className="flex flex-col lg:flex-row gap-4 justify-center items-center mt-4">
            <Button
              size="lg"
              className="btn btn-primary hover-lift"
              onClick={handleResumeClick}
              aria-label="View and download resume"
            >
              <Download className="w-4 h-4 mr-2" />
              View & Download Resume
            </Button>

            <Button size="lg" variant="outline" className="btn btn-outline hover-lift" asChild>
              <Link href="/projects" className="flex items-center">
                View Projects
                <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>

          <div className="flex justify-center space-x-6 mt-6">
            {[
              { icon: Github, href: "https://github.com/prathamesh095", label: "GitHub" },
              { icon: Linkedin, href: "https://www.linkedin.com/in/prathamesh095/", label: "LinkedIn" },
              { icon: Mail, href: "mailto:pawar.prathamesh@outlook.com", label: "Email" },
            ].map(({ icon: Icon, href, label }) => (
              <SocialButton key={label} icon={Icon} href={href} label={label} />
            ))}
          </div>
        </div>
      </section>

      <ResumeModal isOpen={showResumeModal} onClose={() => setShowResumeModal(false)} />

      <style global jsx>{`
        @keyframes blink-cursor {
          0% { opacity: 1; }
          50% { opacity: 0; }
          100% { opacity: 1; }
        }
        .animate-blink-cursor {
          animation: blink-cursor 1s steps(2, start) infinite;
        }
      `}</style>
    </>
  );
}

/* ===========================================
   ⚙️ SUBCOMPONENTS
   =========================================== */
const StatCounter = React.memo(function StatCounter({
  end,
  label,
  icon: Icon,
}: {
  end: number;
  label: string;
  icon: LucideIcon;
}) {
  return (
    <div className="text-center space-y-2">
      <div className="flex items-center justify-center space-x-2 mb-1">
        {Icon && <Icon className="w-5 h-5" style={{ color: "var(--color-primary)" }} />}
        <div className="text-2xl font-bold" style={{ color: "var(--color-primary)" }}>
          <AnimatedCounter end={end} suffix="+" />
        </div>
      </div>
      <div className="text-sm font-medium" style={{ color: "var(--color-muted-foreground)" }}>
        {label}
      </div>
    </div>
  );
});

const GrowingStat = React.memo(function GrowingStat() {
  return (
    <div className="text-center space-y-2">
      <div className="flex items-center justify-center space-x-2 mb-1">
        <Award className="w-5 h-5 text-yellow-500" />
        <div className="text-2xl font-bold text-yellow-500 flex items-center justify-center gap-1">
          🚀 <span>Growing</span>
        </div>
      </div>
      <div className="text-sm font-medium" style={{ color: "var(--color-muted-foreground)" }}>
        Journey Begins
      </div>
    </div>
  );
});

const SkillBadge = React.memo(function SkillBadge({
  name,
  icon: Icon,
  color,
  index,
}: Skill & { index: number }) {
  return (
    <motion.span
      className="inline-flex items-center justify-center text-sm font-medium px-3 py-2 rounded-full border bg-card/60 backdrop-blur-sm"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.06 }}
      whileHover={{ scale: 1.04, y: -2 }}
      aria-label={`Skill: ${name}`}
      style={{
        borderColor: "var(--color-border)",
        color,
      }}
    >
      <Icon className="w-3.5 h-3.5 mr-1.5" style={{ color }} />
      {name}
    </motion.span>
  );
});

const SocialButton = React.memo(function SocialButton({
  icon: Icon,
  href,
  label,
}: {
  icon: LucideIcon;
  href: string;
  label: string;
}) {
  return (
    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={label}
        className="group p-3 rounded-xl border backdrop-blur-sm transition-all duration-300 block"
        style={{
          backgroundColor:
            "color-mix(in srgb, var(--color-surface-level-1) 80%, transparent)",
          borderColor: "var(--color-border)",
        }}
      >
        <Icon
          className="w-6 h-6 transition-colors duration-300"
          style={{ color: "var(--color-primary)" }}
        />
      </a>
    </motion.div>
  );
});

StatCounter.displayName = "StatCounter";
SkillBadge.displayName = "SkillBadge";
SocialButton.displayName = "SocialButton";
GrowingStat.displayName = "GrowingStat";
