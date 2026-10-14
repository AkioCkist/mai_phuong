import { cn } from '@/lib/utils'

interface SparkleProps {
  className?: string
  delay?: number
  twinkle?: boolean
}

export function Sparkle({ className, delay = 0, twinkle = true }: SparkleProps) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      style={{ animationDelay: `${delay}s` }}
      className={cn('pointer-events-none absolute fill-current', twinkle && 'animate-twinkle', className)}
    >
      <path d="M12 0C12.8 7 17 11.2 24 12C17 12.8 12.8 17 12 24C11.2 17 7 12.8 0 12C7 11.2 11.2 7 12 0Z" />
    </svg>
  )
}
