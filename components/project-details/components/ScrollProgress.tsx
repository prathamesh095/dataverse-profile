"use client"

import { useState, useEffect, memo } from "react"

export const ScrollProgress = memo(() => {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    let ticking = false
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollTop = window.scrollY
          const docHeight = document.documentElement.scrollHeight - window.innerHeight
          setProgress(docHeight > 0 ? scrollTop / docHeight : 0)
          ticking = false
        })
        ticking = true
      }
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-0.5 bg-transparent">
      <div
        className="h-full bg-primary/80 transition-[width] duration-150 ease-out"
        style={{ width: `${progress * 100}%` }}
      />
    </div>
  )
})
ScrollProgress.displayName = "ScrollProgress"
