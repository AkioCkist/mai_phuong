import Image from 'next/image'
import { ArrowDown, ArrowUpRight } from 'lucide-react'
import { events, profile } from '@/lib/content'

const current = events.find((event) => event.current)

export function Hero() {
  return (
    <section id="home" className="px-4 pb-20 pt-24 sm:px-8 sm:pt-28">
      <div className="mx-auto max-w-6xl">
        <div className="label-mono flex flex-wrap justify-between gap-x-6 gap-y-1 text-mauve">
          <span>Portfolio · 2026</span>
          <span>Event · Truyền thông · HR Admin</span>
        </div>

        <h1 className="mt-6 font-display font-extrabold leading-[0.88] tracking-[-0.035em] text-ink [font-stretch:80%] sm:mt-8">
          <span className="block pb-[0.06em] pt-[0.1em] [overflow-y:clip]">
            <span className="block animate-rise text-[clamp(3.25rem,12.5vw,10rem)]">{profile.name}</span>
          </span>
          <span className="block pb-[0.1em] [overflow-y:clip]">
            <span className="block animate-rise text-[clamp(1.75rem,5vw,3.5rem)] font-semibold tracking-[-0.02em] text-rose [animation-delay:120ms]">
              hay còn gọi là {profile.nickname}
            </span>
          </span>
        </h1>

        <div className="mt-10 grid items-end gap-10 lg:mt-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:gap-14">
          <div className="animate-in fade-in slide-in-from-bottom-2 order-2 fill-mode-backwards duration-700 [animation-delay:300ms] lg:order-1">
            <p className="max-w-[56ch] text-pretty text-[17px] leading-[1.75] text-ink/85">{profile.overview}</p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a
                href="#about"
                className="group inline-flex min-h-12 items-center gap-2 rounded-lg bg-ink px-5 text-sm font-semibold text-paper transition-colors duration-200 hover:bg-rose"
              >
                Xem hành trình của mình
                <ArrowDown className="size-4 transition-transform duration-300 group-hover:translate-y-0.5" />
              </a>
              <a
                href="#contact"
                className="group inline-flex min-h-12 items-center gap-2 rounded-lg border border-ink/15 px-5 text-sm font-semibold text-ink transition-colors duration-200 hover:border-rose hover:text-rose"
              >
                Nhắn mình nhé
                <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </a>
            </div>
          </div>

          <figure className="relative order-1 animate-settle [animation-delay:200ms] lg:order-2">
            <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-[#f9ecdf]">
              <Image
                src="/images/mascot.png"
                alt="Calliope, nhân vật hoạt hình đeo kính tròn, ôm thanh phô mai que hồng giữa những đám mây"
                fill
                priority
                sizes="(min-width: 1024px) 620px, 100vw"
                className="object-cover"
              />
            </div>
            <Image
              src="/images/dice-cutout.png"
              alt=""
              aria-hidden="true"
              width={160}
              height={160}
              className="absolute -right-3 -top-8 size-20 rotate-12 object-contain drop-shadow-[0_12px_16px_rgba(46,21,32,0.18)] transition-transform duration-500 ease-out-soft hover:-rotate-6 sm:-right-6 sm:-top-10 sm:size-28"
            />
            {current && (
              <figcaption className="absolute -bottom-5 left-4 flex max-w-[calc(100%-2rem)] items-center gap-3 rounded-lg border border-line bg-sheet px-4 py-2.5 shadow-[0_10px_30px_-18px_rgba(46,21,32,0.5)] sm:left-6">
                <span aria-hidden="true" className="relative flex size-2 shrink-0">
                  <span className="absolute inset-0 animate-ping rounded-full bg-rose/50" />
                  <span className="relative size-2 rounded-full bg-rose" />
                </span>
                <span className="min-w-0">
                  <span className="label-mono block text-mauve">Đang làm</span>
                  <span className="block text-pretty text-sm font-semibold leading-snug text-ink">
                    {current.role} · {current.title}
                  </span>
                </span>
              </figcaption>
            )}
          </figure>
        </div>
      </div>
    </section>
  )
}
