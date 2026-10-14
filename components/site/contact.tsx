'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ArrowUpRight, Briefcase, Check, Copy, Mail, MessageCircle, Phone, Users, type LucideIcon } from 'lucide-react'
import { contacts } from '@/lib/content'
import { cn } from '@/lib/utils'
import { Reveal } from './reveal'
import { SectionHeading } from './section-heading'
import { Sparkle } from './sparkle'

interface ContactRow {
  label: string
  value: string
  icon: LucideIcon
  href: string
  external?: boolean
  copyValue?: string
}

const rows: ContactRow[] = [
  { label: 'Gmail', value: contacts.email, icon: Mail, href: `mailto:${contacts.email}`, copyValue: contacts.email },
  {
    label: 'WhatsApp',
    value: `${contacts.whatsappDisplay} – Mai Phương`,
    icon: MessageCircle,
    href: contacts.whatsappLink,
    external: true,
    copyValue: contacts.whatsappDisplay,
  },
  {
    label: 'Số điện thoại',
    value: contacts.phones.join(' · '),
    icon: Phone,
    href: `tel:${contacts.phones[0]}`,
    copyValue: contacts.phones[0],
  },
  { label: 'LinkedIn', value: 'Hồ Mai Phương', icon: Briefcase, href: contacts.linkedin, external: true },
  { label: 'Facebook', value: 'Mai Phương', icon: Users, href: contacts.facebook, external: true },
]

export function Contact() {
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

  return (
    <div className="px-5 pb-24 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          id="contact-title"
          index="06"
          label="Contact"
          description="Nếu bạn muốn cùng làm một điều gì đó, nhắn mình một tiếng nhé."
        />

        <div className="mt-10 grid items-center gap-8 lg:grid-cols-[1fr_340px]">
          <ul className="flex flex-col gap-3">
            {rows.map((row, index) => {
              const Icon = row.icon
              const isCopied = copied === row.label
              return (
                <li key={row.label}>
                  <Reveal delay={index * 60}>
                    <div className="group flex flex-wrap items-center gap-3 rounded-3xl bg-white p-3 pr-4 shadow-soft transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lift sm:flex-nowrap">
                      <a
                        href={row.href}
                        {...(row.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                        className="flex min-w-0 flex-1 items-center gap-4 rounded-2xl p-1"
                      >
                        <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-candy to-petal text-rose transition-transform duration-500 group-hover:rotate-6 group-hover:scale-105">
                          <Icon className="size-5" aria-hidden="true" />
                        </span>
                        <span className="min-w-0">
                          <span className="block text-xs font-bold uppercase tracking-wider text-rose">{row.label}</span>
                          <span className="block break-words text-[15px] font-semibold text-berry">{row.value}</span>
                        </span>
                        <ArrowUpRight
                          aria-hidden="true"
                          className="ml-auto size-4 shrink-0 text-candy transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-rose"
                        />
                        {row.external && <span className="sr-only">(mở trong tab mới)</span>}
                      </a>
                      {row.copyValue && (
                        <button
                          type="button"
                          onClick={() => copy(row.label, row.copyValue as string)}
                          className={cn(
                            'inline-flex min-h-11 cursor-pointer items-center gap-1.5 rounded-full px-4 text-sm font-bold transition-all duration-300',
                            isCopied ? 'bg-butter text-berry' : 'bg-petal text-rose hover:bg-candy',
                          )}
                        >
                          {isCopied ? (
                            <Check className="size-4 animate-pop" aria-hidden="true" />
                          ) : (
                            <Copy className="size-4" aria-hidden="true" />
                          )}
                          {isCopied ? 'Đã sao chép' : 'Sao chép'}
                          <span className="sr-only"> {row.label}</span>
                        </button>
                      )}
                    </div>
                  </Reveal>
                </li>
              )
            })}
          </ul>

          <Reveal delay={150} className="hidden lg:block">
            <div className="relative aspect-square overflow-hidden rounded-[3rem] bg-gradient-to-br from-candy via-bubblegum to-coral shadow-lift">
              <Image
                src="/images/mascot.png"
                alt="Nhân vật Calliope mỉm cười giữa những đám mây hồng"
                fill
                sizes="340px"
                className="object-cover object-[52%_50%] mix-blend-multiply"
              />
              <Sparkle className="right-8 top-8 size-7 text-white" />
              <Sparkle className="bottom-10 left-8 size-5 text-white" delay={1.1} />
            </div>
          </Reveal>
        </div>

        <p role="status" aria-live="polite" className="sr-only">
          {copied ? `Đã sao chép ${copied}` : ''}
        </p>
      </div>
    </div>
  )
}
