"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Lightbulb, Target, Sparkles } from "lucide-react"
import { Project } from "@/lib/types"
import { fadeInUp } from "@/lib/motion"

export default function LearningsSection({ project }: { project: Project }) {
  const sections = [
    { title: "Key Learnings", icon: Lightbulb, items: project.keyLearnings },
    { title: "Outcomes & Impact", icon: Target, items: project.outcomes },
  ]

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {sections.map(({ title, icon: Icon, items }) => (
        <Card key={title} className="animate-on-scroll">
          <CardContent className="p-6 sm:p-8">
            <h2 className="text-xl sm:text-2xl font-bold mb-6 flex items-center gap-3">
              <Icon className="w-7 h-7 text-primary" /> {title}
            </h2>
            <ul className="space-y-4">
              {items.map((item, i) => (
                <motion.li
                  key={i}
                  initial="initial"
                  whileInView="animate"
                  viewport={{ once: true, amount: 0.25 }}
                  variants={fadeInUp}
                  transition={{ delay: i * 0.08 }}
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
  )
}
