'use client'

import { useEffect, useState } from 'react'
import { Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'

const links = [
  { id: 'home', label: 'Home' },
  { id: 'highlights', label: 'Events' },
  { id: 'about', label: 'About' },
  { id: 'gallery', label: 'Gallery' },
  { id: 'contact', label: 'Contact' },
]

export function SiteNav() {
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
    <header className="fixed inset-x-0 top-3 z-50 flex justify-center px-3 sm:top-5">
      <nav
        aria-label="Điều hướng chính"
        className="flex items-center gap-1 rounded-full border border-white/70 bg-white/70 p-1.5 shadow-soft backdrop-blur-md"
      >
        <a
          href="#home"
          className="hidden items-center gap-1.5 rounded-full px-4 py-2 font-display text-lg font-soft text-rose transition-colors hover:text-berry sm:flex"
        >
          <Sparkles className="size-4 text-coral" aria-hidden="true" />
          Calliope
        </a>
        <ul className="flex items-center gap-0.5">
          {links.map((link) => {
            const isActive = active === link.id
            return (
              <li key={link.id}>
                <a
                  href={`#${link.id}`}
                  aria-current={isActive ? 'true' : undefined}
                  className={cn(
                    'relative inline-flex min-h-10 items-center rounded-full px-3.5 text-sm font-semibold transition-all duration-300 sm:px-4',
                    isActive
                      ? 'bg-gradient-to-r from-bubblegum to-coral text-berry shadow-soft'
                      : 'text-mauve hover:bg-petal hover:text-berry',
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
