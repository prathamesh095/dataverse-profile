"use client"

import { useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { ChevronLeft, ChevronRight, Download, Link2, Maximize2, Pause, Play } from "lucide-react"
import { AnimatedButton } from "./AnimatedButton"

interface LightboxProps {
  selectedImage: string | null
  total: number
  index: number
  autoPlay: boolean
  onClose: () => void
  onPrev: () => void
  onNext: () => void
  onTogglePlay: () => void
  onDownload: () => void
  onCopyLink: () => void
}

export const Lightbox = ({
  selectedImage,
  total,
  index,
  autoPlay,
  onClose,
  onPrev,
  onNext,
  onTogglePlay,
  onDownload,
  onCopyLink,
}: LightboxProps) => {
  const handleKey = useCallback((e: KeyboardEvent) => {
    if (e.key === "Escape") onClose()
    else if (e.key === "ArrowLeft") onPrev()
    else if (e.key === "ArrowRight") onNext()
  }, [onClose, onPrev, onNext])

  useEffect(() => {
    window.addEventListener("keydown", handleKey)
    return () => window.removeEventListener("keydown", handleKey)
  }, [handleKey])

  return (
    <AnimatePresence>
      {selectedImage && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="relative max-w-6xl w-full"
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.95 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-3 text-white/80 text-sm select-none">
              <span>{index + 1} / {total}</span>
              <div className="flex items-center gap-2">
                <AnimatedButton variant="ghost" size="sm" onClick={onTogglePlay} className="text-white hover:bg-white/15">
                  {autoPlay ? <Pause className="w-4 h-4 mr-1" /> : <Play className="w-4 h-4 mr-1" />}
                  {autoPlay ? "Pause" : "Play"}
                </AnimatedButton>
                {[onCopyLink, onDownload, () => window.open(selectedImage, "_blank")].map((fn, i) => (
                  <AnimatedButton key={i} variant="ghost" size="icon" onClick={fn} className="text-white hover:bg-white/15">
                    {[<Link2 />, <Download />, <Maximize2 />][i]}
                  </AnimatedButton>
                ))}
              </div>
            </div>

            <div className="relative aspect-video bg-black rounded-lg overflow-hidden shadow-2xl">
              <Image
                src={selectedImage}
                alt="Full-size"
                fill
                className="object-contain"
                priority={false}
                sizes="90vw"
              />
            </div>

            {total > 1 && (
              <>
                <AnimatedButton variant="ghost" size="icon" onClick={onPrev} className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20">
                  <ChevronLeft className="w-8 h-8" />
                </AnimatedButton>
                <AnimatedButton variant="ghost" size="icon" onClick={onNext} className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20">
                  <ChevronRight className="w-8 h-8" />
                </AnimatedButton>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
