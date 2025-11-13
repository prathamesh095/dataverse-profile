"use client"

import { useState, useMemo, useRef, useEffect, useCallback } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { X, Trophy } from "lucide-react"
import { motion, AnimatePresence, type Variants } from "framer-motion"
import { achievements } from "@/lib/data/achievements "

const CATEGORIES = ["All", "Hackathons", "Competitions", "Leadership", "Certifications"] as const

export function AchievementsPopup({
  isOpen,
  onClose,
}: {
  isOpen: boolean
  onClose: () => void
}) {
  const [filter, setFilter] = useState("All")
  const modalRef = useRef<HTMLDivElement>(null)

  const filteredAchievements = useMemo(() => {
    if (!achievements?.length) return []
    return filter === "All"
      ? achievements
      : achievements.filter((a) => a.category === filter)
  }, [filter])

  const handleCategoryClick = useCallback((category: string) => setFilter(category), [])

  // 🖱️ Detect outside click + ESC key
  useEffect(() => {
    if (!isOpen) return
    const handleClickOutside = (e: MouseEvent) =>
      !modalRef.current?.contains(e.target as Node) && onClose()
    const handleEsc = (e: KeyboardEvent) => e.key === "Escape" && onClose()
    document.addEventListener("mousedown", handleClickOutside, { passive: true })
    document.addEventListener("keydown", handleEsc)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("keydown", handleEsc)
    }
  }, [isOpen, onClose])

  // ✅ Typed variants (fixes TS error)
  const backdropVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
  }

  const modalVariants: Variants = {
    hidden: { opacity: 0, scale: 0.95, y: 10 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { type: "spring", stiffness: 250, damping: 20 },
    },
    exit: {
      opacity: 0,
      scale: 0.9,
      y: 10,
      transition: { duration: 0.2 },
    },
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="backdrop"
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="achievements-title"
        >
          <motion.div
            ref={modalRef}
            key="modal"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="w-full max-w-2xl max-h-[80vh] overflow-y-auto rounded-2xl bg-background shadow-2xl ring-1 ring-border/50 scrollbar-thin scrollbar-thumb-accent/30 hover:scrollbar-thumb-accent/50"
          >
            <Card className="border-0 bg-linear-to-br from-primary/10 to-accent/10">
              <CardContent className="p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <h2
                    id="achievements-title"
                    className="text-2xl font-bold bg-linear-to-r from-primary to-accent bg-clip-text text-transparent"
                  >
                    My Achievements
                  </h2>
                  <Button
                    aria-label="Close achievements popup"
                    variant="ghost"
                    size="sm"
                    onClick={onClose}
                    className="hover:bg-primary/10 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {CATEGORIES.map((category) => (
                    <Button
                      key={category}
                      variant={filter === category ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleCategoryClick(category)}
                      className={
                        filter === category
                          ? "bg-linear-to-r from-primary to-accent text-white"
                          : "border-accent text-accent hover:bg-accent/10"
                      }
                    >
                      {category}
                    </Button>
                  ))}
                </div>

                {/* Achievements List */}
                {filteredAchievements.length ? (
                  <div className="space-y-4">
                    {filteredAchievements.map((achievement) => (
                      <motion.div
                        key={achievement.id}
                        whileHover={{ scale: 1.02 }}
                        transition={{ duration: 0.2 }}
                        className="rounded-lg border border-border/50 bg-card/80 p-4 shadow-sm hover:bg-card/95 transition-all"
                      >
                        <div className="flex items-center mb-2">
                          <Trophy className="mr-2 h-5 w-5 text-primary" />
                          <h3 className="font-semibold">{achievement.title}</h3>
                        </div>
                        <p className="text-sm text-muted-foreground">{achievement.description}</p>
                        <div className="mt-2 flex justify-between text-xs text-muted-foreground">
                          <span className="text-accent">
                            {achievement.category} • {achievement.year}
                          </span>
                          {achievement.tags && (
                            <span className="text-secondary">{achievement.tags}</span>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-sm text-muted-foreground">
                    No achievements found in this category.
                  </p>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
