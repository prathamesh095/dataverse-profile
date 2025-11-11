"use client"

import { useEffect, useRef, useState } from "react"

interface AnimatedCounterProps {
  end: number
  duration?: number
  prefix?: string
  suffix?: string
  className?: string
}

export function AnimatedCounter({
  end,
  duration = 2000,
  prefix = "",
  suffix = "",
  className = "",
}: AnimatedCounterProps) {
  const [count, setCount] = useState(0)
  const [hasAnimated, setHasAnimated] = useState(false)
  const elementRef = useRef<HTMLSpanElement>(null)
  const frameRef = useRef<number>()

  useEffect(() => {
    const el = elementRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true)
          observer.unobserve(el) // unobserve once triggered
        }
      },
      { threshold: 0.25 } // trigger when 25% visible
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [hasAnimated])

  useEffect(() => {
    if (!hasAnimated) return

    let startTime: number | null = null
    const startValue = 0
    const endValue = end

    const animate = (time: number) => {
      if (startTime === null) startTime = time
      const progress = Math.min((time - startTime) / duration, 1)

      // easeOutCubic for smoother natural feel
      const eased = 1 - Math.pow(1 - progress, 3)
      const value = Math.floor(startValue + eased * (endValue - startValue))

      setCount(value)

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate)
      }
    }

    frameRef.current = requestAnimationFrame(animate)

    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current)
    }
  }, [hasAnimated, end, duration])

  return (
    <span
      ref={elementRef}
      className={className}
      aria-label={`${prefix}${end}${suffix}`}
    >
      {prefix}
      {count.toLocaleString()}
      {suffix}
    </span>
  )
}
