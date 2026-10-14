import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface RevealProps {
  children: ReactNode
  className?: string
}

/** Visible at rest; `.reveal` adds a scroll-driven lift where the browser supports it. */
export function Reveal({ children, className }: RevealProps) {
  return <div className={cn('reveal', className)}>{children}</div>
}
