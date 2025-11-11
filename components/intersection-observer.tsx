"use client"

import type React from "react"
import { useEffect, useRef, useState, useCallback, RefObject } from "react"

// --- Hook Interfaces ---

interface UseIntersectionObserverProps {
  threshold?: number | number[]
  rootMargin?: string
  triggerOnce?: boolean
}

interface UseIntersectionObserverReturn {
    elementRef: RefObject<HTMLElement> // Use generic HTMLElement for broader use
    isIntersecting: boolean
}

/**
 * Custom hook to monitor an element's visibility in the viewport.
 */
export function useIntersectionObserver({
  threshold = 0.1,
  rootMargin = "0px",
  triggerOnce = true,
}: UseIntersectionObserverProps = {}): UseIntersectionObserverReturn {
  const [isIntersecting, setIsIntersecting] = useState(false)
  const [hasTriggered, setHasTriggered] = useState(false)
  // Use a RefObject that defaults to HTMLElement
  const elementRef = useRef<HTMLElement>(null) 

  const handleIntersection = useCallback(
    ([entry]: IntersectionObserverEntry[]) => {
      const isElementIntersecting = entry.isIntersecting

      if (isElementIntersecting && (!triggerOnce || !hasTriggered)) {
        setIsIntersecting(true)
        if (triggerOnce) {
          setHasTriggered(true)
          // Note: The observer will be cleaned up automatically in the main effect below
        }
      } else if (!triggerOnce) {
        // If not triggerOnce, update state on un-intersection as well
        setIsIntersecting(isElementIntersecting)
      }
    },
    [triggerOnce, hasTriggered], // hasTriggered is required here if triggerOnce is true
  )

  useEffect(() => {
    const element = elementRef.current
    if (!element) return

    const observer = new IntersectionObserver(handleIntersection, {
      threshold,
      rootMargin,
    })

    observer.observe(element)

    return () => {
      // Ensure we unobserve the element during cleanup
      if (element) {
        observer.unobserve(element)
      }
      observer.disconnect()
    }
  }, [threshold, rootMargin, handleIntersection])

  return { elementRef: elementRef as RefObject<HTMLElement>, isIntersecting }
}

// --- LazyLoad Component Interfaces ---

interface LazyLoadProps {
  children: React.ReactNode
  className?: string
  threshold?: number | number[]
  rootMargin?: string
  fallback?: React.ReactNode 
}

/**
 * Renders children only when they are close to or within the viewport,
 * providing a lightweight solution for lazy loading content sections.
 */
export function LazyLoad({
  children,
  className = "",
  threshold = 0.1,
  rootMargin = "100px",
  // Use a more descriptive fallback for better UX
  fallback = <div className="min-h-[200px] flex items-center justify-center text-muted-foreground/70 bg-muted/50 rounded-xl animate-pulse" aria-hidden="true">Loading content...</div>, 
}: LazyLoadProps) {
  const { elementRef, isIntersecting } = useIntersectionObserver({
    threshold,
    rootMargin,
    triggerOnce: true,
  })

  return (
    // Explicitly cast ref to match the expected element type (div)
    <div ref={elementRef as RefObject<HTMLDivElement>} className={className} aria-hidden={!isIntersecting}>
      {isIntersecting ? children : fallback}
    </div>
  )
}