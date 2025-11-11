// components/AchievementsPopup.tsx
"use client"

import { useState, useMemo, useCallback, useRef, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { X, Trophy } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { achievements } from "@/lib/data/achievements "

interface AchievementsPopupProps {
  isOpen: boolean
  onClose: () => void
}

export function AchievementsPopup({ isOpen, onClose }: AchievementsPopupProps) {
  const [filter, setFilter] = useState<string>("All")
  const modalRef = useRef<HTMLDivElement>(null)

  const categories = useMemo(
    () => ["All", "Hackathons", "Competitions", "Leadership", "Certifications"],
    []
  )

  const filteredAchievements = useMemo(
    () =>
      filter === "All"
        ? achievements
        : achievements.filter((a) => a.category === filter),
    [filter]
  )

  const handleCategoryClick = useCallback((category: string) => {
    setFilter(category)
  }, [])

  // 🖱️ Detect click outside modal
  useEffect(() => {
    if (!isOpen) return

    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose()
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen, onClose])

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
  }

  const modalVariants = {
    hidden: { scale: 0.9, opacity: 0 },
    visible: { scale: 1, opacity: 1, transition: { duration: 0.25 } },
    exit: { scale: 0.9, opacity: 0 },
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
            className="w-full max-w-2xl max-h-[80vh] overflow-y-auto rounded-2xl bg-background shadow-2xl ring-1 ring-border/50"
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
                  {categories.map((category) => (
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
                {filteredAchievements.length > 0 ? (
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
                        <p className="text-sm text-muted-foreground">
                          {achievement.description}
                        </p>
                        <div className="mt-2 flex justify-between text-xs text-muted-foreground">
                          <span className="text-accent">
                            {achievement.category} • {achievement.year}
                          </span>
                          {achievement.tags && (
                            <span className="text-secondary">
                              {achievement.tags}
                            </span>
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
