'use client'

import { useState } from 'react'
import Image from 'next/image'
import {
  CalendarHeart,
  Clapperboard,
  HeartHandshake,
  Megaphone,
  Newspaper,
  Package,
  type LucideIcon,
} from 'lucide-react'
import { categoryLabel, events, type EventCategory } from '@/lib/content'
import { cn } from '@/lib/utils'
import { SectionHeading } from './section-heading'

const categoryIcon: Record<EventCategory, LucideIcon> = {
  media: Megaphone,
  logistics: Package,
  organizer: CalendarHeart,
  backstage: Clapperboard,
  mentor: Newspaper,
  volunteer: HeartHandshake,
  intern: CalendarHeart,
}

const galleryEvents = events.filter((event) => event.inGallery)
const filters = ['all', 2026, 2025, 2024] as const
type Filter = (typeof filters)[number]

export function Gallery() {
  const [filter, setFilter] = useState<Filter>('all')
  const visible = galleryEvents.filter((event) => filter === 'all' || event.year === filter)

  return (
    <div className="px-4 py-24 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading
            id="gallery-title"
            label="Gallery"
            title="Những chương trình đã làm"
            description="Những chương trình mình đã cùng làm, theo từng năm."
          />

          <div role="group" aria-label="Lọc theo năm" className="flex flex-wrap gap-1 rounded-lg border border-line bg-sheet p-1">
            {filters.map((item) => {
              const count =
                item === 'all' ? galleryEvents.length : galleryEvents.filter((event) => event.year === item).length
              const selected = filter === item
              return (
                <button
                  key={item}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => setFilter(item)}
                  className={cn(
                    'inline-flex min-h-10 cursor-pointer items-center gap-2 rounded-md px-3.5 text-sm font-semibold transition-colors duration-200',
                    selected ? 'bg-ink text-paper' : 'text-mauve hover:bg-petal hover:text-ink',
                  )}
                >
                  {item === 'all' ? 'Tất cả' : item}
                  <span className={cn('font-mono text-xs tabular-nums', selected ? 'text-paper/60' : 'text-mauve/70')}>
                    {count}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
        <p role="status" aria-live="polite" className="sr-only">
          Đang hiển thị {visible.length} chương trình
        </p>

        <ul key={filter} className="mt-10 grid gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((event, index) => {
            const Icon = categoryIcon[event.category]
            return (
              <li
                key={event.id}
                style={{ animationDelay: `${Math.min(index, 8) * 40}ms` }}
                className="animate-in fade-in slide-in-from-bottom-2 fill-mode-backwards duration-500"
              >
                <article className="group">
                  <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-xl bg-petal">
                    {event.image ? (
                      <Image
                        src={event.image}
                        alt={`Hình ảnh ${event.title}`}
                        fill
                        sizes="(min-width: 1024px) 360px, (min-width: 640px) 50vw, 100vw"
                        className="object-cover transition-transform duration-700 ease-out-soft group-hover:scale-[1.04]"
                      />
                    ) : (
                      <Icon
                        aria-hidden="true"
                        strokeWidth={1.25}
                        className="size-14 text-rose/70 transition-transform duration-500 ease-out-soft group-hover:-rotate-6 group-hover:scale-110"
                      />
                    )}
                    <span className="label-mono absolute left-3 top-3 rounded-md bg-sheet/90 px-2 py-1 text-ink">
                      {event.year}
                    </span>
                  </div>

                  <div className="pt-4">
                    <p className="label-mono text-rose">{categoryLabel[event.category]}</p>
                    <h3 className="mt-2 text-pretty font-display text-lg font-semibold leading-snug text-ink">
                      {event.title}
                    </h3>
                    <p className="mt-1.5 text-sm text-ink/75">{event.role}</p>
                    {event.org && <p className="mt-0.5 text-sm text-mauve">{event.org}</p>}
                  </div>
                </article>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}
