'use client'

import { useEffect, useRef, type ReactNode } from 'react'

interface StickyBounceProps {
  children: ReactNode
  className?: string
  /** Breakpoint where the aside is sticky; below it nothing is observed. */
  media?: string
}

/**
 * Sticky aside that bounces once when its sticky run ends (the parent grid's
 * bottom pushes it up). One IntersectionObserver on the parent, no scroll
 * listener; the bounce is a transform-only CSS animation on an inner wrapper.
 */
export function StickyBounce({ children, className, media = '(min-width: 1024px)' }: StickyBounceProps) {
  const asideRef = useRef<HTMLElement>(null)
  const innerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const aside = asideRef.current
    const inner = innerRef.current
    const track = aside?.parentElement
    if (!aside || !inner || !track) return

    const wide = window.matchMedia(media)
    const calm = window.matchMedia('(prefers-reduced-motion: reduce)')
    let observer: IntersectionObserver | null = null
    let wasStuck = false

    const bounce = () => {
      if (calm.matches) return
      inner.classList.remove('animate-land')
      // restart the animation if it is still running
      void inner.offsetWidth
      inner.classList.add('animate-land')
    }

    const connect = () => {
      observer?.disconnect()
      observer = null
      if (!wide.matches) return

      // The sticky run ends when the track's bottom passes the aside's bottom edge.
      const stickyTop = parseFloat(getComputedStyle(aside).top) || 0
      const edge = Math.round(stickyTop + aside.offsetHeight)
      observer = new IntersectionObserver(
        ([entry]) => {
          const stuck = entry.isIntersecting
          if (wasStuck && !stuck && entry.boundingClientRect.bottom <= edge + 1) bounce()
          wasStuck = stuck
        },
        { rootMargin: `-${edge}px 0px 0px 0px` },
      )
      observer.observe(track)
    }

    const onAnimationEnd = () => inner.classList.remove('animate-land')
    inner.addEventListener('animationend', onAnimationEnd)

    const resize = new ResizeObserver(connect)
    resize.observe(aside)
    wide.addEventListener('change', connect)
    connect()

    return () => {
      observer?.disconnect()
      resize.disconnect()
      wide.removeEventListener('change', connect)
      inner.removeEventListener('animationend', onAnimationEnd)
    }
  }, [media])

  return (
    <aside ref={asideRef} className={className}>
      <div ref={innerRef} className="origin-bottom">
        {children}
      </div>
    </aside>
  )
}
