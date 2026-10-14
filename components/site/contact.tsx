'use client'

import { useState } from 'react'
import { ArrowUpRight, Check, Copy } from 'lucide-react'
import type { ContactInfo, SectionCopy } from '@/lib/content'
import { cn } from '@/lib/utils'
import { SectionHeading } from './section-heading'

interface ContactRow {
  label: string
  value: string
  href: string
  external?: boolean
  copyValue?: string
}

export function Contact({ contacts, copy: sectionCopy }: { contacts: ContactInfo; copy: SectionCopy }) {
  const rows: ContactRow[] = [
    { label: 'WhatsApp', value: contacts.whatsappDisplay, href: contacts.whatsappLink, external: true, copyValue: contacts.whatsappDisplay },
    { label: 'Số điện thoại', value: contacts.phones.join(' · '), href: `tel:${contacts.phones[0] ?? ''}`, copyValue: contacts.phones[0] },
    { label: 'LinkedIn', value: 'LinkedIn', href: contacts.linkedin, external: true },
    { label: 'Facebook', value: 'Facebook', href: contacts.facebook, external: true },
  ]
  const [copied, setCopied] = useState<string | null>(null)

  async function copy(label: string, value: string) {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(label)
      window.setTimeout(() => setCopied((current) => (current === label ? null : current)), 2200)
    } catch {
      setCopied(null)
    }
  }

  function copyButton(label: string, value: string) {
    const isCopied = copied === label
    return (
      <button
        type="button"
        onClick={() => copy(label, value)}
        className={cn(
          'inline-flex min-h-10 shrink-0 cursor-pointer items-center gap-1.5 rounded-md px-3 text-sm font-semibold transition-colors duration-200',
          isCopied ? 'bg-butter text-ink' : 'text-mauve hover:bg-petal hover:text-ink',
        )}
      >
        {isCopied ? (
          <Check className="size-4 animate-pop" aria-hidden="true" />
        ) : (
          <Copy className="size-4" aria-hidden="true" />
        )}
        {isCopied ? 'Đã sao chép' : 'Sao chép'}
        <span className="sr-only"> {label}</span>
      </button>
    )
  }

  return (
    <div className="px-4 pb-28 pt-4 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          id="contact-title"
          label={sectionCopy.label}
          title={sectionCopy.title}
          description={sectionCopy.description}
        />

        <div className="mt-10 flex flex-wrap items-center gap-x-4 gap-y-2">
          <a
            href={`mailto:${contacts.email}`}
            className="group inline-flex min-w-0 items-center gap-2 break-all font-display text-[clamp(1.4rem,4.2vw,2.75rem)] font-bold tracking-[-0.02em] text-ink [font-stretch:88%]"
          >
            <span className="bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_2px] bg-left-bottom bg-no-repeat pb-1 transition-[background-size,color] duration-500 ease-out-soft group-hover:bg-[length:100%_2px] group-hover:text-rose">
              {contacts.email}
            </span>
          </a>
          {copyButton('Gmail', contacts.email)}
        </div>

        <ul className="mt-10 grid border-t border-line sm:grid-cols-2">
          {rows.map((row) => (
            <li
              key={row.label}
              className="flex items-center justify-between gap-3 border-b border-line py-3 sm:odd:border-r sm:odd:pr-6 sm:even:pl-6"
            >
              <a
                href={row.href}
                {...(row.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                className="group flex min-w-0 flex-1 items-center gap-3 py-1"
              >
                <span className="min-w-0">
                  <span className="label-mono block text-mauve">{row.label}</span>
                  <span className="mt-1 block break-words text-[15px] font-semibold text-ink transition-colors duration-200 group-hover:text-rose">
                    {row.value}
                  </span>
                </span>
                <ArrowUpRight
                  aria-hidden="true"
                  className="ml-auto size-4 shrink-0 text-mauve/60 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-rose"
                />
                {row.external && <span className="sr-only">(mở trong tab mới)</span>}
              </a>
              {row.copyValue && copyButton(row.label, row.copyValue)}
            </li>
          ))}
        </ul>

        <p role="status" aria-live="polite" className="sr-only">
          {copied ? `Đã sao chép ${copied}` : ''}
        </p>
      </div>
    </div>
  )
}
