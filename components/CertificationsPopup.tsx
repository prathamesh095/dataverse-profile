// components/CertificationsPopup.tsx
"use client"

import { useState, useMemo, useCallback, useEffect, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { X, Award, Search, XCircle } from "lucide-react"
import { motion, AnimatePresence, Variants } from "framer-motion"
import { certifications } from "@/lib/certifications"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface CertificationsPopupProps {
  isOpen: boolean
  onClose: () => void
}

export function CertificationsPopup({ isOpen, onClose }: CertificationsPopupProps) {
  const [filter, setFilter] = useState<string>("All")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const [searchQuery, setSearchQuery] = useState<string>("")
  const modalRef = useRef<HTMLDivElement>(null)

  // 🖱️ Click outside to close
  useEffect(() => {
    if (!isOpen) return
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose()
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [isOpen, onClose])

  // 🧠 Generate categories dynamically
  const categoryMap = useMemo(
    () =>
      new Map(
        certifications.map((cert) => [
          cert.category.split("/")[1]?.trim() || cert.category,
          cert.category,
        ])
      ),
    []
  )

  const categories = useMemo(
    () => ["All", ...Array.from(categoryMap.keys()).sort()],
    [categoryMap]
  )

  // 🔍 Filter + Sort logic
  const filteredCertifications = useMemo(() => {
    return certifications
      .filter((cert) => {
        const fullCategory = categoryMap.get(filter) || filter
        return filter === "All" || cert.category === fullCategory
      })
      .filter(
        (cert) =>
          cert.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          cert.skills.some((s) =>
            s.toLowerCase().includes(searchQuery.toLowerCase())
          ) ||
          cert.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .sort((a, b) => {
        const dateA = new Date(a.date).getTime()
        const dateB = new Date(b.date).getTime()
        return sortOrder === "asc" ? dateA - dateB : dateB - dateA
      })
  }, [filter, searchQuery, sortOrder, categoryMap])

  const toggleSortOrder = useCallback(
    () => setSortOrder((prev) => (prev === "asc" ? "desc" : "asc")),
    []
  )

  // 🎬 Motion variants (type-safe)
  const backdropVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
  }

  const modalVariants: Variants = {
    hidden: { scale: 0.9, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: { duration: 0.25, ease: "easeOut" },
    },
    exit: {
      scale: 0.9,
      opacity: 0,
      transition: { duration: 0.2, ease: "easeInOut" },
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
          aria-labelledby="certifications-title"
        >
          <motion.div
            key="modal"
            ref={modalRef}
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="w-full max-w-4xl max-h-[80vh] overflow-y-auto rounded-2xl bg-background shadow-2xl ring-1 ring-border/50"
          >
            <Card className="border-0 bg-linear-to-br from-primary/10 to-secondary/10">
              <CardContent className="p-6">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                  <h2
                    id="certifications-title"
                    className="text-2xl font-bold bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent"
                  >
                    My Certifications
                  </h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onClose}
                    aria-label="Close popup"
                    className="hover:bg-primary/10"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>

                {/* Search + Sort */}
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Search by title, skill, or category..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 pr-10 bg-background/80 border-border/50"
                    />
                    {searchQuery && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSearchQuery("")}
                        className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6 p-0 hover:bg-muted"
                      >
                        <XCircle className="w-4 h-4 text-muted-foreground" />
                      </Button>
                    )}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={toggleSortOrder}
                    className="border-secondary text-secondary hover:bg-secondary/10 shrink-0"
                  >
                    Sort by Date ({sortOrder === "asc" ? "Oldest" : "Newest"})
                  </Button>
                </div>

                {/* ✅ Category Filters - Fixed Visual Style */}
                <TooltipProvider>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {categories.map((shortCategory) => {
                      const isActive = filter === shortCategory
                      return (
                        <Tooltip key={shortCategory}>
                          <TooltipTrigger asChild>
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
                              <Button
                                size="sm"
                                onClick={() => setFilter(shortCategory)}
                                className={`font-medium px-3 py-1 transition-all duration-300 rounded-md ${
                                  isActive
                                    ? "bg-linear-to-r from-primary to-secondary text-white shadow-md hover:shadow-lg hover:brightness-110 border-none"
                                    : "border border-secondary text-secondary bg-background hover:bg-secondary/10"
                                }`}
                              >
                                {shortCategory}
                              </Button>
                            </motion.div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{categoryMap.get(shortCategory) || shortCategory}</p>
                          </TooltipContent>
                        </Tooltip>
                      )
                    })}
                  </div>
                </TooltipProvider>

                {/* Certifications List */}
                <div className="space-y-4">
                  {filteredCertifications.length > 0 ? (
                    filteredCertifications.map((cert) => (
                      <motion.div
                        key={cert.id}
                        whileHover={{ scale: 1.02 }}
                        transition={{ duration: 0.2 }}
                        className="rounded-lg border border-border/50 bg-card/80 p-4 shadow-sm hover:bg-card/95 transition-all"
                      >
                        <div className="flex items-center mb-3">
                          {cert.logo && (
                            <img
                              src={cert.logo}
                              alt={`${cert.issuer} logo`}
                              className="w-10 h-10 mr-3 object-contain rounded transition-transform duration-300 group-hover:scale-110"
                            />
                          )}
                          <div>
                            <h3 className="font-semibold text-lg">{cert.title}</h3>
                            <p className="text-sm text-muted-foreground">
                              {cert.issuer} • {cert.date}
                            </p>
                            <p className="text-xs text-accent font-medium">
                              {cert.category}
                            </p>
                          </div>
                        </div>

                        <p className="text-sm text-muted-foreground mb-2">
                          {cert.description}
                        </p>

                        <div className="flex flex-wrap gap-2 mb-2">
                          {cert.skills.map((skill, index) => (
                            <span
                              key={index}
                              className="text-xs bg-secondary/20 text-secondary px-2 py-1 rounded-full"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>

                        {/* ✅ Verify Button (same improved style) */}
                        <div className="flex justify-between items-center">
                          <p className="text-xs text-accent">
                            Status: {cert.status} • ID: {cert.credentialId}
                          </p>
                          {cert.verifyUrl && (
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                              <Button
                                size="sm"
                                asChild
                                className="bg-linear-to-r from-primary to-secondary text-white font-medium px-3 py-1 rounded-md shadow-sm hover:shadow-md hover:brightness-110 transition-all duration-300"
                              >
                                <a
                                  href={cert.verifyUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  aria-label={`Verify ${cert.title} on ${cert.issuer}`}
                                >
                                  <div className="flex items-center">
                                    <Award className="w-4 h-4 mr-1" />
                                    Verify
                                  </div>
                                </a>
                              </Button>
                            </motion.div>
                          )}
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <div className="text-center py-8 bg-card/50 rounded-lg border border-border/50">
                      <p className="text-muted-foreground text-lg font-medium">
                        No certifications match your search or filter.
                      </p>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSearchQuery("")
                          setFilter("All")
                        }}
                        className="mt-4 text-secondary hover:bg-secondary/10"
                      >
                        Reset Filters
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
