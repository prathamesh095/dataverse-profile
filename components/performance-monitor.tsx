"use client"

import { useEffect } from "react"

export function PerformanceMonitor() {
  useEffect(() => {
    // Monitor Core Web Vitals
    if (typeof window !== "undefined" && "performance" in window) {
      // Largest Contentful Paint
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === "largest-contentful-paint") {
            console.log("[v0] LCP:", entry.startTime)
          }
        }
      })

      try {
        observer.observe({ entryTypes: ["largest-contentful-paint"] })
      } catch (e) {
        // Fallback for browsers that don't support this
      }

      // First Input Delay
      const fidObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === "first-input") {
            console.log("[v0] FID:", (entry as any).processingStart - entry.startTime)
          }
        }
      })

      try {
        fidObserver.observe({ entryTypes: ["first-input"] })
      } catch (e) {
        // Fallback for browsers that don't support this
      }

      return () => {
        observer.disconnect()
        fidObserver.disconnect()
      }
    }
  }, [])

  return null
}
