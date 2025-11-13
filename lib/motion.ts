import { cubicBezier } from "framer-motion"

/**
 * Global easing curve for smooth, natural animations.
 * Matches your portfolio’s premium motion design.
 */
export const EASE = cubicBezier(0.22, 1, 0.36, 1)

/**
 * Fade + upward slide for entering elements.
 * Commonly used for section titles, text, and content.
 */
export const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: EASE },
  },
}

/**
 * Scale-in animation for cards, grids, or images.
 * Optionally provide a `delay` for staggered entrance.
 */
export const scaleIn = (delay = 0) => ({
  initial: { opacity: 0, scale: 0.95 },
  animate: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: EASE, delay },
  },
})

/**
 * Horizontal slide-in motion.
 * Ideal for feature lists, process steps, or timelines.
 */
export const slideInX = (x = -20, delay = 0) => ({
  initial: { opacity: 0, x },
  animate: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, ease: EASE, delay },
  },
})

/**
 * Fade-only animation for subtle entrances.
 * Useful for paragraphs, icons, or background reveals.
 */
export const fadeIn = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: { duration: 0.5, ease: EASE },
  },
}

/**
 * Utility: Staggered transition for parent/children elements.
 * Add to parent motion div with `variants={staggerChildren(0.1)}`
 */
export const staggerChildren = (stagger = 0.1) => ({
  animate: {
    transition: { staggerChildren: stagger },
  },
})
