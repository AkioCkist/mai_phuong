import { cn } from '@/lib/utils'
import { Reveal } from './reveal'

interface SectionHeadingProps {
  index?: string
  label: string
  description?: string
  className?: string
  as?: 'h2' | 'h3'
  id?: string
}

export function SectionHeading({ index, label, description, className, id, as: Tag = 'h2' }: SectionHeadingProps) {
  return (
    <Reveal className={cn('flex flex-col gap-3', className)}>
      <div className="flex flex-wrap items-center gap-3">
        {index && (
          <span aria-hidden="true" className="font-display text-2xl font-light text-rose font-soft">
            /{index}/
          </span>
        )}
        <Tag id={id} className="font-display font-soft inline-flex items-center rounded-full bg-gradient-to-r from-coral/90 via-bubblegum to-candy px-6 py-2 text-2xl font-light uppercase tracking-wide text-berry shadow-soft sm:text-3xl">
          {label}
        </Tag>
      </div>
      {description && <p className="max-w-xl text-pretty text-base leading-relaxed text-mauve">{description}</p>}
    </Reveal>
  )
}
