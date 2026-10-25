import { useCallback, useEffect, useState } from 'react'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

const ANNOUNCEMENTS = [
  '✦ Free Shipping on Orders Above ₹999 ✦',
  '✦ Premium Quality Natural Mehndi ✦',
  '✦ 100% Organic Ingredients ✦',
  '✦ Handcrafted with Love in India ✦',
] as const

const ROTATE_INTERVAL_MS = 4000

export function AnnouncementBar() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isVisible, setIsVisible] = useState(true)
  const [isFading, setIsFading] = useState(false)

  const rotateMessage = useCallback(() => {
    setIsFading(true)
    const fadeTimer = setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % ANNOUNCEMENTS.length)
      setIsFading(false)
    }, 300)
    return fadeTimer
  }, [])

  useEffect(() => {
    if (!isVisible) return

    const interval = setInterval(() => {
      const fadeTimer = rotateMessage()
      return () => clearTimeout(fadeTimer)
    }, ROTATE_INTERVAL_MS)

    return () => clearInterval(interval)
  }, [isVisible, rotateMessage])

  if (!isVisible) return null

  return (
    <div
      className="bg-bottle-green relative z-50"
      role="region"
      aria-label="Store announcements"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-center px-4 py-2">
        <p
          className={cn(
            'text-center text-xs font-medium tracking-wide text-white transition-opacity duration-300 sm:text-sm',
            isFading ? 'opacity-0' : 'opacity-100'
          )}
          aria-live="polite"
          aria-atomic="true"
        >
          <span className="text-antique-gold">{ANNOUNCEMENTS[currentIndex]}</span>
        </p>

        <button
          type="button"
          onClick={() => setIsVisible(false)}
          className="absolute right-3 rounded-sm p-1 text-white/70 transition-colors hover:text-white focus-visible:ring-2 focus-visible:ring-white sm:right-4"
          aria-label="Close announcement bar"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  )
}
