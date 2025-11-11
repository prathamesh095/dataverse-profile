"use client"

import { useState, useCallback } from "react"
import { OptimizedImage } from "./performance-optimized-image"

interface ImageGalleryProps {
  images: Array<{
    src: string
    alt: string
    width?: number
    height?: number
  }>
  className?: string
}

export function ImageGallery({ images, className = "" }: ImageGalleryProps) {
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set())

  const handleImageLoad = useCallback((index: number) => {
    setLoadedImages((prev) => new Set(prev).add(index))
  }, [])

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ${className}`}>
      {images.map((image, index) => (
        <div key={index} className="relative overflow-hidden rounded-lg">
          <OptimizedImage
            src={image.src}
            alt={image.alt}
            width={image.width}
            height={image.height}
            className="w-full h-48 object-cover transition-transform duration-300 hover:scale-105"
            priority={index < 3} // Prioritize first 3 images
          />
          {!loadedImages.has(index) && <div className="absolute inset-0 bg-muted animate-pulse" />}
        </div>
      ))}
    </div>
  )
}

// Preload critical images
export function preloadImage(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve()
    img.onerror = reject
    img.src = src
  })
}

// Preload multiple images
export async function preloadImages(srcs: string[]): Promise<void> {
  await Promise.all(srcs.map(preloadImage))
}
