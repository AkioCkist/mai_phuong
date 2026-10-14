'use client'

import { useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'

const majors = Array.from({ length: 11 }, (_, index) => index * 10)

function Rail({ side, setRef }: { side: 'left' | 'right'; setRef: (node: HTMLDivElement | null) => void }) {
  const isLeft = side === 'left'
  return (
    <div
      ref={setRef}
      className={cn(
        'fixed bottom-8 top-22 w-12 [--p:0]',
        isLeft ? 'left-3 2xl:left-6' : 'right-3 2xl:right-6',
      )}
    >
      {/* minor ticks every 2% */}
      <div
        className={cn(
          'absolute inset-y-0 w-2 bg-[repeating-linear-gradient(to_bottom,var(--color-line)_0_1px,transparent_1px_2%)]',
          isLeft ? 'left-0' : 'right-0',
        )}
      />
      {/* spine + progress fill */}
      <div className={cn('absolute inset-y-0 w-px bg-line', isLeft ? 'left-0' : 'right-0')} />
      <div
        className={cn(
          'absolute inset-x-auto top-0 h-full w-px origin-top scale-y-[var(--p)] bg-rose',
          isLeft ? 'left-0' : 'right-0',
        )}
      />

      {majors.map((value) => (
        <div
          key={value}
          style={{ top: `${value}%` }}
          className={cn('absolute flex -translate-y-1/2 items-center gap-1.5', isLeft ? 'left-0' : 'right-0 flex-row-reverse')}
        >
          <span className="h-px w-3.5 bg-mauve/50" />
          <span className="font-mono text-[10px] leading-none tabular-nums text-mauve/70">{value}</span>
        </div>
      ))}

      {/* live marker */}
      <div
        className={cn(
          'absolute top-[calc(var(--p)*100%)] flex -translate-y-1/2 items-center',
          isLeft ? 'left-0' : 'right-0 flex-row-reverse',
        )}
      >
        <span className="h-0.5 w-5 bg-rose" />
        <span
          data-ruler-label
          className="rounded-sm bg-rose px-1.5 py-0.5 font-mono text-[10px] font-medium leading-none tabular-nums text-paper"
        >
          0%
        </span>
      </div>
    </div>
  )
}

/** Fixed rulers in the side gutters that track how far down the page the reader is. */
export function ScrollRuler() {
  const rails = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    let frame = 0
    const update = () => {
      frame = 0
      const max = document.documentElement.scrollHeight - window.innerHeight
      const progress = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0
      const label = `${Math.round(progress * 100)}%`
      rails.current.forEach((rail) => {
        if (!rail) return
        rail.style.setProperty('--p', progress.toFixed(4))
        const text = rail.querySelector('[data-ruler-label]')
        if (text) text.textContent = label
      })
    }
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
    }
  }, [])

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-40 hidden xl:block">
      <Rail side="left" setRef={(node) => (rails.current[0] = node)} />
      <Rail side="right" setRef={(node) => (rails.current[1] = node)} />
    </div>
  )
}
