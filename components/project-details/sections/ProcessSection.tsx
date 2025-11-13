"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { BarChart3, GitBranch, Target } from "lucide-react"
import { Project } from "@/lib/types"
import { slideInX } from "@/lib/motion"

const iconMap = {
  Target,
  BarChart3,
  GitBranch,
} as const

export default function ProcessSection({ project }: { project: Project }) {
  return (
    <Card className="animate-on-scroll">
      <CardContent className="p-6 sm:p-8">
        <h2 className="text-2xl sm:text-3xl font-bold mb-8 flex items-center gap-3">
          <BarChart3 className="w-7 h-7 text-primary" /> Development Process
        </h2>

        <div className="relative pl-12 space-y-12 before:absolute before:left-6 before:top-0 before:bottom-0 before:w-0.5 before:bg-primary/20">
          {project.process.map((step, i) => {
            const Icon = iconMap[step.icon as keyof typeof iconMap] ?? Target
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
                  <h3 className="font-semibold flex items-center gap-2 text-foreground">
                    <GitBranch className="w-4 h-4 text-primary" />
                    {step.step}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">{step.description}</p>
                </div>
              </motion.div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
