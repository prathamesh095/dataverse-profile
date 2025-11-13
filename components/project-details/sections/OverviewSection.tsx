"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Target } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Project } from "@/lib/types"
import { fadeInUp } from "@/lib/motion"

export default function OverviewSection({ project }: { project: Project }) {
  return (
    <Card className="animate-on-scroll">
      <CardContent className="p-6 sm:p-8 space-y-6">
        <motion.div variants={fadeInUp}>
          <h2 className="text-2xl sm:text-3xl font-bold flex items-center gap-3">
            <Target className="w-7 h-7 text-primary" /> Overview
          </h2>
          <p className="text-muted-foreground leading-relaxed mt-3">{project.fullDescription}</p>
        </motion.div>

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
  )
}
