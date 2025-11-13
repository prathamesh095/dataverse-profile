"use client"

import { motion, useReducedMotion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Github, FileText, BarChart3 } from "lucide-react"
import { AnimatedButton } from "../components/AnimatedButton"
import { fadeInUp, scaleIn } from "@/lib/motion"
import { Project } from "@/lib/types"

export default function HeroSection({ project }: { project: Project }) {
  const prefersReducedMotion = useReducedMotion()

  return (
    <motion.section
      className="relative min-h-[50vh] flex items-center justify-center overflow-hidden pt-20 pb-8"
      initial="initial"
      animate="animate"
      variants={{
        initial: { opacity: 0 },
        animate: { opacity: 1, transition: { duration: 0.6 } },
      }}
    >
      <div className="absolute inset-0 bg-linear-to-br from-primary/5 via-accent/5 to-transparent" />
      <div className="relative z-10 text-center max-w-4xl mx-auto px-4 sm:px-6">
        <motion.div variants={fadeInUp}>
          <Badge className="mb-4 px-3 py-1 text-sm">
            {project.category} • {project.domain} • {project.year}
          </Badge>
        </motion.div>

        <motion.h1
          className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-linear-to-r from-primary to-accent"
          variants={fadeInUp}
        >
          {project.title}
        </motion.h1>

        <motion.p
          className="text-muted-foreground mb-8 max-w-xl mx-auto text-base sm:text-lg"
          variants={fadeInUp}
        >
          {project.tagline}
        </motion.p>

        <motion.div
          className="relative mx-auto mb-8 max-w-3xl rounded-xl overflow-hidden shadow-2xl border border-primary/10"
          {...scaleIn(0.25)}
          whileHover={!prefersReducedMotion ? { y: -4 } : {}}
        >
          <Image
            src={project.image || "/placeholder.svg"}
            alt={project.title}
            width={1200}
            height={600}
            priority
            className="w-full h-auto object-cover"
          />
        </motion.div>

        <motion.div
          className="flex flex-wrap gap-4 justify-center"
          variants={fadeInUp}
        >
          {project.links.github && (
            <AnimatedButton size="lg" className="btn-outline-premium">
              <a href={project.links.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                <Github className="w-5 h-5" /> Source
              </a>
            </AnimatedButton>
          )}

          {project.links.report && (
            <AnimatedButton size="lg" className="btn-outline-premium">
              <a href={project.links.report} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                <FileText className="w-5 h-5" /> Report
              </a>
            </AnimatedButton>
          )}

          {project.links.dashboard && (
            <AnimatedButton size="lg" className="btn-filled-premium">
              <Link href={project.links.dashboard} className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" /> Dashboard
              </Link>
            </AnimatedButton>
          )}
        </motion.div>
      </div>
    </motion.section>
  )
}
