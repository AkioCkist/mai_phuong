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
import { Reveal } from './reveal'
import { SectionHeading } from './section-heading'
import { Sparkle } from './sparkle'

const categoryIcon: Record<EventCategory, LucideIcon> = {
  media: Megaphone,
  logistics: Package,
  organizer: CalendarHeart,
  backstage: Clapperboard,
  mentor: Newspaper,
  volunteer: HeartHandshake,
  intern: CalendarHeart,
}

const coverTones = [
  'from-[#ffd6df] to-[#fff1d6]',
  'from-[#ffc9d6] to-[#ffe3ea]',
  'from-[#fbd0de] to-[#fff8f1]',
  'from-[#ffe3ea] to-[#ffc2d1]',
]

const galleryEvents = events.filter((event) => event.inGallery)
const filters = ['all', 2024, 2025, 2026] as const
type Filter = (typeof filters)[number]

export function Gallery() {
  const [filter, setFilter] = useState<Filter>('all')
  const visible = galleryEvents.filter((event) => filter === 'all' || event.year === filter)

  return (
    <div className="px-5 pb-24 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          id="gallery-title"
          index="05"
          label="Gallery"
          description="Những chương trình mình đã cùng làm, theo từng năm."
        />

        <Reveal delay={80} className="mt-8">
          <div role="group" aria-label="Lọc theo năm" className="flex flex-wrap gap-2">
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
                    'inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full px-5 text-sm font-bold transition-all duration-300',
                    selected
                      ? 'bg-rose text-white shadow-soft'
                      : 'border border-candy bg-white text-rose hover:-translate-y-0.5 hover:bg-petal',
                  )}
                >
                  {item === 'all' ? 'Tất cả' : item}
                  <span
                    className={cn(
                      'rounded-full px-2 py-0.5 text-xs',
                      selected ? 'bg-white/25 text-white' : 'bg-petal text-rose',
                    )}
                  >
                    {count}
                  </span>
                </button>
              )
            })}
          </div>
          <p role="status" aria-live="polite" className="sr-only">
            Đang hiển thị {visible.length} chương trình
          </p>
        </Reveal>

        <ul key={filter} className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((event, index) => {
            const Icon = categoryIcon[event.category]
            return (
              <li
                key={event.id}
                style={{ animationDelay: `${Math.min(index, 8) * 50}ms`, animationFillMode: 'backwards' }}
                className="animate-in fade-in slide-in-from-bottom-3 duration-700"
              >
                <article className="group h-full rounded-[2rem] bg-white p-3 shadow-soft transition-all duration-500 hover:-translate-y-1.5 hover:rotate-[-0.6deg] hover:shadow-lift">
                  <div
                    className={cn(
                      'relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-3xl bg-gradient-to-br',
                      coverTones[index % coverTones.length],
                    )}
                  >
                    {event.image ? (
                      <Image
                        src={event.image}
                        alt={`Hình ảnh ${event.title}`}
                        fill
                        sizes="(min-width: 1024px) 360px, (min-width: 640px) 50vw, 100vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <>
                        <Sparkle className="left-5 top-5 size-5 text-white" delay={index * 0.3} />
                        <Sparkle className="bottom-6 right-8 size-7 text-coral" delay={index * 0.3 + 1} />
                        <span className="flex size-20 items-center justify-center rounded-full bg-white/70 text-rose shadow-soft backdrop-blur-sm transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6">
                          <Icon className="size-8" aria-hidden="true" />
                        </span>
                      </>
                    )}
                    <span className="absolute left-3 top-3 rounded-full bg-white/85 px-3 py-1 text-xs font-bold text-rose backdrop-blur-sm">
                      {event.year}
                    </span>
                  </div>

                  <div className="px-3 pb-3 pt-4">
                    <p className="text-xs font-bold uppercase tracking-wider text-rose">
                      {categoryLabel[event.category]}
                    </p>
                    <h3 className="mt-1 text-pretty font-display text-lg font-medium leading-snug text-berry font-soft">
                      {event.title}
                    </h3>
                    <p className="mt-2 text-sm font-semibold text-berry/80">{event.role}</p>
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
