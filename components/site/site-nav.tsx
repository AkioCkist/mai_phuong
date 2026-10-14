'use client'

import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import type { SiteCopy } from '@/lib/content'

export function SiteNav({ copy }: { copy: SiteCopy }) {
  const links = [
    { id: 'home', label: copy.navHome },
    { id: 'highlights', label: copy.navEvents },
    { id: 'about', label: copy.navAbout },
    { id: 'gallery', label: copy.navGallery },
    { id: 'contact', label: copy.navContact },
  ]
  const [active, setActive] = useState('home')

  useEffect(() => {
    const sections = links
      .map((link) => document.getElementById(link.id))
      .filter((node): node is HTMLElement => node !== null)

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id)
        })
      },
      { rootMargin: '-40% 0px -55% 0px' },
    )
    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [])

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-line/70 bg-paper/85 backdrop-blur-md">
      <nav
        aria-label="Điều hướng chính"
        className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4 sm:px-8"
      >
        <a
          href="#home"
          className="hidden font-display text-lg font-bold tracking-tight text-ink transition-colors hover:text-rose sm:block"
        >
          {copy.navBrand}
        </a>
        <ul className="flex w-full items-center justify-between gap-1 sm:w-auto sm:justify-end sm:gap-2">
          {links.map((link) => {
            const isActive = active === link.id
            return (
              <li key={link.id}>
                <a
                  href={`#${link.id}`}
                  aria-current={isActive ? 'true' : undefined}
                  className={cn(
                    'label-mono relative inline-flex min-h-11 items-center px-2 transition-colors duration-200 sm:px-3',
                    'after:absolute after:inset-x-2 after:bottom-2.5 after:h-px after:origin-left after:bg-rose after:transition-transform after:duration-300 after:ease-out-soft sm:after:inset-x-3',
                    isActive ? 'text-rose after:scale-x-100' : 'text-mauve after:scale-x-0 hover:text-ink',
                  )}
                >
                  {link.label}
                </a>
              </li>
            )
          })}
        </ul>
      </nav>
    </header>
  )
}
