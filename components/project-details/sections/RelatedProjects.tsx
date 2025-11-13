"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AnimatedButton } from "../components/AnimatedButton"
import { Eye, Github, BarChart3 } from "lucide-react"
import { Project, projects } from "@/lib/types"
import { scaleIn } from "@/lib/motion"

export default function RelatedProjects({ current }: { current: Project }) {
  const related = projects
    .filter(
      (p) => p.id !== current.id && (p.domain === current.domain || p.category === current.category)
    )
    .slice(0, 3)

  if (!related.length) return null

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
            <Card className="flex flex-col h-full overflow-hidden border border-primary/10 bg-card/60 backdrop-blur-sm hover:shadow-xl transition-all hover:-translate-y-1 duration-300">
              <div className="relative h-40 overflow-hidden">
                <Image
                  src={p.image}
                  alt={p.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent" />
                <Badge className="absolute top-3 left-3 bg-accent text-white">{p.category}</Badge>
              </div>
              <CardContent className="p-5 flex flex-col flex-1">
                <div className="flex items-center mb-2">
                  <BarChart3 className="w-4 h-4 text-primary mr-2" />
                  <h4 className="font-semibold line-clamp-2">{p.title}</h4>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{p.tagline}</p>
                <div className="mt-auto flex gap-2 pt-2">
                  <AnimatedButton size="sm" className="btn-filled-premium">
                    <Link href={`/projects/${p.id}`} className="flex items-center gap-1">
                      <Eye className="w-4 h-4" /> View
                    </Link>
                  </AnimatedButton>
                  <AnimatedButton size="sm" className="btn-outline-premium">
                    <a href={p.links.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1">
                      <Github className="w-4 h-4" /> Code
                    </a>
                  </AnimatedButton>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
