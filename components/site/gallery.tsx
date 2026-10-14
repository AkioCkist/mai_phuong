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
import { categoryLabel, events, type EventCategory, type EventItem } from '@/lib/content'
import { cn } from '@/lib/utils'
import { AlbumViewer } from './album-viewer'
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
  const [openAlbum, setOpenAlbum] = useState<EventItem | null>(null)
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

        <ul key={filter} className="mt-12 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((event, index) => {
            const Icon = categoryIcon[event.category]
            const cover = event.cover ?? event.photos?.[0]?.src
            const count = event.photos?.length ?? 0
            return (
              <li
                key={event.id}
                style={{ animationDelay: `${Math.min(index, 8) * 40}ms` }}
                className="animate-in fade-in slide-in-from-bottom-2 fill-mode-backwards duration-500"
              >
                <article className="group relative">
                  {/* album: two loose prints behind the cover fan out on hover */}
                  <div className="relative aspect-[4/3]">
                    <span
                      aria-hidden="true"
                      className="absolute inset-0 rotate-[-4deg] rounded-xl border border-line bg-sheet transition-transform duration-500 ease-out-soft group-hover:-translate-x-2 group-hover:rotate-[-8deg]"
                    />
                    <span
                      aria-hidden="true"
                      className="absolute inset-0 rotate-[3deg] rounded-xl border border-line bg-petal transition-transform duration-500 ease-out-soft group-hover:translate-x-2 group-hover:rotate-[7deg]"
                    />
                    <div className="absolute inset-0 flex items-center justify-center overflow-hidden rounded-xl border-4 border-sheet bg-petal shadow-[0_14px_30px_-18px_rgba(46,21,32,0.45)] transition-transform duration-500 ease-out-soft group-hover:-translate-y-1.5">
                      {cover ? (
                        <Image
                          src={cover}
                          alt=""
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
                      <span className="label-mono absolute bottom-3 right-3 rounded-md bg-ink/80 px-2 py-1 text-paper">
                        {count > 0 ? `${count} ảnh` : 'Sắp có ảnh'}
                      </span>
                    </div>
                  </div>

                  <div className="pt-5">
                    <p className="label-mono text-rose">{categoryLabel[event.category]}</p>
                    <h3 className="mt-2 text-pretty font-display text-lg font-semibold leading-snug text-ink transition-colors duration-200 group-hover:text-rose">
                      {/* the button covers the whole card so the album opens from anywhere on it */}
                      <button
                        type="button"
                        onClick={() => setOpenAlbum(event)}
                        className="cursor-pointer text-left after:absolute after:inset-0 after:rounded-xl focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:outline-offset-8 focus-visible:after:outline-rose"
                      >
                        {event.title}
                        <span className="sr-only"> · mở album</span>
                      </button>
                    </h3>
                    <p className="mt-1.5 text-sm text-ink/75">{event.role}</p>
                    {event.org && <p className="mt-0.5 text-sm text-mauve">{event.org}</p>}
                  </div>
                </article>
              </li>
            )
          })}
        </ul>

        <AlbumViewer album={openAlbum} onClose={() => setOpenAlbum(null)} />
      </div>
    </div>
  )
}
