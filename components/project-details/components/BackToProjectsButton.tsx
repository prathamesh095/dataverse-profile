"use client"

import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export const BackToProjectsButton = () => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, ease: "easeOut" }}
  >
    <Button
      asChild
      variant="ghost"
      className={cn(
        "fixed left-4 top-20 sm:top-24 z-40 flex items-center gap-2 px-4 py-2 rounded-full shadow-md",
        "border border-primary/20 bg-background/80 backdrop-blur-md",
        "hover:bg-primary/10 hover:text-primary transition-all duration-200"
      )}
    >
      <Link href="/projects" aria-label="Back to Projects">
        <ChevronLeft className="w-5 h-5" />
        Back
      </Link>
    </Button>
  </motion.div>
)
