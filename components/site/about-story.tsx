import Image from 'next/image'
import { Sparkles } from 'lucide-react'
import { goals, stats, storyChapters } from '@/lib/content'
import { Reveal } from './reveal'
import { SectionHeading } from './section-heading'
import { Sparkle } from './sparkle'

export function AboutStory() {
  return (
    <div className="px-5 pb-24 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          id="about-title"
          index="02"
          label="My self"
          description="Mình chưa bao giờ giỏi giới thiệu bản thân, nên mình kể bằng cách này."
        />

        <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,340px)_1fr] lg:gap-14">
          <aside className="lg:sticky lg:top-28 lg:self-start">
            <Reveal>
              <div className="relative mx-auto max-w-sm">
                <div className="relative aspect-[3/4] overflow-hidden rounded-t-full rounded-b-[2rem] bg-gradient-to-b from-candy to-petal shadow-lift">
                  <Image
                    src="/images/mascot.png"
                    alt="Nhân vật Calliope đang ôm thanh phô mai que hồng"
                    fill
                    sizes="(min-width: 1024px) 340px, 90vw"
                    className="object-cover object-[52%_50%] mix-blend-multiply transition-transform duration-700 hover:scale-105"
                  />
                </div>
                <Sparkle className="-right-3 top-10 size-8 text-coral" />
                <Sparkle className="-left-4 bottom-24 size-6 text-bubblegum" delay={1.3} />
              </div>

              <dl className="mx-auto mt-6 grid max-w-sm grid-cols-3 gap-2 text-center">
                {stats.map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-2xl bg-white px-2 py-3 shadow-soft transition-transform duration-300 hover:-translate-y-1"
                  >
                    <dt className="sr-only">{stat.label}</dt>
                    <dd className="font-display text-2xl font-medium text-rose font-soft">{stat.value}</dd>
                    <p aria-hidden="true" className="mt-0.5 text-[11px] font-semibold leading-tight text-mauve">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </dl>
            </Reveal>
          </aside>

          <div className="flex flex-col gap-8">
            {storyChapters.map((chapter, index) => (
              <Reveal key={chapter.label} delay={index % 2 === 0 ? 0 : 80}>
                <article className="group rounded-3xl border border-petal bg-white/80 p-6 shadow-soft transition-all duration-500 hover:border-candy hover:shadow-lift sm:p-8">
                  <p className="mb-3 inline-flex items-center gap-2 rounded-full bg-petal px-3 py-1 text-xs font-bold uppercase tracking-widest text-rose">
                    <Sparkles className="size-3" aria-hidden="true" />
                    {chapter.label}
                  </p>
                  <p className="text-pretty text-base leading-[1.85] text-berry sm:text-[17px]">{chapter.text}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>

        <div className="mt-16 grid gap-5 md:grid-cols-2">
          {goals.map((goal, index) => (
            <Reveal key={goal.horizon} delay={index * 120}>
              <article className="relative h-full overflow-hidden rounded-[2rem] bg-gradient-to-br from-petal via-candy/70 to-bubblegum/60 p-7 shadow-soft transition-all duration-500 hover:-translate-y-1 hover:shadow-lift sm:p-9">
                <Sparkle className="right-6 top-6 size-6 text-white" delay={index * 0.8} />
                <p className="font-display text-lg font-soft text-rose">/{goal.horizon}/</p>
                <h3 className="mt-2 text-balance font-display text-2xl font-medium leading-snug text-berry font-soft">
                  {goal.role}
                </h3>
                <p className="mt-4 text-pretty text-[15px] leading-relaxed text-berry/90">{goal.text}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  )
}
