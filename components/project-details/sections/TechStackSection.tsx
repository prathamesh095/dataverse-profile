"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Code, Layers } from "lucide-react"
import { scaleIn } from "@/lib/motion"
import { Project } from "@/lib/types"

export default function TechStackSection({ project }: { project: Project }) {
  return (
    <Card className="animate-on-scroll">
      <CardContent className="p-6 sm:p-8">
        <h2 className="text-2xl sm:text-3xl font-bold mb-6 flex items-center gap-3">
          <Code className="w-7 h-7 text-primary" /> Tech Stack
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
  )
}
