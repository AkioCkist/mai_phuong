'use client'

import { useCallback, useEffect, useRef, useState, type PointerEvent } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight, ImageOff, X } from 'lucide-react'
import { categoryLabel, type EventItem } from '@/lib/content'
import { cn } from '@/lib/utils'
import { ContentMedia } from './content-media'

interface AlbumViewerProps {
  album: EventItem | null
  onClose: () => void
}

const pad = (value: number) => String(value).padStart(2, '0')

export function AlbumViewer({ album, onClose }: AlbumViewerProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const stripRef = useRef<HTMLOListElement>(null)
  const swipeStart = useRef<number | null>(null)
  const [index, setIndex] = useState(0)

  const photos = album?.photos ?? []
  const total = photos.length
  const photo = photos[index]

  const go = useCallback(
    (step: number) => {
      if (total < 2) return
      setIndex((current) => (current + step + total) % total)
    },
    [total],
  )

  // State is the source of truth: Esc (`cancel`) and the close button ask the parent to clear
  // the album, and the effect below closes the native dialog. `close` stays as a fallback.
  const onCloseRef = useRef(onClose)
  useEffect(() => {
    onCloseRef.current = onClose
  })
  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    const handleCancel = (event: Event) => {
      event.preventDefault()
      onCloseRef.current()
    }
    const handleClose = () => onCloseRef.current()
    dialog.addEventListener('cancel', handleCancel)
    dialog.addEventListener('close', handleClose)
    return () => {
      dialog.removeEventListener('cancel', handleCancel)
      dialog.removeEventListener('close', handleClose)
    }
  }, [])

  // open / close the native modal and lock page scroll while it is up
  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (album) {
      setIndex(0)
      if (!dialog.open) dialog.showModal()
      document.documentElement.style.overflow = 'hidden'
    } else if (dialog.open) {
      dialog.close()
    }
    return () => {
      document.documentElement.style.overflow = ''
    }
  }, [album])

  useEffect(() => {
    if (!album) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight') go(1)
      if (event.key === 'ArrowLeft') go(-1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [album, go])

  // keep the active thumbnail in view and warm up the neighbours
  useEffect(() => {
    if (!album || total === 0) return
    stripRef.current
      ?.querySelector<HTMLElement>('[aria-current="true"]')
      ?.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' })
    for (const step of [1, -1]) {
      const next = photos[(index + step + total) % total]
      if (next) new window.Image().src = next.src
    }
  }, [album, index, photos, total])

  function onPointerDown(event: PointerEvent) {
    swipeStart.current = event.clientX
  }

  function onPointerUp(event: PointerEvent) {
    if (swipeStart.current === null) return
    const delta = event.clientX - swipeStart.current
    swipeStart.current = null
    if (Math.abs(delta) > 50) go(delta < 0 ? 1 : -1)
  }

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="album-title"
      className="fixed inset-0 m-0 h-dvh max-h-none w-full max-w-none bg-ink/96 p-0 text-paper backdrop:bg-transparent open:flex open:animate-in open:fade-in open:duration-300"
    >
      {album && (
        <div className="mx-auto flex h-full w-full max-w-6xl flex-col px-4 pb-4 pt-[max(1rem,env(safe-area-inset-top))] sm:px-8 sm:pb-6">
          <header className="flex items-start justify-between gap-4 border-b border-paper/10 pb-4">
            <div className="min-w-0">
              <p className="label-mono text-paper/55">
                {categoryLabel[album.category]} · {album.year}
              </p>
              <h2 id="album-title" className="mt-1.5 text-pretty font-display text-xl font-semibold leading-snug sm:text-2xl">
                {album.title}
              </h2>
            </div>
            <div className="flex shrink-0 items-center gap-3">
              {total > 0 && (
                <p className="font-mono text-sm tabular-nums text-paper/70" aria-live="polite">
                  <span className="sr-only">Ảnh </span>
                  <span className="text-paper">{pad(index + 1)}</span> / {pad(total)}
                </p>
              )}
              <button
                type="button"
                onClick={onClose}
                className="inline-flex size-11 cursor-pointer items-center justify-center rounded-lg text-paper/80 transition-colors hover:bg-paper/10 hover:text-paper"
              >
                <X className="size-5" aria-hidden="true" />
                <span className="sr-only">Đóng album</span>
              </button>
            </div>
          </header>

          {photo ? (
            <>
              <figure className="relative flex min-h-0 flex-1 flex-col pt-4">
                <div
                  className="relative min-h-0 flex-1 touch-pan-y select-none"
                  onPointerDown={onPointerDown}
                  onPointerUp={onPointerUp}
                  onPointerCancel={() => (swipeStart.current = null)}
                >
                  <ContentMedia
                    key={photo.src}
                    media={{ ...photo, alt: photo.alt ?? `${album.title}, ảnh ${index + 1}` }}
                    controls={photo.type === 'video'}
                    sizes="(min-width: 1152px) 1152px, 100vw"
                    className="animate-in fade-in zoom-in-[0.98] object-contain duration-300"
                  />
                  {total > 1 && (
                    <>
                      <NavButton side="left" onClick={() => go(-1)} />
                      <NavButton side="right" onClick={() => go(1)} />
                    </>
                  )}
                </div>
                <figcaption className="min-h-6 pt-3 text-center text-sm text-paper/70">{photo.caption}</figcaption>
              </figure>

              {total > 1 && (
                <ol ref={stripRef} aria-label="Danh sách ảnh" className="mt-3 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:thin]">
                  {photos.map((item, itemIndex) => {
                    const active = itemIndex === index
                    return (
                      <li key={item.src} className="shrink-0">
                        <button
                          type="button"
                          aria-current={active ? 'true' : undefined}
                          onClick={() => setIndex(itemIndex)}
                          className={cn(
                            'relative block h-14 w-20 cursor-pointer overflow-hidden rounded-md transition-[opacity,box-shadow] duration-200 sm:h-16 sm:w-24',
                            active ? 'opacity-100 ring-2 ring-rose ring-offset-2 ring-offset-ink' : 'opacity-45 hover:opacity-80',
                          )}
                        >
                          <ContentMedia media={{ ...item, alt: '' }} sizes="96px" className="object-cover" />
                          <span className="sr-only">Xem ảnh {itemIndex + 1}</span>
                        </button>
                      </li>
                    )
                  })}
                </ol>
              )}
            </>
          ) : (
            <div className="flex flex-1 flex-col items-center justify-center gap-3 text-center">
              <ImageOff className="size-10 text-paper/40" strokeWidth={1.25} aria-hidden="true" />
              <p className="font-display text-lg">Ảnh của chương trình này đang được cập nhật.</p>
              <p className="max-w-[44ch] text-sm text-paper/60">
                {album.role}
                {album.org ? ` · ${album.org}` : ''}
              </p>
            </div>
          )}
        </div>
      )}
    </dialog>
  )
}

function NavButton({ side, onClick }: { side: 'left' | 'right'; onClick: () => void }) {
  const Icon = side === 'left' ? ChevronLeft : ChevronRight
  return (
    <button
      type="button"
      onClick={onClick}
      onPointerDown={(event) => event.stopPropagation()}
      className={cn(
        'absolute top-1/2 inline-flex size-12 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-ink/60 text-paper backdrop-blur-sm transition-[background-color,translate] duration-200 hover:bg-rose',
        side === 'left' ? 'left-0 hover:-translate-x-0.5 sm:-left-2' : 'right-0 hover:translate-x-0.5 sm:-right-2',
      )}
    >
      <Icon className="size-6" aria-hidden="true" />
      <span className="sr-only">{side === 'left' ? 'Ảnh trước' : 'Ảnh sau'}</span>
    </button>
  )
}
