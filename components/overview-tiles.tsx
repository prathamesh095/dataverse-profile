"use client"

import { motion, useMotionValue, useTransform } from "framer-motion"
import {
  Code2,
  Database,
  Brain,
  BarChart3,
  Cpu,
  Zap
} from "lucide-react"
import React, { useState, useCallback } from "react"

const tiles = [
  {
    icon: Code2,
    title: "Data-Driven Development",
    description:
      "Clean architecture and modern tooling to transform data into elegant, functional products."
  },
  {
    icon: Database,
    title: "Robust Data Architecture",
    description:
      "Designing resilient data models, optimized queries, and ETL pipelines that scale with your needs."
  },
  {
    icon: Brain,
    title: "Machine Learning",
    description:
      "Building predictive, interpretable systems that turn information into intelligence."
  },
  {
    icon: BarChart3,
    title: "Business Intelligence",
    description:
      "Delivering KPI dashboards and visual analytics that empower informed decisions."
  },
  {
    icon: Cpu,
    title: "Automation & AI",
    description:
      "Streamlining repetitive workflows using AI-assisted and rules-based automation."
  },
  {
    icon: Zap,
    title: "Performance Optimization",
    description:
      "Focusing on responsiveness, scalability, and cost-efficiency for data-centric applications."
  }
]

export function OverviewTiles() {
  return (
    <section
      aria-labelledby="overview"
      className="relative w-full py-24 sm:py-28 bg-transparent"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2
            id="overview"
            className="text-4xl sm:text-5xl font-extrabold gradient-text"
          >
            What I Do
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Each solution blends code, data, and insight — engineered for
            clarity, speed, and scalability.
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {tiles.map((tile, i) => (
            <DynamicTile key={tile.title} tile={tile} index={i} />
          ))}
        </div>
      </div>

      {/* Glows */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute w-[400px] h-[400px] bg-primary/10 blur-[160px] rounded-full top-[20%] left-[10%]" />
        <div className="absolute w-[300px] h-[300px] bg-accent/10 blur-[120px] rounded-full bottom-[10%] right-[10%]" />
      </div>
    </section>
  )
}

/* ───────────────────────────────
   Subcomponent: Interactive Tile
   ─────────────────────────────── */
function DynamicTile({
  tile,
  index
}: {
  tile: { icon: any; title: string; description: string }
  index: number
}) {
  const Icon = tile.icon
  const [hovered, setHovered] = useState(false)

  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const rotateX = useTransform(y, [-40, 40], [8, -8])
  const rotateY = useTransform(x, [-40, 40], [-8, 8])

  const handleMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = e.currentTarget.getBoundingClientRect()
      x.set(e.clientX - rect.left - rect.width / 2)
      y.set(e.clientY - rect.top - rect.height / 2)
    },
    [x, y]
  )

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.8 }}
      viewport={{ once: true }}
      className="w-full"
    >
      <motion.div
        className={`
          relative p-8 rounded-2xl border border-border w-full h-[300px]
          bg-card/70 backdrop-blur-xl shadow-md flex flex-col justify-between
          transition-all duration-300 cursor-pointer
          hover:shadow-2xl hover:border-primary/40
          ${hovered ? "animate-glow-primary" : ""}
        `}
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
          boxShadow: hovered ? "var(--midnight-glow)" : undefined
        }}
        onMouseMove={handleMove}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => {
          setHovered(false)
          x.set(0)
          y.set(0)
        }}
      >
        {/* Glow border */}
        <motion.div
          animate={{ opacity: hovered ? 1 : 0 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0 rounded-2xl bg-linear-to-r
          from-primary/20 via-accent/20 to-transparent blur-[3px] pointer-events-none"
        />

        {/* Icon */}
        <div className="flex items-center justify-center w-14 h-14 rounded-xl mb-6 bg-primary/10">
          <Icon className="w-7 h-7 text-primary" />
        </div>

        {/* Title & Description */}
        <h3 className="text-xl font-semibold mb-3">{tile.title}</h3>
        <p className="text-muted-foreground text-sm leading-relaxed">
          {tile.description}
        </p>

        {/* Underline */}
        <motion.div
          className="mt-6 h-0.5 w-0 bg-linear-to-r from-primary to-accent rounded-full"
          animate={{ width: hovered ? "100%" : "0%" }}
          transition={{ duration: 0.45 }}
        />
      </motion.div>
    </motion.div>
  )
}

export default OverviewTiles
