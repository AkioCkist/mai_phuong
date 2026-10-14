import { cn } from '@/lib/utils'

interface SectionHeadingProps {
  label: string
  title: string
  description?: string
  className?: string
  as?: 'h2' | 'h3'
  id?: string
}

export function SectionHeading({ label, title, description, className, id, as: Tag = 'h2' }: SectionHeadingProps) {
  return (
    <header className={cn('flex flex-col gap-3', className)}>
      <p className="label-mono text-rose">{label}</p>
      <Tag
        id={id}
        className="font-display text-[clamp(2rem,5vw,3.25rem)] font-bold leading-[1.02] tracking-[-0.02em] text-ink [font-stretch:88%]"
      >
        {title}
      </Tag>
      {description && <p className="max-w-[52ch] text-pretty text-base leading-relaxed text-mauve">{description}</p>}
    </header>
  )
}
