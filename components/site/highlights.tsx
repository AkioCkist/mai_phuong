import Image from 'next/image'
import { highlights } from '@/lib/content'
import { Reveal } from './reveal'
import { SectionHeading } from './section-heading'
import { Sparkle } from './sparkle'

export function Highlights() {
  return (
    <section id="highlights" aria-labelledby="highlights-title" className="scroll-mt-20 px-5 pb-24 pt-6 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          id="highlights-title"
          index="01"
          label="Các sự kiện nổi bật"
          description="Sáu dấu mốc mình nhớ nhất, từ sự kiện đầu tiên đến mùa Trung thu năm nay."
        />

        <Reveal delay={100} className="mt-8">
          <div className="relative rounded-[2.5rem] bg-[linear-gradient(135deg,#ffd9e1_0%,#f7a1b6_45%,#f2808a_100%)] p-4 shadow-lift sm:p-8">
            <Sparkle className="right-8 top-6 size-6 text-white" />
            <Sparkle className="bottom-10 left-6 size-5 text-white" delay={1.4} />
            <div aria-hidden="true" className="pointer-events-none absolute -top-8 right-0 size-24 animate-float opacity-90 sm:-right-6 sm:-top-6 sm:size-40">
              <Image
                src="/images/dice-cutout.png"
                alt=""
                fill
                sizes="160px"
                className="object-contain drop-shadow-[0_14px_18px_rgba(214,86,120,0.3)]"
              />
            </div>

            <ol className="relative grid gap-4 sm:grid-cols-2 sm:gap-5">
              {highlights.map((item, index) => (
                <li key={item.title}>
                  <article className="group h-full rounded-3xl bg-white/75 p-5 backdrop-blur-sm transition-all duration-500 hover:-translate-y-1 hover:bg-white/95 hover:shadow-lift sm:p-6">
                    <div className="flex items-baseline gap-3">
                      <span
                        aria-hidden="true"
                        className="font-display text-4xl font-light text-rose font-soft transition-transform duration-500 group-hover:translate-x-1 sm:text-5xl"
                      >
                        /{String(index + 1).padStart(2, '0')}/
                      </span>
                      <span className="text-xs font-bold uppercase tracking-wider text-mauve">{item.meta}</span>
                    </div>
                    <h3 className="mt-3 text-balance font-display text-xl font-medium leading-snug text-berry font-soft">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-pretty text-[15px] leading-relaxed text-berry/85">{item.text}</p>
                  </article>
                </li>
              ))}
            </ol>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
